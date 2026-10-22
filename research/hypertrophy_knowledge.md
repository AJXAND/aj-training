# Hypertrophy Knowledge Base for the AJ Training Plan Generator

Purpose: rules a programmer can encode so generated bodybuilding plans read like they were written by an elite coach for a serious lifter who trains every working set to failure. Written in our own words from the sources listed at the end of each section. Where a number is a coach's heuristic rather than a study result, it is labelled as such.

Conventions used below:
- "Set" = a hard working set (warm-ups and feeders never count).
- "Direct set" = the muscle is a prime mover (e.g. bench for chest). "Indirect" = synergist (bench for triceps). Count indirect as 0.5 (Pelland fractional method).
- Effort labels are plain-language (Section 1.6). RIR appears only in this file for engineers.
- Equipment tiers: FULL (commercial/bodybuilding gym), GARAGE (rack, barbell, plates, DBs, adjustable bench, landmine, one adjustable cable, pull-up bar), DB (adjustable dumbbells, maybe a bench), BW (bodyweight, pull-up bar/door frame, optional bands).

---

## 1. Effort and failure

### 1.1 What the evidence says
- Robinson et al. 2024 (Sports Medicine, meta-regression): hypertrophy rises as sets end closer to failure; strength is largely unaffected by proximity to failure. Practical reading by the authors and commentators: growth is best around 0 to 2 reps short, and sets ending about 4+ reps short give clearly less growth.
- Refalo et al. 2023 (Sports Medicine, meta-analysis, 15 studies): failure vs non-failure gave only a trivial edge to failure (ES 0.19); when failure was defined strictly as momentary muscular failure the edge disappeared (ES 0.12, not significant). Relationship looks non-linear: the last 1 to 2 reps add little extra growth.
- Refalo et al. 2024 (trained lifters, 3+ years, within-subject, leg press + leg extension, 8 weeks): all sets to failure vs stopping at 1 to 2 reps short produced the same quad growth (about 7% both), similar volume load, but failure caused more rep loss across sets (leg extension about 30% vs 21%) and more velocity loss. Conclusion: same growth, more fatigue.
- Robinson/Zourdos trained-men study (4 groups from 4 to 6 short up to all-failure): strength gains worse in groups that went to failure on bench; hypertrophy differences unclear.
- Menno Henselmans: RIR estimates are unreliable (people underestimate what they have left, worse the further from failure); for pure hypertrophy he prefers prescribing "as many good reps as possible" and matching rep volume rather than chasing RIR targets.
- Nippard: intermediate/advanced lifters take most sets to 1 to 2 short and the last set of each exercise to failure, except heavy squats and deadlifts; "if you never go to failure you never learn what 1 to 3 short feels like".
- Israetel/RP: 0 to 4 reps short is the productive zone; RIR falls across a mesocycle from about 3 to 4 short in week 1 to 0 to 1 short in the final week; failure fits machines, cables and isolations better than heavy compounds because the last reps of a big compound add disproportionate systemic fatigue.

Encodable conclusion: training every set to failure is a legitimate and effective choice for hypertrophy (it is how Yates, Mentzer, and many TNF-style coaches train). Its cost is fatigue per set, not lost growth. So a failure-based plan must use fewer sets, longer rest, more stable exercises, and a technical-failure rule for risky lifts.

### 1.2 How elite failure-based coaches structure it
| Coach / system | Working sets | Effort | Frequency | Notes |
|---|---|---|---|---|
| Dorian Yates (Blood and Guts) | 1 all-out set per exercise after 2 to 3 ramping warm-ups (sometimes a 2nd set with ~10% less load) | Failure and beyond: 2 to 4 forced reps, slow 5 to 8 s negatives, occasional partials or rest-pause (10 to 15 s) | Each muscle once per week, 4-day split (chest/bi, legs, delts/tri, back) | 6 to 10 reps upper, 10 to 15 legs, 15 to 25 abs/some isolation. Logbook, beat it every session. Controlled reps, no momentum. |
| Mike Mentzer (Heavy Duty) | 1 set per exercise, 5 to 6 exercises per session | Absolute failure; forced reps and negatives sparingly | 3 days a week, later every 4 to 7 days; add rest days when stalled | Pre-exhaust pairs with zero rest: fly into incline press, leg extension into leg press, pullover into pulldown, skull crusher into dip. Double progression 6 to 10 upper, 8 to 15 lower, 12 to 20 calves. |
| Nippard Min-Max | 1 to 2 hard sets per exercise | First working set to failure (or 0 to 1 short), so each set is a benchmark | 4 to 5 days (U/L/Push/Pull/(Arms)), about 45 min | Block 1 straight sets; Block 2 adds drop sets, myo-reps, static holds on the last set. |
| Nippard Pure Bodybuilding / Essentials | 2 to 4 sets per exercise | Early sets about 1 to 2 short, last set to failure; some isolations at failure on every set | PPL + arms + weak-point day | Lengthened partials after failure on the last set; drop sets on last set of pushdowns/extensions. |
| Eugene Teo | Few sets per exercise | Most sets a couple short, last set to failure | n/a | Add a rep or load each week rather than adding sets. Cut anything that does not earn its place. |
| Joel Twinem (TNF) | Low working-set counts, minimal warm-up waste | Failure-oriented, high-quality reps on stable machines | Upper/lower style splits | Customises grips and machine angles to the lifter's leverages. |
| Chris Bumstead (per Gym College write-up, Rambod influence) | 2 to 4 sets per exercise, plus GVT or 7-set finishers | Hard, with supersets, tri-sets, isometric holds | 9-day cycle (each muscle 1 to 2x per cycle) | Moved away from barbell back squats to pendulum/hack type squats. Double progression. |
| Jay Cutler (high-volume contrast) | 7 to 10 exercises x 3 to 4 sets | Rarely to failure | Body-part split, weak points 2x/week | Shows the other path: high volume with reps left in the tank. Do not mix this volume with failure on every set. |

### 1.3 Technical failure vs absolute failure (encode per exercise)
Definitions:
- Absolute (momentary) failure: the next concentric rep cannot be completed despite maximal effort.
- Technical failure: the last rep that can be done with the same form, range and tempo as rep 1. Stop as soon as form would change (hips rise first, back rounds, bar drifts, depth shortens, torso swings).

Rules:
- ABSOLUTE FAILURE ALLOWED (stable, low injury cost, easy to bail): all selectorised and plate-loaded machines (hack squat, pendulum, leg press with safeties, belt squat, leg extension, leg curls, chest press, pec deck, machine rows, pulldown, machine laterals, reverse pec deck, preacher machine), all cable work, Smith machine work with safeties set, dumbbell isolations (laterals, curls, flyes with control), chest-supported DB rows, pull-ups/chins, dips (controlled), calf raises, hip thrust machine, back extensions, ab machines.
- TECHNICAL FAILURE ONLY (spinal load, balance or bar path makes the last grinding rep risky or useless): barbell back squat and front squat, RDL/stiff-leg deadlift, conventional/sumo/trap-bar deadlifts, barbell bent-over row and Pendlay row, standing overhead press, barbell bench without spotter or safeties, Bulgarian split squat and walking lunge (balance), good morning, heavy barbell hip thrust (stop when lockout shortens), skull crushers with heavy load (elbows), heavy DB presses where getting the bells down is the risk.
- NEVER extend beyond failure (no forced reps, partials, drops) on spinal-loaded hinges and barbell squats. Exception: a mechanical drop to an unloaded or machine movement straight after (see 5.2).
- For a user who says "every set to failure", the app should still label risky lifts as "to technical failure" and explain once why: identical growth stimulus, lower injury and fatigue cost.

### 1.4 How failure training changes volume
- Rough stimulating-rep logic (effective reps model, heuristic not law): a set to failure delivers about 5 "effective" reps; at 1 short about 4; at 2 short about 3. So 3 sets to failure ~ 4 sets at 1 short ~ 5 sets at 2 short.
- Practical conversion for the generator: failure-every-set plans use about 60 to 75% of the weekly set count of an RIR-based (1 to 3 short) plan for the same muscle.
- Per-session cap: Remmert et al. 2025 meta-regression found no detectable added growth beyond about 11 fractional sets per muscle per session; RP cap is 8 to 12 per muscle per session. For failure sets cap lower: 4 to 8 failure sets per muscle per session (up to 10 for a priority muscle on a dedicated day).
- Failure sets per exercise: 1 to 3 (default 2). Yates/Mentzer style: 1. Never prescribe 4+ straight sets to failure on the same compound.
- Rep loss: expect reps to drop 15 to 30% from set 1 to set 3 at failure with normal rest. Prescribe "aim for X to Y reps on set 1; later sets will drop, that is expected" and use a drop-tolerant progression rule (Section 6).

