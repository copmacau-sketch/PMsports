#!/usr/bin/env python3
"""Inspect game model templates after league click."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        page.on("console", lambda msg: print(f"[CONS][{msg.type}] {msg.text[:300]}"))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(10)

        await page.evaluate("() => { var el = document.querySelector('[id^=\"league_1001\"]'); if(el) el.click(); }")
        await asyncio.sleep(15)

        # Look for ALL elements with id starting with 'model_' or 'div_'
        info = await page.evaluate("""() => {
            var result = {};
            var all = document.querySelectorAll('[id]');
            result.models = [];
            result.divs = [];
            for (var i = 0; i < all.length; i++) {
                var id = all[i].id;
                if (id.indexOf('model_') === 0) result.models.push(id);
                if (id.indexOf('div_') === 0) result.divs.push(id);
            }
            // div_show specifically
            var div_show = document.getElementById('div_show');
            if (div_show) {
                result.div_show_innerHTML = div_show.innerHTML.substring(0, 300);
                result.div_show_parent_id = div_show.parentElement ? div_show.parentElement.id : '';
            }
            // Check the gtype model identifier
            try { result.choice_gtype = top.choice_gtype; } catch(e){}
            try { result.choice_showtype = top.choice_showtype; } catch(e){}
            // Look for any element with name 'model_game' or similar
            ['model_game','model_game_ft','model_game_FT','model_game_main','model_FT','model_FT_main'].forEach(function(mid){
                var el = document.getElementById(mid);
                if (el) result['has_' + mid] = true;
            });
            return result;
        }""")

        print("=== Models ===")
        for m in info.get('models', []):
            print(f"  {m}")
        print(f"\n=== Divs ({len(info.get('divs', []))}) ===")
        for d in info.get('divs', [])[:40]:
            print(f"  {d}")
        print(f"\nchoice_gtype: {info.get('choice_gtype')}")
        print(f"choice_showtype: {info.get('choice_showtype')}")
        print(f"div_show innerHTML: {info.get('div_show_innerHTML', '')[:200]}")
        print(f"div_show parent: {info.get('div_show_parent_id', '')}")

        await browser.close()

asyncio.run(main())
