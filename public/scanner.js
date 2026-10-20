/* AJ Training · live camera scanners.
   Barcode: reads EAN/UPC from the video feed continuously, then looks the product up in your saved foods and Open Food Facts.
   Label: waits until the camera is steady and the text is sharp, then captures automatically and sends it to Claude to read. */
(function(){
"use strict";
let ov = null, stream = null, loop = null, mode = "barcode", detector = null, steady = 0, best = 0, busy = false;

function el(html){ const d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
function stop(){
  clearInterval(loop); loop = null; waiting = false;
  if (stream){ stream.getTracks().forEach(t => t.stop()); stream = null; }
  if (ov){ ov.remove(); ov = null; }
  document.body.style.overflow = "";
}
function setMode(m){
  mode = m; steady = 0; best = 0; minMotion = 99; keptScore = 0; labelStart = Date.now(); prev = null;
  if (m === "barcode") setTimeout(pump, 50);
  ov.querySelectorAll("[data-smode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.smode === m));
  ov.querySelector(".sc-frame").className = "sc-frame " + m;
  ov.querySelector(".sc-shutter").hidden = m !== "label";
  hint(m === "barcode" ? "Point at the barcode" : "Fill the frame with the nutrition panel and hold still");
}
function hint(t){ if (ov) ov.querySelector(".sc-hint").textContent = t; }
function setProgress(p){ if (ov) ov.querySelector(".sc-ring i").style.width = Math.round(p * 100) + "%"; }

async function open(m){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ fallback(m); return; }
  ov = el(`<div class="scanner" role="dialog" aria-label="Scanner">
    <video playsinline muted autoplay></video><canvas hidden></canvas>
    <div class="sc-top"><button class="sc-x" aria-label="Close">✕</button>
      <div class="seg sc-seg"><button data-smode="barcode">Barcode</button><button data-smode="label">Label</button></div><button class="sc-torch" aria-label="Torch" hidden>💡</button></div>
    <div class="sc-frame"></div>
    <div class="sc-bottom"><div class="sc-ring"><i></i></div><p class="sc-hint"></p><button class="sc-shutter" aria-label="Capture now" hidden></button></div>
  </div>`);
  document.body.appendChild(ov); document.body.style.overflow = "hidden";
  ov.querySelector(".sc-x").onclick = stop;
  ov.querySelectorAll("[data-smode]").forEach(b => b.onclick = () => setMode(b.dataset.smode));
  ov.querySelector(".sc-shutter").onclick = () => captureLabel();
  setMode(m);
  try{
    stream = await navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:{ideal:"environment"}, width:{ideal:1920}, height:{ideal:1080}}});
  }catch(e){ stop(); toast("Camera access was blocked. Allow it in Settings, or use a photo instead."); fallback(m); return; }
  const v = ov.querySelector("video"); v.srcObject = stream; await v.play().catch(() => {});
  try{ const t = stream.getVideoTracks()[0], c = t.getCapabilities ? t.getCapabilities() : {}; if (c.focusMode && c.focusMode.includes("continuous")) await t.applyConstraints({advanced:[{focusMode:"continuous"}]}); }catch(e){}
  try{ const t = stream.getVideoTracks()[0], c = t.getCapabilities ? t.getCapabilities() : {};
    if (c.torch){ const bt = ov.querySelector(".sc-torch"); bt.hidden = false; let on = false; bt.onclick = async () => { on = !on; try{ await t.applyConstraints({advanced:[{torch:on}]}); bt.classList.toggle("on", on); }catch(e){ bt.hidden = true; } }; } }catch(e){}
  if ("BarcodeDetector" in window){ try{ detector = new BarcodeDetector({formats:["ean_13", "ean_8", "upc_a", "upc_e"]}); }catch(e){ detector = null; } }
  if (!detector) startWorker();
  loop = setInterval(tick, 180);
  pump();
}

