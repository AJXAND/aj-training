/* AJ Training · muscle-building coach.
   The plan adjusts itself, muscle by muscle, from how you respond, the way a good coach would:
   - After a session you rate pump, how hard it felt and any joint pain for each muscle you trained.
   - Next time that muscle comes up you say how it recovered. Together with whether your lifts went up (computed, no taps),
     that sets next week's sets for that muscle on that day: add while you're recovering well and the work feels light,
     hold when it's about right, cut when you're still sore or your lifts drop (RP-style autoregulation; adding volume
     blindly isn't better: Barsuhn 2024). Caps keep weekly sets where the evidence runs out (Pelland 2026) and each session
     under ~11 sets for a muscle (Remmert 2025).
   - Loads use every working set and your reps in reserve; stalls get a planned response; a deload comes early if your
     recovery says so, and each new block restarts a little lighter with what it learned.
   Ratings are recovery signals, not growth markers (soreness isn't one: Damas 2016). Rules are coaching convention unless cited. */
(function(){
"use strict";
const C = () => (typeof S !== "undefined" && S.prog && S.prog.coach) || null;
const MUSN = () => (window.AJOnboard && AJOnboard.MUS) || {};
const LIB = () => (window.AJOnboard && AJOnboard.lib) || {};
const libOf = k => LIB()[String(k).replace(/-hvy$/, "")] || null;
const muOf = k => { const d = S.prog.exercises && S.prog.exercises[k]; if (d && d.mu) return d.mu; const l = libOf(k); return (l && l.mu) || {}; };
const isComp = k => { const l = libOf(k); return !!(l && l.c); };
// "0–1" → 0.5, "1–2" → 1.5, "DL" → 4
const rirNum = r => r == null ? 2 : String(r) === "DL" ? 4 : String(r) === "L" ? 1 : (parseFloat(String(r).replace("~", "")) || 0) + (String(r).includes("–") ? 0.5 : 0);
const name = m => MUSN()[m] || m;

function dayVariant(d){ const g = dayGym(d); return (d.variants && d.variants[g]) || []; }
function weekVol(){ const v = {}; S.prog.days.forEach(d => { if (d.rest || d.optional || !d.variants) return; dayVariant(d).forEach(([k, n]) => { for (const [m, f] of Object.entries(muOf(k))) v[m] = (v[m] || 0) + f * n; }); }); return v; }
function baseVol(){ const c = C(), v = {}; if (!c || !c.base) return v; S.prog.days.forEach(d => { const b = c.base[d.k]; if (!b) return; (b[dayGym(d)] || Object.values(b)[0] || []).forEach(([k, n]) => { for (const [m, f] of Object.entries(muOf(k))) v[m] = (v[m] || 0) + f * n; }); }); return v; }
function dayDirect(dayKey, m){ const d = S.prog.days.find(x => x.k === dayKey); if (!d) return 0; return dayVariant(d).reduce((t, [k, n]) => t + ((muOf(k)[m] || 0) >= 1 ? n : 0), 0); }
// muscles with at least 2 direct sets in a list of [k, sets] or session exercises
function trained(list){ const o = {}; list.forEach(x => { const k = x.k || x[0], n = x.sets ? (Array.isArray(x.sets) ? x.sets.length : x.sets) : x[1]; for (const [m, f] of Object.entries(muOf(k))) if (f >= 1) o[m] = (o[m] || 0) + n; }); return Object.keys(o).filter(m => o[m] >= 2 && m !== "fdelt"); }

/* ---------- performance: did this muscle's lifts go up? (RIR-adjusted e1RM, no taps) ---------- */
function bestE(sets, rir){ let b = 0; sets.forEach(q => { const qq = q.q != null ? +q.q : rirNum(rir), tot = +q.r + qq; if (+q.w > 0 && tot >= 3 && tot <= 15) b = Math.max(b, (+q.w) * (1 + tot / 30)); }); return b; }
function exPerf(e, sess){
  const prev = S.sessions.find(x => x.ts < sess.ts && !x.deload && (x.ex || []).some(y => y.k === e.k)); if (!prev) return null;
  const pe = prev.ex.find(y => y.k === e.k), a = bestE(e.sets, sess.rir), b = bestE(pe.sets, prev.rir);
  if (a > 0 && b > 0){ const d = (a - b) / b * 100; return d >= 1 ? 2 : d > -1.5 ? 1 : d > -4 ? 0 : -1; }
  const s1 = e.sets[0], p1 = pe.sets[0]; if (!s1 || !p1 || +s1.w !== +p1.w) return 1;
  const dr = +s1.r - +p1.r; return dr >= 1 ? 2 : dr === 0 ? 1 : dr > -3 ? 0 : -1;
}
// 2 up, 1 same, 0 down, -1 crash; median of the muscle's exercises, ties to the worse one
function perfFor(m, sess){
  const cats = (sess.ex || []).filter(e => (muOf(e.k)[m] || 0) >= 1).map(e => exPerf(e, sess)).filter(x => x != null).sort((a, b) => a - b);
  return cats.length ? cats[Math.floor((cats.length - 1) / 2)] : 1;
}
const PERF = {2:"up", 1:"holding", 0:"down", "-1":"well down"};

/* ---------- changing the plan ---------- */
function libDef(l){ return {n:l.n, lo:l.lo, hi:l.hi, rest:l.rest, eq:l.eq, m:l.ml || MUSN()[Object.keys(l.mu).find(m => l.mu[m] >= 1)] || "Other", mu:l.mu, note:l.note, len:l.len}; }
// add or remove sets for muscle m on one training day, in every gym's version of that day
function applySets(dayKey, m, d){
  const day = S.prog.days.find(x => x.k === dayKey); if (!day || !day.variants || !d) return 0;
  const c = C(), pri = new Set((c && c.pri) || []); let applied = 0;
  Object.keys(day.variants).forEach(g => {
    const list = day.variants[g]; let done = 0;
    for (let i = 0; i < Math.abs(d); i++){
      const cand = list.filter(x => (muOf(x[0])[m] || 0) >= 1);
      if (!cand.length) break;
      if (d > 0){
        const ok = cand.filter(x => x[1] < (pri.has(m) ? 5 : 4) && !((S.prog.exercises[x[0]] || {}).topSet && x[1] >= 4)).sort((a, b) => a[1] - b[1] || (isComp(a[0]) - isComp(b[0])));
        if (!ok.length){
          // every exercise for this muscle is full: add another one for it (2 sets), best stretch-biased option the gym has
          const kit = (gymList().find(x => x.id === g) || {}).kit || [], used = new Set(list.map(x => x[0]));
          const alt = Object.values(LIB()).filter(x => (x.mu[m] || 0) >= 1 && !used.has(x.k) && !["cond","sled","carry","erg"].includes(x.p) && x.q.every(r => AJOnboard.kitHas(kit, r)))
            .sort((a, b) => (a.c - b.c) || (b.len - a.len) || ((["machine","cable"].includes(b.eq)) - (["machine","cable"].includes(a.eq))))[0];
          if (!alt) break;
          S.prog.exercises[alt.k] = S.prog.exercises[alt.k] || Object.fromEntries(Object.entries(libDef(alt)).filter(([, v]) => v !== undefined));
          list.push([alt.k, 2]); done += 2; i++; continue;
        }
        ok[0][1]++; done++;
      } else {
        const pick = cand.slice().sort((a, b) => b[1] - a[1] || (isComp(a[0]) - isComp(b[0])))[0];
        if (pick[1] > 2){ pick[1]--; done--; } else if (cand.length > 1){ const iso = cand.filter(x => !isComp(x[0])).sort((a, b) => a[1] - b[1])[0] || pick; done -= iso[1]; list.splice(list.indexOf(iso), 1); } else break;
      }
    }
    if (g === dayGym(day)) applied = done;
  });
  return applied;
}
// swap an exercise that hurt for the best alternative with the same movement, in every gym that has the kit
function swapExercise(dayKey, oldK){
  const day = S.prog.days.find(x => x.k === dayKey), base = libOf(oldK); if (!day || !base) return null; let to = null;
  Object.keys(day.variants || {}).forEach(g => {
    const list = day.variants[g], i = list.findIndex(x => x[0] === oldK); if (i < 0) return;
    const kit = (gymList().find(x => x.id === g) || {}).kit || [], used = new Set(list.map(x => x[0]));
    const alt = Object.values(LIB()).filter(x => x.p === base.p && x.k !== base.k && !used.has(x.k) && x.q.every(r => AJOnboard.kitHas(kit, r)))
      .sort((a, b) => (b.len - a.len) || ((["machine","cable"].includes(b.eq)) - (["machine","cable"].includes(a.eq))))[0];
    if (!alt) return;
    S.prog.exercises[alt.k] = S.prog.exercises[alt.k] || Object.fromEntries(Object.entries(libDef(alt)).filter(([, v]) => v !== undefined));
    list[i] = [alt.k, list[i][1], list[i][2]].filter(v => v !== undefined); to = alt.k;
  });
  return to;
}

/* ---------- the weekly decision for one muscle on one training day ---------- */
function decide(m, sess, Srec){
  const c = C(); if (!c || !sess || sess.deload || !sess.fb || !sess.fb[m] || sess.fb[m].dec) return null;
  const fb = sess.fb[m], P = fb.P ?? 1, W = fb.W ?? 1, J = fb.J ?? 0, Sv = Srec ?? 2, perf = perfFor(m, sess);
  const mh = c.m[m] || (c.m[m] = {red:0, adds:0, peak:0, locked:false, hist:[]});
  const prevSlot = mh.hist.filter(h => h.slot === sess.dayKey).slice(-1)[0];
  let d = 0, why = "", swap = null;
  if (J === 2 && fb.jx){ swap = swapExercise(sess.dayKey, fb.jx); why = "it hurt, so that exercise is swapped"; }
  else if (perf === -1 || (perf === 0 && Sv === 3)){ d = -2; why = "your lifts dropped while still recovering"; }
  else if (Sv === 3 || W === 3){ d = -1; why = Sv === 3 ? "it was still sore" : "it felt like too much"; }
  else if (perf === 0 && prevSlot && prevSlot.perf === 0){ d = -1; why = "lifts down two weeks running"; }
  else if (perf === 0 || J === 1 || W === 2){ d = 0; why = perf === 0 ? "one off day, holding" : J === 1 ? "a little joint pain, holding" : "it felt very hard, holding"; }
  else if (Sv === 2){ d = P === 0 && perf >= 1 ? 1 : 0; why = d ? "recovered just in time with little pump" : "recovered just in time, holding"; }
  else if (Sv <= 1 && W === 0 && P === 0 && perf >= 1){ d = c.level === "inter" ? 2 : 1; why = "recovering early and the work felt easy"; }
  else if (Sv <= 1 && W <= 1 && perf >= 1 && P === 1){ d = 1; why = "recovering early with room to do more"; }
  else if (Sv === 0 && W === 0 && perf >= 1 && P === 2){ d = 1; why = "fully recovered and the work felt easy"; }
  else why = "holding steady";
  const wk = weekKey(new Date()), w = c.wk[wk] || (c.wk[wk] = {add:{}, red:0, total:0, down:0, n:0});
  w.n++; if (perf <= 0) w.down++;
  if (d > 0){
    const lean = c.phase === "cut" && (blockInfo() || {}).block > 2;
    const maxAdd = lean ? 0 : ["cut","maintain","recomp"].includes(c.phase) ? 1 : c.level === "inter" ? 2 : 1;
    const vol = weekVol()[m] || 0, bv = baseVol()[m] || vol;
    d = Math.min(d, maxAdd - (w.add[m] || 0), 6 - w.total, Math.floor((c.cap[m] || 20) - vol), (c.sessCap || 8) - dayDirect(sess.dayKey, m), Math.floor(bv * 1.6 - vol));
    if (mh.locked) d = 0;
    if (d <= 0){ d = 0; why = mh.locked ? "at the most it recovers from this block" : "at its weekly ceiling"; }
  }
  if (d < 0){ const vol = weekVol()[m] || 0, fl = (c.maint || {})[m] ?? 4; d = Math.max(d, Math.min(0, Math.ceil(fl - vol))); }
  const applied = d ? applySets(sess.dayKey, m, d) : 0;
  if (d > 0 && !applied) why = "no room left in that session";
  if (applied > 0){ w.add[m] = (w.add[m] || 0) + applied; w.total += applied; mh.adds += applied; }
  if (applied < 0){ w.red++; mh.red++; if (mh.red >= 2 && !mh.locked){ mh.locked = true; why += ". That's twice this block, so it stays here until the deload"; } }
  mh.peak = Math.max(mh.peak || 0, weekVol()[m] || 0);
  mh.hist.push({wk, slot:sess.dayKey, d:applied, perf, S:Sv, P, W, J});
  if (J >= 1){ const ek = c.ex[fb.jx || ""] || (fb.jx ? (c.ex[fb.jx] = {pain:0}) : null); if (ek) ek.pain = (ek.pain || 0) + J; }
  sess.fb[m].dec = 1; putDoc("sessions", sess.id, sess);
  c.log = [...(c.log || []).slice(-40), {t:Date.now(), m, day:sess.dayKey, d:applied, why, swap}];
  saveProg();
  return {m, d:applied, why, swap, perf};
}
// muscles in today's session with an earlier rated session this block still waiting for a recovery answer
function pending(list){
  const c = C(), bi = blockInfo(); if (!c || !bi || bi.deload) return [];
  return trained(list).map(m => { const sess = S.sessions.find(x => !x.deload && x.fb && x.fb[m] && !x.fb[m].dec && (x.block == null || x.block === bi.block)); return sess ? {m, sess} : null; }).filter(Boolean);
}
// when a workout is saved: anything left unanswered is decided with a neutral recovery
function settle(active){ pending(active.ex.map(e => [e.k, e.sets.length])).forEach(({m, sess}) => { if (active.rec && active.rec[m] != null) return; decide(m, sess, null); }); }

/* ---------- deloads and new blocks ---------- */
// called when a workout starts. A deload comes early if last week's recovery says so (from week 3);
// a new block restarts from week-1 volume, nudged by what the last block taught it.
function onStart(){
  const c = C(), bi = blockInfo(); if (!c || !bi || bi.pre || bi.brk) return null;
  let msg = null;
  if (bi.block > (c.block || 1)) msg = newBlock(bi.block);
  else if (!bi.deload && bi.week >= 3){
    const last = c.wk[weekKey(new Date(Date.now() - 7 * 864e5))], muscles = Object.keys(weekVol()).filter(m => (weekVol()[m] || 0) >= 2).length;
    if (last && (last.red >= Math.max(2, Math.round(muscles * 0.25)) || (last.n >= 5 && last.down / last.n >= 0.4))){
      const len = S.prog.deloadEvery || S.prog.rir.length, shift = len - bi.week;
      if (shift > 0){ const sd = parseD(S.prog.startDate); sd.setDate(sd.getDate() - 7 * shift); S.prog.startDate = ymd(sd); c.early = (c.early || 0) + 1; saveProg(); msg = "Deload this week: your recovery has been slipping, so the block ends early. Lighter sessions now, a fresh block next week."; }
    }
  }
  return msg;
}
function newBlock(n){
  const c = C(); if (!c || !c.base) return null;
  const notes = [];
  // what each muscle taught us: kept adding with no cuts → start higher; got cut → start lower
  const adj = {};
  Object.entries(c.m || {}).forEach(([m, h]) => { if (h.adds >= 2 && !h.red) adj[m] = 1; else if (h.red >= 2 || h.hist.some(x => x.d <= -2)) adj[m] = -1; });
  S.prog.days.forEach(d => { if (c.base[d.k]) d.variants = JSON.parse(JSON.stringify(c.base[d.k])); });
  // rotate exercises that hurt or stalled; favourites stay
  const love = new Set((S.prog.setup || {}).love || []);
  Object.entries(c.ex || {}).forEach(([k, e]) => { if (love.has(k)) return; if ((e.pain || 0) >= 3 || (e.stall || 0) >= 3){ S.prog.days.forEach(d => { if ((dayVariant(d) || []).some(x => x[0] === k)){ const to = swapExercise(d.k, k); if (to) notes.push(`${exDef(k).n} → ${exDef(to).n}`); } }); } });
  Object.entries(adj).forEach(([m, s]) => { S.prog.days.forEach(d => { if (!d.rest && d.variants && dayDirect(d.k, m)) applySets(d.k, m, s); }); });
  c.base = Object.fromEntries(S.prog.days.filter(d => !d.rest && d.variants).map(d => [d.k, JSON.parse(JSON.stringify(d.variants))]));
  c.block = n; c.m = {}; c.wk = {}; c.ex = {}; saveProg();
  const up = Object.keys(adj).filter(m => adj[m] > 0).map(name), dn = Object.keys(adj).filter(m => adj[m] < 0).map(name);
  return `Block ${n} starts. ${up.length ? `More sets for ${up.join(", ")}, which recovered well. ` : ""}${dn.length ? `Fewer for ${dn.join(", ")}, which struggled. ` : ""}${notes.length ? `New exercises: ${notes.join(", ")}.` : ""}`.trim();
}

/* ---------- loads: every working set, effort, stalls ---------- */
function roundTo(eq, gym, w, dir){ const inc = incFor(eq, gym) || 2.5, f = dir > 0 ? Math.ceil : dir < 0 ? Math.floor : Math.round; return Math.max(0, f(w / inc) * inc); }
function stallCount(h){ let n = 0; for (let i = 0; i + 1 < h.length && i < 5; i++){ const a = h[i].sets[0], b = h[i + 1].sets[0], ea = Math.max(...h[i].sets.map(q => e1(q.w, q.r))), eb = Math.max(...h[i + 1].sets.map(q => e1(q.w, q.r)));
  if (+a.w > +b.w || (+a.w === +b.w && +a.r > +b.r) || ea > eb * 1.005) break; n++; } return n; }
function advice(k, gym){
  const ex = exDef(k), bi = blockInfo(), t = bi && !bi.pre && !bi.brk ? rirNum(bi.deload ? "DL" : bi.rir) : 2, phase = S.profile.phase;
  let h = liftHistory(k, false, gym), cross = false;
  if (!h.length && gym){ h = liftHistory(k, false); cross = h.length > 0; }
  if (!h.length) return {status:"new", pill:`<span class="tag">New: find a weight for ${ex.topSet ? ex.lo + "–" + (ex.lo + 2) : ex.lo + "–" + ex.hi} reps</span>`, last:null};
  if (cross) return {status:"cross", pill:`<span class="tag">First time at ${esc(gymName(gym))}: stacks differ, aim ${ex.lo}–${ex.hi}</span>`, last:h[0], tw:"", tr:"", cross:true};
  const L = h[0], s1 = L.sets[0], sl = L.sets[L.sets.length - 1], w = +s1.w, r = +s1.r, lo = ex.lo, hi = ex.topSet ? ex.lo + 2 : ex.hi;
  const sess = S.sessions.find(x => x.id === L.id), stall = stallCount(h);
  const C1 = C(); if (C1){ C1.ex[k] = C1.ex[k] || {}; C1.ex[k].stall = stall; }
  // first time in a new block: ease back in at 95% (effort resets to 3 in reserve)
  if (bi && sess && sess.block != null && bi.block > sess.block && w > 0){ const tw = roundTo(ex.eq, gym, w * 0.95, -1); return {status:"hold", tw, tr:r, last:L, pill:`<span class="tag hold">New block: ${tw} kg, build back up</span>`}; }
  // you logged more left in the tank than the target: the weight was too light (Helms 2018: ~4% per rep of RIR)
  if (sl.q != null && +sl.q >= t + 2 && w > 0){ const tw = roundTo(ex.eq, gym, w * (1 + 0.04 * (+sl.q - t - 1)), 1); return {status:"up", tw, tr:Math.max(lo, r - 1), last:L, pill:`<span class="tag up">Too easy last time: ${tw} kg</span>`}; }
  if (sl.q != null && +sl.q <= t - 2 && w > 0){ const tw = roundTo(ex.eq, gym, w * (1 - 0.04 * (t - +sl.q - 1)), -1); return {status:"hold", tw, tr:r, last:L, pill:`<span class="tag hold">Went past the target: ${tw} kg</span>`}; }
  if (stall >= 3 && phase !== "cut" && w > 0){ const tw = roundTo(ex.eq, gym, w * 0.9, -1); return {status:"reset", tw, tr:hi, last:L, flag:"Stalled 3 times", pill:`<span class="tag flag">Stalled: reset to ${tw} kg × ${hi}, build back up</span>`}; }
  const hit = x => ex.topSet ? +x.sets[0].r >= hi : (+x.sets[0].r >= hi && +x.sets[x.sets.length - 1].r >= hi - 2);
  const topHit = hit(L), prevTop = h[1] && +h[1].sets[0].w === w && hit(h[1]);
  // bulk: top of the range once adds load; maintenance and cuts: twice running
  const addLoad = phase === "bulk" ? topHit : topHit && prevTop;
  if (addLoad){
    const lp = (libOf(k) || {}).p, lower = ["squat","hinge","glute","lunge","kneeext","kneeflex","calf","add","abd"].includes(lp);
    const w2 = nextLoad(ex.eq, gym, w) ?? (["machine","cable","other"].includes(ex.eq) ? w + (lower ? 5 : 2.5) : null);
    if (w2 == null || w2 === w) return {status:"up", tw:w, tr:hi, last:L, pill:`<span class="tag up">Add load: next weight up, aim ${lo}+</span>`};
    const e = w * (1 + (r + t) / 30), r2 = Math.floor(30 * (e / w2 - 1) - t);
    if (r2 >= lo) return {status:"up", tw:w2, tr:Math.min(hi, r2), last:L, pill:`<span class="tag up">Add load: ${w2} kg × ${Math.min(hi, r2)}</span>`};
    if (r < hi + 3) return {status:"reps", tw:w, tr:r + 1, last:L, pill:`<span class="tag rep">Next step (${w2} kg) is a big jump: first ${w} kg × ${r + 1}</span>`};
    return {status:"up", tw:w2, tr:lo, last:L, pill:`<span class="tag up">Add load: ${w2} kg, aim ${lo}+</span>`};
  }
  if (topHit) return {status:"hold", tw:w, tr:hi, last:L, pill:`<span class="tag hold">Top of the range once: repeat ${w} × ${hi}+</span>`};
  if (r < lo) return {status:"reps", tw:w, tr:lo, last:L, pill:`<span class="tag rep">Hold ${w} kg, get to ${lo}</span>`};
  if (phase === "cut") return {status:"hold", tw:w, tr:r, last:L, pill:`<span class="tag hold">Hold: match ${w} × ${r}</span>`};
  if (stall === 2) return {status:"reps", tw:w, tr:r + 1, last:L, flag:"No progress twice", pill:`<span class="tag rep">Same weight, 1 more rep than last time</span>`};
  return {status:"reps", tw:w, tr:r + 1, last:L, pill:`<span class="tag rep">Beat it: ${w} × ${r + 1}</span>`};
}

/* ---------- in the workout: deload loads, top sets, warm-ups, intensity techniques ---------- */
function deloadSets(dayKey, gym, k, n){ const c = C(), b = c && c.base && c.base[dayKey]; const row = b && (b[gym] || Object.values(b)[0] || []).find(x => x[0] === k); return Math.max(1, Math.ceil((row ? row[1] : n) / 2)); }
function warmup(ex, gym, w, kind){
  if (!(w > 0)) return "";
  const steps = kind === "heavy" ? [[.3,10],[.5,6],[.7,4],[.85,2]].concat(w >= 100 && ex.lo <= 6 ? [[.92,1]] : []) : kind === "comp" ? [[.5,8],[.75,4]] : [[.5,10]];
  return steps.map(([p, r]) => `${Math.max(ex.eq === "bb" ? 20 : 0, roundTo(ex.eq, gym, w * p, 0)) || "light"}×${r}`).join(" · ");
}
// which exercises get a warm-up line: the first heavy compound, then the first exercise for each muscle
function warmups(a){
  const seen = new Set(), out = {}; let heavyDone = false;
  a.ex.forEach((e, i) => { const ex = exDef(e.k), mu = muOf(e.k), prim = Object.keys(mu).find(m => mu[m] >= 1), first = prim && !seen.has(prim);
    Object.keys(mu).filter(m => mu[m] >= 1).forEach(m => seen.add(m));
    const heavy = !heavyDone && isComp(e.k) && (ex.eq === "bb" || ["squat","hinge"].includes((libOf(e.k) || {}).p)) && ex.lo <= 8;
    if (heavy){ heavyDone = true; out[i] = "heavy"; } else if (first) out[i] = isComp(e.k) ? "comp" : "iso"; });
  return out;
}
// intensity techniques only late in a block (target 1 or fewer in reserve), for trained lifters, on safe exercises, last set only
function techniques(a){
  const c = C(), bi = blockInfo(); if (!c || !bi || bi.pre || bi.brk || bi.deload || a.deload || c.level === "new" || rirNum(bi.rir) > 1) return;
  const max = c.phase === "cut" ? 1 : 3, used = new Set(); let n = 0;
  a.ex.forEach(e => { const l = libOf(e.k); if (!l || n >= max) return;
    const safe = !l.c || (l.eq === "machine" && ["squat","fpress","ipress","vpull","row"].includes(l.p)); if (!safe || /-hvy$/.test(e.k) || ["abs","core"].includes(l.p)) return;
    const prim = Object.keys(l.mu).find(m => l.mu[m] >= 1); if (!prim || used.has(prim)) return;
    if (((c.ex[e.k] || {}).pain || 0) > 0) return;
    e.tech = l.len >= 2 && ["machine","cable"].includes(l.eq) ? "lp" : ["lat","curl","rear","calf","pushdown"].includes(l.p) ? "myo" : "drop"; used.add(prim); n++; });
}
const TECH = {myo:["Myo-reps on the last set", "Go to failure, rest 5 deep breaths, then mini-sets of about a quarter of the reps. Stop when one falls short, or after 5."],
  drop:["Drop set on the last set", "Go to failure, strip 20-25% of the weight and go to failure again. Log it with + Drop set."],
  lp:["Lengthened partials on the last set", "At failure, keep going with half reps in the stretched half of the movement until you can't."],
  mech:["Finisher on the last set", "At failure, switch straight to an easier version and keep going."],
  hold:["Stretch hold on the last set", "At failure, hold the deepest stretch for about 20 seconds."],
  rp:["Rest-pause on the last set", "At failure, rest 15 seconds, then go to failure again."]};

window.AJCoach = {C, rirNum, trained, perfFor, decide, pending, settle, onStart, newBlock, advice, deloadSets, warmup, warmups, techniques, TECH, weekVol, name, PERF, muOf};
})();
