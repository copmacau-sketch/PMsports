#!/usr/bin/env python3
"""Capture worker errors and inspect game data in DOM."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        console.error('WIN_ERR: ' + e.message + ' at ' + (e.filename||'') + ':' + e.lineno);
    });
    window.addEventListener('unhandledrejection', function(e) {
        console.error('UNHANDLED_REJ: ' + (e.reason && e.reason.toString ? e.reason.toString() : e.reason));
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
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:600]}"))

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

        # Inspect critical state in main thread
        state = await page.evaluate("""() => {
            var result = {};
            try { result.lastDataHashKeys = Object.keys(top.lastDataHash || {}).length; } catch(e) {result.lastDataHashErr = e.toString();}
            try {
                var div_show = document.getElementById('div_show');
                result.div_show_innerHTML_len = div_show ? div_show.innerHTML.length : -1;
                result.div_show_text = div_show ? div_show.innerText.substring(0, 200) : '';
            } catch(e) {result.divShowErr = e.toString();}
            try {
                var div_nodata = document.getElementById('div_nodata');
                result.div_nodata_display = div_nodata ? window.getComputedStyle(div_nodata).display : 'no-elem';
                result.div_nodata_text = div_nodata ? div_nodata.innerText.substring(0, 100) : '';
            } catch(e) {}
            try {
                result.choice_rtype = top.choice_rtype;
                result.choice_filter = top.choice_filter;
                result.choice_sorttype = top.choice_sorttype;
                result.page_sw = top.page_sw;
            } catch(e) {}
            // Find the most recent game template element
            try {
                var models = document.querySelectorAll('[id^="model_"]');
                result.modelCount = models.length;
                result.modelIds = [];
                for (var i = 0; i < Math.min(models.length, 15); i++) {
                    result.modelIds.push(models[i].id);
                }
            } catch(e) {}
            return result;
        }""")

        print("=== State ===")
        for k, v in state.items():
            print(f"  {k}: {v}")

        # Filter console for worker, parseGameList, parseData
        print(f"\n=== Console (worker/render related) ===")
        for m in console_msgs:
            if any(kw in m for kw in ['Worker', 'worker', 'parseGameList', 'parseData', 'showNoData', 'tmpDiv', 'allZero', 'LoadGameComplete', 'getData', '错误', '错误', 'error']):
                print(f"  {m[:400]}")

        await browser.close()

asyncio.run(main())
