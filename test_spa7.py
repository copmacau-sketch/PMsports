#!/usr/bin/env python3
"""Capture redirect cause via document.title and sessionStorage"""
import time
from playwright.sync_api import sync_playwright

URL = "http://3.25.180.205:8080/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    titles_seen = []
    page.on("framenavigated", lambda f: print(f"NAV: {f.url[:120]}"))

    page.goto(URL, wait_until="domcontentloaded")
    page.fill("#usr", "ceshi1")
    page.fill("#pwd", "Abc12345")
    page.click("button[type='submit']")

    # Poll the title to catch the REDIRECT marker
    last_title = ""
    for i in range(40):
        page.wait_for_timeout(250)
        try:
            t = page.title()
            if t != last_title:
                titles_seen.append(t)
                last_title = t
            if "REDIRECT" in t:
                print(f"\n>>> REDIRECT triggered at iteration {i} (~{i*0.25:.1f}s)")
                print(t)
                break
        except:
            pass

    page.wait_for_timeout(2000)

    # After redirect, the new page might have sessionStorage from old origin
    try:
        stk = page.evaluate("sessionStorage.getItem('__redirectStack')")
        if stk:
            print(f"\n=== sessionStorage redirect stack ===\n{stk}")
    except: pass

    print(f"\n=== All titles seen ({len(titles_seen)}) ===")
    for t in titles_seen:
        print(f"  {t[:200]}")

    print(f"\nFinal URL: {page.url}")
    browser.close()
