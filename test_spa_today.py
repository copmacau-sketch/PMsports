#!/usr/bin/env python3
"""Verify homepage 'today' / 'hot' view also works after the fixes."""
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
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:300]}"))
        page.on("pageerror", lambda err: console_msgs.append(f"[ERR] {str(err)[:300]}"))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        # Click "今日" tab in top navigation
        clicked = await page.evaluate("""() => {
            var btns = document.querySelectorAll('[id*=\"today\"], [id*=\"showtype_today\"], li');
            for (var i = 0; i < btns.length; i++) {
                if (btns[i].innerText && (btns[i].innerText.indexOf('今日') >= 0)) {
                    btns[i].click();
                    return btns[i].id || btns[i].innerText.substring(0, 20);
                }
            }
            return null;
        }""")
        print(f"Clicked: {clicked}")
        await asyncio.sleep(20)

        info = await page.evaluate("""() => {
            var div_show = document.getElementById('div_show');
            var nodata = document.getElementById('div_nodata');
            return {
                div_show_len: div_show ? div_show.innerHTML.length : -1,
                nodata_display: nodata ? window.getComputedStyle(nodata).display : 'n/a',
                div_show_text: div_show ? div_show.innerText.substring(0, 400) : '',
            };
        }""")
        print(f"div_show length: {info['div_show_len']}")
        print(f"nodata display: {info['nodata_display']}")
        print(f"text:\n{info['div_show_text']}")

        print(f"\n=== Console ({len(console_msgs)}) ===")
        for m in console_msgs[-15:]:
            if 'Error' in m or 'ERR' in m or 'getData' in m or 'workerThrough' in m or 'undefined' in m:
                print(f"  {m[:300]}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_today.png", full_page=False)
        await browser.close()

asyncio.run(main())
