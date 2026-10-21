/* AJ Training service worker: keeps the app available offline and shows push notifications. */
const VERSION = "ajt-v60";
const SHELL = ["/", "/index.html", "/config.js", "/platform.js", "/scanner.js", "/onboard.js", "/science.js", "/sports.js", "/sportprofiles.js", "/sporticons.js", "/vendor/supabase.js", "/vendor/zxing.min.js", "/vendor/zxing-reader.js", "/vendor/zxing_reader.wasm", "/barcode-worker.js",
  "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png", "/icons/badge-96.png", "/foods-db.json"];

self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== "ajt-fonts").map(k => caches.delete(k)))).then(() => self.clients.claim())); });

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  // Google Fonts: cache and reuse.
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.open("ajt-fonts").then(async c => { const hit = await c.match(req); const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit); return hit || net; }));
    return;
  }
  if (url.origin !== location.origin) return; // Supabase, Open Food Facts, etc. go straight to the network.
  // The page itself: network first, revalidating past the 10-minute GitHub Pages cache, so updates arrive on the next open.
  if (req.mode === "navigate"){
    e.respondWith(fetch(req, {cache:"no-cache"}).then(r => { caches.open(VERSION).then(c => c.put("/index.html", r.clone())); return r; }).catch(() => caches.match("/index.html")));
    return;
  }
  // Big static files (libraries, icons, food database): cache first, refresh in the background.
  if (/^\/(vendor|icons)\/|\/foods-db\.json$/.test(url.pathname)){
    e.respondWith(caches.open(VERSION).then(async c => { const hit = await c.match(req, {ignoreSearch:true}); const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit); return hit || net; }));
    return;
  }
  // App code and config: network first (so updates land straight away), cache when offline or slow.
  e.respondWith(caches.open(VERSION).then(async c => {
    const net = fetch(req, {cache:"no-cache"}).then(r => { if (r.ok) c.put(req, r.clone()); return r; });
    const timeout = new Promise(res => setTimeout(() => res(null), 3000));
    try{ const r = await Promise.race([net, timeout]); if (r) return r; }catch(err){}
    return (await c.match(req, {ignoreSearch:true})) || net;
  }));
});

self.addEventListener("push", e => {
  let d = {}; try{ d = e.data ? e.data.json() : {}; }catch(err){ d = {body:e.data && e.data.text()}; }
  e.waitUntil(self.registration.showNotification(d.title || "AJ Training", {
    body:d.body || "Morning. Weigh in before you eat or drink.", icon:"/icons/icon-192.png", badge:"/icons/badge-96.png",
    tag:d.tag || "ajt", data:{url:d.url || "/#weigh"}, renotify:true
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || "/";
  e.waitUntil(self.clients.matchAll({type:"window", includeUncontrolled:true}).then(list => {
    for (const c of list){ if ("focus" in c){ c.postMessage({type:"open", url:target}); return c.focus(); } }
    return self.clients.openWindow(target);
  }));
});
