/* Decodes EAN/UPC barcodes off the main thread with zxing-cpp compiled to WebAssembly (much faster than the JS port). */
importScripts("/vendor/zxing-reader.js");
const ready = ZXingWASM.prepareZXingModule({
  overrides: { locateFile: (path, prefix) => path.endsWith(".wasm") ? "/vendor/" + path : prefix + path },
  fireImmediately: true
});
const OPTS = { formats: ["EAN13", "EAN8", "UPCA", "UPCE"], tryHarder: false, tryRotate: true, tryInvert: false, tryDownscale: true, maxNumberOfSymbols: 1 };
onmessage = async (e) => {
  const { id, img } = e.data;
  try {
    await ready;
    const res = await ZXingWASM.readBarcodes(img, OPTS);
    const hit = res.find((r) => r.isValid && r.text);
    postMessage({ id, text: hit ? hit.text : null });
  } catch (err) { postMessage({ id, text: null, err: String(err) }); }
};
