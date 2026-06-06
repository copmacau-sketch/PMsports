#!/usr/bin/env python3
"""Trace what happens after clicking football early button."""
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
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:500]}"))

        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:500]))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        # Inject trace logging before clicking
        await page.evaluate("""() => {
            // Trace bodyGoToPage
            if (typeof bodyFrame !== 'undefined' && bodyFrame) {
                console.log('[TRACE] bodyFrame.classname=' + bodyFrame.classname);
            }
            console.log('[TRACE] top.lastClickTS=' + top.lastClickTS);
            console.log('[TRACE] top.resizePage=' + top.resizePage);
            console.log('[TRACE] top.chgBodyDone=' + top.chgBodyDone);
            console.log('[TRACE] typeof classHash=' + typeof classHash);
        }""")

        # Click
        await page.evaluate("""() => {
            var el = document.getElementById('ft_early_league');
            if (el) {
                console.log('[TRACE] clicking ft_early_league');
                el.click();
            } else {
                console.log('[TRACE] ft_early_league not found');
            }
        }""")

        await asyncio.sleep(3)

        # Check state
        state = await page.evaluate("""() => {
            return {
                lastClickTS: top.lastClickTS,
                choice_gtype: top.choice_gtype,
                choice_showtype: top.choice_showtype,
                resizePage: top.resizePage,
                chgBodyDone: top.chgBodyDone,
                isLeagued: top.isLeagued,
            };
        }""")
        print(f"State after click: {state}")

        await asyncio.sleep(25)

        # Final state
        state2 = await page.evaluate("""() => {
            return {
                lastClickTS: top.lastClickTS,
                resizePage: top.resizePage,
                chgBodyDone: top.chgBodyDone,
                isLeagued: top.isLeagued,
                body_show_len: document.getElementById('body_show') ? document.getElementById('body_show').innerHTML.length : 0,
                sport_content: document.getElementById('sport_content') ? document.getElementById('sport_content').innerHTML.length : 0,
                main_content: document.getElementById('main_content') ? document.getElementById('main_content').innerHTML.length : 0,
            };
        }""")
        print(f"State after wait: {state2}")

        print(f"\n=== All console ({len(console_msgs)}) ===")
        for m in console_msgs:
            print(f"  {m[:300]}")

        if page_errors:
            print(f"\n=== Page errors ({len(page_errors)}) ===")
            for e in page_errors:
                print(f"  {e}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_trace.png", full_page=False)
        await browser.close()

asyncio.run(main())
