# Individual, Combat and Other Sports: Performance Programming Knowledge Base

Purpose: rules and templates a programmer can encode so that "Train for my sport" plans for individual, combat and other sports read like the work of a top performance coach, scaled sensibly for amateurs. It sits alongside `public/sportprofiles.js` (profiles: `q`, `prehab`, `season`, `avoidBefore`) and the sport builder in `public/onboard.js` (`sportBlueprint`, `buildSportVariant`, `SPDOSE`, `PREHAB`, `SPX`).

Written in our own words. Where a number comes from a study it is cited; where it is a coach's heuristic or a community benchmark it is labelled **(coach practice)** or **(benchmark, not peer reviewed)**. British English throughout.

How each sport section is laid out (identical order, for encoding):
1. **Encoding block**: proposed `id`, `q` (0-3, `mass` 0-2), `prehab` keys, `season` sessions per week, `avoidBefore`, `confidence`, plus any `SPDOSE` override and new keys needed.
2. **Demands and energy systems**
3. **Injuries and prevention** (table)
4. **Fitting the gym around the sport** (and weight-making where relevant)
5. **Season structure and sessions per week** (table)
6. **Session templates** (tables by day, columns by phase)
7. **Sport-specific conditioning**
8. **Testing benchmarks**
9. **Peaking for competition**
10. **Sources**

Exception: powerlifting (section 26) is deliberately shorter (demands, injuries, conditioning, weight class, peaking, sources) because the existing strength engine programmes the lifts.

---

## 0. Shared conventions (apply to every sport unless the sport section overrides)

### 0.1 Phases and how they map to the app
The app currently has three seasons (`off`, `pre`, `in`). Individual sports need two more states, which can be encoded as sub-phases triggered by a competition date:

| Phase | App key | What it is | Typical length |
|---|---|---|---|
| General preparation | `off` | Build strength, muscle where useful, aerobic base, fix weak links | 6-16 weeks |
| Specific preparation / fight camp | `pre` | Convert strength to power, sport-specific conditioning, prehab maintained | 4-10 weeks |
| Competition / in-season | `in` | Maintain strength and power with minimal fatigue | Season length |
| Peak / taper | `peak` (proposed) | Cut volume, keep intensity, arrive fresh | 1-3 weeks before the target event |
| Transition | `transition` (proposed) | Active rest, mobility, light general work, fix niggles | 1-4 weeks after the season or a major event |

Proposed `SPDOSE.peak = {pow:2, main:2, acc:1, pre:1, core:1}` and `SPDOSE.transition = {pow:0, main:2, acc:2, pre:2, core:2}` at RIR 3-4.

### 0.2 Roles (matches `sportBlueprint` slot roles)
- **Power (`pow`)**: done first, fresh. Never to fatigue. 1-5 reps per set (throws and jumps) or 1-3 (Olympic lift variations). Rest 2-3 min. Stop the set if speed visibly drops (coach practice; velocity-loss threshold about 10% if a velocity device is used).
- **Main (`main`)**: the heavy compound lift. Strength phases 3-6 reps at 80-90% 1RM, 2-4 min rest. RIR 1-3, never to failure on barbell compounds.
- **Accessory (`acc`)**: 6-12 reps, RIR 1-3, 90-120 s rest. Single-leg, pulling and trunk balance work.
- **Prehab (`pre`)**: the sport's injury-prevention block. Moderate effort (RIR 2-4), 45-90 s rest, often supersetted with main-lift rest periods to save time.
- **Core (`core`)**: anti-rotation, anti-extension, lateral flexion; rotation-specific for rotational sports.
- **Conditioning (`cond`, proposed new role)**: sport-specific energy-system work. Only programmed in the gym plan when the athlete's sport practice does not already supply it (see each sport).

### 0.3 Level scaling (all templates are written for an **Intermediate** lifter)
| Level | Rule |
|---|---|
| New (under 1 year of structured lifting) | Replace % 1RM with effort: main lifts 3 sets of 5-8 at RIR 3. No Olympic lifts (use `cmj`, `boxjp`, `kbswing`); no Nordics until 4 weeks of `lyingcurl`/`slidecurl` (then partial-range Nordics). Plyometrics 40-60 foot contacts per session, low intensity (pogo, box jump, broad jump with stick). Neck work isometric only for the first 4 weeks. Main lift sets capped at 3. |
| Intermediate (1-3 years, knows their numbers) | Templates as written. Plyometrics 60-100 contacts. |
| Advanced (3+ years, strength benchmarks met) | Main lifts can run to 85-92% for triples, doubles and singles in strength blocks; add contrast pairs (heavy lift then matched jump/throw, 3-4 min rest per pair); cluster sets for power; 80-140 contacts including depth jumps. Extra session only if sport load allows. |

Plyometric volume ranges are adapted from NSCA guidance, trimmed because sport practice adds its own jumping (Haff and Triplett 2016).

### 0.4 Concurrent training rules (sport practice plus gym)
1. **Hard days hard, easy days easy** (coach practice, the "high-low" model): put heavy lifting and power on the same day as the hardest sport session (ideally gym after practice, or at least 6 h apart), so that easy days stay genuinely easy.
2. If gym and endurance work share a session and strength is the priority, lift first (Murlasits et al. 2018 meta-analysis: strength-first gave greater lower-body strength gains).
3. Strength and endurance together do not blunt maximal strength or hypertrophy much, but can blunt explosive strength, especially in the same session (Schumann et al. 2022). Keep power work away from long endurance sessions.
4. Never schedule heavy lower-body lifting the day before competition or the hardest sparring/technical session (`avoidBefore`).
5. One heavy session a week maintains strength and power in season; one every two weeks lets it decline (Rønnestad et al. 2011).

### 0.5 Standard prehab protocols (referenced by code in each sport)
| Code | App `PREHAB` key | Protocol | Evidence |
|---|---|---|---|
| **NECK-1** | `neck` | Weeks 1-4: 4-way manual or self-resisted isometrics (`neckiso`), 2-3 x 10-15 s per direction (flexion, extension, both side flexions) at about 50% then 70% effort. Weeks 5+: banded or harness dynamic (`neckband`), 2-3 x 12-20 per direction, slow 2-3 s each way, RIR 2-3, plus 1 set of isometric holds. 2-3x per week, 8-12 min. No neck bridging for amateurs (coach practice: bridge loads are hard to control). | Neck strength linked to lower concussion odds (Collins et al. 2014, observational); neck training increases strength and may reduce head acceleration (Hrysomallis 2016 review). |
| **NORDIC** | `nordic` | Start 2 x 5, build over 4-6 weeks to 3 x 8-12 (twice weekly), then maintain at 1-2 x per week, 2 x 4-6. | Programmes including the Nordic roughly halve hamstring injuries (van Dyk et al. 2019 meta-analysis); low-volume maintenance preserves architecture (Presland et al. 2018). |
| **COPEN** | `copenhagen` | Short-lever (knee) Copenhagen plank, 1-3 sets x 3-5 reps per side, building to long-lever 2-3 x 8-15 over 8 weeks, 2-3x per week. | Copenhagen programme cut groin problems by 41% in football (Harøy et al. 2019 RCT). |
| **CUFF** | `shoulderER` | Side-lying or cable external rotation 2-3 x 12-20 (RIR 2), prone Y-T-W 2 x 8 each, plus a scapular upward-rotation drill (wall slide, landmine press). 2-3x per week, can be done as warm-up. | OSTRC shoulder programme (ER strength, scapular control, thoracic mobility, kinetic chain) cut shoulder problems by 28% in elite handball (Andersson et al. 2017 RCT). |
| **CALF** | `calf` | Single-leg straight-knee and bent-knee calf raises, 3 x 8-15, slow, adding load once 25 clean reps are possible; 2-3x per week. Isometric holds 4-5 x 30-45 s when the tendon is irritable. | Coach practice for tendon capacity; heavy slow loading underpins tendinopathy management (Kongsgaard et al. 2009, patellar). |
| **PATELLA** (new key `patellar`) | proposed | Spanish squat or wall-sit isometric 4-5 x 30-45 s at a hard effort for pain relief and warm-up; heavy slow resistance (3 s up, 3 s down) leg press or hack squat 3-4 x 15 progressing to 4 x 6, 3x per week, for tendon capacity. | Isometrics reduced patellar tendon pain acutely (Rio et al. 2015); HSR as effective as eccentric decline squats with better satisfaction (Kongsgaard et al. 2009). |
| **ANKLE** | `ankle` | Single-leg balance reach and hop-and-hold progressions, 2-3 x 30-45 s per side or 2 x 6 per direction, 2-3x per week. | Balance/neuromuscular training reduces ankle sprains, especially recurrences (Hübscher et al. 2010 meta-analysis). |
| **LAND** | `landing` | Single-leg hop and stick, drop landing, lateral bound with stick; 2-3 x 4-6 per side, knee tracking over toes. | Neuromuscular programmes cut ACL injury by about 50% (Webster and Hewett 2018). |
| **WRIST** | `wrist` | Wrist flexion, extension, pronation/supination (hammer lever), radial/ulnar deviation 2 x 15-20 each; for weight-bearing sports add progressive wrist push-up and plank rocking. | Coach practice; graded loading for wrist-loaded sports. |
| **FINGER** | `fingers` | See climbing section for full hangboard rules. Non-climbers (grapplers): gi or towel hangs and grips 3 x 20-40 s, farmers carries, wrist roller. | Coach practice. |
| **BACK** | `lowback` | Back-extension holds or reps (`hipext`) 2-3 x 10-15 or 30-60 s holds; side planks; bird dog. | Trunk extensor endurance is a modest factor in low back pain; coach practice. |
| **HIPABD** | `hipAbd` | Banded side walks, side-lying hip abduction, abductor machine 2-3 x 12-20. | Coach practice for knee valgus control and lateral hip strength. |
| **TSPINE** (new key `tspine`) | proposed | Open book, quadruped thoracic rotation, half-kneeling thoracic rotation with stick: 2 x 8 per side, daily or in warm-up. | Coach practice; part of OSTRC programme. |
| **HIPROT** (new key `hipRot`) | proposed | 90/90 hip switches, active hip internal/external rotation lifts, banded hip IR in quadruped: 2 x 8-10 per side. | Coach practice; lead-hip rotation loss is common in golfers and throwers. |
| **SCAP** (new key `scap`) | proposed | Serratus wall slides, prone lower-trap raise, push-up plus: 2 x 10-15. | Coach practice for overhead sports. |
| **TIB** (new key `shin`) | proposed | Tibialis raises 2-3 x 15-25. | Coach practice for shin pain in runners and dancers. |

Proposed new exercises (not yet in the `L` library): `spanishsq` (Spanish squat isometric), `declinesq` (decline squat), `tibraise`, `openbook`, `hip9090`, `wristroller`, `pinchblock`, `gripper`, `towelpull` (towel or gi pull-up), `imtp` (isometric mid-thigh pull, test only), `mbscoop` (med ball scoop toss), `mbovh` (overhead backward med ball throw), `mbshot` (rotational shot-put throw), `depthjump`, `hurdlehop`, `sbound` (single-leg bounds), `landminepress`, `sledsprint`, `turkishgu` (Turkish get-up), `bottomsupkb` (bottoms-up kettlebell carry), `revwristcurl`, `flexbar` (eccentric wrist extension, Tyler twist), `hiking` (hiking bench isometric for sailing), `neckharness`.

### 0.6 Standard peaking rules
- Endurance-type taper: 8-14 days, cut volume by 41-60%, keep intensity, keep frequency (Bosquet et al. 2007 meta-analysis).
- Strength-power taper: last genuinely heavy session (90% or above) about 5-10 days out; final week volume 30-50% of normal; low-volume power work (2-3 x 2-3 jumps or throws) up to 2-3 days out; complete rest or a short primer in the last 1-2 days (Travis et al. 2020 review; weightlifters tapered for about 8 days, cut volume by about 43% and stopped training about 1.5 days before, Winwood et al. 2023).
- Prehab drops to one short session in the peak week; never introduce new exercises in the final 2 weeks.
- No testing maxes within 10 days of a target event (coach practice).

### 0.7 Weight-making (combat sports, weightlifting, powerlifting, rowing lightweights)
App policy, built from the sports-nutrition literature and deliberately more conservative than professional practice:
1. **Chronic loss** to approach the class: 0.5-1% of body mass per week, protein 1.8-2.2 g/kg, strength training kept in.
2. **Class choice**: an amateur's normal training weight should sit no more than about 5% above the class limit (coach practice). Flag anyone planning more.
3. **Acute loss** (final days): for amateurs, the app recommends none via dehydration. If the weigh-in is 24 h or more before competing and the athlete chooses to, cap acute loss at about 3% of body mass using a low-residue, lower-carbohydrate diet for 2-4 days and modest fluid and sodium manipulation. Never sweat suits, saunas, spitting, diuretics or laxatives. Flag anything above 5%.
4. **Same-day weigh-ins**: no acute weight loss at all.
5. **Under-18s**: no acute weight loss.
6. **Training during a cut**: keep 1-2 short heavy sessions (3 x 3 at 80-85% on two lifts) to hold strength; drop accessory volume by about half in the final 10 days; no maximal testing.
7. Rehydration and refuelling after weigh-in: fluids with sodium, 5-10 g/kg carbohydrate in the window available (professional guidance; amateurs who did not cut just eat normally).

Sources: Reale, Slater and Burke 2017 (acute weight-loss strategies, IJSPP); Reale et al. 2017 (individualised dietary strategies, EJSS); Artioli et al. 2016 ("It is time to ban rapid weight loss from combat sports", Sports Medicine); Matthews et al. 2019 (extreme rapid weight loss in UK MMA, IJSNEM).

### 0.8 General sources for this section
- Haff GG, Triplett NT (eds) 2016. Essentials of Strength Training and Conditioning, 4th ed. NSCA / Human Kinetics.
- Murlasits Z, Kneffel Z, Thalib L 2018. The physiological effects of concurrent strength and endurance training sequence: a systematic review and meta-analysis. Journal of Sports Sciences 36(11).
- Schumann M et al. 2022. Compatibility of concurrent aerobic and strength training for skeletal muscle size and function: an updated systematic review and meta-analysis. Sports Medicine.
- Rønnestad BR, Nymark BS, Raastad T 2011. Effects of in-season strength maintenance training frequency in professional soccer players. JSCR. https://pubmed.ncbi.nlm.nih.gov/21873897/
- Collins CL et al. 2014. Neck strength: a protective factor reducing risk for concussion in high school sports. Journal of Primary Prevention.
- Hrysomallis C 2016. Neck muscular strength, training, performance and sport injury risk: a review. Sports Medicine.
- van Dyk N, Behan FP, Whiteley R 2019. Including the Nordic hamstring exercise in injury prevention programmes halves the rate of hamstring injuries. BJSM.
- Presland JD et al. 2018. The effect of Nordic hamstring exercise training volume on biceps femoris long head architectural adaptation. Scand J Med Sci Sports.
- Harøy J et al. 2019. The Adductor Strengthening Programme prevents groin problems among male football players: a cluster-randomised controlled trial. BJSM.
- Andersson SH et al. 2017. Preventing overuse shoulder injuries among throwing athletes: a cluster-randomised controlled trial in 660 elite handball players. BJSM.
- Hübscher M et al. 2010. Neuromuscular training for sports injury prevention: a systematic review. Medicine and Science in Sports and Exercise.
- Webster KE, Hewett TE 2018. Meta-analysis of meta-analyses of ACL injury reduction training programs. Journal of Orthopaedic Research.
- Kongsgaard M et al. 2009. Corticosteroid injections, eccentric decline squat training and heavy slow resistance training in patellar tendinopathy. Scand J Med Sci Sports.
- Rio E et al. 2015. Isometric exercise induces analgesia and reduces inhibition in patellar tendinopathy. BJSM.
- Bosquet L et al. 2007. Effects of tapering on performance: a meta-analysis. MSSE.
- Travis SK et al. 2020. Tapering and peaking maximal strength for powerlifting performance: a review. Sports (Basel) 8(9).
- Winwood PW, Keogh JWL, Travis SK, Pritchard HJ 2023. The tapering practices of competitive weightlifters. JSCR 37(4). https://research.bond.edu.au/en/publications/the-tapering-practices-of-competitive-weightlifters/
- Reale R, Slater G, Burke LM 2017. Acute-weight-loss strategies for combat sports and applications to Olympic success. IJSPP 12(2). https://acuresearchbank.acu.edu.au/item/88q7v/acute-weight-loss-strategies-for-combat-sports-and-applications-to-olympic-success
- Artioli GG et al. 2016. It is time to ban rapid weight loss from combat sports. Sports Medicine.

---

# PART A: COMBAT SPORTS

Shared combat rules (apply to all six combat sections):
- Sport practice (sparring, rolling, randori, pad work) is the main conditioning and the main fatigue. The gym's job is strength, power, neck and injury resilience, plus conditioning only where practice falls short.
- **Fight camp** = `pre` (typically 8-10 weeks for a fight, 4-6 weeks for an amateur bout or tournament). **Between camps** = `off`. The final 7-10 days = `peak`.
- Never put heavy lower-body or high-volume work the day before hard sparring (`avoidBefore: "all"` for grapplers and kickers).
- Neck training (NECK-1) is programmed 2-3x per week for every combat sport, year round, including in camp (reduce to 1-2 short sessions in the peak week).
- Grapplers rely more on maximal strength and strength endurance; strikers more on fast, lighter-load power (James et al. 2016).

---

## 1. Boxing

### 1.1 Encoding block
- `id`: `boxing` (existing). Proposed `q`: `{maxStrength:2, power:3, rotational:3, unilateral:2, upperPull:2, upperPush:2, lowerBody:3, grip:1, neck:3, trunk:3, mass:0}` (raise `upperPull` 1 to 2 for shoulder balance against high-volume punching).
- `prehab`: `["neck","shoulderER","wrist","tspine"]`
- `season`: `{off:3, pre:2, in:1}`; peak 1. `avoidBefore: "upper"` (keep "all" if the athlete spars hard on legs, i.e. most do; proposed change to `"all"`).
- `confidence`: moderate.
- New keys: `mbscoop`, `mbshot`, `landminepress`, `tspine`, `wristroller`.

