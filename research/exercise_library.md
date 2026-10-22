# AJ Training exercise library
Source: `research/exercise_library.json`. **635 exercises.** Every one of the 203 keys already in `public/onboard.js` is present under the same key. Generated from a script; regenerate rather than hand-edit if the schema changes.
- Compound: 309; isolation/other: 326
- Unilateral: 153
- Technical failure: 72

## Schema

`key, name, pattern, muscles {muscle: 1 primary | 0.5 secondary}, equipment [all required], compound, stretch 0-2, reps [low, high], rest_s, unilateral, technical_failure, cues, variations (keys), aliases`.

One optional field was added: `unit` on 69 entries whose `reps` are not repetitions (`s` seconds, `m` metres, `min` minutes, `cal` calories). No `unit` means reps.

Variations are the other members of the same exercise family (same pattern first), capped at 8.

## Count per pattern

| Pattern | Count | | Pattern | Count |
|---|---|---|---|---|
| fpress | 44 | | tripress | 10 |
| squat | 39 | | shrug | 9 |
| vpull | 30 | | pushdown | 9 |
| row | 30 | | neck | 9 |
| abs | 26 | | wrist | 9 |
| hinge | 25 | | ipress | 8 |
| curl | 25 | | latiso | 8 |
| lunge | 23 | | strongman | 8 |
| lat | 22 | | er | 8 |
| cond | 22 | | abd | 8 |
| ohp | 21 | | kneeext | 7 |
| mob | 21 | | carry | 7 |
| oly | 19 | | add | 6 |
| glute | 16 | | grip | 5 |
| erg | 16 | | pup | 4 |
| fly | 15 | | scap | 4 |
| triext | 15 | | tib | 3 |
| rear | 14 | | prot | 3 |
| skill | 14 | | hipflex | 3 |
| kneeflex | 13 | | sled | 3 |
| core | 13 | | fing | 1 |
| plow | 13 | | plat | 1 |
| calf | 12 | | land | 1 |
| obl | 12 | | ankle | 1 |

## Count per muscle

| Muscle | Primary (1) | Secondary (0.5) |
|---|---|---|
| glutes | 80 | 80 |
| triceps | 41 | 83 |
| quads | 74 | 48 |
| fdelt | 38 | 81 |
| upback | 39 | 63 |
| chest | 67 | 26 |
| biceps | 27 | 61 |
| lats | 54 | 31 |
| abs | 43 | 39 |
| hams | 28 | 40 |
| adductors | 11 | 45 |
| traps | 12 | 27 |
| forearms | 23 | 15 |
| sdelt | 20 | 18 |
| obliques | 21 | 14 |
| lowback | 3 | 31 |
| rdelt | 14 | 19 |
| calves | 12 | 13 |
| neck | 9 | 0 |
| tibialis | 3 | 0 |

## New muscle keys

- `forearms`, `traps`, `neck`, `obliques`, `lowback`, `tibialis` are used.
- `abductors` was not added: abduction work is glute medius/minimus, so it stays under `glutes`, as the app already does.
- Until the app tracks them, map `traps` -> `upback`, `obliques` -> `abs`, and treat `forearms`, `neck`, `lowback`, `tibialis` as untracked (as `ml` labels do today).

## New patterns

| Pattern | Why |
|---|---|
| oly | Olympic lifts and their pulls (clean, snatch, jerk, DB/KB snatch). Technique-limited power work; should not count toward hypertrophy volume like a squat or press. |
| strongman | Implement events that do not fit an existing pattern (stones, tyre flip, yoke, log/axle/circus press). Long rests, technical failure. |
| skill | Calisthenics skills and holds (levers, planche, handstand, L-sit, muscle-up, flag). Progressed by leverage, not load. |
| mob | Mobility and stretching drills. No hypertrophy volume. |
| obl | Trunk rotation and lateral flexion (woodchops, side bends, Russian twists, rotary torso). Separates obliques from flexion (abs) and anti-movement (core). |
| wrist | Loaded wrist flexion/extension/rotation for forearm hypertrophy. Existing grip pattern stays for holds and hangs. |
| scap | Scapular control and serratus work (scap push-up, scap pull-up, wall slide, serratus punch). Prehab, sits beside er. |
| tib | Ankle dorsiflexion for the tibialis anterior; the opposite action to calf. |
| hipflex | Hip flexion strength (psoas march, cable hip flexion, straight-leg raise). Rehab/athletic. |

