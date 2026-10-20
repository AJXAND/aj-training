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
  arms:{label:"Arms & delts", slots:["lat","curl","triext","rear","curl","pushdown","lat"]}
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
  const kit = (ans.kit && ans.kit[gym]) || KIT_DEFAULT[gym], used = new Set(), tg = targetsFor(ans), pri = new Set(ans.pri || []);
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
  const fill = () => { for (let guard = 0; guard < 300; guard++){
    const v = vol();
    const need = Object.keys(tg).filter(m => (v[m] || 0) < tg[m] - 0.25).sort((a, b) => ((v[a] || 0) / tg[a]) - ((v[b] || 0) / tg[b]) || (pri.has(b) - pri.has(a)));
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
  fill();
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
  const home = buildVariant(seq, "home", ans, seed), shwc = buildVariant(seq, "shwc", ans, seed);
  const exercises = {};
  const strengthFirst = ans.goal === "strength";
  const toList = (v, i) => v.days[i].list.map((x, j) => {
    const e = x.ex, def = {n:e.n, lo:e.lo, hi:e.hi, rest:e.rest, eq:e.eq, m:MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)], note:e.note || undefined, len:e.len};
    let key = e.k;
    if (strengthFirst && j === 0 && e.c && e.eq === "bb"){ key = e.k + "-hvy"; Object.assign(def, {n:e.n + " (heavy)", lo:4, hi:6, rest:210}); }
    exercises[key] = Object.fromEntries(Object.entries(def).filter(([, v]) => v !== undefined));
    return [key, x.sets];
  });
  const sportSet = new Set(ans.sport || []);
  const days = WD.map(([k, wd, short]) => {
    const i = placed.findIndex(p => p.wd === wd);
    if (i < 0) return {k, wd, label:"Rest", focus:sportSet.has(k) ? "Tennis, padel or harder cardio" : "Recovery, walk or easy cardio", rest:true, cardio:sportSet.has(k) ? "Sport day: tennis, padel or harder cardio" : "Walk or easy cardio"};
    const tk = placed[i].tk, hl = toList(home, i), sl = toList(shwc, i);
    const next = WD.find(x => x[1] === (wd + 1) % 7)[0];
    return {k, wd, label:T[tk].label, tpl:tk, focus:focusOf(shwc.days[i].list), gym:(ans.gymOf || {})[k] || "home",
      cardio:sportSet.has(next) && LOWER.has(tk) ? "Easy cardio only: sport tomorrow" : LOWER.has(tk) ? "No hard cardio" : "Easy cardio only",
      variants:{home:hl, shwc:sl}};
  });
  const weeks = +ans.block || 6;
  return {schema:2, name:(ans.name || "Hypertrophy block"), placeholder:false, startDate:ans.start, deloadEvery:weeks, rir:rirPlan(weeks),
    split:split.id, splitName:split.name, setup:ans, built:Date.now(), targets:home.tg, vol:{home:home.vol, shwc:shwc.vol}, mins:{home:home.mins, shwc:shwc.mins}, exercises, days};
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
  if (F && F.kind === "nut" && !F.accepted) S.profile.activity = F.prevAct; F = null; render(); if (o){ o.classList.add("out"); setTimeout(() => o.remove(), 240); } }
function nextMonday(){ const d = new Date(); d.setHours(12); const add = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + (d.getDay() === 1 ? 0 : add)); return ymd(d); }

function progDefaults(){
  const p = S.prog || {}, prev = p.setup;
  if (prev) return clone(prev);
  // seed from the current week: training days, which gym each is at, and the lifts you already do
  const days = (p.days || []).filter(d => !d.rest && !d.optional).map(d => d.k);
  const gymOf = {}; (p.days || []).forEach(d => { if (!d.rest) gymOf[d.k] = d.gym || "home"; });
  const love = []; (p.days || []).forEach(d => { if (d.rest) return; Object.values(d.variants || {}).forEach(v => v.forEach(([k]) => { if (L[k] && !love.includes(k) && ["incbench","incfly","cablat","ohext","bayes","sulek","revfly","legext","hack","standcalf"].includes(k)) love.push(k); })); });
  return {goal:"size", level:"inter", days:days.length ? days : ["mon","tue","wed","thu","fri"], mins:75, gymOf, kit:clone(KIT_DEFAULT), sport:["sat"],
    split:null, pri:["chest","sdelt","triceps"], inj:[], love, ban:[], block:6, start:nextMonday(), phase:S.profile.phase || "bulk", name:"Hypertrophy block 1"};
}
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
  return {type, startKg:r1(kg), targetKg:r1(type === "cut" ? kg * 0.94 : kg * 1.05), rate:GOALS[type].def, prot:type === "cut" ? 2.3 : 2.0, fat:"balanced", dist:"even", activity:actDefaults()};
}

