#!/usr/bin/env python3
"""Probe /admin/, /d0/, /agents/ login pages + post-login UI on Crown-Gold.

We capture:
  - Login form fields (incl. 登1/登2/登3 tabs)
  - Login response payload (cookies, top.* globals)
  - Left menu items + visibility per layer
  - Top menu items + visibility per layer

Outputs JSON to /Volumes/T7/Crown-gold/.notes/probe_admins.json and
screenshots under /Volumes/T7/Crown-gold/.notes/probe_*.png.
"""
import asyncio
import json
import os
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"
OUT_DIR = "/Volumes/T7/Crown-gold/.notes"

# uid/name + plain pw + which login tab (only matters on /agents/)
CASES = [
    # /admin/ - admin table
    {"url": "/admin/",  "user": "abu777",   "pwd": "Aa123456",   "safe": "",         "tab": None, "label": "admin_abu777_lv0"},
    {"url": "/admin/",  "user": "admin1",   "pwd": "Aa123456",   "safe": "",         "tab": None, "label": "admin_admin1_lv1"},
    {"url": "/admin/",  "user": "Aa100000", "pwd": "Aa11223344", "safe": "",         "tab": None, "label": "admin_Aa100000_master"},
    # /d0/ - rank level 4
    {"url": "/d0/",     "user": "d010101",  "pwd": "Aa12345678", "safe": "",         "tab": None, "label": "d0_d010101"},
    # /agents/ - level 3 (登1 / CO)
    {"url": "/agents/", "user": "d111111",  "pwd": "Aa12345678", "safe": "Aa123123", "tab": "A",  "label": "ag_d111111_co"},
    # /agents/ - level 2 (登2 / SU)
    {"url": "/agents/", "user": "d222222",  "pwd": "Aa12345678", "safe": "Aa123123", "tab": "B",  "label": "ag_d222222_su"},
    # /agents/ - level 1 (登3 / AG)
    {"url": "/agents/", "user": "aa1002",   "pwd": "aa123123",   "safe": "",         "tab": "C",  "label": "ag_aa1002_ag"},
]


