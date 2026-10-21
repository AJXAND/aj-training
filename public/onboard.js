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
// Fractional weekly sets (Pelland 2026: ~10-14 typical, 4 minimum, diminishing returns). Front delts, rear delts and arms already get
// a lot from presses and rows at ½ a set each, so their direct work stays small.
const BASE_SETS = {chest:12, lats:12, upback:12, fdelt:8, sdelt:12, rdelt:10, biceps:10, triceps:10, quads:12, hams:11, glutes:10, adductors:6, calves:10, abs:8};
const PRIORITY_SETS = 20;
const PRIORITY_CHOICES = ["chest","lats","upback","sdelt","rdelt","biceps","triceps","quads","hams","glutes","calves","abs"];

/* ---------- Equipment ---------- */
const EQG = [
  ["Bars and plates", [["bb","Olympic barbell + plates"],["ez","EZ curl bar"],["trapbar","Trap / hex bar"],["ssb","Safety squat bar"],["swissbar","Swiss / football bar"],["cambered","Cambered bar"],["axle","Axle / fat bar"],["fixedbb","Fixed-weight barbells"],["landmine","Landmine"],["chains","Chains"]]],
  ["Racks and benches", [["rack","Power rack / squat rack"],["halfrack","Half rack / squat stands"],["bench","Adjustable bench"],["flatbench","Flat bench"],["declinebench","Decline bench"],["benchrack","Bench press station"],["inclinestation","Incline bench station"],["preacher","Preacher bench"],["platform","Deadlift platform"],["jhooks","Spotter / safety arms"]]],
  ["Dumbbells and kettlebells", [["db","Dumbbells"],["kb","Kettlebells"],["adjdb","Adjustable dumbbells"]]],
  ["Bodyweight and accessories", [["pullup","Pull-up bar"],["dip","Dip bars"],["rings","Gymnastic rings"],["trx","Suspension trainer (TRX)"],["anchor","Somewhere to anchor feet"],["bands","Resistance bands"],["box","Plyo box"],["hangboard","Fingerboard / hangboard"],["abwheel","Ab wheel"],["swissball","Stability ball"],["parallettes","Parallettes"],["dipbelt","Dip / weight belt"],["medball","Medicine ball"],["slamball","Slam ball"],["wallball","Wall ball + target"],["battleropes","Battle ropes"],["climbrope","Climbing rope"],["pegboard","Pegboard"]]],
  ["Cables", [["cable_hi","High pulley"],["cable_mid","Adjustable pulley (any height)"],["cable_low","Low pulley / seated row"],["cable_dual","Cable crossover (two stacks)"],["functional","Functional trainer"],["latpd","Lat pulldown"]]],
  ["Chest and shoulder machines", [["chestpress","Seated chest press"],["incchestpress","Incline chest press machine"],["declinepress","Decline press machine"],["pecdeck","Pec deck"],["revdelt","Rear delt machine"],["shoulderpress","Shoulder press machine"],["latraisem","Lateral raise machine"],["smith","Smith machine"],["dipm","Assisted dip / pull-up machine"]]],
  ["Back machines", [["rowm","Chest-supported row machine"],["tbar","T-bar row"],["seatedrowm","Seated row machine"],["highrow","High row machine"],["lowrow","Low row machine"],["pulloverm","Pullover machine"],["latpdplate","Plate-loaded pulldown"],["backext","Back extension machine"]]],
  ["Arm machines", [["curlm","Biceps curl machine"],["preacherm","Preacher curl machine"],["triextm","Triceps extension machine"],["tridipm","Seated dip machine"]]],
  ["Leg machines", [["legpress","45° leg press"],["hlegpress","Horizontal leg press"],["hack","Hack squat"],["pendulum","Pendulum squat"],["beltsquat","Belt squat"],["vsquat","V-squat"],["legext","Leg extension"],["lyingcurl","Lying leg curl"],["seatedcurl","Seated leg curl"],["standcurl","Standing leg curl"],["kneelcurl","Kneeling leg curl"],["hipext","45° back extension"],["ghd","Glute-ham developer"],["revhyper","Reverse hyper"],["nordicbench","Nordic curl bench"],["glutedrive","Hip thrust machine"],["kickbackm","Glute kickback machine"],["multihip","Multi-hip machine"],["adductor","Hip adductor"],["abductor","Hip abductor"],["calfm","Standing calf raise"],["seatedcalf","Seated calf raise"],["donkeycalf","Donkey calf raise"],["tibbar","Tibialis bar"]]],
  ["Core machines", [["abcrunchm","Ab crunch machine"],["torso","Rotary torso"],["captain","Captain's chair"],["declinesitup","Decline sit-up bench"]]],
  ["Cardio", [["treadmill","Treadmill"],["curvedtm","Curved / self-powered treadmill"],["rower","Rowing machine"],["skierg","SkiErg"],["bikeerg","BikeErg"],["airbike","Assault / air bike"],["uprightbike","Upright bike"],["recumbent","Recumbent bike"],["spinbike","Spin bike"],["elliptical","Cross-trainer"],["stairs","Stair climber"],["stepper","Stepper"],["versaclimber","VersaClimber"],["jacobs","Jacob's ladder"]]],
  ["Strongman and conditioning", [["sled","Sled / prowler"],["sandbag","Sandbag"],["yoke","Yoke"],["farmerhandles","Farmer's handles"],["stones","Atlas stones"],["tyre","Tyre"],["log","Log"],["turf","Turf track"]]]
];
const EQUIP = EQG.flatMap(g => g[1]);
const ALLKIT = EQUIP.map(e => e[0]);
// equipment that also satisfies an older or simpler requirement
const KIT_ALIAS = {adjdb:["db"], functional:["cable_hi","cable_mid","cable_low","cable_dual"], halfrack:["rack"], benchrack:["bench"], flatbench:[], latpdplate:["latpd"], seatedrowm:["cable_low"], hlegpress:["legpress"], vsquat:["hack"], dipm:["dip","pullup"], tridipm:[], trx:["rings"], backext:["hipext"], preacherm:["preacher"], spinbike:["airbike"], bikeerg:["airbike"], uprightbike:["airbike"]};
function kitHas(kit, r){ return kit.includes(r) || kit.some(k => (KIT_ALIAS[k] || []).includes(r)); }
const GYMTYPES = {
  home:["Home", "A few dumbbells, a bench, bands", ["db","bench","flatbench","bands","anchor","swissball","abwheel"]],
  garage:["Garage gym", "Rack, barbell, plates, pull-up bar", ["bb","ez","landmine","rack","jhooks","bench","flatbench","db","kb","pullup","dip","anchor","bands","box","abwheel","medball"]],
  hotel:["Hotel or small gym", "Dumbbells, a cable, cardio machines", ["db","bench","flatbench","cable_hi","cable_mid","cable_low","latpd","treadmill","uprightbike","elliptical","rower","bands","swissball"]],
  commercial:["Commercial gym", "The usual big-chain gym", ["bb","ez","fixedbb","trapbar","landmine","rack","halfrack","jhooks","bench","flatbench","declinebench","benchrack","preacher","db","kb","pullup","dip","anchor","bands","box","abwheel","swissball","medball","cable_hi","cable_mid","cable_low","cable_dual","functional","latpd","chestpress","incchestpress","pecdeck","revdelt","shoulderpress","smith","dipm","rowm","seatedrowm","backext","curlm","triextm","legpress","hack","legext","lyingcurl","seatedcurl","hipext","glutedrive","adductor","abductor","calfm","seatedcalf","abcrunchm","captain","declinesitup","treadmill","rower","uprightbike","spinbike","recumbent","elliptical","stairs","airbike"]],
  bodybuilding:["Bodybuilding gym", "Every machine, plate-loaded and selectorised", null],
  box:["CrossFit or HYROX box", "Barbells, rigs, rowers, sleds, wall balls", ["bb","trapbar","rack","halfrack","platform","jhooks","bench","db","kb","pullup","dip","rings","anchor","bands","box","abwheel","parallettes","medball","slamball","wallball","battleropes","climbrope","pegboard","rower","skierg","bikeerg","airbike","treadmill","sled","sandbag","farmerhandles","turf"]],
  outdoor:["Outdoor or calisthenics park", "Bars, rings and your bodyweight", ["pullup","dip","rings","parallettes","anchor","bands"]],
  uni:["University or sports centre", "Mix of free weights and machines", ["bb","ez","rack","jhooks","bench","flatbench","db","kb","pullup","dip","anchor","bands","box","medball","cable_hi","cable_mid","cable_low","cable_dual","latpd","chestpress","pecdeck","shoulderpress","smith","rowm","seatedrowm","legpress","legext","lyingcurl","seatedcurl","hipext","adductor","abductor","calfm","treadmill","rower","uprightbike","spinbike","elliptical","airbike"]]
};
GYMTYPES.bodybuilding[2] = ALLKIT.filter(k => !["sandbag","wallball","slamball","yoke","stones","tyre","log","climbrope","pegboard","rings","battleropes","axle","turf"].includes(k));
const PRESETS = GYMTYPES;
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
X("scpress","Single-arm high-to-low cable press","fpress",{chest:1,fdelt:.5,triceps:.5},["cable_hi"],{c:true,len:1,lo:10,hi:15,rest:90,eq:"cable",note:"Each arm"});
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
X("pdbar","Straight-bar pushdown","pushdown",{triceps:1},["cable_hi"],{len:0,rest:75,eq:"cable"});
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
X("beltsq","Belt squat","squat",{quads:1,glutes:.5,adductors:.5},["beltsquat"],{c:true,len:2,lo:8,hi:12,rest:150,eq:"machine"});
X("ssbsq","Safety bar squat","squat",{quads:1,glutes:.5,adductors:.5,upback:.5},["ssb","rack"],{c:true,len:2,lo:5,hi:8,rest:180,eq:"bb",inj:["knee"]});
X("ghr","Glute-ham raise","kneeflex",{hams:1,glutes:.5},["ghd"],{len:2,lo:6,hi:10,rest:120,eq:"bw"});
X("revhyp","Reverse hyper","glute",{glutes:1,hams:.5},["revhyper"],{lo:10,hi:15,rest:90,eq:"machine"});
X("standcurlm","Standing leg curl","kneeflex",{hams:1},["standcurl"],{len:1,lo:8,hi:12,eq:"machine"});
X("kickbackmach","Glute kickback machine","glute",{glutes:1},["kickbackm"],{len:1,lo:10,hi:15,eq:"machine"});
X("donkey","Donkey calf raise","calf",{calves:1},["donkeycalf"],{len:2,rest:75,eq:"machine"});
X("incmachine","Incline chest press machine","ipress",{chest:1,fdelt:.5,triceps:.5},["incchestpress"],{c:true,lo:8,hi:12,rest:120,eq:"machine"});
X("latraisemach","Lateral raise machine","lat",{sdelt:1},["latraisem"],{len:1,eq:"machine"});
X("revdeltm","Rear delt machine","rear",{rdelt:1},["revdelt"],{eq:"machine"});
X("seatedrowmach","Seated row machine","row",{upback:1,lats:.5,rdelt:.5,biceps:.5},["seatedrowm"],{c:true,lo:8,hi:12,rest:120,eq:"machine"});
X("highrowm","High row machine","vpull",{lats:1,upback:.5,biceps:.5},["highrow"],{c:true,lo:8,hi:12,rest:120,eq:"machine"});
X("pullovermach","Pullover machine","latiso",{lats:1},["pulloverm"],{len:2,eq:"machine"});
X("curlmach","Biceps curl machine","curl",{biceps:1},["curlm"],{len:1,eq:"machine"});
X("triextmach","Triceps extension machine","triext",{triceps:1},["triextm"],{len:1,eq:"machine"});
X("dipmach","Seated dip machine","tripress",{triceps:1,chest:.5},["tridipm"],{c:true,lo:8,hi:12,rest:90,eq:"machine"});
X("abcrunchmach","Ab crunch machine","abs",{abs:1},["abcrunchm"],{rest:60,eq:"machine"});
X("captainraise","Captain's chair leg raise","abs",{abs:1},["captain"],{rest:60,eq:"bw"});
X("trxrow","Suspension row","row",{upback:1,lats:.5,biceps:.5},["trx"],{c:true,lo:8,hi:15,rest:90,eq:"bw"});
X("trapshrug","Trap bar shrug","row",{upback:1},["trapbar"],{lo:8,hi:12,rest:90,eq:"bb"});
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
// Sport plans: power, injury prevention and trunk work. ml = the label shown instead of a muscle.
X("cmj","Countermovement jump","plow",{quads:.5,glutes:.5,calves:.5},[],{c:true,lo:3,hi:5,rest:120,eq:"bw",ml:"Power",note:"Jump as high as you can, reset fully between reps"});
X("boxjp","Box jump","plow",{quads:.5,glutes:.5},["box"],{c:true,lo:3,hi:5,rest:120,eq:"bw",ml:"Power",note:"Step down, don't jump down"});
X("broadjump","Broad jump","plow",{glutes:.5,quads:.5},[],{c:true,lo:3,hi:5,rest:120,eq:"bw",ml:"Power",note:"Jump as far as you can and stick the landing"});
X("hangclean","Hang power clean","plow",{glutes:.5,hams:.5,upback:.5,quads:.5},["bb"],{c:true,lo:3,hi:4,rest:150,eq:"bb",ml:"Power",inj:["lowback","wrist"],note:"Fast pull, catch high, reset each rep"});
X("latbound","Lateral bound","plat",{glutes:.5,adductors:.5},[],{c:true,lo:3,hi:5,rest:90,eq:"bw",ml:"Power",note:"Each side. Hold each landing for a second"});
X("mbrot","Rotational med ball throw","prot",{abs:.5,glutes:.5},["medball"],{c:true,lo:4,hi:6,rest:90,eq:"other",ml:"Rotational power",note:"Each side, into a wall, as fast as you can"});
X("landrot","Landmine rotation","prot",{abs:1},["bb","landmine"],{lo:6,hi:8,rest:75,eq:"bb",ml:"Rotational power",note:"Each side, turn from the hips"});
X("mbchest","Med ball chest pass","pup",{chest:.5,triceps:.5},["medball"],{c:true,lo:4,hi:6,rest:90,eq:"other",ml:"Upper-body power",note:"Into a wall, explode, catch, reset"});
X("mbslam","Med ball slam","pup",{lats:.5,abs:.5},["medball"],{c:true,lo:5,hi:6,rest:90,eq:"other",ml:"Upper-body power"});
X("pushpress","Push press","pup",{fdelt:1,triceps:.5},["bb","rack"],{c:true,lo:3,hi:5,rest:150,eq:"bb",ml:"Upper-body power",inj:["shoulder"]});
X("cabler","Cable external rotation","er",{rdelt:.5},["cable_mid"],{lo:12,hi:15,rest:60,eq:"cable",ml:"Rotator cuff",note:"Each arm, elbow tucked to your side"});
X("bander","Band external rotation","er",{rdelt:.5},["bands"],{lo:15,hi:20,rest:45,eq:"other",ml:"Rotator cuff",note:"Each arm, elbow tucked to your side"});
X("sideer","Side-lying DB external rotation","er",{rdelt:.5},["db"],{lo:12,hi:15,rest:60,eq:"db",ml:"Rotator cuff",note:"Each arm, light weight"});
X("ytw","Prone Y-T-W raise","er",{rdelt:.5,upback:.5},["db","bench"],{lo:8,hi:10,rest:60,eq:"db",ml:"Shoulder blades",note:"Each letter, very light"});
X("copen","Copenhagen plank","add",{adductors:1},["bench"],{lo:15,hi:30,rest:60,eq:"bw",ml:"Adductors",note:"Seconds each side. Start with the knee on the bench"});
X("neckiso","Neck isometrics","neck",{},[],{lo:10,hi:15,rest:45,eq:"bw",ml:"Neck",note:"Seconds each way (front, back, sides): push your hand into your head at about 70% effort"});
X("neckband","Banded neck strengthening","neck",{},["bands"],{lo:12,hi:15,rest:45,eq:"other",ml:"Neck",note:"Each direction, slow and controlled"});
X("hangboard","Fingerboard hang","fing",{},["hangboard"],{lo:7,hi:10,rest:180,eq:"other",ml:"Fingers",note:"Seconds per hang. Add weight once 10 s is easy"});
X("deadhang","Dead hang","grip",{lats:.5},["pullup"],{lo:20,hi:40,rest:90,eq:"bw",ml:"Grip",note:"Seconds"});
X("wristcurl","Wrist curl and extension","grip",{},["db"],{lo:12,hi:15,rest:45,eq:"db",ml:"Forearms",note:"Each direction"});
X("pallof","Pallof press","core",{abs:1},["cable_mid"],{lo:8,hi:12,rest:60,eq:"cable",ml:"Trunk",note:"Each side, hold 2 s with arms out"});
X("pallofb","Band Pallof press","core",{abs:1},["bands"],{lo:10,hi:12,rest:45,eq:"other",ml:"Trunk",note:"Each side, hold 2 s with arms out"});
X("sideplank","Side plank","core",{abs:1},[],{lo:20,hi:40,rest:45,eq:"bw",ml:"Trunk",note:"Seconds each side"});
X("hopstick","Single-leg hop and stick","land",{quads:.5,glutes:.5},[],{lo:4,hi:6,rest:60,eq:"bw",ml:"Landing control",note:"Each leg. Land softly, knee over toes, hold 2 s"});
X("slbalance","Single-leg balance reach","ankle",{},[],{lo:6,hi:8,rest:45,eq:"bw",ml:"Balance",note:"Each leg, reach forward, sideways and back"});

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
  hyB:{label:"HYROX strength B", slots:["hinge","vpull","carry","fpress","cond"]},
  sp1:{label:"Strength & power", slots:["hinge","vpull","fpress"]}, spA:{label:"Strength & power A", slots:["squat","vpull"]}, spB:{label:"Strength & power B", slots:["hinge","fpress","row"]},
  spC:{label:"Strength & power C", slots:["lunge","vpull","ohp"]}, spD:{label:"Strength & power D", slots:["ohp","vpull","row"]}
};
const TEMPLATE_PICK = ["fbA","fbB","fbC","upper","lower","upA","upB","loA","loB","push","pull","legs","arms","glutes"];
const LOWER = new Set(["loA","loB","legs","lower","spA","spC","sp1"]);
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
// Looks: priorities from attractiveness research where it exists (shoulder/chest-to-waist ratio and strength cues in men,
// Swami & Tovée 2005, Sell 2017; waist-to-hip ratio and a lean-and-muscular ideal in women, Singh 1993, Bozsik 2018), otherwise coaching convention.
// "ev" = research-backed, "conv" = convention. Overall size and Strong have no priorities: even volume grows the most muscle in total.
const LOOKS = {
  male:[["vtaper","V-taper","Wide shoulders and back, narrow waist",["sdelt","lats"],"ev"],["athletic","Athletic","Strong, balanced, sporty",["sdelt","chest","quads"],"ev"],["beach","Lean and defined","Chest, arms and shoulders that show",["chest","sdelt","biceps"],"conv"],["mass","Overall size","Bigger everywhere, evenly",[],"ev"]],
  female:[["hourglass","Hourglass","Fuller glutes, shapely shoulders, smaller-looking waist",["glutes","sdelt"],"ev"],["toned","Toned and athletic","Defined shoulders, back and legs",["glutes","sdelt","upback"],"conv"],["lean","Lean and slim","Lighter, defined; driven mainly by diet",[],"ev"],["strong","Strong overall","Even, all-round muscle and strength",[],"ev"]]
};