/* ---------- Programme steps ---------- */
const PSTEPS = ["intro","goal","level","days","gyms","sport","split","pri","inj","lifts","block","build","review"];
const NSTEPS = ["intro","goal","activity","stats","target","rate","macros","review"];
function stepsOf(){ return F.kind === "prog" ? PSTEPS : NSTEPS.filter(s => !(s === "target" || s === "rate") || (F.ans.type === "bulk" || F.ans.type === "cut")); }
function src(id, txt){ return `<button class="obsrc" data-src="${id}">${txt || "Evidence"}</button>`; }
function opt(name, val, title, sub, cur){ return `<button class="obopt" data-set="${name}" data-val="${val}" aria-pressed="${cur === val}"><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</button>`; }
function chip(name, val, label, on){ return `<button class="chip" data-tog="${name}" data-val="${val}" aria-pressed="${!!on}">${label}</button>`; }

function pStep(s, a){
  switch (s){
  case "intro": return {title:"Build your programme", body:`
    <p class="oblead">Answer a few questions and I'll build a full training block: the split, every exercise for <b>both gyms</b>, sets, rep ranges, rest times and how hard to push each week.</p>
    <div class="obpoints">
      <div><i>1</i><span><b>Built from the research</b><em>Weekly volume, frequency, effort, rest and exercise choice follow the current meta-analyses. Tap <u>Evidence</u> anywhere to see the study.</em></span></div>
      <div><i>2</i><span><b>Home and SHWC, every day</b><em>Each session is written twice, matched to the kit at each gym.</em></span></div>
      <div><i>3</i><span><b>Planned around your sport</b><em>Leg days stay away from the day before tennis or padel.</em></span></div>
      <div><i>4</i><span><b>Your history carries over</b><em>Lifts you already do keep their logs, so "what to lift next" keeps working.</em></span></div>
    </div>`, cta:"Start"};
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
  case "gyms": return {title:"Where's each session?", body:`
    <p class="obnote" style="margin-top:0">Set the usual gym for each day. Both versions are written anyway, so you can switch on the day.</p>
    <div class="obgym">${WD.filter(([k]) => a.days.includes(k)).map(([k,, sh]) => `<div class="spread"><b>${sh}</b>${seg2("gymOf." + k, [["home","Home"],["shwc","SHWC"]], (a.gymOf || {})[k] || "home")}</div>`).join("")}</div>
    <h3 class="obh">Equipment</h3>
    ${["home","shwc"].map(g => `<details class="obkit"><summary><b>${g === "home" ? "Home gym" : "Soho House White City"}</b><span class="muted small">${(a.kit[g] || []).length} items · tap to edit</span></summary>
      <div class="chips">${EQUIP.map(([k, n]) => chip("kit." + g, k, n, (a.kit[g] || []).includes(k))).join("")}</div></details>`).join("")}
    <p class="obnote">I filled these in from what you told me before. Untick anything that isn't there and tick anything I missed; exercises are only picked if the kit exists.</p>`};
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
  case "build": return {title:"", body:`<div class="obbuild"><div class="obspin">${LOGO(72)}</div><h2>Building your block</h2><div class="obticks" id="obticks"></div></div>`, nofoot:true};
  case "review": return review(a);
  }
}
function seg2(name, opts, cur){ return `<div class="seg obseg" style="grid-template-columns:repeat(${opts.length},1fr)">${opts.map(([k, v]) => `<button data-set="${name}" data-val="${k}" aria-pressed="${k === cur}">${v}</button>`).join("")}</div>`; }

