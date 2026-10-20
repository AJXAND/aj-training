import asyncio
from playwright.async_api import async_playwright
O="/tmp/ajt/p4/"
async def m():
    import os; os.makedirs(O,exist_ok=True)
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":390,"height":844},device_scale_factor=2,service_workers="block")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500); await pg.click("[data-ob=close]")
        await pg.evaluate("""(()=>{ const ans={kind:'gym',goal:'size',level:'inter',days:['mon','tue','thu','fri'],mins:70,gymOf:{},sports:[],split:null,pri:[],inj:[],love:[],ban:[],block:6,ramp:'rec',rest:'std',start:ymd(weekStart(new Date())),name:'B'};
           S.prog=AJOnboard.generate(ans,''); saveProg(); const d=S.prog.days.find(x=>!x.rest&&x.label.startsWith('Upper')); startSession(d, dayGym(d)); })()""")
        await pg.wait_for_timeout(600); await pg.screenshot(path=O+"01_live.png", full_page=True)
        order=[]
        for k in range(18):
            # tick the next-up set in the open card
            await pg.fill(".excard.open .set.next input[data-f=w]","40"); await pg.fill(".excard.open .set.next input[data-f=r]","10"); await pg.click(".excard.open .set.next .tick"); await pg.wait_for_timeout(250)
            order.append(await pg.evaluate("(()=>{const a=S.active;const c=document.querySelector('.excard.open .t');return (c?c.textContent:'-')+' | timer '+document.querySelector('#tLab').textContent})()"))
        print("\n".join(order))
        await pg.screenshot(path=O+"02_progress.png", full_page=True)
        await pg.click(".excard.open [data-act=swapOpen]"); await pg.wait_for_timeout(300)
        await pg.click("[data-sw=reason][data-r=taken]"); await pg.wait_for_timeout(200); await pg.screenshot(path=O+"03_swap.png")
        await pg.click("[data-sw=pick] >> nth=0"); await pg.wait_for_timeout(400); await pg.screenshot(path=O+"04_swapped.png")
        await pg.click(".excard.open [data-act=restCycle]"); await pg.wait_for_timeout(200)
        print(errs); await b.close()
asyncio.run(m())