/* ---------- Generator ---------- */
function has(kit, ex){ return ex.q.every(r => kitHas(kit, r)); }
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
  const spP = ans.goal === "athletic" ? (sportProfile(ans) || SPORT_GENERIC) : null;
  if (spP){ const pre = ans.season === "in" ? "In-season strength" : "Strength & power"; T.sp1.label = pre; ["A","B","C","D"].forEach(x => T["sp" + x].label = pre + " " + x); }
  let split = spP ? {id:"sport", name:spP.name + " · " + sportSeason(ans).toLowerCase() + " ×" + n, days:n <= 1 ? ["sp1"] : ["spA","spB","spC","spD"].slice(0, Math.min(4, n))}
    : ans.goal === "crossfit" ? {id:"cf", name:"Strength + conditioning ×" + n, days:Array.from({length:n}, (_, i) => ["cfA","cfB","cfC"][i % 3])}
    : ans.split === "custom" && (ans.customSeq || []).length === n ? {id:"custom", name:"Custom: " + ans.customSeq.map(k => T[k].label).join(" / "), days:ans.customSeq.slice()}
    : (SPLITS[n] || []).find(s => s.id === ans.split) || (SPLITS[n] || [])[0];
  const placed = placeDays(split.days, ans);
  const seq = placed.map(p => p.tk);
  const gl = (flowGyms() || gymList()), vs = Object.fromEntries(gl.map(g => [g.id, spP ? buildSportVariant(seq, g.id, ans, seed) : buildVariant(seq, g.id, ans, seed)])), first = vs[gl[0].id];
  const exercises = {};
  const rs = RESTSCALE[ans.rest || "std"] || 1;
  const toList = (v, i) => { let heavyDone = false; return v.days[i].list.map((x, j) => {
    const e = x.ex, def = {n:e.n, lo:e.lo, hi:e.hi, rest:Math.round(e.rest * rs / 15) * 15, eq:e.eq, m:e.ml || MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)] || "Conditioning", mu:e.mu, note:e.note || undefined, len:e.len};
    let key = e.k;
    const bigLift = e.c && e.eq === "bb" && ["squat","hinge","fpress","ipress","ohp"].includes(e.p);
    if (spP){
      if (x.role === "main"){ key = e.k + "-hvy"; const nw = ans.level === "new"; const one = e.p === "lunge"; Object.assign(def, {n:e.n + (nw ? "" : " (heavy)"), lo:nw ? 6 : one ? 5 : 3, hi:nw ? 10 : one ? 8 : ans.season === "in" ? 5 : 6, rest:Math.round((nw ? 120 : 180) * rs / 15) * 15}); }
      else if (x.role === "acc"){ const big = (spP.q || {}).mass >= 2 && ans.season !== "in"; Object.assign(def, {lo:big ? 8 : 6, hi:big ? 12 : 10, rest:Math.round((e.c ? 120 : 75) * rs / 15) * 15}); }
    }
    else if (ans.level === "new" && !special(e.p) && e.k !== "plank"){ if (e.c){ def.lo = Math.max(def.lo, 8); def.hi = Math.min(12, Math.max(def.hi, 12)); } else { def.lo = Math.max(def.lo, 10); def.hi = 15; } }
    else if (ans.goal === "strength" && bigLift){ key = e.k + "-hvy"; Object.assign(def, {n:e.n + " (heavy)", lo:3, hi:6, rest:Math.round(210 * rs / 15) * 15}); }
    else if ((ans.goal === "power" || ans.goal === "crossfit") && bigLift && !heavyDone){ heavyDone = true; key = e.k + "-hvy"; Object.assign(def, {n:e.n + " (heavy)", lo:4, hi:6, rest:Math.round(180 * rs / 15) * 15}); }
    exercises[key] = Object.fromEntries(Object.entries(def).filter(([, v]) => v !== undefined));
    return x.ss ? [key, x.sets, x.ss] : [key, x.sets];
  }); };
  const sportSet = new Set(ans.sport || []);
  const days = WD.map(([k, wd, short]) => {
    const i = placed.findIndex(p => p.wd === wd);
    if (i < 0) return {k, wd, label:spP && ans.matchDay === k ? (/Racket|Team|Combat/.test(spP.group || "") ? "Match day" : /Athletics/.test(spP.group || "") ? "Competition day" : "Key session") : spP && sportSet.has(k) ? spP.name : "Rest", focus:sportSet.has(k) ? (spP ? spP.name + " session" : "Sport or harder cardio") : "Recovery, walk or easy cardio", rest:true, cardio:sportSet.has(k) ? (spP ? spP.name : "Sport day") : "Walk or easy cardio"};
    const tk = placed[i].tk;
    const next = WD.find(x => x[1] === (wd + 1) % 7)[0];
    return {k, wd, label:T[tk].label, tpl:tk, focus:focusOf(first.days[i].list), gym:gl.some(g => g.id === (ans.gymOf || {})[k]) ? ans.gymOf[k] : gl[0].id,
      cardio:spP ? (sportSet.has(k) ? `${spP.name} today too: do this session first, or several hours apart` : LOWER.has(tk) ? "Keep hard sport sessions off tomorrow if you can" : `Fine alongside ${spP.name.toLowerCase()} training`) : ans.goal === "crossfit" ? WODS[i % WODS.length] : ans.cardioPlus && i % 2 === 1 ? "Add 20-30 min of easy cardio after, or on a rest day" : LOWER.has(tk) ? "Keep hard cardio away from today if you can" : "Easy cardio is fine",
      variants:Object.fromEntries(gl.map(g => [g.id, toList(vs[g.id], i)]))};
  });
  if (spP){ let n2 = 0; const tr = days.filter(d => !d.rest); if (tr.length > 1) tr.forEach(d => { d.label = T.sp1.label + " " + "ABCD"[n2++]; }); }
  const weeks = +ans.block || 6;
  const ownName = ans.name && ans.name !== "Block 1" ? ans.name : null;
  const autoName = ans.customAI && ans.customAI.title ? ans.customAI.title : spP ? spP.name + " plan" : `${GTYPES[ans.gtype] && ans.gtype !== "custom" ? GTYPES[ans.gtype][2] : {size:"Build muscle", strength:"Build strength", power:"Powerbuilding", crossfit:"CrossFit-style", athletic:"Athletic"}[ans.goal] || "Training"}: ${split.name}`;
  return {schema:2, name:ownName || autoName, placeholder:false, ...(spP ? {sport:{id:spP.id, name:spP.name, season:ans.season || "off", confidence:spP.confidence || "limited"}} : {}), startDate:ans.start, deloadEvery:weeks, rir:rirPlan(weeks, ans.level, ans.ramp), breaks:(ans.breaks || []).slice(),
    kind:"gym", split:split.id, splitName:split.name, setup:ans, built:Date.now(), targets:first.tg, vol:Object.fromEntries(gl.map(g => [g.id, vs[g.id].vol])), mins:Object.fromEntries(gl.map(g => [g.id, vs[g.id].mins])), exercises, days};
}

/* ---------- Train for my sport ----------
   Profiles live in sportprofiles.js (window.AJSportProfiles): what the sport demands (0-3), which injury-prevention work has
   evidence for it, gym sessions per season, and the studies behind it. The gym plan then builds strength and power with fewer,
   heavier sets than a muscle plan (the sport itself is the main training load), and keeps hard leg work off the day before a match.
   Season dose: 2-3 sessions off-season builds strength; 1 a week keeps it in-season (Rønnestad 2011). */
const SPP = () => window.AJSportProfiles || {sports:[], general:[]};
function sportProfile(a){ return a.sportCustom || SPP().sports.find(s => s.id === a.sportId) || null; }
const SPORT_GENERIC = {id:"generic", name:"Your sport", group:"Other", q:{maxStrength:2, power:2, rotational:1, unilateral:2, upperPull:2, upperPush:1, lowerBody:2, grip:1, neck:0, trunk:2, mass:1}, prehab:["nordic","shoulderER","ankle"], season:{off:3, pre:2, in:1}, avoidBefore:"lower", energy:"", summary:"", evidence:[], confidence:"limited"};
const PREHAB = {nordic:["nordicham","ghr","lyingcurl","seatedcurl"], copenhagen:["copen","adductor"], shoulderER:["cabler","bander","sideer","ytw"], neck:["neckband","neckiso"],
  ankle:["slbalance"], landing:["hopstick"], calf:["slcalf","standcalf","seatedcalf"], wrist:["wristcurl"], fingers:["hangboard","deadhang"], lowback:["hipext","goodmorning","kbrdl"], hipAbd:["bandabd","abductor"]};
const PREHAB_N = {nordic:"Nordic hamstring curls", copenhagen:"Copenhagen adductor work", shoulderER:"rotator cuff work", neck:"neck strengthening", ankle:"balance work for the ankles",
  landing:"landing and cutting control", calf:"calf and Achilles strength", wrist:"forearm and wrist strength", fingers:"finger strength", lowback:"back extensor endurance", hipAbd:"hip abductor strength"};
const SPX = {sq:["squat","ssbsq","frontsq","beltsq","goblet","hack","legpress"], hinge:["trapdl","deadlift","rdl","dbrdl","kbrdl","hipthrust"], single:["bss","stepup","walklunge","singlerdl"],
  push:["bench","flatdb","incdb","pushup","chestpress","cabpress"], ohp:["bbohp","ohp","arnold","mshoulder"], vpull:["pullup","chinup","ngpd","latpd"], hrow:["csdb","dbrow","bbrow","cabrow","invrow","trxrow"],
  plow:["boxjp","cmj","broadjump","hangclean","kbswing"], plat:["latbound","broadjump","cmj"], prot:["mbrot","landrot"], pup:["mbchest","pushpress","mbslam","mbchest"],
  core:["pallof","pallofb","sideplank","abwheel","plank"], rotcore:["landrot","woodchop","pallof","pallofb"], grip:["farmers","deadhang","wristcurl"]};
