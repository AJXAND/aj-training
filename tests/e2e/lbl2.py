import asyncio
from playwright.async_api import async_playwright
async def run(cam, fail):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--use-fake-ui-for-media-stream","--use-fake-device-for-media-stream",f"--use-file-for-fake-video-capture=/tmp/ajt/{cam}"])
        ctx=await b.new_context(viewport={"width":390,"height":844},permissions=["camera"],service_workers="block")
        await ctx.route("**/config.js", lambda r: r.fulfill(body="window.AJ_CONFIG={};", content_type="application/javascript"))
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8765/"); await pg.wait_for_timeout(1500)
        t=await pg.evaluate("""async(fail)=>{ let calls=0, gums=0; const og=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices); navigator.mediaDevices.getUserMedia=(c)=>{gums++; return og(c);};
          window.readLabel=async(x)=>{ calls++; await new Promise(r=>setTimeout(r,400)); return fail&&calls<2?{error:'too blurry'}:{food:{name:'Test', per100:{kcal:100,p:1,c:1,f:1}}}; }; window.labelDone=f=>{ window.__done=f; };
          const t0=performance.now(); openScanner('label');
          await new Promise(r=>setTimeout(r,1500)); document.querySelector('.sc-shutter').click();
          let hints=[]; while(performance.now()-t0<9000){ await new Promise(r=>setTimeout(r,100)); const h=document.querySelector('.sc-hint'); if(h&&hints[hints.length-1]!==h.textContent) hints.push(h.textContent); if(window.__done) break; if(fail && calls===1 && !document.querySelector('.scanner.reading') && !window.__retried){ window.__retried=1; await new Promise(r=>setTimeout(r,800)); document.querySelector('.sc-shutter').click(); } }
          return {done:!!window.__done, calls, gums, open:!!document.querySelector('.scanner'), hints}; }""", fail)
        print(cam, fail, t, errs); await b.close()
async def m():
    await run("handheld.mjpeg", False); await run("handheld.mjpeg", True); await run("blank.mjpeg", False)
asyncio.run(m())
