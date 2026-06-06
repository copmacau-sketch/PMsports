#!/usr/bin/env python3
"""Test if game_list data from CatalogBridge is delivered and processed."""
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
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:400]}"))

        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:400]))

        game_responses = []
        async def on_response(resp):
            url = resp.url
            if 'transform.php' in url:
                try:
                    body = await resp.text()
                except:
                    body = ''
                if '<ec ' in body or '<pgcount' in body or 'get_game' in body:
                    game_responses.append({'len': len(body), 'body': body[:1500]})

        page.on("response", on_response)

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(20)

        # Take initial screenshot
        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_games1.png", full_page=False)

        # Try clicking on frames for tabs
        frames = page.frames
        print(f"Frames: {len(frames)}")
        for f in frames:
            print(f"  {f.name}: {f.url[:80]}")

        # Find the game/sport frame and click tabs
        for f in frames:
            try:
                earlyTab = await f.query_selector("text=早盘")
                if earlyTab:
                    print(f"  Found '早盘' in frame {f.name}")
                    await earlyTab.click()
                    await asyncio.sleep(8)
                    break
            except:
                pass
        
        # Second screenshot after clicking
        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_games2.png", full_page=False)

        # Show game responses
        print(f"\n=== Game responses ({len(game_responses)}) ===")
        for i, r in enumerate(game_responses):
            print(f"\n  [{i}] Len={r['len']}")
            print(f"  {r['body'][:600]}")

        # Show errors
        if page_errors:
            print(f"\n=== Page errors ({len(page_errors)}) ===")
            for e in page_errors:
                print(f"  {e}")

        # Show relevant console
        relevant = [m for m in console_msgs if any(k in m.lower() for k in ['error', 'game', 'ec', 'nodata', 'loadgame', 'parsedata'])]
        print(f"\n=== Relevant console ({len(relevant)}) ===")
        for m in relevant[:20]:
            print(f"  {m[:200]}")

        # Body text
        body_text = await page.evaluate("() => document.body.innerText.substring(0, 400)")
        print(f"\n=== Body text ===\n{body_text[:300]}")

        await browser.close()

asyncio.run(main())