const SP_NEW_AVOID = new Set(["frontsq","deadlift","hangclean","bbohp","pushpress","nordicham","ghr"]), SP_ADV_ONLY = new Set(["hangclean"]);
const SPDOSE = {off:{pow:3, main:4, acc:3, pre:2, core:2}, pre:{pow:3, main:3, acc:2, pre:2, core:2}, in:{pow:2, main:2, acc:2, pre:2, core:2}};
// The week's sessions as slots: [list, role]. Power first while fresh, then the main lift, then accessories, then injury prevention and trunk.
function sportBlueprint(p, n){
  const q = p.q || SPORT_GENERIC.q, pre = [...new Set([...(p.prehab || []), ...(q.neck >= 2 ? ["neck"] : []), ...(q.grip >= 3 ? ["fingers"] : [])])].filter(k => PREHAB[k]);
  const pow1 = q.power >= 2 ? "plow" : null, pow2 = q.rotational >= 2 ? "prot" : q.upperPush >= 2 && q.power >= 2 ? "pup" : q.unilateral >= 2 && q.power >= 2 ? "plat" : pow1;
  const pow3 = q.unilateral >= 2 && q.power >= 2 ? "plat" : pow1, legs = q.lowerBody >= 2, pullMain = q.upperPull >= 3, pushMain = q.upperPush >= 3;
  const coreA = q.rotational >= 2 ? "rotcore" : "core", extra = q.grip >= 2 ? "grip" : coreA;
  const A = [pow1 && [pow1, "pow"], [legs ? "sq" : "single", legs ? "main" : "acc"], ["vpull", pullMain ? "main" : "acc"], q.unilateral >= 2 && legs && ["single", "acc"], ["pre", "pre"], ["pre", "pre"], [coreA, "core"]];
  const B = [pow2 && [pow2, "pow"], ["hinge", legs || q.maxStrength >= 2 ? "main" : "acc"], ["push", pushMain ? "main" : "acc"], ["hrow", "acc"], ["pre", "pre"], ["pre", "pre"], [extra, "core"]];
  const C = [pow3 && [pow3, "pow"], ["single", legs ? "main" : "acc"], [q.upperPull >= 2 ? "vpull" : "hrow", "acc"], [q.upperPush >= 2 ? "ohp" : "push", "acc"], ["pre", "pre"], ["pre", "pre"], [q.neck >= 2 ? "core" : extra, "core"]];
  const D = [(q.upperPush >= 2 ? "pup" : pow2) && [q.upperPush >= 2 ? "pup" : pow2, "pow"], ["ohp", "acc"], ["vpull", "acc"], ["hrow", "acc"], ["push", "acc"], ["pre", "pre"], [coreA, "core"]];
  const ONE = [pow1 && [pow1, "pow"], ["hinge", "main"], [q.upperPull >= q.upperPush ? "vpull" : "push", "acc"], [q.upperPull >= q.upperPush ? "push" : "hrow", "acc"], ["single", "acc"], ["pre", "pre"], ["pre", "pre"], [coreA, "core"]];
  const days = (n <= 1 ? [ONE] : [A, B, C, D].slice(0, Math.min(4, n))).map(d => d.filter(Boolean));
  // injury-prevention work spread round the week: every item at least once, the ones with the strongest evidence more often
  let i = 0; days.forEach(d => d.forEach(sl => { if (sl[0] === "pre"){ sl[0] = pre.length ? "pre:" + pre[i % pre.length] : coreA; if (!pre.length) sl[1] = "core"; i++; } }));
  return days;
}
function spPick(list, ctx, role){
  const lvlNew = ctx.ans.level === "new", love = ctx.ans.love || [], ok = k => { const e = L[k]; return e && has(ctx.kit, e) && !(ctx.ans.ban || []).includes(k) && !(ctx.ans.injAvoid || []).includes(k) && !ctx.dayUsed.has(k)
    && !(e.inj || []).some(j => (ctx.ans.inj || []).includes(j)) && !(lvlNew && SP_NEW_AVOID.has(k)) && !(SP_ADV_ONLY.has(k) && ctx.ans.level !== "adv" && !love.includes(k)); };
  const cand = list.filter(ok).sort((x, y) => (love.includes(y) - love.includes(x)));
  if (!cand.length) return null;
  // main lifts stay the same through the week so they progress; accessories and power vary
  return role === "main" ? cand[0] : (cand.find(k => !ctx.used.has(k)) || cand[0]);
}
function buildSportVariant(seq, gym, ans, seed){
  const kit = (ans.kit && ans.kit[gym]) || (((flowGyms() || gymList()).find(g => g.id === gym) || {}).kit) || KIT_DEFAULT[gym] || KIT_FULL, used = new Set();
  const p = sportProfile(ans) || SPORT_GENERIC, dose = SPDOSE[ans.season || "off"] || SPDOSE.off, bp = sportBlueprint(p, seq.length);
  const days = seq.map((tk, di) => { const dayUsed = new Set(), list = [];
    for (const [slot, role] of bp[di] || []){
      const keys = slot.startsWith("pre:") ? PREHAB[slot.slice(4)] : SPX[slot];
      let k = spPick(keys || [], {kit, ans, used, dayUsed}, role);
      if (!k && role === "pow") k = spPick(SPX.plow, {kit, ans, used, dayUsed}, role);     // no med ball or landmine: jump instead
      if (!k) continue;
      used.add(k); dayUsed.add(k);
      let sets = dose[role] || 2; if (role === "acc" && (p.q || {}).mass >= 2 && (ans.season || "off") === "off") sets++;
      list.push({ex:L[k], sets, role});
    }
    return {tk, list}; });
  const dayMins = d => d.list.reduce((a, x) => a + exTime(x.ex, x.sets), 4), cap = +ans.mins || 60;
  days.forEach(d => { for (let g = 0; g < 30 && dayMins(d) > cap; g++){
    const acc = d.list.filter(x => x.role === "acc" && x.sets > 2).sort((a, b) => b.sets - a.sets)[0]; if (acc){ acc.sets--; continue; }
    const drop = [...d.list].reverse().find(x => x.role === "core" || x.role === "acc"); if (drop && d.list.length > 4) d.list.splice(d.list.indexOf(drop), 1); else break; } });
  const vol = {}; days.forEach(d => d.list.forEach(x => { for (const [m, f] of Object.entries(x.ex.mu)) vol[m] = (vol[m] || 0) + f * x.sets; }));
  return {days, vol, tg:{}, mins:days.map(dayMins)};
}
function sportSeason(a){ return {off:"Off-season", pre:"Pre-season", in:"In-season"}[a.season || "off"]; }
function sportBlocked(a){
  if (a.gtype !== "sport") return a.blocked || [];
  const p = sportProfile(a) || SPORT_GENERIC, md = a.matchDay && a.matchDay !== "none" ? a.matchDay : null, out = new Set(a.blocked || []);
  if (md){ out.add(md); if (p.avoidBefore){ const i = WD.findIndex(x => x[0] === md); out.add(WD[(i + 6) % 7][0]); } }
  return [...out];
}
// Search-first: the most common sports as a small grid; typing shows a handful of matches; no match offers the AI
const SP_POPULAR = ["football","tennis","padel","rugbyunion","golf","swimming","climbing","mma","boxing","basketball","cycling","netball"];
function sportRowsPick(q){
  const all = SPP().sports, chip = s => `<button class="spchip" data-spid="${s.id}" aria-pressed="${F.ans.sportId === s.id && !F.ans.sportCustom}"><span class="spic">${window.AJSportIcon ? AJSportIcon(s.id) : ""}</span><span>${esc(s.name.replace(/ \(.*\)$/, "").replace(" & bouldering", ""))}</span></button>`;
  if (!q) return `<div class="spgrid">${SP_POPULAR.map(id => all.find(s => s.id === id)).filter(Boolean).map(chip).join("")}</div><p class="small muted">Not here? Search above: ${all.length} sports, or type any other.</p>`;
  const hit = all.filter(s => (s.name + " " + (s.aliases || []).join(" ")).toLowerCase().includes(q)).slice(0, 6);
  return (hit.length ? `<div class="spgrid">${hit.map(chip).join("")}</div>` : "")
    + `<button class="btn ghost" data-aisport="1" ${F.busy ? "disabled" : ""}>${F.busy ? "Working it out…" : `${hit.length ? "Something else? " : ""}Build a plan for “${esc(F.spq.trim().slice(0, 30))}” with AI`}</button>`;
}
async function aiSport(){
  const a = F.ans; if ((F.spq || "").trim()) a.sportOther = F.spq.trim(); const name = (a.sportOther || "").trim(); if (!name){ toast("Type your sport first"); return; }
  F.busy = true; F.keepScroll = true; draw();
  try{
    const r = await aiJson(`You are a strength and conditioning coach. Profile the physical demands of this sport for gym training: """${name.slice(0, 120)}""".
Reply with only JSON: {"name": tidy sport name, "q": {"maxStrength":0-3,"power":0-3,"rotational":0-3,"unilateral":0-3,"upperPull":0-3,"upperPush":0-3,"lowerBody":0-3,"grip":0-3,"neck":0-3,"trunk":0-3,"mass":0-2}, "prehab": [from: nordic, copenhagen, shoulderER, neck, ankle, landing, calf, wrist, fingers, lowback, hipAbd — only where the sport's common injuries make it sensible], "season": {"off":2-3,"pre":2,"in":1-2}, "avoidBefore": "lower"|"upper"|"all"|null, "energy": one plain sentence on its energy demands, "summary": two plain sentences in UK English on what the gym plan will focus on and why}. Integers only for q. Be honest: if the sport is barely physical, keep numbers low.`);
    if (!r || !r.q) throw new Error("bad");
    const q = {}; for (const k of Object.keys(SPORT_GENERIC.q)) q[k] = Math.max(0, Math.min(k === "mass" ? 2 : 3, Math.round(+r.q[k] || 0)));
    a.sportCustom = {id:"custom", name:String(r.name || name).slice(0, 40), group:"Other", q, prehab:(r.prehab || []).filter(k => PREHAB[k]).slice(0, 4), season:{off:+((r.season || {}).off) || 3, pre:+((r.season || {}).pre) || 2, in:+((r.season || {}).in) || 1},
      avoidBefore:["lower","upper","all"].includes(r.avoidBefore) ? r.avoidBefore : null, energy:String(r.energy || "").slice(0, 200), summary:String(r.summary || "").slice(0, 400), evidence:[], confidence:"limited", ai:true};
  }catch(e){ a.sportCustom = {...SPORT_GENERIC, name:name.slice(0, 40), summary:"AJ Training AI isn't available right now, so this is a general athletic plan: strength, power, single-leg work and the injury prevention with the broadest evidence.", ai:false}; }
  a.sportId = "custom"; F.busy = false; saveDraft(); F.keepScroll = true; draw();
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
  return {schema:2, kind:ans.kind, name:(ans.name && ans.name !== "Block 1" ? ans.name : ans.customAI && ans.customAI.title ? ans.customAI.title : plan.eventName + " plan"), placeholder:false, startDate:ans.start, deloadEvery:4, endurance:plan, setup:ans, built:Date.now(),
    exercises, days, splitName:plan.eventName + (hybrid ? " + lifting" : ""), mins:Object.fromEntries(gl.map(g => [g.id, vs[g.id] ? vs[g.id].mins : []])), vol:Object.fromEntries(gl.map(g => [g.id, vs[g.id] ? vs[g.id].vol : {}])), targets:vs[gl[0].id] ? vs[gl[0].id].tg : {}};
}