### 1.5 When to leave reps in hand even for a failure-first lifter
- First 1 to 2 weeks of a new block or new exercise (learning the groove, finding loads).
- Heavy barbell compounds (technical failure rule).
- Deload/back-off weeks.
- Deep cuts, poor sleep, illness, joint pain, or when the same lift dropped two sessions in a row.
- Big compound early in a session when several more exercises for the same muscle follow (optional: 1 short on set 1 to protect quality later). Many failure coaches still take it to failure; make it a user preference.

### 1.6 Presenting effort WITHOUT RIR jargon (copy for the UI)
Use these labels and one-line explanations. Internally map to RIR.
| UI label | User-facing instruction | Internal |
|---|---|---|
| Warm-up | Easy. Nowhere near hard. Just practise the movement. | 5+ |
| Feeder / heavy single | Heavier, but crisp and fast. A few reps, stop well before it gets hard. | 4+ |
| Hard | Stop when you are sure you could do 2 more good reps. | 2 |
| Very hard | Stop when you are sure you could do just 1 more good rep. | 1 |
| To failure | Keep going until you cannot complete another full rep with good form. | 0 |
| To clean failure (technical) | Stop on the last rep that looks exactly like your first. If the next one would break form, rack it. | 0 to 1 |
| Past failure | After failure, continue with the listed technique (partials, drop, rest-pause). | 0 + extension |
Extra copy rules: say "the last rep should be slow and a real fight" rather than "RPE 10"; for technical failure lifts, show "Stop if: hips shoot up / back rounds / depth shortens" specific to the exercise.

Section sources:
- Robinson et al. 2024 Sports Med, proximity to failure meta-regression: https://pubmed.ncbi.nlm.nih.gov/38393985/ ; summary https://zmescience.com/medicine/training-to-failure-is-good-for-building-muscle-but-not-for-strength
- Refalo et al. 2023 meta-analysis: https://dro.deakin.edu.au/articles/journal_contribution/Influence_of_Resistance_Training_Proximity-to-Failure_on_Skeletal_Muscle_Hypertrophy_A_Systematic_Review_with_Meta-analysis/22030796
- Refalo et al. 2024 trained within-subject study: https://www.fisiologiadelejercicio.com/wp-content/uploads/2024/02/Similar-muscle-hypertrophy-following-eight-weeks.pdf
- Robinson/Zourdos trained men RIR groups: https://openrepository.aut.ac.nz/items/baaed4c4-e6eb-4d0d-bec8-bb6fd7e30dca/full
- Biolayne, failure overview: https://biolayne.com/reps/issue-23/is-training-to-failure-overrated/
- Menno Henselmans on RIR: https://mennohenselmans.com/rpe-rir-is-mental-masturbation/
- Nippard on effort: https://fitnessvolt.com/jeff-nippard-how-hard-should-you-train/
- Nippard Min-Max: https://jeffnippard.com/products/min-max-program-phase-2
- Pure Bodybuilding push day: https://barbend.com/jeff-nippard-pure-bodybuilding-program
- Yates: https://www.setforset.com/blogs/news/dorian-yates-blood-and-guts
- Mentzer: https://www.liftosaur.com/programs/mike-mentzer-heavy-duty
- Eugene Teo summary: https://coachway.io/articles/eugene-teo-minimalist-hypertrophy-for-coaches/
- TNF/Twinem: https://barbend.com/news/tnf-joel-twinem-trains-upper-body-with-terrence-ruffin/
- CBum: https://gymcollege.substack.com/p/exclusive-cbum-workout-guide
- Cutler: https://fitnessvolt.com/jay-cutler-workout/
- Effective reps volume logic: https://steemit.com/bodybuilding/@sandcresearch/how-does-training-volume-differ-between-training-to-failure-avoiding-failure-and-using-advanced-techniques
- Per-session ceiling (Remmert 2025): https://biolayne.com/reps/issue-36/too-much-muscle-math-finding-the-ideal-training-volume-per-session/

---

## 2. Volume

### 2.1 Evidence
- Pelland et al. (2024 preprint, 67 studies, 2,058 participants): hypertrophy increases with weekly volume with diminishing returns (square-root-like curve, tapering gradually; still rising through 18 to 24+ fractional sets). Strength plateaus much sooner. Counting indirect sets as 0.5 predicted outcomes best.
- Schoenfeld et al. 2019 (trained men, all sets to failure): 5 sets per exercise (about 30 upper / 45 lower weekly sets) grew more than 1 or 3 sets; strength did not differ. Caveat: short study, novel stimulus, not sustainable long term with failure every set for most.
- Menno: 10 to 30 sets per muscle per week covers most trained lifters; optimal volume rises with training age; cutting or fasting can lower tolerable volume.
- RP: MV about 6 sets/week (at 2x frequency); landmarks individual; start a block near MEV and add sets until MRV signs appear.

### 2.2 Sets per muscle per week by experience (direct + 0.5 x indirect)
| Level | RIR-based (1 to 3 short) | Failure every set |
|---|---|---|
| Beginner (<1 yr) | 8 to 12 | 6 to 9 (and prefer leaving 1 to 2 in hand on compounds) |
| Intermediate (1 to 3 yr) | 10 to 18 | 8 to 12 |
| Advanced (3+ yr) | 12 to 22 | 8 to 14 |
| Priority muscle (any trained level) | 16 to 24+ | 12 to 18 |
| Maintenance (non-priority during specialisation) | 4 to 8 | 3 to 6 |
Rules: start a block at the lower bound; add 1 to 2 sets for a muscle only if it recovered (no lingering soreness at the next session, performance up). Never exceed the per-session caps in 1.4.

### 2.3 Per-muscle landmarks (RP starting points; weekly direct sets, intermediate, whole-body programme context)
Values combine RP's current per-muscle guides and their long-standing table; treat as RIR-based. For failure-every-set multiply by about 0.65 to 0.75.
| Muscle | MV | MEV | MAV | MRV | Prioritised MAV / MRV | Frequency (x/week) |
|---|---|---|---|---|---|---|
| Quads | 6 | 8 | 12 to 18 | 20 | 18 to 24 / 24+ | 2 to 3 |
| Hamstrings | 3 | 4 to 6 | 10 to 16 | 20 | 16 to 20 / 22+ | 2 to 3 |
| Glutes | 0 (squats/hinges maintain) | 0 | 4 to 12 | 12 (2x) to 25 (4x) direct; hinges cap 8 to 12 | 16 to 24 | 2 to 5 |
| Adductors | 0 (squats/lunges cover) | 0 to 4 | 4 to 10 | 12 to 16 | 12 to 16 | 1 to 3 |
| Calves | 2 to 4 | 4 to 8 | 8 to 16 | 16 to 24 | 16 to 24 / 24 to 32 | 3 to 6 |
| Chest | 2 to 4 | 4 to 6 | 6 to 16 (up to 20) | 16 to 24 | 16 to 24 / 24 to 32 | 2 to 4 |
| Back (lats + upper back) | 6 | 10 | 14 to 22 | 20 (2x) to 35 (5 to 6x) | 22+ / 30+ | 2 to 4 |
| Side delts | 0 to 6 | 8 | 16 to 22 | 26+ | 20 to 26 / 30+ | 2 to 6 |
| Rear delts | 0 (back work maintains) | 6 | 8 to 18 | 18 (2x) to 35 (5 to 6x) | 18 to 24 | 3 to 6 |
| Front delts | 0 | 0 to 2 | 4 to 8 | 8 to 12 | 12 to 16 / 16 to 20 | 2 to 3 (pressing covers most) |
| Biceps | 4 | 8 | 14 to 20 | 20 to 26 | 20 to 26 / 26+ | 2 to 6 |
| Triceps | 4 | 6 | 10 to 14 | 16 (2x) to 30 (5 to 6x) | 16 to 22 | 2 to 4 |
| Traps | 0 to 4 | 0 to 4 | 4 to 12 (12 to 20 for heavy trainers) | 12 to 26 | 16 to 24 / 24 to 32 | 2 to 4 |
| Forearms | 0 to 2 | 2 | 6 to 12 | 16 to 20 | 12 to 18 | 2 to 6 |
| Abs | 0 | 0 | 8 to 16 | 20 to 25 | 16 to 20 | 3 to 5 |
Encoding notes:
- Front delts: default 0 direct sets if the plan has 2+ pressing sessions/week with incline or overhead pressing.
- Glutes/adductors: deep squats, lunges, hack/pendulum and hip thrusts already deliver; add direct glute work only for glute priority or when the quad lift is a short-ROM or machine with little hip flexion.
- Triceps MRV drops when close-grip pressing and dips are heavy; count those as direct triceps sets at 0.5 to 1.
- Calves: RP notes that a 1 to 3 s pause in the deepest stretch can roughly halve the sets needed.

