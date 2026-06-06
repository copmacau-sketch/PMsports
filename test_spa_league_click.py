#!/usr/bin/env python3
"""Click a league name in the league list to load the game data."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        var stack = '';
        try { stack = e.error ? e.error.stack : ''; } catch(x){}
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
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:400]}"))
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:400]))

        xml_after_click = []
        capture = False
        async def on_resp(resp):
            if not capture:
                return
            if 'transform.php' not in resp.url:
                return
            try:
                body = await resp.text()
            except:
                return
            ct = resp.headers.get('content-type', '')
            if 'xml' in ct or body[:5] == '<?xml':
                xml_after_click.append({
                    'len': len(body),
                    'has_ec': '<ec ' in body,
                    'code': body[body.find('<code>')+6:body.find('</code>')] if '<code>' in body else '',
                    'start': body[:300],
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
        await asyncio.sleep(12)

        # Enable capture
        capture = True

        # Click a league name (英超)
        result = await page.evaluate("""() => {
            // Find league element by name attribute or check rendered league elements
            var leagues = document.querySelectorAll('[id^="league_1001"]');
            if (leagues.length > 0) { leagues[0].click(); return 'clicked league_1001 (英超)'; }
            // Try the league name link
            var links = document.querySelectorAll('.lea_name, .league_name, [class*="league"]');
            for (var i = 0; i < Math.min(links.length, 5); i++) {
                if (links[i].textContent.includes('英超')) { links[i].click(); return 'clicked 英超 via text: ' + links[i].tagName + '#' + links[i].id; }
            }
            // Try to click on the league row in the classifier
            var lis = document.querySelectorAll('#div_classifier *');
            var info = [];
            for (var i = 0; i < lis.length; i++) {
                if (lis[i].textContent.trim() === '英超' || lis[i].textContent.includes('英超')) {
                    info.push(lis[i].tagName + '#' + lis[i].id + '.' + lis[i].className + ' txt=' + lis[i].textContent.substring(0, 30));
                }
            }
            return 'not clicked. Found refs: ' + info.slice(0, 10).join(' || ');
        }""")
        print(f"Click result: {result}")

        await asyncio.sleep(15)

        print(f"\n=== XML responses after league click ({len(xml_after_click)}) ===")
        for i, r in enumerate(xml_after_click):
            marker = " [EC!]" if r['has_ec'] else ""
            print(f"  [{i}] Len={r['len']} code='{r['code']}'{marker}")
            if r['has_ec']:
                print(f"      {r['start'][:300]}")

        errors = [m for m in console_msgs if 'error' in m.lower() or 'ERR' in m]
        if errors:
            print(f"\n=== Errors ===")
            for e in errors[:10]:
                print(f"  {e[:300]}")

        if page_errors:
            print(f"\n=== Page errors ===")
            for e in page_errors[:5]:
                print(f"  {e[:300]}")

        # Check DOM state
        state = await page.evaluate("""() => {
            var body = document.getElementById('body_show');
            var text = body ? body.innerText.substring(0, 800) : 'N/A';
            return { bodyText: text };
        }""")
        print(f"\n=== Body text after ===\n{state['bodyText'][:800]}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_league_click.png", full_page=False)
        await browser.close()

asyncio.run(main())
