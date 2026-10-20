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
const EQG = [
  ["Free weights", [["bb","Barbell + plates"],["rack","Squat rack"],["bench","Adjustable bench"],["db","Dumbbells"],["kb","Kettlebells"],["ez","EZ bar"],["trapbar","Trap bar"],["landmine","Landmine"]]],
  ["Bodyweight", [["pullup","Pull-up bar"],["dip","Dip bars"],["rings","Rings / TRX"],["anchor","Somewhere to anchor feet"],["bands","Resistance bands"],["box","Plyo box"]]],
  ["Cables", [["cable_hi","High pulley"],["cable_mid","Waist-height pulley"],["cable_low","Low pulley"],["cable_dual","Two cable stacks"]]],
  ["Machines", [["smith","Smith machine"],["hack","Hack squat"],["pendulum","Pendulum squat"],["legpress","Leg press"],["legext","Leg extension"],["lyingcurl","Lying leg curl"],["seatedcurl","Seated leg curl"],["hipext","45° hip extension"],["glutedrive","Hip thrust machine"],["adductor","Adductor"],["abductor","Abductor"],["calfm","Standing calf"],["seatedcalf","Seated calf"],["pecdeck","Pec deck / rear delt"],["chestpress","Chest press"],["shoulderpress","Shoulder press"],["rowm","Chest-supported row"],["tbar","T-bar row"],["latpd","Lat pulldown"],["preacher","Preacher bench"]]],
  ["Conditioning", [["rower","Rowing machine"],["skierg","SkiErg"],["airbike","Bike / assault bike"],["treadmill","Treadmill"],["sled","Sled"],["wallball","Wall ball"],["sandbag","Sandbag"]]]
];
const EQUIP = EQG.flatMap(g => g[1]);
const ALLKIT = EQUIP.map(e => e[0]);
const PRESETS = {
  home:["Home", "A few dumbbells, a bench, bands", ["db","bench","bands","anchor"]],
  garage:["Garage gym", "Barbell, rack, plates, pull-up bar", ["bb","rack","bench","db","kb","ez","landmine","pullup","dip","anchor","bands","box"]],
  hotel:["Hotel or small gym", "Dumbbells, a cable, cardio kit", ["db","bench","cable_hi","cable_mid","cable_low","treadmill","airbike","rower","bands"]],
  commercial:["Commercial gym", "The usual big-chain gym", ["bb","rack","bench","db","kb","ez","pullup","dip","anchor","bands","box","cable_hi","cable_mid","cable_low","cable_dual","smith","legpress","legext","lyingcurl","seatedcurl","hipext","adductor","abductor","calfm","pecdeck","chestpress","shoulderpress","rowm","latpd","preacher","rower","airbike","treadmill"]],
  bodybuilding:["Bodybuilding gym", "Everything, plus specialist machines", ALLKIT.filter(k => !["sandbag","wallball","sled","skierg","rings"].includes(k))],
  box:["CrossFit or HYROX box", "Barbells, rigs, rowers, sleds", ["bb","rack","bench","db","kb","pullup","dip","rings","anchor","bands","box","rower","skierg","airbike","sled","wallball","sandbag","treadmill"]]
};
const KIT_DEFAULT = {home:PRESETS.garage[2].slice(), shwc:PRESETS.commercial[2].concat(["hack"])};

/* ---------- Exercise library ----------
   Keys match the old programme where it's the same lift, so your history carries over.
   p = movement pattern, mu = muscles (1 direct, 0.5 indirect), q = equipment needed, c = compound,
   len = bias toward the lengthened position (0-2; Maeo 2021/2023, Pedrosa 2022, Kassiano 2023), inj = joints it loads hardest. */
const L = {};
function X(k, n, p, mu, q, o){ L[k] = Object.assign({k, n, p, mu, q, c:false, len:1, lo:10, hi:15, rest:90, inj:[], eq:"other"}, o||{}); }
// Rest defaults (Schoenfeld 2016; Senna 2011; Singer 2024): big free-weight lifts 2.5 min, other compounds 2 min, isolation 90 s, abs 60 s.
function restFor(e){ if (["cond","sled","carry","erg"].includes(e.p)) return e.rest; if (e.p === "abs") return 60; if (!e.c) return 90; return e.eq === "bb" ? 150 : 120; }
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
// added library: more choice per movement, home-friendly options, and conditioning work for HYROX and CrossFit-style plans
X("bench","Barbell bench press","fpress",{chest:1,fdelt:.5,triceps:.5},["bb","rack","bench"],{c:true,lo:5,hi:8,rest:180,eq:"bb",inj:["shoulder"],note:"Safety arms set"});
X("pushup","Push-up","fpress",{chest:1,triceps:.5,fdelt:.5},[],{c:true,len:1,lo:8,hi:15,rest:90,eq:"bw"});
X("dbfly","Flat DB fly","fly",{chest:1},["db","bench"],{len:2,eq:"db"});
X("cabpress","Cable chest press","fpress",{chest:1,triceps:.5,fdelt:.5},["cable_dual"],{c:true,lo:8,hi:12,rest:120,eq:"cable"});
X("chinup","Chin-up","vpull",{lats:1,biceps:.5,upback:.5},["pullup"],{c:true,len:2,lo:6,hi:12,rest:150,eq:"bw"});
X("ngpd","Neutral-grip pulldown","vpull",{lats:1,upback:.5,biceps:.5},["latpd"],{c:true,len:2,lo:8,hi:12,rest:120,eq:"machine"});
X("tbarrow","T-bar row","row",{upback:1,lats:.5,rdelt:.5,biceps:.5},["tbar"],{c:true,lo:8,hi:12,rest:120,eq:"machine"});
X("meadows","Meadows row","row",{lats:1,upback:.5,biceps:.5},["landmine","bb"],{c:true,len:2,lo:8,hi:12,rest:90,eq:"bb"});
X("invrow","Inverted row","row",{upback:1,lats:.5,biceps:.5},["rings"],{c:true,lo:8,hi:15,rest:90,eq:"bw"});
X("bandrow","Band row","row",{upback:1,lats:.5,biceps:.5},["bands"],{c:true,lo:12,hi:20,rest:75,eq:"other"});
X("bbohp","Standing overhead press","ohp",{fdelt:1,sdelt:.5,triceps:.5},["bb","rack"],{c:true,lo:5,hi:8,rest:150,eq:"bb",inj:["shoulder","lowback"]});
X("mshoulder","Machine shoulder press","ohp",{fdelt:1,sdelt:.5,triceps:.5},["shoulderpress"],{c:true,lo:8,hi:12,rest:120,eq:"machine"});
X("arnold","Arnold press","ohp",{fdelt:1,sdelt:.5,triceps:.5},["db"],{c:true,lo:8,hi:12,rest:120,eq:"db",inj:["shoulder"]});
X("cabupright","Cable upright row","lat",{sdelt:1,upback:.5},["cable_low"],{len:1,eq:"cable",inj:["shoulder"]});
X("bandlat","Band lateral raise","lat",{sdelt:1},["bands"],{len:1,lo:12,hi:20,eq:"other"});
X("ezcurl","EZ-bar curl","curl",{biceps:1},["ez"],{lo:8,hi:12,eq:"bb"});
X("cabcurl","Cable curl","curl",{biceps:1},["cable_low"],{len:1,eq:"cable"});
X("spider","Spider curl","curl",{biceps:1},["db","bench"],{len:0,eq:"db"});
X("ezskull","EZ-bar skull crusher","triext",{triceps:1},["ez","bench"],{len:2,lo:8,hi:12,eq:"bb",inj:["elbow"]});
X("tridip","Dips, upright","tripress",{triceps:1,chest:.5,fdelt:.5},["dip"],{c:true,lo:8,hi:12,rest:120,eq:"bw",inj:["shoulder"]});
X("kickback","Cable triceps kickback","pushdown",{triceps:1},["cable_mid"],{len:0,eq:"cable"});
X("frontsq","Front squat","squat",{quads:1,glutes:.5,adductors:.5},["bb","rack"],{c:true,len:2,lo:5,hi:8,rest:180,eq:"bb",inj:["knee"],note:"Safety arms set"});
X("goblet","Goblet squat","squat",{quads:1,glutes:.5,adductors:.5},["db"],{c:true,len:2,lo:8,hi:15,rest:120,eq:"db"});
X("pendulum","Pendulum squat","squat",{quads:1,glutes:.5,adductors:.5},["pendulum"],{c:true,len:2,lo:6,hi:10,rest:150,eq:"machine",inj:["knee"]});
X("walklunge","Walking lunge","lunge",{quads:1,glutes:1,adductors:.5},["db"],{c:true,len:2,lo:8,hi:12,rest:120,eq:"db",inj:["knee"]});
X("stepup","DB step-up","lunge",{quads:1,glutes:1},["db","bench"],{c:true,lo:8,hi:12,rest:90,eq:"db"});
X("deadlift","Deadlift","hinge",{hams:.5,glutes:1,upback:.5},["bb"],{c:true,len:1,lo:3,hi:6,rest:210,eq:"bb",inj:["lowback"],note:"Technical failure only"});
X("trapdl","Trap bar deadlift","hinge",{quads:.5,glutes:1,hams:.5},["trapbar"],{c:true,lo:4,hi:8,rest:180,eq:"bb",inj:["lowback"]});
X("goodmorning","Good morning","hinge",{hams:1,glutes:.5},["bb","rack"],{c:true,len:2,lo:6,hi:10,rest:150,eq:"bb",inj:["lowback"]});
X("kbrdl","Kettlebell RDL","hinge",{hams:1,glutes:.5},["kb"],{c:true,len:2,lo:8,hi:15,rest:90,eq:"other",inj:["lowback"]});
X("singlerdl","Single-leg DB RDL","hinge",{hams:1,glutes:1},["db"],{c:true,len:2,lo:8,hi:12,rest:90,eq:"db"});
X("hipthrustm","Hip thrust machine","glute",{glutes:1},["glutedrive"],{c:true,len:0,lo:8,hi:12,rest:120,eq:"machine"});
X("pullthrough","Cable pull-through","glute",{glutes:1,hams:.5},["cable_low"],{len:1,lo:10,hi:15,rest:90,eq:"cable"});
X("abductor","Abductor machine","abd",{glutes:1},["abductor"],{rest:75,eq:"machine"});
X("glutebridge","Glute bridge","glute",{glutes:1},[],{len:0,lo:12,hi:20,rest:60,eq:"bw"});
X("bandabd","Banded side walk","abd",{glutes:1},["bands"],{lo:12,hi:20,rest:60,eq:"other"});
X("seatedcalf","Seated calf raise","calf",{calves:1},["seatedcalf"],{len:2,rest:75,eq:"machine"});
X("lpcalf","Leg press calf raise","calf",{calves:1},["legpress"],{len:2,rest:75,eq:"machine"});
X("abwheel","Ab wheel rollout","abs",{abs:1},[],{lo:6,hi:12,rest:60,eq:"bw",inj:["lowback"]});
X("plank","Plank (timed)","abs",{abs:1},[],{lo:30,hi:60,rest:60,eq:"bw",note:"Reps are seconds"});
X("woodchop","Cable woodchop","abs",{abs:1},["cable_mid"],{rest:60,eq:"cable"});
// conditioning (HYROX, CrossFit-style). mu kept small: these count little toward hypertrophy volume.
X("kbswing","Kettlebell swing","cond",{glutes:.5,hams:.5},["kb"],{lo:12,hi:20,rest:60,eq:"other",inj:["lowback"]});
X("wallballs","Wall balls","cond",{quads:.5,fdelt:.5},["wallball"],{lo:15,hi:25,rest:60,eq:"other"});
X("sledpush","Sled push","sled",{quads:.5,glutes:.5},["sled"],{lo:20,hi:25,rest:120,eq:"other",note:"Reps are metres"});
X("sledpull","Sled pull","sled",{upback:.5,hams:.5},["sled"],{lo:20,hi:25,rest:120,eq:"other",note:"Reps are metres"});
X("farmers","Farmers carry","carry",{upback:.5},["db"],{lo:30,hi:50,rest:90,eq:"db",note:"Reps are metres"});
X("sandlunge","Sandbag lunges","lunge",{quads:1,glutes:1},["sandbag"],{c:true,lo:10,hi:20,rest:90,eq:"other",note:"Reps are metres"});
X("bbj","Burpee broad jumps","cond",{quads:.5},[],{lo:8,hi:15,rest:60,eq:"bw",inj:["knee","shoulder"]});
X("boxjump","Box jump","cond",{quads:.5},["box"],{lo:5,hi:10,rest:60,eq:"bw",inj:["knee"]});
X("rowerg","Row intervals","erg",{upback:.5},["rower"],{lo:250,hi:500,rest:90,eq:"other",note:"Reps are metres"});
X("skiint","SkiErg intervals","erg",{lats:.5,triceps:.5},["skierg"],{lo:250,hi:500,rest:90,eq:"other",note:"Reps are metres"});

for (const e of Object.values(L)) e.rest = restFor(e);