function volChart(prog, gym){
  const v = prog.vol[gym], tg = prog.targets, pri = new Set(prog.setup.pri || []);
  const rows = Object.keys(MUS).filter(m => (tg[m] || 0) > 0 || (v[m] || 0) > 0);
  const mx = Math.max(22, ...rows.map(m => Math.max(v[m] || 0, tg[m] || 0)));
  return `<div class="obvol">${rows.map(m => `<div class="obvr"><span>${MUS[m]}${pri.has(m) ? ' <i class="obpri">★</i>' : ""}</span><span class="obtrack"><b style="width:${Math.min(100, (v[m] || 0) / mx * 100)}%" class="${(v[m] || 0) >= (tg[m] || 0) - 1 ? "ok" : ""}"></b><i style="left:${(tg[m] || 0) / mx * 100}%"></i></span><span class="num small">${r1(v[m] || 0)}</span></div>`).join("")}
    <div class="obvl"><span></span><span class="small muted">Sets a week (direct + half for indirect). Tick = target.</span><span></span></div></div>`;
}
function review(a){
  const prog = F.out, g = F.gym || "shwc";
  const train = prog.days.filter(d => !d.rest);
  return {title:"Your block", wide:true, body:`
    <div class="obsum"><div class="full"><span>Split</span><b>${esc(prog.splitName)}</b></div><div><span>Block</span><b>${prog.deloadEvery} weeks</b></div><div><span>Starts</span><b>${fmtD(prog.startDate)}</b></div><div><span>Days</span><b>${prog.days.filter(d => !d.rest).length} a week</b></div></div>
    <div class="obweek">${prog.days.map(d => `<div class="${d.rest ? "rest" : ""}"><span>${WD.find(x => x[0] === d.k)[2]}</span><b>${d.rest ? "–" : esc(d.label.replace("Upper ","U").replace("Lower ","L").replace("Full body ","FB").replace("Arms & delts","Arms"))}</b><em>${d.rest ? "" : d.gym === "shwc" ? "SHWC" : "Home"}</em></div>`).join("")}</div>
    <div class="card"><div class="spread"><h2>Weekly sets</h2>${seg2("_gym", [["shwc","SHWC"],["home","Home"]], g)}</div>${volChart(prog, g)}
      <p class="small muted">Shown for a week done entirely at ${g === "shwc" ? "SHWC" : "home"}. ${src("volume")}</p></div>
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

/* ---------- Nutrition steps ---------- */
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
    const A = a.activity, pm = priorModel(kg), logged = loggedSteps();
    return {title:"How active are you?", body:`
      <p class="obnote" style="margin-top:0">This sets your starting estimate. After that, your food logs and weigh-ins take over and correct it every day.</p>
      <h3 class="obh" style="margin-top:4px">Outside training, your day is mostly…</h3>
      <div class="obopts">${Object.entries(JOB).map(([k, v]) => `<button class="obopt" data-set="activity.job" data-val="${k}" aria-pressed="${A.job === k}"><b>${v[0]}</b></button>`).join("")}</div>
      <h3 class="obh">Typical steps a day</h3>
      <div class="spread"><b class="num">${fmtN(A.steps)} steps</b><span class="muted small">${logged ? `your logged average: ${fmtN(logged.avg)} (${logged.n} days)` : "used on days you don't log steps"}</span></div>
      <div class="obslider"><input type="range" min="2000" max="25000" step="500" value="${A.steps}" data-range="activity.steps"></div>
      <h3 class="obh">Cycling commute</h3>
      <div class="spread"><b class="num">${A.commute} min a week</b><span class="muted small">${A.commute ? "so don't also log it as cardio" : "0 if you don't"}</span></div>
      <div class="obslider"><input type="range" min="0" max="600" step="10" value="${A.commute}" data-range="activity.commute"></div>
      <div class="card"><div class="spread"><h3>Starting estimate</h3><b class="num">${fmtN(pm.total)} kcal</b></div>
        <span class="small muted">Lifting comes from your programme (${(S.prog.days || []).filter(d => !d.rest && !d.optional).length} sessions a week) and cardio from what you log, so you don't need to count them here.</span></div>`, cta:F.single ? "Save" : undefined};
  }
  case "stats": return {title:"Check your numbers", body:`
    <div class="obsum"><div><span>Weight (7-day avg)</span><b>${kg.toFixed(1)} kg</b></div><div><span>Body fat</span><b>${Math.round(currentBf().v)}%</b></div><div><span>Height</span><b>${S.profile.heightCm} cm</b></div></div>
    <div class="card"><div class="spread"><h3>Expenditure</h3><b class="num">${fmtN(ex.kcal)} kcal</b></div>
      <span class="small muted">${ex.adaptive ? `Measured from ${ex.n} days of food and weight logs, blended with the starting estimate.` : `Starting estimate from your activity answers. Formulas can be off by a few hundred calories, so from 5 fully logged days it starts measuring your real burn, and leans on your data more each day.`} ${src("energy")}</span></div>
    <p class="obnote">Wrong weight or body fat? Log a weigh-in or update body fat in Settings, then come back.</p>`};
  case "target": {
    const step = 0.5, lo = a.type === "bulk" ? Math.ceil(kg) : Math.round(kg * 0.8), hi = a.type === "bulk" ? Math.round(kg * 1.25) : Math.floor(kg);
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
      ${projChart(kg, +a.targetKg, rk, weeks)}
      <div class="obsum"><div><span>Daily calories</span><b class="num">${fmtN(tg.kcal)}</b></div><div><span>${a.type === "bulk" ? "Surplus" : "Deficit"}</span><b class="num">${fmtN(Math.abs(tg.kcal - ex.kcal))}</b></div><div><span>Reach goal</span><b>${isFinite(weeks) && weeks < 300 ? eta.toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"}) : "–"}</b></div></div>
      <p class="obnote">${a.type === "bulk" ? "For trained lifters, about 0.25-0.5% of body weight a week (a 5-10% surplus) builds muscle with little extra fat; bigger surpluses mostly add fat." : "About 0.5-1% of body weight a week. Slower (~0.7%) kept more muscle than faster loss in elite athletes."} ${src(G.src)}</p>`};
  }
  case "macros": {
    const tg = goalTargets(a, ex.kcal, kg, null), pr = a.type === "cut" ? [1.8, 2.7] : [1.6, 2.4];
    return {title:"Protein and macros", body:`
      <h3 class="obh" style="margin-top:0">Protein</h3>
      <div class="obrate"><b class="num">${Math.round(kg * a.prot)} <span>g a day</span></b><span class="num muted">${(+a.prot).toFixed(1)} g per kg</span></div>
      <div class="obslider"><input type="range" min="${pr[0]}" max="${pr[1]}" step="0.1" value="${a.prot}" data-range="prot"></div>
      <p class="obnote">${a.type === "cut" ? "In a deficit, higher protein (around 2.3-3.1 g per kg of lean mass) helps keep muscle." : "Benefits level off around 1.6 g/kg; up to 2.2 g/kg covers almost everyone."} ${src("protein")}</p>
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
function projChart(kg, target, rk, weeks){
  if (!isFinite(weeks) || weeks <= 0) return "";
  const W = 320, H = 120, L0 = 8, R0 = 8, wk = Math.min(weeks, 104), lo = Math.min(kg, target) - 1, hi = Math.max(kg, target) + 1;
  const x = t => L0 + t / wk * (W - L0 - R0), y = v => H - 18 - (v - lo) / (hi - lo) * (H - 34);
  const pts = []; for (let t = 0; t <= wk; t += wk / 24) pts.push([x(t), y(kg + rk * t)]);
  const end = new Date(Date.now() + wk * 7 * 864e5);
  return `<svg class="obproj" viewBox="0 0 ${W} ${H}" aria-label="Projected weight">
    <line x1="${L0}" x2="${W - R0}" y1="${y(target)}" y2="${y(target)}" stroke="var(--line)" stroke-dasharray="4 4"/>
    <path d="M${pts.map(p => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L")}" fill="none" stroke="var(--orange)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${x(0)}" cy="${y(kg)}" r="4.5" fill="var(--card)" stroke="var(--orange)" stroke-width="2.5"/><circle cx="${x(wk)}" cy="${y(kg + rk * wk)}" r="5" fill="var(--orange)"/>
    <text x="${x(0)}" y="${H - 2}" font-size="11" fill="var(--muted)">Now · ${kg.toFixed(1)}</text>
    <text x="${W - R0}" y="${H - 2}" font-size="11" fill="var(--muted)" text-anchor="end">${end.toLocaleDateString("en-GB", {day:"numeric", month:"short"})} · ${(kg + rk * wk).toFixed(1)} kg</text></svg>`;
}

/* ---------- Render + events ---------- */
function draw(){
  const o = el(), steps = stepsOf(), i = Math.max(0, steps.indexOf(F.step)), s = F.kind === "prog" ? pStep(F.step, F.ans) : nStep(F.step, F.ans);
  const blocked = F.kind === "prog" && F.step === "days" && F.ans.days.length < 2;
  const scrollY = o.querySelector(".obbody") ? o.querySelector(".obbody").scrollTop : 0;
  const openD = F.keepScroll ? [...o.querySelectorAll("details[open] summary b")].map(x => x.textContent) : [];
  o.innerHTML = `<div class="obtop"><button class="iconbtn" data-ob="back" aria-label="Back">${ICON.back}</button>
      <div class="obprog"><i style="width:${(i + 1) / steps.length * 100}%"></i></div><button class="iconbtn" data-ob="close" aria-label="Close">✕</button></div>
    <div class="obbody ${s.wide ? "wide" : ""}">${s.title ? `<h1 class="obtitle">${s.title}</h1>` : ""}${s.body}</div>
    ${s.nofoot ? "" : `<div class="obfoot">${s.alt ? `<button class="btn ghost" data-ob="alt">${s.alt}</button>` : ""}<button class="btn orange" data-ob="next" ${blocked ? "disabled" : ""}>${s.cta || "Continue"}</button></div>`}`;
  o.querySelectorAll("details summary b").forEach(x => { if (openD.includes(x.textContent)) x.closest("details").open = true; });
  if (!F.keepScroll && F.dir){ const bd = o.querySelector(".obbody"); [...bd.children].forEach((c, i) => c.style.setProperty("--i", i)); bd.classList.add(F.dir === "back" ? "ob-back" : "ob-fwd"); F.dir = null; }
  if (F.keepScroll) o.querySelector(".obbody").scrollTop = scrollY; F.keepScroll = false;
  if (F.step === "build") runBuild();
}
function go2(step, dir){ F.dir = dir || "fwd"; F.step = step; saveDraft(); draw(); const b = document.querySelector("#ob .obbody"); if (b) b.scrollTop = 0; }
function next(){
  const steps = stepsOf(), i = steps.indexOf(F.step);
  if (F.kind === "prog" && F.step === "review") return acceptProg();
  if (F.kind === "nut" && F.step === "review") return acceptNut();
  if (F.kind === "nut" && F.single && F.step === "activity"){ F.accepted = true; S.profile.activity = clone(F.ans.activity); saveProfile(); toast("Activity saved: starting estimate " + fmtN(priorModel(currentKg()).total) + " kcal"); return close(); }
  if (F.kind === "prog" && F.step === "split" && !F.ans.split) F.ans.split = (SPLITS[F.ans.days.length] || [])[0]?.id;
  go2(steps[Math.min(steps.length - 1, i + 1)]);
}
function back(){ const steps = stepsOf(), i = steps.indexOf(F.step); if (i <= 0) return close(); go2(steps[F.step === "review" && F.kind === "prog" ? i - 2 : i - 1], "back"); }
function runBuild(){
  const lines = ["Choosing your split", "Placing leg days around your sport", "Picking exercises for home", "Picking exercises for SHWC", "Setting weekly volume per muscle", "Fitting sessions into " + F.ans.mins + " min", "Planning effort and the deload"];
  const box = document.getElementById("obticks"); let n = 0;
  if (!F.ans.split || !(SPLITS[F.ans.days.length] || []).some(s => s.id === F.ans.split)) F.ans.split = (SPLITS[F.ans.days.length] || [])[0]?.id;
  F.out = generate(F.ans, F.seed);
  const t = setInterval(() => {
    if (!box.isConnected){ clearInterval(t); return; }
    box.innerHTML = lines.slice(0, n + 1).map((l, j) => `<div class="${j < n ? "done" : ""}"><i>${j < n ? "✓" : ""}</i>${l}</div>`).join("");
    if (++n > lines.length){ clearInterval(t); F.gym = "shwc"; go2("review"); }
  }, 260);
}
function acceptProg(){
  const p = F.out; delete p.vol; const keep = clone(p);
  S.prog = keep; if (db) putDocP(keep); else lsSet("prog", keep);
  clearDraft("prog"); S.planView = "week"; close(); go("plan"); toast("Programme saved. Week 1 starts " + fmtD(keep.startDate));
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
    if (b.dataset.set){
      if (b.dataset.set === "_gym"){ F.gym = b.dataset.val; F.keepScroll = true; return draw(); }
      let v = b.dataset.val; if (b.dataset.set === "block") v = +v;
      setPath(F.ans, b.dataset.set, v);
      if (b.dataset.set.startsWith("activity.")) S.profile.activity = clone(F.ans.activity);
      if (b.dataset.set === "type"){ const kg = currentKg(); F.ans.rate = GOALS[v].def; F.ans.prot = v === "cut" ? 2.3 : 2.0; F.ans.targetKg = r1(v === "cut" ? kg * 0.94 : v === "bulk" ? kg * 1.05 : kg); }
      saveDraft(); F.keepScroll = true; draw();
      if (b.classList.contains("obopt") && ["goal","level","type","split"].includes(b.dataset.set)) setTimeout(() => { if (F) next(); }, 220);
      return;
    }
    if (b.dataset.tog){
      const path = b.dataset.tog, cur = getPath(F.ans, path) || [], v = b.dataset.val;
      let nv = cur.includes(v) ? cur.filter(x => x !== v) : cur.concat(v);
      if (path === "pri" && nv.length > 3) nv = nv.slice(1);
      setPath(F.ans, path, nv);
      if (path === "days"){ F.ans.gymOf = F.ans.gymOf || {}; nv.forEach(k => { if (!F.ans.gymOf[k]) F.ans.gymOf[k] = "home"; }); F.ans.split = null; }
      saveDraft(); F.keepScroll = true; draw(); return;
    }
    if (b.dataset.lift){
      const k = b.dataset.lift, a = F.ans;
      if (a.love.includes(k)){ a.love = a.love.filter(x => x !== k); a.ban.push(k); }
      else if (a.ban.includes(k)) a.ban = a.ban.filter(x => x !== k);
      else a.love.push(k);
      saveDraft(); F.keepScroll = true; draw(); return;
    }
    if (b.dataset.bump){ const k = b.dataset.bump; F.ans[k] = r1((+F.ans[k]) + (+b.dataset.d)); saveDraft(); F.keepScroll = true; draw(); return; }
  });
  o.addEventListener("input", e => {
    const t = e.target;
    if (t.dataset.range){ setPath(F.ans, t.dataset.range, +t.value); if (t.dataset.range.startsWith("activity.")) S.profile.activity = clone(F.ans.activity); saveDraft(); liveRange(t); }
    if (t.dataset.input){ F.ans[t.dataset.input] = t.value; saveDraft(); }
  });
  o.addEventListener("change", e => { if (e.target.dataset.range){ F.keepScroll = true; draw(); } });
}
// Live update while dragging: rebuild the step off-screen and swap only the blocks that changed, never the slider under the finger.
function liveRange(t){
  const st = F.kind === "prog" ? pStep(F.step, F.ans) : nStep(F.step, F.ans), body = document.querySelector("#ob .obbody");
  const tmp = document.createElement("div"); tmp.innerHTML = (st.title ? `<h1 class="obtitle">${st.title}</h1>` : "") + st.body;
  const olds = [...body.children], news = [...tmp.children];
  if (olds.length !== news.length){ F.keepScroll = true; return draw(); }
  olds.forEach((c, i) => { if (c.contains(t)) return; if (c.outerHTML !== news[i].outerHTML) c.replaceWith(news[i]); });
}
window.AJOnboard = {
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
  lib:L, MUS, generate, KIT_DEFAULT, targetsFor
};
})();
