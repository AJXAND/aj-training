import asyncio
from playwright.async_api import async_playwright
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,service_workers="block")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500); await pg.click("[data-ob=close]")
        for kind,extra in [("tri","tri:'olympic',nDays:6,strengthN:1"),("hyrox","nDays:5,runLevel:2"),("endurance","event:'5k',runLevel:0,runs:3")]:
            await pg.evaluate(f"""(()=>{{ const a={{kind:'{kind}',start:ymd(weekStart(new Date())),longDay:'sat',hasDate:false,gyms:gymList(),level:'inter',{extra}}}; S.prog=AJOnboard.generateEndu(a,''); saveProg(); S.planView='today'; go('plan'); }})()""")
            await pg.wait_for_timeout(600); await pg.screenshot(path=f"/tmp/ajt/p3/live_{kind}.png", full_page=True)
            await pg.click("[data-segset=planView][data-val=week]"); await pg.wait_for_timeout(400); await pg.screenshot(path=f"/tmp/ajt/p3/live_{kind}_week.png", full_page=True)
        print(errs); await b.close()
asyncio.run(m())