### 1.2 Demands and energy systems
- Amateur: 3 x 3 min rounds, 1 min rest (elite men and women). Professional: 4-12 x 3 min (2 min rounds for some women's pro bouts), 1 min rest.
- Mixed energy: high aerobic demand to recover between exchanges and rounds, with repeated short alactic bursts (punch combinations of 1-3 s) and glycolytic phases. Blood lactate after amateur bouts is high (commonly reported 9-14 mmol/L) (Slimani et al. 2017).
- Punch force comes from the ground up: leg drive, hip and trunk rotation, then arm. Punch impact in elite amateurs relates strongly to lower-body power (jump squat, bench throw power) (Loturco et al. 2016).
- Weight-class sport: fast, light power and relative strength matter more than mass.

### 1.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Head injury, concussion, facial cuts (most common with hand/wrist in GB elite boxing) | Neck strength (NECK-1), headguard in sparring, sparring intensity control (most sparring at 50-70%, coach practice). |
| Hand and wrist (metacarpal fractures, "boxer's knuckle", wrist sprains) | Correct wrapping, well-fitting gloves, WRIST protocol, gradual increase in heavy bag volume, grip strength. |
| Shoulder (rotator cuff overload, instability) | CUFF 2-3x per week, pulling volume to match pressing, thoracic mobility (TSPINE). |
| Low back (rotation and extension) | Anti-rotation core, hinge strength, BACK. |
| Lower limb (ankle sprains from footwork) | ANKLE protocol. |

### 1.4 Fitting the gym around boxing
- Typical serious amateur: 4-6 boxing sessions a week. Gym 2-3x off-season, 2x in camp, 1-2x in the final 3 weeks.
- Lift after boxing on the same day as hard technical work, or in the morning with boxing in the evening (6 h gap). Keep the day before hard sparring free of heavy lower body and high-volume upper body.
- Weight-making: follow 0.7. Boxing commonly has same-day or day-before weigh-ins at amateur level; default to no acute cut.

### 1.5 Season structure
| Phase | Weeks | Gym sessions | Focus |
|---|---|---|---|
| Off (between camps) | 6-12 | 3 | Max strength, hypertrophy only if moving up a class, aerobic base, fix shoulders |
| Pre (camp) | 6-10 | 2 | Strength to power, rotational power, round-based conditioning |
| In (competition block, frequent bouts) | ongoing | 1-2 | Maintain heavy strength and fast power, neck |
| Peak | final 7-10 days | 1 then 0 | Short, fast, low volume |

### 1.6 Session templates
Day A (lower power and strength)
| Slot | Exercise (key) | Off | Pre (camp) | In / maintenance |
|---|---|---|---|---|
| Power | Hang power clean `hangclean` or CMJ `cmj` | 4 x 3 @ 70-75%, 2-3 min | 5 x 2 @ 75-80% | 3 x 2 @ 75% |
| Power 2 | Rotational med ball throw `mbrot` (3-4 kg) | 3 x 5 each side | 4 x 4 each side, max intent | 3 x 3 each side |
| Main | Trap bar deadlift `trapdl` | 4 x 5 @ 80-85% | 4 x 3 @ 85% | 2-3 x 3 @ 85% |
| Accessory | Bulgarian split squat `bss` | 3 x 8 each | 3 x 6 each | 2 x 6 each |
| Prehab | Neck NECK-1 + CUFF | 2-3 x per direction | same | 2 x per direction |
| Core | Landmine rotation `landrot` or Pallof `pallof` | 3 x 8 each | 3 x 6 each, fast | 2 x 6 each |

Day B (upper and rotational)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Med ball chest pass `mbchest` / landmine punch press | 3 x 5 | 4 x 4, max speed | 3 x 3 |
| Main | Bench press `bench` or DB bench `flatdb` | 4 x 5 @ 80% | 3 x 3 @ 85% + 3 x 3 bench throw/plyo push-up | 3 x 3 @ 80% |
| Main pull | Pull-up `pullup` (weighted) | 4 x 5-6 | 3 x 5 | 2-3 x 5 |
| Accessory | Chest-supported row `csdb` | 3 x 10 | 3 x 8 | 2 x 8 |
| Accessory | Single-leg RDL `singlerdl` | 3 x 8 each | 2 x 8 each | 2 x 6 each |
| Prehab | WRIST + TSPINE + CUFF | 2 x 15 each | same | same |
| Core | Side plank `sideplank` | 3 x 30-45 s | 2 x 30 s | 2 x 30 s |

Day C (off-season only): single-leg strength (`stepup` 3 x 6), push press `pushpress` 4 x 3, row and press accessories, neck, conditioning block (below).

### 1.7 Sport-specific conditioning
Only add gym conditioning if boxing practice is under 4 sessions a week, or in the off-season.
- **Aerobic base (off)**: 2 x 30-45 min easy run or bike at conversational pace (zone 2) per week; tempo intervals 4-6 x 4 min at about 85% max HR, 2 min easy.
- **Round simulation (camp)**: match the bout format. Example: rounds of 3 min with 1 min rest, number of rounds = bout rounds + 1. Within each round: 10 s all-out (bag or airbike) every 30 s, 20 s moderate (coach practice).
- **Repeated sprint (camp)**: airbike or sled 8-10 x 6-8 s all-out, 30-50 s rest; 2 sets, 3 min between.
- **Peak week**: 2-3 rounds at fight pace only, early in the week.

### 1.8 Testing benchmarks (intermediate amateur / elite, benchmark not peer reviewed unless cited)
| Test | Good amateur | Elite |
|---|---|---|
| CMJ height | 40 cm (men), 30 cm (women) | 50+ cm men, 38+ cm women |
| Trap bar deadlift 1RM | 1.75 x body mass | 2.0-2.25 x |
| Bench press 1RM | 1.0-1.2 x | 1.3-1.5 x |
| Pull-ups (strict, max) | 12 men / 6 women | 18+ men / 10+ women |
| Seated med ball chest throw (3 kg) | track improvement | track improvement |
| 30-15 Intermittent Fitness Test or Yo-Yo IR1 | track, use for conditioning targets | |
| Neck: isometric strength by direction (handheld dynamometer or loaded harness hold) | flexion at least 70% of extension (coach practice), left-right within 10% | |

### 1.9 Peaking
- Last heavy lift (85% plus, low volume) 7-10 days out. Final week: one short session 3-4 days out (2 x 2 jumps, 2 x 3 med ball throws, 2 x 3 at 70% on one lift, neck isometrics).
- Last hard sparring typically 7-10 days out (coach practice); last conditioning at bout pace 4-5 days out.
- If cutting weight: see 0.7, no extra conditioning to "burn weight" in the final week.

### 1.10 Sources
- Loturco I et al. 2016. Strength and power qualities are highly associated with punching impact in elite amateur boxers. JSCR 30(1).
- Slimani M et al. 2017. Performance aspects and physiological responses in male amateur boxing competitions: a brief review. JSCR 31(4).
- Loosemore M et al. 2015. Boxing injury epidemiology in the Great Britain team: a 5-year surveillance study of medically diagnosed injury incidence and outcome. BJSM 49(17).
- James LP, Haff GG, Kelly VG, Beckman EM 2016. Towards a determinant model of strength and power in combat sports (physical attributes of combat sports athletes). Sports Medicine. https://ro.ecu.edu.au/ecuworkspost2013/2325
- Collins et al. 2014 and Hrysomallis 2016 (neck, see 0.8).

---

## 2. Mixed martial arts (MMA)

### 2.1 Encoding block
- `id`: `mma`. `q`: `{maxStrength:3, power:3, rotational:3, unilateral:2, upperPull:3, upperPush:2, lowerBody:3, grip:3, neck:3, trunk:3, mass:0}` (unchanged).
- `prehab`: `["neck","shoulderER","lowback","fingers","copenhagen"]` (add Copenhagen for adductor strain from kicks and guard work; add `knee`-protective landing work via `landing` in off-season).
- `season`: `{off:3, pre:2, in:2}`; peak 1. `avoidBefore: "all"`. `confidence`: moderate.

### 2.2 Demands and energy systems
- Amateur bouts typically 3 x 3 min; professional 3 x 5 min (title fights 5 x 5 min), 1 min rest.
- Mixed striking and grappling; high-intensity bursts (strikes, takedowns, scrambles) separated by lower-intensity positioning. Time-motion work reports high-intensity to low-intensity ratios around 1:2 to 1:4 (Del Vecchio et al. 2011, amateur MMA).
- Needs: maximal strength (clinch, takedowns, top control), fast power (strikes, shots), strength endurance (grip, isometric holds), high aerobic power to recover between exchanges (Lenetsky and Harris 2012; Tack 2013).

### 2.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Head (most common region injured in competition; concussion, lacerations) (Lystad et al. 2014) | NECK-1 year round; limited hard sparring (many elite gyms cap hard sparring to once a week or less, coach practice). |
| Hand and wrist (strikes in small gloves) | WRIST, wrapping, grip. |
| Shoulder (submissions, takedowns, posting) | CUFF, horizontal and vertical pulling volume, SCAP. |
| Knee (heel hooks, takedowns, kick checks): ACL, MCL, meniscus | LAND, unilateral strength, hamstring strength (NORDIC in off-season). |
| Neck (cranks, guillotines, sprawls) | NECK-1 including flexion and side-flexion. |
| Low back | Hinge strength, BACK, anti-rotation core. |
| Groin/adductor (high kicks, guard) | COPEN. |

### 2.4 Fitting the gym around MMA
- Typical pro: 8-12 sport sessions a week (striking, wrestling, BJJ, sparring). Amateur: 4-6.
- Gym 2-3x a week in camp, 3x off camp. Pair gym with technical (not sparring) days. Day before hard sparring: no heavy legs, no high-volume grip work.
- Weight-making: highest-risk sport for extreme cuts (Matthews et al. 2019). App policy 0.7 applies. Professional cuts are not a template for amateurs.

### 2.5 Season structure
| Phase | Weeks | Gym | Focus |
|---|---|---|---|
| Off | 4-12 | 3 | Max strength (3-6 reps), hypertrophy only if moving up, aerobic base, address injuries |
| Camp weeks 1-4 (`pre`) | 4 | 2-3 | Strength maintained, power emphasis, strength endurance |
| Camp weeks 5-8 | 4 | 2 | Power and speed, round-specific conditioning |
| Peak | final 7-10 days | 1 | Primer only |
| Transition | 1-2 weeks after a fight | 0-2 light | Medical checks, mobility |

### 2.6 Session templates
Day A (lower and grappling strength)
| Slot | Exercise (key) | Off | Pre (camp) | In / maintenance |
|---|---|---|---|---|
| Power | Hang power clean `hangclean` / box jump `boxjp` | 4 x 3 @ 70-80% | 5 x 2 @ 80% | 3 x 2 |
| Main | Back or front squat `squat` / `frontsq` | 4 x 4-5 @ 80-85% | 3 x 3 @ 85% | 3 x 3 @ 80-85% |
| Main 2 | Weighted pull-up `pullup` or towel pull-up `towelpull` | 4 x 5 | 3 x 4 | 3 x 4 |
| Accessory | Single-leg RDL `singlerdl` | 3 x 8 each | 2 x 6 each | 2 x 6 each |
| Prehab | NECK-1 + COPEN | 3 per direction; 2 x 6-10 each side | same | 2 |
| Core | Ab wheel `abwheel` | 3 x 8-10 | 3 x 8 | 2 x 8 |

Day B (upper and rotation)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Rotational med ball throw `mbrot` | 4 x 4 each | 4 x 4 each | 3 x 3 each |
| Main | Trap bar deadlift `trapdl` | 4 x 4 @ 85% | 3 x 3 @ 85% | 2 x 3 @ 85% |
| Main 2 | Bench press `bench` / landmine press | 4 x 5 @ 80% | 3 x 4 | 3 x 3 |
| Accessory | Row `bbrow` / `csdb` | 3 x 8 | 3 x 8 | 2 x 8 |
| Grip | Farmers carry `farmers` | 3 x 30-40 m heavy | 3 x 30 m | 2 x 30 m |
| Prehab | CUFF + BACK | 2 x 15 | 2 x 15 | 2 x 12 |

Day C (off and early camp): push press `pushpress` 4 x 3, step-up `stepup` 3 x 6, sled push `sledpush` 6 x 15 m, neck, Pallof.

### 2.7 Sport-specific conditioning
- **Off**: aerobic base 2-3 x 30-45 min zone 2 (bike, row, run, or low-intensity drilling); 1 tempo session.
- **Camp**: round simulations matching the bout (3 x 5 min or 5 x 5 min, 1 min rest). Within a round, alternate 15 s high-intensity (sprawl, bag flurry, airbike) with 30-45 s moderate (drilling, light bag). Repeated-effort circuits: 6-8 stations, 20-30 s work, mimic scramble demands.
- **Glycolytic top-up** (camp weeks 5-8, 1x per week max): 6-8 x 30 s hard, 90 s rest on airbike.
- Most of this happens on the mats in good gyms; the app should ask how many hard sessions the athlete already does and only add 1-2 if fewer than 3.

### 2.8 Testing benchmarks
| Test | Good amateur | Elite pro |
|---|---|---|
| Back squat 1RM | 1.5 x BM | 1.8-2.0 x |
| Deadlift / trap bar 1RM | 1.8 x | 2.2-2.5 x |
| Bench 1RM | 1.0-1.2 x | 1.3 x |
| Pull-ups max | 12 | 20+ |
| Gi/towel hang | 45 s | 90 s+ |
| CMJ | 40 cm | 50 cm+ |
| VO2max (if available) | 50 ml/kg/min | 55-60+ (coach practice; reported ranges in Lenetsky and Harris 2012) |

### 2.9 Peaking
- Last heavy session 7-10 days out; last hard sparring 7-14 days out (coach practice).
- Fight week: one primer session early in the week (jumps 3 x 2, med ball 3 x 3, 2 x 2 at 70-75%, neck isometrics). Then rest.
- Keep weight-cut and peak aligned: low-residue eating does not need extra training.

### 2.10 Sources
- Lystad RP, Gregory K, Wilson J 2014. The epidemiology of injuries in mixed martial arts: a systematic review and meta-analysis. Orthopaedic Journal of Sports Medicine.
- Lenetsky S, Harris N 2012. The mixed martial arts athlete: a physiological profile. Strength and Conditioning Journal.
- Tack C 2013. Evidence-based guidelines for strength and conditioning in mixed martial arts. Strength and Conditioning Journal.
- Del Vecchio FB, Hirata SM, Franchini E 2011. A review of time-motion analysis and combat development in mixed martial arts matches at regional level tournaments. Perceptual and Motor Skills.
- Matthews JJ et al. 2019. Extreme rapid weight loss and rapid weight gain observed in UK mixed martial arts athletes preparing for competition. IJSNEM.
- James et al. 2016 (see boxing).

---

## 3. Brazilian jiu-jitsu (BJJ)

### 3.1 Encoding block
- `id`: `bjj`. `q`: `{maxStrength:3, power:2, rotational:2, unilateral:1, upperPull:3, upperPush:2, lowerBody:3, grip:3, neck:3, trunk:3, mass:0}` (unchanged).
- `prehab`: `["neck","fingers","shoulderER","lowback","copenhagen"]` (fingers here = grip endurance, not hangboard). `season`: `{off:3, pre:2, in:2}`. `avoidBefore: "all"`. `confidence`: limited.

### 3.2 Demands and energy systems
- IBJJF adult match lengths: white 5 min, blue 6, purple 7, brown 8, black 10. Tournaments: several matches in one day.
- Intermittent: periods of high-intensity effort (passes, sweeps, submissions, escapes) within long isometric and strength-endurance holds; strong aerobic contribution, with grip and upper-body strength endurance the classic limiter (Andreato et al. 2017).
- Maximal isometric strength (grips, frames, squeezes) and hip extension strength matter more than explosive power.

### 3.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Elbow (armbar hyperextension); the most common orthopaedic competition injury in one large competition sample (Scoggin et al. 2014) | Tap early (education), elbow flexor and triceps strength, no prehab can stop a locked armbar. |
| Knee (heel hooks, guard passing, wrestling-up): ACL, MCL, meniscus | LAND, unilateral and hamstring strength, COPEN for adductors. |
| Shoulder (kimura, americana, posting) | CUFF, SCAP, pulling volume. |
| Neck (stacking, guillotines, cranks) | NECK-1 including flexion. |
| Fingers and hands (gi grips): sprains, arthritis | Buddy tape, FINGER (grapplers), grip variety, extensor work (rubber band finger extensions 2 x 25). |
| Low back | Hinge strength, BACK. |
| Skin infections | Hygiene; not training-related. |

### 3.4 Fitting the gym around BJJ
- Hobbyists: 3-5 classes a week; competitors 6-10. Gym 2-3x. Place gym on drilling or lighter days, never directly before the hardest open-mat day.
- Grip-heavy gym work is limited when grip is fried from gi training: if the athlete rolled hard in the gi that day, swap pull-ups for lat pulldown with straps (coach practice).
- Weight-making: IBJJF weighs in immediately before the first match, in the gi; acute dehydration is pointless and dangerous. App: no acute cut.

### 3.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Off | 3 | Max strength, hypertrophy if moving up, grip strength |
| Pre (4-8 weeks before a tournament) | 2 | Strength maintained, strength endurance, match-length conditioning |
| In (frequent tournaments) | 2 | Maintain |
| Peak | 1 | Primer |

### 3.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Kettlebell swing `kbswing` / box jump `boxjp` | 4 x 6 / 3 x 4 | 3 x 6 | 2 x 6 |
| Main | Deadlift `deadlift` or trap bar `trapdl` | 4 x 4-5 @ 80-85% | 3 x 3 @ 85% | 2 x 3 @ 85% |
| Main 2 | Towel or gi pull-up `towelpull` / `pullup` | 4 x 5-6 | 3 x max-2 | 3 x 5 |
| Accessory | Front squat or goblet `frontsq` / `goblet` | 3 x 6 | 3 x 5 | 2 x 5 |
| Prehab | NECK-1 + FINGER (hangs 3 x 20-40 s) | | | |
| Core | Hanging knee raise `hangleg` | 3 x 10 | 3 x 10 | 2 x 10 |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | Back squat `squat` | 4 x 5 @ 80% | 3 x 4 @ 82% | 2-3 x 3 |
| Main 2 | Bench `bench` or floor press `dbfloor` | 3 x 5-6 | 3 x 5 | 2 x 5 |
| Accessory | Row `bbrow` / `dbrow` | 4 x 8 | 3 x 8 | 2 x 8 |
| Accessory | Hip thrust `hipthrust` | 3 x 8 | 3 x 8 | 2 x 8 |
| Grip | Farmers carry `farmers`, or towel deadhang | 3 x 40 m | 3 x 30 m | 2 x 30 m |
| Prehab | CUFF + COPEN + BACK | | | |

Day C (off): Turkish get-up `turkishgu` 3 x 2 each, single-leg RDL, landmine press, sled, neck.

### 3.7 Sport-specific conditioning
- Usually covered by rolling. Add only when the athlete rolls hard fewer than 3x a week.
- **Match simulation**: rounds equal to belt match length (5-10 min), 1-2 min rest, 4-6 rounds; vary the partner or add "shark tank" (fresh partner each minute) in the last 3 weeks.
- **Gym version**: 6 min rounds alternating 20 s sled push/rope pull/airbike with 40 s grip holds or kettlebell carries; 3-4 rounds, 2 min rest.
- **Aerobic**: 1-2 x 30-40 min zone 2 in the off-season.

### 3.8 Testing benchmarks
| Test | Good amateur | Competitive / elite |
|---|---|---|
| Deadlift 1RM | 1.75 x BM | 2.25 x |
| Squat 1RM | 1.4 x | 1.75 x |
| Gi or towel hang, max time | 40 s | 70 s+ |
| Pull-ups | 10 | 18+ |
| Handgrip dynamometer | track per hand | elite BJJ often 50-60 kg (men) |

### 3.9 Peaking
- 1-2 weeks: drop gym to 1 short session (2 x 3 at 80% on one lower and one upper lift, jumps, neck). Last hard rolls 5-7 days out (coach practice).

### 3.10 Sources
- Andreato LV et al. 2017. Physical and physiological profiles of Brazilian jiu-jitsu athletes: a systematic review. Sports Medicine Open 3(1).
- Scoggin JF et al. 2014. Assessment of injuries during Brazilian jiu-jitsu competition. Orthopaedic Journal of Sports Medicine.
- Petrisor BA et al. 2019. Injury in Brazilian jiu-jitsu training. Sports Health.
- James et al. 2016 (see boxing).

---

## 4. Judo

### 4.1 Encoding block
- `id`: `judo`. `q`: `{maxStrength:3, power:3, rotational:3, unilateral:2, upperPull:3, upperPush:2, lowerBody:3, grip:3, neck:2, trunk:3, mass:0}`.
- `prehab`: `["neck","shoulderER","fingers","lowback","landing"]` (landing to cover knee in throws). `season`: `{off:3, pre:2, in:2}`. `avoidBefore: "all"`. `confidence`: moderate.

### 4.2 Demands and energy systems
- Contests: 4 min (seniors), unlimited golden score. Effort:pause about 20-30 s : about 10 s within a contest (Franchini et al. 2011). Several contests per day.
- High-power throws (hip and trunk rotation, pulling), very high grip demands (kumikata), strong aerobic base to repeat efforts and recover between contests.
- Upper-body pulling power and grip strength-endurance distinguish elite judoka.

### 4.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Shoulder (falls, being thrown, AC joint) | Ukemi (break-fall) mastery is the main prevention; CUFF, SCAP. |
| Knee (ACL, MCL in throws and when resisting) | LAND, unilateral strength, NORDIC off-season. |
| Fingers and hand (gripping the gi) | FINGER (grapplers), taping, extensor work. |
| Elbow (armlocks) | Tap early; elbow strength. |
| Neck (falls on head, head-diving defence) | NECK-1; rules forbid head diving. |
| Low back | BACK, hinge strength. |
Review of judo injuries: shoulder, knee, elbow and fingers most frequent (Pocecco et al. 2013).

### 4.4 Fitting the gym around judo
- Competitive amateur: 4-6 judo sessions a week (uchikomi, nage-komi, randori). Gym 2-3x.
- Randori is the high-load day: lift heavy after randori or on technical days, never the day before hard randori.
- Weight-making: IJF weighs in the evening before; random weigh-in on the morning of competition limits loss to 5% above category. App policy 0.7 still applies to amateurs.

### 4.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Off (8-12 weeks) | 3 | Max strength, pulling strength, grip, aerobic base |
| Pre (6-8 weeks) | 2-3 | Strength to power: Olympic lift variants, throws |
| In | 2 | Maintain |
| Peak | 1 | Primer |

### 4.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Hang power clean `hangclean` | 4 x 3 @ 70-75% | 5 x 2 @ 80% | 3 x 2 @ 75% |
| Main | Back squat `squat` | 4 x 5 @ 80% | 3 x 3 @ 85-87% | 2-3 x 3 @ 85% |
| Main 2 | Weighted pull-up / gi pull-up `towelpull` | 4 x 5 | 4 x 3-4 | 3 x 4 |
| Accessory | Split squat `bss` | 3 x 8 | 3 x 6 | 2 x 6 |
| Prehab | NECK-1 + FINGER | | | |
| Core | Landmine rotation `landrot` | 3 x 6 each | 3 x 5 each fast | 2 x 5 |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Rotational med ball throw `mbrot` | 3 x 5 each | 4 x 4 each | 3 x 3 |
| Main | Deadlift `deadlift` / RDL `rdl` | 4 x 4 @ 85% | 3 x 3 @ 85% | 2 x 3 |
| Main 2 | Bench pull or barbell row `bbrow` | 4 x 6 | 4 x 5 explosive | 3 x 5 |
| Accessory | Push press `pushpress` / DB bench | 3 x 5 | 3 x 3 | 2 x 3 |
| Grip | Gi-towel hang + farmers | 3 x 30-45 s | 3 x 30 s | 2 x 30 s |
| Prehab | CUFF + LAND | | | |

### 4.7 Sport-specific conditioning
- **Off**: 2 x 30-40 min zone 2; 1 x 4-5 x 4 min tempo.
- **Pre**: judo-specific intervals on the mat or band: 20-30 s all-out uchikomi/band pulls, 10-15 s rest, x 8-10 (one "contest"), 3-4 sets with 3 min rest. This mirrors the 2:1 to 3:1 effort:pause structure.
- **Special Judo Fitness Test (SJFT)** can double as training once a week in the last 4 weeks.

### 4.8 Testing benchmarks
| Test | Benchmark |
|---|---|
| Special Judo Fitness Test index (throws and heart rate) | Classification table for senior men: excellent about 11.7 or lower, good about 11.7-13.0, regular 13.0-13.9, poor above about 13.9 (Franchini et al. 2009). Lower is better. |
| Squat 1RM | 1.5 x BM (good amateur), 1.8-2.0 x (elite) |
| Power clean 1RM | 1.0 x / 1.3 x |
| Pull-ups max | 12 / 20 |
| Judogi grip strength test (max hang time) | 40 s / 60 s+ |

### 4.9 Peaking
- 10-day taper: last heavy session 7-10 days out, one primer 3-4 days out (clean 3 x 1 @ 75%, med ball 2 x 3, gi pull-up 2 x 3). Uchikomi stays sharp but short.

### 4.10 Sources
- Franchini E, Del Vecchio FB, Matsushigue KA, Artioli GG 2011. Physiological profiles of elite judo athletes. Sports Medicine 41(2).
- Franchini E, Del Vecchio FB, Sterkowicz S 2009. A special judo fitness test classificatory table. Archives of Budo.
- Pocecco E et al. 2013. Injuries in judo: a systematic literature review including suggestions for prevention. BJSM 47(18).

---

## 5. Wrestling (freestyle, Greco-Roman, folkstyle)

### 5.1 Encoding block
- `id`: `wrestling`. `q`: `{maxStrength:3, power:3, rotational:2, unilateral:2, upperPull:3, upperPush:2, lowerBody:3, grip:3, neck:3, trunk:3, mass:0}`.
- `prehab`: `["neck","shoulderER","lowback","landing","copenhagen"]`. `season`: `{off:3, pre:2, in:2}`. `avoidBefore: "all"`. `confidence`: moderate.

### 5.2 Demands and energy systems
- UWW senior bouts: 2 x 3 min, 30 s break. Folkstyle (US college): 3 periods (3-2-2 min). Several bouts per day at tournaments.
- Very high glycolytic demand (lactate commonly very high post-bout), repeated explosive efforts (shots, lifts, throws in Greco), isometric strength (hand fighting, clinch), strong aerobic base for recovery between bouts (Chaabene et al. 2017).
- Maximal strength and power relative to body mass are key; Greco-Roman emphasises upper-body pulling and lifting.

### 5.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Knee (most common in NCAA data; MCL, meniscus, ACL) (Agel et al. 2007) | LAND, unilateral strength, NORDIC off-season. |
| Shoulder (dislocations, AC, cuff) | CUFF, SCAP, pulling strength. |
| Head/face and neck (takedowns, concussion, "stingers") | NECK-1 high priority (3x per week), including flexion. |
| Low back | BACK, hinge strength. |
| Ankle | ANKLE. |
| Skin infections, cauliflower ear | Hygiene, headgear. |

### 5.4 Fitting the gym around wrestling
- Wrestlers often practise 6-10x a week in season. Gym 2x in season (short, heavy), 3x off-season.
- Lift after practice on the hardest day so the next day can be lighter. Avoid heavy lower-body before live wrestling days.
- Weight-making: wrestling has a long culture of extreme cuts. Folkstyle uses hydration testing and descent plans in the US. App policy 0.7.

### 5.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Off (summer) | 3 | Max strength (heavy compounds), hypertrophy if moving up |
| Pre (6-8 weeks) | 2-3 | Strength to power, wrestling-specific conditioning |
| In | 2 | Maintain heavy strength and neck |
| Peak (championship) | 1 | Primer |

### 5.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Hang power clean `hangclean` | 4 x 3 @ 75% | 5 x 2 @ 80% | 3 x 2 @ 75-80% |
| Main | Back squat `squat` / front squat | 4 x 5 @ 80-85% | 4 x 3 @ 85% | 3 x 3 @ 85% |
| Main 2 | Weighted pull-up / rope or towel pull-up | 4 x 5 | 4 x 4 | 3 x 4 |
| Accessory | Split squat `bss` / step-up | 3 x 8 | 3 x 6 | 2 x 6 |
| Prehab | NECK-1 (all 4 directions) + COPEN | | | |
| Core | Ab wheel `abwheel` | 3 x 10 | 3 x 8 | 2 x 8 |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Med ball overhead backward throw `mbovh` / slam `mbslam` | 4 x 4 | 4 x 3 | 3 x 3 |
| Main | Deadlift `deadlift` / trap bar | 4 x 4 @ 85% | 3 x 3 @ 85% | 2 x 3 |
| Main 2 | Bench `bench` | 4 x 5 | 3 x 4 | 3 x 3 |
| Accessory | Row `bbrow` | 4 x 8 | 3 x 6 | 2 x 6 |
| Grip | Farmers / sandbag carry | 3 x 40 m | 3 x 30 m | 2 x 30 m |
| Prehab | CUFF + BACK + LAND | | | |

### 5.7 Sport-specific conditioning
- **Pre**: bout simulation: 2 x 3 min with 30 s break, then 3-5 min rest, repeat 3-4 times (tournament style). In each 3 min: 3 x (10 s max shots or sprawls, 50 s live or hard drilling) (coach practice).
- **Gym or field version**: sled push 6 x 20 m, 30 s rest, 3 sets; hill sprints 8-10 x 10-15 s.
- **Off**: aerobic base 2 x 30-40 min.

### 5.8 Testing benchmarks
| Test | Good amateur | Elite |
|---|---|---|
| Squat 1RM | 1.6 x BM | 2.0 x+ |
| Power clean 1RM | 1.1 x | 1.3-1.5 x |
| Bench 1RM | 1.1 x | 1.4 x |
| Pull-ups max | 15 | 25+ |
| CMJ | 45 cm | 55 cm |
| 30-15 IFT | track | |

### 5.9 Peaking
- Last heavy lift 7-10 days out, primer 3-4 days out (2-3 x 2 at 75-80% clean, 2 x 3 jumps, neck isometrics). Live wrestling volume cut 40-60% in the final week, intensity kept short and sharp (coach practice; Bosquet 2007 principle).

### 5.10 Sources
- Chaabene H et al. 2017. Physical and physiological attributes of wrestlers: an update. JSCR 31(5).
- Agel J et al. 2007. Descriptive epidemiology of collegiate men's wrestling injuries: National Collegiate Athletic Association Injury Surveillance System, 1988-1989 through 2003-2004. Journal of Athletic Training 42(2).
- Hrysomallis 2016 (neck).

---

## 6. Muay Thai and kickboxing

### 6.1 Encoding block
- `id`: `kickboxing`. `q`: `{maxStrength:2, power:3, rotational:3, unilateral:3, upperPull:2, upperPush:2, lowerBody:3, grip:2, neck:3, trunk:3, mass:0}` (unchanged; grip 2 reflects the Muay Thai clinch).
- `prehab`: `["neck","hipAbd","ankle","shoulderER","copenhagen","calf"]`. Shin toughness comes from graded bag work, not gym exercises; `calf` covers the ball-of-foot stance.
- `season`: `{off:3, pre:2, in:1}`. `avoidBefore: "all"`. `confidence`: limited.

### 6.2 Demands and energy systems
- Professional Muay Thai: 5 x 3 min, 2 min rest. Amateur (IFMA): 3 x 3 min (or 3 x 2 min), 1 min rest. K-1 style kickboxing: 3 x 3 min, 1 min rest.
- Repeated explosive strikes (kicks, knees, punches, elbows) and clinch work (isometric pulling, neck and grip). High aerobic and glycolytic demand.
- Kick power: single-leg stance strength, hip rotation, trunk. Clinch: neck, upper back, grip.

### 6.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Lower limb soft tissue (shin contusions, foot and ankle sprains): most common in amateurs (Gartland et al. 2001) | ANKLE, CALF, shin guards in sparring, gradual bag conditioning. |
| Head (more common in professionals) | NECK-1 (clinch also loads the neck). |
| Hip and groin (high kicks, teeps) | COPEN, HIPABD, hip mobility. |
| Shoulder | CUFF. |
| Wrist and hand | WRIST, wrapping. |

### 6.4 Fitting the gym around Muay Thai
- Typical amateur: 3-6 sessions a week. Gym 2-3x off, 2x in camp. Gym on pad/technical days; nothing heavy the day before sparring.
- Weight-making: same policy 0.7. Many amateur shows weigh in on the day.

### 6.5 Season structure
As boxing (1.5), with camp 6-8 weeks.

### 6.6 Session templates
Day A (kicks: single-leg and hip)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Lateral bound `latbound` / single-leg box jump | 3 x 4 each | 4 x 3 each | 3 x 3 each |
| Power 2 | Rotational med ball throw `mbrot` | 3 x 5 each | 4 x 4 each | 3 x 3 |
| Main | Trap bar deadlift `trapdl` | 4 x 5 @ 80% | 3 x 3 @ 85% | 2 x 3 |
| Accessory | Bulgarian split squat `bss` | 3 x 8 each | 3 x 6 each | 2 x 6 |
| Accessory | Single-leg RDL `singlerdl` | 3 x 8 | 2 x 8 | 2 x 6 |
| Prehab | COPEN + ANKLE + CALF | | | |
| Core | Pallof press `pallof` | 3 x 10 each | 3 x 8 | 2 x 8 |

Day B (clinch and upper)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Med ball chest pass / push press | 3 x 5 | 4 x 3 | 3 x 3 |
| Main | Front squat `frontsq` / goblet | 4 x 5 @ 80% | 3 x 4 @ 82% | 2 x 3 |
| Main 2 | Pull-up `pullup` | 4 x 6 | 3 x 5 | 3 x 5 |
| Accessory | Row `csdb` | 3 x 10 | 3 x 8 | 2 x 8 |
| Grip/clinch | Farmers carry, plate pinch | 3 x 30 m | 2 x 30 m | 2 x 30 m |
| Prehab | NECK-1 + CUFF | | | |

### 6.7 Sport-specific conditioning
- **Round simulation**: match pro (5 x 3, 2 min rest) or amateur format (3 x 3, 1 min). Bag or pads: 10 s flurry every 30 s, kicks-only round, clinch-knee round.
- **Off**: 2 x 30-45 min zone 2 running (traditional Thai camps run long distances daily; keep it, but mostly easy).
- **Repeated sprint**: 2 x 8 x 8 s airbike/hill sprint, 30 s rest.

### 6.8 Testing benchmarks
| Test | Good amateur | Elite |
|---|---|---|
| CMJ | 40 cm | 50 cm |
| Single-leg CMJ asymmetry | under 10-15% (coach practice) | under 10% |
| Trap bar 1RM | 1.75 x | 2.0 x |
| Pull-ups | 10 | 15+ |
| Yo-Yo IR1 or 30-15 IFT | track | |

### 6.9 Peaking
As boxing (1.9).

### 6.10 Sources
- Gartland S, Malik MHA, Lovell ME 2001. Injury and injury rates in Muay Thai kick boxing. BJSM 35(5).
- Crisafulli A et al. 2009. Physiological responses and energy cost during a simulation of a Muay Thai boxing match. Applied Physiology, Nutrition, and Metabolism.
- James et al. 2016; Hrysomallis 2016.


---

# PART B: CLIMBING, GOLF, SWIMMING, CYCLING

## 7. Rock climbing and bouldering

### 7.1 Encoding block
- `id`: `climbing`. `q`: `{maxStrength:2, power:2, rotational:1, unilateral:2, upperPull:3, upperPush:2, lowerBody:1, grip:3, neck:0, trunk:3, mass:0}` (unchanged).
- `prehab`: `["fingers","shoulderER","wrist","scap"]` plus antagonist pushing (encoded through `push`/`ohp` slots). Proposed new key `elbow` (eccentric wrist extensor and flexor loading for climber's elbow).
- `season`: `{off:3, pre:2, in:2}` (gym sessions are strength and antagonist sessions; finger training is separate, see 7.6). `avoidBefore: "upper"`. `confidence`: moderate.
- Hard safety gates (encode as rules): no hangboard under 16 years old; no hangboard before roughly 18-24 months of regular climbing (coach practice); no campus board unless advanced (see 7.3).

### 7.2 Demands and energy systems
- Bouldering: short problems (4-12 moves, under about 1 min), near-maximal finger and upper-body force, high-power dynamic moves; alactic and strength-dominant with long rests.
- Sport and trad routes: 2-10 min of intermittent isometric forearm contractions; forearm oxidative capacity and finger-flexor critical force are major determinants, with local glycolytic demand on cruxes.
- Finger strength relative to body mass is the strongest physical predictor of climbing grade; upper-body pulling strength, core tension and hip mobility follow (Baláš et al. 2012). Low body mass helps, but chasing it raises Relative Energy Deficiency risk (Mountjoy et al. 2023).

### 7.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Finger pulley strain or rupture (A2/A4), the most common climbing-specific injury | Progressive finger loading, open-hand and half-crimp training rather than full crimp under load, never hangboard when fingers are cold or already fatigued, add load slowly (7.6). |
| Epiphyseal (growth plate) stress fractures of the fingers in adolescents | No intensive finger training under 16 (BMC guidance); no campus board for youths. |
| Shoulder (SLAP, impingement, cuff) increasingly common with modern bouldering | CUFF, SCAP, antagonist pushing (push-ups, overhead press), controlled dynamic moves. |
| Elbow (medial and lateral epicondylalgia, "climber's elbow"; brachialis) | WRIST plus eccentric wrist extension/flexion (`flexbar`), reverse curls, managing pull-up volume. |
| Wrist (TFCC, from slopers and underclings) | WRIST. |
| Lower limb from bouldering falls (ankle fractures and sprains) | Landing technique on pads, ANKLE, LAND. |
Review of climbing injury and fatality data: Schöffl et al. 2010.

### 7.4 Fitting the gym around climbing
- Climbing itself is the main specific stimulus. A typical keen amateur climbs 2-4x a week.
- Weekly priority order (coach practice): climbing quality first, then finger strength, then general strength and antagonist work, then conditioning.
- Put hangboarding at the start of a climbing session after a full warm-up, or as its own short session; never after a hard climbing session.
- Gym strength sessions can follow an easy climbing session or sit on a non-climbing day. Avoid heavy pulling the day before a project or performance day (`avoidBefore: "upper"`).
- Lower-body strength matters less, but keep one lower-body pattern (single-leg) for high steps and heel hooks, plus hip mobility (frog, deep lunge).

### 7.5 Season structure
Climbers are rarely seasonal in a fixed calendar; phases follow trips, projects and competitions.
| Phase | Weeks | Gym (strength) | Finger sessions | Focus |
|---|---|---|---|---|
| Base / off | 4-8 | 2-3 | 2 (strength) | Max finger strength, max pulling strength, antagonists, hypertrophy only for weak links |
| Power (`pre`) | 3-4 | 2 | 1-2 | Limit bouldering, campus (advanced), explosive pulling |
| Power endurance / performance (`in`) | 3-6 | 1-2 | 1 (maintenance) | Route-specific intervals, performance climbing |
| Taper before a trip or comp | 1 | 1 short | 1 short | Volume down 40-50% |
| Rest | 1-2 | 0-1 | 0 | Easy climbing, mobility |

### 7.6 Session templates
**Finger strength session (hangboard), only when the safety gates are passed**
| Protocol | Detail | Sets x reps | Rest |
|---|---|---|---|
| Warm-up | 10 min general, then progressive hangs on large edges, 5-8 hangs at 30-80% effort | | |
| Max hangs (López-Rivera "MaxHangs") | 18-22 mm edge, half-crimp and/or open hand (3 or 4 finger drag), 10 s hangs with added load chosen so that about 3 s are left in reserve | 3-5 sets x 1 hang per grip | 3 min |
| Min-edge (alternative) | Bodyweight on the smallest edge you can hold for 10 s with 3 s in reserve | 3-5 x 10 s | 3 min |
| Repeaters (strength endurance, `in` phase) | 7 s on, 3 s off x 6 = one set, at about 60-80% of max-hang load | 3-6 sets | 3 min |
| No-hang lifts (new to fingerboarding or returning) | Lift a loaded block or pin with one hand off the floor using a 20 mm edge, 10 s pulls | 3-5 x 10 s each hand | 2 min |
Rules: 2 finger sessions per week maximum, 48 h apart; 4-8 week blocks; add no more than about 2 kg or 2-5% of body mass per week (coach practice); stop the session at any sharp finger pain; never full crimp under maximal load; no one-arm hangs below advanced. Max hangs on a deeper (18 mm) edge improved finger strength more than a smaller edge in elite climbers (López-Rivera and González-Badillo 2012); a fingerboard block improved grip strength and endurance in competitive boulderers (Medernach et al. 2015).

**Campus board** (advanced only: at least about V7/7b+ bouldering, 2+ years of hangboard training, adult, no current finger issues): 1-2x per week in the power phase, 4-6 sets of ladders or bumps, 3 min rest, stop at any loss of speed (coach practice).

Strength Day A (pull and antagonist)
| Slot | Exercise (key) | Off / base | Pre / power | In / performance |
|---|---|---|---|---|
| Power | Explosive pull-up or med ball overhead slam `mbslam` | 4 x 3 | 5 x 2 explosive | 3 x 2 |
| Main | Weighted pull-up `pullup` | 4 x 4-5 @ 85% | 4 x 3 @ 87-90% | 3 x 3 |
| Main 2 | Overhead press `ohp` / `bbohp` (antagonist) | 3 x 6-8 | 3 x 6 | 2 x 6 |
| Accessory | One-arm row `dbrow` | 3 x 8 | 3 x 6 | 2 x 8 |
| Prehab | CUFF + SCAP + WRIST (incl. `flexbar` eccentrics 3 x 15) | | | |
| Core | Hanging knee raise / toes-to-bar `hangleg` / `t2b` | 3 x 8-10 | 3 x 8 | 2 x 8 |

Strength Day B (lower, push, trunk)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Box jump `boxjp` | 3 x 4 | 3 x 3 | 2 x 3 |
| Main | Single-leg: step-up or Bulgarian split squat | 3 x 6-8 each | 3 x 6 | 2 x 6 |
| Main 2 | Push-up (weighted) or DB bench `pushup` / `flatdb` | 3 x 8-12 | 3 x 8 | 2 x 10 |
| Accessory | RDL `rdl` | 3 x 6-8 | 2 x 6 | 2 x 6 |
| Accessory | Front lever progression or ab wheel `abwheel` | 3 x 6-10 | 3 x 6 | 2 x 6 |
| Prehab | Reverse wrist curl, face pull `facepull`, hip mobility (frog, 90/90) | 2 x 15 | | |

### 7.7 Sport-specific conditioning
- **Route power endurance (`in`)**: 4 x 4s: four boulder problems (or circuits) back-to-back, 4 rounds, 4 min rest, at about 3-4 grades below max (coach practice).
- **Aerobic capacity of the forearms (ARC)**: 20-30 min continuous easy climbing with a pump no higher than 3/10, 1-2x per week in base phases (coach practice).
- **Intervals**: route laps: 1 route of 2-3 min at a hard but sub-limit grade, rest equal to climb time, 4-6 reps.
- **General aerobic**: 1-2 x 30 min easy (bike, run, row) helps recovery and is the base for long multi-pitch days.

### 7.8 Testing benchmarks
| Test | Benchmark (coach practice and practitioner data, not peer reviewed unless cited) |
|---|---|
| Max hang, 20 mm edge, half-crimp, 10 s, total load as % body mass | Roughly 100-115% around V3-V4 / 6b-6c; 125-145% around V6-V7 / 7a+-7b+; 150-165% around V8-V9; 170%+ for V10+. Track your own trend; these are broad bands. |
| Weighted pull-up 1RM, total load as % body mass | 140% intermediate; 160%+ advanced |
| Max pull-ups | 12-15 intermediate; 20+ advanced |
| Finger flexor critical force (all-out 7:3 test) | Track; relates to route performance (Giles et al. 2019) |
| Push-up max (antagonist check) | 25+ |
| Shoulder ER:IR strength ratio | At least about 0.66 |

### 7.9 Peaking
- For a trip or competition: final hard finger session 5-7 days out, last limit climbing 3-4 days out, then 1-2 days of rest or easy movement. Volume falls by about half in the final week; intensity on a few hard moves stays (coach practice).

### 7.10 Sources
- López-Rivera E, González-Badillo JJ 2012. The effects of two maximum grip strength training methods using the same effort duration and different edge depth on grip endurance in elite climbers. Sports Technology 5(3-4).
- Medernach JP, Kleinöder H, Lötzerich HH 2015. Fingerboard in competitive bouldering: training effects on grip strength and endurance. JSCR 29(8).
- Baláš J, Pecha O, Martin AJ, Cochrane D 2012. Hand-arm strength and endurance as predictors of climbing performance. European Journal of Sport Science 12(1).
- Giles D et al. 2019. An all-out test to determine finger flexor critical force in rock climbers. IJSPP.
- Schöffl V, Morrison A, Schwarz U, Schöffl I, Küpper T 2010. Evaluation of injury and fatality risk in rock and ice climbing. Sports Medicine 40(8).
- Morrison AB, Schöffl VR 2007. Physiological responses to rock climbing in young climbers. BJSM 41(12). https://bjsm.bmj.com/content/41/12/852
- British Mountaineering Council. Training issues and under 16s ("Climbers under 16 should not undertake intensive finger strength training"). https://www.thebmc.co.uk/training-issues-and-under-16s
- Mountjoy M et al. 2023. IOC consensus statement on Relative Energy Deficiency in Sport (REDs). BJSM.

---

## 8. Golf

### 8.1 Encoding block
- `id`: `golf`. `q`: `{maxStrength:2, power:3, rotational:3, unilateral:2, upperPull:1, upperPush:1, lowerBody:2, grip:2, neck:0, trunk:3, mass:1}` (raise `maxStrength` 1 to 2 and `power` 2 to 3: strength and power training raise clubhead speed).
- `prehab`: `["lowback","hipRot","tspine","shoulderER","wrist"]` (new keys `hipRot`, `tspine`). `season`: `{off:3, pre:2, in:1}` (was off 2). `avoidBefore: null` (keep heavy legs 48 h before a tournament round as a soft rule). `confidence`: moderate.

### 8.2 Demands and energy systems
- Swing: about 1-2 s of near-maximal, highly coordinated rotational power. Clubhead speed depends on ground reaction forces, hip-to-thorax separation and sequencing. Clubhead speed in skilled golfers relates to vertical jump and isometric mid-thigh pull force (Wells et al. 2018).
- Round: 4-5 h, 8-10 km walking, low aerobic intensity; fatigue and focus late in the round. Aerobic fitness supports health and consistency (Murray et al. 2017 scoping review: golf and health).
- Strength and power training programmes improve clubhead speed and driving distance (Ehlert 2020 systematic review; Lephart et al. 2007).

### 8.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Low back pain (the most common golf complaint) | Hip rotation mobility (HIPROT), thoracic rotation (TSPINE), anti-rotation and anti-extension core, hinge strength, warm-up before play (McHardy et al. 2006). |
| Elbow (medial in amateurs, lateral too) | Grip and forearm strength, WRIST, eccentric wrist work, technique. |
| Lead wrist (TFCC, tendon) | WRIST, avoiding excessive range-ball volume from mats. |
| Lead shoulder | CUFF, SCAP. |
| Lead hip (labral, impingement) | HIPROT; flag pain for medical review. |

### 8.4 Fitting the gym around golf
- Golf practice is low fatigue. Gym 2-3x off-season, 1-2x in season.
- Avoid heavy lower-body work within 48 h of a competitive round (coach practice). The day before a round: mobility and a short speed primer only.
- **Speed training** (overspeed with lighter and heavier sticks, e.g. SuperSpeed style): 3x per week, about 10-15 min, for 6-8 weeks; widely used, small trial base (coach practice). Can be added before a gym session.

### 8.5 Season structure (UK)
| Phase | Months | Gym | Focus |
|---|---|---|---|
| Off | Nov-Feb | 3 | Strength, mobility, hypertrophy where weak |
| Pre | Mar-Apr | 2 | Power: rotational throws, jumps, speed training |
| In | May-Oct | 1-2 | Maintain strength and power; mobility daily |
| Peak (major event) | 1 week | 1 short | Primer |

### 8.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Rotational med ball throw `mbrot` (2-4 kg), scoop toss `mbscoop` | 3 x 5 each side | 4 x 4 each side, max intent | 3 x 3 each side |
| Power 2 | CMJ `cmj` / broad jump | 3 x 4 | 4 x 3 | 2 x 3 |
| Main | Trap bar deadlift `trapdl` | 4 x 5 @ 75-80% | 3 x 3 @ 85% | 2 x 3 @ 80% |
| Accessory | Split squat `bss` | 3 x 8 | 3 x 6 | 2 x 6 |
| Accessory | One-arm row `dbrow` | 3 x 10 | 3 x 8 | 2 x 8 |
| Prehab | HIPROT + TSPINE | 2 x 8 each | | |
| Core | Pallof press `pallof` / cable woodchop `woodchop` | 3 x 10 each | 3 x 8 fast chop | 2 x 8 |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Med ball chest pass / landmine rotational press | 3 x 5 | 4 x 4 | 2 x 4 |
| Main | Goblet or front squat `goblet` / `frontsq` | 4 x 6 | 3 x 4 | 2 x 5 |
| Main 2 | DB bench `flatdb` or push-up | 3 x 8 | 3 x 6 | 2 x 8 |
| Accessory | Single-leg RDL `singlerdl` | 3 x 8 | 3 x 6 | 2 x 6 |
| Accessory | Pull-up / pulldown | 3 x 8 | 3 x 6 | 2 x 8 |
| Prehab | CUFF + WRIST | | | |
| Core | Side plank `sideplank`, dead bug | 3 x 30-40 s | | |

Day C (off): hip thrust, lateral lunges, landmine rotation, farmers carry, mobility circuit.

### 8.7 Sport-specific conditioning
- Health-driven: meet 150-300 min moderate aerobic activity per week (walking the course counts). 1-2 x 30 min zone 2 on non-golf days.
- No glycolytic conditioning needed for performance.

### 8.8 Testing benchmarks
| Test | Benchmark |
|---|---|
| Driver clubhead speed (launch monitor) | Approximate: average male amateur about 90-95 mph; scratch about 105-110 mph; male tour average about 115+ mph; average female amateur about 70-80 mph; women's tour about 94-96 mph (launch-monitor industry data, not peer reviewed) |
| Rotational med ball throw (3 kg) distance, each side | Within 10% left-right (coach practice) |
| CMJ | 40 cm men / 30 cm women as a good amateur target |
| Trap bar deadlift 1RM | 1.5 x BM |
| Screen: pelvic rotation, seated trunk rotation (about 45 degrees each way), 90/90 hip IR (about 35-45 degrees), deep squat, toe touch | TPI-style screen (coach practice) |

### 8.9 Peaking
- Week of a key event: one gym session early in the week (power 3 x 3, one lift 2 x 3 at 75%), daily mobility, 15-20 min dynamic warm-up before every round.

### 8.10 Sources
- Ehlert A 2020. The effects of strength and conditioning interventions on golf performance: a systematic review. Journal of Sports Sciences 38(23). https://lida.sport-iat.de/ta/Record/4068865
- Wells JET, Mitchell ACS, Charalambous LH, Fletcher IM 2018. Relationships between highly skilled golfers' clubhead velocity and force producing capabilities during vertical jumps and an isometric mid-thigh pull. Journal of Sports Sciences 36(16).
- Lephart SM et al. 2007. An eight-week golf-specific exercise program improves physical characteristics, swing mechanics, and golf performance in recreational golfers. JSCR 21(3).
- McHardy A, Pollard H, Luo K 2006. Golf injuries: a review of the literature. Sports Medicine 36(2).
- Murray AD et al. 2017. The relationships between golf and health: a scoping review. BJSM 51(1).

---

## 9. Swimming (sprint and distance)

### 9.1 Encoding block
Two variants of `swimming` (proposed `event` field: `sprint` = 50-100 m, `distance` = 400 m-1500 m and open water; 200 m sits between).
- Sprint `q`: `{maxStrength:3, power:3, rotational:1, unilateral:1, upperPull:3, upperPush:2, lowerBody:3, grip:0, neck:0, trunk:3, mass:2}`.
- Distance `q`: `{maxStrength:2, power:1, rotational:1, unilateral:1, upperPull:3, upperPush:1, lowerBody:2, grip:0, neck:0, trunk:3, mass:0}`.
- `prehab`: `["shoulderER","scap","tspine","lowback","copenhagen"]` (Copenhagen for breaststrokers' adductors and knees). `season`: sprint `{off:3, pre:3, in:2}`, distance `{off:2, pre:2, in:1}`. `avoidBefore: "upper"`. `confidence`: moderate.

### 9.2 Demands and energy systems
- 50 m (about 21-30 s): alactic and glycolytic; start and turn power matter. 100 m (about 47-65 s): glycolytic dominant. 200 m: roughly balanced. 400-1500 m and open water: predominantly aerobic.
- Propulsion mainly from the upper body (lats, triceps, internal rotators) with legs critical for starts, turns and underwater kicking.
- Dryland strength training improves starts and turns and can help sprint performance, with weaker transfer to free swimming speed (Crowley et al. 2017 systematic review).

### 9.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Swimmer's shoulder (supraspinatus tendinopathy, impingement): the most common, linked to swim volume (Sein et al. 2010) | CUFF (ER strength), SCAP (serratus and lower trap), TSPINE, pectoralis minor mobility, monitoring weekly swim volume spikes. A 6-week shoulder and scapular programme improved strength in collegiate swimmers (Hibberd et al. 2012). |
| Breaststroker's knee (MCL stress) | COPEN and hip rotation mobility, limit breaststroke kick volume spikes. |
| Low back (butterfly, breaststroke extension) | Anti-extension core, BACK, hip flexor mobility. |
| Neck (breathing rotation) | Thoracic mobility. |

### 9.4 Fitting the gym around swimming
- Competitive swimmers: 6-10 pool sessions a week (often early mornings). Gym 2-3x, usually after a lighter swim or on the afternoon of a single-swim day.
- Avoid heavy upper-body pulling before high-volume pull sets or key quality sessions.
- Do not stack gym pulling volume on top of very high swim volume; count weekly lat/shoulder load across both.
- Distance swimmers: lift for robustness and kick/turn power, not muscle mass.

### 9.5 Season structure
Typically two or three macrocycles a year (short course winter, long course summer).
| Phase | Weeks | Gym (sprint / distance) | Focus |
|---|---|---|---|
| Off / general | 6-10 | 3 / 2 | Max strength, shoulder robustness, hypertrophy (sprint) |
| Pre / specific | 4-8 | 3 / 2 | Strength to power: jumps, med ball, band-resisted, start and turn power |
| In / competition | ongoing | 2 / 1 | Maintain |
| Taper | 2-3 weeks | 1-2 / 1 | Volume down, intensity kept |

### 9.6 Session templates
Day A (sprint swimmer, lower and start)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | CMJ `cmj` / box jump `boxjp` (start) | 3 x 4 | 4 x 3 + broad jump 3 x 3 | 3 x 3 |
| Main | Back squat or front squat `squat` / `frontsq` | 4 x 5 @ 80% | 4 x 3 @ 85% | 3 x 3 @ 80-85% |
| Main 2 | Weighted pull-up `pullup` | 4 x 5 | 4 x 4 | 3 x 4 |
| Accessory | RDL `rdl` | 3 x 6-8 | 3 x 5 | 2 x 5 |
| Prehab | CUFF + SCAP | 2-3 x 12-15 | | |
| Core | Ab wheel / hollow hold / `pallof` | 3 x 8-10 | 3 x 8 | 2 x 8 |

Day B (upper and trunk)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Med ball overhead slam `mbslam` / chest pass | 3 x 5 | 4 x 4 | 3 x 3 |
| Main | DB bench `flatdb` or landmine press | 3 x 6-8 | 3 x 5 | 2 x 6 |
| Main 2 | Chest-supported row `csdb` | 4 x 8 | 3 x 6 | 2 x 8 |
| Accessory | Straight-arm pulldown / cable pullover `pullover` | 3 x 10-12 | 3 x 10 | 2 x 10 |
| Accessory | Single-leg RDL / split squat | 3 x 8 | 2 x 8 | 2 x 6 |
| Prehab | TSPINE + COPEN + BACK | | | |

Distance swimmer: 2 sessions a week from Day A and B, power slot replaced by a second prehab or core exercise in-season, sets in the lower end, RIR 2-3; keep one heavy lower-body lift for turns and bone health.

### 9.7 Sport-specific conditioning
- Swimming supplies it. The gym adds nothing aerobic. Optional: dryland band pull circuits are low value; prefer more in-water quality.

### 9.8 Testing benchmarks
| Test | Sprint benchmark | Distance benchmark |
|---|---|---|
| CMJ | 45-55 cm men, 35-42 cm women (competitive; coach practice) | track |
| Pull-ups max | 15 men / 8 women | 12 / 6 |
| Back squat 1RM | 1.5-1.75 x BM | 1.25 x |
| Shoulder ER:IR strength ratio | At least about 0.66 (low ratios are common in swimmers) | same |
| Start: time to 15 m | track | track |

### 9.9 Peaking
- Swim taper 2-3 weeks, volume down 41-60%, intensity kept (Bosquet et al. 2007; Pyne et al. 2009).
- Gym: last heavy strength session 10-14 days out for distance swimmers, about 7-10 days for sprinters; then 1-2 short power sessions (jumps 3 x 2, med ball 3 x 3, one lift 2 x 2 at 80%) ending 3-5 days before the race (coach practice). Sprinters who drop lifting entirely for 3 weeks may lose power; keep a little.

### 9.10 Sources
- Crowley E, Harrison AJ, Lyons M 2017. The impact of resistance training on swimming performance: a systematic review. Sports Medicine 47(11).
- Sein ML et al. 2010. Shoulder pain in elite swimmers: primarily due to swim-volume-induced supraspinatus tendinopathy. BJSM 44(2).
- Hibberd EE et al. 2012. Effect of a 6-week strengthening program on shoulder and scapular-stabilizer strength and scapular kinematics in Division I collegiate swimmers. Journal of Sport Rehabilitation 21(3).
- Pyne DB, Mujika I, Reilly T 2009. Peaking for optimal performance: research limitations and future directions. Journal of Sports Sciences 27(3).
- Bosquet et al. 2007 (see 0.8).

---

## 10. Road cycling

### 10.1 Encoding block
- `id`: `cycling`. `q`: `{maxStrength:3, power:2, rotational:0, unilateral:2, upperPull:1, upperPush:1, lowerBody:3, grip:0, neck:1, trunk:2, mass:0}` (raise power 1 to 2 for sprints and attacks; neck 1 for time-trial position).
- `prehab`: `["lowback","hipAbd","tspine"]` plus bone loading (jumps). `season`: `{off:3, pre:2, in:1}`. `avoidBefore: "lower"`. `confidence`: strong.
- Proposed `SPDOSE` override: off `{pow:3, main:4, acc:2, pre:2, core:2}`; acc sets low to avoid unnecessary mass.

### 10.2 Demands and energy systems
- Predominantly aerobic (races of 1-6 h), with decisive anaerobic efforts: attacks, climbs, sprints (5-15 s at 1000-1800 W in pros).
- Heavy strength training (4-10RM) improves cycling economy, time to exhaustion, sprint power and late-race power without adding much body mass when combined with endurance training (Rønnestad and Mujika 2014; Vikmoen et al. 2016).
- Cycling is non-weight-bearing: elite road cyclists often have low bone mineral density (Olmedillas et al. 2012), so heavy lifting and jumping have a health role too.

### 10.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Low back pain (the most common overuse complaint in professionals) (Clarsen et al. 2010) | Bike fit, BACK, hinge strength, anti-extension core, hip flexor mobility. |
| Anterior knee pain | Bike fit (saddle height, cleats), quad and hip strength, avoid sudden big-gear volume. |
| Neck and shoulder ache (aero position) | Neck extensor endurance, TSPINE. |
| Crash injuries (clavicle, wrist, hip, head) | Skills, helmet; strength helps rehab but cannot prevent. |
| Low bone density | Heavy lifting and jumping 2x per week year round. |

### 10.4 Fitting the gym around cycling
- Lift on the same day as hard interval sessions (after, or morning before an afternoon ride with 6 h gap), leaving easy days easy.
- Never heavy legs the day before key intervals or a race.
- 8-12 weeks of 2x per week heavy strength in the off-season, then 1x per week maintains gains in season (Rønnestad and Mujika 2014).

### 10.5 Season structure (UK road season)
| Phase | Months | Gym | Focus |
|---|---|---|---|
| Off / general | Nov-Jan | 2-3 | Heavy strength 4-10RM building to 4-6RM, bone loading |
| Pre | Feb-Mar | 2 | Heavy strength + explosive intent; on-bike sprints |
| In | Apr-Sep | 1 | Maintain heavy strength (2-3 sets) |
| Transition | Oct | 0-2 light | Rest, mobility, general training |

### 10.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Box jump / CMJ `boxjp` / `cmj` | 3 x 5 | 3 x 4 | 2 x 4 |
| Main | Back squat (half to parallel) `squat` or leg press | weeks 1-3: 3 x 10RM; weeks 4-6: 3 x 6RM; weeks 7-12: 3 x 4-5RM, explosive lifting intent | 3 x 4-5 @ 85% | 2 x 4-5 @ 85% |
| Main 2 | Single-leg leg press or Bulgarian split squat `bss` | 3 x 6-8 each | 3 x 5 each | 2 x 5 each |
| Accessory | Standing calf raise `standcalf` | 3 x 8-10 | 2 x 8 | 2 x 8 |
| Prehab | BACK + HIPABD | | | |
| Core | Plank / Pallof | 3 x 40 s | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Kettlebell swing `kbswing` | 3 x 8 | 3 x 6 | (none) |
| Main | Romanian or trap bar deadlift `rdl` / `trapdl` | 3 x 6 @ 80% | 3 x 4 @ 85% | (in-season uses Day A only) |
| Accessory | Step-up `stepup` | 3 x 8 each | 3 x 6 | |
| Accessory | Row `csdb` + push-up | 2 x 10 each | 2 x 8 | |
| Accessory | Hip flexor raise (cable or band, standing) | 3 x 10 each | 2 x 10 | |
| Prehab | TSPINE + neck extension isometrics | | | |

The leg exercises above mirror the original Rønnestad protocols (half squat, one-legged leg press, standing hip flexion, ankle plantar flexion).

### 10.7 Sport-specific conditioning
- All on the bike. Polarised or pyramidal distribution (most volume easy, about 10-20% hard). The app should not add gym conditioning.

### 10.8 Testing benchmarks
| Test | Club / good amateur | Elite |
|---|---|---|
| Functional threshold power (W/kg) | 3.5-4.0 men, 3.0-3.5 women | 5.5-6.0+ men (World Tour) |
| 5 s peak power (W) | 1000-1200 | 1400-1800+ |
| Back squat 1RM (or leg press equivalent) | 1.25-1.5 x BM | 1.5 x+ (strength helps; extra mass does not) |
| CMJ | track | |
(Benchmark, not peer reviewed; widely used power-profile tables.)

### 10.9 Peaking
- Endurance taper: 7-14 days, volume down 40-60%, keep short intensity (Bosquet et al. 2007).
- Last heavy lift 7-10 days out; skip the gym in race week.

### 10.10 Sources
- Rønnestad BR, Mujika I 2014. Optimizing strength training for running and cycling endurance performance: a review. Scand J Med Sci Sports 24(4).
- Vikmoen O et al. 2016. Strength training improves cycling performance, fractional utilization of VO2max and cycling economy in female cyclists. Scand J Med Sci Sports 26(4).
- Olmedillas H et al. 2012. Cycling and bone health: a systematic review. BMC Medicine 10:168.
- Clarsen B, Krosshaug T, Bahr R 2010. Overuse injuries in professional road cyclists. American Journal of Sports Medicine 38(12).

---

## 11. Track cycling (sprint and endurance)

### 11.1 Encoding block
- New `id`: `trackcycling` with `event`: `sprint` (flying 200, sprint, keirin, team sprint, 500 m / 1 km TT) or `endurance` (pursuits, points, Madison, omnium). Endurance riders use the road cycling section (10) with an extra power day.
- Sprint `q`: `{maxStrength:3, power:3, rotational:0, unilateral:2, upperPull:2, upperPush:1, lowerBody:3, grip:2, neck:0, trunk:3, mass:2}`.
- `prehab`: `["lowback","hipAbd","nordic"]`. `season`: sprint `{off:3, pre:3, in:2}`. `avoidBefore: "lower"`. `confidence`: moderate.

### 11.2 Demands and energy systems
- Flying 200 m about 9.5-11 s; 1 km TT about 60-70 s; team sprint man-one about 17 s. Alactic and glycolytic; peak power 1800-2500+ W in elite men.
- Maximal power = maximal force x velocity; heavy strength and hypertrophy of the leg extensors support it, alongside on-bike torque and speed work (Douglas et al. 2021).
- Standing starts need very high force at low cadence; flying efforts need very high cadence (over 130-150 rpm).

### 11.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Crashes (skin, clavicle, hip) | Skills; not preventable in the gym. |
| Low back (heavy lifting plus aggressive position) | Technique, BACK, belt for maximal sets if trained. |
| Hamstring and adductor strains (starts) | NORDIC, COPEN. |
| Knee (patellar tendon load) | PATELLA (isometrics if sore), load management of squats plus starts. |

### 11.4 Fitting the gym around track sprinting
- The gym is a primary training tool: 2-4 sessions a week. Put heavy lifting on days with standing starts or torque efforts, with speed work on separate days.

### 11.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| General (`off`) | 3-4 | Hypertrophy (4 x 8-10) then max strength (4-6 x 3-5 @ 85-90%) |
| Specific (`pre`) | 3 | Max strength plus power (jump squats, Olympic variations), on-bike torque |
| Competition (`in`) | 2 | Heavy low-volume strength (2-3 x 2-3 @ 85-90%) |
| Peak | 1 | Primer |

### 11.6 Session templates
Day A (max strength)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Jump squat (20-30% 1RM) or CMJ | 3 x 4 | 4 x 3 | 3 x 3 |
| Main | Back squat `squat` | Hypertrophy: 4 x 8 @ 70-75%; strength: 5 x 3-5 @ 85-90% | 5 x 3 @ 87-90% | 3 x 2-3 @ 85-90% |
| Main 2 | Romanian deadlift `rdl` | 4 x 6 | 3 x 5 | 2 x 5 |
| Accessory | Leg press single leg / BSS | 3 x 8 each | 3 x 6 | 2 x 6 |
| Accessory | Pull-up or row (bar pull in starts) | 3 x 8 | 3 x 6 | 2 x 6 |
| Prehab | NORDIC + COPEN | | | |
| Core | Ab wheel / anti-extension | 3 x 10 | | |

Day B (power)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Hang power clean `hangclean` | 4 x 3 @ 70-80% | 5 x 2 @ 80-85% | 3 x 2 |
| Main | Deadlift or trap bar `trapdl` | 4 x 5 @ 80% | 4 x 3 @ 85% | 2 x 3 |
| Accessory | Hip thrust `hipthrust` | 3 x 8 | 3 x 6 | 2 x 6 |
| Accessory | Calf raise | 3 x 10 | 2 x 10 | 2 x 8 |
| Prehab | BACK + HIPABD | | | |

### 11.7 Sport-specific conditioning
- On the bike: standing starts 4-6 x (0-60 m), 8-10 min rest; flying efforts 3-4 x 6-8 s, full recovery; lactate tolerance (kilo/team sprint man-three) 3-4 x 30-45 s, 10-15 min rest (coach practice).

### 11.8 Testing benchmarks
| Test | National-level | International |
|---|---|---|
| Back squat 1RM | 1.75-2.0 x BM | 2.0-2.5 x |
| Peak power (6 s, W/kg) | 18-20 men | 22-25+ men |
| CMJ | 50 cm | 60 cm+ |
| Flying 200 m | under 11.0 s men | under 10.0 s men |
(Benchmark, not peer reviewed.)

### 11.9 Peaking
- Last heavy session 7-10 days out; final week 1 primer (2 x 2 @ 80%, 3 x 2 jumps). On-bike volume down 40-50%, quality kept.

### 11.10 Sources
- Douglas J, Ross A, Martin JC 2021. Maximal muscular power: lessons from sprint cycling. Sports Medicine Open 7:48. https://sportsmedicine-open.springeropen.com/articles/10.1186/s40798-021-00341-7
- Rønnestad and Mujika 2014 (see 10.10).

---

## 12. Mountain biking (cross-country, enduro, downhill)

### 12.1 Encoding block
- `id`: `mtb`. Proposed `event`: `xc` or `gravity` (enduro and downhill).
- XC `q`: `{maxStrength:2, power:2, rotational:1, unilateral:2, upperPull:2, upperPush:2, lowerBody:3, grip:2, neck:0, trunk:3, mass:0}`.
- Gravity `q`: `{maxStrength:3, power:3, rotational:1, unilateral:2, upperPull:2, upperPush:2, lowerBody:3, grip:3, neck:1, trunk:3, mass:1}`.
- `prehab`: `["shoulderER","wrist","lowback","neck"]` (neck for gravity only). `season`: `{off:3, pre:2, in:1}`. `avoidBefore: "lower"`. `confidence`: limited.

### 12.2 Demands and energy systems
- XC races 1-1.5 h at a high fraction of VO2max (average heart rate commonly around 90% of maximum), with repeated short, high-power surges on climbs and technical sections (Impellizzeri and Marcora 2007).
- Downhill: runs of 2-5 min with large isometric and eccentric demands on legs and arms (absorbing terrain), grip endurance ("arm pump") and pedalling sprints out of corners.
- Enduro: multiple timed descents over a day with untimed climbs: aerobic base plus downhill strength endurance.

### 12.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Crash injuries: clavicle, shoulder (AC), wrist, head, with lacerations most frequent (Kronisch and Pfeiffer 2002) | Skills coaching, protective gear, strength for rehab capacity; CUFF and WRIST for resilience. |
| Low back (XC climbing posture) | BACK, hinge strength. |
| Knee overuse | Bike fit, quad and hip strength. |
| Forearm pump and hand numbness | Grip endurance, bike set-up (brakes, suspension). |

### 12.4 Fitting the gym around MTB
- As road cycling (10.4). Gravity riders benefit from more upper-body and grip work and from heavy single-leg strength.

### 12.5 Season structure
As road cycling (10.5), with a summer race season.

### 12.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Box jump / lateral bound | 3 x 4 | 4 x 3 | 2 x 3 |
| Main | Back squat or front squat | 4 x 5 @ 80% | 3 x 4 @ 85% | 2 x 4 @ 85% |
| Main 2 | Pull-up `pullup` | 3 x 6-8 | 3 x 5 | 2 x 6 |
| Accessory | Bulgarian split squat `bss` | 3 x 8 each | 3 x 6 | 2 x 6 |
| Prehab | CUFF + WRIST | | | |
| Core | Plank variations, Pallof | 3 x 40 s | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Kettlebell swing `kbswing` | 3 x 8 | 4 x 6 | 2 x 6 |
| Main | Trap bar deadlift `trapdl` | 4 x 5 @ 80% | 3 x 4 | 2 x 4 |
| Main 2 | Push-up / DB bench | 3 x 8-12 | 3 x 8 | 2 x 8 |
| Accessory | One-arm row `dbrow` | 3 x 8 | 3 x 8 | 2 x 8 |
| Grip (gravity) | Farmers carry, dead hang, wrist roller | 3 x 40 m / 3 x 30-45 s | | |
| Prehab | BACK + neck isometrics (gravity) | | | |

### 12.7 Sport-specific conditioning
- XC: on-bike, as road cycling, plus short over-threshold efforts (30 s on / 30 s off sets).
- Gravity: run simulations on the bike (2-4 min hard efforts, 4-6 reps); gym circuit for arm pump: 3-4 rounds of 40 s push-up position holds, 40 s dead hangs, 40 s squat holds, 2 min rest (coach practice).

### 12.8 Testing benchmarks
| Test | Good amateur (XC / gravity) |
|---|---|
| FTP (W/kg) | 3.5-4.0 / 3.0-3.5 |
| Squat 1RM | 1.25 x / 1.5 x BM |
| Pull-ups | 8 / 12 |
| Dead hang | 45 s / 60 s+ |

### 12.9 Peaking
As road cycling (10.9).

### 12.10 Sources
- Impellizzeri FM, Marcora SM 2007. The physiology of mountain biking. Sports Medicine 37(1).
- Kronisch RL, Pfeiffer RP 2002. Mountain biking injuries: an update. Sports Medicine 32(8).
- Rønnestad and Mujika 2014 (see 10.10).

---

# PART C: WATER, SNOW AND BOARD SPORTS

## 13. Rowing

### 13.1 Encoding block
- `id`: `rowing`. `q`: `{maxStrength:3, power:2, rotational:0, unilateral:1, upperPull:3, upperPush:1, lowerBody:3, grip:2, neck:0, trunk:3, mass:2}` (unchanged; `mass` 0 for lightweights).
- `prehab`: `["lowback","hipAbd","wrist","tspine"]` plus a rib-protective rule (7.3). `season`: `{off:3, pre:2, in:2}`. `avoidBefore: "all"`. `confidence`: moderate.

### 13.2 Demands and energy systems
- 2000 m race: about 5:30-7:30 depending on boat and athlete. Roughly 70-80% aerobic, 20-30% anaerobic; very high power at the start (first 250-500 m) then sustained near VO2max.
- Each stroke: about 75-85% leg drive, then trunk swing and arm pull. Strength-endurance across 200+ strokes.
- Strength training (especially leg and posterior chain) supports stroke power; maximal strength relates to rowing performance, more so at lower ability levels (Lawton et al. 2011).

### 13.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Low back pain (the most common) | Hinge technique, BACK, avoid sudden erg volume spikes, sweep rowers alternate sides on land, anti-flexion and anti-rotation core (Thornton et al. 2017). |
| Rib stress injury (elite rowers commonly cited about 6-12% prevalence) | Avoid sudden increases in volume and long low-rate ergs, keep energy availability adequate, include serratus and lat strength, scapular control (Evans and Redgrave 2016). |
| Wrist and forearm (intersection syndrome, especially feathering in cold) | WRIST, avoid excessive grip tension, warm hands. |
| Knee (patellofemoral) | Quad and hip strength, HIPABD. |

### 13.4 Fitting the gym around rowing
- Competitive rowers: 8-14 water and erg sessions a week. Gym 2-3x. Put heavy lifting after the morning water session on a lower-intensity day or alongside a hard session with the afternoon off.
- Lightweight rowers: weight-class rules apply (policy 0.7).

### 13.5 Season structure (UK)
| Phase | Months | Gym | Focus |
|---|---|---|---|
| Winter (`off`) | Oct-Feb | 3 | Max strength (3-6 reps) and strength-endurance circuits; head races |
| Spring (`pre`) | Mar-Apr | 2-3 | Strength to power (power cleans, explosive leg press) |
| Regatta season (`in`) | May-Aug | 2 | Maintain heavy strength, short |
| Peak | 1-2 weeks | 1 | Primer |
| Transition | Sep | 0-2 | Active rest |

### 13.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Power clean `hangclean` or box jump | 4 x 3 @ 70-75% | 5 x 2-3 @ 80% | 3 x 2 |
| Main | Back or front squat `squat` / `frontsq` | 4 x 5 @ 80-85% | 4 x 3-4 @ 85% | 3 x 3 @ 85% |
| Main 2 | Bench pull / chest-supported row `csrow` / `bbrow` | 4 x 6 | 4 x 5 explosive | 3 x 5 |
| Accessory | Bulgarian split squat `bss` | 3 x 8 | 2 x 8 | 2 x 6 |
| Prehab | BACK + serratus (SCAP) | | | |
| Core | Side plank, Pallof, dead bug | 3 x 30-45 s | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | Deadlift `deadlift` / trap bar | 4 x 4-5 @ 80-85% | 3 x 3 @ 85% | 2 x 3 @ 85% |
| Main 2 | Pull-up / pulldown | 3 x 6-8 | 3 x 6 | 2 x 6 |
| Accessory | Push-up or DB bench (antagonist, rib protection) | 3 x 10 | 2 x 10 | 2 x 10 |
| Accessory | Hip thrust `hipthrust` | 3 x 8 | 3 x 6 | 2 x 6 |
| Prehab | WRIST + TSPINE + HIPABD | | | |

Day C (winter only): strength-endurance circuit, 3 rounds of 6 stations x 40 s work / 20 s rest (leg press, bench pull, step-ups, plank, kettlebell swing, rowing machine), RIR 3-4; this mirrors traditional rowing circuit training (coach practice).

### 13.7 Sport-specific conditioning
- Water and erg supply it. Typical distribution: about 80% low intensity (UT2, long steady), remainder threshold and race pace. The app should not add gym conditioning, but must count erg volume for rib stress risk (no week-on-week jumps above about 10-15%, coach practice).

### 13.8 Testing benchmarks
| Test | Club men / women | International men / women |
|---|---|---|
| 2000 m erg | 6:30-7:00 / 7:30-8:00 | 5:40-5:55 / 6:20-6:40 (openweight) |
| Squat 1RM | 1.5 x BM | 1.75-2.0 x |
| Deadlift 1RM | 1.75 x | 2.0-2.25 x |
| Bench pull 1RM | 1.0 x | 1.2-1.4 x |
| 7-stroke max power test (erg watts) | track | |
(Benchmark, not peer reviewed.)

### 13.9 Peaking
- Volume down 40-60% over 10-14 days (Bosquet et al. 2007). Last heavy lift about 7-10 days out; one primer 3-4 days out.

### 13.10 Sources
- Lawton TW, Cronin JB, McGuigan MR 2011. Strength testing and training of rowers: a review. Sports Medicine 41(5).
- Thornton JS et al. 2017. Rowing injuries: an updated review. Sports Medicine 47(4).
- Evans G, Redgrave A 2016. Great Britain Rowing Team guideline for diagnosis and management of rib stress injury: Part 1. BJSM 50(5).

---

## 14. Canoe and kayak (sprint, slalom, marathon)

### 14.1 Encoding block
- `id`: `kayaking`. Proposed `event`: `sprint`, `slalom`, `marathon`.
- Sprint `q`: `{maxStrength:3, power:3, rotational:3, unilateral:1, upperPull:3, upperPush:3, lowerBody:2, grip:2, neck:0, trunk:3, mass:2}`. Marathon: maxStrength 2, power 1, upperPush 2, mass 0.
- `prehab`: `["shoulderER","scap","wrist","lowback","tspine"]`. `season`: sprint `{off:3, pre:3, in:2}`, marathon `{off:2, pre:2, in:1}`. `avoidBefore: "upper"`. `confidence`: limited.

### 14.2 Demands and energy systems
- Sprint kayak: 200 m (about 35-45 s, glycolytic and alactic), 500 m (about 1:40-2:10), 1000 m (about 3:20-4:20, mostly aerobic). Canoe sprint (kneeling, single blade) similar times.
- Slalom: runs of about 90-110 s with many accelerations and upstream gates.
- Marathon: 1-3 h, aerobic, with portages.
- Upper-body pulling and pushing strength and power, plus trunk rotation and leg drive in the kayak, relate to sprint performance; maximal upper-body strength was associated with 200 m performance in elite paddlers (McKean and Burkett 2014).

### 14.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Shoulder (impingement, cuff tendinopathy), the most common | CUFF, SCAP, TSPINE, balanced pushing and pulling (Hagemann et al. 2004 found shoulder pathology common in marathon kayakers). |
| Wrist and forearm tenosynovitis | WRIST, paddle feather angle and grip, avoid volume spikes. |
| Low back | BACK, rotation strength through range. |

### 14.4 Fitting the gym around paddling
- Competitive paddlers: 8-12 water sessions a week. Gym 2-3x. Avoid heavy upper body before quality water sessions.

### 14.5 Season structure
| Phase | Gym (sprint / marathon) | Focus |
|---|---|---|
| Winter (`off`) | 3 / 2 | Max strength (upper-body pull and press), hypertrophy for sprinters |
| Spring (`pre`) | 3 / 2 | Power: bench throw, explosive pulls, rotational throws |
| Racing (`in`) | 2 / 1 | Maintain |
| Peak | 1 | Primer |

### 14.6 Session templates
Day A (upper strength)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Med ball rotational throw `mbrot` / bench throw | 3 x 5 each | 4 x 4 | 3 x 3 |
| Main | Bench press `bench` | 4 x 5 @ 80-85% | 4 x 3 @ 85-88% | 3 x 3 @ 85% |
| Main 2 | Bench pull or weighted pull-up | 4 x 5 @ 80-85% | 4 x 3-4 | 3 x 3 |
| Accessory | Landmine press / single-arm cable row | 3 x 8 each | 3 x 6 | 2 x 6 |
| Prehab | CUFF + SCAP | | | |
| Core | Landmine rotation `landrot`, Russian twist with control | 3 x 8 each | | |

Day B (lower and trunk)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Box jump | 3 x 4 | 3 x 3 | 2 x 3 |
| Main | Front squat or trap bar | 4 x 5 @ 80% | 3 x 4 | 2 x 4 |
| Main 2 | Overhead press `bbohp` / `ohp` | 3 x 6 | 3 x 5 | 2 x 5 |
| Accessory | One-arm row `dbrow` | 3 x 8 | 3 x 8 | 2 x 8 |
| Prehab | WRIST + BACK + TSPINE | | | |

Marathon paddlers: two sessions a week at RIR 2-3 in the 6-12 rep range, plus one strength-endurance circuit in winter.

### 14.7 Sport-specific conditioning
- On the water. Sprint paddlers: race-pace intervals (e.g. 6-8 x 250 m, 3 min rest); slalom: 8-12 x 90 s with gates, full recovery (coach practice).

### 14.8 Testing benchmarks
| Test | National sprint level (men / women) |
|---|---|
| Bench press 1RM | 1.25-1.4 x / 0.9-1.0 x BM |
| Bench pull 1RM | 1.2-1.3 x / 0.9-1.0 x |
| Pull-ups max | 20 / 10 |
| 200 m K1 | under 37 s / under 43 s |
(Benchmark, not peer reviewed.)

### 14.9 Peaking
- As rowing (13.9).

### 14.10 Sources
- McKean MR, Burkett BJ 2014. The influence of upper-body strength on flat-water sprint kayak performance in elite athletes. IJSPP 9(4). https://lida.sport-iat.de/ta/Record/4032779
- Hagemann G, Rijke AM, Mars M 2004. Shoulder pathoanatomy in marathon kayakers. BJSM 38(4).
- Michael JS, Rooney KB, Smith R 2008. The metabolic demands of kayaking: a review. Journal of Sports Science and Medicine 7(1).

---

## 15. Alpine skiing

### 15.1 Encoding block
- `id`: `alpineskiing`. `q`: `{maxStrength:3, power:2, rotational:1, unilateral:3, upperPull:1, upperPush:1, lowerBody:3, grip:0, neck:0, trunk:3, mass:2}` (unchanged; recreational skiers use mass 1).
- `prehab`: `["landing","hipAbd","nordic","lowback","copenhagen"]` (Nordic for ACL hamstring support). `season`: `{off:3, pre:2, in:1}`. `avoidBefore: "lower"`. `confidence`: limited.

### 15.2 Demands and energy systems
- Race runs: slalom about 45-60 s, giant slalom about 60-90 s, super-G and downhill about 1-2.5 min. High glycolytic and aerobic demand within a run; high eccentric and isometric quad and glute loads in turns, plus high G-forces.
- Recreational skiing: long days of repeated moderate eccentric work, with fatigue a major injury factor late in the day.
- Key qualities: eccentric and isometric leg strength, single-leg strength, trunk stability, aerobic capacity for repeated runs (Turnbull et al. 2009; Hydren et al. 2013).

### 15.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| ACL rupture (the signature injury). Mechanisms in World Cup racing: slip-catch, dynamic snowplough, landing back-weighted (Bere et al. 2011) | Strength (quads and hamstrings, NORDIC), LAND, balanced stance training, fatigue management (stop when tired), properly set bindings. In recreational skiers, a video-based ACL awareness programme (how to fall, the phantom-foot position) cut serious knee sprains by 62% among ski instructors and patrollers (Ettlinger et al. 1995). |
| MCL and other knee sprains | LAND, HIPABD. |
| Low back | BACK, anti-flexion core. |
| Shoulder (falls, "skier's thumb") | Release poles in falls; CUFF. |
In young competitive ski racers followed for 10 years, lower core strength (and an imbalanced core flexion-to-extension ratio) was associated with later ACL injury; girls had about 2.3 times the risk of boys (Raschner et al. 2012). Core strength is therefore a priority, not an afterthought.

### 15.4 Fitting the gym around skiing
- Racers: dry-land season (May-Oct) is the main strength window; on-snow season (Nov-Apr) gym 1-2x.
- Recreational: a 6-8 week pre-ski programme 2-3x a week, then 1-2x during a ski holiday is unrealistic; the app should schedule 1 short session the week before travel and none on ski days.

### 15.5 Season structure
| Phase | Months (northern hemisphere) | Gym | Focus |
|---|---|---|---|
| General (`off`) | May-Jul | 3 | Hypertrophy and max strength, aerobic base |
| Specific (`pre`) | Aug-Oct | 2-3 | Eccentric and isometric strength, power, lateral plyometrics, glacier camps |
| Competition (`in`) | Nov-Mar | 1-2 | Maintain; recovery |
| Transition | Apr | 0-1 | |

### 15.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Lateral bound `latbound` (stick landing) | 3 x 4 each | 4 x 4 each | 2 x 3 each |
| Main | Back squat `squat` (3 s eccentric in pre) | 4 x 5-6 @ 80% | 4 x 4 @ 82-85%, 3 s lowering | 3 x 3 @ 85% |
| Main 2 | Wall sit or isometric split squat hold | | 3 x 30-45 s at ski-depth angle | 2 x 30 s |
| Accessory | Bulgarian split squat `bss` | 3 x 8 each | 3 x 6 each | 2 x 6 |
| Prehab | NORDIC + LAND | | | |
| Core | Pallof, side plank | 3 x 10 / 3 x 30 s | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Box jump / depth drop to stick | 3 x 4 | 3 x 4 | 2 x 3 |
| Main | Trap bar or RDL | 4 x 5 @ 80% | 3 x 4 | 2 x 4 |
| Accessory | Lateral lunge / Cossack squat | 3 x 8 each | 3 x 6 | 2 x 6 |
| Accessory | Single-leg RDL | 3 x 8 | 2 x 8 | 2 x 6 |
| Accessory | Row + push-up | 2 x 10 each | | |
| Prehab | COPEN + HIPABD + BACK | | | |

### 15.7 Sport-specific conditioning
- Racers: 2-3 x 30-45 min aerobic per week off-season; run-length intervals in pre-season: 6-8 x 60-90 s hard (bike, lateral slide board) with 3-4 min rest (coach practice; matches run durations).
- Recreational: 2 x 30 min aerobic per week for 6 weeks before a trip; 2-3 sets of 60-90 s wall-sit and lateral-hop circuits.

### 15.8 Testing benchmarks
| Test | Benchmark |
|---|---|
| Back squat 1RM | 1.5 x BM (racer, good), 1.8-2.0 x (elite) |
| CMJ | 45 cm men / 35 cm women (good racer) |
| Box jump 90 s test (repeated lateral jumps over a box) | track; used in ski testing batteries |
| Single-leg hop symmetry | at least 90% (limb symmetry index, coach practice) |
| Wall sit at 90 degrees | 2 min+ (recreational target, coach practice) |

### 15.9 Peaking
- Racers peak for blocks of races; keep 1 heavy short session per week mid-week, nothing heavy within 48 h of a race.
- Recreational: arrive fresh; last hard session 4-5 days before the trip.

### 15.10 Sources
- Bere T et al. 2011. Mechanisms of anterior cruciate ligament injury in World Cup alpine skiing: a systematic video analysis of 20 cases. American Journal of Sports Medicine 39(7).
- Ettlinger CF, Johnson RJ, Shealy JE 1995. A method to help reduce the risk of serious knee sprains incurred in alpine skiing. American Journal of Sports Medicine 23(5).
- Raschner C et al. 2012. The relationship between ACL injuries and physical fitness in young competitive ski racers: a 10-year longitudinal study. BJSM 46(15). https://bjsm.bmj.com/content/46/15/1065
- Turnbull JR, Kilding AE, Keogh JWL 2009. Physiology of alpine skiing. Scand J Med Sci Sports 19(2).
- Hydren JR, Volek JS, Maresh CM, Comstock BA, Kraemer WJ 2013. Review of strength and conditioning for alpine ski racing. Strength and Conditioning Journal 35(1).

---

## 16. Snowboarding

### 16.1 Encoding block
- `id`: `snowboarding`. `q`: `{maxStrength:2, power:3, rotational:2, unilateral:2, upperPull:1, upperPush:1, lowerBody:3, grip:0, neck:0, trunk:3, mass:1}` (power 2 to 3 for freestyle).
- `prehab`: `["landing","wrist","ankle","tspine"]`. `season`: `{off:3, pre:2, in:1}`. `avoidBefore: "lower"`. `confidence`: limited.

### 16.2 Demands and energy systems
- Freeride and recreational: long sessions of isometric and eccentric leg work in a flexed stance; aerobic base matters.
- Freestyle (slopestyle, halfpipe, big air): explosive take-offs, rotations, and very high landing forces.
- Snowboard cross: starts (upper-body pull from the gate), pumping, jumps; 40-60 s heats.

### 16.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Wrist fractures and sprains (the most common, especially beginners) | Wrist guards: a randomised trial found wrist protectors markedly reduced wrist injuries (Rønning et al. 2001); a review supports their use (Russell et al. 2007). Learn to fall (forearms, roll). |
| Head injury | Helmet; skill progression in parks. |
| Shoulder (falls) | CUFF. |
| Ankle: lateral process of the talus fracture ("snowboarder's fracture") | ANKLE, stiff boots for freestyle. |
| Knee (less than skiing, but landing injuries in freestyle) | LAND, strength. |

### 16.4 Fitting the gym around snowboarding
- As alpine skiing (15.4). Freestyle athletes add trampoline and airbag sessions (skill, not gym).

### 16.5 Season structure
As alpine skiing (15.5).

### 16.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Box jump, rotational jump (90-180 degrees) to stick | 3 x 4 | 4 x 3 each way | 2 x 3 |
| Main | Back or front squat | 4 x 5 @ 80% | 3 x 4 @ 85% | 2 x 3 |
| Accessory | Split squat `bss` | 3 x 8 | 3 x 6 | 2 x 6 |
| Accessory | Single-leg RDL | 3 x 8 | 2 x 8 | 2 x 6 |
| Prehab | LAND + ANKLE | | | |
| Core | Landmine rotation, Pallof | 3 x 8 each | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Rotational med ball throw `mbrot` | 3 x 5 each | 4 x 4 | 2 x 4 |
| Main | Trap bar deadlift | 4 x 5 | 3 x 4 | 2 x 4 |
| Main 2 | Push-up and pull-up (falls and gate starts) | 3 x 8-10 each | 3 x 8 | 2 x 8 |
| Prehab | WRIST + TSPINE + CUFF | | | |

### 16.7 Sport-specific conditioning
- 2 x 30 min aerobic per week off-season; 60 s interval circuits of squat holds and lateral hops for freeriders; repeated short jump circuits (8-10 x 10 s, 50 s rest) for freestylers (coach practice).

### 16.8 Testing benchmarks
- CMJ, single-leg hop symmetry (at least 90%), squat 1.25-1.5 x BM, wall-sit 2 min (recreational). (Coach practice.)

### 16.9 Peaking
As alpine skiing.

### 16.10 Sources
- Rønning R, Rønning I, Gerner T, Engebretsen L 2001. The efficacy of wrist protectors in preventing snowboarding injuries. American Journal of Sports Medicine 29(5).
- Russell K, Hagel B, Francescutti LH 2007. The effect of wrist guards on wrist and arm injuries among snowboarders: a systematic review. Clinical Journal of Sport Medicine 17(2).
- Turnbull et al. 2009 (alpine, for shared physiology).

---

## 17. Surfing

### 17.1 Encoding block
- `id`: `surfing`. `q`: `{maxStrength:2, power:3, rotational:2, unilateral:2, upperPull:3, upperPush:2, lowerBody:2, grip:0, neck:0, trunk:3, mass:1}` (maxStrength 1 to 2 and power 2 to 3: lower-body strength and power relate to manoeuvre scores).
- `prehab`: `["shoulderER","scap","tspine","lowback","landing"]`. `season`: `{off:3, pre:2, in:1}` (surf seasons follow swells and contests). `avoidBefore: "upper"`. `confidence`: limited.

### 17.2 Demands and energy systems
- Competitive heats 20-35 min. Time split roughly: paddling about 50-54%, stationary about 40%, wave riding only about 4-8% (Farley et al. 2012; Mendez-Villanueva and Bishop 2005).
- Paddling: upper-body aerobic endurance and repeated sprint paddling to catch waves and duck-dive.
- Wave riding: short explosive bursts; manoeuvre scores relate to lower-body strength and power (isometric mid-thigh pull, CMJ) in elite surfers (Secomb et al. 2015).
- Pop-up: fast push and hip flexion.

### 17.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Lacerations and contusions (from boards and reef) (Nathanson et al. 2002) | Equipment and spot choice; not gym. |
| Shoulder (paddling overuse, cuff) | CUFF, SCAP, TSPINE. |
| Low back and neck (prone extension while paddling) | BACK, thoracic extension mobility, deep neck flexor endurance. |
| Knee and ankle (aerials, landings) | LAND, ANKLE, strength. |

### 17.4 Fitting the gym around surfing
- Surf when the waves are good; train when they are not. The app should allow flexible scheduling: 2-3 sessions a week placed on flat days.
- Avoid heavy upper-body before long paddle sessions.

### 17.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Off / flat season | 3 | Max strength (lower and upper pull), paddle endurance on land (swim/ski erg) |
| Pre (before contests or a trip) | 2 | Power: jumps, rotational throws, explosive push-ups |
| In (consistent swell) | 1 | Maintain |

### 17.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | CMJ / box jump, rotational jump to stick | 3 x 4 | 4 x 3 | 2 x 3 |
| Main | Back squat or trap bar | 4 x 5 @ 80% | 3 x 3 @ 85% | 2 x 3 |
| Main 2 | Pull-up `pullup` | 4 x 6 | 3 x 5 | 2 x 6 |
| Accessory | Split squat / lateral lunge | 3 x 8 | 3 x 6 | 2 x 6 |
| Prehab | CUFF + SCAP | | | |
| Core | Landmine rotation | 3 x 8 each | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Explosive push-up / med ball chest pass (pop-up) | 3 x 5 | 4 x 4 | 2 x 4 |
| Main | RDL `rdl` | 3 x 6 | 3 x 5 | 2 x 5 |
| Accessory | Prone row on bench (`csdb`), prone Y-T-W | 3 x 10 | 3 x 8 | 2 x 8 |
| Accessory | Push-up to pop-up drill | 3 x 6 | 3 x 6 fast | |
| Prehab | TSPINE + BACK + LAND | | | |

### 17.7 Sport-specific conditioning
- **Paddle endurance on land**: swimming or SkiErg (`skiint`) 2 x per week: 3-4 x 5 min at moderate-hard, 1-2 min rest.
- **Repeated sprint paddle**: 10-15 x 15 s hard, 45 s easy (pool or SkiErg) (coach practice).

### 17.8 Testing benchmarks
| Test | Benchmark |
|---|---|
| 15 m sprint paddle time | track (used in surf testing batteries) |
| 400 m paddle or pool swim | track |
| CMJ | 40 cm men / 30 cm women (good amateur, coach practice) |
| Pull-ups | 10 / 5 |
| Squat 1RM | 1.25-1.5 x BM |

### 17.9 Peaking
- Before a contest or trip: last heavy session 5-7 days out; keep paddling volume, reduce gym (coach practice).

### 17.10 Sources
- Mendez-Villanueva A, Bishop D 2005. Physiological aspects of surfboard riding performance. Sports Medicine 35(1).
- Farley ORL, Harris NK, Kilding AE 2012. Physiological demands of competitive surfing. JSCR 26(7).
- Secomb JL et al. 2015. Associations between the performance of scoring manoeuvres and lower-body strength and power in elite surfers. International Journal of Sports Science and Coaching 10(5).
- Nathanson A, Haynes P, Galanis D 2002. Surfing injuries. American Journal of Emergency Medicine 20(3).

---

## 18. Sailing (dinghy and big boat)

### 18.1 Encoding block
- `id`: `sailing`. Proposed `event`: `dinghy` (hiking classes such as ILCA/Laser, Finn-type, 470, 49er trapeze) or `keelboat` (grinders, trimmers).
- Dinghy `q`: `{maxStrength:2, power:1, rotational:1, unilateral:1, upperPull:3, upperPush:1, lowerBody:3, grip:3, neck:0, trunk:3, mass:1}`. Grinder `q`: `{maxStrength:3, power:3, rotational:1, unilateral:1, upperPull:3, upperPush:3, lowerBody:2, grip:2, neck:0, trunk:3, mass:2}`.
- `prehab`: `["lowback","shoulderER","wrist","patellar"]` (patellar for hiking load). `season`: `{off:3, pre:2, in:1}`. `avoidBefore: null`. `confidence`: limited.

### 18.2 Demands and energy systems
- Dinghy hiking: sustained quasi-isometric quads, hip flexors and trunk for minutes at a time with repeated short dynamic efforts (sheeting, pumping where allowed, tacks and gybes). Strong aerobic demand in breeze.
- Big boat grinding: repeated high-power upper-body efforts (5-30 s) with short recoveries.
- Body mass is a performance variable in hiking classes (righting moment); athletes may need to gain or hold mass.

### 18.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Low back (the most commonly reported site overall) (Allen and De Jong 2006) | BACK, anti-extension core, hiking technique. |
| Knee (anterior, from hiking) | Quad strength, PATELLA isometrics if sore. |
| Shoulder (grinders, sheeting) | CUFF, SCAP (Neville et al. 2006 in America's Cup sailors: grinders had more upper-limb injury). |
| Hand and wrist (ropes) | WRIST, grip. |

### 18.4 Fitting the gym around sailing
- Sailors train on water 2-5 days a week in season, often whole days. Gym 2-3x off-season and 1-2x in season on non-sailing days.

### 18.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Winter (`off`) | 3 | Max strength, hypertrophy if mass needed, hiking endurance |
| Spring (`pre`) | 2 | Strength endurance, hiking-specific |
| Regatta (`in`) | 1-2 | Maintain |

### 18.6 Session templates
Day A (dinghy)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | Back squat / leg press | 4 x 6 @ 75-80% | 3 x 8 @ 70% | 2 x 5 @ 80% |
| Main 2 | Pull-up / bench pull | 4 x 6 | 3 x 8 | 2 x 6 |
| Accessory | Hiking bench isometric (`hiking`) or wall sit | 4 x 60-90 s | 5-6 x 2-3 min, 1 min rest | 3 x 90 s |
| Accessory | Leg extension `legext` | 3 x 12 | 3 x 15 | |
| Prehab | BACK + CUFF | | | |
| Core | Hollow hold, Pallof | 3 x 30-45 s | | |

Day B (dinghy)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | RDL `rdl` | 3 x 8 | 3 x 8 | 2 x 6 |
| Main 2 | Seated row `cabrow` / sheeting cable pull | 4 x 8 | 3 x 12-15 | 2 x 10 |
| Accessory | DB press / push-up | 3 x 8-10 | 2 x 10 | |
| Grip | Farmers carry, towel hang | 3 x 30-45 s | | |
| Prehab | WRIST + PATELLA | | | |

Grinders: replace hiking work with upper-body power (med ball chest pass 4 x 4, bench 4 x 4 @ 85%, push press), arm-crank or grinder-ergometer intervals.

### 18.7 Sport-specific conditioning
- Aerobic base 2-3 x 30-45 min (bike or row; cycling suits hiking muscles).
- Hiking intervals: 6-8 x 2-3 min isometric hiking or wall sit with upper-body sheeting reps, 1 min rest.
- Grinders: 10-15 x 10-20 s arm-crank sprints, 40 s rest.

### 18.8 Testing benchmarks
- Hiking endurance (time to failure at standard posture): track; squat 1.25-1.5 x BM; pull-ups 10+; grip; VO2max on bike. (Coach practice.)

### 18.9 Peaking
- Last heavy session 5-7 days before a regatta; hold hiking endurance with 1 short session.

### 18.10 Sources
- Allen JB, De Jong MR 2006. Sailing and sports medicine: a literature review. BJSM 40(7).
- Neville V et al. 2006. Epidemiology of injuries and illnesses in America's Cup yacht racing. BJSM 40(4).

---

# PART D: ATHLETICS, GYMNASTICS AND DANCE

Shared athletics rules:
- Track and field athletes often have two peaks a year (indoor February-March, outdoor June-August/September). The app should support a double periodisation: `off` (Oct-Dec), `pre` indoor (Jan), `in` indoor (Feb-Mar), short `transition` (late Mar), `off`/`pre` outdoor (Apr-May), `in` outdoor (Jun-Aug), `transition` (Sep).
- On the track, running or jumping quality comes first. Gym sessions follow the high-intensity track session on the same day (high-low model), so low-intensity days stay easy.
- Hamstring injury is the most common diagnosis at top-level athletics championships (Edouard et al. 2016), so sprint, jump and middle-distance athletes get NORDIC year round.

---

## 19. Sprinting (100-400 m)

### 19.1 Encoding block
- `id`: `sprinting`. Proposed `event`: `short` (60-200 m) or `long` (400 m, 400 m hurdles).
- `q`: `{maxStrength:3, power:3, rotational:1, unilateral:3, upperPull:1, upperPush:1, lowerBody:3, grip:0, neck:0, trunk:2, mass:1}` (unchanged).
- `prehab`: `["nordic","calf","copenhagen","hipAbd"]`. `season`: `{off:3, pre:3, in:2}`. `avoidBefore: "lower"`. `confidence`: strong.

### 19.2 Demands and energy systems
- 100 m: acceleration (0-30 m) and maximal velocity (reached about 50-70 m in elite athletes), then speed maintenance. Alactic dominant with substantial glycolytic contribution.
- 200 m: speed endurance. 400 m: large glycolytic and aerobic contributions (about 40% aerobic or more over 400 m in trained runners; Spencer and Gastin 2001).
- Key qualities: horizontal force production in acceleration, very short ground contacts (about 0.08-0.10 s at top speed in elites), hip extensor and hamstring strength, stiffness of the ankle and foot (Haugen et al. 2019).

### 19.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Hamstring strain (most common; biceps femoris long head during late swing) | NORDIC year round (van Dyk et al. 2019), high-speed running exposure that builds gradually, hip extension strength, adequate warm-up. |
| Achilles and calf | CALF heavy and isometric, gradual spike-work progression. |
| Adductor and hip flexor strains | COPEN, hip flexor strength. |
| Low back (lumbar stress in hurdlers) | BACK, anti-extension core. |
| Bone stress (metatarsal, tibia), especially with low energy availability | Load progression, REDs screening (Mountjoy et al. 2023). |

### 19.4 Fitting the gym around sprinting
- Elite sprinters: 6-8 track sessions and 2-3 strength sessions a week (Haugen et al. 2019).
- Typical microcycle: Mon acceleration + gym (lower heavy), Tue tempo, Wed max velocity or speed endurance + gym (power), Thu off or tempo, Fri acceleration/specific + gym (light power), Sat speed endurance, Sun off.

### 19.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| General (`off`) | 3 | Hypertrophy (where needed) and max strength; general plyometrics |
| Specific (`pre`) | 3 | Max strength to power: Olympic lifts, jump squats, bounds |
| Competition (`in`) | 2 | Heavy low-volume strength, fast power |
| Peak | 1 | Primer |
| Transition | 0-2 | |

### 19.6 Session templates
Day A (acceleration day, heavy)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Hang power clean `hangclean` / clean pull | 4 x 3 @ 70-75% | 5 x 2 @ 80-85% | 3 x 2 @ 80% |
| Power 2 | Broad jump / bounds `broadjump` | 3 x 4 | 4 x 3 + 3 x 5 alternate-leg bounds | 3 x 3 |
| Main | Back squat or front squat | weeks 1-4: 4 x 6 @ 75%; then 4-5 x 3-5 @ 82-88% | 4 x 3 @ 87-90% | 3 x 2 @ 85-90% |
| Accessory | Rear-foot-elevated split squat | 3 x 6 each | 3 x 5 | 2 x 5 |
| Prehab | NORDIC (3 x 6-8) + COPEN | | | 2 x 4-5 |
| Core | Ab wheel / anti-extension | 3 x 8 | | |

Day B (max-velocity day, power and hinge)
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Depth jump or hurdle hops `depthjump` / `hurdlehop` | 3 x 5 (low box) | 4 x 4 | 3 x 3 |
| Main | Romanian deadlift or hip thrust `rdl` / `hipthrust` | 4 x 5-6 @ 80% | 3 x 4 @ 85% | 2 x 4 |
| Accessory | Single-leg RDL / step-up | 3 x 6 each | 3 x 5 | 2 x 5 |
| Accessory | Calf raise heavy, single-leg | 3 x 8 | 3 x 6 | 2 x 6 |
| Accessory | Pull-up or row (arm action balance) | 3 x 8 | 2 x 8 | 2 x 6 |
| Prehab | CALF isometrics + HIPABD | | | |

Day C (off and pre only): push press `pushpress` 4 x 3, step-up 3 x 6, hip flexor cable or band march 3 x 10, Nordic 3 x 6, med ball overhead backward throw 4 x 3.

### 19.7 Sport-specific conditioning
On the track only. Examples (Haugen et al. 2019; coach practice):
- Acceleration: 6-10 x 10-30 m, full recovery (2-4 min).
- Max velocity: 4-6 x flying 20-30 m, 4-6 min rest.
- Speed endurance (100/200): 3-5 x 80-150 m at 90-95%, 6-10 min rest.
- Special endurance (400): 2-3 x 300-350 m at 90-95%, 12-20 min rest.
- Tempo (aerobic recovery): 10-20 x 100 m at 65-75% with 30-60 s walk.

### 19.8 Testing benchmarks
| Test | Good club | National / elite |
|---|---|---|
| 30 m from block or 3-point start | 4.3 s men / 4.8 s women | 3.9 s / 4.3 s |
| Flying 30 m | 3.2 s / 3.6 s | 2.7-2.9 s / 3.0-3.2 s |
| CMJ | 50 cm / 38 cm | 60 cm+ / 45 cm+ |
| Standing long jump | 2.7 m / 2.3 m | 3.1 m+ / 2.6 m+ |
| Back squat 1RM | 1.75 x BM | 2.0-2.5 x |
| Power clean 1RM | 1.1 x | 1.4-1.5 x |
| Nordic eccentric knee-flexor force (if measured) | under about 337 N raised hamstring injury risk in elite footballers (Timmins et al. 2016); track the trend | |
(Benchmark, not peer reviewed unless cited.)

### 19.9 Peaking
- Last heavy session (90%) 7-10 days out; last true high-volume track session 10-12 days out.
- Final week: one gym primer 3-4 days out (2 x 2 clean at 75%, 2 x 3 jumps, one squat set of 2 at 80%); keep short accelerations and a few flying runs; volume down about 40-50% (Bosquet et al. 2007).

### 19.10 Sources
- Haugen T, Seiler S, Sandbakk Ø, Tønnessen E 2019. The training and development of elite sprint performance: an integration of scientific and best practice literature. Sports Medicine Open 5:44.
- Spencer MR, Gastin PB 2001. Energy system contribution during 200- to 1500-m running in highly trained athletes. MSSE 33(1).
- Edouard P, Branco P, Alonso JM 2016. Muscle injury is the principal injury type and hamstring muscle injury is the first injury diagnosis during top-level international athletics championships between 2007 and 2015. BJSM 50(10).
- van Dyk et al. 2019 (see 0.8).
- Timmins RG et al. 2016. Short biceps femoris fascicles and eccentric knee flexor weakness increase the risk of hamstring injury in elite football (soccer): a prospective cohort study. BJSM 50(24).
- Mountjoy M et al. 2023. IOC consensus statement on REDs. BJSM.

---

## 20. Jumping events (long, triple, high jump, pole vault)

### 20.1 Encoding block
- `id`: `jumps`. `q`: `{maxStrength:3, power:3, rotational:1, unilateral:3, upperPull:1, upperPush:1, lowerBody:3, grip:0, neck:0, trunk:2, mass:1}` (unchanged; pole vault: upperPull 3, upperPush 2, grip 2).
- `prehab`: `["landing","calf","nordic","patellar","ankle"]`. `season`: `{off:3, pre:3, in:2}`. `avoidBefore: "lower"`. `confidence`: limited.

### 20.2 Demands and energy systems
- Approach run (sprint speed is the biggest single determinant in long and triple jump), take-off in about 0.1-0.2 s with very high eccentric and concentric forces, especially in triple jump.
- Alactic. Reactive strength, single-leg stiffness and maximal strength underpin take-off.

### 20.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Patellar tendinopathy ("jumper's knee") | Plyometric load monitoring (count contacts), PATELLA isometrics and HSR, quad strength (Kongsgaard et al. 2009; Rio et al. 2015). |
| Achilles and calf | CALF. |
| Hamstring strain | NORDIC. |
| Ankle sprains (high jump take-off, landings) | ANKLE. |
| Lumbar (high jump, pole vault arching) | BACK, anti-extension core. |
| Heel bruise (triple jump) | Technique, footwear, gradual hop-phase loading. |

### 20.4 Fitting the gym around jumping
- As sprinting (19.4). Count total weekly take-offs and bounds across track and gym: plyometric contacts in the gym drop when the athlete has a full jump session that day.

### 20.5 Season structure
As sprinting (19.5).

### 20.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Power snatch or hang power clean | 4 x 3 @ 70% | 5 x 2 @ 80% | 3 x 2 |
| Power 2 | Depth jump, single-leg bounds `depthjump` / `sbound` | 3 x 5 low box | 4 x 4 | 3 x 3 |
| Main | Back or front squat | 4 x 5 @ 80% | 4 x 3 @ 85-90% | 3 x 2-3 @ 85-90% |
| Accessory | Step-up (high box) / split squat | 3 x 6 each | 3 x 5 | 2 x 5 |
| Prehab | NORDIC + PATELLA (Spanish squat holds) | | | |
| Core | Hanging leg raise | 3 x 8 | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Jump squat (20-30% 1RM) | 3 x 4 | 4 x 3 | 2 x 3 |
| Main | RDL / hip thrust | 4 x 6 | 3 x 4 | 2 x 4 |
| Accessory | Single-leg calf raise heavy | 3 x 8 | 3 x 6 | 2 x 6 |
| Accessory | Pull-up (pole vault: 4 x 5 weighted + rope climbs) | 3 x 8 | | |
| Prehab | ANKLE + LAND | | | |

### 20.7 Sport-specific conditioning
- Track based: approach runs, short-approach jumps, bounding circuits (plyometric contacts off-season 100-200 per session for advanced jumpers including drills; intermediate amateurs 60-100), sprints as in 19.7 (short end only).

### 20.8 Testing benchmarks
| Test | Good club | Elite |
|---|---|---|
| CMJ | 50 cm / 40 cm | 65 cm+ / 50 cm+ |
| Reactive strength index (drop jump 30 cm) | 2.0 | 2.5-3.0+ |
| Standing triple jump | 8.0 m / 7.0 m | 9.0 m+ / 8.0 m+ |
| Back squat 1RM | 1.75 x | 2.0-2.25 x |
| 30 m sprint | as sprinters | |
(Benchmark, not peer reviewed.)

### 20.9 Peaking
As sprinting (19.9); total take-off volume in the final 10 days roughly halved.

### 20.10 Sources
- Haugen et al. 2019 (sprint, shared).
- Kongsgaard M et al. 2009; Rio E et al. 2015; Visnes H, Bahr R 2007 (The evolution of eccentric training as treatment for patellar tendinopathy (jumper's knee): a critical review of exercise programmes. BJSM 41(4)).
- Edouard et al. 2016.

---

## 21. Throwing events (shot put, discus, hammer, javelin)

### 21.1 Encoding block
- `id`: `throws`. Proposed `event`: `rotational` (shot, discus, hammer) or `javelin`.
- `q`: `{maxStrength:3, power:3, rotational:3, unilateral:2, upperPull:2, upperPush:3, lowerBody:3, grip:2, neck:0, trunk:3, mass:2}` (javelin: upperPush 2, mass 1).
- `prehab`: `["shoulderER","lowback","scap","tspine"]` (javelin adds `elbow` proposal and `nordic`). `season`: `{off:3, pre:3, in:2}`. `avoidBefore: "all"`. `confidence`: limited.

### 21.2 Demands and energy systems
- Single maximal efforts lasting about 1-2 s; alactic. Release velocity is the main determinant; it depends on force applied over a long path, from ground through legs, hips, trunk, to arm.
- Maximal strength and power correlate strongly with throw distance (Stone et al. 2003: 1RM snatch, clean and squat related to shot and weight throw performance).
- Heavy throwers (shot, discus, hammer) benefit from high body mass and muscle mass.

### 21.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Javelin: shoulder and elbow (medial elbow, UCL), low back | CUFF, SCAP, thoracic mobility, NORDIC, elbow strength; throw volume management. |
| Shot, discus, hammer: low back, shoulder, knee | BACK, CUFF, anti-rotation and rotational core through full range. |
| Wrist and fingers (shot) | WRIST. |

### 21.4 Fitting the gym around throwing
- The gym is a primary tool: 3-4 sessions a week. Throw first in the day, lift after; or lift on separate days from high-volume throwing.

### 21.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| General (`off`) | 3-4 | Hypertrophy then max strength |
| Specific (`pre`) | 3 | Max strength and Olympic lifts; heavy implements |
| Competition (`in`) | 2 | Heavy low volume, fast |
| Peak | 1 | Primer |

### 21.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Power clean or snatch | 5 x 3 @ 70-80% | 5 x 2 @ 85% | 4 x 1-2 @ 85% |
| Main | Back squat | 5 x 5 @ 80% (hypertrophy weeks 4 x 8 @ 70%) | 5 x 3 @ 87-90% | 3 x 2 @ 90% |
| Main 2 | Bench press (javelin: incline DB or landmine) | 5 x 5 @ 80% | 4 x 3 @ 87% | 3 x 2 |
| Accessory | Row `bbrow` | 4 x 8 | 3 x 6 | 2 x 6 |
| Prehab | CUFF + TSPINE | | | |
| Core | Landmine rotation, heavy rotational med ball | 4 x 5 each | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Overhead backward throw `mbovh` / rotational shot-put throw `mbshot` | 4 x 4 | 5 x 3 | 3 x 3 |
| Main | Deadlift or clean pull | 4 x 4 @ 85% | 4 x 3 | 2 x 3 |
| Main 2 | Push press / jerk | 4 x 4 | 4 x 3 | 3 x 2 |
| Accessory | Split squat | 3 x 6 | 3 x 5 | 2 x 5 |
| Prehab | BACK + SCAP (+ NORDIC for javelin) | | | |

Day C (off/pre): snatch-grip high pull, incline bench, single-leg RDL, med ball scoop toss, hypertrophy accessories for heavy throwers (3 x 8-12 on 2-3 movements).

### 21.7 Sport-specific conditioning
- Minimal. Short sprints and jumps 1-2x a week; general aerobic 1-2 x 20-30 min for health and recovery (coach practice).

### 21.8 Testing benchmarks
| Test | Good club | National / elite |
|---|---|---|
| Back squat 1RM | 2.0 x BM | 2.5 x+ (heavy throwers) |
| Bench 1RM | 1.4 x | 1.75 x+ |
| Power clean | 1.2 x | 1.5 x+ |
| Overhead backward shot throw (4 kg women / 7.26 kg men) | track | |
| Standing long jump | 2.6 m / 2.2 m | 3.0 m+ / 2.5 m+ |
(Benchmark, not peer reviewed.)

### 21.9 Peaking
- Last heavy session 7-10 days out; light implements and speed in the final week; one primer 2-3 days out.

### 21.10 Sources
- Stone MH et al. 2003. Maximum strength-power-performance relationships in collegiate throwers. JSCR 17(4).
- Edouard et al. 2016 (athletics injuries).
- Andersson et al. 2017 (shoulder programme for throwing athletes, see 0.8).

---

## 22. Middle-distance running (800-1500 m)

### 22.1 Encoding block
- New `id`: `middledistance`. `q`: `{maxStrength:2, power:2, rotational:0, unilateral:3, upperPull:1, upperPush:1, lowerBody:3, grip:0, neck:0, trunk:2, mass:0}`.
- `prehab`: `["calf","nordic","hipAbd","ankle","shin"]`. `season`: `{off:2, pre:2, in:1}`. `avoidBefore: "lower"`. `confidence`: moderate.
- Proposed `SPDOSE` override: acc sets 2 off-season (no muscle gain wanted).

### 22.2 Demands and energy systems
- 800 m: about two-thirds aerobic, one-third anaerobic; 1500 m: about 80-85% aerobic (Spencer and Gastin 2001).
- Both need a high aerobic capacity and a large anaerobic speed reserve (difference between max sprint speed and the speed at VO2max) (Sandford et al. 2021).
- World-class distance runners: about 80% of volume at low intensity, with structured threshold and VO2max sessions (Haugen et al. 2022).
- Heavy and explosive strength training improves running economy and middle-distance performance without hurting endurance (Blagrove et al. 2018).

### 22.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Achilles tendinopathy, calf strains | CALF heavy (seated and standing), isometrics in season. |
| Bone stress injuries (tibia, metatarsal, femoral neck, sacrum) | Graded load, REDs screening, adequate energy and calcium/vitamin D, impact and heavy lifting for bone. |
| Hamstring strain (800 m runners sprint) | NORDIC. |
| Patellofemoral pain, ITB pain | HIPABD, quad strength. |
| Plantar fascia and shin pain | Foot strength, TIB, CALF. |

### 22.4 Fitting the gym around running
- Runners: 6-12 runs a week. Gym 2x off-season and pre-season, 1x in season.
- Lift on hard-run days, after the run (6 h gap ideal), never on long-run day or before a quality session.
- No high-rep "endurance" lifting: use heavy (3-6 reps) and explosive work.

### 22.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| General (`off`, autumn) | 2 | Max strength (3-5 x 4-6), plyometrics low to moderate |
| Specific (`pre`, late winter-spring) | 2 | Power: jumps, bounds, sprint drills, heavy low volume |
| Competition (`in`) | 1 | Maintain: 2 lifts x 2-3 sets heavy + 2-3 plyo drills |
| Peak | 0-1 | |

### 22.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Pogo hops `pogo` + box jump | 3 x 10 pogo; 3 x 4 box | 3 x 15 pogo; 4 x 3 hurdle hops | 2 x 10; 2 x 3 |
| Main | Back squat or trap bar | 4 x 5 @ 80-85% | 3 x 3-4 @ 85% | 2-3 x 3 @ 85% |
| Main 2 | Bulgarian split squat `bss` | 3 x 6 each | 3 x 5 | 2 x 5 |
| Accessory | Single-leg calf raise, seated calf (soleus) heavy | 3 x 8 each | 3 x 8 | 2 x 8 |
| Prehab | NORDIC + HIPABD | | | |
| Core | Side plank, dead bug | 2-3 x 30-45 s | | |

Day B (off and pre)
| Slot | Exercise (key) | Off | Pre |
|---|---|---|---|
| Power | Broad jump / single-leg bounds | 3 x 4 | 3 x 3 + 3 x 5 bounds |
| Main | RDL / single-leg RDL | 3 x 6 | 3 x 5 |
| Accessory | Step-up | 3 x 6 each | 2 x 6 |
| Accessory | Pull-up / row + push-up | 2 x 8 | 2 x 8 |
| Prehab | TIB + ANKLE + CALF isometric | | |

### 22.7 Sport-specific conditioning
On the track and road. Examples (coach practice and Haugen et al. 2022):
- Threshold: 5-6 x 1 km at threshold, 1 min rest; or 20-30 min tempo.
- VO2max: 5-6 x 800 m at 3 km pace, 2-3 min rest.
- Race-specific (800): 3 x 300 m at 800 m pace, 8-10 min rest; (1500): 4-5 x 400 m at 1500 m pace, 3 min rest.
- Speed: 6-8 x 60-80 m fast, full recovery, 1-2x a week to protect the speed reserve.

### 22.8 Testing benchmarks
| Test | Good club | National |
|---|---|---|
| 800 m | 2:05 men / 2:25 women | 1:50 / 2:05 |
| 1500 m | 4:15 / 5:00 | 3:50 / 4:20 |
| Max sprint speed (flying 30 m) | track for speed reserve | |
| CMJ | 40 cm / 30 cm | 45-50 cm / 35 cm |
| Single-leg calf raise reps (metronome, full range) | 25+ each side (coach practice) | 30+ |
| Back squat 1RM | 1.25-1.5 x BM | |
(Benchmark, not peer reviewed.)

### 22.9 Peaking
- Taper 7-14 days: run volume down 40-60%, keep intensity (Bosquet et al. 2007).
- Last heavy lift 7-10 days out; plyometric primer (pogo 2 x 10, 2 x 3 hops) up to 3 days out.

### 22.10 Sources
- Blagrove RC, Howatson G, Hayes PR 2018. Effects of strength training on the physiological determinants of middle- and long-distance running performance: a systematic review. Sports Medicine 48(5).
- Haugen T, Sandbakk Ø, Seiler S, Tønnessen E 2022. The training characteristics of world-class distance runners: an integration of scientific literature and results-proven practice. Sports Medicine Open 8:46.
- Sandford GN, Laursen PB, Buchheit M 2021. Anaerobic speed/power reserve and sport performance: scientific basis, current applications and future directions. Sports Medicine 51(10).
- Spencer and Gastin 2001; Mountjoy et al. 2023.

---

## 23. Gymnastics (artistic; applies loosely to trampoline and tumbling)

### 23.1 Encoding block
- `id`: `gymnastics`. `q`: `{maxStrength:3, power:3, rotational:1, unilateral:2, upperPull:3, upperPush:3, lowerBody:3, grip:3, neck:0, trunk:3, mass:0}` (unchanged).
- `prehab`: `["wrist","landing","ankle","shoulderER","lowback","calf"]`. `season`: `{off:3, pre:2, in:2}`. `avoidBefore: "all"`. `confidence`: limited.
- Youth rule: most competitive gymnasts are children or adolescents. Under-18 plans follow the youth resistance training consensus (Lloyd et al. 2014): supervised, technique first, no maximal 1RM testing unless supervised by a qualified coach, progressive.

### 23.2 Demands and energy systems
- Routines: floor about 70-90 s, beam 70-90 s, bars about 30-60 s, vault about 5 s. Alactic and glycolytic; extreme relative strength (holds, presses), power (take-offs, landings up to many times body weight), flexibility.
- Training volume is very high (often 15-30+ hours a week for competitive athletes), so gym S&C must be short and targeted (Moeskops et al. 2019).

### 23.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Ankle and foot (landings), knee (ACL in women), Achilles (Westermann et al. 2015) | LAND, ANKLE, CALF, landing technique and surface, managing landing volume. |
| Wrist: distal radial physis stress injury ("gymnast's wrist") in young athletes (DiFiori et al. 2006) | WRIST progressive loading, limit weight-bearing volume spikes, pain = stop and refer. |
| Low back: spondylolysis from repeated hyperextension | Anti-extension core, BACK endurance, hip flexor and thoracic mobility; persistent extension-based back pain in a young gymnast = medical review. |
| Shoulder (rings, bars) | CUFF, SCAP. |
| Elbow (vault, beam) | Progressive loading. |

### 23.4 Fitting the gym around gymnastics
- Strength is mostly built in the gymnastics gym. Supplementary S&C 2-3 x 30-45 min a week, often at the end of training or as a separate session on lighter days.
- Weighted strength (squats, presses, pulls) adds capacity that bodyweight conditioning cannot load progressively; keep volume low.

### 23.5 Season structure
| Phase | S&C sessions | Focus |
|---|---|---|
| Off / preparation | 3 | Max strength, tendon capacity, landing mechanics, hypertrophy where weak |
| Pre-competition | 2 | Power, routine-specific endurance |
| Competition | 2 | Maintain, short |
| Peak | 1 | Primer |

### 23.6 Session templates (adult or late adolescent intermediate)
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Box jump / depth drop to stick | 3 x 4 | 4 x 3 | 2 x 3 |
| Main | Front squat or back squat | 4 x 5 @ 75-80% | 3 x 3 @ 85% | 2 x 3 |
| Main 2 | Weighted pull-up | 4 x 4-6 | 3 x 4 | 2 x 4 |
| Accessory | Weighted dip / pike push-up | 3 x 6 | 3 x 5 | 2 x 5 |
| Prehab | WRIST (incl. wrist push-ups, rocking) + CUFF | | | |
| Core | Hollow hold, compression (L-sit, pike lifts) | 3 x 20-30 s / 3 x 10 | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Rebound jumps / hurdle hops | 3 x 5 | 3 x 5 | 2 x 4 |
| Main | RDL or Nordic | 3 x 6 / 3 x 5 | 3 x 5 | 2 x 4 |
| Main 2 | Overhead press `bbohp` / handstand push-up | 3 x 5-6 | 3 x 5 | 2 x 5 |
| Accessory | Single-leg calf raise heavy | 3 x 8 | 3 x 8 | 2 x 8 |
| Prehab | LAND + ANKLE + BACK (anti-extension) | | | |

### 23.7 Sport-specific conditioning
- Routine simulation: full routines or routine halves back to back (e.g. floor: 2 x half routine, 2 min rest) in pre-competition (coach practice). General aerobic 1-2 x 20 min easy for recovery.

### 23.8 Testing benchmarks (adult/late-adolescent competitive)
- Pull-ups 15+ (women 10+), rope climb legless (5 m) time, L-sit hold 20-30 s, handstand hold 60 s, CMJ 45-55 cm (men), squat 1.5 x BM (coach practice).

### 23.9 Peaking
- Reduce S&C to one short power-and-prehab session in competition week, last heavy 7-10 days out.

### 23.10 Sources
- Westermann RW et al. 2015. Evaluation of men's and women's gymnastics injuries: a 10-year observational study. Sports Health 7(2).
- DiFiori JP, Caine DJ, Malina RM 2006. Wrist pain, distal radial physeal injury, and ulnar variance in the young gymnast. American Journal of Sports Medicine 34(5).
- Moeskops S et al. 2019. The physiological demands of youth artistic gymnastics: applications to strength and conditioning. Strength and Conditioning Journal 41(1).
- Lloyd RS et al. 2014. Position statement on youth resistance training: the 2014 International Consensus. BJSM 48(7).

---

## 24. Dance (ballet, contemporary, commercial)

### 24.1 Encoding block
- `id`: `dance`. `q`: `{maxStrength:2, power:2, rotational:1, unilateral:3, upperPull:1, upperPush:1, lowerBody:3, grip:0, neck:0, trunk:3, mass:0}` (maxStrength 1 to 2, lowerBody 2 to 3, trunk 2 to 3).
- `prehab`: `["calf","ankle","landing","hipAbd","hipRot"]`. `season`: `{off:3, pre:2, in:2}` (in = performance season, often 6-8 shows a week; 1-2 short sessions). `avoidBefore: "lower"`. `confidence`: limited.

### 24.2 Demands and energy systems
- Class and rehearsal are intermittent: short bursts of jumps and turns with rests; performances add longer continuous sections. Aerobic fitness of dancers is often only moderate, and supplementary training improves it (Koutedakis and Jamurtas 2004).
- Needs: lower-limb power (jumps), single-leg strength and balance on demi-pointe or pointe, end-range strength for extensions, trunk control, upper-body strength for partnering and lifts.

### 24.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Foot and ankle (the most common): ankle sprains, posterior ankle impingement, flexor hallucis longus tendinopathy, metatarsal stress fractures (Allen et al. 2012) | CALF (including on demi-pointe, both straight and bent knee), foot intrinsic work, ANKLE, energy availability. |
| Hip (labral, snapping hip) | Hip strength through range (HIPROT, HIPABD), avoid forced turnout. |
| Low back (lifts, extensions) | Anti-extension core, BACK. |
| Knee | LAND; ACL injury rates are low in dancers despite many landings (Liederbach et al. 2008). |
Fitness-related factors (aerobic fitness and strength) were associated with injury severity in contemporary dancers (Angioi et al. 2009).

### 24.4 Fitting the gym around dance
- Dancers often train 4-8 hours a day. Supplementary S&C 2-3 x 30-45 min, low fatigue, at the end of the day or on lighter rehearsal days.
- Strength training does not compromise aesthetics or flexibility when programmed sensibly (Koutedakis and Jamurtas 2004).

### 24.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Off-season / summer break | 3 | Max strength, aerobic base, address asymmetries |
| Rehearsal period (`pre`) | 2 | Power (jumps), strength maintenance |
| Performance season (`in`) | 1-2 | Short maintenance, prehab |

### 24.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Pogo hops, box jump | 3 x 10 / 3 x 4 | 3 x 15 / 4 x 3 | 2 x 10 |
| Main | Goblet or front squat | 4 x 6 @ RIR 2 | 3 x 5 | 2 x 5 |
| Main 2 | Bulgarian split squat | 3 x 6-8 each | 3 x 6 | 2 x 6 |
| Accessory | Single-leg calf raise (on demi-pointe range) | 3 x 10-15 each | 3 x 10 | 2 x 10 |
| Prehab | ANKLE + HIPROT | | | |
| Core | Dead bug, Pallof, side plank | 3 x 30 s | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Power | Lateral bound to stick | 3 x 4 | 3 x 4 | 2 x 3 |
| Main | RDL / single-leg RDL | 3 x 6-8 | 3 x 6 | 2 x 6 |
| Main 2 | Push-up / DB press; pull-up (partnering) | 3 x 8 each | 3 x 6 | 2 x 6 |
| Accessory | Copenhagen or adductor work; hip abduction | 2 x 8 | | |
| Prehab | CALF isometrics + LAND | | | |

### 24.7 Sport-specific conditioning
- 2 x 20-30 min aerobic (bike, swim) per week off-season; dance-specific intervals (e.g. 4-6 x 2-3 min of choreography at performance intensity, 1-2 min rest) in rehearsal periods (coach practice).

### 24.8 Testing benchmarks
- Single-leg calf raise reps 25+ each side; single-leg hop symmetry 90%+; CMJ; Y-balance asymmetry under 4 cm anterior reach (coach practice); aerobic test (e.g. Dance Aerobic Fitness Test) if available.

### 24.9 Peaking
- For a premiere or audition: last hard gym session 5-7 days out; maintain prehab.

### 24.10 Sources
- Koutedakis Y, Jamurtas A 2004. The dancer as a performing athlete: physiological considerations. Sports Medicine 34(10).
- Allen N et al. 2012. Ballet injuries: injury incidence and severity over 1 year. JOSPT 42(9).
- Liederbach M, Dilgen FE, Rose DJ 2008. Incidence of anterior cruciate ligament injuries among elite ballet and modern dancers: a 5-year prospective study. American Journal of Sports Medicine 36(9).
- Angioi M et al. 2009. Physical fitness and severity of injuries in contemporary dance. Medical Problems of Performing Artists 24(1).

---

# PART E: STRENGTH SPORTS AND CROSSFIT

## 25. CrossFit as a sport (functional fitness competition)

### 25.1 Encoding block
- New `id`: `crossfit`. `q`: `{maxStrength:3, power:3, rotational:1, unilateral:2, upperPull:3, upperPush:3, lowerBody:3, grip:3, neck:0, trunk:3, mass:1}`.
- `prehab`: `["shoulderER","scap","lowback","wrist","patellar"]`. `season`: `{off:5, pre:5, in:4}` (the gym is the sport; sessions include conditioning). `avoidBefore: null` (taper before competitions instead). `confidence`: limited.
- Needs a separate builder mode: every session has a strength or weightlifting block, a skill block and a conditioning piece ("metcon"). Proposed role `cond` and role `skill`.

### 25.2 Demands and energy systems
- Workouts range from under 2 min (sprint couplets) to over 60 min (e.g. "Murph"), mixing weightlifting, gymnastics and monostructural work (row, bike, ski, run). All energy systems matter.
- Performance relates to maximal strength, anaerobic power and aerobic capacity together; no single quality dominates (Dexheimer et al. 2019; Butcher et al. 2015).
- Competition season: the Open (several weeks, one workout per week), then online or in-person stages for the best athletes, and local competitions year round.

### 25.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Shoulder (most common site), low back, knee (Weisenthal et al. 2014) | CUFF, SCAP, strict before kipping (strict pull-up and dip base before kipping or butterfly volume), BACK. |
| Injury rate similar to weightlifting and other recreational training, roughly 0.2-18.9 per 1000 h across studies (Klimek et al. 2018) | Scale loads in high-rep fatigued sets, cap high-rep Olympic lifts under fatigue, coach supervision. |
| Wrist (front rack, handstands) | WRIST. |
| Hand tears (rig) | Hand care. |
| Rhabdomyolysis in novices (high-volume eccentric work, e.g. GHD sit-ups, kipping) | New athletes: cap volume on unfamiliar high-rep eccentric movements in the first weeks (coach practice). |

### 25.4 Fitting training together
- Amateur competitor: 5 sessions a week of 60-90 min. Advanced: 6-10 sessions (double days).
- Weekly logic (coach practice): heavy lower body and heavy Olympic lifts early in the week after a rest day; aerobic or longer pieces mid-week; gymnastics skill on lower-body-light days; one hard "test" piece late in the week; 1-2 full rest days.
- Interference: put strength before conditioning in the same session (Murlasits et al. 2018); separate long aerobic work from heavy squats by 6 h on double days.

### 25.5 Season structure
| Phase | Months (approx.) | Sessions | Focus |
|---|---|---|---|
| Off-season (`off`) | after the competition season, 12-16 weeks | 5 | Max strength, weightlifting technique, aerobic base, gymnastics skill acquisition, hypertrophy where weak |
| Pre-season (`pre`) | 8-12 weeks before the Open | 5 | Mixed-modal conditioning across time domains, threshold work, strength maintained |
| Competition (`in`) | Open and following stages | 4-5 | Maintain, recover between weekly tests, sharpen |
| Peak | 3-7 days before a competition | reduce | Volume down, intensity kept |

### 25.6 Session templates (intermediate competitor, 5 days, `off` / `pre`)
| Day | Strength / weightlifting | Skill | Conditioning |
|---|---|---|---|
| 1 | Back squat 5 x 5 @ 75-80% (off) / 4 x 3 @ 85% (pre) | Strict pull-up 4 x 5 weighted | 10-12 min AMRAP mixed couplet (moderate load) |
| 2 | Snatch: 6 x 2 @ 70-80% + snatch pull 3 x 3 @ 100% of snatch | Handstand walk practice 10 min | Intervals: 5 x 3 min row/bike at threshold, 1 min rest |
| 3 | Deadlift 4 x 4 @ 80-85% / 3 x 3 @ 85% | Ring muscle-up drills, toes-to-bar | 20-30 min zone 2 mixed (row, bike, ski) |
| 4 | Clean and jerk 6 x 1+1 @ 75-85%, front squat 3 x 3 | Double-unders, pistol | Sprint: 6-8 x 1 min hard, 2 min easy |
| 5 | Push press or strict press 5 x 3; accessory (single-leg, row, CUFF) | | Longer chipper or benchmark workout (12-25 min), or competition simulation |
Prehab (CUFF, SCAP, WRIST, BACK) in warm-ups daily, 5-10 min. In season: 4 days, strength 2-3 sets at 80-87%, one Open-style test per week.

### 25.7 Sport-specific conditioning
- Train every time domain each week: under 5 min (glycolytic sprints), 5-12 min (mixed), 12-20 min, and 20+ min (aerobic) (coach practice).
- Aerobic base: 2 x 30-45 min zone 2 in the off-season improves recovery between pieces.
- Mixed-modal threshold: 3-5 x 5-8 min at a sustainable hard pace with 2-3 min rest.

### 25.8 Testing benchmarks (community benchmarks, not peer reviewed)
| Test | Intermediate men / women | Competitive men / women |
|---|---|---|
| Back squat 1RM | 1.75 x / 1.5 x BM | 2.2 x / 1.8 x |
| Deadlift 1RM | 2.25 x / 1.75 x | 2.6 x / 2.2 x |
| Clean and jerk | 1.1 x / 0.85 x | 1.4 x / 1.1 x |
| Snatch | 0.85 x / 0.65 x | 1.1 x / 0.85 x |
| "Fran" (21-15-9 thrusters 43/29 kg and pull-ups) | 5-7 min | under 3 min |
| "Grace" (30 clean and jerks 61/43 kg) | 4-6 min | under 2:30 |
| 2000 m row | 7:15 / 8:15 | 6:40 / 7:30 |
| Strict pull-ups | 12 / 6 | 20 / 12 |

### 25.9 Peaking
- For a 1-3 day competition: reduce volume by 40-60% in the final week, keep 1-2 short high-intensity pieces, last heavy lift 5-7 days out, full rest day before (coach practice; Bosquet et al. 2007).
- During the Open: one test per week, lighter day after, maintain strength with 2-3 sessions.

### 25.10 Sources
- Claudino JG et al. 2018. CrossFit overview: systematic review and meta-analysis. Sports Medicine Open 4:11.
- Klimek C, Ashbeck C, Brook AJ, Durall C 2018. Are injuries more common with CrossFit training than other forms of exercise? Journal of Sport Rehabilitation 27(3).
- Weisenthal BM et al. 2014. Injury rate and patterns among CrossFit athletes. Orthopaedic Journal of Sports Medicine 2(4).
- Dexheimer JD et al. 2019. Physiological performance measures as indicators of CrossFit performance. Sports (Basel) 7(4).
- Butcher SJ et al. 2015. Do physiological measures predict selected CrossFit benchmark performance? Open Access Journal of Sports Medicine 6.

---

## 26. Powerlifting (conditioning and prehab only; the strength engine handles the lifts)

### 26.1 Encoding block
- New `id`: `powerlifting`, flagged `strengthEngine: true` (lifts come from `strength.js`). This profile only adds conditioning, prehab and meet logistics.
- `prehab`: `["shoulderER","scap","lowback","copenhagen","patellar"]` plus elbow care. `avoidBefore: null`. `confidence`: moderate.

### 26.2 Demands
- Three single maximal lifts (squat, bench, deadlift); about 1-5 s each. Conditioning is not a performance limiter, but work capacity supports training volume, recovery between sets and long meet days, and cardiovascular health matters for heavier lifters.

### 26.3 Injuries and prevention
Injury rates are low (about 1-4.4 injuries per 1000 h); the shoulder, low back, elbow and knee/hip are the most affected sites (Aasa et al. 2017; Strömbäck et al. 2018).
| Area | Prevention |
|---|---|
| Shoulder (bench, low-bar squat position) | CUFF 2-3x a week (side-lying ER, face pulls, Y-T-W 2 x 12-15), horizontal pulling at least equal to pressing sets, SCAP. |
| Elbow (medial elbow pain from low-bar squats) | Wider grip or safety squat bar when sore; wrists stacked over elbows; triceps and forearm volume control. |
| Low back | Bracing technique, back extension endurance (BACK), avoid grinding maximal deadlifts weekly. |
| Hip and adductor (wide stance, sumo) | COPEN, hip mobility. |
| Knee (patellar tendon) | PATELLA isometrics when irritable; control of weekly squat volume. |
| Pec tear risk (bench) | Controlled descent, never bounce, warm up thoroughly (coach practice). |

### 26.4 Conditioning rules
- 2-3 x 20-30 min low-intensity cardio a week (walk incline, bike, rower), on non-heavy-lower days or after upper sessions; target 150 min a week moderate activity total (WHO guidance, Bull et al. 2020).
- Sled drags or pushes 6-10 x 20-30 m (concentric only, little soreness) for GPP in the off-season.
- Optional 1 x short intervals (8-10 x 30 s bike at hard effort, 90 s easy) in the off-season to raise work capacity.
- No running intervals or long runs the day before heavy squats or deadlifts.
- Peak phase (final 3 weeks): conditioning reduced to easy walking and short bike sessions.

### 26.5 Weight class and meet logistics
- Weigh-in 2 h before lifting (IPF style) or 24 h (some federations). Policy 0.7: with a 2 h weigh-in, no acute cut; with a 24 h weigh-in, at most about 3% using low-residue diet and modest fluid manipulation, flagged above 5%.
- Attempt selection (coach practice): opener about 90-93% of current best (a weight you could triple on a bad day), second about 96-98%, third 100-103%.

### 26.6 Peaking (for the strength engine)
- Taper about 1-3 weeks, cut volume roughly 30-70% while keeping intensity; last heavy single or double at about 90-95% about a week out; final 2-4 days light or off (Travis et al. 2020; Pritchard et al. 2015).

### 26.7 Sources
- Aasa U, Svartholm I, Andersson F, Berglund L 2017. Injuries among weightlifters and powerlifters: a systematic review. BJSM 51(4).
- Strömbäck E et al. 2018. Prevalence and consequences of injuries in powerlifting: a cross-sectional study. Orthopaedic Journal of Sports Medicine 6(5).
- Travis SK et al. 2020 (see 0.8).
- Pritchard HJ et al. 2015. Tapering practices of New Zealand's elite raw powerlifters. JSCR 29(7).
- Bull FC et al. 2020. World Health Organization 2020 guidelines on physical activity and sedentary behaviour. BJSM 54(24).

---

## 27. Olympic weightlifting

### 27.1 Encoding block
- New `id`: `weightlifting`. `q`: `{maxStrength:3, power:3, rotational:0, unilateral:1, upperPull:2, upperPush:3, lowerBody:3, grip:2, neck:0, trunk:3, mass:1}`.
- `prehab`: `["shoulderER","wrist","lowback","patellar","ankle"]` plus overhead and ankle mobility. `season`: `{off:4, pre:4, in:4}` (sessions are the sport). `avoidBefore: null`. `confidence`: moderate.
- Needs a weightlifting builder mode (percentages of best snatch and clean and jerk, not general strength templates).

### 27.2 Demands and energy systems
- Snatch and clean and jerk: maximal power outputs among all sports; about 1-3 s per lift; alactic. Requires speed under the bar, deep receiving positions (ankle, hip, thoracic, shoulder mobility), and strong legs (front and back squat) (Storey and Smith 2012).
- Competition: 3 attempts per lift; about 1-2 min between own attempts depending on the field.

### 27.3 Injuries and prevention
Injury rates are low (Aasa et al. 2017). Common sites: low back, knee, shoulder, wrist, elbow.
| Area | Prevention |
|---|---|
| Knee (patellar tendon) | PATELLA, managing squat and jerk volume. |
| Low back | Positional strength (pulls, RDLs), back extension work. |
| Shoulder (snatch overhead) | CUFF, overhead stability (snatch-grip press, overhead squat holds), thoracic mobility. |
| Wrist (front rack, snatch) | WRIST, wrist wraps, front-rack mobility. |
| Elbow (missed jerks hyperextension) | Learn to bail safely; triceps strength. |

### 27.4 Fitting training together
- Amateur competitor: 3-5 sessions a week. Advanced: 6-10.
- Session order: snatch variant, clean and jerk variant, squat, pull, accessory. Heaviest lifting early in the week after rest.

### 27.5 Season structure (two to four competitions a year)
| Phase | Weeks | Sessions | Focus |
|---|---|---|---|
| Accumulation (`off`) | 4-6 | 4-5 | Volume: lifts at 70-80%, squats 4-6 x 4-6, hypertrophy accessories |
| Intensification (`pre`) | 3-4 | 4-5 | Lifts at 80-92%, squats 3-5 x 2-3, pulls heavy |
| Realisation / peak | 1-2 | 3-4 | Lifts to 90-100%, then taper |
| Transition | 1-2 | 2-3 light | Technique, general strength |

### 27.6 Session templates (intermediate, 4 days; % of best competition lift)
| Day | Lift 1 | Lift 2 | Strength | Accessory |
|---|---|---|---|---|
| 1 | Snatch: off 5 x 3 @ 70-75%; pre 6 x 2 @ 80-85%; peak 1RM work-up to 90-95% | Clean and jerk: off 5 x 2+1 @ 70-75%; pre 5 x 1+1 @ 80-87% | Back squat: off 5 x 5 @ 75%; pre 5 x 3 @ 85% | Pull-up 3 x 8, CUFF |
| 2 | Hang snatch / power snatch 5 x 2 @ 70% | Clean pull 4 x 3 @ 100-110% of clean | Snatch-grip RDL 3 x 6 | Back extension 3 x 12, WRIST |
| 3 | Snatch (as day 1, lighter by 5-10%) | Jerk from blocks or rack: off 5 x 3 @ 70%; pre 5 x 2 @ 85% | Front squat: off 4 x 4 @ 75%; pre 4 x 2 @ 85% | Push press 3 x 5, core |
| 4 | Snatch pull 4 x 3 @ 100% of snatch | Clean and jerk heavy day: pre work to heavy single at about 90% | Back squat 3 x 3 @ 80-85% | Single-leg, PATELLA |
Rep volume per intensity (Prilepin's chart, coach practice): 70-80%: 3-6 reps a set, about 12-24 total; 80-90%: 2-4 reps, about 10-20 total; above 90%: singles and doubles, about 4-10 total.

### 27.7 Conditioning
- Not a performance factor. Add 1-2 x 20-30 min easy cardio for health and work capacity; never before heavy lower-body days.

### 27.8 Testing benchmarks (adult men / women, intermediate competitor)
| Ratio (coach practice, widely used) | Target |
|---|---|
| Snatch as % of clean and jerk | about 80-83% |
| Clean and jerk as % of back squat | about 75-80% |
| Front squat as % of back squat | about 85% |
| Clean and jerk relative to BM | 1.2 x / 0.9 x (intermediate); 1.6 x+ / 1.2 x+ (national) |

### 27.9 Peaking
- Taper about 1 week, cutting volume about 40-45%, with athletes stopping training about 1.5 days before competition (Winwood et al. 2023).
- Last near-max singles (about 90-95%) 7-10 days out; final week singles at 80-85%; openers about 90-93% of best (coach practice).

### 27.10 Sources
- Storey A, Smith HK 2012. Unique aspects of competitive weightlifting: performance, training and physiology. Sports Medicine 42(9).
- Aasa et al. 2017 (see 26.7).
- Winwood PW, Keogh JWL, Travis SK, Pritchard HJ 2023. The tapering practices of competitive weightlifters. JSCR 37(4). https://research.bond.edu.au/en/publications/the-tapering-practices-of-competitive-weightlifters/

---

## 28. Strongman

### 28.1 Encoding block
- New `id`: `strongman`. `q`: `{maxStrength:3, power:3, rotational:1, unilateral:2, upperPull:3, upperPush:3, lowerBody:3, grip:3, neck:1, trunk:3, mass:2}`.
- `prehab`: `["lowback","shoulderER","copenhagen","patellar"]` plus biceps tendon care. `season`: `{off:4, pre:4, in:3}`. `confidence`: limited.
- Equipment check: needs log, axle, yoke, farmers handles, stones or sandbag (the `box` gym preset has some).

### 28.2 Demands and energy systems
- Events: max lifts (deadlift, log press, axle), loaded carries (yoke, farmers), moving events (sled or truck pull), loading events (atlas stones, sandbags), and repetition events (60-75 s). Alactic for max events; glycolytic for medleys and reps.
- Strongman competitors combine traditional powerlifting-style training with implement training, typically 1-2 event days a week (Winwood et al. 2011).

### 28.3 Injuries and prevention
Injury rate about 5.5 per 1000 h of training; low back, shoulder, bicep, knee and hand among the common sites, from both gym lifts and implements (Winwood et al. 2014; Keogh and Winwood 2017).
| Area | Prevention |
|---|---|
| Low back | Bracing, belt use for max lifts, BACK, progressive implement exposure. |
| Biceps (stones, mixed-grip deadlifts) | Avoid stone volume spikes; hook grip or alternate grip sides; build biceps tendon tolerance (curls, hammer curls 3 x 10). |
| Shoulder (log, axle, overhead) | CUFF, thoracic mobility. |
| Knee | PATELLA, yoke and carry progression. |
| Hip and adductor | COPEN. |

### 28.4 Fitting training together
- Typical: 4 days. Day 1 max deadlift and accessories; Day 2 overhead (log or axle) and upper accessories; Day 3 light squat and conditioning or rest; Day 4 events.
- Event day placed with 2 days' recovery before the deadlift day.

### 28.5 Season structure
| Phase | Weeks | Focus |
|---|---|---|
| Off | 6-12 | Max strength and hypertrophy on traditional lifts, low event volume |
| Pre (contest prep) | 8-12 | Events at contest weights, event-specific conditioning |
| Peak | 1-2 | Event openers only, taper |

### 28.6 Session templates (intermediate)
Day 1 (deadlift)
| Slot | Exercise | Off | Pre |
|---|---|---|---|
| Main | Deadlift (contest variant: axle, 18-inch pull, or standard) | 5 x 3 @ 80-85% | Work-up to a heavy double, or reps for a rep event (1 x max reps at contest weight, 3 weeks out) |
| Main 2 | Front squat or SSB squat | 4 x 5 @ 75% | 3 x 3 @ 80% |
| Accessory | RDL, back extension | 3 x 8 | 3 x 6 |
| Grip | Double overhand holds, axle holds | 3 x 15-30 s | |

Day 2 (overhead)
| Slot | Exercise | Off | Pre |
|---|---|---|---|
| Main | Log clean and press | 5 x 3 @ 80% | Contest weight for reps, or heavy singles |
| Main 2 | Push press / strict press | 4 x 5 | 3 x 3 |
| Accessory | Pull-up, row, close-grip bench | 3 x 8-10 each | |
| Prehab | CUFF, biceps tendon work | | |

Day 4 (events)
| Event | Off | Pre |
|---|---|---|
| Yoke | 4-5 x 20 m at moderate weight | 3-4 x 20 m at 90-100% contest weight |
| Farmers | 4 x 20-30 m | 3 x contest distance |
| Stones or sandbag | 3 x 3 to platform at 70-80% of max | Contest simulation 1-2 runs |
| Sled or truck pull | 4 x 15-20 m | 2 x contest distance |

### 28.7 Conditioning
- Event medleys are the conditioning (60-90 s efforts, 3-5 min rest). Add 2 x 20-30 min easy cardio for health; sled drags for GPP.

### 28.8 Testing benchmarks (community, novice to intermediate men / women)
- Deadlift 2.5 x / 2.0 x BM; log press 1.0 x / 0.7 x; yoke 20 m at 2.5 x / 2.0 x BM in under 20 s; farmers 20 m at 1.0 x BM per hand / 0.75 x.

### 28.9 Peaking
- Last heavy deadlift and heavy events about 10-14 days out (coach practice); final week: light openers and technique; rest 2 days before.

### 28.10 Sources
- Winwood PW, Keogh JWL, Harris NK 2011. The strength and conditioning practices of strongman competitors. JSCR 25(11).
- Winwood PW, Hume PA, Cronin JB, Keogh JWL 2014. Retrospective injury epidemiology of strongman athletes. JSCR 28(1).
- Keogh JWL, Winwood PW 2017. The epidemiology of injuries across the weight-training sports. Sports Medicine 47(3).

---

# PART F: EQUESTRIAN, MOTORSPORT, ESPORTS

## 29. Equestrian (dressage, show jumping, eventing)

### 29.1 Encoding block
- `id`: `horseriding`. `q`: `{maxStrength:1, power:1, rotational:1, unilateral:2, upperPull:2, upperPush:1, lowerBody:2, grip:1, neck:1, trunk:3, mass:0}` (unilateral 1 to 2 to address asymmetry; upperPull 1 to 2 for posture and rein contact; neck 1 for falls).
- `prehab`: `["lowback","copenhagen","hipAbd","hipRot","tspine"]` (adductor endurance and hip mobility). `season`: `{off:3, pre:2, in:2}`. `avoidBefore: null`. `confidence`: limited.

### 29.2 Demands and energy systems
- Dressage: sustained postural control and isometric trunk strength, fine motor control, symmetry.
- Show jumping: short rounds (about 60-90 s) with repeated jumping positions (squat-like isometric holds).
- Eventing cross-country: about 6-12 min at speed in a jumping position; rider heart rates reach high-intensity levels; fatigue reduces control (Douglas et al. 2012).
- Rider asymmetry (side-to-side differences in strength and flexibility) affects the horse; unilateral and mobility work addresses it.

### 29.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Falls: head injury, upper limb fractures, chest, spine (the dominant serious risk) (Havlik 2010) | Helmet to current standard, body protector for jumping, falling technique; fitness to stay in control late in a course. |
| Low back pain (common in riders) | BACK, hip flexor and hip rotation mobility, anti-extension core. |
| Hip and adductor strain | COPEN, HIPROT. |
| Kicks and crush injuries on the ground | Handling, not gym. |

### 29.4 Fitting the gym around riding
- Riders often ride daily (several horses). Gym 2-3 x 30-45 min. No major fatigue interaction: place sessions anywhere, avoiding very heavy legs before a competition.

### 29.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Winter (`off`) | 3 | Strength, symmetry, aerobic base |
| Pre-season | 2 | Strength endurance in riding positions, intervals for eventers |
| Competition | 2 | Maintain |

### 29.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | Goblet squat or front squat | 3 x 8 | 3 x 8 | 2 x 8 |
| Main 2 | Single-arm row `dbrow` | 3 x 10 each | 3 x 10 | 2 x 10 |
| Accessory | Split squat (both sides, match reps to weaker side) | 3 x 8 each | 3 x 10 | 2 x 8 |
| Accessory | Isometric jumping-position hold (quarter squat, hips back, arms forward) | | 3-4 x 45-90 s | 2 x 60 s |
| Prehab | COPEN + HIPROT | | | |
| Core | Pallof, side plank, bird dog | 3 x 30-40 s | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | Trap bar deadlift or RDL | 3 x 6-8 | 3 x 6 | 2 x 6 |
| Main 2 | Push-up / landmine press | 3 x 8-10 | | |
| Accessory | Face pull `facepull`, pull-up or pulldown | 3 x 12 / 3 x 8 | | |
| Accessory | Adductor machine or side-lying adduction | 3 x 12 | | |
| Prehab | TSPINE + BACK | | | |

### 29.7 Sport-specific conditioning
- Dressage and show jumping riders: 2 x 30 min aerobic a week.
- Eventers: aerobic base 2-3 x 30 min, plus intervals matching cross-country length: 3-4 x 3-4 min hard (bike or run), 2 min easy, in pre-season (coach practice).

### 29.8 Testing benchmarks (coach practice)
- Side plank time each side within 10%; single-leg balance eyes closed 30 s each side; jumping-position hold 2 min; push-ups 15+; aerobic test (e.g. 12 min run or 2 km row) for eventers.

### 29.9 Peaking
- Lighter gym in competition week; no new exercises; eventers keep a short interval session early in the week.

### 29.10 Sources
- Douglas JL, Price M, Peters DM 2012. A systematic review of physical fitness, physiological demands and biomechanical performance in equestrian athletes. Comparative Exercise Physiology 8(1).
- Havlik HS 2010. Equestrian sport-related injuries: a review of current literature. Current Sports Medicine Reports 9(5).

---

## 30. Motorsport (karting, single-seaters, saloon cars, rally)

### 30.1 Encoding block
- New `id`: `motorsport`. `q`: `{maxStrength:2, power:1, rotational:1, unilateral:1, upperPull:2, upperPush:2, lowerBody:2, grip:2, neck:3, trunk:3, mass:0}`.
- `prehab`: `["neck","shoulderER","wrist","lowback"]`. `season`: `{off:3, pre:3, in:2}`. `avoidBefore: "all"` (no hard sessions within 48 h of a race weekend). `confidence`: limited.
- Neck protocol for drivers emphasises lateral flexion (cornering) and extension and flexion (braking and acceleration).

### 30.2 Demands and energy systems
- High sustained g-forces: about 4-5 g in open-wheel racing during braking and cornering, with upper-body and neck fatigue a prominent response (open-wheel review 2021, Edith Cowan); neck strength is the main sport-specific adaptation in Formula 1 drivers (Tyler et al. 2026).
- Heart rate is high for long periods (maximum around 186 bpm reported in open-wheel studies), with heat stress from cockpit temperatures and fireproof clothing (Tyler et al. 2026; Potkanowicz and Mendel 2013).
- Karting (the most common amateur form) has no power steering and high lateral loads on the trunk and ribs; rally adds long stages with vibration.
- Concentration and reaction under fatigue and heat: fitness supports cognitive performance late in a race.

### 30.3 Injuries and prevention
| Injury | Prevention |
|---|---|
| Neck strain and fatigue | NECK-1 with lateral emphasis, 3x a week. |
| Rib and chest wall pain (karting) | Rib protector, seat fit, trunk strength. |
| Low back (vibration, seating) | BACK, hip mobility, seating position. |
| Wrist and forearm (steering, kickback) | WRIST, grip. |
| Crash injuries | Safety equipment; strength aids rehab. |

### 30.4 Fitting the gym around racing
- Races are usually at weekends; test days add load. Heavy sessions Monday to Wednesday, light Thursday, nothing hard Friday to Sunday in race weeks.
- Simulator sessions count as neck and concentration load.

### 30.5 Season structure
| Phase | Gym | Focus |
|---|---|---|
| Winter (`off`) | 3 | Max strength, neck capacity, aerobic base |
| Pre-season (`pre`) | 3 | Neck strength-endurance, heat acclimation before hot races, intervals |
| Season (`in`) | 2 | Maintain, recover between events |

### 30.6 Session templates
Day A
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | Trap bar deadlift `trapdl` | 4 x 5 @ 80% | 3 x 5 | 2 x 5 |
| Main 2 | Pull-up / row | 4 x 6-8 | 3 x 8 | 2 x 8 |
| Accessory | Leg press (brake pedal force) | 3 x 8-10 | 3 x 10 | 2 x 8 |
| Prehab | NECK-1: lateral flexion each side 3 x 15 + 30 s isometric holds | | 3 x 20 + 45-60 s holds | 2 x 15 |
| Core | Side plank, Pallof (lateral g) | 3 x 30-45 s | | |

Day B
| Slot | Exercise (key) | Off | Pre | In |
|---|---|---|---|---|
| Main | Goblet or front squat | 3 x 6-8 | 3 x 8 | 2 x 6 |
| Main 2 | DB bench or push-up | 3 x 8 | 3 x 10 | 2 x 8 |
| Accessory | Farmers carry, plate pinch, wrist roller | 3 x 30 m / 30 s | | |
| Prehab | NECK-1 (flexion and extension) + CUFF + WRIST | | | |
| Core | Suitcase carry, anti-rotation | 3 x 20 m each | | |

### 30.7 Sport-specific conditioning
- Aerobic base 2-3 x 30-45 min zone 2 (bike or run); VO2max around 60 ml/kg/min reported in open-wheel drivers (open-wheel review 2021).
- Race-length intervals: e.g. 2-4 x 10-15 min at high aerobic intensity, 3-5 min easy.
- Heat acclimation before hot races: 7-14 days of 60-90 min exercise in heat or wearing extra layers (coach practice, following general heat acclimation guidance).

### 30.8 Testing benchmarks (coach practice)
- Neck isometric force by direction (dynamometer or loaded harness holds), left-right within 10%; grip strength; plank 2 min; side plank 60 s each; VO2max or a 5 km bike or 2 km row test.

### 30.9 Peaking
- Race week: one strength session early (2-3 sets), neck isometrics 2x, hydration and sleep; no new training stresses.

### 30.10 Sources
- Tyler CJ, Felton L, Ferrari A, Keedle K, Manwaring R, Buoite Stella A 2026. Physiological and health demands of Formula 1 motor racing: a comprehensive review with driver performance coach insight. BJSM 60(9). https://bjsm.bmj.com/content/60/9/649
- Review of the physiological responses to open-wheeled racing with current trends in testing and strength training 2021 (Edith Cowan University). https://lida.sport-iat.de/ta/Record/4068839?lng=en
- Potkanowicz ES, Mendel RW 2013. The case for driver science in motorsport: a review and recommendations. Sports Medicine 43(7).

---

## 31. Esports (posture, health and performance support)

### 31.1 Encoding block
- New `id`: `esports`. `q`: `{maxStrength:1, power:0, rotational:0, unilateral:1, upperPull:2, upperPush:1, lowerBody:1, grip:1, neck:1, trunk:2, mass:0}`.
- `prehab`: `["wrist","tspine","shoulderER","neck"]` (neck here = deep neck flexor endurance and posture, low load). `season`: `{off:3, pre:3, in:2}`. `avoidBefore: null`. `confidence`: limited (evidence is mostly surveys and one small trial).
- Honest framing for the app: the gym does not make you better at the game directly. It protects health, posture, and wrists, and regular activity breaks support thinking during long sessions.

### 31.2 Demands
- Long sedentary sessions (often 5-10 h a day for competitive players), very high fine-motor demand of hands and wrists, sustained visual attention.
- In collegiate esports players, eye fatigue (56%), neck and back pain (42%), wrist pain (36%) and hand pain (32%) were common, and 40% did no physical activity (DiFrancisco-Donoghue et al. 2019).
- A 6-min walking break during 2 h of play improved executive function compared with a rest break, without affecting in-game performance (DiFrancisco-Donoghue et al. 2021).

### 31.3 Problems and prevention
| Problem | Prevention |
|---|---|
| Neck and upper back pain | Set-up (screen at eye level, about an arm's length away), TSPINE, chin tucks 2 x 10, rows and face pulls. |
| Wrist and hand pain (tendinopathies, nerve symptoms) | WRIST, neutral wrist on mouse and keyboard, warm-up of hands before play, breaks. Numbness or night pain = medical review. |
| Low back pain | Hip hinge strength, glute work, BACK, standing breaks. |
| Eye strain | Regular visual breaks (look at something about 6 m away for 20 s every 20 min, coach practice). |
| Inactivity and cardiometabolic risk | WHO targets: 150-300 min moderate activity a week plus strength training on 2+ days (Bull et al. 2020). |

### 31.4 Fitting training around play
- 2-3 full-body sessions a week of 30-45 min, plus daily walking; 5-10 min activity breaks every hour of play.

### 31.5 Season structure
- Off-season: 3 sessions; competitive season: 2-3 (keep them; they support sleep and mood). No heavy taper needed.

### 31.6 Session templates (both days, repeat or alternate)
| Slot | Exercise (key) | Sets x reps |
|---|---|---|
| Main | Goblet squat `goblet` or leg press | 3 x 8-10 (RIR 2) |
| Main 2 | Row `csdb` or seated cable row | 3 x 10 |
| Accessory | Push-up or DB bench | 3 x 8-12 |
| Accessory | RDL or hip thrust | 3 x 10 |
| Accessory | Pulldown or pull-up | 3 x 8-10 |
| Prehab | Face pull 2 x 15, prone Y-T-W 2 x 8, chin tucks 2 x 10, wrist flexion/extension 2 x 15 | |
| Core | Dead bug, side plank | 2 x 30 s |
Plus mobility 5 min: open book, doorway pec stretch, hip flexor stretch.

### 31.7 Conditioning
- 3 x 20-30 min zone 2 a week (brisk walk, bike), plus step goal (about 7,000-10,000 a day, coach practice).

### 31.8 Benchmarks
- Weekly activity minutes, step count, resting heart rate trend, push-ups, plank time, pain-free play hours. (Coach practice.)

### 31.9 Before a tournament
- Keep sleep regular, keep activity breaks, a 10 min warm-up (light cardio, hand and wrist mobility) before matches (coach practice).

### 31.10 Sources
- DiFrancisco-Donoghue J, Balentine J, Schmidt G, Zwibel H 2019. Managing the health of the eSport athlete: an integrated health management model. BMJ Open Sport and Exercise Medicine 5(1).
- DiFrancisco-Donoghue J et al. 2021. Breaking up prolonged sitting with a 6 min walk improves executive function in women and men esports players: a randomised trial. BMJ Open Sport and Exercise Medicine 7(3). https://bmjopensem.bmj.com/content/7/3/e001118
- Bull FC et al. 2020. WHO 2020 guidelines on physical activity and sedentary behaviour. BJSM 54(24).

---

# PART G: ENCODING SUMMARY

## 32. Profile changes and additions at a glance
| Sport | id | New? | Key `q` changes vs current | `prehab` (in priority order) | season off/pre/in | avoidBefore | Gym adds conditioning? | Weight class? |
|---|---|---|---|---|---|---|---|---|
| Boxing | boxing | no | upperPull 1 to 2 | neck, shoulderER, wrist, tspine* | 3/2/1 | all (was upper) | only if under 4 sport sessions | yes |
| MMA | mma | no | none | neck, shoulderER, lowback, fingers, copenhagen | 3/2/2 | all | only if under 3 hard sessions | yes |
| BJJ | bjj | no | none | neck, fingers, shoulderER, lowback, copenhagen | 3/2/2 | all | only if under 3 hard rolls | no acute cut |
| Judo | judo | no | none | neck, shoulderER, fingers, lowback, landing | 3/2/2 | all | yes in pre | yes |
| Wrestling | wrestling | no | none | neck, shoulderER, lowback, landing, copenhagen | 3/2/2 | all | yes in pre | yes |
| Muay Thai / kickboxing | kickboxing | no | none | neck, hipAbd, ankle, shoulderER, copenhagen, calf | 3/2/1 | all | yes | yes |
| Climbing | climbing | no | none | fingers (gated), shoulderER, wrist, scap* | 3/2/2 | upper | ARC and 4x4s | no |
| Golf | golf | no | maxStrength 1 to 2, power 2 to 3 | lowback, hipRot*, tspine*, shoulderER, wrist | 3/2/1 | null | health only | no |
| Swimming | swimming (+event) | variant | sprint/distance split | shoulderER, scap*, tspine*, lowback, copenhagen | 3/3/2 sprint, 2/2/1 distance | upper | no | no |
| Road cycling | cycling | no | power 1 to 2, neck 0 to 1 | lowback, hipAbd, tspine* | 3/2/1 | lower | no | no |
| Track cycling | trackcycling | yes | see 11.1 | lowback, hipAbd, nordic | 3/3/2 | lower | no (on bike) | no |
| MTB | mtb (+event) | variant | gravity variant | shoulderER, wrist, lowback, neck | 3/2/1 | lower | gravity circuits | no |
| Rowing | rowing | no | none | lowback, hipAbd, wrist, tspine* | 3/2/2 | all | no | lightweights |
| Canoe / kayak | kayaking (+event) | variant | sprint variant | shoulderER, scap*, wrist, lowback, tspine* | 3/3/2 | upper | no | no |
| Alpine skiing | alpineskiing | no | none | landing, hipAbd, nordic, lowback, copenhagen | 3/2/1 | lower | yes | no |
| Snowboarding | snowboarding | no | power 2 to 3 | landing, wrist, ankle, tspine* | 3/2/1 | lower | yes | no |
| Surfing | surfing | no | maxStrength 1 to 2, power 2 to 3 | shoulderER, scap*, tspine*, lowback, landing | 3/2/1 | upper | paddle endurance | no |
| Sailing | sailing (+event) | variant | grinder variant | lowback, shoulderER, wrist, patellar* | 3/2/1 | null | hiking intervals | no |
| Sprinting | sprinting | no | none | nordic, calf, copenhagen, hipAbd | 3/3/2 | lower | no (track) | no |
| Jumps | jumps | no | none | landing, calf, nordic, patellar*, ankle | 3/3/2 | lower | no (track) | no |
| Throws | throws (+event) | variant | javelin variant | shoulderER, lowback, scap*, tspine* | 3/3/2 | all | minimal | no |
| Middle distance | middledistance | yes | see 22.1 | calf, nordic, hipAbd, ankle, shin* | 2/2/1 | lower | no (running) | no |
| Gymnastics | gymnastics | no | none | wrist, landing, ankle, shoulderER, lowback, calf | 3/2/2 | all | routine sims | no |
| Dance | dance | no | maxStrength 1 to 2, lowerBody 2 to 3, trunk 2 to 3 | calf, ankle, landing, hipAbd, hipRot* | 3/2/2 | lower | yes | no |
| CrossFit | crossfit | yes | see 25.1 | shoulderER, scap*, lowback, wrist, patellar* | 5/5/4 | null | yes (core of sport) | no |
| Powerlifting | powerlifting | yes (strength engine) | n/a | shoulderER, scap*, lowback, copenhagen, patellar* | engine | null | health and GPP | yes |
| Weightlifting | weightlifting | yes | see 27.1 | shoulderER, wrist, lowback, patellar*, ankle | 4/4/4 | null | health only | yes |
| Strongman | strongman | yes | see 28.1 | lowback, shoulderER, copenhagen, patellar* | 4/4/3 | null | event medleys | some classes |
| Equestrian | horseriding | no | unilateral 1 to 2, upperPull 1 to 2, neck 0 to 1 | lowback, copenhagen, hipAbd, hipRot*, tspine* | 3/2/2 | null | eventers | no |
| Motorsport | motorsport | yes | see 30.1 | neck, shoulderER, wrist, lowback | 3/3/2 | all | yes (aerobic, heat) | no |
| Esports | esports | yes | see 31.1 | wrist, tspine*, shoulderER, neck | 3/3/2 | null | health only | no |
`*` = proposed new `PREHAB` key.

## 33. Hard rules to encode (safety and quality gates)
1. Combat sports: neck work every week, all year, 2-3x (1-2x in the peak week); no neck bridging for amateurs.
2. Weight-making: no dehydration-based acute cuts for amateurs; none at all for under-18s or same-day weigh-ins; flag any plan above 5% acute loss; chronic loss 0.5-1% body mass a week.
3. Climbing: no hangboard under 16; no hangboard before about 18-24 months of regular climbing; maximum 2 finger sessions a week, 48 h apart; load increases capped at about 2-5% body mass a week; no campus board unless advanced; sharp finger pain stops the session.
4. Hamstring-dominant sports (sprints, jumps, middle distance, track sprint cycling, alpine skiing): Nordic all year, with an introductory ramp and low-volume maintenance.
5. Overhead and paddling sports (swimming, kayak, surfing, throws, climbing, CrossFit, weightlifting): rotator cuff and scapular work 2-3x a week; pulling sets at least equal to pressing sets.
6. Snowboarding: recommend wrist guards and a helmet in the plan notes.
7. Golf: rotational med ball power and hip and thoracic rotation in every session; heavy legs not within 48 h of a competitive round.
8. Endurance sports: heavy, low-rep strength (not high-rep "endurance" lifting); 2x a week off-season, 1x a week in season keeps the gains; strength before endurance when they share a session.
9. Gymnastics and youth athletes: follow youth resistance-training consensus; no unsupervised 1RM testing; wrist or extension-based back pain = refer.
10. Peaking: last heavy lift 5-10 days out (7-10 for most), volume down 40-60%, intensity kept, no new exercises in the final 2 weeks, no maxing within 10 days of the event.
11. Gym conditioning is only added where sport practice does not already provide it; ask the athlete how many hard sport sessions they do.
12. Under-18s, pregnancy, or concussion history: route to conservative defaults and medical clearance prompts.
