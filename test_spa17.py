#!/usr/bin/env python3
"""Use desktop viewport, enable echo, observe what fires checkCount"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

INIT = "Object.defineProperty(window, 'site', {value: 'TEST', writable: true, configurable: true}); top.site = 'TEST';"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={"width": 1280, "height": 800})
    ctx.add_init_script(INIT)
    page = ctx.new_page()

    msgs = []
    page.on("console", lambda m: msgs.append(f"[{m.type}] {m.text[:300]}"))

    page.goto(URL, wait_until="domcontentloaded")
    page.evaluate("top.site = 'TEST';")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")
    page.wait_for_timeout(500)
    try: page.evaluate("top.site = 'TEST';")
    except: pass

    page.wait_for_timeout(20000)

    print(f"=== Console messages ({len(msgs)}) ===")
    for m in msgs:
        if any(k in m for k in ["checkCount", "now=", "init", "Init", "Complete", "footer", "header", "home", "Frame", "loginComplete"]):
            print(f"  {m}")

    # State
    state = page.evaluate("""() => ({
        loading: getComputedStyle(document.getElementById('loading')).display,
        home_show: getComputedStyle(document.getElementById('home_show')).visibility,
        home_show_classes: document.getElementById('home_show').className,
        viewportwidth: window.innerWidth,
    })""")
    print(f"\n=== State ===\n{state}")

    page.screenshot(path="/tmp/spa_desktop.png", full_page=False)
    browser.close()
