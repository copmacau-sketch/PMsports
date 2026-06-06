#!/usr/bin/env python3
"""Hook dispatchEvent to count checkCount calls"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

INIT = r"""
(function(){
    if (window.__cntHook) return;
    window.__cntHook = true;
    window.__events = [];
    
    // Try to monkey-patch dispatchEvent on every object that gets one
    // Hook Object.prototype to catch any addEventListener calls
    var origAdd = Object.prototype.addEventListener;
    
    // Better: hook setTimeout to delay our hook installation
    setTimeout(function tryHook(){
        try {
            // Locate the SPA's main controller through its globals
            var visited = new Set();
            function findFrame(obj, depth) {
                if (depth > 3 || !obj || visited.has(obj)) return null;
                try { visited.add(obj); } catch(e){}
                if (obj.dispatchEvent && obj.addEventListener && typeof obj.dispatchEvent === 'function' && obj !== window && obj !== document) {
                    return obj;
                }
                return null;
            }
            // Hook EVERY object that has dispatchEvent we can reach via window
            // Actually simpler: just instrument console.log to capture our markers
            // and hook common frame globals
            ['headerFrame', 'footerFrame', 'bottomFrame', 'betFrame', 'rightFrame', 'rightPanelFrame', 'bodyFrame'].forEach(function(name){
                if (window[name] && window[name].dispatchEvent) {
                    var orig = window[name].dispatchEvent;
                    window[name].dispatchEvent = function(evt, p) {
                        window.__events.push(name + '->' + evt);
                        localStorage.setItem('__events', JSON.stringify(window.__events));
                        return orig.apply(this, arguments);
                    };
                }
            });
        } catch(e){}
        setTimeout(tryHook, 500);
    }, 100);
})();
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context()
    ctx.add_init_script(INIT)
    page = ctx.new_page()

    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    page.wait_for_timeout(20000)

    # Different approach: just use the parentClass which receives dispatchEvent calls
    # Find it via headerFrame's parentClass
    info = page.evaluate("""() => {
        var info = {now_frame: 'unknown', total_frame: 'unknown'};
        try {
            // headerFrame.parentClass should be the main SPA controller
            if (window.headerFrame) {
                var pc = headerFrame.parentClass || headerFrame.getParentClass && headerFrame.getParentClass();
                if (pc) {
                    info.parentClass_keys = Object.keys(pc).filter(k => typeof pc[k] !== 'function').slice(0,30);
                    // Also try eval to access scope
                    if (pc.checkCount) info.has_checkCount = true;
                }
            }
            // Try the closure variables - usually exposed via top
            ['now_frame', 'total_frame', 'loginComplete', 'firstcode'].forEach(k => {
                if (typeof top[k] !== 'undefined') info['top.'+k] = top[k];
                if (typeof window[k] !== 'undefined') info['win.'+k] = window[k];
            });
        } catch(e) {
            info.err = e.message;
        }
        return info;
    }""")

    import json
    print(json.dumps(info, indent=2, ensure_ascii=False))

    # Also dump the main controller via headerFrame.parentClass
    pc_info = page.evaluate("""() => {
        try {
            if (!window.headerFrame) return 'no_header';
            var pc = headerFrame.parentClass;
            if (!pc) return 'no_parentClass';
            // Look for the parent's local state through unique function names
            var names = [];
            for (var k in pc) {
                if (typeof pc[k] === 'function' && k.startsWith('check')) names.push(k);
            }
            return {functions: names};
        } catch(e) { return e.message; }
    }""")
    print("\nParent class:", json.dumps(pc_info, indent=2, ensure_ascii=False))

    browser.close()
