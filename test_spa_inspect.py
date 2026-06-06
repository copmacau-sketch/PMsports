#!/usr/bin/env python3
"""Deep inspection of main_content after league click."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(10)

        await page.evaluate("() => { var el = document.querySelector('[id^=\"league_1001\"]'); if(el) el.click(); }")
        await asyncio.sleep(20)

        # Dump main_content structure
        info = await page.evaluate("""() => {
            var main = document.getElementById('main_content');
            if (!main) return {err: 'no main_content'};
            // List all elements with id within main_content
            var ids = [];
            var allWithId = main.querySelectorAll('[id]');
            for (var i = 0; i < allWithId.length; i++) {
                ids.push(allWithId[i].tagName + '#' + allWithId[i].id + (allWithId[i].style.display === 'none' ? '(hidden)' : ''));
            }
            // div_show specifically
            var div_show = document.getElementById('div_show');
            return {
                main_length: main.innerHTML.length,
                main_text_preview: main.innerText.substring(0, 200),
                ids_count: ids.length,
                ids: ids.slice(0, 50),
                div_show_html: div_show ? div_show.innerHTML.substring(0, 500) : 'none',
                div_show_parent: div_show && div_show.parentElement ? div_show.parentElement.id : 'no parent',
                div_show_display: div_show ? window.getComputedStyle(div_show).display : 'no elem',
            };
        }""")

        print(f"main_content length: {info.get('main_length')}")
        print(f"main_content text: {info.get('main_text_preview')}")
        print(f"div_show parent: {info.get('div_show_parent')}")
        print(f"div_show display: {info.get('div_show_display')}")
        print(f"div_show innerHTML[:500]:")
        print(f"  {info.get('div_show_html', '')[:500]}")
        print(f"\n=== IDs inside main_content ({info.get('ids_count', 0)}) ===")
        for id_str in info.get('ids', []):
            print(f"  {id_str}")

        await browser.close()

asyncio.run(main())
