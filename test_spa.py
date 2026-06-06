#!/usr/bin/env python3
"""End-to-end SPA login test using Playwright."""
import sys
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"
USER = "ceshi1"
PASS = "Abc12345"

console_msgs = []
errors = []
network_failures = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:200]}"))
    page.on("pageerror", lambda err: errors.append(str(err)[:300]))
    page.on("requestfailed", lambda req: network_failures.append(f"{req.method} {req.url} - {req.failure}"))

    print(f"=== 1. Open {URL} ===")
    page.goto(URL, wait_until="domcontentloaded", timeout=30000)
    print(f"Title: {page.title()}")
    print(f"URL after load: {page.url}")

    # Wait for login form
    page.wait_for_timeout(2000)

    # Find login fields - try multiple selectors
    print("\n=== 2. Locate login fields ===")
    inputs = page.query_selector_all("input")
    print(f"Found {len(inputs)} input elements")
    for i, inp in enumerate(inputs[:10]):
        name = inp.get_attribute("name") or ""
        type_ = inp.get_attribute("type") or ""
        id_ = inp.get_attribute("id") or ""
        ph = inp.get_attribute("placeholder") or ""
        visible = inp.is_visible()
        print(f"  [{i}] type={type_} name={name} id={id_} ph={ph} visible={visible}")

    # Try to fill login (common selectors)
    print("\n=== 3. Attempt login ===")
    try:
        # Try by name first
        for sel in ["input[name='username']", "input[name='usr']", "input[name='loginname']", "input[id*='user']", "input[type='text']"]:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.fill(USER)
                print(f"  Filled username via: {sel}")
                break
        for sel in ["input[name='password']", "input[name='pwd']", "input[type='password']"]:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.fill(PASS)
                print(f"  Filled password via: {sel}")
                break

        # Click login
        for sel in ["button[type='submit']", "input[type='submit']", "#btn_login", ".btn_login", "button:has-text('登入')", "button:has-text('登录')"]:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click()
                print(f"  Clicked login via: {sel}")
                break
    except Exception as e:
        print(f"  Error: {e}")

    # Wait for navigation
    print("\n=== 4. Wait for SPA load ===")
    page.wait_for_timeout(15000)
    print(f"Final URL: {page.url}")
    print(f"Title: {page.title()}")

    # Take screenshot
    page.screenshot(path="/tmp/spa_screenshot.png", full_page=False)
    print("Screenshot saved: /tmp/spa_screenshot.png")

    # Check what's visible
    body_text = page.inner_text("body")[:500]
    print(f"\nBody text (first 500 chars):\n{body_text}")

    print(f"\n=== Console messages ({len(console_msgs)}) ===")
    for m in console_msgs[-30:]:
        print(f"  {m}")

    print(f"\n=== Page errors ({len(errors)}) ===")
    for e in errors:
        print(f"  {e}")

    print(f"\n=== Network failures ({len(network_failures)}) ===")
    for f in network_failures[:20]:
        print(f"  {f}")

    browser.close()
