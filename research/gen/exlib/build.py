import json, re, sys
from collections import Counter, defaultdict
from p0_helpers import LIB, KEYS
import p1_chest_back, p2_shoulders_arms, p3_legs, p4_rest
src = open('/home/claude/ajtraining/public/onboard.js').read()
old = re.findall(r'^X\("([^"]+)","([^"]+)","([^"]+)"', src, re.M)
oldkeys = {k for k,_,_ in old}
missing = sorted(oldkeys - set(KEYS))
print("count", len(LIB), "missing existing", missing)
for k,n,p in old:
    if k in KEYS and KEYS[k]["pattern"] != p: print("pattern change", k, p, "->", KEYS[k]["pattern"])
fam = defaultdict(list)
for e in LIB: fam[e["_fam"]].append(e["key"])
for e in LIB:
    mates = [k for k in fam[e["_fam"]] if k != e["key"]]
    same = [k for k in mates if KEYS[k]["pattern"] == e["pattern"]]
    other = [k for k in mates if k not in same]
    v = e["variations"] + [k for k in same + other if k not in e["variations"]]
    e["variations"] = v[:8]
    del e["_fam"]
names = Counter(e["name"].lower() for e in LIB)
print("dup names", [n for n,c in names.items() if c>1])
json.dump(LIB, open(sys.argv[1], "w"), indent=1, ensure_ascii=False)
