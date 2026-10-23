You are turning existing sports-science research notes into structured coaching data for a training app (AJ Training). Quality bar: what an elite strength and conditioning coach would give a paying athlete. Accurate, specific, evidence-led.

Read first:
- /home/claude/ajtraining/research/sport_elite/SCHEMA.md (the exact output format, follow it strictly)
- /home/claude/ajtraining/research/gen/exkeys.tsv (the ONLY exercise keys you may use in "ex"; grep it, it has 635 rows)
- The current profile for each sport in /home/claude/ajtraining/public/sportprofiles.js (JSON after "window.AJSportProfiles ="; find by "id")
- The research: /home/claude/ajtraining/research/sport_team_racket.md (Part 0 shared rules at the top, then numbered sport sections) and /home/claude/ajtraining/research/sport_individual.md (section 0 conventions, numbered sport sections, section 32 profile changes, section 33 hard rules). Read Part 0 / section 0 and the full section for each of your sports.

For each sport write /home/claude/ajtraining/research/sport_elite/<id>.json (valid JSON, no comments). Rules:
- Take positions/variants, session templates (OFF/PRE/IN with N/I/A sets and reps), conditioning, tests and bands, week placement, primer, taper and sources from the research section. Translate the session tables into slots: map each exercise to the closest key in exkeys.tsv (2-4 options, best first, different kit where possible). sets by level: new = N column, inter = I, adv = A. If an exercise has no reasonable key, still pick the nearest keys and also list it in missing_ex.
- For sports marked NEW, also fill q, prehab, season, avoidBefore, energy, summary, evidence (2 claims with real URLs from the research's source lists), confidence.
- For existing sports, leave q/prehab/season/etc out (they are already set).
- Bands: use the research's numbers. If the research gives male values with a female note, put the female note in "note".
- Plain UK English, no em dashes anywhere (search your output for "—" and replace). Keep lines short; this text is shown on a phone.
- Do not invent studies. Sources must be ones cited in the research file.
- Validate each file with: python3 -c "import json,sys; json.load(open(sys.argv[1]))" <file> and check every "ex" key exists in exkeys.tsv (write a short python check).

When done, reply with: the files written, any exercise keys you had to approximate, and anything in the research that looked wrong or thin. Keep the reply under 200 words.
