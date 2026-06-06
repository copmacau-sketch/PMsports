#!/usr/bin/env python3
"""Trace exactly what triggers goToIndex redirect"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console messages including ours
    msgs = []
    page.on("console", lambda m: msgs.append(f"[{m.type}] {m.text[:300]}"))

    page.goto(URL, wait_until="domcontentloaded")

    # After login page loads, inject a hook BEFORE login
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")

    # Wait a bit for SPA to start loading
    page.wait_for_timeout(2000)

    # Inject hook into the SPA window
    try:
        page.evaluate("""
            (function(){
                if (window.top && window.top.util && window.top.util.goToIndex) {
                    var orig = window.top.util.goToIndex;
                    window.top.util.goToIndex = function() {
                        console.log('GOTOINDEX_CALLED stack=' + new Error().stack);
                        return orig.apply(this, arguments);
                    };
                    console.log('HOOK_INSTALLED');
                }
                if (window.top && window.top.util && window.top.util.alertConnectMsg) {
                    var orig2 = window.top.util.alertConnectMsg;
                    window.top.util.alertConnectMsg = function(msg) {
                        console.log('ALERT_CONNECT_MSG msg=' + msg);
                        return orig2.apply(this, arguments);
                    };
                }
                if (window.top && window.top.util && window.top.util.showConnectMsg) {
                    var orig3 = window.top.util.showConnectMsg;
                    window.top.util.showConnectMsg = function(xml) {
                        var result = orig3.apply(this, arguments);
                        if (result) console.log('SHOW_CONNECT_MSG returned=' + result + ' xml_preview=' + (typeof xml === 'string' ? xml.substring(0, 200) : 'obj'));
                        return result;
                    };
                }
            })();
        """)
        print("Hooks installed")
    except Exception as e:
        print(f"Hook install failed: {e}")

    page.wait_for_timeout(10000)
    print(f"Final URL: {page.url}")

    print(f"\n=== Console messages ({len(msgs)}) ===")
    for m in msgs:
        if any(k in m for k in ["GOTOINDEX", "ALERT_CONNECT", "SHOW_CONNECT", "HOOK", "Error", "error"]):
            print(f"  {m}")

    browser.close()
