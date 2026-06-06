#!/usr/bin/env python3
"""Inspect what tmp_game looks like after parsing."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        await ctx.route("**/*", lambda route: route.continue_(headers={**route.request.headers, "Cache-Control": "no-cache, no-store", "Pragma": "no-cache"}))
        page = await ctx.new_page()

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        result = await page.evaluate("""async () => {
            var ts = Date.now();
            var par = "uid=" + top.userData.uid + "&ver=" + top.ver + "&langx=" + top.langx + "&p=get_game_list";
            par += "&p3type=&date=all&gtype=ft&showtype=early&rtype=r&ltype=4&filter=FU&cupFantasy=N&lid=1001&action=click_league&sorttype=L&specialClick=&isFantasy=N&ts=" + ts + "&chgSortTS=" + ts;
            var resp = await fetch(top.m2_url, {method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: par});
            var xml_str = await resp.text();
            
            // Find <ratio_re> in raw XML
            var idx = xml_str.indexOf('<ratio_re>');
            var idx2 = xml_str.indexOf('<strong>');
            
            var util = new Util(window, document);
            var util_game = new Util_game(window, document);
            var xmlnode = util.parseXml(xml_str);
            var GameHash = util_game.convertNodeToHashForGame(xmlnode.Root[0]);
            var firstKey = GameHash.ary[0];
            var firstGame = GameHash.obj[firstKey];
            
            return {
                xml_has_ratio_re: idx >= 0,
                xml_ratio_re_snippet: idx >= 0 ? xml_str.substring(idx, idx + 80) : 'NOT FOUND',
                xml_has_strong: idx2 >= 0,
                xml_strong_snippet: idx2 >= 0 ? xml_str.substring(idx2, idx2 + 80) : 'NOT FOUND',
                game_keys_with_ratio: Object.keys(firstGame).filter(k => k.includes('ratio') || k.includes('strong')),
                ratio_re_val: firstGame['ratio_re'],
                ratio_reh_val: firstGame['ratio_reh'],
                strong_val: firstGame['strong'],
                ratio_rou_val: firstGame['ratio_rou'],
            };
        }""")

        import json
        print(json.dumps(result, indent=2, ensure_ascii=False))

        await browser.close()

asyncio.run(main())