/* ---------- Nutrition math ---------- */
const GOALS = {
  bulk:{label:"Build muscle", sub:"Lean bulk: gain slowly to keep fat gain low", phase:"bulk", min:0.1, max:0.75, rec:[0.25, 0.5], def:0.25, src:"rate-gain"},
  cut:{label:"Lose fat", sub:"Cut: lose fat while keeping muscle", phase:"cut", min:0.25, max:1.25, rec:[0.5, 1.0], def:0.7, src:"rate-loss"},
  recomp:{label:"Recomp", sub:"Hold weight, build muscle and lose fat slowly", phase:"recomp", min:0, max:0, rec:[0, 0], def:0, src:"recomp"},
  maintain:{label:"Maintain", sub:"Hold your weight and keep training hard", phase:"maintain", min:0, max:0, rec:[0, 0], def:0, src:"energy"}
};
const FATPREF = {balanced:["Balanced", 0.27], carb:["Higher carb", 0.2], fat:["Higher fat", 0.35]};
function goalTargets(g, ex, kg, dateIsTraining){
  const sign = g.type === "cut" ? -1 : 1, rateKg = sign * (+g.rate || 0) / 100 * kg;
  const base = Math.round((ex + rateKg * 7700 / 7) / 10) * 10;
  let kcal = base;
  if (g.dist === "training" && dateIsTraining != null){
    // ~8% more on training days, the same weekly total taken back on rest days; rest days never drop more than 15%
    const nT = Math.max(1, (S.prog.days || []).filter(d => !d.rest && !d.optional).length), nR = Math.max(1, 7 - nT), shift = Math.round(base * Math.min(0.08, 0.15 * nR / nT) / 10) * 10;
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
function gymsDraft(){ return gymList().map(g => ({id:g.id, name:g.name, type:g.type || "", kit:(g.kit || KIT_FULL).slice(), dbMax:g.dbMax || 40, dbStep:g.dbStep || 2, dbMode:g.dbMode || "step2", dbs:(g.dbs || []).slice(), plate:g.plate || 1.25})); }
function progDefaults(){
  const p = S.prog || {}, prev = p.setup, gyms = gymsDraft();
  const kit = Object.fromEntries(gyms.map(g => [g.id, g.kit.slice()]));
  const base = {gtype:null, kind:"gym", goal:"size", level:"inter", days:DAYPICK[4].slice(), mins:70, gymOf:{}, gyms, kit, sports:[], split:null, customSeq:null, pri:[], inj:[], injText:"", injAI:null, love:[], ban:[],
    block:6, ramp:"rec", rest:"std", nTrain:null, blocked:[], gfam:null, breaks:[], start:nextMonday(), phase:S.profile.phase || "maintain", name:"Block 1",
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
  sport:["gym","athletic","Train for my sport","Strength, power and injury prevention built around your sport"],
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
  const sub = a.gfam === "strength" ? ["strengthType"] : a.gfam === "race" ? ["raceType"] : [];
  const base = psteps0(); const gi = base.indexOf("goal"); return gi < 0 ? base : base.slice(0, gi + 1).concat(sub, base.slice(gi + 1));
}
function psteps0(){
  const a = F.ans;
  if (a.gtype === "custom" && !a.customDone) return ["intro","goal","custom","build","review"];
  if (a.gtype === "sport") return ["intro","goal","sportpick","season","sportdays","level","days","gyms","inj","build","review"];
  return PSTEPS[a.kind].filter(x => !(x === "look" && a.gtype !== "aesthetic") && !(x === "split" && a.goal === "crossfit") && !(x === "racedate" && a.event === "general")
    && !(x === "gyms" && ["endurance","tri"].includes(a.kind) && !(+a.strengthN > 0)) && !(x === "lifts" && a.goal === "crossfit")).concat(a.gtype === "custom" ? [] : []).filter((x, i, arr) => arr.indexOf(x) === i);
}
const GFAM = [["muscle","Build muscle","More size, most productive volume"],["strength","Get stronger","Lift heavier, with or without the size work"],["aesthetic","Change how I look","Pick the look; the plan puts the work where it shows"],
  ["run","Running","First 5k to ultra, or just fitter"],["hybrid","Hybrid","Lifting and running together"],["race","Fitness race","HYROX, CrossFit-style or triathlon"]];
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
// Days: frequency barely matters once weekly volume is equal (Schoenfeld 2019); 2+ sessions per muscle beats 1 (Schoenfeld 2016).
// So: beginners 3, intermediates 4, advanced 5, strength/powerbuilding 4. Never recommend 7.
function recDays(a){ if (a.gtype === "sport"){ const p = sportProfile(a); return p ? Math.max(1, Math.min(4, (p.season || {})[a.season || "off"] || 2)) : 2; } return a.level === "new" ? 3 : a.level === "adv" && !["strength","power"].includes(a.goal) ? 5 : 4; }
function chooseDays(n, blocked){
  const allow = WD.filter(([k]) => !(blocked || []).includes(k)).map(x => x[0]), idx = k => WD.findIndex(x => x[0] === k);
  if (n >= allow.length) return allow.slice();
  let best = null;
  const combos = (arr, k, start = 0, cur = []) => { if (cur.length === k){ const ii = cur.map(idx).sort((x, y) => x - y), gaps = ii.map((v, j) => ((ii[(j + 1) % ii.length] - v + 7) % 7) || 7), sc = Math.min(...gaps) * 10 - (Math.max(...gaps) - Math.min(...gaps)) - (cur.includes("sun") ? 0.5 : 0) - (cur.includes("sat") ? 0.3 : 0); if (!best || sc > best.sc) best = {sc, cur:cur.slice()}; return; } for (let j = start; j < arr.length; j++){ cur.push(arr[j]); combos(arr, k, j + 1, cur); cur.pop(); } };
  combos(allow, n);
  return best ? WD.filter(([k]) => best.cur.includes(k)).map(x => x[0]) : allow.slice(0, n);
}
function sweetSpot(a){
  const tg = targetsFor(a), sets = Object.values(tg).reduce((x, y) => x + y, 0) / 1.6, need = Math.round(sets * 2.4 / Math.max(1, a.days.length) + 6);
  const m = +a.mins, zone = m < 40 ? ["short", "Short sessions work, but the plan may not fit all the volume you need."] : m <= 75 ? ["ok", "In the sweet spot: enough time for your volume without the last exercises suffering."] : m <= 90 ? ["ok", "Long but fine, especially with priorities or heavier lifts."] : ["long", "Very long sessions: effort tends to drop late on. Another day usually works better."];
  return {need, zone};
}
const DBW = [1,2,2.5,3,4,5,6,7,7.5,8,9,10,11,12,12.5,13,14,15,16,17.5,18,20,22,22.5,24,25,26,27.5,28,30,32,32.5,34,35,36,37.5,38,40,42,42.5,44,45,46,47.5,48,50,52,52.5,55,57.5,60,62.5,65,70,75,80];
function gymEditor(a){
  const q = (F.eqq || "").toLowerCase().trim();
  return `${a.gyms.map((g, gi) => { const t = g.type || "";
    const row = ([k, n]) => `<button class="eqrow" data-gkit="${k}" data-g="${g.id}" aria-pressed="${g.kit.includes(k)}"><span>${n}</span><i class="eqtick"></i></button>`;
    return `<div class="card obgymc">
    <div class="spread"><input class="field obgname" data-gname="${g.id}" value="${esc(g.name)}" aria-label="Gym name">${a.gyms.length > 1 ? `<button class="link muted" data-gdel="${g.id}">Remove</button>` : ""}</div>
    <span class="obl">What kind of gym is it?</span>
    <div class="gtypes">${Object.entries(GYMTYPES).map(([k, [n, d]]) => `<button class="gtype" data-gpreset="${k}" data-g="${g.id}" aria-pressed="${t === k}"><b>${n}</b><span>${d}</span></button>`).join("")}</div>
    <div class="spread"><span class="obl">Equipment</span><span class="small muted">${g.kit.length} items ticked</span></div>
    <span class="obhint">${t ? "Filled in for a typical " + GYMTYPES[t][0].toLowerCase() + ". Untick anything yours doesn't have, or add what it does." : "Pick the kind of gym above to fill this in, then adjust."}</span>
    <label class="sb card eqsearch"><span>${ICON.search}</span><input data-eqq="1" placeholder="Search ${ALLKIT.length} pieces of equipment" value="${esc(F.eqq || "")}" autocomplete="off"></label>
    ${q ? `<div class="eqlist">${EQUIP.filter(([, n]) => n.toLowerCase().includes(q)).map(row).join("") || `<p class="small muted">Nothing matches. Tell us what's missing in the AI chat and we'll add it.</p>`}</div>`
    : EQG.map(([gn, items], qi) => { const on2 = items.filter(([k]) => g.kit.includes(k)).length;
      return `<details class="eqgrp" ${(F.openEq || []).includes(g.id + qi) ? "open" : ""}><summary><b>${gn}</b><span class="muted small">${on2}/${items.length}</span><button class="link" data-gall="${qi}" data-g="${g.id}">${on2 === items.length ? "None" : "All"}</button></summary>
      <div class="eqlist">${items.map(row).join("")}</div></details>`; }).join("")}
    ${g.kit.includes("db") ? dbPicker(g, gi) : ""}
    ${g.kit.includes("bb") ? `<div class="obfld"><span class="obl">Smallest weight plates</span><span class="obhint">The lightest plates you have, used one on each side of the bar. So the smallest jump on the bar is ${2 * (+g.plate || 1.25)} kg.</span>${seg2("gyms." + gi + ".plate", [["0.5","0.5 kg"],["1.25","1.25 kg"],["2.5","2.5 kg"],["5","5 kg"]], String(g.plate || 1.25))}</div>` : ""}
  </div>`; }).join("")}<button class="btn ghost" data-gadd="1">+ Add another gym</button>`;
}
function dbPicker(g, gi){
  const m = g.dbMode || "step2", list = g.dbs || [];
  return `<div class="obfld"><span class="obl">Which dumbbells?</span>
    <div class="obgrid">${[["step2","Every 2 kg","e.g. 2, 4, 6 … up to the max"],["step25","Every 2.5 kg","e.g. 2.5, 5, 7.5 …"],["adj","Adjustable set","PowerBlock, Bowflex and similar"],["exact","Pick exact pairs","Gaps or odd jumps between pairs"]].map(([k, t, d]) => `<button class="obcard" data-set="gyms.${gi}.dbMode" data-val="${k}" aria-pressed="${m === k}"><b>${t}</b><span>${d}</span></button>`).join("")}</div>
    ${m === "exact" ? `<span class="obhint">Tap every pair you have. ${list.length ? list.length + " pairs, " + Math.min(...list) + "-" + Math.max(...list) + " kg." : ""}</span><div class="dbgrid">${DBW.map(w => `<button data-dbw="${w}" data-g="${g.id}" aria-pressed="${list.includes(w)}">${w}</button>`).join("")}</div>`
      : `<div class="obunitrow">Heaviest pair ${nf("gyms." + gi + ".dbMax", "num", g.dbMax || 40, "Heaviest dumbbell", 84)}<span>kg</span></div>`}</div>`;
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
    <div class="obgrid g3">${GFAM.map(([k, t, d]) => `<button class="obcard" data-gfam="${k}" aria-pressed="${a.gfam === k}"><b>${t}</b><span>${d}</span></button>`).join("")}</div>
    <button class="obcard aicard spcard" data-gfam="sport" aria-pressed="${a.gfam === "sport"}"><b>Train for my sport</b><span>Tennis, football, climbing, MMA, swimming and 40+ more: strength, power and injury prevention built around how your sport works.</span></button>
    <button class="obcard aicard" data-gfam="custom" aria-pressed="${a.gfam === "custom"}"><b>Anything else? Tell the AI.</b><span>Describe any goal in your own words, a sport, an event, a look or a deadline, and AJ Training AI builds the plan around it.</span></button>`};
  case "sportpick": { const p = a.sportCustom;
    return {title:"Which sport?", body:`
    <label class="sb card"><span>${ICON.search}</span><input data-spq="1" placeholder="Search any sport" value="${esc(F.spq || "")}" autocomplete="off"></label>
    <div id="obspq" class="sprows">${sportRowsPick((F.spq || "").toLowerCase())}</div>
    ${p ? `<div class="card obai"><b>${esc(p.name)}</b><span>${esc(p.summary || "")}</span><span class="small muted">There's little research on training for this sport specifically, so the plan uses what the sport demands plus general athletic-training evidence. It's a sound plan, but less tailored than the sports in the list.</span></div>` : ""}`, cta:p ? "Use this" : "Continue"}; }
  case "season": { const p = sportProfile(a) || SPORT_GENERIC, se = p.season || SPORT_GENERIC.season;
    return {title:"Where are you in your season?", body:`<div class="obopts">
    ${opt("season","off","Off-season","Building: " + se.off + " gym sessions a week to get stronger and more powerful while the sport load is low.",a.season)}
    ${opt("season","pre","Pre-season","Sharpening: " + se.pre + " sessions, less volume, more speed and power as sport training ramps up.",a.season)}
    ${opt("season","in","In-season","Maintaining: " + se.in + " short session" + (se.in > 1 ? "s" : "") + " a week. That's enough to hold on to strength through a season, so you stay fresh for matches.",a.season)}</div>
    <p class="obnote">One heavy session a week was enough for footballers to keep their strength and sprint speed through a season; stopping lets it fade. Change this any time and rebuild.</p>`}; }
  case "sportdays": { const p = sportProfile(a) || SPORT_GENERIC, sel = a.sport || [];
    return {title:`When do you play or train ${esc(p.name.toLowerCase())}?`, body:`
    <div class="obfld"><span class="obl">Sport days</span>${dayToggles("sport", sel)}<span class="obhint">Gym sessions are placed around these, and these sessions count towards your calories.</span></div>
    ${sel.length ? `<div class="obfld"><span class="obl">${/Racket|Team|Combat/.test(p.group || "") ? "Main match day" : /Athletics/.test(p.group || "") ? "Main competition day" : "Your most important session"}</span>${seg2("matchDay", [["none","None"], ...WD.filter(([k]) => sel.includes(k)).map(([k,, sh]) => [k, sh])], a.matchDay || "none")}
      <span class="obhint">${p.avoidBefore ? "No hard gym work that day or the day before, so you play fresh." : "No gym session on match day."}</span></div>` : ""}`, cta:sel.length ? "Continue" : "Skip"}; }
  case "strengthType": return {title:"What kind of strong?", body:`<div class="obopts">
    ${opt("gtype","strength","Strength","Heavy main lifts (squat, bench, deadlift, overhead press) at 3-6 reps, plus enough accessory work to stay balanced.",a.gtype)}
    ${opt("gtype","power","Powerbuilding","Strength and size together: squat twice, bench two or three times and deadlift once a week at 1-6 reps, then bodybuilding work at 6-15 reps.",a.gtype)}</div>
    <p class="obnote">Strength gains level off at around 4-5 hard sets per lift per week; size keeps rising with more sets. Powerbuilding has no formal definition in the research, so this follows common coaching practice built on that evidence. ${src("load")}</p>`};
  case "raceType": return {title:"Which race or style?", body:`<div class="obopts">
    ${opt("gtype","hyrox","HYROX","8 × 1 km runs, each followed by a workout station. Running-led plan with station strength.",a.gtype)}
    ${opt("gtype","crossfit","CrossFit-style","Strength plus short, hard conditioning pieces several days a week.",a.gtype)}
    ${opt("gtype","tri","Triathlon","Swim, bike and run, from sprint to Ironman.",a.gtype)}</div>`};
  case "custom": return {title:"Describe your goal", body:`
    <p class="obnote" style="margin-top:0">In your own words: the event, sport or look, how many days you have, anything that matters. For example "Hike Kilimanjaro next August", "Get strong enough for my first pull-up" or "Rugby pre-season".</p>
    <textarea class="field" rows="4" data-input="customText" placeholder="My goal is…">${esc(a.customText || "")}</textarea>
    <button class="btn orange" data-aicustom="1" ${F.busy ? "disabled" : ""}>${F.busy ? "Analysing…" : "Analyse with AJ Training AI"}</button>
    ${a.customAI ? `<div class="card obai"><b>${esc(a.customAI.title || "Your plan")}</b><span>${esc(a.customAI.summary || "")}</span>${a.customAI.notes ? `<span class="small muted">${esc(a.customAI.notes)}</span>` : ""}</div>` : ""}`, cta:a.customAI ? "Use this" : "Continue"};
  case "look": { const sx = S.profile.sex === "female" ? "female" : "male", other = sx === "male" ? "female" : "male";
    const row = l => `<button class="obcard" data-look="${l[0]}" aria-pressed="${a.look === l[0]}"><span class="ph pic sm">Photo</span><b>${l[1]}</b><span>${l[2]}</span><em class="lookpri">${l[3].length ? "Extra work: " + l[3].map(m => MUS[m].toLowerCase()).join(", ") : "No single focus: even work everywhere"}</em><em class="lookev ${l[4]}">${l[4] === "ev" ? "Based on research" : "Coaching convention"}</em></button>`;
    return {title:"Which look are you after?", body:`<p class="oblead">Pick what you think would look best on you.</p>
      <div class="obgrid">${LOOKS[sx].map(row).join("")}</div><details class="obmore"><summary>More looks</summary><div class="obgrid">${LOOKS[other].map(row).join("")}</div></details>
      <p class="obnote">You can change the focus muscles on a later step.</p>`}; }
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
    const sp = sweetSpot(a), rec = recDays(a), n = a.nTrain || a.days.length;
    return {title:"How often do you want to train?", body:`
    <div class="obfld"><span class="obl">Days a week</span>${numSeg("nTrain", 1, 7, n, rec)}
      <span class="obhint ${n >= 6 ? "bad" : ""}">★ ${rec} days is what we'd recommend for you. ${n >= 7 ? "Seven days rarely adds muscle or strength over 4-5, and a rest day helps you recover: we'd suggest fewer." : n === 6 ? "Six works for experienced lifters with good recovery; most people grow just as well on 4-5." : n <= 2 ? "Fine for a start; three or more lets every muscle be trained twice a week." : "Enough to train every muscle twice a week."} ${src("frequency")}</span></div>
    <div class="obfld"><span class="obl">Any days you definitely can't train?</span>
      <span class="obhint">Optional. This doesn't lock your week: the plan spreads your sessions out, and you can move any of them in the Train tab whenever your week changes.</span>
      ${dayToggles("blocked", a.blocked || [])}
      <span class="obhint">Your usual days: <b>${WD.filter(([k]) => a.days.includes(k)).map(x => x[2]).join(", ") || "–"}</b></span></div>
    <div class="obfld"><span class="obl">Time per session</span><div class="obunitrow">${nf("mins", "num", a.mins, "Minutes per session", 90)}<span>min, including rest</span></div>
      <div class="obslider"><input type="range" min="30" max="120" step="5" value="${a.mins}" data-range="mins" aria-label="Minutes per session"></div>
      <div class="obzones"><span>Short</span><span class="ok">Sweet spot 45-75</span><span>Long</span></div>
      <span class="obhint ${sp.zone[0] === "ok" ? "" : "bad"}">${sp.zone[1]}</span></div>`}; }
  case "gyms": return {title:a.gyms.length > 1 ? "Your gyms" : "Your gym", wide:true, body:`
    <p class="obnote" style="margin-top:0">Exercises are only picked if your gym has the kit. Add a second gym if you train in more than one place.</p>
    ${gymEditor(a)}
    ${a.gyms.length > 1 && (a.kind === "gym" || a.kind === "hybrid") ? `<div class="obgym"><b>Usual gym each day</b>${WD.filter(([k]) => (a.days || []).includes(k)).map(([k,, sh]) => `<div class="spread"><b>${sh}</b>${seg2("gymOf." + k, a.gyms.map(g => [g.id, g.name.length > 12 ? g.name.split(/\s+/).map(w => w[0]).join("").toUpperCase() : g.name]), (a.gymOf || {})[k] || a.gyms[0].id)}</div>`).join("")}<span class="small muted">You can switch gym on the day; progress on each machine is kept per gym.</span></div>` : ""}`};
  case "sport": { const sel = a.sports || [], q = (F.sq || "").toLowerCase();
    return {title:"Any sport or regular cardio?", body:`
    <p class="obnote" style="margin-top:0">Add anything you do most weeks. No need to say which days: log it when you do it and the plan and your calories account for it.</p>
    <label class="sb card"><span>${ICON.search}</span><input data-sq="1" placeholder="Search ${window.AJSports ? Object.keys(AJSports.SP).length : ""} sports and activities" value="${esc(F.sq || "")}" autocomplete="off"></label>
    <div id="obsq" class="sprows">${sportRows(q, sel)}</div>
    ${sel.length ? `<div class="card oblist">${sel.map(x => `<div><span class="obsp"><b>${esc((AJSports.SP[x.id] || [x.id])[0])}</b></span><span class="obstepper"><button data-sportn="${x.id}" data-d="-1">−</button><b class="num">${x.n}× a week</b><button data-sportn="${x.id}" data-d="1">+</button></span></div>`).join("")}</div>` : ""}
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
    <p class="oblead">${a.look ? "Pre-filled from your look. Change them freely." : "Optional. Pick up to 3 muscles to grow faster."}</p>
    <div class="obgrid g3">${PRIORITY_CHOICES.map(m => `<button class="obcard mus" data-tog="pri" data-val="${m}" aria-pressed="${(a.pri || []).includes(m)}"><b>${MUS[m]}</b></button>`).join("")}</div>
    <p class="obnote">Priorities get about ${PRIORITY_SETS} sets a week instead of ~12 and go first in the session. ${src("volume")}</p>`, cta:(a.pri || []).length ? "Continue" : "Skip"};
  case "inj": return {title:"Anything to work around?", body:`
    <p class="oblead">Tap anything that needs care. Add a line if it helps, and the plan swaps exercises to suit.</p>
    <div class="obgrid g3">${INJ.map(([k, n]) => `<button class="obcard mus" data-tog="inj" data-val="${k}" aria-pressed="${(a.inj || []).includes(k)}"><b>${n}</b></button>`).join("")}</div>
    <textarea class="field bigtext" rows="3" data-input="injText" placeholder="e.g. tight ankles, heels lift when I squat">${esc(a.injText || "")}</textarea>
    ${(a.injText || "").trim().length > 3 ? `<button class="btn ghost" data-aiinj="1" ${F.busy ? "disabled" : ""}>${F.busy ? "Analysing…" : "Check it with AJ Training AI"}</button>` : ""}
    ${a.injAI ? `<div class="card obai"><b>What the plan will do</b><span>${esc(a.injAI.summary || "")}</span>${(a.injAI.avoid || []).length ? `<span class="small muted">Avoiding: ${a.injAI.avoid.map(k => L[k] ? L[k].n : k).join(", ")}</span>` : ""}<span class="small muted">Not medical advice. Sharp, worsening or lasting pain needs a physio or doctor.</span></div>` : ""}`, cta:(a.inj || []).length || a.injText ? "Continue" : "Nothing, skip"};
  case "lifts": { const q = (F.lq || "").toLowerCase(), mf = F.lm || "";
    const list = Object.values(L).filter(e => !["cond","sled","carry","erg"].includes(e.p) && (!q || e.n.toLowerCase().includes(q)) && (!mf || e.mu[mf] >= 1));
    const kitArr = a.gyms.flatMap(g => g.kit), kit = {has:r => kitHas(kitArr, r)};
    return {title:"Lifts you love or hate", body:`
      <p class="obnote" style="margin-top:0">Optional. Tap once to <b>star</b> (used whenever the kit allows), twice to <b>ban</b>, three times to reset.</p>
      <label class="sb card"><span>${ICON.search}</span><input data-lq="1" placeholder="Search ${Object.keys(L).length} exercises" value="${esc(F.lq || "")}" autocomplete="off"></label>
      <div class="chips obmf">${["", ...PRIORITY_CHOICES].map(m => `<button class="chip" data-lm="${m}" aria-pressed="${mf === m}">${m ? MUS[m] : "All"}</button>`).join("")}</div>
      <div class="oblifts" id="oblifts">${liftRows(list, a, kit)}</div>
      <p class="obnote">Lifts marked <em class="tagin">stretch</em> load the muscle hardest when it's lengthened; they're favoured because they tend to grow muscle as well or better. ${src("lengthened")}</p>`, cta:a.love.length || a.ban.length ? "Continue" : "Skip"}; }
  case "block": { const rp = rirPlan(+a.block, a.level, a.ramp);
    return {title:"Block, effort and rest", body:`
    <div class="obfld"><span class="obl">Block length</span>${numSeg("block", 4, 8, a.block, 6)}<span class="obhint">${a.block} weeks: ${a.block - 1} training weeks, then a lighter deload week. Planned deloads every 4-8 weeks are standard practice. ${src("deload")}</span></div>
    <div class="obfld"><span class="obl">How hard each week</span>
      <div class="obrir">${rp.map((r, i) => `<div class="${r === "DL" ? "dl" : ""}"><span>W${i + 1}</span><b>${r === "DL" ? "Deload" : r + " RIR"}</b></div>`).join("")}</div>
      <span class="obhint">RIR is reps in reserve: how many more you could have done. Set for your experience: stopping 1-2 reps short grows as much muscle as failure in trained lifters. ${src("rir")}</span></div>
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
  case "build": return {title:"", body:`<div class="obbuild"><div class="obspin">${LOGO(72)}</div><h2>Building your plan</h2><div class="obbuildbar"><i id="obbar"></i></div><div class="obticks" id="obticks"></div></div>`, nofoot:true};
  case "review": return ["gym"].includes(a.kind) ? review(a) : reviewEndu(a);
  }
}
function liftRows(list, a, kit){
  return list.length ? `<div class="obgrid">${list.slice(0, 60).map(e => { const ok = e.q.every(r => kit.has(r)), st = a.love.includes(e.k) ? "love" : a.ban.includes(e.k) ? "ban" : "";
    return `<button class="obcard lift ${st} ${ok ? "" : "na"}" data-lift="${e.k}"><span class="ph pic wide">Exercise</span>${st ? `<i class="lbadge">${st === "love" ? "★ Loved" : "✕ Banned"}</i>` : ""}<b>${esc(e.n)}</b><span>${MUS[Object.keys(e.mu).find(m => e.mu[m] >= 1)] || ""}${e.len === 2 ? " · stretch" : ""}${ok ? "" : " · not in your gym"}</span></button>`; }).join("")}</div>` : `<p class="small muted">No match.</p>`;
}
function sportRows(q, sel){
  q = (q || "").trim(); if (!q || !window.AJSports) return "";
  const ids = AJSports.search(q).filter(k => !sel.some(x => x.id === k)).slice(0, 10);
  return ids.length ? ids.map(k => `<button class="sprow" data-sport="${k}"><span class="spic">${window.AJSportIcon ? AJSportIcon(k) : ""}</span><span><b>${esc(AJSports.SP[k][0])}</b><span>${esc(AJSports.SP[k][1])}</span></span><i>+</i></button>`).join("")
    : `<p class="small muted">No match. Try another word, or pick the closest (for example "Circuit training" for a fitness class).</p>`;
}
function seg2(name, opts, cur){ return `<div class="seg obseg" style="grid-template-columns:repeat(${opts.length},1fr)">${opts.map(([k, v]) => `<button data-set="${name}" data-val="${k}" aria-pressed="${k === cur}">${v}</button>`).join("")}</div>`; }

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
// Why a sport plan is built the way it is: the sport, the dose, injury prevention, and the studies behind it
function sportWhy(prog, su){
  const p = sportProfile(su) || SPORT_GENERIC, gen = SPP().general || [], pre = (p.prehab || []).filter(k => PREHAB_N[k]), se = su.season || "off";
  const gpick = re => gen.filter(x => re.test(x.claim + " " + x.source));
  const srcs = [...(p.evidence || []), ...gpick(/injur/i).slice(0, 1), ...(se === "in" ? gpick(/in-season|maintain/i).slice(0, 1) : []), ...(pre.includes("nordic") ? gpick(/nordic/i).slice(0, 1) : []), ...(pre.includes("copenhagen") ? gpick(/copenhagen|adductor/i).slice(0, 1) : []), ...(pre.includes("shoulderER") ? gpick(/shoulder/i).slice(0, 1) : []), ...(pre.includes("neck") ? gpick(/neck|concussion/i).slice(0, 1) : []), ...(pre.includes("landing") ? gpick(/ACL|neuromuscular/i).slice(0, 1) : []), ...(pre.includes("ankle") ? gpick(/ankle|balance/i).slice(0, 1) : [])]
    .filter((x, i, arr) => arr.findIndex(y => y.source === x.source) === i);
  return `<div class="card obwhy"><h2>Why it's built this way</h2>
    ${p.summary ? `<div><b>${esc(p.name)}</b><span>${esc(p.summary)}${p.energy ? " " + esc(p.energy) : ""}</span></div>` : ""}
    <div><b>Strength and power</b><span>${su.level === "new" ? "Main lifts at 6-10 reps while you learn them, building to heavier work." : `Main lifts at 3-${se === "in" ? 5 : 6} reps, with jumps or throws first while you're fresh.`} Stronger athletes sprint, jump and change direction better, and the gym adds little bulk at this volume.</span></div>
    ${pre.length ? `<div><b>Injury prevention</b><span>${pre.map(k => PREHAB_N[k]).join(", ").replace(/^./, c => c.toUpperCase())}. Chosen for the injuries most common in ${esc(p.name.toLowerCase())}, where trials show these exercises cut injury rates.</span></div>` : ""}
    <div><b>${sportSeason(su)}</b><span>${se === "off" ? "More sessions and sets to build while your sport load is lower." : se === "pre" ? "Less volume, more speed and power, as sport training ramps up." : "One or two short sessions: enough to keep your strength through the season without leaving you tired for matches."}</span></div>
    <div><b>Your week</b><span>${su.matchDay && su.matchDay !== "none" ? `Nothing hard on ${WD.find(x => x[0] === su.matchDay)[2]}${p.avoidBefore ? " or the day before" : ""}, so you play fresh.` : "Leg-heavy sessions are kept off the day before your sport days where possible."} Move any session in the Train tab when your week changes.</span></div>
    <div><b>Progression</b><span>Progressive overload: reach the top of the rep range, then add load. Every ${prog.deloadEvery}th week is lighter.</span></div>
    ${p.confidence === "limited" ? `<div><b>How tailored this is</b><span>There's little research on training for ${esc(p.name.toLowerCase())} specifically. The plan follows what the sport demands and general athletic-training evidence, so it's sound, but less tailored than sports with more research behind them.</span></div>` : ""}
    ${srcs.length ? `<div><b>Sources</b><span>${srcs.map(x => `${esc(x.claim)} <em>(${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.source)}</a>` : esc(x.source)})</em>`).join("<br>")}</span></div>` : ""}
  </div>`;
}
function review(a){
  const prog = F.out, gl = (flowGyms() || gymList()), g = F.gym && gl.some(x => x.id === F.gym) ? F.gym : gl[0].id, gn = id => { const n = (gl.find(x => x.id === id) || {}).name || ""; return n.length > 12 ? n.split(/\s+/).map(w => w[0]).join("").toUpperCase() : n; };
  const train = prog.days.filter(d => !d.rest), su = prog.setup;
  const reps = su.level === "new" ? "Compounds 8-12 reps, isolation 10-15 while you learn the lifts." : su.goal === "strength" ? "Main barbell lifts 3-6 reps for strength; the rest 6-15 reps for muscle." : su.goal === "power" ? "One heavy lift a day (4-6 reps), the rest 6-15 reps." : "Mostly 6-15 reps. Muscle grows similarly from about 6 to 30 reps when sets end close to failure; heavier loads mainly build more maximal strength.";
  return {title:"Your block", wide:true, body:`
    <div class="obsum"><div class="full"><span>Split</span><b>${esc(prog.splitName)}</b></div><div><span>Block</span><b>${prog.deloadEvery} weeks</b></div><div><span>Starts</span><b>${fmtD(prog.startDate)}</b></div><div><span>Days</span><b>${train.length} a week</b></div></div>
    <div class="obweek">${prog.days.map(d => `<div class="${d.rest ? "rest" : ""}"><span>${WD.find(x => x[0] === d.k)[2]}</span><b>${d.rest ? (d.label && d.label !== "Rest" ? esc(d.label === "Match day" ? "Match" : d.label.split(/[ (]/)[0]) : "–") : esc(d.label.replace("Upper ","U").replace("Lower ","L").replace("Full body ","FB").replace("Arms & delts","Arms").replace("Glutes & legs","Glutes").replace("Strength + conditioning ","S+C ").replace("HYROX strength ","HY ").replace("Strength & power ","S&P ").replace("In-season strength ","In ").replace("Strength & power","S&P").replace("In-season strength","In-season"))}</b><em>${d.rest || gl.length < 2 ? "" : esc(gn(d.gym))}</em></div>`).join("")}</div>
    ${(() => { const v = prog.vol[g] || {}, sh = (su.pri || []).filter(m => (v[m] || 0) < (prog.targets[m] || 0) - 1.5); return sh.length ? `<div class="banner info"><b>Not enough time for full priority volume.</b> ${sh.map(m => MUS[m] + " " + r1(v[m] || 0) + " of " + prog.targets[m]).join(", ")} sets. Add about 15 min per session or another day, or drop a priority.</div>` : ""; })()}
    ${(() => { const v = prog.vol[g] || {}, tg = prog.targets, tot = Object.keys(tg).reduce((x, m) => x + Math.min(v[m] || 0, tg[m]), 0), all = Object.values(tg).reduce((x, y) => x + y, 0), pct = Math.round(tot / all * 100);
      return pct < 85 ? `<div class="banner info"><b>${pct}% of the recommended weekly sets fit.</b> ${a.mins} min sessions on ${train.length} days can't hold it all. Every set still counts, and growth keeps coming from less; for the full dose add about ${Math.round((1 - tot / all) * all * 2.4 / train.length / 5) * 5 + 5} min a session or another day. <button class="obsrc" data-bumpmins="15">Add 15 min and rebuild</button></div>` : ""; })()}
    ${su.split === "custom" && splitWarnings(prog.days.filter(d => !d.rest).map(d => d.tpl), su).length ? `<div class="banner"><b>Your custom split.</b> ${splitWarnings(prog.days.filter(d => !d.rest).map(d => d.tpl), su).map(esc).join(" ")}</div>` : ""}
    ${gl.length > 1 ? `<div class="spread"><span class="small muted">Sessions shown for</span>${seg2("_gym", gl.map(x => [x.id, gn(x.id)]), g)}</div>` : ""}
    ${train.map(d => { const list = d.variants[g] || [], mins = prog.mins[g][prog.days.filter(x => !x.rest).indexOf(d)];
      return `<details class="card obdayc"><summary><div class="stack" style="gap:2px"><b>${WD.find(x => x[0] === d.k)[2]} · ${esc(d.label)}</b><span class="small muted">${esc(d.focus)}</span></div><span class="small muted num">${list.reduce((s2, x) => s2 + x[1], 0)} sets · ~${Math.round(mins)} min</span></summary>
        <div class="oblist">${list.map(([k, n, ss]) => { const e = prog.exercises[k]; return `<div><span><b>${ss ? `<i class="obss">${ss}</i>` : ""}${esc(e.n)}</b><em>${esc(e.m)}${e.len === 2 ? " · stretch" : ""}</em></span><span class="num">${n} × ${e.lo}–${e.hi}<em>${e.rest >= 60 ? Math.round(e.rest / 60 * 10) / 10 + " min" : e.rest + " s"} rest</em></span></div>`; }).join("")}</div>
        <p class="small muted">${esc(d.cardio)}.</p></details>`; }).join("")}
    ${su.goal === "athletic" ? sportWhy(prog, su) : `<div class="card obwhy"><h2>Why it's built this way</h2>
      <div><b>Volume</b><span>${su.level === "new" ? "Fewer sets while you're new: you grow from less." : `About 10-14 hard sets a week for each muscle, ~${PRIORITY_SETS} for priorities. Presses and rows count towards the muscles they help, so shoulders and arms need less direct work.`} More sets keep adding muscle, but each extra set adds less. ${src("volume")}</span></div>
      <div><b>Frequency</b><span>Most muscles twice a week, so no session gets bloated. ${src("frequency")}</span></div>
      <div><b>Effort</b><span>RIR ${prog.rir.filter(r => r !== "DL").join(" → ")}, then deload. Trained lifters grow as much stopping 1-2 reps short as at failure; growth improves closer to failure. ${src("rir")}</span></div>
      <div><b>Reps</b><span>${reps} ${src("load")}</span></div>
      ${su.supersets !== false ? `<div><b>Supersets</b><span>Isolation lifts for different muscles are paired (A1, A2…) and share rest, which fits more sets into the same time without hurting performance much. Turn off on the block step. ${src("superset")}</span></div>` : ""}
      <div><b>Rest</b><span>Big barbell lifts ~2.5 min, other compounds ~2 min, isolation ~90 s${su.rest && su.rest !== "std" ? ` (${su.rest === "short" ? "shortened" : "lengthened"} to your preference)` : ""}. Adjustable during any workout. ${src("rest")}</span></div>
      <div><b>Exercise choice</b><span>Stretch-biased lifts are favoured${su.level === "new" ? ", with stable machines while you learn" : ""}. ${src("lengthened")}</span></div>
      <div><b>Progression</b><span>Progressive overload: add reps across the range, then add load. ${src("progression")}</span></div>
      <div><b>Deload</b><span>Every ${prog.deloadEvery}th week, half the sets at ~3 RIR${(prog.breaks || []).length ? `. Breaks: ${prog.breaks.map(fmtD).join(", ")} (the block pauses)` : ""}. ${src("deload")}</span></div>
      ${su.goal === "crossfit" ? `<div><b>Conditioning</b><span>Each day ends with a short conditioning piece. Reviews of CrossFit-style training find too few good studies to promise specific results, and most injuries are shoulder, spine and knee: warm up well and keep technique first.</span></div>` : ""}
    </div>`}`, cta:"Save programme"};
}

/* ---------- Welcome (first run) ---------- */
const WSTEPS = ["hello","sections","about","next"];
function wStep(s, a){
  switch (s){
  case "hello": return {title:"", body:`<div class="obhello">${LOGO(96)}<h1>Welcome${a.name ? ", " + esc(a.name) : ""}</h1>
    <p class="oblead">One app for training, running, food and habits, built on the research and shaped around you. Use all of it, or just the parts you need.</p></div>`, cta:"Get started"};
  case "sections": return {title:"What do you want to use?", body:`<p class="obnote" style="margin-top:0">Habits are always included, so you can track anything daily. You can change this any time in Settings.</p>
    ${useCards(a.use, "data-set=\"use\" data-val")}`};
  case "about": { const dob = parseDob(a.dob);
    return {title:"About you", cls:"obform", body:`<p class="obnote fopt" style="margin-top:0">Used to work out your calorie burn, targets and body-fat estimates. Nothing is shared.</p>
    <div class="obfld"><span class="obl">First name</span><input class="field" data-input="name" value="${esc(a.name)}" placeholder="Your name" autocomplete="given-name"></div>
    <div class="obfld"><span class="obl">Sex</span>${seg2("sex", [["male","Male"],["female","Female"]], a.sex)}<span class="obhint fopt">Used for the energy and body-fat maths.</span></div>
    <div class="obfld"><span class="obl">Date of birth</span><input class="field" data-dob="1" inputmode="numeric" maxlength="10" value="${esc(a.dob || "")}" placeholder="DD/MM/YYYY, e.g. 01/04/1999" autocomplete="bday">
      <span class="obhint ${a.dob && a.dob.length === 10 && !dob ? "bad" : ""}">${dob ? "Age " + dob.age : a.dob && a.dob.length === 10 ? "That date doesn't look right" : "Day, month, year"}</span></div>
    <div class="obfld"><div class="spread"><span class="obl">Height</span>${unitSeg("h")}</div>${heightRow("heightCm", a.heightCm)}
      <div class="obslider"><input type="range" min="140" max="215" step="1" value="${Math.min(215, Math.max(140, a.heightCm))}" data-range="heightCm" aria-label="Height"></div></div>
    <div class="obfld"><div class="spread"><span class="obl">Weight</span>${unitSeg("w")}</div>${weightRow("kg", a.kg)}
      <div class="obslider"><input type="range" min="35" max="200" step="0.5" value="${Math.min(200, Math.max(35, a.kg))}" data-range="kg" aria-label="Weight"></div></div>`}; }
  case "next": {
    const items = [];
    if (a.use !== "food") items.push(["prog", "Build your plan", "Gym, running or both. Two minutes, built from the research", "lift"]);
    if (a.use !== "train") items.push(["nut", "Set your food goal", "Goal, pace and targets that adapt to your real weight and food data", "food"]);
    items.push(["habits", "Add a habit (optional)", "Steps, sleep, water, quitting something, or your own", "steps"]);
    return {title:"You're set", body:`<p class="oblead">Next, set up the parts you picked. You can do them now or later from the dashboard.</p>
      <div class="obopts">${items.map(([k, t, d, ic]) => `<button class="obopt obmod" data-wnext="${k}"><span class="obmi">${ICON[ic]}</span><span><b>${t}</b><span>${d}</span></span><i class="obarrow">›</i></button>`).join("")}</div>`, cta:"Go to my dashboard"};
  }
  }
}
function welcomeDefaults(){
  const p = S.profile, md = p.modules;
  return {use:md ? useOf() : "both", name:p.name || "", sex:p.sex || null,
    birthDate:p.birthSet ? p.birthDate : "1995-01-01", dob:p.birthSet ? isoToDob(p.birthDate) : "", heightCm:p.heightCm || 175, kg:r1(currentKg() || 75), units:Object.assign({h:"cm", w:"kg"}, p.units || {})};
}
function acceptWelcome(then){
  const a = F.ans, mods = modsFor(a.use || "both");
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
const JOBEG = {desk:"Office, driving, studying", mixed:"Teaching, retail, some walking about", active:"Nursing, hospitality, warehouse", heavy:"Building, labouring, farming"};
// Tudor-Locke & Bassett 2004 / Tudor-Locke 2011 step-defined activity bands
const STEPBANDS = [[5000, "Sedentary"], [7500, "Low active"], [10000, "Somewhat active"], [12500, "Active"], [Infinity, "Highly active"]];
const STEPGUESS = [["Barely", "Drive most places", 3500], ["A little", "Short walks, errands", 6000], ["Most days", "Walk to work or the station", 8500], ["A lot", "Long daily walks or a dog", 11500], ["Loads", "On the go all day", 14500]];
const CYCLE = [["No", "Never or rarely", 0], ["A bit", "A few short rides a week", 60], ["Commute", "Most weekdays", 150], ["Lots", "An hour or more most days", 360]];
// body-fat picture choices (placeholders until the photo set exists)
const BFPICS = {male:[8, 12, 15, 20, 25, 30, 35], female:[15, 20, 25, 30, 35, 40, 45]};
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
  const kg = currentKg(), ex = expenditure(); let G = GOALS[a.type];
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
    const A = a.activity, pm = priorModel(kg), logged = loggedSteps(), sg = STEPGUESS.reduce((b, x) => Math.abs(x[2] - A.steps) < Math.abs(b[2] - A.steps) ? x : b), cy = CYCLE.reduce((b, x) => Math.abs(x[2] - A.commute) < Math.abs(b[2] - A.commute) ? x : b);
    const card = (attr, on, ic, t, d) => `<button class="obcard" ${attr} aria-pressed="${on}"><span class="ph ic">${ic}</span><b>${t}</b><span>${d}</span></button>`;
    return {title:"How active are you?", cls:"obform", body:`
      <p class="oblead">Three quick taps. This only sets your starting point: your food logs and weigh-ins correct it from there.</p>
      <div class="obfld"><span class="obl">1. A normal weekday, outside the gym</span>
        <div class="obgrid">${Object.entries(JOB).map(([k, v]) => card(`data-set="activity.job" data-val="${k}"`, A.job === k, "", v[0], JOBEG[k])).join("")}</div></div>
      <div class="obfld"><span class="obl">2. How much do you walk?</span>
        <div class="obgrid">${STEPGUESS.map(([t, d, v]) => card(`data-setsteps="${v}"`, !A.exact && sg[2] === v, "", t, d)).join("")}</div>
        <button class="link" data-exact="1">${A.exact ? "Use the options above instead" : logged ? `Use my logged average (${fmtN(logged.avg)} steps)` : "I know my daily steps"}</button>
        ${A.exact ? `<div class="obunitrow">${nf("activity.steps", "steps", A.steps, "Steps a day", 120)}<span>steps a day</span></div>` : ""}
        <span class="obhint">Link Apple Health in Settings and your real step count replaces this every day.</span></div>
      <div class="obfld"><span class="obl">3. Do you cycle to get around?</span>
        <div class="obgrid">${CYCLE.map(([t, d, v]) => card(`data-setcycle="${v}"`, cy[2] === v, "", t, d)).join("")}</div>
        <span class="obhint">Only cycling for transport: it doesn't show up in your steps. Rides for sport are logged as cardio.</span></div>
      <div class="card"><div class="spread"><h3>Starting estimate</h3><b class="num">${fmtN(pm.total)} kcal a day</b></div>
        <span class="small muted">Your training and logged cardio are added on top automatically.</span></div>`, cta:F.single ? "Save" : undefined};
  }
  case "stats": { const bf = currentBf(), today = (S.weights.find(w => w.d === ymd(new Date())) || S.weights[S.weights.length - 1] || {}).kg || kg, sx = S.profile.sex === "female" ? "female" : "male", cur = a.bf != null ? +a.bf : null;
    return {title:"Check your numbers", cls:"obform", body:`
    <div class="obfld"><div class="spread"><span class="obl">Weight today</span>${unitSeg("w")}</div>${weightRow("kgNow", a.kgNow != null ? a.kgNow : today)}
      <span class="obhint">Saved as today's weigh-in.</span></div>
    <div class="obfld"><span class="obl">Which looks most like you?</span>
      <span class="obhint">Pick the closest. It only fine-tunes the energy maths, so close is good enough.</span>
      <div class="bfpics">${BFPICS[sx].map(v => `<button class="bfpic" data-bf="${v}" aria-pressed="${cur === v}"><span class="ph pic">Photo</span><b>~${v}%</b></button>`).join("")}</div>
      <button class="link" data-bf="skip">Not sure: use an estimate${cur == null ? " (selected)" : ""}</button></div>
    <div class="card"><div class="spread"><h3>Starting burn</h3><b class="num">${fmtN(ex.kcal)} kcal</b></div>
      <span class="small muted">${ex.adaptive ? `Measured from ${ex.n} days of food and weight logs.` : `An estimate for now. After 5 fully logged days the app starts measuring your real burn from your food and weight, and relies on it more each day.`} ${src("energy")}</span></div>`}; }
  case "target": {
    const step = 0.5, [lo, hi] = targetBounds(a.type, kg);
    if (+a.targetKg < lo || +a.targetKg > hi) a.targetKg = Math.min(hi, Math.max(lo, +a.targetKg));
    return {title:a.type === "bulk" ? "Target weight" : "Goal weight", body:`
      <div class="obbig num"><button class="obstep" data-bump="targetKg" data-d="-${step}">−</button><b>${(+a.targetKg).toFixed(1)}<span> kg</span></b><button class="obstep" data-bump="targetKg" data-d="${step}">+</button></div>
      <input type="range" min="${lo}" max="${hi}" step="0.5" value="${a.targetKg}" data-range="targetKg">
      <p class="obnote">${(+a.targetKg - kg >= 0 ? "+" : "") + (a.targetKg - kg).toFixed(1)} kg from your current trend weight. You can change this any time.</p>`};
  }
  case "rate": {
    const G0 = G; { const rec = recRange(a); G = Object.assign({}, G0, {rec}); }
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
      <p class="obnote">${a.type === "bulk" ? `For trained lifters, about 0.25% of body weight a week (a 5-10% surplus) builds muscle with little extra fat; beginners can go up to ~0.5%. A bigger surplus mostly added fat in a 2023 trial.` : `Reviews recommend 0.5-1% of body weight a week; leaner people should go slower (about 0.5% or less), and in elite athletes ~0.7% a week kept more muscle than ~1.4%. ${G.rec[1] <= 0.5 ? "At your body fat, the slower range is recommended." : ""}`} ${src(G.src)}</p>`};
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
// Recommended pace (Helms 2014; Garthe 2011; Ruiz-Castellano 2021; Iraki 2019; Helms 2023): cuts 0.5-1.0% a week, no more than ~0.5% once lean;
// bulks ~0.25% a week for trained lifters, up to 0.5% for beginners. Lean cut-offs (men ~12%, women ~22% body fat) are convention.
function recRange(a){
  const bf = currentBf().v, lean = S.profile.sex === "female" ? bf < 22 : bf < 12, lvl = (S.prog && S.prog.setup && S.prog.setup.level) || "inter";
  if (a.type === "cut") return lean ? [0.25, 0.5] : [0.5, 1.0];
  if (a.type === "bulk") return lvl === "new" ? [0.25, 0.5] : [0.15, 0.35];
  return [0, 0];
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
  const markup = `<div class="obtop"><button class="iconbtn" data-ob="back" aria-label="Back" ${F.kind === "welcome" && i === 0 ? 'style="visibility:hidden" tabindex="-1" aria-hidden="true"' : ""}>${ICON.back}</button>
      <div class="obprog"><i style="width:${(i + 1) / steps.length * 100}%"></i></div>${F.kind === "welcome" ? `<button class="iconbtn obthemebtn" data-obtheme="1" aria-label="${isDark() ? "Switch to light mode" : "Switch to dark mode"}">${isDark() ? ICON.sun : HICON.moon}</button>` : ""}<button class="iconbtn" data-ob="close" aria-label="Close">✕</button></div>
    ${fitFlow() ? `<div class="obbody obfit ${s.cls || ""}"><div class="obfitin">${s.title ? `<h1 class="obtitle">${s.title}</h1>` : ""}${s.body}</div></div>`
      : `<div class="obbody ${s.wide ? "wide" : ""} ${s.cls || ""}">${s.title ? `<h1 class="obtitle">${s.title}</h1>` : ""}${s.body}</div>`}
    ${s.nofoot ? "" : `<div class="obfoot">${s.alt ? `<button class="btn ghost" data-ob="alt">${s.alt}</button>` : ""}<button class="btn orange" data-ob="next" ${blocked ? "disabled" : ""}>${s.cta || "Continue"}</button></div>`}`;
  // Same screen: update in place, element by element, so nothing flashes or jumps. New screen: render fresh.
  if (o.dataset.step === F.kind + ":" + F.step && !F.dir && o.children.length){
    const tmp = document.createElement("div"); tmp.innerHTML = markup;
    if (tmp.children.length === o.children.length){ const nk = [...tmp.children]; [...o.children].forEach((c, k) => patchDeep(c, nk[k], null)); fillRanges(o); fitCheck(); F.keepScroll = false; if (F.step === "build") runBuild(); return; }
  }
  o.innerHTML = markup; o.dataset.step = F.kind + ":" + F.step;
  o.querySelectorAll("details summary b").forEach(x => { if (openD.includes(x.textContent)) x.closest("details").open = true; });
  if (!F.keepScroll && F.dir){ const bd = o.querySelector(".obbody"); [...bodyBox(bd).children].forEach((c, i) => c.style.setProperty("--i", i)); bd.classList.add(F.dir === "back" ? "ob-back" : "ob-fwd"); F.dir = null; }
  if (F.keepScroll) o.querySelector(".obbody").scrollTop = scrollY; F.keepScroll = false;
  if (focusKey){ const x = o.querySelector(focusKey); if (x){ x.focus({preventScroll:true}); try{ const n = x.value.length; x.setSelectionRange(n, n); }catch(e){} } }
  fillRanges(o); fitCheck();
  if (F.step === "build") runBuild();
}
// First-run screens: no scrolling. Scale the whole screen to the phone (by width, then down until it fits the height),
// then spread any spare height into the gaps so it fills the screen.
const isDark = () => { const t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches); };
const fitFlow = () => F && F.kind === "welcome";
const bodyBox = b => (b && b.querySelector(".obfitin")) || b;
function fitScreen(){
  // Smart fit for the first-run screens, in order of what matters least:
  // 1) sizes follow the phone's width; 2) too tall: tighten the spacing first; 3) still too tall: shrink sizes a little
  // (text never below a readable floor); 4) still too tall: drop optional helper lines; 5) spare height: open the spacing up.
  const b = document.querySelector("#ob .obbody.obfit"); if (!b) return;
  const o = b.closest(".ob"), set = (sz, sp) => { o.style.setProperty("--sz", sz.toFixed(3)); o.style.setProperty("--sp", sp.toFixed(3)); };
  const fits = () => b.scrollHeight <= b.clientHeight + 1;
  const search = (lo, hi, f) => { for (let n = 0; n < 8; n++){ const m = (lo + hi) / 2; if (f(m)) lo = m; else hi = m; } return lo; };   // largest value that still fits
  b.classList.remove("tight", "scrolls");
  const sz0 = Math.min(1.15, Math.max(0.92, b.clientWidth / 390));
  set(sz0, 1);
  if (fits()){
    // spare height: open the spacing a little, then grow sizes (tall phones), then open the spacing the rest of the way
    if (!(set(sz0, 1.6), fits())){ const sp = search(1, 1.6, v => (set(sz0, v), fits())); set(sz0, sp); return b.classList.add("fits"); }
    const szMax = Math.min(1.25, sz0 * 1.15), sz = (set(szMax, 1.6), fits()) ? szMax : search(sz0, szMax, v => (set(v, 1.6), fits()));
    const sp = (set(sz, 2.6), fits()) ? 2.6 : search(1.6, 2.6, v => (set(sz, v), fits())); set(sz, sp); return b.classList.add("fits");
  }
  if (set(sz0, 0.35), fits()){ const sp = search(0.35, 1, v => (set(sz0, v), fits())); set(sz0, sp); return b.classList.add("fits"); }
  const MINSZ = 0.84;
  if (set(MINSZ, 0.35), fits()){ const sz = search(MINSZ, sz0, v => (set(v, 0.35), fits())); set(sz, 0.35); return b.classList.add("fits"); }
  b.classList.add("tight");
  if (fits()){ const sz = search(MINSZ, sz0, v => (set(v, 0.35), fits())); set(sz, 0.35); const sp = search(0.35, 1, v => (set(sz, v), fits())); set(sz, sp); return b.classList.add("fits"); }
  b.classList.add("scrolls"); b.classList.remove("fits");     // last resort on very small screens
}
let fitT = null;
window.addEventListener("resize", () => { const ae = document.activeElement; if (ae && /INPUT|TEXTAREA/.test(ae.tagName) && ae.closest("#ob")) return; clearTimeout(fitT); fitT = setTimeout(fitScreen, 60); });
// No rubber-band scrolling when everything fits on screen
function fitCheck(){ fitScreen(); const b = document.querySelector("#ob .obbody"); if (!b || b.classList.contains("obfit")) return; requestAnimationFrame(() => b.classList.toggle("fits", b.scrollHeight <= b.clientHeight + 1)); }
function go2(step, dir){ F.dir = dir || "fwd"; F.step = step; saveDraft(); draw(); const b = document.querySelector("#ob .obbody"); if (b) b.scrollTop = 0; }
function next(){
  const steps = stepsOf(), i = steps.indexOf(F.step);
  if (F.kind === "prog" && F.step === "review") return acceptProg();
  if (F.kind === "prog" && F.step === "build") return;
  if (F.kind === "nut" && F.step === "review") return acceptNut();
  if (F.kind === "welcome" && F.step === "next") return acceptWelcome("home");
  if (F.kind === "welcome" && F.step === "about" && !F.ans.sex){ toast("Choose one so the energy maths is right"); return; }
  if (F.kind === "welcome" && F.step === "about" && F.ans.dob && !parseDob(F.ans.dob)){ toast("Enter your date of birth as DD/MM/YYYY, or leave it blank"); return; }
  if (F.kind === "nut" && F.single && F.step === "activity"){ F.accepted = true; S.profile.activity = clone(F.ans.activity); saveProfile(); toast("Activity saved: starting estimate " + fmtN(priorModel(currentKg()).total) + " kcal"); return close(); }
  if (F.kind === "prog"){
    const a = F.ans;
    if (F.step === "goal" && !a.gfam){ toast("Pick one"); return; }
    if (F.step === "custom"){ if (!a.customAI) customFallback(a); a.customDone = true; const st = stepsOf(); return go2(st[st.indexOf("goal") + 1] || "build"); }
    if (F.step === "sportpick" && !sportProfile(a)){ toast("Pick your sport, or type it in and let the AI build it"); return; }
    if (F.step === "sportpick" && !a.season){ const p = sportProfile(a); a.season = "off"; }
    if (F.step === "season"){ a.nTrain = recDays(a); a.days = chooseDays(a.nTrain, sportBlocked(a)); a.mins = a.mins && a.mins <= 75 ? a.mins : 60; }
    if (F.step === "sportdays"){ a.days = chooseDays(a.nTrain || recDays(a), sportBlocked(a)); if (!(a.sport || []).includes(a.matchDay)) a.matchDay = "none"; }
    if (F.step === "look" && !a.look){ toast("Pick a look, or go back and choose another goal"); return; }
    if (F.step === "days" && a.kind === "gym"){ a.days = chooseDays(a.nTrain || a.days.length || recDays(a), sportBlocked(a)); if (!a.days.length){ toast("Leave at least one day open"); return; } }
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
  const lines = a.gtype === "sport" ? ["Reading what " + ((sportProfile(a) || SPORT_GENERIC).name).toLowerCase() + " demands", "Choosing strength and power work", "Adding injury prevention with evidence", "Placing sessions around your sport days", ...(flowGyms() || gymList()).map(g => "Picking exercises for " + g.name), "Setting the " + sportSeason(a).toLowerCase() + " dose"]
    : k === "gym" ? [a.goal === "crossfit" ? "Mixing strength and conditioning" : "Choosing your split", "Placing sessions around your week", ...(flowGyms() || gymList()).map(g => "Picking exercises for " + g.name), "Setting weekly volume per muscle", "Fitting sessions into " + a.mins + " min", "Planning effort, rest and the deload"]
    : k === "hyrox" ? ["Mapping the weeks to " + (a.hasDate ? "race day" : "a 12-week build"), "Setting run intervals at race pace", "Building race simulations", "Writing station strength", "Planning recovery weeks"]
    : k === "tri" ? ["Mapping the weeks to " + (a.hasDate ? "race day" : "your distance"), "Balancing swim, bike and run", "Keeping most of it easy", "Adding the weekly brick", ...(+a.strengthN ? ["Writing strength sessions"] : []), "Planning the taper"]
    : ["Mapping the weeks to " + (a.event === "general" ? "your goal" : a.hasDate ? "race day" : "being ready"), ...(+a.runLevel === 0 ? ["Starting with a run/walk build"] : []), "Splitting base, build, peak" + (a.event === "general" ? "" : " and taper"), "Setting the long-run progression", "Balancing easy and hard runs", ...(+a.strengthN ? ["Writing strength sessions"] : []), ...((EVENTS[a.event] || {}).heat ? ["Adding pack and heat training"] : [])];
  const box = document.getElementById("obticks"), bar = document.getElementById("obbar"); let n = 0;
  if (k === "gym"){ if (a.split !== "custom" && (!a.split || !(SPLITS[a.days.length] || []).some(s => s.id === a.split))){ const r = recommendSplit(a); a.split = r ? r.id : (SPLITS[a.days.length] || [])[0]?.id; } F.out = generate(a, F.seed); }
  else F.out = generateEndu(F.ans, F.seed);
  box.innerHTML = lines.map(l => `<div><i></i><span>${l}</span></div>`).join("");
  const rows = [...box.children];
  const t = setInterval(() => {
    if (!box.isConnected){ clearInterval(t); return; }
    if (rows[n - 1]) rows[n - 1].classList.add("done");
    if (rows[n]) rows[n].classList.add("on");
    if (bar) bar.style.width = Math.min(100, (n / lines.length) * 100) + "%";
    if (++n > lines.length){ clearInterval(t); setTimeout(() => { if (F && F.step === "build"){ F.gym = null; go2("review"); } }, 450); }
  }, 420);
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
// a sport named in free text: longest matching name or alias wins ("rugby league" before "rugby")
function matchSport(text){ const t = " " + String(text || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ") + " "; let best = null;
  for (const sp of SPP().sports) for (const w of [sp.name, ...(sp.aliases || [])]){ const x = " " + String(w).toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim() + " "; if (x.trim() && t.includes(x) && (!best || x.length > best.len)) best = {id:sp.id, len:x.length}; }
  return best ? best.id : null; }
function customFallback(a){ const sp = matchSport(a.customText); if (sp){ setGtype(a, "sport"); a.sportId = sp; a.sportCustom = null; a.season = a.season || "off"; a.customDone = true; return; } const t = (a.customText || "").toLowerCase(); const hit = KW.find(([re]) => new RegExp(re).test(t)); setGtype(a, hit ? hit[1] : "muscle"); a.customDone = true;
  const ev = /ultra/.test(t) ? "ultra" : /half/.test(t) ? "half" : /marathon/.test(t) ? "marathon" : /10 ?k/.test(t) ? "10k" : /5 ?k|parkrun/.test(t) ? "5k" : null; if (ev) a.event = ev; }
async function aiJson(prompt){ if (!window.sampler && typeof sampler === "undefined") throw new Error("noai"); const sm = typeof sampler !== "undefined" ? sampler : window.sampler; if (!sm) throw new Error("noai"); return await sm.json(prompt, {modelTier:"default"}); }
async function aiCustom(){
  const a = F.ans; if (!(a.customText || "").trim()){ toast("Describe your goal first"); return; }
  F.busy = true; F.keepScroll = true; draw();
  try{
    const r = await aiJson(`You map a person's training goal to a plan type for an evidence-based fitness app. Goal, in their words: """${a.customText.slice(0, 800)}"""
Plan types: sport (training to support a specific sport, e.g. tennis, MMA, swimming, climbing, padel, rugby; give "sportName"), muscle (hypertrophy), strength, power (powerbuilding), aesthetic, gymcardio (lifting plus some cardio, also for sport pre-season or hiking prep), run (running; give event "5k","10k","half","marathon","ultra","general" or "custom" with goalKm), hybrid (lifting and running), hyrox, crossfit, tri (triathlon; tri "sprint","olympic","half","full").
Reply with only JSON: {"gtype": one of the types, "title": short plan title, "summary": one or two plain sentences on how the plan will serve the goal, "notes": one sentence of honest caveats or "" , "event": string or null, "goalKm": number or null, "tri": string or null, "sportName": string or null, "pri": [up to 3 of chest,lats,upback,sdelt,rdelt,biceps,triceps,quads,hams,glutes,calves,abs], "nDays": number or null}`);
    if (!r || !GTYPES[r.gtype] || r.gtype === "custom") throw new Error("bad");
    a.customAI = {title:String(r.title || "").slice(0, 80), summary:String(r.summary || "").slice(0, 400), notes:String(r.notes || "").slice(0, 300)};
    setGtype(a, r.gtype); a.gtypeFrom = "custom";
    if (r.gtype === "sport"){ const id = matchSport(r.sportName || a.customText); if (id){ a.sportId = id; a.sportCustom = null; } else { a.sportId = null; a.sportCustom = null; a.sportOther = String(r.sportName || "").slice(0, 60); } a.season = a.season || "off"; }
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
  o.addEventListener("toggle", e => { const d = e.target; if (!d.classList || !d.classList.contains("eqgrp")) return; const sm = d.querySelector("[data-gall]"); if (!sm) return; const key = sm.dataset.g + sm.dataset.gall, cur = F.openEq || []; F.openEq = d.open ? [...new Set(cur.concat(key))] : cur.filter(x => x !== key); }, true);
  o.addEventListener("click", e => { const tb = e.target.closest("[data-obtheme]"); if (tb){ setTheme(isDark() ? "light" : "dark"); draw(); return; } });
  o.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.ob === "next") return next();
    if (b.dataset.ob === "back") return back();
    if (b.dataset.ob === "close") return close();
    if (b.dataset.ob === "alt"){ F.seed = Math.random().toString(36).slice(2, 7); F.out = generate(F.ans, F.seed); F.keepScroll = true; draw(); toast("New exercise picks"); return; }
    if (b.dataset.src) return window.AJScience && AJScience.open(b.dataset.src);
    if (b.dataset.spid){ F.ans.sportId = b.dataset.spid; F.ans.sportCustom = null; saveDraft(); F.keepScroll = true; draw(); setTimeout(() => { if (F) next(); }, 200); return; }
    if (b.dataset.aisport) return aiSport();
    if (b.dataset.wnext) return acceptWelcome(b.dataset.wnext);
    if (b.dataset.set){
      if (b.dataset.set === "_gym"){ F.gym = b.dataset.val; F.keepScroll = true; return draw(); }
      let v = b.dataset.val; if (["block","prot","nDays","runs","strengthN","triLevel","nTrain"].includes(b.dataset.set) || /^gyms\.\d+\.(dbStep|plate)$/.test(b.dataset.set)) v = +v;
      if (b.dataset.set === "hasDate") v = v === "yes";
      if (b.dataset.set === "gtype"){ setGtype(F.ans, v); F.ans.customDone = false; saveDraft(); F.keepScroll = true; draw(); setTimeout(() => { if (F) next(); }, 220); return; }
      if (b.dataset.set === "nTrain"){ F.ans.nTrain = +v; F.ans.days = chooseDays(+v, sportBlocked(F.ans)); saveDraft(); F.keepScroll = true; return draw(); }
      setPath(F.ans, b.dataset.set, v);
      if (b.dataset.set === "runs" || b.dataset.set === "longDay") F.ans.runDays = null;
      if (b.dataset.set === "split" && v !== "custom") F.splitAI = null;
      if (b.dataset.set.startsWith("activity.")) S.profile.activity = clone(F.ans.activity);
      if (b.dataset.set.startsWith("units.")){ S.profile = {...S.profile, units:Object.assign({}, S.profile.units, F.ans.units)}; saveProfile(); }
      if (b.dataset.set === "type"){ const kg = currentKg(), rr = recRange({type:v}); F.ans.rate = v === "cut" || v === "bulk" ? Math.round((rr[0] + rr[1]) / 2 * 20) / 20 : 0; F.ans.prot = v === "cut" ? 2.2 : 2.0; F.ans.targetKg = r1(v === "cut" ? kg * 0.94 : v === "bulk" ? kg * 1.05 : kg); }
      saveDraft(); F.keepScroll = true; draw();
      if (b.classList.contains("obopt") && (["level","type"].includes(b.dataset.set) || (b.dataset.set === "event" && !["custom","ultra"].includes(v)))) setTimeout(() => { if (F) next(); }, 220);
      return;
    }
    if (b.dataset.tog){
      const path = b.dataset.tog, cur = getPath(F.ans, path) || [], v = b.dataset.val;
      let nv = cur.includes(v) ? cur.filter(x => x !== v) : cur.concat(v);
      if (path === "pri" && nv.length > 3) nv = nv.slice(1);
      setPath(F.ans, path, nv);
      if (path === "blocked"){ F.ans.days = chooseDays(F.ans.nTrain || F.ans.days.length, nv); if (F.ans.days.length < (F.ans.nTrain || 0)) toast(`Only ${F.ans.days.length} days left open`); }
      if (path === "days" || path === "blocked"){ F.ans.gymOf = F.ans.gymOf || {}; nv.forEach(k => { if (!(flowGyms() || gymList()).some(g => g.id === F.ans.gymOf[k])) F.ans.gymOf[k] = (flowGyms() || gymList())[0].id; }); F.ans.split = null; }
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
    if (b.dataset.gfam){ const g = b.dataset.gfam; a.gfam = g; setGtype(a, g === "race" ? (["hyrox","crossfit","tri"].includes(a.gtype) ? a.gtype : "hyrox") : g === "strength" ? (["strength","power"].includes(a.gtype) ? a.gtype : "strength") : g); a.customDone = false; redraw(); setTimeout(() => { if (F) next(); }, 220); return; }
    if (b.dataset.runlevel != null){ const lv = RUNLEVELS[+b.dataset.runlevel]; a.runLevel = +b.dataset.runlevel; a.weeklyKm = lv[2]; a.longest = lv[3]; a.runs = lv[4]; return redraw(); }
    if (b.dataset.gpreset){ const g = a.gyms.find(x => x.id === b.dataset.g), t = GYMTYPES[b.dataset.gpreset]; g.type = b.dataset.gpreset; g.kit = t[2].slice(); if (g.name === "New gym" || g.name === "My gym" || /^Gym \d/.test(g.name) || Object.values(GYMTYPES).some(x => x[0] === g.name)) g.name = t[0]; return redraw(); }
    if (b.dataset.dbw){ const g = a.gyms.find(x => x.id === b.dataset.g), w = +b.dataset.dbw; g.dbs = (g.dbs || []).includes(w) ? g.dbs.filter(x => x !== w) : [...(g.dbs || []), w].sort((x, y) => x - y); return redraw(); }
    if (b.dataset.gkit){ const g = a.gyms.find(x => x.id === b.dataset.g), k = b.dataset.gkit; g.kit = g.kit.includes(k) ? g.kit.filter(x => x !== k) : g.kit.concat(k); return redraw(); }
    if (b.dataset.gall != null){ e.preventDefault(); const g = a.gyms.find(x => x.id === b.dataset.g), items = EQG[+b.dataset.gall][1].map(x => x[0]), all = items.every(k => g.kit.includes(k)); g.kit = all ? g.kit.filter(k => !items.includes(k)) : [...new Set(g.kit.concat(items))]; return redraw(); }
    if (b.dataset.gadd){ a.gyms.push({id:uid("g"), name:"Gym " + (a.gyms.length + 1), type:"", kit:[], dbMax:40, dbStep:2, dbMode:"step2", dbs:[], plate:1.25}); return redraw(); }
    if (b.dataset.gdel){ a.gyms = a.gyms.filter(g => g.id !== b.dataset.gdel); return redraw(); }
    if (b.dataset.sport){ a.sports = (a.sports || []).concat({id:b.dataset.sport, n:1}); F.sq = ""; return redraw(); }
    if (b.dataset.sportn){ a.sports = a.sports.map(x => x.id === b.dataset.sportn ? {...x, n:x.n + (+b.dataset.d)} : x).filter(x => x.n > 0); return redraw(); }
    if (b.dataset.lm != null){ F.lm = b.dataset.lm; F.keepScroll = true; return draw(); }
    if (b.dataset.supers){ a.supersets = a.supersets === false; return redraw(); }
    if (b.dataset.bumpmins){ a.mins = Math.min(120, +a.mins + 15); F.out = a.kind === "gym" ? generate(a, F.seed) : generateEndu(a, F.seed); toast("Sessions now " + a.mins + " min"); return redraw(); }
    if (b.dataset.addbreak){ const d = a.breakAdd; if (!d){ toast("Pick a date in that week"); return; } const ws = ymd(weekStart(parseD(d))); a.breaks = [...new Set([...(a.breaks || []), ws])].sort(); a.breakAdd = ""; return redraw(); }
    if (b.dataset.delbreak){ a.breaks = (a.breaks || []).filter(x => x !== b.dataset.delbreak); return redraw(); }
    if (b.dataset.setsteps){ F.ans.activity.steps = +b.dataset.setsteps; F.ans.activity.exact = false; S.profile.activity = clone(F.ans.activity); saveDraft(); F.keepScroll = true; draw(); return; }
    if (b.dataset.bf){ if (b.dataset.bf === "skip"){ F.ans.bf = null; S.profile = {...S.profile, bfManual:null}; saveProfile(); } else { F.ans.bf = +b.dataset.bf; commitBf(); } F.keepScroll = true; draw(); return; }
    if (b.dataset.exact){ const ls = loggedSteps(); F.ans.activity.exact = !F.ans.activity.exact; if (F.ans.activity.exact && ls) F.ans.activity.steps = ls.avg; S.profile.activity = clone(F.ans.activity); saveDraft(); F.keepScroll = true; draw(); return; }
    if (b.dataset.setcycle != null){ F.ans.activity.commute = +b.dataset.setcycle; S.profile.activity = clone(F.ans.activity); saveDraft(); F.keepScroll = true; draw(); return; }
    if (b.dataset.bump){ const k = b.dataset.bump; let v = r1((+F.ans[k]) + (+b.dataset.d)); if (k === "targetKg"){ const [lo, hi] = targetBounds(F.ans.type, currentKg()); v = Math.min(hi, Math.max(lo, v)); } F.ans[k] = v; saveDraft(); F.keepScroll = true; draw(); return; }
  });
  o.addEventListener("input", e => {
    const t = e.target;
    if (t.dataset.range){ setPath(F.ans, t.dataset.range, +t.value); if (t.dataset.range.startsWith("activity.")) S.profile.activity = clone(F.ans.activity); saveDraft(); liveRange(t); }
    if (t.dataset.input){ F.ans[t.dataset.input] = t.value; saveDraft(); }
    if (t.dataset.spq){ F.spq = t.value; const box = document.getElementById("obspq"); if (box) box.innerHTML = sportRowsPick(t.value.toLowerCase()); return; }
    if (t.dataset.sq){ F.sq = t.value; const box = document.getElementById("obsq"); if (box) box.innerHTML = sportRows(t.value.toLowerCase(), F.ans.sports || []); return; }
    if (t.dataset.lq){ F.lq = t.value; const box = document.getElementById("oblifts"); const q = t.value.toLowerCase(), mf = F.lm || ""; if (box) box.innerHTML = liftRows(Object.values(L).filter(e => !["cond","sled","carry","erg"].includes(e.p) && (!q || e.n.toLowerCase().includes(q)) && (!mf || e.mu[mf] >= 1)), F.ans, {has:r => kitHas(F.ans.gyms.flatMap(g => g.kit), r)}); return; }
    if (t.dataset.eqq){ F.eqq = t.value; saveDraft(); F.keepScroll = true; draw(); const x = document.querySelector("[data-eqq]"); if (x){ x.focus(); try{ x.setSelectionRange(x.value.length, x.value.length); }catch(e){} } return; }
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
  const st = (F.kind === "prog" ? pStep : F.kind === "welcome" ? wStep : nStep)(F.step, F.ans), body = bodyBox(document.querySelector("#ob .obbody"));
  const tmp = document.createElement("div"); tmp.innerHTML = (st.title ? `<h1 class="obtitle">${st.title}</h1>` : "") + st.body;
  if (body.children.length !== tmp.children.length){ F.keepScroll = true; return draw(); }
  const nk = [...tmp.children]; [...body.children].forEach((c, k) => patchDeep(c, nk[k], t));
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
  lib:L, MUS, fmtH, kitHas, generate, generateEndu, enduPlan, EVENTS, RUNTYPE, KIT_DEFAULT, targetsFor, EQUIP
};
})();
