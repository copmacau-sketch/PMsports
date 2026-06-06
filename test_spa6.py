#!/usr/bin/env python3
"""Use init_script for ALL frames; track navigations directly"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

# Use Object.defineProperty redirect - works in all frames
INIT_SCRIPT = r"""
(function(){
    try {
        // Hook console.log to also dump to a global stash readable from outside
        if (!window.__captured) window.__captured = [];
        var origLog = console.log;
        // Track navigation attempts - hook via setter on document.location is tricky
        // Instead, override navigator-like behaviors
        window.__captured.push('INIT_HOOKS at ' + window.location.href);
        
        // Hook XHR to log all requests with URLs
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.__url = url;
            this.__method = method;
            return origOpen.apply(this, arguments);
        };
        var origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var xhr = this;
            xhr.addEventListener('load', function(){
                var resp = xhr.responseText || '';
                if (resp.length < 500 && (resp.indexOf('doubleLogin') >= 0 || resp.indexOf('goHome') >= 0 || resp.indexOf('<code>66') >= 0)) {
                    window.__captured.push('XHR ' + xhr.__method + ' ' + xhr.__url + ' => ' + resp.substring(0, 300));
                }
            });
            return origSend.apply(this, arguments);
        };
        
        // Hook beforeunload to detect navigation cause
        window.addEventListener('beforeunload', function(){
            window.__captured.push('UNLOAD at ' + window.location.href + ' stack=' + new Error().stack.substring(0,800));
        });
    } catch(e) {
        if (!window.__captured) window.__captured = [];
        window.__captured.push('INIT_ERROR: ' + e.message);
    }
})();
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    context.add_init_script(INIT_SCRIPT)
    page = context.new_page()

    nav_log = []
    page.on("framenavigated", lambda f: nav_log.append((time.time(), f.url[:150], f.parent_frame is None)))

    t0 = time.time()
    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")

    # Read window.__captured periodically before page navigates
    capture_history = []
    for i in range(30):
        page.wait_for_timeout(500)
        try:
            captured = page.evaluate("window.__captured || []")
            if captured:
                capture_history.append((time.time()-t0, captured.copy()))
        except:
            pass

    print(f"\n=== Frame navigations ===")
    for ts, url, is_main in nav_log:
        print(f"  +{ts-t0:.2f}s {'MAIN' if is_main else 'subframe'}: {url}")

    print(f"\n=== Captured logs across page lifetimes ===")
    seen = set()
    for ts, items in capture_history:
        for item in items:
            if item not in seen:
                seen.add(item)
                print(f"  [+{ts:.1f}s] {item[:500]}")

    browser.close()
