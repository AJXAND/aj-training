import asyncio
from playwright.async_api import async_playwright
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,service_workers="block")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        await ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500)
        await pg.click("[data-ob=close]"); await pg.wait_for_timeout(400)
        await pg.evaluate("AJOnboard.programme(true)"); await pg.wait_for_timeout(400)
        await pg.click("[data-ob=next]"); await pg.click("[data-gfam=muscle]"); await pg.wait_for_timeout(700)
        for k in range(10):
            st=await pg.evaluate("document.querySelector('#ob .obtitle').textContent")
            if st.startswith("Your gym"): break
            await pg.click("[data-ob=next]"); await pg.wait_for_timeout(600)
        await pg.screenshot(path="/tmp/ajt/v_gym1.png")
        await pg.click("[data-gpreset=commercial] >> nth=0"); await pg.wait_for_timeout(500)
        await pg.click(".eqgrp summary >> nth=8"); await pg.wait_for_timeout(300)
        await pg.locator(".eqgrp").nth(8).locator(".eqrow").nth(2).click(); await pg.wait_for_timeout(500)
        print("still open:", await pg.evaluate("document.querySelectorAll('.eqgrp')[8].open"))
        await pg.evaluate("document.querySelectorAll('.eqgrp')[8].scrollIntoView()"); await pg.screenshot(path="/tmp/ajt/v_gym2.png")
        await pg.click("[data-set$=dbMode][data-val=exact]"); await pg.wait_for_timeout(400)
        for w in ["5","10","12.5","15","32.5"]: await pg.click(f"[data-dbw='{w}']"); await pg.wait_for_timeout(150)
        await pg.evaluate("document.querySelector('.dbgrid').scrollIntoView()"); await pg.screenshot(path="/tmp/ajt/v_gym3.png")
        await pg.fill("[data-eqq]","hip"); await pg.wait_for_timeout(400)
        await pg.evaluate("document.querySelector('.eqsearch').scrollIntoView()"); await pg.screenshot(path="/tmp/ajt/v_gym4.png")
        print("dbs", await pg.evaluate("AJOnboard && 1"), errs)
        await pg.fill("[data-eqq]",""); await pg.click("[data-ob=next]"); await pg.wait_for_timeout(600)
        for k in range(4):
            st=await pg.evaluate("document.querySelector('#ob .obtitle').textContent")
            if "sport" in st: break
            await pg.click("[data-ob=next]"); await pg.wait_for_timeout(600)
        await pg.fill("[data-sq]","rug"); await pg.wait_for_timeout(300); await pg.screenshot(path="/tmp/ajt/v_sp1.png")
        await pg.click(".sprow >> nth=0"); await pg.wait_for_timeout(400); await pg.screenshot(path="/tmp/ajt/v_sp2.png")
        print(st, errs)
asyncio.run(m())
