#!/usr/bin/env python3
"""Test SPA with console enabled and click on 'today' and 'early' tabs."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:300]}"))

        transform_responses = []
        async def on_response(resp):
            url = resp.url
            if 'transform.php' in url:
                try:
                    body = await resp.text()
                except:
                    body = ''
                # Only log game-related responses
                if any(k in body for k in ['<game>', 'get_league', 'get_page', 'get_game', '<ec ', '<pgcount']):
                    transform_responses.append({'len': len(body), 'body': body[:800]})

        page.on("response", on_response)

        print("[1] Loading login page...")
        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)

        print("[2] Logging in...")
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        
        print("[3] Waiting for initial load (15s)...")
        await asyncio.sleep(15)

        # Click on "今日" tab
        print("[4] Clicking '今日' tab...")
        try:
            await page.click("text=今日", timeout=5000)
        except:
            print("  Could not find '今日' tab")
        await asyncio.sleep(5)

        # Click on "早盘" tab  
        print("[5] Clicking '早盘' tab...")
        try:
            await page.click("text=早盘", timeout=5000)
        except:
            print("  Could not find '早盘' tab")
        await asyncio.sleep(8)

        # Gather state
        print(f"\n=== Game-related transform responses ({len(transform_responses)}) ===")
        for i, tr in enumerate(transform_responses):
            print(f"\n  [{i}] Len={tr['len']}")
            print(f"  Body: {tr['body'][:400]}")

        # Check UI state
        body_text = await page.evaluate("() => document.body.innerText.substring(0, 600)")
        print(f"\n=== Body text ===\n{body_text[:400]}")

        # Screenshot
        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_click.png", full_page=False)
        print("\n  Screenshot: spa_click.png")

        # Console messages with errors or game-related
        relevant = [m for m in console_msgs if any(k in m.lower() for k in ['error', 'checkcount', 'game', 'league', 'count', 'ts', 'catalog', 'nodata', 'no data', 'loadgame', 'pagecount'])]
        print(f"\n=== Relevant console msgs ({len(relevant)}) ===")
        for m in relevant[:30]:
            print(f"  {m[:200]}")

        print(f"\n=== ALL console msgs (last 40 of {len(console_msgs)}) ===")
        for m in console_msgs[-40:]:
            print(f"  {m[:200]}")

        await browser.close()

asyncio.run(main())
