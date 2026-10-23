# Sport coaching data: one JSON file per sport, research/sport_elite/<id>.json

Written for an app that builds gym plans for athletes. Plain UK English, short sentences, no em dashes (use commas, colons or full stops), no hype.
Every number should come from the research files or a cited study; where it is coaching practice rather than research, say "practice" in `grade`.

```json
{
  "id": "football",                      // must match the id given to you
  "name": "Football",
  "aliases": ["soccer"],                 // other names people type, include sub-disciplines (e.g. "futsal", "5-a-side")
  "group": "Team",                       // Team | Racket | Combat | Endurance | Water | Snow | Wheels | Track and field | Precision | Artistic | Other

  // ONLY for sports marked NEW (for existing sports leave these out unless the research says to change them):
  "q": {"maxStrength":0-3,"power":0-3,"rotational":0-3,"unilateral":0-3,"upperPull":0-3,"upperPush":0-3,"lowerBody":0-3,"grip":0-3,"neck":0-3,"trunk":0-3,"mass":0-3},
  "prehab": ["nordic", "..."],           // keys from PREHAB below, priority order, 3-6
  "season": {"off":3,"pre":2,"in":1},    // gym sessions a week
  "avoidBefore": "lower" | "upper" | "all" | null,
  "energy": "one sentence on the energy systems",
  "summary": "two sentences: what the sport demands and what the plan does about it",
  "evidence": [{"claim":"...","source":"Author et al. Year, Journal","url":"https://..."}],
  "confidence": "strong" | "moderate" | "limited",

  // FOR EVERY SPORT:
  "variants": [                          // positions, roles or event types that change the training (2-5; [] if none matter)
    {"id":"gk","name":"Goalkeeper","desc":"one sentence on how the demands differ",
     "q":{"power":3},                    // only the q values that change
     "prehab":["shoulderER"],            // modules to move to the front for this variant (may be new to the sport)
     "note":"one sentence telling the athlete what changes in their plan"}
  ],
  "sessions": {                          // gym session templates. 2-3 for off, 2 for pre, 1-2 for in. Order of slots = order in the session.
    "off": [ {"name":"Lower strength and speed","focus":"one short line",
              "slots":[ {"role":"pow|main|acc|pre|core","ex":["libkey1","libkey2","libkey3"],   // 2-4 options, best first, MUST be keys from exkeys.tsv
                         "sets":{"new":3,"inter":4,"adv":5},"reps":"3-5","rir":2,              // reps as a string ("5", "3-5", "6/side", "20 s"); rir = reps in reserve target
                         "note":"optional cue, one short line"} ] } ],
    "pre": [...], "in": [...]
  },
  "conditioning": {                      // running/bike/court work outside the gym. Leave a phase [] if the sport itself covers it.
    "off": [{"name":"Aerobic base","mode":"run|bike|row|swim|ski|court|any",
             "work":"4 x 4 min","rest":"3 min easy","intensity":"85-95% max heart rate, hard but steady",
             "perWeek":1,"why":"one line, with the reason"}],
    "pre": [...], "in": [...]
  },
  "tests": [                             // 3-6 field tests the athlete can do every 6-8 weeks
    {"id":"sprint10","name":"10 m sprint","how":"one line on how to do it with no special kit if possible",
     "unit":"s","better":"lower","bands":{"club":"1.85-1.95","good":"1.75-1.85","elite":"<1.75"},
     "note":"e.g. women about 0.1-0.15 s slower"}
  ],
  "week": ["MD-4: heavy lower strength and power", "MD-2: short primer only", "..."],   // 3-6 short lines on where gym and hard sessions go around matches
  "primer": ["2 x 3 jumps", "..."],     // what a pre-match primer contains, 3-5 short lines ([] if not relevant)
  "taper": {"days":10, "lines":["Last heavy lift 7 days out", "..."]},                      // peaking for a big event
  "rules": ["hard safety or quality rules, one line each"],                                // e.g. no hangboard under 16
  "sources": [{"source":"Author et al. Year, Journal","url":"https://..."}],
  "missing_ex": [{"name":"Trap bar jump","pattern":"plow","equipment":"trapbar","why":"main lower power option"}]   // exercises you wanted but are not in exkeys.tsv
}
```

PREHAB keys: nordic, copenhagen, shoulderER, neck, ankle, landing, calf, wrist, fingers, lowback, hipAbd, patellar, elbow, trunkLat, hipFlex, tspine, scap, hipRot, shin

Exercise keys: research/gen/exkeys.tsv (key, name, pattern, equipment, extra_lib, reps). Use keys exactly as written. Prefer keys with extra_lib=0 (the hand-tuned core) for main lifts. Give options that need different kit (e.g. barbell, dumbbell, bodyweight) so a home gym still gets a session.
