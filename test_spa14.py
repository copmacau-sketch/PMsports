#!/usr/bin/env python3
"""Inspect now_frame counter to find which frame is missing"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    page.wait_for_timeout(20000)

    # Probe key frame variables
    state = page.evaluate("""() => {
        // These are inside the IIFE scope but accessible via window? probably not.
        // Try accessing via the body frame
        var info = {
            footerFrame: typeof footerFrame,
            bottomFrame: typeof bottomFrame,
            betFrame: typeof betFrame,
            headerFrame: typeof headerFrame,
            rightFrame: typeof rightFrame,
            rightPanelFrame: typeof rightPanelFrame,
            bodyFrame: typeof bodyFrame,
            top_footerFrame: typeof top.footerFrame,
            // Try myhash
            myhash_keys: typeof myhash !== 'undefined' ? Object.keys(myhash) : 'undef',
        };
        // Try to access now_frame via any global that exposes it
        if (typeof loginComplete !== 'undefined') info.loginComplete = loginComplete;
        if (typeof now_frame !== 'undefined') info.now_frame = now_frame;
        if (typeof total_frame !== 'undefined') info.total_frame = total_frame;
        return info;
    }""")
    
    import json
    print(json.dumps(state, indent=2, ensure_ascii=False))

    # Check the DOM - which template containers are populated?
    dom = page.evaluate("""() => {
        var ids = ['header', 'home_show', 'body_show', 'bottom_show', 'betslip_show', 'header_show', 'myAcc_show', 'right_show', 'footer'];
        var result = {};
        ids.forEach(id => {
            var el = document.getElementById(id);
            if (el) {
                result[id] = {
                    htmlLen: el.innerHTML.length,
                    visible: getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none',
                    classes: el.className,
                };
            } else {
                result[id] = 'NOT FOUND';
            }
        });
        return result;
    }""")
    print("\n=== DOM containers ===")
    print(json.dumps(dom, indent=2, ensure_ascii=False))

    browser.close()
