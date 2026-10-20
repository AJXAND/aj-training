/* AJ Training · live camera scanners.
   Barcode: reads EAN/UPC from the video feed continuously, then looks the product up in your saved foods and Open Food Facts.
   Label: captures the first steady, glare-free frame (within ~1.5s at most) and sends it to Claude to read.
   The camera stream is kept warm for a few minutes after closing, so reopening is instant and iOS doesn't ask again. */
(function(){
"use strict";
let ov = null, stream = null, loop = null, mode = "barcode", detector = null, steady = 0, best = 0, busy = false, idle = null, torchOn = false;
const KEEP_WARM_MS = 5 * 60 * 1000;
function live(){ return stream && stream.getVideoTracks().some(t => t.readyState === "live"); }
function release(){ if (stream){ stream.getTracks().forEach(t => t.stop()); stream = null; } }

function el(html){ const d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
function stop(){
  clearInterval(loop); loop = null; waiting = false; busy = false;
  if (stream && torchOn){ try{ stream.getVideoTracks()[0].applyConstraints({advanced:[{torch:false}]}); }catch(e){} torchOn = false; }
  release();   // stop the camera straight away so iOS's recording indicator goes off
  if (ov){ const v = ov.querySelector("video"); if (v) v.srcObject = null; ov.remove(); ov = null; }
  document.body.style.overflow = "";
}
function setMode(m, msg){
  if (!ov) return;
  mode = m; steady = 0; best = 0; minMotion = 99; keptScore = 0; sharpHist = []; stillN = 0; labelN = 0; aimedMs = 0; labelStart = Date.now() + (msg ? 1500 : 0); prev = null; busy = false;
  if (m === "barcode") setTimeout(pump, 30);
  ov.querySelectorAll("[data-smode]").forEach(b => b.setAttribute("aria-pressed", b.dataset.smode === m));
  ov.querySelector(".sc-frame").className = "sc-frame " + m;
  ov.querySelector(".sc-shutter").hidden = m !== "label";
  hint(msg || (m === "barcode" ? "Point at the barcode" : "Fill the frame with the nutrition panel"));
}
function hint(t){ if (ov) ov.querySelector(".sc-hint").textContent = t; }
function setProgress(p){ if (ov) ov.querySelector(".sc-ring i").style.width = Math.round(p * 100) + "%"; }

async function open(m, msg){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ fallback(m); return; }
  ov = el(`<div class="scanner" role="dialog" aria-label="Scanner">
    <video playsinline muted autoplay></video><canvas hidden></canvas>
    <div class="sc-top"><button class="sc-x" aria-label="Close">✕</button>
      <div class="seg sc-seg"><button data-smode="barcode">Barcode</button><button data-smode="label">Label</button></div><button class="sc-torch" aria-label="Torch" hidden>💡</button></div>
    <div class="sc-frame"></div>
    <div class="sc-bottom"><div class="sc-ring"><i></i></div><p class="sc-hint"></p><button class="sc-shutter" aria-label="Capture now" hidden><span>Capture</span></button></div>
  </div>`);
  document.body.appendChild(ov); document.body.style.overflow = "hidden";
  ov.querySelector(".sc-x").onclick = stop;
  ov.querySelectorAll("[data-smode]").forEach(b => b.onclick = () => setMode(b.dataset.smode));
  ov.querySelector(".sc-shutter").onclick = () => captureLabel();
  setMode(m, msg);
  clearTimeout(idle);
  try{
    if (!live()) stream = await navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:{ideal:"environment"}, width:{ideal:1920}, height:{ideal:1080}}});
  }catch(e){ stop(); release(); toast("Camera access was blocked. Allow it in Settings, or use a photo instead."); fallback(m); return; }
  if (!ov){ return; }
  const v = ov.querySelector("video"); v.srcObject = stream; await v.play().catch(() => {});
  try{ const t = stream.getVideoTracks()[0], c = t.getCapabilities ? t.getCapabilities() : {}; if (c.focusMode && c.focusMode.includes("continuous")) await t.applyConstraints({advanced:[{focusMode:"continuous"}]}); }catch(e){}
  try{ const t = stream.getVideoTracks()[0], c = t.getCapabilities ? t.getCapabilities() : {};
    if (c.torch){ const bt = ov.querySelector(".sc-torch"); bt.hidden = false; bt.onclick = async () => { torchOn = !torchOn; try{ await t.applyConstraints({advanced:[{torch:torchOn}]}); bt.classList.toggle("on", torchOn); }catch(e){ bt.hidden = true; } }; } }catch(e){}
  if ("BarcodeDetector" in window){ try{ detector = new BarcodeDetector({formats:["ean_13", "ean_8", "upc_a", "upc_e"]}); }catch(e){ detector = null; } }
  if (!detector) startWorker();
  loop = setInterval(tick, 90);
  pump();
}

