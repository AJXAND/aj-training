/* AJ Training · running coach.
   Paces come from your VDOT (one race or time trial sets every training pace) and update when you race or run a time trial.
   After each run: how hard it felt, how the legs were, any pain (subjective measures track training load better than
   objective markers: Saw 2016). Each week the coach reads that, plus what you actually ran, and adjusts this week:
   pain → less volume and no hard sessions; tired → recovery week early; missed a lot → repeat; ran far more → hold.
   The firm rule throughout: no single run more than ~10% past your longest of the last 30 days (Frandsen 2025). */
(function(){
"use strict";
const RP = () => (typeof S !== "undefined" && S.prog && S.prog.endurance && S.prog.endurance.run) || null;
const M = () => (window.AJOnboard && AJOnboard.runMath) || null;
const QUAL = new Set(["tintro","tcruise","ttempo","ilong","i3015","hlong","rp5","rp10","rph","uclimb","uhike"]);
const DAY = 864e5;
function paces(){ const r = RP(); if (!r || !M()) return null; const w = enduWeek(ymd(new Date())); return M().pacesFor(r.vdot, w ? w.km : 30); }
function fmt(m){ return M() ? M().fmtP(m) : ""; }
// longest run in the last 30 days, from what you actually logged
function max30(){ const t0 = Date.now() - 30 * DAY; return Math.max(0, ...S.cardio.filter(c => c.type === "run" && parseD(c.date).getTime() >= t0).map(c => +c.km || 0)); }

/* ---------- this week's adjustment, decided once at the start of the week ---------- */
function weekly(){
  const r = RP(); if (!r) return null;
  const wk = weekKey(new Date()); r.adj = r.adj || {}; if (r.adj[wk]) return r.adj[wk];
  const lastStart = new Date(Date.now() - 7 * DAY), ds = weekDates(lastStart), lw = enduWeek(ymd(ds[0])), tw = enduWeek(ymd(new Date()));
  if (!lw || !tw){ r.adj[wk] = {}; return r.adj[wk]; }
  const runs = S.cardio.filter(c => c.type === "run" && parseD(c.date) >= ds[0] && parseD(c.date) <= ds[6]);
  const planKm = lw.km || 1, done = runs.reduce((a, c) => a + (+c.km || 0), 0), pct = done / planKm;
  const pain = runs.filter(c => c.pain && c.pain.sev), legs = runs.filter(c => c.legs != null), heavy = legs.filter(c => c.legs >= 2).length;
  const easyHard = runs.filter(c => c.rpe != null && c.rpe >= 5 && (!c.plan || !QUAL.has(c.plan))).length;
  const sameSpot = (() => { const n = {}; pain.forEach(c => n[c.pain.loc] = (n[c.pain.loc] || 0) + 1); return Object.values(n).some(x => x >= 2); })();
  let a = {}, why = "";
  if (pain.some(c => c.pain.sev >= 2)){ a = {volX:0.6, noQ:true, longX:0.7, stop:true}; why = "You logged pain. Easy running only this week, less of it, and get it checked if it's sharp, worse the next morning or changes how you run."; }
  else if (sameSpot || pain.length >= 2){ a = {volX:0.7, noQ:true, longX:0.8}; why = "A niggle came back in the same place. Easy only and less volume this week; it returns to plan once it's quiet for 3 runs."; }
  else if (runs.length && pct < 0.5 && !lw.recovery){ a = {volX:Math.min(1, lw.km / Math.max(1, tw.km)), repeat:true}; why = `You ran about ${Math.round(pct * 100)}% of last week. This week repeats it rather than building on it.`; }
  else if ((legs.length >= 2 && heavy / legs.length >= 0.5) || easyHard >= 2){ a = {volX:0.72, dropQ2:true, longX:0.75}; why = "Heavy legs and easy runs feeling hard. Your recovery week comes early: about 30% less, one quality session."; }
  else if (runs.length && pct > 1.15){ a = {volX:Math.min(1, lw.km / Math.max(1, tw.km))}; why = "You ran well over the plan last week. Volume holds this week instead of building."; }
  else if (runs.length && pct < 0.85 && !lw.recovery){ a = {volX:Math.min(1, 1.08 * done / Math.max(1, tw.km))}; why = `You ran ${Math.round(done)} of ${Math.round(planKm)} km. This week grows from what you actually ran.`; }
  if (why) r.log = [...(r.log || []).slice(-30), {t:Date.now(), why}];
  r.adj[wk] = a; saveProg();
  return a;
}
// apply this week's adjustment to one planned run (called by runFor)
function adjust(s, date){
  const r = RP(); if (!r || !s || s.type === "race" || s.type === "runwalk") return s;
  const wk = weekKey(parseD(date)), a = (r.adj || {})[wk]; if (!a || !Object.keys(a).length) return s;
  const out = {...s};
  const q = QUAL.has(s.type) || s.type === "tt";
  if (q && (a.noQ || (a.dropQ2 && s.q2))){ out.type = "easy"; out.km = Math.max(3, Math.round((s.km || 0) * 0.6)); out.desc = `Easy instead of ${(AJOnboard.RUNTYPE[s.type] || {}).n || "quality"} this week. ${a.stop ? "Stop if anything hurts." : ""}`.trim(); out.adjusted = true; return out; }
  if (s.km){ const x = (s.type === "long" || s.type === "b2b") ? Math.min(a.longX || 1, a.volX || 1) : (a.volX || 1); if (x < 0.99){ out.km = Math.max(3, Math.round(s.km * x * 2) / 2); out.adjusted = true; } }
  // the 10% rule from your real runs: a long run never jumps past your longest of the last 30 days by more than 10%
  if ((s.type === "long" || s.type === "b2b") && out.km){ const m = max30(); if (m >= 3 && out.km > m * 1.1){ out.km = Math.floor(m * 1.1 * 2) / 2; out.adjusted = true; out.capped = true; } }
  return out;
}

/* ---------- after a run ---------- */
// race or time trial: the result sets new paces (only upward unless you confirm it was a fair all-out effort)
function result(km, mins, fair){
  const r = RP(); if (!r || !M() || !(km > 0) || !(mins > 0)) return null;
  const v = Math.round(M().vdotOf(km * 1000, mins) * 10) / 10;
  if (v < r.vdot - 0.5 && !fair) return {v, kept:true};
  const old = r.vdot; r.vdot = v; r.src = "race"; r.vDate = ymd(new Date());
  r.log = [...(r.log || []).slice(-30), {t:Date.now(), why:`${km} km in ${Math.floor(mins)}:${String(Math.round((mins % 1) * 60)).padStart(2, "0")}: paces ${v > old ? "faster" : "updated"} (VDOT ${old} → ${v}).`}];
  rebuild();
  return {v, old};
}
// rebuild the running plan from today's settings with the new fitness, keeping your history and the coach's notes
function rebuild(){
  const r = RP(), P = S.prog; if (!r || !P.setup || !window.AJOnboard) return;
  try{
    const ans = {...P.setup, recent:{d:"_vdot"}, _vdot:r.vdot};
    const np = AJOnboard.generateEndu(ans, "");
    np.endurance.run = {...np.endurance.run, ...r, paces:M().pacesFor(r.vdot, 30)};
    np.startDate = P.startDate; np.endurance.weeks.forEach((w, i) => { const old = P.endurance.weeks[i]; if (old && parseD(old.start) < weekStart(new Date())) np.endurance.weeks[i] = old; });
    S.prog = {...P, endurance:np.endurance, days:np.days, exercises:{...P.exercises, ...np.exercises}}; saveProg();
  }catch(e){ console.warn("run rebuild", e); }
}
function predict(){ const r = RP(); if (!r || !M()) return null; const ev = (S.prog.endurance || {}).event, m = M().RACE_M[ev]; if (!m) return null; const t = M().raceTime(r.vdot, m) * (ev === "marathon" ? 1.04 : 1); return {ev, mins:t}; }

window.AJRun = {RP, paces, fmt, max30, weekly, adjust, result, rebuild, predict, QUAL};
})();
