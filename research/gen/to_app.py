"""Turn research/premade_programmes.json into public/programmes.js for the app.
Each exercise name maps to a library key (so history and the coach work), keeping the programme's own wording as the name."""
import json, re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = json.load(open(os.path.join(ROOT, "premade_programmes.json")))
M = {
 "45 degree back extension":"hipext","45 degree back extension (glute bias)":"hipext","Assisted sissy squat":"sissy","Back squat":"squat",
 "Banded curl":"bandcurl","Banded face pull":"bandfp","Banded lateral raise":"bandlat","Banded seated hip abduction":"bandabd",
 "Barbell bench press":"bench","Barbell bench press (paused)":"lpbench","Barbell curl":"bbcurl","Barbell hip thrust":"hipthrust","Barbell hip thrust (paused)":"hipthrust",
 "Barbell row":"bbrow","Bayesian cable curl":"bayes","Bodyweight triceps extension":"bwtriext","Bulgarian split squat":"bss","Bulgarian split squat (glute bias)":"bss",
 "Cable Y-raise":"cabyraise","Cable crunch":"cabcrunch","Cable curl":"cabcurl","Cable glute kickback":"cabkick","Cable pullover (rope)":"pullover","Cable rope hammer curl":"ropehammer",
 "Chest-supported T-bar row":"tbarrow","Chest-supported dumbbell row":"csdb","Chest-supported dumbbell row (wide)":"csdb","Chest-supported machine row":"csrow",
 "Chin-up":"chinup","Chin-up (underhand)":"chinup","Close-grip chin-up":"chinup","Close-grip bench press":"cgbench","Close-grip underhand lat pulldown":"revpd",
 "Cross-body cable triceps extension":"xbodyext","Single-arm cross-body cable extension":"xbodyext","Cross-body dumbbell hammer curl":"hammer","Deadlift (conventional or sumo)":"deadlift",
 "Deficit dumbbell reverse lunge":"defrevlunge","Deficit push-up":"defpushup","Deficit push-up (progress to archer push-up)":"defpushup","Dip":"dips","Weighted dip":"dips","Weighted dip (upright)":"tridip","Machine dip":"dipmach",
 "Dumbbell Romanian deadlift":"dbrdl","Romanian deadlift (dumbbell)":"dbrdl","Dumbbell bench press":"flatdb","Flat dumbbell press":"flatdb","Dumbbell curl":"dbcurl","Dumbbell fly":"dbfly",
 "Dumbbell hammer curl":"hammer","Dumbbell lateral raise":"dblat","Lean-away dumbbell lateral raise":"dblat","Dumbbell pullover":"floorpo","Dumbbell shrug":"dbshrug",
 "Dumbbell step-up":"stepup","High step-up":"stepup","Dumbbell walking lunge":"walklunge","Dumbbell weighted crunch":"dbcrunch","EZ-bar curl":"ezcurl","EZ-bar preacher curl":"preacher",
 "EZ-bar skull crusher":"ezskull","Face pull":"facepull","Feet-elevated inverted row":"invrow","Wide inverted row":"invrow","Feet-elevated pike push-up":"pikepush",
 "Hack squat":"hack","Hack squat (deep)":"hack","Half-kneeling single-arm cable pulldown":"sulek","Hanging leg raise":"hangleg","Heel-elevated cyclist squat":"cyclist",
 "Heel-elevated dumbbell goblet squat":"goblet","High-bar back squat":"squat","Hip abduction machine":"abductor","Hip abduction machine (leaning forward)":"abductor","Hip adduction machine":"adductor",
 "Hollow body hold":"plank","Incline Smith machine press":"incsmith","Incline barbell press":"incbench","Incline barbell press (30 degrees)":"incbench","Incline cable fly":"cabfly",
 "Incline dumbbell curl":"incurl","Incline dumbbell press":"incdb","Incline machine chest press":"incmachine","Lat pulldown":"latpd","Wide-grip lat pulldown":"latpd","Neutral-grip lat pulldown":"ngpd",
 "Leg extension":"legext","Leg press":"legpress","Leg press, feet high and wide":"legpress","Low-to-high cable fly":"cabfly","Seated cable fly":"cabfly","Lying dumbbell leg curl":"dblegcurl",
 "Lying dumbbell triceps extension":"skull","Lying leg curl":"lyingcurl","Machine chest press":"chestpress","Machine lateral raise":"latraisemach","Machine or barbell hip thrust":"hipthrustm",
 "Machine preacher curl":"preacher","Machine shoulder press":"mshoulder","Nordic hamstring curl (lowering only)":"nordicham","Overhead cable triceps extension":"ohext",
 "Overhead dumbbell triceps extension":"dbohext","Pec deck":"pecdeck","Plank":"plank","Pseudo-planche push-up":"pushup","Pull-up":"pullup","Pull-up (assisted if needed)":"pullup",
 "Pull-up (if you have a bar) or single-arm dumbbell row":"pullup","Weighted pull-up":"pullup","Weighted pull-up (wide grip)":"pullup","Rear delt cable fly":"revfly","Reverse pec deck":"revpec",
 "Reverse-grip EZ-bar curl":"revcurl","Romanian deadlift":"rdl","Seated Smith machine shoulder press":"smithohp","Seated barbell overhead press (Smith or free)":"bbohp",
 "Standing barbell overhead press":"bbohp","Seated cable row":"cabrow","Seated cable row (close grip)":"cabrow","Wide-grip seated cable row":"cabrow","Single-arm seated cable row":"cabrow",
 "Seated calf raise":"seatedcalf","Seated dumbbell shoulder press":"ohp","Seated leg curl":"seatedcurl","Shrimp squat or pistol squat to a box":"skater","Single-arm cable lateral raise":"cablat",
 "Single-arm dumbbell row":"dbrow","Single-leg calf raise off a step":"stepcalf","Two-leg calf raise off a step":"stepcalf","Single-leg dumbbell Romanian deadlift":"singlerdl",
 "Single-leg dumbbell calf raise":"slcalf","Standing dumbbell calf raise":"slcalf","Single-leg dumbbell hip thrust":"slthrust","Single-leg hip thrust":"slthrust","Sliding leg curl":"slidecurl",
 "Smith machine deficit reverse lunge":"smithlunge","Standing calf raise":"standcalf","Straight-arm cable pulldown":"pullover","Triceps pushdown (rope)":"pdfixed",
 "Triceps pushdown (straight bar)":"pdbar","Underhand barbell row":"bbrow","Wide-grip cable upright row":"cabupright",
}
def rest_s(t):
    m = re.match(r"(\d+)(?:-(\d+))?\s*(min|sec)", t)
    if not m: return 90
    a = int(m.group(1)); b = int(m.group(2) or a); v = (a + b) / 2
    return int(v * 60) if m.group(3) == "min" else int(v)
