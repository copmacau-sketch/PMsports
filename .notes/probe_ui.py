#!/usr/bin/env python3
"""Full UI probe — login each layer with verified creds, capture menus and screenshots."""
import asyncio
import json
import re
import subprocess
from playwright.async_api import async_playwright

BASE = "http://3.25.180.205:8080"
SSH = ["ssh", "-o", "StrictHostKeyChecking=no",
       "-i", "/Volumes/T7/Crown-gold/Crowngold.pem",
       "ubuntu@3.25.180.205"]
OUT = "/Volumes/T7/Crown-gold/.notes"

CASES = [
    {"path": "/admin/",  "user": "abu777",   "pwd": "Aa123456",   "safe": "", "tab": None, "captcha": True,  "label": "ads_abu777",       "expect_layer": "ads"},
    {"path": "/admin/",  "user": "admin1",   "pwd": "Aa123456",   "safe": "", "tab": None, "captcha": True,  "label": "ad_admin1",        "expect_layer": "ad"},
    {"path": "/admin/",  "user": "Aa100000", "pwd": "Aa11223344", "safe": "", "tab": None, "captcha": True,  "label": "ads_sub_Aa100000", "expect_layer": "ads"},
    {"path": "/d0/",     "user": "d010101",  "pwd": "Aa12345678", "safe": "", "tab": None, "captcha": True,  "label": "d0_d010101",       "expect_layer": "d0"},
    {"path": "/agents/", "user": "d111111",  "pwd": "Aa12345678", "safe": "Aa123123", "tab": "A", "captcha": False, "label": "co_d111111",  "expect_layer": "co"},
    {"path": "/agents/", "user": "d222222",  "pwd": "Aa12345678", "safe": "Aa123123", "tab": "B", "captcha": False, "label": "su_d222222",  "expect_layer": "su"},
    {"path": "/agents/", "user": "sealin11", "pwd": "Sealin1226", "safe": "",         "tab": "C", "captcha": False, "label": "ag_sealin11", "expect_layer": "ag"},
]


def read_captcha(sid):
    r = subprocess.run(SSH + [f"sudo cat /var/lib/php/sessions/sess_{sid} 2>/dev/null"],
                       capture_output=True, text=True, timeout=10)
    m = re.search(r'verifycode\|(?:s:\d+:"(\d+)"|i:(\d+));', r.stdout)
    return (m.group(1) or m.group(2)) if m else None


# Common left-menu IDs to inventory
LEFT_IDS = [
    # Dashboard
    "le_dashboard",
    # Account 7
    "acc_AD","acc_D0","acc_CO","acc_SU","acc_AG","acc_MEM","acc_Sub",
    # Reports
    "wagerR","oldRS",
    # Analysis 8
    "overViewL","re_L","today_L","fu_L","started_L","parly_L","outright_L","results_L",
    # Bet 5
    "bet_list","bet_edit","bet_abnormal","bet_live_dangerous","bet_search",
    # Match
    "matchList",
    # Log 6
    "log_AD","log_D0","log_CO","log_SU","log_AG","log_MEM",
    # Setting 3
    "set_config","set_curl","set_data_manger",
]

TOP_IDS = [
    "mu_hab","back","mu_announcement","mu_profile","wmc","quick_search",
    "problem_accounts","live_chat","new_url","page_name",
    # right-panel
    "user_code","mySetting","my_activities","pswdRec","chgPswd","contact",
    "troubleshooting","feature","requirements","choose_lan","logOut",
    # online stats
    "on_d0","on_co","on_su","on_ag","on_member",
    # bottom
    "bm_problem_li","bm_announcement_li","bm_quick_search","bm_live_chat","bm_wmc",
]


