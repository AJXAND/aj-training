import asyncio
from playwright.async_api import async_playwright
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for scheme in ["light","dark"]:
            ctx=await b.new_context(viewport={"width":440,"height":956},device_scale_factor=2,service_workers="block",color_scheme=scheme,geolocation={"latitude":51.4600,"longitude":-0.3100,"accuracy":8},permissions=["geolocation"])
            await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
            pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500); await pg.click("[data-ob=close]"); await pg.wait_for_timeout(400)
            await pg.click("#plusBtn"); await pg.wait_for_timeout(500); await pg.click("[data-sheet=track]"); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f"/tmp/ajt/trk_{scheme}_pick.png")
            await pg.click("[data-act=trackStart][data-t=run]"); await pg.wait_for_timeout(800)
            lat,lon=51.4600,-0.3100
            for i in range(40):
                lat+=0.00003*(1 if i<25 else 0); lon+=0.00004 if i>=10 else 0.00001
                await ctx.set_geolocation({"latitude":lat,"longitude":lon,"accuracy":8}); await pg.wait_for_timeout(1000)
            await pg.screenshot(path=f"/tmp/ajt/trk_{scheme}_live.png")
            st=await pg.evaluate("({dist:S.track.dist, pts:S.track.pts.length, t:document.getElementById('trkTime').textContent, d:document.getElementById('trkDist').textContent, now:document.getElementById('trkNow').textContent, avg:document.getElementById('trkAvg').textContent, gps:document.getElementById('trkGps').textContent})")
            print(scheme, st)
            await pg.click("[data-act=trkFinish]"); await pg.wait_for_timeout(300); await pg.click("[data-act=trkFinish]"); await pg.wait_for_timeout(1200)
            c=await pg.evaluate("S.cardio[0]&&({type:S.cardio[0].type, km:S.cardio[0].km, mins:S.cardio[0].mins, route:(S.cardio[0].route||[]).length, net:S.cardio[0].net})")
            print("saved", c, "tab", await pg.evaluate("S.tab"), errs)
            await pg.screenshot(path=f"/tmp/ajt/trk_{scheme}_home.png", full_page=True)
            await ctx.close()
asyncio.run(m())