def reps(t):
    m = re.search(r"(\d+)\s*-\s*(\d+)", t)
    if m: return int(m.group(1)), int(m.group(2)), None
    m = re.search(r"(\d+)", t)
    if m and "sec" not in t: n = int(m.group(1)); return n, n, None
    return 8, 12, t
def techk(t):
    t = (t or "").lower()
    if not t: return None
    if "myo" in t: return "myo"
    if "rest-pause" in t or "rest 15" in t or "rest pause" in t: return "rp"
    if "half rep" in t or "partial" in t: return "lp"
    if "hold" in t or "stretch for" in t: return "hold"
    if "drop" in t or "strip" in t: return "drop" if "mechanical" not in t else "mech"
    if "straight into" in t or "switch" in t or "mechanical" in t: return "mech"
    return "mech"
LEVEL = {"beginner":"new","intermediate":"inter","advanced":"adv"}
missing = set(); out = []
for p in d["programmes"]:
    sess = {}
    for s in p["sessions"]:
        ex = []; used = {}
        for e in s["exercises"]:
            k = M.get(e["exercise"])
            if not k: missing.add(e["exercise"]); continue
            key = k if k not in used else k + "-v" + str(used[k] + 1); used[k] = used.get(k, 0) + 1
            lo, hi, rtxt = reps(e["reps"])
            note = " ".join(x for x in [e.get("cue") or "", ("Reps: " + e["reps"]) if (rtxt or "per " in e["reps"] or "Top set" in e["reps"]) else ""] if x).strip()
            ss = (e.get("superset") or "")[:1] or None
            ex.append({"k":key, "n":e["exercise"], "sets":e["sets"], "lo":lo, "hi":hi, "rest":rest_s(e["rest"]), "eff":e.get("effort") or "", "tech":e.get("technique") or None, "techK":techk(e.get("technique")), "note":note or None, "ss":ss})
        sess[s["id"]] = {"name":s["name"], "focus":s.get("focus", []), "mins":s.get("approx_minutes"), "ex":ex}
    sched = p["schedule"]; train_idx = [i for i, x in enumerate(sched) if x.lower() != "rest"]
    weeks = []
    for w in p["weeks"]:
        ids = w["sessions"]; m = {}
        for j, sid in enumerate(ids):
            if j < len(train_idx): m[["mon","tue","wed","thu","fri","sat","sun"][train_idx[j]]] = sid
        weeks.append({"days":m, "note":w.get("focus", ""), "deload":bool(re.search(r"deload", w.get("focus", ""), re.I))})
    out.append({"id":p["id"], "name":p["name"], "hook":p["hook"], "desc":p["description"], "level":LEVEL.get(p["level"], "inter"), "setting":p["setting"], "days":p["days_per_week"],
        "weeks":p["length_weeks"], "equip":p["equipment"], "machines":p.get("machines_used", []), "effort":p["effort_style"], "schedule":sched, "sessions":sess, "plan":weeks,
        "progression":p["progression"], "deload":p["deload"], "why":p["why"], "optional":[s for s in sched if "optional" in s.lower()]})
if missing: print("UNMAPPED:", sorted(missing)); sys.exit(1)
js = "/* Ready-made programmes, written from the research in /research (see premade_programmes.md). Generated by research/gen/to_app.py. */\nwindow.AJProgrammes = " + json.dumps({"glossary":d["glossary"], "list":out}, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(os.path.join(os.path.dirname(ROOT), "public", "programmes.js"), "w").write(js)
print("ok", len(out), len(js))
