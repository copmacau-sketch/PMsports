#!/usr/bin/env python3
"""Capture full response bodies and look for redirect-causing content"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    responses = []
    nav_events = []

    def on_response(resp):
        try:
            url = resp.url
            if "3.25.180.205" in url:
                body = resp.body().decode('utf-8', errors='replace')
                # Get request post data
                req = resp.request
                post = ""
                try:
                    post = req.post_data or ""
                except:
                    pass
                responses.append({
                    "ts": time.time(),
                    "url": url,
                    "post": post[:200],
                    "status": resp.status,
                    "body": body,
                    "frame_url": resp.frame.url[:120] if resp.frame else "",
                })
        except:
            pass

    def on_nav(frame):
        nav_events.append({
            "ts": time.time(),
            "url": frame.url[:200],
            "is_main": frame.parent_frame is None
        })

    page.on("response", on_response)
    page.on("framenavigated", on_nav)

    t0 = time.time()
    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")

    page.wait_for_timeout(10000)

    # Find when MAIN navigated to /
    print("=== Navigation timeline ===")
    for n in nav_events:
        print(f"  +{n['ts']-t0:5.2f}s {'MAIN ' if n['is_main'] else 'frame'}: {n['url'][:120]}")

    # Find the navigation back to /
    redirect_time = None
    for n in nav_events:
        if n['is_main'] and n['url'] == "http://3.25.180.205:8080/":
            if redirect_time is None and n['ts'] - t0 > 2:
                redirect_time = n['ts']
                break

    if redirect_time:
        print(f"\n=== Redirect to / at +{redirect_time-t0:.2f}s ===")
        print("Responses in 3 seconds before redirect:")
        for r in responses:
            if redirect_time - 3 <= r['ts'] <= redirect_time:
                # Extract p= from POST body
                p_param = ""
                if "p=" in r['post']:
                    try:
                        p_param = r['post'].split("p=")[1].split("&")[0]
                    except: pass
                # Show suspicious content
                body_lower = r['body'].lower()
                suspicious = []
                if 'top.location' in body_lower: suspicious.append('TOP.LOCATION')
                if 'window.location' in body_lower: suspicious.append('WINDOW.LOCATION')
                if 'location.href' in body_lower: suspicious.append('LOCATION.HREF')
                if 'location.replace' in body_lower: suspicious.append('LOCATION.REPLACE')
                if 'meta http-equiv="refresh"' in body_lower: suspicious.append('META_REFRESH')
                if '<form' in body_lower and 'submit' in body_lower: suspicious.append('FORM')
                if 'doublelogin' in body_lower: suspicious.append('DOUBLE_LOGIN')
                if 'gohome' in body_lower: suspicious.append('GOHOME')
                if 'goToIndex' in r['body']: suspicious.append('GO_TO_INDEX')

                marker = ' '.join(suspicious) if suspicious else 'OK'
                url_short = r['url'].replace('http://3.25.180.205:8080', '')
                print(f"  +{r['ts']-t0:5.2f}s [{r['status']}] p={p_param:30s} {marker:30s} body_len={len(r['body'])}")
                if suspicious:
                    # Find and print suspicious content
                    for keyword in ['top.location', 'window.location', 'location.href', 'location.replace', 'meta http-equiv="refresh"', 'doubleLogin', 'goHome']:
                        idx = r['body'].lower().find(keyword.lower())
                        if idx >= 0:
                            print(f"      [{keyword}] context: {r['body'][max(0,idx-50):idx+150]}")

    browser.close()
