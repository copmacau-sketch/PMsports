#!/usr/bin/env python3
"""Check DOM state after clicking early tab."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        console.error('WIN_ERR[' + document.title + ']: ' + e.message + ' at ' + (e.filename||'inline') + ':' + e.lineno);
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
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:400]}"))

        # Track XML transform requests
        transform_xml = []
        async def on_resp(resp):
            if 'transform.php' not in resp.url:
                return
            ct = resp.headers.get('content-type', '')
            if 'xml' in ct:
                try:
                    body = await resp.text()
                    transform_xml.append({'len': len(body), 'start': body[:300]})
                except:
                    pass

        page.on("response", on_resp)

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        # Check top-level variables
        state_before = await page.evaluate("""() => {
            try {
                return {
                    choice_gtype: top.choice_gtype || '',
                    choice_showtype: top.choice_showtype || '',
                    specialClick: top.specialClick || '',
                    homePage_sw: top.homePage_sw || '',
                    homefirst: top.homefirst || false,
                    m2_url: (top.m2_url || '').substring(0, 60),
                };
            } catch(e) { return {error: e.toString()}; }
        }""")
        print(f"=== State before click: {state_before}")

        # Click early tab
        clicked = False
        for f in page.frames:
            try:
                el = await f.query_selector("text=早盘")
                if el:
                    await el.click()
                    clicked = True
                    print(f"[*] Clicked 早盘")
                    break
            except:
                pass

        await asyncio.sleep(15)

        # Check state after
        state_after = await page.evaluate("""() => {
            try {
                return {
                    choice_gtype: top.choice_gtype || '',
                    choice_showtype: top.choice_showtype || '',
                    pageTS: JSON.stringify(top.pageTS || {}),
                };
            } catch(e) { return {error: e.toString()}; }
        }""")
        print(f"=== State after click: {state_after}")

        # Check iframes content
        frames = page.frames
        for f in frames:
            if f == page.main_frame:
                continue
            try:
                html_len = await f.evaluate("document.documentElement.innerHTML.length")
                title = await f.evaluate("document.title")
                body_text = await f.evaluate("document.body ? document.body.innerText.substring(0, 200) : 'no body'")
                print(f"  Frame '{f.name}': html_len={html_len}, title='{title}', body='{body_text[:100]}'")
            except Exception as e:
                print(f"  Frame '{f.name}': error={str(e)[:100]}")

        # Main page DOM info
        dom_info = await page.evaluate("""() => {
            var body_show = document.getElementById('body_show');
            var game_list = document.getElementById('game_list');
            var league_index = document.getElementById('league_index');
            var bet_game = document.querySelector('.bet_game');
            return {
                body_show: body_show ? body_show.innerHTML.length : 'N/A',
                game_list: game_list ? game_list.innerHTML.length : 'N/A',
                league_index: league_index ? league_index.innerHTML.length : 'N/A',
                bet_game: bet_game ? bet_game.innerHTML.length : 'N/A',
                loading_display: document.getElementById('loading') ? getComputedStyle(document.getElementById('loading')).display : 'N/A',
            };
        }""")
        print(f"=== DOM info: {dom_info}")

        # XML responses
        print(f"\n=== XML transform responses ({len(transform_xml)}) ===")
        for i, r in enumerate(transform_xml):
            has_ec = '<ec ' in r['start']
            has_pg = '<pgcount' in r['start']
            if has_ec or has_pg:
                print(f"  [{i}] *** Len={r['len']} ec={has_ec} pg={has_pg}")
            print(f"  [{i}] Len={r['len']} | {r['start'][:120]}")

        # Console errors
        errors = [m for m in console_msgs if 'error' in m.lower() or 'ERR' in m]
        if errors:
            print(f"\n=== Console errors ({len(errors)}) ===")
            for e in errors[:15]:
                print(f"  {e[:200]}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_dom.png", full_page=False)
        await browser.close()

asyncio.run(main())