/* ---------- Day templates (slots are movement patterns, in training order) ---------- */
const T = {
  upA:{label:"Upper A", slots:["ipress","vpull","row","lat","triext","curl","rear"]},
  upB:{label:"Upper B", slots:["row","fpress","vpull","fly","lat","pushdown","curl"]},
  loA:{label:"Lower A", slots:["squat","hinge","kneeext","kneeflex","calf","abs"]},
  loB:{label:"Lower B", slots:["glute","lunge","kneeflex","kneeext","add","calf"]},
  push:{label:"Push", slots:["ipress","fpress","fly","lat","triext","pushdown"]},
  pull:{label:"Pull", slots:["vpull","row","latiso","rear","curl","curl"]},
  legs:{label:"Legs", slots:["squat","hinge","kneeext","kneeflex","add","calf"]},
  upper:{label:"Upper", slots:["ipress","row","vpull","lat","rear","pushdown","curl"]},
  lower:{label:"Lower", slots:["kneeflex","squat","kneeext","hinge","glute","calf"]},
  fbA:{label:"Full body A", slots:["squat","ipress","vpull","kneeflex","lat","curl"]},
  fbB:{label:"Full body B", slots:["hinge","row","fpress","kneeext","rear","triext"]},
  fbC:{label:"Full body C", slots:["lunge","ohp","vpull","kneeflex","lat","pushdown","calf"]},
  arms:{label:"Arms & delts", slots:["lat","curl","triext","rear","curl","pushdown","lat"]},
  runA:{label:"Strength A", slots:["squat","hinge","calf","vpull","abs"]},
  runB:{label:"Strength B", slots:["lunge","kneeflex","calf","row","abs"]},
  glutes:{label:"Glutes & legs", slots:["glute","lunge","hinge","abd","kneeext","calf"]},
  cfA:{label:"Strength + conditioning A", slots:["squat","ohp","vpull","cond","erg"]},
  cfB:{label:"Strength + conditioning B", slots:["hinge","fpress","row","cond","carry"]},
  cfC:{label:"Strength + conditioning C", slots:["lunge","ipress","vpull","cond","erg"]},
  hyA:{label:"HYROX strength A", slots:["squat","sled","row","lunge","cond"]},
  hyB:{label:"HYROX strength B", slots:["hinge","vpull","carry","fpress","cond"]}
};
const TEMPLATE_PICK = ["fbA","fbB","fbC","upper","lower","upA","upB","loA","loB","push","pull","legs","arms","glutes"];
const LOWER = new Set(["loA","loB","legs","lower"]);
const SPLITS = {
  1:[{id:"fb1", name:"Full body", days:["fbA"], why:"One session a week still builds muscle and strength in beginners; two or more works better when you can."}],
  2:[{id:"fb2", name:"Full body ×2", days:["fbA","fbB"], why:"Two sessions can only hit each muscle twice if every session is full body."}],
  3:[{id:"fb3", name:"Full body ×3", days:["fbA","fbB","fbC"], why:"Every muscle 2-3× a week with short, varied sessions."},
     {id:"ulf", name:"Upper / Lower / Full", days:["upper","lower","fbA"], why:"Longer focused days, everything still hit twice."},
     {id:"fbg3", name:"Full body ×2 + Glutes & legs", days:["fbA","fbB","glutes"], why:"Everything twice a week with an extra lower-body day for glutes."}],
  4:[{id:"ul4", name:"Upper / Lower ×2", days:["upA","loA","upB","loB"], why:"The classic: each muscle twice a week, alternating stress so joints recover."},
     {id:"ulg4", name:"Upper / Lower / Upper / Glutes & legs", days:["upA","loA","upB","glutes"], why:"Legs twice with a glute-focused second day: suits a lower-body or glute priority."},
     {id:"ppl4", name:"Push / Pull / Legs / Upper", days:["push","pull","legs","upper"], why:"More per-session focus; legs only once, so best if legs aren't a priority."}],
  5:[{id:"pplul", name:"Push / Pull / Legs + Upper / Lower", days:["legs","push","pull","lower","upper"], why:"Your current structure. Everything twice a week with room for extra upper-body volume."},
     {id:"ul5", name:"Upper / Lower ×2 + Arms & delts", days:["upA","loA","upB","loB","arms"], why:"Best when arms and side delts are the priority: a fifth day just for them."},
     {id:"ulg5", name:"Upper / Lower ×2 + Glutes & legs", days:["upA","loA","upB","loB","glutes"], why:"Three lower-body days: best when glutes or legs are the priority."}],
  7:[{id:"ppl7", name:"Push / Pull / Legs ×2 + Arms & delts", days:["push","pull","legs","push","pull","legs","arms"], why:"Seven sessions: the seventh is a lighter arms and delts day. Most people progress as well on 5-6 days with a rest day; keep the 7th easy."}],
  6:[{id:"ppl6", name:"Push / Pull / Legs ×2", days:["push","pull","legs","push","pull","legs"], why:"Highest frequency and volume. Needs good recovery and 6 days."},
     {id:"pplul6", name:"PPL + Upper / Lower + Arms & delts", days:["legs","push","pull","lower","upper","arms"], why:"Your current week plus the priority day as a full session."}]
};
// Which split fits: frequency (each muscle ~2× a week), priorities, experience and session length
function recommendSplit(ans){
  const n = (ans.days || []).length, opts = SPLITS[n] || [], pri = new Set(ans.pri || []);
  const legsPri = ["quads","hams","glutes"].some(m => pri.has(m)), glutePri = pri.has("glutes"), armsPri = ["biceps","triceps","sdelt"].filter(m => pri.has(m)).length >= 1;
  let best = null;
  for (const o of opts){
    let sc = 0, why = [];
    const fb = o.days.every(d => d.startsWith("fb"));
    if (ans.level === "new"){ if (fb){ sc += 3; why.push("full-body sessions let you practise every lift more often while you learn"); } }
    if (legsPri){ if (o.id === "ppl4"){ sc -= 6; } if (/g\d/.test(o.id)){ sc += glutePri ? 4 : 2; why.push("it adds a lower-body day for your leg priority"); } }
    else if (/g\d/.test(o.id)) sc -= 2;
    if (armsPri && o.id === "ul5"){ sc += 3; why.push("the fifth day gives arms and delts their own session"); }
    if (ans.goal === "strength" && /^ul|fb/.test(o.id)){ sc += 2; why.push("the main lifts come round twice a week, which suits strength"); }
    if (+ans.mins <= 45 && fb && n >= 3){ sc += 1; why.push("short full-body sessions fit your time"); }
    if (opts.indexOf(o) === 0) sc += 0.5;
    if (!best || sc > best.sc) best = {o, sc, why};
  }
  if (!best) return null;
  return {id:best.o.id, why:best.why.length ? "Recommended because " + best.why.join(", and ") + "." : "Recommended: every muscle trained at least twice a week."};
}
// muscles trained directly on each template (for honest warnings on custom splits)
function seqFrequency(seq){
  const f = {};
  seq.forEach(tk => { const seen = new Set(); T[tk].slots.forEach(p => { const ex = Object.values(L).find(e => e.p === p); if (ex) Object.keys(ex.mu).filter(m => ex.mu[m] >= 1).forEach(m => seen.add(m)); }); seen.forEach(m => f[m] = (f[m] || 0) + 1); });
  return f;
}
function splitWarnings(seq, ans){
  const f = seqFrequency(seq), out = [], big = ["chest","lats","upback","quads","hams","sdelt"];
  const once = big.filter(m => (f[m] || 0) === 1), never = big.concat(["glutes","biceps","triceps"]).filter(m => !(f[m]));
  if (never.length) out.push(`${never.map(m => MUS[m]).join(", ")} ${never.length > 1 ? "aren't" : "isn't"} trained directly at all.`);
  if (once.length) out.push(`${once.map(m => MUS[m]).join(", ")} ${once.length > 1 ? "are" : "is"} trained once a week. With the same weekly sets, splitting them over two sessions tends to grow a little more and keeps each session shorter, so you probably won't get the most growth here.`);
  const pri = (ans.pri || []).filter(m => (f[m] || 0) < 2);
  if (pri.length) out.push(`Your priority ${pri.map(m => MUS[m]).join(", ")} ${pri.length > 1 ? "get" : "gets"} fewer than 2 sessions a week.`);
  for (let i = 0; i < seq.length - 1; i++) if (LOWER.has(seq[i]) && LOWER.has(seq[i + 1]) && (ans.days || []).length >= 6) { out.push("Two lower-body days run back to back; the second may suffer."); break; }
  return out;
}
const WD = [["mon",1,"Mon"],["tue",2,"Tue"],["wed",3,"Wed"],["thu",4,"Thu"],["fri",5,"Fri"],["sat",6,"Sat"],["sun",0,"Sun"]];
const INJ = [["shoulder","Shoulder"],["elbow","Elbow"],["wrist","Wrist"],["lowback","Lower back"],["hip","Hip"],["knee","Knee"],["ankle","Ankle"]];
// Looks for the aesthetics goal: the user chooses; these only suggest which muscles to prioritise.
const LOOKS = {
  male:[["vtaper","V-taper","Broad shoulders and back, narrow waist",["sdelt","lats","chest"]],["athletic","Athletic","Balanced, strong legs, defined arms",["quads","sdelt","upback"]],["mass","Overall size","Big everywhere, bodybuilding style",["chest","lats","quads"]],["arms","Arms and shoulders","Fuller arms and capped delts",["biceps","triceps","sdelt"]]],
  female:[["toned","Toned and athletic","Defined shoulders, back and legs",["glutes","sdelt","upback"]],["hourglass","Hourglass","Rounder glutes and shoulders, wider back",["glutes","sdelt","lats"]],["lower","Lower-body focus","Glutes, hamstrings and quads",["glutes","hams","quads"]],["strong","Strong and defined","Balanced strength with visible muscle",["upback","glutes","triceps"]]]
};

