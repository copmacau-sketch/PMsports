#!/usr/bin/env python3
"""Test convertNodeToHashForGame with our XML response."""
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

        # Manually fetch the XML and test convertNodeToHashForGame
        result = await page.evaluate("""async () => {
            // Get the XML via fetch
            var ts = Date.now();
            var par = "uid=" + top.userData.uid + "&ver=" + top.ver + "&langx=" + top.langx + "&p=get_game_list";
            par += "&p3type=&date=all&gtype=ft&showtype=early&rtype=r&ltype=4&filter=FU&cupFantasy=N&lid=1001&action=click_league&sorttype=L&specialClick=&isFantasy=N&ts=" + ts + "&chgSortTS=" + ts;
            var resp = await fetch(top.m2_url, {method: 'POST', headers: {'Content-Type':'application/x-www-form-urlencoded'}, body: par});
            var xml_str = await resp.text();
            
            var util = new Util(window, document);
            var util_game = new Util_game(window, document);
            var xmlnode = util.parseXml(xml_str);
            var Root = xmlnode.Root[0];
            
            // Test convertNodeToHashForGame
            var GameHash;
            var err = '';
            try {
                GameHash = util_game.convertNodeToHashForGame(Root);
            } catch(e) {
                err = e.toString();
            }
            
            var ret = {
                xml_len: xml_str.length,
                root_children_count: Root.children.length,
                first_5_children: [],
                err: err,
            };
            // List first 5 children to see what they are
            for (var i = 0; i < Math.min(Root.children.length, 5); i++) {
                var c = Root.children[i];
                ret.first_5_children.push({
                    tagName: c.tagName,
                    id: c.id,
                    hasAttr_hasEC: c.getAttribute('hasEC'),
                    hasFirstChild: !!c.children[0],
                    firstChildTag: c.children[0] ? c.children[0].tagName : '',
                    childrenCount: c.children.length,
                });
            }
            if (GameHash) {
                ret.gameHashArray = GameHash.ary ? GameHash.ary.length : -1;
                ret.gameHashObjKeys = GameHash.obj ? Object.keys(GameHash.obj).length : -1;
                if (GameHash.ary && GameHash.ary.length > 0) {
                    var firstKey = GameHash.ary[0];
                    ret.firstGameKey = firstKey;
                    ret.firstGameKeys = Object.keys(GameHash.obj[firstKey] || {});
                }
            }
            return ret;
        }""")

        import json
        print(json.dumps(result, indent=2, ensure_ascii=False))

        await browser.close()

asyncio.run(main())
