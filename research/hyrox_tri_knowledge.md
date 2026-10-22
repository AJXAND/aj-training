# AJ Training: HYROX and triathlon coaching knowledge

Status: research pass of 22 Oct 2026. Nothing in `/home/claude/ajtraining/public` was changed.
Scope: HYROX (Open, Pro, Doubles, Relay) and triathlon (sprint, Olympic/standard, 70.3, Ironman), from first-timer to elite age-grouper and professional.
Companion to `/tmp/ajt/run_spec.md` (running engine). Both multisport engines **reuse the running engine** for paces (VDOT, section 1 of run_spec), run workouts (section 3), the single-run 10% rule, illness (4.5), return from injury (4.6) and the weekly decision table (4.3). This file only adds what is different.

## 0. Evidence labels and what the app must not overstate

Same labels as run_spec:
- **[E]** trial, meta-analysis or large cohort.
- **[E-]** thin evidence: small samples, observational, case studies, another sport.
- **[C]** coaching convention from named coaches or books, no head-to-head trial.
- **[A]** app-engineering choice so a rule can be computed.

Headline honesty points:

1. **HYROX science is very young.** The only peer-reviewed HYROX physiology study (Brandt et al. 2025, *Frontiers in Physiology*) has 11 recreational athletes in a solo gym simulation. Finish time correlated with VO2max (rho -0.71), endurance training volume (rho -0.68) and body fat % (rho +0.67). Grip strength, muscle mass and resistance-training volume did **not** correlate [E-]. Everything else about HYROX programming is race-split data [E-] and coaching convention [C]. The app must say "HYROX is mostly an endurance race" and must not claim a validated HYROX method.
2. **Running is about half the race time.** Brandt: 51 of 86.5 min running. World-class: Lauren Weeks ran 30:18 of 56:23 (54%), Hunter McIntyre 29:05 of 53:22 (55%). Endurance segments (runs, SkiErg, row) are about 69% of elite race time [E-]. The engine weights running and aerobic work first, stations second.
3. **Triathlon intensity distribution.** In 9 Ironman triathletes on one coach's programme, time in Z1 correlated with faster Ironman times (r = -0.92) and the share of time in Z2 with slower times (r = +0.94); the race itself was mostly Z2 (Muñoz 2014, IJSPP) [E-]. In 13 recreational 70.3 athletes, polarised and pyramidal blocks gave the same race result, and Z2 time correlated with faster segments (Selles-Pérez 2019) [E-]. **Robust rule: mostly easy, hard work capped. Long-course athletes still need some race-intensity (Z2/"tempo") work in the specific phase.**
4. **Fuelling.** In 59 Ironman finishers, carbohydrate intake rate correlated with finish time (r about -0.6; one SD more carbohydrate, about 0.4 g/kg/h, went with about 5% faster) (Downey & Hopkins 2001) [E-, observational]. 60 g/h glucose is the long-standing ceiling for glucose alone; glucose plus fructose raises oxidation by about 50%, and 90 g/h is the practical recommendation; benefits above 90 g/h are not clearly shown (Jeukendrup) [E for oxidation, E- for performance above 90 g/h].
5. **Taper.** About 2 weeks, volume cut 41-60%, intensity and frequency kept (Bosquet 2007 meta) [E]. Triathlon-specific guidance (Mujika) matches this [E-].
6. **Bricks.** Running after cycling mainly disturbs movement precision for the first 0.5-1 km (transient about 680 m after a 40 km TT vs about 290 m fresh) (Weich 2022, n = 22) [E-]. No trial shows bricks improve race results; they are kept for specificity and pacing practice [C].
7. **Strength.** Heavy strength training improves running and cycling economy (Rønnestad & Mujika 2014 review; Llanos-Lagos 2024 meta in run_spec) [E]. Separate it from key endurance sessions by about 6 h or put it on the same day as the hard session (concurrent-training guidance, Egan & Sharples 2023) [E-].
8. **Heat.** 7-14 days of about 60-90 min daily exercise in the heat gives most adaptation; benefits fade by about 75% within about 3 weeks (Sawka/Périard, GSSI) [E].
9. **Elite methods** (Norwegian triathlon team, Plews, Sutton, Purple Patch, Friel) are described from interviews and books [C]. The app may borrow their structure, never claim their results.

---

# PART A: HYROX

## A1. Race format and standards (2025/26 rulebook season)

### A1.1 Format
8 × (1 km run + 1 station), always in this order. Between the run loop and each station athletes pass through the **Roxzone** (transition), timed separately. The Roxzone adds roughly 600-800 m of extra movement in most venues.

| # | Station | Work | Rule notes |
|---|---|---|---|
| 1 | SkiErg | 1000 m | Damper set to 6 by default (athlete may change) |
| 2 | Sled push | 50 m (4 × 12.5 m) | Weight includes sled |
| 3 | Sled pull | 50 m (4 × 12.5 m) | Rope hand over hand; may not step on the line at the front of the athlete box |
| 4 | Burpee broad jumps | 80 m | Two-foot take-off and landing; may step up to standing (knees allowed, 25/26 clarification) |
| 5 | Row | 1000 m | Damper 6 by default |
| 6 | Farmers carry | 200 m | Kettlebells may be put down; multi-lap venues: 3 min penalty per missed lap |
| 7 | Sandbag lunges | 100 m | Back knee touches the floor each rep; bag may not be put down |
| 8 | Wall balls | 100 reps | Hip crease below knee; ball must hit the target |

25/26 penalties: one warning, then 15 s per infringement on sleds, burpee broad jumps and lunges (distance penalties removed). Wrong weight on farmers carry or lunges: redo or DQ. Shoes on except at wall balls.

### A1.2 Weights by division (sled weights include the sled)

| Station | Women Open | Men Open | Women Pro | Men Pro |
|---|---|---|---|---|
| Sled push | 102 kg | 152 kg | 152 kg | 202 kg |
| Sled pull | 78 kg | 103 kg | 103 kg | 153 kg |
| Farmers carry | 2 × 16 kg | 2 × 24 kg | 2 × 24 kg | 2 × 32 kg |
| Sandbag lunges | 10 kg | 20 kg | 20 kg | 30 kg |
| Wall balls | 4 kg | 6 kg | 6 kg | 9 kg |
| Wall ball target | 2.70 m (9 ft) | 3.00 m (10 ft) | 2.70 m | 3.00 m |

Team divisions:
- **Doubles** (Women, Men, Mixed; Open and Pro): both athletes run all 8 km **together** (more than 3 "too far apart" infringements = DQ in 25/26) and split each station any way they like. Women Doubles = Women Open weights; Men Doubles and Mixed Doubles = Men Open weights (same as Women Pro); Pro Doubles = Pro weights of that sex.
- **Relay** (Women, Men, Mixed; 4 athletes): each athlete runs 2 × 1 km and does the 2 stations that follow, then tags out. Each athlete uses the Open weight of their own sex. Usual leg order: athlete 1 = SkiErg + sled push, 2 = sled pull + burpee broad jumps, 3 = row + farmers carry, 4 = lunges + wall balls [C; teams may assign differently only as the rulebook allows].
- **Elite 15**: invitation only, Pro weights, separate championship race.

The engine stores weights per division so every station session can prescribe "race weight", "race weight + X%" or "race weight - X%".

### A1.3 Finish-time context (for goal setting, not as standards)
Aggregated median finish times (about 700,000 results): Men Open 1:27:56, Women Open 1:36:20, Men Pro 1:20:54, Women Pro 1:26:53, Men Doubles 1:16:13, Women Doubles 1:28:13, Mixed Doubles 1:23:05 [E-, third-party aggregation]. World-class: men under 54 min, women under 57 min (2025-26).

Sources A1: https://www.redbull.com/int-en/hyrox-exercise-stations-guide · https://www.redbull.com/us-en/hyrox-weights-overview · https://us.puma.com/us/en/articles/hyrox-weights-repetitions-distance-division · https://roxlyfe.com/2025-26-rulebooks/ · https://www.hyresult.com/hyrox/wall-balls · https://boxlifemagazine.com/700000-hyrox-results-analysed-here-is-exactly-where-your-finish-time-actually-ranks/ · https://hyranking.com/learn/explainers/what-is-a-good-hyrox-time

## A2. What predicts HYROX performance (and how the engine weights it)

| Finding | Evidence | Engine consequence |
|---|---|---|
| VO2max and endurance volume predict finish time; grip, muscle mass and lifting volume do not (Brandt 2025) | [E-] n = 11 | Aerobic running is the backbone. Strength sessions are capped at 2-3 per week and are never added at the expense of running |
| Runs ≈ 50-55% of time, Roxzone ≈ 7-11%, stations ≈ 35-42% | [E-] race splits | Weekly time budget: 55-65% running/erg aerobic, 20-30% station and compromised work, 15-20% strength |
| Stations raise lactate and RPE more than runs (8.5 vs 7.7 mmol/L; RPE 18 vs 16); wall balls produce the highest HR, lactate and RPE (Brandt 2025) | [E-] | Wall balls get the most specific practice; always practised fatigued in Build and Specific |
| A world-class athlete (Rončević, VO2max about 72) stayed under about 75% VO2max for most of a simulation with lactate about 1-5 mmol/L; VO2 rose at stations and recovered on runs | [E-] case study | Elite HYROX intensity is around threshold, not VO2max. Threshold running is the most important quality session |
| Podium Pros spent about 104% of their average run split in the Roxzone vs 133% for average Pros; their slowest-to-fastest run gap (runs 2-7) was a median 17 s vs about twice that | [E-] London 2022 | Pacing targets: even runs (spread ≤ 20-30 s), Roxzone practised as running, not walking |
| In 14,000 Men Open results, runs 5-8 correlated most with total time (r = 0.79); wall balls had the largest spread (SD about 2 min) | [E-] secondary report | Durability (running well when tired) matters more than the fresh 1 km. Compromised running and long aerobic work target it |
| A runner who does 1 km in 4:00 fresh typically adds about 20-30 s/km in the race | [C] Fast Talk | HYROX run pace = 10k pace + level offset (A4) |

Typical split shares from a London 2024 field (finishers near 1:16 Men): SkiErg 13%, sled push 8%, sled pull 13%, burpee broad jumps 14%, row 14%, farmers 6%, lunges 14%, wall balls 17% of station time [E-, one race]. The engine uses these shares to build station targets from a goal time (A12.2).

Sources A2: https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/pdf · https://athene-forschung.unibw.de/download/152283/152283.pdf · https://www.fasttalklabs.com/training/performance-determinants-of-hyrox-competition/ · https://vo2master.com/blog/case-study/first-in-field-metabolic-analysis-of-a-hyrox-champion/ · https://roxlyfe.com/5-interesting-data-results-to-improve-your-hyrox-performance/ · https://boxlifemagazine.com/hyrox-performance-data-driven-training-breakthroughs/ · https://rox-coach.com/seasons/7/races/2024-london/results/sallis-matt

## A3. Levels, inputs and benchmarks

### A3.1 HYROX levels [A, anchored to the medians above]

