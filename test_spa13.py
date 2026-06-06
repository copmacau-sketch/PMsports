#!/usr/bin/env python3
"""Hook console + intercept JS errors during SPA init"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

INIT = r"""
(function(){
    if (window.__hooked) return;
    window.__hooked = true;
    window.__errs = [];
    
    var origErr = console.error;
    console.error = function(){
        try {
            window.__errs.push('[CERR] ' + Array.from(arguments).map(function(a){return String(a);}).join(' '));
            localStorage.setItem('__errs', JSON.stringify(window.__errs));
        } catch(e){}
        return origErr.apply(this, arguments);
    };
    
    window.addEventListener('error', function(e){
        try {
            window.__errs.push('[ERR] ' + e.message + ' @ ' + (e.filename||'?') + ':' + (e.lineno||0));
            localStorage.setItem('__errs', JSON.stringify(window.__errs));
        } catch(_){}
    }, true);
    
    window.addEventListener('unhandledrejection', function(e){
        try {
            window.__errs.push('[REJ] ' + e.reason);
            localStorage.setItem('__errs', JSON.stringify(window.__errs));
        } catch(_){}
    });
})();
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context()
    ctx.add_init_script(INIT)
    page = ctx.new_page()

    page_errors = []
    page.on("pageerror", lambda e: page_errors.append(str(e)[:500]))
    page.on("console", lambda m: None)  # suppress

    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")

    page.wait_for_timeout(20000)

    print("=== Page errors via Playwright ===")
    for e in page_errors:
        print(f"  {e}")

    print("\n=== console.error / window.error stash ===")
    try:
        errs = page.evaluate("localStorage.getItem('__errs')")
        if errs:
            import json
            for item in json.loads(errs):
                print(f"  {item}")
    except Exception as e:
        print(f"  (cannot read: {e})")

    # Check global state
    state = page.evaluate("""() => ({
        bodyFrame: typeof window.bodyFrame,
        top_bodyFrame: typeof top.bodyFrame,
        homeFrame: typeof window.homeFrame,
        SerFrame: typeof top.SerFrame,
        loading_display: getComputedStyle(document.getElementById('loading')).display,
        home_show_vis: getComputedStyle(document.getElementById('home_show')).visibility,
        userData: top.userData ? Object.keys(top.userData).slice(0,20) : null,
        nowPage: top.nowPage || '(none)',
    })""")
    
    import json
    print("\n=== Global state ===")
    print(json.dumps(state, indent=2, ensure_ascii=False))

    browser.close()
