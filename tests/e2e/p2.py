import asyncio, sys
from playwright.async_api import async_playwright
O="/tmp/ajt/p2/"
async def m():
    import os; os.makedirs(O,exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,service_workers="block")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        await ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(3600)
        n=[0]
        async def shot(name, full=False):
            n[0]+=1; await pg.wait_for_timeout(500); await pg.screenshot(path=O+f"{n[0]:02d}_{name}.png", full_page=full)
        await pg.click("[data-ob=close]"); await pg.wait_for_timeout(500)
        await shot("home_new", True)
        await pg.click(".nav [data-tab=plan]"); await shot("train_new")
        await pg.evaluate("""(()=>{ const ans={kind:'gym',goal:'size',level:'inter',days:['mon','tue','thu','fri'],mins:60,gymOf:{},sport:[],split:null,pri:[],inj:[],love:[],ban:[],block:6,start:ymd(weekStart(new Date())),phase:'maintain',name:'Block 1'};
           S.prog=AJOnboard.generate(ans,''); saveProg(); S.profile.goal={type:'bulk',rate:0.35,prot:2,fat:'balanced',dist:'even',targetKg:80,startKg:75}; saveProfile(); render(); })()""")
        await shot("train_today", True)
        await pg.click("[data-segset=planView][data-val=month]"); await shot("month")
        await pg.click("[data-segset=planView][data-val=today]")
        fut=await pg.query_selector(".trd.plan:not(.now)")
        if fut: await fut.click(); await shot("day_open", True)
        mv=await pg.query_selector("[data-act=moveDay]")
        if mv: await mv.click(); await shot("week_moved")
        await pg.click(".trd.now")
        await pg.click("[data-act=cardioNew]"); await shot("cardio_pick")
        await pg.fill("#cSearch","pad"); await shot("cardio_search")
        await pg.click("[data-act=cardioPick][data-t=padel]"); await shot("cardio_form")
        await pg.fill("#cMins","60"); await pg.click("[data-act=cardioSave]"); await shot("after_save", True)
        await pg.click(".nav [data-tab=home]"); await shot("home_plan", True)
        await pg.click("#plusBtn"); await shot("plus")
        await pg.evaluate("closeActions()"); await pg.wait_for_timeout(400)
        await pg.click(".nav [data-tab=progress]"); await shot("progress", True)
        await pg.click(".nav [data-tab=food]"); await shot("food")
        await pg.click("[data-goto=settings] >> nth=0"); await shot("settings", True)
        await pg.click("[data-act=setPage][data-p=you]"); await shot("set_you")
        await pg.click("[data-back=settings]"); await pg.click("[data-act=setPage][data-p=app]"); await shot("set_app", True)
        await pg.click("[data-back=settings]"); await pg.click("[data-act=setPage][data-p=food]"); await shot("set_food", True)
        print("errors:", errs)
        await b.close()
asyncio.run(m())
