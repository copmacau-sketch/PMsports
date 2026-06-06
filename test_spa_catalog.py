#!/usr/bin/env python3
"""Test SPA + catalog API from browser perspective."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 800})

        # 1) Test API catalog endpoint
        print("=== Testing api_catalog.php ===")
        resp = await page.goto(f"{BASE}/api_catalog.php?action=leagues")
        print(f"  Status: {resp.status}")
        body = await page.content()
        # Extract text from <pre> or body
        text = await page.inner_text("body")
        print(f"  Body (first 500): {text[:500]}")
        print()

        # 2) Test matches endpoint
        print("=== Testing matches (EPL) ===")
        resp = await page.goto(f"{BASE}/api_catalog.php?action=matches&league=england-premier-league")
        text = await page.inner_text("body")
        print(f"  Status: {resp.status}")
        print(f"  Body (first 600): {text[:600]}")
        print()

        # 3) Test live endpoint
        print("=== Testing live ===")
        resp = await page.goto(f"{BASE}/api_catalog.php?action=live")
        text = await page.inner_text("body")
        print(f"  Status: {resp.status}")
        print(f"  Body (first 300): {text[:300]}")
        print()

        # 4) Test the SPA main page
        print("=== Testing SPA main page ===")
        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text}"))

        resp = await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        print(f"  Status: {resp.status}")
        print(f"  URL: {page.url}")
        title = await page.title()
        print(f"  Title: {title}")

        # Wait for SPA to load
        await asyncio.sleep(8)

        # Check key elements
        url_now = page.url
        print(f"  URL after wait: {url_now}")

        # Check if loading overlay is visible
        loading_vis = await page.evaluate("""() => {
            const el = document.getElementById('loading');
            if (!el) return 'not found';
            const style = window.getComputedStyle(el);
            return `display=${style.display}, visibility=${style.visibility}, opacity=${style.opacity}`;
        }""")
        print(f"  Loading overlay: {loading_vis}")

        # Check home_show visibility
        home_vis = await page.evaluate("""() => {
            const el = document.getElementById('home_show');
            if (!el) return 'not found';
            const style = window.getComputedStyle(el);
            return `display=${style.display}, visibility=${style.visibility}`;
        }""")
        print(f"  home_show: {home_vis}")

        # Check body text
        body_text = await page.evaluate("() => document.body.innerText.substring(0, 500)")
        print(f"  Body text: {body_text[:300]}")

        # Screenshot
        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_screenshot.png", full_page=False)
        print(f"  Screenshot saved to spa_screenshot.png")

        # Console messages
        if console_msgs:
            print(f"\n  Console ({len(console_msgs)} msgs, last 10):")
            for m in console_msgs[-10:]:
                print(f"    {m[:120]}")

        await browser.close()

asyncio.run(main())
