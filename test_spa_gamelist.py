#!/usr/bin/env python3
"""Capture game_list requests specifically."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 900})
        page = await ctx.new_page()

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:400]}"))

        all_xml_responses = []
        async def on_response(resp):
            if 'transform.php' not in resp.url:
                return
            try:
                body = await resp.text()
            except:
                return
            # Only capture XML responses (not HTML pages)
            if body.startswith('<?xml') or body.startswith('<serverresponse') or '<code>' in body[:200]:
                all_xml_responses.append({
                    'len': len(body),
                    'body_start': body[:600],
                    'has_ec': '<ec ' in body,
                    'has_pgcount': '<pgcount' in body,
                })

        page.on("response", on_response)

        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")
        await asyncio.sleep(15)

        print(f"=== Before click: {len(all_xml_responses)} XML responses ===")
        for i, r in enumerate(all_xml_responses):
            print(f"  [{i}] Len={r['len']} ec={r['has_ec']} pgcount={r['has_pgcount']} | {r['body_start'][:120]}")

        # Click early tab
        print("\n[*] Clicking 早盘 tab...")
        for f in page.frames:
            try:
                el = await f.query_selector("text=早盘")
                if el:
                    await el.click()
                    print(f"  Clicked in frame: {f.name or 'main'}")
                    break
            except:
                pass

        await asyncio.sleep(12)

        print(f"\n=== After click: {len(all_xml_responses)} XML responses ===")
        for i, r in enumerate(all_xml_responses):
            if r['has_ec'] or r['has_pgcount']:
                print(f"  [{i}] *** Len={r['len']} ec={r['has_ec']} pgcount={r['has_pgcount']}")
                print(f"      {r['body_start'][:300]}")
            else:
                print(f"  [{i}] Len={r['len']} | {r['body_start'][:100]}")

        # screenshot
        await page.screenshot(path="/Volumes/T7/Crown-gold/spa_gamelist.png", full_page=False)

        # Console errors
        errors = [m for m in console_msgs if 'error' in m.lower()]
        if errors:
            print(f"\n=== Errors ({len(errors)}) ===")
            for e in errors[:10]:
                print(f"  {e[:200]}")

        await browser.close()

asyncio.run(main())
