/* AJ Training · platform layer for the standalone app.
   The app was first built inside Claude, where it called claude.use("db" | "assets" | "sample" | "downloads").
   This file recreates that same small API on top of IndexedDB (works offline) and Supabase (sync, photos, Claude API),
   so the app code itself barely changes. */
(function(){
"use strict";
const CFG = window.AJ_CONFIG || {};
const HAS_BACKEND = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);
const sb = HAS_BACKEND ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:false}}) : null;
let user = null;
const status = {sync:"local", lastSync:null, pending:0, error:null};

/* ---------- IndexedDB ---------- */
const idbP = new Promise((res, rej) => {
  const r = indexedDB.open("ajtraining", 1);
  r.onupgradeneeded = () => { const d = r.result; d.createObjectStore("docs", {keyPath:"path"}); d.createObjectStore("meta"); d.createObjectStore("blobs"); };
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
});
function req(store, mode, fn){ return idbP.then(d => new Promise((res, rej) => { const t = d.transaction(store, mode), q = fn(t.objectStore(store)); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); })); }
const idb = {
  all: s => req(s, "readonly", st => st.getAll()),
  get: (s, k) => req(s, "readonly", st => st.get(k)),
  put: (s, v, k) => req(s, "readwrite", st => k === undefined ? st.put(v) : st.put(v, k)),
  del: (s, k) => req(s, "readwrite", st => st.delete(k))
};

/* ---------- Document store (same shape as Claude's db) ---------- */
const mem = new Map();          // path -> {path, col, id, data, deleted, dirty, v}
const listeners = new Set();
const ready = (async () => { (await idb.all("docs")).forEach(d => mem.set(d.path, d)); })();
const clone = o => o == null ? o : JSON.parse(JSON.stringify(o));
function split(path){ const p = String(path).split("/"); return {col:p.slice(0, -1).join("/"), id:p[p.length - 1]}; }
function docSnap(d){ const ok = !!(d && !d.deleted && d.data); const data = ok ? clone(d.data) : undefined; return {id:d ? d.id : "", exists:ok, data:() => data, metadata:{fromCache:true, hasPendingWrites:!!(d && d.dirty)}}; }
function querySnap(q){
  let rows = [...mem.values()].filter(d => d.col === q.col && !d.deleted && d.data);
  if (q.order){ const [f, dir] = q.order; rows.sort((a, b) => { const x = a.data[f], y = b.data[f]; if (x === y) return 0; if (x === undefined) return 1; if (y === undefined) return -1; return (x < y ? -1 : 1) * (dir === "desc" ? -1 : 1); }); }
  else rows.sort((a, b) => a.id < b.id ? -1 : 1);
  if (q.limit) rows = rows.slice(0, q.limit);
  const docs = rows.map(docSnap);
  return {docs, size:docs.length, empty:!docs.length, docChanges:() => [], metadata:{fromCache:true, hasPendingWrites:false}};
}
function notify(cols){ listeners.forEach(l => { if (l.col ? cols.has(l.col) : cols.has(split(l.path).col)) { try{ l.col ? l.cb(querySnap(l)) : l.cb(docSnap(mem.get(l.path))); }catch(e){ console.warn(e); } } }); }
async function write(path, data, deleted){
  const {col, id} = split(path), prev = mem.get(path);
  const d = {path, col, id, data:deleted ? null : clone(data), deleted:!!deleted, dirty:true, v:((prev && prev.v) || 0) + 1};
  mem.set(path, d); await idb.put("docs", d); notify(new Set([col])); scheduleSync();
}
function query(col, order, limit){
  return {
    orderBy:(f, dir) => query(col, [f, dir || "asc"], limit),
    limit:n => query(col, order, n),
    where:() => query(col, order, limit),
    get:async () => { await ready; return querySnap({col, order, limit}); },
    onSnapshot(cb, err){ const l = {col, order, limit, cb}; listeners.add(l); ready.then(() => cb(querySnap(l))); return () => listeners.delete(l); }
  };
}
function docRef(path){
  return {
    id:split(path).id, path,
    get:async () => { await ready; return docSnap(mem.get(path)); },
    set:data => write(path, data, false),
    update:async data => { await ready; const cur = mem.get(path); return write(path, {...((cur && cur.data) || {}), ...data}, false); },
    delete:() => write(path, null, true),
    onSnapshot(cb){ const l = {path, cb}; listeners.add(l); ready.then(() => cb(docSnap(mem.get(path)))); return () => listeners.delete(l); },
    collection:sub => collection(path + "/" + sub)
  };
}
function collection(col){ return Object.assign(query(col), {path:col, doc:id => docRef(col + "/" + (id || Math.random().toString(36).slice(2))), add:async data => { const r = docRef(col + "/" + Math.random().toString(36).slice(2)); await r.set(data); return r; }}); }
/* Demo space: the staff admin can switch to a separate, untouched "new user" copy of the app.
   It lives under paths prefixed "demo~/" in the admin's own rows, so it syncs like everything else and never mixes with real data. */
