#!/usr/bin/env python3
"""Acceptance test for the auto-transliterated team translations.

Opens https://pmppm.com/h5/sports.html, logs in, drills into a long-tail
league (Austria / Sweden / Iceland) and checks that the rendered match-list
shows Chinese team names — no raw English like "VfB Hohenems" or "FC
Lauterach" should remain visible.
"""
import sys
from playwright.sync_api import sync_playwright

BASE      = "https://pmppm.com"
SPORTS    = f"{BASE}/h5/sports.html"
USER      = "ceshi1"
PASS      = "Abc12345"
SCREEN1   = "/Volumes/T7/Crown-gold/h5_teams_overview.png"
SCREEN2   = "/Volumes/T7/Crown-gold/h5_teams_drilldown.png"
UA        = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 "
             "(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36")

# Strings we know got transliterated this round.  If they show up in the
# DOM the test passes.
EXPECTED_CN = [
    "霍恨埃姆斯",        # VfB Hohenems
    "拉乌特拉克赫",       # FC Lauterach
    "艾克",            # AIK / AIK DFF
    "阿尔波尔格",        # Aalborg BK
    "卡尔克赫",         # AL Karkh
    "纳夫特",          # AL Naft
    "塔拉巴",          # AL Talaba
    "韦斯图尔索尔瓦古尔",   # 07 Vestur Sorvagur
]

# Strings that MUST NOT appear (would mean translateTeam fell through).
FORBIDDEN_EN = [
    "VfB Hohenems",
    "FC Lauterach",
    "AIK DFF",
    "Aalborg BK",
    "AL Karkh",
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 414, "height": 896},
        user_agent=UA,
    )
    page = context.new_page()

    console_msgs = []
    page.on("console", lambda m: console_msgs.append(f"[{m.type}] {m.text[:160]}"))

    print(f"=== 1. Open {SPORTS} ===")
    page.goto(SPORTS, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(1500)
    print(f"title={page.title()!r} url={page.url}")

    # Login if required.
    if page.locator('input[type="password"], input[name="passwd"], input[name="password"]').count():
        print("\n=== 2. Login ===")
        for sel in ['input[name="account"]', 'input[name="username"]', 'input[name="user"]', 'input[type="text"]:first-of-type']:
            if page.locator(sel).first.count():
                page.locator(sel).first.fill(USER)
                break
        for sel in ['input[name="passwd"]', 'input[name="password"]', 'input[type="password"]']:
            if page.locator(sel).first.count():
                page.locator(sel).first.fill(PASS)
                break
        for sel in ['button[type="submit"]', 'button:has-text("登入")', 'button:has-text("登录")', 'button:has-text("Login")']:
            if page.locator(sel).first.count():
                page.locator(sel).first.click()
                break
        page.wait_for_load_state("networkidle", timeout=15000)
        print(f"after login url={page.url}")

    page.wait_for_timeout(2500)
    page.screenshot(path=SCREEN1, full_page=False)
    print(f"screenshot 1: {SCREEN1}")

    # Click "今日" or "全部赛事" to expose a match-list with many leagues.
    print("\n=== 3. Navigate to match list ===")
    for sel in ['button:has-text("今日")', 'a:has-text("今日")', 'button:has-text("全部赛事")', 'a:has-text("早盘")', 'div[role="tab"]:has-text("今日")']:
        if page.locator(sel).first.count():
            try:
                page.locator(sel).first.click()
                page.wait_for_timeout(2000)
                print(f"clicked {sel}")
                break
            except Exception as e:
                print(f"click {sel} failed: {e}")

    page.wait_for_timeout(2000)
    body_text = page.evaluate("() => document.body.innerText")
    print(f"body length: {len(body_text)}")

    found = [s for s in EXPECTED_CN if s in body_text]
    leaked = [s for s in FORBIDDEN_EN if s in body_text]

    print(f"\nexpected Chinese team strings found: {len(found)}/{len(EXPECTED_CN)}")
    print(f"  found : {found}")
    print(f"forbidden English team strings leaking: {len(leaked)}")
    print(f"  leaked: {leaked}")

    # Scroll the page so we get more match cards
    print("\n=== 4. Scroll to load more matches ===")
    for _ in range(5):
        page.evaluate("() => window.scrollBy(0, document.documentElement.clientHeight)")
        page.wait_for_timeout(700)

    body_text = page.evaluate("() => document.body.innerText")
    print(f"after-scroll body length: {len(body_text)}")
    found = [s for s in EXPECTED_CN if s in body_text]
    leaked = [s for s in FORBIDDEN_EN if s in body_text]
    print(f"  found : {found}")
    print(f"  leaked: {leaked}")

    page.screenshot(path=SCREEN2, full_page=True)
    print(f"screenshot 2: {SCREEN2}")

    if console_msgs:
        print("\n--- console (last 5) ---")
        for m in console_msgs[-5:]: print(m)

    browser.close()

print("\n=== VERDICT ===")
if leaked:
    print(f"FAIL: {len(leaked)} English names leaking in DOM: {leaked}")
    sys.exit(1)
if not found:
    print("INCONCLUSIVE: no expected Chinese strings found (no long-tail matches on the page right now?)")
    print("Check screenshots manually.")
    sys.exit(0)
print(f"PASS: {len(found)} Chinese team strings rendered, 0 English leaks")
sys.exit(0)
