#!/usr/bin/env python3
"""Detailed debug of game_list loading after league click."""
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

        requests_seen = []
        async def on_req(req):
            if 'transform.php' not in req.url:
                return
            try:
                data = req.post_data
            except:
                data = ''
            if data and 'get_game_list' in data:
                requests_seen.append({'url': req.url, 'data': data})
        page.on("request", on_req)

        responses_seen = []
        async def on_resp(resp):
            if 'transform.php' not in resp.url:
                return
            try:
                body = await resp.text()
            except:
                return
            if '<ec ' in body[:1000] or 'get_game_list' in body[:200]:
                # Extract key fields
                import re
                code = re.search(r'<code>(.*?)</code>', body)
                ts = re.search(r'<ts>(.*?)</ts>', body)
                chgsortts = re.search(r'<chgsortts>(.*?)</chgsortts>', body)
                nst = re.search(r'<nowShowtype>(.*?)</nowShowtype>', body)
                total = re.search(r'<totalDataCount>(.*?)</totalDataCount>', body)
                ec_count = body.count('<ec ')
                responses_seen.append({
                    'len': len(body),
                    'code': code.group(1) if code else '',
                    'ts': ts.group(1) if ts else '',
                    'chgsortts': chgsortts.group(1) if chgsortts else '',
                    'nowShowtype': nst.group(1) if nst else '',
                    'total': total.group(1) if total else '',
                    'ec_count': ec_count,
                })
        page.on("response", on_resp)

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
        await asyncio.sleep(15)

        print("=== get_game_list requests ===")
        for r in requests_seen:
            print(f"  data: {r['data'][:500]}")

        print(f"\n=== game_list responses ({len(responses_seen)}) ===")
        for r in responses_seen:
            print(f"  Len={r['len']} code='{r['code']}' ts={r['ts']} chgsortts={r['chgsortts']} nowShowtype={r['nowShowtype']} total={r['total']} ec_count={r['ec_count']}")

        # Critical console messages
        print(f"\n=== Console (filtered) ===")
        for m in console_msgs:
            if any(k in m for k in ['LoadGameComplete', 'getData', 'TS', '阻擋', '錯誤', 'ts錯', '不繼續', 'chgSort', 'nowShowtype', 'noData', 'error']):
                print(f"  {m[:400]}")

        await browser.close()

asyncio.run(main())