let prev = null;
async function tick(){
  if (!ov || busy) return;
  const v = ov.querySelector("video"); if (!v.videoWidth) return;
  if (mode === "barcode") return;   // barcodes are read by pump(), as fast as the decoder allows
  // Label: only fire when the box actually contains a nutrition table (rows of text), the camera has finished focusing,
  // and the phone is still. Nothing depends on absolute brightness, so dim rooms work. Never captures a random scene.
  const box = boxInVideo(v), w = 160, h = Math.max(1, Math.round(160 * box.h / box.w)), c = tc; c.width = w; c.height = h;
  const g = c.getContext("2d", {willReadFrequently:true}); g.drawImage(v, box.x, box.y, box.w, box.h, 0, 0, w, h);
  const px = g.getImageData(0, 0, w, h).data, grey = new Float32Array(w * h);
  let mean = 0, hot = 0;
  for (let i = 0; i < w * h; i++){ const r = px[i * 4], gg = px[i * 4 + 1], bb = px[i * 4 + 2]; grey[i] = r * 0.299 + gg * 0.587 + bb * 0.114; mean += grey[i]; if (r > 245 && gg > 245 && bb > 245) hot++; }
  mean /= w * h;
  let vsum = 0; for (let i = 0; i < w * h; i++) vsum += (grey[i] - mean) ** 2; const sdev = Math.sqrt(vsum / (w * h));
  const glare = hot / (w * h);
  // movement measured on 8x8-pixel block averages, so normal hand shake of a few pixels barely registers
  const bw = Math.floor(w / 8), bh = Math.floor(h / 8), blk = new Float32Array(bw * bh);
  for (let by = 0; by < bh; by++) for (let bx = 0; bx < bw; bx++){ let t = 0; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) t += grey[(by * 8 + y) * w + bx * 8 + x]; blk[by * bw + bx] = t / 64; }
  let motion = 0; if (prev && prev.length === blk.length){ for (let i = 0; i < blk.length; i++) motion += Math.abs(blk[i] - prev[i]); motion /= blk.length; } else motion = 99; prev = blk;
  let sum = 0, sq = 0, n = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++){ const i = y * w + x, l = 4 * grey[i] - grey[i - 1] - grey[i + 1] - grey[i - w] - grey[i + w]; sum += l; sq += l * l; n++; }
  const sharp = (sq / n - (sum / n) ** 2) / Math.max(20, mean);
  // text-likeness: share of rows with many strong light/dark flips (characters), relative to the scene's own contrast
  const thr = Math.max(6, sdev * 0.45); let textRows = 0;
  for (let y = 0; y < h; y++){ let flips = 0, last = 0; for (let x = 1; x < w; x++){ const d = grey[y * w + x] - grey[y * w + x - 1]; if (Math.abs(d) > thr){ const sg = d > 0 ? 1 : -1; if (sg !== last){ flips++; last = sg; } } } if (flips >= w * 0.09) textRows++; }
  const text = textRows / h;
  sharpHist.push(sharp); if (sharpHist.length > 8) sharpHist.shift();
  const focused = sharpHist.length >= 4 && sharp >= Math.max(...sharpHist) * 0.85;
  minMotion = Math.min(minMotion, motion);
  const age = Date.now() - labelStart;
  if (age < 0){ setProgress(0); return; }   // give time to turn the pack round after a barcode miss
  const still = motion < Math.max(3, sdev * 0.12, minMotion * 2.5), textured = sdev > 4 && sharp > 0.02, isLabel = text >= 0.25 && textured;
  stillN = still ? stillN + 1 : Math.max(0, stillN - 2);          // one shaky frame doesn't reset the count
  if (textured) aimedMs += 90;
  const score = sharp * (1 - Math.min(0.9, glare * 10));
  if (textured && (still || motion < 8) && score > keptScore){ keptScore = score; keep(v); }
  const need = isLabel ? 4 : 6;                                              // ~0.35 s still on clear text, ~0.55 s otherwise
  const ready = textured && still && focused;
  setProgress(Math.min(1, isLabel && ready ? stillN / need : 0));
  ov.querySelector(".sc-frame").classList.toggle("ready", ready);
  if (!textured || !isLabel) hint("Fill the box with the nutrition table, or tap Capture");
  else if (glare > 0.02) hint("Glare on the label: tilt it slightly");
  else if (!still) hint("Hold still on the table");
  else if (!focused) hint("Focusing…");
  else hint("Hold…");
  // auto-capture only when it's clearly a nutrition table, in focus and held still; otherwise the shutter is always there
  if (age > 1200 && isLabel && ready && stillN >= need && glare <= 0.02) return captureLabel();
}
let sharpHist = [], stillN = 0, labelN = 0, aimedMs = 0;
const tc = document.createElement("canvas");
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
function scaled(src, max){ const k = Math.min(1, max / Math.max(src.width, src.height)); if (k === 1) return src; const c = document.createElement("canvas"); c.width = Math.round(src.width * k); c.height = Math.round(src.height * k); c.getContext("2d").drawImage(src, 0, 0, c.width, c.height); return c; }
// Brighten and sharpen a copy for reading: per-channel contrast stretch, then a light unsharp mask, in greyscale.
function enhance(src){
  const max = 1600, k = Math.min(1, max / Math.max(src.width, src.height)), w = Math.round(src.width * k), h = Math.round(src.height * k);
  const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d", {willReadFrequently:true}); g.drawImage(src, 0, 0, w, h);
  const im = g.getImageData(0, 0, w, h), d = im.data, grey = new Float32Array(w * h), hist = new Uint32Array(256);
  for (let i = 0; i < w * h; i++){ const v = d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114; grey[i] = v; hist[v | 0]++; }
  let lo = 0, hi = 255, acc = 0; const n = w * h;
  for (let i = 0; i < 256; i++){ acc += hist[i]; if (acc > n * 0.01){ lo = i; break; } }
  const blown = hist[255] + hist[254] + hist[253] + hist[252] + hist[251] + hist[250]; acc = 0;
  for (let i = 249; i >= 0; i--){ acc += hist[i]; if (acc > (n - blown) * 0.01){ hi = i; break; } }
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
  // Decode only the scan box (plus a margin), at most 720px: far fewer pixels per frame than the full picture.
  const b = boxInVideo(v, 0.35), max = 720, k = Math.min(1, max / Math.max(b.w, b.h));
  const w = Math.round(b.w * k), h = Math.round(b.h * k);
  if (!angle){ fcan.width = w; fcan.height = h; fctx.drawImage(v, b.x, b.y, b.w, b.h, 0, 0, w, h); return fctx.getImageData(0, 0, w, h); }
  const d = Math.round(Math.hypot(w, h)); fcan.width = d; fcan.height = d;
  fctx.fillStyle = "#fff"; fctx.fillRect(0, 0, d, d);
  fctx.translate(d / 2, d / 2); fctx.rotate(angle); fctx.drawImage(v, b.x, b.y, b.w, b.h, -w / 2, -h / 2, w, h); fctx.setTransform(1, 0, 0, 1, 0, 0);
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
  const img = grab(v, frameNo % 3 ? 0 : Math.PI / 4);
  waiting = true; worker.postMessage({id:++reqId, img}, [img.data.buffer]);
}
function validEAN(code){
  if (!/^(\d{8}|\d{12}|\d{13}|\d{14})$/.test(code)) return false;
  const d = code.split("").map(Number), check = d.pop(); let t = 0;
  d.reverse().forEach((x, i) => t += x * (i % 2 ? 1 : 3));
  return (10 - t % 10) % 10 === check;
}
async function found(code){
  if (!ov || busy || mode !== "barcode") return;
  if (!validEAN(code)){ pump(); return; }
  busy = true; try{ navigator.vibrate && navigator.vibrate(60); }catch(e){}
  ov.querySelector(".sc-frame").classList.add("hit");
  await gotBarcode(code);      // either opens the food, or switches to label mode; never resumes the barcode loop on its own
}
// Read the label without closing the camera: the frame freezes while it reads; a miss lets you try again straight away
// (closing and reopening the camera is what made iOS ask for permission again).
async function captureLabel(){
  if (!ov || busy) return; busy = true;
  const v = ov.querySelector("video");
  keep(v);   // the frame you're looking at when you tap, or the sharp still frame that triggered auto-capture
  try{ navigator.vibrate && navigator.vibrate(40); }catch(e){}
  ov.classList.add("reading"); hint("Reading the label…"); setProgress(1); try{ v.pause(); }catch(e){}
  const colour = await new Promise(r => scaled(keepCan, 1600).toBlob(r, "image/jpeg", 0.85));
  const sharp = await new Promise(r => enhance(cropKept()).toBlob(r, "image/jpeg", 0.85));
  let res = null;
  try{ res = await window.readLabel([sharp, colour].filter(Boolean)); }catch(e){ res = {error:e && e.msg ? e.msg : e && e.code === "not_granted" ? "AI image access isn't allowed" : "couldn't read it"}; }
  if (!ov) return;
  if (res && res.food){ stop(); busy = false; window.labelDone(res.food); return; }
  ov.classList.remove("reading"); try{ v.play(); }catch(e){} busy = false; keptScore = 0; stillN = 0; sharpHist = []; labelStart = Date.now() + 1200; setProgress(0);
  hint("Couldn't read that" + (res && res.error ? ": " + String(res.error).toLowerCase().slice(0, 50) : "") + ". Move closer, avoid glare, and try again.");
}

async function offLookup(code){
  try{
    const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 5000);
    const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,product_name_en,brands,nutriments,serving_size,serving_quantity`, {headers:{"Accept":"application/json"}, signal:ctl.signal});
    clearTimeout(to);
    if (!r.ok) return null;
    const j = await r.json(); if (j.status !== 1 || !j.product) return null;
    const p = j.product, n = p.nutriments || {};
    // Prefer kJ when OFF's kcal disagrees with it: kcal is often user-typed, kJ comes from the printed label.
    let kcal = n["energy-kcal_100g"], kj = n["energy-kj_100g"] ?? n["energy_100g"];
    if (kj != null && (kcal == null || Math.abs(kcal - kj / 4.184) / (kj / 4.184) > 0.08)) kcal = kj / 4.184;
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
  if (!ov) return;
  setMode("label", navigator.onLine ? "Not in the food database. Point at the nutrition label." : "Offline. Point at the nutrition label.");
}
function fallback(m){ const id = m === "label" ? "labelCam" : "barcodeCam", inp = document.getElementById(id); if (inp) inp.click(); }

window.openScanner = open;
window.offLookup = offLookup;
window.closeScanner = stop;
})();
