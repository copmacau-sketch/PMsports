#!/usr/bin/env python3
"""Test with browser cache bypassed."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Disable cache
        ctx = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            bypass_csp=True,
        )
        # Disable cache for all requests
        await ctx.route("**/*", lambda route: route.continue_(headers={**route.request.headers, "Cache-Control": "no-cache, no-store", "Pragma": "no-cache"}))
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:500]}"))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(10)

        await page.evaluate("() => { var el = document.querySelector('[id^=\"league_1001\"]'); if(el) el.click(); }")
        await asyncio.sleep(25)

        print(f"=== Console ({len(console_msgs)}) ===")
        for m in console_msgs:
            if 'DBG' in m or 'getData' in m or 'LoadGameComplete' in m or 'workerThrough' in m or 'parseGameList' in m or 'showNoData' in m or '不繼' in m or '阻擋' in m:
                print(f"  {m[:500]}")

        await browser.close()

asyncio.run(main())
