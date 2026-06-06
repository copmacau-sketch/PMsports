#!/usr/bin/env python3
"""Inspect loading overlay state and force-remove it"""
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

    # Inspect loading element
    info = page.evaluate("""() => {
        var loading = document.getElementById('loading');
        var bodyLoading = document.getElementById('body_loading');
        var homeShow = document.getElementById('home_show');
        var headerEl = document.getElementById('header');
        return {
            loading: loading ? {display: getComputedStyle(loading).display, visibility: getComputedStyle(loading).visibility, html: loading.outerHTML.substring(0,200)} : null,
            body_loading: bodyLoading ? {display: getComputedStyle(bodyLoading).display} : null,
            home_show: homeShow ? {display: getComputedStyle(homeShow).display, visibility: getComputedStyle(homeShow).visibility, opacity: getComputedStyle(homeShow).opacity, htmlLen: homeShow.innerHTML.length} : null,
            header: headerEl ? {display: getComputedStyle(headerEl).display} : null,
            // Check if init completed
            init_called: typeof window.bodyFrame,
            home_loaded: typeof top.home_show,
        };
    }""")
    
    import json
    print(json.dumps(info, indent=2, ensure_ascii=False)[:2000])

    # Try force-removing the loading
    print("\n=== Force-removing loading overlay ===")
    page.evaluate("document.getElementById('loading').style.display = 'none';")
    page.screenshot(path="/tmp/spa_no_loading.png", full_page=True)
    print("Screenshot saved")

    body_text = page.evaluate("document.body.innerText").strip()[:500]
    print(f"\nBody text after removing loading:\n{body_text}")

    browser.close()
