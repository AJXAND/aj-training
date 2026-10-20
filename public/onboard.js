/* AJ Training · programme builder + nutrition goal setup (onboarding flows).
   Both flows run full screen, save a draft as you go, and write plain documents the rest of the app already reads:
   programme/current (days with home + SHWC variants) and meta/profile.goal (+ phase).
   The generator is rule-based and runs on the phone: free, instant, and every choice links to its evidence (science.js). */
(function(){
"use strict";

/* ---------- Muscles ---------- */
const MUS = {chest:"Chest", lats:"Lats", upback:"Upper back", fdelt:"Front delts", sdelt:"Side delts", rdelt:"Rear delts",
  biceps:"Biceps", triceps:"Triceps", quads:"Quads", hams:"Hamstrings", glutes:"Glutes", adductors:"Adductors", calves:"Calves", abs:"Abs"};
// Weekly fractional sets for an intermediate (direct set = 1, indirect = 0.5). Pelland 2024: gains keep rising with volume, with
// diminishing returns; ~10-20 direct sets covers most of the benefit. Front delts and glutes get most of their work from presses and squats.
const BASE_SETS = {chest:12, lats:12, upback:10, fdelt:4, sdelt:12, rdelt:8, biceps:10, triceps:10, quads:12, hams:10, glutes:6, adductors:4, calves:8, abs:6};
const PRIORITY_SETS = 18;
const PRIORITY_CHOICES = ["chest","lats","upback","sdelt","rdelt","biceps","triceps","quads","hams","glutes","calves","abs"];

/* ---------- Equipment ---------- */
const EQUIP = [
  ["bb","Barbell + plates"],["rack","Squat rack / safety arms"],["bench","Adjustable bench"],["db","Dumbbells"],["landmine","Landmine"],
  ["dip","Dip bars"],["pullup","Pull-up bar"],["anchor","Somewhere to anchor feet"],
  ["cable_hi","Cable, high pulley"],["cable_mid","Cable, waist height"],["cable_low","Cable, low pulley"],["cable_dual","Two cable stacks"],
  ["smith","Smith machine"],["hack","Hack squat"],["legpress","Leg press"],["legext","Leg extension"],["lyingcurl","Lying leg curl"],["seatedcurl","Seated leg curl"],
  ["hipext","45° hip extension"],["adductor","Adductor machine"],["calfm","Standing calf machine"],["pecdeck","Pec deck / rear delt fly"],
  ["chestpress","Chest press machine"],["rowm","Chest-supported row machine"],["latpd","Lat pulldown"],["preacher","Preacher bench"]
];
const KIT_DEFAULT = {
  home:["bb","rack","bench","db","landmine","dip","pullup","cable_hi","cable_mid"],
  shwc:["bb","rack","bench","db","cable_hi","cable_mid","cable_low","cable_dual","smith","hack","legext","lyingcurl","hipext","adductor","calfm","rowm"]
};

/* ---------- Exercise library ----------
   Keys match the old programme where it's the same lift, so your history carries over.
   p = movement pattern, mu = muscles (1 direct, 0.5 indirect), q = equipment needed, c = compound,
   len = bias toward the lengthened position (0-2; Maeo 2021/2023, Pedrosa 2022, Kassiano 2023), inj = joints it loads hardest. */
const L = {};
function X(k, n, p, mu, q, o){ L[k] = Object.assign({k, n, p, mu, q, c:false, len:1, lo:10, hi:15, rest:90, inj:[], eq:"other"}, o||{}); }
// chest
X("incbench","Incline bench","ipress",{chest:1,fdelt:.5,triceps:.5},["bb","rack","bench"],{c:true,lo:6,hi:10,rest:180,eq:"bb",inj:["shoulder"],note:"Safety arms set"});
X("incdb","Incline DB press","ipress",{chest:1,fdelt:.5,triceps:.5},["db","bench"],{c:true,len:2,lo:8,hi:12,rest:150,eq:"db"});
X("incsmith","Incline Smith press","ipress",{chest:1,fdelt:.5,triceps:.5},["smith","bench"],{c:true,lo:6,hi:10,rest:150,eq:"machine"});
X("flatdb","Flat DB press","fpress",{chest:1,fdelt:.5,triceps:.5},["db","bench"],{c:true,len:2,lo:8,hi:12,rest:150,eq:"db"});
X("chestpress","Machine chest press","fpress",{chest:1,fdelt:.5,triceps:.5},["chestpress"],{c:true,lo:8,hi:12,rest:120,eq:"machine"});
X("dips","Dips, chest lean","fpress",{chest:1,triceps:.5,fdelt:.5},["dip"],{c:true,len:2,lo:6,hi:12,rest:150,eq:"bw",inj:["shoulder"]});
X("incfly","Incline DB flyes","fly",{chest:1},["db","bench"],{len:2,eq:"db"});
X("cabfly","Low-to-high cable fly","fly",{chest:1},["cable_dual","cable_low"],{len:2,eq:"cable"});
X("pecdeck","Pec deck","fly",{chest:1},["pecdeck"],{eq:"machine"});
// lats + upper back
X("pullup","Pull-up","vpull",{lats:1,upback:.5,biceps:.5},["pullup"],{c:true,len:2,lo:6,hi:12,rest:150,eq:"bw"});
X("latpd","Lat pulldown","vpull",{lats:1,upback:.5,biceps:.5},["latpd"],{c:true,len:2,lo:8,hi:12,rest:120,eq:"machine"});
X("sulek","Sulek single-arm pull","vpull",{lats:1,biceps:.5},["cable_hi"],{c:true,len:2,lo:8,hi:12,rest:90,eq:"cable"});
X("pullover","Cable pullover","latiso",{lats:1},["cable_hi"],{len:2,eq:"cable"});
X("bbrow","Barbell row","row",{upback:1,lats:.5,rdelt:.5,biceps:.5},["bb"],{c:true,lo:6,hi:10,rest:150,eq:"bb",inj:["lowback"],note:"Technical failure only"});
X("vbar","Landmine V-bar row","row",{upback:1,lats:.5,biceps:.5},["landmine","bb"],{c:true,lo:8,hi:12,rest:120,eq:"bb",inj:["lowback"]});
X("csdb","Chest-supported DB row","row",{upback:1,lats:.5,rdelt:.5,biceps:.5},["db","bench"],{c:true,lo:8,hi:12,rest:120,eq:"db"});
X("csrow","Chest-supported row machine","row",{upback:1,lats:.5,rdelt:.5,biceps:.5},["rowm"],{c:true,lo:8,hi:12,rest:120,eq:"machine"});
X("cabrow","Seated cable row","row",{upback:1,lats:.5,biceps:.5},["cable_low"],{c:true,len:2,lo:8,hi:12,rest:120,eq:"cable"});
X("dbrow","One-arm DB row","row",{lats:1,upback:1,biceps:.5},["db","bench"],{c:true,len:2,lo:8,hi:12,rest:90,eq:"db"});
// shoulders
X("ohp","Seated DB shoulder press","ohp",{fdelt:1,sdelt:.5,triceps:.5},["db","bench"],{c:true,lo:6,hi:10,rest:150,eq:"db",inj:["shoulder"]});
X("smithohp","Smith shoulder press","ohp",{fdelt:1,sdelt:.5,triceps:.5},["smith","bench"],{c:true,lo:6,hi:10,rest:150,eq:"machine",inj:["shoulder"]});
X("cablat","Cable lateral raise","lat",{sdelt:1},["cable_mid"],{len:2,rest:75,eq:"cable"});
X("lyinglat","Incline-lying DB lateral","lat",{sdelt:1},["db","bench"],{len:2,rest:75,eq:"db"});
X("dblat","DB lateral raise","lat",{sdelt:1},["db"],{len:0,rest:75,eq:"db"});
X("revfly","Cross-body cable reverse fly","rear",{rdelt:1},["cable_hi"],{rest:75,eq:"cable"});
X("revpec","Reverse pec deck","rear",{rdelt:1},["pecdeck"],{rest:75,eq:"machine"});
X("dbrevfly","Chest-supported DB reverse fly","rear",{rdelt:1},["db","bench"],{len:0,rest:75,eq:"db"});
X("facepull","Face pull","rear",{rdelt:1,upback:.5},["cable_hi"],{rest:75,eq:"cable"});
// arms
X("bayes","Bayesian curl","curl",{biceps:1},["cable_mid"],{len:2,eq:"cable"});
X("incurl","Incline DB curl","curl",{biceps:1},["db","bench"],{len:2,lo:8,hi:12,eq:"db"});
X("preacher","Preacher curl","curl",{biceps:1},["preacher"],{len:2,lo:8,hi:12,eq:"machine"});
X("bbcurl","Barbell curl","curl",{biceps:1},["bb"],{lo:8,hi:12,eq:"bb"});
X("hammer","Hammer curl","curl",{biceps:1},["db"],{len:0,lo:8,hi:12,rest:75,eq:"db"});
X("revcurl","Reverse barbell curl","curl",{biceps:1},["bb"],{len:0,lo:8,hi:12,rest:75,eq:"bb"});
X("ohext","Overhead cable extension","triext",{triceps:1},["cable_hi"],{len:2,eq:"cable"});
X("dbohext","Overhead DB extension","triext",{triceps:1},["db"],{len:2,eq:"db",inj:["elbow"]});
X("skull","DB skull crusher","triext",{triceps:1},["db","bench"],{len:1,lo:8,hi:12,eq:"db",inj:["elbow"]});
X("pdfixed","Pushdown, elbows fixed","pushdown",{triceps:1},["cable_hi"],{len:0,rest:75,eq:"cable"});
X("pdmove","Pushdown, elbows moving","pushdown",{triceps:1},["cable_hi"],{len:1,rest:75,eq:"cable"});
X("cgbench","Close-grip bench","tripress",{triceps:1,chest:.5,fdelt:.5},["bb","rack","bench"],{c:true,lo:6,hi:10,rest:150,eq:"bb"});
// legs
X("squat","Back squat","squat",{quads:1,glutes:.5,adductors:.5},["bb","rack"],{c:true,len:2,lo:6,hi:10,rest:180,eq:"bb",inj:["lowback","knee"],note:"Safety arms set"});
X("hack","Hack squat","squat",{quads:1,glutes:.5,adductors:.5},["hack"],{c:true,len:2,lo:6,hi:10,rest:180,eq:"machine",inj:["knee"]});
X("smith","Smith squat","squat",{quads:1,glutes:.5,adductors:.5},["smith"],{c:true,len:2,lo:6,hi:10,rest:180,eq:"bb",inj:["knee"]});
X("legpress","Leg press","squat",{quads:1,glutes:.5,adductors:.5},["legpress"],{c:true,lo:8,hi:12,rest:150,eq:"machine"});
X("bss","DB Bulgarian split squat","lunge",{quads:1,glutes:1,adductors:.5},["db","bench"],{c:true,len:2,lo:8,hi:12,rest:120,eq:"db",inj:["knee"]});
X("legext","Leg extension","kneeext",{quads:1},["legext"],{eq:"machine",note:"Lean back to bias the stretched position"});
X("nordic","Reverse nordic curl","kneeext",{quads:1},[],{len:2,lo:8,hi:12,eq:"bw",inj:["knee"]});
X("rdl","RDL","hinge",{hams:1,glutes:.5},["bb"],{c:true,len:2,lo:6,hi:10,rest:180,eq:"bb",inj:["lowback"],note:"Technical failure only"});
X("dbrdl","DB RDL","hinge",{hams:1,glutes:.5},["db"],{c:true,len:2,lo:8,hi:12,rest:150,eq:"db",inj:["lowback"]});
X("hipext","Hip extension","hinge",{hams:1,glutes:.5},["hipext"],{c:true,len:1,lo:8,hi:12,rest:120,eq:"machine"});
X("seatedcurl","Seated leg curl","kneeflex",{hams:1},["seatedcurl"],{len:2,lo:8,hi:12,eq:"machine"});
X("lyingcurl","Lying leg curl","kneeflex",{hams:1},["lyingcurl"],{len:1,lo:8,hi:12,eq:"machine"});
X("nordicham","Nordic hamstring curl","kneeflex",{hams:1},["anchor"],{len:2,lo:4,hi:8,rest:120,eq:"bw",inj:["knee"]});
X("hipthrust","Barbell hip thrust","glute",{glutes:1},["bb","bench"],{c:true,len:0,lo:8,hi:12,rest:120,eq:"bb"});
X("adductor","Adductor machine","add",{adductors:1},["adductor"],{rest:75,eq:"machine"});
X("standcalf","Standing calf raise","calf",{calves:1},["calfm"],{len:2,rest:75,eq:"machine",note:"Full stretch, pause 1-2 s at the bottom"});
X("smithcalf","Smith calf raise","calf",{calves:1},["smith"],{len:2,rest:75,eq:"machine",note:"Full stretch, pause at the bottom"});
X("slcalf","Single-leg DB calf raise","calf",{calves:1},["db"],{len:2,rest:60,eq:"db",note:"On a step, full stretch"});
X("legraise","Lying leg raise","abs",{abs:1},[],{rest:60,eq:"bw"});
X("hangleg","Hanging knee raise","abs",{abs:1},["pullup"],{rest:60,eq:"bw"});
X("cabcrunch","Cable crunch","abs",{abs:1},["cable_hi"],{rest:60,eq:"cable"});

/* ---------- Day templates (slots are movement patterns, in training order) ---------- */
const T = {
  upA:{label:"Upper A", slots:["ipress","vpull","row","lat","triext","curl","rear"]},
  upB:{label:"Upper B", slots:["row","fpress","vpull","fly","lat","pushdown","curl"]},
  loA:{label:"Lower A", slots:["squat","hinge","kneeext","kneeflex","calf","abs"]},
  loB:{label:"Lower B", slots:["kneeflex","lunge","kneeext","add","calf","abs"]},
  push:{label:"Push", slots:["ipress","fpress","fly","lat","triext","pushdown"]},
  pull:{label:"Pull", slots:["vpull","row","latiso","rear","curl","curl"]},
  legs:{label:"Legs", slots:["squat","hinge","kneeext","kneeflex","add","calf"]},
  upper:{label:"Upper", slots:["ipress","row","vpull","lat","rear","pushdown","curl"]},
  lower:{label:"Lower", slots:["kneeflex","squat","kneeext","hinge","calf","abs"]},
  fbA:{label:"Full body A", slots:["squat","ipress","vpull","kneeflex","lat","curl"]},
  fbB:{label:"Full body B", slots:["hinge","row","fpress","kneeext","rear","triext"]},
  fbC:{label:"Full body C", slots:["lunge","ohp","vpull","kneeflex","lat","pushdown","calf"]},
  arms:{label:"Arms & delts", slots:["lat","curl","triext","rear","curl","pushdown","lat"]},
  runA:{label:"Strength A", slots:["squat","hinge","calf","vpull","abs"]},
  runB:{label:"Strength B", slots:["lunge","kneeflex","calf","row","abs"]}
};
const LOWER = new Set(["loA","loB","legs","lower"]);
const SPLITS = {
  2:[{id:"fb2", name:"Full body ×2", days:["fbA","fbB"], why:"Two sessions can only hit each muscle twice if every session is full body."}],
  3:[{id:"fb3", name:"Full body ×3", days:["fbA","fbB","fbC"], why:"Every muscle 2-3× a week with short, varied sessions."},
     {id:"ulf", name:"Upper / Lower / Full", days:["upper","lower","fbA"], why:"Longer focused days, everything still hit twice."}],
  4:[{id:"ul4", name:"Upper / Lower ×2", days:["upA","loA","upB","loB"], why:"The classic: each muscle twice a week, alternating stress so joints recover."},
     {id:"ppl4", name:"Push / Pull / Legs / Upper", days:["push","pull","legs","upper"], why:"More per-session focus; legs only once, so best if legs aren't a priority."}],
  5:[{id:"pplul", name:"Push / Pull / Legs + Upper / Lower", days:["legs","push","pull","lower","upper"], why:"Your current structure. Everything twice a week with room for extra upper-body volume."},
     {id:"ul5", name:"Upper / Lower ×2 + Arms & delts", days:["upA","loA","upB","loB","arms"], why:"Best when arms and side delts are the priority: a fifth day just for them."}],
  7:[{id:"ppl7", name:"Push / Pull / Legs ×2 + Arms & delts", days:["push","pull","legs","push","pull","legs","arms"], why:"Seven sessions: the seventh is a lighter arms and delts day. Most people progress as well on 5-6 days with a rest day; keep the 7th easy."}],
  6:[{id:"ppl6", name:"Push / Pull / Legs ×2", days:["push","pull","legs","push","pull","legs"], why:"Highest frequency and volume. Needs good recovery and 6 days."},
     {id:"pplul6", name:"PPL + Upper / Lower + Arms & delts", days:["legs","push","pull","lower","upper","arms"], why:"Your current week plus the priority day as a full session."}]
};
const WD = [["mon",1,"Mon"],["tue",2,"Tue"],["wed",3,"Wed"],["thu",4,"Thu"],["fri",5,"Fri"],["sat",6,"Sat"],["sun",0,"Sun"]];
const INJ = [["shoulder","Shoulder"],["elbow","Elbow"],["lowback","Lower back"],["knee","Knee"]];

/* ---------- Generator ---------- */
function has(kit, ex){ return ex.q.every(r => kit.includes(r)); }
function exScore(ex, ctx){
  let s = ex.len * 2;                                   // lengthened bias
  if (ctx.gym === "shwc" && ex.eq === "machine" && !ex.c) s += 1;   // stable machines for isolation work
  if (ex.eq === "machine" && ex.c) s += 0.5;
  if (ctx.ans.goal === "strength" && ex.eq === "bb" && ex.c) s += 2;
  if ((ctx.ans.love || []).includes(ex.k)) s += 6;
  if (ex.inj.some(j => (ctx.ans.inj || []).includes(j))) s -= 8;
  if (ctx.used.has(ex.k)) s -= 2.5;                     // vary exercises across the week
  if (ctx.dayUsed.has(ex.k)) s -= 100;
  return s + (ctx.seed ? (hash(ex.k + ctx.seed) % 100) / 100 : 0);
}
function hash(s){ let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }
function pick(pattern, ctx){
  const cand = Object.values(L).filter(e => e.p === pattern && has(ctx.kit, e) && !(ctx.ans.ban || []).includes(e.k));
  if (!cand.length) return null;
  cand.sort((a, b) => exScore(b, ctx) - exScore(a, ctx));
  return exScore(cand[0], ctx) < -50 ? null : cand[0];
}
const FALLBACK = {fpress:["ipress"], ipress:["fpress"], lunge:["squat"], squat:["lunge"], latiso:["vpull","row"], ohp:["ipress"], add:[], kneeflex:["hinge"], kneeext:["squat"], fly:["fpress"], vpull:["row"], rear:["row"], hinge:["kneeflex"], glute:["hinge"]};
function targetsFor(ans){
  const lvl = {new:0.8, inter:1, adv:1.2}[ans.level || "inter"], ph = ans.phase === "cut" ? 0.9 : 1, out = {};
  for (const [m, v] of Object.entries(BASE_SETS)) out[m] = Math.round(v * lvl * ph);
  for (const m of ans.pri || []) out[m] = Math.round(PRIORITY_SETS * (ans.level === "adv" ? 1.1 : 1) * ph);
  if (ans.goal === "aesthetic") for (const m of ["sdelt","lats","chest"]) if (!(ans.pri || []).includes(m)) out[m] = Math.round(out[m] * 1.2);
  return out;
}
function exTime(ex, sets){ return sets * (ex.rest + 45) / 60 + 2; }   // minutes: work + rest per set, plus setup
function buildVariant(dayKeys, gym, ans, seed){
  const kit = (ans.kit && ans.kit[gym]) || ((gymList().find(g => g.id === gym) || {}).kit) || KIT_DEFAULT[gym] || KIT_FULL, used = new Set(), tg = targetsFor(ans), pri = new Set(ans.pri || []);
  const days = dayKeys.map(tk => {
    const dayUsed = new Set(), list = [];
    for (const pat of T[tk].slots){
      let ex = pick(pat, {kit, ans, gym, used, dayUsed, seed});
      if (!ex) for (const alt of FALLBACK[pat] || []){
        if (T[tk].slots.includes(alt) || list.some(x => x.ex.p === alt)) continue;   // never two hinges/squats just because a machine is missing
        ex = pick(alt, {kit, ans, gym, used, dayUsed, seed}); if (ex) break; }
      if (!ex) continue;
      used.add(ex.k); dayUsed.add(ex.k); list.push({ex, sets:2});
    }
    return {tk, list};
  });
  const cap = +ans.mins || 75, vol = () => { const v = {}; days.forEach(d => d.list.forEach(x => { for (const [m, f] of Object.entries(x.ex.mu)) v[m] = (v[m] || 0) + f * x.sets; })); return v; };
  const dayMins = d => d.list.reduce((a, x) => a + exTime(x.ex, x.sets), 4);
  const isLowerDay = d => LOWER.has(d.tk), lowerMus = new Set(["quads","hams","glutes","adductors","calves"]);
  // fill sets toward each muscle's weekly target (fractional counting), 2-4 sets per exercise (5 for priorities), within the time budget
  // order of filling when time is short: every muscle to a floor (~6-8 sets: enough to keep growing), then priorities to their
  // full target, then everything else. So a short week squeezes the non-priorities, not the muscles you asked to bring up.
  let goal = m => tg[m];
  const fill = () => { for (let guard = 0; guard < 400; guard++){
    const v = vol();
    const need = Object.keys(tg).filter(m => (v[m] || 0) < goal(m) - 0.25).sort((a, b) => ((v[a] || 0) / goal(a)) - ((v[b] || 0) / goal(b)) || (pri.has(b) - pri.has(a)));
    let added = false;
    for (const m of need){
      const opts = [];
      days.forEach(d => d.list.forEach(x => { if ((x.ex.mu[m] || 0) >= 1 && x.sets < (pri.has(m) ? 5 : 4) && dayMins(d) + exTime(x.ex, 1) - 2 <= cap) opts.push({d, x}); }));
      if (!opts.length) continue;
      opts.sort((a, b) => a.x.sets - b.x.sets || dayMins(a.d) - dayMins(b.d));
      opts[0].x.sets++; added = true; break;
    }
    if (!added) break;
  } };
  const floor = m => Math.min(tg[m], m === "fdelt" || m === "glutes" || m === "adductors" ? tg[m] : 8);
  goal = floor; fill();
  goal = m => pri.has(m) ? tg[m] : floor(m); fill();
  goal = m => tg[m]; fill();
  // still short on a priority because the day is full: take sets from non-priority exercises on that day (never below the floor)
  const primary = x => Object.keys(x.ex.mu).filter(m => x.ex.mu[m] >= 1);
  for (let guard = 0; guard < 120; guard++){
    const v = vol(), short = [...pri].filter(m => (v[m] || 0) < tg[m] - 0.5).sort((a, b) => (v[a] || 0) / tg[a] - (v[b] || 0) / tg[b]);
    let moved = false;
    for (const m of short){
      for (const d of days){
        const take = d.list.find(x => (x.ex.mu[m] || 0) >= 1 && x.sets < 5); if (!take) continue;
        const donors = d.list.filter(x => x !== take && !primary(x).some(q => pri.has(q)) && primary(x).every(q => (v[q] || 0) - 1 >= Math.min(floor(q), 5)));   // non-priorities can drop to ~5 sets (still above the ~4-set minimum dose, Pelland 2025)
        if (!donors.length) continue;
        donors.sort((a, b) => b.sets - a.sets || exTime(b.ex, 1) - exTime(a.ex, 1));
        const dn = donors[0];
        if (dn.sets > 1) dn.sets--; else d.list.splice(d.list.indexOf(dn), 1);
        if (dayMins(d) + exTime(take.ex, 1) - 2 <= cap){ take.sets++; moved = true; break; }
      }
      if (moved) break;
    }
    if (!moved) break;
  }
  // still short (usually priorities): add an isolation exercise on the day with the most spare time. Small muscles can go on any day;
  // leg muscles only on leg days, upper-body muscles only off leg days.
  for (let round = 0; round < 6; round++){
    const v = vol(), short = Object.keys(tg).filter(m => tg[m] - (v[m] || 0) >= 2).sort((a, b) => (pri.has(b) - pri.has(a)) || ((v[a] || 0) / tg[a] - (v[b] || 0) / tg[b]));
    let did = false;
    for (const m of short){
      const small = ["sdelt","rdelt","biceps","triceps","calves","abs"].includes(m);
      const ok = days.filter(d => (small || (lowerMus.has(m) ? isLowerDay(d) : !isLowerDay(d))) && d.list.length < 8 && dayMins(d) + 6 <= cap);
      if (!ok.length) continue;
      ok.sort((a, b) => dayMins(a) - dayMins(b));
      const d = ok[0], pats = [...new Set(Object.values(L).filter(e => e.mu[m] === 1 && !e.c && has(kit, e)).map(e => e.p))];
      let ex = null; for (const pat of pats){ ex = pick(pat, {kit, ans, gym, used, dayUsed:new Set(d.list.map(x => x.ex.k)), seed}); if (ex) break; }
      if (!ex) continue;
      used.add(ex.k); d.list.push({ex, sets:2, extra:true}); did = true; break;
    }
    if (!did) break;
    fill();
  }
  // over budget: trim isolation sets from non-priority muscles, then drop the last non-priority exercise
  days.forEach(d => {
    for (let g = 0; g < 40 && dayMins(d) > cap; g++){
      const trim = d.list.filter(x => x.sets > 2 && !Object.keys(x.ex.mu).some(m => x.ex.mu[m] >= 1 && pri.has(m))).sort((a, b) => b.sets - a.sets)[0];
      if (trim){ trim.sets--; continue; }
      const drop = [...d.list].reverse().find(x => !Object.keys(x.ex.mu).some(m => x.ex.mu[m] >= 1 && pri.has(m)));
      if (drop && d.list.length > 3) d.list.splice(d.list.indexOf(drop), 1); else break;
    }
    // order: compounds first, then the day's priority muscles, then the rest. Order barely changes growth but the first lifts gain most strength (Nunes 2021)
    const isPri = x => Object.keys(x.ex.mu).some(m => x.ex.mu[m] >= 1 && pri.has(m));
    const orig = d.list.slice();
    // extras added for other muscles (e.g. laterals on leg day) always go last
    d.list.sort((a, b) => (!!a.extra - !!b.extra) || (b.ex.c - a.ex.c) || (isPri(b) - isPri(a)) || (orig.indexOf(a) - orig.indexOf(b)));
  });
  return {days, vol:vol(), tg, mins:days.map(dayMins)};
}
function placeDays(seq, ans){
  const trainWd = WD.filter(([k]) => (ans.days || []).includes(k)).map(x => x[1]);
  const sport = new Set((ans.sport || []).map(k => WD.find(x => x[0] === k)[1]));
  let best = null;
  for (let r = 0; r < seq.length; r++){
    const rot = seq.slice(r).concat(seq.slice(0, r));
    let pen = 0;
    rot.forEach((tk, i) => {
      if (!LOWER.has(tk)) return;
      const wd = trainWd[i], next = (wd + 1) % 7;
      if (sport.has(wd)) pen += 2; if (sport.has(next)) pen += 3;      // legs not the day before or of tennis/padel
      const j = i + 1 < rot.length ? i + 1 : null;
      if (j != null && LOWER.has(rot[j]) && (trainWd[j] - wd + 7) % 7 === 1) pen += 2;
    });
    if (!best || pen < best.pen) best = {rot, pen};
  }
  return best.rot.map((tk, i) => ({tk, wd:trainWd[i]}));
}
function rirPlan(weeks){
  const hard = weeks - 1;
  const seq = hard === 3 ? ["3","2","1"] : hard === 4 ? ["3","2","1","0–1"] : hard === 5 ? ["3","2","2","1","0–1"] : ["3","3","2","2","1","0–1"].slice(-hard);
  return seq.concat(["DL"]);
}
function focusOf(list){
  const s = {}; list.forEach(x => { for (const [m, f] of Object.entries(x.ex.mu)) if (f >= 1) s[m] = (s[m] || 0) + x.sets; });
  return Object.entries(s).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([m]) => MUS[m]).join(", ");
}
function generate(ans, seed){
  const split = (SPLITS[ans.days.length] || []).find(s => s.id === ans.split) || (SPLITS[ans.days.length] || [])[0];
  const placed = placeDays(split.days, ans);
  const seq = placed.map(p => p.tk);
  const gl = gymList(), vs = Object.fromEntries(gl.map(g => [g.id, buildVariant(seq, g.id, ans, seed)])), first = vs[gl[0].id];
  const exercises = {};
  const strengthFirst = ans.goal === "strength";
  const toList = (v, i) => v.days[i].list.map((x, j) => {
    const e = x.ex, def = {n:e.n, lo:e.lo, hi:e.hi, rest:e.rest, eq:e.eq, m:MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)], mu:e.mu, note:e.note || undefined, len:e.len};
    let key = e.k;
    if (strengthFirst && j === 0 && e.c && e.eq === "bb"){ key = e.k + "-hvy"; Object.assign(def, {n:e.n + " (heavy)", lo:4, hi:6, rest:210}); }
    exercises[key] = Object.fromEntries(Object.entries(def).filter(([, v]) => v !== undefined));
    return [key, x.sets];
  });
  const sportSet = new Set(ans.sport || []);
  const days = WD.map(([k, wd, short]) => {
    const i = placed.findIndex(p => p.wd === wd);
    if (i < 0) return {k, wd, label:"Rest", focus:sportSet.has(k) ? "Sport or harder cardio" : "Recovery, walk or easy cardio", rest:true, cardio:sportSet.has(k) ? "Sport day" : "Walk or easy cardio"};
    const tk = placed[i].tk;
    const next = WD.find(x => x[1] === (wd + 1) % 7)[0];
    return {k, wd, label:T[tk].label, tpl:tk, focus:focusOf(first.days[i].list), gym:gl.some(g => g.id === (ans.gymOf || {})[k]) ? ans.gymOf[k] : gl[0].id,
      cardio:sportSet.has(next) && LOWER.has(tk) ? "Easy cardio only: sport tomorrow" : LOWER.has(tk) ? "No hard cardio" : "Easy cardio only",
      variants:Object.fromEntries(gl.map(g => [g.id, toList(vs[g.id], i)]))};
  });
  const weeks = +ans.block || 6;
  return {schema:2, name:(ans.name || "Hypertrophy block"), placeholder:false, startDate:ans.start, deloadEvery:weeks, rir:rirPlan(weeks),
    kind:"gym", split:split.id, splitName:split.name, setup:ans, built:Date.now(), targets:first.tg, vol:Object.fromEntries(gl.map(g => [g.id, vs[g.id].vol])), mins:Object.fromEntries(gl.map(g => [g.id, vs[g.id].mins])), exercises, days};
}