| Level | Definition | Typical Open finish | Weekly training hours (peak) | Weekly run km (peak) |
|---|---|---|---|---|
| H0 New | Can't run 5 km continuously, or never lifted | n/a (aim: finish) | 3-4 | 8-15 (run/walk allowed) |
| H1 First race | Runs 5 km in > 30 min, or first HYROX | Men > 1:40, Women > 1:50 | 4-5 | 15-25 |
| H2 Regular | 5 km 25-30 min; has raced or trains 3-4×/week | Men 1:25-1:40, Women 1:35-1:50 | 5-7 | 20-35 |
| H3 Competitive | 5 km 20-25 min; age-group podium hopes | Men 1:10-1:25, Women 1:20-1:35 | 7-10 | 30-50 |
| H4 Advanced / Pro | 5 km < 20 min (men) / < 22 min (women); Pro or Elite 15 aims | Men < 1:10, Women < 1:20 | 10-15 (elite 15-27) | 45-80 |

Pro choice gate [C/A]: suggest Pro only if the athlete can (a) push the Pro sled 4 × 12.5 m without stopping more than once per length, (b) do 100 wall balls at Pro weight to the Pro target in under about 8 min fresh, and (c) has an Open time inside the H3 band or faster.

Published coach volumes for comparison [C]: time-constrained 4-6 sessions and about 5 h/week; serious amateur 10-14 sessions and 15-20 h; full-time 20+ sessions (Roxfit). Lousa Way core plan: 6 days, 7-8 h, 30-50 km running with 3 structured runs; full version 10-11 h. Charlie Botterill (Elite 15): 25-27 h/week.

### A3.2 Setup inputs
Division (Open/Pro/Doubles/Relay, sex), race date, days available (3-7), hours available, 5 km time (or run engine P1-P5), equipment flags (sled, SkiErg, rower, wall ball and target, sandbag, kettlebells or dumbbells, 1 km route or treadmill), injury history, recent station benchmarks if known, partner level (Doubles) and assigned legs (Relay).

### A3.3 Station benchmark tests (fresh, race weight, done in Base week 1-2 and again in a Specific recovery week)

| Test | Protocol | Use |
|---|---|---|
| T-RUN5 | 5 km TT (run engine) | VDOT, all run paces |
| T-RUN1 | 1 km TT after 15 min warm-up | Upper bound of HYROX run speed; durability ratio (A3.4) |
| T-SKI | 1000 m SkiErg TT, damper 6 | Ski race pace = TT /500 m split + 5-8 s |
| T-ROW | 1000 m row TT, damper 6 | Row race pace = TT /500 m split + 5-8 s |
| T-PUSH | 50 m sled push at race weight (4 × 12.5 m, no rest at turns beyond the turn itself) | Number of stops and time; strength gap flag if more than 1 stop per length |
| T-PULL | 50 m sled pull at race weight | As above |
| T-BBJ | 80 m burpee broad jumps | Rhythm and time |
| T-WB | 100 wall balls for time, race ball and target; record largest unbroken set | Wall ball set plan (A12.3) |
| T-CARRY | 200 m farmers carry at race weight | Grip flag if any put-down |
| T-LUNGE | 100 m sandbag lunges | Time and any rest |
| T-HALF | Half simulation (A7, H-SIM2) at the end of Build | Fade and Roxzone habits |

Gym-to-race factor: race station times run about 10-20% slower than fresh gym times because of accumulated fatigue and venue factors [C, fitnessvolt]. Station prediction = benchmark × 1.10 (H3-H4) or × 1.15-1.20 (H0-H2) [A].

Reference station marks [C]: SkiErg 1000 m Men Open under 4:00 above average, 3:20-3:40 advanced, under 3:10 elite; Women sub-4:30 solid, sub-3:50 advanced.

### A3.4 Durability ratio [A]
`dur = average run split in last simulation or race / T-RUN1 time`. Under 1.15 = durable; 1.15-1.30 typical; over 1.30 = durability is the limiter, so the engine adds one more compromised or long aerobic session and reduces pure speed work.

Sources A3: https://roxfit.app/blog/how-to-train-for-hyrox · https://intercom.help/the-lousa-way/en/articles/11469131-individual-season-plan · https://the5krunner.com/2026/06/16/hyrox-elite-training-schedules/ · https://fitnessvolt.com/roxrace/strength-standards/

## A4. HYROX zones and paces

Running paces come from the run engine VDOT (run_spec 1.1-1.3). HYROX adds:

| Named intensity | Definition | RPE (CR-10) | HR cue |
|---|---|---|---|
| E / Z1 | run_spec E pace; ergs and bike at "conversational" | 2-4 | < VT1, about < 80% HRmax |
| Steady / Z2 low | Marathon to HM effort; hybrid aerobic circuits | 5 | 80-87% HRmax |
| T | run_spec T pace (about 1 h race effort) | 6-7 | 88-92% HRmax |
| **HRP (HYROX run pace)** | 10k pace (from VDOT) + level offset: H4 +10-20 s/km, H3 +20-30 s, H2 +30-45 s, H1 +45-75 s | 7 | Run 1-3 about 80-85% HRmax, later runs 85-90% |
| I | run_spec I pace | 8-9 | 92-97% HRmax |
| Station race effort | the effort that can be held through the station and still run the next km at HRP | 7-8 | n/a (stations spike HR) |

Check of the offset against elites [E-]: Weeks averaged 3:47/km and McIntyre 3:38/km, about 15-25 s/km slower than their likely 10k pace, matching the H4 band. Centr's guidance "20-30 s/km slower than 10k pace" matches H3 [C].

Erg paces [A]: Ski and row race split = 1000 m TT split + 5-8 s/500 m. Erg threshold (for intervals) = TT split + 3-5 s/500 m. Erg easy = TT split + 15-25 s/500 m.

## A5. HYROX phases by weeks to race and level

Phase order: (Foundation, H0 only) → Base → Build → Specific → Taper. N = weeks from start to race, including race week.

| Level | Min N | Recommended N | Taper | Specific | Build | Base |
|---|---|---|---|---|---|---|
| H0 | 12 | 16-20 | 7 days | 3-4 | 4-5 | rest (includes 4-6 week Foundation: run/walk and technique) |
| H1 | 8 | 12-16 | 7 days | 3-4 | 4 | rest |
| H2 | 8 | 12-16 | 7-10 days | 4 | 4-5 | rest |
| H3 | 6 | 12-16 | 10 days | 4-6 | 4-6 | rest |
| H4 | 6 | 12-20 (or a season of blocks) | 10-14 days | 6 | 6 | rest |

Rules [C/A]:
- Short N: compress Base first, then Build. Never shorten taper below 7 days or Specific below 3 weeks (H1+).
- Racing every 4-8 weeks (common in HYROX seasons): after a race, 1 recovery week (volume ×0.6, no stations at race weight for 4 days), then either a 2-3 week mini-Build plus 1 Specific week or straight into Specific if the next race is ≤ 4 weeks away. A "B race" gets a 4-day mini-taper, not a full taper.
- No date: rolling 12-week blocks (4 Base, 5 Build, 3 Specific-lite with a half simulation as the test).

Phase intent:
- **Base**: aerobic volume (easy running, ergs, bike), threshold introduced, general strength (heavy, low reps), station technique at sub-race weight. Compromised running light (one short session per week from week 3).
- **Build**: threshold volume up, VO2 work once per week or fortnight, strength-endurance for stations, compromised running weekly, first half simulation at the end.
- **Specific**: HYROX run pace and race-weight stations, race simulations (half and full), Roxzone practice, strength held at maintenance.
- **Taper**: volume down 40-60%, intensity kept in short doses, no new stimuli.

## A6. Weekly templates by days available (and hours)

Session codes (defined in A7): **E** easy run, **L** long run, **T** threshold run, **V** VO2 run, **HRP** race-pace run reps, **C** compromised run, **HA** hybrid aerobic (ergs/stations at Z1-2), **ERG** erg threshold, **SA/SB** strength A/B, **ST** station skill/strength-endurance, **SIM** simulation.

Placement rules [C]:
1. Never two "hard" days in a row (T, V, C, SIM, heavy SA/SB). Exception: H4 with doubles, hard AM + strength PM on the same day is preferred over strength on an easy day.
2. Heavy lower-body strength goes on the same day as T or C (after it, ideally ≥ 6 h later) or ≥ 48 h before the next key run. Never the day before L, T or SIM.
3. SIM goes on the long-run day and replaces L that week.
4. In 3- and 4-day weeks, strength and station work are merged into one session ("S+ST").

| Days | Base week | Build week | Specific week |
|---|---|---|---|
| 3 | 1: SA + ST (45-60 min); 2: T; 3: L (or HA) | 1: SA+ST; 2: T or V (alternate); 3: C (long form) or L (alternate) | 1: SB (maintenance) + ST race weight; 2: HRP reps; 3: SIM or C (alternate) |
| 4 | 1: SA+ST; 2: T; 3: E or HA; 4: L | 1: SA+ST; 2: T; 3: C; 4: L | 1: S (maintenance)+ST; 2: HRP or T; 3: E + strides; 4: SIM (wk -6/-3) or C-long |
| 5 | 1: SA; 2: T; 3: HA; 4: SB + E; 5: L | 1: SA + C-short; 2: T; 3: HA; 4: SB + E; 5: L or C-long | 1: S + ST; 2: HRP; 3: HA (easy); 4: E + strides + ST light; 5: SIM / C-long |
| 6 | 1: SA; 2: T; 3: E; 4: SB + ST; 5: HA; 6: L | 1: SA; 2: T; 3: E; 4: SB + C-short; 5: V or ERG; 6: L or C-long | 1: S + ST; 2: HRP; 3: E; 4: ERG + station threshold; 5: E + strides; 6: SIM / C-long |
| 7 (H4, doubles allowed) | AM/PM pattern: 2 × T (one run, one erg or run), 1 V, 2 × HA, 2-3 strength, 1 L, 1 easy bike or walk. Example (Wietrzyk-type week): Mon L-aerobic + strength; Tue T run + HYROX-specific PM; Wed aerobic run + strength/technique PM; Thu T run + erg thresholds into stations PM; Fri aerobic run + strength PM; Sat speed run + HYROX-specific PM; Sun easy bike 60-90 min | same, with 1 T replaced by C every other week | 2 HYROX-specific sessions (one SIM-type), 2 T/HRP runs, strength 1-2 maintenance |

Hours scale the duration of each slot, not the number of hard sessions [A]:

| Hours/week | Hard sessions/week (T, V, C, SIM, ERG) | Strength sessions | Easy share (time) |
|---|---|---|---|
| < 4 | 2 | 1 (merged with ST) | ≥ 60% |
| 4-6 | 2-3 | 1-2 | ≥ 65% |
| 6-9 | 3 | 2 | ≥ 70% |
| 9-12 | 3-4 | 2-3 | ≥ 72% |
| > 12 | 4-5 (two may be same-day doubles) | 2-3 | ≥ 75% |

Running share of total weekly time [A]: H0-H1 30-40% (injury risk, Brandt also advises limiting running volume), H2-H3 40-50%, H4 45-55%. The rest goes to ergs/bike (aerobic, low-impact), stations and strength. Station work counts as running-equivalent load for fatigue purposes (Roxfit) [C].

Sources A6: https://the5krunner.com/2026/06/16/hyrox-elite-training-schedules/ · https://hyroxhub.substack.com/p/how-to-structure-your-hyrox-training · https://roxfit.app/blog/how-to-train-for-hyrox · https://www.puregym.com/blog/hyrox-training-plan/ · https://intercom.help/the-lousa-way/en/articles/11469131-individual-season-plan

## A7. HYROX session library (id · purpose · prescription · ladder)

Warm-ups: run sessions use run_spec WU-Q / WU-I. Station sessions: 8-10 min easy erg + 2 rounds of 5 air squats, 5 inchworms, 10 m light sled, 5 light wall balls.

