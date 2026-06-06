#!/usr/bin/env python3
"""Click the hamburger on /agents/ post-login and capture sidebar menu items."""
import asyncio
import json
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"
OUT = "/Volumes/T7/Crown-gold/.notes"

CASES = [
    {"path": "/agents/", "user": "d111111", "pwd": "Aa12345678", "safe": "Aa123123", "tab": "A", "label": "co_d111111"},
    {"path": "/agents/", "user": "d222222", "pwd": "Aa12345678", "safe": "Aa123123", "tab": "B", "label": "su_d222222"},
    {"path": "/agents/", "user": "sealin11","pwd": "Sealin1226", "safe": "",         "tab": "C", "label": "ag_sealin11"},
]


async def probe(p, c):
    rec = {"case": c}
    browser = await p.chromium.launch(headless=True)
    ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
    page = await ctx.new_page()
    print(f"\n=== {c['label']} ===")
    await page.goto(BASE + c["path"], wait_until="domcontentloaded", timeout=30000)
    await asyncio.sleep(2)
    if c["tab"]:
        await page.click("#btn_" + c["tab"])
        await asyncio.sleep(0.4)
    await page.fill("#username", c["user"])
    await page.fill("#pwd", c["pwd"])
    if c["safe"]:
        await page.fill("#pwd_safe", c["safe"])
    await page.click("#loginBtn")
    await asyncio.sleep(8)

    # try to click hamburger
    for sel in ["#mu_hab", ".mu_hab", "[id*='mu_hab']", "button[id*='hab']", ".hamburger"]:
        try:
            el = await page.query_selector(sel)
            if el and await el.is_visible():
                await el.click()
                print(f"  clicked {sel}")
                rec["clicked"] = sel
                break
        except Exception as e:
            pass

    await asyncio.sleep(1)
    await page.screenshot(path=f"{OUT}/probe_sidebar_{c['label']}.png", full_page=True)

    # capture all visible <a>, <li>, <div> with text under aside / nav
    rec["sidebar_items"] = await page.evaluate("""() => {
        const candidates = [
            'aside', 'nav', '[class*="menu"]', '[class*="sidebar"]', '[class*="le_"]',
            '[id*="menu"]', '[id*="sidebar"]'
        ];
        const found = new Set();
        candidates.forEach(sel => {
            document.querySelectorAll(sel).forEach(node => {
                if (node.offsetParent !== null) found.add(node);
            });
        });
        const out = [];
        found.forEach(node => {
            node.querySelectorAll('li, a, div, span').forEach(child => {
                const text = (child.innerText || '').trim();
                if (text && text.length < 25 && child.offsetParent !== null) {
                    out.push({
                        tag: child.tagName,
                        id: child.id || '',
                        cls: child.className || '',
                        text: text.substring(0, 25)
                    });
                }
            });
        });
        // dedupe by text
        const seen = new Set();
        return out.filter(o => { if (seen.has(o.text)) return false; seen.add(o.text); return true; });
    }""")

    # also get all top-level text in the page (after hamburger expand)
    rec["all_text_unique"] = await page.evaluate("""() => {
        const out = new Set();
        document.querySelectorAll('a, li, button, [role="button"], h1, h2, h3, .text, [class*="title"]').forEach(el => {
            if (el.offsetParent === null) return;
            const t = (el.innerText || '').trim();
            if (t && t.length < 30) out.add(t);
        });
        return [...out];
    }""")

    await browser.close()
    return rec


async def main():
    async with async_playwright() as p:
        results = []
        for c in CASES:
            r = await probe(p, c)
            results.append(r)
            print(f"  sidebar items: {len(r.get('sidebar_items',[]))}")
            print(f"  unique texts: {len(r.get('all_text_unique',[]))}")
            for t in r.get('all_text_unique', [])[:30]:
                print(f"    · {t}")

    with open(f"{OUT}/probe_sidemenu.json", "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {OUT}/probe_sidemenu.json")


if __name__ == "__main__":
    asyncio.run(main())