Section sources:
- Pelland et al. volume/frequency meta-regression: https://sportrxiv.org/index.php/server/preprint/view/460 ; commentary https://train.fitness/personal-trainer-blogs/not-all-sets-are-created-equal
- Schoenfeld 2019 volume study: https://pubmed.ncbi.nlm.nih.gov/30153194/
- Menno on volume: https://mennohenselmans.com/optimal-training-volume/
- RP volume landmarks: https://rpstrength.com/training-volume-landmarks-muscle-growth/
- RP chest: https://rpstrength.com/chest-training-tips-hypertrophy/ ; back: https://rpstrength.com/back-training-tips-hypertrophy/ and https://help.rpstrength.com/hc/en-us/articles/32433434201879-Back ; glutes: https://help.rpstrength.com/hc/en-us/articles/32433132961431-Glutes ; triceps: https://help.rpstrength.com/hc/en-us/articles/32433338498967-Triceps ; rear delts: https://help.rpstrength.com/hc/en-us/articles/32432607796631-Rear-Delts ; front delts: https://rpstrength.com/front-delt-training-tips-hypertrophy/ ; calves: https://rpstrength.com/calves-training-tips-hypertrophy ; traps: https://rpstrength.com/trap-training-tips-hypertrophy/

---

## 3. Frequency, splits, session length, exercise order, rest

### 3.1 Frequency
- Pelland meta-regression: once volume is accounted for, frequency has little to no independent effect on hypertrophy; it does matter for strength. Schoenfeld 2016/2019 frequency meta-analyses: 2x/week edges 1x when volume is not equated; equated, roughly equal.
- So frequency is a tool for distributing volume under the per-session cap and for practising lifts. Rule: frequency per muscle = ceil(weekly sets / per-session cap). With failure sets (cap about 6 per muscle), 12 weekly sets needs 2 sessions.
- Failure-based lifters recover more slowly per set. Default 2x/week per muscle; 1x/week (Yates/Mentzer style) is valid when weekly sets are low (4 to 8) and each session is brutal; small muscles (side/rear delts, calves, biceps, abs) tolerate 3 to 4x.

### 3.2 Split templates the generator should choose from
| Days/week | Default split (bodybuilding, failure-based) | Per-muscle frequency |
|---|---|---|
| 3 | Full body A/B/C, or Push/Pull/Legs (1x, Mentzer) | 3x full body / 1x PPL |
| 4 | Upper/Lower/Upper/Lower; or Upper/Lower/Push/Pull (Min-Max style, quad lift on push day, hinge on pull day) | 2x |
| 5 | Upper/Lower/Push/Pull/Legs, or U/L/Push/Pull/Arms+Delts (priority day) | about 2x, arms/delts 3x |
| 6 | PPL x2, or PPL + Upper/Lower + priority day | 2x |
| 4 (classic HIT) | Yates: Chest+Bi / Legs / Delts+Tri / Back (rest days between) | 1x |
| 9-day rotation | CBum/Rambod: Chest+Tri+Rear / Back+Bi / Quads+Calves / Rest / Delts / Arms / Chest+Back / Hams+Glutes+Calves / Rest | 1 to 2x per 9 days |
Rules: never put heavy hinge work the day before a heavy squat day; separate chest/front delt/triceps days by 48 h; arms and delts can appear on 3+ days at low volume.

### 3.3 Session length
- Failure-based sessions: 45 to 75 minutes including warm-ups. Min-Max about 45 min. Yates sessions about 45 to 60 min. If a generated session exceeds about 22 working sets or 90 min, split it.
- Per session: 4 to 8 exercises, 10 to 20 working sets total, 1 to 3 muscles emphasised.

### 3.4 Exercise order
1. Priority muscle first, while fresh (specialisation rule overrides everything else).
2. Otherwise biggest, most technical, most axially loaded compound first (e.g. hack squat or high-bar back squat first on leg day; incline press before flyes).
3. Within a muscle: heavy compound (6 to 10 reps) then a second compound or machine (8 to 12) then isolation at the lengthened/shortened bias (10 to 20) then finisher/pump (15 to 30, FST-7 or drop set).
4. Pre-exhaust is an option, not a default: use it when the target muscle is the weak link in a compound or when joints need a lighter compound (leg extension before hack squat for knee-friendly quad days, pec deck before incline press for chest that does not "feel" pressing, pullover before pulldown). Mentzer used zero rest; RP counts a pre-exhaust pair as about 1.5 sets.
5. Do not pre-fatigue small stabilisers before heavy compounds that depend on them (Paul Carter): no rear delt/rotator cuff burnout before pressing, no heavy ab work before squats, no forearm/grip burnout before rows and RDLs, no triceps before heavy bench.
6. When two isolations hit the same muscle, do the lengthened-biased one first while fresh (e.g. overhead extension before pushdown, incline curl before cable curl, seated leg curl before lying leg curl).
7. Calves and abs: end of session or on their own short slots; can be any day.

### 3.5 Rest periods
- Singer et al. 2024 Bayesian meta-analysis: small hypertrophy benefit to resting more than 60 s; no appreciable difference beyond about 90 s on average. Schoenfeld 2016 (trained men): 3 min beat 1 min for growth and strength.
- Failure every set needs more rest to keep rep counts usable. Encode:
  - Heavy compounds (squat patterns, presses, rows, hinges): 2.5 to 4 min.
  - Machine compounds: 2 to 3 min.
  - Isolations: 1 to 2 min (calves, laterals, rear delts can be 45 to 90 s).
  - Rule for users: "Rest until your breathing is back to normal and you feel you could match your last set."
- Antagonist supersets (chest/back, biceps/triceps) save about 36% of session time with similar growth (superset RCT); use them when session time is limited, not on heavy barbell compounds.

Section sources:
- Pelland: https://sportrxiv.org/index.php/server/preprint/view/460
- Schoenfeld frequency meta-analysis: https://pubmed.ncbi.nlm.nih.gov/27102172/
- Remmert per-session ceiling: https://biolayne.com/reps/issue-36/too-much-muscle-math-finding-the-ideal-training-volume-per-session/
- Rest meta-analysis (Singer 2024): https://doaj.org/article/18363f4031e0487793db2084bee23f38
- Supersets RCT: https://sportrxiv.org/index.php/server/preprint/view/419
- Min-Max: https://jeffnippard.com/products/min-max-program-phase-2
- Mentzer: https://www.liftosaur.com/programs/mike-mentzer-heavy-duty
- Paul Carter (pre-fatigue critique): https://metflexandchill.libsyn.com/156-how-to-optimize-hypertrophy-training-part-ii-with-paul-carter
- CBum split: https://gymcollege.substack.com/p/exclusive-cbum-workout-guide

---

## 4. Exercise selection hierarchy per muscle