Existing patterns kept: squat, hinge, lunge, kneeext, kneeflex, glute, add, abd, calf, ipress, fpress, fly, vpull, latiso, row, ohp, lat, rear, curl, triext, pushdown, tripress, abs, core, shrug, cond, sled, carry, erg, plow, plat, prot, pup, er, neck, fing, grip, land, ankle.

## New equipment keys

| Key | Meaning | Used by |
|---|---|---|
| plates | Weight plates on their own (plate raises, pinches, Svend press, neck work). Suggest KIT_ALIAS bb -> plates | svend, platefront, neckflexplate, neckextplate, platepinch |
| neckm | 4-way neck machine | neckmflex, neckmext, neckmlat |
| jumprope | Skipping rope | skipping, du |
| iso_chestpress | Iso-lateral (plate-loaded) seated chest press | isochest |
| iso_inclinepress | Iso-lateral incline press | isoinc |
| iso_widechest | Iso-lateral wide chest press | isowide |
| iso_benchpress | Iso-lateral lying bench press machine | isobench |
| vest | Weighted vest | wpushup |
| iso_frontpd | Iso-lateral front pulldown | isopd |
| sealbench | Seal row bench (high flat bench) | sealrow |
| iso_row | Iso-lateral row (plate-loaded) | isorow |
| iso_dyrow | D.Y. row machine (plate-loaded underhand row) | dyrow |
| shrugm | Shrug machine (plate-loaded or selectorised) | shrugmach |
| iso_shoulderpress | Iso-lateral shoulder press | isoohp |
| vikingpress | Viking press (machine or landmine handle) | viking |
| ohtriextm | Overhead triceps extension machine | ohtriextm |
| leversquat | Leverage squat / squat-lunge machine | leversq |
| vertlegpress | Vertical leg press | vertlp |
| sissybench | Sissy squat bench / stand | sissybench |
| hyper90 | 90 degree (horizontal) back extension bench | hyper90 |
| abcoaster | Ab coaster | abcoaster |
| neckharness | Neck harness | neckharness |
| wristroller | Wrist roller | wristroller |
| gripper | Hand gripper | gripper |
| sledgehammer | Sledgehammer | sledgehammer |
| hurdles | Mini hurdles | hurdlehop |
| foamroller | Foam roller | tspineroller |

No cable attachment keys were added: rope, bars, D-handles and ankle straps are assumed with any cable station. Bodyweight exercises have an empty equipment list.

## Changes to existing keys

Pattern changes: `plank` abs -> core, `woodchop` abs -> obl, `trapshrug` row -> shrug (was a mislabel), `wristcurl` grip -> wrist. `pushjerk` kept as ohp for slot compatibility.

Name changes: incbench "Incline barbell bench press", sulek "Kneeling single-arm cable pulldown" (alias Sulek pulldown), pullover "Straight-arm cable pulldown" (alias cable pullover), cabrow "Seated cable row, close neutral grip", pdfixed "Rope pushdown", rdl "Romanian deadlift", hipext "45 degree back extension", ngpd "Close neutral-grip pulldown", invrow "Ring row" (bar version is new key `barinvrow`), lpbench "Paused bench press (3 s)", boxjump "Box jump (conditioning)" (to differ from `boxjp`), plus minor tidy-ups.

Muscle maps were made more accurate on about 55 existing keys, mainly: `lowback: 0.5` on free-weight hinges, squats and bent-over rows; shrugs and upright rows now use `traps`; reverse curl is forearms-primary; hammer/EZ/barbell curls get `forearms: 0.5`; anti-rotation work (Pallof, side plank, woodchop, landmine rotation) is obliques-primary; grip, neck and wrist entries that had `{}` now name their muscle; sled push/pull and farmers carry now carry full primary credit, which the app previously kept low on purpose for conditioning.

## Technical failure rule used

True for barbell squats, hinges and rows, standing presses, loaded lunges and split squats, Olympic lifts and strongman events. False for barbell bench variants (assumed safety arms, as the app notes), machines, Smith, cables and isolation.