**Running (reuse run_spec definitions; HYROX-specific caps)**
- **E · Easy run.** 25-60 min (H1-H2), 40-75 min (H3-H4) at E. Strides 4-6 × 20 s on one E run per week from Base week 3.
- **L · Long run.** E pace. Base start = 1.5 × the user's typical easy run, +5-10 min/week, single-run 10% rule applies (run_spec 2.5). Caps: H1 60 min, H2 75 min, H3 90 min, H4 100-110 min. Last 10-15 min may build to steady in Build.
- **T · Threshold run.** run_spec T-cruise or T-NOR ladders. HYROX default ladder: 5 × 1 km (60 s) → 6 × 1 km → 4 × 1.6 km → 3 × 2 km (75 s) → 4 × 2 km → 3 × 3 km. H4 Norwegian option: 10 × 1 km at T + 2-3% with 60 s. Cap: T ≤ 10% of weekly run km or 10 km.
- **V · VO2 run.** run_spec I-long or I-30/15. HYROX default: 6 × 800 m at I (2 min) → 5 × 1 km (2:30) → 4 × 4 min (3 min). Max once per week (Build), once per fortnight in Base and Specific. Not for H0-H1 before Build week 3; use I-30-30 instead.
- **HRP · HYROX-pace kilometres.** WU-Q, then 6-8 × 1 km at HRP with 60-90 s standing rest (the Roxzone-plus-station gap), CD. Ladder: 5 × 1 km (90 s) → 6 × 1 km (75 s) → 8 × 1 km (60 s) → 8 × 1 km (45 s) → 8 × 1 km with the last 2 at HRP - 5 s. Purpose: teach the exact race rhythm and even splits; target spread ≤ 10 s across reps.

**Compromised running (C)** [C; Roxlyfe: minimal rest is what makes it "compromised"; place it on tempo-type days, not long slow days]
Definition: a station or station-like effort at race weight (or heavier), immediately followed (≤ 30 s) by running at HRP or faster.
- **C-short (Base week 3 onwards, Build)**: 3-5 rounds of: station block (2-3 min, e.g. 25 m sled push race weight, or 20 wall balls, or 250 m ski) → 500 m run at HRP - 5 s. No rest beyond transitions, 2-3 min between rounds. Ladder: 3 rounds → 4 → 5 → 4 rounds with 1 km runs.
- **C-long (Build and Specific)**: 4 rounds of 1 km at HRP + one of the "leg killer" stations at race weight (sled push 50 m, burpee broad jumps 40 m, lunges 50 m, wall balls 50). Rest 2 min between rounds. Ladder: 4 rounds half-station → 4 full → 5 → 6 rounds.
- **C-pair (Specific)**: the exact race pairings at race weight: run → ski, run → push, run → pull, etc., done in 2-station chunks with 3-4 min between chunks. Priority pairings: run after sled push (legs), run after burpee broad jumps, run after lunges into wall balls.
- **C-interval (H3-H4)**: put station work in the recovery of a T session, e.g. 5 × 1 km at T with 15 wall balls or 10 burpee broad jumps in each recovery instead of rest.
Frequency: 1 per week Build; 1-2 per week Specific (one may be SIM). Never on consecutive days with T or V.

**Hybrid aerobic (HA)** [C, elite weeks use "easy HYROX" and "zone 2 workout" days]
40-75 min continuous at Z1-2 (RPE 4-5, talk in sentences), rotating 6-10 min blocks: ski, row, bike, easy run, carries at light-moderate weight, light sled, step-ups. No block is hard. Purpose: aerobic volume with low impact, plus movement practice. Ladder: +5-10 min per week up to the hours budget. Counts as easy time.

**Erg threshold (ERG)**
- Ski or row: 4 × 1000 m at erg threshold (2 min) → 5 × 1000 m → 3 × 2000 m (3 min). Or 30-40 min "erg threshold mix" alternating 4 min ski / 4 min row at threshold, 1 min easy (Botterill-type "30-40 min ERG intervals at race pace").
- Bike (Echo/assault or C2 bike): 6-10 × 2 min at hard (RPE 8), 1 min easy. Used as low-impact VO2 work for runners near their running ceiling.

**Station threshold and strength-endurance (ST)**
- **ST-tech (Base)**: technique at 60-80% race weight: sled push 6 × 12.5 m, pull 6 × 12.5 m, BBJ 4 × 10 m, wall balls 5 × 15 with full depth and target, lunges 4 × 20 m, carries 4 × 50 m. Rest as needed. RPE 5-6. Teach: sled push arms locked or slightly bent, body at about 45°, short fast steps driving through the forefoot; sled pull with a wide athletic stance, hand over hand using hips and body lean, rope laid tidily to one side; BBJ step-back burpee (legal step-up) and a moderate jump; wall balls with ball at chin, full squat, throw from the legs, catch high and ride down; lunges with short steps, knee kisses the floor; carries with tall posture, short quick steps.
- **ST-heavy (Build)**: sled push and pull at 110-130% race weight, 4-6 × 12.5-25 m, 90-120 s rest (force reserve, so race weight feels lighter). Wall balls: EMOM 10-15 min × 12-20 reps. Lunges 3-4 × 25-50 m at race weight. Farmers carry 3-4 × 100 m at race weight +10-20%.
- **ST-race (Specific)**: each station at race weight and race distance at race effort, 4-6 min rest, in race order or the athlete's 2-3 weakest stations. Or "station threshold": 3 rounds of 500 m ski + 25 m push + 25 m pull + 20 wall balls at race effort, 3 min rest.
- **ST-WB (any phase, H1-H3)**: wall ball capacity ladder: 5 × 20 (60 s rest) → 4 × 25 (60 s) → 3 × 35 (90 s) → 2 × 50 (2 min) → 100 for time with the race set plan. After a run in Build and Specific.

**Simulations (SIM)** [C]
- **SIM-half (H-SIM2)**: 4 × (1 km run at HRP + station) covering stations 1-4 or 5-8, at race weight, real Roxzone walking/jogging distance. 60-75% effort for the first, race effort for later ones.
- **SIM-full**: full race at race weight. At 90-95% effort the first time, race effort the last time.
- **SIM-double-station (H3-H4, Specific)**: 8 × 1 km at HRP with half-distance stations, so total time is about 70% of race time but running is complete (good for practising run rhythm without the full cost).
- Frequency: H0-H2: 1-2 full SIMs per build (weeks -6 and -3), half SIMs at weeks -8 and -4. H3-H4: 2-3 full SIMs (weeks -8, -5, -3), half SIMs in other Specific weeks. **Last full SIM ≥ 14 days out (H3-H4) or ≥ 18 days out (H0-H2).** After a full SIM: next day easy or off, no T/V for 72 h (it costs about as much as a race).

**Strength (SA/SB)** see A8.

Sources A7: https://roxlyfe.com/your-guide-to-compromised-running/ · https://www.redbull.com/int-en/hyrox-exercise-stations-guide · https://www.hyresult.com/hyrox/wall-balls · https://the5krunner.com/2026/06/16/hyrox-elite-training-schedules/ · https://www.puregym.com/blog/hyrox-training-plan/

## A8. Strength and station strength by phase

Evidence frame: heavy (≥ 80% 1RM) and plyometric training improve running economy [E]; HYROX finish time does not track grip or muscle mass [E-]; station loads are moderate for most Open athletes but are a true strength demand for lighter athletes and Pro divisions [C].

| Phase | Goal | Prescription [C] | Sessions/week |
|---|---|---|---|
| Base | Max strength and tissue capacity | 3-4 × 4-8 at RPE 7-8 (≈ 75-85% 1RM): back or front squat or trap-bar deadlift; RDL; split squat or step-up; pull-up or heavy row; push press or DB press; carries; core (dead bug, Pallof, side plank); calf raises 3 × 12-15 (Achilles capacity). Plyos for H2+: 3 × 5 box or broad jumps | 2 (H0-H1: 1-2) |
| Build | Strength-endurance and force reserve | Keep 1 heavy lift per session at 3 × 3-5 (RPE 8), then 2-3 HYROX-specific strength-endurance pieces: sled 110-130%, walking lunges 3 × 20-30 m loaded, wall ball EMOM, thrusters 3 × 12-15, heavy farmers | 2 (H4: 2-3) |
| Specific | Maintain strength, sharpen stations | 1 maintenance session: 2-3 × 3-5 at RPE 7 on 2-3 lifts (≈ 20-30 min), plus ST-race. Strength drops if heavy work stops for more than about 2-3 weeks [C], so keep one exposure | 1-2 |
| Taper | Freshness | One short session ≥ 4 days before the race: 2 × 3 at RPE 6 on squat and pull, light station touches | 1 |

Strength benchmarks (relative to body mass) that suggest strength is **not** the limiter [A, from coaching norms]: Open men back squat ≥ 1.25 × BM, deadlift ≥ 1.5 × BM; Open women squat ≥ 1.0 × BM, deadlift ≥ 1.25 × BM; Pro: add 0.25 × BM. Below these and T-PUSH has > 1 stop per length: add a third strength session in Base and reduce one HA.

Equipment substitutions [A]: no sled → unpowered/curved treadmill push, heavy prowler, or "sled-less push" (DB walking lunges + wall-supported drive marches) with a note that sled feel can't be fully replaced; no SkiErg → banded straight-arm pulldowns + row or bike; no wall ball target → thrusters (DB 2 × 10-15 kg); no sandbag → goblet-hold or barbell back-rack lunges; no kettlebells → dumbbells or trap bar carry.

Sources A8: https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/pdf · https://roxfit.app/blog/how-to-train-for-hyrox · https://www.inigomujika.com/en/2013/08/13/optimizing-strength-training-for-running-and-cycling-endurance-performance-a-review-2/3040/ · https://fasttalklabs.com/fast-talk/does-strength-training-hurt-or-help-endurance-sports-performance-with-dr-bent-ronnestad

## A9. Progression and recovery weeks (HYROX)

- **Running volume**: run_spec 2.4 growth rule (≤ +8% or +3 km per non-recovery week) and the 10% single-run rule. HYROX peak run km from A3.1, × days factor (3 days ×0.75, 4 ×0.9, 5+ ×1.0).
- **Total hours**: ≤ +10% per non-recovery week. Station time counts in hours.
- **Ladders**: each family (T, V, HRP, C, ERG, ST-WB, ST-heavy load) moves one step per appearance in non-recovery weeks, as run_spec 3.3 (completed on target → next step; hard → hold; failed → step back).
- **Station loads**: ST-heavy starts at race weight and adds 10% per 2 weeks to a ceiling of 130% (H3-H4) or 115% (H1-H2). Wall ball volume per session +10-20 reps per week to 150 (H1-H2) or 200 (H3-H4).
- **Compromised density**: progress by (1) more rounds, then (2) less rest, then (3) faster run pace. Never all three in one week.
- **Recovery weeks** [C]: 3:1 default; 2:1 for H0, age ≥ 50, or a running injury in the last 12 months. Recovery week: hours ×0.65-0.75, running ×0.7, one hard session at step -1, strength kept at lower load, no SIM. Benchmarks are re-tested at the end of a recovery week in Build and Specific.

## A10. Testing calendar (HYROX)