/* ---------- Generator ---------- */
function has(kit, ex){ return ex.q.every(r => kit.includes(r)); }
function exScore(ex, ctx){
  let s = ex.len * 2;                                   // lengthened bias
  if (ctx.gym === "shwc" && ex.eq === "machine" && !ex.c) s += 1;   // stable machines for isolation work
  if (ex.eq === "machine" && ex.c) s += 0.5;
  if (["strength","power","crossfit"].includes(ctx.ans.goal) && ex.eq === "bb" && ex.c) s += 3;
  if (ctx.ans.goal === "strength" && ["squat","bench","deadlift","bbohp"].includes(ex.k)) s += 3;
  if (ctx.ans.level === "new" && ex.eq === "machine") s += 1.5;          // stable machines while learning
  if (ctx.ans.level === "new" && ["deadlift","goodmorning","frontsq","bbohp","nordicham","nordic"].includes(ex.k)) s -= 4;
  if ((ctx.ans.injAvoid || []).includes(ex.k)) s -= 50;
  if ((ctx.ans.love || []).includes(ex.k)) s += 6;
  if (ex.inj.some(j => (ctx.ans.inj || []).includes(j))) s -= 8;
  if ((ctx.ans.inj || []).includes("wrist") && ["bb","bw"].includes(ex.eq) && /press|push|dip|skull|curl/i.test(ex.n)) s -= 4;
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
const FALLBACK = {abd:["glute"], sled:["lunge"], carry:["row"], cond:["erg"], erg:["cond"], fpress:["ipress"], ipress:["fpress"], lunge:["squat"], squat:["lunge"], latiso:["vpull","row"], ohp:["ipress"], add:[], kneeflex:["hinge"], kneeext:["squat"], fly:["fpress"], vpull:["row"], rear:["row"], hinge:["kneeflex"], glute:["hinge"]};
function targetsFor(ans){
  // beginners grow from less (and learn technique better with fewer sets); strength goals trade some volume for heavier work
  const lvl = {new:0.75, inter:1, adv:1.2}[ans.level || "inter"] * (ans.goal === "strength" ? 0.85 : 1), ph = ans.phase === "cut" ? 0.9 : 1, out = {};
  for (const [m, v] of Object.entries(BASE_SETS)) out[m] = Math.round(v * lvl * ph);
  for (const m of ans.pri || []) out[m] = Math.round(PRIORITY_SETS * (ans.level === "adv" ? 1.1 : 1) * ph);
  if (ans.goal === "crossfit"){ for (const m of Object.keys(out)) out[m] = Math.round(out[m] * 0.7); }
  return out;
}
// minutes: ~45 s of work per set plus rest, plus setup. Isolation lifts paired as supersets share their rest (Weakley 2017),
// so each set costs roughly half its rest.
let SUPER = true;
const special = p => ["cond","sled","carry","erg"].includes(p);
function exTime(ex, sets){ const r = SUPER && !ex.c && !special(ex.p) ? ex.rest * 0.55 : ex.rest; return sets * (r + 45) / 60 + 2; }
function buildVariant(dayKeys, gym, ans, seed){
  SUPER = ans.supersets !== false;
  const kit = (ans.kit && ans.kit[gym]) || (((flowGyms() || gymList()).find(g => g.id === gym) || {}).kit) || KIT_DEFAULT[gym] || KIT_FULL, used = new Set(), tg = targetsFor(ans), pri = new Set(ans.pri || []);
  const days = dayKeys.map(tk => {
    const dayUsed = new Set(), list = [];
    const slots = ans.goal === "strength" && T[tk].slots[0] === "ipress" ? ["fpress", ...T[tk].slots.slice(1).filter(x => x !== "fpress")] : T[tk].slots;
    for (const pat of slots){
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
    // pair isolation lifts for different muscles into supersets (A1/A2, B1/B2…), keeping order
    if (SUPER){ const iso = d.list.filter(x => !x.ex.c && !special(x.ex.p)), prim = x => Object.keys(x.ex.mu).find(m => x.ex.mu[m] >= 1); let g = 0;
      for (let k = 0; k + 1 < iso.length; ){ if (prim(iso[k]) !== prim(iso[k + 1])){ const tag = "ABCDE"[g++]; iso[k].ss = tag; iso[k + 1].ss = tag; const j1 = d.list.indexOf(iso[k]), j2 = d.list.indexOf(iso[k + 1]); if (j2 !== j1 + 1){ d.list.splice(j2, 1); d.list.splice(j1 + 1, 0, iso[k + 1]); } k += 2; } else k++; } }
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
// Effort through the block. No trial compares ramps directly, so the shape is coaching practice; the targets are evidence-based:
// trained lifters grow as much at 1-2 reps in reserve as at failure (Refalo 2024), growth improves closer to failure (Robinson 2024),
// beginners don't need failure (Refalo 2023), misjudge reps in reserve by ~1 rep (Halperin 2022), and find failure more unpleasant (Refalo 2025).
function rirPlan(weeks, level, ramp){
  const hard = Math.max(2, weeks - 1), out = [];
  for (let i = 0; i < hard; i++){
    const last = i === hard - 1, late = i >= hard - 2;
    let r;
    if (ramp === "steady") r = "2";
    else if (level === "new") r = i === 0 ? "3" : last ? "1–2" : "2";
    else if (ramp === "close" || level === "adv") r = late && hard > 2 ? "0–1" : "1";
    else r = i === 0 ? "1–2" : late && hard > 2 ? "0–1" : "1";
    out.push(r);
  }
  return out.concat(["DL"]);
}
const DAYPICK = {1:["wed"],2:["mon","thu"],3:["mon","wed","fri"],4:["mon","tue","thu","fri"],5:["mon","tue","wed","fri","sat"],6:["mon","tue","wed","thu","fri","sat"],7:["mon","tue","wed","thu","fri","sat","sun"]};
const RESTSCALE = {short:0.8, std:1, long:1.25};
// CrossFit-style conditioning pieces, one per day (rotate). Scale reps and loads to finish inside the time.
const WODS = ["Finish: 12 min AMRAP of 10 kettlebell swings, 10 box jumps, 250 m row",
  "Finish: EMOM 10 min, alternating 12 wall balls and 10 burpees",
  "Finish: 5 rounds for time of 400 m run (or 500 m row), 15 kettlebell swings, 10 push-ups",
  "Finish: 15 min easy-to-moderate mixed cardio (row, bike, ski) to build your engine"];
function focusOf(list){
  const s = {}; list.forEach(x => { for (const [m, f] of Object.entries(x.ex.mu)) if (f >= 1) s[m] = (s[m] || 0) + x.sets; });
  return Object.entries(s).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([m]) => MUS[m]).join(", ");
}
function generate(ans, seed){
  const n = ans.days.length;
  let split = ans.goal === "crossfit" ? {id:"cf", name:"Strength + conditioning ×" + n, days:Array.from({length:n}, (_, i) => ["cfA","cfB","cfC"][i % 3])}
    : ans.split === "custom" && (ans.customSeq || []).length === n ? {id:"custom", name:"Custom: " + ans.customSeq.map(k => T[k].label).join(" / "), days:ans.customSeq.slice()}
    : (SPLITS[n] || []).find(s => s.id === ans.split) || (SPLITS[n] || [])[0];
  const placed = placeDays(split.days, ans);
  const seq = placed.map(p => p.tk);
  const gl = (flowGyms() || gymList()), vs = Object.fromEntries(gl.map(g => [g.id, buildVariant(seq, g.id, ans, seed)])), first = vs[gl[0].id];
  const exercises = {};
  const rs = RESTSCALE[ans.rest || "std"] || 1;
  const toList = (v, i) => { let heavyDone = false; return v.days[i].list.map((x, j) => {
    const e = x.ex, def = {n:e.n, lo:e.lo, hi:e.hi, rest:Math.round(e.rest * rs / 15) * 15, eq:e.eq, m:MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)] || "Conditioning", mu:e.mu, note:e.note || undefined, len:e.len};
    let key = e.k;
    const bigLift = e.c && e.eq === "bb" && ["squat","hinge","fpress","ipress","ohp"].includes(e.p);
    if (ans.level === "new" && !special(e.p) && e.k !== "plank"){ if (e.c){ def.lo = Math.max(def.lo, 8); def.hi = Math.min(12, Math.max(def.hi, 12)); } else { def.lo = Math.max(def.lo, 10); def.hi = 15; } }
    else if (ans.goal === "strength" && bigLift){ key = e.k + "-hvy"; Object.assign(def, {n:e.n + " (heavy)", lo:3, hi:6, rest:Math.round(210 * rs / 15) * 15}); }
    else if ((ans.goal === "power" || ans.goal === "crossfit") && bigLift && !heavyDone){ heavyDone = true; key = e.k + "-hvy"; Object.assign(def, {n:e.n + " (heavy)", lo:4, hi:6, rest:Math.round(180 * rs / 15) * 15}); }
    exercises[key] = Object.fromEntries(Object.entries(def).filter(([, v]) => v !== undefined));
    return x.ss ? [key, x.sets, x.ss] : [key, x.sets];
  }); };
  const sportSet = new Set(ans.sport || []);
  const days = WD.map(([k, wd, short]) => {
    const i = placed.findIndex(p => p.wd === wd);
    if (i < 0) return {k, wd, label:"Rest", focus:sportSet.has(k) ? "Sport or harder cardio" : "Recovery, walk or easy cardio", rest:true, cardio:sportSet.has(k) ? "Sport day" : "Walk or easy cardio"};
    const tk = placed[i].tk;
    const next = WD.find(x => x[1] === (wd + 1) % 7)[0];
    return {k, wd, label:T[tk].label, tpl:tk, focus:focusOf(first.days[i].list), gym:gl.some(g => g.id === (ans.gymOf || {})[k]) ? ans.gymOf[k] : gl[0].id,
      cardio:ans.goal === "crossfit" ? WODS[i % WODS.length] : ans.cardioPlus && i % 2 === 1 ? "Add 20-30 min of easy cardio after, or on a rest day" : LOWER.has(tk) ? "Keep hard cardio away from today if you can" : "Easy cardio is fine",
      variants:Object.fromEntries(gl.map(g => [g.id, toList(vs[g.id], i)]))};
  });
  const weeks = +ans.block || 6;
  return {schema:2, name:(ans.name || "Block 1"), placeholder:false, startDate:ans.start, deloadEvery:weeks, rir:rirPlan(weeks, ans.level, ans.ramp), breaks:(ans.breaks || []).slice(),
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
  general:{name:"Get fitter running", sub:"No race: build a solid, injury-proof base", dist:8, peak:[20, 40], longMax:14, taper:0, q:"general"},
  "5k":{name:"5k", sub:"Speed and VO2max work", dist:5, peak:[25, 50], longMax:13, taper:1, q:"vo2"},
  "10k":{name:"10k", sub:"Threshold and VO2max", dist:10, peak:[30, 60], longMax:17, taper:1, q:"vo2"},
  half:{name:"Half marathon", sub:"Threshold and long runs", dist:21.1, peak:[40, 70], longMax:22, taper:1, q:"thr"},
  marathon:{name:"Marathon", sub:"Aerobic volume and marathon-pace work", dist:42.2, peak:[50, 90], longMax:32, taper:2, q:"mp"},
  ultra:{name:"Ultra", sub:"Anything longer than a marathon: time on feet, hills, back-to-backs", dist:50, peak:[60, 110], longMax:40, taper:2, q:"hill", b2b:true},
  stage:{name:"Multi-day desert ultra", sub:"E.g. Marathon des Sables: pack running, heat, back-to-backs", dist:250, peak:[65, 110], longMax:40, taper:2, q:"hill", b2b:true, pack:true, heat:true},
  custom:{name:"Another distance", sub:"Type any distance in km", dist:15, peak:[35, 65], longMax:20, taper:1, q:"thr"}
};
// Couch-to-5K style run/walk progression (modelled on the NHS Couch to 5K: 9 weeks, 3 runs a week)
const RUNWALK = ["8 × (1 min jog, 90 s walk)", "6 × (90 s jog, 2 min walk)", "2 × (90 s jog, 90 s walk, 3 min jog, 3 min walk)", "Jog 3 min, 5 min, 3 min, 5 min with short walks between",
  "Jogs of 5-8 min with walks; end the week with 20 min non-stop", "Jogs of 8-10 min; end the week with 25 min non-stop", "25 min non-stop, easy pace", "28 min non-stop, easy pace", "30 min non-stop: you're a runner"];
const RUNLEVELS = [["New to running", "Can't run 10 minutes without stopping yet", 0, 0, 3], ["Getting going", "Can jog 20-30 minutes at an easy pace", 10, 5, 3],
  ["Regular runner", "Run most weeks, about 15-30 km", 22, 10, 4], ["Experienced", "30-60 km a week, have raced", 45, 18, 5], ["Competitive", "60+ km a week, training for times", 70, 26, 6]];
const RUNTYPE = {
  easy:{n:"Easy run", rpe:"RPE 3-4: you could hold a conversation", level:"Easy", sport:"run"},
  long:{n:"Long run", rpe:"RPE 3-4, steady and relaxed", level:"Steady", sport:"run"},
  b2b:{n:"Back-to-back long", rpe:"RPE 3-4 on tired legs: the point is time on feet", level:"Steady", sport:"run"},
  vo2:{n:"Intervals", rpe:"5-6 × 3 min at RPE 8-9 (about 5k effort), 2 min easy jog between", level:"Hard", sport:"run"},
  thr:{n:"Threshold", rpe:"3 × 10 min at RPE 6-7 (comfortably hard), 2 min easy between", level:"Tempo", sport:"run"},
  mp:{n:"Marathon-pace run", rpe:"Warm up, then 6-12 km at goal marathon pace (RPE 5-6)", level:"Tempo", sport:"run"},
  hill:{n:"Hill repeats", rpe:"8-10 × 90 s uphill at RPE 7-8, walk or jog down; power-hike the steepest bits", level:"Hills", sport:"run"},
  general:{n:"Strides", rpe:"Easy run with 6 × 20 s quick, relaxed strides at the end", level:"Steady", sport:"run"},
  runwalk:{n:"Run/walk", rpe:"Easy: walking breaks are part of the plan", level:"Easy", sport:"run"},
  hyint:{n:"Race-pace intervals", rpe:"6-8 × 1 km at your goal race pace, 90 s easy between", level:"Tempo", sport:"run"},
  hysim:{n:"HYROX simulation", rpe:"Rounds of 1 km run straight into a station, at race effort", level:"Race simulation (nearest: vigorous HIIT)", sport:"hyrox"},
  swimE:{n:"Easy swim", rpe:"Technique and steady aerobic swimming, RPE 3-4", level:"Front crawl, moderate", sport:"swim"},
  swimQ:{n:"Swim intervals", rpe:"Warm up, then 8-12 × 100 m at RPE 7 with 20 s rest", level:"Front crawl, fast", sport:"swim"},
  bikeE:{n:"Easy ride", rpe:"RPE 3-4, high cadence", level:"Easy", sport:"cycle"},
  bikeQ:{n:"Bike intervals", rpe:"4-5 × 6 min at RPE 7-8, 3 min easy between", level:"Hard", sport:"cycle"},
  bikeL:{n:"Long ride", rpe:"Steady RPE 4-5; practise eating and drinking on the bike", level:"Moderate", sport:"cycle"},
  brick:{n:"Long ride + brick run", rpe:"Steady ride, then straight into an easy 10-20 min run off the bike", level:"Moderate", sport:"cycle"},
  runE:{n:"Easy run", rpe:"RPE 3-4", level:"Easy", sport:"run"},
  runQ:{n:"Run intervals", rpe:"5 × 4 min at RPE 7-8, 2 min easy between", level:"Hard", sport:"run"},
  runL:{n:"Long run", rpe:"RPE 3-4, steady", level:"Steady", sport:"run"}
};
function eventSpec(ans){
  const base = EVENTS[ans.event] || EVENTS.general;
  if (ans.event !== "custom" && ans.event !== "ultra") return base;
  const d = Math.max(1, +ans.goalKm || base.dist), tpl = d <= 7 ? EVENTS["5k"] : d <= 15 ? EVENTS["10k"] : d <= 30 ? EVENTS.half : d <= 42.2 ? EVENTS.marathon : EVENTS.ultra;
  return Object.assign({}, tpl, {name:(d > 42.2 ? r1(d) + " km ultra" : r1(d) + " km"), dist:d, longMax:d > 42.2 ? Math.min(45, Math.max(32, d * 0.5)) : tpl.longMax, sub:""});
}
// Long run that makes you ready for the distance (coaching convention)
function readyLong(E){ return E.dist <= 5 ? 6 : E.dist <= 10 ? 11 : E.dist <= 21.1 ? 17 : E.dist <= 42.2 ? 30 : Math.min(E.longMax, Math.max(32, E.dist * 0.5)); }
// No race date: estimate how long it takes to be ready from where you are, using the plan's own progression rules
function weeksToReady(ans){
  const E = eventSpec(ans), target = readyLong(E); let long = Math.max(3, +ans.longest || 3), w = 0;
  if (+ans.runLevel === 0){ w = 9; long = Math.max(long, 4.5); }
  while (long < target && w < 60){ w++; if (w % 4 !== 0) long *= 1.08; }
  return Math.max(6, Math.min(40, w + (E.taper || 0) + 1));
}
function spreadDays(n, longKey){
  const order = {1:["sat"],2:["wed","sat"],3:["tue","thu","sat"],4:["tue","wed","fri","sun"],5:["mon","tue","thu","fri","sun"],6:["mon","tue","wed","thu","fri","sun"],7:WD.map(x => x[0])}[n] || ["tue","thu","sat"];
  let ks = order.slice();
  if (longKey && !ks.includes(longKey)){ const wk = ["sat","sun"].includes(ks[ks.length - 1]) ? ks.length - 1 : ks.length - 1; ks[wk] = longKey; }
  return WD.filter(([k]) => ks.includes(k)).map(x => x[0]);
}
function enduPlan(ans){
  const E = eventSpec(ans), start = parseD(ans.start), race = ans.event !== "general" && ans.hasDate && ans.raceDate ? parseD(ans.raceDate) : null;
  let N = race ? Math.max(4, Math.min(40, Math.ceil((race - start) / (7 * 864e5)))) : (ans.event === "general" ? 12 : weeksToReady(ans));
  const runDays = (ans.runDays && ans.runDays.length ? ans.runDays : spreadDays(+ans.runs || 3, ans.longDay));
  const days = WD.filter(([k]) => runDays.includes(k)).map(x => x[1]);
  const longWd = days.includes(WD.find(x => x[0] === ans.longDay)?.[1]) ? WD.find(x => x[0] === ans.longDay)[1] : days[days.length - 1];
  const nQ = days.length >= 5 ? 2 : days.length >= 3 ? 1 : 0, newbie = +ans.runLevel === 0, RW = newbie ? Math.min(9, N - (E.taper || 0)) : 0;
  const cur0 = newbie ? 10 : Math.max(8, +ans.weeklyKm || 15), fewDays = days.length <= 3 ? 0.75 : 1;
  const peakKm = Math.round(Math.min(E.peak[1] * fewDays, Math.max(E.peak[0] * fewDays, cur0 * 1.6)));
  const T = race || ans.event !== "general" ? E.taper : 0, M = N - RW, P = T ? Math.min(3, Math.max(1, Math.round((M - T) * 0.2))) : 0;
  const B = Math.max(0, Math.round((M - T - P) * 0.45)), BASE = M - T - P - B;
  let longest = newbie ? 4.5 : Math.max(3, +ans.longest || cur0 * 0.35), km = cur0, weeks = [];
  for (let w = 0; w < N; w++){
    const ws = new Date(start); ws.setDate(ws.getDate() + w * 7);
    if (w < RW){   // run/walk weeks: three sessions, time not distance
      const sessions = {}; days.slice(0, 3).forEach((d, i) => sessions[d] = {type:"runwalk", mins:i === 2 && w >= 4 ? 30 : 28, desc:RUNWALK[w]});
      weeks.push({start:ymd(ws), w:w + 1, phase:"Run/walk", recovery:false, km:0, mins:Object.values(sessions).reduce((a, s) => a + s.mins, 0), long:0, b2b:0, sessions, notes:[], strength:1}); continue;
    }
    const wi = w - RW, phase = wi < BASE ? "Base" : wi < BASE + B ? "Build" : wi < BASE + B + P ? "Peak" : "Taper";
    const recovery = phase !== "Taper" && phase !== "Peak" && wi > 0 && (wi + 1) % 4 === 0;
    if (phase === "Taper"){ const tIdx = w - (N - T); km = Math.round(peakKm * (T === 2 ? (tIdx === 0 ? 0.7 : 0.45) : 0.55)); }
    else if (phase === "Peak") km = peakKm;
    else km = Math.min(peakKm, Math.round((wi === 0 ? cur0 : km) * (wi === 0 ? 1 : 1.07)));
    const weekKm = recovery ? Math.round(km * 0.8) : km;
    // long run: never >10% beyond the longest run of the previous 30 days (Frandsen 2025); builds ~8% a week
    let long;
    if (phase === "Taper") long = longest * (w === N - 1 ? 0.45 : 0.7);
    else if (recovery) long = longest * 0.85;
    else long = Math.min(E.longMax, longest * 1.08, Math.max(5, weekKm * 0.5));
    const longRaw = Math.max(3, long); long = Math.round(longRaw);
    if (!recovery && phase !== "Taper") longest = Math.max(longest, longRaw);
    const b2b = E.b2b && (phase === "Build" || phase === "Peak") && !recovery ? Math.round(long * 0.6) : 0;
    const qType = phase === "Base" ? "general" : (E.q === "mp" && phase !== "Taper" && w % 2 ? "thr" : E.q === "general" ? "general" : E.q);
    const qs = phase === "Base" || phase === "Taper" ? Math.min(1, nQ) : nQ;
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
    easyDays.forEach(d => sessions[d] = {type:"easy", km:Math.max(3, Math.min(Math.round(long * 0.85), Math.round(left / Math.max(1, easyDays.length))))});
    const notes = [];
    if (E.pack && (phase === "Build" || phase === "Peak")) notes.push(`Long runs with your pack: ${Math.min(7, 3 + Math.round((wi - BASE) * 0.5))} kg this week, building to race weight`);
    if (E.heat && race && (race - ws) / 864e5 <= 21 && phase !== "Base") notes.push("Heat block: 4-5 heat sessions this week (overdress on easy runs, or 20-30 min sauna or hot bath right after)");
    if (long * 6 >= 90) notes.push("Practise fuelling on the long run: 60-90 g carbohydrate an hour, using what you'll race with");
    weeks.push({start:ymd(ws), w:w + 1, phase, recovery, km:Object.values(sessions).reduce((a, s) => a + s.km, 0), long, b2b, sessions, notes, strength:phase === "Taper" || phase === "Peak" ? 1 : 2});
  }
  return {event:ans.event, eventName:E.name, raceDate:race ? ans.raceDate : null, estimated:!race && ans.event !== "general", weeks, peakKm, longWd, phases:{runwalk:RW, base:BASE, build:B, peak:P, taper:T}};
}
/* HYROX: running-led (finish time tracks VO2max and endurance volume, not grip or muscle mass: Brandt 2025),
   plus station-specific strength and a weekly simulation of compromised running. */
function hyroxPlan(ans){
  const start = parseD(ans.start), race = ans.hasDate && ans.raceDate ? parseD(ans.raceDate) : null;
  const N = race ? Math.max(4, Math.min(30, Math.ceil((race - start) / (7 * 864e5)))) : 12, nD = Math.max(3, Math.min(6, +ans.nDays || 4));
  const td = spreadDays(nD, ans.longDay || "sat"), wds = WD.filter(([k]) => td.includes(k)).map(x => x[1]);
  // roles by number of days: S = strength, I = intervals, X = simulation, E = easy run, L = long easy run
  const roles = {3:["S","I","X"], 4:["S","I","E","X"], 5:["S","I","S","E","X"], 6:["S","I","E","S","X","L"]}[nD];
  const lvl = +ans.runLevel || 1, easy0 = [4, 5, 6, 8, 10][lvl], weeks = [];
  for (let w = 0; w < N; w++){
    const ws = new Date(start); ws.setDate(ws.getDate() + w * 7);
    const taper = race && w === N - 1, recovery = !taper && w > 0 && (w + 1) % 4 === 0, phase = taper ? "Taper" : w < N * 0.4 ? "Base" : "Build";
    const f = taper ? 0.6 : recovery ? 0.8 : Math.min(1.5, 1 + w * 0.04), rounds = Math.max(3, Math.min(8, (taper ? 4 : 3 + Math.floor(w / 2)) - (recovery ? 1 : 0)));
    const sessions = {};
    roles.forEach((r, i) => { const d = wds[i];
      if (r === "I") sessions[d] = {type:"hyint", km:Math.round((recovery ? 5 : Math.min(8, 5 + Math.floor(w / 3))) * (taper ? 0.6 : 1) + 2), desc:`${recovery ? 5 : Math.min(8, 5 + Math.floor(w / 3))} × 1 km at goal race pace, 90 s easy between`};
      if (r === "X") sessions[d] = {type:"hysim", km:rounds, desc:`${rounds} rounds: 1 km run, then one station (rotate SkiErg, sled push, sled pull, burpee broad jumps, row, farmers carry, sandbag lunges, wall balls)`};
      if (r === "E") sessions[d] = {type:"easy", km:Math.round(easy0 * f)};
      if (r === "L") sessions[d] = {type:"long", km:Math.round(easy0 * 1.5 * f)};
    });
    weeks.push({start:ymd(ws), w:w + 1, phase, recovery, km:Object.values(sessions).reduce((a, s) => a + (s.type === "hysim" ? s.km : s.km), 0), long:0, b2b:0, sessions, notes:w === 0 ? ["Race: 8 × 1 km runs, each followed by a station. Most of your race time is running, so the runs matter most"] : [], strength:roles.filter(x => x === "S").length});
  }
  return {event:"hyrox", eventName:"HYROX" + (ans.division ? " " + ans.division : ""), raceDate:race ? ans.raceDate : null, weeks, peakKm:Math.max(...weeks.map(w => w.km)), strengthDays:roles.map((r, i) => r === "S" ? wds[i] : null).filter(x => x != null)};
}
/* Triathlon: ~70-80% easy across swim, bike and run (Muñoz 2014; Neal 2011), one long ride with a brick run, taper 1-2 weeks. Minutes, not km. */
const TRI = {sprint:{name:"Sprint triathlon", sub:"750 m swim, 20 km bike, 5 km run", swim:30, bike:50, longBike:75, run:30, longRun:45, weeks:10, taper:1},
  olympic:{name:"Olympic triathlon", sub:"1.5 km swim, 40 km bike, 10 km run", swim:40, bike:60, longBike:105, run:40, longRun:65, weeks:12, taper:1},
  half:{name:"Half Ironman (70.3)", sub:"1.9 km swim, 90 km bike, 21.1 km run", swim:50, bike:70, longBike:180, run:45, longRun:100, weeks:16, taper:2},
  full:{name:"Ironman", sub:"3.8 km swim, 180 km bike, 42.2 km run", swim:60, bike:80, longBike:300, run:50, longRun:150, weeks:24, taper:2}};
function triPlan(ans){
  const D = TRI[ans.tri || "olympic"], start = parseD(ans.start), race = ans.hasDate && ans.raceDate ? parseD(ans.raceDate) : null;
  const N = race ? Math.max(6, Math.min(36, Math.ceil((race - start) / (7 * 864e5)))) : D.weeks, nD = Math.max(3, Math.min(7, +ans.nDays || 5));
  const td = spreadDays(nD, ans.longDay || "sat"), wds = WD.filter(([k]) => td.includes(k)).map(x => x[1]);
  const longWd = WD.find(x => x[0] === (ans.longDay || "sat"))[1], li = Math.max(0, wds.indexOf(longWd));
  const roles = {3:["swimE","runE","brick"], 4:["swimE","bikeQ","runE","brick"], 5:["swimE","bikeQ","runQ","swimQ","brick"], 6:["swimE","bikeQ","runQ","swimQ","brick","runL"], 7:["swimE","bikeQ","runQ","swimQ","bikeE","brick","runL"]}[nD];
  // the brick lands on the long day; the long run (if any) the day after or the slot after
  const order = roles.filter(r => r !== "brick"); order.splice(li, 0, "brick");
  const lv = [0.55, 0.65, 0.75, 0.85][+ans.triLevel || 1], weeks = [], T = race ? D.taper : 1, peakAt = Math.max(1, Math.round((N - T) * 0.8));
  for (let w = 0; w < N; w++){
    const ws = new Date(start); ws.setDate(ws.getDate() + w * 7);
    const taper = w >= N - T, recovery = !taper && w > 0 && (w + 1) % 4 === 0, phase = taper ? "Taper" : w < peakAt * 0.5 ? "Base" : w < peakAt ? "Build" : "Peak";
    const ramp = taper ? (w === N - 1 ? 0.45 : 0.65) : Math.min(1, lv + (1 - lv) * w / peakAt) * (recovery ? 0.8 : 1), hard = phase !== "Base" && !recovery;
    const sessions = {};
    order.forEach((r0, i) => { const d = wds[i]; let r = r0;
      if (!hard && (r === "bikeQ" || r === "runQ" || r === "swimQ")) r = r.replace("Q", "E");
      const base = {swimE:D.swim, swimQ:D.swim, bikeE:D.bike * 0.8, bikeQ:D.bike, brick:D.longBike, runE:D.run, runQ:D.run, runL:D.longRun}[r];
      sessions[d] = {type:r, mins:Math.round(base * ramp / 5) * 5, desc:r === "brick" ? `Ride ${Math.round(base * ramp / 5) * 5} min, then run ${taper ? 10 : 15} min straight off the bike` : ""};
    });
    weeks.push({start:ymd(ws), w:w + 1, phase, recovery, km:0, mins:Object.values(sessions).reduce((a, s) => a + s.mins, 0), long:0, b2b:0, sessions, notes:[], strength:phase === "Taper" ? 0 : Math.min(2, +ans.strengthN || 0)});
  }
  return {event:"tri", eventName:D.name, raceDate:race ? ans.raceDate : null, weeks, peakKm:0, peakMins:Math.max(...weeks.map(w => w.mins)), unit:"mins"};
}
// strength days for runners and triathletes: away from the long day and the day before it, easy or rest days first
function autoLiftDays(plan, n){
  const w = plan.weeks.find(x => Object.keys(x.sessions).length >= 3) || plan.weeks[0], longWd = plan.longWd != null ? plan.longWd : +Object.keys(w.sessions).find(d => ["long","brick","runL"].includes(w.sessions[d].type));
  const score = wd => { const s2 = w.sessions[wd]; if (wd === longWd || (wd + 1) % 7 === longWd) return 99; return !s2 ? 1 : /easy|E$|runwalk/.test(s2.type) ? 2 : 5; };
  return [1,2,3,4,5,6,0].sort((a, b) => score(a) - score(b)).slice(0, n).filter(d => score(d) < 99).sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
}
function generateEndu(ans, seed){
  const plan = ans.kind === "hyrox" ? hyroxPlan(ans) : ans.kind === "tri" ? triPlan(ans) : enduPlan(ans), gl = (flowGyms() || gymList()), hybrid = ans.kind === "hybrid";
  let liftDays = ans.kind === "hyrox" ? plan.strengthDays : WD.filter(([k]) => (ans.liftDays || []).includes(k)).map(x => x[1]);
  if (ans.kind !== "hyrox" && !liftDays.length && +ans.strengthN > 0) liftDays = autoLiftDays(plan, +ans.strengthN);
  const exercises = {};
  let tplSeq = [];
  if (liftDays.length){
    if (hybrid){ const sp = (SPLITS[liftDays.length] || SPLITS[3])[0]; tplSeq = sp.days.slice(0, liftDays.length); }
    else if (ans.kind === "hyrox") tplSeq = liftDays.map((_, i) => i % 2 ? "hyB" : "hyA");
    else tplSeq = liftDays.map((_, i) => i % 2 ? "runB" : "runA");
  }
  const vs = Object.fromEntries(gl.map(g => [g.id, tplSeq.length ? buildVariant(tplSeq, g.id, {...ans, pri:hybrid ? (ans.pri || []) : [], mins:hybrid ? (ans.mins || 60) : 45, level:ans.level || "inter"}, seed) : null]));
  const toList = (v, i) => v.days[i].list.map(x => { const e = x.ex; exercises[e.k] = Object.fromEntries(Object.entries({n:e.n, lo:e.lo, hi:e.hi, rest:e.rest, eq:e.eq, m:MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)], mu:e.mu, note:e.note, len:e.len}).filter(([, z]) => z !== undefined)); return x.ss && hybrid ? [e.k, x.sets, x.ss] : [e.k, hybrid ? x.sets : Math.min(3, x.sets)]; });
  const w0 = plan.weeks[0];
  const days = WD.map(([k, wd]) => {
    const run = w0.sessions[wd] || plan.weeks.find(w => w.sessions[wd])?.sessions[wd];
    const li = liftDays.indexOf(wd);
    const d = {k, wd, rest:!run && li < 0, label:"Rest", focus:"", cardio:"Rest or an easy walk"};
    if (run){ d.run = {type:run.type}; d.label = RUNTYPE[run.type].n; d.focus = RUNTYPE[run.type].rpe; d.cardio = ""; }
    if (li >= 0){
      d.variants = Object.fromEntries(gl.map(g => [g.id, toList(vs[g.id], li)])); d.gym = gl.some(g => g.id === (ans.gymOf || {})[k]) ? ans.gymOf[k] : gl[0].id;
      const sLabel = hybrid || ans.kind === "hyrox" ? T[tplSeq[li]].label : ans.kind === "tri" ? "Strength for triathletes" : "Strength for runners";
      d.label = run ? d.label + " + " + sLabel.toLowerCase() : sLabel; d.focus = run ? d.focus : focusOf(vs[gl[0].id].days[li].list); d.tpl = tplSeq[li];
    } else if (run) d.variants = {};
    return d;
  });
  return {schema:2, kind:ans.kind, name:plan.eventName + " plan", placeholder:false, startDate:ans.start, deloadEvery:4, endurance:plan, setup:ans, built:Date.now(),
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
  if (F && F.kind === "welcome" && !F.accepted){ S.profile = {...S.profile, setupDone:true, modules:S.profile.modules || {training:true, endurance:true, nutrition:true, habits:true}}; saveProfile(); } F = null; render(); if (o){ o.removeAttribute("id"); o.classList.add("out"); setTimeout(() => o.remove(), 240); } }
function nextMonday(){ const d = new Date(); d.setHours(12); const add = (8 - d.getDay()) % 7 || 7; d.setDate(d.getDate() + (d.getDay() === 1 ? 0 : add)); return ymd(d); }

function addWeeks(n){ const d = new Date(); d.setDate(d.getDate() + n * 7); return ymd(d); }
// during the plan builder, generators use the gyms being edited; they're only saved with the plan
const flowGyms = () => (F && F.kind === "prog" && F.ans && F.ans.gyms && F.ans.gyms.length) ? F.ans.gyms : null;
function gymsDraft(){ return gymList().map(g => ({id:g.id, name:g.name, kit:(g.kit || KIT_FULL).slice(), dbMax:g.dbMax || 40, dbStep:g.dbStep || 2, plate:g.plate || 1.25})); }
function progDefaults(){
  const p = S.prog || {}, prev = p.setup, gyms = gymsDraft();
  const kit = Object.fromEntries(gyms.map(g => [g.id, g.kit.slice()]));
  const base = {gtype:null, kind:"gym", goal:"size", level:"inter", days:DAYPICK[4].slice(), mins:70, gymOf:{}, gyms, kit, sports:[], split:null, customSeq:null, pri:[], inj:[], injText:"", injAI:null, love:[], ban:[],
    block:6, ramp:"rec", rest:"std", breaks:[], start:nextMonday(), phase:S.profile.phase || "maintain", name:"Block 1",
    event:"general", goalKm:15, hasDate:false, raceDate:addWeeks(16), runLevel:2, weeklyKm:22, longest:10, runs:3, longDay:"sat", runDays:null, strengthN:2, liftDays:[], nDays:4, tri:"olympic", triLevel:1, division:"Open"};
  if (prev && prev.gtype) return Object.assign(base, clone(prev), {gyms, kit, start:nextMonday(), breaks:[], customAI:null, customDone:false, hasDate:prev.hasDate && prev.raceDate > ymd(new Date())});
  return base;
}
function endDefaults(){ return {}; }
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
const LIMITS = {heightCm:[120, 230], kg:[30, 250], kgNow:[30, 250], bf:[3, 60], weeklyKm:[0, 250], longest:[0, 120], goalKm:[1, 1000], mins:[20, 180], dbMax:[2, 120], steps:[0, 60000], commute:[0, 1500]};
// value of a typed field group (ft+in, st+lb) in the stored unit; null while incomplete or out of range
function readConv(row, key){
  const v = c => { const x = row.querySelector(`[data-key="${key}"][data-conv="${c}"]`); return x ? +String(x.value).replace(",", ".") : NaN; };
  const c0 = row.querySelector(`[data-key="${key}"]`).dataset.conv; let out;
  if (c0 === "cm") out = v("cm"); else if (c0 === "ft") out = ((v("ft") || 0) * 12 + (v("in") || 0)) * 2.54;
  else if (c0 === "kg") out = v("kg"); else if (c0 === "lb") out = v("lb") / LB; else if (c0 === "st") out = ((v("st") || 0) * 14 + (v("stlb") || 0)) / LB;
  else out = v(c0);
  const [lo, hi] = LIMITS[key] || LIMITS[key.split(".").pop()] || [-Infinity, Infinity];
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
const GTYPES = {
  muscle:["gym","size","Build muscle","Hypertrophy first: the most productive volume, sets close to failure"],
  strength:["gym","strength","Build strength","Heavier main lifts (3-6 reps) with muscle-building accessories"],
  power:["gym","power","Powerbuilding","One heavy lift a day, then bodybuilding work"],
  aesthetic:["gym","size","Aesthetics","Muscle where you want it: pick the look, the plan prioritises it"],
  gymcardio:["gym","size","Gym, plus some cardio","A full lifting plan with easy cardio fitted round it"],
  run:["endurance",null,"Running","First 5k to ultras, or just fitter. Strength sessions included"],
  hybrid:["hybrid","size","Hybrid","A full lifting split around a running plan, so they don't clash"],
  hyrox:["hyrox",null,"HYROX","Running-led, with station strength and race simulations"],
  crossfit:["gym","crossfit","CrossFit-style","Strength plus conditioning pieces, several days a week"],
  tri:["tri",null,"Triathlon","Swim, bike and run, sprint to Ironman"],
  custom:["gym","size","Something else","Describe it and AJ Training AI turns it into a plan"]
};
const PSTEPS = {
  gym:["intro","goal","look","level","days","gyms","sport","split","pri","inj","lifts","block","build","review"],
  endurance:["intro","goal","event","racedate","current","rundays","strength","gyms","inj","build","review"],
  hybrid:["intro","goal","event","racedate","current","rundays","liftdays","gyms","pri","inj","build","review"],
  hyrox:["intro","goal","hyrox","current","days","gyms","inj","build","review"],
  tri:["intro","goal","tri","days","strength","gyms","inj","build","review"]
};
function psteps(){
  const a = F.ans; if (!a.gtype) return ["intro","goal","level","days","build","review"];
  if (a.gtype === "custom" && !a.customDone) return ["intro","goal","custom","build","review"];
  return PSTEPS[a.kind].filter(x => !(x === "look" && a.gtype !== "aesthetic") && !(x === "split" && a.goal === "crossfit") && !(x === "racedate" && a.event === "general")
    && !(x === "gyms" && ["endurance","tri"].includes(a.kind) && !(+a.strengthN > 0)) && !(x === "lifts" && a.goal === "crossfit")).concat(a.gtype === "custom" ? [] : []).filter((x, i, arr) => arr.indexOf(x) === i);
}
function setGtype(a, g){
  const [kind, goal] = GTYPES[g]; a.gtype = g; a.kind = kind; if (goal) a.goal = goal; a.cardioPlus = g === "gymcardio";
  if (g === "aesthetic" && !a.look) a.pri = [];
  if (kind === "hyrox"){ a.nDays = 4; } if (kind === "tri"){ a.nDays = 5; a.strengthN = 1; }
  if (kind === "endurance"){ a.strengthN = 2; } if (kind === "hybrid"){ a.strengthN = 3; a.mins = 60; }
}
const NSTEPS = ["intro","goal","activity","stats","target","rate","macros","review"];
function stepsOf(){ if (F.kind === "welcome") return WSTEPS; return F.kind === "prog" ? psteps() : NSTEPS.filter(s => !(s === "target" || s === "rate") || (F.ans.type === "bulk" || F.ans.type === "cut")); }
function src(id, txt){ return `<button class="obsrc" data-src="${id}">${txt || "Evidence"}</button>`; }
function opt(name, val, title, sub, cur){ return `<button class="obopt" data-set="${name}" data-val="${val}" aria-pressed="${cur === val}"><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</button>`; }
function chip(name, val, label, on){ return `<button class="chip" data-tog="${name}" data-val="${val}" aria-pressed="${!!on}">${label}</button>`; }

function numSeg(name, from, to, cur, rec){ return `<div class="obnums">${Array.from({length:to - from + 1}, (_, i) => from + i).map(n => `<button data-set="${name}" data-val="${n}" aria-pressed="${+cur === n}">${n}${n === rec ? "<i>★</i>" : ""}</button>`).join("")}</div>`; }
function dayToggles(name, sel, disabled){ return `<div class="obdays">${WD.map(([k,, sh]) => `<button class="obday" data-tog="${name}" data-val="${k}" aria-pressed="${(sel || []).includes(k)}" ${disabled && disabled(k) ? "disabled" : ""}>${sh}</button>`).join("")}</div>`; }
function dateToggle(a){ return `<div class="obfld"><span class="obl">Do you have a date?</span>${seg2("hasDate", [["no","No, just get me ready"],["yes","Yes, a race or event"]], a.hasDate ? "yes" : "no")}
  ${a.hasDate ? `<input class="field" type="date" data-input="raceDate" value="${esc(a.raceDate)}">` : ""}</div>`; }
function sweetSpot(a){
  const tg = targetsFor(a), sets = Object.values(tg).reduce((x, y) => x + y, 0) / 1.6, need = Math.round(sets * 2.4 / Math.max(1, a.days.length) + 6);
  const m = +a.mins, zone = m < 40 ? ["short", "Short sessions work, but the plan may not fit all the volume you need."] : m <= 75 ? ["ok", "In the sweet spot: enough time for your volume without the last exercises suffering."] : m <= 90 ? ["ok", "Long but fine, especially with priorities or heavier lifts."] : ["long", "Very long sessions: effort tends to drop late on. Another day usually works better."];
  return {need, zone};
}
function gymEditor(a){
  return `${a.gyms.map((g, gi) => `<div class="card obgymc">
    <div class="spread"><input class="field obgname" data-gname="${g.id}" value="${esc(g.name)}" aria-label="Gym name">${a.gyms.length > 1 ? `<button class="link muted" data-gdel="${g.id}">Remove</button>` : ""}</div>
    <span class="obl">Start from a preset</span>
    <div class="chips">${Object.entries(PRESETS).map(([k, [n, d]]) => `<button class="chip" data-gpreset="${k}" data-g="${g.id}" title="${esc(d)}">${n}</button>`).join("")}</div>
    ${EQG.map(([gn, items], qi) => { const on2 = items.filter(([k]) => g.kit.includes(k)).length;
      return `<details class="obeqg" ${F.openEq === g.id + qi ? "open" : ""}><summary><b>${gn}</b><span class="muted small">${on2} of ${items.length}</span><button class="link" data-gall="${qi}" data-g="${g.id}">${on2 === items.length ? "None" : "All"}</button></summary>
      <div class="chips">${items.map(([k, n]) => `<button class="chip" data-gkit="${k}" data-g="${g.id}" aria-pressed="${g.kit.includes(k)}">${n}</button>`).join("")}</div></details>`; }).join("")}
    ${g.kit.includes("db") ? `<div class="obfld"><span class="obl">Dumbbells</span><div class="obunitrow">up to ${nf("gyms." + gi + ".dbMax", "num", g.dbMax, "Heaviest dumbbell", 84)}<span>kg, in steps of</span></div>${seg2("gyms." + gi + ".dbStep", [["1","1 kg"],["2","2 kg"],["2.5","2.5 kg"],["5","5 kg"]], String(g.dbStep))}</div>` : ""}
    ${g.kit.includes("bb") ? `<div class="obfld"><span class="obl">Smallest plates</span>${seg2("gyms." + gi + ".plate", [["0.5","0.5 kg"],["1.25","1.25 kg"],["2.5","2.5 kg"]], String(g.plate))}<span class="obhint">Sets the smallest jump the plan suggests on barbell lifts.</span></div>` : ""}
  </div>`).join("")}<button class="btn ghost" data-gadd="1">+ Add another gym</button>`;
}
function pStep(s, a){
  const G = GTYPES[a.gtype] || [];
  switch (s){
  case "intro": return {title:"Build your plan", body:`
    <p class="oblead">Answer a few questions and I'll build a full plan: every session, how hard to go, and how it progresses week to week.</p>
    <div class="obpoints">
      <div><i>1</i><span><b>Built from the research</b><em>Volume, effort, rest, intensity mix and tapering follow current meta-analyses. Tap <u>Evidence</u> anywhere to see the study.</em></span></div>
      <div><i>2</i><span><b>Fits real life</b><em>Your gyms and kit, your sports, and weeks that change: move any session and the week adjusts.</em></span></div>
      <div><i>3</i><span><b>Any goal</b><em>Muscle, strength, running, HYROX, CrossFit-style or triathlon, or describe your own.</em></span></div>
    </div>`, cta:"Start"};
  case "goal": return {title:"What are you training for?", body:`
    <h3 class="obh" style="margin-top:0">In the gym</h3><div class="obopts">${["muscle","strength","power","aesthetic","gymcardio","crossfit"].map(k => opt("gtype", k, GTYPES[k][2], GTYPES[k][3], a.gtype)).join("")}</div>
    <h3 class="obh">Endurance and hybrid</h3><div class="obopts">${["run","hybrid","hyrox","tri"].map(k => opt("gtype", k, GTYPES[k][2], GTYPES[k][3], a.gtype)).join("")}</div>
    <div class="obopts" style="margin-top:6px">${opt("gtype", "custom", GTYPES.custom[2], GTYPES.custom[3], a.gtype)}</div>`};
  case "custom": return {title:"Describe your goal", body:`
    <p class="obnote" style="margin-top:0">In your own words: the event, sport or look, how many days you have, anything that matters. For example "Hike Kilimanjaro next August", "Get strong enough for my first pull-up" or "Rugby pre-season".</p>
    <textarea class="field" rows="4" data-input="customText" placeholder="My goal is…">${esc(a.customText || "")}</textarea>
    <button class="btn orange" data-aicustom="1" ${F.busy ? "disabled" : ""}>${F.busy ? "Analysing…" : "Analyse with AJ Training AI"}</button>
    ${a.customAI ? `<div class="card obai"><b>${esc(a.customAI.title || "Your plan")}</b><span>${esc(a.customAI.summary || "")}</span>${a.customAI.notes ? `<span class="small muted">${esc(a.customAI.notes)}</span>` : ""}</div>` : ""}`, cta:a.customAI ? "Use this" : "Continue"};
  case "look": { const sx = S.profile.sex === "female" ? "female" : "male", other = sx === "male" ? "female" : "male";
    const row = l => `<button class="obopt" data-look="${l[0]}" aria-pressed="${a.look === l[0]}"><b>${l[1]}</b><span>${l[2]} · prioritises ${l[3].map(m => MUS[m].toLowerCase()).join(", ")}</span></button>`;
    return {title:"Which look are you after?", body:`<p class="obnote" style="margin-top:0">Pick what you think will look best on you. It only sets your starting priorities, which you can change on a later step.</p>
      <div class="obopts">${LOOKS[sx].map(row).join("")}</div><h3 class="obh">More looks</h3><div class="obopts">${LOOKS[other].map(row).join("")}</div>`}; }
  case "level": return {title:"Training experience", body:`<div class="obopts">
    ${opt("level","new","Under 1 year","Fewer sets, 8-15 reps and 2-3 reps in reserve while you learn the lifts. Stable machines are favoured.",a.level)}
    ${opt("level","inter","1-4 years","Intermediate: the most productive volume, sets close to failure.",a.level)}
    ${opt("level","adv","4+ years, close to your limit","More volume and effort to keep progressing.",a.level)}</div>
    <p class="obnote">Beginners grow from fewer sets and don't need to go to failure, which is also less unpleasant (and people tend to underestimate how many reps they have left, especially above ~12 reps, so the plan keeps a margin). ${src("volume")} ${src("rir","Effort evidence")}</p>`};
  case "days": { if (a.kind === "hyrox" || a.kind === "tri"){
      const r = a.kind === "tri" ? [3, 7, 5] : [3, 6, 4];
      return {title:"How many days a week?", body:`${numSeg("nDays", r[0], r[1], a.nDays, r[2])}
        <div class="obfld"><span class="obl">Long ${a.kind === "tri" ? "ride" : "session"} day</span>${seg2("longDay", [["sat","Saturday"],["sun","Sunday"]], a.longDay)}</div>
        <p class="obnote">${a.kind === "tri" ? "About three-quarters of the time is easy. One long ride with a short brick run off the bike each week." : "Most of a HYROX race is running, so runs lead the week, with station strength and a weekly race simulation."} Move any session in the Train tab when the week changes.</p>`}; }
    const sp = sweetSpot(a);
    return {title:"When can you train?", body:`
    <p class="obnote" style="margin-top:0">Tap your usual days. Weeks change: in the Train tab you can move any session to another day, and the week adjusts around it.</p>
    ${dayToggles("days", a.days)}
    <p class="obnote">${a.days.length} day${a.days.length === 1 ? "" : "s"} a week. ${a.days.length < 2 ? "One day works, but two or more lets every muscle be trained twice a week." : a.days.length >= 5 ? "Plenty: every muscle twice a week with room for priorities." : "Enough to train every muscle twice a week."} ${src("frequency")}</p>
    <div class="obfld"><span class="obl">Time per session</span><div class="obunitrow">${nf("mins", "num", a.mins, "Minutes per session", 90)}<span>min, including rest</span></div>
      <div class="obslider mins"><div class="obsweet" style="left:${(45 - 30) / 90 * 100}%;width:${30 / 90 * 100}%"></div><input type="range" min="30" max="120" step="5" value="${a.mins}" data-range="mins" aria-label="Minutes per session"></div>
      <span class="obhint ${sp.zone[0] === "ok" ? "" : "bad"}">${sp.zone[1]} Sweet spot 45-75 min. Your weekly volume needs about ${sp.need} min a session.</span></div>`}; }
  case "gyms": return {title:a.gyms.length > 1 ? "Your gyms" : "Your gym", wide:true, body:`
    <p class="obnote" style="margin-top:0">Pick a preset, then tick or untick whole groups or single items. Exercises are only chosen if the gym has the kit, and every session is written for every gym you add.</p>
    ${gymEditor(a)}
    ${a.gyms.length > 1 && (a.kind === "gym" || a.kind === "hybrid") ? `<div class="obgym"><b>Usual gym each day</b>${WD.filter(([k]) => (a.days || []).includes(k)).map(([k,, sh]) => `<div class="spread"><b>${sh}</b>${seg2("gymOf." + k, a.gyms.map(g => [g.id, g.name.length > 12 ? g.name.split(/\s+/).map(w => w[0]).join("").toUpperCase() : g.name]), (a.gymOf || {})[k] || a.gyms[0].id)}</div>`).join("")}<span class="small muted">You can switch gym on the day; progress on each machine is kept per gym.</span></div>` : ""}`};
  case "sport": { const sel = a.sports || [], q = (F.sq || "").toLowerCase(), ids = window.AJSports ? AJSports.search(q).slice(0, q ? 12 : 0) : [];
    return {title:"Any sport or regular cardio?", body:`
    <p class="obnote" style="margin-top:0">Add anything you do most weeks. No need to say which days: log it when you do it and the plan and your calories account for it.</p>
    <label class="sb card"><span>${ICON.search}</span><input data-sq="1" placeholder="Search any sport" value="${esc(F.sq || "")}" autocomplete="off"></label>
    <div id="obsq" class="chips">${ids.filter(k => !sel.some(x => x.id === k)).map(k => `<button class="chip" data-sport="${k}">+ ${esc(AJSports.SP[k][0])}</button>`).join("")}</div>
    ${!q ? `<div class="chips">${["football","tennis","padel","run","cycle","swim","basketball","climb","martial","yoga"].filter(k => !sel.some(x => x.id === k) && (window.AJSports && AJSports.SP[k])).map(k => `<button class="chip" data-sport="${k}">+ ${esc(AJSports.SP[k][0])}</button>`).join("")}</div>` : ""}
    ${sel.length ? `<div class="card oblist">${sel.map(x => `<div><span><b>${esc((AJSports.SP[x.id] || [x.id])[0])}</b></span><span class="obstepper"><button data-sportn="${x.id}" data-d="-1">−</button><b class="num">${x.n}× a week</b><button data-sportn="${x.id}" data-d="1">+</button></span></div>`).join("")}</div>` : ""}
    <p class="obnote">On average, cardio doesn't blunt muscle growth. Hard sport sessions can tire your legs, so if one falls the day before leg day, move a session in the Train tab. ${src("interference")}</p>`, cta:sel.length ? "Continue" : "Skip"}; }
  case "split": {
    const n = a.days.length, opts = SPLITS[n] || [], rec = recommendSplit(a), cur = a.split || (rec && rec.id);
    const seq = a.customSeq && a.customSeq.length === n ? a.customSeq : (opts.find(o => o.id === cur) || opts[0] || {days:[]}).days.slice();
    const warn = a.split === "custom" ? splitWarnings(seq, a) : [];
    return {title:"Pick a split", body:`${rec ? `<div class="banner info"><b>Recommended for you.</b> ${esc(rec.why)}</div>` : ""}
      <div class="obopts">${opts.map(o => opt("split", o.id, o.name + (rec && o.id === rec.id ? ' <span class="tag rep">Recommended</span>' : ""), o.why + `<br><span class="obseq">${o.days.map(d => T[d].label).join(" · ")}</span>`, cur)).join("")}
      ${opt("split", "custom", "Build your own", "Choose each day yourself. The app tells you honestly if it limits your results.", cur)}</div>
      ${a.split === "custom" ? `<div class="card obcustom">${WD.filter(([k]) => a.days.includes(k)).map(([k,, sh], i) => `<div class="spread"><b>${sh}</b><span class="dd"><select data-cseq="${i}">${TEMPLATE_PICK.map(t => `<option value="${t}" ${seq[i] === t ? "selected" : ""}>${T[t].label}</option>`).join("")}</select></span></div>`).join("")}
        ${warn.length ? `<div class="banner"><b>Heads up.</b> ${warn.map(esc).join(" ")}</div>` : `<div class="obtag ok">Every main muscle trained at least twice a week</div>`}
        <button class="btn ghost" data-aisplit="1" ${F.busy ? "disabled" : ""}>${F.busy ? "Checking…" : "Check it with AJ Training AI"}</button>${F.splitAI ? `<p class="small">${esc(F.splitAI)}</p>` : ""}</div>` : ""}
      <p class="obnote">With the same weekly sets, how you split them matters little; training each muscle at least twice a week keeps sessions shorter and quality high. ${src("frequency")}</p>`};
  }
  case "pri": return {title:"What do you want to bring up?", body:`
    ${a.look ? `<p class="obnote" style="margin-top:0">Pre-filled from your look. Change them freely.</p>` : `<p class="obnote" style="margin-top:0">Pick up to 3, or skip. They get about ${PRIORITY_SETS} sets a week (others ~10-12) and go first in the session while you're fresh.</p>`}
    <div class="chips obbig">${PRIORITY_CHOICES.map(m => chip("pri", m, MUS[m], (a.pri || []).includes(m))).join("")}</div>
    <p class="obnote">Extra weekly sets are what drive the extra growth; going first keeps those sets high quality. ${src("volume")} ${src("order","Order evidence")}</p>`, cta:(a.pri || []).length ? "Continue" : "Skip"};
  case "inj": return {title:"Anything to work around?", body:`
    <p class="obnote" style="margin-top:0">Tap any joint that needs care, and describe it if you like. "Sprained ankle last month" is different from "tight ankles, my heels lift when I squat": the AI reads it and adjusts exercise choices.</p>
    <div class="chips obbig">${INJ.map(([k, n]) => chip("inj", k, n, (a.inj || []).includes(k))).join("")}</div>
    <textarea class="field" rows="3" data-input="injText" placeholder="Optional: what's going on?">${esc(a.injText || "")}</textarea>
    ${(a.injText || "").trim().length > 3 ? `<button class="btn ghost" data-aiinj="1" ${F.busy ? "disabled" : ""}>${F.busy ? "Analysing…" : "Analyse with AJ Training AI"}</button>` : ""}
    ${a.injAI ? `<div class="card obai"><b>What the plan will do</b><span>${esc(a.injAI.summary || "")}</span>${(a.injAI.avoid || []).length ? `<span class="small muted">Avoiding: ${a.injAI.avoid.map(k => L[k] ? L[k].n : k).join(", ")}</span>` : ""}<span class="small muted">This isn't medical advice. Pain that's sharp, worsening or lasting needs a physio or doctor.</span></div>` : ""}`, cta:(a.inj || []).length || a.injText ? "Continue" : "Nothing, skip"};
  case "lifts": { const q = (F.lq || "").toLowerCase(), mf = F.lm || "";
    const list = Object.values(L).filter(e => !["cond","sled","carry","erg"].includes(e.p) && (!q || e.n.toLowerCase().includes(q)) && (!mf || e.mu[mf] >= 1));
    const kit = new Set(a.gyms.flatMap(g => g.kit));
    return {title:"Lifts you love or hate", body:`
      <p class="obnote" style="margin-top:0">Optional. Tap once to <b>star</b> (used whenever the kit allows), twice to <b>ban</b>, three times to reset.</p>
      <label class="sb card"><span>${ICON.search}</span><input data-lq="1" placeholder="Search ${Object.keys(L).length} exercises" value="${esc(F.lq || "")}" autocomplete="off"></label>
      <div class="chips obmf">${["", ...PRIORITY_CHOICES].map(m => `<button class="chip" data-lm="${m}" aria-pressed="${mf === m}">${m ? MUS[m] : "All"}</button>`).join("")}</div>
      <div class="card oblifts" id="oblifts">${liftRows(list, a, kit)}</div>
      <p class="obnote">Lifts marked <em class="tagin">stretch</em> load the muscle hardest when it's lengthened; they're favoured because they tend to grow muscle as well or better. ${src("lengthened")}</p>`, cta:a.love.length || a.ban.length ? "Continue" : "Skip"}; }
  case "block": { const rp = rirPlan(+a.block, a.level, a.ramp);
    return {title:"Block, effort and rest", body:`
    <div class="obfld"><span class="obl">Block length</span>${numSeg("block", 4, 8, a.block, 6)}<span class="obhint">${a.block} weeks: ${a.block - 1} training weeks, then a lighter deload week. Planned deloads every 4-8 weeks are standard practice. ${src("deload")}</span></div>
    <div class="obfld"><span class="obl">Effort</span>
      <div class="obopts">${opt("ramp", "rec", "Recommended for your level", a.level === "new" ? "Start ~3 reps in reserve, settle at 2" : "Start at 1-2 reps in reserve, finish at 0-1", a.ramp)}${a.level !== "new" ? opt("ramp", "close", "Close from day one", "1 rep in reserve from week 1, 0-1 at the end", a.ramp) : ""}${opt("ramp", "steady", "Steady", "2 reps in reserve every week", a.ramp)}</div>
      <div class="obrir">${rp.map((r, i) => `<div class="${r === "DL" ? "dl" : ""}"><span>W${i + 1}</span><b>${r === "DL" ? "Deload" : r + " RIR"}</b></div>`).join("")}</div>
      <span class="obhint">In trained lifters, stopping 1-2 reps short grew muscle as well as going to failure, and growth improves the closer you get. No study has compared ways of ramping effort, so the ramp itself is coaching practice. ${src("rir")}</span></div>
    <div class="obfld"><span class="obl">Rest between sets</span>${seg2("rest", [["short","Shorter"],["std","Standard"],["long","Longer"]], a.rest)}
      <span class="obhint">Standard: big barbell lifts 2.5 min, other compounds 2 min, isolation 90 s${a.goal === "strength" ? ", heavy sets 3.5 min" : ""}. More than 60 s helps growth a little; past ~90 s the difference is small. You can adjust any rest during a workout. ${src("rest")}</span></div>
    <div class="spread"><div class="stack" style="gap:2px"><span class="obl">Supersets to save time</span><span class="obhint">Pairs isolation lifts so they share rest</span></div><button class="switch" data-supers="1" role="switch" aria-checked="${a.supersets !== false}" aria-label="Supersets"><i></i></button></div>
    <div class="obfld"><span class="obl">Holidays or trips coming up?</span><span class="obhint">Add the week. The block pauses and picks up where you left off.</span>
      <div class="obunitrow"><input class="field" type="date" data-input="breakAdd" value="${esc(a.breakAdd || "")}" style="flex:1"><button class="btn small ghost" data-addbreak="1">Add</button></div>
      ${(a.breaks || []).length ? `<div class="chips">${a.breaks.map(b => `<button class="chip" data-delbreak="${b}">Week of ${fmtD(b)} ✕</button>`).join("")}</div>` : ""}</div>
    <label class="lab">Start date<input class="field" type="date" data-input="start" value="${esc(a.start)}"></label>
    <label class="lab">Name<input class="field" data-input="name" value="${esc(a.name)}"></label>`}; }
  case "event": { const E = eventSpec(a);
    return {title:"What's the running goal?", body:`<div class="obopts">${Object.entries(EVENTS).map(([k, e]) => opt("event", k, e.name, e.sub, a.event)).join("")}</div>
    ${a.event === "custom" || a.event === "ultra" ? `<div class="obfld"><span class="obl">Distance</span><div class="obunitrow">${nf("goalKm", "num", a.goalKm, "Distance in km", 100)}<span>km</span><em class="obconv">${esc(E.name)}</em></div>${a.event === "ultra" && +a.goalKm <= 42.2 ? `<span class="obhint bad">An ultra is anything longer than a marathon (42.2 km).</span>` : ""}</div>` : ""}`}; }
  case "racedate": { const w = weeksToReady(a), wks = Math.ceil((parseD(a.raceDate) - parseD(a.start)) / (7 * 864e5)), E = eventSpec(a);
    return {title:"When?", body:`${dateToggle(a)}
      ${a.hasDate ? `<p class="obnote">${wks >= 1 ? `${wks} weeks of training${E.taper ? `, including a ${E.taper}-week taper` : ""}.` : "Pick a date after the start."} ${wks > 0 && wks < w ? `From where you are now, about ${w} weeks would be ideal; the plan will compress the build and keep long-run jumps safe rather than rushing.` : ""} ${src("taper")}</p>` : `<div class="card"><div class="spread"><h3>Estimated time to be ready</h3><b class="num">${w} weeks</b></div><span class="small muted">From your current running, using the plan's own rules: long runs grow about 8% a week, every 4th week is easier, then a taper. Add a date any time.</span></div>`}
      <label class="lab">Plan starts<input class="field" type="date" data-input="start" value="${esc(a.start)}"></label>`}; }
  case "current": return {title:"Where are you now?", body:`
    <div class="obopts">${RUNLEVELS.map(([n, d], i) => `<button class="obopt" data-runlevel="${i}" aria-pressed="${+a.runLevel === i}"><b>${n}</b><span>${d}</span></button>`).join("")}</div>
    ${+a.runLevel > 0 ? `<div class="obfld"><span class="obl">Running per week, lately</span><div class="obunitrow">${nf("weeklyKm", "num", a.weeklyKm, "Kilometres a week", 90)}<span>km</span></div>
      <div class="obslider"><input type="range" min="0" max="150" step="1" value="${a.weeklyKm}" data-range="weeklyKm" aria-label="Kilometres a week"></div></div>
    <div class="obfld"><span class="obl">Longest run in the last 30 days</span><div class="obunitrow">${nf("longest", "num", a.longest, "Longest run in km", 90)}<span>km</span></div>
      <div class="obslider"><input type="range" min="0" max="60" step="1" value="${a.longest}" data-range="longest" aria-label="Longest run"></div>
      <span class="obhint">Long runs never grow more than 10% beyond your longest of the last month: in 5,200 runners, single runs that jumped past that predicted injury. ${src("progression-run")}</span></div>`
    : a.kind === "hyrox" ? `<p class="obnote">Runs start short and easy, with walk breaks whenever you need them; the race-pace work builds gradually.</p>` : `<p class="obnote">You'll start with a 9-week run/walk build (modelled on the NHS Couch to 5K: three sessions a week), then move on to your goal.</p>`}`};
  case "rundays": return {title:"How often can you run?", body:`
    ${numSeg("runs", 2, 7, a.runs, +a.runLevel <= 1 ? 3 : 4)}
    <div class="obfld"><span class="obl">Long run day</span>${seg2("longDay", [["sat","Saturday"],["sun","Sunday"],["wed","Midweek"]], a.longDay)}</div>
    <p class="obnote">No need to fix the other days: they're spread through the week and you can move any run in the Train tab. About 80% of running is easy; hard sessions are capped, not piled on. ${src("intensity")}</p>`};
  case "strength": return {title:"Strength sessions", body:`
    ${numSeg("strengthN", 0, a.kind === "tri" ? 3 : 4, a.strengthN, 2)}
    <p class="obnote">${a.kind === "tri" ? "One or two short sessions help economy and resilience; they're kept away from your long day." : "Two a week through base and build (one in peak and taper) improve running economy by about 2-8%. More is fine if you enjoy it; zero is fine too."} ${src("strength-run")}</p>`};
  case "liftdays": { const sp = sweetSpot({...a, days:Array(+a.strengthN || 3).fill(0)});
    return {title:"Lifting days", body:`${numSeg("strengthN", 2, 5, a.strengthN, 3)}
    <div class="obfld"><span class="obl">Time per lifting session</span><div class="obunitrow">${nf("mins", "num", a.mins, "Minutes per session", 90)}<span>min</span></div>
      <div class="obslider mins"><div class="obsweet" style="left:${(45 - 30) / 90 * 100}%;width:${30 / 90 * 100}%"></div><input type="range" min="30" max="120" step="5" value="${a.mins}" data-range="mins"></div>
      <span class="obhint">${sp.zone[1]}</span></div>
    <p class="obnote">Lifting doesn't blunt your running, and on average running doesn't blunt muscle growth either. Hard leg sessions are kept away from your long run. ${src("interference")}</p>`}; }
  case "hyrox": return {title:"Your HYROX", body:`
    <div class="obfld"><span class="obl">Division</span>${seg2("division", [["Open","Open"],["Pro","Pro"],["Doubles","Doubles"]], a.division)}</div>
    ${dateToggle(a)}
    <p class="obnote">8 × 1 km runs, each followed by a station: SkiErg, sled push, sled pull, burpee broad jumps, row, farmers carry, sandbag lunges, wall balls. In the first lab study of HYROX, finish time tracked aerobic fitness and endurance training, not grip strength or muscle mass, so the plan is running-led. Small study, early evidence.</p>`};
  case "tri": return {title:"Your triathlon", body:`
    <div class="obopts">${Object.entries(TRI).map(([k, d]) => opt("tri", k, d.name, d.sub, a.tri)).join("")}</div>
    <div class="obfld"><span class="obl">Experience</span>${seg2("triLevel", [["0","New"],["1","Some"],["2","Regular"],["3","Racing"]], String(a.triLevel))}</div>
    ${dateToggle(a)}
    <p class="obnote">Ironman athletes spend roughly 70% of their training easy, and more easy volume went with faster times. The weekly brick (a short run straight off the bike) practises the heavy-legs feeling; it's standard practice rather than proven by trials.</p>`};
  case "build": return {title:"", body:`<div class="obbuild"><div class="obspin">${LOGO(72)}</div><h2>Building your plan</h2><div class="obticks" id="obticks"></div></div>`, nofoot:true};
  case "review": return ["gym"].includes(a.kind) ? review(a) : reviewEndu(a);
  }
}
function liftRows(list, a, kit){
  return list.length ? list.slice(0, 60).map(e => { const ok = e.q.every(r => kit.has(r));
    return `<button class="obliftr ${a.love.includes(e.k) ? "love" : a.ban.includes(e.k) ? "ban" : ""}" data-lift="${e.k}"><span><b>${a.love.includes(e.k) ? "★ " : a.ban.includes(e.k) ? "✕ " : ""}${esc(e.n)}</b><em>${MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)] || ""}${e.len === 2 ? " · stretch" : ""}${ok ? "" : " · not in your gym"}</em></span></button>`; }).join("") : `<p class="small muted">No match.</p>`;
}
function seg2(name, opts, cur){ return `<div class="seg obseg" style="grid-template-columns:repeat(${opts.length},1fr)">${opts.map(([k, v]) => `<button data-set="${name}" data-val="${k}" aria-pressed="${k === cur}">${v}</button>`).join("")}</div>`; }

function volChart(prog, gym){
  const v = prog.vol[gym], tg = prog.targets, pri = new Set(prog.setup.pri || []);
  const rows = Object.keys(MUS).filter(m => (tg[m] || 0) > 0 || (v[m] || 0) > 0);
  const mx = Math.max(22, ...rows.map(m => Math.max(v[m] || 0, tg[m] || 0)));
  return `<div class="obvlegend"><span><i class="k1"></i>Planned sets</span><span><i class="k2"></i>Recommended for you</span></div>
    <div class="obvol">${rows.map(m => `<div class="obvr"><span>${MUS[m]}${pri.has(m) ? ' <i class="obpri">★</i>' : ""}</span><span class="obtrack"><b style="width:${Math.min(100, (v[m] || 0) / mx * 100)}%" class="${(v[m] || 0) >= (tg[m] || 0) - 1 ? "ok" : ""}"></b><i style="left:${(tg[m] || 0) / mx * 100}%"></i></span><span class="num small">${r1(v[m] || 0)}<em>/${tg[m] || 0}</em></span></div>`).join("")}</div>
    <span class="small muted">A set counts 1 for the muscle it trains directly and ½ for muscles it helps. The line on each bar is your recommended weekly sets; a solid orange bar has reached it.</span>`;
}
function sessLabel(s2){ return s2.km ? s2.km + " km" : s2.mins ? s2.mins + " min" : ""; }
function reviewEndu(a){
  const prog = F.out, P = prog.endurance, gl = (flowGyms() || gymList()), g = F.gym && gl.some(x => x.id === F.gym) ? F.gym : gl[0].id, byMins = P.unit === "mins" || P.weeks.some(w => w.phase === "Run/walk");
  const val = w => P.unit === "mins" ? w.mins : w.km || (w.mins ? w.mins / 8 : 0);
  const mx = Math.max(...P.weeks.map(val), 10), col = {"Run/walk":"var(--weight)", Base:"var(--cardio)", Build:"var(--orange)", Peak:"var(--prot)", Taper:"var(--carb)"};
  const w0 = P.weeks[0], peak = P.weeks.find(w => w.phase === "Peak") || P.weeks.slice().sort((x, y) => val(y) - val(x))[0];
  const wk = w => WD.filter(([, wd]) => w.sessions[wd] || ((prog.days.find(d => d.wd === wd) || {}).variants && Object.keys((prog.days.find(d => d.wd === wd) || {}).variants || {}).length)).map(([k, wd, sh]) => {
    const s2 = w.sessions[wd], d = prog.days.find(x => x.wd === wd), lift = d && d.variants && (d.variants[g] || []).length;
    return `<div><span><b>${sh} · ${s2 ? RUNTYPE[s2.type].n : ""}${s2 && lift ? " + " : ""}${lift ? "strength" : ""}</b><em>${s2 ? esc(s2.desc || RUNTYPE[s2.type].rpe) : esc(d.focus || "")}</em></span><span class="num">${s2 ? sessLabel(s2) : ""}</span></div>`; }).join("");
  const longest = Math.max(...P.weeks.map(w => w.long || 0));
  const head = P.event === "tri" ? `<div><span>Peak week</span><b>${Math.round(P.peakMins / 60 * 10) / 10} h</b></div>` : P.event === "hyrox" ? `<div><span>Peak running</span><b>${P.peakKm} km</b></div>` : `<div><span>Peak week</span><b>${P.peakKm} km</b></div><div><span>Longest run</span><b>${longest} km</b></div>`;
  return {title:"Your plan", wide:true, body:`
    <div class="obsum"><div class="full"><span>Goal</span><b>${esc(P.eventName)}${P.raceDate ? " · " + fmtD(P.raceDate) : P.estimated ? " · ready in about " + P.weeks.length + " weeks" : ""}</b></div><div><span>Length</span><b>${P.weeks.length} weeks</b></div>${head}</div>
    ${!P.unit && P.event !== "hyrox" && P.event !== "general" && longest < readyLong(eventSpec(a)) * 0.85 ? `<div class="banner"><b>A big stretch from where you are.</b> In ${P.weeks.length} weeks the long run safely reaches ${longest} km, short of the ~${Math.round(readyLong(eventSpec(a)))} km that usually prepares you for ${esc(P.eventName)}. A shorter race first, or a later date, is the safer route.</div>` : ""}
    <div class="card"><h2>Weekly ${P.unit === "mins" ? "training time" : "running"}</h2><div class="ebars">${P.weeks.map(w => `<span title="Week ${w.w}"><i style="height:${val(w) / mx * 100}%;background:${col[w.phase]};opacity:${w.recovery ? .5 : 1}"></i></span>`).join("")}</div>
      <div class="legend">${Object.entries(col).filter(([k]) => P.weeks.some(w => w.phase === k)).map(([k, c]) => `<span><i style="background:${c}"></i>${k}</span>`).join("")}${P.weeks.some(w => w.recovery) ? `<span><i style="background:var(--line)"></i>Easier week</span>` : ""}</div></div>
    <div class="card"><h2>Week 1</h2><div class="oblist">${wk(w0)}</div>${w0.notes.length ? `<p class="small muted">${w0.notes.map(esc).join(". ")}.</p>` : ""}</div>
    <div class="card"><h2>Biggest week (week ${peak.w})</h2><div class="oblist">${wk(peak)}</div>${peak.notes.length ? `<p class="small muted">${peak.notes.map(esc).join(". ")}.</p>` : ""}</div>
    ${prog.days.some(d => d.variants && (d.variants[g] || []).length) ? `<details class="card obdayc"><summary><b>Strength sessions${gl.length > 1 ? " · " + esc((gl.find(x => x.id === g) || {}).name) : ""}</b><span class="small muted">${prog.days.filter(d => d.variants && (d.variants[g] || []).length).length} a week</span></summary>
      ${prog.days.filter(d => d.variants && (d.variants[g] || []).length).map(d => `<div class="oblist"><div><span><b>${WD.find(x => x[0] === d.k)[2]} · ${esc(T[d.tpl] ? T[d.tpl].label : d.label)}</b></span><span></span></div>${(d.variants[g] || []).map(([k, n]) => { const e = prog.exercises[k]; return `<div><span><b>${esc(e.n)}</b><em>${esc(e.m)}</em></span><span class="num">${n} × ${e.lo}–${e.hi}</span></div>`; }).join("")}</div>`).join("")}</details>` : ""}
    <div class="card obwhy"><h2>Why it's built this way</h2>
      ${P.event === "hyrox" ? `<div><b>Running-led</b><span>Most race time is running, and finish time tracked aerobic fitness, not grip or muscle mass (one small study). Station strength twice a week, plus a weekly simulation of running on tired legs.</span></div>`
      : P.event === "tri" ? `<div><b>Mostly easy</b><span>About 70-80% easy across all three sports, like successful Ironman athletes. One or two harder sessions a week once the base is built.</span></div><div><b>Brick</b><span>A short run straight off the long ride each week, so the heavy-legs feeling is familiar on race day. Standard practice rather than trial-proven.</span></div>`
      : `<div><b>Easy most days</b><span>About 80% of running easy, 20% hard. Polarised and pyramidal mixes both work; piling on hard sessions doesn't. ${src("intensity")}</span></div>
      <div><b>Long run limit</b><span>Never more than 10% beyond your longest run of the last 30 days, the clearest injury signal in 5,200 runners. ${src("progression-run")}</span></div>`}
      ${P.weeks.some(w => w.phase === "Run/walk") ? `<div><b>Run/walk start</b><span>Nine weeks of run/walk sessions, three a week, modelled on the NHS Couch to 5K.</span></div>` : ""}
      ${P.raceDate || P.weeks.some(w => w.phase === "Taper") ? `<div><b>Taper</b><span>Volume drops 40-60% in the last 1-2 weeks while intensity stays. ${src("taper")}</span></div>` : ""}
      ${prog.days.some(d => d.variants && Object.keys(d.variants).length) && P.event !== "hyrox" ? `<div><b>Strength</b><span>Kept away from the long day. For runners, 2 sessions a week improve running economy about 2-8%. ${src("strength-run")}</span></div>` : ""}
      ${(EVENTS[P.event] || {}).heat ? `<div><b>Heat</b><span>10-14 heat sessions in the last ~2.5 weeks; most adaptation comes in the first 4-7 days. ${src("heat")}</span></div>` : ""}
      ${longest * 6 >= 90 ? `<div><b>Fuelling</b><span>Practise 60-90 g carbohydrate an hour on long runs so your gut can take it on race day. ${src("fuel")}</span></div>` : ""}
      <div><b>Easier weeks</b><span>Every 4th week drops about 20%. This is coaching convention rather than trial evidence.</span></div>
    </div>`, cta:"Save plan"};
}
function review(a){
  const prog = F.out, gl = (flowGyms() || gymList()), g = F.gym && gl.some(x => x.id === F.gym) ? F.gym : gl[0].id, gn = id => { const n = (gl.find(x => x.id === id) || {}).name || ""; return n.length > 12 ? n.split(/\s+/).map(w => w[0]).join("").toUpperCase() : n; };
  const train = prog.days.filter(d => !d.rest), su = prog.setup;
  const reps = su.level === "new" ? "Compounds 8-12 reps, isolation 10-15 while you learn the lifts." : su.goal === "strength" ? "Main barbell lifts 3-6 reps for strength; the rest 6-15 reps for muscle." : su.goal === "power" ? "One heavy lift a day (4-6 reps), the rest 6-15 reps." : "Mostly 6-15 reps. Muscle grows similarly from about 6 to 30 reps when sets end close to failure; heavier loads mainly build more maximal strength.";
  return {title:"Your block", wide:true, body:`
    <div class="obsum"><div class="full"><span>Split</span><b>${esc(prog.splitName)}</b></div><div><span>Block</span><b>${prog.deloadEvery} weeks</b></div><div><span>Starts</span><b>${fmtD(prog.startDate)}</b></div><div><span>Days</span><b>${train.length} a week</b></div></div>
    <div class="obweek">${prog.days.map(d => `<div class="${d.rest ? "rest" : ""}"><span>${WD.find(x => x[0] === d.k)[2]}</span><b>${d.rest ? "–" : esc(d.label.replace("Upper ","U").replace("Lower ","L").replace("Full body ","FB").replace("Arms & delts","Arms").replace("Glutes & legs","Glutes").replace("Strength + conditioning ","S+C ").replace("HYROX strength ","HY "))}</b><em>${d.rest || gl.length < 2 ? "" : esc(gn(d.gym))}</em></div>`).join("")}</div>
    ${(() => { const v = prog.vol[g] || {}, sh = (su.pri || []).filter(m => (v[m] || 0) < (prog.targets[m] || 0) - 1.5); return sh.length ? `<div class="banner info"><b>Not enough time for full priority volume.</b> ${sh.map(m => MUS[m] + " " + r1(v[m] || 0) + " of " + prog.targets[m]).join(", ")} sets. Add about 15 min per session or another day, or drop a priority.</div>` : ""; })()}
    ${(() => { const v = prog.vol[g] || {}, tg = prog.targets, tot = Object.keys(tg).reduce((x, m) => x + Math.min(v[m] || 0, tg[m]), 0), all = Object.values(tg).reduce((x, y) => x + y, 0), pct = Math.round(tot / all * 100);
      return pct < 85 ? `<div class="banner info"><b>${pct}% of the recommended weekly sets fit.</b> ${a.mins} min sessions on ${train.length} days can't hold it all. Every set still counts, and growth keeps coming from less; for the full dose add about ${Math.round((1 - tot / all) * all * 2.4 / train.length / 5) * 5 + 5} min a session or another day. <button class="obsrc" data-bumpmins="15">Add 15 min and rebuild</button></div>` : ""; })()}
    ${su.split === "custom" && splitWarnings(prog.days.filter(d => !d.rest).map(d => d.tpl), su).length ? `<div class="banner"><b>Your custom split.</b> ${splitWarnings(prog.days.filter(d => !d.rest).map(d => d.tpl), su).map(esc).join(" ")}</div>` : ""}
    <div class="card"><div class="spread"><h2>Weekly sets</h2>${gl.length > 1 ? seg2("_gym", gl.map(x => [x.id, gn(x.id)]), g) : ""}</div>${volChart(prog, g)}
      <p class="small muted">${gl.length > 1 ? `Shown for a week done entirely at ${esc(gn(g))}.` : ""} ${src("volume")}</p></div>
    ${train.map(d => { const list = d.variants[g] || [], mins = prog.mins[g][prog.days.filter(x => !x.rest).indexOf(d)];
      return `<details class="card obdayc"><summary><div class="stack" style="gap:2px"><b>${WD.find(x => x[0] === d.k)[2]} · ${esc(d.label)}</b><span class="small muted">${esc(d.focus)}</span></div><span class="small muted num">${list.reduce((s2, x) => s2 + x[1], 0)} sets · ~${Math.round(mins)} min</span></summary>
        <div class="oblist">${list.map(([k, n, ss]) => { const e = prog.exercises[k]; return `<div><span><b>${ss ? `<i class="obss">${ss}</i>` : ""}${esc(e.n)}</b><em>${esc(e.m)}${e.len === 2 ? " · stretch" : ""}</em></span><span class="num">${n} × ${e.lo}–${e.hi}<em>${e.rest >= 60 ? Math.round(e.rest / 60 * 10) / 10 + " min" : e.rest + " s"} rest</em></span></div>`; }).join("")}</div>
        <p class="small muted">${esc(d.cardio)}.</p></details>`; }).join("")}
    <div class="card obwhy"><h2>Why it's built this way</h2>
      <div><b>Volume</b><span>${su.level === "new" ? "Fewer sets while you're new: you grow from less." : `~10-12 sets a week per muscle, ~${PRIORITY_SETS} for priorities.`} Gains rise with sets but flatten off. ${src("volume")}</span></div>
      <div><b>Frequency</b><span>Most muscles twice a week, so no session gets bloated. ${src("frequency")}</span></div>
      <div><b>Effort</b><span>RIR ${prog.rir.filter(r => r !== "DL").join(" → ")}, then deload. Trained lifters grow as much stopping 1-2 reps short as at failure; growth improves closer to failure. ${src("rir")}</span></div>
      <div><b>Reps</b><span>${reps} ${src("load")}</span></div>
      ${su.supersets !== false ? `<div><b>Supersets</b><span>Isolation lifts for different muscles are paired (A1, A2…) and share rest, which fits more sets into the same time without hurting performance much. Turn off on the block step. ${src("superset")}</span></div>` : ""}
      <div><b>Rest</b><span>Big barbell lifts ~2.5 min, other compounds ~2 min, isolation ~90 s${su.rest && su.rest !== "std" ? ` (${su.rest === "short" ? "shortened" : "lengthened"} to your preference)` : ""}. Adjustable during any workout. ${src("rest")}</span></div>
      <div><b>Exercise choice</b><span>Stretch-biased lifts are favoured${su.level === "new" ? ", with stable machines while you learn" : ""}. ${src("lengthened")}</span></div>
      <div><b>Progression</b><span>Double progression: add reps across the range, then add load. ${src("progression")}</span></div>
      <div><b>Deload</b><span>Every ${prog.deloadEvery}th week, half the sets at ~3 RIR${(prog.breaks || []).length ? `. Breaks: ${prog.breaks.map(fmtD).join(", ")} (the block pauses)` : ""}. ${src("deload")}</span></div>
      ${su.goal === "crossfit" ? `<div><b>Conditioning</b><span>Each day ends with a short conditioning piece. Reviews of CrossFit-style training find too few good studies to promise specific results, and most injuries are shoulder, spine and knee: warm up well and keep technique first.</span></div>` : ""}
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
  if (o){ o.removeAttribute("id"); o.classList.add("out"); setTimeout(() => o.remove(), 240); }
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
  const blocked = F.kind === "prog" && F.step === "days" && F.ans.kind === "gym" && F.ans.days.length < 1;
  const scrollY = o.querySelector(".obbody") ? o.querySelector(".obbody").scrollTop : 0;
  const openD = F.keepScroll ? [...o.querySelectorAll("details[open] summary b")].map(x => x.textContent) : [];
  const ae = document.activeElement, focusKey = ae && o.contains(ae) && (ae.dataset.conv ? `[data-key="${ae.dataset.key}"][data-conv="${ae.dataset.conv}"]` : ae.dataset.input ? `[data-input="${ae.dataset.input}"]` : ae.dataset.dob ? "[data-dob]" : null);
  const markup = `<div class="obtop"><button class="iconbtn" data-ob="back" aria-label="Back">${ICON.back}</button>
      <div class="obprog"><i style="width:${(i + 1) / steps.length * 100}%"></i></div><button class="iconbtn" data-ob="close" aria-label="Close">✕</button></div>
    <div class="obbody ${s.wide ? "wide" : ""} ${s.cls || ""}">${s.title ? `<h1 class="obtitle">${s.title}</h1>` : ""}${s.body}</div>
    ${s.nofoot ? "" : `<div class="obfoot">${s.alt ? `<button class="btn ghost" data-ob="alt">${s.alt}</button>` : ""}<button class="btn orange" data-ob="next" ${blocked ? "disabled" : ""}>${s.cta || "Continue"}</button></div>`}`;
  // Same screen: update in place, element by element, so nothing flashes or jumps. New screen: render fresh.
  if (o.dataset.step === F.kind + ":" + F.step && !F.dir && o.children.length){
    const tmp = document.createElement("div"); tmp.innerHTML = markup;
    if (tmp.children.length === o.children.length){ [...o.children].forEach((c, k) => patchDeep(c, tmp.children[k], null)); fillRanges(o); fitCheck(); F.keepScroll = false; if (F.step === "build") runBuild(); return; }
  }
  o.innerHTML = markup; o.dataset.step = F.kind + ":" + F.step;
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
  if (F.kind === "prog" && F.step === "build") return;
  if (F.kind === "nut" && F.step === "review") return acceptNut();
  if (F.kind === "welcome" && F.step === "next") return acceptWelcome("home");
  if (F.kind === "welcome" && F.step === "sections" && !F.ans.mods.length){ toast("Pick at least one"); return; }
  if (F.kind === "welcome" && F.step === "about" && !F.ans.sex){ toast("Choose one so the energy maths is right"); return; }
  if (F.kind === "welcome" && F.step === "about" && F.ans.dob && !parseDob(F.ans.dob)){ toast("Enter your date of birth as DD/MM/YYYY, or leave it blank"); return; }
  if (F.kind === "nut" && F.single && F.step === "activity"){ F.accepted = true; S.profile.activity = clone(F.ans.activity); saveProfile(); toast("Activity saved: starting estimate " + fmtN(priorModel(currentKg()).total) + " kcal"); return close(); }
  if (F.kind === "prog"){
    const a = F.ans;
    if (F.step === "goal" && !a.gtype){ toast("Pick one"); return; }
    if (F.step === "custom"){ if (!a.customAI) customFallback(a); a.customDone = true; const st = stepsOf(); return go2(st[st.indexOf("goal") + 1] || "build"); }
    if (F.step === "look" && !a.look){ toast("Pick a look, or go back and choose another goal"); return; }
    if (F.step === "days" && a.kind === "gym" && !a.days.length){ toast("Pick at least one day"); return; }
    if (F.step === "event" && a.event === "ultra" && !(+a.goalKm > 42.2)){ toast("An ultra is anything longer than 42.2 km"); return; }
    if (F.step === "rundays"){ a.runDays = spreadDays(+a.runs, a.longDay); }
    if (F.step === "gyms"){ a.kit = Object.fromEntries(a.gyms.map(g => [g.id, g.kit.slice()])); }
    if (F.step === "split"){ const r = recommendSplit(a); if (!a.split) a.split = r ? r.id : (SPLITS[a.days.length] || [])[0]?.id; if (a.split === "custom" && !(a.customSeq && a.customSeq.length === a.days.length)) a.customSeq = ((SPLITS[a.days.length] || [])[0] || {days:[]}).days.slice(); }
  }
  go2(steps[Math.min(steps.length - 1, i + 1)]);
}
function back(){ const steps = stepsOf(), i = steps.indexOf(F.step); if (F.step === "custom" || i < 0){ return go2("goal", "back"); } if (i <= 0) return close(); go2(steps[F.step === "review" && F.kind === "prog" ? i - 2 : i - 1], "back"); }
function runBuild(){
  const a = F.ans, k = a.kind;
  const lines = k === "gym" ? [a.goal === "crossfit" ? "Mixing strength and conditioning" : "Choosing your split", "Placing sessions around your week", ...(flowGyms() || gymList()).map(g => "Picking exercises for " + g.name), "Setting weekly volume per muscle", "Fitting sessions into " + a.mins + " min", "Planning effort, rest and the deload"]
    : k === "hyrox" ? ["Mapping the weeks to " + (a.hasDate ? "race day" : "a 12-week build"), "Setting run intervals at race pace", "Building race simulations", "Writing station strength", "Planning recovery weeks"]
    : k === "tri" ? ["Mapping the weeks to " + (a.hasDate ? "race day" : "your distance"), "Balancing swim, bike and run", "Keeping most of it easy", "Adding the weekly brick", ...(+a.strengthN ? ["Writing strength sessions"] : []), "Planning the taper"]
    : ["Mapping the weeks to " + (a.event === "general" ? "your goal" : a.hasDate ? "race day" : "being ready"), ...(+a.runLevel === 0 ? ["Starting with a run/walk build"] : []), "Splitting base, build, peak" + (a.event === "general" ? "" : " and taper"), "Setting the long-run progression", "Balancing easy and hard runs", ...(+a.strengthN ? ["Writing strength sessions"] : []), ...((EVENTS[a.event] || {}).heat ? ["Adding pack and heat training"] : [])];
  const box = document.getElementById("obticks"); let n = 0;
  if (k === "gym"){ if (a.split !== "custom" && (!a.split || !(SPLITS[a.days.length] || []).some(s => s.id === a.split))){ const r = recommendSplit(a); a.split = r ? r.id : (SPLITS[a.days.length] || [])[0]?.id; } F.out = generate(a, F.seed); }
  else F.out = generateEndu(F.ans, F.seed);
  const t = setInterval(() => {
    if (!box.isConnected){ clearInterval(t); return; }
    box.innerHTML = lines.slice(0, n + 1).map((l, j) => `<div class="${j < n ? "done" : ""}"><i>${j < n ? "✓" : ""}</i>${l}</div>`).join("");
    if (++n > lines.length){ clearInterval(t); F.gym = null; go2("review"); }
  }, 260);
}
function acceptProg(){
  const p = F.out; delete p.vol; const keep = clone(p);
  S.profile = {...S.profile, gyms:clone(F.ans.gyms || gymList()).map(g => ({...g, kit:(F.ans.kit || {})[g.id] || g.kit}))}; saveProfile();
  S.prog = keep; if (db) putDocP(keep); else lsSet("prog", keep);
  clearDraft("prog"); S.planView = "today"; close(); go("plan"); toast("Plan saved. Week 1 starts " + fmtD(keep.startDate));
}
function putDocP(p){ try{ queue("programme/current", () => db.doc("programme/current").set(p)); }catch(e){ console.warn(e); } }
function acceptNut(){
  const a = F.ans, kg = currentKg();
  S.profile.goal = Object.assign({}, a, {startKg:r1(kg), startDate:ymd(new Date()), set:Date.now(), rate:+a.rate, prot:+a.prot, targetKg:+a.targetKg});
  F.accepted = true; S.profile.activity = clone(a.activity); delete S.profile.goal.activity;
  S.profile.phase = GOALS[a.type].phase; S.profile.nutrition = Object.assign({}, S.profile.nutrition, {mode:"auto"});
  saveProfile(); clearDraft("nut"); close(); go("food"); toast("Targets set: " + fmtN(targets().kcal) + " kcal");
}
/* ---------- AJ Training AI helpers for the plan builder ---------- */
const KW = [["hyrox","hyrox"],["triathlon|ironman|70\\.3","tri"],["crossfit|wod|functional","crossfit"],["marathon|half|10k|5k|run|ultra|trail|parkrun","run"],["strength|powerlift|1rm|squat|bench|deadlift|pull-up|pullup","strength"],["glute|toned|abs|lean|aesthetic|physique|look","aesthetic"],["rugby|football|soccer|tennis|padel|basketball|hockey|cricket|boxing|mma|bjj|ski|hike|climb|kilimanjaro","gymcardio"]];
function customFallback(a){ const t = (a.customText || "").toLowerCase(); const hit = KW.find(([re]) => new RegExp(re).test(t)); setGtype(a, hit ? hit[1] : "muscle"); a.customDone = true;
  const ev = /ultra/.test(t) ? "ultra" : /half/.test(t) ? "half" : /marathon/.test(t) ? "marathon" : /10 ?k/.test(t) ? "10k" : /5 ?k|parkrun/.test(t) ? "5k" : null; if (ev) a.event = ev; }
async function aiJson(prompt){ if (!window.sampler && typeof sampler === "undefined") throw new Error("noai"); const sm = typeof sampler !== "undefined" ? sampler : window.sampler; if (!sm) throw new Error("noai"); return await sm.json(prompt, {modelTier:"default"}); }
async function aiCustom(){
  const a = F.ans; if (!(a.customText || "").trim()){ toast("Describe your goal first"); return; }
  F.busy = true; F.keepScroll = true; draw();
  try{
    const r = await aiJson(`You map a person's training goal to a plan type for an evidence-based fitness app. Goal, in their words: """${a.customText.slice(0, 800)}"""
Plan types: muscle (hypertrophy), strength, power (powerbuilding), aesthetic, gymcardio (lifting plus some cardio, also for sport pre-season or hiking prep), run (running; give event "5k","10k","half","marathon","ultra","general" or "custom" with goalKm), hybrid (lifting and running), hyrox, crossfit, tri (triathlon; tri "sprint","olympic","half","full").
Reply with only JSON: {"gtype": one of the types, "title": short plan title, "summary": one or two plain sentences on how the plan will serve the goal, "notes": one sentence of honest caveats or "" , "event": string or null, "goalKm": number or null, "tri": string or null, "pri": [up to 3 of chest,lats,upback,sdelt,rdelt,biceps,triceps,quads,hams,glutes,calves,abs], "nDays": number or null}`);
    if (!r || !GTYPES[r.gtype] || r.gtype === "custom") throw new Error("bad");
    a.customAI = {title:String(r.title || "").slice(0, 80), summary:String(r.summary || "").slice(0, 400), notes:String(r.notes || "").slice(0, 300)};
    setGtype(a, r.gtype); a.gtypeFrom = "custom";
    if (r.event && EVENTS[r.event]) a.event = r.event; if (+r.goalKm) a.goalKm = +r.goalKm; if (r.tri && TRI[r.tri]) a.tri = r.tri;
    if (Array.isArray(r.pri)) a.pri = r.pri.filter(m => PRIORITY_CHOICES.includes(m)).slice(0, 3);
    if (+r.nDays >= 1 && +r.nDays <= 7){ a.nDays = +r.nDays; if (a.kind === "gym") a.days = DAYPICK[+r.nDays].slice(); }
  }catch(e){ customFallback(a); a.customAI = {title:GTYPES[a.gtype][2], summary:"AJ Training AI isn't available right now, so this was matched from your words. Check the next steps.", notes:""}; }
  F.busy = false; saveDraft(); F.keepScroll = true; draw();
}
async function aiInjury(){
  const a = F.ans; F.busy = true; F.keepScroll = true; draw();
  const lib = Object.values(L).map(e => `${e.k}: ${e.n}`).join("; ");
  try{
    const r = await aiJson(`You adapt exercise selection for someone with a joint issue in a strength app. This is not diagnosis. Their words: """${(a.injText || "").slice(0, 600)}""". Joints they ticked: ${(a.inj || []).join(", ") || "none"}.
Exercise library (key: name): ${lib}.
Pick exercises to avoid (only if they'd likely aggravate it) and joints to protect from: shoulder, elbow, wrist, lowback, hip, knee, ankle. Mobility limits (e.g. tight ankles) usually need a substitution or setup change (heel elevation), not avoidance.
Reply with only JSON: {"summary": two plain sentences on what the plan will change and one setup tip, "avoid": [keys], "joints": [joint keys]}`);
    a.injAI = {summary:String(r.summary || "").slice(0, 500), avoid:(r.avoid || []).filter(k => L[k]).slice(0, 15)};
    a.injAvoid = a.injAI.avoid.slice(); a.inj = [...new Set([...(a.inj || []), ...(r.joints || []).filter(j => INJ.some(x => x[0] === j))])];
  }catch(e){
    const t = (a.injText || "").toLowerCase(), add = INJ.filter(([k, n]) => t.includes(n.toLowerCase()) || (k === "lowback" && /back/.test(t))).map(x => x[0]);
    a.inj = [...new Set([...(a.inj || []), ...add])];
    a.injAI = {summary:(add.length ? "Matched from your words: lifts that load your " + add.map(k => INJ.find(x => x[0] === k)[1].toLowerCase()).join(" and ") + " hardest are swapped for friendlier options." : "Noted.") + " AJ Training AI isn't available right now for a fuller read.", avoid:[]};
  }
  F.busy = false; saveDraft(); F.keepScroll = true; draw();
}
async function aiSplit(){
  const a = F.ans; F.busy = true; F.keepScroll = true; draw();
  try{
    const r = await aiJson(`Assess this weekly training split for someone whose goal is ${GTYPES[a.gtype] ? GTYPES[a.gtype][2] : "muscle"}, level ${a.level}, priorities ${(a.pri || []).join(", ") || "none"}, ${a.mins} min sessions.
Days: ${a.customSeq.map((t, i) => (a.days[i] || "") + " " + T[t].label + " (" + T[t].slots.join(", ") + ")").join("; ")}.
Use current evidence (weekly sets per muscle, training each muscle about twice a week, recovery between similar sessions). Be honest and specific, no hype.
Reply with only JSON: {"verdict": up to 3 short sentences: what works, what limits results, one concrete change if needed}`);
    F.splitAI = String(r.verdict || "").slice(0, 600);
  }catch(e){ F.splitAI = "AJ Training AI isn't available right now. The checks above still apply."; }
  F.busy = false; F.keepScroll = true; draw();
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
      let v = b.dataset.val; if (["block","prot","nDays","runs","strengthN","triLevel"].includes(b.dataset.set) || /^gyms\.\d+\.(dbStep|plate)$/.test(b.dataset.set)) v = +v;
      if (b.dataset.set === "hasDate") v = v === "yes";
      if (b.dataset.set === "gtype"){ setGtype(F.ans, v); F.ans.customDone = false; saveDraft(); F.keepScroll = true; draw(); setTimeout(() => { if (F) next(); }, 220); return; }
      setPath(F.ans, b.dataset.set, v);
      if (b.dataset.set === "runs" || b.dataset.set === "longDay") F.ans.runDays = null;
      if (b.dataset.set === "split" && v !== "custom") F.splitAI = null;
      if (b.dataset.set.startsWith("activity.")) S.profile.activity = clone(F.ans.activity);
      if (b.dataset.set.startsWith("units.")){ S.profile = {...S.profile, units:Object.assign({}, S.profile.units, F.ans.units)}; saveProfile(); }
      if (b.dataset.set === "type"){ const kg = currentKg(); F.ans.rate = GOALS[v].def; F.ans.prot = v === "cut" ? 2.2 : 2.0; F.ans.targetKg = r1(v === "cut" ? kg * 0.94 : v === "bulk" ? kg * 1.05 : kg); }
      saveDraft(); F.keepScroll = true; draw();
      if (b.classList.contains("obopt") && (["level","type"].includes(b.dataset.set) || (b.dataset.set === "event" && !["custom","ultra"].includes(v)))) setTimeout(() => { if (F) next(); }, 220);
      return;
    }
    if (b.dataset.tog){
      const path = b.dataset.tog, cur = getPath(F.ans, path) || [], v = b.dataset.val;
      let nv = cur.includes(v) ? cur.filter(x => x !== v) : cur.concat(v);
      if (path === "pri" && nv.length > 3) nv = nv.slice(1);
      setPath(F.ans, path, nv);
      if (path === "days"){ F.ans.gymOf = F.ans.gymOf || {}; nv.forEach(k => { if (!(flowGyms() || gymList()).some(g => g.id === F.ans.gymOf[k])) F.ans.gymOf[k] = (flowGyms() || gymList())[0].id; }); F.ans.split = null; }
      saveDraft(); F.keepScroll = true; draw(); return;
    }
    if (b.dataset.lift){
      const k = b.dataset.lift, a = F.ans;
      if (a.love.includes(k)){ a.love = a.love.filter(x => x !== k); a.ban.push(k); }
      else if (a.ban.includes(k)) a.ban = a.ban.filter(x => x !== k);
      else a.love.push(k);
      saveDraft(); F.keepScroll = true; draw(); return;
    }
    const a = F.ans, redraw = () => { saveDraft(); F.keepScroll = true; draw(); };
    if (b.dataset.aicustom) return aiCustom();
    if (b.dataset.aiinj) return aiInjury();
    if (b.dataset.aisplit) return aiSplit();
    if (b.dataset.look){ const sx = [...LOOKS.male, ...LOOKS.female].find(l => l[0] === b.dataset.look); a.look = sx[0]; a.pri = sx[3].slice(); redraw(); setTimeout(() => { if (F) next(); }, 220); return; }
    if (b.dataset.runlevel != null){ const lv = RUNLEVELS[+b.dataset.runlevel]; a.runLevel = +b.dataset.runlevel; a.weeklyKm = lv[2]; a.longest = lv[3]; a.runs = lv[4]; return redraw(); }
    if (b.dataset.gpreset){ const g = a.gyms.find(x => x.id === b.dataset.g); g.kit = PRESETS[b.dataset.gpreset][2].slice(); if (g.name === "New gym" || /^Gym \d/.test(g.name)) g.name = PRESETS[b.dataset.gpreset][0]; toast(PRESETS[b.dataset.gpreset][0] + " preset: now untick anything it doesn't have"); return redraw(); }
    if (b.dataset.gkit){ const g = a.gyms.find(x => x.id === b.dataset.g), k = b.dataset.gkit; g.kit = g.kit.includes(k) ? g.kit.filter(x => x !== k) : g.kit.concat(k); F.openEq = g.id + EQG.findIndex(q => q[1].some(x => x[0] === k)); return redraw(); }
    if (b.dataset.gall != null){ e.preventDefault(); const g = a.gyms.find(x => x.id === b.dataset.g), items = EQG[+b.dataset.gall][1].map(x => x[0]), all = items.every(k => g.kit.includes(k)); g.kit = all ? g.kit.filter(k => !items.includes(k)) : [...new Set(g.kit.concat(items))]; F.openEq = g.id + b.dataset.gall; return redraw(); }
    if (b.dataset.gadd){ a.gyms.push({id:uid("g"), name:"Gym " + (a.gyms.length + 1), kit:PRESETS.commercial[2].slice(), dbMax:40, dbStep:2, plate:1.25}); return redraw(); }
    if (b.dataset.gdel){ a.gyms = a.gyms.filter(g => g.id !== b.dataset.gdel); return redraw(); }
    if (b.dataset.sport){ a.sports = (a.sports || []).concat({id:b.dataset.sport, n:1}); F.sq = ""; return redraw(); }
    if (b.dataset.sportn){ a.sports = a.sports.map(x => x.id === b.dataset.sportn ? {...x, n:x.n + (+b.dataset.d)} : x).filter(x => x.n > 0); return redraw(); }
    if (b.dataset.lm != null){ F.lm = b.dataset.lm; F.keepScroll = true; return draw(); }
    if (b.dataset.supers){ a.supersets = a.supersets === false; return redraw(); }
    if (b.dataset.bumpmins){ a.mins = Math.min(120, +a.mins + 15); F.out = a.kind === "gym" ? generate(a, F.seed) : generateEndu(a, F.seed); toast("Sessions now " + a.mins + " min"); return redraw(); }
    if (b.dataset.addbreak){ const d = a.breakAdd; if (!d){ toast("Pick a date in that week"); return; } const ws = ymd(weekStart(parseD(d))); a.breaks = [...new Set([...(a.breaks || []), ws])].sort(); a.breakAdd = ""; return redraw(); }
    if (b.dataset.delbreak){ a.breaks = (a.breaks || []).filter(x => x !== b.dataset.delbreak); return redraw(); }
    if (b.dataset.setsteps){ F.ans.activity.steps = +b.dataset.setsteps; F.ans.activity.guess = !!b.closest(".obguess"); S.profile.activity = clone(F.ans.activity); saveDraft(); F.keepScroll = true; draw(); return; }
    if (b.dataset.bf){ F.ans.bf = +b.dataset.bf; commitBf(); F.keepScroll = true; draw(); return; }
    if (b.dataset.bump){ const k = b.dataset.bump; let v = r1((+F.ans[k]) + (+b.dataset.d)); if (k === "targetKg"){ const [lo, hi] = targetBounds(F.ans.type, currentKg()); v = Math.min(hi, Math.max(lo, v)); } F.ans[k] = v; saveDraft(); F.keepScroll = true; draw(); return; }
  });
  o.addEventListener("input", e => {
    const t = e.target;
    if (t.dataset.range){ setPath(F.ans, t.dataset.range, +t.value); if (t.dataset.range.startsWith("activity.")) S.profile.activity = clone(F.ans.activity); saveDraft(); liveRange(t); }
    if (t.dataset.input){ F.ans[t.dataset.input] = t.value; saveDraft(); }
    if (t.dataset.sq){ F.sq = t.value; const q = t.value.toLowerCase(), box = document.getElementById("obsq"); if (box && window.AJSports) box.innerHTML = AJSports.search(q).slice(0, q ? 12 : 0).filter(k => !(F.ans.sports || []).some(x => x.id === k)).map(k => `<button class="chip" data-sport="${k}">+ ${esc(AJSports.SP[k][0])}</button>`).join(""); return; }
    if (t.dataset.lq){ F.lq = t.value; const box = document.getElementById("oblifts"); const q = t.value.toLowerCase(), mf = F.lm || ""; if (box) box.innerHTML = liftRows(Object.values(L).filter(e => !["cond","sled","carry","erg"].includes(e.p) && (!q || e.n.toLowerCase().includes(q)) && (!mf || e.mu[mf] >= 1)), F.ans, new Set(F.ans.gyms.flatMap(g => g.kit))); return; }
    if (t.dataset.gname){ const g = F.ans.gyms.find(x => x.id === t.dataset.gname); if (g) g.name = t.value; saveDraft(); return; }
    if (t.dataset.dob){ const v = fmtDob(t.value); if (v !== t.value) t.value = v; F.ans.dob = v; saveDraft(); liveRange(t); }
    if (t.dataset.conv){ const v = readConv(t.closest(".obunitrow"), t.dataset.key); if (v != null){ setConv(t.dataset.key, v, false); liveRange(t); } }
  });
  o.addEventListener("change", e => { const t = e.target;
    if (t.dataset.cseq != null){ const a = F.ans; a.customSeq = (a.customSeq && a.customSeq.length === a.days.length ? a.customSeq : ((SPLITS[a.days.length] || [])[0] || {days:[]}).days.slice()); a.customSeq[+t.dataset.cseq] = t.value; F.splitAI = null; saveDraft(); F.keepScroll = true; return draw(); }
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
// Minimal DOM update: keeps elements (and so focus, scroll, slider drags and open details) and changes only what differs.
function patchDeep(a, b, t){
  if (a === t) return;
  if (!a.contains(t) && norm(a) === b.outerHTML) return;
  if (a.tagName !== b.tagName || a.childNodes.length !== b.childNodes.length){ if (a.contains(t)) return; a.replaceWith(b); return; }
  for (const at of [...b.attributes]){ if (a.getAttribute(at.name) !== at.value){ if (at.name === "style" && /--[ip]\s*:/.test(a.getAttribute("style") || "")) continue; a.setAttribute(at.name, at.value); if (at.name === "value" && "value" in a && a !== document.activeElement) a.value = at.value; } }
  for (const at of [...a.attributes]) if (!b.hasAttribute(at.name) && !["open","style"].includes(at.name)) a.removeAttribute(at.name);
  const an = [...a.childNodes], bn = [...b.childNodes];
  an.forEach((n, k) => { const m = bn[k]; if (n.nodeType === 3){ if (n.textContent !== m.textContent) n.textContent = m.textContent; } else if (n.nodeType === 1){ if (m.nodeType !== 1) n.replaceWith(m); else patchDeep(n, m, t); } });
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
  if (body.children.length !== tmp.children.length){ F.keepScroll = true; return draw(); }
  [...body.children].forEach((c, k) => patchDeep(c, tmp.children[k], t));
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
    if (F.step === "build" || F.step === "review"){ const st = stepsOf(); F.step = st[Math.max(0, st.indexOf("build") - 1)]; }
    if (!stepsOf().includes(F.step)) F.step = "intro";
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
  lib:L, MUS, fmtH, generate, generateEndu, enduPlan, EVENTS, RUNTYPE, KIT_DEFAULT, targetsFor, EQUIP
};
})();
