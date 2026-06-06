#!/usr/bin/env python3
"""Capture ALL responses after clicking 早盘 to see what's loading."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:300]}"))
        
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)[:300]))

        responses_after_click = []
        capture = False
        async def on_response(resp):
            if not capture:
                return
            try:
                ct = resp.headers.get('content-type', '')
                body = await resp.text() if len(ct) < 200 else ''
            except:
                body = ''
            responses_after_click.append({
                'url': resp.url[:120],
                'status': resp.status,
                'ct': ct[:60],
                'len': len(body),
                'start': body[:200],
            })

        page.on("response", on_response)

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        # Enable capture
        capture = True

        # Click early tab
        print("[*] Clicking 早盘 tab...")
        for f in page.frames:
            try:
                el = await f.query_selector("text=早盘")
                if el:
                    await el.click()
                    print(f"  Clicked in frame: {f.name or 'main'}")
                    break
            except:
                pass

        await asyncio.sleep(15)

        print(f"\n=== Responses after click ({len(responses_after_click)}) ===")
        for i, r in enumerate(responses_after_click):
            print(f"  [{i}] {r['status']} {r['ct'][:40]} Len={r['len']} {r['url'][:80]}")
            if r['len'] < 3000 and r['start']:
                print(f"       {r['start'][:150]}")

        # Errors
        if page_errors:
            print(f"\n=== Page errors ({len(page_errors)}) ===")
            for e in page_errors[:10]:
                print(f"  {e}")

        # Console
        relevant = [m for m in console_msgs if any(k in m.lower() for k in ['error','game','load','nodata','worker'])]
        if relevant:
            print(f"\n=== Console ({len(relevant)}) ===")
            for m in relevant[:20]:
                print(f"  {m[:200]}")

        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_allresp.png", full_page=False)
        await browser.close()

asyncio.run(main())