/* ---------- Endurance + hybrid plans ----------
   Rules (see the science library, "Running and endurance"):
   - Intensity: ~80% of running easy, ~20% hard; hard sessions are capped, not added freely (Seiler 2010; Stöggl & Sperlich 2014; Oliveira 2024).
   - Long run never more than 10% longer than your longest run in the previous 30 days: single-session spikes are what predict injury
     (Frandsen 2025, 5,200 runners). Weekly growth is kept gentle, but the old "10% rule" itself isn't proven protective (Buist 2008).
   - Taper: 2 weeks for marathon and longer (1 for shorter), volume cut 40-60%, intensity and frequency kept (Bosquet 2007).
   - Strength 2x a week in base/build, 1x in peak and taper: improves running economy ~2-8% (Balsalobre-Fernández 2016; Blagrove 2018).
   - Desert stage races: heat block in the last ~2.5 weeks, 10-14 sessions (Périard 2015; Tyler 2024); pack runs build to race weight;
     back-to-back long days; fuelling practice 60-90 g carbohydrate an hour on long runs (Jeukendrup 2014).
   - Recovery week every 4th week and phase lengths are coaching convention, not trial evidence (labelled as such). */
const EVENTS = {
  general:{name:"Get fitter running", sub:"No race: build a solid, injury-proof base", peak:[20, 40], longMax:14, taper:0, q:"general"},
  "5k":{name:"5k", sub:"Speed and VO2max work", dist:5, peak:[30, 50], longMax:13, taper:1, q:"vo2"},
  "10k":{name:"10k", sub:"Threshold and VO2max", dist:10, peak:[35, 60], longMax:17, taper:1, q:"vo2"},
  half:{name:"Half marathon", sub:"Threshold and long runs", dist:21.1, peak:[45, 70], longMax:22, taper:1, q:"thr"},
  marathon:{name:"Marathon", sub:"Aerobic volume and marathon-pace work", dist:42.2, peak:[55, 90], longMax:32, taper:2, q:"mp"},
  ultra:{name:"Ultra (50-100 km)", sub:"Time on feet, hills, back-to-back long days", dist:60, peak:[65, 110], longMax:42, taper:2, q:"hill", b2b:true},
  stage:{name:"Multi-day desert ultra", sub:"E.g. Marathon des Sables: pack running, heat, back-to-backs", dist:250, peak:[65, 110], longMax:40, taper:2, q:"hill", b2b:true, pack:true, heat:true}
};
const RUNTYPE = {
  easy:{n:"Easy run", rpe:"RPE 3-4: you could hold a conversation", level:"Easy"},
  long:{n:"Long run", rpe:"RPE 3-4, steady and relaxed", level:"Steady"},
  b2b:{n:"Back-to-back long", rpe:"RPE 3-4 on tired legs: the point is time on feet", level:"Steady"},
  vo2:{n:"Intervals", rpe:"5-6 × 3 min at RPE 8-9 (about 5k effort), 2 min easy jog between", level:"Hard"},
  thr:{n:"Threshold", rpe:"3 × 10 min at RPE 6-7 (comfortably hard), 2 min easy between", level:"Tempo"},
  mp:{n:"Marathon-pace run", rpe:"Warm up, then 6-12 km at goal marathon pace (RPE 5-6)", level:"Tempo"},
  hill:{n:"Hill repeats", rpe:"8-10 × 90 s uphill at RPE 7-8, walk or jog down; power-hike the steepest bits", level:"Hills"},
  general:{n:"Strides", rpe:"Easy run with 6 × 20 s quick, relaxed strides at the end", level:"Steady"}
};
function enduPlan(ans){
  const E = EVENTS[ans.event] || EVENTS.general, start = parseD(ans.start), race = ans.event !== "general" && ans.raceDate ? parseD(ans.raceDate) : null;
  let N = race ? Math.max(4, Math.min(40, Math.ceil((race - start) / (7 * 864e5)))) : 12;
  const days = WD.filter(([k]) => (ans.runDays || []).includes(k)).map(x => x[1]);
  const longWd = days.includes(WD.find(x => x[0] === ans.longDay)?.[1]) ? WD.find(x => x[0] === ans.longDay)[1] : days[days.length - 1];
  const nQ = days.length >= 5 ? 2 : days.length >= 3 ? 1 : 0;
  const cur = Math.max(8, +ans.weeklyKm || 15), fewDays = days.length <= 3 ? 0.75 : 1;
  const peakKm = Math.round(Math.min(E.peak[1] * fewDays, Math.max(E.peak[0] * fewDays, cur * 1.6)));
  const T = race ? E.taper : 0, P = race ? Math.min(3, Math.max(1, Math.round((N - T) * 0.2))) : 0;
  const B = Math.max(0, Math.round((N - T - P) * 0.45)), BASE = N - T - P - B;
  let longest = Math.max(3, +ans.longest || cur * 0.35), km = cur, weeks = [];
  for (let w = 0; w < N; w++){
    const phase = w < BASE ? "Base" : w < BASE + B ? "Build" : w < BASE + B + P ? "Peak" : "Taper";
    const recovery = phase !== "Taper" && phase !== "Peak" && w > 0 && (w + 1) % 4 === 0;
    if (phase === "Taper"){ const tIdx = w - (N - T); km = Math.round(peakKm * (T === 2 ? (tIdx === 0 ? 0.7 : 0.45) : 0.55)); }
    else if (phase === "Peak") km = peakKm;
    else km = Math.min(peakKm, Math.round((w === 0 ? cur : km) * (w === 0 ? 1 : 1.07)));
    const weekKm = recovery ? Math.round(km * 0.8) : km;
    // long run: ~28% of the week (convention), never >10% beyond the longest run of the previous 30 days (Frandsen 2025)
    // build ~8% a week (inside the +10% limit), never more than half the week, never above the event's useful maximum
    let long;
    if (phase === "Taper") long = longest * (w === N - 1 ? 0.45 : 0.7);
    else if (recovery) long = longest * 0.85;
    else long = Math.min(E.longMax, longest * 1.08, Math.max(5, weekKm * 0.5));
    const longRaw = Math.max(3, long); long = Math.round(longRaw);
    if (!recovery && phase !== "Taper") longest = Math.max(longest, longRaw);
    const b2b = E.b2b && (phase === "Build" || phase === "Peak") && !recovery ? Math.round(long * 0.6) : 0;
    const qType = phase === "Base" ? "general" : (E.q === "mp" && phase !== "Taper" && w % 2 ? "thr" : E.q === "general" ? "general" : E.q);
    const qs = phase === "Base" ? Math.min(1, nQ) : phase === "Taper" ? Math.min(1, nQ) : nQ;
    // place sessions: long on its day, b2b the day after (if a run day), quality away from the long run
    const sessions = {}, rest = weekKm - long - b2b;
    sessions[longWd] = {type:"long", km:long};
    const after = days.find(d => d === (longWd + 1) % 7);
    if (b2b && after != null) sessions[after] = {type:"b2b", km:b2b};
    const free = days.filter(d => sessions[d] == null);
    const far = free.slice().sort((a, b) => Math.min(Math.abs(b - longWd), 7 - Math.abs(b - longWd)) - Math.min(Math.abs(a - longWd), 7 - Math.abs(a - longWd)));
    const qDays = []; for (const d of far){ if (qDays.length >= qs) break; if (!qDays.some(q => Math.abs(q - d) === 1 || Math.abs(q - d) === 6)) qDays.push(d); }
    const easyDays = free.filter(d => !qDays.includes(d)), perQ = Math.max(5, Math.min(Math.round(long * 0.8), Math.round(rest * 0.22 / Math.max(1, qDays.length))));
    qDays.forEach(d => sessions[d] = {type:qType, km:Math.min(perQ, 14)});
    const left = Math.max(0, rest - qDays.reduce((a, d) => a + sessions[d].km, 0));
    // easy runs never longer than ~70% of the long run; the week total is whatever that allows
    easyDays.forEach(d => sessions[d] = {type:"easy", km:Math.max(3, Math.min(Math.round(long * 0.85), Math.round(left / Math.max(1, easyDays.length))))});
    const ws = new Date(start); ws.setDate(ws.getDate() + w * 7);
    const notes = [];
    if (E.pack && (phase === "Build" || phase === "Peak")) notes.push(`Long runs with your pack: ${Math.min(7, 3 + Math.round((w - BASE) * 0.5))} kg this week, building to race weight`);
    if (E.heat && race && (race - ws) / 864e5 <= 21 && phase !== "Base") notes.push("Heat block: 4-5 heat sessions this week (overdress on easy runs, or 20-30 min sauna/hot bath right after)");
    if (long * 6 >= 90) notes.push("Practise fuelling on the long run: 60-90 g carbohydrate an hour, using what you'll race with");
    weeks.push({start:ymd(ws), w:w + 1, phase, recovery, km:Object.values(sessions).reduce((a, s) => a + s.km, 0), long, b2b, sessions, notes, strength:phase === "Taper" || phase === "Peak" ? 1 : 2});
  }
  return {event:ans.event, eventName:E.name, raceDate:race ? ans.raceDate : null, weeks, peakKm, longWd, phases:{base:BASE, build:B, peak:P, taper:T}};
}
function generateEndu(ans, seed){
  const plan = enduPlan(ans), gl = gymList(), hybrid = ans.kind === "hybrid";
  const liftDays = WD.filter(([k]) => (ans.liftDays || []).includes(k)).map(x => x[1]);
  const exercises = {};
  let tplSeq = [];
  if (liftDays.length){
    if (hybrid){ const sp = (SPLITS[liftDays.length] || SPLITS[3])[0]; tplSeq = sp.days.slice(0, liftDays.length); }
    else tplSeq = liftDays.map((_, i) => i % 2 ? "runB" : "runA");
  }
  const vs = Object.fromEntries(gl.map(g => [g.id, tplSeq.length ? buildVariant(tplSeq, g.id, {...ans, pri:hybrid ? (ans.pri || []) : [], mins:hybrid ? (ans.mins || 60) : 45, level:ans.level || "inter"}, seed) : null]));
  const toList = (v, i) => v.days[i].list.map(x => { const e = x.ex; exercises[e.k] = Object.fromEntries(Object.entries({n:e.n, lo:e.lo, hi:e.hi, rest:e.rest, eq:e.eq, m:MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)], mu:e.mu, note:e.note, len:e.len}).filter(([, z]) => z !== undefined)); return [e.k, hybrid ? x.sets : Math.min(3, x.sets)]; });
  const w0 = plan.weeks[0];
  const days = WD.map(([k, wd]) => {
    const run = w0.sessions[wd] || plan.weeks.find(w => w.sessions[wd])?.sessions[wd];
    const li = liftDays.indexOf(wd);
    const d = {k, wd, rest:!run && li < 0, label:"Rest", focus:"", cardio:"Rest or an easy walk"};
    if (run){ d.run = {type:run.type}; d.label = RUNTYPE[run.type].n; d.focus = RUNTYPE[run.type].rpe; d.cardio = ""; }
    if (li >= 0){
      d.variants = Object.fromEntries(gl.map(g => [g.id, toList(vs[g.id], li)])); d.gym = gl.some(g => g.id === (ans.gymOf || {})[k]) ? ans.gymOf[k] : gl[0].id;
      const sLabel = hybrid ? T[tplSeq[li]].label : "Strength for runners";
      d.label = run ? d.label + " + " + sLabel.toLowerCase() : sLabel; d.focus = run ? d.focus : focusOf(vs[gl[0].id].days[li].list); d.tpl = tplSeq[li];
    } else if (run) d.variants = {};
    return d;
  });
  return {schema:2, kind:ans.kind, name:ans.name || (plan.eventName + " plan"), placeholder:false, startDate:ans.start, deloadEvery:4, endurance:plan, setup:ans, built:Date.now(),
    exercises, days, splitName:plan.eventName + (hybrid ? " + lifting" : ""), mins:Object.fromEntries(gl.map(g => [g.id, vs[g.id] ? vs[g.id].mins : []])), vol:Object.fromEntries(gl.map(g => [g.id, vs[g.id] ? vs[g.id].vol : {}])), targets:vs[gl[0].id] ? vs[gl[0].id].tg : {}};
}

