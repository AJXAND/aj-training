import asyncio
from playwright.async_api import async_playwright
O="/tmp/ajt/p5/"
async def m():
    import os; os.makedirs(O,exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,service_workers="block",has_touch=False)
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500); await pg.click("[data-ob=close]")
        await pg.click(".nav [data-tab=food]"); await pg.wait_for_timeout(400)
        await pg.click("[data-act=foodAddOpen][data-tab=search]"); await pg.wait_for_timeout(400)
        await pg.fill("#foodQ","banana"); await pg.wait_for_timeout(2500); await pg.screenshot(path=O+"01_search.png")
        await pg.click(".plusb >> nth=0"); await pg.wait_for_timeout(300)
        await pg.fill("#foodQ","chicken breast"); await pg.wait_for_timeout(1500)
        await pg.click(".addli .grow >> nth=0"); await pg.wait_for_timeout(400); await pg.screenshot(path=O+"02_sheet.png")
        await pg.click("[data-fs=save]"); await pg.wait_for_timeout(300)
        await pg.click("[data-act=addTab][data-tab=quick]"); await pg.fill("#qaName","Whey protein shake"); await pg.fill("#qaK","120"); await pg.fill("#qaP","24"); await pg.click("[data-act=quickToTray]"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=O+"03_tray.png")
        await pg.click("[data-act=trayLog]"); await pg.wait_for_timeout(500); await pg.screenshot(path=O+"04_food.png", full_page=True)
        # drag first entry into Dinner
        await pg.evaluate("document.querySelector('.mealcard').scrollIntoView()"); await pg.wait_for_timeout(300); g=await pg.query_selector(".fgrip"); bb=await g.bounding_box(); tgt=await (await pg.query_selector(".mealgrp[data-meal=dinner]")).bounding_box()
        await pg.mouse.move(bb["x"]+5,bb["y"]+5); await pg.mouse.down(); await pg.mouse.move(bb["x"]+5,tgt["y"]+15,steps=8); await pg.mouse.up(); await pg.wait_for_timeout(400)
        print(await pg.evaluate("JSON.stringify((S.foodlog[ymd(new Date())].entries).map(e=>[e.name,mealOf(e)]))"))
        await pg.screenshot(path=O+"05_dragged.png", full_page=True)
        await pg.click("[data-act=relog] >> nth=0"); await pg.wait_for_timeout(300)
        print(errs); await b.close()
asyncio.run(m())
