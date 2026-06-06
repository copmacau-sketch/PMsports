#!/usr/bin/env python3
"""Enable echo() debug output to trace checkCount counter"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

INIT = r"""
(function(){
    if (window.__siteSet) return;
    window.__siteSet = true;
    Object.defineProperty(window, 'top', { 
        get: function(){ return window; }, 
        configurable: true 
    });
})();
"""
# Actually simpler - just set top.site
INIT = "Object.defineProperty(window, 'site', {value: 'TEST', writable: true, configurable: true}); top.site = 'TEST';"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context()
    ctx.add_init_script(INIT)
    page = ctx.new_page()

    msgs = []
    page.on("console", lambda m: msgs.append(f"[{m.type}] {m.text[:300]}"))

    page.goto(URL, wait_until="domcontentloaded")
    page.evaluate("top.site = 'TEST'; window.site = 'TEST';")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    
    # Set top.site again after navigation
    page.wait_for_timeout(500)
    try:
        page.evaluate("top.site = 'TEST';")
    except: pass

    page.wait_for_timeout(20000)

    print(f"=== Console messages ({len(msgs)}) ===")
    # Only print relevant ones
    for m in msgs:
        if any(k in m for k in ["checkCount", "now=", "frame", "Frame", "init", "Init", "loginComplete"]):
            print(f"  {m}")

    print(f"\n=== All console messages last 30 ===")
    for m in msgs[-30:]:
        print(f"  {m}")

    browser.close()