| When | Tests |
|---|---|
| Base wk 1-2 | T-RUN5 (or parkrun), T-SKI, T-ROW, T-WB, T-PUSH, T-PULL (others optional) |
| End of Base (recovery week) | T-RUN5 or T-RUN1; repeat one weak-station test |
| End of Build | SIM-half (T-HALF) → durability ratio, Roxzone %, wall ball set plan |
| Specific | SIM-full at week -6/-5 and week -3 → goal-time check |

Re-test results update: VDOT (run engine rules), erg race splits, station predictions, and the goal-time model (A12.2).

## A11. HYROX taper and race week

| Days to race | H0-H2 | H3-H4 |
|---|---|---|
| 14-10 | Last full SIM (≥ 18 days for H0-H2); last ST-heavy ≥ 10 days | Last full SIM 14 days; last ST-heavy 10 days |
| 9-7 | Normal week shape, volume ×0.7 | Volume ×0.6-0.7; T at step -1 |
| 6 | HRP 4 × 1 km (90 s) | HRP 5 × 1 km (60 s) + 2 race-weight stations (half distance) |
| 5 | Easy 30 min or rest | Easy 30-40 min + 4 strides |
| 4 | Short strength (2 × 3, RPE 6) + 30 wall balls in sets | Same + 20 m sled at race weight |
| 3 | Rest | Easy 20-30 min or easy erg |
| 2 | Activation: 15 min easy + 3 × (400 m at HRP, 10 wall balls, 10 m sled or 5 BBJ), 2 min rest | Same |
| 1 | Rest or 15-20 min walk/jog + mobility | Rest or 20 min easy + 3 strides |
| 0 | Race | Race |

Volume in the final week ≈ 40-50% of a normal week, with some speed kept (PureGym, Roxfit) [C]. No new shoes, ball, gloves or chalk routine in race week.

Sources A11: https://roxfit.app/blog/how-to-train-for-hyrox · https://www.puregym.com/blog/hyrox-training-plan/ · Bosquet 2007 via run_spec section 9

## A12. HYROX race-day pacing and fuelling

### A12.1 Pacing rules [C, with E- race data]
1. **Run 1 at HRP + 0-5 s**, never faster. Average athletes surge with the start wave, and in Men Open data the last run is on average almost 2 min slower than the first.
2. **Runs 2-7 within ± 10 s of HRP; spread target ≤ 20 s (H3-H4) or ≤ 30 s (H1-H2).** Podium median spread 17 s.
3. **Roxzone: jog it.** Target Roxzone total ≤ 1.1 × average run split (podium ≈ 1.04, average Pro ≈ 1.33).
4. **Ergs**: first 200 m easy, settle at race split (TT + 5-8 s/500 m), last 200 m harder. Ease about 10% below "possible" to protect the run.
5. **Sled push**: steady, continuous; roughly 70% effort first 20 m, 80% next 20 m, 90% last 10 m (Centr). Plan "no more than 1 stop per length".
6. **Sled pull**: long pulls, hips back, walk back to the line between pulls only when needed; keep rope off feet.
7. **Burpee broad jumps**: a rhythm you can hold for all 80 m; no sprinting the first 20 m.
8. **Farmers carry**: unbroken where possible; it is the cheapest station to lose time on by putting down.
9. **Lunges**: steady unbroken pace; this is the setup for wall balls, so stay at RPE 7.
10. **Wall balls**: set plan from T-WB: largest unbroken fresh set × 0.5 = race set size (min 10), rest ≤ 5-8 breaths between sets. Typical: H1 10 × 10; H2 5 × 20 or 4 × 25; H3 4 × 25 or 30-25-25-20; H4 50-30-20 or unbroken. Do not blast the first 20.
11. **HR guide** (if worn): 75-80% HRmax early, 80-85% mid-race, 85-90%+ in the last 2 runs and wall balls (Centr) [C].

### A12.2 Goal-time model [A]
```
runTotal  = 8 * HRP_seconds
station_i = benchmark_i * gymToRace            // 1.10 (H3-H4), 1.15-1.20 (H0-H2)
            // if no benchmark: stationTotal = goal * 0.40, split by shares
            // Ski .13, Push .08, Pull .13, BBJ .14, Row .14, Carry .06, Lunge .14, WB .17
roxzone   = 1.10 * HRP_seconds                 // per race, total; Pro venue-dependent
predicted = runTotal + sum(station_i) + roxzone
```
If predicted is more than 5% slower than the goal, the app says which component is furthest from the goal's share and biases the plan (A14 row X5).

### A12.3 Fuelling and hydration [E for principles, C for HYROX specifics]
- **Day before**: normal high-carbohydrate day (5-7 g/kg) for races likely > 75 min; no full carb-load needed.
- **Pre-race meal**: 1-2 g/kg carbohydrate 2-3 h before (low fat and fibre), 400-600 ml fluid.
- **Caffeine**: 3 mg/kg 45-60 min before, only if practised.
- **During**: under 75 min, water and optional carbohydrate mouth rinse; 75-120 min, 30-45 g carbohydrate (e.g. one gel in the Roxzone before the row and one before wall balls) if practised in simulations. Sip water at the station at run 4-5.
- **Wave timing**: athletes often wait hours at venues; eat a 30-40 g carbohydrate snack 60-90 min before their wave if the meal was more than 3 h earlier.

Sources A12: https://roxlyfe.com/5-interesting-data-results-to-improve-your-hyrox-performance/ · https://builtforathletes.com/blogs/news/data-driven-insights-into-fitness-racing · https://centr.com/blog/show/e97c65f7-fbbe-4641-9bd8-d96f3c78ddae/pacing-strategy-to-crush-your-hyrox-phoenix-race · https://www.hyresult.com/hyrox/wall-balls · https://fitnessvolt.com/roxrace/strength-standards/ · https://athletica.ai/blog/hyrox-nutrition-guide

## A13. Division-specific programming

| Division | What changes [C/A] |
|---|---|
| **Open** | Default plan above |
| **Pro** | Strength share +5-10% of hours in Base and Build; ST-heavy ceilings 120-130% of Pro weight; sled sessions weekly through Specific; wall balls at 9 kg / 6 kg to Pro target. HRP offset uses H4 values only if the Pro sled benchmark has ≤ 1 stop per length, otherwise H3 values (heavier stations fatigue runs more) |
| **Doubles** | Each athlete does about half the station work, so **running becomes the limiter**: HRP offset drops by about 10-15 s/km vs singles; more T and V, less station volume (ST ×0.6). Partner sessions every 1-2 weeks in Specific: practise swaps and running together at the slower partner's pace. Default swap plan: sleds alternate by length (12.5 m); ski and row swap every 250 m (H1-H2) or 200 m / by fatigue (H3-H4); BBJ alternate 20 m; carry alternate 50-100 m; lunges alternate 25 m; wall balls switch every 10-15 reps (H1-H2) or 15-25 (H3-H4). The stronger partner takes more sled and wall-ball work; the faster runner sets the run pace only if the other's durability ratio is < 1.2 |
| **Relay** | Each athlete races 2 × (1 km + 1 station) at near-maximal effort with rest in between: 1 km at about 3k-5k pace (I pace), station at maximal sustainable effort. Plan: 3-5 days, more V and I-30/15, short C-pairs of their own two stations, less long aerobic volume (L cap 60-75 min). Leg-specific station practice twice per week in Specific |
| **Elite 15 / World Championships** | H4 Pro plan; heat and travel handling as triathlon B14 if the venue is hot |

## A14. Adaptation: missed sessions, fatigue, injury (HYROX)

Use run_spec 4.3 (rows W1-W11), 4.5 (illness), 4.6 (return from injury) and the missed-session rules unchanged, with these additions (first matching row wins, checked before W4):

| # | Condition | Action |
|---|---|---|
| X1 | Running-limiting injury (pain rule W1 or W3) but lifting and ergs pain-free | Replace runs minute for minute with bike or ski/row at the same zone; keep stations that don't load the injured site (e.g. Achilles: no BBJ, no lunges, sled push only if pain ≤ 2/10). Keep T as an erg/bike threshold session |
| X2 | Upper-body or grip injury | Keep all running; replace SkiErg with bike; carries and pulls removed; wall balls replaced by goblet squats to a box (no throw) |
| X3 | Missed SIM | Do not catch up within 7 days of another hard day; if ≥ 14 days to race, move it to next week and drop that week's C-long. If < 14 days, replace with SIM-half at week -2, never a full SIM |
| X4 | DOMS after first sled/lunge exposure (legs heavy ≥ 2 days) | Next ST at -20% load and half volume; no V for 48 h. Normal in Base wk 1-3 |
| X5 | Goal model gap > 5% | Bias Build: if runs are short → +1 T or V, −1 ST; if stations are short → +1 ST-heavy or C-long, −1 E; if Roxzone > 1.25 × run split → add Roxzone drills (jog transitions in every C and SIM) |
| X6 | Durability ratio > 1.30 | +1 C-long or +15 min L; V → T |
| X7 | 3-day athlete with no SIM possible (equipment) | Use C-long with substitutions (A8); keep at least one race-weight sled exposure at a commercial gym every 2-3 weeks if possible |
| X8 | Race in < 3 weeks and fitness clearly short (predicted > goal × 1.08) | Keep plan, reset goal to the predicted time, emphasise even pacing (A12.1) |

Missed sessions inside the week [C]: missed T or C → move only if ≥ 48 h from the next hard day and not the day before L/SIM; missed strength → do it after the next E run (lighter) or drop it; missed E or HA → drop it.

---

# PART B: TRIATHLON

## B1. Distances and limits

| Distance | Swim | Bike | Run | Typical age-group duration | Common cut-offs |
|---|---|---|---|---|---|
| Super-sprint | 400 m | 10 km | 2.5 km | 30-50 min | event specific |
| Sprint | 750 m | 20 km | 5 km | 1:00-1:45 | event specific |
| Olympic (standard) | 1500 m | 40 km | 10 km | 2:00-3:30 | event specific |
| 70.3 (half) | 1.9 km | 90 km | 21.1 km | 4:30-7:30 | 8:30 total; swim about 1:10; bike about 5:30 from start |
| Ironman (full) | 3.8 km | 180 km | 42.2 km | 9:30-16:00 | 17:00 total; swim 2:20; bike about 10:30 from start |

Cut-offs and wetsuit temperature limits vary by organiser; the app shows them as "check your race rules" [A].

## B2. What drives triathlon performance

- Overall time is dominated by the bike (about 50% in 70.3 and Ironman) and the run (about 30-35%), swim about 10-15% for age-groupers [C, race arithmetic].
- Lab measures that tracked 70.3 race performance: 800 m swim test, bike power at VT2, bike maximal aerobic power, run speed at VT2 and maximal aerobic speed; VO2max alone did not (Selles-Pérez 2019) [E-]. **Threshold measures (CSS, FTP, run threshold pace) are what the engine anchors to.**
- More Z1 training time and more total time associated with faster Ironman times (Muñoz 2014) [E-].
- Annual volume scales with level (Friel/Couzens tables): finisher about 350-500 h/year (7-10 h/week), mid-pack (≈ 12 h IM) 500-700, Kona qualifier 700-1000, Kona age-group podium 900-1100, pro 1000-1500. Some athletes qualify for Kona on about 10 h/week [C].
- Couzens' data: average chronic training load (CTL) about 150 TSS/day for a 9-hour Ironman, 120 for 10 h, 80 for 12 h [C/E-].
- Carbohydrate intake during an Ironman tracks finish time (Downey & Hopkins 2001) [E-].