async def probe(p, c):
    rec = {"case": c, "logs": [], "errors": [], "login_resp": None}
    browser = await p.chromium.launch(headless=True)
    ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
    page = await ctx.new_page()
    page.on("console", lambda m: rec["logs"].append(f"[{m.type}] {m.text[:300]}"))
    page.on("pageerror", lambda e: rec["errors"].append(str(e)[:400]))

    url = BASE + c["url"]
    print(f"\n========== {c['label']}  →  {url} ==========")
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)

        # screenshot login page
        await page.screenshot(path=f"{OUT_DIR}/probe_login_{c['label']}.png", full_page=False)

        # inventory login form
        login_form = await page.evaluate("""() => {
            const fields = {};
            ['username','pwd','pwd_safe','verifycode','remember','forgot_pwd',
             'btn_A','btn_B','btn_C','loginBtn','loginoldBtn','lang_btn',
             'zh_cn','zh_tw','en_us','sel_lang'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    fields[id] = {
                        tag: el.tagName,
                        type: el.getAttribute('type') || '',
                        placeholder: el.getAttribute('placeholder') || '',
                        text: (el.innerText || el.value || '').substring(0,40),
                        visible: el.offsetParent !== null
                    };
                }
            });
            return fields;
        }""")
        rec["login_form"] = login_form

        # click the tab if needed
        if c["tab"]:
            btn = "btn_" + c["tab"]
            try:
                await page.click("#" + btn)
                await asyncio.sleep(0.5)
                print(f"  clicked tab {btn}")
            except Exception as e:
                rec["errors"].append(f"tab_click {btn}: {e}")

        # fill creds
        await page.fill("#username", c["user"])
        await page.fill("#pwd", c["pwd"])
        if c["safe"]:
            try:
                await page.fill("#pwd_safe", c["safe"])
            except Exception:
                pass

        # verifycode (admin / d0 only). We try to skip by overriding window.alert
        # The server WILL reject without a code; we capture the resp regardless.
        if await page.query_selector("#verifycode"):
            # try to read the captcha image and OCR? Skip - we'll observe error
            try:
                await page.fill("#verifycode", "0000")
            except Exception:
                pass

        # capture network resp during login
        login_resp = {}
        async def on_resp(resp):
            if "transform" in resp.url or "chk_login" in resp.url:
                try:
                    body = await resp.text()
                except Exception:
                    body = ""
                login_resp.setdefault("calls", []).append({
                    "url": resp.url,
                    "status": resp.status,
                    "body": body[:1200]
                })
        page.on("response", on_resp)

        # click login
        for sel in ["#loginBtn", "button[type=submit]", "input[type=submit]"]:
            el = await page.query_selector(sel)
            if el:
                try:
                    await el.click()
                    break
                except Exception:
                    continue
        await asyncio.sleep(6)

        rec["login_resp"] = login_resp

        # capture URL after login + page state
        rec["final_url"] = page.url
        rec["title"] = await page.title()

        # capture top.* globals
        state = await page.evaluate("""() => {
            const t = (window.top || window);
            return {
                login_layer: t.login_layer || null,
                username: t.username || null,
                user_id: t.user_id || null,
                layer_id: t.layer_id || null,
                pri_type: t.pri_type || null,
                user_type: t.user_type || null,
                user_enable: t.user_enable || null,
                uid: t.uid || null
            };
        }""")
        rec["top_state"] = state

        # screenshot after-login
        await page.screenshot(path=f"{OUT_DIR}/probe_after_{c['label']}.png", full_page=True)

        # left menu inventory
        rec["left_menu"] = await page.evaluate("""() => {
            const out = [];
            const root = document.querySelector('.le_smallG, #le_smallG, .le_main, #left_menu, .le_main_smallG');
            if (!root) return [];
            root.querySelectorAll('li, div[id]').forEach(el => {
                const id = el.id || '';
                const txt = (el.innerText||'').trim().substring(0,40);
                const visible = el.offsetParent !== null;
                if (id && (txt || visible)) out.push({id, txt, visible});
            });
            return out;
        }""")

        # top menu inventory
        rec["top_menu"] = await page.evaluate("""() => {
            const out = [];
            ['mu_hab','back','mu_announcement','mu_profile','wmc','quick_search',
             'problem_accounts','live_chat','new_url','onlines','user_code',
             'mySetting','my_activities','pswdRec','chgPswd','contact',
             'troubleshooting','feature','requirements','choose_lan','logOut',
             'page_name','bm_problem_li','bm_announcement_li','bm_quick_search',
             'bm_live_chat','bm_wmc'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    out.push({
                        id,
                        text: (el.innerText||'').trim().substring(0,30),
                        visible: el.offsetParent !== null
                    });
                }
            });
            return out;
        }""")

        # all top-level page-routable IDs
        rec["all_ids_with_page"] = await page.evaluate("""() => {
            const out = [];
            document.querySelectorAll('[id]').forEach(el => {
                const id = el.id;
                if (/^(acc_|log_|setting_|set_|page_|bet_|tbet_|re_|today_|fu_|started_|parly_|outright_|results_|overViewL|overView|wagerR|oldRS|matchList|on_|online_)/.test(id)) {
                    out.push({
                        id,
                        text: (el.innerText||'').trim().substring(0,30),
                        visible: el.offsetParent !== null
                    });
                }
            });
            return out;
        }""")

    except Exception as e:
        rec["errors"].append(f"main: {e}")

    await browser.close()
    return rec


async def main():
    async with async_playwright() as p:
        results = []
        for c in CASES:
            r = await probe(p, c)
            results.append(r)
            print(f"  final_url: {r.get('final_url')}")
            print(f"  top_state: {json.dumps(r.get('top_state'),ensure_ascii=False)}")
            calls = (r.get('login_resp') or {}).get('calls', [])
            if calls:
                print(f"  login_resp[0]: {calls[0]['status']}  {calls[0]['body'][:200]!r}")

    with open(f"{OUT_DIR}/probe_admins.json", "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {OUT_DIR}/probe_admins.json")


if __name__ == "__main__":
    asyncio.run(main())
