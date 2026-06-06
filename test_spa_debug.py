#!/usr/bin/env python3
"""Debug SPA - capture network requests to transform.php and check responses."""
import asyncio
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 900})

        console_msgs = []
        page.on("console", lambda msg: console_msgs.append(f"[{msg.type}] {msg.text[:300]}"))

        transform_calls = []
        async def on_response(resp):
            url = resp.url
            if 'transform.php' in url:
                try:
                    body = await resp.text()
                except:
                    body = '<could not read>'
                transform_calls.append({
                    'url': url,
                    'status': resp.status,
                    'body_len': len(body),
                    'body_start': body[:500],
                })

        page.on("response", on_response)

        print("[1] Loading login page...")
        await page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)

        print("[2] Logging in...")
        await page.fill("#usr", "ceshi1")
        await page.fill("#pwd", "Abc12345")
        await page.click("button[type='submit']")

        print("[3] Waiting 30s...")
        await asyncio.sleep(30)

        print(f"\n=== Transform.php calls ({len(transform_calls)}) ===")
        for i, tc in enumerate(transform_calls):
            print(f"\n  [{i}] Status={tc['status']} Len={tc['body_len']}")
            # Extract the 'p' parameter
            import urllib.parse
            parsed = urllib.parse.urlparse(tc['url'])
            print(f"  URL: {tc['url'][:120]}")
            print(f"  Body: {tc['body_start'][:300]}")

        print(f"\n=== Console msgs ({len(console_msgs)}) ===")
        for m in console_msgs[-30:]:
            print(f"  {m[:200]}")

        # Check for errors
        errors = [m for m in console_msgs if 'error' in m.lower() or 'Error' in m]
        if errors:
            print(f"\n=== Errors ({len(errors)}) ===")
            for e in errors[:15]:
                print(f"  {e[:200]}")

        await browser.close()

asyncio.run(main())
