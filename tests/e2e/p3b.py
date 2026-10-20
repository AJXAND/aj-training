import asyncio
from playwright.async_api import async_playwright
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":390,"height":844},service_workers="block")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500); await pg.click("[data-ob=close]")
        r=await pg.evaluate("""(()=>{ const base={kind:'gym',level:'inter',days:['mon','tue','thu','fri'],mins:70,gymOf:{},sports:[],split:null,pri:[],inj:[],love:[],ban:[],block:6,ramp:'rec',rest:'std',start:'2026-10-26',name:'x'};
          const out={};
          for (const [g,lv] of [['strength','inter'],['power','inter'],['size','new'],['crossfit','inter']]){ const p=AJOnboard.generate({...base,goal:g,level:lv},''); const d=p.days.find(x=>!x.rest); out[g+'-'+lv]=d.variants[d.gym].map(([k,n,ss])=>`${p.exercises[k].n} ${n}x${p.exercises[k].lo}-${p.exercises[k].hi} r${p.exercises[k].rest}${ss?' ['+ss+']':''}`); }
          return out; })()""")
        for k,v in r.items(): print(k); [print("   ",x) for x in v]
        print(errs); await b.close()
asyncio.run(m())