Sources B2: https://pmc.ncbi.nlm.nih.gov/articles/PMC6873141 · https://abacus.universidadeuropea.com/entities/publication/c7dad279-88e8-4a40-a281-307f24c5f006 · https://www.triathlete.com/training/how-many-hours-does-it-really-take-to-conquer-ironman/?scope=anon · https://sportsci.org/jour/0101/bmd.htm

## B3. Zones in three sports

The engine stores the same 3-zone model as run_spec (Z1 < VT1/LT1; Z2 between; Z3 > VT2/LT2) and shows sport-specific named zones.

### B3.1 Swim: Critical Swim Speed (CSS)
**Test (T-CSS)**: warm up 400-600 m with 4 × 50 m build. Then 400 m maximal even-paced time trial, 5-10 min easy, then 200 m maximal TT. Pool, push starts.
```
CSS (s per 100 m) = (T400 - T200) / 2          // times in seconds
// example: 400 m in 6:40 (400 s), 200 m in 3:05 (185 s) → CSS = 107.5 s = 1:47.5 /100 m
```
Validity checks [A]: if T200 pace is slower than T400 pace, reject and retest; if (T400/4) - CSS > 8 s, the 200 was over-paced or 400 under-paced, show "low confidence".

| Swim zone | Pace vs CSS (per 100 m) | RPE | Use |
|---|---|---|---|
| S1 Recovery/technique | CSS + 15-20 s | 2-3 | Drills, warm-up, cool-down |
| S2 Endurance | CSS + 8-12 s | 3-4 | Aerobic sets, long swim |
| S3 Steady / long-course race | CSS + 4-7 s | 5 | Ironman race pace ≈ CSS + 5-8 s; 70.3 ≈ CSS + 3-5 s |
| S4 Threshold | CSS - 1 to + 2 s | 6-7 | CSS sets; Olympic race pace ≈ CSS to CSS + 2 s |
| S5 VO2 / sprint-race | CSS - 3 to - 6 s | 8-9 | Short reps, sprint-race starts |
| S6 Speed | max effort 15-25 m | n/a | Neuromuscular |

Wetsuit: race pace is typically 3-8 s/100 m faster than pool CSS for most age-groupers [C]. Open water without a wetsuit and with sighting: about 2-5 s/100 m slower than pool at the same effort [C].
Progress expectations: CSS improves about 0.3-0.5 s/100 m per week early, plateau after 8-12 weeks; after a missed week assume about +1 s/100 m; retest every 6-8 weeks (Swim Smooth) [C].

### B3.2 Bike: FTP and power zones
**FTP tests** (choose by athlete):
- **T-FTP20**: 20 min warm-up with 3 × 1 min high cadence, 5 min all-out, 10 min easy, then 20 min maximal even effort. FTP = 0.95 × 20-min average power [C, Allen & Coggan].
- **T-RAMP**: increase 20-25 W per minute from about 100 W to failure. FTP ≈ 0.75 × best 1-min power. Overestimates FTP in diesel/long-course types, underestimates in punchy types [C]; long-course athletes: confirm with a 2 × 20 min at 95-100% check within 2 weeks.
- **No power meter**: LTHR from the 20-min or 30-min test (Friel: last 20 min of a 30-min solo TT) and HR zones; or RPE only.

| Zone (Coggan) | % FTP | % LTHR (Friel bike) | RPE | Use |
|---|---|---|---|---|
| Z1 Active recovery | < 55% | < 81% | 1-2 | Recovery spins |
| Z2 Endurance | 56-75% | 81-89% | 3-4 | Most riding; Ironman race lies at the top |
| Z3 Tempo | 76-90% | 90-93% | 5-6 | 70.3 race lies here |
| Sweet spot (Z3/4) | 88-94% | 93-96% | 6-7 | Time-efficient threshold work |
| Z4 Threshold | 91-105% | 94-99% | 7 | Olympic and sprint race power |
| Z5 VO2max | 106-120% | 100-102% | 8-9 | 3-8 min reps |
| Z6 Anaerobic | 121-150% | > 102% | 9-10 | 30 s-2 min |

3-zone mapping: Z1 ≈ < 75% FTP; Z2 ≈ 76-100%; Z3 > 100% [A].

### B3.3 Run: from the running engine
VDOT paces (run_spec 1.1). If the athlete has only a triathlon run split, VDOT from the off-the-bike run is raised by about 3% (sprint/Olympic) or 6-10% (70.3/IM) before use [A], or schedule a stand-alone 5 km TT in week 1-2. HR zones as run_spec 1.5 (run LTHR is typically 5-10 bpm higher than bike LTHR [C]).

Sources B3: https://blog.swimsmooth.com/p/understanding-training-zones · https://support.myprocoach.net/hc/en-us/articles/4415959137549 · https://www.trainerroad.com/blog/cycling-power-zones-training-zones-explained/ · https://www.coachray.nz/2021/10/18/joe-friels-bible-for-periodisation/

## B4. Levels and hours

| Level | Definition | Peak hours/week by distance: Sprint / Olympic / 70.3 / IM |
|---|---|---|
| T0 New | Can't swim 400 m continuously front crawl, or can't run 20 min | 3-5 / 4-6 / not advised / not advised |
| T1 Finisher | Completes each sport continuously; first race at this distance | 4-6 / 5-7 / 7-9 / 9-12 |
| T2 Regular | ≥ 1 season, trains 6-9 h | 5-7 / 6-9 / 8-11 / 11-14 |
| T3 Competitive | Age-group top 25%; 9-14 h | 6-9 / 8-11 / 10-14 / 13-17 |
| T4 Advanced | Podium / championship qualifier; 12-20 h | 8-12 / 10-15 / 13-18 / 16-22 (pro 25-35) |

Rules [C/A]:
- If the athlete's available hours are below the level band for the distance, show: "You can finish on these hours, but expect a conservative goal." Minimum hours to start a plan: 70.3 ≥ 6 h/week by Build, Ironman ≥ 8 h/week by Build (Purple Patch "Fast-Track" style plans build Ironman on about 10 h with priority on consistency, sleep and strength [C]).
- Hours split by sport (default, then adjusted for weakness): Sprint/Olympic swim 20-25%, bike 40-45%, run 30-35%; 70.3 swim 15-20%, bike 50%, run 30%; Ironman swim 12-15%, bike 50-55%, run 25-30%; strength 5-10% on top or inside. Weak swimmer (CSS slower than 2:00/100 m): swim +5%, taken from bike. Injury-prone runner: run share capped at 25% and run minutes replaced by bike [A].
- Peak hours are a ceiling; the engine starts at the athlete's current 4-week average (≤ +10% floor rule as in run_spec 2.4).

Sources B4: https://www.triathlete.com/training/how-many-hours-does-it-really-take-to-conquer-ironman/?scope=anon · https://slowtwitch.com/news/a-kona-title-defense-is-not-on-the-mind-of-dan-plews/ · https://www.trizone.com.au/matt-dixon-the-purple-patch-story/

## B5. Phases by distance and weeks to race

Friel's model: Transition (1-6 wk) → Preparation (3-4 wk) → Base (8-12 wk, Base 1-3) → Build (6-8 wk, Build 1-2) → Peak (≈ 2 wk) → Race. The engine compresses this into **Prep → Base → Build → Specific → Taper** [C].

| Distance | Min N (T2+) | Recommended N | Taper | Specific | Build | Base | Prep |
|---|---|---|---|---|---|---|---|
| Sprint | 6 | 10-12 | 5-7 days | 3 | rest × 0.45 | rest × 0.55 | T0 only: 3-4 |
| Olympic | 8 | 12-16 | 7-10 days | 4 | rest × 0.5 | rest × 0.5 | T0-T1: 3 |
| 70.3 | 12 | 16-24 | 10-14 days | 6 | rest × 0.5 | rest × 0.5 | T1: 3-4 |
| Ironman | 20 (with 70.3 done) | 24-32 | 14-21 days (T1-T2 14, T3-T4 14-21) | 8 | rest × 0.55 | rest × 0.45 | 3-4 |

Rules [C/A]:
- Ironman needs a completed 70.3 or Olympic plus a stand-alone half marathon in the past 12 months; otherwise prepend an Olympic/70.3 block (N ≥ 30) or advise a 70.3 first.
- Short N: compress Prep, then Base, then Build. Never the taper or Specific below 3 weeks (70.3) or 6 weeks (Ironman).
- T0: Prep is "learn to swim front crawl 400 m" plus run/walk; no intervals until Base week 3.

Phase intent:
- **Prep**: technique (swim drills, bike handling), easy aerobic in all three, general strength (2×/week).
- **Base**: aerobic volume (Z1 ≥ 80-85%), long ride and long run grow, swim CSS sets introduced, bike sweet spot or tempo once per week (long course) or threshold (short course), heavy strength 2×/week, short transition runs after rides.
- **Build**: threshold and VO2 work per sport (max one per sport per week), long sessions near peak length, bricks weekly, strength to 1-2×/week maintenance.
- **Specific**: race-pace work in all three (short course: VO2 and threshold; long course: race-pace blocks inside long sessions), open-water practice, race rehearsals, fuelling practice, heat if needed.
- **Taper**: B11.

## B6. Weekly templates by days and hours

Codes: **SwE** swim endurance/technique, **SwT** CSS threshold swim, **SwV** VO2/speed swim, **OW** open water, **BkE** endurance ride, **BkQ** bike quality (sweet spot, threshold or VO2 by phase/distance), **BkL** long ride, **RnE** easy run, **RnQ** run quality, **RnL** long run, **T-run** transition run (brick), **Str** strength.

Placement rules [C]:
1. Long ride and long run never on consecutive days for T0-T2 (Ironman T3-T4 may use a "big weekend": long ride Saturday, long run Sunday, every 2-3 weeks in Specific).
2. Max one quality session per sport per week; total hard sessions (Q + long + brick at race pace) ≤ 3 (T0-T1), ≤ 4 (T2-T3), ≤ 5 (T4).
3. Swim quality can sit the day after a run or bike quality (non-impact, different muscles).
4. Run quality ≥ 48 h after the long run and ≥ 24 h after bike quality where possible.
5. Strength on a quality day (after it) or an easy-swim day; never the day before the long ride or long run.
6. Doubles allowed: 5+ days and ≥ 8 h/week. A swim in the morning plus a run or ride later is the standard double.

| Days | Template (L = long day, typically Sat or Sun) |
|---|---|
| 3 (sprint/Olympic only; warn for 70.3/IM) | D1: SwT + RnE (20-30 min, or as a double); D2: BkQ + T-run 10-20 min; D3 (L): BkL or RnL alternating weekly, each with a short swim the other way if possible |
| 4 | D1: SwT + Str; D2: BkQ + T-run; D3: SwE + RnQ (double) ; D4 (L): BkL + T-run (long day) |
| 5 | D1: SwT + Str; D2: BkQ; D3: RnQ + SwE; D4: BkE or OW; D5 (L): BkL + T-run. Long run sits on D2 PM or D4 for 70.3/IM if no 6th day (as RnL instead of RnQ every other week) |
| 6 | D1: SwT + Str; D2: BkQ + RnE; D3: SwE/OW + RnQ; D4: BkE (or rest for T1); D5 (L): BkL + T-run; D6: RnL + optional SwE recovery |
| 7 | 6-day template + D0: recovery swim or 45-60 min Z1 spin (T3-T4), or full rest for T0-T2 (7th day stays optional) |

