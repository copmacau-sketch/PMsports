#!/usr/bin/env python3
"""End-to-end SPA test with longer wait, full diagnostics."""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

console_msgs = []
errors = []
net_log = []
net_failed = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:300]}"))
    page.on("pageerror", lambda err: errors.append(str(err)[:500]))
    page.on("requestfailed", lambda req: net_failed.append(f"{req.method} {req.url[:120]} - {req.failure}"))
    page.on("response", lambda resp: net_log.append((resp.status, resp.url[:150])))

    t0 = time.time()
    page.goto(URL, wait_until="domcontentloaded", timeout=30000)
    print(f"DOMContentLoaded at {time.time()-t0:.2f}s")

    # Login
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    print(f"Login clicked at {time.time()-t0:.2f}s")

    # Wait up to 60s for SPA to render
    for waited in [5, 10, 15, 20, 30, 45]:
        page.wait_for_timeout((waited - (waited - 5)) * 1000 if waited == 5 else 5000)
        body_chars = len(page.inner_text("body").strip())
        visible_imgs = len(page.query_selector_all("img:visible"))
        print(f"  +{waited}s elapsed={time.time()-t0:.1f}s body_chars={body_chars} url={page.url[:60]}")
        if body_chars > 100:
            break

    # Final screenshot
    page.screenshot(path="/tmp/spa_final.png", full_page=False)

    body = page.inner_text("body")[:1000]
    print(f"\n=== Body (first 1000 chars) ===\n{body}")

    print(f"\n=== Network responses ({len(net_log)}) ===")
    # Group by status
    from collections import Counter
    status_counts = Counter(s for s, _ in net_log)
    print(f"Status distribution: {dict(status_counts)}")

    # Show non-200 responses
    print("\nNon-2xx responses:")
    for s, u in net_log:
        if s >= 400:
            print(f"  {s} {u}")

    print(f"\n=== Failed requests ({len(net_failed)}) ===")
    for f in net_failed[:10]:
        print(f"  {f}")

    print(f"\n=== Console messages ({len(console_msgs)}) ===")
    for m in console_msgs[-30:]:
        print(f"  {m}")

    print(f"\n=== Page errors ({len(errors)}) ===")
    for e in errors:
        print(f"  {e}")

    # DOM inspection
    print("\n=== DOM check ===")
    for sel in ["#header", "#footer", "#home", "#bottom", "#right_menu", ".main", "iframe"]:
        el = page.query_selector(sel)
        if el:
            visible = el.is_visible()
            html_len = len(el.inner_html()) if visible else 0
            print(f"  {sel}: present, visible={visible}, html_len={html_len}")
        else:
            print(f"  {sel}: NOT FOUND")

    browser.close()
