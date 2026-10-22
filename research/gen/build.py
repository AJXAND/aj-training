import json, re, sys
sys.path.insert(0, sys.argv[1])
from gen_part4 import P

OUT = "/home/claude/ajtraining/research/"
ALLOWED_EQ = {"barbell", "rack", "bench", "dumbbells", "cable", "machines", "smith", "landmine", "pull-up bar", "dip bars", "bands", "bodyweight"}
problems = []
ids = set()
for p in P:
    assert p["id"] not in ids; ids.add(p["id"])
    for e in p["equipment"] + p.get("optional_equipment", []):
        if e not in ALLOWED_EQ: problems.append(f"{p['id']}: bad equipment {e}")
    sids = {s["id"] for s in p["sessions"]}
    for w in p["weeks"]:
        for s in w["sessions"]:
            if s not in sids: problems.append(f"{p['id']}: week {w['week']} unknown session {s}")
    if len(p["weeks"]) != p["length_weeks"]: problems.append(f"{p['id']}: weeks mismatch")
    for s in p["sessions"]:
        groups = {}
        for e in s["exercises"]:
            if e.get("superset"):
                groups.setdefault(e["superset"][0], []).append(e["superset"])
        for g, members in groups.items():
            if len(members) < 2: problems.append(f"{p['id']}/{s['id']}: lone superset {members}")

blob = json.dumps(P, ensure_ascii=False)
for bad in ["—", "–", "insane", "RIR", "RPE", "Nippard", "Bumstead", "CBUM", "Yates", "Mentzer", "Arnold"]:
    if bad in blob: problems.append(f"forbidden text found: {bad!r}")
if problems:
    print("\n".join(problems)); sys.exit(1)

doc = {
    "version": 1,
    "generated": "2026-10-22",
    "notes": "Premade programme library for AJ Training. User-facing text is British English with no effort jargon.",
    "glossary": {
        "To failure": "The last rep you can complete with full range and control. If you tried another, it would not go up.",
        "To technical failure": "The last rep you can do with perfect form. Used on barbell lifts where grinding ugly reps is risky.",
        "Drop set": "At failure, immediately reduce the weight by about 25% and go to failure again.",
        "Myo-reps": "At failure, rest 5 slow breaths, do 3 to 5 more reps, repeat about 3 times.",
        "Rest-pause": "At failure, rest about 15 seconds, then go to failure again.",
        "Stretched half reps (lengthened partials)": "After failure, keep doing half reps in the stretched half of the movement.",
        "Mechanical drop": "At failure, switch straight to an easier version of the same movement and continue.",
        "Superset (A1/A2)": "Alternate the paired exercises, resting as listed between them.",
        "Ramp-up sets": "Progressively heavier warm-up sets of a few reps that build to your working weight. Never to failure.",
    },
    "programmes": P,
}
with open(OUT + "premade_programmes.json", "w", encoding="utf-8") as f:
    json.dump(doc, f, ensure_ascii=False, indent=2)

L = ["# AJ Training: Premade Programme Library", "",
     f"{len(P)} programmes. Every one written as a complete plan: schedule, sessions, effort, progression and deload.", "",
     "| Programme | Level | Setting | Days | Weeks |", "|---|---|---|---|---|"]
for p in P:
    L.append(f"| [{p['name']}](#{p['id']}) | {p['level'].title()} | {p['setting'].title()} | {p['days_per_week']} | {p['length_weeks']} |")
L += ["", "## Glossary", ""]
for k, v in doc["glossary"].items():
    L.append(f"- **{k}:** {v}")
for p in P:
    L += ["", "---", "", f'<a id="{p["id"]}"></a>', f"## {p['name']}", "", f"*{p['hook']}*", "",
          f"**{p['level'].title()} · {p['setting'].title()} · {p['days_per_week']} days a week · {p['length_weeks']} weeks**", "",
          p["description"], "",
          f"**Equipment:** {', '.join(p['equipment'])}" + (f" (optional: {', '.join(p['optional_equipment'])})" if p.get("optional_equipment") else ""), ""]
    if p.get("machines_used"):
        L += [f"**Machines used:** {', '.join(p['machines_used'])}", ""]
    L += [f"**How hard:** {p['effort_style']}", "",
          f"**Weekly layout:** {' / '.join(p['schedule'])}", "",
          f"**Rotation:** {p['rotation']['summary']}", ""]
    for s in p["sessions"]:
        mins = f" (about {s['approx_minutes']} min)" if s.get("approx_minutes") else ""
        L += [f"### {s['name']}{mins}", "", f"Focus: {', '.join(s['focus'])}", ""]
        if s.get("note"): L += [f"_{s['note']}_", ""]
        L += ["| # | Exercise | Sets | Reps | Rest | Effort | Technique | Cue |", "|---|---|---|---|---|---|---|---|"]
        for i, e in enumerate(s["exercises"], 1):
            tag = e.get("superset") or str(i)
            L.append(f"| {tag} | {e['exercise']} | {e['sets']} | {e['reps']} | {e['rest']} | {e['effort']} | {e['technique'] or ''} | {e['cue']} |")
        L.append("")
    L += ["### Week by week", ""]
    for w in p["weeks"]:
        L.append(f"- **Week {w['week']}:** {w['focus']}")
    L += ["", f"**Progression:** {p['progression']}", "", f"**Deload:** {p['deload']}", "", f"**Why it's built this way:** {p['why']}"]

with open(OUT + "premade_programmes.md", "w", encoding="utf-8") as f:
    f.write("\n".join(L) + "\n")

print("OK", len(P))
for p in P:
    n = sum(len(s["exercises"]) for s in p["sessions"])
    print(f"{p['name']:<20} {p['level']:<12} {p['setting']:<5} {p['days_per_week']}d {p['length_weeks']}w sessions={len(p['sessions'])} exercises={n}")
