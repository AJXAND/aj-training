/* AJ Training · strength coach (powerlifting and "get strong").
   Each main lift has a tracked estimated max (eT). Every session prescribes reps and an RPE target for each lift from the
   block and day type, the load comes from eT, and what you report (RPE, bar speed, missed reps, pain, readiness) moves eT
   and next week's plan. RPE loading matched or beat fixed percentages (Helms 2018); the %-of-max table is the RTS chart,
   which handles heavy singles better than Epley. Block shapes, tapers and the decision rules are coaching practice. */
(function(){
"use strict";
const ST = () => (typeof S !== "undefined" && S.prog && S.prog.strength) || null;
const OB = () => window.AJOnboard || {};
const pct = n => OB().pctOf ? OB().pctOf(n) : Math.max(0.6, 1 - (n - 1) * 0.027);
const DAY = 864e5, WEEK = 7 * DAY;
const VAR_RATIO = {frontsq:.80, ssbsq:.88, cgbench:.92, rdl:.70, pushpress:1.15, pullup:1, chinup:1, trapdl:1.05};
const NAME = {lp:"Linear progression", acc:"Accumulation", int:"Intensification", real:"Realisation", test:"Test week", dl:"Deload", peak:"Peak", meet:"Meet week", easy:"Easy week"};
const TAB = {
  acc:{H:{top:5, bo:3, boP:.90, rpe:[7,7.5,8,8.5]}, V:{sets:4, reps:6, rpe:[6.5,7,7.5,8]}, L:{sets:3, reps:5, rpe:[6.5,7,7,7.5]}, DH:{top:4, bo:2, boP:.90, rpe:[7,7.5,8,8.5]}, DL:{sets:3, reps:4, rpe:[6.5,7,7,7.5]}},
  int:{H:{top:3, bo:3, boP:.93, rpe:[7.5,8,8.5]}, V:{sets:4, reps:4, rpe:[7,7.5,8]}, L:{sets:3, reps:3, rpe:[7,7,7.5]}, DH:{top:3, bo:2, boP:.92, rpe:[7.5,8,8.5]}, DL:{sets:2, reps:3, rpe:[7,7,7]}},
  real:{H:{top:1, bo:2, boR:2, boP:.88, rpe:[8,8.5,9]}, V:{sets:3, reps:3, rpe:[7,7,6.5]}, L:{sets:2, reps:2, rpe:[6,6,6], comp:true}, DH:{top:1, bo:2, boR:2, boP:.88, rpe:[8,8.5,9]}, DL:{sets:2, reps:2, rpe:[6,6,6], comp:true}}
};
const ACC_X = {lp:1, acc:1, int:.75, real:.6, peak:.5, test:.5, meet:.3, dl:.5, easy:.5};

/* ---------- where you are in the year ---------- */
function at(ts){
  const st = ST(); if (!st) return null;
  const start = weekStart(parseD(S.prog.startDate)).getTime(), i = Math.floor((weekStart(new Date(ts)).getTime() - start) / WEEK);
  if (i < 0) return {pre:true, starts:S.prog.startDate};
  let mac = st.macro, j = i, cycle = 1;
  const tot = mac.reduce((a, m) => a + m.weeks, 0);
  if (st.meet && i >= tot){ j = i - tot; if (j === 0) return {type:"easy", wk:1, weeks:1, idx:i, cycle:2, eIdx:99}; mac = OB().strMacro(st.level === "new" ? "new" : st.level, null); j -= 1; cycle = 2; }
  const T = mac.reduce((a, m) => a + m.weeks, 0); cycle += Math.floor(j / T); j = j % T;
  for (let e = 0; e < mac.length; e++){ if (j < mac[e].weeks) return {type:mac[e].type, wk:j + 1, weeks:mac[e].weeks, idx:i, cycle, eIdx:e}; j -= mac[e].weeks; }
  return {type:"acc", wk:1, weeks:1, idx:i, cycle, eIdx:0};
}
function now(){ const m = at(Date.now()), st = ST(); if (m && !m.pre && st && st.dlWeek === weekKey(new Date())) return {...m, type:"dl", early:true}; return m; }
function blockInfo(){
  const m = now(); if (!m) return null; if (m.pre) return {pre:true, starts:m.starts};
  const dl = m.type === "dl" || m.type === "easy";
  return {week:m.wk, len:m.weeks, block:m.cycle * 100 + m.eIdx, rir:dl ? "DL" : "2", deload:dl, phase:m.type, phaseName:NAME[m.type] || m.type, strength:true, early:!!m.early};
}

/* ---------- maxes ---------- */
function liftOf(k){ const d = (S.prog.exercises || {})[k]; return d && d.str ? d.str : null; }
function isMain(k){ return !!liftOf(k); }
function compKey(lift){ return Object.keys(S.prog.exercises).find(k => S.prog.exercises[k].str === lift && !S.prog.exercises[k].of); }
function eT(k){
  const st = ST(), L = st.lifts[k]; if (L && L.eT) return L.eT;
  const d = S.prog.exercises[k] || {}, lift = d.str, ck = lift && compKey(lift), C = ck && st.lifts[ck];
  if (C && C.eT && ck !== k) return C.eT * (d.ratio || VAR_RATIO[k] || 0.9);
  return null;
}
const round = (w, gym) => { const inc = incFor("bb", gym) || 2.5; return Math.max(20, Math.round(w / inc) * inc); };
const rpeWords = r => { if (r >= 10) return "nothing left"; if (r >= 9.5) return "maybe 1 rep left"; const x = 10 - r; return x % 1 ? `${Math.floor(x)}-${Math.ceil(x)} reps left` : x === 1 ? "1 rep left" : `${x} reps left`; };

/* ---------- today's prescription for one main lift ---------- */
function prescribe(k, type, gym, adj){
  const st = ST(), m = now(), d = S.prog.exercises[k] || {}, lift = d.str, v = !!d.of, deadlift = lift === "deadlift", gen = st.mode === "gen", wk = m.wk - 1;
  const e = eT(k), A = Object.assign({rpeD:0, boD:0, cap:10}, adj || {}), lvl = st.level;
  const out = {k, lift, type, phase:m.type, sets:[], note:""};
  const L = (st.lifts[k] = st.lifts[k] || {hist:[]});
  // no max yet: work up to a solid set; that set becomes the max
  if (!e && !(lvl === "new" && L.lp)){
    const reps = lvl === "new" ? 5 : 3;
    out.cal = true; out.rpe = 8; out.reps = reps; out.note = `No max yet: work up in steps to a set of ${reps} at about RPE 8 (2 reps left). That sets your starting max.`;
    out.sets = [{pr:reps, trpe:8, role:"top"}]; return out;
  }
  const W = r => round(r, gym);
  const straight = (n, reps, rpe, base) => { for (let i = 0; i < n; i++) out.sets.push({pw:W(base || e * pct(reps + 10 - rpe)), pr:reps, trpe:rpe}); out.rpe = rpe; out.reps = reps; };
  if (m.type === "lp" || lvl === "new"){
    const base = L.lp || W(e * pct(5 + 3));
    if (!L.lp) L.lp = base;
    const w = type === "L" ? W(base * 0.9) : base;
    straight(deadlift ? 2 : 3, 5, type === "L" ? 7 : 8, w); out.lp = true;
    out.note = type === "L" ? "Lighter day: same 5s at 90%, smooth and fast." : "Same weight for every set. When the last set feels easy, the weight goes up next time.";
    return out;
  }
  if (m.type === "dl" || m.type === "easy"){ if (v) return null; straight(2, 3, 5.5, W(e * (m.type === "dl" ? 0.72 : 0.70))); out.note = m.early ? "Deload brought forward: your recovery has been slipping. Light, crisp sets." : "Deload: light, crisp sets. Strength holds; fatigue drops."; return out; }
  if (m.type === "test"){
    if (type === "H" && !v){ [[.92,8.5],[.97,9],[1.0,9.5]].forEach(([p, r], i) => out.sets.push({pw:W(e * p), pr:1, trpe:r, role:i ? "test" : "top"})); out.rpe = 9.5; out.reps = 1; out.test = true;
      out.note = "Test day: three singles. Take the second and third only if the one before moved well. 4-5 minutes between."; return out; }
    if (v) return null; straight(2, 3, 6, W(e * 0.70)); out.note = "Easy today: save it for the test."; return out;
  }
  if (m.type === "meet"){
    if (v) return null;
    if (type === "H"){ out.sets.push({pw:W(e * 0.91), pr:1, trpe:8, role:"top"}, {pw:W(e * 0.80), pr:2, trpe:6}, {pw:W(e * 0.80), pr:2, trpe:6}); out.rpe = 8; out.reps = 1; out.note = "Opener single, no harder than RPE 8, then two light doubles. Last heavy work before the meet."; return out; }
    straight(2, 2, 6, W(e * 0.72)); out.note = "Taper: light and quick."; return out;
  }
  if (m.type === "peak"){
    const left = m.weeks - m.wk + 1, P = left >= 3 ? {rpe:8, bo:3, boR:3, boP:.85} : left === 2 ? {rpe:8.5, bo:2, boR:3, boP:.87} : {rpe:8.75, bo:2, boR:2, boP:.88};
    if (type === "H" && !v){ const r = Math.min(A.cap, P.rpe + A.rpeD), top = W(e * pct(1 + 10 - r)); out.sets.push({pw:top, pr:1, trpe:r, role:"top"}); for (let i = 0; i < Math.max(0, P.bo + A.boD); i++) out.sets.push({pw:W(top * P.boP), pr:P.boR, trpe:r, role:"back"}); Object.assign(out, {rpe:r, reps:1, top:true, boP:P.boP}); out.note = "Heavy single near your attempts, then back-offs."; return out; }
    if (v) return null; straight(left === 1 ? 2 : 3, 3, 7, null); return out;
  }
  const tab = TAB[m.type] || TAB.acc, row = tab[deadlift ? "D" + (type === "H" ? "H" : "L") : type === "H" ? "H" : type === "V" ? "V" : "L"] || tab.V;
  let rpe = Math.min(A.cap, (row.rpe[Math.min(wk, row.rpe.length - 1)] || 7) + A.rpeD);
  if (st.level === "adv" && m.type === "int" && type === "H" && wk >= 2) rpe = Math.min(A.cap, 9 + A.rpeD);
  if (m.wk === 1 && type === "H") rpe = Math.min(rpe, 7.5);   // first week of a block eases in
  if (row.top != null){
    const reps = (gen && row.top === 1 ? 3 : row.top + (gen ? 1 : 0)), top = W(e * pct(reps + 10 - rpe)), boR = (row.boR || row.top) + (gen ? 1 : 0);
    out.sets.push({pw:top, pr:reps, trpe:rpe, role:"top"});
    for (let i = 0; i < Math.max(0, row.bo + A.boD); i++) out.sets.push({pw:W(top * row.boP), pr:boR, trpe:rpe, role:"back"});
    Object.assign(out, {rpe, reps, top:true, boP:row.boP, boR});
    out.note = `Work up to the top set. Back-offs come from what you actually lift.`;
    return out;
  }
  straight(Math.max(1, row.sets + (type === "V" ? A.boD : 0)), row.reps + (gen ? 1 : 0), rpe, null);
  if (v) out.note = "Variation: builds the weak part of the lift. Keep it smooth.";
  return out;
}
// build a session's sets for every main lift; scale accessories to the block
function build(a, day){
  const st = ST(); if (!st) return a;
  const m = now(); if (!m || m.pre) return a;
  const slots = (day && day.str) || [], wkk = weekKey(new Date()), adjAll = (st.adj && st.adj[wkk]) || {};
  a.ex = a.ex.map(e => {
    const s = slots.find(x => x.k === e.k);
    if (s){ const p = prescribe(e.k, s.type, a.gym, adjAll[s.lift]); if (!p) return null;
      e.str = {lift:p.lift, type:s.type, phase:p.phase, rpe:p.rpe, reps:p.reps, top:!!p.top, boP:p.boP, boR:p.boR, cal:!!p.cal, lp:!!p.lp, test:!!p.test, note:p.note};
      e.sets = p.sets.map(x => ({w:"", r:"", done:false, pw:x.pw != null ? x.pw : "", pr:x.pr, trpe:x.trpe, drops:[], ...(x.role ? {role:x.role} : {})}));
      return e; }
    const f = ACC_X[m.type] || 1; if (f < 1 && e.sets.length > 1){ const n = Math.max(m.type === "int" ? 2 : 1, Math.round(e.sets.length * f)); e.sets = e.sets.slice(0, n); }
    return e;
  }).filter(Boolean);
  return a;
}
// readiness tap at the start: flat or beat up takes a little off today's loads (Pyramid-style daily adjustment)
function ready(a, R){
  a.rd = R; const f = R === 3 ? 0.95 : R === 2 ? 0.975 : 1;
  a.ex.forEach(e => { if (!e.str || e.str.cal) return; e.sets.forEach(s => { if (!s.done && s.pw !== "" && s._pw0 == null){ s._pw0 = s.pw; } if (!s.done && s._pw0 != null) s.pw = round(s._pw0 * f, a.gym); if (R === 3 && s.trpe && !s.done) s.trpe = s._t0 != null ? s._t0 - 0.5 : (s._t0 = s.trpe, s.trpe - 0.5); }); });
}
// after the top set: back-offs from what you actually lifted, fewer if it was harder than planned
function topDone(a, ei, rpe){
  const e = a.ex[ei]; if (!e || !e.str) return;
  const top = e.sets.find(s => s.role === "top") || e.sets[e.sets.length - 1]; top.q = 10 - rpe;
  if (e.str.cal && top.done && +top.w > 0){ const L = ST().lifts[e.k] = ST().lifts[e.k] || {hist:[]}; const est = +top.w / pct(+top.r + 10 - rpe); L.eT = Math.round(est * 0.95 * 2) / 2; L.src = "calibration";
    // back-offs today from the new max: 2 sets at 85% of the top
    e.sets.push({w:"", r:"", done:false, pw:round(+top.w * 0.88, a.gym), pr:+top.r + 1, trpe:7, drops:[], role:"back"}, {w:"", r:"", done:false, pw:round(+top.w * 0.88, a.gym), pr:+top.r + 1, trpe:7, drops:[], role:"back"}); e.str.cal = false; return; }
  if (!e.str.top || !top.done) return;
  const back = e.sets.filter(s => s.role === "back" && !s.done), over = rpe - (top.trpe || e.str.rpe);
  back.forEach(s => s.pw = round(+top.w * (e.str.boP || 0.9), a.gym));
  if (rpe >= 10) e.sets = e.sets.filter(s => !(s.role === "back" && !s.done));
  else if (over >= 1 && back.length) e.sets.splice(e.sets.indexOf(back[back.length - 1]), 1);
}

/* ---------- after the workout: update maxes, linear progression ---------- */
function after(doc){
  const st = ST(); if (!st || doc.deload) return [];
  const notes = [], m = at(doc.ts);
  (doc.ex || []).forEach(x => {
    const d = S.prog.exercises[x.k]; if (!d || !d.str) return;
    const L = st.lifts[x.k] = st.lifts[x.k] || {hist:[]};
    let eDay = 0;
    x.sets.forEach(s => { let rir = s.q != null ? +s.q : s.trpe != null ? 10 - s.trpe : 2; if (s.spd === 3 && rir >= 1.5) rir = 0.5;
      if (+s.w > 0 && +s.r >= 1 && +s.r <= 8 && rir <= 4) eDay = Math.max(eDay, +s.w / pct(+s.r + rir)); });
    if (eDay > 0){
      const prev = L.eT;
      if (!prev) L.eT = eDay * 0.97;
      else if (eDay >= prev) L.eT = Math.min(prev * (st.level === "new" ? 1.05 : 1.025), prev + 0.5 * (eDay - prev));
      else { L.eT = prev + 0.25 * (eDay - prev); const last = L.hist[L.hist.length - 1]; if (last && last.e < 0.97 * prev && eDay < 0.97 * prev) L.eT = (last.e + eDay) / 2; }
      L.eT = Math.round(L.eT * 2) / 2;
      L.hist = [...(L.hist || []).slice(-40), {d:doc.date, e:Math.round(eDay * 2) / 2, t:L.eT}];
      if (prev && L.eT > prev + 1) notes.push(`${d.n}: max now about ${Math.round(L.eT)} kg`);
    }
    // linear progression: add weight when the last set felt OK; two misses in a row reset to 90%
    if (m && (m.type === "lp" || st.level === "new") && L.lp){
      const ls = x.sets[x.sets.length - 1], rpe = ls && ls.q != null ? 10 - ls.q : 8, miss = x.sets.some(s => s.pr != null ? +s.r < +s.pr : +s.r < 5), lower = ["squat","deadlift"].includes(d.str);
      if (miss){ L.miss = (L.miss || 0) + 1; if (L.miss >= 2){ L.lp = round(L.lp * 0.9, doc.gym); L.miss = 0; L.resets = (L.resets || 0) + 1; notes.push(`${d.n}: stalled twice, back to ${L.lp} kg to build again`); } }
      else { L.miss = 0; const add = rpe <= 7.5 ? (lower ? 5 : 2.5) : rpe <= 8.5 ? (lower ? 2.5 : 1.25) : 0; if (add){ L.lp = Math.round((+ls.w || L.lp) / 1.25) * 1.25 + add; notes.push(`${d.n}: ${L.lp} kg next time`); } }
    }
  });
  if (notes.length) st.log = [...(st.log || []).slice(-40), ...notes.map(n => ({t:Date.now(), why:n}))];
  saveProg();
  return notes;
}

/* ---------- each week: how did each lift go? (first match wins) ---------- */
function weekly(){
  const st = ST(); if (!st) return null;
  const wk = weekKey(new Date()), last = weekKey(new Date(Date.now() - WEEK));
  st.adj = st.adj || {}; if (st.adj[wk]) return null;
  const ds = weekDates(new Date(Date.now() - WEEK)), sess = S.sessions.filter(x => { const t = parseD(x.date); return t >= ds[0] && t <= ds[6] && !x.deload; });
  const adj = {}, why = []; let s2 = 0;
  const lifts = [...new Set(Object.values(S.prog.exercises).filter(d => d.str && !d.of).map(d => d.str))];
  const R = sess.map(x => x.rd).filter(x => x != null), rough = R.filter(x => x >= 2).length >= 2;
  lifts.forEach(lift => {
    const ex = sess.flatMap(x => (x.ex || []).filter(e => (S.prog.exercises[e.k] || {}).str === lift).map(e => ({e, x})));
    if (!ex.length) return;
    const J = Math.max(0, ...sess.map(x => (x.jp || {})[lift] || 0)), dR = ex.map(({e}) => { const t = e.sets.find(s => s.role === "top") || e.sets[e.sets.length - 1]; return t && t.q != null && t.trpe != null ? (10 - t.q) - t.trpe : 0; });
    const mean = dR.reduce((a, b) => a + b, 0) / dR.length, miss = ex.some(({e}) => e.sets.some(s => s.pr != null && +s.r < +s.pr));
    let a = null, w = "";
    if (J === 2){ a = {cap:7, boD:-1}; w = "it hurt: lighter, fewer sets, no grinding"; }
    else if (miss || mean >= 1.5){ a = {rpeD:-1, boD:-1}; w = "missed reps or much harder than planned"; s2++; }
    else if (mean >= 0.75 || rough){ a = {rpeD:-0.5, boD:-1}; w = rough ? "you've felt flat this week: holding back a little" : "a bit harder than planned: same targets, one less back-off"; }
    else if (J === 1){ a = {cap:8}; w = "a little pain: nothing above RPE 8"; }
    else if (mean <= -0.75 && dR.length >= 2){ const m = now(); if (m && m.type === "acc"){ a = {boD:1}; w = "felt easier than planned: one more back-off set"; } }
    if (a){ adj[lift] = a; why.push(`${OB().LIFT_N ? OB().LIFT_N[lift] : lift}: ${w}`); }
  });
  st.adj[wk] = adj;
  const m = now(); let deload = false;
  if (s2 >= 2 && m && !m.pre && ["acc","int"].includes(m.type) && m.wk >= 3){ st.dlWeek = wk; deload = true; why.push("Two lifts struggled last week, so this week is a deload."); }
  if (why.length) st.log = [...(st.log || []).slice(-40), ...why.map(w => ({t:Date.now(), why:w}))];
  saveProg();
  return why.length ? why.join(". ") + "." : null;
}

/* ---------- live and summary helpers ---------- */
function warmup(e, gym){
  const top = e.sets.find(s => s.role === "top") || e.sets[0]; const w = +top.pw; if (!(w > 0)) return "";
  const k = eT(e.k) || w, steps = [[0,8],[.4,5],[.55,3],[.7,2],[.8,1]].concat(w >= 0.85 * k ? [[.87,1]] : []).concat(top.pr === 1 && (top.trpe || 0) >= 9 ? [[.93,1]] : []);
  return steps.map(([p, r]) => `${p ? Math.max(20, round(w * p, gym)) : "Bar"}×${r}`).join(" · ");
}
function advice(k, gym){
  const h = liftHistory(k, false, gym);
  return {status:"str", pill:"", last:h[0] || null, tw:"", tr:""};
}
// meet attempts from the training max (openers ~91%, jumps per Travis 2021; caps per Darragh 2025)
function attempts(){
  const st = ST(); if (!st || !st.meet) return null;
  const lifts = ["squat","bench","deadlift"].map(l => { const k = compKey(l), e = k && eT(k); if (!e) return null;
    const op = Math.floor(e * (l === "bench" ? 0.92 : 0.91) / 2.5) * 2.5, sec = Math.floor(e * 0.96 / 2.5) * 2.5, third = Math.floor(e * 0.99 / 2.5) * 2.5;
    return {lift:l, op, sec, third}; }).filter(Boolean);
  return {date:st.meet.date, lifts};
}
function summary(){
  const st = ST(); if (!st) return null;
  return [...new Set(Object.values(S.prog.exercises).filter(d => d.str && !d.of).map(d => d.str))].map(lift => { const k = compKey(lift), L = st.lifts[k] || {}; const h = L.hist || [];
    return {lift, k, n:(S.prog.exercises[k] || {}).n || lift, eT:L.eT || null, first:h.length ? h[0].t : null, lp:L.lp || null}; });
}

window.AJStrength = {ST, at, now, blockInfo, isMain, eT, prescribe, build, ready, topDone, after, weekly, warmup, advice, attempts, summary, NAME, rpeWords};
})();