/* ---------- Nutrition math ---------- */
const GOALS = {
  bulk:{label:"Build muscle", sub:"Lean bulk: gain slowly to keep fat gain low", phase:"bulk", min:0.1, max:0.75, rec:[0.25, 0.5], def:0.35, src:"rate-gain"},
  cut:{label:"Lose fat", sub:"Cut: lose fat while keeping muscle", phase:"cut", min:0.25, max:1.25, rec:[0.5, 1.0], def:0.6, src:"rate-loss"},
  recomp:{label:"Recomp", sub:"Hold weight, build muscle and lose fat slowly", phase:"recomp", min:0, max:0, rec:[0, 0], def:0, src:"recomp"},
  maintain:{label:"Maintain", sub:"Hold your weight and keep training hard", phase:"maintain", min:0, max:0, rec:[0, 0], def:0, src:"energy"}
};
const FATPREF = {balanced:["Balanced", 0.27], carb:["Higher carb", 0.2], fat:["Higher fat", 0.35]};
function goalTargets(g, ex, kg, dateIsTraining){
  const sign = g.type === "cut" ? -1 : 1, rateKg = sign * (+g.rate || 0) / 100 * kg;
  const base = Math.round((ex + rateKg * 7700 / 7) / 10) * 10;
  let kcal = base;
  if (g.dist === "training" && dateIsTraining != null){
    const nT = Math.max(1, (S.prog.days || []).filter(d => !d.rest && !d.optional).length), nR = Math.max(1, 7 - nT), shift = Math.round(base * 0.08 / 10) * 10;
    kcal = dateIsTraining ? base + shift : base - Math.round(shift * nT / nR / 10) * 10;
  }
  const p = Math.round(kg * (+g.prot || 2)), f = Math.round(Math.max(kg * 0.6, base * FATPREF[g.fat || "balanced"][1] / 9));
  const c = Math.max(0, Math.round((kcal - p * 4 - f * 9) / 4));
  return {kcal, p, f, c, base, rateKg};
}
window.AJGoal = {
  targets(date){
    const g = S.profile.goal; if (!g) return null;
    const ex = expenditure(), kg = currentKg(), d = date ? parseD(date) : new Date(), day = dayForDate(d);
    return Object.assign(goalTargets(g, ex.kcal, kg, day ? !day.rest : null), {mode:"auto", ex, goal:g});
  },
  band(){ const g = S.profile.goal; if (!g || !(+g.rate)) return null; const r = (g.type === "cut" ? -1 : 1) * g.rate; return [r - 0.15, r + 0.15]; },
  summary(){
    const g = S.profile.goal; if (!g) return null;
    const kg = currentKg(), G = GOALS[g.type];
    if (!(+g.rate) || !g.targetKg) return {line:`${G.label}${g.type === "recomp" ? " at maintenance calories" : ""}`, eta:null};
    const rk = (g.type === "cut" ? -1 : 1) * g.rate / 100 * kg, left = g.targetKg - kg, weeks = rk ? left / rk : null;
    const done = weeks != null && weeks <= 0;
    const eta = weeks != null && weeks > 0 ? new Date(Date.now() + weeks * 7 * 864e5) : null;
    return {line:`${G.label} · ${rk > 0 ? "+" : ""}${rk.toFixed(2)} kg a week`, eta, left, done};
  }
};

/* ---------- Flow shell ---------- */
let F = null;     // {kind, step, ans, out, seed}
const DRAFT = "ajlog2:obdraft:";
const saveDraft = () => { try{ localStorage.setItem(DRAFT + F.kind, JSON.stringify({step:F.step, ans:F.ans})); }catch(e){} };
const loadDraft = k => { try{ return JSON.parse(localStorage.getItem(DRAFT + k)); }catch(e){ return null; } };
const clearDraft = k => { try{ localStorage.removeItem(DRAFT + k); }catch(e){} };
function el(){ let o = document.getElementById("ob"); if (!o){ o = document.createElement("div"); o.id = "ob"; o.className = "ob"; o.setAttribute("role", "dialog"); document.body.appendChild(o); bind(o); } return o; }
function close(){ const o = document.getElementById("ob"); document.body.style.overflow = "";
  if (F && F.kind === "nut" && !F.accepted) S.profile.activity = F.prevAct;
  if (F && F.kind === "welcome" && !F.accepted){ S.profile = {...S.profile, setupDone:true, modules:S.profile.modules || {training:true, endurance:true, nutrition:true, habits:true}}; saveProfile(); } F = null; render(); if (o){ o.classList.add("out"); setTimeout(() => o.remove(), 240); } }
