# Sport-specific S&C programming: team and racket sports

Research brief for AJ Training's "Train for my sport" builder. Written 22 October 2026.

Purpose: replace the generic `sportBlueprint` / `SPDOSE` logic with programming a strength and conditioning coach at a professional club would recognise, scaled for amateurs. Every sport section follows the same structure so it can be encoded as data (see Part 0.9 for a suggested schema).

How to read the numbers:
- Match demand figures are from elite or sub-elite tracking studies unless stated. Amateur players typically cover 10 to 25% less distance and much less high-speed running, but the pattern (what is hard, what gets injured) is the same.
- Benchmarks are bands, not pass marks. The app should show them as "club / good club / elite" bands and track change over time, which matters more than the absolute value.
- Where something is coaching practice rather than trial evidence, it is labelled **(practice)**. Everything else is cited in the sport section or in Part 0.10.

---

## Part 0. Shared rules (apply to every sport unless the sport section overrides them)

### 0.1 Levels

| Code | Who | Lifting rules |
|---|---|---|
| N (new) | Under ~6 months of consistent lifting, or returning after a long lay-off | Technique first. RIR 3 (3 reps left in the tank). No Olympic lifts, no depth/drop jumps, no barbell front squat or conventional deadlift (existing `SP_NEW_AVOID` is right). Plyos are low-amplitude (pogo, snap-downs, low box jumps). Nordics start as band-assisted or partial range. |
| I (intermediate) | 6 months to 2 years, can squat about bodyweight for reps | %1RM or RIR 2. Loaded jumps, trap bar jumps, kettlebell swings. Hang power clean only if coached. |
| A (advanced) | 2+ years, back squat at or above ~1.5 x body mass (men) / ~1.25 x (women) | Full menu, including contrast pairs (heavy lift then jump), drop jumps, cleans. |

### 0.2 Phases and the default dose (team sports)

| Phase | Typical length (amateur) | Gym sessions / week | Main strength | Power | Plyo contacts / session | Notes |
|---|---|---|---|---|---|---|
| OFF (general prep) | 4 to 8 weeks after the season ends, after 1 to 2 weeks of full rest | 3 (2 if also doing 3+ runs) | N 3x8-10 RIR3; I 4x5-6 @ 75-82%; A 4-5x3-5 @ 80-87% | 3x3-5 jumps or throws, submaximal | 40 to 80, mostly low/moderate intensity | Build strength and muscle (hypertrophy accessories 3x8-12). Aerobic base and tissue capacity. Highest volume of prehab. |
| PRE (specific prep) | 6 to 8 weeks before the first fixture | 2 to 3 | N 3x6-8 RIR2-3; I 3-4x4-5 @ 80-85%; A 4x2-4 @ 85-90% | 3-4x3-5, max intent; contrast pairs for A | 60 to 100, adds reactive (drop jumps for A, hurdle hops for I) | Convert strength to power. Conditioning becomes sport-specific (intervals, RSA). Sprint exposure built to near-max. |
| IN (competition) | The season | 1 to 2 (2 if one match a week and the athlete is I/A; 1 if the week is busy) | Low volume, high intensity: N 2-3x6 RIR2; I 2-3x3-5 @ 80-85%; A 3x2-3 @ 85-90% | 2-3x3, max intent | 20 to 40 | Hold strength and power (Rønnestad 2011: 1 a week maintains; 1 every 2 weeks loses). Session 30 to 45 min. Never take a set close to failure in season. |
| CONG (congested: 2+ matches in 7 days) | Any week | 0 to 1 | One short "maintenance" session: 2x3 @ 80% of one lower lift, one upper lift, prehab | 2x3 jumps or throws | 10 to 20 | Recovery first. Keep Nordic/Copenhagen at 1 set. |
| TAPER (key match / tournament) | 7 to 14 days | Keep frequency, cut volume 40 to 60% | Keep intensity (load), drop sets | Keep, 2x2-3 | 10 to 20 | Pyne, Mujika & Reilly 2009; Bosquet 2007. Details per sport. |

Individual / racket sports use the same table, but "IN" is defined by tournament blocks rather than a fixed weekly match (see each racket section).

### 0.3 Session order (every gym session)

1. Warm-up (8 to 10 min): raise, mobilise, activate. Use the sport's prevention warm-up where one exists (FIFA 11+, Activate, GAA 15, NetballSmart/KNEE, OSTRC shoulder). It counts towards prehab dose.
2. Power / plyometrics / throws: while fresh. Full recovery (rest 90 s to 3 min). Stop if jump height drops visibly.
3. Main strength lift(s): 1 lower + 1 upper (paired as a superset with the antagonist only if time is short).
4. Accessories: unilateral lower, pulling, sport-specific (e.g. rotational, neck, grip).
5. Prehab: the sport's highest-evidence items first (Nordic, Copenhagen, shoulder ER, neck, calf).
6. Trunk: anti-rotation / anti-extension / lateral.
7. Conditioning (only if it is the planned conditioning day): after lifting, or better, 6+ hours apart from a power session (Schumann 2022: same-session concurrent training blunts explosive gains).

Rest defaults: power 2 to 3 min; main lift 2.5 to 3 min (A at >85%: 3 to 4 min); accessories 90 s; prehab 60 s; trunk 45 to 60 s.

### 0.4 Match-day (MD) placement rules

Notation: MD = match day; MD-1 = day before; MD+1 = day after.

| Rule | One match a week (e.g. Saturday) | Two matches a week (e.g. Sat + Wed) |
|---|---|---|
| Heaviest lower-body / most eccentric work (heavy squats, Nordics, high-volume plyos) | MD-4 or MD-3 (Tue/Wed). Needs 72 h+ before kick-off (practice; consistent with soreness and force-recovery time courses after eccentric work). | MD+2 if the gap is 3 days; otherwise skip and keep 1 set of prehab. |
| Upper-body strength | MD-4 to MD-2 | MD+2 or MD-2 |
| Power / primer (low volume, high intent: 2-3x2-3 jumps, 2x2 at 80-85%) | MD-2 or MD-1 (or match-morning for A) | MD-1 |
| Hardest conditioning (RSA, HIIT) | MD-4 (intensive: short, sharp, change of direction) and MD-3 (extensive: longer intervals, max-velocity sprints) | Not added; matches are the conditioning. Top up subs/non-starters on MD+1. |
| Recovery | MD+1: walk/bike/swim 20 to 30 min, mobility, upper-body pump optional | Same |
| Rest | MD+2 full rest for amateurs (training Tue/Thu, match Sat) | Same |

Amateur default week (club training Tue and Thu evenings, match Saturday):
- Sun: MD+1 recovery.
- Mon: gym A (strength, lower emphasis). MD-5.
- Tue: club training.
- Wed: gym B (upper + power + prehab) or rest if Tuesday was heavy. MD-3.
- Thu: club training (usually the harder session).
- Fri: rest or 15-min primer (MD-1).
- Sat: match.

When the app asks "match day", it should also ask "club training days", and place gym sessions so that the heavy lower day is never within 48 h after a hard club session that ended late, nor within 72 h before the match.

### 0.5 Standard prevention modules (encode once, reuse)

Each module has an evidence grade: **Strong** (RCTs or meta-analysis show injury reduction), **Moderate** (prospective risk factor or a single RCT), **Practice** (expert consensus).

| Key | Module | Exercises (existing app keys in brackets) | Dose OFF/PRE | Dose IN | Evidence |
|---|---|---|---|---|---|
| `nordic` | Nordic hamstring | Nordic curl (`nordicham`); regressions: band-assisted Nordic, slider curl (`slidecurl`), GHR (`ghr`) | Petersen progression: wk1 1x/wk 2x5; wk2 2x/wk 2x6; wk3 3x/wk 3x6-8; wk4 3x/wk 3x8-10; wk5-10 3x/wk 3 sets of 12-10-8. Amateur practical: 2x/wk 2-3x4-6 (low volume preserves adaptations: Presland 2018) | 1x/wk 2x4-6 (Petersen used 1x/wk 3x12; low volume is enough). Place MD-4 or earlier. | Strong (Petersen 2011: ~70% fewer hamstring injuries overall, ~85% fewer recurrences; van Dyk 2019 meta: up to 51%) |
| `copenhagen` | Adductor (groin) | Copenhagen plank short lever (knee on bench) to long lever (ankle on bench), Copenhagen adduction dynamic reps (`copen`), adductor machine (`adductor`), squeeze isometrics | Harøy programme: 3 levels, 1 set per side, 2-3x/wk, reps progress ~3-5 to 12-15 per side | 1x/wk, 1-2 sets per side | Strong (Harøy 2019: 41% lower odds of groin problems) |
| `shoulderER` | Overhead shoulder (OSTRC programme) | Sleeper/cross-body internal rotation stretch (new key `sleeper`), band ER at 90/90 (new key `er9090`; else `bander`), side-lying ER (`sideer`), Y-T-W (`ytw`), push-up plus / serratus wall slide (new key `pushupplus`), thoracic rotation (new key `tspine`) | 3x/wk as part of warm-up, 10 min: ER 3x10-15, ITR stretch 3x30 s, scapular 2-3x10 | 3x/wk as warm-up (it is short and should not drop in season) | Strong (Andersson 2017: 28% fewer shoulder problems in elite handball) |
| `neck` | Neck strength (collision) | 4-way isometrics against hand or partner (`neckiso`), 4-way banded (`neckband`), neck harness extension (new key `neckharness`, A only), prone/supine bridges only for A under supervision (practice) | 2-3x/wk: isometrics 4 directions x 3 x 10-15 s at ~50-70% effort, building to ~80%; banded 2-3x12-15 each direction | 2x/wk (Activate dose: 3 short sessions a week) | Moderate (Activate RCTs: 59-60% less concussion in compliant groups, programme includes neck work; Collins 2014 observational; Naish 2013 retrospective) |
| `landing` | ACL / knee: landing, cutting, deceleration | Single-leg hop and stick (`hopstick`), drop landing to stick, lateral bound and stick (`latbound`), 45° cut technique, deceleration drills (new key `decel`), single-leg squat to box, Nordics, lateral band walks | 2-3x/wk, 15-20 min (FIFA 11+, Knee Control, PEP) | 2x/wk as warm-up | Strong (Webster & Hewett 2018: ~50% fewer ACL injuries overall, ~67% fewer non-contact in females; Waldén 2012) |
| `ankle` | Ankle sprain prevention | Single-leg balance progressions (`slbalance`), eyes closed, on unstable surface, with ball catches; hop-to-stabilise | 3-5x/wk, 5-10 min | 2-3x/wk | Strong (McGuine & Keene 2006; Schiftan 2015: ~35% fewer sprains, most in those with a previous sprain). Players with a previous sprain: also brace or tape for matches (Doherty 2017; McGuine 2011) |
| `calf` | Calf / Achilles capacity | Standing calf (`standcalf`), seated calf (`seatedcalf`, soleus), single-leg on step (`stepcalf`), pogo hops (`pogo`) | 3x/wk: 3x8-12 heavy + 3x15-25 single-leg | 2x/wk 2x10-15 | Practice/Moderate (soleus and calf capacity are standard Achilles and calf-strain prevention in racket sports and cricket; strongest evidence is for rehab) |
| `patellar` | Patellar tendon (jumping sports) | Spanish squat isometric (new key `spanishsq`), decline single-leg squat (new key `declinesq`), slow heavy leg extension (`legext`), monitoring jump counts | Isometric 4-5 x 30-45 s; heavy slow resistance 3-4x6-8 (3 s up / 3 s down) | 2x/wk isometrics | Moderate for management (Kongsgaard 2009 HSR), Practice for prevention; load spikes are the main risk (Visnes & Bahr 2013) |
| `hipAbd` | Hip abduction / lateral hip | Side-lying hip abduction, banded side walk (`bandabd`), abductor machine (`abductor`), side plank with top-leg abduction | 2-3x/wk 2-3x12-15 | 1-2x/wk | Moderate (adductor:abductor ratio; Tyler 2001; part of ACL programmes) |
| `trunkLat` | Side strain / lateral trunk (throwers, fast bowlers) | Side plank (`sideplank`), side plank with reach, suitcase carry (new `suitcase`; else `farmers`), Pallof (`pallof`), cable woodchop (`woodchop`), landmine rotation (`landrot`) | 3x/wk 2-3 sets | 2x/wk | Practice (side strain is common in fast bowling and throwing; prevention trials absent) |
| `lowback` | Lumbar capacity | Back extension (`hipext`), reverse hyper (`revhyp`), McGill curl-up (new key `mcgillcu`), bird dog (new key `birddog`), side plank | 2-3x/wk | 2x/wk | Practice / Moderate (trunk endurance) |
| `elbow` | Elbow and forearm (throwers, racket) | Wrist flexion/extension (`wristcurl`), pronation/supination with hammer or club (new key `pronsup`), radial/ulnar deviation, grip, eccentric wrist extension (Tyler twist with flexbar, new key `flexbar`) | 2-3x/wk 2-3x12-15 | 2x/wk | Moderate (Sakata 2018 Yokohama Baseball-9 reduced medial elbow injury; Practice for tennis/padel elbow prevention) |
| `hipFlex` | Hip flexor / rectus femoris (kicking codes) | Banded hip flexor march (new key `hipmarch`), long-lever hip flexion isometric, reverse Nordic (`nordic` in the current library = reverse Nordic), Bulgarian split squat | 2x/wk 2-3x8-10 | 1x/wk | Practice (rectus femoris strains are the main quad injury in kicking sports; prevention evidence is limited) |

Important naming fix for the programmer: the library key `nordic` is "Reverse nordic curl" (quads) while the `PREHAB.nordic` group means Nordic hamstring curls (`nordicham`). Keep them clearly separate when encoding `hipFlex` and `nordic` modules.

### 0.6 Standard conditioning methods (shared library)

| Key | Method | How to prescribe | Use for |
|---|---|---|---|
| `ift1515` | 15 s run / 15 s rest intervals | 2-3 sets of 6-10 min, 3 min between sets, at 90-95% of the 30-15 IFT final speed (VIFT); amateurs without a test: RPE 8-9 on the run | Aerobic power for field sports (Buchheit 2008, 2010) |
| `ift3030` | 30 s / 30 s | 2-3 sets of 6-8 min at 85-90% VIFT | Pre-season aerobic power |
| `long4x4` | 4 x 4 min at 90-95% HRmax, 3 min active recovery | 1x/wk OFF/PRE | Aerobic base (Helgerud 2001 in football) |
| `rsa` | Repeated sprint ability | 2-3 sets of 6 x 20-30 m sprints (or 6 x 6 s on a bike), 20-25 s rest, 4-5 min between sets; add a 180° turn for court sports | PRE and early IN, MD-4 |
| `rht` | Repeated high-intensity effort (collision codes) | Sprint 20 m, down to ground, up, sprint 10 m, tackle bag or wrestle 5 s, repeat; 3-4 sets of 4-6 efforts, 30 s rest, 3 min between sets | Rugby league/union, AFL, Gaelic, American football (Gabbett 2008, 2012) |
| `maxv` | Maximal velocity exposure | 3-5 x 30-40 m build-ups reaching >90-95% of top speed, full recovery (2-3 min). Once or twice a week | Hamstring injury mitigation in running sports (Malone 2017 Gaelic: exposure to max velocity protective; Colby, Buchheit and others; practice consensus) |
| `ssgEquiv` | Small-sided game equivalent on your own | 4-6 x 2-3 min of random change-of-direction work (cones, ball, wall), 1-2 min rest; or 1v1/2v2 with friends | Replaces SSGs for players training alone |
| `courtHIIT` | On-court intervals (racket / court sports) | Ghosting or shuttle patterns: e.g. 10-20 s work / 10-20 s rest x 8-12, 2-4 sets; plan the work:rest to the sport's typical rally:rest ratio | Racket sports, basketball, netball |
| `tempo` | Extensive tempo runs | 10-20 x 100 m at ~65-70% max speed, walk 100 m between | OFF base, MD+1 or MD-3 for non-starters |
| `bike` | Low-impact intervals | 6-10 x 30 s hard / 30 s easy, or 4 x 4 min | Injured players, heavy-legs weeks |

30-15 Intermittent Fitness Test (Buchheit 2008): 30 s shuttles over 40 m with 15 s walking recovery, starting at 8 km/h and increasing 0.5 km/h each stage. The final completed speed (VIFT) is the prescription anchor. Amateur team sport men typically finish 17 to 19 km/h; elite football and rugby backs 19.5 to 21.5 km/h; women 2 to 3 km/h lower.

Yo-Yo Intermittent Recovery Level 1 (Bangsbo 2008): 2 x 20 m shuttles at increasing speed with 10 s active recovery. Elite male football ~2,200 to 2,600 m; sub-elite ~1,600 to 2,000 m; recreational ~1,000 to 1,600 m; elite female ~1,200 to 1,700 m.

### 0.7 Standard tests (encode as a test battery the user can log every 6 to 8 weeks)

| Key | Test | How | Notes |
|---|---|---|---|
| `sprint10`, `sprint20`, `sprint30`/`sprint40` | Linear sprint | Timing gates or phone app (e.g. high-speed video); 0.5 m behind the start line, best of 3, 2-3 min rest | 10 m = acceleration; 30-40 m = max velocity |
| `cmj` | Countermovement jump | Hands on hips, jump mat or phone app (validated: My Jump), best of 3 | Also a daily readiness check (a drop of >5-10% from baseline = reduce load: practice) |
| `sljump` | Single-leg CMJ or hop for distance | Each leg, best of 3 | Limb asymmetry above ~10-15% is a flag (practice, mainly from ACL return-to-sport) |
| `505` | 505 change-of-direction test | 10 m run-in, time the 5 m to the line, 180° turn and 5 m back; both sides | COD deficit = 505 time minus 10 m sprint time (Nimphius 2016) |
| `yoyo1` / `ift3015` | Yo-Yo IR1 or 30-15 IFT | See 0.6 | Use one consistently |
| `bronco` | Bronco test (rugby) | 5 sets of 20 m + 40 m + 60 m shuttles (1,200 m) continuous, time | Rugby union and league |
| `rm3` | Estimated 1RM | 3-5RM on squat or trap bar, bench, pull-up (bodyweight + load) | Report as x body mass |
| `nhforce` | Nordic or isometric hamstring force | NordBord or a cheap load cell; at home: Nordic break-point angle | Risk thresholds: AFL < 256 N early pre-season (Opar 2015); football < 337 N (Timmins 2016) |
| `squeeze` | Adductor squeeze | Sphygmomanometer cuff or handheld dynamometer between knees at 45°, or long lever | Track drops > 15% as groin warning (practice) |
| `erir` | Shoulder ER and IR range and ER strength | Goniometer / phone; ER:IR strength ratio ~0.66 or more | Overhead sports (Wilk 2011, 2015: ER deficit and total range deficit increase injury risk in pitchers) |
| `sebt` | Y-balance / star excursion | Anterior reach difference > 4 cm is a flag (Plisky 2006) | Court and racket sports |

### 0.8 Readiness and load management (all sports)

- Use session RPE x minutes (sRPE) for every club session, match and gym session. Flag a week-on-week jump of more than ~30%, and weeks where acute load is more than ~1.5 x the 4-week average (Gabbett 2016; Hulin 2014). Treat the ratio as a prompt, not a predictor: the ACWR has known statistical problems, so use it to avoid spikes, not to chase a number.
- Morning readiness (sleep, soreness, mood, 1-5 each) can auto-reduce the day: total score in the bottom 20% of the player's own range = drop the power block to 2 sets and skip the conditioning finisher (practice).
- After a match: no heavy eccentric lower work for 48 h (practice; CMJ and sprint performance typically take 48-72 h to return after football and rugby matches: Nédélec 2012; McLellan 2011).

### 0.9 Suggested data schema for encoding

```js
sportPlan = {
  id, name, variants: [{id:"bowler", name:"Fast bowler"}, ...],          // positional / role variants
  demands: {matchMin, totalDistM, hsrM, sprints, accels, cod, jumps, collisions, throwsOrStrokes, workRest, energy},
  q: {...existing 0-3 demand scores...},
  prehab: [{key:"nordic", grade:"strong", off:"2x/wk 3x6", in:"1x/wk 2x5", priority:1}, ...],
  season: {off:{weeks:6, gym:3, cond:2}, pre:{weeks:6, gym:2, cond:2}, in:{gym:1-2, cond:0-1}, cong:{gym:0-1}},
  mdRules: {heavyLowerMinGapH:72, upperMinGapH:48, primerDay:"MD-1", avoidBefore:"lower"},
  sessions: {off:[A,B,C], pre:[A,B], in:[A,B], cong:[A]},              // slot lists: [slot, role, exercise options, setsRepsByLevel, rest]
  conditioning: {off:[...keys], pre:[...], in:[...]},
  tests: [{key:"sprint10", bands:{club:"1.85-1.95 s", good:"1.75-1.85 s", elite:"<1.75 s"}}, ...],
  taper: {days:10, volumeCut:0.5, lastHeavyLower:"MD-5", lastHardCond:"MD-4"},
  sources: [...]
}
```

Notes on the existing code:
- `SPDOSE` treats every sport identically by season. Replace with per-sport, per-phase, per-level set/rep/intensity tables (above and per sport).
- `sportBlueprint` derives slots only from `q`. Add explicit per-sport slot lists (each sport section gives them), falling back to the current logic for sports not covered here.
- `avoidBefore` only blocks the day before the match. Replace with hour-based gaps by session type (0.4), because a heavy squat 2 days out still hurts a footballer.
- Add new exercise keys flagged in this document: `trapjump` (trap bar jump), `dropjump`, `hurdlehop`, `splitjump`, `mbscoop` (med ball scoop toss), `mbshotput` (rotational shot put throw), `mboverhead` (overhead med ball throw), `sledsprint`, `decel`, `isohams` (isometric hamstring bridge/long-lever), `spanishsq`, `declinesq`, `sleeper`, `er9090`, `pushupplus`, `tspine`, `neckharness`, `pronsup`, `flexbar`, `hipmarch`, `suitcase`, `mcgillcu`, `birddog`, `tibraise` (tibialis raise), `lateralLunge` (lateral/Cossack lunge), `skaterjump`, `bandedRSA` (no new kit), `bikeSprint`.

### 0.10 Shared evidence (referenced from sport sections)