Sessions per sport per week by hours [C/A]:

| Hours/week | Swim | Bike | Run | Strength |
|---|---|---|---|---|
| < 6 | 2 | 2 | 2-3 | 1 |
| 6-9 | 2-3 | 2-3 | 3 | 1-2 |
| 9-12 | 3 | 3 | 3-4 | 2 |
| 12-16 | 3-4 | 3-4 | 4 | 2 |
| > 16 | 4-5 | 4-5 | 4-6 | 2 |

Intensity distribution caps per week, by time, all sports combined [C, consistent with Muñoz 2014, Selles-Pérez 2019]:

| Phase | Z1 | Z2 | Z3 |
|---|---|---|---|
| Prep/Base | ≥ 82% | 8-15% | ≤ 3% |
| Build, short course | ≥ 78% | 8-12% | 5-10% |
| Build, long course | ≥ 78% | 12-18% | 2-5% |
| Specific, short course | ≥ 75% | 8-12% | 8-12% |
| Specific, long course (pyramidal; race pace is Z2) | ≥ 72% | 15-22% | ≤ 5% |
| Taper | ≥ 70% | as planned | as planned |

Elite structures for reference [C]:
- **Norwegian team (Bu, Blummenfelt, Iden)**: very high easy volume plus a lot of controlled threshold work, often 6-7 interval sessions per week, recoveries of 1-2 min, intensity capped; two days per week with a "double" (longer bike intervals AM, shorter run or swim intervals PM); lactate-guided; heat rooms and 2-4 altitude camps per year. Over time the team shifted toward more pyramidal, more low-intensity volume. Amateur translation: more sub-threshold work in short reps with short rests, no doubles until training twice a day is already normal.
- **Dan Plews (amateur Kona winner, about 21 h/week in 2018, now 10-15 h)**: 5 swims (threshold, strength, endurance, speed, technique; about 20 km), mostly indoor riding, run pattern Mon easy 45 min, Wed long run 90 min building to max 3 h, Thu quality off the bike, Sat short tempo off the bike, Sun longer aerobic run off the bike.
- **Brett Sutton (trisutto)**: high swim frequency, consistent repeatable weeks rather than formal deloads, strength-endurance on the bike (big gear/low cadence), run kept modest and frequent [C].
- **Matt Dixon (Purple Patch)**: few, well-executed key sessions; recovery, sleep, nutrition and strength treated as training; plans built around a busy life [C].
- **Joe Friel**: annual hours set first, weekly hours then follow a percentage of the annual plan by phase; abilities model (endurance, force, speed skills, muscular endurance, anaerobic endurance, power).

Sources B6: https://trainingpeaks.com/coach-blog/norwegian-training-method-world-champion-triathletes · https://www.trainingpeaks.com/blog/the-norwegian-training-method-simplified-how-to-use-it-at-any-level/ · https://slowtwitch.com/news/a-kona-title-defense-is-not-on-the-mind-of-dan-plews/ · https://www.trainingpeaks.com/training-plans/triathlon/ironman/tp-416938/trisutto-full-distance-advanced · https://www.trizone.com.au/matt-dixon-the-purple-patch-story/ · https://www.coachray.nz/2021/10/18/joe-friels-bible-for-periodisation/ · https://abacus.universidadeuropea.com/entities/publication/c7dad279-88e8-4a40-a281-307f24c5f006 · https://pmc.ncbi.nlm.nih.gov/articles/PMC6873141

## B7. Triathlon session library (id · purpose · prescription · ladder · durations)

Durations by level are for the main block; warm-up and cool-down are added (swim WU 300-600 m S1 with drills; bike WU 10-15 min Z1-2 with 3 × 1 min high cadence; run as run_spec).

### Swim (distances per session: T0-T1 1.2-2.0 km, T2 1.8-3.0 km, T3 2.5-4.0 km, T4 3.5-5.5 km)
- **SwE · Endurance and technique.** 40-60% drills and S1-S2 swimming: e.g. 8 × 50 drill/swim, then 6-10 × 200 at S2 (20 s rest), pull buoy set. Ladder: main set +200 m per week.
- **SwT · CSS set.** Main set at S4 with short rests. Ladder (main set): 8 × 100 (15 s) → 10 × 100 (15 s) → 6 × 200 (20 s) → 5 × 300 (20 s) → 4 × 400 (30 s) → "Goldilocks": 4 × 100 + 200 + 4 × 100 + 300 + 4 × 100 + 400 (10-15 s rest). Cap: S4 work ≤ 2000 m (T1-T2) / 3000 m (T3-T4).
- **SwV · VO2/speed.** 12-20 × 50 at S5 (20-30 s rest) or 8-10 × 100 at CSS - 4 s (30 s rest) + 6 × 25 S6. Short course Build and Specific; long course every 2 weeks in Build only.
- **SwL · Long swim** (70.3/IM): continuous or broken 2.0-4.0 km at S2-S3, e.g. 3 × 1000 (30 s) at S3; IM Specific: 3.0-4.0 km including 2 × 1500 at IM swim pace.
- **OW · Open water.** From Build when water temperature allows (≥ 14 °C with a wetsuit for most athletes [C]): 20-60 min with sighting every 6-10 strokes, 4-6 × 2-3 min "race start" surges then settle, drafting practice (behind feet saves more than at the hip), turning buoys, wetsuit removal. Drafting saves about 70 s in an Olympic swim and up to about 3 min over 3.8 km [C, 220 Triathlon]; drafting in the swim also improves efficiency in the subsequent bike [E-]. Pool substitute: sight every 6-10 strokes, no wall push-offs (turn mid-lane), deep-water starts, swim close behind a partner.
- **Swim skills checklist** [C]: bilateral breathing at least in warm-up (to sight and breathe away from chop), sighting with "crocodile eyes", mass-start positioning (weak swimmers start at the side or back), wetsuit practice ≥ 3 times before race day.

### Bike (main block duration ranges by level: T1 / T2 / T3-T4)
- **BkE · Endurance.** Z2 (56-75% FTP; 65-72% is the default target), cadence self-selected. 45-90 / 60-120 / 90-180 min.
- **BkL · Long ride.** Z2; long-course Specific adds race-pace blocks. Ladder: +15-30 min per non-recovery week. Peak length: Sprint 1:15-1:30, Olympic 2:00-2:30, 70.3 3:00-3:30 (4:00 for slower riders whose bike split is > 3:15), Ironman 4:30-5:30 (6:00 for T3-T4 with ≥ 15 h/week; about 160-180 km). Number of peak-length rides: 70.3 3-4, IM 4-6, last one 14 days (70.3) or 21 days (IM) out.
- **BkSS · Sweet spot (long course Base/Build).** 88-94% FTP. Ladder: 3 × 10 min (5 min) → 3 × 15 → 2 × 20 → 3 × 20 → 2 × 30 → 1 × 45 (T3-T4).
- **BkT · Threshold.** 95-105% FTP. Ladder: 4 × 6 (3 min) → 4 × 8 → 3 × 12 (4 min) → 2 × 20 (5 min) → 3 × 15. Short-course priority in Build.
- **BkV · VO2.** 106-120% FTP. Ladder: 5 × 3 min (3 min) → 6 × 3 → 5 × 4 (4 min) → 4 × 5; or 30/15 sets (run_spec I-30/15 style, Rønnestad: 3 × 13 × 30/15). Short course Build/Specific weekly; long course every 2 weeks in Build, then not in Specific.
- **BkF · Force / low cadence.** 4-6 × 5-8 min at Z3 tempo, 50-60 rpm, seated, on a climb or high resistance (Sutton-type strength-endurance) [C]. Base. Stop if knee pain.
- **BkRP · Race-pace blocks.** Inside BkL. 70.3: 2 × 20 → 3 × 20 → 2 × 30 → 3 × 30 → 60-75 min at 70.3 power (B12). Ironman: 2 × 30 → 3 × 30 → 2 × 60 → 3 × 60 → 3:00-3:30 continuous at IM power inside a 4:30-5:30 ride. Olympic: 3 × 10 → 2 × 20 → 30-40 min at Olympic power. Sprint: 3 × 8 → 2 × 12 at sprint power.
- **BkR · Recovery spin.** 30-45 min < 55% FTP, cadence 90+.

### Run (reuse run_spec workouts; triathlon caps)
- **RnE / RnL / RnQ** = run_spec E, L/LP, T-cruise/T-NOR/I-long/RP families.
- Long run peaks [C]: Sprint 60 min, Olympic 75-90 min, 70.3 1:45-2:00 (18-21 km), Ironman 2:15-2:45 (cap 2:45 or 30-32 km, whichever comes first; T1-T2 cap 2:30). Number of peak-length runs: 70.3 3, IM 3-4, last one 14 days (70.3) or 21 days (IM) out. The 10% single-run rule (run_spec 2.5) applies.
- Run quality by distance: Sprint/Olympic → I-long, T-cruise, RP5/RP10; 70.3 → T-cruise, T-NOR, RPH (half-marathon pace about 3-8% slower than stand-alone HM pace off the bike); Ironman → T-NOR (Base/Build), LP and steady blocks at IM run pace (Specific).
- Run frequency beats run length for injury and economy: prefer 3-4 shorter runs over 2 long ones [C].

### Bricks
- **BR-T · Transition run (all distances, all phases).** 10-20 min straight off any ride (Base: E pace; Build/Specific: first 5 min at race pace, then E). Purpose: rehearse the first km, where precision is disrupted (Weich 2022) [E-].
- **BR-L · Long brick (70.3/IM, Build/Specific).** BkL (with or without BkRP) then 20-45 min run (70.3) or 30-60 min (IM) at race pace for the first 15-20 min, then E. Cap run length at 60 min after a 4 h+ ride (recovery cost) [C].
- **BR-M · Multi-brick (sprint/Olympic, Specific).** 3-4 × (8-10 km or 15-20 min bike at race power + 2 km or 8-10 min run at race pace), no rest. Or 4-6 × (5 min bike + 1 km run) for sprint. Also practise transitions (T1/T2 drills: 5 × wetsuit off, helmet on, mount; 5 × dismount, shoes, go).
- **BR-S · Swim-bike (Specific).** OW or pool swim at race pace 15-30 min, then 30-60 min ride with the first 10 min controlled.
- **Race rehearsal (70.3/IM, Specific, once or twice).** 70.3: 2 km swim + 2:30-3:00 ride with 75 min at race power + 45-60 min run, first 30 min at race pace; full race fuelling. IM: "big day" 3 km swim + 5:00 ride with 3:00 at race power + 60 min run; 4-5 weeks out. Next 2 days easy.

### Strength (B9)

Sources B7: https://blog.swimsmooth.com/p/understanding-training-zones · https://www.220triathlon.com/training/swim-training/how-much-time-does-drafting-save-when-swimming/ · https://pubmed.ncbi.nlm.nih.gov/12972885/ · https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.1065741/pdf · https://www.bestbikesplit.com/blog/intensity-factor-if-cycling-pacing-guide · https://slowtwitch.com/news/a-kona-title-defense-is-not-on-the-mind-of-dan-plews/

## B8. Progression, recovery weeks and load (triathlon)