function nextMonday(){ const d = new Date(); d.setHours(12); const add = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + (d.getDay() === 1 ? 0 : add)); return ymd(d); }

function addWeeks(n){ const d = new Date(); d.setDate(d.getDate() + n * 7); return ymd(d); }
function progDefaults(){
  const p = S.prog || {}, prev = p.setup, gl = gymList();
  const kit = Object.fromEntries(gl.map(g => [g.id, (g.kit || KIT_FULL).slice()]));
  if (prev) return Object.assign(endDefaults(), clone(prev), {kit});
  const days = (p.days || []).filter(d => !d.rest && !d.optional && d.variants && Object.keys(d.variants).length).map(d => d.k);
  const gymOf = {}; (p.days || []).forEach(d => { if (!d.rest) gymOf[d.k] = d.gym || gl[0].id; });
  const love = []; (p.days || []).forEach(d => { if (d.rest) return; Object.values(d.variants || {}).forEach(v => v.forEach(([k]) => { if (L[k] && !love.includes(k) && L[k].len === 2) love.push(k); })); });
  const kind = on("training") && on("endurance") ? null : on("endurance") ? "endurance" : "gym";
  return Object.assign(endDefaults(), {kind, goal:"size", level:"inter", days:days.length ? days : ["mon","tue","thu","fri"], mins:60, gymOf, kit, sport:[],
    split:null, pri:[], inj:[], love, ban:[], block:6, start:nextMonday(), phase:S.profile.phase || "maintain", name:"Block 1"});
}
function endDefaults(){ return {event:"general", raceDate:addWeeks(16), weeklyKm:15, longest:8, runDays:["tue","thu","sat"], longDay:"sat", liftDays:on("training") ? ["mon","wed"] : []}; }
function loggedSteps(){ const v = []; for (let i = 1; i <= 21; i++){ const t = stepsTotal(ymd(new Date(Date.now() - i * 864e5))); if (t != null) v.push(t); } return v.length >= 3 ? {avg:Math.round(v.reduce((a, b) => a + b, 0) / v.length / 100) * 100, n:v.length} : null; }
function actDefaults(){
  const cur = S.profile.activity; if (cur && cur.set) return clone(cur);
  const ls = loggedSteps(), shwc = (S.prog.days || []).filter(d => !d.rest && d.gym === "shwc").length;
  return {job:"desk", steps:ls ? ls.avg : 9000, commute:shwc * 70, set:true};
}
function nutDefaults(){
  const g = S.profile.goal, kg = currentKg();
  if (g) return clone(g);
  const type = S.profile.phase === "cut" ? "cut" : S.profile.phase === "recomp" ? "recomp" : S.profile.phase === "maintain" ? "maintain" : "bulk";
  return {type, startKg:r1(kg), targetKg:r1(type === "cut" ? kg * 0.94 : kg * 1.05), rate:GOALS[type].def, prot:type === "cut" ? 2.2 : 2.0, fat:"balanced", dist:"even", activity:actDefaults()};
}

/* ---------- Units and typed number fields ----------
   Every number can be typed or slid. Heights in cm or ft/in, weights in kg, lb or st/lb; stored in cm and kg. */
const LB = 2.20462;
function units(){ return Object.assign({h:"cm", w:"kg"}, S.profile.units || {}, F && F.ans && F.ans.units || {}); }
function ftIn(cm){ const t = cm / 2.54; let ft = Math.floor(t / 12), inch = Math.round(t - ft * 12); if (inch === 12){ ft++; inch = 0; } return [ft, inch]; }
function stLb(kg){ const t = kg * LB; let st = Math.floor(t / 14), lb = Math.round(t - st * 14); if (lb === 14){ st++; lb = 0; } return [st, lb]; }
function fmtW(kg, u){ u = u || units().w; if (kg == null || !isFinite(kg)) return "–"; if (u === "lb") return Math.round(kg * LB) + " lb"; if (u === "st"){ const [st, lb] = stLb(kg); return st + " st " + lb + " lb"; } return (+kg).toFixed(1) + " kg"; }
function fmtH(cm, u){ u = u || units().h; if (u === "ftin"){ const [f, i] = ftIn(cm); return f + " ft " + i + " in"; } return Math.round(cm) + " cm"; }
function nf(key, conv, val, label, w){ return `<input class="field obnumf" ${w ? `style="width: ${w}px;"` : ""} inputmode="${conv === "kg" || conv === "bf" ? "decimal" : "numeric"}" data-key="${key}" data-conv="${conv}" value="${val}" aria-label="${label}" autocomplete="off">`; }
function heightRow(key, cm){
  const u = units().h;
  if (u === "ftin"){ const [f, i] = ftIn(cm); return `<div class="obunitrow">${nf(key, "ft", f, "Feet", 72)}<span>ft</span>${nf(key, "in", i, "Inches", 72)}<span>in</span><em class="obconv">${Math.round(cm)} cm</em></div>`; }
  return `<div class="obunitrow">${nf(key, "cm", Math.round(cm), "Height in centimetres", 104)}<span>cm</span><em class="obconv">${fmtH(cm, "ftin")}</em></div>`;
}
function weightRow(key, kg){
  const u = units().w;
  if (u === "st"){ const [st, lb] = stLb(kg); return `<div class="obunitrow">${nf(key, "st", st, "Stone", 72)}<span>st</span>${nf(key, "stlb", lb, "Pounds", 72)}<span>lb</span><em class="obconv">${(+kg).toFixed(1)} kg</em></div>`; }
  if (u === "lb") return `<div class="obunitrow">${nf(key, "lb", Math.round(kg * LB), "Weight in pounds", 104)}<span>lb</span><em class="obconv">${(+kg).toFixed(1)} kg</em></div>`;
  return `<div class="obunitrow">${nf(key, "kg", (+kg).toFixed(1), "Weight in kilograms", 104)}<span>kg</span><em class="obconv">${fmtW(kg, "st")}</em></div>`;
}
function unitSeg(kind){ const u = units(); return kind === "h" ? seg2("units.h", [["cm","cm"],["ftin","ft/in"]], u.h) : seg2("units.w", [["kg","kg"],["lb","lb"],["st","st/lb"]], u.w); }
const LIMITS = {heightCm:[120, 230], kg:[30, 250], kgNow:[30, 250], bf:[3, 60]};
// value of a typed field group (ft+in, st+lb) in the stored unit; null while incomplete or out of range
function readConv(row, key){
  const v = c => { const x = row.querySelector(`[data-key="${key}"][data-conv="${c}"]`); return x ? +String(x.value).replace(",", ".") : NaN; };
  const c0 = row.querySelector(`[data-key="${key}"]`).dataset.conv; let out;
  if (c0 === "cm") out = v("cm"); else if (c0 === "ft") out = ((v("ft") || 0) * 12 + (v("in") || 0)) * 2.54;
  else if (c0 === "kg") out = v("kg"); else if (c0 === "lb") out = v("lb") / LB; else if (c0 === "st") out = ((v("st") || 0) * 14 + (v("stlb") || 0)) / LB;
  else out = v(c0);
  const [lo, hi] = LIMITS[key] || [-Infinity, Infinity];
  return isFinite(out) && out >= lo && out <= hi ? out : null;
}
function fmtDob(raw){ const d = String(raw).replace(/\D/g, "").slice(0, 8); return d.length > 4 ? d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4) : d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; }
function parseDob(txt){
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(txt || ""); if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1], 12); if (d.getDate() !== +m[1] || d.getMonth() !== +m[2] - 1) return null;
  const age = (Date.now() - d) / (365.25 * 864e5); if (age < 13 || age > 100) return null;
  return {iso:ymd(d), age:Math.floor(age)};
}
function isoToDob(iso){ const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); return m ? m[3] + "/" + m[2] + "/" + m[1] : ""; }
function pctOf(t){ const lo = +t.min || 0, hi = +t.max || 100; return Math.max(0, Math.min(100, (+t.value - lo) / (hi - lo) * 100)); }
function fillRanges(root){ (root || document).querySelectorAll('input[type=range]').forEach(t => t.style.setProperty("--p", pctOf(t) + "%")); }
window.AJFillRanges = fillRanges;

/* ---------- Programme steps ---------- */
const PSTEPS_GYM = ["intro","kind","goal","level","days","gyms","sport","split","pri","inj","lifts","block","build","review"];
const PSTEPS_END = ["intro","kind","event","racedate","current","rundays","strength","gyms","build","review"];
const PSTEPS_HYB = ["intro","kind","event","racedate","current","rundays","liftdays","gyms","pri","inj","build","review"];
function psteps(){ const k = F.ans.kind; return k === "endurance" ? PSTEPS_END.filter(x => x !== "racedate" || F.ans.event !== "general").filter(x => x !== "gyms" || (F.ans.liftDays || []).length) : k === "hybrid" ? PSTEPS_HYB.filter(x => x !== "racedate" || F.ans.event !== "general") : PSTEPS_GYM; }
const NSTEPS = ["intro","goal","activity","stats","target","rate","macros","review"];
function stepsOf(){ if (F.kind === "welcome") return WSTEPS; return F.kind === "prog" ? psteps() : NSTEPS.filter(s => !(s === "target" || s === "rate") || (F.ans.type === "bulk" || F.ans.type === "cut")); }
function src(id, txt){ return `<button class="obsrc" data-src="${id}">${txt || "Evidence"}</button>`; }
function opt(name, val, title, sub, cur){ return `<button class="obopt" data-set="${name}" data-val="${val}" aria-pressed="${cur === val}"><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</button>`; }
function chip(name, val, label, on){ return `<button class="chip" data-tog="${name}" data-val="${val}" aria-pressed="${!!on}">${label}</button>`; }

