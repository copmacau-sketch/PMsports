#!/usr/bin/env python3
"""Full test: login, click football early, capture all XML responses."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

INIT = r"""
(function(){
    window.addEventListener('error', function(e) {
        var stack = '';
        try { stack = e.error ? e.error.stack : ''; } catch(x){}
        console.error('WIN_ERR: ' + e.message + '\nFile: ' + (e.filename||'') + ':' + e.lineno + ':' + e.colno + '\nStack: ' + stack);
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

        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:500]))

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
                    'has_pg': 'pgcount' in body,
                    'start': body[:400],
                })

        page.on("response", on_resp)

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        # Enable capture
        capture = True

        # Click football early button
        result = await page.evaluate("() => { var el = document.getElementById('ft_early_league'); if(el) { el.click(); return 'clicked'; } return 'not found'; }")
        print(f"Click: {result}")

        # Wait longer for page to load and make data requests
        await asyncio.sleep(25)

        print(f"\n=== XML responses after click ({len(xml_after_click)}) ===")
        for i, r in enumerate(xml_after_click):
            marker = ""
            if r['has_ec']: marker += " [EC!]"
            if r['has_pg']: marker += " [PGCOUNT!]"
            print(f"  [{i}] Len={r['len']}{marker}")
            if r['has_ec'] or r['has_pg'] or r['len'] > 2000:
                print(f"      {r['start'][:300]}")

        # Errors
        errors = [m for m in console_msgs if 'error' in m.lower() or 'ERR' in m]
        if errors:
            print(f"\n=== Errors ({len(errors)}) ===")
            for e in errors:
                print(f"  {e[:400]}")

        if page_errors:
            print(f"\n=== Page errors ===")
            for e in page_errors:
                print(f"  {e}")

        # Check DOM state
        state = await page.evaluate("""() => {
            var body = document.getElementById('body_show');
            var text = body ? body.innerText.substring(0, 500) : 'N/A';
            return { bodyText: text };
        }""")
        print(f"\n=== Body text ===\n{state['bodyText'][:400]}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_final.png", full_page=False)
        await browser.close()

asyncio.run(main())
