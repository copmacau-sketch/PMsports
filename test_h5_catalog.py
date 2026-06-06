#!/usr/bin/env python3
"""Stage 3 + 4 acceptance test: verify the deployed H5 dynamic-catalog page
renders the long-tail country/league cards from /api/external/leagues/catalog
(not just the legacy 9 hard-coded leagues from FALLBACK_LEAGUE_REGIONS)."""
import json
import sys
from urllib.request import Request, urlopen

from playwright.sync_api import sync_playwright

BASE      = "https://pmppm.com"
SPORTS    = f"{BASE}/h5/sports.html"
USER      = "ceshi1"
PASS      = "Abc12345"
SCREEN    = "/Volumes/T7/Crown-gold/h5_catalog_render.png"
SCREEN2   = "/Volumes/T7/Crown-gold/h5_catalog_discover.png"
UA        = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"

# Pull the catalog directly so we know the ground truth for what the page
# should render.
req = Request(f"{BASE}/api/external/leagues/catalog?tier=major", headers={"User-Agent": UA, "Accept": "application/json"})
catalog = json.load(urlopen(req))
print(f"[catalog] tier={catalog['tier']} regions={len(catalog['regions'])} total_leagues={catalog['total_leagues']}")
expected_country_names = []
for region in catalog["regions"]:
    for country in region["countries"]:
        # filter to those with priority<=50 leagues — same threshold as
        # catalogToRegions(maxPriority=50) in sports/page.tsx
        leagues = [l for l in country["leagues"] if l["priority"] <= 50]
        if leagues:
            expected_country_names.append(country["name_cn"] or country["name_en"])
print(f"[catalog] {len(expected_country_names)} country/intl cards expected (priority<=50)")
print(f"[catalog] sample: {expected_country_names[:15]}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 414, "height": 896})  # iPhone 11 ish
    page = context.new_page()

    console_msgs = []
    network_failures = []
    page.on("console", lambda m: console_msgs.append(f"[{m.type}] {m.text[:200]}"))
    page.on("requestfailed", lambda r: network_failures.append(f"{r.method} {r.url} - {r.failure}"))

    print(f"\n=== 1. Open {SPORTS} ===")
    page.goto(SPORTS, wait_until="domcontentloaded", timeout=30000)
    print(f"title={page.title()!r} url={page.url}")

    # If we land on a login page, log in.
    page.wait_for_timeout(1500)
    if page.locator('input[type="password"], input[name="passwd"], input[name="password"]').count():
        print("\n=== 2. Login ===")
        # Username
        for sel in ['input[name="account"]', 'input[name="username"]', 'input[name="user"]', 'input[type="text"]:first-of-type']:
            if page.locator(sel).first.count():
                page.locator(sel).first.fill(USER)
                break
        for sel in ['input[name="passwd"]', 'input[name="password"]', 'input[type="password"]']:
            if page.locator(sel).first.count():
                page.locator(sel).first.fill(PASS)
                break
        # Submit
        for sel in ['button[type="submit"]', 'button:has-text("登入")', 'button:has-text("登录")', 'button:has-text("Login")']:
            if page.locator(sel).first.count():
                page.locator(sel).first.click()
                break
        page.wait_for_load_state("networkidle", timeout=15000)
        print(f"after login url={page.url}")

    page.wait_for_timeout(3000)
    print(f"\nfinal URL: {page.url}")
    page.screenshot(path=SCREEN, full_page=False)
    print(f"screenshot 1 saved: {SCREEN}")

    # The discover screen renders country cards. Try to find it.
    # Heuristic: look for our "国际" (international) card or any of the
    # expected long-tail country names.
    print("\n=== 3. Search DOM for country cards ===")
    body_text = page.evaluate("() => document.body.innerText")
    print(f"body length: {len(body_text)}")

    found = []
    missing = []
    for name in expected_country_names:
        if name and name in body_text:
            found.append(name)
        else:
            missing.append(name)
    print(f"\ncountry cards found in DOM: {len(found)}/{len(expected_country_names)}")
    print(f"  found sample : {found[:20]}")
    print(f"  missing sample: {missing[:20]}")

    # Try to detect long-tail cards (anything beyond the legacy 9)
    legacy = {"英格兰", "意大利", "西班牙", "德国", "法国", "中国", "国际", "England", "Italy", "Spain", "Germany", "France", "China", "International"}
    long_tail = [n for n in found if n not in legacy]
    print(f"\nlong-tail country cards (beyond legacy 9): {len(long_tail)}")
    print(f"  sample: {long_tail[:20]}")

    # Try clicking the discover screen if it's not already shown
    print("\n=== 4. Try to drill into discover/league picker ===")
    for sel in ['a:has-text("早盘")', 'button:has-text("早盘")', 'a:has-text("赛程")', 'div[role="tab"]:has-text("早盘")']:
        if page.locator(sel).first.count():
            try:
                page.locator(sel).first.click()
                page.wait_for_timeout(1500)
                print(f"clicked {sel}")
                break
            except Exception as e:
                print(f"click {sel} failed: {e}")

    page.screenshot(path=SCREEN2, full_page=True)
    print(f"screenshot 2 saved: {SCREEN2}")

    if console_msgs:
        print("\n--- console (last 10) ---")
        for m in console_msgs[-10:]: print(m)
    if network_failures:
        print("\n--- network failures ---")
        for f in network_failures[:10]: print(f)

    browser.close()

print("\n=== VERDICT ===")
if len(long_tail) >= 5:
    print(f"PASS: {len(long_tail)} long-tail country cards detected — dynamic catalog is rendering")
    sys.exit(0)
else:
    print(f"INCONCLUSIVE: only {len(long_tail)} long-tail cards found (expected dozens).")
    print("Check screenshots manually; this could mean: login required, discover screen not opened, or static fallback rendering.")
    sys.exit(1)