function pStep(s, a){
  switch (s){
  case "intro": return {title:"Build your plan", body:`
    <p class="oblead">Answer a few questions and I'll build a full plan: gym, running, or both. Every session, how hard to go, and how it progresses week to week.</p>
    <div class="obpoints">
      <div><i>1</i><span><b>Built from the research</b><em>Volume, effort, intensity mix, long-run limits and tapering follow current meta-analyses. Tap <u>Evidence</u> anywhere to see the study.</em></span></div>
      <div><i>2</i><span><b>Fits your gyms and your week</b><em>Strength sessions are written for every gym you add, using only the kit it has.</em></span></div>
      <div><i>3</i><span><b>Race-ready</b><em>From a first 5k to multi-day desert ultras: base, build, peak and taper, with long runs that never jump too far.</em></span></div>
    </div>`, cta:"Start"};
  case "kind": return {title:"What are you training for?", body:`<div class="obopts">
    ${opt("kind","gym","Muscle and strength","Gym programme: split, exercises, sets and progression.",a.kind)}
    ${opt("kind","endurance","Running or an endurance event","5k to ultra and multi-day stage races, with strength work for runners.",a.kind)}
    ${opt("kind","hybrid","Both: lifting and running","A full lifting split around a running plan, scheduled so they don't clash.",a.kind)}</div>`};
  case "event": return {title:"What's the goal?", body:`<div class="obopts">${Object.entries(EVENTS).map(([k, e]) => opt("event", k, e.name, e.sub, a.event)).join("")}</div>`};
  case "racedate": { const wks = Math.ceil((parseD(a.raceDate) - parseD(a.start)) / (7 * 864e5)); const E = EVENTS[a.event];
    return {title:"When is it?", body:`<label class="lab">Race date<input class="field" type="date" data-input="raceDate" value="${esc(a.raceDate)}"></label>
      <label class="lab">Plan starts<input class="field" type="date" data-input="start" value="${esc(a.start)}"></label>
      <p class="obnote">${wks >= 1 ? `${wks} weeks of training, including a ${E.taper}-week taper.` : "Pick a date after the start."} ${wks > 0 && wks < 8 ? "That's short: the plan will compress the base phase and keep the long-run progression safe rather than rushing it." : ""} ${src("taper")}</p>`}; }
  case "current": return {title:"Where are you now?", body:`
    <h3 class="obh" style="margin-top:0">Running per week, lately</h3><div class="spread"><b class="num">${a.weeklyKm} km</b><span class="muted small">average of the last month</span></div>
    <div class="obslider"><input type="range" min="0" max="120" step="1" value="${a.weeklyKm}" data-range="weeklyKm"></div>
    <h3 class="obh">Longest run in the last 30 days</h3><div class="spread"><b class="num">${a.longest} km</b><span class="muted small">the plan builds from here</span></div>
    <div class="obslider"><input type="range" min="0" max="60" step="1" value="${a.longest}" data-range="longest"></div>
    <p class="obnote">Long runs never grow more than 10% beyond your longest run of the previous month: in 5,200 runners, single runs that jumped past that were what predicted injury, not weekly totals. ${src("progression-run")}</p>`};
  case "rundays": return {title:"Which days can you run?", body:`
    <div class="obdays">${WD.map(([k,, sh]) => `<button class="obday" data-tog="runDays" data-val="${k}" aria-pressed="${(a.runDays || []).includes(k)}">${sh}</button>`).join("")}</div>
    <h3 class="obh">Long run day</h3><div class="obdays">${WD.map(([k,, sh]) => `<button class="obday" data-set="longDay" data-val="${k}" aria-pressed="${a.longDay === k}" ${(a.runDays || []).includes(k) ? "" : "disabled"}>${sh}</button>`).join("")}</div>
    <p class="obnote">${(a.runDays || []).length} runs a week, about 80% easy and 20% hard. Most gains come from easy volume; hard sessions are capped rather than piled on. ${src("intensity")}</p>`};
  case "strength": return {title:"Strength sessions", body:`
    <p class="obnote" style="margin-top:0">Two sessions a week through base and build (one in peak and taper) improve running economy by about 2-8%. Pick days, ideally not the day before your long run. ${src("strength-run")}</p>
    <div class="obdays">${WD.map(([k,, sh]) => `<button class="obday" data-tog="liftDays" data-val="${k}" aria-pressed="${(a.liftDays || []).includes(k)}">${sh}</button>`).join("")}</div>
    <p class="obnote">${(a.liftDays || []).length ? (a.liftDays || []).length + " a week." : "None selected: running only."}</p>`};
  case "liftdays": return {title:"Which days can you lift?", body:`
    <div class="obdays">${WD.map(([k,, sh]) => `<button class="obday" data-tog="liftDays" data-val="${k}" aria-pressed="${(a.liftDays || []).includes(k)}">${sh}</button>`).join("")}</div>
    <div class="spread" style="margin-top:8px"><b class="num obmins">${a.mins || 60} min</b><span class="muted small">per lifting session</span></div>
    <div class="obslider"><input type="range" min="30" max="120" step="5" value="${a.mins || 60}" data-range="mins"></div>
    <p class="obnote">Lifting doesn't blunt your running, and on average running doesn't blunt muscle growth either; keep hard leg sessions away from your long run and intervals so both stay good. ${src("interference")}</p>`};
  case "goal": return {title:"What's the main goal?", body:`<div class="obopts">
    ${opt("goal","size","Maximum size","Hypertrophy first: moderate reps near failure, the most productive volume.",a.goal)}
    ${opt("goal","strength","Size + strength","Same, but your first barbell lift each day goes heavy (4-6 reps).",a.goal)}
    ${opt("goal","aesthetic","Aesthetics","Hypertrophy with extra volume for side delts, lats and upper chest: width and V-taper.",a.goal)}</div>
    <p class="obnote">Hypertrophy is similar across roughly 6-30 reps when sets are taken close to failure; heavier work mainly adds strength. ${src("load")}</p>`};
  case "level": return {title:"Training experience", body:`<div class="obopts">
    ${opt("level","new","Under 1 year","Lower volume: you grow from less.",a.level)}
    ${opt("level","inter","1-4 years","Intermediate. The default for you.",a.level)}
    ${opt("level","adv","4+ years, close to your limit","More volume, more emphasis on effort and recovery.",a.level)}</div>
    <p class="obnote">Sets scale with experience. More sets keep adding muscle, but each extra set adds less. ${src("volume")}</p>`};
  case "days": return {title:"Which days can you train?", body:`
    <div class="obdays">${WD.map(([k,, sh]) => `<button class="obday" data-tog="days" data-val="${k}" aria-pressed="${a.days.includes(k)}">${sh}</button>`).join("")}</div>
    <p class="obnote">${a.days.length} days a week. ${a.days.length < 2 ? "Pick at least 2." : a.days.length >= 5 ? "Plenty to train every muscle twice with room for priorities." : "Enough to train every muscle twice a week."} ${src("frequency")}</p>
    <h3 class="obh">Time per session</h3>
    <div class="spread"><b class="num obmins">${a.mins} min</b><span class="muted small">including rest</span></div>
    <div class="obslider"><input type="range" min="40" max="120" step="5" value="${a.mins}" data-range="mins"></div>`};
  case "gyms": { const gl = gymList(), dk = a.kind === "gym" ? a.days : (a.liftDays || []);
    return {title:gl.length > 1 ? "Where's each session?" : "Your gym", body:`
    ${gl.length > 1 ? `<p class="obnote" style="margin-top:0">Set the usual gym for each day. Every session is written for every gym, so you can switch on the day.</p>
    <div class="obgym">${WD.filter(([k]) => dk.includes(k)).map(([k,, sh]) => `<div class="spread"><b>${sh}</b>${seg2("gymOf." + k, gl.map(g => [g.id, g.name.length > 12 ? g.name.split(/\s+/).map(w => w[0]).join("").toUpperCase() : g.name]), (a.gymOf || {})[k] || gl[0].id)}</div>`).join("")}</div>` : `<p class="obnote" style="margin-top:0">Exercises are only picked if your gym has the kit. Check the list, and add more gyms in Settings if you train in more than one place.</p>`}
    <h3 class="obh">Equipment</h3>
    ${gl.map(g => `<details class="obkit" ${gl.length === 1 ? "open" : ""}><summary><b>${esc(g.name)}</b><span class="muted small">${(a.kit[g.id] || []).length} items · tap to edit</span></summary>
      <div class="chips">${EQUIP.map(([k, n]) => chip("kit." + g.id, k, n, (a.kit[g.id] || []).includes(k))).join("")}</div></details>`).join("")}`}; }
  case "sport": return {title:"Tennis, padel or hard cardio?", body:`
    <p class="obnote" style="margin-top:0">Pick the days you usually play or do hard cardio. Leg days are kept off the day before, so your legs are fresh for both.</p>
    <div class="obdays">${WD.map(([k,, sh]) => `<button class="obday" data-tog="sport" data-val="${k}" aria-pressed="${(a.sport || []).includes(k)}">${sh}</button>`).join("")}</div>
    <p class="obnote">On average cardio doesn't blunt muscle growth, so this is about performance: fresh legs for squats and for your match. Explosive power is the one thing that suffers, mostly when both are in the same session. ${src("interference")}</p>`};
  case "split": {
    const opts = SPLITS[a.days.length] || [];
    const cur = a.split && opts.find(o => o.id === a.split) ? a.split : opts[0] && opts[0].id;
    return {title:"Pick a split", body:`<div class="obopts">${opts.map((o, i) => opt("split", o.id, o.name + (i === 0 ? ' <span class="tag rep">Recommended</span>' : ""), o.why + `<br><span class="obseq">${o.days.map(d => T[d].label).join(" · ")}</span>`, cur)).join("")}</div>
      <p class="obnote">Each split trains every muscle at least twice a week. With the same weekly sets, frequency itself matters little, but splitting volume over two sessions keeps quality high. ${src("frequency")}</p>`};
  }
  case "pri": return {title:"What do you want to bring up?", body:`
    <p class="obnote" style="margin-top:0">Pick up to 3. They get about ${PRIORITY_SETS} sets a week (others ~10-12), go first in the session while you're fresh, and get an extra exercise.</p>
    <div class="chips obbig">${PRIORITY_CHOICES.map(m => chip("pri", m, MUS[m], (a.pri || []).includes(m))).join("")}</div>
    <p class="obnote">Extra weekly sets are what drive the extra growth; going first in the session keeps those sets high quality. ${src("volume")} ${src("order","Order evidence")}</p>`};
  case "inj": return {title:"Anything to protect?", body:`
    <p class="obnote" style="margin-top:0">Lifts that load these joints hardest are swapped for friendlier options (for example chest-supported rows instead of barbell rows for the lower back).</p>
    <div class="chips obbig">${INJ.map(([k, n]) => chip("inj", k, n, (a.inj || []).includes(k))).join("")}</div>
    <p class="obnote">${(a.inj || []).length ? "Noted. You can still star any lift on the next screen to keep it." : "Nothing selected: every lift is available."}</p>`};
  case "lifts": {
    const groups = {};
    Object.values(L).forEach(e => { const m = Object.keys(e.mu).find(x => e.mu[x] >= 1); (groups[m] = groups[m] || []).push(e); });
    return {title:"Lifts you love or hate", body:`
      <p class="obnote" style="margin-top:0">Tap once to <b>star</b> (always use it when the kit allows), twice to <b>ban</b>, three times to reset. Starred ones come from your current plan.</p>
      ${Object.entries(groups).map(([m, list]) => `<details class="obkit"><summary><b>${MUS[m]}</b><span class="muted small">${list.filter(e => a.love.includes(e.k)).length ? list.filter(e => a.love.includes(e.k)).length + " starred" : ""}${list.filter(e => a.ban.includes(e.k)).length ? " · " + list.filter(e => a.ban.includes(e.k)).length + " banned" : ""}</span></summary>
        <div class="chips">${list.map(e => `<button class="chip lchip ${a.love.includes(e.k) ? "love" : a.ban.includes(e.k) ? "ban" : ""}" data-lift="${e.k}">${a.love.includes(e.k) ? "★ " : a.ban.includes(e.k) ? "✕ " : ""}${esc(e.n)}${e.len === 2 ? '<em>stretch</em>' : ""}</button>`).join("")}</div></details>`).join("")}
      <p class="obnote">Lifts marked <em class="tagin">stretch</em> load the muscle hardest when it's lengthened; they're favoured because they tend to grow muscle as well or better. ${src("lengthened")}</p>`};
  }
  case "block": return {title:"Block length and start", body:`
    <div class="obopts">${opt("block","5","5 weeks","4 hard weeks, then a deload week.",String(a.block))}${opt("block","6","6 weeks","5 hard weeks, then a deload week. Recommended.",String(a.block))}</div>
    <div class="obrir">${rirPlan(+a.block).map((r, i) => `<div class="${r === "DL" ? "dl" : ""}"><span>W${i + 1}</span><b>${r === "DL" ? "Deload" : r + " RIR"}</b></div>`).join("")}</div>
    <p class="obnote">Effort rises through the block: start ~3 reps in reserve and finish near failure, then deload with half the sets. Taking sets closer to failure grows more muscle, with diminishing returns on strength. ${src("rir")} ${src("deload","Deload evidence")}</p>
    <label class="lab">Start date<input class="field" type="date" data-input="start" value="${esc(a.start)}"></label>
    <label class="lab">Name<input class="field" data-input="name" value="${esc(a.name)}"></label>`};
  case "build": return {title:"", body:`<div class="obbuild"><div class="obspin">${LOGO(72)}</div><h2>Building your plan</h2><div class="obticks" id="obticks"></div></div>`, nofoot:true};
  case "review": return a.kind === "gym" ? review(a) : reviewEndu(a);
  }
}
function seg2(name, opts, cur){ return `<div class="seg obseg" style="grid-template-columns:repeat(${opts.length},1fr)">${opts.map(([k, v]) => `<button data-set="${name}" data-val="${k}" aria-pressed="${k === cur}">${v}</button>`).join("")}</div>`; }

function volChart(prog, gym){
  const v = prog.vol[gym], tg = prog.targets, pri = new Set(prog.setup.pri || []);
  const rows = Object.keys(MUS).filter(m => (tg[m] || 0) > 0 || (v[m] || 0) > 0);
  const mx = Math.max(22, ...rows.map(m => Math.max(v[m] || 0, tg[m] || 0)));
  return `<div class="obvol">${rows.map(m => `<div class="obvr"><span>${MUS[m]}${pri.has(m) ? ' <i class="obpri">★</i>' : ""}</span><span class="obtrack"><b style="width:${Math.min(100, (v[m] || 0) / mx * 100)}%" class="${(v[m] || 0) >= (tg[m] || 0) - 1 ? "ok" : ""}"></b><i style="left:${(tg[m] || 0) / mx * 100}%"></i></span><span class="num small">${r1(v[m] || 0)}</span></div>`).join("")}
    <div class="obvl"><span></span><span class="small muted">Bar = weekly sets (a set that trains it directly counts 1, indirectly ½). <b class="obtickkey"></b> = recommended for you.</span><span></span></div></div>`;
}
function reviewEndu(a){
  const prog = F.out, P = prog.endurance, gl = gymList(), g = F.gym && gl.some(x => x.id === F.gym) ? F.gym : gl[0].id;
  const mx = Math.max(...P.weeks.map(w => w.km), 10), col = {Base:"var(--cardio)", Build:"var(--orange)", Peak:"var(--prot)", Taper:"var(--carb)"};
  const w0 = P.weeks[0], peak = P.weeks.find(w => w.phase === "Peak") || P.weeks[P.weeks.length - 1];
  const wk = w => WD.filter(([, wd]) => w.sessions[wd] || (prog.days.find(d => d.wd === wd) || {}).variants && Object.keys((prog.days.find(d => d.wd === wd) || {}).variants || {}).length).map(([k, wd, sh]) => {
    const s2 = w.sessions[wd], d = prog.days.find(x => x.wd === wd), lift = d && d.variants && (d.variants[g] || []).length;
    return `<div><span><b>${sh} · ${s2 ? RUNTYPE[s2.type].n : ""}${s2 && lift ? " + " : ""}${lift ? "strength" : ""}</b><em>${s2 ? esc(RUNTYPE[s2.type].rpe) : esc(d.focus || "")}</em></span><span class="num">${s2 ? s2.km + " km" : ""}</span></div>`; }).join("");
  const E = EVENTS[P.event];
  return {title:"Your plan", wide:true, body:`
    <div class="obsum"><div class="full"><span>Goal</span><b>${esc(P.eventName)}${P.raceDate ? " · " + fmtD(P.raceDate) : ""}</b></div><div><span>Length</span><b>${P.weeks.length} weeks</b></div><div><span>Peak week</span><b>${P.peakKm} km</b></div><div><span>Longest run</span><b>${Math.max(...P.weeks.map(w => w.long))} km</b></div></div>
    <div class="card"><h2>Weekly running</h2><div class="ebars">${P.weeks.map(w => `<span title="Week ${w.w}: ${w.km} km"><i style="height:${w.km / mx * 100}%;background:${col[w.phase]};opacity:${w.recovery ? .5 : 1}"></i></span>`).join("")}</div>
      <div class="legend">${Object.entries(col).filter(([k]) => P.weeks.some(w => w.phase === k)).map(([k, c]) => `<span><i style="background:${c}"></i>${k}</span>`).join("")}<span><i style="background:var(--line)"></i>Recovery week</span></div></div>
    <div class="card"><h2>Week 1</h2><div class="oblist">${wk(w0)}</div>${w0.notes.length ? `<p class="small muted">${w0.notes.map(esc).join(". ")}.</p>` : ""}</div>
    <div class="card"><h2>Peak week (week ${peak.w})</h2><div class="oblist">${wk(peak)}</div>${peak.notes.length ? `<p class="small muted">${peak.notes.map(esc).join(". ")}.</p>` : ""}</div>
    ${(a.liftDays || []).length ? `<details class="card obdayc"><summary><b>Strength sessions${gl.length > 1 ? " · " + esc((gl.find(x => x.id === g) || {}).name) : ""}</b><span class="small muted">${(a.liftDays || []).length} a week</span></summary>
      ${prog.days.filter(d => d.variants && (d.variants[g] || []).length).map(d => `<div class="oblist"><div><span><b>${WD.find(x => x[0] === d.k)[2]}</b></span><span></span></div>${(d.variants[g] || []).map(([k, n]) => { const e = prog.exercises[k]; return `<div><span><b>${esc(e.n)}</b><em>${esc(e.m)}</em></span><span class="num">${n} × ${e.lo}–${e.hi}</span></div>`; }).join("")}</div>`).join("")}</details>` : ""}
    <div class="card obwhy"><h2>Why it's built this way</h2>
      <div><b>Easy most days</b><span>About 80% of running easy, 20% hard. Polarised and pyramidal mixes both work; piling on hard sessions doesn't. ${src("intensity")}</span></div>
      <div><b>Long run limit</b><span>Never more than 10% beyond your longest run of the last 30 days, the clearest injury signal in 5,200 runners. ${src("progression-run")}</span></div>
      ${P.raceDate ? `<div><b>Taper</b><span>${E.taper} week${E.taper > 1 ? "s" : ""}: volume down 40-60%, intensity kept. ${src("taper")}</span></div>` : ""}
      ${(a.liftDays || []).length ? `<div><b>Strength</b><span>2 sessions in base and build, 1 later: running economy improves ~2-8%. ${src("strength-run")}</span></div>` : ""}
      ${E.heat ? `<div><b>Heat</b><span>10-14 heat sessions in the last ~2.5 weeks; most adaptation comes in the first 4-7 days. ${src("heat")}</span></div>` : ""}
      ${Math.max(...P.weeks.map(w => w.long)) * 6 >= 90 ? `<div><b>Fuelling</b><span>Practise 60-90 g carbohydrate an hour on long runs so your gut can take it on race day. ${src("fuel")}</span></div>` : ""}
      <div><b>Recovery weeks</b><span>Every 4th week drops ~20%. This one is coaching convention rather than trial evidence.</span></div>
    </div>`, cta:"Save plan"};
}
function review(a){
  const prog = F.out, gl = gymList(), g = F.gym && gl.some(x => x.id === F.gym) ? F.gym : gl[0].id, gn = id => { const n = (gl.find(x => x.id === id) || {}).name || ""; return n.length > 12 ? n.split(/\s+/).map(w => w[0]).join("").toUpperCase() : n; };
  const train = prog.days.filter(d => !d.rest);
  return {title:"Your block", wide:true, body:`
    <div class="obsum"><div class="full"><span>Split</span><b>${esc(prog.splitName)}</b></div><div><span>Block</span><b>${prog.deloadEvery} weeks</b></div><div><span>Starts</span><b>${fmtD(prog.startDate)}</b></div><div><span>Days</span><b>${prog.days.filter(d => !d.rest).length} a week</b></div></div>
    <div class="obweek">${prog.days.map(d => `<div class="${d.rest ? "rest" : ""}"><span>${WD.find(x => x[0] === d.k)[2]}</span><b>${d.rest ? "–" : esc(d.label.replace("Upper ","U").replace("Lower ","L").replace("Full body ","FB").replace("Arms & delts","Arms"))}</b><em>${d.rest || gl.length < 2 ? "" : esc(gn(d.gym))}</em></div>`).join("")}</div>
    ${(() => { const v = prog.vol[g] || {}, sh = (prog.setup.pri || []).filter(m => (v[m] || 0) < (prog.targets[m] || 0) - 1.5); return sh.length ? `<div class="banner info"><b>Not enough time for full priority volume.</b> ${sh.map(m => MUS[m] + " " + r1(v[m] || 0) + "/" + prog.targets[m]).join(", ")} sets. Add ~15 min per session or another day to reach the target, or drop a priority.</div>` : ""; })()}
    <div class="card"><div class="spread"><h2>Weekly sets</h2>${gl.length > 1 ? seg2("_gym", gl.map(x => [x.id, gn(x.id)]), g) : ""}</div>${volChart(prog, g)}
      <p class="small muted">${gl.length > 1 ? `Shown for a week done entirely at ${esc(gn(g))}.` : ""} ${src("volume")}</p></div>
    ${train.map(d => { const list = d.variants[g] || [], mins = prog.mins[g][prog.days.filter(x => !x.rest).indexOf(d)];
      return `<details class="card obdayc"><summary><div class="stack" style="gap:2px"><b>${WD.find(x => x[0] === d.k)[2]} · ${esc(d.label)}</b><span class="small muted">${esc(d.focus)}</span></div><span class="small muted num">${list.reduce((s, x) => s + x[1], 0)} sets · ~${Math.round(mins)} min</span></summary>
        <div class="oblist">${list.map(([k, n]) => { const e = prog.exercises[k]; return `<div><span><b>${esc(e.n)}</b><em>${esc(e.m)}${e.len === 2 ? " · stretch" : ""}</em></span><span class="num">${n} × ${e.lo}–${e.hi}<em>${Math.round(e.rest / 60 * 10) / 10} min rest</em></span></div>`; }).join("")}</div>
        <p class="small muted">${esc(d.cardio)}.</p></details>`; }).join("")}
    <div class="card obwhy"><h2>Why it's built this way</h2>
      <div><b>Volume</b><span>~10-12 sets a week per muscle, ~${PRIORITY_SETS} for priorities. Gains rise with sets but flatten off. ${src("volume")}</span></div>
      <div><b>Frequency</b><span>Every muscle twice a week, so no session gets bloated. ${src("frequency")}</span></div>
      <div><b>Effort</b><span>RIR ${prog.rir.filter(r => r !== "DL").join(" → ")}, then deload. Closer to failure builds more muscle. ${src("rir")}</span></div>
      <div><b>Reps + rest</b><span>Compounds 6-10 with 2.5-3 min rest; isolation 10-15 with ~1.5 min. Short rest costs growth on big lifts. ${src("rest")}</span></div>
      <div><b>Exercise choice</b><span>Stretch-biased lifts are favoured. ${src("lengthened")}</span></div>
      <div><b>Progression</b><span>Double progression: add reps across the range, then add load. ${src("progression")}</span></div>
      <div><b>Deload</b><span>Every ${prog.deloadEvery}th week, half the sets at ~3 RIR. ${src("deload")}</span></div>
    </div>`, cta:"Save programme", alt:"Shuffle exercises"};
}