### 4.0 Global selection rules
1. Stability first: the more stable the exercise (machine, Smith, chest/back supported), the more of the effort goes into the target muscle and the safer failure becomes. Elite failure coaches (Yates, TNF, CBum, Meadows) lean on machines for this reason.
2. Load the lengthened position: evidence favours exercises that are hardest or at least well loaded where the muscle is stretched (overhead extension > pushdown, about 40% more triceps growth in Maeo 2023; seated leg curl > lying leg curl, Maeo 2021; deep squats > half squats for glutes/adductors, Kubo 2019; lengthened partials as good as or better than full ROM, Wolf 2023, Pedrosa 2022, Kassiano 2023). Full ROM remains the default.
3. Resistance profile: pick tools whose hardest point matches the stretched point (cables set low for laterals, incline curls, pec deck/cable fly with deep stretch). Note: Pelland/Schoenfeld-group lateral raise RCT 2025 found DB and cable laterals grew side delts equally, so this is a tie-breaker, not a rule.
4. Progressive overload capacity: the main lift must be loadable in small increments for many weeks (barbell, plate-loaded, stack). This is why a goblet squat can never be the main quad lift for a trained lifter with a barbell: the load cap is set by the arms and upper back, not the quads.
5. Regional coverage: big muscles need 2 different exercises per week (e.g. squat pattern + leg extension for rectus femoris; hinge + knee-flexion curl for hamstrings; incline + flat/fly for chest; vertical + horizontal pull for back; overhead + pushdown for triceps).
6. Exercises per muscle: 1 to 3 per session, 2 to 5 per week. Keep the same exercises for a whole block (6 to 12 weeks) so progression is measurable; swap only when progress stalls for a block, joints hurt, or the lifter cannot feel the target.
7. Main-lift tier rules (hard constraints for the generator):
   - If barbell + rack available, the main quad lift is never goblet squat, DB split squat, or bodyweight squat.
   - If any of hack squat/pendulum/belt squat/V-squat exists, prefer it over barbell back squat for bodybuilding (unless user prefers barbell); high-bar or Smith squat is the next choice.
   - Never a rear-delt or side-delt "main lift" in a press format; delts are built with raises.

### 4.1 Quads
Ranked (FULL): 1 pendulum squat, 2 hack squat (heels low/neutral, deep), 3 belt squat / V-squat, 4 high-bar back squat (heels slightly elevated optional), 5 Smith squat (feet slightly forward, deep), 6 leg press (low, narrow feet, deep), 7 leg extension (essential second exercise: only reliable rectus femoris grower; squat-type moves barely grew rectus femoris in a 2021 study), 8 front squat, 9 Bulgarian split squat / walking lunge (also glutes/adductors), 10 sissy squat (lengthened, advanced).
- Why: machines remove balance and lower-back limits so quads hit failure first; deep knee flexion loads quads lengthened; leg extension covers the biarticular rectus femoris that squats miss (hip extended in squats).
- GARAGE: 1 high-bar back squat (heels on 1 to 2 cm plates/wedge), 2 landmine hack squat / landmine squat with heels raised, 3 front squat, 4 heel-elevated Bulgarian split squat, 5 cable or band-resisted leg extension / reverse Nordic, 6 sissy squat. Main lift = back squat. Never goblet squat as main.
- DB: 1 heel-elevated DB front-rack or DB squat (heavy pair) only if loads are high enough to reach failure in 30 reps or fewer, otherwise 2 Bulgarian split squat (rear foot on bench, heels elevated front foot) as main, 3 DB step-up (high box), 4 sissy squat, 5 Cyclist (heel-elevated narrow) goblet squat as a finisher.
- BW: 1 Bulgarian split squat / pistol progression, 2 sissy squat, 3 reverse Nordic, 4 heel-elevated cyclist squat for high-rep finishers, 5 shrimp squat.
- Reps: main 6 to 10 (machines 8 to 12), extension 10 to 20.

### 4.2 Hamstrings
Need one knee-flexion and one hip-hinge exercise per week (different regions grow).
- FULL: 1 seated leg curl (hip flexed = lengthened; beat lying curl in Maeo 2021), 2 lying leg curl, 3 RDL (barbell or Smith; technical failure), 4 stiff-leg deadlift / 45-degree back extension with hamstring bias (rounded upper back, hips at pad), 5 Nordic curl, 6 good morning (advanced).
- GARAGE: 1 RDL, 2 single-cable standing or kneeling leg curl / band leg curl, 3 Nordic curl (anchor under rack/bench), 4 DB single-leg RDL, 5 slider/towel leg curl.
- DB: 1 DB RDL (heavy, deep stretch), 2 single-leg DB RDL, 3 slider/towel or Swiss ball leg curl, 4 DB leg curl (lying on bench, DB between feet).
- BW: 1 Nordic curl (assisted with band or hands), 2 slider/towel leg curl, 3 single-leg hip-hinge (bodyweight then backpack), 4 glute-ham raise on floor.
- Reps: hinges 6 to 12 (technical failure), curls 8 to 15 (to failure, lengthened partials after failure).

### 4.3 Glutes
- FULL: 1 deep squat pattern / hack / leg press with high feet (already counted), 2 hip thrust (barbell or machine; similar glute growth to squats, Plotkin 2023, but squat grows quads/adductors too), 3 walking lunge / long-stride Bulgarian split squat (lengthened glute), 4 45-degree back extension glute bias, 5 cable or machine kickback, 6 hip abduction machine (upper glute/medius), 7 sumo/deficit deadlift (heavy, low frequency, max 1 to 2x/week).
- GARAGE: 1 barbell hip thrust, 2 Bulgarian split squat (lean forward, long stride), 3 RDL, 4 single-cable kickback / cable abduction, 5 B-stance hip thrust.
- DB: 1 DB Bulgarian split squat, 2 DB hip thrust / single-leg hip thrust, 3 DB walking lunge, 4 DB RDL.
- BW: 1 single-leg hip thrust (pause at top), 2 reverse lunge from deficit, 3 frog pumps for pump, 4 banded abductions.

### 4.4 Adductors
- FULL: 1 hip adduction machine (lean forward for more stretch), 2 deep squats / Smith or pendulum (adductor magnus grows with depth; Kubo 2019), 3 wide-stance leg press, 4 Copenhagen plank.
- GARAGE: 1 deep back squat, 2 cable adduction (ankle strap), 3 sumo/wide-stance squat or deficit sumo DL, 4 Copenhagen plank.
- DB: 1 DB sumo squat from deficit, 2 lateral lunge / Cossack squat, 3 Copenhagen plank.
- BW: 1 Copenhagen plank, 2 Cossack squat, 3 side-lying adduction.
- Default volume 0 to 6 direct sets unless priority; deep squats already cover much.

### 4.5 Calves
- FULL: 1 standing calf raise machine (straight knee, gastrocnemius; standing grew more than seated in a 2023 trial), 2 leg press calf raise, 3 Smith calf raise on a block (deficit), 4 seated calf raise (soleus), 5 donkey calf raise.
- GARAGE: 1 barbell calf raise in the rack, balls of feet on a plate stack or block (deficit), 2 heavy single-leg DB calf raise on a step, 3 seated calf raise with barbell or DBs on knees (soleus).
- DB: 1 single-leg DB calf raise on a step, 2 seated DB calf raise.
- BW: 1 single-leg calf raise on a step (slow), 2 tibialis raises for balance.
- Technique (encode as instruction): full stretch at the bottom with a 1 to 2 s pause, no bouncing, 1 to 2 s up. Partials in the bottom half after failure (Kassiano 2023 found lengthened partials grew gastrocnemius more). Reps 8 to 20; myo-reps suit calves.

### 4.6 Chest (including upper chest)
- FULL: 1 incline press (machine, Smith, or DB at 15 to 30 degrees; Chaves 2020 found incline grew upper chest more than flat), 2 flat or slight-decline machine chest press / Smith flat press, 3 flat DB press (deep stretch), 4 barbell bench (medium grip, touch chest), 5 pec deck / cable fly (deep stretch, mid or low-to-high for upper chest), 6 weighted dips (lower chest, lean forward), 7 deficit push-ups as finisher.
- Upper chest priority: low-incline press (15 to 30 degrees) as first lift + low-to-high cable fly or incline DB fly.
- GARAGE: 1 incline barbell or DB press, 2 flat barbell bench (with safeties), 3 DB flye (flat or incline; lengthened partials), 4 single-cable fly (one arm at a time), 5 landmine press (upper chest, shoulder-friendly), 6 dips/deficit push-ups.
- DB: 1 incline DB press (bench needed; if no bench, floor press + deficit push-ups), 2 flat DB press, 3 DB flye, 4 deficit push-up (hands on DBs).
- BW: 1 deficit push-up (feet elevated for upper chest), 2 weighted/backpack push-up, 3 ring or chair dips, 4 push-up with slow lowering and paused stretch.
- Reps: presses 6 to 12, flyes 10 to 20. Press to full depth; do not shorten ROM to lift heavier.

