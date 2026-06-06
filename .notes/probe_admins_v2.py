#!/usr/bin/env python3
"""Login probes for /admin/, /d0/, /agents/.

For /admin/ and /d0/ (which require math captcha) we:
  1. Visit the login page (Playwright) to obtain PHPSESSID cookie.
  2. Render the captcha image into a PHP session via /verifycode.php.
  3. SSH to the server and read `hgverifycode` from the session file.
  4. Type the answer + creds and click login.

For /agents/ we just use the 登1/登2/登3 tabs (no captcha there).
"""
import asyncio
import json
import re
import subprocess
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"
SSH = ["ssh", "-o", "StrictHostKeyChecking=no",
       "-i", "/Volumes/T7/Crown-gold/Crowngold.pem",
       "ubuntu@3.25.180.205"]
OUT_DIR = "/Volumes/T7/Crown-gold/.notes"


def read_captcha(phpsessid: str) -> str | None:
    """Read hgverifycode from PHP session file."""
    cmd = SSH + [f"sudo cat /var/lib/php/sessions/sess_{phpsessid} 2>/dev/null"]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
    if r.returncode != 0:
        return None
    # PHP session format: key|s:N:"value"; or key|i:NUM;
    m = re.search(r'hgverifycode\|(?:s:\d+:"(\d+)"|i:(\d+));', r.stdout)
    if not m:
        return None
    return m.group(1) or m.group(2)


CASES = [
    {"url": "/admin/",  "user": "abu777",   "pwd": "Aa123456",   "safe": "", "tab": None, "captcha": True,  "label": "admin_abu777"},
    {"url": "/admin/",  "user": "admin1",   "pwd": "Aa123456",   "safe": "", "tab": None, "captcha": True,  "label": "admin_admin1"},
    {"url": "/admin/",  "user": "Aa100000", "pwd": "Aa11223344", "safe": "", "tab": None, "captcha": True,  "label": "admin_Aa100000"},
    {"url": "/d0/",     "user": "d010101",  "pwd": "Aa12345678", "safe": "", "tab": None, "captcha": True,  "label": "d0_d010101"},
    {"url": "/agents/", "user": "d111111",  "pwd": "Aa12345678", "safe": "Aa123123", "tab": "A", "captcha": False, "label": "ag_d111111_co"},
    {"url": "/agents/", "user": "d222222",  "pwd": "Aa12345678", "safe": "Aa123123", "tab": "B", "captcha": False, "label": "ag_d222222_su"},
    {"url": "/agents/", "user": "aa1002",   "pwd": "aa123123",   "safe": "",         "tab": "C", "captcha": False, "label": "ag_aa1002_ag"},
]


async def probe(p, c):
    rec = {"case": c, "logs": [], "errors": []}
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

        # snapshot login page
        await page.screenshot(path=f"{OUT_DIR}/probe_login_{c['label']}.png", full_page=False)

        # inventory of login form
        rec["login_form"] = await page.evaluate("""() => {
            const out = {};
            ['username','pwd','pwd_safe','verifycode','remember','forgot_pwd',
             'btn_A','btn_B','btn_C','loginBtn','loginoldBtn','lang_btn',
             'zh_cn','zh_tw','en_us','requirements'].forEach(id => {
                const el = document.getElementById(id);
                if (el) out[id] = {
                    tag: el.tagName,
                    type: el.getAttribute('type') || '',
                    placeholder: el.getAttribute('placeholder') || '',
                    text: (el.innerText || el.value || '').substring(0, 40),
                    visible: el.offsetParent !== null
                };
            });
            return out;
        }""")

        if c["tab"]:
            await page.click("#btn_" + c["tab"])
            await asyncio.sleep(0.6)
            rec["tab_clicked"] = "btn_" + c["tab"]

        await page.fill("#username", c["user"])
        await page.fill("#pwd", c["pwd"])
        if c["safe"]:
            await page.fill("#pwd_safe", c["safe"])

        if c["captcha"]:
            # read PHPSESSID
            cookies = await ctx.cookies(BASE)
            phpsess = next((ck["value"] for ck in cookies if ck["name"] == "PHPSESSID"), None)
            print(f"  PHPSESSID = {phpsess}")
            await asyncio.sleep(0.4)  # allow session write
            ans = read_captcha(phpsess) if phpsess else None
            print(f"  captcha answer = {ans}")
            if ans:
                await page.fill("#verifycode", ans)
                rec["captcha"] = ans
            else:
                rec["errors"].append("captcha_read_failed")

        # capture login responses
        login_resp = {"calls": []}
        async def on_resp(resp):
            if "transform" in resp.url or "chk_login" in resp.url:
                try:
                    body = await resp.text()
                except Exception:
                    body = ""
                login_resp["calls"].append({
                    "url": resp.url, "status": resp.status, "body": body[:1500]
                })
        page.on("response", on_resp)

        await page.click("#loginBtn")
        await asyncio.sleep(8)
        rec["login_resp"] = login_resp
        rec["final_url"] = page.url
        rec["title"] = await page.title()

        rec["top_state"] = await page.evaluate("""() => {
            const t = window.top || window;
            return {
                login_layer: t.login_layer || null,
                username: t.username || null,
                user_id: t.user_id || null,
                layer_id: t.layer_id || null,
                pri_type: t.pri_type || null,
                user_type: t.user_type || null,
                user_enable: t.user_enable || null,
                pay_type: t.pay_type || null,
                uid: t.uid || null
            };
        }""")

        await page.screenshot(path=f"{OUT_DIR}/probe_after_{c['label']}.png", full_page=True)

        # left menu inventory — match all left menu candidate IDs
        rec["left_menu"] = await page.evaluate("""() => {
            const out = [];
            const wanted = new Set([
                'le_dashboard','le_account','le_report','le_analysis','le_betlist',
                'le_match','le_log','le_setting',
                'acc_AD','acc_D0','acc_CO','acc_SU','acc_AG','acc_MEM','acc_Sub',
                'wagerR','oldRS','overViewL','re_L','today_L','fu_L','started_L',
                'parly_L','outright_L','results_L',
                'bet_list','bet_edit','bet_abnormal','bet_live_dangerous','bet_search',
                'matchList','log_AD','log_D0','log_CO','log_SU','log_AG','log_MEM',
                'set_config','set_curl','set_data_manger','data_manger'
            ]);
            wanted.forEach(id => {
                const el = document.getElementById(id);
                if (el) out.push({
                    id,
                    text: (el.innerText||'').trim().substring(0,30),
                    visible: el.offsetParent !== null
                });
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
             'bm_live_chat','bm_wmc','on_d0','on_co','on_su','on_ag','on_member'
            ].forEach(id => {
                const el = document.getElementById(id);
                if (el) out.push({
                    id,
                    text: (el.innerText||'').trim().substring(0,30),
                    visible: el.offsetParent !== null
                });
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
            calls = (r.get("login_resp") or {}).get("calls", [])
            print(f"  final_url: {r.get('final_url')}")
            print(f"  top_state: {json.dumps(r.get('top_state'), ensure_ascii=False)}")
            if calls:
                print(f"  resp[0]: {calls[0]['status']} {calls[0]['body'][:240]!r}")
    with open(f"{OUT_DIR}/probe_admins_v2.json", "w") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {OUT_DIR}/probe_admins_v2.json")


if __name__ == "__main__":
    asyncio.run(main())