- **Weekly hours**: ≤ +10% per non-recovery week (T0-T1 ≤ +7%) [C]. Track load as TSS (bike from power; run rTSS from pace; swim sTSS from CSS) or session-RPE × minutes when data is missing [A].
- **CTL ramp** (if TSS available) [C]: ≤ 3-5 TSS/day per week for T0-T2, ≤ 5-7 for T3-T4. Above that, hold the next week.
- **Per sport**: run follows run_spec 2.4 and 2.5 exactly (km growth and single-run 10% rule). Bike long ride +15-30 min per step. Swim volume +10% per week.
- **Ladders**: each family (SwT, SwV, BkSS, BkT, BkV, BkRP, run families, bricks) advances one step per appearance in non-recovery weeks, held or stepped back by the run_spec 3.3 rules (completion, pace or power vs target, RPE).
- **Recovery weeks** [C]: 3:1 default; 2:1 for age ≥ 50, T0, or injury history; Ironman T3-T4 may use 3:1 with a "big weekend" in week 3. Recovery week: hours ×0.6-0.7, long sessions ×0.6, one short quality per sport at step -1, strength kept light. Re-tests (CSS, FTP, 5 km) go at the end of a recovery week, one per day, not on the same day. Note: some coaches (Sutton, Norwegian team) avoid formal deload weeks and instead keep a sustainable weekly load with lighter days; the app offers "steady load mode" for T4 only, with a hard cap at 2 consecutive weeks of fatigue flags before a forced lighter week [A].

## B9. Strength for triathletes by phase

Evidence: heavy strength training (and for running, plyometrics) improves economy; heavy strength is recommended for cycling economy (Rønnestad & Mujika 2014) [E].

| Phase | Prescription [C, Rønnestad-type programmes] | Sessions/week |
|---|---|---|
| Prep | Movement and tissue prep: 2-3 × 10-12 at RPE 6-7: goblet squat, step-up, RDL, row, push-up, side plank, calf raises, band external rotation | 2 |
| Base | Heavy: 3 × 4-6 at RPE 8 (progress from 10RM to 6RM to 4-6RM over 6-8 weeks): back or half squat (or leg press), single-leg RDL or deadlift, split squat, pull-up/lat pulldown, calf raises 3 × 8-12 heavy; plyos 2-3 × 5 (run-focused athletes) | 2 |
| Build | 2 × 4-6 on 3 lifts at RPE 7-8 + core | 1-2 |
| Specific | Maintenance: 1 session, 2 × 3-5 on 2-3 lifts at RPE 7 (≈ 20-30 min); keeps the strength gains during the competition period | 1 |
| Taper | None in the last 7-10 days (IM: last session ≥ 10 days out; sprint/Olympic: a light one ≥ 5 days out is fine) | 0-1 |

Swimmers' shoulder: include band pull-aparts, external rotation and scapular work 2 ×/week year-round [C].

Sources B9: https://www.inigomujika.com/en/2013/08/13/optimizing-strength-training-for-running-and-cycling-endurance-performance-a-review-2/3040/ · https://fasttalklabs.com/fast-talk/does-strength-training-hurt-or-help-endurance-sports-performance-with-dr-bent-ronnestad · https://www.frontiersin.org/articles/10.3389/fspor.2022.860685/full

## B10. Testing calendar (triathlon)

| When | Swim | Bike | Run |
|---|---|---|---|
| Week 1-2 | T-CSS | T-FTP20 or T-RAMP | 5 km TT (or run engine P1-P4) |
| End of each Base/Build block (recovery week, every 6-8 weeks) | T-CSS | FTP test | 5 km TT or a 30-min TT (LTHR) |
| Specific | Race-pace check inside SwL/OW | Race power check inside BkRP (HR drift ≤ 5% at race power over 60 min = sustainable) | Off-the-bike pace check in BR-L |

Update rules [A]: CSS, FTP and VDOT each change only from a valid test or from 2 consecutive on-target or failed quality sessions (as run_spec 1.6). FTP auto-raise ≤ 3% per 4 weeks without a test. Power at race pace for IM: if HR drifts > 5% (Pa:HR decoupling) over the last 2 hours of a long ride at target power, lower IM power by 2-3% [C].

## B11. Taper and race week (triathlon)

Volume cut 41-60%, intensity and frequency kept, 1-3 weeks by distance (Bosquet 2007; Mujika) [E/E-]. Progressive (exponential) reduction is preferred over a sudden step [E-].

| Distance | Taper length | Week -2 volume | Week -1 volume (excluding race) | Last long ride | Last long run | Last hard session |
|---|---|---|---|---|---|---|
| Sprint | 5-7 days | normal | 50-60% | 7-10 days | 7-10 days | 3-4 days (short race-pace efforts 2 days out) |
| Olympic | 7-10 days | 80-90% | 45-55% | 10 days | 10 days | 4 days |
| 70.3 | 10-14 days | 65-75% | 40-50% | 14 days | 14 days | 5 days |
| Ironman | 14-21 days | 60-70% (week -3: 75-85% for 3-week tapers) | 35-45% | 14-21 days (race-rehearsal size 4-5 weeks out) | 21 days | 6 days (short race-pace blocks continue to 2 days out) |

Race-week template (race on day 0) [C]:
- Day -6/-5: bike 60-75 min with 3 × 8-10 min at race power; swim 30-40 min with 6 × 100 at race pace.
- Day -4: run 30-40 min with 3 × 3 min at race pace; short swim.
- Day -3: rest or easy swim 20-30 min (travel day).
- Day -2: short brick: 30-40 min bike with 3 × 3 min at race power, 10-15 min run with 3 × 1 min at race pace. Start carbohydrate loading for 70.3/IM.
- Day -1: 15-20 min swim (open water at the venue if allowed) + 15-20 min spin to check the bike + 10 min jog with 3 strides; bike check-in; feet up.

## B12. Race-day pacing

### B12.1 Bike: intensity factor (IF = normalised power / FTP)

| Distance | IF range | By athlete | TSS guide |
|---|---|---|---|
| Sprint | 0.88-0.95 (strong cyclists up to 1.00 on short courses) | T1-T2 0.85-0.90 | n/a |
| Olympic | 0.80-0.88 | T1-T2 0.78-0.83; T4 0.85-0.90 | n/a |
| 70.3 | 0.75-0.85 | bike split > 3:00 → 0.70-0.77; 2:30-3:00 → 0.75-0.80; < 2:30 → 0.80-0.85 | ≤ 170-200 for a good run [C] |
| Ironman | 0.65-0.78 | bike > 6:00 → 0.62-0.68; 5:00-6:00 → 0.67-0.73; < 5:00 → 0.72-0.78; Kona pro winners ≈ 0.80 | ≤ 270-300 (Couzens example: 6 h goal, TSS 269-286, IF 0.67-0.69) |

Rules [C]: keep the first 20-30 min at the bottom of the range; even pacing, first half NP ≤ 103% of second half (Friel); climbs at ≤ 120% of target power (IM) or ≤ 110% of FTP (70.3); coast steep descents; target VI ≤ 1.05 on flat courses. No power meter: Ironman bike HR in bike Z2 (≤ 89% bike LTHR), RPE 4-5 ("feels too easy for the first 2 hours"); 70.3 bike low Z3 (RPE 5-6); Olympic Z4 (RPE 7).
"Going higher almost always costs more on the run than it gains on the bike" (Best Bike Split) [C].

### B12.2 Swim
Start: first 100-200 m at S4-S5 to find feet (short course), then settle. Long course: S3 from the start for T1-T2 (calm start at side or back), S4 for 200 m then S3 for T3-T4. Sight every 6-10 strokes; draft on feet where possible.

### B12.3 Run off the bike [C, A for offsets from the run engine]
| Distance | Run target | First km rule |
|---|---|---|
| Sprint | 5k pace + 0-3% (T1-T2 +3-6%) | First 500 m by RPE, not pace (it will feel fast) |
| Olympic | 10k pace + 2-5% | First km at target + 5 s, then target |
| 70.3 | HM pace + 4-8% (T1-T2 +8-12%); RPE 6 to halfway, then build | First 2 km at target + 10 s |
| Ironman | Marathon pace (run engine MP with volume factor) + 5-10% (T3-T4) or + 10-20% (T1-T2), walk aid stations if planned; HR cap first 10 km at run Z2 upper | First 3 km at target + 10-15 s; RPE ≤ 5 to 21 km |

Run/walk for T0-T1 long course: 9 min run / 1 min walk or walk every aid station from km 1 (planned walking beats unplanned walking) [C].

Sources B12: https://www.trainingpeaks.com/blog/how-to-cheat-by-using-a-power-meter-in-an-ironman/ · https://www.bestbikesplit.com/blog/intensity-factor-if-cycling-pacing-guide · https://www.bestbikesplit.com/blog/pacing-70-3-bike-leg-intensity-factor-tss · https://www.tri247.com/triathlon-training/triathlon-pacing · https://www.trainerroad.com/forum/t/ironman-and-half-ironman-percentage-of-ftp-on-the-bike/48893

## B13. Fuelling and hydration

Principles [E: Jeukendrup; Burke; ACSM]: glucose alone oxidises at about 60 g/h; glucose plus fructose about 50% more; practical ceiling 90 g/h for most, more only if the gut has been trained. The gut can be trained by practising race intake in long sessions for 4-6 weeks.

| Distance | Carbohydrate during | Fluid | Sodium | Pre-race |
|---|---|---|---|---|
| Sprint | none needed; optional mouth rinse or 20-30 g on the bike | 250-500 ml (heat) | n/a | 1-2 g/kg 2-3 h before; caffeine 3 mg/kg if practised |
| Olympic | 30-60 g/h, mostly on the bike (1-2 gels or 500-750 ml drink) | 400-750 ml/h by heat and sweat rate | 300-500 mg/h in heat | 1-3 g/kg 2-3 h before |
| 70.3 | 60-90 g/h (bike 70-90, run 50-70), glucose:fructose about 2:1 | 400-800 ml/h | 300-800 mg/h (heavy/salty sweaters up to about 1000) | Carb-load 7-10 g/kg/day for 24-36 h; breakfast 2-3 g/kg 3 h before |
| Ironman | 70-100 g/h (bike 80-100, run 50-80); T4 with trained gut up to 110-120 g/h using about 1:0.8-1:1 glucose:fructose | 500-900 ml/h; drink to thirst on the run within a plan | 500-1000 mg/h | Carb-load 8-12 g/kg/day for 36-48 h; breakfast 2-3 g/kg 3-4 h before |

Engine rules [A]:
- From Build, every BkL > 90 min and every BR-L carries a fuelling target that steps from 40 g/h toward race target by +10 g/h every 2 weeks; the athlete logs "gut OK / GI upset".
- Sweat-rate test (Specific): weigh nude before and after a 60-min session at race intensity in race-like heat; sweat rate (L/h) = (mass loss kg + fluid drunk L) / h. Plan fluid at 60-80% of sweat rate; aim to lose no more than about 2-3% body mass over the race; never gain weight (hyponatraemia risk) [E-].
- Hold the 90 g/h default unless the athlete has logged ≥ 4 sessions at ≥ 90 g/h with no GI flags.

Sources B13: https://www.mysportscience.com/amp/the-optimal-ratio-of-carbohydrates · https://sportsci.org/jour/0101/bmd.htm · https://www.220triathlon.com/training/nutrition-training/how-much-carb-fluid-and-sodium-do-i-need-per-hour-for-an-ironman/ · https://prommer.net/en/training/nutrition/120g-carb-arms-race/

## B14. Heat (triathlon and HYROX in hot venues)