let prev = null;
async function tick(){
  if (!ov || busy) return;
  const v = ov.querySelector("video"); if (!v.videoWidth) return;
  if (mode === "barcode") return;   // barcodes are read by pump(), as fast as the decoder allows
  // Label: watch motion and sharpness inside the scan box, keep the sharpest still frame, and capture automatically.
  // Thresholds adapt to the scene, so dim, noisy kitchens still trigger; after a few seconds the best frame so far is used anyway.
  const box = boxInVideo(v), w = 200, h = Math.max(1, Math.round(200 * box.h / box.w)), c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d", {willReadFrequently:true}); g.drawImage(v, box.x, box.y, box.w, box.h, 0, 0, w, h);
  const px = g.getImageData(0, 0, w, h).data, grey = new Float32Array(w * h);
  let mean = 0; for (let i = 0; i < w * h; i++){ grey[i] = px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114; mean += grey[i]; } mean /= w * h;
  let motion = 0; if (prev && prev.length === grey.length){ for (let i = 0; i < grey.length; i += 3) motion += Math.abs(grey[i] - prev[i]); motion /= grey.length / 3; } else motion = 99; prev = grey;
  let sum = 0, sq = 0, n = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++){ const i = y * w + x, l = 4 * grey[i] - grey[i - 1] - grey[i + 1] - grey[i - w] - grey[i + w]; sum += l; sq += l * l; n++; }
  const sharp = (sq / n - (sum / n) ** 2) / Math.max(20, mean);       // normalised by brightness so low light isn't penalised
  minMotion = Math.min(minMotion, motion); best = Math.max(best * 0.99, sharp);
  const still = motion < Math.max(3, minMotion * 2.5), crisp = sharp >= best * 0.85;
  if (still && sharp >= keptScore){ keptScore = sharp; keep(v); }
  steady = still && crisp ? steady + 1 : Math.max(0, steady - 1);
  setProgress(Math.min(1, Math.max(steady / 5, (Date.now() - labelStart) / 6000)));
  hint(mean < 45 ? "It's dark: turn on the light, or hold steady and I'll still try" : !still ? "Hold still…" : !crisp ? "Focusing…" : "Got it…");
  if (steady >= 5 || (Date.now() - labelStart > 6000 && keptScore > 0)) captureLabel();
}
let minMotion = 99, keptScore = 0, labelStart = 0;
const keepCan = document.createElement("canvas");
// The scan box on screen, mapped into video pixels (the video fills the screen with object-fit: cover).
function boxInVideo(v, pad = 0.08){
  const f = ov.querySelector(".sc-frame").getBoundingClientRect(), r = v.getBoundingClientRect();
  const k = Math.max(r.width / v.videoWidth, r.height / v.videoHeight), ox = (v.videoWidth * k - r.width) / 2, oy = (v.videoHeight * k - r.height) / 2;
  let x = (f.left - r.left + ox) / k, y = (f.top - r.top + oy) / k, w = f.width / k, h = f.height / k;
  x -= w * pad; y -= h * pad; w *= 1 + pad * 2; h *= 1 + pad * 2;
  x = Math.max(0, x); y = Math.max(0, y); w = Math.min(v.videoWidth - x, w); h = Math.min(v.videoHeight - y, h);
  return {x, y, w:Math.max(8, w), h:Math.max(8, h)};
}
let keptBox = null;
function keep(v){ keepCan.width = v.videoWidth; keepCan.height = v.videoHeight; keepCan.getContext("2d").drawImage(v, 0, 0); keptBox = boxInVideo(v, 0.3); }
function cropKept(){ const b = keptBox || {x:0, y:0, w:keepCan.width, h:keepCan.height}, c = document.createElement("canvas"); c.width = Math.round(b.w); c.height = Math.round(b.h); c.getContext("2d").drawImage(keepCan, b.x, b.y, b.w, b.h, 0, 0, c.width, c.height); return c; }
// Brighten and sharpen a copy for reading: per-channel contrast stretch, then a light unsharp mask, in greyscale.
function enhance(src){
  const max = 2000, k = Math.min(1, max / Math.max(src.width, src.height)), w = Math.round(src.width * k), h = Math.round(src.height * k);
  const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", {willReadFrequently:true}); g.drawImage(src, 0, 0, w, h);
  const im = g.getImageData(0, 0, w, h), d = im.data, grey = new Float32Array(w * h), hist = new Uint32Array(256);
  for (let i = 0; i < w * h; i++){ const v = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114; grey[i] = v; hist[v | 0]++; }
  let lo = 0, hi = 255, acc = 0; const n = w * h;
  for (let i = 0; i < 256; i++){ acc += hist[i]; if (acc > n * 0.01){ lo = i; break; } }
  acc = 0; for (let i = 255; i >= 0; i--){ acc += hist[i]; if (acc > n * 0.01){ hi = i; break; } }
  const span = Math.max(30, hi - lo);
  for (let i = 0; i < n; i++) grey[i] = Math.min(255, Math.max(0, (grey[i] - lo) * 255 / span));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
    const i = y * w + x, v = grey[i];
    const blur = (x > 0 && x < w - 1 && y > 0 && y < h - 1) ? (grey[i - 1] + grey[i + 1] + grey[i - w] + grey[i + w] + v) / 5 : v;
    const o = Math.min(255, Math.max(0, v + (v - blur) * 0.8));
    d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = o;
  }
  g.putImageData(im, 0, 0); return c;
}
/* Barcode pipeline: grab a frame, decode it off the main thread, and immediately grab the next one.
   zxing-cpp tries 0/90/180/270 degrees itself; every other frame is also drawn rotated 45 degrees so diagonal codes read too. */
