import asyncio, sys, json
from playwright.async_api import async_playwright
O="/tmp/ajt/p3/"
FLOWS=sys.argv[1].split(",") if len(sys.argv)>1 else ["muscle"]
async def m():
    import os; os.makedirs(O,exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for flow in FLOWS:
            ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,service_workers="block")
            await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
            await ctx.route("**/fonts.googleapis.com/**", lambda r: r.abort())
            pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
            await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(3000)
            await pg.click("[data-ob=close]"); await pg.wait_for_timeout(400)
            if flow=="aesthetic": await pg.evaluate("S.profile.sex='female'")
            await pg.evaluate("AJOnboard.programme(true)"); await pg.wait_for_timeout(400)
            n=[0]
            async def shot(name):
                n[0]+=1; await pg.wait_for_timeout(450); await pg.screenshot(path=O+f"{flow}_{n[0]:02d}_{name}.png")
            await pg.click("[data-ob=next]")
            fam={"hyrox":"race","tri":"race","crossfit":"race","power":"strength"}.get(flow,flow)
            await pg.click(f"[data-gfam={fam}]"); await pg.wait_for_timeout(700)
            if fam in ("race","strength"):
                await pg.click(f"[data-set=gtype][data-val={flow}]"); await pg.wait_for_timeout(700)
            steps=[]
            for k in range(25):
                st=await pg.evaluate("document.querySelector('#ob .obtitle')?document.querySelector('#ob .obtitle').textContent:(document.querySelector('#ob .obbuild')?'BUILD':'?')")
                steps.append(st)
                await shot(st.replace(" ","_").replace("?","")[:24])
                if st=="Describe your goal":
                    await pg.fill("[data-input=customText]","Get ready for a half marathon in spring")
                if st=="Which look are you after?":
                    await pg.click("[data-look] >> nth=1"); await pg.wait_for_timeout(700); continue
                if st=="What's the running goal?" and flow=="run":
                    await pg.click("[data-set=event][data-val=ultra]"); await pg.fill("[data-key=goalKm]","80"); await pg.click(".obtitle")
                if st=="Where are you now?" and flow=="run":
                    await pg.click("[data-runlevel='0']")
                if st in ("Your gym","Your gyms") and await pg.locator("#ob [data-ob=next][disabled]").count():
                    await pg.locator("[data-gpreset=commercial]").first.click(); await pg.wait_for_timeout(500)
                if st=="BUILD":
                    await pg.wait_for_timeout(3500); continue
                if st in ("Your block","Your plan"):
                    await pg.evaluate("document.querySelector('#ob .obbody').scrollTop=900"); await shot("review2")
                    await pg.click("[data-ob=next]"); await pg.wait_for_timeout(800); break
                await pg.click("[data-ob=next]"); await pg.wait_for_timeout(500)
            await pg.screenshot(path=O+f"{flow}_zz_train.png", full_page=True)
            info=await pg.evaluate("JSON.stringify({name:S.prog.name, split:S.prog.splitName, kind:S.prog.kind, rir:S.prog.rir, weeks:S.prog.endurance&&S.prog.endurance.weeks.length, days:S.prog.days.map(d=>d.label)})")
            print(flow, " > ".join(steps)); print("  ", info, "errors:", errs)
            await ctx.close()
        await b.close()
asyncio.run(m())
