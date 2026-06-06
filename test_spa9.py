#!/usr/bin/env python3
"""Hook ALL location-changing functions BEFORE any JS runs"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

# Override location setters at the prototype level - this catches everything
INIT_SCRIPT = r"""
(function(){
    if (window.__locHooked) return;
    window.__locHooked = true;
    window.__locLog = [];
    
    function log(msg) {
        try {
            window.__locLog.push(msg);
            // Mirror to localStorage so it survives navigation
            localStorage.setItem('__locLog', JSON.stringify(window.__locLog));
            // Also force-pause via debugger statement
            console.log('[LOC] ' + msg);
        } catch(e) {}
    }
    
    // Hook Location.prototype.href setter
    try {
        var hrefDesc = Object.getOwnPropertyDescriptor(Location.prototype, 'href');
        Object.defineProperty(Location.prototype, 'href', {
            set: function(v) {
                log('SET href=' + v + ' from=' + window.location.href + ' stack=' + (new Error().stack||'').substring(0,500));
                hrefDesc.set.call(this, v);
            },
            get: hrefDesc.get,
            configurable: true
        });
    } catch(e) { log('href hook fail: '+e.message); }
    
    // Hook Location.prototype.assign/replace
    try {
        var origAssign = Location.prototype.assign;
        Location.prototype.assign = function(v) {
            log('ASSIGN ' + v + ' stack=' + (new Error().stack||'').substring(0,400));
            return origAssign.call(this, v);
        };
        var origReplace = Location.prototype.replace;
        Location.prototype.replace = function(v) {
            log('REPLACE ' + v + ' stack=' + (new Error().stack||'').substring(0,400));
            return origReplace.call(this, v);
        };
    } catch(e) { log('replace hook fail: '+e.message); }

    // Hook window.location getter on Window prototype to also intercept top.location = '...'
    // top.location = X is equivalent to top.location.href = X (when X is a string)
    // So our href hook should catch it.
    
    // Form submission
    try {
        var origSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function() {
            log('FORM_SUBMIT action=' + this.action + ' method=' + this.method);
            return origSubmit.apply(this, arguments);
        };
    } catch(e) {}
    
    log('HOOKS_INSTALLED at ' + window.location.href);
})();
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    context.add_init_script(INIT_SCRIPT)
    page = context.new_page()

    nav = []
    page.on("framenavigated", lambda f: nav.append((time.time(), f.url[:120], f.parent_frame is None)))

    t0 = time.time()
    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")

    # Periodically capture localStorage logs
    captured = []
    for i in range(40):
        page.wait_for_timeout(300)
        try:
            log_json = page.evaluate("localStorage.getItem('__locLog')")
            if log_json:
                import json
                items = json.loads(log_json)
                captured = items  # latest snapshot
        except: pass

    # Print
    print("=== Navigation ===")
    for t, u, m in nav:
        print(f"  +{t-t0:5.2f}s {'M' if m else 'f'}: {u}")

    print(f"\n=== Location changes ({len(captured)}) ===")
    for item in captured:
        print(f"  {item[:600]}")

    browser.close()