Trigger: forecast race temperature ≥ 25 °C (or humid ≥ 22 °C), or athlete from a cool climate racing somewhere hot [A].
- **Induction**: 7-14 days of ≥ 60-90 min daily exercise in heat (or two 45-60 min sessions), easy to moderate intensity; most gains in 10-14 days; fitter athletes adapt faster (Sawka/Périard, GSSI) [E]. Practical options [C]: indoor bike in a warm room with no fan and extra layers (RPE-capped, HR ≤ Z2 top), 30-40 min hot bath (40 °C) or sauna straight after an easy session (post-exercise passive heat, 5-6 days a week) [E-].
- **Timing**: finish induction 1-2 weeks before the race and keep 2-3 heat sessions per week until the race (adaptations fade about 75% within 3 weeks without exposure) [E].
- **Safety**: stop at dizziness, confusion, chills, nausea or core temperature > 39.5 °C if measured; extra sodium early in the block.
- **Race adjustments**: run targets use run_spec 1.4 heat corrections; bike IF minus 0.02-0.03 above 28 °C; fluid and sodium at the top of B13 ranges; ice and cooling at aid stations. The Norwegian team used core-temperature data to ride slightly easier and keep heat for the run [C].

Sources B14: https://gssiweb.org/sports-science-exchange/article/sse-153-heat-acclimatization-to-improve-athletic-performance-in-warm-hot-environments · https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2018.01851/pdf · https://trainingpeaks.com/coach-blog/norwegian-training-method-world-champion-triathletes

## B15. Open-water progression (all distances)

Skill gates the engine tracks as checkboxes [C/A]: (1) 400 m continuous front crawl in pool; (2) bilateral breathing over 100 m; (3) sight every 6-10 strokes without breaking rhythm over 400 m; (4) deep-water start; (5) wetsuit swim ≥ 3 times; (6) open-water swim of ≥ race distance (sprint/Olympic) or ≥ 75% race distance (70.3/IM) at least 2 weeks before the race; (7) group swim (contact, drafting) at least once. Gates 1-3 come before Build; 4-7 during Specific. If gate 6 or 7 is not met at week -3, show a pre-race safety message (start at the back/side, rest on your back or hold a kayak if needed, which is allowed under most rules).

## B16. Adaptation: missed sessions, fatigue, injury (triathlon)

Use run_spec 4.3-4.6 with these triathlon rows first (first match wins):

| # | Condition | Action |
|---|---|---|
| Y1 | Run injury (W1/W3 pain rules) | Run minutes replaced by bike or deep-water running at the same zone (1 min run ≈ 1.0-1.2 min bike for time-in-zone [A]); swim kept (pull buoy if kicking hurts, e.g. Achilles). Return via run_spec 4.6 |
| Y2 | Shoulder pain while swimming | Swim volume ×0.5, pull buoy and paddles removed, more kick and drills; pain > 3/10 → stop swimming, see a physio; bike and run kept |
| Y3 | Knee pain on the bike | Remove BkF (low cadence) and big-gear work; cadence ≥ 85 rpm; check bike fit before adding volume |
| Y4 | Missed long ride | Move to the next day if ≥ 48 h before the next quality and not the day before the long run; else drop and repeat the same length next week (no progression) |
| Y5 | Missed key session in one sport | Move once within the week if placement rules hold; never stack two quality sessions in the same sport within 48 h; otherwise drop |
| Y6 | Missed swim (any) | Drop it; never add swim volume to later sessions above +25% |
| Y7 | Weekly hours < 70% of plan for 2 weeks (no illness) | Re-plan from the 4-week actual average; keep long sessions at their last completed length |
| Y8 | Accumulating fatigue (run_spec W5 criteria applied to all sports, plus bike Pa:HR decoupling > 8% on an endurance ride that is usually < 5%) | Bring the recovery week forward; in taper drop one quality |
| Y9 | Illness | run_spec 4.5; swimming returns last if symptoms were respiratory and the pool is cold/chlorinated; return order easy bike → easy run → swim |
| Y10 | Race in < 4 weeks and long sessions short (< 80% of peak length) | Do not cram; one "big day" at 85-90% length ≥ 21 days out (IM) / 14 days (70.3); lower the goal and the race IF band by 0.02 |

---

# PART C: Mapping to the current code (`public/onboard.js`)

### C1. `hyroxPlan` (lines 1325-1347): what it does and gaps
- Phases: Base (first 40%), Build, and a 1-week Taper; no Specific phase, so race-weight stations and simulations are not concentrated near the race (A5).
- Volume factor `f = min(1.5, 1 + 0.04w)` grows linearly regardless of level and current volume; run km starts from `easy0` by level, not from the user's 4-week average (run_spec 2.4 rule should apply).
- `hysim` rounds increase from 3 to 8 by week 10 and then every simulation week is a full 8-round sim, which is too many full sims (A7: 1-3 per build, last ≥ 14 days out).
- Intervals are "1 km at goal race pace" with no defined pace; replace with HRP from VDOT (A4) and the T/V ladders.
- 3-day template (S, E, Q) has no long run and no compromised running; 6-day has two strength days but no V or HA.
- `division` only changes the name; weights, Pro strength share, Doubles running emphasis and Relay intensity are missing (A13).
- No benchmarks, no station targets, no goal-time model, no taper/race-week template.

### C2. `triPlan` and `TRI` (lines 1349-1379)
- No swim, bike or run intensity anchors (CSS, FTP, VDOT); sessions carry minutes only. Add B3 zones and B7 session families.
- `TRI.*.weeks` defaults (10/12/16/24) are reasonable minimums; recommended N in B5 is longer for 70.3 (16-24) and IM (24-32). Taper: sprint/Olympic 1 week fine; IM should be 2-3 weeks for T3-T4.
- 3-day and 4-day roles have no run quality; 5-day has bike, run and swim quality in the same week from Build, which can exceed the hard-session cap for T1 (B6 rule 2).
- Brick run is fixed at 10-15 min; long-course BR-L needs 20-60 min run segments and race-rehearsal days.
- `longBike` 300 min and `longRun` 150 min for IM are within B7 caps, but long-run growth is not checked against the 10% single-run rule.
- No hours input, no sport split by weakness, no fuelling targets, no open-water gates, no heat block.

### C3. Proposed shape [A]
`AJMulti` module mirroring `AJCoach`: `{sport: "hyrox"|"tri", division|distance, level, anchors: {vdot, css, ftp, lthrBike, lthrRun, stations:{...}}, phases, weeks:[{sessions:[{sport, family, step, mins, target:{pace|power|split|rpe}, fuel}]}], tests, decisions}`. Reuse run_spec's weekly decision table and ladder engine; add rows X1-X8 and Y1-Y10.

---

## Consolidated source list

HYROX
- https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1519240/pdf (Brandt et al. 2025)
- https://athene-forschung.unibw.de/download/152283/152283.pdf
- https://www.fasttalklabs.com/training/performance-determinants-of-hyrox-competition/
- https://vo2master.com/blog/case-study/first-in-field-metabolic-analysis-of-a-hyrox-champion/
- https://roxlyfe.com/5-interesting-data-results-to-improve-your-hyrox-performance/
- https://roxlyfe.com/2025-26-rulebooks/
- https://roxlyfe.com/your-guide-to-compromised-running/
- https://www.redbull.com/int-en/hyrox-exercise-stations-guide
- https://www.redbull.com/us-en/hyrox-weights-overview
- https://us.puma.com/us/en/articles/hyrox-weights-repetitions-distance-division
- https://www.hyresult.com/hyrox/wall-balls
- https://boxlifemagazine.com/700000-hyrox-results-analysed-here-is-exactly-where-your-finish-time-actually-ranks/
- https://boxlifemagazine.com/hyrox-performance-data-driven-training-breakthroughs/
- https://hyranking.com/learn/explainers/what-is-a-good-hyrox-time
- https://builtforathletes.com/blogs/news/data-driven-insights-into-fitness-racing
- https://rox-coach.com/seasons/7/races/2024-london/results/sallis-matt
- https://the5krunner.com/2026/06/16/hyrox-elite-training-schedules/
- https://hyroxhub.substack.com/p/how-to-structure-your-hyrox-training
- https://intercom.help/the-lousa-way/en/articles/11469131-individual-season-plan
- https://roxfit.app/blog/how-to-train-for-hyrox
- https://www.puregym.com/blog/hyrox-training-plan/
- https://centr.com/blog/show/e97c65f7-fbbe-4641-9bd8-d96f3c78ddae/pacing-strategy-to-crush-your-hyrox-phoenix-race
- https://fitnessvolt.com/roxrace/strength-standards/
- https://athletica.ai/blog/hyrox-nutrition-guide

Triathlon
- https://abacus.universidadeuropea.com/entities/publication/c7dad279-88e8-4a40-a281-307f24c5f006 (Muñoz et al. 2014)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6873141 (Selles-Pérez et al. 2019)
- https://sportsci.org/jour/0101/bmd.htm (Downey & Hopkins 2001)
- https://www.mysportscience.com/amp/the-optimal-ratio-of-carbohydrates (Jeukendrup)
- https://blog.swimsmooth.com/p/understanding-training-zones
- https://support.myprocoach.net/hc/en-us/articles/4415959137549
- https://www.trainerroad.com/blog/cycling-power-zones-training-zones-explained/
- https://www.trainingpeaks.com/blog/how-to-cheat-by-using-a-power-meter-in-an-ironman/
- https://www.bestbikesplit.com/blog/intensity-factor-if-cycling-pacing-guide
- https://www.bestbikesplit.com/blog/pacing-70-3-bike-leg-intensity-factor-tss
- https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2022.1065741/pdf (Weich et al. 2022)
- https://www.220triathlon.com/training/swim-training/how-much-time-does-drafting-save-when-swimming/
- https://pubmed.ncbi.nlm.nih.gov/12972885/ (swim drafting and subsequent cycling)
- https://trainingpeaks.com/coach-blog/norwegian-training-method-world-champion-triathletes
- https://www.trainingpeaks.com/blog/the-norwegian-training-method-simplified-how-to-use-it-at-any-level/
- https://slowtwitch.com/news/a-kona-title-defense-is-not-on-the-mind-of-dan-plews/
- https://www.trainingpeaks.com/training-plans/triathlon/ironman/tp-416938/trisutto-full-distance-advanced
- https://www.trizone.com.au/matt-dixon-the-purple-patch-story/
- https://www.coachray.nz/2021/10/18/joe-friels-bible-for-periodisation/
- https://www.triathlete.com/training/how-many-hours-does-it-really-take-to-conquer-ironman/?scope=anon
- https://www.inigomujika.com/en/2013/08/13/optimizing-strength-training-for-running-and-cycling-endurance-performance-a-review-2/3040/ (Rønnestad & Mujika)
- https://fasttalklabs.com/fast-talk/does-strength-training-hurt-or-help-endurance-sports-performance-with-dr-bent-ronnestad
- https://www.inigomujika.com/2011/08/18/tapering-for-triathlon-competition-4/1695/ (Mujika, tapering for triathlon)
- https://gssiweb.org/sports-science-exchange/article/sse-153-heat-acclimatization-to-improve-athletic-performance-in-warm-hot-environments
- https://www.220triathlon.com/training/nutrition-training/how-much-carb-fluid-and-sodium-do-i-need-per-hour-for-an-ironman/
- https://www.tri247.com/triathlon-training/triathlon-pacing
- Shared with run_spec section 9: Bosquet 2007 (taper meta), Seiler 2010, Llanos-Lagos 2024, Frandsen 2025, Egan & Sharples 2023.