### 4.7 Lats and upper back
Balance vertical and horizontal pulling roughly evenly; lats = arm path close to the body, upper back/mid traps = elbows wider and more scapular retraction.
- FULL lats: 1 lat pulldown (neutral or medium grip, stretch at top), 2 single-arm cable pulldown / kneeling single-arm pulldown, 3 machine pullover or cable pullover (lengthened), 4 pull-ups/chins (weighted), 5 single-arm DB row (elbow to hip, long stretch), 6 machine high row.
- FULL upper back: 1 chest-supported T-bar or machine row (stable, failure-safe), 2 seated cable row (wide or neutral), 3 barbell or Pendlay row (technical failure), 4 Meadows row (landmine), 5 Kroc rows (high rep, DB).
- GARAGE: 1 weighted pull-up/chin-up (main vertical), 2 chest-supported DB row on incline bench, 3 Meadows row / landmine T-bar row, 4 barbell row (technical failure), 5 single-cable pulldown / kneeling single-arm pulldown, 6 cable pullover (straight-arm).
- DB: 1 single-arm DB row (bench-supported, long stretch), 2 chest-supported DB row, 3 DB pullover, 4 pull-ups if any bar exists.
- BW: 1 pull-ups/chin-ups (progress with load/backpack, then slow negatives), 2 inverted rows under table or rings, 3 towel rows, 4 band pulldowns.
- Reps: vertical 6 to 12 (weighted pull-ups 5 to 10), rows 8 to 15, pulldown/machine 10 to 20. Partials in the stretched half after failure on pulldowns and rows (Nippard).

### 4.8 Side delts
- FULL: 1 cable lateral raise (single-arm, cable at hip/wrist height, arm can travel behind body; tension at the stretched bottom), 2 machine lateral raise, 3 DB lateral raise (lean-in variant shifts load toward bottom), 4 cuffed behind-the-back cable lateral, 5 cable Y-raise, 6 wide-grip upright row (cable/EZ, to lower chest height).
- DB and cable laterals give similar growth (2025 RCT), so pick by joint comfort, progression increments, and preference.
- GARAGE: 1 single-cable lateral raise, 2 DB lateral raise (lean-in), 3 DB lateral partials after failure, 4 landmine lateral raise (single-arm, good stretch).
- DB: 1 DB lateral raise, 2 lean-in single-arm lateral, 3 seated lateral raise (strict), 4 chest-supported Y-raise.
- BW: 1 band lateral raise, 2 side-lying lateral raise with water bottles/backpack, 3 pike push-up (mostly front delt; side delts barely trained without load).
- Reps 10 to 20 (up to 30); frequent (3 to 4x/week); myo-reps, drop sets and lengthened partials suit side delts very well.

### 4.9 Rear delts
- FULL: 1 reverse pec deck (handles neutral, arms long), 2 single-arm cable reverse fly / cross-body cable rear delt raise, 3 rope face pull (high, external rotation), 4 chest-supported DB reverse fly, 5 rear-delt row (wide elbows, light).
- GARAGE: 1 cable cross-body rear delt raise or face pull, 2 chest-supported DB reverse fly on incline bench, 3 bent-over DB rear raise, 4 band pull-apart.
- DB: 1 chest-supported DB reverse fly, 2 bent-over rear raise, 3 lying side rear-delt raise.
- BW: 1 band pull-apart / band face pull, 2 prone Y/T raises, 3 bodyweight rear-delt row from rings/table (elbows wide).
- Reps 12 to 25; pause at top (RP: helps stop the back taking over); giant sets and myo-reps suit them.

### 4.10 Front delts
- Usually no direct work: incline and overhead pressing cover them (RP MEV 0 to 2).
- If wanted: 1 machine or Smith seated shoulder press, 2 seated DB press (deep), 3 cable or DB front raise, 4 landmine press.
- Garage/DB: seated DB press; BW: pike push-up / handstand push-up progression.
- Overhead pressing goes before laterals only if the user wants pressing strength; for side-delt priority do laterals first.

### 4.11 Biceps
- FULL: 1 incline DB curl (long-head stretch, shoulder extended), 2 preacher curl (machine or EZ; bottom-half loading grew biceps about 3x more than top half in Sato 2021), 3 Bayesian cable curl (arm behind body), 4 EZ-bar / barbell curl (overload), 5 hammer / cross-body curl (brachialis, brachioradialis), 6 cable curl variations.
- GARAGE: 1 EZ/barbell curl, 2 incline DB curl, 3 single-cable Bayesian curl, 4 DB preacher on adjustable bench, 5 hammer curl.
- DB: 1 incline DB curl, 2 DB preacher (chest on incline bench), 3 alternating DB curl, 4 hammer curl.
- BW: 1 chin-ups (supinated, close), 2 bodyweight curls on rings/table edge, 3 band curls, 4 towel isometric curls.
- Reps 8 to 15; lengthened partials after failure on preacher and incline curls; drop sets on cables/DBs.

### 4.12 Triceps
Use one overhead (long head, lengthened) and one pushdown or press-type per week.
- FULL: 1 overhead cable triceps extension (rope or bar; Maeo 2023: about 40% more total triceps growth than pushdowns), 2 skull crusher / EZ lying extension to behind head (lengthened, watch elbows), 3 cable pushdown (bar or rope; good for drop sets and myo-reps), 4 weighted dips, 5 JM press / close-grip Smith or bench (heavy, 5 to 10), 6 machine triceps extension, 7 single-arm cable cross-body extension.
- GARAGE: 1 single-cable overhead extension, 2 EZ skull crusher, 3 close-grip bench / JM press, 4 dips, 5 single-cable pushdown.
- DB: 1 seated or lying DB overhead extension (single DB, two hands), 2 DB skull crusher, 3 close-grip DB press / Tate press, 4 bench dips (weighted).
- BW: 1 close-grip / diamond push-up (feet elevated), 2 bodyweight triceps extension on bar/rings/bench edge, 3 bench dips, 4 band pushdown.
- Reps: compounds 6 to 10, overhead 8 to 15, pushdowns 10 to 20+.

### 4.13 Forearms
- FULL/GARAGE: 1 wrist curl (DB or barbell, behind back or on bench, full stretch), 2 reverse curl (EZ; brachioradialis), 3 reverse wrist curl, 4 hammer curl, 5 heavy holds/farmer carries (grip).
- DB: DB wrist curl, DB reverse curl, farmer hold. BW: dead hangs, towel hangs.
- Default 0 to 6 sets/week; heavy pulling covers grip. Reps 12 to 25.

### 4.14 Traps
- FULL: 1 Smith or machine shrug, 2 DB shrug (heavier ROM), 3 cable shrug (high frequency friendly), 4 rack pulls/heavy deadlifts (indirect), 5 face pulls / wide rows (mid traps), 6 Y-raise (lower traps).
- GARAGE: barbell shrug in rack, DB shrug, single-cable shrug. DB: DB shrug, seated DB shrug. BW: inverted shrugs, band shrugs.
- Technique: full relaxation at the bottom, 1 s squeeze at the top, avoid chin-to-chest; straps allowed. Reps 10 to 20.

### 4.15 Abs
- FULL: 1 cable crunch (load, stretch at top), 2 machine crunch, 3 hanging leg raise (posterior pelvic tilt, knees to chest), 4 decline sit-up with load, 5 ab wheel.
- GARAGE: cable crunch on the single cable, hanging leg raise from rack, weighted decline crunch, ab wheel / barbell rollout.
- DB: weighted crunch (DB on chest, from a stretch over a bench or rolled towel), lying leg raise, DB side bend (obliques).
- BW: hanging knee/leg raise, ab wheel or towel rollout, long-lever crunch, dead bug.
- Reps 10 to 20 loaded. Train 2 to 4x/week at end of session.

