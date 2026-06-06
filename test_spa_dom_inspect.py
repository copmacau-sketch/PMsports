#!/usr/bin/env python3
"""Inspect DOM after league click to see if games are present but hidden."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        console.error('WIN_ERR: ' + e.message + ' at ' + (e.filename||'') + ':' + e.lineno);
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

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        # Click football early
        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(10)

        # Click league 英超
        await page.evaluate("() => { var el = document.querySelector('[id^=\"league_1001\"]'); if(el) el.click(); }")
        await asyncio.sleep(20)

        # Inspect DOM
        info = await page.evaluate("""() => {
            var result = {};
            // game containers
            var ec = document.querySelectorAll('[id^="ECID_"], [id^="GAME_"], [id^="game_"]');
            result.gameElements = ec.length;
            result.gameElementIds = [];
            for (var i = 0; i < Math.min(ec.length, 10); i++) {
                result.gameElementIds.push(ec[i].id + ' display=' + (window.getComputedStyle(ec[i]).display));
            }
            // common containers
            var ids = ['body_show', 'game_list_show', 'GAME_LIST', 'noData', 'no_data', 'page_nodata', 'sport_menu', 'main_show', 'main_content'];
            for (var i = 0; i < ids.length; i++) {
                var el = document.getElementById(ids[i]);
                if (el) {
                    result[ids[i]] = {
                        display: window.getComputedStyle(el).display,
                        innerHTMLLength: el.innerHTML.length,
                        innerText: el.innerText ? el.innerText.substring(0, 100) : ''
                    };
                }
            }
            // top.lastDataHash
            try { result.lastDataHashKeys = Object.keys(top.lastDataHash || {}).length; } catch(e) {}
            try { result.choice_lid = top.choice_lid; } catch(e) {}
            try { result.choice_filter = top.choice_filter; } catch(e) {}
            try { result.bodyClassName = document.getElementById('body_show').className; } catch(e) {}
            return result;
        }""")

        print("=== DOM inspection ===")
        for k, v in info.items():
            if isinstance(v, dict):
                print(f"  {k}:")
                for kk, vv in v.items():
                    print(f"    {kk}: {vv}")
            else:
                print(f"  {k}: {v}")

        # Look for any error in console
        print(f"\n=== Console (filtered) ===")
        for m in console_msgs:
            if any(kw in m for kw in ['error', 'ERR', 'LoadGameComplete', '没', 'no Data', 'showNoData', 'noData', 'parseData', 'worker']):
                print(f"  {m[:400]}")

        await browser.close()

asyncio.run(main())
