#!/usr/bin/env python3
"""Check HOW the redirect happens - intercept the request to /"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    requests = []
    def on_req(req):
        if req.is_navigation_request():
            requests.append({
                "ts": time.time(),
                "url": req.url[:120],
                "method": req.method,
                "headers": dict(req.headers),
                "frame_url": req.frame.url[:120] if req.frame else "",
                "frame_is_main": req.frame.parent_frame is None if req.frame else False,
            })

    page.on("request", on_req)

    t0 = time.time()
    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    page.wait_for_timeout(10000)

    print("=== Navigation requests ===")
    for r in requests:
        rel_t = r['ts'] - t0
        is_main = "MAIN" if r['frame_is_main'] else "frame"
        print(f"  +{rel_t:5.2f}s [{r['method']}] {is_main}: {r['url']}")
        # Print referer to understand origin
        ref = r['headers'].get('referer', r['headers'].get('Referer', '(none)'))
        sec_fetch_dest = r['headers'].get('sec-fetch-dest', '?')
        sec_fetch_mode = r['headers'].get('sec-fetch-mode', '?')
        sec_fetch_site = r['headers'].get('sec-fetch-site', '?')
        print(f"      referer: {ref[:120]}")
        print(f"      sec-fetch: dest={sec_fetch_dest} mode={sec_fetch_mode} site={sec_fetch_site}")

    browser.close()