/* ---------- Welcome (first run) ---------- */
const WSTEPS = ["hello","sections","about","next"];
const MODICON = {training:"lift", endurance:"cardio", nutrition:"food", habits:"steps"};
function wStep(s, a){
  switch (s){
  case "hello": return {title:"", body:`<div class="obhello">${LOGO(96)}<h1>Welcome${a.name ? ", " + esc(a.name) : ""}</h1>
    <p class="oblead">One app for training, running, food and habits, built on the research and shaped around you. Use all of it, or just the parts you need.</p></div>`, cta:"Get started"};
  case "sections": return {title:"What do you want to use?", body:`<p class="obnote" style="margin-top:0">Pick as many as you like. You can change this any time in Settings.</p>
    <div class="obopts">${Object.entries(MODULES).map(([k, [n, d]]) => `<button class="obopt obmod" data-tog="mods" data-val="${k}" aria-pressed="${a.mods.includes(k)}"><span class="obmi">${ICON[MODICON[k]]}</span><span><b>${n}</b><span>${d}</span></span><i class="obtick"></i></button>`).join("")}</div>`};
  case "about": { const dob = parseDob(a.dob);
    return {title:"About you", cls:"obform", body:`<p class="obnote" style="margin-top:0">Used to work out your calorie burn, targets and body-fat estimates. Nothing is shared.</p>
    <div class="obfld"><span class="obl">First name</span><input class="field" data-input="name" value="${esc(a.name)}" placeholder="Your name" autocomplete="given-name"></div>
    <div class="obfld"><span class="obl">Sex</span>${seg2("sex", [["male","Male"],["female","Female"]], a.sex)}<span class="obhint">Used for the energy and body-fat maths.</span></div>
    <div class="obfld"><span class="obl">Date of birth</span><input class="field" data-dob="1" inputmode="numeric" maxlength="10" value="${esc(a.dob || "")}" placeholder="DD/MM/YYYY, e.g. 01/04/1999" autocomplete="bday">
      <span class="obhint ${a.dob && a.dob.length === 10 && !dob ? "bad" : ""}">${dob ? "Age " + dob.age : a.dob && a.dob.length === 10 ? "That date doesn't look right" : "Day, month, year"}</span></div>
    <div class="obfld"><div class="spread"><span class="obl">Height</span>${unitSeg("h")}</div>${heightRow("heightCm", a.heightCm)}
      <div class="obslider"><input type="range" min="140" max="215" step="1" value="${Math.min(215, Math.max(140, a.heightCm))}" data-range="heightCm" aria-label="Height"></div></div>
    <div class="obfld"><div class="spread"><span class="obl">Weight</span>${unitSeg("w")}</div>${weightRow("kg", a.kg)}
      <div class="obslider"><input type="range" min="35" max="200" step="0.5" value="${Math.min(200, Math.max(35, a.kg))}" data-range="kg" aria-label="Weight"></div></div>`}; }
  case "next": {
    const m = new Set(a.mods), items = [];
    if (m.has("training") || m.has("endurance")) items.push(["prog", "Build your plan", m.has("endurance") && !m.has("training") ? "Race or running plan with the right mix of easy, hard and long" : "Two minutes: sessions, sets and progression from the research", "lift"]);
    if (m.has("nutrition")) items.push(["nut", "Set your food goal", "Goal, pace and targets that adapt to your real weight and food data", "food"]);
    if (m.has("habits")) items.push(["habits", "Add your habits", "Steps, sleep, water, quitting something, or your own", "steps"]);
    return {title:"You're set", body:`<p class="oblead">Next, set up the parts you picked. You can do them now or later from the dashboard.</p>
      <div class="obopts">${items.map(([k, t, d, ic]) => `<button class="obopt obmod" data-wnext="${k}"><span class="obmi">${ICON[ic]}</span><span><b>${t}</b><span>${d}</span></span><i class="obarrow">›</i></button>`).join("")}</div>`, cta:"Go to my dashboard"};
  }
  }
}
function welcomeDefaults(){
  const p = S.profile, md = p.modules;
  return {mods:md ? Object.keys(MODULES).filter(k => md[k] !== false) : ["training","nutrition","habits"], name:p.name || "", sex:p.sex || null,
    birthDate:p.birthSet ? p.birthDate : "1995-01-01", dob:p.birthSet ? isoToDob(p.birthDate) : "", heightCm:p.heightCm || 175, kg:r1(currentKg() || 75), units:Object.assign({h:"cm", w:"kg"}, p.units || {})};
}
function acceptWelcome(then){
  const a = F.ans, mods = Object.fromEntries(Object.keys(MODULES).map(k => [k, a.mods.includes(k)]));
  const dob = parseDob(a.dob);
  S.profile = {...S.profile, modules:mods, name:a.name.trim(), sex:a.sex, birthDate:dob ? dob.iso : S.profile.birthDate, birthSet:!!dob || !!S.profile.birthSet, heightCm:Math.round(+a.heightCm), fallbackKg:+a.kg, units:a.units, setupDone:true};
  saveProfile();
  if (!S.weights.some(w => w.d === ymd(new Date())) && Math.abs((currentKg() || 0) - a.kg) > 0.05){ try{ logWeight(+a.kg, ymd(new Date())); }catch(e){} }
  clearDraft("welcome"); F.accepted = true;
  const o = document.getElementById("ob"); F = null; document.body.style.overflow = "";
  if (then === "prog") return setTimeout(() => { if (o) o.remove(); window.AJOnboard.programme(true); }, 10);
  if (then === "nut") return setTimeout(() => { if (o) o.remove(); window.AJOnboard.nutrition(true); }, 10);
  if (o){ o.classList.add("out"); setTimeout(() => o.remove(), 240); }
  if (then === "habits"){ go("habits"); setTimeout(() => habitSheet(null), 350); return; }
  go("home"); toast(a.name ? `Welcome, ${a.name}` : "Welcome");
}

/* ---------- Nutrition steps ---------- */
const JOBEG = {desk:"Office work, driving, studying, working from home", mixed:"Teaching, retail, lab work: some walking about", active:"Trades, nursing, hospitality, warehouse, labouring"};
// Tudor-Locke & Bassett 2004 / Tudor-Locke 2011 step-defined activity bands
const STEPBANDS = [[5000, "Sedentary"], [7500, "Low active"], [10000, "Somewhat active"], [12500, "Active"], [Infinity, "Highly active"]];
const STEPGUESS = [["Mostly sitting", "Drive most places, little walking", 4000], ["Some walking", "Errands, the odd short walk", 6500], ["Walk most days", "Walk to work or the station, dog walks", 9000], ["On the move a lot", "Long daily walks or an on-your-feet job", 12500]];
// ACE body-fat categories (percent)
const BFBANDS = {male:[[5, 13, "Athletic"], [14, 17, "Fit"], [18, 24, "Average"], [25, 35, "Higher"]],
  female:[[12, 20, "Athletic"], [21, 24, "Fit"], [25, 31, "Average"], [32, 42, "Higher"]]};
const BFLOOK = {male:[[8, "Clear abs and veins, very lean"], [12, "Abs visible, some muscle separation"], [15, "Outline of abs, lean look"], [20, "Little definition, soft midsection"], [25, "No ab outline, fat around the waist"], [30, "Rounded waist and chest"]],
  female:[[16, "Visible abs, very defined"], [20, "Some ab outline, toned arms and legs"], [24, "Lean but soft, little definition"], [28, "Curvier, soft hips and thighs"], [32, "Rounder midsection, no definition"], [38, "Fuller face, arms and thighs"]]};
