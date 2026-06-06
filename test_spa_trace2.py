#!/usr/bin/env python3
"""Inject more targeted debugging via top context."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:800]}"))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) el.click(); }")
        await asyncio.sleep(10)

        # Click league
        await page.evaluate("() => { var el = document.querySelector('[id^=\"league_1001\"]'); if(el) el.click(); }")

        # Wait briefly, then try to find bodyFrame
        await asyncio.sleep(3)

        await page.evaluate("""() => {
            // Find bodyFrame - could be in top window
            var bf = top.bodyFrame;
            console.log('[INJECT] top.bodyFrame exists: ' + !!bf);
            if (bf) {
                console.log('[INJECT] bf.parseData exists: ' + !!bf.parseData);
                console.log('[INJECT] bf.parseGameList exists: ' + !!bf.parseGameList);
                console.log('[INJECT] bf.workerThrough exists: ' + !!bf.workerThrough);
            }
            // Try all global frames
            var frames = window.frames;
            console.log('[INJECT] num frames=' + frames.length);
        }""")

        await asyncio.sleep(3)

        # Hook parseGameList and workerThrough via top
        result = await page.evaluate("""() => {
            var bf = top.bodyFrame;
            var hooked = {};
            if (!bf) return {err: 'no bodyFrame'};
            
            try {
                var origPGL = bf.parseGameList;
                bf.parseGameList = function(_ret) {
                    var d = _ret && _ret.tmpDiv ? _ret.tmpDiv : '';
                    console.log('[INJECT] parseGameList tmpDiv_len=' + (d ? d.length : 'null') + ', is_allZero=' + (d === 'allZero') + ', tmpDiv_preview=' + (typeof d === 'string' ? d.substring(0, 100) : ''));
                    return origPGL.apply(this, arguments);
                };
                hooked.parseGameList = true;
            } catch(e) { hooked.err1 = e.toString(); }
            
            try {
                var origWT = bf.workerThrough;
                bf.workerThrough = function(e) {
                    var ed = e && e.data ? e.data : null;
                    console.log('[INJECT] workerThrough action=' + (ed && ed.action) + ', has_tmpDiv=' + !!(ed && ed.tmpDiv) + ', tmpDiv_len=' + (ed && ed.tmpDiv ? ed.tmpDiv.length : 'N'));
                    return origWT.apply(this, arguments);
                };
                hooked.workerThrough = true;
            } catch(e) { hooked.err2 = e.toString(); }

            try {
                var origSND = bf.showNoData;
                bf.showNoData = function(isShow) {
                    if (isShow) {
                        try { throw new Error('trace'); } catch(err) {
                            console.log('[INJECT] showNoData(' + isShow + ') called. Stack: ' + err.stack.split('\\n').slice(1, 4).join(' | '));
                        }
                    }
                    return origSND.apply(this, arguments);
                };
                hooked.showNoData = true;
            } catch(e) { hooked.err3 = e.toString(); }
            
            return hooked;
        }""")
        print(f"Hook result: {result}")

        await asyncio.sleep(25)

        # Final state check
        final = await page.evaluate("""() => {
            return {
                lastDataHashKeys: top.lastDataHash ? Object.keys(top.lastDataHash).length : -1,
                div_show_innerHTML_len: top.bodyFrame && top.document.getElementById('div_show') ? top.document.getElementById('div_show').innerHTML.length : 'na',
            };
        }""")
        print(f"\nFinal state: {final}")

        print(f"\n=== Console ({len(console_msgs)}) ===")
        for m in console_msgs:
            if 'INJECT' in m or 'getData' in m or 'LoadGameComplete' in m or 'workerThrough' in m:
                print(f"  {m[:500]}")

        await browser.close()

asyncio.run(main())
