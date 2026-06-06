#!/usr/bin/env python3
"""Capture exact stack trace of the 'key is not defined' error."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        var stack = '';
        try { stack = e.error ? e.error.stack : ''; } catch(x){}
        console.error('WIN_ERR: ' + e.message + '\nFile: ' + (e.filename||'') + ':' + e.lineno + ':' + e.colno + '\nStack: ' + stack);
    });
})();
"""

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        await ctx.add_init_script(INIT)
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:800]}"))

        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:800]))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        # Click football early button
        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(15)

        print("=== Page errors ===")
        for e in page_errors:
            print(e)

        print("\n=== Console errors ===")
        for m in console_msgs:
            if 'error' in m.lower() or 'ERR' in m:
                print(m)

        await browser.close()

asyncio.run(main())
