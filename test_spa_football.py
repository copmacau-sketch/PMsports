#!/usr/bin/env python3
"""Click the football button under early matches to trigger game list loading."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        console.error('WIN_ERR[' + document.title + ']: ' + e.message + ' at ' + (e.filename||'') + ':' + e.lineno);
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

        xml_responses = []
        html_responses = []
        async def on_resp(resp):
            if 'transform.php' not in resp.url:
                return
            try:
                body = await resp.text()
            except:
                return
            ct = resp.headers.get('content-type', '')
            if 'xml' in ct or body[:5] == '<?xml':
                xml_responses.append({'len': len(body), 'start': body[:300]})
            elif 'html' in ct:
                # Extract title
                import re
                m = re.search(r'<title>(.*?)</title>', body[:2000])
                title = m.group(1) if m else 'no-title'
                html_responses.append({'len': len(body), 'title': title})

        page.on("response", on_resp)

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        print(f"Before click: {len(xml_responses)} XML, {len(html_responses)} HTML responses")

        # Find and click the football icon/button under early matches
        # The home page has sport buttons like ft_early_league
        clicked = False

        # Try clicking via JS to trigger the intoGame event
        try:
            result = await page.evaluate("""() => {
                // Look for the football early button
                var el = document.getElementById('ft_early_league') || document.getElementById('h_ft_early_league');
                if (el) {
                    el.click();
                    return 'clicked ft_early_league';
                }
                // Try any element with gtype=ft
                var els = document.querySelectorAll('[gtype="ft"]');
                if (els.length > 0) {
                    els[0].click();
                    return 'clicked gtype=ft element';
                }
                // Look for sport buttons
                var btns = document.querySelectorAll('.btn_sport_new, .btn_sport, .box_sport');
                var info = [];
                for (var i = 0; i < Math.min(btns.length, 10); i++) {
                    info.push(btns[i].id + '|' + btns[i].className + '|' + btns[i].textContent.substring(0, 30));
                }
                return 'not found. buttons: ' + info.join(' // ');
            }""")
            print(f"Click result: {result}")
            clicked = 'clicked' in result
        except Exception as e:
            print(f"Click error: {e}")

        if not clicked:
            # Try clicking by text within body_show
            try:
                await page.click("#body_show >> text=足球", timeout=5000)
                print("Clicked 足球 in body_show")
                clicked = True
            except:
                print("Could not click 足球 in body_show")

        await asyncio.sleep(15)

        print(f"\nAfter click: {len(xml_responses)} XML, {len(html_responses)} HTML responses")

        print(f"\n=== HTML responses ===")
        for i, r in enumerate(html_responses):
            print(f"  [{i}] Len={r['len']} title='{r['title']}'")

        print(f"\n=== XML responses (last 10) ===")
        for r in xml_responses[-10:]:
            has_ec = '<ec ' in r['start']
            has_pg = '<pgcount' in r['start']
            marker = "***" if has_ec or has_pg else "   "
            print(f"  {marker} Len={r['len']} | {r['start'][:120]}")

        # Console
        print(f"\n=== Console ({len(console_msgs)}) ===")
        for m in console_msgs:
            print(f"  {m[:200]}")

        # State
        state = await page.evaluate("""() => {
            try {
                return {
                    choice_gtype: top.choice_gtype,
                    choice_showtype: top.choice_showtype,
                    resizePage: top.resizePage,
                    chgBodyDone: top.chgBodyDone,
                };
            } catch(e) { return {err: e.toString()}; }
        }""")
        print(f"\n=== State: {state}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_football.png", full_page=False)
        await browser.close()

asyncio.run(main())