Section sources:
- Menno best exercises: https://mennohenselmans.com/these-are-the-best-exercises-to-build-muscle-science-based/
- Maeo 2023 triceps (and related): https://www.frontiersin.org/articles/10.3389/fphys.2023.1272106/full ; long-length training review: https://outlift.com/long-muscle-length-training/ ; https://www.muscleandmotion.com/?p=14478
- Stretch-mediated hypertrophy (SBS): https://www.strongerbyscience.com/?p=56862
- Lengthened partials evidence summary: https://biolayne.com/reps/issue-10/is-this-the-end-of-full-rom/ ; Kassiano calves: https://researchgate.net/profile/Witalo-Kassiano-2/publication/365127382_Greater_gastrocnemius_muscle_hypertrophy_after_partial_range_of_motion_training_performed_at_long_muscle_lengths/links/64e9ce1a434d3f628c4e27f8/Greater-Gastrocnemius-Muscle-Hypertrophy-After-Partial-Range-of-Motion-Training-Performed-at-Long-Muscle-Lengths.pdf ; Pedrosa: https://researchgate.net/profile/Gustavo-Pedrosa/publication/351538891_Partial_range_of_motion_training_elicits_favorable_improvements_in_muscular_adaptations_when_carried_out_at_long_muscle_lengths/links/61f1e6bbc5e3103375c2e9f9/Partial-range-of-motion-training-elicits-favorable-improvements-in-muscular-adaptations-when-carried-out-at-long-muscle-lengths.pdf
- Hip thrust vs squat (Plotkin 2023): https://doaj.org/article/e0f865b8c13d4086895c8762e72a6988
- Squat vs leg extension, rectus femoris: https://www.strengthlog.com/?p=11703
- Incline vs flat (Chaves 2020 / Albarello 2022, Helms): https://www.strongerbyscience.com/?p=57858
- Cable vs DB lateral raise RCT 2025: https://doaj.org/article/3c93be70ff61469c9cf475fb4f5360ea
- Built With Science delts: https://builtwithscience.com/fitness-tips/only-2-deltoid-exercises/
- RP per-muscle guides listed in Section 2.

---

## 5. Intensity techniques

### 5.0 Global rules
- Use only on the LAST set of an exercise (Nippard, Min-Max Block 2, Yates). One technique per exercise. 1 to 3 techniques per session; 2 to 4 per muscle per week maximum for a failure-trained lifter.
- Best on stable machines, cables and DB isolations. Avoid on barbell squats, hinges, barbell rows, standing presses (except a mechanical drop to a safer movement afterwards).
- Count volume: drop set or myo-rep cluster = about 1 extra set (RP counts each as one straight set); pre-exhaust pair = 1.5 sets; giant set mini-sets = about 2/3 set each.
- Introduce techniques after 2 to 4 weeks of a block (Min-Max model) or in the final 2 to 3 weeks before a deload, so they act as a progression lever.
- Remove all techniques in deload weeks and in the first week of a new block.
- Evidence summary: drop sets match traditional sets for growth in a fraction of the time (meta-analysis, 5 studies, n = 142; no significant difference, sessions half to a third as long); myo-reps matched straight sets for chest growth over 8 weeks (Bradshaw 2026) with less time; supersets matched traditional sets with 36% less time. None reliably add MORE growth than equal effort straight sets; their value is time efficiency and extending a set when the lifter has no more full reps.

### 5.1 Drop sets
- Protocol: reach failure, cut load 20 to 30%, immediately go to failure again; 1 to 2 drops (triple drops for pump-phase Meadows style).
- Suits: pushdowns, overhead cable extensions, cable/DB laterals, curls (cable, DB rack run-down), leg extension, leg curl, pec deck, machine press, pulldown, machine rows, calf raise.
- Avoid: free-weight barbell compounds, hinges, heavy DB presses.
- Encode: last set only; "drop about a quarter of the weight, no rest, go again to failure".

### 5.2 Mechanical drop sets (same load or no load, easier variation)
Keep going on a mechanically easier variation straight after failure. Pairings to encode:
- Quads: hack squat or back squat (last set, technical failure on barbell) -> heel-elevated bodyweight squats or cyclist squats to failure; leg press narrow deep -> leg press feet higher; leg extension toes neutral -> slight lean back.
- Hamstrings: seated leg curl -> lengthened partials; RDL -> 45-degree back extension hamstring bias (bodyweight).
- Chest: incline DB press -> flat DB press -> push-ups; DB flye at failure -> press the same DBs (fly-to-press); machine press -> push-ups.
- Back: wide pulldown -> close neutral pulldown; pull-ups -> chin-ups -> inverted rows / band-assisted.
- Side delts: DB lateral raise -> partial laterals in the bottom half -> upright row with same DBs.
- Rear delts: rear delt fly -> bent rear-delt row.
- Biceps: incline curl -> standing curl -> hammer curl (same DBs); preacher curl -> lengthened partials in the bottom half.
- Triceps: skull crusher -> close-grip press with same bar (JM-style); overhead extension -> pushdown.
- Calves: straight-leg calf raise -> bent-knee calf raise.
- Glutes: hip thrust full -> top-half pulses (pump) or long-stride lunge -> short-stride.

### 5.3 Rest-pause (DC style and Yates style)
- Yates: after failure, rest 10 to 15 s, 1 to 2 more mini-bouts to failure.
- DoggCrapp/Paul Carter lineage: one set split into 3 mini-sets with about 15 deep breaths between, total rep target (e.g. 11 to 15 or 15 to 20); rest-pause the first exercise, then widowmaker-type high-rep sets for legs and loaded extreme stretches (60 s) after.
- Suits machines and Smith; avoid on barbell squats/hinges (DC uses a single 20-rep widowmaker set instead).

### 5.4 Myo-reps (Fagerli)
- Activation set of about 10 to 20 reps to failure (or 1 short), rest 3 to 5 deep breaths (about 15 to 20 s), mini-sets of 3 to 5 reps with the same load; stop when the target reps cannot be hit (typically 3 to 5 mini-sets). Alternative: match rule (stop when a mini-set loses a rep).
- Suits: side delts, rear delts, calves, pushdowns, curls, leg extension, leg curl, flyes/pec deck, machine presses, abs. Not for free-weight presses, squats, deadlifts, split squats.
- Counts as 1 to 1.5 sets; very time efficient; good default technique on a crowded priority day.

### 5.5 Lengthened partials
- Evidence: training in the lengthened range matches or beats full ROM (Wolf 2023 meta-analysis; Pedrosa 2022 leg extension; Kassiano 2023 calves; Sato 2021 bottom-half preacher). Short-range partials at the top are inferior.
- Nippard application: after full-ROM failure on the last set, 4 to 6 partial reps in the stretched half (lower half of a curl, bottom half of a pulldown/row where the arms are long, bottom half of laterals, bottom of leg curl and calf raise). Keep the same endpoint weekly for tracking. Also full sets of lengthened partials on DB flyes; alternating full and partial reps on pec deck.
- Suits: pulldowns, pull-ups, chest-supported rows, seated/lying leg curls, leg extension (bottom half), calf raises, DB/cable laterals, preacher/incline curls, DB flyes, pec deck, overhead extensions, hack squat/leg press bottom half (machine only).
- Avoid on barbell squats, RDLs, bench without safeties.

### 5.6 Supersets and giant sets
- Antagonist supersets (chest/back, bi/tri, quads/hams): time saver, no loss of growth; use on isolations and machines.
- Agonist pre-exhaust supersets: isolation into compound with no rest (Mentzer pairs above; pushdown into dips; leg extension into hack squat; pec deck into incline press). Counts as 1.5 sets. Lower compound load by 20 to 30%.
- Compound sets / tri-sets for the same muscle (CBum: JM press -> machine dips -> overhead extension; preacher -> reverse curl -> low pulley curl).
- RP giant sets: fixed load, total-rep target (e.g. 40 reps) in as few mini-sets as possible with short rests; good for rear delts, laterals, pulldowns, machine rows; each mini-set about 2/3 set.

### 5.7 FST-7 (Hany Rambod)
- After 1 to 3 heavier base exercises, finish with ONE exercise for 7 sets of 8 to 15 reps, 30 to 45 s rest, close to failure by rep 12 to 15. Flex the target muscle hard and stretch it between sets; drink water.
- Exercise choice: isolation (leg extension, pec deck, cable fly, pushdown, cable curl, cable lateral, calf press) for most; compounds (hack squat, leg press, machine press) only for very well-recovered advanced lifters.
- Frequency: 1 to 2 body parts per week for most; lagging parts more often; Phil Heath's arms about every second week. If soreness lasts 5+ days, back off.
- Failure-based adaptation for our generator: count the 7 sets as about 4 hard sets (later sets have short rest and lower load); use only for 1 priority muscle per session.