- Petersen J et al. 2011. Preventive effect of eccentric training on acute hamstring injuries in men's soccer: a cluster-randomized controlled trial. Am J Sports Med 39(11):2296-2303. https://pubmed.ncbi.nlm.nih.gov/21825112/
- van der Horst N et al. 2015. The preventive effect of the Nordic hamstring exercise on hamstring injuries in amateur soccer players: a randomized controlled trial. Am J Sports Med 43(6):1316-1323.
- van Dyk N, Behan FP, Whiteley R 2019. Including the Nordic hamstring exercise in injury prevention programmes halves the rate of hamstring injuries. Br J Sports Med 53(21):1362-1370. https://bjsm.bmj.com/content/53/21/1362
- Presland JD et al. 2018. The effect of Nordic hamstring exercise training volume on biceps femoris long head architectural adaptation. Scand J Med Sci Sports 28(7):1775-1783.
- Harøy J et al. 2019. The Adductor Strengthening Programme prevents groin problems among male football players: a cluster-randomised controlled trial. Br J Sports Med 53(3):150-157. https://bjsm.bmj.com/content/53/3/150
- Thorborg K et al. 2017. Effect of specific exercise-based football injury prevention programmes on the overall injury rate in football: a systematic review and meta-analysis of the FIFA 11 and 11+ programmes. Br J Sports Med 51(7):562-571. https://bjsm.bmj.com/content/51/7/562
- Andersson SH et al. 2017. Preventing overuse shoulder injuries among throwing athletes: a cluster-randomised controlled trial in 660 elite handball players. Br J Sports Med 51(14):1073-1080. https://bjsm.bmj.com/content/51/14/1073
- Webster KE, Hewett TE 2018. Meta-analysis of meta-analyses of anterior cruciate ligament injury reduction training programs. J Orthop Res 36(10):2696-2708.
- Waldén M et al. 2012. Prevention of acute knee injuries in adolescent female football players: cluster randomised controlled trial. BMJ 344:e3042.
- McGuine TA, Keene JS 2006. The effect of a balance training program on the risk of ankle sprains in high school athletes. Am J Sports Med 34(7):1103-1111.
- McGuine TA et al. 2011. The effect of lace-up ankle braces on injury rates in high school basketball players. Am J Sports Med 39(9):1840-1848.
- Schiftan GS, Ross LA, Hahne AJ 2015. The effectiveness of proprioceptive training in preventing ankle sprains in sporting populations: a systematic review and meta-analysis. J Sci Med Sport 18(3):238-244.
- Doherty C et al. 2017. Treatment and prevention of acute and recurrent ankle sprain: an overview of systematic reviews with meta-analysis. Br J Sports Med 51(2):113-125.
- Lauersen JB, Bertelsen DM, Andersen LB 2014. The effectiveness of exercise interventions to prevent sports injuries: a systematic review and meta-analysis of randomised controlled trials. Br J Sports Med 48(11):871-877.
- Rønnestad BR, Nymark BS, Raastad T 2011. Effects of in-season strength maintenance training frequency in professional soccer players. J Strength Cond Res 25(10):2653-2660.
- Schumann M et al. 2022. Compatibility of concurrent aerobic and strength training for skeletal muscle size and function: an updated systematic review and meta-analysis. Sports Med 52:601-612.
- Suchomel TJ, Nimphius S, Stone MH 2016. The importance of muscular strength in athletic performance. Sports Med 46(10):1419-1449.
- Pyne DB, Mujika I, Reilly T 2009. Peaking for optimal performance: research limitations and future directions. J Sports Sci 27(3):195-202.
- Bosquet L et al. 2007. Effects of tapering on performance: a meta-analysis. Med Sci Sports Exerc 39(8):1358-1365.
- Buchheit M 2008. The 30-15 Intermittent Fitness Test: accuracy for individualizing interval training of young intermittent sport players. J Strength Cond Res 22(2):365-374.
- Bangsbo J, Iaia FM, Krustrup P 2008. The Yo-Yo intermittent recovery test: a useful tool for evaluation of physical performance in intermittent sports. Sports Med 38(1):37-51.
- Helgerud J et al. 2001. Aerobic endurance training improves soccer performance. Med Sci Sports Exerc 33(11):1925-1931.
- Gabbett TJ 2016. The training-injury prevention paradox: should athletes be training smarter and harder? Br J Sports Med 50(5):273-280.
- Hulin BT et al. 2014. Spikes in acute workload are associated with increased injury risk in elite cricket fast bowlers. Br J Sports Med 48(8):708-712.
- Nimphius S et al. 2016. Change of direction deficit: a more isolated measure of change of direction performance than total 505 time. J Strength Cond Res 30(11):3024-3032.
- Plisky PJ et al. 2006. Star Excursion Balance Test as a predictor of lower extremity injury in high school basketball players. J Orthop Sports Phys Ther 36(12):911-919.
- Nédélec M et al. 2012. Recovery in soccer: part I, post-match fatigue and time course of recovery. Sports Med 42(12):997-1015.
- Collins CL et al. 2014. Neck strength: a protective factor reducing risk for concussion in high school sports. J Prim Prev 35(5):309-319.
- Wilk KE et al. 2011 / 2015. Correlation of glenohumeral internal rotation deficit and total rotational motion to shoulder injuries in professional baseball pitchers (Am J Sports Med 39:329-335); Deficits in glenohumeral passive range of motion increase risk of shoulder injury in professional baseball pitchers: a prospective study (Am J Sports Med 43:2379-2385).
- Kongsgaard M et al. 2009. Corticosteroid injections, eccentric decline squat training and heavy slow resistance training in patellar tendinopathy. Scand J Med Sci Sports 19(6):790-802.
- Tyler TF et al. 2001. The association of hip strength and flexibility with the incidence of adductor muscle strains in professional ice hockey players. Am J Sports Med 29(2):124-128. https://pubmed.ncbi.nlm.nih.gov/11292035/

---
## Part 1. Field invasion sports (running codes)

---

## 1. Football (soccer)

### 1.1 Demands
| Measure | Elite men | Notes |
|---|---|---|
| Match duration | 90 min + stoppage | Amateurs often 80-90 min, rolling subs in some leagues |
| Total distance | ~10-12 km (central midfield highest, centre-backs lowest ~9-10 km) | Bradley 2009, Premier League |
| High-speed running (>19.8 km/h) | ~700-1,100 m | Wide midfielders and full-backs highest |
| Sprinting (>25.2 km/h) | ~200-350 m in roughly 20-40 efforts, most under 20 m | Most goals are preceded by a straight sprint (Faude 2012) |
| Accelerations / decelerations | Hundreds of efforts; ~1,000-1,400 changes of activity | Decelerations are a major eccentric load |
| Change of direction | Frequent; turns >90° several dozen times | |
| Jumps | ~10-20 (centre-backs and strikers most, heading duels) | |
| Energy | Mostly aerobic (average ~85% HRmax, Stølen 2005), with repeated anaerobic bursts that decide matches | |

### 1.2 Positional variants
| Variant | What changes |
|---|---|
| Centre-back | More aerial duels and heading: extra jump and landing work, neck (heading) and upper-body strength; less HSR conditioning. |
| Full-back / wing-back, wide midfielder | Highest HSR and sprint load: more max-velocity exposure, more Nordic priority, larger aerobic power target. |
| Central midfielder | Highest total distance: aerobic power (IFT) priority, repeated accelerations. |
| Striker | Explosive acceleration and jumps, shielding (upper-body and trunk strength); fewer total metres. |
| Goalkeeper | Separate profile: lateral power (skater jumps, lateral bounds), diving (shoulder, wrist, fingers), groin (Copenhagen), short sprints and reactive agility; aerobic conditioning minimal. |
| Female players | Same structure; ACL risk is 2-6x higher, so the landing module is priority 1 and runs 2-3x/week all year (Waldén 2012 Knee Control: 64% fewer ACL injuries in adolescent female players). |

### 1.3 Injuries and prevention (priority order)
Professional football muscle injuries: hamstring 37%, adductor 23%, quadriceps 19%, calf 13% (Ekstrand 2011). Ankle sprains and knee ligament injuries are the main joint injuries.

| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | FIFA 11+ as the warm-up for club training and gym days | 2x/week minimum, ~20 min | Strong: 39% fewer injuries overall (Thorborg 2017) |
| 2 | `nordic` | OFF/PRE 2x/wk progression; IN 1x/wk 2x5 | Strong |
| 3 | `copenhagen` | OFF/PRE 2-3x/wk; IN 1x/wk | Strong |
| 4 | `landing` (priority 1 for female players) | 2-3x/wk | Strong |
| 5 | `ankle` (anyone with a previous sprain) | 3x/wk balance; brace/tape for matches | Strong |
| 6 | `maxv` sprint exposure | 1-2x/wk, ≥90% top speed | Moderate/practice |
| 7 | `hipFlex` (rectus femoris, kicking leg) | 1-2x/wk | Practice |
| 8 | `calf` (players over ~30) | 2x/wk | Practice |
| GK | `shoulderER`, `elbow` (wrist/fingers) | 2-3x/wk | Practice / moderate |

### 1.4 Season structure (UK amateur defaults)
| Phase | When | Gym / wk | Conditioning / wk (beyond club training) |
|---|---|---|---|
| OFF | Late May to early July (after 2 weeks off) | 3 (N: 2-3) | 2 (aerobic base + tempo) |
| PRE | July to mid-August (6 weeks) | 2 | 2 (IFT, RSA, max velocity); falls as club pre-season ramps up |
| IN, 1 match/wk | Mid-August to May | 2 (I/A), 1 (N or 3+ club sessions) | 0-1 (top-up for non-starters and subs) |
| CONG, 2 matches/wk | Christmas, cup runs | 0-1 | 0 |
| Winter break (if any, 2-3 weeks) | | Mini-OFF: 2-3 strength sessions, 2 conditioning sessions, to avoid a detraining dip | |

### 1.5 Week placement
Professional template (match Saturday): MD+1 recovery / regeneration (subs do a top-up); MD+2 off; MD-4 "intensive" day (strength + small-sided, accelerations, decelerations, COD); MD-3 "extensive" day (larger spaces, HSR and max-velocity exposure, conditioning); MD-2 tactical, low load; MD-1 speed/activation, short; MD.
Gym: heavy lower + Nordic + Copenhagen on MD-4; upper body and power on MD-3 or MD-2; MD-1 primer optional (A only).

Amateur (train Tue/Thu, match Sat): Mon gym A (lower heavy, Nordic, Copenhagen) MD-5; Tue training; Wed gym B (upper, power, prehab, low lower volume) MD-3; Thu training; Fri off or 15-min primer; Sat match; Sun recovery.
Midweek match (Wed + Sat): Sun recovery; Mon gym maintenance (MD+2 for Sat, MD-2 for Wed: 2x3 trap bar at 80%, upper, prehab 1 set); Tue primer; Wed match; Thu recovery; Fri primer; Sat match.

### 1.6 Session templates
Sets x reps are listed as N / I / A. Rest: power 2-3 min, main 2.5-3 min, accessories 90 s, prehab 60 s.

**OFF A: lower strength (MD-free weeks)**
| # | Slot | Exercise (app key) | N | I | A |
|---|---|---|---|---|---|
| 1 | Plyo | Box jump (`boxjp`); N: pogo (`pogo`) | 3x10 pogo | 3x5 | 4x4 |
| 2 | Main lower | Trap bar deadlift (`trapdl`) or back squat (`squat`); N: goblet (`goblet`) | 3x8 RIR3 | 4x5 @ 78-82% | 5x3-4 @ 83-87% |
| 3 | Unilateral | Bulgarian split squat (`bss`) | 2x8/leg | 3x6-8/leg | 3x5-6/leg heavy |
| 4 | Pull | Pull-up / chin-up (`pullup`) | 3x6-8 (or `latpd`) | 3x6-8 | 3x5-6 weighted |
| 5 | Prehab | Nordic (`nordicham`) | 2x4 (band-assisted) | per module | per module |
| 6 | Prehab | Copenhagen (`copen`) | short lever 2x6-8/side | 2x8-10/side | long lever 2x10-12/side |
| 7 | Prehab | Calf (`seatedcalf` then `stepcalf`) | 2x12 | 3x10 | 3x8 heavy |
| 8 | Trunk | Pallof (`pallof`) | 2x10/side | 2x12/side | 2x12/side |

**OFF B: upper + posterior chain**
| # | Slot | Exercise | N | I | A |
|---|---|---|---|---|---|
| 1 | Power | Broad jump (`broadjump`) | 3x3 | 4x3 | 4x3 |
| 2 | Main hinge | RDL (`rdl`) or hip thrust (`hipthrust`) | 3x8-10 | 3x6-8 | 4x5-6 |
| 3 | Push | DB bench (`flatdb`) / bench (`bench`) | 3x8-10 | 3x6-8 | 4x5 |
| 4 | Row | Chest-supported row (`csdb`) | 3x10 | 3x8-10 | 3x8 |
| 5 | Unilateral hinge | Single-leg RDL (`singlerdl`) | 2x8 | 3x8 | 3x6-8 loaded |
| 6 | Prehab | Reverse Nordic (`nordic`) or hip flexor march (`hipmarch`) | 2x6 | 2x8 | 3x8 |
| 7 | Prehab | Single-leg balance (`slbalance`) | 2x30 s | 2x30 s, eyes closed | 2x30 s, with catches |
| 8 | Trunk | Side plank (`sideplank`) | 2x20-30 s | 2x30-40 s | 2x45 s |

**OFF C: single-leg, speed-strength (third session for I/A)**
Lateral bound (`latbound`) 3x4/side; front squat (`frontsq`) or belt squat 3x5; step-up (`stepup`) 3x6/leg; push press (`pushpress`, A) or landmine press (`lmpress`) 3x5; inverted row (`invrow`) 3x10; Copenhagen 2 sets; ab wheel (`abwheel`) 2x8.

**PRE A: strength-power (MD-4 equivalent once fixtures start)**
| # | Slot | Exercise | N | I | A |
|---|---|---|---|---|---|
| 1 | Plyo / reactive | Hurdle hops (`hurdlehop`) or drop jump (`dropjump`, A) | 3x5 low hurdle | 3x5 | 3x4 drop jump from 30-40 cm |
| 2 | Main lower + contrast | Trap bar or back squat, paired with CMJ (`cmj`) 60-90 s later | 3x6 RIR2, no contrast | 4x4 @ 82-85% + 3 CMJ | 4x3 @ 85-90% + 3 CMJ |
| 3 | Unilateral | Split squat / step-up | 2x6 | 3x5/leg | 3x4/leg |
| 4 | Prehab | Nordic | 2x5 | 3x5 | 3x6 |
| 5 | Prehab | Copenhagen | 2x8 | 2x10 | 2x12 |
| 6 | Trunk | Pallof / side plank | 2 sets | 2 sets | 2 sets |

**PRE B: power + upper**
Trap bar jump (`trapjump`) 3x4 @ 20-30% (N: CMJ 3x4); hang power clean (`hangclean`, A only) 4x3 @ 70-80%; bench or DB bench 3x5; pull-up 3x5; hip thrust 3x6; reverse Nordic 2x8; ankle balance; side plank.

**IN A: MD-4 (or MD+2 in a two-match week)**, ~40 min
1. Plyo: CMJ or box jump 3x3 (max intent).
2. Main lower: trap bar or squat: N 2x6 RIR2-3; I 3x3-4 @ 80-85%; A 3x2-3 @ 85-90%.
3. Upper pull: pull-up 2-3x5.
4. Nordic 2x4-6 (the in-season dose).
5. Copenhagen 1-2 sets/side.
6. Calf 2x10 or ankle balance.
Never to failure. Total working sets 10-14.

**IN B: MD-3 or MD-2**, ~30 min
1. Power: med ball scoop toss (`mbscoop`) or broad jump 3x3.
2. Upper push 2-3x5; row 2-3x6.
3. Hip thrust or single-leg RDL 2x6 (moderate, no soreness).
4. Hip flexor / reverse Nordic 2x6; side plank.

**CONG (single session, MD+2 / MD-2)**: CMJ 2x3; trap bar 2x3 @ 80%; pull-up 2x5; Nordic 1x5; Copenhagen 1x/side. 20 min.

### 1.7 Conditioning
| Phase | Sessions | Content |
|---|---|---|
| OFF | 2/wk | (1) `long4x4` or 3 x 8 min at RPE 7; (2) `tempo` 12-16 x 100 m. Week 3+: add `maxv` 4 x 30 m to one session. |
| PRE | 2/wk (reduce as club sessions start) | (1) `ift1515` 2 x 8 min at 90-95% VIFT; (2) `rsa` 2 x 6 x 30 m with a 180° turn, 25 s rest; plus `maxv` 4-5 x 30-40 m twice a week. `ssgEquiv` for players without a squad. |
| IN | 0-1/wk | Starters: nothing extra if they train twice and play 90 min. Subs and non-starters: MD+1 or MD+2 top-up: `ift1515` 2 x 6 min + 4 x 30 m `maxv`. Everyone: make sure at least one session a week touches ≥90% max speed. |

### 1.8 Tests and benchmarks (male bands; female ~0.10-0.15 s slower on 10 m, ~7-10 cm lower CMJ, Yo-Yo ~35-40% lower)
| Test | Club | Good club / semi-pro | Elite |
|---|---|---|---|
| 10 m sprint | 1.85-1.95 s | 1.75-1.85 s | < 1.75 s |
| 30 m sprint | 4.40-4.60 s | 4.20-4.40 s | < 4.20 s |
| CMJ | 32-38 cm | 38-44 cm | > 44 cm |
| 505 (each side) | 2.45-2.60 s | 2.30-2.45 s | < 2.30 s |
| Yo-Yo IR1 | 1,200-1,600 m | 1,600-2,100 m | > 2,200 m |
| 30-15 IFT | 17.0-18.5 km/h | 18.5-19.5 km/h | > 19.5 km/h |
| Trap bar / squat 1RM | 1.25 x BM | 1.5 x BM | 1.75-2.0 x BM |
| Nordic eccentric force (if a device is available) | | > 337 N per leg (Timmins 2016) | |
| Adductor:abductor strength | | > 0.8 | |

### 1.9 Taper (cup final, play-off, tournament)
- 7-10 days. Training load (minutes x RPE) down 30-50%, intensity kept.
- Last heavy lower: MD-5 at normal load, half the sets. Last Nordic: MD-5. Last hard conditioning: MD-4 (short RSA). MD-3: max velocity 3 x 30 m. MD-2: low. MD-1: primer (2 x 3 CMJ, 2-3 x 10-20 m sprints).
- Tournament (several matches in a week): drop all gym work except a 15-min primer and 1 set of Copenhagen/Nordic every 3-4 days; prioritise sleep, carbohydrate (6-8 g/kg the day before) and MD+1 recovery.

### 1.10 Encoding notes
- `q` change: rotational 1 → keep; neck 1 (heading): add `neck` optional for centre-backs and female players at 1x/wk (practice).
- `prehab` order: `nordic`, `copenhagen`, `landing`, `ankle`, `hipFlex`, `calf`.
- `mdRules`: heavy lower ≥ 72 h pre-match; Nordic ≥ 72 h; upper ≥ 48 h; primer MD-1.
- Variants: `outfield` (default), `gk`, flag `female` → landing priority 1.

