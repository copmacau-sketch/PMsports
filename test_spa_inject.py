#!/usr/bin/env python3
"""Inject debug logging into workerPost and parseGameList."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:600]}"))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(10)

        # Inject hooks before clicking the league
        await page.evaluate("""() => {
            // Hook bodyFrame (which is league_index)
            if (typeof bodyFrame !== 'undefined' && bodyFrame) {
                console.log('[INJECT] bodyFrame exists');
            }
            // Hook into workerThrough on the main thread when game_list initializes
            // Use Object.defineProperty for top.lastDataHash to log writes
            var _ld = top.lastDataHash || {};
            try {
                Object.defineProperty(top, 'lastDataHash', {
                    get: function() { return _ld; },
                    set: function(v) {
                        var ks = v ? Object.keys(v).length : 0;
                        console.log('[INJECT] top.lastDataHash set to ' + ks + ' keys');
                        _ld = v;
                    },
                    configurable: true
                });
            } catch(e) { console.log('[INJECT] defineProp err ' + e); }
        }""")

        # Click league 英超
        await page.evaluate("() => { var el = document.querySelector('[id^=\"league_1001\"]'); if(el) el.click(); }")

        # Wait for the league_list_FT to load, then hook parseGameList
        await asyncio.sleep(5)

        # Try hooking workerThrough and parseGameList after they get instantiated
        await page.evaluate("""() => {
            try {
                if (bodyFrame && bodyFrame.parseGameList) {
                    var orig = bodyFrame.parseGameList;
                    bodyFrame.parseGameList = function(_ret) {
                        var d = _ret && _ret.tmpDiv ? _ret.tmpDiv : '';
                        console.log('[INJECT] parseGameList called. tmpDiv length=' + (d ? d.length : 'null') + ', is allZero=' + (d === 'allZero'));
                        if (_ret) {
                            console.log('[INJECT] ret keys=' + Object.keys(_ret).join(','));
                            console.log('[INJECT] totalLeg=' + (_ret.totalLeg ? _ret.totalLeg.length : 'null') + ', rowAry=' + (_ret.rowAry ? _ret.rowAry.length : 'null'));
                        }
                        return orig.apply(this, arguments);
                    };
                    console.log('[INJECT] parseGameList hooked');
                }
                if (bodyFrame && bodyFrame.workerThrough) {
                    var orig2 = bodyFrame.workerThrough;
                    bodyFrame.workerThrough = function(e) {
                        var ed = e && e.data ? e.data : null;
                        console.log('[INJECT] workerThrough called. action=' + (ed && ed.action ? ed.action : 'no-action') + ', tmpDiv=' + (ed && ed.tmpDiv ? ed.tmpDiv.length : 'no-tmpDiv'));
                        return orig2.apply(this, arguments);
                    };
                    console.log('[INJECT] workerThrough hooked');
                }
                if (bodyFrame && bodyFrame.showNoData) {
                    var orig3 = bodyFrame.showNoData;
                    bodyFrame.showNoData = function(isShow) {
                        console.log('[INJECT] showNoData(' + isShow + ') called from: ' + (new Error()).stack.split(chr(10))[2]);
                        return orig3.apply(this, arguments);
                    };
                    console.log('[INJECT] showNoData hooked');
                }
            } catch(e) {
                console.log('[INJECT] hook err: ' + e.toString());
            }
        }""".replace("chr(10)", "'\\n'"))

        await asyncio.sleep(20)

        print(f"\n=== Console ({len(console_msgs)} total) ===")
        for m in console_msgs:
            if 'INJECT' in m or 'LoadGameComplete' in m or 'getData' in m or 'tmpDiv' in m or 'allZero' in m or 'parseGameList' in m:
                print(f"  {m[:400]}")

        await browser.close()

asyncio.run(main())
