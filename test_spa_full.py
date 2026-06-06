#!/usr/bin/env python3
"""Full test with screenshot."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        await ctx.route("**/*", lambda route: route.continue_(headers={**route.request.headers, "Cache-Control": "no-cache, no-store", "Pragma": "no-cache"}))
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:500]}"))
        page.on("pageerror", lambda err: console_msgs.append(f"[PAGE_ERR] {str(err)[:500]}"))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(10)

        await page.evaluate("() => { var el = document.querySelector('[id^=\"league_1001\"]'); if(el) el.click(); }")
        await asyncio.sleep(30)

        # Check DOM
        info = await page.evaluate("""() => {
            var div_show = document.getElementById('div_show');
            var nodata = document.getElementById('div_nodata');
            return {
                div_show_len: div_show ? div_show.innerHTML.length : -1,
                div_show_text_preview: div_show ? div_show.innerText.substring(0, 300) : '',
                nodata_display: nodata ? window.getComputedStyle(nodata).display : 'n/a',
            };
        }""")
        print(f"div_show length: {info['div_show_len']}")
        print(f"nodata display: {info['nodata_display']}")
        print(f"div_show text preview: {info['div_show_text_preview'][:300]}")

        print(f"\n=== Console ({len(console_msgs)}) ===")
        for m in console_msgs:
            if 'DBG' in m or 'getData' in m or 'LoadGameComplete' in m or 'workerThrough' in m or 'PAGE_ERR' in m or 'Worker' in m or 'showNoData' in m or '错误' in m or 'error' in m:
                print(f"  {m[:500]}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_full.png", full_page=False)
        await browser.close()

asyncio.run(main())
