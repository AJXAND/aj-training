/* AJ Training · live camera scanners.
   Barcode: reads EAN/UPC from the video feed continuously, then looks the product up in your saved foods and Open Food Facts.
   Label: waits until the camera is steady and the text is sharp, then captures automatically and sends it to Claude to read. */
(function(){
"use strict";
let ov = null, stream = null, loop = null, mode = "barcode", detector = null, zx = null, steady = 0, best = 0, busy = false;

function el(html){ const d = document.createElement("div"); d.innerHTML = html; return d.firstElementChild; }
function stop(){
  clearInterval(loop); loop = null;
  if (stream){ stream.getTracks().forEach(t => t.stop()); stream = null; }
  if (ov){ ov.remove(); ov = null; }
  document.body.style.overflow = "";
}
function setMode(m){
  mode = m; steady = 0; best = 0;
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
      <div class="seg sc-seg"><button data-smode="barcode">Barcode</button><button data-smode="label">Label</button></div></div>
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
  if ("BarcodeDetector" in window){ try{ detector = new BarcodeDetector({formats:["ean_13", "ean_8", "upc_a", "upc_e"]}); }catch(e){ detector = null; } }
  if (!detector && window.ZXing){
    const hints = new Map(); hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [ZXing.BarcodeFormat.EAN_13, ZXing.BarcodeFormat.EAN_8, ZXing.BarcodeFormat.UPC_A, ZXing.BarcodeFormat.UPC_E]); hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
    zx = new ZXing.MultiFormatReader(); zx.setHints(hints);
  }
  loop = setInterval(tick, 180);
}

let prev = null;
async function tick(){
  if (!ov || busy) return;
  const v = ov.querySelector("video"); if (!v.videoWidth) return;
  if (mode === "barcode") return readBarcode(v);
  // Label: measure motion and sharpness on a small greyscale copy of the frame.
  const w = 160, h = Math.round(160 * v.videoHeight / v.videoWidth), c = document.createElement("canvas"); c.width = w; c.height = h;
  const g = c.getContext("2d", {willReadFrequently:true}); g.drawImage(v, 0, 0, w, h);
  const px = g.getImageData(0, 0, w, h).data, grey = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) grey[i] = px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114;
  let motion = 0; if (prev) { for (let i = 0; i < grey.length; i += 4) motion += Math.abs(grey[i] - prev[i]); motion /= grey.length / 4; } prev = grey;
  let sum = 0, sq = 0, n = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++){ const i = y * w + x, l = 4 * grey[i] - grey[i - 1] - grey[i + 1] - grey[i - w] - grey[i + w]; sum += l; sq += l * l; n++; }
  const sharp = sq / n - (sum / n) ** 2; best = Math.max(best * 0.995, sharp);
  const still = motion < 4, crisp = sharp > 120 && sharp >= best * 0.8;
  steady = still && crisp ? steady + 1 : Math.max(0, steady - 2);
  setProgress(Math.min(1, steady / 6));
  hint(!crisp ? "Move closer so the numbers are sharp" : !still ? "Hold still…" : "Got it…");
  if (steady >= 6) captureLabel();
}
async function readBarcode(v){
  let code = null;
  try{
    if (detector){ const r = await detector.detect(v); if (r[0]) code = r[0].rawValue; }
    else if (zx){
      const c = ov.querySelector("canvas"), cw = Math.min(1280, v.videoWidth), ch = Math.round(cw * v.videoHeight / v.videoWidth);
      c.width = cw; c.height = Math.round(ch * 0.5);
      c.getContext("2d", {willReadFrequently:true}).drawImage(v, 0, v.videoHeight * 0.25, v.videoWidth, v.videoHeight * 0.5, 0, 0, c.width, c.height);
      const bmp = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(new ZXing.HTMLCanvasElementLuminanceSource(c)));
      code = zx.decode(bmp).getText();
    }
  }catch(e){ /* nothing in frame yet */ }
  if (code && /^\d{8,14}$/.test(code)){ busy = true; try{ navigator.vibrate && navigator.vibrate(60); }catch(e){} await gotBarcode(code); busy = false; }
}
async function captureLabel(){
  if (!ov || busy) return; busy = true;
  const v = ov.querySelector("video"), c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight;
  c.getContext("2d").drawImage(v, 0, 0);
  try{ navigator.vibrate && navigator.vibrate(40); }catch(e){}
  const blob = await new Promise(r => c.toBlob(r, "image/jpeg", 0.9));
  stop(); busy = false;
  if (blob) scanLabel(blob);
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
