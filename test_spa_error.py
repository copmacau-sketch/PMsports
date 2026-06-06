#!/usr/bin/env python3
"""Capture all JS errors during SPA boot with CatalogBridge."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

# Hook all errors in all frames
INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        console.error('WINDOW_ERROR: ' + e.message + ' at ' + e.filename + ':' + e.lineno + ':' + e.colno);
    });
    window.addEventListener('unhandledrejection', function(e) {
        console.error('UNHANDLED_REJECT: ' + (e.reason ? e.reason.toString() : ''));
    });
    var origError = console.error;
    console.error = function() {
        origError.apply(console, arguments);
    };
})();
"""

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        await ctx.add_init_script(INIT)
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:400]}"))
        
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:400]))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        
        await asyncio.sleep(20)

        print(f"=== Page errors ({len(page_errors)}) ===")
        for e in page_errors:
            print(f"  {e}")

        print(f"\n=== Console msgs ({len(console_msgs)}) ===")
        for m in console_msgs:
            print(f"  {m[:200]}")

        # Check state
        state = await page.evaluate("""() => {
            var loading = document.getElementById('loading');
            var home = document.getElementById('home_show');
            return {
                loading: loading ? window.getComputedStyle(loading).display : 'N/A',
                home: home ? window.getComputedStyle(home).display : 'N/A',
            };
        }""")
        print(f"\n=== State: loading={state['loading']}, home_show={state['home']}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_error.png", full_page=False)
        await browser.close()

asyncio.run(main())
