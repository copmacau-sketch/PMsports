#!/usr/bin/env python3
"""Capture all transform.php responses to find what triggers goToIndex"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"
responses = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    def on_response(resp):
        url = resp.url
        if "transform.php" in url or "/index.php" in url:
            try:
                body = resp.body().decode('utf-8', errors='replace')[:800]
                responses.append({
                    "url": url[:200],
                    "status": resp.status,
                    "body": body
                })
            except:
                pass

    page.on("response", on_response)
    page.on("framenavigated", lambda f: print(f"NAV: {f.url[:100]}"))

    t0 = time.time()
    page.goto(URL, wait_until="domcontentloaded")
    print(f"Loaded login at {time.time()-t0:.1f}s")

    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    print(f"Submitted at {time.time()-t0:.1f}s")

    # Wait for redirect chain to complete
    page.wait_for_timeout(8000)
    print(f"\nFinal URL: {page.url}")
    print(f"Total transform/index responses: {len(responses)}")

    # Look for suspicious responses
    print("\n=== Looking for problematic responses ===")
    for r in responses:
        body_lower = r["body"].lower()
        if any(k in body_lower for k in ["doublelogin", "gohome", "error", "code>662", "code>664", "code>663", "code>665"]):
            # Extract p= parameter from POST body or URL
            url_short = r["url"].replace("http://3.25.180.205:8080", "")
            print(f"\n--- {r['status']} {url_short} ---")
            print(f"Body: {r['body'][:500]}")

    # Also list which APIs were called and in what order around the redirect
    print("\n=== Last 15 transform.php calls ===")
    tp_only = [r for r in responses if "transform.php" in r["url"]]
    for r in tp_only[-15:]:
        url_short = r["url"].replace("http://3.25.180.205:8080", "")
        body_first = r["body"][:120].replace("\n", " ")
        print(f"  [{r['status']}] {url_short}")
        print(f"      => {body_first}")

    browser.close()