const ADMIN_EMAILS = ["smythjonesa@gmail.com"];
const isAdmin = () => !!(user && ADMIN_EMAILS.includes(String(user.email || "").toLowerCase()));
let MODE = "me"; try{ MODE = localStorage.getItem("ajmode") === "demo" ? "demo" : "me"; }catch(e){}
const NS = () => (MODE === "demo" && isAdmin()) ? "demo~/" : "";
const dbApi = {doc:p => docRef(NS() + p), collection:c => collection(NS() + c)};
async function resetDemo(){ await ready; for (const d of [...mem.values()]) if (d.path.startsWith("demo~/") && !d.deleted) await write(d.path, null, true); await sync(); }

/* ---------- Sync with Supabase ---------- */
let syncTimer = null, syncing = false, resync = false;
function scheduleSync(ms){ clearTimeout(syncTimer); syncTimer = setTimeout(sync, ms == null ? 1500 : ms); }
async function sync(){
  if (!sb || !user) { status.sync = "local"; return; }
  if (!navigator.onLine) { status.sync = "offline"; return; }
  if (syncing) { resync = true; return; }
  syncing = true; status.sync = "syncing";
  try{
    await ready;
    const dirty = [...mem.values()].filter(d => d.dirty);
    for (let i = 0; i < dirty.length; i += 200){
      const chunk = dirty.slice(i, i + 200);
      const {error} = await sb.from("docs").upsert(chunk.map(d => ({user_id:user.id, path:d.path, col:d.col, data:d.deleted ? null : d.data, deleted:d.deleted})), {onConflict:"user_id,path"});
      if (error) throw error;
      for (const d of chunk){ const cur = mem.get(d.path); if (cur && cur.v === d.v){ cur.dirty = false; await idb.put("docs", cur); } }
    }
    let since = (await idb.get("meta", "lastPull")) || "1970-01-01T00:00:00Z";
    const from = new Date(new Date(since).getTime() - 5 * 60 * 1000).toISOString(), changed = new Set();
    let maxTs = since, page = 0;
    while (true){
      const {data, error} = await sb.from("docs").select("path,col,data,deleted,updated_at").gt("updated_at", from).order("updated_at", {ascending:true}).range(page * 1000, page * 1000 + 999);
      if (error) throw error;
      for (const r of data){
        if (r.updated_at > maxTs) maxTs = r.updated_at;
        const cur = mem.get(r.path); if (cur && cur.dirty) continue;
        if (cur && !cur.deleted && !r.deleted && JSON.stringify(cur.data) === JSON.stringify(r.data)) continue;
        const d = {path:r.path, col:r.col, id:split(r.path).id, data:r.data, deleted:r.deleted, dirty:false, v:(cur && cur.v) || 0};
        mem.set(r.path, d); await idb.put("docs", d); changed.add(r.col);
      }
      if (data.length < 1000) break; page++;
    }
    await idb.put("meta", maxTs, "lastPull");
    await uploadPending();
    status.sync = "synced"; status.lastSync = Date.now(); status.error = null;
    if (changed.size) notify(changed);
  }catch(e){ console.warn("sync", e); status.sync = "error"; status.error = String(e.message || e); }
  syncing = false; status.pending = [...mem.values()].filter(d => d.dirty).length;
  if (resync){ resync = false; scheduleSync(500); }
}
window.addEventListener("online", () => scheduleSync(200));
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") scheduleSync(200); });
setInterval(() => scheduleSync(0), 60000);