### 5.8 Forced reps and negatives
- Yates: 2 to 4 forced reps on the single working set; slow 5 to 8 s negatives to finish. Mentzer: 1 to 2 forced reps, sparingly, mostly when stalled.
- Require a partner or a machine where the user can assist themselves (single-arm machines, leg press hand assist). Encode as optional, last set, max 1 to 2 exercises per week, never on free-weight squats/hinges.
- Negatives: on chin-ups (jump up, 5 s down), machine curls/extensions with two-legs-up one-leg-down.

### 5.9 Static holds and loaded stretches
- Isometric hold in the stretched position after failure (CBum incline bench isometric holds 20 to 30 s; Min-Max Block 2 static holds; Meadows loaded stretches 30 to 60 s at 20 to 30% load; DC extreme stretches 60 s).
- Good pairings: DB flye or pec deck held at the bottom, hanging from pull-up bar (lats), deep calf stretch on step, overhead triceps extension held in the stretch, seated leg curl held at start, sissy squat/hack squat bottom hold (bodyweight).
- Evidence: lengthened isometrics outperform shortened ones; long static stretching alone can grow muscle (Warneke 2022 calves +15%) but requires very long durations; treat 30 to 60 s holds as a finisher, not a replacement.

### 5.10 Mountain Dog (John Meadows) session template (useful as an "advanced" session style)
1. Pre-activation: 2 to 3 light pump sets on a machine/cable (e.g. leg curls before squats, pec deck before pressing), not to failure.
2. Explosive/heavy compound: 3 to 6 sets of 3 to 6 (accommodating resistance), stop when speed drops.
3. Supramax pump: machines to failure and beyond (drops, rest-pause, giant sets).
4. Loaded stretch: 1 to 2 sets of 30 to 60 s.

Section sources:
- Drop sets meta-analysis: https://doaj.org/article/21e0b210caf1433594359186eee617b9
- Myo-reps trial and protocol: https://biolayne.com/reps/issue-50/myo-reps-for-mass/ ; https://www.artofmanliness.com/strength/fitness/mix-up-your-workout-with-myo-reps/
- Supersets RCT: https://sportrxiv.org/index.php/server/preprint/view/419
- Lengthened partials (Nippard): https://fitnessvolt.com/jeff-nippard-long-length-partials-muscle-growth/ ; evidence: https://biolayne.com/reps/issue-10/is-this-the-end-of-full-rom/
- RP technique suitability per muscle: chest https://rpstrength.com/chest-training-tips-hypertrophy/ ; back https://rpstrength.com/back-training-tips-hypertrophy/ ; triceps https://help.rpstrength.com/hc/en-us/articles/32433338498967-Triceps ; glutes https://help.rpstrength.com/hc/en-us/articles/32433132961431-Glutes ; rear delts https://help.rpstrength.com/hc/en-us/articles/32432607796631-Rear-Delts ; calves https://rpstrength.com/calves-training-tips-hypertrophy
- FST-7: https://www.bodybuilding.com/fun/hany-rambod-fst-7-interview.htm
- Mountain Dog: https://arvo.guru/fr/resources/methods/mountain-dog
- DoggCrapp lineage (Carter): https://marketplace.trainheroic.com/workout-plan/program/carter-program-1600910130
- Yates: https://www.setforset.com/blogs/news/dorian-yates-blood-and-guts
- Mentzer: https://www.liftosaur.com/programs/mike-mentzer-heavy-duty
- Stretch study (Warneke 2022): https://www.strongerbyscience.com/?p=56862
- CBum: https://gymcollege.substack.com/p/exclusive-cbum-workout-guide

---

## 6. Progression

### 6.1 Double progression (default for failure-based plans)
- Each exercise has a rep range (e.g. 6 to 10, 8 to 12, 10 to 15, 12 to 20). Train to failure (or technical failure) every working set.
- When the FIRST working set reaches the top of the range (Min-Max/Yates style benchmark), or when ALL sets reach the top (stricter, RP/BWS style), increase load next session by the smallest step: barbell +2.5 kg (lower body +5 kg), DBs next pair (+1 to 2 kg each), cable/stack +1 plate or add-on weight, machines +1 plate (5 kg) or 2.5 kg if available. Target: new load lands at the bottom of the range.
- Recommended engine rule: use set 1 as the benchmark when every set is to failure (set 2 and 3 rep drops are expected and not a stall signal). Increase load when set 1 hits the top of the range with clean form.
- If the step is too big (reps fall below the bottom of the range), keep load and grow reps; for DB laterals and curls allow a wider range (10 to 20) so jumps are absorbable.
- Mentzer rule: start at the bottom of the range, add reps each session, at the top add 2.5 kg (5 kg leg press) and return to the bottom.
- Yates: log every set, beat the logbook (one more rep or a little more weight) every session.