function bfGuide(sex, v){
  const sx = sex === "female" ? "female" : "male", bands = BFBANDS[sx], lo = bands[0][0], hi = bands[bands.length - 1][1], pc = x => (x - lo) / (hi - lo) * 100;
  const cols = ["var(--good)", "var(--carb)", "var(--fat)", "var(--prot)"];
  const look = BFLOOK[sx].reduce((b, x) => Math.abs(x[0] - v) < Math.abs(b[0] - v) ? x : b);
  return `<div class="bfg"><div class="bfbar">${bands.map((b, i) => `<button data-bf="${Math.round((b[0] + b[1]) / 2)}" style="left:${pc(b[0])}%;width:${pc(b[1] + 1) - pc(b[0])}%;--c:${cols[i]}" aria-label="${b[2]} ${b[0]}-${b[1]}%"><span>${b[2]}</span></button>`).join("")}<i style="left:${Math.max(0, Math.min(100, pc(v)))}%"></i></div>
    <div class="bflab">${bands.map(b => `<span style="left:${pc(b[0])}%">${b[0]}</span>`).join("")}</div>
    <div class="bflook"><b>~${look[0]}%</b><span>${look[1]}</span></div></div>`;
}
function nStep(s, a){
  const kg = currentKg(), ex = expenditure(), G = GOALS[a.type];
  switch (s){
  case "intro": return {title:"Set your nutrition goal", body:`
    <p class="oblead">Tell me where you're heading and how fast. I'll set calories and macros, then adjust them every week from your real weight trend and food logs.</p>
    <div class="obpoints">
      <div><i>1</i><span><b>Pick a goal and a pace</b><em>The slider shows the evidence-based range for your goal.</em></span></div>
      <div><i>2</i><span><b>See the timeline</b><em>Weekly change, goal date and daily calories, live as you slide.</em></span></div>
      <div><i>3</i><span><b>It adapts</b><em>Expenditure is recalculated from what you actually eat and weigh.</em></span></div>
    </div>`, cta:"Start"};
  case "goal": return {title:"What's the goal?", body:`<div class="obopts">${Object.entries(GOALS).map(([k, g]) => opt("type", k, g.label, g.sub, a.type)).join("")}</div>
    <p class="obnote">${currentBf().v <= 15 ? `At ~${Math.round(currentBf().v)}% body fat (${esc(currentBf().src)}), a lean bulk is a good default.` : `At ~${Math.round(currentBf().v)}% body fat, a cut or recomp first is worth considering.`}</p>`};
  case "activity": {
    const A = a.activity, pm = priorModel(kg), logged = loggedSteps(), band = STEPBANDS.find(b => A.steps < b[0]) || STEPBANDS[STEPBANDS.length - 1];
    return {title:"How active are you?", cls:"obform", body:`
      <p class="obnote" style="margin-top:0">This sets your starting estimate. From there your food logs and weigh-ins take over and correct it every day.</p>
      <div class="obfld"><span class="obl">Outside training, your day is mostly…</span>
      <div class="obopts">${Object.entries(JOB).map(([k, v]) => `<button class="obopt" data-set="activity.job" data-val="${k}" aria-pressed="${A.job === k}"><b>${v[0]}</b><span>${JOBEG[k]}</span></button>`).join("")}</div></div>
      <div class="obfld"><span class="obl">Steps a day, on a typical day</span>
        <div class="obunitrow">${nf("activity.steps", "steps", A.steps, "Steps a day", 120)}<span>steps</span><em class="obconv">${band[1]}</em></div>
        <div class="obslider"><input type="range" min="1000" max="30000" step="250" value="${Math.min(30000, A.steps)}" data-range="activity.steps" aria-label="Steps a day"></div>
        <span class="obhint">${logged ? `Your logged average is ${fmtN(logged.avg)} over ${logged.n} days. <button class="obsrc" data-setsteps="${logged.avg}">Use it</button>` : "Used on days you don't log steps. Linking Apple Health in Settings replaces it with your real count."}</span></div>
      <details class="obkit obguess" ${A.guess ? "open" : ""}><summary><b>Not sure of your steps?</b><span class="muted small">pick the closest</span></summary>
        <div class="obopts" style="margin-top:12px">${STEPGUESS.map(([n, d, v]) => `<button class="obopt" data-setsteps="${v}" aria-pressed="${A.steps === v}"><b>${n}</b><span>${d} · about ${fmtN(v)} steps</span></button>`).join("")}</div>
        <p class="obnote">Bands from step-count research: under 5,000 a day is sedentary, 7,500-10,000 somewhat active, 12,500+ highly active. ${src("steps")}</p></details>
      <details class="obkit" ${A.commute ? "open" : ""}><summary><b>Cycle to get around?</b><span class="muted small">${A.commute ? A.commute + " min a week" : "optional"}</span></summary>
        <p class="obnote">Cycling doesn't show up as steps, so add your usual weekly minutes (commuting, errands). Log one-off rides and sport as cardio instead.</p>
        <div class="obunitrow">${nf("activity.commute", "mins", A.commute, "Cycling minutes a week", 104)}<span>min a week</span></div>
        <div class="obslider"><input type="range" min="0" max="600" step="10" value="${A.commute}" data-range="activity.commute" aria-label="Cycling minutes a week"></div></details>
      <div class="card"><div class="spread"><h3>Starting estimate</h3><b class="num">${fmtN(pm.total)} kcal</b></div>
        <span class="small muted">Lifting comes from your programme (${(S.prog.days || []).filter(d => !d.rest && !d.optional).length} sessions a week) and sport or cardio from what you log, so you don't count them here.</span></div>`, cta:F.single ? "Save" : undefined};
  }
  case "stats": { const bf = currentBf(), today = (S.weights.find(w => w.d === ymd(new Date())) || S.weights[S.weights.length - 1] || {}).kg || kg;
    return {title:"Check your numbers", cls:"obform", body:`
    <div class="obfld"><div class="spread"><span class="obl">Weight today</span>${unitSeg("w")}</div>${weightRow("kgNow", a.kgNow != null ? a.kgNow : today)}
      <span class="obhint">Saved as today's weigh-in. Targets use your 7-day average, now ${fmtW(kg)}.</span></div>
    <div class="obfld"><span class="obl">Body fat</span>
      <div class="obunitrow">${nf("bf", "bf", Math.round(a.bf != null ? a.bf : bf.v), "Body fat percent", 90)}<span>%</span><em class="obconv">${a.bf != null ? "set by you" : esc(bf.src)}</em></div>
      ${bfGuide(S.profile.sex, a.bf != null ? +a.bf : bf.v)}
      <span class="obhint">Tap the band that looks most like you, or type a number. A guess within ~5% is fine: it only fine-tunes the energy maths, and photo check-ins can estimate it later.</span></div>
    <div class="card"><div class="spread"><h3>Expenditure</h3><b class="num">${fmtN(ex.kcal)} kcal</b></div>
      <span class="small muted">${ex.adaptive ? `Measured from ${ex.n} days of food and weight logs, blended with the starting estimate.` : `Starting estimate from your activity answers. Formulas can be off by a few hundred calories, so after 5 fully logged days it starts measuring your real burn, leaning on your data more each day.`} ${src("energy")}</span></div>`}; }
  case "target": {
    const step = 0.5, [lo, hi] = targetBounds(a.type, kg);
    if (+a.targetKg < lo || +a.targetKg > hi) a.targetKg = Math.min(hi, Math.max(lo, +a.targetKg));
    return {title:a.type === "bulk" ? "Target weight" : "Goal weight", body:`
      <div class="obbig num"><button class="obstep" data-bump="targetKg" data-d="-${step}">−</button><b>${(+a.targetKg).toFixed(1)}<span> kg</span></b><button class="obstep" data-bump="targetKg" data-d="${step}">+</button></div>
      <input type="range" min="${lo}" max="${hi}" step="0.5" value="${a.targetKg}" data-range="targetKg">
      <p class="obnote">${(+a.targetKg - kg >= 0 ? "+" : "") + (a.targetKg - kg).toFixed(1)} kg from your current trend weight. You can change this any time.</p>`};
  }
  case "rate": {
    const rk = a.rate / 100 * kg * (a.type === "cut" ? -1 : 1), weeks = Math.abs((a.targetKg - kg) / rk), eta = new Date(Date.now() + weeks * 7 * 864e5);
    const tg = goalTargets(a, ex.kcal, kg, null), inRec = a.rate >= G.rec[0] && a.rate <= G.rec[1];
    const pct = x => (x - G.min) / (G.max - G.min) * 100;
    return {title:"How fast?", body:`
      <div class="obrate"><b class="num">${rk > 0 ? "+" : ""}${rk.toFixed(2)} <span>kg / week</span></b><span class="num muted">${a.rate.toFixed(2)}% of body weight · ${(rk * 4.345).toFixed(1)} kg a month</span></div>
      <div class="obslider rate"><div class="obrec" style="left:${pct(G.rec[0])}%;width:${pct(G.rec[1]) - pct(G.rec[0])}%"></div>
        <input type="range" min="${G.min}" max="${G.max}" step="0.05" value="${a.rate}" data-range="rate">
        <div class="spread small muted"><span>${a.type === "bulk" ? "Slower, leaner" : "Gentler"}</span><span>${a.type === "bulk" ? "Faster, more fat" : "Aggressive"}</span></div></div>
      <div class="obtag ${inRec ? "ok" : "warn"}">${inRec ? "In the recommended range" : a.rate < G.rec[0] ? "Slower than the recommended range" : a.type === "bulk" ? "Faster than recommended: more of the gain will be fat" : "Faster than recommended: higher risk of losing muscle"}</div>
      ${projChart(kg, +a.targetKg, rk, weeks, G)}
      <div class="obsum"><div><span>Daily calories</span><b class="num">${fmtN(tg.kcal)}</b></div><div><span>${a.type === "bulk" ? "Surplus" : "Deficit"}</span><b class="num">${fmtN(Math.abs(tg.kcal - ex.kcal))}</b></div><div><span>Reach goal</span><b>${isFinite(weeks) && weeks < 300 ? eta.toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"}) : "–"}</b></div></div>
      <p class="obnote">${a.type === "bulk" ? "For trained lifters, about 0.25-0.5% of body weight a week (a 5-10% surplus) builds muscle with little extra fat; bigger surpluses mostly add fat." : "About 0.5-1% of body weight a week. Slower (~0.7%) kept more muscle than faster loss in elite athletes."} ${src(G.src)}</p>`};
  }
  case "macros": {
    const P = protOpts(a.type); if (!P.some(o => o[0] === +a.prot)) a.prot = P.reduce((b, o) => Math.abs(o[0] - a.prot) < Math.abs(b[0] - a.prot) ? o : b)[0];
    const tg = goalTargets(a, ex.kcal, kg, null);
    return {title:"Protein and macros", body:`
      <h3 class="obh" style="margin-top:0">Protein</h3>
      <div class="obopts obprot">${P.map(([v, n, d, rec]) => `<button class="obopt" data-set="prot" data-val="${v}" aria-pressed="${+a.prot === v}"><b>${n}${rec ? ' <span class="tag rep">Recommended</span>' : ""}<em class="num">${Math.round(kg * v)} g</em></b><span>${v.toFixed(1)} g per kg · ${d}</span></button>`).join("")}</div>
      <p class="obnote">${a.type === "cut" ? "In a deficit, more protein helps keep muscle: about 2.3-3.1 g per kg of lean mass for lean lifters, which is roughly 1.8-2.6 g per kg of body weight." : "Muscle growth from extra protein levels off at about 1.6 g per kg on average; 2.2 g per kg covers almost everyone. Going lower than 1.6 isn't offered."} ${src("protein")}</p>
      <h3 class="obh">Carbs and fat</h3>
      ${seg2("fat", Object.entries(FATPREF).map(([k, v]) => [k, v[0]]), a.fat)}
      <p class="obnote">Fat stays at least 0.6 g/kg for hormones; the rest of your calories go to carbs to fuel training. ${src("fat")}</p>
      <h3 class="obh">Calories across the week</h3>
      ${seg2("dist", [["even","Same every day"],["training","More on training days"]], a.dist)}
      <p class="obnote">${a.dist === "training" ? "Training days get ~8% more (from carbs), rest days less. Your weekly total is unchanged." : "One target every day. Simplest to hit."}</p>
      <div class="obmac"><div style="--c:var(--kcal)"><b class="num">${fmtN(tg.kcal)}</b><span>kcal</span></div><div style="--c:var(--prot)"><b class="num">${tg.p}</b><span>protein</span></div><div style="--c:var(--fat)"><b class="num">${tg.f}</b><span>fat</span></div><div style="--c:var(--carb)"><b class="num">${tg.c}</b><span>carbs</span></div></div>`};
  }
  case "review": {
    const tg = goalTargets(a, ex.kcal, kg, null), rk = a.rate / 100 * kg * (a.type === "cut" ? -1 : 1), weeks = rk ? Math.abs((a.targetKg - kg) / rk) : null;
    return {title:"Your plan", body:`
      <div class="obhero"><span>${GOALS[a.type].label}</span><b class="num">${fmtN(tg.kcal)} <em>kcal a day</em></b>
        <div class="obmac"><div style="--c:var(--prot)"><b class="num">${tg.p}g</b><span>protein</span></div><div style="--c:var(--fat)"><b class="num">${tg.f}g</b><span>fat</span></div><div style="--c:var(--carb)"><b class="num">${tg.c}g</b><span>carbs</span></div></div></div>
      ${weeks ? `<div class="obsum"><div><span>Pace</span><b class="num">${rk > 0 ? "+" : ""}${rk.toFixed(2)} kg/wk</b></div><div><span>Goal</span><b class="num">${(+a.targetKg).toFixed(1)} kg</b></div><div><span>ETA</span><b>${new Date(Date.now() + weeks * 7 * 864e5).toLocaleDateString("en-GB", {day:"numeric", month:"short"})}</b></div></div>` : ""}
      <div class="card obwhy"><h2>How it adjusts</h2>
        <div><b>Weekly</b><span>Your expenditure is recalculated from 28 days of intake and the change in your 7-day average weight (7,700 kcal per kg), so targets track your real body, not a formula. ${src("energy")}</span></div>
        <div><b>On pace?</b><span>The Home screen flags when your weekly rate drifts outside ${a.rate ? `${(Math.abs(rk) / kg * 100 - 0.15).toFixed(2)}-${(Math.abs(rk) / kg * 100 + 0.15).toFixed(2)}%` : "maintenance"} a week.</span></div>
        <div><b>Training</b><span>Your phase is set to ${PHASES[GOALS[a.type].phase].label}, which changes how "what to lift next" progresses.</span></div>
      </div>`, cta:"Use these targets"};
  }
  }
}
// Protein presets (g per kg of body weight). Morton 2018: gains plateau ~1.6 g/kg (upper CI ~2.2). Helms 2014: 2.3-3.1 g/kg of lean mass when cutting.
function protOpts(type){ return type === "cut"
  ? [[1.8, "Minimum", "the low end that still protects muscle in a moderate deficit"], [2.2, "Standard", "keeps the most muscle for most people", true], [2.6, "High", "very lean or cutting hard; also keeps you fuller"]]
  : [[1.6, "Minimum", "where extra growth levels off on average"], [2.0, "Standard", "a safety margin above that for most lifters", true], [2.4, "High", "if you like eating more protein; no extra growth expected"]]; }
// a cut can't target a heavier weight and a bulk can't target a lighter one
function targetBounds(type, kg){ return type === "bulk" ? [Math.ceil((kg + 0.5) * 2) / 2, Math.round(kg * 1.3)] : [Math.round(kg * 0.7), Math.floor((kg - 0.5) * 2) / 2]; }
// Projected weight. The x-axis is fixed by the slowest recommended pace, so a faster pace visibly reaches the goal sooner.
function projChart(kg, target, rk, weeks, G){
  if (!isFinite(weeks) || weeks <= 0) return "";
  const slow = Math.abs((target - kg) / (G.rec[0] / 100 * kg)), fast = Math.abs((target - kg) / (G.rec[1] / 100 * kg));
  const span = Math.max(6, Math.min(104, Math.max(slow, weeks) * 1.08));
  const u = units().w, W = 340, H = 168, L0 = u === "st" ? 54 : 44, R0 = 14, T0 = 26, B0 = 26, lo = Math.min(kg, target), hi = Math.max(kg, target), pad = Math.max(0.6, (hi - lo) * 0.18);
  const x = t => L0 + Math.min(t, span) / span * (W - L0 - R0), y = v => T0 + (1 - (v - (lo - pad)) / (hi - lo + 2 * pad)) * (H - T0 - B0);
  const path = wk => `M${x(0)} ${y(kg)} L${x(Math.min(wk, span))} ${y(wk <= span ? target : kg + (target - kg) * span / wk)}${wk < span ? ` L${x(span)} ${y(target)}` : ""}`;
  const eta = new Date(Date.now() + weeks * 7 * 864e5), months = [];
  for (let m = 1; m <= 24; m++){ const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + m); const t = (d - Date.now()) / (7 * 864e5); if (t > span) break; months.push([t, d]); }
  const every = Math.ceil(months.length / 5), lab = v => u === "kg" ? v.toFixed(1) : u === "lb" ? Math.round(v * LB) + " lb" : stLb(v)[0] + "st " + stLb(v)[1];
  const ex = x(Math.min(weeks, span)), right = ex < W - 90;
  return `<div class="obprojw"><svg class="obproj" viewBox="0 0 ${W} ${H}" role="img" aria-label="Projected weight: goal reached around ${eta.toLocaleDateString("en-GB", {day:"numeric", month:"long"})}">
    <defs><linearGradient id="pjg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--orange)" stop-opacity=".22"/><stop offset="1" stop-color="var(--orange)" stop-opacity="0"/></linearGradient></defs>
    ${months.filter((_, i) => i % every === 0).map(([t, d]) => `<line x1="${x(t)}" x2="${x(t)}" y1="${T0 - 6}" y2="${H - B0}" stroke="var(--line)"/><text x="${x(t)}" y="${H - 8}" font-size="10.5" fill="var(--muted)" text-anchor="middle">${d.toLocaleDateString("en-GB", {month:"short"})}</text>`).join("")}
    <line x1="${L0}" x2="${W - R0}" y1="${y(target)}" y2="${y(target)}" stroke="var(--good)" stroke-dasharray="5 4" stroke-width="1.5"/>
    <text x="${L0 - 6}" y="${y(target) + 4}" font-size="11" font-weight="700" fill="var(--good)" text-anchor="end">${lab(target)}</text>
    <text x="${L0 - 6}" y="${y(kg) + 4}" font-size="11" font-weight="700" fill="var(--muted)" text-anchor="end">${lab(kg)}</text>
    <path d="${path(slow)}" fill="none" stroke="var(--muted)" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="2 4"/>
    <path d="${path(fast)}" fill="none" stroke="var(--muted)" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="2 4"/>
    <path d="${path(weeks)} L${x(span)} ${H - B0} L${x(0)} ${H - B0} Z" fill="url(#pjg)"/>
    <path d="${path(weeks)}" fill="none" stroke="var(--orange)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${x(0)}" cy="${y(kg)}" r="5" fill="var(--card)" stroke="var(--orange)" stroke-width="3"/>
    ${weeks <= span ? `<circle cx="${x(weeks)}" cy="${y(target)}" r="6.5" fill="var(--orange)" stroke="var(--card)" stroke-width="2.5"/>
    <text x="${right ? ex + 10 : ex - 10}" y="${y(target) + (target > kg ? 20 : -12)}" font-size="12" font-weight="800" fill="var(--ink)" text-anchor="${right ? "start" : "end"}">${eta.toLocaleDateString("en-GB", {day:"numeric", month:"short"})}</text>` : ""}
  </svg><div class="legend obleg"><span><i style="background:var(--orange)"></i>Your pace</span><span><i style="background:var(--muted);opacity:.4"></i>Recommended range</span><span><i style="background:var(--good)"></i>Goal</span></div></div>`;
}