### 1.11 Sources
Bradley PS et al. 2009, J Sports Sci 27(2):159-168 (high-intensity running in English Premier League); Faude O, Koch T, Meyer T 2012, J Sports Sci 30(7):625-631 (straight sprinting in goal situations); Stølen T et al. 2005, Sports Med 35(6):501-536 (physiology of soccer); Ekstrand J, Hägglund M, Waldén M 2011, Am J Sports Med 39(6):1226-1232 (epidemiology of muscle injuries); Thorborg 2017; Petersen 2011; van der Horst 2015; Harøy 2019; Waldén 2012; Rønnestad 2011; Timmins RG et al. 2016, Br J Sports Med 50(24):1524-1535 (biceps femoris fascicle length and eccentric strength as risk factors); Buchheit 2008; Bangsbo 2008; Helgerud 2001; Nédélec 2012; Silvers-Granelli H et al. 2015, Am J Sports Med 43(11):2628-2637 (FIFA 11+ in US college men's soccer, 46% fewer injuries).

---

## 2. Gaelic football

### 2.1 Demands
| Measure | Elite inter-county | Notes |
|---|---|---|
| Match duration | 70 min (2 x 35) senior inter-county; club often 60 min | Rolling subs (5) |
| Total distance | ~8.9 km average; midfield ~10.6 km, half-forwards ~10.1 km, half-backs ~9.6 km, full lines ~7.9 km | Malone 2016 |
| High-speed running (≥17 km/h) | Midfield ~2.0 km; half lines ~1.8 km; full lines ~1.3 km | |
| Sprint (≥22 km/h) | ~350-490 m | Half-forwards and half-backs highest |
| Accelerations | ~150-215 per match | Midfield highest |
| Contact | Shoulder-to-shoulder, tackles on the ball, high catches with landing in traffic; not full collision | |
| Kicking and fielding | High catch (jump + landing in contact); kicking both feet | |
| Energy | Aerobic base with repeated high-speed efforts; running drops in the 4th quarter | |

### 2.2 Positional variants
- Midfield: highest total and HSR load, most high catches: aerobic power and jumping/landing.
- Half-back / half-forward ("middle third"): most sprint metres: max-velocity and RSA priority, Nordic priority.
- Full-back / full-forward: more 1v1 contact, short accelerations, upper-body strength and COD; less aerobic volume.
- Goalkeeper: kick-outs (hip flexor/quad), diving, lateral power.

### 2.3 Injuries and prevention
Hamstring strain is the most common injury in Gaelic football, followed by ankle sprains, knee ligament injuries and groin/hip (Murphy 2012; Roe 2018). Exposure to maximal-velocity running and high chronic loads was associated with lower injury risk (Malone 2017).
| Priority | Module | Dose |
|---|---|---|
| 1 | GAA 15 warm-up before training and matches | 2x/wk minimum (higher adherence linked with fewer injuries: O'Malley 2017; Schlingermann 2018) |
| 2 | `nordic` | per module |
| 3 | `maxv` | 1-2x/wk, ≥90% top speed |
| 4 | `copenhagen` | per module (kicking + COD) |
| 5 | `landing` (high catch landings), `ankle` | 2-3x/wk |
| 6 | `hipFlex` (kicking) | 1-2x/wk |
| 7 | `neck` / shoulder robustness for contact | 1-2x/wk (practice) |

### 2.4 Season structure
Club and inter-county calendars differ. Default (split season): OFF Nov-Dec (gym 3/wk, conditioning 2/wk); PRE Jan-Feb for inter-county / Feb-Mar for club (gym 2-3/wk, conditioning 2/wk); IN league and championship (gym 2/wk if one match every 7-14 days, 1 if weekly); championship knockout phases often have 2-3 week gaps: use a "mini-block" (one extra strength session in week 1, taper in week 2-3).

### 2.5 Week placement
Same as football 1.5. Match Sunday is common: MD-4 = Wednesday (gym A after or before club training, with 6 h gap if possible), MD-2 = Friday (gym B, upper + primer). Club training Tue/Thu: put gym A Monday (MD-6) or Wednesday morning.

### 2.6 Session templates
Use football templates 1.6 with these changes:
- Add a jump-and-land block to PRE A and IN A: 3 x 3 "high catch" jumps (CMJ with arm reach, land on two then one leg, stick 2 s).
- Upper body is more important than in soccer (shoulder contact, tackling, fielding in traffic): OFF B upper push and pull become main lifts at 4x5-6 (I) / 4x4-5 (A); add `neckiso` 2x/wk.
- Kicking-leg robustness: reverse Nordic (`nordic`) 2x8 and hip flexor march 2x10 in OFF B and IN B.

### 2.7 Conditioning
OFF: `long4x4` + `tempo`. PRE: `ift1515` and `ift3030` (Gaelic matches have more continuous running than soccer: use 2 x 10 min blocks), `rsa` 3 x 6 x 30-40 m with 20 s rest, `maxv` 2x/wk. IN: as football; subs top-up MD+1.

### 2.8 Tests and benchmarks (senior male)
| Test | Club | Good club / intermediate | Inter-county |
|---|---|---|---|
| 5 m / 10 m / 20 m | 1.10 / 1.85 / 3.15 s | 1.05 / 1.80 / 3.05 s | < 1.02 / < 1.75 / < 3.00 s |
| CMJ | 32-38 cm | 38-43 cm | > 43 cm |
| Yo-Yo IR1 | 1,200-1,600 m | 1,600-2,000 m | > 2,000 m |
| 505 | 2.50 s | 2.40 s | < 2.35 s |
| Squat / trap bar | 1.25 x BM | 1.5 x BM | 1.75 x BM+ |
| Bench | 0.9 x BM | 1.1 x BM | 1.25 x BM |

### 2.9 Taper
Championship match after a 2-3 week gap: week 1 normal training + 1 extra conditioning block; final 7-10 days as football 1.9.

### 2.10 Encoding notes
- `prehab`: `nordic`, `copenhagen`, `landing`, `ankle`, `hipFlex`, `neck` (optional).
- `q`: upperPush 2, upperPull 2 (keep), neck 1 → 2 for full-lines (contact). Add `maxv` as a compulsory weekly item.

### 2.11 Sources
Malone S et al. 2016, metabolic power and energetic demands of elite Gaelic football (LJMU, https://researchonline.ljmu.ac.uk/id/eprint/3390/); Malone S et al. 2017, J Sci Med Sport 20(3):250-254 (high chronic training loads and maximal velocity exposure reduce injury risk in elite Gaelic football); O'Malley E et al. 2017, J Strength Cond Res 31(11) (GAA 15 warm-up effects); Schlingermann BE et al. 2018 (GAA 15 in collegiate Gaelic games: higher compliance, fewer injuries; treat as moderate evidence); Murphy JC, O'Malley E, Gissane C, Blake C 2012, Am J Sports Med 40(9):2113-2120 (incidence of injury in Gaelic football: 4-year prospective study); Roe M et al. 2018, Br J Sports Med 52(15):982-988 (hamstring injuries in elite Gaelic football: 8-year investigation); Petersen 2011; Harøy 2019.

---

## 3. Hurling (and camogie)

### 3.1 Demands
| Measure | Elite senior hurling |
|---|---|
| Duration | 70 min (2 x 35) |
| Total distance | ~7.6 km; midfield ~9.0 km, half-backs ~8.0 km, half-forwards ~8.0 km, full lines ~6.5 km |
| HSR (≥17 km/h) | ~1.1 km (midfield ~1.6 km) |
| Sprint (≥22 km/h) | ~320 m (midfield ~400 m) |
| Accelerations | ~190 per match |
| Skill-specific | Striking with the hurley (rotational power, wrists), overhead catching with stick contact, shoulder-to-shoulder contact; stick strikes to hands |
| Energy | Intermittent, aerobic base with repeated sprints; HSR falls after the first quarter |

### 3.2 Positional variants
As Gaelic football (2.2). Add: full-backs and full-forwards have more physical duels and short bursts; all positions need rotational power (striking) and grip/wrist strength. Goalkeepers: puck-outs (rotational power), reaction, lateral movement.

### 3.3 Injuries and prevention
Hamstring strains are the most common time-loss injury; hand and finger injuries from stick strikes (largely prevented by helmets with face guards, compulsory, and hand protectors), ankle sprains, groin, low back (rotational striking) (Murphy 2012, hurling).
| Priority | Module | Dose |
|---|---|---|
| 1 | GAA 15 warm-up | 2x/wk minimum |
| 2 | `nordic` + `maxv` | per module, 1-2x/wk |
| 3 | `copenhagen` | per module |
| 4 | `trunkLat` + `lowback` (repeated one-sided striking) | 2-3x/wk |
| 5 | `elbow` / wrist and grip | 2x/wk |
| 6 | `ankle`, `landing` | 2x/wk |
| 7 | `shoulderER` (overhead catching, striking follow-through) | 2x/wk (practice) |

### 3.4 Season, 3.5 Week placement
As Gaelic football (2.4, 2.5).

### 3.6 Session templates
Football templates with these changes:
- Power slot alternates linear (jumps) and rotational: rotational med ball shot-put throw (`mbshotput` / `mbrot`) 3x4/side both sides (strike both sides to limit asymmetry), landmine rotation (`landrot`) 3x6/side as accessory.
- Grip/wrist: wrist curl and extension (`wristcurl`) 2x15, pronation/supination (`pronsup`) 2x12, farmers carry (`farmers`) 2 x 30 m.
- Trunk slot is always anti-rotation or rotation (Pallof, woodchop) plus side plank.
- In-season IN B includes 2 x 4/side rotational throws at max intent (primer for striking).

### 3.7 Conditioning
As Gaelic football. Add stick-in-hand RSA: 6 x 30 m sprints carrying the hurley, solo for 10 m, 25 s rest (practice).

### 3.8 Tests and benchmarks (senior male)
As Gaelic football 2.8 with Yo-Yo IR1 elite > 1,900 m; add rotational med ball throw (3 kg) distance each side, asymmetry < 10% (practice); grip strength > 50 kg (men).

### 3.9 Taper
As Gaelic football.

### 3.10 Encoding notes
- `q`: rotational 3, grip 2, trunk 3 (keep). `prehab`: `nordic`, `copenhagen`, `trunkLat`, `elbow`, `ankle`, `shoulderER`.
- Rotational power must be trained both sides (unlike golf / cricket where one side dominates).

### 3.11 Sources
Collins K et al. (Young D, Malone S, Coratella G, Collins K), match work-rate of elite hurling (LJMU, https://researchonline.ljmu.ac.uk/6310/); Young D et al. 2019, the match-play sprint performance of elite senior hurlers (https://oars.uos.ac.uk/894/); Murphy JC, Gissane C, Blake C 2012, Br J Sports Med 46(2):138-142 (injury in elite county-level hurling: a prospective study); O'Malley 2017; Petersen 2011; Harøy 2019.

---

## 4. Australian rules football (AFL / AFLW)

### 4.1 Demands
| Measure | Elite AFL |
|---|---|
| Duration | 4 x 20 min + stoppage (~120 min elapsed); players ~98 min on ground with interchange |
| Total distance | ~11-13.5 km at ~129 m/min (elite), ~123 sub-elite, ~103 amateur |
| HSR | ~1.3-4.3 km; ~2 high-speed efforts per minute |
| Sprints | ~22 sprints (≥7 m/s), ~330 m; ~45% with < 30 s recovery; ~4x as many hard accelerations |
| Peak 1-min | ~200-220 m/min, HSR ~70-110 m/min |
| Contact | Tackles, bumps, marking contests, ruck contests; no padding |
| Jumps | Marking contests and ruck contests (ruckmen highest) |
| Energy | Highest running volume of any football code: aerobic power is the foundation, with repeated sprints |

### 4.2 Positional variants
- Midfielders (nomadic): highest work rate: aerobic power (IFT/2 km time trial) priority.
- Small forwards / small defenders: highest peak running and accelerations: speed, RSA.
- Key position (tall forwards and backs): marking contests, jumping, upper-body strength and mass, lower total distance.
- Ruck: jumping (hundreds of ruck contests per season), body mass, lowest aerobic fitness; landing and patellar tendon focus.
- AFLW: ACL injury rate is several times higher than in AFL men (AFL injury surveillance reports): landing module is priority 1.

### 4.3 Injuries and prevention
Hamstring strains are the most common and most recurrent injury in the AFL (AFL Injury Survey, Orchard 2013), followed by groin, ankle sprains, quadriceps, calf and knee (ACL, PCL). Eccentric hamstring strength below ~256 N at the start of pre-season (RR 2.7) and below ~279 N at the end of pre-season (RR 4.3) increased hamstring strain risk (Opar 2015).
| Priority | Module | Dose |
|---|---|---|
| 1 | `nordic` (+ test force if a NordBord / load cell is available) | per module |
| 2 | `maxv` | 1-2x/wk |
| 3 | `copenhagen` | per module |
| 4 | `landing` (priority 1 for AFLW and rucks) | 2-3x/wk |
| 5 | `ankle` | 2-3x/wk |
| 6 | `calf` (older players, high running loads) | 2x/wk |
| 7 | `neck` + shoulder robustness (tackles, bumps) | 2x/wk |
| 8 | `hipFlex` (kicking) | 1-2x/wk |
| Ruck | `patellar` | 2x/wk |

### 4.4 Season structure
OFF Oct-Nov (gym 3, aerobic running 3/wk building volume: AFL demands a very large aerobic base); PRE Dec-Feb (12-22 weeks at elite level including a Christmas break; amateurs 8-10 weeks): gym 2-3, conditioning 2-3; IN Mar-Sep (gym 2 elite; amateur 1-2), match weekly. Strength training 2-4/wk pre-season, 2/wk in competition at elite level (Johnston 2018).

### 4.5 Week placement
As football 1.5, but in-season running loads are higher, so put the hardest conditioning on MD-4/MD-3 and keep MD-2 for a 20-30 min upper/power gym session. Amateur (Tue/Thu training, Saturday match): gym A Mon (lower, Nordic), gym B Wed (upper, power).

### 4.6 Session templates
Football templates 1.6 with these changes:
- OFF/PRE add an upper-body main lift on both sessions (contested ball, tackling): bench 4x5 / pull-up 4x5 (I), plus `neckiso` and `neckband`.
- Key position and rucks: extra jump work (box jump, single-leg jump for height off a 3-step run-up 3x3/leg) and `mass` = 2 accessories (3x8-10) in OFF.
- Midfield and small players: lower upper-body volume (2 sets), more single-leg and max velocity.

### 4.7 Conditioning
| Phase | Content |
|---|---|
| OFF | 3/wk running: easy aerobic 30-45 min, `long4x4`, `tempo`; build weekly volume steadily (no more than ~10-15% a week). |
| PRE | 2-3/wk: `ift1515`/`ift3030`, 2 km time trial efforts, `rsa` (6 x 40 m, 20 s rest, 3 sets), `rht` (bump/tackle + sprint), `maxv` 2x/wk; at least weekly exposure to ≥90% max speed. |
| IN | Starters: mostly covered by match + main training; one top-up for under-loaded players. |

### 4.8 Tests and benchmarks (male)
| Test | Amateur | State league | AFL |
|---|---|---|---|
| 2 km time trial | 7:00-7:45 | 6:20-7:00 | < 6:15 (midfield ~6:00) |
| Yo-Yo IR2 / IR1 | IR1 1,600-2,000 m | IR1 2,000-2,400 m | IR1 > 2,400 m |
| 20 m sprint | 3.10-3.20 s | 3.00-3.10 s | < 3.00 s |
| Vertical jump (running) | 55-65 cm | 65-75 cm | > 75 cm |
| CMJ | 35-40 cm | 40-45 cm | > 45 cm |
| Nordic force | > 256 N early pre-season, > 279 N end of pre-season (Opar 2015) | | |
| Squat 3RM est. 1RM | 1.25 x BM | 1.5 x BM | 1.75 x BM |

### 4.9 Taper
Finals: maintain intensity, reduce running volume 30-40% across the final 7 days; last heavy lower MD-5; MD-1 primer.

### 4.10 Encoding notes
- `q`: neck 2, upperPull 2, upperPush 2 (keep). Add positional variants `midfield`, `small`, `key`, `ruck`; flag `female`.
- `prehab`: `nordic`, `copenhagen`, `landing`, `ankle`, `calf`, `neck`, `hipFlex`; ruck adds `patellar`.

### 4.11 Sources
Johnston RD et al. 2018, Applied sport science of Australian football: a systematic review. Sports Med 48(7):1673-1694 (https://acuresearchbank.acu.edu.au/download/b04c7d662a745b63c9cc7f085f18cee42ca5e2da0d08728d8234874ffacda8eb/1404719/AM_Johnston_2018_Applied_sport_science_of_Australian_football.pdf); Varley MC, Gabbett TJ, Aughey RJ 2014, J Sports Sci 32(20) (accelerations in AFL); Opar DA et al. 2015, Med Sci Sports Exerc 47(4):857-865 (eccentric hamstring strength and hamstring injury risk in Australian footballers); Orchard JW et al. 2013, Orthop J Sports Med 1(4) (AFL injury report 1997-2012: hamstring the most common); Webster KE, Hewett TE 2018; van Dyk 2019; Harøy 2019.

---

## 5. Field hockey

### 5.1 Demands
| Measure | Elite |
|---|---|
| Duration | 4 x 15 min; unlimited rolling substitutions, so players are on for ~40-50 min (defenders longest) |
| Total distance | Women ~5.5 km per player (~125 m/min); men similar per-minute, often higher |
| HSR (>16 km/h) | Women ~590 m (~13 m/min); midfielders highest |
| Sprint (>20 km/h) | ~100-140 m per player (women), shorter bursts |
| Heart rate | Mean ~86% of peak; defenders most time above 85% |
| Posture | Constant semi-crouched (flexed trunk and hips) with the stick low: high lumbar and hip flexor/extensor loading |
| Stick skills | Hitting and drag-flicking: rotational power; drag-flickers do an extreme lunge with trunk rotation and lateral flexion |
| Energy | High-intensity intermittent; rolling subs keep intensity high |

### 5.2 Positional variants
- Defenders: most minutes and highest HR time: aerobic power.
- Midfielders: most HSR: RSA and aerobic power.
- Forwards: highest relative distance and speed.
- Drag-flickers (penalty corner specialists): very high lumbar and groin loads; add `lowback`, `trunkLat`, `copenhagen` priority and limit drag-flick volume (practice: count flicks like bowling deliveries).
- Goalkeeper: heavy kit, lateral power, splits/saves: hip mobility, groin, single-leg strength.

### 5.3 Injuries and prevention
Lower limb accounts for most injuries: ankle sprains, hamstring strains, groin; low back pain is common because of the crouched posture; head/face and hand injuries from ball and stick contact (Barboza 2018 review; Murtaugh 2009).
| Priority | Module | Dose |
|---|---|---|
| 1 | `ankle` + `landing` (FIFA 11+-style warm-up: shown to be adaptable and used in hockey) | 2-3x/wk |
| 2 | `nordic` | per module |
| 3 | `lowback` (extensor endurance) + `trunkLat` | 2-3x/wk |
| 4 | `copenhagen` | per module |
| 5 | `hipFlex` (constant flexed posture, hip flexor endurance) | 1-2x/wk |
| 6 | `elbow`/wrist (hitting) | 1-2x/wk |

### 5.4 Season structure
UK club: OFF May-July, PRE Aug-mid Sept, IN mid Sept-April with a winter break (Dec-Jan). Gym: 3 / 2 / 1-2. Indoor season in winter for some clubs: treat as congested.

### 5.5 Week placement
Usually Saturday matches, training Tue/Thu: as football amateur week. Tournaments (2-4 matches in 3-5 days): no gym; primer only.

### 5.6 Session templates
Football templates with these changes:
- Main lower includes a low-position strength lift: front squat (`frontsq`) or Bulgarian split squat as main in OFF C and PRE.
- Lateral lunge / Cossack (`lateralLunge`) 3x6/side as accessory (low, wide movement in tackling).
- Rotational power: med ball shot-put throw 3x4/side.
- Trunk: back extension (`hipext`) 3x12-15 isometric holds, plus side plank, plus Pallof, every session in OFF/PRE.
- Upper body: lower priority (1 push, 1 pull, 2-3 sets).

### 5.7 Conditioning
OFF: aerobic base + tempo. PRE: `ift1515` (rolling subs make short, very intense bouts the norm: 15/15 at 95-100% VIFT), `rsa` 3 x 6 x 20-25 m with a stick and ball, 20 s rest, `maxv` weekly. In a low crouch: 6 x 20 s dribbling circuits. IN: top-up for low-minute players.

### 5.8 Tests and benchmarks
| Test | Club (M / F) | Good club (M / F) | International (M / F) |
|---|---|---|---|
| 10 m | 1.85 / 2.00 s | 1.78 / 1.92 s | < 1.75 / < 1.88 s |
| 30 m | 4.4 / 4.9 s | 4.2 / 4.7 s | < 4.15 / < 4.6 s |
| Yo-Yo IR1 | 1,400 / 900 m | 1,800 / 1,200 m | > 2,200 / > 1,500 m |
| 505 | 2.45 / 2.65 s | 2.35 / 2.55 s | < 2.30 / < 2.50 s |
| Biering-Sørensen back extensor hold | > 90 s | > 120 s | > 150 s (practice) |

### 5.9 Taper
Tournament: 7-10 days, cut volume 40-50%, keep sprint and IFT intensity (short sets); no gym after MD-4 except primers.

### 5.10 Encoding notes
- `prehab`: `ankle`, `nordic`, `lowback`, `copenhagen`, `landing`, `trunkLat`, `hipFlex`.
- Variant `dragflicker`: adds a weekly flick count and `lowback` + `copenhagen` priority 1.

### 5.11 Sources
McGuinness A, Malone S, Petrakos G, Collins K 2017 (J Strength Cond Res; physical and physiological demands of elite international female field hockey, https://researchonline.ljmu.ac.uk/id/eprint/6922/); Volume and intensity of locomotor activity in international men's field hockey matches over a 2-year period, Front Sports Act Living 2021, 3:653364 (https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2021.653364/full); Barboza SD et al. 2018, Sports Med 48(4):849-866 (injuries in field hockey players: systematic review); Murtaugh K 2009, Curr Sports Med Rep 8(5):267-272 (field hockey injuries); Thorborg 2017 (FIFA 11+ principles); Petersen 2011; Harøy 2019; Schiftan 2015.

---

## 6. Lacrosse (field, men's and women's)

### 6.1 Demands
| Measure | NCAA / elite (men) | Women |
|---|---|---|
| Duration | 4 x 15 min (men's NCAA); rolling substitutions on the fly | 4 x 15 min (2 x 30 in some rules), 12 v 12 (or 10 v 10) |
| Total distance | Midfielders ~5-7 km (most), attack and defence less | Similar per minute; midfield highest |
| High-speed | Midfielders highest; many short sprints and transitions | |
| Contact | Men: full-contact body checks and stick checks, helmet and pads | Women: limited contact, no helmets in many leagues (head protection rules vary) |
| Skills | Throwing and shooting (overhead and side-arm, shot speeds > 140 km/h), cradling, dodging | |
| Energy | High-intensity intermittent; midfield (both ends) the most aerobic | |

### 6.2 Positional variants
- Midfield: aerobic power and RSA priority.
- Attack: dodging (COD, deceleration), shooting power (rotational).
- Defence (men): body checking, upper-body strength, neck; long-stick handling (grip).
- Goalie: reaction, lateral movement, chest and hands (shot impact).
- Women: ACL priority; men: concussion and shoulder priority.

### 6.3 Injuries and prevention
Most common: ankle sprains, knee sprains (ACL particularly in women's lacrosse), upper-leg strains, and concussion (men: player contact; women: stick and ball contact) (Dick 2007 NCAA surveillance, men's and women's). Shoulder injuries in men from checks.
| Priority | Module | Dose |
|---|---|---|
| 1 | `landing` (both, priority 1 for women) | 2-3x/wk |
| 2 | `ankle` | 2-3x/wk |
| 3 | `nordic` | per module |
| 4 | `neck` (men; women where helmets are not worn) | 2x/wk |
| 5 | `shoulderER` (throwing/shooting volume) | 2-3x/wk |
| 6 | `copenhagen` | per module |
| 7 | `trunkLat` (shooting) | 2x/wk |

### 6.4 Season structure
US college: fall ball (OFF/PRE), spring season (IN). UK: season Sept-April. Gym: OFF 3, PRE 2-3, IN 1-2.

### 6.5 Week placement
As football 1.5. Tournaments and weekend double-headers: CONG rules.

### 6.6 Session templates
Football templates with these changes:
- Power slot alternates jumps with rotational throws (med ball shot-put 3x4/side, both sides).
- Upper body has equal priority with lower (men's contact): OFF upper main lifts 4x5-6, plus `neckiso`/`neckband`.
- Shoulder module (OSTRC style) in every warm-up.
- Grip: farmers carry 2 x 30 m, wrist curl 2x15.
- Women: drop upper main to accessory volume, add landing block (hop and stick, lateral bound and stick) to every session.

### 6.7 Conditioning
PRE: `ift1515`, `rsa` 3 x 6 x 30 m with stick and ball, 20 s rest; `ssgEquiv` with dodges; `maxv` weekly. IN: top-up.

### 6.8 Tests and benchmarks (college male; women ~10% slower sprint, ~20-25% lower CMJ)
| Test | Club | Good club | NCAA D1 / elite |
|---|---|---|---|
| 10 yd / 40 yd | 1.75 / 5.1 s | 1.68 / 4.9 s | < 1.65 / < 4.8 s |
| Pro agility (5-10-5) | 4.7 s | 4.5 s | < 4.4 s |
| CMJ | 35-40 cm | 40-45 cm | > 45 cm |
| Yo-Yo IR1 | 1,200-1,600 m | 1,600-2,000 m | > 2,000 m |
| Squat | 1.25 x BM | 1.5 x BM | 1.75 x BM |

### 6.9 Taper
As football 1.9.

### 6.10 Encoding notes
- `prehab` (men): `landing`, `ankle`, `nordic`, `neck`, `shoulderER`, `copenhagen`. Women: `landing`, `ankle`, `nordic`, `shoulderER`, `neck` (optional).
- Variants: `men`, `women`, plus `midfield`, `attack`, `defence`, `goalie`.

### 6.11 Sources
Fields JB et al. 2023, J Funct Morphol Kinesiol 8(3):119 (match external loads across men's and women's lacrosse); Polley CS, Cormack SJ, Gabbett TJ, Polglaze T 2015, J Strength Cond Res 29(1) (activity profile of high-level Australian lacrosse players); Dick R et al. 2007, J Athl Train 42(2):255-261 and 262-269 (descriptive epidemiology of collegiate men's and women's lacrosse injuries); Webster & Hewett 2018; Andersson 2017; Petersen 2011.

---
## Part 2. Collision codes

Shared rules for collision sports (rugby union, rugby league, American football; also apply partly to AFL, men's lacrosse, ice hockey):
- Neck training is compulsory, 2-3x/week, all year, from the first session (Activate dose).
- Upper-body strength is a main lift, not an accessory, and body mass is trained deliberately in the off-season (`mass` = 2).
- Contact itself is a load. In weeks with full-contact training, reduce lower-body eccentric volume by about a third (practice).
- After a match with many collisions, CK and soreness peak at 24-48 h and neuromuscular function can take 60 h+ to recover (McLellan 2011; Twist 2012): no heavy lower or high-volume plyometrics before MD+3.
- Concussion: the app must stop all training prompts after a reported concussion and follow the governing body's graduated return to play (World Rugby: minimum 12 days for adults in community rugby without a specialist pathway; check current rules), not its own plan.

---

## 7. Rugby union

### 7.1 Demands
| Measure | Elite | Notes |
|---|---|---|
| Duration | 80 min; ball in play ~35-40 min | |
| Total distance | Backs ~6-7 km, forwards ~5-6 km (~60-75 m/min) | Cunniffe 2009; Cahill 2013 |
| High-speed running | Backs 2-3x forwards; back three reach > 9 m/s | |
| Collisions | Forwards ~20-40 per match (tackles, rucks, mauls, scrums ~15-20 per game for front five); backs ~10-20 | Rucks and tackles dominate |
| Repeated high-intensity efforts | Clusters of sprint, tackle, get up, ruck within a few seconds | Austin 2011 |
| Jumps / lifts | Lineouts (locks jump, props lift) | |
| Energy | Intermittent: phosphocreatine and glycolytic bursts on an aerobic base; work:rest roughly 1:4 to 1:6 in open play | |

### 7.2 Positional variants
| Variant | Priorities |
|---|---|
| Front row (props, hooker) | Scrum: maximal lower-body and trunk strength, neck (highest priority), body mass; short accelerations. Upper back and shoulder girdle. Lowest aerobic volume. |
| Second row (locks) | Lineout jumping and lifting: vertical power, overhead strength (push press), mass; mauls. |
| Back row (flankers, no. 8) | Most tackles and breakdown work: strength + repeated high-intensity efforts + aerobic power. |
| Half-backs (9, 10) | Highest distance among backs; aerobic power, acceleration, kicking (hip flexor), passing. Lower mass emphasis. |
| Centres (12, 13) | Collisions + acceleration: strength-power, upper body, neck. |
| Back three (11, 14, 15) | Max velocity and aerial contests: sprint, hamstring priority, jumping and landing. |
| Women's rugby | Same structure; ACL and concussion rates higher than men's: landing and neck priority 1. |

### 7.3 Injuries and prevention
Concussion has been the most common match injury in English professional rugby for over a decade (England Professional Rugby Injury Surveillance Project). Other leading injuries: hamstring strains (most common training injury and a leading match injury in backs), knee ligament (MCL, ACL), shoulder dislocation and AC joint, ankle (including syndesmosis), thigh haematoma, neck (Brooks 2005; Williams 2013 meta-analysis).
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | Activate (World Rugby / RFU) as the warm-up | ≥ 3x/week (training x2 + gym or match day) | Strong: adult community rugby, 60% less concussion and 40% fewer targeted injuries (Attwood 2018); schools, ≥3x/week: 72% fewer match injuries, 59% less concussion (Hislop 2017) |
| 2 | `neck` | 2-3x/wk all year | Moderate |
| 3 | `nordic` | per module (backs priority) | Strong (Brooks 2006 in rugby; van Dyk 2019) |
| 4 | Shoulder robustness: `shoulderER` + heavy pressing and pulling + push-up plus + tackle technique | 2x/wk | Practice / moderate |
| 5 | `landing` + `ankle` | 2x/wk | Strong |
| 6 | `copenhagen` | 1-2x/wk | Moderate (groin less common than in soccer) |
| Front row | Neck priority 1, scrum-specific isometrics (wall or scrum-machine holds, 4-5 x 6-10 s) | 2-3x/wk | Practice |

### 7.4 Season structure (UK community defaults)
| Phase | When | Gym / wk | Conditioning / wk |
|---|---|---|---|
| OFF | May-June (after 2-3 weeks rest) | 3-4 (mass and strength block) | 2 |
| PRE | July-August (6-8 weeks) | 3 (2 once contact sessions start) | 2-3 |
| IN | September-April | 2 (I/A); 1-2 (N) | 0-1 top-up |
| CONG | Back-to-back fixtures, 7s tournaments | 1 | 0 |

Professional practice keeps 2-3 gym sessions in season; amateurs who train twice a week and play on Saturday do well on 2.

### 7.5 Week placement (match Saturday)
- Professional: Sun MD+1 recovery + upper "flush"; Mon MD-5 lower strength + upper; Tue MD-4 main contact training + upper power; Wed MD-3 off; Thu MD-2 speed, team run, power/primer gym; Fri MD-1 captain's run; Sat match.
- Amateur (Tue/Thu training): Sun recovery (walk, mobility, neck isometrics); Mon gym A (lower strength + Nordic + neck); Tue training; Wed gym B (upper strength + power + neck) or rest; Thu training (contact); Fri rest or primer; Sat match.
- Heavy lower ≥ 96 h before kick-off for forwards in contact-heavy weeks, ≥ 72 h otherwise. Upper strength fine at MD-3/MD-2.

### 7.6 Session templates
N / I / A. Rest: power 2-3 min, main 3 min, accessories 90 s.

**OFF A: lower strength + mass**
| # | Slot | Exercise | N | I | A |
|---|---|---|---|---|---|
| 1 | Power | Box jump (`boxjp`) / trap bar jump | 3x4 | 3x4 | 4x3 trap bar jump @ 20-30% |
| 2 | Main | Back squat (`squat`) / safety bar (`ssbsq`) | 3x8 RIR3 | 4x5-6 @ 75-80% | 5x4-5 @ 80-85% |
| 3 | Main 2 | RDL (`rdl`) | 3x8 | 3x6-8 | 4x5-6 |
| 4 | Unilateral | Walking lunge / BSS | 2x8 | 3x8 | 3x6 heavy |
| 5 | Prehab | Nordic | per module | | |
| 6 | Prehab | Neck 4-way isometric (`neckiso`) | 3 x 10 s each way | 3 x 15 s | 3 x 15 s + harness ext 2x12 |
| 7 | Accessory | Calf / Copenhagen | 2 sets | 2-3 sets | 3 sets |
| 8 | Trunk | Ab wheel / plank | 2 sets | 3 sets | 3 sets |

**OFF B: upper strength + mass**
| # | Slot | Exercise | N | I | A |
|---|---|---|---|---|---|
| 1 | Power | Med ball chest pass (`mbchest`) / push press (`pushpress`, A) | 3x5 | 3x5 | 4x3 push press @ 75-80% |
| 2 | Main push | Bench press (`bench`) | 3x8 RIR3 | 4x5-6 @ 75-80% | 5x4-5 @ 80-85% |
| 3 | Main pull | Weighted pull-up (`pullup`) / bent-over row (`bbrow`) | 3x6-8 | 4x6 | 4x5 weighted |
| 4 | Push 2 | DB overhead press (`ohp`) / landmine press | 3x8-10 | 3x8 | 3x6-8 |
| 5 | Pull 2 | Chest-supported row (`csdb`) | 3x10 | 3x8-10 | 3x8-10 |
| 6 | Prehab | Shoulder ER (`bander`/`er9090`) + Y-T-W | 2x12 | 2-3x12 | 3x12 |
| 7 | Prehab | Neck banded (`neckband`) | 2x12 each way | 3x12 | 3x15 |
| 8 | Grip / carry | Farmers carry (`farmers`) | 2 x 30 m | 3 x 30 m | 3 x 40 m heavy |

**OFF C (third/fourth session): total body hypertrophy** for forwards and anyone needing mass: front squat or hack 3x8-10, incline DB press 3x8-12, row 3x10-12, hip thrust 3x10, lateral raise 3x12-15, neck 3 sets, trunk.

**PRE A: lower strength-power**
Hang power clean (`hangclean`, A) 5x3 @ 70-80% or trap bar jump (I) 4x3; back squat N 3x6 / I 4x4 @ 82-85% / A 4x3 @ 85-90% contrasted with 3 box jumps (A); split squat 3x5; Nordic; neck isometric; Copenhagen 1-2 sets.

**PRE B: upper strength-power**
Med ball chest pass or plyo push-up 4x5; bench N 3x6 / I 4x4 / A 4x3 @ 85-88%; weighted pull-up 4x4-5; push press 3x3-4 (A); row 3x8; shoulder ER; neck banded; farmers carry.

**IN A: MD-5 or MD-4 (lower + upper pull)**, ~45 min
1. CMJ or box jump 3x3.
2. Squat or trap bar: N 2x6; I 3x3-4 @ 80-85%; A 3x2-3 @ 85-90%.
3. Pull-up 3x4-6.
4. Nordic 2x4-6.
5. Neck isometrics 3 x 10-15 s each direction.
6. Copenhagen or calf 1-2 sets.

**IN B: MD-3 or MD-2 (upper push + power)**, ~35 min
1. Med ball chest pass / plyo push-up 3x4.
2. Bench: N 2x6; I 3x3-4; A 3x2-3 @ 85-88%.
3. Row 3x6; push press 2x3 (A).
4. Shoulder ER 2x12; neck banded 2x12.
5. Trunk (Pallof, plank).

**Front-row add-ons (all phases)**: scrum isometric holds (wall/sled) 4 x 6-8 s, neck priority, trap bar shrug 3x8, heavier body mass target. **Locks**: push press and overhead holds, jump 3x3 from a split stance (lineout). **Back three**: replace one upper accessory with `maxv` and single-leg plyos.

### 7.7 Conditioning
| Phase | Content |
|---|---|
| OFF | 2/wk: (1) aerobic intervals on bike/rower (low impact while bulking), e.g. 4 x 4 min; (2) tempo 12-16 x 100 m (backs) or sled pushes 8 x 20 m (forwards). |
| PRE | 2-3/wk: (1) `rht` repeated high-intensity efforts (sprint, hit the ground, get up, tackle bag, sprint) 3-4 sets of 4-6 efforts; (2) `ift1515` / Bronco intervals; (3) `maxv` for backs 1-2x/wk. Forwards: wrestling / ruck clear-out conditioning 6 x 20 s. |
| IN | Top-up for non-starters and replacements: `rht` 2 x 5 efforts + `ift1515` 1 x 6 min. Starters: none beyond club training. |

### 7.8 Tests and benchmarks (senior male; women ~30% lower strength relative values for upper body, ~15% lower for lower body)
| Test | Community | National league / semi-pro | Professional |
|---|---|---|---|
| Back squat 1RM | 1.5 x BM | 1.75 x BM | 2.0 x BM+ |
| Bench 1RM | 1.0 x BM | 1.25 x BM | 1.4-1.6 x BM |
| Chin-up 1RM (incl. BM) | 1.2 x BM | 1.4 x BM | 1.5 x BM+ |
| 10 m | Fwd 1.95 / Backs 1.85 s | 1.88 / 1.78 s | < 1.80 / < 1.72 s |
| 40 m | Fwd 5.6 / Backs 5.2 s | 5.4 / 5.0 s | < 5.3 / < 4.9 s |
| CMJ | Fwd 32 / Backs 38 cm | 38 / 44 cm | 42 / 48 cm+ |
| Bronco (1,200 m) | Fwd 5:45-6:15, Backs 5:15-5:45 | 5:15-5:40 / 4:55-5:15 | < 5:15 / < 4:55 |
| Yo-Yo IR1 | 1,000-1,400 m | 1,400-1,800 m | Fwd > 1,600, Backs > 2,000 m |

### 7.9 Taper
Cup final / play-off: 7-10 days; reduce contact training and lifting volume by ~40-50% while keeping load; last heavy lower MD-6; last heavy upper MD-4; MD-1 captain's run plus a 10-min primer (2x3 jumps, 2x2 med ball throws). 7s tournaments: no gym in tournament week except primer; recovery between matches (carbohydrate, fluids, sleep).

### 7.10 Encoding notes
- Variants: `frontrow`, `lock`, `backrow`, `halfback`, `centre`, `backthree`, flag `female`.
- `prehab` order: `neck`, `nordic`, `shoulderER`, `landing`, `ankle`, `copenhagen`. Neck must appear in at least 2 sessions a week regardless of slot count.
- `mdRules`: heavy lower ≥ 72 h (96 h for forwards after contact-heavy training), upper ≥ 48 h; `avoidBefore: "all"` is too blunt: allow a primer on MD-1.

### 7.11 Sources
Attwood MJ et al. 2018, Br J Sports Med 52(6):368-374 (efficacy of a movement control injury prevention programme in adult men's community rugby union; https://researchportal.bath.ac.uk/en/publications/efficacy-of-a-movement-control-injury-prevention-programme-in-adu/); Hislop MD et al. 2017, Br J Sports Med 51(15):1140-1146 (reducing musculoskeletal injury and concussion risk in schoolboy rugby; https://bjsm.bmj.com/content/51/15/1140); World Rugby Activate research summary (https://passport.world.rugby/injury-prevention-and-risk-management/activate/research/); Brooks JHM et al. 2005, Br J Sports Med 39(10):757-766 (epidemiology of injuries in English professional rugby union: match injuries); Brooks JHM et al. 2006, Am J Sports Med 34(8):1297-1306 (incidence, risk and prevention of hamstring muscle injuries in professional rugby union); Williams S et al. 2013, Sports Med 43(10):1043-1055 (meta-analysis of injuries in senior men's professional rugby union); Cunniffe B et al. 2009, J Strength Cond Res 23(4):1195-1203 (time-motion analysis of elite rugby union using GPS); Cahill N et al. 2013, J Sports Sci 31(3):229-237 (positional movement demands of elite rugby union); Austin D, Gabbett T, Jenkins D 2011, J Sci Med Sport 14(3):259-263 (repeated high-intensity exercise in professional rugby union); McLellan CP, Lovell DI, Gass GC 2011, J Strength Cond Res 25(11):2908-2919 (biochemical and endocrine responses to rugby league matches; post-match neuromuscular recovery); Naish R et al. 2013, J Sports Sci Med 12(3):542-550 (neck strengthening and cervical spine injury in professional rugby union); Collins 2014.

---

## 8. Rugby league

### 8.1 Demands
| Measure | Elite (NRL / Super League) |
|---|---|
| Duration | 80 min; interchange (8 in NRL, 8 in Super League) means many forwards play 40-60 min |
| Total distance | ~5-7 km; relative ~90-100 m/min (higher than union because the ball is in play more and the 10 m defensive retreat) |
| High-speed running | Outside backs highest; many short "up and back" efforts in defence |
| Collisions | Forwards ~30-45 per match (tackles made and hit-ups), outside backs ~15-25; middle forwards highest per minute |
| Repeated high-intensity effort (RHIE) bouts | 3+ efforts (sprint/collision) with < 21 s between: forwards perform them most, often near tries |
| Energy | High-intensity intermittent with heavy collision cost; aerobic power underpins repeated effort ability |

### 8.2 Positional variants
- Middle forwards (props, locks): most collisions per minute, mass and strength, RHIE ability, neck; play 40-60 min.
- Edge forwards (second row): collisions + speed; tackle and carry on the edges.
- Hooker / halves (adjustables): highest distance and aerobic demand, most decisions; less mass.
- Outside backs (centres, wings, fullback): max velocity, high balls (jumping and landing), collisions in carries; hamstring priority.

### 8.3 Injuries and prevention
Most injuries occur in the tackle (both tackler and ball carrier); head/face (concussion), shoulder, knee and ankle are the main sites; hamstring and other muscle strains are the leading non-contact injuries (Gabbett 2004; King 2010 review; Fitzpatrick 2018 Super League).
Prevention priorities: `neck`, tackle technique (coaching), `nordic`, shoulder robustness (`shoulderER` + pressing/pulling), `landing` and `ankle`, Activate-style warm-up (developed for union but transferable: practice). RFL now promotes a league version of the movement-control warm-up (practice).

### 8.4 Season structure
Super League / community: OFF Oct-Nov; PRE Dec-Jan (8-10 weeks, the hardest conditioning block); IN Feb-Sept (UK community summer season Mar-Sept). Gym: OFF 3-4, PRE 3, IN 2 (I/A) or 1-2 (N).

### 8.5 Week placement
As rugby union 7.5. Short turnarounds (5-6 days) are common: drop the lower strength session to 2 sets and move it to MD+2/MD+3.

### 8.6 Session templates
Use rugby union templates 7.6 with these changes:
- More conditioning-integrated strength in PRE: after the main lifts, a 6-8 min "wrestle and get up" circuit for forwards (practice).
- Middle forwards: extra isometric neck and wrestling grip (towel pull-ups 3x5, farmers carry heavy).
- Halves/hooker: lower upper-body volume (3 sets per main lift), more `ift1515` and accelerations.
- No scrum-specific isometrics (scrums are uncontested in effect at most levels): replace with wrestling holds (bear-hug carries, sandbag carry 3 x 20 m).

### 8.7 Conditioning
PRE: `rht` is the cornerstone (sprint 10-20 m, down to the ground or tackle bag, up, 10 m retreat, sprint; 3-4 sets of 5-6 efforts; 2/wk), `ift1515` 2 x 8 min, `maxv` for outside backs. Defensive "up and back" shuttles: 10 m forward, 10 m backpedal x 6, rest 20 s, x 4 sets. IN: top-up for interchange players and non-starters.

### 8.8 Tests and benchmarks (senior male)
| Test | Community | Semi-pro / Championship | Super League / NRL |
|---|---|---|---|
| Squat 1RM | 1.5 x BM | 1.75 x BM | 2.0 x BM |
| Bench 1RM | 1.0 x BM | 1.25 x BM | 1.4-1.5 x BM |
| 10 m / 40 m | 1.85 / 5.3 s | 1.78 / 5.1 s | < 1.75 / < 5.0 s (outside backs < 4.8 s) |
| Yo-Yo IR1 | 1,200-1,600 m | 1,600-2,000 m | > 2,000 m |
| 1.2 km shuttle / Bronco | 5:30 | 5:10 | < 5:00 |

### 8.9 Taper
As rugby union 7.9. Grand final: 10-14 days with contact volume reduced from ~MD-10, intensity kept.

### 8.10 Encoding notes
Variants: `middle`, `edge`, `adjustable` (hooker, halves), `outside`. `prehab`: `neck`, `nordic`, `shoulderER`, `landing`, `ankle`. Conditioning must default to `rht` in PRE.

### 8.11 Sources
Glassbrook DJ et al. 2019, Sports Med 49(10):1569-1582 (demands of professional rugby league match-play: a meta-analysis; https://research-repository.griffith.edu.au/items/0c61b4cc-bde5-4aac-88a3-183dc28fbe2f); Gabbett TJ, Jenkins DG, Abernethy B 2012, J Sci Med Sport 15(1):80-86 (physical demands of professional rugby league training and competition using microtechnology); Austin DJ, Gabbett TJ, Jenkins DG 2011, J Strength Cond Res 25(7):1898-1904 (repeated high-intensity exercise in professional rugby league); Gabbett TJ 2004, J Sports Sci 22(2):139-153 (influence of training and match intensity on injuries in rugby league); King DA et al. 2010, Sports Med 40(2):163-178 (epidemiology of injuries in rugby league); Fitzpatrick AC et al. 2018, J Sci Med Sport 21(2):160-165 (three-year study of match injuries in the European Super League); Twist C et al. 2012, J Sports Sci 30(4):359-367 (neuromuscular, biochemical and perceptual post-match fatigue in professional rugby league forwards and backs); Hislop 2017; Attwood 2018; van Dyk 2019.

---

## 9. American football (gridiron)

### 9.1 Demands
| Measure | Values |
|---|---|
| Play structure | Plays last ~4-6 s, 25-40 s between plays (40 s play clock), longer rests at changes of possession; ~60-80 snaps per side per game; work:rest ~1:6 to 1:8 |
| Distance (college) | Wide receivers and defensive backs cover the most (~4-5.5 km), linemen the least (~2-3 km) (Wellman 2016) |
| Sprints | Skill positions: many 10-40 yd sprints at > 90% speed; linemen: 1-10 yd explosive starts on every snap |
| Collisions | Linemen collide on every snap; linebackers, running backs and tight ends very frequently; skill players fewer but at higher speed |
| Energy | ATP-PC dominant per play with phosphocreatine resynthesis in rest periods; aerobic fitness speeds recovery between drives |
| Body mass | Linemen 130-160 kg in college/NFL; skill players 85-95 kg |

### 9.2 Positional variants (the biggest of any sport here)
| Group | Positions | Priorities |
|---|---|---|
| Bigs | OL, DL | Maximal strength (squat, bench, pulls), first-step power from a 3-point stance, hand-fighting (pressing power, grip), neck, mass. Conditioning: 10-15 yd bursts with 25-35 s rest. |
| Big skill | LB, TE, FB, RB | Strength-power plus acceleration and COD; collision every play; neck. |
| Skill | WR, DB (CB, S) | Max velocity and COD, hamstring priority, jumps (contested catches), lower mass. Conditioning: 20-40 yd sprints with 30-40 s rest. |
| QB | | Throwing shoulder and elbow (`shoulderER`, `elbow`), rotational power, footwork; avoid heavy overhead pressing near games. |
| Specialists | K, P, LS | Kicking: hip flexor, adductor, `copenhagen`, `hipFlex`; long snapper: back and shoulder. |

### 9.3 Injuries and prevention
Most common: knee (MCL, ACL, meniscus), ankle sprains (including high ankle), concussion, shoulder (AC joint, instability), hamstring (skill positions, especially early pre-season), turf toe; heat illness in summer camp (Dick 2007 NCAA football surveillance).
| Priority | Module | Dose |
|---|---|---|
| 1 | `neck` | 2-3x/wk all year |
| 2 | `nordic` (skill positions priority 1) + `maxv` before camp | per module |
| 3 | `landing`, `ankle` | 2-3x/wk |
| 4 | Shoulder robustness (`shoulderER`, pressing/pulling balance 1:1 or more pulling) | 2x/wk |
| 5 | Heat acclimatisation: phase in helmets and pads over ~14 days at the start of camp (NATA / NCAA guidance) | Pre-season |
| 6 | `copenhagen` | 1-2x/wk (specialists 2-3x) |

### 9.4 Season structure
US high school / college: winter off-season programme (Jan-Mar, gym 4/wk), spring practice, summer programme (Jun-Jul, gym 4/wk + conditioning 3-4/wk), fall camp (Aug), season (Sep-Nov/Dec, gym 2/wk). UK BAFA adult: season roughly spring to late summer; off-season autumn/winter. Gym: OFF 3-4, PRE 3, IN 2.

### 9.5 Week placement (game Saturday, college model)
Sun: recovery + lift for non-starters; Mon: total-body strength (heavier, MD-5); Tue/Wed: full-pad practices (Wed: second lift, lighter, speed-strength, MD-3); Thu: shells, light; Fri: walk-through + primer optional; Sat: game. Amateur (2 practices + Saturday game): gym Mon (A) and Wed (B), never heavy legs within 72 h of kick-off.

### 9.6 Session templates (OFF 4-day upper/lower split is standard)
**OFF Lower 1 (strength)**: hang clean (A) or trap bar jump 4x3; back squat N 3x8 / I 5x5 @ 75-80% / A 5x3 @ 85%; RDL 3x6; walking lunge 3x8; Nordic; neck isometrics; ab wheel.
**OFF Upper 1 (strength)**: med ball chest pass 3x5; bench N 3x8 / I 5x5 / A 5x3 @ 85%; weighted pull-up 4x5; DB incline 3x8; row 3x10; shoulder ER 2x12; neck banded.
**OFF Lower 2 (power / unilateral)**: box jump 4x3; front squat or trap bar DL 4x4 @ 80%; split squat 3x6; hip thrust 3x8; Copenhagen; calf; side plank.
**OFF Upper 2 (hypertrophy for bigs, speed-strength for skill)**: push press 4x3 (A); DB bench 3x10; chin-up 3x8-10; landmine press 3x8; face pull 3x15; farmers carry; neck.
Skill positions replace Upper 2 with a speed session (acceleration 6 x 10 yd, `maxv` 4 x 30 yd, COD 6 x pro agility).

**PRE / camp (2-3 sessions)**: Lower: clean or jump 4x3, squat 4x3 @ 85%, Nordic 2x5, neck. Upper: bench 4x3 @ 85%, pull-up 4x5, med ball throw, shoulder ER, neck.
**IN A (MD-5)**: squat or trap bar 3x3 @ 80-85%, bench 3x3 @ 80-85%, pull-up 3x5, Nordic 2x4, neck 3 x 10 s each way. 40 min.
**IN B (MD-3)**: jumps 3x3, med ball 3x3, push press or DB press 2x5, row 2x8, shoulder ER, neck. 30 min.

### 9.7 Conditioning
Position-specific, at the sport's work:rest:
- Bigs: 10-15 yd sprints from a stance x 8-12, 25-35 s rest, 2-3 sets of a "drive" (3-4 min between).
- Skill: 20-40 yd sprints x 8-12, 30-40 s rest, 2-3 drives; plus `maxv`.
- Big skill: 15-25 yd with COD, same structure.
OFF: aerobic base for bigs on a bike (20-30 min) to aid between-play recovery. Classic tests: 300 yd shuttle (25 yd x 12), 110s (16 x 110 yd under position-specific time), used as PRE checks.

### 9.8 Tests and benchmarks (NFL Combine norms for reference; adult amateur ~10-15% slower and weaker)
| Test | Bigs (OL/DL) elite | Big skill (LB/TE/RB) elite | Skill (WR/DB) elite | Adult amateur skill / big |
|---|---|---|---|---|
| 40 yd | 5.0-5.3 s | 4.5-4.8 s | 4.35-4.55 s | 4.9-5.2 / 5.4-5.8 s |
| 10 yd split | 1.75-1.85 s | 1.55-1.65 s | 1.50-1.58 s | 1.65-1.75 / 1.85-1.95 s |
| Vertical jump | 70-80 cm | 80-90 cm | 90-100 cm | 60-70 / 50-60 cm |
| Pro agility (5-10-5) | 4.5-4.8 s | 4.2-4.4 s | 4.0-4.2 s | 4.4-4.6 / 4.8-5.0 s |
| Bench 225 lb (102 kg) reps | 25-35 | 18-25 | 12-18 | |
| Squat 1RM | 2.0 x BM | 1.9 x BM | 1.75 x BM | 1.5 / 1.5 x BM |

### 9.9 Taper
Bowl game or play-off: keep the lifting schedule but cut volume ~40%; limit full-pad contact in the last 7 days; last heavy lower MD-5.

### 9.10 Encoding notes
- Variants: `bigs`, `bigskill`, `skill`, `qb`, `specialist`. These need different session lists and conditioning, not just different weights.
- `q` for `bigs`: maxStrength 3, mass 2, upperPush 3, neck 3, power 3. `skill`: maxStrength 2, power 3, unilateral 3, mass 1.
- `prehab`: `neck`, `nordic`, `landing`, `ankle`, `shoulderER`, `copenhagen`; QB adds `elbow`.

### 9.11 Sources
Wellman AD, Coad SC, Goulet GC, McLellan CP 2016, J Strength Cond Res 30(1):11-19 (quantification of competitive game demands of NCAA Division I college football players using GPS; https://research.bond.edu.au/en/publications/quantification-of-competitive-game-demands-of-ncaa-division-i-col/); Dick R et al. 2007, J Athl Train 42(2):221-233 (descriptive epidemiology of collegiate men's football injuries); Casa DJ et al. 2009, J Athl Train 44(3):332-333 (pre-season heat-acclimatisation guidelines for secondary school athletics); Hoffman JR 2008, Int J Sports Physiol Perform 3(3):387-392 (the applied physiology of American football); Collins 2014; van Dyk 2019; NFL Combine published results (position norms).

---
## Part 3. Court and ice invasion sports

Shared rules for court sports (basketball, netball, volleyball, handball):
- Ankle sprains are the most common acute injury in all four. Balance training is compulsory, and a player with a previous sprain gets a prompt to brace or tape for matches and training.
- Jump and landing volume is the main tendon load. Count jumps in plyometric sessions as part of the weekly jump load, and in heavy practice weeks reduce gym plyos rather than adding them (patellar tendinopathy risk follows load spikes).
- Female players get the ACL landing module as priority 1, 2-3x/week, all year.
- Court sports are deceleration-heavy: eccentric quadriceps and single-leg strength (split squats, step-downs, deceleration drills) matter more than linear speed past ~15 m.

---

## 10. Basketball

### 10.1 Demands
| Measure | Elite |
|---|---|
| Duration | 4 x 10 min (FIBA) / 4 x 12 (NBA); live play roughly half of elapsed time; players ~25-35 min |
| Total distance | ~5-6 km per game for heavy-minute players (~60-80 m/min live) |
| Movement changes | ~1,000 per game, one every 2-3 s; high-intensity bouts ~ every 20-30 s |
| Jumps | ~40-60 per game (centres and forwards more); landings often single-leg and in traffic |
| Accelerations / decelerations | Very high counts; lateral shuffles ~ 30%+ of movements |
| Contact | Moderate (post play, screens, rebounds) |
| Energy | HR ~85-90% HRmax during live play; intermittent with heavy anaerobic contribution; aerobic power supports recovery |

### 10.2 Positional variants
- Guards: most accelerations, sprints and distance; aerobic power and COD priority; ball pressure (lateral slides).
- Forwards (wings): mixed; most "transition" sprints and rebounds.
- Centres / bigs: most jumps and contact (post play, boxing out); maximal strength, upper body and trunk strength, landing and patellar tendon priority; lowest distance.

### 10.3 Injuries and prevention
Ankle sprains are the most common injury, followed by knee (patellar tendinopathy, ligament), low back, hand and finger injuries; female players have a substantially higher ACL rate (Agel 2007; Drakos 2010 NBA).
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | `ankle` + lace-up brace for players with previous sprains (or all youth) | Balance 3x/wk; brace in all play | Strong (McGuine 2006; McGuine 2011: lace-up braces cut acute ankle injuries by ~68% in high school basketball) |
| 2 | `landing` (neuromuscular warm-up: FIFA 11+ adapted, PEP) | 2-3x/wk | Strong (Longo 2012 11+ in basketball; Webster & Hewett 2018) |
| 3 | `patellar` + jump-load management | 2x/wk | Moderate |
| 4 | `calf` | 2-3x/wk | Practice |
| 5 | `hipAbd` + `copenhagen` (lateral movement) | 2x/wk | Moderate |
| 6 | `lowback` | 2x/wk | Practice |

### 10.4 Season structure
UK/European club: OFF May-July, PRE Aug-Sept, IN Oct-April (1-2 games/wk; pros 2-3, NBA 3-4). Gym: OFF 3, PRE 2-3, IN 2 (1 game/wk) or 1 (2+ games/wk).

### 10.5 Week placement
One game (Saturday), practices Tue/Thu: gym A Monday (MD-5, lower strength), gym B Wednesday (MD-3, power + upper, low lower volume), primer Friday optional. Two games (e.g. Wed + Sat): one session on MD+2/MD-2 (maintenance). NBA-style schedules: strength "micro-dosed" (2 x 20 min a week, the day after a game or on non-game days), common in professional practice.

### 10.6 Session templates
**OFF A: lower strength**: box jump 3x4 (N: pogo 3x10); trap bar DL or front squat N 3x8 / I 4x5 @ 80% / A 5x3 @ 85%; Bulgarian split squat 3x6-8; Nordic per module; seated calf 3x10 + single-leg calf 2x15; Spanish squat isometric 4 x 30 s (bigs, or anyone with knee pain); Pallof 2x10.
**OFF B: upper + posterior chain + lateral**: lateral bound and stick 3x4/side; RDL or hip thrust 3x6-8; DB bench 3x8; pull-up 3x6-8; lateral lunge (`lateralLunge`) 3x6/side; Copenhagen 2 sets; single-leg balance with catches 2 x 30 s; side plank.
**OFF C (I/A)**: depth-to-CMJ or hurdle hops 3x5; step-up 3x6; landmine press 3x8; row 3x10; deceleration drill (sprint 5 m, stop in 2 steps) 4x3; calf.
**PRE A**: approach jumps (2-step to max jump, land and stick) 4x3; squat contrast (A: 4x3 @ 85% + 3 box jumps; I: 3x4 @ 80%); single-leg RDL 3x6; Nordic; patellar isometrics; ankle balance.
**PRE B**: trap bar jump 3x4; push press (A) or DB press 3x5; pull-up 3x5; lateral bound 3x4/side; Copenhagen; trunk.
**IN A (MD-4/MD-3)**: CMJ 3x3; trap bar or squat 3x3 @ 80-85% (N 2x6); split squat 2x5; pull-up 2x5; Nordic 2x4; calf 2x10; ankle balance. 35-40 min.
**IN B (MD-2)**: med ball chest pass 3x3; DB bench 2x6; row 2x8; Spanish squat 3 x 30 s; Copenhagen 1/side; trunk. 25 min.

### 10.7 Conditioning
- OFF: aerobic base (bike or court 4 x 4 min), plus on-court tempo (full-court jog / walk back x 15).
- PRE: `courtHIIT` (e.g. 3-4 sets of 6-8 x 15 s full-court sprint with layup, 15-30 s rest), suicides/17s as a test, `rsa` with 180° turns (6 x 2 x 14 m, 20 s rest), defensive slide intervals 6 x 15 s.
- IN: top-up for bench players after games (MD+1): 2 x 6 x 15 s / 15 s.

### 10.8 Tests and benchmarks (male; female CMJ ~25-30% lower, sprints ~8-10% slower)
| Test | Club | University / national league | Professional |
|---|---|---|---|
| CMJ | 38-44 cm | 44-52 cm | > 52 cm |
| Max approach vertical | 60-70 cm | 70-80 cm | > 80 cm |
| 3/4-court sprint (22.9 m) | 3.40-3.50 s | 3.25-3.40 s | < 3.25 s |
| Lane agility | 11.8-12.3 s | 11.2-11.8 s | < 11.2 s |
| Yo-Yo IR1 | 1,000-1,400 m | 1,400-1,800 m | > 1,800 m |
| Trap bar / squat 1RM | 1.25 x BM | 1.5 x BM | 1.75 x BM |
| Y-balance anterior asymmetry | < 4 cm (Plisky 2006) | | |

### 10.9 Taper
Play-off or tournament: 7-10 days, practice volume down 30-40%, keep intensity; last heavy lower MD-5; daily 10-min primers (jumps, sprints) during tournaments.

### 10.10 Encoding notes
Variants: `guard`, `forward`, `big`; flag `female`. `prehab`: `ankle`, `landing`, `patellar`, `calf`, `hipAbd`, `copenhagen`, `lowback`. Add a jump counter per week (practice).

### 10.11 Sources
Stojanović E et al. 2018, Sports Med 48(1):111-135 (activity demands and physiological responses in basketball: systematic review); Ben Abdelkrim N, El Fazaa S, El Ati J 2007, Br J Sports Med 41(2):69-75 (time-motion analysis and physiological data of elite under-19 basketball); McGuine & Keene 2006; McGuine 2011; Longo UG et al. 2012, Am J Sports Med 40(5):996-1005 (FIFA 11+ in elite male basketball players); Agel J et al. 2007, J Athl Train 42(2):202-210 (NCAA men's basketball injuries); Drakos MC et al. 2010, Sports Health 2(4):284-290 (injury in the NBA: 17-year overview); Plisky 2006; Webster & Hewett 2018.

---

## 11. Netball

### 11.1 Demands
| Measure | Elite |
|---|---|
| Duration | 4 x 15 min |
| Total distance | Centre and wings highest (~6-8 km), goal shooter and goal keeper lowest (~3-4 km); zone rules restrict each position |
| Activity changes | Every ~3-5 s; many short sprints (< 10 m), sudden stops |
| One-step rule | Abrupt decelerations and single-leg landings while receiving the ball: the main injury mechanism |
| Jumps | Frequent (rebounds, interceptions, high passes); circle players most |
| Contact | Non-contact in the rules, but collisions and contested landings are frequent |
| Energy | High-intensity intermittent; HR ~80-90% HRmax in centre court players |

### 11.2 Positional variants
- Centre, WA, WD: highest running and aerobic demand; RSA and aerobic power priority.
- GA, GD: mixed.
- GS, GK: jumping, holding position (upper-body and trunk strength, contact), lowest distance; landing priority.

### 11.3 Injuries and prevention
Ankle sprains (~40% of injuries) and knee injuries (ACL the most costly) dominate; up to four in five netballers report at least one ankle sprain in their career (Attenborough 2016; Rowe 2021). National programmes: NetballSmart Dynamic Warm-up (New Zealand) and the KNEE programme (Netball Australia). These improved landing technique and were followed by fewer ankle injuries in national data, but RCT evidence of injury reduction in netball itself is limited; the evidence comes from equivalent programmes in other sports.
| Priority | Module | Dose |
|---|---|---|
| 1 | `landing` (KNEE / NetballSmart content: landing, deceleration, balance, strength) | 2-3x/wk, all year |
| 2 | `ankle` (+ brace or tape after a previous sprain) | 3x/wk |
| 3 | `nordic` | per module |
| 4 | `calf` / Achilles | 2x/wk |
| 5 | `hipAbd` | 2x/wk |
| 6 | `patellar` (circle players) | 2x/wk |

### 11.4 Season structure
UK: season Sept-April (Netball Super League Feb-June). OFF 6-8 weeks after the season, PRE 6-8 weeks. Gym: OFF 3, PRE 2-3, IN 1-2. Tournaments and back-to-back weekend games: CONG.

### 11.5 Week placement
As basketball 10.5.

### 11.6 Session templates
Basketball templates with these changes:
- Every session starts with a 10-min KNEE/NetballSmart block (landing on two feet then one, deceleration to stop in one step, partner bumps in the air with stick landings).
- Deceleration emphasis: "sprint 5 m, stop on one foot within the one-step rule" 4 x 3 per leg; split squat and step-down eccentrics (3 s lowering).
- Upper body: lower priority (1 push, 1 pull at 2-3 sets), except circle players (add 1 upper set and trunk anti-rotation).

### 11.7 Conditioning
`courtHIIT` with netball movement: e.g. 8 x (5 m sprint, stop, change direction, 5 m sprint, jump-and-land) 15 s on / 15-30 s off, 3 sets. `rsa` 6 x 10-15 m with stop, 20 s rest. Centre-court players: `ift1515` 2 x 6-8 min.

### 11.8 Tests and benchmarks (senior female)
| Test | Club | Regional / Super League pathway | International |
|---|---|---|---|
| 5 m / 10 m | 1.20 / 2.05 s | 1.15 / 1.95 s | < 1.10 / < 1.90 s |
| CMJ | 26-30 cm | 30-35 cm | > 35 cm |
| 505 | 2.65-2.80 s | 2.55-2.65 s | < 2.50 s |
| Yo-Yo IR1 | 600-900 m | 900-1,200 m | > 1,200 m (centre court higher) |
| Squat 1RM | 1.0 x BM | 1.25 x BM | 1.5 x BM |
| Single-leg hop asymmetry | < 10% | | |

### 11.9 Taper
As basketball 10.9. Netball tournaments often have 2-3 games a day: no gym in the tournament; landing warm-up before each game.

### 11.10 Encoding notes
`prehab`: `landing`, `ankle`, `nordic`, `calf`, `hipAbd`, `patellar`. Variants: `centrecourt`, `circle`. Assume female by default but don't hard-code it (men's and mixed netball exist).

### 11.11 Sources
Rowe C, Bryant AL, Paterson K 2021, BMC Sports Sci Med Rehabil 13:116 (ankle sprain prevention and management in netball: scoping review; https://link.springer.com/article/10.1186/s13102-021-00342-9); Attenborough AS et al. 2016, J Sci Med Sport 19(5):379-384 (chronic ankle instability in netball); Belcher S et al. 2021, Phys Ther Sport (NetballSmart and landing technique in youth netballers); Saad K et al. 2021, J Sports Sci (implementation of the KNEE programme in community netball); Webster & Hewett 2018; Schiftan 2015.

---

## 12. Volleyball (indoor; beach notes included)

### 12.1 Demands
| Measure | Values |
|---|---|
| Rally | ~5-8 s on average, ~12-20 s rest between rallies; matches 60-120 min (best of 5 sets) |
| Jumps per match | Professional men: setters ~100, middles ~85, opposites ~82, outside hitters ~68 per match; per training session 60-120 (Skazalski 2018) |
| Jump intensity | Opposites perform the most high-intensity jumps (median ~76% of max height); setters many low jumps |
| Spikes / serves | Outside hitters and opposites 20-40+ attacks per match plus jump serves: very high shoulder load |
| Movement | Short lateral and forward moves (< 5 m), digging in deep squats, diving |
| Energy | ATP-PC and anaerobic per rally; aerobic for recovery across long matches |
| Beach | 2 players on sand: more jumps per player, more lateral work, lower jump heights, heat; sand reduces impact but increases calf and hip work |

### 12.2 Positional variants
- Middle blockers: highest jumps per minute on court, block jumps and quick attacks: patellar load, lateral block footwork, max vertical.
- Outside hitters and opposites: highest-intensity spikes and jump serves: shoulder priority 1, vertical power, rotational trunk.
- Setters: most jumps (low), overhead hands: ankle, fingers, patellar.
- Libero: no jumping attacks; digging, lateral movement, low squats: ankle, hip, low back; less plyometric volume.

### 12.3 Injuries and prevention
Ankle sprains are the most common acute injury (mostly landing on an opponent's or team-mate's foot under the net). Patellar tendinopathy is the main overuse problem (about 40-45% of elite players report symptoms: Lian 2005); shoulder overuse (infraspinatus and posterior shoulder) is common in hitters; low back pain in all positions.
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | `ankle` (balance board programme) + net-landing technique | 3x/wk | Strong (Bahr 1997 technique + balance programme halved sprains; Verhagen 2004 balance board RCT) |
| 2 | `shoulderER` (OSTRC: ER strength, internal rotation range, scapular control) | 3x/wk warm-up | Strong (Andersson 2017 in handball; same mechanism) |
| 3 | `patellar` + jump-load management (avoid weekly jump spikes: in 18 of 28 weeks at least one player doubled his jump count) | 2x/wk | Moderate (Visnes & Bahr 2013: risk rose with match sets and training hours) |
| 4 | `landing` (female ACL) | 2x/wk | Strong |
| 5 | `lowback` + `trunkLat` | 2x/wk | Practice |
| 6 | `calf` (beach, setters) | 2x/wk | Practice |

### 12.4 Season structure
Indoor UK/European: OFF May-July, PRE Aug-Sept, IN Oct-April (1-2 matches/wk, often weekend doubles). Beach: summer tournaments (multiple matches per day). Gym: OFF 3, PRE 2-3, IN 1-2.

### 12.5 Week placement
Gym A (lower) at least 72 h before a match; because practice already contains 60-120 jumps, gym plyometrics in season are limited to 2-3 sets of 3 max-effort jumps. Weekend double-headers: MD+2 maintenance only.

### 12.6 Session templates
**OFF A: lower strength (low jump volume)**: trap bar DL or squat N 3x8 / I 4x5 @ 80% / A 5x3 @ 85%; split squat 3x6; Spanish squat or decline squat 4 x 30-45 s or 3x8 slow; Nordic per module; calf 3x10; ankle balance; Pallof.
**OFF B: upper + shoulder**: med ball overhead throw (`mboverhead`) 3x5 (I/A); landmine press (overhead-friendly) 3x8; pull-up 3x6-8; row 3x10; shoulder ER at 90/90 3x12; Y-T-W 2x10; push-up plus 2x12; side plank.
**OFF C (I/A)**: approach jumps 4x3 (land on two feet, stick); hip thrust 3x6; lateral lunge 3x6; rotational med ball 3x4/side; trunk.
**PRE A**: block jumps from a static start 3x4 (lateral shuffle then jump, middles) or approach jumps 4x3; squat contrast (A) 4x3 @ 85% + 3 jumps; Nordic; patellar isometrics; ankle.
**PRE B**: med ball slam / overhead throw 3x4; push press (A) 3x3 or DB press 3x6; pull-up 3x5; shoulder ER + sleeper stretch; Copenhagen; trunk.
**IN A (MD-4)**: CMJ 2x3; trap bar or squat 3x3 @ 80-85%; split squat 2x5; Spanish squat 3 x 30 s; pull-up 2x5; shoulder ER 2x12. 35 min.
**IN B (MD-2)**: landmine press 2x6; row 2x8; shoulder module; ankle balance; trunk. 20-25 min, no jumps.
Libero variant: drop approach jumps, add lateral lunge, deep squat mobility, and more ankle work.

### 12.7 Conditioning
Little extra conditioning needed beyond practice for most players. PRE: `courtHIIT` with volleyball movement: 6-8 s work (block-land-transition-attack) / 15 s rest x 10, 3 sets. Beach: sand intervals 10 x 10 s / 20 s.

### 12.8 Tests and benchmarks
| Test | Club (M / F) | National league (M / F) | International (M / F) |
|---|---|---|---|
| CMJ | 40 / 30 cm | 48 / 35 cm | > 55 / > 40 cm |
| Spike jump (approach) height gain | 65 / 45 cm | 75 / 52 cm | > 85 / > 58 cm |
| Spike reach | | | ~3.45-3.60 m / ~3.00-3.15 m |
| T-test (agility) | 10.5 / 11.5 s | 10.0 / 11.0 s | < 9.6 / < 10.5 s |
| Shoulder ER:IR strength ratio | > 0.66 | | |
| Squat 1RM | 1.25 / 1.0 x BM | 1.5 / 1.25 x BM | 1.75 / 1.5 x BM |

### 12.9 Taper
Tournament: last heavy lower MD-5 with half the sets; jump volume in practice reduced 30-50% in the last week; primers only.

### 12.10 Encoding notes
Variants: `middle`, `outside` (incl. opposite), `setter`, `libero`, `beach`. `prehab`: `ankle`, `shoulderER`, `patellar`, `landing`, `lowback`, `calf`. Limit plyo contacts in season to ≤ 20 per gym session because practice jump load is high.

### 12.11 Sources
Skazalski C, Whiteley R, Bahr R 2018, Scand J Med Sci Sports 28(11):2293-2298 (high jump demands in professional volleyball; https://nih.brage.unit.no/nih-xmlui/handle/11250/2602829); Lian ØB, Engebretsen L, Bahr R 2005, Am J Sports Med 33(4):561-567 (prevalence of jumper's knee among elite athletes); Visnes H, Bahr R 2013, Scand J Med Sci Sports 23(5):607-613 (training volume and body composition as risk factors for jumper's knee in young elite volleyball players); Bahr R, Lian O, Bahr IA 1997, Scand J Med Sci Sports 7(3):172-177 (a twofold reduction in ankle sprains in volleyball after an injury prevention programme); Verhagen E et al. 2004, Am J Sports Med 32(6):1385-1393 (balance board programme in volleyball); Andersson 2017; Kongsgaard 2009.

---

## 13. Handball

### 13.1 Demands
| Measure | Elite |
|---|---|
| Duration | 2 x 30 min; unlimited rolling subs |
| Total distance | ~4-5 km per full-match player (~70-90 m/min); wings highest HSR, pivots lowest distance |
| High-intensity actions | Hundreds of activity changes; ~ 15-20 sprints; many accelerations and cuts |
| Jumps | Jump shots, blocks: ~15-30 per match (backs and wings most) |
| Throws | 10-20 shots per match plus many passes; shot velocity elite men ~ 25-30 m/s |
| Contact | Heavy (pivots wrestle; backs take blocks and fouls); legal body contact in defence |
| Energy | High-intensity intermittent; HR ~ 80-90% HRmax; aerobic base supports repeated efforts |

### 13.2 Positional variants
- Wings: fastest players, jumps from tight angles, counter-attack sprints: max velocity, single-leg power, hamstring.
- Backs (left/right back, centre back): jump shots and long-range throws: shoulder priority 1, rotational and vertical power, upper-body strength, contact.
- Pivot (line player): wrestling for space, the most contact: maximal strength, mass, upper body, neck, trunk.
- Goalkeeper: splits and lateral leaps: groin (Copenhagen), hip mobility, reaction.

### 13.3 Injuries and prevention
Ankle and knee injuries dominate acute injuries (ACL in female players is a major problem); shoulder overuse affects ~30-40% of players across a season; hand/finger and head injuries from contact.
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | Structured warm-up: balance, landing, cutting, strength (Olsen 2005 programme) | 2-3x/wk | Strong (Olsen 2005: ~50% fewer acute knee and ankle injuries in youth handball; Myklebust 2003 ACL in elite female handball) |
| 2 | `shoulderER` (OSTRC shoulder programme) | 3x/wk, 10 min | Strong (Andersson 2017: 28% fewer shoulder problems) |
| 3 | `landing` (female players priority 1) | 2-3x/wk | Strong |
| 4 | `ankle` | 2-3x/wk | Strong |
| 5 | `nordic` | per module | Moderate (hamstring less dominant than in football) |
| 6 | `copenhagen` (goalkeepers priority) | 1-2x/wk | Moderate |
| 7 | `neck` (pivots, backs) | 2x/wk | Practice |

### 13.4 Season structure
European club: OFF June-July, PRE late July-Aug, IN Sept-May (1-2 matches/wk). Gym: OFF 3, PRE 2-3, IN 1-2.

### 13.5 Week placement
As basketball 10.5. Throwing volume counts like a bowling workload: the hardest shooting practice and upper-body power should not fall on the same day as the heaviest upper strength session (practice).

### 13.6 Session templates
**OFF A: lower + shoulder**: box jump 3x4; trap bar DL / squat N 3x8 / I 4x5 / A 5x3 @ 85%; Bulgarian split squat 3x6; Nordic; Copenhagen; ankle balance; shoulder module (ER 90/90, sleeper stretch, Y-T-W).
**OFF B: upper + throwing power**: med ball overhead throw 3x5 and rotational shot-put throw 3x4/side; bench or DB bench 3-4 x 5-8; pull-up 3x6-8; landmine press 3x6; row 3x8-10; push-up plus 2x12; Pallof.
**OFF C (I/A)**: lateral bound 3x4/side; single-leg RDL 3x6; push press (A) 3x4; heavy carries; neck (pivots); trunk.
**PRE A**: single-leg jump for height off a 3-step approach (jump-shot pattern) 3x3/leg; squat contrast; Nordic; landing block; shoulder module.
**PRE B**: med ball throws (overhead, rotational) 4x4 at max intent; bench 4x3-4 @ 85%; weighted pull-up 4x4; shoulder ER; Copenhagen.
**IN A (MD-4)**: CMJ 3x3; trap bar 3x3 @ 80-85%; bench 3x3-4; pull-up 3x5; Nordic 2x4; shoulder ER. 40 min.
**IN B (MD-2)**: med ball throws 2x3; split squat 2x5 light; row 2x8; shoulder module; ankle; trunk. 25 min.
Pivot add-on: heavier main lifts (+1 set), neck, wrestling holds. Goalkeeper: lateral lunges, Copenhagen x2, hip mobility (90/90, adductor rock-backs), reaction drills.

### 13.7 Conditioning
PRE: `ift1515` 2 x 8 min, `rsa` 3 x 6 x 20-30 m with a cut, `courtHIIT` 6 x 30 s fast-break drills. Wings: `maxv` 4 x 30 m. IN: top-up for low-minute players.

### 13.8 Tests and benchmarks
| Test | Club (M / F) | National league (M / F) | International (M / F) |
|---|---|---|---|
| 10 m | 1.85 / 2.00 s | 1.78 / 1.92 s | < 1.72 / < 1.88 s |
| CMJ | 38 / 28 cm | 43 / 32 cm | > 48 / > 35 cm |
| Throw velocity (standing, 7 m) | 20 / 16 m/s | 23 / 18 m/s | > 26 / > 20 m/s |
| Yo-Yo IR1 | 1,200 / 800 m | 1,600 / 1,100 m | > 2,000 / > 1,400 m |
| Bench 1RM | 1.0 / 0.6 x BM | 1.2 / 0.75 x BM | 1.4 / 0.85 x BM |
| Squat 1RM | 1.25 / 1.0 x BM | 1.5 / 1.25 x BM | 1.75 / 1.5 x BM |

### 13.9 Taper
As basketball. Tournaments (5-9 games in 10-14 days at championships): no strength work beyond a 15-min primer every 2-3 days; keep the shoulder module daily.

### 13.10 Encoding notes
Variants: `wing`, `back`, `pivot`, `goalkeeper`; flag `female`. `prehab`: `shoulderER`, `landing`, `ankle`, `nordic`, `copenhagen`, `neck` (pivot). The current profile's `avoidBefore: "all"` is too strict; use the hour-based rules.

### 13.11 Sources
Andersson 2017; Olsen OE et al. 2005, BMJ 330(7489):449 (exercises to prevent lower limb injuries in youth sports: cluster RCT in handball); Myklebust G et al. 2003, Clin J Sport Med 13(2):71-78 (prevention of ACL injuries in female team handball players); Achenbach L et al. 2018, Knee Surg Sports Traumatol Arthrosc 26(7):1901-1908 (neuromuscular exercises prevent severe knee injury in adolescent team handball players); Michalsik LB, Aagaard P 2015, J Sports Med Phys Fitness 55(9):878-891 (physical demands in elite team handball: comparisons between male and female players); Wagner H et al. 2014, J Sports Sci Med 13(4):808-816 (individual and team performance in team handball: a review); Clarsen B et al. 2014, Br J Sports Med 48(17):1327-1333 (shoulder problems in elite handball players).

---

## 14. Ice hockey

### 14.1 Demands
| Measure | Elite |
|---|---|
| Duration | 3 x 20 min; forwards ~15-20 min time on ice, defence ~20-25 min |
| Shifts | ~30-80 s (typical ~40-50 s), 15-25 shifts per game, 2-5 min recovery on the bench |
| Speed | Skating up to ~35-40 km/h; repeated maximal accelerations, crossovers, stops and starts |
| Contact | Body checking (men's elite), board battles; puck and stick impacts |
| Energy | Each shift is highly anaerobic (blood lactate high); aerobic capacity drives recovery between shifts and periods |
| Posture | Flexed-hip, flexed-knee skating stance; hip abduction-extension push-off; adductors work eccentrically in the recovery and stopping phases |

### 14.2 Positional variants
- Forwards: shorter, more intense shifts, more accelerations.
- Defence: longer time on ice, more board battles, more backwards skating: aerobic recovery, upper-body strength, groin.
- Goaltender: butterfly technique places extreme load on the hip (high rates of hip impingement and labral injury) and groin: hip mobility within pain-free range, adductor and abductor strength, lateral power (push-offs), short reactive work; little running conditioning.

### 14.3 Injuries and prevention
Concussion, shoulder (AC joint), knee (MCL), and groin/hip injuries are the most common; adductor strains are characteristic. NHL players with adductor strength below 80% of abductor strength were 17 times more likely to sustain an adductor strain, and a targeted adductor strengthening programme in the pre-season cut adductor strains from 3.2 to 0.71 per 1,000 player-game exposures (Tyler 2001, 2002).
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | `copenhagen` + adductor strength (target ADD:ABD ≥ 0.8) | 2-3x/wk OFF/PRE, 1-2x/wk IN | Strong-moderate (Tyler 2002; Harøy 2019 mechanism) |
| 2 | `neck` | 2-3x/wk | Moderate |
| 3 | `hipAbd` + hip flexor strength (`hipFlex`) | 2x/wk | Moderate / practice |
| 4 | Shoulder robustness (`shoulderER`, scapular) | 2x/wk | Practice |
| 5 | `lowback` | 2x/wk | Practice |
| 6 | `landing` (off-ice plyos), knee (MCL: strength) | 2x/wk | Practice |
| Goalies | Hip mobility (90/90, rotation), `copenhagen`, glute med | 3x/wk | Practice |

### 14.4 Season structure
North America / UK EIHL: OFF April-June (gym 4, the main strength and power block), PRE July-August (gym 3, on-ice camp), IN Sept-March (2-3 games a week in pro leagues; recreational 1/wk). Gym IN: 2 (one game a week), 1 (2-3 games a week).

### 14.5 Week placement
Pro schedules (2-3 games/week): two short sessions on non-game days, typically the day after a game (lower strength, starters) and 2 days before the next (power). Recreational (one game a week, one practice): gym A MD-4, gym B MD-2.

### 14.6 Session templates
**OFF A: lower strength**: lateral bound and stick 3x4/side; back squat or front squat N 3x8 / I 4x5 / A 5x3 @ 85%; lateral lunge / Cossack 3x6/side; single-leg RDL 3x6; Copenhagen per module; adductor machine 2x12; hip flexor march 2x10; Pallof.
**OFF B: upper strength**: med ball rotational throw 3x4/side; bench 4x5; weighted pull-up 4x5; landmine press 3x8; row 3x10; neck isometrics; shoulder ER; farmers carry.
**OFF C: power**: hang clean (A) 4x3 or trap bar jump 4x3; skater jump (`skaterjump`) 3x5/side; split jump 3x4/side; slideboard (if available) or lateral sled drag 4 x 20 m; side plank.
**OFF D (pro / A)**: hypertrophy or unilateral (step-up, single-leg hip thrust, rows), trunk rotation, neck.
**PRE A**: skater jumps contrast with heavy split squat (A); front squat 4x3 @ 85%; Copenhagen; neck.
**PRE B**: clean or jump 4x3; bench 4x3 @ 85%; pull-up 4x4; rotational throws; shoulder.
**IN A (MD+1 or MD-3)**: skater jump 3x3/side; front squat or trap bar 3x3 @ 80-85%; pull-up 3x5; Copenhagen 2/side; neck. 35-40 min.
**IN B (MD-2)**: med ball rotational 2x3/side; bench 2x3 @ 80%; adductor 1x10; trunk. 20 min.

### 14.7 Conditioning (off ice and on ice)
- OFF: aerobic base (bike 30-45 min, 2x/wk) plus shift-specific intervals on a bike or slideboard: 30-45 s hard / 90-120 s easy x 8-12.
- PRE: on-ice repeat sprints (6 x 40-50 m with stops, 30 s rest) and shift simulations (45 s / 2:15 x 8-10).
- IN: games + practice cover it; top-up for scratched players.
Running is a poor transfer for skating mechanics; prefer bike, slideboard and on-ice work (practice).

### 14.8 Tests and benchmarks (male; NHL Combine for reference)
| Test | Recreational / club | Junior / semi-pro | Pro / NHL Combine |
|---|---|---|---|
| CMJ / vertical | 40-45 cm | 45-55 cm | > 55-60 cm (Combine average ~ 60 cm vertical) |
| Standing broad jump | 2.20-2.40 m | 2.40-2.60 m | > 2.60 m |
| 30 m on-ice skate | 4.6-4.9 s | 4.3-4.6 s | < 4.3 s |
| Bench 1RM | 1.0 x BM | 1.2 x BM | 1.3-1.5 x BM |
| Squat 1RM | 1.25 x BM | 1.5 x BM | 1.75-2.0 x BM |
| Pull-ups (strict) | 6-8 | 10-12 | 12-15+ |
| Adductor:abductor strength | ≥ 0.8 (Tyler 2001) | | |
| VO2max (bike) | 45-50 ml/kg/min | 50-55 | 55-60+ |

### 14.9 Taper
Play-offs: keep 2 short sessions a week at lower volume; tournaments (several games in a weekend): primers only.

### 14.10 Encoding notes
Variants: `forward`, `defence`, `goalie`. `prehab`: `copenhagen` (always first), `neck`, `hipAbd`, `hipFlex`, `shoulderER`, `lowback`. Conditioning default modality: bike/slideboard, not running.

### 14.11 Sources
Tyler TF et al. 2001, Am J Sports Med 29(2):124-128 (hip strength and adductor strains in NHL players; https://pubmed.ncbi.nlm.nih.gov/11292035/); Tyler TF et al. 2002, Am J Sports Med 30(5):680-683 (the effectiveness of a pre-season exercise program to prevent adductor muscle strains in professional ice hockey players); Vigh-Larsen JF, Mohr M, Scand J Med Sci Sports (the physiology of ice hockey performance: an update); Montgomery DL 1988, Sports Med 5(2):99-126 (physiology of ice hockey); Flik K et al. 2005, Am J Sports Med 33(2):183-187 (American collegiate men's ice hockey: injury analysis); Harøy 2019; Collins 2014.

---
## Part 4. Bat-and-ball sports

Shared rules: these sports are skill-dominated with low running volume but very high, repeated one-sided loads (bowling, pitching, throwing, batting). The main programming problems are **workload management of the throwing or bowling arm and trunk**, **asymmetry**, and **short-sprint and rotational power**. Count deliveries/pitches/throws as the primary load, and fit the gym around them.

---

## 15. Cricket

Cricket needs role variants more than any other sport here. Encode at least: `fastbowler` (pace and seam), `batter`, `spinner`, `keeper`, `allrounder` (fast bowler rules apply to the bowling part).

### 15.1 Demands
| Measure | Values |
|---|---|
| Formats | T20 (~3 h), one-day (~7 h), multi-day (up to 5 days); club cricket mostly 40-50 overs, Saturday and/or Sunday |
| Fast bowler | Run-up ~15-30 m reaching ~ 5-7 m/s; front-foot impact produces vertical ground reaction forces of roughly 4-9 x body mass; the trunk combines extension, side flexion and rotation at ball release; 6 balls per over, spells of 4-8 overs |
| Batter | Repeated short sprints between wickets (17.68 m) with 180° turns (a "three" ≈ 53 m with two turns); long periods of low-level activity; in T20 the sprint and power demand is high |
| Fielder | Sprints of 10-30 m, dives, throws (up to 60-80 m from the boundary) |
| Wicketkeeper | Hundreds of squats per innings, lateral dives |
| Energy | Mostly ATP-PC bursts with long low-intensity periods; heat and duration matter in long formats; fast bowlers need aerobic capacity to repeat spells |

### 15.2 Injuries and prevention
| Role | Main injuries | Notes |
|---|---|---|
| Fast bowler | Lumbar stress fracture (pars interarticularis, usually on the opposite side to the bowling arm; highest in young bowlers), side strain (internal oblique / intercostal on the non-bowling side), hamstring, quadriceps, calf, ankle impingement, knee | Lumbar stress injuries are the most costly injury in cricket (Orchard 2016; Alway 2019) |
| Batter | Hamstring and quadriceps strains (running between wickets), hand and finger fractures (ball impact), low back | |
| Fielder | Shoulder (throwing), hamstring, finger | |
| Keeper | Knee and hip (squat volume), finger | |
| Spinner | Spinning finger, shoulder, side strain | |

Bowling workload evidence (the most important thing the app can encode for bowlers):
- Junior fast bowlers who had on average fewer than 3.5 rest days between bowling days had ~3x the injury risk (Dennis 2005).
- Tendon injuries are the most sensitive to sudden increases in workload; bone stress injuries are linked to high medium-term workload and low career workload, so young or returning bowlers need slow build-ups (Orchard 2015).
- Spikes in acute workload relative to chronic workload (ratio > ~1.5) were associated with higher injury risk in elite fast bowlers (Hulin 2014).
- Youth match limits: follow the ECB Fast Bowling Match Directives (maximum overs per spell and per day by age group) and equivalent national rules.

| Priority | Module | Fast bowler | Batter | Dose |
|---|---|---|---|---|
| 1 | Bowling workload plan (balls per session, sessions per week, rest days, gradual pre-season build) | Yes | | Every week |
| 2 | `trunkLat` (side strain) + `lowback` (extensor and anti-rotation endurance) | Priority | Yes | 3x/wk OFF/PRE, 2x/wk IN |
| 3 | `nordic` | Yes | Priority | per module |
| 4 | `calf` + `ankle` (front-foot landing) | Yes | | 2-3x/wk |
| 5 | Quadriceps eccentric strength (front-leg block): split squat, step-down, reverse Nordic | Priority | | 2x/wk |
| 6 | `shoulderER` | Yes | Fielders | 2-3x/wk |
| 7 | `maxv` + turn practice | | Priority | 1x/wk |
| Keeper | Hip mobility, `copenhagen`, squat endurance | | | 2x/wk |
| Spinner | `elbow` (fingers/wrist), `shoulderER`, `trunkLat` | | | 2x/wk |

### 15.3 Season structure (UK club)
| Phase | When | Gym / wk | Bowling (fast bowlers) |
|---|---|---|---|
| OFF | Oct-Dec | 3 | None for 4-6 weeks, then easy throwing / technical drills |
| PRE | Jan-March (indoor nets) | 2-3 | Graded build over 8-12 weeks: start ~3-4 overs per session, 2 sessions a week, with ≥ 2 days between; build by roughly 10-20% a week to match demands (e.g. 8-10 overs per session plus an extra session) before the first match (practice, consistent with Orchard 2015 and Hulin 2014) |
| IN | April-September | 1-2 | Matches + 1-2 net sessions; keep weekly balls within ~±20% of the 4-week average; never jump from no bowling to a full match |

### 15.4 Week placement
Club: matches Saturday (and/or Sunday), nets Tuesday/Thursday.
- Fast bowler: Mon gym A (lower strength + trunk), Tue nets (moderate overs), Wed gym B (upper + power, no heavy lower), Thu nets (shorter, intense), Fri rest/primer, Sat match. If bowling both Sat and Sun, Monday is recovery only and gym A moves to Tuesday before nets (lifting first, nets ≥ 6 h later) or is dropped to maintenance.
- Batter: as football amateur week; heavy lower ≥ 48-72 h before the match.
- Avoid heavy lower and the heaviest bowling session on the same day for bowlers, and never place the hardest trunk session the day after a long spell (practice).

### 15.5 Session templates
**Fast bowler OFF A: lower strength + trunk**
| # | Slot | Exercise | N | I | A |
|---|---|---|---|---|---|
| 1 | Power | Box jump / single-leg bound (`latbound` straight-line variant) | 3x4 | 3x4 | 4x3 + single-leg drop and stick (front-foot pattern) |
| 2 | Main | Trap bar DL or front squat | 3x8 RIR3 | 4x5 @ 80% | 5x3 @ 85% |
| 3 | Front-leg block | Bulgarian split squat with 3 s lowering / step-down | 2x8 | 3x6 | 3x5 heavy |
| 4 | Prehab | Nordic | per module | | |
| 5 | Prehab | Calf (seated + standing) | 3x12 | 3x10 | 3x8 heavy |
| 6 | Trunk | Side plank with reach (`sideplank`) + suitcase carry | 2 x 30 s, 2 x 20 m | 3 x 40 s, 3 x 20 m | 3 x 45 s, heavy carry |
| 7 | Trunk | Back extension isometric (`hipext`) | 2 x 30 s | 3 x 45 s | 3 x 60 s or weighted |

**Fast bowler OFF B: upper + rotational**
Med ball rotational throw to both sides (`mbrot`) 3x5/side (equal both ways: the bowling action is one-sided); landmine press 3x8; pull-up 3x6-8; row 3x10; shoulder ER 90/90 2x12; Y-T-W 2x10; Pallof 3x10/side; anti-rotation and lateral flexion endurance (cable side bend, light) 2x12.

**Fast bowler PRE A**: drop-and-stick from 30 cm onto the front leg 3x4; trap bar 4x3 @ 85%; split squat 3x5; Nordic; calf; side plank; back extension.
**PRE B**: med ball overhead throw 3x4 and rotational 3x4/side; DB press 3x6; pull-up 3x5; shoulder module; trunk.
**IN A (≥ 72 h before a long spell; usually Mon or Tue)**: CMJ 3x3; trap bar 3x3 @ 80%; split squat 2x5; Nordic 2x4; calf 2x10; side plank 2 x 40 s. 35 min.
**IN B (MD-3/MD-2)**: med ball 2x4/side; upper push/pull 2x6; shoulder ER; back extension; Pallof. 25 min.

**Batter OFF/PRE/IN**: football-style lower session (squat or trap bar, split squat, Nordic, calf) plus rotational power (med ball scoop and shot-put throw to both sides, 3x4), upper pull/push, grip (wrist curl, farmers), trunk. Add turn-specific deceleration: sprint 17.7 m, plant and turn at the crease, 6-8 reps.

**Keeper add-ons**: goblet squat holds and squat endurance (3 x 60 s in the stance), lateral lunge, Copenhagen, hip 90/90 mobility, wrist and finger work.

### 15.6 Conditioning
- Fast bowlers: aerobic base (OFF: 2-3 x 30-40 min easy running or bike); PRE: repeat-spell simulation: 6 x (run-up sprint 20-25 m, walk back 30 s) per "over", 4-6 overs with 2 min between (no ball, or with ball in nets); `maxv` 1x/wk.
- Batters: repeated sprint with turns: 6 x "run three" with 25-40 s rest, 2-3 sets; for T20 shorter rest.
- Everyone: heat preparation for summer tournaments abroad (practice).

### 15.7 Tests and benchmarks (male)
| Test | Club | County 2nd XI / Premier League | Professional |
|---|---|---|---|
| 20 m sprint | 3.15-3.30 s | 3.05-3.15 s | < 3.05 s |
| Run-a-two (2 x 17.68 m with a turn, bat in hand) | 6.6-7.0 s | 6.3-6.6 s | < 6.3 s |
| CMJ | 32-38 cm | 38-44 cm | > 44 cm (fast bowlers often higher) |
| Yo-Yo IR1 | 1,000-1,400 m | 1,400-1,800 m | > 1,800 m |
| Trap bar / squat 1RM | 1.25 x BM | 1.5 x BM | 1.75 x BM |
| Side plank (each side) | 60 s | 90 s | 120 s (practice) |
| Fast bowler ball speed | 110-120 km/h | 120-130 km/h | 135-150 km/h |
| Bowling workload | Weekly balls within ~±20% of the 4-week average; ≥ 2 rest days between bowling days (Dennis 2005) | | |

### 15.8 Taper
Key match / tournament: bowlers reduce net overs ~30-50% across the last 5-7 days but keep bowling at full pace (short spells) to keep the tissue prepared; last heavy lower MD-4; primer MD-1. Multi-day: no lifting during a match; MD+1 recovery after.

### 15.9 Encoding notes
- Current profile has `avoidBefore: null`. Use: batters `lower`; fast bowlers `lower` + "no trunk-heavy or bowling-heavy work the day after a spell".
- Add a bowling workload log (balls per day) with weekly totals and spike warnings. This is the single most valuable cricket feature.
- `prehab` fast bowler: `trunkLat`, `lowback`, `nordic`, `calf`, `ankle`, `shoulderER`; batter: `nordic`, `trunkLat`, `calf`, `elbow` (wrist), `shoulderER` (fielding).
- Rotational med ball work is trained to both sides for every cricket role.

### 15.10 Sources
Orchard JW et al. 2015, Br J Sports Med 49(16):1064-1068 (cricket fast bowling workload patterns as risk factors for tendon, muscle, bone and joint injuries; https://bjsm.bmj.com/content/49/16/1064); Dennis RJ et al. 2005, Br J Sports Med 39(11):843-846 (is bowling workload a risk factor for injury to Australian junior cricket fast bowlers?; https://bjsm.bmj.com/content/39/11/843); Dennis R, Farhart P, Goumas C, Orchard J 2003, J Sci Med Sport 6(3):359-367 (bowling workload and the risk of injury in elite cricket fast bowlers); Hulin BT et al. 2014, Br J Sports Med 48(8):708-712 (spikes in acute workload and injury in elite cricket fast bowlers); Orchard JW et al. 2016, Br J Sports Med 50(20):1245-1251 (international consensus statement on injury surveillance in cricket: a 2016 update); Alway P et al. 2019, BMJ Open Sport Exerc Med 5:e000529 (incidence and prevalence of lumbar stress fracture in English County Cricket fast bowlers; https://repository.lboro.ac.uk/articles/journal_contribution/Incidence_and_prevalence_of_lumbar_stress_fracture_in_English_County_Cricket_fast_bowlers_association_with_bowling_workload_and_seasonal_variation/9623252); Loughborough University fast bowling research programme (https://lboro.ac.uk/research/spotlights/fast-bowling/); Petersen CJ et al. 2010, J Sports Sci 28(1):45-52 (movement patterns in cricket vary by both position and game format); ECB Fast Bowling Match Directives (current edition); van Dyk 2019.

---

## 16. Baseball and softball

Role variants: `pitcher` (baseball overhand), `softballpitcher` (windmill), `catcher`, `position` (infield / outfield).

### 16.1 Demands
| Measure | Values |
|---|---|
| Game | 7 (softball, youth baseball) or 9 innings, ~2-3 h; long low-intensity periods with explosive bursts |
| Pitching (baseball) | One of the fastest human movements: shoulder internal rotation velocity ~7,000°/s, elbow valgus torque near the ultimate strength of the UCL; 80-110 pitches per start for adult starters |
| Pitching (softball windmill) | Large biceps and anterior shoulder loads at release; pitchers often pitch several games in a weekend |
| Hitting | Rotational power: bat speed comes from the ground up through hip-shoulder separation |
| Running | 27.4 m (90 ft) between bases (softball 18.3 m / 60 ft); sprints rarely over 40 m except outfielders |
| Throwing | Infielders: short quick throws; outfielders: long throws; catchers: throws from a squat plus 100+ squats per game |
| Energy | ATP-PC; aerobic fitness for recovery and long seasons |

### 16.2 Injuries and prevention
- Pitchers: elbow (UCL sprain/tear, medial epicondyle apophysitis in youth), shoulder (rotator cuff, labrum, internal impingement); risk rises with high pitch counts, pitching with fatigue, pitching year-round and for multiple teams (Fleisig & Andrews 2012; Olsen 2006).
- Position players: hamstring strains (sprinting to first), oblique/side strains (hitting and throwing), hand and wrist injuries, ankle (sliding).
- Catchers: knee and hip (squat), hand.
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 (pitchers) | Pitch counts and rest days (MLB / USA Baseball Pitch Smart for under-23s), no year-round pitching, no pitching for multiple teams in the same period, 2-3 months a year off overhead throwing | Every week | Moderate-strong (Olsen 2006: overuse factors; Pitch Smart guidance) |
| 2 | `shoulderER` + internal rotation range (sleeper / cross-body) + total arc monitoring | 3x/wk | Moderate (Wilk 2011, 2015: GIRD and ER deficits raise injury risk) |
| 3 | `elbow` (flexor-pronator strength, wrist, forearm) | 2-3x/wk | Moderate (Sakata 2018: Yokohama Baseball-9 programme, done at least weekly, reduced medial elbow injuries in youth players) |
| 4 | Hip mobility and lead-leg stability (hip IR range) | 2-3x/wk | Practice (kinetic chain) |
| 5 | `trunkLat` (oblique) | 2x/wk | Practice |
| 6 | `nordic` | per module | Moderate |
| 7 | Long-toss / interval throwing programme to rebuild after the off-season | PRE | Practice |

### 16.3 Season structure
US / UK: season spring-summer (UK club April-Sept). OFF (autumn): 6-12 weeks of no or minimal throwing for pitchers (rest from overhead throwing at least 2-3 months a year), gym 3-4. PRE (winter): graded throwing programme (interval throwing: distance and volume progress over 6-10 weeks before mound work), gym 2-3. IN: gym 2 (position players), pitchers 2 short sessions arranged around their start.

### 16.4 Week placement
Starting pitcher on a 5-day rotation (professional model): Day 1 (day after start): lower strength + light arm care, flush; Day 2: upper strength (no heavy pressing for the throwing arm), bullpen often day 2-3; Day 3: power / medicine ball; Day 4: light primer; Day 5: start.
Club (one start a week): heavy lower the day after the start; upper and med ball 2-3 days after; nothing heavy within 48 h before.
Position players: as football amateur week (heavy lower ≥ 72 h before a game; double-headers = congested).

### 16.5 Session templates
**Pitcher OFF A: lower + hips**: trap bar jump 3x4 / box jump; trap bar DL or front squat N 3x8 / I 4x5 / A 5x3 @ 85%; lateral lunge (stride-leg pattern) 3x6/side; single-leg RDL 3x6; Copenhagen 2/side; hip IR/ER mobility; Nordic.
**Pitcher OFF B: upper + arm care**: med ball rotational scoop toss 3x5/side and overhead throw 3x5 (2-3 kg); landmine press (safer than barbell overhead) 3x8; chest-supported row 3x10; pull-up 3x6-8; shoulder ER side-lying 3x12 and at 90/90 2x12; prone Y-T-W 2x10; serratus push-up plus 2x12; wrist flexion/extension and pronation/supination 2x15; sleeper stretch 3 x 30 s.
**Pitcher OFF C**: lower unilateral and rotational power (split squat, lateral bound, med ball shot-put), trunk anti-rotation, grip.
**PRE (during the throwing build)**: 2 sessions: A as above at 3x3-5 @ 80-85%; B with arm care daily and pressing kept light; med ball volume reduced as throwing volume rises.
**IN (pitchers)**: Day 1 lower (trap bar 3x3-5 @ 75-80%, split squat 2x6, Nordic 2x4, hip mobility); Day 2-3 upper (row, pull-up, landmine press 2-3x6-8) + arm care; arm care 4-5 days a week (5-10 min: ER, scapular, forearm).
**Position players**: football-style lower (squat/trap bar, split squat, Nordic), rotational power both sides (bat side emphasised but not exclusively), upper push/pull, oblique endurance, grip. Catchers: squat endurance, hip mobility, Copenhagen, knee-friendly unilateral work.
**Softball pitcher**: as pitcher, with more biceps (eccentric curls 2x10), anterior shoulder and forearm work; workload tracked by pitches per day and per weekend (no formal consensus limits; avoid sudden spikes).

### 16.6 Conditioning
Short sprints with full recovery (10-30 m x 6-10, 60-90 s rest), base-running (home to first, first to third), outfielders add 20-40 m repeats. Pitchers: aerobic base (bike, easy runs) for recovery between starts; avoid long slow distance in excess (practice). Long-season fatigue management matters more than fitness gains.

### 16.7 Tests and benchmarks (adult male baseball; softball women in brackets where common)
| Test | Club | College / independent | Professional |
|---|---|---|---|
| 60 yd sprint | 7.3-7.6 s | 6.9-7.3 s | < 6.9 s (MLB prospects ~6.7) |
| Home to first (RHB) | 4.5-4.7 s | 4.3-4.5 s | < 4.3 s |
| Pitching velocity | 70-80 mph | 82-88 mph | 90-95+ mph |
| Exit velocity (tee) | 75-85 mph | 85-95 mph | 95-100+ mph |
| Rotational med ball throw (3 kg) | 7-9 m/s or distance-based | | |
| Shoulder total arc (ER + IR) throwing vs non-throwing | Within 5° (Wilk 2011) | | |
| ER strength throwing vs non-throwing | ≥ 100% (Wilk 2015) | | |
| CMJ | 35-40 cm | 40-48 cm | > 48 cm |
| Grip | > 50 kg | > 55 kg | > 60 kg |

### 16.8 Taper
Play-off / tournament: pitchers keep the 5-day rhythm, cut gym volume ~40%, keep arm care; position players: last heavy lower MD-4, primers on game days.

### 16.9 Encoding notes
- Current profile `avoidBefore: "upper"` is right for pitchers but wrong for position players (lower). Make it role-dependent.
- Add a pitch-count log with Pitch Smart rest-day logic for under-23s, and a "months without overhead throwing" check.
- `prehab` pitcher: `shoulderER`, `elbow`, `trunkLat`, hip mobility, `nordic`; position: `nordic`, `trunkLat`, `shoulderER`, `elbow`.

### 16.10 Sources
Sakata J et al. 2018, Am J Sports Med 46(2):460-469 (a prevention programme for medial elbow injury in youth baseball players, Yokohama Baseball-9; doi 10.1177/0363546517738003); Wilk KE et al. 2011, Am J Sports Med 39(2):329-335; Wilk KE et al. 2015, Am J Sports Med 43(10):2379-2385; Olsen SJ et al. 2006, Am J Sports Med 34(6):905-912 (risk factors for shoulder and elbow injuries in adolescent baseball pitchers); Fleisig GS, Andrews JR 2012, Sports Health 4(5):419-424 (prevention of elbow injuries in youth baseball pitchers); MLB / USA Baseball Pitch Smart guidelines (current); Szymanski DJ 2009, Strength Cond J (physiology of baseball: a brief review); Posner M et al. 2011, Am J Sports Med 39(8):1676-1680 (epidemiology of Major League Baseball injuries).

---
## Part 5. Racket sports

Shared rules for racket sports:
- Periodise by **tournament blocks**, not weekly fixtures. Encode three states: `build` (no competition for 3+ weeks: gym 2-3), `compete` (tournament or league match this week: gym 1-2 short sessions), `tournament` (playing on consecutive days: primers only). Club players with one league match a week follow team-sport "IN" rules.
- Every racket sport is **asymmetric**: train both sides for rotation and single-leg work; give the hitting arm extra rotator-cuff and forearm work, and the non-dominant side equal trunk work.
- The **lunge and split-step** are the signature movements: eccentric quadriceps and adductor strength (lunges, lateral lunges, Copenhagen) and calf/Achilles capacity are the lower-body priorities.
- Overhead strokes (serve, smash, bandeja) need the shoulder module (OSTRC) at 3x/week.
- Recreational players over ~35-40: calf and Achilles capacity becomes a top priority (calf tears and Achilles ruptures cluster in this group in squash, badminton, padel and tennis: practice consensus with epidemiological support).

---

## 17. Tennis

### 17.1 Demands
| Measure | Values |
|---|---|
| Point duration | ~5-10 s on average (shorter on grass and indoor hard courts, longer on clay) |
| Rest | 20-25 s between points (25 s rule), 90 s at changeovers, 120 s between sets |
| Effective playing time | ~20-30% of total match time (Fernandez-Fernandez 2009) |
| Match duration | 1-5 h; tournaments with consecutive-day matches |
| Movement | ~3-5 changes of direction per point, ~ 3-4 m per shot; most movement is lateral and within 2-3 steps; split-step before every opponent stroke |
| Strokes | Serve: ball speed 160-230 km/h at elite level, shoulder internal rotation velocity extremely high; groundstrokes driven by leg drive and trunk rotation |
| Energy | Mainly aerobic over a match (mean HR ~ 60-80% HRmax) with ATP-PC bursts every point; elite VO2max ~ 50-65 ml/kg/min |

### 17.2 Player variants
- Baseliner / clay-court player: longer rallies, more aerobic and lateral endurance.
- Serve-and-volley / big server: shoulder load and power priority, short points.
- Junior: growth-related overuse (lumbar stress fracture risk with high serve volumes), so serve counts and trunk endurance matter.
- Recreational over 35: lateral elbow ("tennis elbow") and calf strains are the classic problems.

### 17.3 Injuries and prevention
Lower limb acute injuries (ankle sprains, calf and thigh strains) are the most common acute injuries; upper limb overuse dominates chronic injuries: shoulder (internal impingement, rotator cuff, with GIRD), elbow (lateral epicondylalgia in recreational players, medial in elite), wrist (ECU in two-handed backhands and modern forehands); trunk: abdominal (rectus abdominis on the non-dominant side) strains from the serve, and lumbar pain and stress injury in juniors (Pluim 2006; Abrams 2012; Fu 2018).
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | `shoulderER` + internal rotation range (sleeper / cross-body) | 3x/wk, 10 min | Moderate-strong (Andersson 2017 in overhead athletes; GIRD links in throwers: Wilk) |
| 2 | `elbow` (eccentric wrist extensors, grip, pronation/supination) + equipment check (grip size, string tension) | 2-3x/wk | Moderate for management; practice for prevention |
| 3 | `ankle` | 2-3x/wk | Strong |
| 4 | `calf` | 2-3x/wk | Practice |
| 5 | `trunkLat` + rectus abdominis eccentric (serve) + `lowback` | 2-3x/wk | Practice |
| 6 | `copenhagen` + `hipAbd` (lateral movement, open-stance forehands) | 2x/wk | Moderate |
| 7 | Hip internal rotation range (open stance) | 2-3x/wk | Practice |

### 17.4 Season structure
- Club / league player: OFF Nov-Jan (gym 3), PRE Feb-Mar (gym 2-3), IN Apr-Sept (summer leagues; gym 1-2). Indoor winter leagues: treat as IN.
- Tournament player: plan 3-6 week `build` blocks between tournament swings; `compete` weeks: 2 sessions early in the week; `tournament`: primers only.

### 17.5 Week placement
- Match Saturday (league): gym A Monday (lower strength + power), gym B Wednesday (upper, shoulder, rotational power, light lower), Friday primer optional.
- Tournament week (play from Thursday): one session Monday (short full-body strength 2x3-5 @ 80%), Tuesday shoulder/trunk only, then primers (10 min: 2x3 jumps, 2x3 med ball throws, band shoulder) before matches.
- Never place heavy lower work within 48 h of a match, or heavy shoulder/upper pressing the day before serving.

### 17.6 Session templates
**OFF A: lower strength + lateral**
| # | Slot | Exercise | N | I | A |
|---|---|---|---|---|---|
| 1 | Power | Lateral bound (`latbound`) / skater jump | 3x4/side | 3x5/side | 4x4/side + contrast after split squat |
| 2 | Main | Trap bar DL or front squat | 3x8 RIR3 | 4x5 @ 80% | 5x3 @ 85% |
| 3 | Lunge pattern | Reverse lunge / lateral lunge | 2x8/side | 3x6/side | 3x6/side heavy |
| 4 | Hinge | Single-leg RDL | 2x8 | 3x8 | 3x6 |
| 5 | Prehab | Copenhagen | 2x6 | 2x8-10 | 2x12 |
| 6 | Prehab | Calf (seated + single-leg) | 2x12 | 3x10-15 | 3x8 heavy + 2x15 |
| 7 | Prehab | Ankle balance | 2 x 30 s | 2 x 30 s, eyes closed | with ball catches |
| 8 | Trunk | Pallof both sides | 2x10 | 3x10 | 3x12 |

**OFF B: upper + rotation + shoulder**
| # | Slot | Exercise | N | I | A |
|---|---|---|---|---|---|
| 1 | Rotational power | Med ball scoop toss and shot-put throw, both sides (`mbrot`) | 3x5/side | 4x4/side | 4x4/side, 3-4 kg |
| 2 | Overhead power | Med ball overhead throw / slam | 2x5 | 3x5 | 3x5 |
| 3 | Pull | Pull-up / one-arm row | 3x8 | 3x6-8 | 3x6 |
| 4 | Push | Landmine press / DB press | 3x10 | 3x8 | 3x6 |
| 5 | Shoulder | ER at 90/90 + side-lying ER | 2x12 | 3x12 | 3x12 |
| 6 | Shoulder | Y-T-W, push-up plus | 2x10 | 2x12 | 2x12 |
| 7 | Forearm | Wrist ext/flex, pronation/supination, eccentric wrist extension | 2x15 | 2x15 | 3x15 |
| 8 | Trunk | Side plank + anti-extension (ab wheel) | 2 sets | 3 sets | 3 sets |

**OFF C (I/A)**: hurdle hops 3x5; step-up 3x6; hip thrust 3x8; rotational cable woodchop 3x8/side; lateral sled drag 4 x 15 m; sleeper stretch; trunk.
**PRE A**: split-step reactive drill (split-step, react to a cue, 2-3 step move) 4 x 4; lateral bound contrast with heavy split squat (A); trap bar 4x3 @ 85%; Copenhagen; calf; ankle.
**PRE B**: med ball throws (serve pattern: overhead throw from a split stance; groundstroke pattern: scoop toss) 4x4 at max intent; pull-up 3x5; landmine press 3x5; shoulder + forearm modules; trunk.
**IN A (`compete` week, MD-4/MD-3)**: lateral bound 2x3/side; trap bar or split squat 3x3 @ 80-85%; single-leg RDL 2x5; Copenhagen 1-2 sets; calf 2x10. 30 min.
**IN B (MD-2)**: med ball 2x3/side; pull-up 2x5; shoulder module; forearm; trunk. 20-25 min.
**Primer (match day or tournament)**: dynamic warm-up, 2x3 CMJ or lateral bounds, 2x3 med ball throws per side, band ER 1x15, split-step reactions 2x5.

### 17.7 Conditioning
| Phase | Content |
|---|---|
| OFF | Aerobic base 2/wk (bike or run 30-40 min, or 4 x 4 min); on-court "tempo" drills at moderate pace |
| PRE | `courtHIIT` at tennis work:rest: 10-15 s of on-court movement (spider, X-drill, 2-ball drills) / 20-25 s rest, 8-12 reps, 3-4 sets with 90-120 s between (mimics points and changeovers); Hit & Turn Tennis Test to set intensities if available |
| IN | Matches and practice cover it; top-up 1x/wk in light weeks |

### 17.8 Tests and benchmarks (adult male; female ~8-12% slower, ~20% lower jumps and throws)
| Test | Club | County / national ranked | Professional |
|---|---|---|---|
| 5 m / 20 m | 1.15 / 3.30 s | 1.08 / 3.15 s | < 1.05 / < 3.05 s |
| 505 (each side) | 2.55 s | 2.40 s | < 2.35 s |
| Spider drill | 17.5-18.5 s | 16.5-17.5 s | < 16.5 s |
| CMJ | 32-38 cm | 38-44 cm | > 44 cm |
| Med ball overhead throw (2 kg, seated) / serve-side scoop | Track change; dominant vs non-dominant rotation within 10-15% (practice) | | |
| Serve speed | 130-160 km/h | 160-190 km/h | > 190 km/h |
| Shoulder total arc (dominant vs non-dominant) | Within 5° (GIRD < 20°) | | |
| VO2max | 45-50 | 50-55 | > 55 ml/kg/min |

### 17.9 Taper
Key tournament: 7-10 days; gym volume down ~50%, keep intensity; last heavy lower 4-5 days before the first match; on-court practice shortened but kept sharp (match-play intensity, shorter sessions); primers on match days. Between matches in a tournament: recovery (carbohydrate 1-1.2 g/kg/h for the first hours after a long match, fluids and sodium, sleep).

### 17.10 Encoding notes
- `prehab`: `shoulderER`, `elbow`, `ankle`, `calf`, `trunkLat`, `copenhagen`.
- Add `racketBlock` state (`build`, `compete`, `tournament`).
- Rotational and lateral power must be trained to both sides; keep forearm work on the hitting arm and both sides for wrist extensors in two-handed players.

### 17.11 Sources
Fernandez-Fernandez J, Sanz-Rivas D, Mendez-Villanueva A 2009, Strength Cond J 31(4):15-26 (a review of the activity profile and physiological demands of tennis match play); Kovacs MS 2007, Sports Med 37(3):189-198 (tennis physiology: training the competitive athlete); Girard O, Millet GP 2009, J Strength Cond Res (physical determinants of tennis performance); Fernandez-Fernandez J et al. 2013, J Sports Sci Med 12(2):232-239 (6-week conditioning increased junior serve velocity; https://www.jssm.org/jssm-12-232.xml-abst); Pluim BM et al. 2006, Br J Sports Med 40(5):415-423 (tennis injuries: occurrence, aetiology and prevention); Abrams GD et al. 2012, Br J Sports Med 46(7):492-498 (epidemiology of musculoskeletal injury in the tennis player); Fu MC, Ellenbecker TS, Renstrom PA, Windler GS, Dines DM 2018, Curr Rev Musculoskelet Med 11(4):703-710 (epidemiology of injuries in tennis players); Andersson 2017.

---

## 18. Padel

### 18.1 Demands
| Measure | Values |
|---|---|
| Rally | ~9-17 s (pro men ~10-13 s, pro women ~13-17 s; women's rallies longer with more strokes) |
| Rest between points | ~10-20 s |
| Strokes per rally | ~7-12 |
| Match | Pro sets ~35 min total with ~10 min of real play; matches 60-90 min; club matches often 90 min bookings |
| Heart rate | ~70-80% HRmax average across studies (Frontiers 2023 review) |
| Movement | Small court (20 x 10 m), doubles: short accelerations, lateral steps, many low volleys (deep lunges and squats), backwards movement to play off the glass, overheads (bandeja, víbora, smash) |
| Energy | Intermittent, moderate-to-high intensity; aerobic base with short bursts; less sprinting than tennis |

### 18.2 Player variants
- Left side (usually the attacking / smashing player in a right-handed pair): more overheads and smashes: shoulder priority.
- Right side (drive): more consistency play, low volleys and lateral defence.
- Recreational over 40 (a large share of players): calf tears, Achilles, lumbar and elbow are the main risks; the plan should lean to tissue capacity over power.

### 18.3 Injuries and prevention
Surveys of recreational and competitive players repeatedly name the elbow (lateral epicondylalgia), lumbar spine, shoulder, knee, calf (medial gastrocnemius "tennis leg") and ankle as the main sites; muscle injuries to the calf are typical in older players during explosive pushes from a flexed position; overuse dominates (Castillo-Lozano 2017; padel narrative reviews). Injury rates appear higher in players with more weekly hours and in older players. Evidence for specific prevention programmes in padel is absent, so modules are borrowed from tennis and court sports.
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | `calf` (soleus and gastrocnemius, heavy + endurance) | 3x/wk OFF/PRE, 2x/wk IN | Practice |
| 2 | `elbow` + racket check (lighter, softer racket for elbow pain) | 2-3x/wk | Practice / moderate |
| 3 | `shoulderER` | 3x/wk | Moderate (borrowed) |
| 4 | `lowback` + `trunkLat` | 2-3x/wk | Practice |
| 5 | `ankle` | 2-3x/wk | Strong (borrowed) |
| 6 | Knee: eccentric quads (split squat, step-down), `copenhagen` | 2x/wk | Practice |

### 18.4 Season structure
Most players play year-round. Default: continuous `compete` with a 4-6 week `build` block twice a year (e.g. January and September). Gym: build 2-3, compete 1-2 (2 if playing ≤ 3 times a week).

### 18.5 Week placement
Players often play 2-4 times a week on varying days. Rule: heavy lower ≥ 48 h before a competitive match; any gym session can sit on the same day as a social game if the gym comes after (practice). With 4+ games a week: one full-body session + daily 10-min prehab.

### 18.6 Session templates
**Build A (lower + calf)**: lateral bound 3x4/side (N: lateral step-and-stick); trap bar or goblet squat N 3x8 / I 4x5 @ 80% / A 4x4 @ 85%; split squat 3x6-8 (3 s lowering); lateral lunge 2x8/side; calf: seated 3x10-12 heavy + single-leg standing 3x12-20; Copenhagen 2/side; ankle balance; Pallof.
**Build B (upper + rotation + shoulder + elbow)**: med ball rotational throws both sides 3x5; overhead med ball throw 2x5 (left-side players 3x5); pull-up or lat pulldown 3x8; landmine press 3x8; shoulder ER 90/90 and Y-T-W 2x12; wrist ext/flex + pronation/supination + eccentric wrist extension 2x15; back extension 2 x 30-45 s; side plank.
**Compete (1-2 sessions)**: A: trap bar 3x3-5 @ 80%, split squat 2x6, calf 3x10, Copenhagen 1/side. B: pull 2x8, landmine 2x8, shoulder and elbow modules, trunk. 25-30 min each.

### 18.7 Conditioning
`courtHIIT` with padel patterns: 10-15 s rallies against a coach feed or ghosting (net approach, retreat to the glass, bandeja shadow) / 15-20 s rest, 10 reps x 3 sets. Aerobic base 1-2/wk (bike 30 min) for players over 40.

### 18.8 Tests and benchmarks
Little padel-specific normative data exists; use tennis tests 17.8 with these practical bands for adult amateurs (male; female ~10% lower): 505 2.5-2.7 s; CMJ 30-38 cm; single-leg calf raise to fatigue ≥ 25 reps each side (practice benchmark for calf capacity); side plank ≥ 60 s; grip strength dominant ≥ 45 kg.

### 18.9 Taper
Tournament weekend: last heavy lower 4 days before; calf and shoulder modules at half volume; primers on match days.

### 18.10 Encoding notes
`prehab`: `calf`, `elbow`, `shoulderER`, `lowback`, `ankle`, `copenhagen`. Variant flags: `leftSide` (overhead priority), `over40` (calf and tissue-capacity priority; plyos reduced). Current profile lacks evidence entries: add the Frontiers 2023 review and the injury surveys below.

### 18.11 Sources
Activity profile and physiological demand of padel match play: a systematic review (Kinesiology, https://ojs.srce.hr/kinesiology/article/view/9871); Physiological demands of padel: mini review, Front Sports Act Living 2023, 5:1284063 (https://frontiersin.org/articles/10.3389/fspor.2023.1284063/full); Performance requirements and injury incidence of padel: a narrative review (https://kimuk.conare.ac.cr/Record/PUCR_b22a95b01f153099df0c1de59e57a8b1); Castillo-Lozano R, Casuso-Holgado MJ 2017, J Sports Med Phys Fitness 57(6):816-821 (incidence of musculoskeletal injuries in recreational padel players); Andersson 2017; Schiftan 2015.

---

## 19. Squash

### 19.1 Demands
| Measure | Values |
|---|---|
| Rally | ~13-15 s average (elite men, after the 2009 rule change), ~11-13 shots per rally |
| Playing time | ~70% of total match time is ball in play (vs 20-30% in tennis) |
| Match | Elite ~ 40-90 min (mean ~55-60 min), ~1.8 km covered |
| Heart rate | Mean ~92% HRmax in elite matches; ~70% of match time above 90% HRmax |
| Oxygen uptake | ~92% of VO2max on average; elite VO2max ~ 55-64 ml/kg/min |
| Movement | 3-6 m sprints to all four corners, deep lunges (often 1-1.5 x leg length), rapid changes of direction, recovery to the T |
| Energy | The most aerobically demanding racket sport, with very short recovery: both aerobic power and repeated lunge endurance |

### 19.2 Player variants
- Competitive (league/ranked): conditioning priority alongside strength.
- Recreational over 40: cardiac screening awareness (squash has a history of exercise-related cardiac events in unfit older players), calf/Achilles capacity, gradual build of match frequency.

### 19.3 Injuries and prevention
Lower limb (ankle sprains, knee, calf and Achilles), low back and eye injuries (protective eyewear prevents these and is compulsory in juniors and doubles) are the main concerns; Achilles ruptures cluster in recreational players aged 30-50 in racket sports.
| Priority | Module | Dose |
|---|---|---|
| 1 | `calf` (heavy soleus and gastrocnemius + endurance) | 3x/wk |
| 2 | Lunge capacity: eccentric quad and adductor strength (forward and lateral lunges, Copenhagen) | 2-3x/wk |
| 3 | `ankle` | 2-3x/wk |
| 4 | `lowback` (repeated flexed-trunk lunges) | 2x/wk |
| 5 | `shoulderER` + `elbow` | 2x/wk |
| 6 | Protective eyewear (safety prompt) | Always |

### 19.4 Season structure
UK leagues Sept-April; summer is the natural `build` period. Gym: build 3, compete 2, tournament primers only.

### 19.5 Week placement
League match one evening a week: heavy lower ≥ 48 h before; conditioning (ghosting intervals) not on the day before.

### 19.6 Session templates
**Build A**: split-squat jump (A) or lateral bound 3x4; trap bar or front squat N 3x8 / I 4x5 / A 5x3 @ 85%; forward lunge to a step-down depth 3x6/side; lateral lunge 3x6/side; Nordic 2x5; calf heavy 3x8-10 + single-leg 2x15-20; Copenhagen 2/side; ankle balance.
**Build B**: med ball rotational throws 3x5/side; single-leg RDL 3x6; pull-up 3x8; landmine press 3x8; shoulder ER 2x12; wrist 2x15; back extension; side plank.
**Compete**: A at 3x3 @ 80% + lunges 2x6 + calf + Copenhagen; B unchanged at 2 sets.

### 19.7 Conditioning (central for squash)
- Ghosting intervals (the standard squash conditioning method): e.g. 10-20 s ghosting to corners / 10-20 s rest x 10-15, 3-4 sets; or 6 corners x 4-6 reps on 30 s on / 30 s off.
- Aerobic base 1-2/wk (bike or run 30-45 min, or 4 x 4 min at 90-95% HRmax).
- Repeated lunge endurance: lunge to all four corners on a clock, 60 s on / 60 s off x 5.
- PRE/build: 2-3 conditioning sessions/wk; compete: 1.

### 19.8 Tests and benchmarks
| Test | Club | County / league top division | Professional |
|---|---|---|---|
| VO2max | 45-50 | 50-55 | 55-64 ml/kg/min (male); female 45-55 |
| Squash ghosting test (multistage, court-specific: Wilkinson) | Track stages completed | | |
| 505 | 2.55 s | 2.40 s | < 2.35 s |
| CMJ | 30-35 cm | 35-40 cm | > 40 cm |
| Single-leg calf raise to fatigue | ≥ 25 reps | ≥ 30 | ≥ 35 (practice) |

### 19.9 Taper
7 days: conditioning volume down 50%, ghosting kept at high intensity in short sets; last heavy lower 4 days before; primer on match day.

### 19.10 Encoding notes
`prehab`: `calf`, `copenhagen`, `ankle`, `lowback`, `shoulderER`, `elbow`. Conditioning weight much higher than for other racket sports (2-3 sessions in build).

### 19.11 Sources
Turner MA et al. 2024, physiological and nutritional considerations for elite squash: a systematic review (Sheffield Hallam, https://shura.shu.ac.uk/34486/); Girard O et al. 2007, J Strength Cond Res 21(3):909-914 (game analysis and energy requirements of elite squash); Murray S et al. 2016, J Sports Sci 34(23):2170-2174 (effects of the 2009 rule change on physical demands and shot characteristics of elite men's squash); Wilkinson M and colleagues (squash-specific multistage ghosting fitness test, validated in elite players); A review of sport-specific performance testing in squash (UKSCA Professional Strength & Conditioning, https://cdn.uksca.org.uk/assets/pdfs/UkscaIqPdfs/a-review-of-sportspecific-performance-testing-in-squash-636825595030882093.pdf); Schiftan 2015.

---

## 20. Badminton

### 20.1 Demands
| Measure | Values |
|---|---|
| Rally | Men's singles ~7-8 s, women's ~6 s; about 80% of rallies under 10 s |
| Rest between rallies | ~14-15 s; work:rest ~1:2 |
| Match | Singles ~25-60 min |
| Heart rate | Average above ~90% HRmax in competitive singles |
| VO2max | Elite men ~56, women ~46-47 ml/kg/min; singles higher than doubles |
| Movement | Lunges ~18% of movements in singles; jump smashes; scissor-kick landings; very fast split-steps and direction changes |
| Energy | High-intensity intermittent; aerobic power + alactic bursts |

### 20.2 Player variants
- Singles: aerobic power and repeated lunges; most court coverage.
- Doubles: more front-back rotation, more smashes and drives, shorter rallies, more power.
- Recreational over 35: Achilles risk (badminton is one of the leading sports for Achilles ruptures in northern Europe), calf capacity priority.

### 20.3 Injuries and prevention
Lower limb accounts for most injuries: ankle sprains, knee (patellar tendinopathy and other overuse), Achilles tendon (including ruptures), calf; shoulder overuse in the smashing arm; low back (Phomsoupha & Laffaye 2020 review; Fahlström 1998 Achilles).
| Priority | Module | Dose |
|---|---|---|
| 1 | `calf` (+ Achilles: heavy slow calf raises, single-leg endurance, pogo progressions) | 3x/wk |
| 2 | `ankle` | 2-3x/wk |
| 3 | `patellar` + lunge capacity (eccentric quads) | 2x/wk |
| 4 | `landing` (scissor kick: single-leg landing control) | 2x/wk |
| 5 | `shoulderER` | 2-3x/wk |
| 6 | `copenhagen` | 2x/wk |
| 7 | `lowback` | 2x/wk |

### 20.4 Season structure
Club leagues Sept-April; tournaments year-round. Gym: build 2-3, compete 1-2.

### 20.5 Week placement
As squash 19.5.

### 20.6 Session templates
**Build A**: split jump 3x4/side or lateral bound; scissor-kick jump and land (rear leg landing, stick) 3x3/side; front squat / trap bar N 3x8 / I 4x5 / A 5x3 @ 85%; forward lunge with front-foot reach 3x6/side; calf heavy + single-leg; Spanish squat 3 x 30 s; ankle balance.
**Build B**: overhead med ball throw 3x5; rotational throw 3x4/side; pull-up 3x8; landmine press 3x8; shoulder module; wrist; Copenhagen; trunk.
**Compete**: A 3x3 @ 80% + lunges 2x6 + calf; B 2 sets each.

### 20.7 Conditioning
Multi-shuttle / shadow footwork intervals to the six corners: 10 s / 20 s x 10-12, 3 sets (work:rest 1:2 matches the game); doubles: 6-8 s / 15 s. Aerobic base 1/wk.

### 20.8 Tests and benchmarks (adult male; female ~10% slower, VO2 ~15% lower)
| Test | Club | National | International |
|---|---|---|---|
| VO2max | 45-50 | 50-55 | > 55 ml/kg/min |
| Badminton footwork test (six-point / four-corner, 3 rounds) | Track time | | |
| CMJ | 32-38 cm | 38-45 cm | > 45 cm |
| 505 | 2.50 s | 2.40 s | < 2.30 s |
| Single-leg calf raise to fatigue | ≥ 25 | ≥ 30 | ≥ 35 (practice) |

### 20.9 Taper
As squash.

### 20.10 Encoding notes
`prehab`: `calf`, `ankle`, `patellar`, `landing`, `shoulderER`, `copenhagen`. Variants: `singles`, `doubles`, flag `over35` (Achilles priority, plyo progressions slower).

### 20.11 Sources
Phomsoupha M, Laffaye G 2015, Sports Med 45(4):473-495 (the science of badminton: game characteristics, anthropometry, physiology, visual fitness and biomechanics; https://www.worldbadminton.com/reference/research/documents/The_Science_of_Badminton_Game.pdf); Phomsoupha M, Laffaye G 2020, Sci Sports 35(4):189-199 (injuries in badminton: a review); Fahlström M, Björnstig U, Lorentzon R 1998, Scand J Med Sci Sports 8(3):150-155 (acute Achilles tendon rupture in badminton players); Gómez MÁ et al. 2020, rally characteristics in badminton (https://researchonline.jcu.edu.au/63416/); Schiftan 2015; Andersson 2017.

---

## 21. Table tennis

### 21.1 Demands
| Measure | Values |
|---|---|
| Rally | Very short (~3-4 s on average; most rallies under 5 strokes) |
| Rest | ~8-15 s between rallies; 1 min between games |
| Match | Best of 5 or 7 games, 20-50 min; tournaments with many matches a day |
| Heart rate / energy | Moderate overall (mean HR ~ 60-80% HRmax); alactic bursts; low aerobic demand relative to other racket sports |
| Movement | Small, explosive lateral and in-out steps; crossover steps; strong leg drive and hip-trunk rotation for forehand loops; a flexed ready position |
| Skill | Anticipation and visual skills dominate performance |

### 21.2 Player variants
- Attacking (loop) players far from the table: more lateral power and rotation.
- Close-to-table blockers: lower movement demand.
- Older recreational players: balance and leg strength are the main gains from training.

### 21.3 Injuries and prevention
Injury data are limited and lack detail; reported problems are mostly overuse: shoulder of the playing arm, low back (repeated rotation in a flexed posture), wrist/forearm, knee and ankle (Science & Sports 2020 systematic review; scoping review 2022).
| Priority | Module | Dose |
|---|---|---|
| 1 | `shoulderER` | 2-3x/wk |
| 2 | `lowback` + `trunkLat` (anti-rotation endurance) | 2-3x/wk |
| 3 | `elbow` / wrist | 2x/wk |
| 4 | `ankle` + lateral single-leg strength | 2x/wk |

### 21.4 Season structure
Year-round; leagues Sept-April. Gym: 2 sessions in most weeks; 1 in heavy tournament weeks.

### 21.5 Week placement
Low systemic fatigue: gym can be placed any day except the day before a tournament (leg session ≥ 48 h before).

### 21.6 Session templates
**A (lower + lateral)**: lateral bound 3x4/side; goblet or front squat N 3x10 / I 3x6 @ 75-80% / A 4x4 @ 85%; lateral lunge 3x6/side; single-leg RDL 2x8; calf 2x12; ankle balance.
**B (upper + rotation)**: rotational med ball throw both sides 3x5; cable woodchop 3x8/side; one-arm row 3x10; landmine press 3x8; shoulder module; wrist; Pallof; side plank.
Volume is deliberately modest: strength sessions of 35-45 min.

### 21.7 Conditioning
Footwork drills at table pace (multi-ball): 20-30 s / 30 s x 8-10. Aerobic base 1-2/wk for general health and recovery during long tournament days.

### 21.8 Tests and benchmarks
Sparse normative data. Practical: side-step test (e.g. 3 m x 10 lateral shuffles, time), single-leg balance 30 s eyes closed, rotational med ball throw asymmetry < 10-15%, side plank ≥ 60 s, grip strength (track).

### 21.9 Taper
Tournaments: last strength session 3-4 days before; primers (2x3 lateral bounds, band shoulder) on match days.

### 21.10 Encoding notes
`prehab`: `shoulderER`, `lowback`, `trunkLat`, `elbow`, `ankle`. Keep `q.maxStrength` 1, `power` 2; default gym frequency 2.

### 21.11 Sources
Physiology, biomechanics and injuries in table tennis: a systematic review, Science & Sports 2021, 36(2):95-104 (https://lida.sport-iat.de/ta/Record/4062835?lng=en); Epidemiology and risk factors of table-tennis-related injuries: findings from a scoping review of the literature, 2022 (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9147389/); Zagatto AM, Kondric M, Knechtle B, Nikolaidis PT, Sperlich B 2018, J Sports Sci 36(7) (energetic demand and physical conditioning of table tennis players: a study review); Andersson 2017.

---

## 22. Pickleball

### 22.1 Demands
| Measure | Values |
|---|---|
| Players | Disproportionately older adults (in US emergency department data most injured players are over 60) alongside a fast-growing younger group |
| Rally / movement | Short rallies on a small court (13.4 x 6.1 m); the non-volley "kitchen" zone means much play is at the net with short lateral steps, quick hand exchanges and occasional sprints back for lobs |
| Intensity | Light-to-moderate for social play, moderate-to-vigorous in competitive doubles and singles |
| Energy | Low-to-moderate aerobic demand; brief bursts |

### 22.2 Player variants
- `over55` / older adult (default): fall prevention, balance, leg power, bone health, calf/Achilles capacity.
- Younger competitive player: use the tennis-lite profile (lateral power, shoulder, elbow).

### 22.3 Injuries and prevention
Pickleball injuries presenting to US emergency departments have risen sharply with participation; most involve players over 60; common types are strains and sprains, and fractures from falls (wrist and upper limb, and hip in older players), many from backpedalling for lobs; Achilles ruptures, calf strains, rotator cuff and lateral elbow problems are also reported (Forrester 2020 and later US emergency department studies).
| Priority | Module | Dose | Evidence |
|---|---|---|---|
| 1 | Balance and fall prevention (`ankle` progressions + stepping and reactive balance) | 3x/wk | Strong for falls prevention in older adults generally (Sherrington 2019 Cochrane: exercise reduces falls by ~23%) |
| 2 | Leg strength and power (sit-to-stand speed, step-ups, split squats) | 2-3x/wk | Strong for older adults generally |
| 3 | `calf` / Achilles | 2-3x/wk | Practice |
| 4 | Movement coaching: turn and run back for lobs rather than backpedalling | Every session (app tip) | Practice |
| 5 | `shoulderER` + `elbow` | 2x/wk | Practice |
| 6 | Bone health: impact (low hops, if appropriate) and heavy-enough lifting | 2x/wk | Moderate (LIFTMOR trial: high-intensity resistance and impact training improved bone in postmenopausal women with low bone mass: Watson 2018) |

### 22.4 Season structure
Year-round recreational play. Default 2 gym sessions a week, 3 in a `build` block; 1-2 in heavy tournament weeks.

### 22.5 Week placement
Low fatigue sport: avoid heavy lower within 24-48 h of a tournament; social play can follow a gym session the same day.

### 22.6 Session templates
**A (strength and balance)**: sit-to-stand to a box, fast up / 3 s down (N) or goblet squat 3x8-10 (I/A 3x6 heavier); step-up 3x8/leg; split squat 2x8; single-leg balance with head turns and reaches 3 x 30 s/leg; calf raise 3x12-15 + seated calf 2x12; Pallof 2x10.
**B (power, upper, shoulder)**: lateral step and stick, progressing to small lateral hops 3x5/side; trap bar or DB RDL 3x8; row 3x10; landmine or DB press 3x10; band ER 2x15; wrist 2x15; side plank; farmers carry 2 x 20 m (grip, bone loading).
For older beginners all power work is "fast intent, low amplitude".

### 22.7 Conditioning
Brisk walking or bike 2-3 x 20-30 min a week (general health); court drills: 20-30 s dink-to-lob-recovery patterns / 40 s rest x 8.

### 22.8 Tests and benchmarks (older adult focus)
| Test | Needs work | Good | Excellent |
|---|---|---|---|
| 30 s chair stand (age 60-69) | < 12 | 14-17 | > 18 |
| Single-leg stand eyes open | < 10 s | 20-30 s | > 30 s |
| Single-leg calf raise to fatigue | < 15 | 20-25 | > 25 |
| Grip strength (men / women) | < 30 / < 20 kg | 35-40 / 22-26 kg | > 45 / > 28 kg |
| 5-10-5 shuttle | Track change | | |

### 22.9 Taper
Tournament: last heavy session 3 days before; balance and shoulder prep the day before; warm-up before every match.

### 22.10 Encoding notes
`prehab`: balance (`ankle`), `calf`, `shoulderER`, `elbow`, `hipAbd`. Default variant `over55` when the user is over 55. Add a safety tip on backpedalling.

### 22.11 Sources
Forrester MB 2020, J Emerg Med 58(2):275-279 (pickleball-related injuries treated in emergency departments); Increasing incidence of pickleball injuries presenting to US emergency departments (Icahn School of Medicine at Mount Sinai, https://scholars.mssm.edu/en/publications/increasing-incidence-of-pickleball-injuries-presenting-to-us-emer/); Sherrington C et al. 2019, Cochrane Database Syst Rev (exercise for preventing falls in older people living in the community); Watson SL et al. 2018, J Bone Miner Res 33(2):211-220 (LIFTMOR trial); Schiftan 2015.

---

## Part 6. The differences the app must encode (cross-sport summary)

| Sport | Top 3 prevention modules | Signature power quality | Conditioning model | Key variant split | Heavy lower gap before match | Special data the app should log |
|---|---|---|---|---|---|---|
| Football | Nordic, Copenhagen, FIFA 11+/landing | Acceleration, max velocity | IFT 15/15, RSA, max-velocity exposure | Outfield / GK; female | 72 h | Sprint exposure ≥ 90% weekly |
| Gaelic football | GAA 15, Nordic, max velocity | Max velocity, high catch | IFT, RSA | Middle third / full lines | 72 h | Same |
| Hurling | GAA 15, Nordic, trunk rotation | Rotational (both sides) + speed | IFT, RSA with hurley | As Gaelic | 72 h | |
| AFL | Nordic (force tested), Copenhagen, landing | Repeated sprint, jumping | High aerobic volume, IFT, RSA | Midfield / small / key / ruck; AFLW | 72 h | Weekly running load |
| Field hockey | Ankle/landing, Nordic, low back | Acceleration in a crouch | IFT 15/15 (rolling subs) | Drag-flicker, GK | 72 h | Drag-flick count |
| Lacrosse | Landing, ankle, Nordic (+neck men) | Rotational shot + COD | IFT, RSA | Men / women; positions | 72 h | |
| Rugby union | Activate ≥3x/wk, neck, Nordic | Strength-power, mass | RHIE, Bronco/IFT | Front row ... back three; female | 72-96 h | Contact load, concussion lock-out |
| Rugby league | Neck, Nordic, shoulder | Strength-power, mass | RHIE, up-and-back | Middle / edge / adjustable / outside | 72-96 h | Same |
| American football | Neck, Nordic, landing | Starting strength (bigs), speed (skill) | Play-length sprints, 1:6-1:8 | Bigs / big skill / skill / QB / specialists | 72 h | Heat acclimatisation |
| Basketball | Ankle + brace, landing, patellar | Vertical jump, deceleration | Court HIIT, RSA with turns | Guard / forward / big; female | 72 h | Jump count |
| Netball | Landing (KNEE/NetballSmart), ankle, Nordic | Deceleration, single-leg landing | Court HIIT | Centre court / circle | 72 h | |
| Volleyball | Ankle (net landing), shoulder, patellar | Approach and block jump | Minimal extra | Middle / outside / setter / libero / beach | 72 h | Jump count (spike prevention) |
| Handball | Shoulder (OSTRC), landing, ankle | Jump shot, throwing velocity | IFT, RSA | Wing / back / pivot / GK; female | 72 h | Throw count |
| Ice hockey | Copenhagen (ADD:ABD ≥ 0.8), neck, hip | Lateral (skater) power | Bike / slideboard / on-ice shifts | Forward / defence / goalie | 48-72 h | |
| Cricket | Bowling workload, side/low-back trunk, Nordic | Front-leg block (bowlers), rotational (both sides) | Repeat-spell, run-a-three | Fast bowler / batter / spinner / keeper | 72 h (bowlers + no trunk-heavy day after a spell) | Balls bowled per day |
| Baseball / softball | Pitch counts + rest, shoulder ROM/ER, elbow | Rotational, short sprint | Short sprints, full recovery | Pitcher / position / catcher / softball pitcher | Role-dependent (pitcher: lower day after start) | Pitch counts, ROM |
| Tennis | Shoulder, elbow, ankle | Lateral + rotational, serve | Court HIIT at ~1:2-1:4 | Baseliner / server / junior / over-35 | 48 h | Tournament block state |
| Padel | Calf, elbow, shoulder | Lateral, overhead | Court HIIT | Left side / over-40 | 48 h | |
| Squash | Calf, lunge capacity (quads, Copenhagen), ankle | Lunge power and endurance | Ghosting ~1:1, high aerobic | Competitive / over-40 | 48 h | Eyewear prompt |
| Badminton | Calf/Achilles, ankle, patellar | Jump smash, lunge | Shadow footwork 1:2 | Singles / doubles / over-35 | 48 h | |
| Table tennis | Shoulder, low back, wrist | Lateral step, rotation | Low; multi-ball footwork | Attacker / blocker | 48 h | |
| Pickleball | Balance/falls, leg power, calf | Fast sit-to-stand, lateral step | Light aerobic | Over-55 (default) / younger | 24-48 h | Fall-risk tips |