### 6.2 Weekly progression across a block for failure training
- Since effort is already maximal, progression comes from reps/load, NOT from reducing reps in reserve (that is RP's lever) and only modestly from adding sets.
- Week 1 of a block: 1 short on all sets (calibration), week 2 onwards to failure. Optional set progression: add 1 set to 1 to 2 priority muscles every 1 to 2 weeks (RP style) up to the failure caps, then deload.
- Add intensity techniques in the second half of the block as an extra lever (Min-Max Block 2).
- Expected rate in trained lifters: about +1 rep or the smallest load step per exercise every 1 to 2 weeks for compounds; isolations slower.

### 6.3 What to do when reps stall
Define stall = set 1 reps and load not improved for 2 consecutive exposures (failure set, same conditions).
Decision ladder (encode in order):
1. One-off drop (bad sleep, diet, illness): repeat, no change.
2. Stall on 1 to 2 exercises only: change the rep range (e.g. 6 to 10 -> 10 to 15) or swap to a close variation (hack squat -> pendulum, incline DB -> incline Smith) at the start of the next block; or remove a set from that muscle.
3. Stall on several lifts at once, joint aches, sleep/appetite worse, motivation down (RP systemic MRV signs): take a deload now.
4. Mentzer option for HIT users: add a rest day between sessions before cutting load.
5. Persistent stall across blocks on a cut: accept maintenance of strength as success; reduce volume about a third, keep loads.

### 6.4 Deloads among failure-based coaches
- Evidence: Coleman et al. 2024 (trained, 9 weeks): a 1-week full training break midway did not change hypertrophy, but reduced strength gains slightly. So deloads are about fatigue and joints, not growth.
- RP: deload after each 4 to 6 week mesocycle; about half the sets and half the load (or same load, far from failure).
- Yates: trained hard 8 to 12 weeks then 1 to 2 weeks of easy training / time off, plus planned breaks after shows.
- Nippard: periodic deload weeks with reduced effort and volume between blocks.
- Encodable default for failure-every-set plans: deload every 6 to 8 weeks (5 to 6 if on a cut or 40+ years old), or reactively when the stall ladder hits step 3. Deload week: same exercises, about half the sets, loads about 10% lighter, stop every set "well short of failure" (3 to 4 reps in hand), no intensity techniques, keep frequency.

Section sources:
- Mentzer progression: https://www.liftosaur.com/programs/mike-mentzer-heavy-duty
- Yates: https://www.setforset.com/blogs/news/dorian-yates-blood-and-guts
- Min-Max structure: https://jeffnippard.com/products/min-max-program-phase-2
- Built With Science progression rule: https://builtwithscience.com/fitness-tips/only-2-deltoid-exercises/
- RP mesocycle and deload: https://rpstrength.com/back-training-tips-hypertrophy/
- Coleman 2024 deload study: https://sportrxiv.org/index.php/server/preprint/view/302 ; published https://peerj.com/articles/16777
- Teo: https://coachway.io/articles/eugene-teo-minimalist-hypertrophy-for-coaches/

---

## 7. Periodisation over blocks and phases

### 7.1 Block structure
- Mesocycle (block): 4 to 8 weeks (failure-based: 6 to 8 weeks accumulation) + 1 deload week.
- Exercises fixed within a block; rotate 1 to 3 exercises per muscle between blocks, keep at least one "anchor" lift per muscle for long-term tracking.
- Rep range rotation by block (optional): Block A main lifts 6 to 10; Block B 8 to 12/10 to 15; Block C specialisation. RP: put about half of weekly sets in 10 to 20 reps, the rest split between 5 to 10 and 20 to 30.
- Two-phase model (Min-Max): Phase 1 straight sets, perfect execution, find loads; Phase 2 same skeleton plus last-set techniques.

### 7.2 Phases by nutrition goal
| Phase | Volume | Effort | Techniques | Notes |
|---|---|---|---|---|
| Bulk / growth (surplus) | Highest (upper end of failure ranges); add sets to priority muscles | Failure | Full menu | Best time for specialisation blocks and for heavier rep ranges. |
| Maintenance / recomposition | Middle | Failure | Moderate | Good for learning new exercises. |
| Cut / prep (deficit) | Reduce about 20 to 33% (fewer sets), keep loads and exercises | Failure on stable lifts, technical failure on barbell lifts; more clean-failure labels as the diet deepens | Keep a few (drop sets, myo-reps) for time, but drop forced reps/negatives | Goal: keep strength. Recovery falls; deload sooner (every 4 to 6 weeks). Menno notes reduced volume improved progress under energy restriction. |
| Maintenance of non-priority muscles | 3 to 6 sets/week per muscle | Failure | None | About a third of growth volume maintains size for months. |

### 7.3 Specialisation / priority phases
- Choose 1 to 2 priority muscles (max 2 large or 3 small per block; never chest + back + quads together).
- Priority muscles: volume at RP prioritised MAV (failure equivalent 12 to 18 sets), frequency 3 to 4x/week, trained FIRST in sessions, techniques allowed.
- Non-priority muscles: drop toward MV/maintenance (3 to 6 sets), 1 to 2x/week.
- Duration: 4 to 8 weeks, then rotate priority or return to balanced.
- Priority day template (e.g. 5th or 6th day: "Chest, Delts, Arms" as in Nippard's arms/weak-point day and CBum's arms day):
  1. Incline press (machine/Smith/DB) 2 to 3 sets x 6 to 10, failure.
  2. Cable lateral raise 3 sets x 10 to 15, last set myo-reps.
  3. Pec deck or cable fly 2 sets x 10 to 15, last set lengthened partials.
  4. Superset: overhead cable extension 2 x 10 to 15 / incline DB curl 2 x 10 to 15, last set drop.
  5. Superset: pushdown 2 x 12 to 20 / preacher or Bayesian curl 2 x 10 to 15.
  6. Rear delt reverse pec deck 2 x 15 to 25, myo-reps (or FST-7 on the single priority muscle instead).
  About 16 to 20 working sets, 60 to 70 min.
- Cutler rule for lagging parts: train them twice a week with different exercises the second time.
- Rambod rule: lagging parts get FST-7 more often; strong parts less often.

Section sources:
- RP prioritised landmarks (MAV*P/MRV*P) and per-muscle guides: https://rpstrength.com/chest-training-tips-hypertrophy/ ; https://rpstrength.com/calves-training-tips-hypertrophy ; https://rpstrength.com/trap-training-tips-hypertrophy/ ; https://rpstrength.com/front-delt-training-tips-hypertrophy/
- Min-Max phases: https://jeffnippard.com/products/min-max-program-phase-2
- Pure Bodybuilding (arms + weak point day): https://barbend.com/jeff-nippard-pure-bodybuilding-program
- Menno on cutting volume: https://mennohenselmans.com/optimal-training-volume/
- Cutler: https://fitnessvolt.com/jay-cutler-workout/
- FST-7: https://www.bodybuilding.com/fun/hany-rambod-fst-7-interview.htm
- CBum split: https://gymcollege.substack.com/p/exclusive-cbum-workout-guide

---

## 8. Warm-up and feeder sets

### 8.1 Evidence
- A heavier specific warm-up set outperforms a light one: 5 reps at about 80% of the working load gave more total volume in subsequent sets to failure than 10 at 60% or 15 at 40% (Brazilian crossover study); Ribeiro et al. found 8 reps at about 64% 1RM beat about 32%, and both together were best; a 90% warm-up set improved squat performance more than 45% (Sousa 2024).
- RP: general warm-ups (treadmill) do little for upper-body performance; one feeder at about 50% x 8 and one heavy set of 1 to 3 reps at working weight provides virtually all the benefit for the first exercise; later exercises need little or none. No long static stretching before lifting.
- Yates: 2 to 3 progressively heavier warm-up sets before the single working set, especially for the first exercise of a muscle; warm-ups never fatiguing. Twinem: too many warm-ups waste energy that should go into working sets.
- Meadows pre-activation (light pump on a machine before heavy compounds) is a training phase, useful for knee/elbow comfort (e.g. leg curls before squats, pushdowns before pressing).

### 8.2 Encodable warm-up rules
- Optional general warm-up: 3 to 5 min easy cardio or dynamic drills (more if cold gym, morning, 35+, or prior injury). Not required.
- First exercise of each muscle (main compound):
  - Set A: about 40 to 50% of working load x 8 to 10 (easy).
  - Set B: about 70% x 4 to 6.
  - Set C: about 85 to 90% x 1 to 3 (crisp, fast). Skip C if working load is light (<40 kg barbell or isolation).
  - Heavy barbell squats/hinges for strong lifters may add one more step (e.g. 60% x 5).
- Second compound for the same muscle: 1 feeder at about 70% x 4 to 6.
- Isolations after the muscle is warm: 0 to 1 feeder (about 50% x 8 to 10), mainly for elbows/shoulders.
- Feeder sets never count as working sets and are never labelled "to failure".
- Joint feeders: 1 light set of pushdowns or curls before heavy pressing/rows for cranky elbows; band external rotation before heavy pressing; leg curl or leg extension 1 to 2 light sets before squats for knees.
- Do not static stretch before lifting; place loaded stretches at the end (FST-7, Meadows, DC).
- Display warm-ups as calculated loads (rounded to available plates/DBs), labelled "Warm-up" or "Feeder".

Section sources:
- SBS heavier warm-ups (Milo Wolf): https://www.strongerbyscience.com/heavier-warm-ups/
- RP warm-up guidance: https://rpstrength.com/blogs/podcasts/the-truth-about-warming-up-what-lifters-get-wrong
- Yates: https://www.setforset.com/blogs/news/dorian-yates-blood-and-guts
- Twinem: https://barbend.com/news/tnf-joel-twinem-trains-upper-body-with-terrence-ruffin/
- Mountain Dog pre-activation: https://arvo.guru/fr/resources/methods/mountain-dog
- Pure Bodybuilding warm-up: https://barbend.com/jeff-nippard-pure-bodybuilding-program

---

## 9. Generator checklist (quick encoding summary)
1. Main lift per muscle chosen from the top of the equipment-tier ranking; hard ban on goblet/BW squats as main quad lift when barbell+rack or a quad machine exists.
2. Two exercises per big muscle per week covering lengthened and regional needs (squat + leg extension; hinge + seated curl; incline + fly; vertical + horizontal pull; overhead extension + pushdown; incline/preacher curl + heavier curl).
3. Failure-every-set: 1 to 3 sets per exercise, 8 to 14 weekly sets per muscle (12 to 18 priority), at most about 6 to 8 failure sets per muscle per session.
4. Technical failure label on barbell squats, hinges, barbell rows, standing presses, split squats and lunges; absolute failure on machines, cables, DB isolations.
5. Plain-language effort labels only in the UI.
6. Order: priority first, big compound first, isolation then finisher; no stabiliser pre-fatigue.
7. Rest: 2.5 to 4 min compounds, 1 to 2 min isolation.
8. Techniques: last set only, machines/cables/isolations, 1 to 3 per session, added in the second half of a block; never in deloads or on spinal-loaded lifts.
9. Double progression with set 1 as benchmark; smallest load step when set 1 hits the top of the range.
10. Block = 6 to 8 weeks + deload (half sets, ~10% lighter, well short of failure); deload early on multi-lift stalls; cut = about a third less volume, same loads.
11. Warm-up ramp only for the first exercise per muscle (about 50% x 8, 70% x 5, 85 to 90% x 1 to 3), one feeder for the next compound.