async def probe(p, c):
    rec = {"case": c, "logs": [], "errors": []}
    browser = await p.chromium.launch(headless=True)
    ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
    page = await ctx.new_page()
    page.on("console", lambda m: rec["logs"].append(f"[{m.type}] {m.text[:200]}"))
    page.on("pageerror", lambda e: rec["errors"].append(str(e)[:300]))

    print(f"\n=== {c['label']}  {c['path']}  user={c['user']}  expect={c['expect_layer']} ===")
    try:
        await page.goto(BASE + c["path"], wait_until="domcontentloaded", timeout=30000)
        await asyncio.sleep(2)

        # login form inventory (BEFORE clicking tab)
        rec["login_form"] = await page.evaluate("""() => {
            const out = {};
            ['username','pwd','pwd_safe','verifycode','remember','btn_A','btn_B','btn_C',
             'loginBtn','loginoldBtn','lang_btn','zh_cn','zh_tw','en_us'].forEach(id => {
                const el = document.getElementById(id);
                if (el) out[id] = {
                    text: (el.innerText || el.value || '').substring(0,40),
                    placeholder: el.getAttribute('placeholder') || '',
                    visible: el.offsetParent !== null
                };
            });
            // count tabs in lg_stratum
            const tabs = document.querySelectorAll('.lg_stratum li');
            out['_tab_count'] = tabs.length;
            out['_tab_labels'] = [...tabs].map(t => (t.innerText||'').trim());
            return out;
        }""")
        await page.screenshot(path=f"{OUT}/probe_login_{c['label']}.png")

        if c["tab"]:
            await page.click("#btn_" + c["tab"])
            await asyncio.sleep(0.6)

        await page.fill("#username", c["user"])
        await page.fill("#pwd", c["pwd"])
        if c["safe"]:
            await page.fill("#pwd_safe", c["safe"])

        if c["captcha"]:
            cookies = await ctx.cookies(BASE)
            sid = next((ck["value"] for ck in cookies if ck["name"] == "PHPSESSID"), None)
            # may need to force the verifycode.php request to fire (race)
            ans = read_captcha(sid)
            if not ans:
                # re-fetch verifycode.php using fetch() in browser context
                await page.evaluate("""() => fetch('verifycode.php?_t='+Date.now(),
                    {credentials: 'include', cache:'no-store'})""")
                await asyncio.sleep(0.7)
                ans = read_captcha(sid)
            print(f"  captcha={ans}")
            if ans:
                await page.fill("#verifycode", ans)

        # capture login resp
        login_resp = {"calls": []}
        async def on_resp(resp):
            if "transform" in resp.url:
                try:
                    body = await resp.text()
                except Exception:
                    body = ""
                login_resp["calls"].append({"url": resp.url, "status": resp.status, "body": body[:1500]})
        page.on("response", on_resp)

        await page.click("#loginBtn")
        await asyncio.sleep(10)

        rec["login_resp"] = login_resp
        rec["final_url"] = page.url
        rec["top_state"] = await page.evaluate("""() => {
            const t = window.top || window;
            return {
                login_layer: t.login_layer, username: t.username,
                user_id: t.user_id, layer_id: t.layer_id,
                pri_type: t.pri_type, user_type: t.user_type,
                user_enable: t.user_enable, pay_type: t.pay_type,
                uid: t.uid ? '...' : null
            };
        }""")

        # if login_chk returned success, also captured response. extract additional from login resp
        if login_resp["calls"]:
            try:
                rec["login_json"] = json.loads(login_resp["calls"][0]["body"])
            except Exception:
                pass

        # menus
        rec["left_menu"] = await page.evaluate(f"""(IDs) => IDs.map(id => {{
            const el = document.getElementById(id);
            return el ? {{id, text:(el.innerText||'').trim().substring(0,30), visible: el.offsetParent !== null}} : {{id, missing: true}};
        }})""", LEFT_IDS)
        rec["top_menu"] = await page.evaluate(f"""(IDs) => IDs.map(id => {{
            const el = document.getElementById(id);
            return el ? {{id, text:(el.innerText||'').trim().substring(0,30), visible: el.offsetParent !== null}} : {{id, missing: true}};
        }})""", TOP_IDS)

        await page.screenshot(path=f"{OUT}/probe_after_{c['label']}.png", full_page=True)

    except Exception as e:
        rec["errors"].append(f"main: {e}")

    await browser.close()
    return rec


async def main():
    async with async_playwright() as p:
        all_results = []
        for c in CASES:
            r = await probe(p, c)
            all_results.append(r)
            print(f"  final={r.get('final_url')}")
            print(f"  top_state={json.dumps(r.get('top_state'),ensure_ascii=False)}")
            calls = (r.get('login_resp') or {}).get('calls',[])
            if calls:
                lj = r.get('login_json') or {}
                print(f"  login_layer={lj.get('login_layer')}  user_type={lj.get('user_type')}  pri_type={lj.get('pri_type')}")

    # Build comparison matrix
    layer_summary = {}
    for r in all_results:
        lbl = r['case']['label']
        layer_summary[lbl] = {
            'login_layer': (r.get('login_json') or {}).get('login_layer'),
            'user_type': (r.get('login_json') or {}).get('user_type'),
            'pri_type': (r.get('login_json') or {}).get('pri_type'),
            'left_visible': sorted([m['id'] for m in r.get('left_menu',[]) if m.get('visible')]),
            'top_visible':  sorted([m['id'] for m in r.get('top_menu',[]) if m.get('visible')]),
        }

    with open(f"{OUT}/probe_ui.json", "w") as f:
        json.dump({"raw": all_results, "summary": layer_summary}, f, ensure_ascii=False, indent=2)
    print(f"\nWrote {OUT}/probe_ui.json")

    # Print readable diff
    print("\n=== Visible menu matrix (left) ===")
    all_ids = sorted({i for s in layer_summary.values() for i in s['left_visible']})
    layers = list(layer_summary.keys())
    print(f"{'ID':28s}  " + " ".join(f"{l[:10]:^10}" for l in layers))
    for mid in all_ids:
        marks = ["✓" if mid in layer_summary[l]['left_visible'] else "·" for l in layers]
        print(f"{mid:28s}  " + " ".join(f"{m:^10}" for m in marks))

    print("\n=== Visible menu matrix (top) ===")
    all_ids = sorted({i for s in layer_summary.values() for i in s['top_visible']})
    print(f"{'ID':28s}  " + " ".join(f"{l[:10]:^10}" for l in layers))
    for mid in all_ids:
        marks = ["✓" if mid in layer_summary[l]['top_visible'] else "·" for l in layers]
        print(f"{mid:28s}  " + " ".join(f"{m:^10}" for m in marks))


if __name__ == "__main__":
    asyncio.run(main())
