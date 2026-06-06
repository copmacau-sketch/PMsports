#!/usr/bin/env python3
"""Check iframe loading and capture errors from all frames."""
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

        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:400]))

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        print("=== Before click ===")
        frames = page.frames
        print(f"Frames: {len(frames)}")
        for f in frames:
            print(f"  '{f.name}': {f.url[:80]}")

        # Click early tab
        for f in page.frames:
            try:
                el = await f.query_selector("text=早盘")
                if el:
                    await el.click()
                    print(f"\n[*] Clicked 早盘 in frame '{f.name or 'main'}'")
                    break
            except:
                pass

        await asyncio.sleep(15)

        print("\n=== After click ===")
        frames = page.frames
        print(f"Frames: {len(frames)}")
        for f in frames:
            title = ""
            try:
                title = await f.evaluate("document.title")
            except:
                pass
            print(f"  '{f.name}': {f.url[:80]} title='{title}'")

        # Page errors
        if page_errors:
            print(f"\n=== Page errors ({len(page_errors)}) ===")
            for e in page_errors[:10]:
                print(f"  {e[:300]}")

        # Console errors
        errors = [m for m in console_msgs if 'error' in m.lower() or 'WIN_ERR' in m]
        if errors:
            print(f"\n=== Console errors ({len(errors)}) ===")
            for e in errors[:20]:
                print(f"  {e[:300]}")

        # All console
        print(f"\n=== All console ({len(console_msgs)}) ===")
        for m in console_msgs[-30:]:
            print(f"  {m[:200]}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_iframe.png", full_page=False)
        await browser.close()

asyncio.run(main())