/* ---------- Photos (same shape as Claude's assets) ---------- */
const blobUrls = new Map();
async function uploadPending(){
  const pending = (await idb.get("meta", "pendingUploads")) || [];
  if (!pending.length || !sb || !user) return;
  const left = [];
  for (const id of pending){
    const b = await idb.get("blobs", id); if (!b) continue;
    const {error} = await sb.storage.from("photos").upload(`${user.id}/${id}`, b, {upsert:true, contentType:b.type || "image/jpeg"});
    if (error) left.push(id);
  }
  await idb.put("meta", left, "pendingUploads");
}
async function getBlob(id){
  let b = await idb.get("blobs", id);
  if (!b && sb && user && navigator.onLine){
    const {data, error} = await sb.storage.from("photos").download(`${user.id}/${id}`);
    if (!error && data){ b = data; await idb.put("blobs", b, id); }
  }
  return b || null;
}
async function blobUrl(id){
  if (blobUrls.has(id)) return blobUrls.get(id);
  const b = await getBlob(id); if (!b) return null;
  const u = URL.createObjectURL(b); blobUrls.set(id, u); return u;
}
const assetsApi = {
  async upload(blob, opts){
    const id = (opts && opts.id) || [...crypto.getRandomValues(new Uint8Array(16))].map(x => x.toString(16).padStart(2, "0")).join("");
    await idb.put("blobs", blob, id);
    const pending = (await idb.get("meta", "pendingUploads")) || []; pending.push(id); await idb.put("meta", pending, "pendingUploads");
    scheduleSync(300);
    return {id, url:"/_blob/" + id, sizeBytes:blob.size, contentType:blob.type || "image/jpeg"};
  },
  async delete(ref){ const id = String(ref).replace("/_blob/", ""); await idb.del("blobs", id); if (sb && user) await sb.storage.from("photos").remove([`${user.id}/${id}`]); return {deleted:true}; },
  async list(){ return {assets:[], usage:{files:0, bytes:0, maxFiles:1e9, maxBytes:1e12}}; }
};
// The app references photos as /_blob/<id>. Serve those from local storage or Supabase.
const nativeFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input && input.url;
  if (url && url.startsWith("/_blob/")){ const b = await getBlob(url.slice(7)); return b ? new Response(b) : new Response("", {status:404}); }
  return nativeFetch(input, init);
};
new MutationObserver(muts => {
  for (const m of muts) for (const n of m.addedNodes){
    if (n.nodeType !== 1) continue;
    const imgs = n.matches && n.matches('img[src^="/_blob/"]') ? [n] : n.querySelectorAll ? n.querySelectorAll('img[src^="/_blob/"]') : [];
    imgs.forEach(img => { const id = img.getAttribute("src").slice(7); img.removeAttribute("src"); blobUrl(id).then(u => { if (u) img.src = u; }); });
  }
}).observe(document.documentElement, {childList:true, subtree:true});

