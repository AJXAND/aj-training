"""Apply the sport programming research (research/sport_team_racket.md 'Encoding notes', research/sport_individual.md section 32)
to public/sportprofiles.js: injury-prevention priorities, gym sessions per season, match-day rule and demand score changes."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, "public", "sportprofiles.js")
src = open(P).read()
head, body = src[:src.index("window.AJSportProfiles")], src[src.index("=") + 1:].rstrip().rstrip(";")
d = json.loads(body)
# team and racket sports: research/sport_team_racket.md, each sport's "Encoding notes"
T = {
 "football": ["nordic","copenhagen","landing","ankle","hipFlex","calf"],
 "gaelicfootball": ["nordic","copenhagen","landing","ankle","hipFlex"],
 "hurling": ["nordic","copenhagen","trunkLat","elbow","ankle","shoulderER"],
 "aussierules": ["nordic","copenhagen","landing","ankle","calf","neck","hipFlex"],
 "fieldhockey": ["ankle","nordic","lowback","copenhagen","landing","trunkLat","hipFlex"],
 "lacrosse": ["landing","ankle","nordic","neck","shoulderER","copenhagen"],
 "rugbyunion": ["neck","nordic","shoulderER","landing","ankle","copenhagen"],
 "rugbyleague": ["neck","nordic","shoulderER","landing","ankle"],
 "americanfootball": ["neck","nordic","landing","ankle","shoulderER","copenhagen"],
 "basketball": ["ankle","landing","patellar","calf","hipAbd","copenhagen","lowback"],
 "netball": ["landing","ankle","nordic","calf","hipAbd","patellar"],
 "volleyball": ["ankle","shoulderER","patellar","landing","lowback","calf"],
 "handball": ["shoulderER","landing","ankle","nordic","copenhagen"],
 "icehockey": ["copenhagen","neck","hipAbd","hipFlex","shoulderER","lowback"],
 "cricket": ["trunkLat","lowback","nordic","calf","ankle","shoulderER"],
 "baseball": ["shoulderER","elbow","trunkLat","nordic"],
 "tennis": ["shoulderER","elbow","ankle","calf","trunkLat","copenhagen"],
 "padel": ["calf","elbow","shoulderER","lowback","ankle","copenhagen"],
 "squash": ["calf","copenhagen","ankle","lowback","shoulderER","elbow"],
 "badminton": ["calf","ankle","patellar","landing","shoulderER","copenhagen"],
 "tabletennis": ["shoulderER","lowback","trunkLat","elbow","ankle"],
 "pickleball": ["ankle","calf","shoulderER","elbow","hipAbd"],
}
AVOID = {"cricket": "lower", "handball": "lower"}   # 'all' was too strict for handball; cricket batters and bowlers keep legs fresh
# individual, combat and other sports: research/sport_individual.md section 32 (prehab, season off/pre/in, avoidBefore, q changes)
I = {
 "boxing": (["neck","shoulderER","wrist","tspine"], (3,2,1), "all", {"upperPull":2}),
 "mma": (["neck","shoulderER","lowback","fingers","copenhagen"], (3,2,2), "all", {}),
 "bjj": (["neck","fingers","shoulderER","lowback","copenhagen"], (3,2,2), "all", {}),
 "judo": (["neck","shoulderER","fingers","lowback","landing"], (3,2,2), "all", {}),
 "wrestling": (["neck","shoulderER","lowback","landing","copenhagen"], (3,2,2), "all", {}),
 "kickboxing": (["neck","hipAbd","ankle","shoulderER","copenhagen","calf"], (3,2,1), "all", {}),
 "climbing": (["fingers","shoulderER","wrist","scap"], (3,2,2), "upper", {}),
 "golf": (["lowback","hipRot","tspine","shoulderER","wrist"], (3,2,1), None, {"maxStrength":2, "power":3}),
 "swimming": (["shoulderER","scap","tspine","lowback","copenhagen"], (3,3,2), "upper", {}),
 "cycling": (["lowback","hipAbd","tspine"], (3,2,1), "lower", {"power":2, "neck":1}),
 "mtb": (["shoulderER","wrist","lowback","neck"], (3,2,1), "lower", {}),
 "rowing": (["lowback","hipAbd","wrist","tspine"], (3,2,2), "all", {}),
 "kayaking": (["shoulderER","scap","wrist","lowback","tspine"], (3,3,2), "upper", {}),
 "alpineskiing": (["landing","hipAbd","nordic","lowback","copenhagen"], (3,2,1), "lower", {}),
 "snowboarding": (["landing","wrist","ankle","tspine"], (3,2,1), "lower", {"power":3}),
 "surfing": (["shoulderER","scap","tspine","lowback","landing"], (3,2,1), "upper", {"maxStrength":2, "power":3}),
 "sailing": (["lowback","shoulderER","wrist","patellar"], (3,2,1), None, {}),
 "sprinting": (["nordic","calf","copenhagen","hipAbd"], (3,3,2), "lower", {}),
 "jumps": (["landing","calf","nordic","patellar","ankle"], (3,3,2), "lower", {}),
 "throws": (["shoulderER","lowback","scap","tspine"], (3,3,2), "all", {}),
 "gymnastics": (["wrist","landing","ankle","shoulderER","lowback","calf"], (3,2,2), "all", {}),
 "dance": (["calf","ankle","landing","hipAbd","hipRot"], (3,2,2), "lower", {"maxStrength":2, "lowerBody":3, "trunk":3}),
 "horseriding": (["lowback","copenhagen","hipAbd","hipRot","tspine"], (3,2,2), None, {"unilateral":2, "upperPull":2, "neck":1}),
}
done = []
for s in d["sports"]:
    k = s["id"]
    if k in T:
        s["prehab"] = T[k]; done.append(k)
        if k in AVOID: s["avoidBefore"] = AVOID[k]
    if k in I:
        pre, (o, p, i), av, q = I[k]
        s["prehab"], s["season"], s["avoidBefore"] = pre, {"off":o, "pre":p, "in":i}, av
        s["q"].update(q); done.append(k)
open(P, "w").write(head + "window.AJSportProfiles = " + json.dumps(d, ensure_ascii=False, separators=(",", ":")) + ";\n")
print(len(done), "sports updated; not covered:", [s["id"] for s in d["sports"] if s["id"] not in done])
