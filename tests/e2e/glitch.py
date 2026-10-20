import asyncio
from playwright.async_api import async_playwright
async def m():
    async with async_playwright() as p:
        b=await p.chromium.launch(); ctx=await b.new_context(viewport={"width":390,"height":844},service_workers="block")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(2500); await pg.click("[data-ob=close]")
        await pg.evaluate("AJOnboard.nutrition(true,'macros')"); await pg.wait_for_timeout(500); print(errs, await pg.evaluate("(document.querySelector('#ob')||{}).innerText"))
        await pg.evaluate("window._p=document.querySelector('.obprot .obopt'); window._b=document.querySelector('#ob .obbody')")
        await pg.click("[data-set=fat][data-val=carb]"); await pg.wait_for_timeout(300)
        print("same protein el:", await pg.evaluate("window._p===document.querySelector('.obprot .obopt') && window._b===document.querySelector('#ob .obbody')"))
        print("carb pressed:", await pg.evaluate("document.querySelector('[data-set=fat][data-val=carb]').getAttribute('aria-pressed')"))
        await pg.evaluate("AJOnboard.nutrition(true,'rate')"); await pg.wait_for_timeout(500)
        await pg.evaluate("window._c=document.querySelector('.obproj')")
        await pg.evaluate("const r=document.querySelector('[data-range=rate]'); r.value=0.9; r.dispatchEvent(new Event('input',{bubbles:true})); r.dispatchEvent(new Event('change',{bubbles:true}))"); await pg.wait_for_timeout(300)
        print("rate body kept:", await pg.evaluate("!!document.querySelector('#ob .obbody') && document.querySelector('[data-range=rate]').value"), await pg.evaluate("document.querySelector('.obrate b').textContent"))
        print(errs); await b.close()
asyncio.run(m())
