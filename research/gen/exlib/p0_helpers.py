import json, re
LIB = []
KEYS = {}

ISO_LOW = {"lat", "rear", "calf", "abs", "core", "obl", "neck", "wrist", "grip", "fing", "er", "scap", "tib", "hipflex", "shrug", "abd", "add"}
SPECIAL = {"cond", "sled", "carry", "erg", "plow", "plat", "prot", "pup", "land", "ankle", "mob", "skill", "oly", "strongman"}


def mus(s):
    out = {}
    for t in s.split():
        if t.endswith(".5"):
            out[t[:-2]] = 0.5
        else:
            out[t] = 1
    return out


def E(key, name, pat, mu, eq="", fl="", st=1, reps=None, rest=None, cues="", al="", fam=None, var=None, unit=None):
    assert key not in KEYS, key
    c = "c" in fl
    t = "t" in fl
    u = "u" in fl
    if reps is None:
        if pat in ISO_LOW:
            reps = (12, 20) if pat in {"lat", "rear", "abd", "add", "er", "scap"} else (10, 20) if pat in {"abs", "obl", "neck", "wrist", "tib", "shrug", "hipflex"} else (10, 15)
        elif pat in SPECIAL:
            reps = (3, 5)
        elif c:
            reps = (6, 10) if t else (8, 12)
        else:
            reps = (10, 15)
    if rest is None:
        if pat in {"mob"}:
            rest = 30
        elif pat in {"oly", "strongman"}:
            rest = 150
        elif pat in {"skill"}:
            rest = 120
        elif pat in SPECIAL:
            rest = 90
        elif pat in ISO_LOW:
            rest = 60
        elif c and t:
            rest = 150
        elif c:
            rest = 120
        else:
            rest = 75
    e = {
        "key": key, "name": name, "pattern": pat, "muscles": mus(mu),
        "equipment": eq.split() if eq else [], "compound": c, "stretch": st,
        "reps": list(reps), "rest_s": rest, "unilateral": u, "technical_failure": t,
        "cues": [x.strip() for x in cues.split("|") if x.strip()],
        "variations": list(var or []),
        "aliases": [x.strip() for x in al.split("|") if x.strip()],
    }
    if unit:
        e["unit"] = unit
    e["_fam"] = fam
    KEYS[key] = e
    LIB.append(e)
    return e
