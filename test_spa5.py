#!/usr/bin/env python3
"""Trace redirects with init_script injection (runs before page JS)"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

# Inject hook BEFORE any page script runs
INIT_SCRIPT = """
(function(){
    var origAssign = window.location.assign.bind(window.location);
    var origReplace = window.location.replace.bind(window.location);
    Object.defineProperty(window.location, 'assign', {
        value: function(url){
            console.log('LOCATION_ASSIGN url=' + url + ' stack=' + new Error().stack.substring(0,500));
            return origAssign(url);
        }
    });
    Object.defineProperty(window.location, 'replace', {
        value: function(url){
            console.log('LOCATION_REPLACE url=' + url + ' stack=' + new Error().stack.substring(0,500));
            return origReplace(url);
        }
    });
    // Also hook href setter
    var hrefDesc = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
    if (hrefDesc && hrefDesc.set) {
        var origSet = hrefDesc.set;
        Object.defineProperty(window.Location.prototype, 'href', {
            set: function(url){
                console.log('LOCATION_HREF_SET url=' + url + ' stack=' + new Error().stack.substring(0,500));
                return origSet.call(this, url);
            },
            get: hrefDesc.get,
            configurable: true
        });
    }
    // Hook reload
    var origReload = window.location.reload.bind(window.location);
    Object.defineProperty(window.location, 'reload', {
        value: function(){
            console.log('LOCATION_RELOAD stack=' + new Error().stack.substring(0,500));
            return origReload();
        }
    });
    console.log('INIT_HOOKS_INSTALLED at ' + window.location.href);
})();
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    context.add_init_script(INIT_SCRIPT)
    page = context.new_page()

    msgs = []
    page.on("console", lambda m: msgs.append(f"[{m.type}] {m.text[:600]}"))

    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    page.wait_for_timeout(15000)

    print(f"Final URL: {page.url}")
    print(f"\n=== Relevant console messages ({len(msgs)} total) ===")
    for m in msgs:
        if any(k in m for k in ["LOCATION_", "INIT_HOOKS", "Error", "doubleLogin", "goHome"]):
            print(f"  {m}")
            print()

    browser.close()
