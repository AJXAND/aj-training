import asyncio, os
os.makedirs("/tmp/ajt/p5", exist_ok=True)
from playwright.async_api import async_playwright
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":440,"height":956},device_scale_factor=2,service_workers="block",color_scheme="dark")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500); await pg.click("[data-ob=close]")
        await pg.wait_for_timeout(400); await pg.screenshot(path="/tmp/ajt/p5/dark_home.png")
        await pg.evaluate("AJOnboard.programme(true)"); await pg.click("[data-ob=next]"); await pg.click("[data-gfam=muscle]"); await pg.wait_for_timeout(700)
        for i in range(8):
            if "gym" in (await pg.evaluate("document.querySelector('#ob .obtitle').textContent")).lower(): break
            await pg.click("[data-ob=next]"); await pg.wait_for_timeout(500)
        await pg.screenshot(path="/tmp/ajt/p5/dark_gym.png")
        print(errs); await b.close()
asyncio.run(m())
