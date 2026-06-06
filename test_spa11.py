#!/usr/bin/env python3
"""Check what's actually rendered after 'redirect'"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=50)  # headed
    page = browser.new_page()

    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")

    print("Waiting for SPA to fully load...")
    for waited in [5, 10, 15, 20, 30, 45]:
        page.wait_for_timeout(5000)
        try:
            url = page.url
            title = page.title()
            body_text = page.evaluate("document.body.innerText").strip()[:300]
            visible_count = page.evaluate("document.querySelectorAll('div:not([style*=\"display:none\"]):not([style*=\"display: none\"])').length")
            home_show = page.query_selector("#home_show")
            home_show_html_len = len(home_show.inner_html()) if home_show else 0
            home_show_visible = home_show.is_visible() if home_show else False

            print(f"\n+{waited}s")
            print(f"  URL: {url[:100]}")
            print(f"  Title: {title}")
            print(f"  Body text first 300: {body_text!r}")
            print(f"  #home_show: visible={home_show_visible} html_len={home_show_html_len}")
        except Exception as e:
            print(f"  Error: {e}")

    page.screenshot(path="/tmp/spa_after_load.png", full_page=True)
    print("\nScreenshot saved to /tmp/spa_after_load.png")
    browser.close()
