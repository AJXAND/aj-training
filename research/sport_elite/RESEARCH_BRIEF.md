You are researching sports for a training app (AJ Training) and writing structured coaching data. Quality bar: what an elite strength and conditioning coach would give a paying athlete. Accurate, specific, evidence-led. You have WebSearch and WebFetch.

Read first:
- /home/claude/ajtraining/research/sport_elite/SCHEMA.md (exact output format, follow it strictly)
- /home/claude/ajtraining/research/gen/exkeys.tsv (the ONLY exercise keys you may use in "ex"; grep it)
- An example of the depth expected: the Tennis section (## 17) of /home/claude/ajtraining/research/sport_team_racket.md, and Part 0 at the top of that file (shared rules for levels, phases, dosing, match-day placement, prevention modules, conditioning methods, tests). Follow those shared rules unless your sport needs different.
- /home/claude/ajtraining/public/sportprofiles.js: if your sport already exists there (search "id":"<id>"), read its current entry.

For each sport:
1. Research it properly: time-motion / physiological demands, injury epidemiology (most common and most costly injuries), prevention programmes with evidence, strength and power needs, positions or event types, season structure (UK amateur defaults), testing used in the sport with norms, peaking. Prefer systematic reviews, consensus statements and peer-reviewed studies; open each source you cite (WebFetch) to confirm the claim and URL. Where the evidence is thin, say so and use the closest related sport's evidence plus coaching practice, graded "practice".
2. Write a short research note to /home/claude/ajtraining/research/sport_elite/notes/<id>.md (demands, injuries, prevention, positions, season, tests with norms, sources with URLs). Under 1200 words.
3. Write /home/claude/ajtraining/research/sport_elite/<id>.json per the schema, INCLUDING q, prehab, season, avoidBefore, energy, summary, evidence (2-3 claims with verified URLs), confidence. If the sport already exists in sportprofiles.js, you may still give q/prehab/season if your research supports a change.
- Sessions: 2-3 off, 2 pre, 1-2 in. Map every exercise to keys in exkeys.tsv (2-4 options, different kit where possible).
- Plain UK English, no em dashes (search output for "—"). Short lines, shown on a phone.
- Never invent a study, number or URL. If you cannot verify, leave it out.
- Validate: python3 -c "import json,sys; json.load(open(sys.argv[1]))" <file>, and check every "ex" key exists in exkeys.tsv with a short python check.

When done, reply with the files written, confidence per sport, and anything you could not verify. Under 200 words.