let worker = null, waiting = false, frameNo = 0, reqId = 0;
function startWorker(){
  if (worker) return;
  try{ worker = new Worker("/barcode-worker.js"); worker.onmessage = e => { waiting = false; if (e.data && e.data.text) found(e.data.text); else pump(); }; worker.onerror = () => { waiting = false; worker = null; }; }
  catch(e){ worker = null; }
}
const fcan = document.createElement("canvas"), fctx = fcan.getContext("2d", {willReadFrequently:true});
function grab(v, angle){
  const max = 960, k = Math.min(1, max / Math.max(v.videoWidth, v.videoHeight));
  const w = Math.round(v.videoWidth * k), h = Math.round(v.videoHeight * k);
  if (!angle){ fcan.width = w; fcan.height = h; fctx.drawImage(v, 0, 0, w, h); return fctx.getImageData(0, 0, w, h); }
  const d = Math.round(Math.hypot(w, h)); fcan.width = d; fcan.height = d;
  fctx.fillStyle = "#fff"; fctx.fillRect(0, 0, d, d);
  fctx.translate(d / 2, d / 2); fctx.rotate(angle); fctx.drawImage(v, -w / 2, -h / 2, w, h); fctx.setTransform(1, 0, 0, 1, 0, 0);
  return fctx.getImageData(0, 0, d, d);
}
async function pump(){
  if (!ov || mode !== "barcode" || busy || waiting) return;
  const v = ov.querySelector("video");
  if (!v.videoWidth){ requestAnimationFrame(pump); return; }
  frameNo++;
  if (detector){
    waiting = true;
    try{ const r = await detector.detect(v); waiting = false; if (r[0]) return found(r[0].rawValue); }catch(e){ waiting = false; }
    requestAnimationFrame(pump); return;
  }
  if (!worker){ setTimeout(pump, 300); return; }
  const img = grab(v, frameNo % 2 ? 0 : Math.PI / 4);
  waiting = true; worker.postMessage({id:++reqId, img}, [img.data.buffer]);
}
async function found(code){
  if (!ov || busy || !/^\d{8,14}$/.test(code)){ pump(); return; }
  busy = true; try{ navigator.vibrate && navigator.vibrate(60); }catch(e){}
  ov.querySelector(".sc-frame").classList.add("hit");
  await gotBarcode(code); busy = false;
  if (ov && mode === "barcode") pump();
}
async function captureLabel(){
  if (!ov || busy) return; busy = true;
  const v = ov.querySelector("video");
  if (!keptScore) keep(v);
  try{ navigator.vibrate && navigator.vibrate(40); }catch(e){}
  hint("Reading the label…");
  const colour = await new Promise(r => keepCan.toBlob(r, "image/jpeg", 0.9));
  const sharp = await new Promise(r => enhance(cropKept()).toBlob(r, "image/jpeg", 0.9));
  stop(); busy = false;
  if (colour) scanLabel([sharp, colour].filter(Boolean));
}

async function offLookup(code){
  try{
    const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,product_name_en,brands,nutriments,serving_size,serving_quantity`, {headers:{"Accept":"application/json"}});
    if (!r.ok) return null;
    const j = await r.json(); if (j.status !== 1 || !j.product) return null;
    const p = j.product, n = p.nutriments || {};
    let kcal = n["energy-kcal_100g"]; if (kcal == null && n["energy_100g"] != null) kcal = n["energy_100g"] / 4.184;
    if (kcal == null) return null;
    const sq = +p.serving_quantity;
    return {schema:SCHEMA, id:"off-" + code, name:String(p.product_name_en || p.product_name || "Product " + code).slice(0, 80), brand:String(p.brands || "").split(",")[0].trim().slice(0, 60), barcode:code, src:"off",
      per100:{kcal:Math.round(+kcal), p:+n.proteins_100g || 0, c:+n.carbohydrates_100g || 0, f:+n.fat_100g || 0},
      serving:sq > 0 ? {g:sq, label:String(p.serving_size || "serving").slice(0, 30)} : null, liquid:/ml|l\b/i.test(p.serving_size || ""), uses:0, last:Date.now()};
  }catch(e){ return null; }
}
async function gotBarcode(code){
  hint("Found " + code + ". Looking it up…");
  const known = S.foods.find(f => f.barcode === code) || S.all.foods.find(f => f.barcode === code);
  if (known){ stop(); openFood(known); return; }
  const f = navigator.onLine ? await offLookup(code) : null;
  if (f){ stop(); openFood(f, {src:"off"}); return; }
  S.pendingBarcode = code;
  hint(navigator.onLine ? "Not in the database. Scan its nutrition label instead." : "Offline. Scan the nutrition label instead.");
  setTimeout(() => { if (ov) setMode("label"); }, 900);
}
function fallback(m){ const id = m === "label" ? "labelCam" : "barcodeCam", inp = document.getElementById(id); if (inp) inp.click(); }

window.openScanner = open;
window.offLookup = offLookup;
window.closeScanner = stop;
})();