/* ---------- Claude (same shape as Claude's sample) ---------- */
function toB64(blob){ return new Promise(res => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.readAsDataURL(blob); }); }
async function shrink(blob, max){
  try{ const bm = await createImageBitmap(blob); const k = Math.min(1, max / Math.max(bm.width, bm.height)), c = document.createElement("canvas");
    c.width = Math.round(bm.width * k); c.height = Math.round(bm.height * k); c.getContext("2d").drawImage(bm, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(b => r(b || blob), "image/jpeg", 0.85)); }catch(e){ return blob; }
}
async function callClaude(body){
  if (!sb) throw {code:"sampling_disabled", message:"No backend configured"};
  if (!user) throw {code:"not_granted", message:"Sign in first"};
  if (!navigator.onLine) throw {code:"upstream_error", message:"You're offline"};
  const {data, error} = await sb.functions.invoke("claude", {body});
  if (error){
    let st = error.context && error.context.status;
    throw {code:st === 429 ? "rate_limited" : st === 401 ? "session_expired" : "upstream_error", message:error.message};
  }
  if (data && data.type === "error") throw {code:data.error && data.error.type === "rate_limit_error" ? "rate_limited" : "upstream_error", message:data.error && data.error.message};
  return data;
}
async function sample(input, opts){
  opts = opts || {};
  const msgs = [];
  (typeof input === "string" ? [{role:"user", content:input}] : input).forEach(m => {
    const last = msgs[msgs.length - 1];
    if (last && last.role === m.role) last.content[0].text += "\n\n" + m.content; else msgs.push({role:m.role, content:[{type:"text", text:String(m.content)}]});
  });
  if (opts.images){
    const imgs = [...(opts.images.length !== undefined ? opts.images : [opts.images])];
    const blocks = []; for (const b of imgs){ const j = await shrink(b, 1568); blocks.push({type:"image", source:{type:"base64", media_type:"image/jpeg", data:await toB64(j)}}); }
    msgs[msgs.length - 1].content = blocks.concat(msgs[msgs.length - 1].content);
  }
  const tools = (opts.tools || []).map(t => ({name:t.name, description:t.description, input_schema:t.inputSchema || {type:"object", properties:{}}}));
  let text = "", stop = "";
  for (let round = 0; round < 6; round++){
    if (opts.signal && opts.signal.aborted) throw {code:"cancelled", text};
    const res = await callClaude({tier:opts.modelTier || "default", messages:msgs, tools:tools.length ? tools : undefined, max_tokens:opts.maxTokens || 4096});
    if (opts.signal && opts.signal.aborted) throw {code:"cancelled", text};
    stop = res.stop_reason;
    const said = (res.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    if (said.trim()){ text = text ? text + "\n\n" + said : said; if (opts.onText) try{ opts.onText({text, delta:said}); }catch(e){} }
    if (stop !== "tool_use") break;
    msgs.push({role:"assistant", content:res.content});
    const results = [];
    for (const b of res.content.filter(x => x.type === "tool_use")){
      const tool = (opts.tools || []).find(t => t.name === b.name);
      try{ const out = await tool.execute(b.input || {}, {signal:opts.signal || new AbortController().signal}); results.push({type:"tool_result", tool_use_id:b.id, content:typeof out === "string" ? out : JSON.stringify(out == null ? {ok:true} : out)}); }
      catch(e){ results.push({type:"tool_result", tool_use_id:b.id, content:"Error: " + (e && e.message || e), is_error:true}); }
    }
    msgs.push({role:"user", content:results});
  }
  if (!text.trim()) throw {code:"empty_completion"};
  return {text, truncated:stop === "max_tokens", modelTierApplied:opts.modelTier || "default"};
}
function parseJsonLoose(t){
  try{ return JSON.parse(t); }catch(e){}
  const f = t.match(/```(?:json)?\s*([\s\S]*?)```/); if (f) try{ return JSON.parse(f[1]); }catch(e){}
  const a = Math.min(...["{", "["].map(c => { const i = t.indexOf(c); return i < 0 ? 1e9 : i; })), z = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (a < z) try{ return JSON.parse(t.slice(a, z + 1)); }catch(e){}
  throw {code:"invalid_json", text:t};
}
sample.json = async (input, opts) => {
  const add = "\n\nReply with only the JSON value. No other text.";
  const inp = typeof input === "string" ? input + add : input.map((m, i) => i === input.length - 1 ? {...m, content:m.content + add} : m);
  const {text} = await sample(inp, {...(opts || {}), maxTokens:6000});
  return parseJsonLoose(text.trim());
};
sample.limits = async () => ({maxPromptBytes:262144, images:{maxCount:20, maxInputBytes:20e6, mediaTypes:["image/jpeg", "image/png", "image/webp", "image/gif"]}, tools:{maxCount:16}});

/* ---------- Downloads ---------- */
const downloadsApi = {
  async save({filename, data}){
    const blob = data instanceof Blob ? data : new Blob([data], {type:filename.endsWith(".json") ? "application/json" : "application/octet-stream"});
    const file = new File([blob], filename, {type:blob.type});
    if (navigator.canShare && navigator.canShare({files:[file]})){ try{ await navigator.share({files:[file], title:filename}); return {status:"saved"}; }catch(e){ if (e.name === "AbortError") throw {code:"declined"}; } }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    return {status:"saved"};
  }
};

/* ---------- Auth ---------- */
function loginScreen(){
  return new Promise(resolve => {
    if (window.splashDone) setTimeout(window.splashDone, 0);   // the sign-in screen replaces the launch animation
    const el = document.createElement("div"); el.className = "ajlogin";
    el.innerHTML = `<div class="ajlogin-in">${window.LOGO ? LOGO(72) : ""}<h1>AJ TRAINING</h1><p class="muted">Sign in to sync your training, food and photos.</p>
      <form id="ajLoginForm"><input class="field" id="ajEmail" type="email" autocomplete="username" placeholder="Email" required>
      <input class="field" id="ajPass" type="password" autocomplete="current-password" placeholder="Password" required minlength="8">
      <button class="btn orange" id="ajLoginBtn">Sign in</button><button type="button" class="link muted" id="ajForgot">Forgot password?</button><button type="button" class="link" id="ajSignup">First time? Create your account</button>
      <p class="small warn" id="ajLoginErr"></p></form></div>`;
    document.body.appendChild(el);
    let mode = "in";
    el.querySelector("#ajForgot").onclick = async () => {
      const email = el.querySelector("#ajEmail").value.trim(), err = el.querySelector("#ajLoginErr");
      if (!/.+@.+\..+/.test(email)){ err.textContent = "Type your email above first, then tap Forgot password."; return; }
      const r = await sb.auth.resetPasswordForEmail(email, {redirectTo:location.origin + "/?reset=1"});
      err.textContent = r.error ? r.error.message : "Check your email for a link to set a new password. Open it on this phone.";
    };
    el.querySelector("#ajSignup").onclick = () => { mode = mode === "in" ? "up" : "in"; el.querySelector("#ajLoginBtn").textContent = mode === "in" ? "Sign in" : "Create account"; el.querySelector("#ajSignup").textContent = mode === "in" ? "First time? Create your account" : "Have an account? Sign in"; };
    el.querySelector("#ajLoginForm").onsubmit = async e => {
      e.preventDefault(); const email = el.querySelector("#ajEmail").value.trim(), password = el.querySelector("#ajPass").value, err = el.querySelector("#ajLoginErr");
      err.textContent = ""; el.querySelector("#ajLoginBtn").disabled = true;
      const r = mode === "in" ? await sb.auth.signInWithPassword({email, password}) : await sb.auth.signUp({email, password});
      el.querySelector("#ajLoginBtn").disabled = false;
      if (r.error){ err.textContent = r.error.message; return; }
      if (!r.data.session){ err.textContent = "Check your email to confirm the account, then sign in."; mode = "in"; return; }
      el.remove(); resolve(r.data.session.user);
    };
  });
}
/* Set a new password: after a reset link, or from Settings while signed in. */
function newPasswordScreen(){
  return new Promise(resolve => {
    const el = document.createElement("div"); el.className = "ajlogin";
    el.innerHTML = `<div class="ajlogin-in">${window.LOGO ? LOGO(72) : ""}<h1>NEW PASSWORD</h1><p class="muted">At least 8 characters. Save it in your password manager when your phone offers.</p>
      <form id="ajPwForm"><input type="email" autocomplete="username" value="${escH(user ? user.email : "")}" hidden>
      <input class="field" id="ajPw1" type="password" autocomplete="new-password" placeholder="New password" required minlength="8">
      <input class="field" id="ajPw2" type="password" autocomplete="new-password" placeholder="Type it again" required minlength="8">
      <button class="btn orange" id="ajPwBtn">Save password</button><button type="button" class="link muted" id="ajPwCancel">Cancel</button><p class="small warn" id="ajPwErr"></p></form></div>`;
    document.body.appendChild(el);
    el.querySelector("#ajPwCancel").onclick = () => { el.remove(); resolve(false); };
    el.querySelector("#ajPwForm").onsubmit = async e => {
      e.preventDefault(); const a = el.querySelector("#ajPw1").value, b = el.querySelector("#ajPw2").value, err = el.querySelector("#ajPwErr");
      if (a !== b){ err.textContent = "Those don't match."; return; }
      el.querySelector("#ajPwBtn").disabled = true; const r = await sb.auth.updateUser({password:a}); el.querySelector("#ajPwBtn").disabled = false;
      if (r.error){ err.textContent = r.error.message; return; }
      el.remove(); (window.toast || alert)("Password changed"); resolve(true);
    };
  });
}
async function handleRecoveryLink(){
  const q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.replace(/^#/, ""));
  let ok = false;
  if (h.get("type") === "recovery" && h.get("access_token")){ const r = await sb.auth.setSession({access_token:h.get("access_token"), refresh_token:h.get("refresh_token")}); ok = !r.error; }
  else if (q.get("code")){ const r = await sb.auth.exchangeCodeForSession(q.get("code")); ok = !r.error; }
  if (q.get("reset") || h.get("type") === "recovery") history.replaceState(null, "", location.pathname);
  return ok && (q.get("reset") || h.get("type") === "recovery");
}
const authReady = (async () => {
  if (!sb) return null;
  let recovering = false; try{ recovering = await handleRecoveryLink(); }catch(e){ console.warn(e); }
  const {data} = await sb.auth.getSession();
  if (!data.session && document.readyState === "loading") await new Promise(r => document.addEventListener("DOMContentLoaded", r, {once:true}));
  user = data.session ? data.session.user : await loginScreen();
  if (recovering){ if (window.splashDone) setTimeout(window.splashDone, 0); await newPasswordScreen(); }
  sb.auth.onAuthStateChange((ev, session) => { user = session ? session.user : null; if (ev === "SIGNED_OUT") location.reload(); });
  return user;
})();
// First run on a new device: wait for the first pull so the app opens with your data.
const dbReady = (async () => {
  await ready; await authReady;
  if (sb && user && navigator.onLine){
    const first = !(await idb.get("meta", "lastPull"));
    const p = sync();
    if (first) await Promise.race([p, new Promise(r => setTimeout(r, 15000))]);
  }
  return dbApi;
})();

/* ---------- Push notifications ---------- */
function b64ToU8(s){ const p = "=".repeat((4 - s.length % 4) % 4), b = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from([...b].map(c => c.charCodeAt(0))); }
async function pushState(){
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return "unsupported";
  if (!sb || !CFG.vapidPublicKey) return "unconfigured";
  if (Notification.permission === "denied") return "denied";
  const reg = await navigator.serviceWorker.ready, sub = await reg.pushManager.getSubscription();
  return sub ? "on" : "off";
}
async function enablePush(time){
  const perm = await Notification.requestPermission(); if (perm !== "granted") throw new Error("Notifications weren't allowed");
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64ToU8(CFG.vapidPublicKey)});
  const j = sub.toJSON();
  const {error} = await sb.from("push_subs").upsert({user_id:user.id, endpoint:j.endpoint, sub:j, remind_at:time || "07:00", tz:Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London"}, {onConflict:"user_id,endpoint"});
  if (error) throw error;
}
async function disablePush(){
  const reg = await navigator.serviceWorker.ready, sub = await reg.pushManager.getSubscription();
  if (sub){ await sb.from("push_subs").delete().eq("endpoint", sub.endpoint); await sub.unsubscribe(); }
}

/* ---------- Apple Health steps (iOS Shortcut posts here) ---------- */
async function healthToken(){
  let {data} = await sb.from("health_tokens").select("token").limit(1);
  if (data && data[0]) return data[0].token;
  const token = [...crypto.getRandomValues(new Uint8Array(18))].map(x => x.toString(16).padStart(2, "0")).join("");
  const r = await sb.from("health_tokens").insert({token, user_id:user.id}); if (r.error) throw r.error; return token;
}

/* ---------- Import (from the Claude version's export) ---------- */
async function importExport(file){
  const d = JSON.parse(await file.text());
  if (!d || d.app !== "AJ Training Log") throw new Error("That isn't an AJ Training export");
  const put = (p, v) => write(p, v, false);
  if (d.profile) await put("meta/profile", d.profile);
  if (d.programme) await put("programme/current", d.programme);
  if (d.bodyweight) await put("state/bodyweight", {entries:d.bodyweight});
  if (d.chat) await put("state/chat", {messages:d.chat});
  if (d.active) await put("state/active", {session:d.active});
  for (const x of d.sessions || []) await put("sessions/" + x.id, x);
  for (const x of d.cardio || []) await put("cardio/" + x.id, x);
  for (const x of d.foods || []) await put("foods/" + x.id, x);
  for (const x of d.foodlog || []) await put("foodlog/" + x.date, x);
  for (const x of d.habits || []) await put("habits/" + x.date, x);
  for (const x of d.photosets || []) await put("photosets/" + x.id, x);
  let photos = 0;
  for (const [id, url] of Object.entries(d.photoData || {})){ const b = await (await nativeFetch(url)).blob(); await assetsApi.upload(b, {id}); photos++; }
  await sync();
  return {sessions:(d.sessions || []).length, food:(d.foodlog || []).length, photos};
}

/* ---------- Settings cards (rendered inside the app's Settings screen) ---------- */
const P = {status, user:() => user, hasBackend:HAS_BACKEND, push:"…", token:null, isAdmin:() => isAdmin(), mode:() => (MODE === "demo" && isAdmin()) ? "demo" : "me"};
P.settingsCards = () => {
  if (!HAS_BACKEND) return `<div class="card"><h2>Account</h2><span class="small muted">Running on this device only. Add your Supabase details in config.js to sync and unlock AI features.</span></div>`;
  const s = status, when = s.lastSync ? new Date(s.lastSync).toLocaleTimeString("en-GB", {hour:"2-digit", minute:"2-digit"}) : "never";
  const pushTxt = {on:"On. You'll get the weigh-in reminder each morning.", off:"Off.", denied:"Blocked. Turn notifications on for AJ Training in iPhone Settings.", unsupported:"Add the app to your Home Screen first, then open it from there to turn these on.", unconfigured:"Not set up on the server yet."}[P.push] || "Checking…";
  const admin = isAdmin() ? `<div class="card admin"><div class="spread"><h2>Staff</h2><span class="tag rep">Admin</span></div>
      <div class="seg" role="group" style="grid-template-columns:1fr 1fr"><button data-plat="modeMe" aria-pressed="${MODE !== "demo"}">My account</button><button data-plat="modeDemo" aria-pressed="${MODE === "demo"}">Demo (new user)</button></div>
      <span class="small muted">${MODE === "demo" ? "You're in the demo: exactly what a brand-new user sees. Nothing here touches your real data." : "Switch to the demo to see the app as a new user would, before any setup."}</span>
      ${MODE === "demo" ? `<button class="btn danger" data-plat="resetDemo">${P.confirmReset ? "Tap again to wipe the demo" : "Reset demo to brand new"}</button>` : `<button class="btn ghost" data-plat="rerunSetup">Run first-time setup again</button>`}</div>` : "";
  return admin + `<div class="card"><h2>Account</h2><div class="kv" style="border:0;padding:0"><div><span>Signed in</span><span>${user ? escH(user.email) : "–"}</span></div>
      <div><span>Sync</span><span>${{synced:"Up to date", syncing:"Syncing…", offline:"Offline, will sync later", error:"Sync problem", local:"This device only"}[s.sync] || s.sync} · ${when}</span></div>
      ${s.pending ? `<div><span>Waiting to sync</span><span>${s.pending}</span></div>` : ""}${s.error ? `<div class="note">${escH(s.error)}</div>` : ""}</div>
      <div class="grid2"><button class="btn ghost" data-plat="sync">Sync now</button><button class="btn ghost" data-plat="signout">Sign out</button></div>
      <button class="btn ghost" data-plat="password">Change password</button></div>
    <div class="card"><h2>Notifications</h2><span class="small muted">${pushTxt}</span>
      <div class="row" style="flex-wrap:nowrap"><input class="field" id="pushTime" type="time" value="${escH(P.pushTime || "07:00")}" style="flex:1" aria-label="Reminder time">
      <button class="btn small ${P.push === "on" ? "ghost" : "orange"}" data-plat="${P.push === "on" ? "pushOff" : "pushOn"}">${P.push === "on" ? "Turn off" : "Turn on"}</button></div>
      ${P.push === "on" ? `<button class="link" data-plat="pushOn">Save new time</button>` : ""}</div>
    <div class="card"><h2>Apple Health steps</h2>
      <span class="small muted">Apple only lets App Store apps read Health directly, so a tiny Shortcut on your iPhone passes your steps across. Set it up once (about a minute), then tap Sync whenever you like, or let it run nightly.</span>
      ${P.token ? `<button class="btn orange" data-plat="copyLink">${P.copied ? "Link copied ✓" : "1. Copy your personal link"}</button>
      <ol class="small hsteps"><li>Open <b>Shortcuts</b>, tap <b>+</b>, name it <b>Send Steps</b>.</li><li>Add <b>Find Health Samples</b>: Type <b>Steps</b>, Start Date <b>is Today</b>.</li><li>Add <b>Calculate Statistics</b>: <b>Sum</b>.</li>
        <li>Add <b>Get Contents of URL</b>: paste your link, then tap the end of it and insert the <b>Statistics</b> variable.</li><li>Done. Come back and tap Sync.</li></ol>
      <div class="grid2"><a class="btn ghost" href="shortcuts://run-shortcut?name=Send%20Steps" data-plat="ran">Sync steps now</a><a class="btn ghost" href="shortcuts://">Open Shortcuts</a></div>
      <span class="small muted">Optional, fully automatic: Shortcuts → Automation → + → Time of Day 23:30, Daily, Run Immediately → Run Shortcut: Send Steps.</span>`
        : `<button class="btn ghost" data-plat="token">Set up Apple Health steps</button>`}</div>
    <div class="card"><h2>Import from the old version</h2><span class="small muted">In the old version: Settings, Export all data. Then pick that file here. Photos come across too.</span>
      <button class="btn ghost" data-plat="import">Choose export file</button><input type="file" id="ajImport" accept="application/json,.json" hidden></div>`;
};
function escH(s){ return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;"}[c])); }
const rerender = () => { try{ window.render && render(); }catch(e){} };
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-plat]"); if (!b) return;
  const a = b.dataset.plat, t = window.toast || alert;
  try{
    if (a === "sync"){ await sync(); rerender(); t(status.sync === "synced" ? "Synced" : "Couldn't sync: " + (status.error || status.sync)); }
    if (a === "signout"){ await sb.auth.signOut(); }
    if (a === "password"){ await newPasswordScreen(); }
    if (a === "pushOn"){ const time = (document.getElementById("pushTime") || {}).value || "07:00"; P.pushTime = time; await enablePush(time); P.push = await pushState(); rerender(); t(`Reminder set for ${time}`); }
    if (a === "pushOff"){ await disablePush(); P.push = await pushState(); rerender(); t("Reminders off"); }
    if (a === "token"){ P.token = await healthToken(); rerender(); }
    if (a === "copyLink"){ const link = `${CFG.supabaseUrl}/functions/v1/health-steps?k=${P.token}&steps=`; await navigator.clipboard.writeText(link); P.copied = true; rerender(); t("Link copied. Now open Shortcuts."); }
    if (a === "modeMe" || a === "modeDemo"){ if (!isAdmin()) return; localStorage.setItem("ajmode", a === "modeDemo" ? "demo" : "me"); t(a === "modeDemo" ? "Opening the demo…" : "Back to your account…"); setTimeout(() => location.reload(), 500); }
    if (a === "resetDemo"){ if (!isAdmin() || MODE !== "demo") return; if (!P.confirmReset){ P.confirmReset = true; rerender(); setTimeout(() => { P.confirmReset = false; rerender(); }, 4000); return; } t("Resetting demo…"); await resetDemo(); try{ localStorage.removeItem("ajlog2:obdraft:prog"); localStorage.removeItem("ajlog2:obdraft:nut"); localStorage.removeItem("ajlog2:obdraft:welcome"); }catch(e){} setTimeout(() => location.reload(), 600); }
    if (a === "rerunSetup"){ window.AJOnboard && AJOnboard.welcome(true); }
    if (a === "import") document.getElementById("ajImport").click();
  }catch(err){ console.warn(err); t(String(err.message || err)); }
});
document.addEventListener("change", async e => {
  if (e.target.id !== "ajImport" || !e.target.files[0]) return;
  const t = window.toast || alert;
  try{ t("Importing…"); const r = await importExport(e.target.files[0]); t(`Imported ${r.sessions} workouts, ${r.food} food days and ${r.photos} photos`); setTimeout(() => location.reload(), 1500); }
  catch(err){ t("Import failed: " + (err.message || err)); }
});
authReady.then(async () => { try{ P.push = await pushState(); rerender(); if (sb && user){ const {data} = await sb.from("push_subs").select("remind_at").limit(1); if (data && data[0]) P.pushTime = data[0].remind_at; } }catch(e){ P.push = "unsupported"; } });
P.dashBanner = () => {
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (!standalone && /iPhone|iPad/.test(navigator.userAgent)) return `<div class="banner info"><b>Install the app.</b> Tap Share, then Add to Home Screen, and open it from there. That's what turns on offline mode and notifications.</div>`;
  if (HAS_BACKEND && user && P.push === "off" && CFG.vapidPublicKey) return `<div class="banner info"><b>Morning weigh-in reminder.</b> Get a nudge at 7:00 from AJ Training. <button class="link" data-plat="pushOn">Turn on</button></div>`;
  return "";
};
window.AJP = P;

/* ---------- The claude.use() shim the app calls ---------- */
window.claude = {
  use(name){
    if (name === "db") return dbReady;
    if (name === "assets") return authReady.then(() => assetsApi);
    if (name === "sample") return authReady.then(() => (sb && user) ? sample : null);
    if (name === "downloads") return Promise.resolve(downloadsApi);
    return Promise.resolve(null);
  }
};

/* ---------- Service worker ---------- */
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(e => console.warn("sw", e)));
})();