/* ---------- Render + events ---------- */
function draw(){
  const o = el(), steps = stepsOf(), i = Math.max(0, steps.indexOf(F.step)), s = (F.kind === "prog" ? pStep : F.kind === "welcome" ? wStep : nStep)(F.step, F.ans);
  const blocked = F.kind === "prog" && F.step === "days" && F.ans.days.length < 2;
  const scrollY = o.querySelector(".obbody") ? o.querySelector(".obbody").scrollTop : 0;
  const openD = F.keepScroll ? [...o.querySelectorAll("details[open] summary b")].map(x => x.textContent) : [];
  const ae = document.activeElement, focusKey = ae && o.contains(ae) && (ae.dataset.conv ? `[data-key="${ae.dataset.key}"][data-conv="${ae.dataset.conv}"]` : ae.dataset.input ? `[data-input="${ae.dataset.input}"]` : ae.dataset.dob ? "[data-dob]" : null);
  o.innerHTML = `<div class="obtop"><button class="iconbtn" data-ob="back" aria-label="Back">${ICON.back}</button>
      <div class="obprog"><i style="width:${(i + 1) / steps.length * 100}%"></i></div><button class="iconbtn" data-ob="close" aria-label="Close">✕</button></div>
    <div class="obbody ${s.wide ? "wide" : ""} ${s.cls || ""}">${s.title ? `<h1 class="obtitle">${s.title}</h1>` : ""}${s.body}</div>
    ${s.nofoot ? "" : `<div class="obfoot">${s.alt ? `<button class="btn ghost" data-ob="alt">${s.alt}</button>` : ""}<button class="btn orange" data-ob="next" ${blocked ? "disabled" : ""}>${s.cta || "Continue"}</button></div>`}`;
  o.querySelectorAll("details summary b").forEach(x => { if (openD.includes(x.textContent)) x.closest("details").open = true; });
  if (!F.keepScroll && F.dir){ const bd = o.querySelector(".obbody"); [...bd.children].forEach((c, i) => c.style.setProperty("--i", i)); bd.classList.add(F.dir === "back" ? "ob-back" : "ob-fwd"); F.dir = null; }
  if (F.keepScroll) o.querySelector(".obbody").scrollTop = scrollY; F.keepScroll = false;
  if (focusKey){ const x = o.querySelector(focusKey); if (x){ x.focus({preventScroll:true}); try{ const n = x.value.length; x.setSelectionRange(n, n); }catch(e){} } }
  fillRanges(o); fitCheck();
  if (F.step === "build") runBuild();
}
// No rubber-band scrolling when everything fits on screen
function fitCheck(){ const b = document.querySelector("#ob .obbody"); if (!b) return; requestAnimationFrame(() => b.classList.toggle("fits", b.scrollHeight <= b.clientHeight + 1)); }
function go2(step, dir){ F.dir = dir || "fwd"; F.step = step; saveDraft(); draw(); const b = document.querySelector("#ob .obbody"); if (b) b.scrollTop = 0; }
function next(){
  const steps = stepsOf(), i = steps.indexOf(F.step);
  if (F.kind === "prog" && F.step === "review") return acceptProg();
  if (F.kind === "nut" && F.step === "review") return acceptNut();
  if (F.kind === "welcome" && F.step === "next") return acceptWelcome("home");
  if (F.kind === "welcome" && F.step === "sections" && !F.ans.mods.length){ toast("Pick at least one"); return; }
  if (F.kind === "welcome" && F.step === "about" && !F.ans.sex){ toast("Choose one so the energy maths is right"); return; }
  if (F.kind === "welcome" && F.step === "about" && F.ans.dob && !parseDob(F.ans.dob)){ toast("Enter your date of birth as DD/MM/YYYY, or leave it blank"); return; }
  if (F.kind === "nut" && F.single && F.step === "activity"){ F.accepted = true; S.profile.activity = clone(F.ans.activity); saveProfile(); toast("Activity saved: starting estimate " + fmtN(priorModel(currentKg()).total) + " kcal"); return close(); }
  if (F.kind === "prog" && F.step === "rundays"){ if ((F.ans.runDays || []).length < 2){ toast("Pick at least 2 run days"); return; } if (!F.ans.runDays.includes(F.ans.longDay)) F.ans.longDay = F.ans.runDays[F.ans.runDays.length - 1]; }
  if (F.kind === "prog" && F.step === "kind" && !F.ans.kind){ toast("Pick one"); return; }
  if (F.kind === "prog" && F.step === "split" && !F.ans.split) F.ans.split = (SPLITS[F.ans.days.length] || [])[0]?.id;
  go2(steps[Math.min(steps.length - 1, i + 1)]);
}
function back(){ const steps = stepsOf(), i = steps.indexOf(F.step); if (i <= 0) return close(); go2(steps[F.step === "review" && F.kind === "prog" ? i - 2 : i - 1], "back"); }
function runBuild(){
  const k = F.ans.kind, lines = k === "gym" ? ["Choosing your split", "Placing hard days around your week", ...gymList().map(g => "Picking exercises for " + g.name), "Setting weekly volume per muscle", "Fitting sessions into " + F.ans.mins + " min", "Planning effort and the deload"]
    : ["Mapping the weeks to " + (F.ans.event === "general" ? "your goal" : "race day"), "Splitting base, build, peak" + (F.ans.event === "general" ? "" : " and taper"), "Setting the long-run progression", "Balancing easy and hard runs", ...((F.ans.liftDays || []).length ? ["Writing strength sessions"] : []), ...(EVENTS[F.ans.event].heat ? ["Adding pack and heat training"] : [])];
  const box = document.getElementById("obticks"); let n = 0;
  if (k === "gym"){ if (!F.ans.split || !(SPLITS[F.ans.days.length] || []).some(s => s.id === F.ans.split)) F.ans.split = (SPLITS[F.ans.days.length] || [])[0]?.id; F.out = generate(F.ans, F.seed); }
  else F.out = generateEndu(F.ans, F.seed);
  const t = setInterval(() => {
    if (!box.isConnected){ clearInterval(t); return; }
    box.innerHTML = lines.slice(0, n + 1).map((l, j) => `<div class="${j < n ? "done" : ""}"><i>${j < n ? "✓" : ""}</i>${l}</div>`).join("");
    if (++n > lines.length){ clearInterval(t); F.gym = null; go2("review"); }
  }, 260);
}
function acceptProg(){
  const p = F.out; delete p.vol; const keep = clone(p);
  S.profile = {...S.profile, gyms:gymList().map(g => ({...g, kit:(F.ans.kit || {})[g.id] || g.kit}))}; saveProfile();
  S.prog = keep; if (db) putDocP(keep); else lsSet("prog", keep);
  clearDraft("prog"); S.planView = "week"; close(); go("plan"); toast("Plan saved. Week 1 starts " + fmtD(keep.startDate));
}
function putDocP(p){ try{ queue("programme/current", () => db.doc("programme/current").set(p)); }catch(e){ console.warn(e); } }
function acceptNut(){
  const a = F.ans, kg = currentKg();
  S.profile.goal = Object.assign({}, a, {startKg:r1(kg), startDate:ymd(new Date()), set:Date.now(), rate:+a.rate, prot:+a.prot, targetKg:+a.targetKg});
  F.accepted = true; S.profile.activity = clone(a.activity); delete S.profile.goal.activity;
  S.profile.phase = GOALS[a.type].phase; S.profile.nutrition = Object.assign({}, S.profile.nutrition, {mode:"auto"});
  saveProfile(); clearDraft("nut"); close(); go("food"); toast("Targets set: " + fmtN(targets().kcal) + " kcal");
}
function setPath(obj, path, val){ const ps = path.split("."); let o = obj; while (ps.length > 1){ const k = ps.shift(); o[k] = o[k] || {}; o = o[k]; } o[ps[0]] = val; }
function getPath(obj, path){ return path.split(".").reduce((o, k) => o ? o[k] : undefined, obj); }
function bind(o){
  o.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.ob === "next") return next();
    if (b.dataset.ob === "back") return back();
    if (b.dataset.ob === "close") return close();
    if (b.dataset.ob === "alt"){ F.seed = Math.random().toString(36).slice(2, 7); F.out = generate(F.ans, F.seed); F.keepScroll = true; draw(); toast("New exercise picks"); return; }
    if (b.dataset.src) return window.AJScience && AJScience.open(b.dataset.src);
    if (b.dataset.wnext) return acceptWelcome(b.dataset.wnext);
    if (b.dataset.set){
      if (b.dataset.set === "_gym"){ F.gym = b.dataset.val; F.keepScroll = true; return draw(); }
      let v = b.dataset.val; if (b.dataset.set === "block" || b.dataset.set === "prot") v = +v;
      setPath(F.ans, b.dataset.set, v);
      if (b.dataset.set.startsWith("activity.")) S.profile.activity = clone(F.ans.activity);
      if (b.dataset.set.startsWith("units.")){ S.profile = {...S.profile, units:Object.assign({}, S.profile.units, F.ans.units)}; saveProfile(); }
      if (b.dataset.set === "type"){ const kg = currentKg(); F.ans.rate = GOALS[v].def; F.ans.prot = v === "cut" ? 2.2 : 2.0; F.ans.targetKg = r1(v === "cut" ? kg * 0.94 : v === "bulk" ? kg * 1.05 : kg); }
      saveDraft(); F.keepScroll = true; draw();
      if (b.classList.contains("obopt") && ["goal","level","type","split","kind","event"].includes(b.dataset.set)) setTimeout(() => { if (F) next(); }, 220);
      return;
    }
    if (b.dataset.tog){
      const path = b.dataset.tog, cur = getPath(F.ans, path) || [], v = b.dataset.val;
      let nv = cur.includes(v) ? cur.filter(x => x !== v) : cur.concat(v);
      if (path === "pri" && nv.length > 3) nv = nv.slice(1);
      setPath(F.ans, path, nv);
      if (path === "days"){ F.ans.gymOf = F.ans.gymOf || {}; nv.forEach(k => { if (!gymList().some(g => g.id === F.ans.gymOf[k])) F.ans.gymOf[k] = gymList()[0].id; }); F.ans.split = null; }
      saveDraft(); F.keepScroll = true; draw(); return;
    }
    if (b.dataset.lift){
      const k = b.dataset.lift, a = F.ans;
      if (a.love.includes(k)){ a.love = a.love.filter(x => x !== k); a.ban.push(k); }
      else if (a.ban.includes(k)) a.ban = a.ban.filter(x => x !== k);
      else a.love.push(k);
      saveDraft(); F.keepScroll = true; draw(); return;
    }
    if (b.dataset.setsteps){ F.ans.activity.steps = +b.dataset.setsteps; F.ans.activity.guess = !!b.closest(".obguess"); S.profile.activity = clone(F.ans.activity); saveDraft(); F.keepScroll = true; draw(); return; }
    if (b.dataset.bf){ F.ans.bf = +b.dataset.bf; commitBf(); F.keepScroll = true; draw(); return; }
    if (b.dataset.bump){ const k = b.dataset.bump; let v = r1((+F.ans[k]) + (+b.dataset.d)); if (k === "targetKg"){ const [lo, hi] = targetBounds(F.ans.type, currentKg()); v = Math.min(hi, Math.max(lo, v)); } F.ans[k] = v; saveDraft(); F.keepScroll = true; draw(); return; }
  });
  o.addEventListener("input", e => {
    const t = e.target;
    if (t.dataset.range){ setPath(F.ans, t.dataset.range, +t.value); if (t.dataset.range.startsWith("activity.")) S.profile.activity = clone(F.ans.activity); saveDraft(); liveRange(t); }
    if (t.dataset.input){ F.ans[t.dataset.input] = t.value; saveDraft(); }
    if (t.dataset.dob){ const v = fmtDob(t.value); if (v !== t.value) t.value = v; F.ans.dob = v; saveDraft(); liveRange(t); }
    if (t.dataset.conv){ const v = readConv(t.closest(".obunitrow"), t.dataset.key); if (v != null){ setConv(t.dataset.key, v, false); liveRange(t); } }
  });
  o.addEventListener("change", e => { const t = e.target;
    if (t.dataset.range){ if (t.dataset.range === "kgNow") commitKg(); F.keepScroll = true; draw(); }
    // no full redraw here: a redraw on blur would swallow the tap that caused the blur
    if (t.dataset.conv){ const v = readConv(t.closest(".obunitrow"), t.dataset.key); if (v == null) toast("That's outside the range this app supports"); else { setConv(t.dataset.key, v, true); liveRange(t); } }
  });
  // stop iOS bouncing the whole sheet when nothing needs scrolling
  o.addEventListener("touchmove", e => { const b = o.querySelector(".obbody"); if (e.target.closest && e.target.closest("input[type=range]")) return; if (b && b.classList.contains("fits")) e.preventDefault(); }, {passive:false});
}
function setConv(key, v, final){
  const r = key === "bf" ? Math.round(v) : key === "activity.steps" || key === "activity.commute" ? Math.round(v) : key === "heightCm" ? Math.round(v * 10) / 10 : Math.round(v * 10) / 10;
  setPath(F.ans, key, r);
  if (key.startsWith("activity.")) S.profile.activity = clone(F.ans.activity);
  if (final && key === "kgNow") commitKg();
  if (final && key === "bf") commitBf();
  saveDraft();
}
function commitKg(){ const v = +F.ans.kgNow; if (!(v >= 30 && v <= 250)) return; try{ logWeight(v, ymd(new Date())); toast("Saved as today's weigh-in"); }catch(e){} }
function commitBf(){ const v = +F.ans.bf; if (!(v >= 3 && v <= 60)) return; S.profile = {...S.profile, bfManual:v}; saveProfile(); }
// Live update while dragging or typing: rebuild the step off-screen and swap only what changed, never the control under the finger.
// outerHTML without the styles added after render (animation index, slider fill), so unchanged blocks compare equal
function norm(el){
  if (!el.querySelector("[style]") && !el.hasAttribute("style")) return el.outerHTML;
  const c = el.cloneNode(true);
  [c, ...c.querySelectorAll("[style]")].forEach(x => { if (!x.style || !/--[ip]\s*:/.test(x.getAttribute("style") || "")) return; x.style.removeProperty("--i"); x.style.removeProperty("--p"); if (!x.getAttribute("style") || !x.getAttribute("style").trim()) x.removeAttribute("style"); });
  return c.outerHTML;
}
function patchTree(oldEl, newEl, t){
  const o = [...oldEl.children], n = [...newEl.children];
  if (o.length !== n.length) return false;
  for (let i = 0; i < o.length; i++){
    if (o[i] === t) continue;
    if (o[i].contains(t)){ if (!patchTree(o[i], n[i], t)) return false; }
    else if (norm(o[i]) !== n[i].outerHTML){ const keepOpen = o[i].tagName === "DETAILS" && o[i].open; o[i].replaceWith(n[i]); if (keepOpen) n[i].open = true; }
  }
  return true;
}
function liveRange(t){
  const st = (F.kind === "prog" ? pStep : F.kind === "welcome" ? wStep : nStep)(F.step, F.ans), body = document.querySelector("#ob .obbody");
  const tmp = document.createElement("div"); tmp.innerHTML = (st.title ? `<h1 class="obtitle">${st.title}</h1>` : "") + st.body;
  if (!patchTree(body, tmp, t)){ F.keepScroll = true; return draw(); }
  fillRanges(body); if (t.type === "range") t.style.setProperty("--p", pctOf(t) + "%");
}
window.AJOnboard = {
  welcome(fresh){
    const d = !fresh && loadDraft("welcome");
    F = {kind:"welcome", step:d ? d.step : "hello", ans:d ? Object.assign(welcomeDefaults(), d.ans) : welcomeDefaults(), dir:"fwd"};
    document.body.style.overflow = "hidden"; draw();
  },
  programme(fresh){
    const d = !fresh && loadDraft("prog");
    F = {kind:"prog", step:d ? d.step : "intro", ans:d ? Object.assign(progDefaults(), d.ans) : progDefaults(), seed:""};
    if (F.step === "build" || F.step === "review") F.step = "block";
    F.dir = "fwd"; document.body.style.overflow = "hidden"; draw();
  },
  nutrition(fresh, step){
    const d = !fresh && !step && loadDraft("nut");
    F = {kind:"nut", step:step || (d ? d.step : "intro"), ans:d ? Object.assign(nutDefaults(), d.ans) : nutDefaults(), dir:"fwd", prevAct:S.profile.activity ? clone(S.profile.activity) : undefined};
    if (!F.ans.activity) F.ans.activity = actDefaults();
    F.single = step === "activity";
    S.profile.activity = clone(F.ans.activity);
    document.body.style.overflow = "hidden"; draw();
  },
  lib:L, MUS, generate, generateEndu, enduPlan, EVENTS, RUNTYPE, KIT_DEFAULT, targetsFor, EQUIP
};
})();
