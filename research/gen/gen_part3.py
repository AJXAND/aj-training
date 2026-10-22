from gen_part1 import *
from gen_part2 import P

# 6. Bro split with A/B weeks --------------------------------------------------------
bro_sessions = [
    S("chest-a", "Chest (Week A: Heavy)", ["chest"], [
        E("Incline barbell press", 3, "6-8", "3 min", TECH, None, "Touch just below the collarbone with shoulder blades pinned."),
        E("Flat dumbbell press", 3, "8-10", "2-3 min", LASTFAIL, None, "Deep stretch at the bottom, press up and slightly in."),
        E("Weighted dip", 2, "8-12", "2 min", FAIL, None, "Lean forward, controlled depth."),
        E("Pec deck", 3, "10-12", "90 sec", FAIL, DROP, "Handles at lower-chest height, open wide under control."),
        E("Cable crunch", 3, "10-15", "60 sec", HARD, None, "Ribs to hips."),
    ], 55),
    S("back-a", "Back (Week A: Heavy)", ["lats", "upper back", "traps"], [
        E("Weighted pull-up", 3, "6-10", "3 min", TECH, None, "Dead hang, chest to the bar."),
        E("Barbell row", 3, "6-10", "3 min", TECH, None, "45 degree torso, row to the belly button, back flat."),
        E("Single-arm dumbbell row", 2, "8-12 per arm", "90 sec", FAIL, None, "Row to your hip, let the shoulder reach at the bottom."),
        E("Straight-arm cable pulldown", 2, "12-15", "60 sec", FAIL, None, "Arms long, sweep to the thighs."),
        E("Dumbbell shrug", 3, "8-12", "60 sec", FAIL, None, "Straight up, hold for a second."),
    ], 60),
    S("legs-a", "Legs (Week A: Heavy)", ["quads", "hamstrings", "glutes", "calves"], [
        E("High-bar back squat", 3, "6-8", "3-4 min", TECH, None, "Brace, sit between your heels, full depth."),
        E("Romanian deadlift", 3, "6-8", "3 min", TECH, None, "Hips back, flat back, deep hamstring stretch."),
        E("Leg press", 2, "10-12", "2 min", FAIL, None, "Deep and controlled."),
        E("Seated leg curl", 3, "8-12", "90 sec", FAIL, LP, "Lean forward over the pad."),
        E("Standing calf raise", 4, "8-12", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
    ], 70),
    S("delts-a", "Shoulders (Week A: Heavy)", ["front delts", "side delts", "rear delts"], [
        E("Seated dumbbell shoulder press", 3, "6-10", "2-3 min", TECH, None, "Lower to ear height, press up and slightly in."),
        E("Dumbbell lateral raise", 4, "10-15", "60 sec", FAIL, DROP, "Slight forward lean, lead with the elbows."),
        E("Reverse pec deck", 3, "12-15", "60 sec", FAIL, None, "Push wide, shoulders down."),
        E("Wide-grip cable upright row", 2, "10-12", "60 sec", FAIL, None, "Elbows to chest height only."),
        E("Hanging leg raise", 3, "10-15", "60 sec", HARD, None, "Curl the pelvis up."),
    ], 50),
    S("arms-a", "Arms (Week A: Heavy)", ["biceps", "triceps", "forearms"], [
        E("EZ-bar curl", 3, "6-10", "60 sec, then press", FAIL, None, "No swinging.", "A1"),
        E("Close-grip bench press", 3, "6-10", "90 sec, then curl", TECH, None, "Elbows tucked, touch the lower chest.", "A2"),
        E("Incline dumbbell curl", 3, "8-12", "60 sec", FAIL, LP, "Arms hang behind the torso.", "B1"),
        E("EZ-bar skull crusher", 3, "8-12", "60 sec", FAIL, None, "Lower behind the head.", "B2"),
        E("Dumbbell hammer curl", 2, "10-12", "60 sec", FAIL, None, "Thumbs up, curl across the body.", "C1"),
        E("Overhead cable triceps extension", 2, "10-12", "60 sec", FAIL, None, "Elbows by your ears.", "C2"),
    ], 55),
    S("chest-b", "Chest (Week B: Pump)", ["chest"], [
        E("Incline Smith machine press", 3, "10-12", "2 min", FAIL, RP, "Bench at 30 degrees, bar to the upper chest."),
        E("Machine chest press", 3, "10-12", "2 min", FAIL, DROP, "Deep stretch at the start of every rep."),
        E("Low-to-high cable fly", 3, "12-15", "60 sec", FAIL, LP, "Sweep up to eye level."),
        E("Deficit push-up", 2, "to failure", "90 sec", FAIL, None, "Hands on plates or handles so the chest drops below hand level."),
        E("Cable crunch", 3, "12-15", "60 sec", HARD, None, "Ribs to hips."),
    ], 50),
    S("back-b", "Back (Week B: Pump)", ["lats", "upper back", "lower back"], [
        E("Wide-grip lat pulldown", 3, "10-12", "2 min", FAIL, DROP, "Full stretch at the top."),
        E("Chest-supported T-bar row", 3, "10-12", "2 min", FAIL, RP, "Chest glued to the pad."),
        E("Half-kneeling single-arm cable pulldown", 2, "12-15", "60 sec", FAIL, LP, "Reach high, elbow to hip."),
        E("Wide-grip seated cable row", 3, "12-15", "90 sec", FAIL, None, "Elbows out, pull to the lower chest."),
        E("45 degree back extension", 2, "12-15", "60 sec", FAIL, None, "Hinge from the hips."),
    ], 55),
    S("legs-b", "Legs (Week B: Pump)", ["quads", "hamstrings", "glutes", "calves"], [
        E("Hack squat", 3, "10-12", "2-3 min", FAIL,
          "Last set: mechanical drop. At failure, step off and immediately do heel-elevated bodyweight squats to failure",
          "Feet low, deep, 2-second descent."),
        E("Lying leg curl", 3, "12-15", "90 sec", FAIL, DROP, "Hips down."),
        E("Bulgarian split squat", 2, "10-12 per leg", "2 min", HARD, None, "Long stride, deep."),
        E("Leg extension", 3, "15-20", "60 sec", FAIL, LP, "Pause at the top."),
        E("Seated calf raise", 4, "12-15", "60 sec", FAIL, MYO, "Full stretch at the bottom."),
    ], 65),
    S("delts-b", "Shoulders (Week B: Pump)", ["side delts", "rear delts", "front delts"], [
        E("Machine shoulder press", 3, "10-12", "2 min", FAIL, RP, "Lower until hands are just below the chin."),
        E("Single-arm cable lateral raise", 4, "12-15", "60 sec", FAIL, MYO, "Cable behind you."),
        E("Lean-away dumbbell lateral raise", 2, "12-15", "60 sec", FAIL, LP, "Hold a post and lean away so the start of the rep is loaded."),
        E("Face pull", 3, "15-20", "60 sec", FAIL, None, "Finish with hands beside your ears."),
        E("Rear delt cable fly", 2, "15-20", "45 sec", FAIL, None, "Cables crossed at shoulder height, pull wide."),
    ], 50),
    S("arms-b", "Arms (Week B: Pump)", ["biceps", "triceps"], [
        E("Bayesian cable curl", 3, "10-12", "60 sec", FAIL, LP, "Arm behind the body, elbow stays back."),
        E("Overhead cable triceps extension", 3, "10-12", "60 sec", FAIL, LP, "Deep stretch behind the head."),
        E("Machine preacher curl", 3, "12-15", "60 sec", FAIL, DROP, "Full stretch at the bottom.", "A1"),
        E("Triceps pushdown (rope)", 3, "12-15", "60 sec", FAIL, DROP, "Elbows pinned.", "A2"),
        E("Cable rope hammer curl", 2, "15-20", "45 sec", FAIL, MYO, "Thumbs up."),
        E("Single-arm cross-body cable extension", 2, "15-20", "45 sec", FAIL, None, "Cable at head height, extend out and down."),
    ], 50),
]
order_a = ["chest-a", "back-a", "legs-a", "delts-a", "arms-a"]
order_b = ["chest-b", "back-b", "legs-b", "delts-b", "arms-b"]
P.append({
    "id": "iron-week-bro-split",
    "name": "Iron Week",
    "hook": "A repeatable two-week body-part split: one heavy week, one pump week, a new version of every day each fortnight.",
    "description": ("For intermediate lifters who love the focus of training one muscle group per day and want every session to feel big. "
                    "Week A is heavy, built on barbell and dumbbell compounds in the 6 to 10 rep range. Week B swaps to machines and cables with higher reps and "
                    "more intensity techniques. Alternating them keeps joints happy, gives you new numbers to chase every week, and stops the split going stale."),
    "level": "intermediate", "setting": "gym", "days_per_week": 5, "length_weeks": 8,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "smith", "pull-up bar", "dip bars"],
    "machines_used": ["chest press", "pec deck", "shoulder press", "hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension",
                       "reverse pec deck", "preacher curl", "standing calf", "seated calf"],
    "effort_style": ("Week A: heavy compounds stop at the last perfect rep; everything else goes to failure. Week B: every working set goes to failure, "
                     "with a technique on the final set of most exercises."),
    "schedule": ["Chest", "Back", "Legs", "Shoulders", "Arms", "Rest", "Rest"],
    "rotation": {"type": "ab_weeks", "summary": "Week A (heavy) and Week B (pump) alternate. Ten distinct sessions across the fortnight."},
    "sessions": bro_sessions,
    "weeks": ab_weeks(8, order_a, order_b),
    "progression": ("Compare each session with the last time you ran that same version, two weeks earlier. " + PROGRESSION_DOUBLE),
    "deload": DELOAD_STANDARD,
    "why": ("When weekly sets are matched, training a muscle once or twice a week grows it similarly (Pelland et al. 2024), so a body-part split works as long as each day carries enough quality sets. "
            "Each session keeps a muscle to roughly 10 to 12 hard sets, the point where more work in one sitting mostly adds fatigue. "
            "Alternating heavy and pump weeks trains each muscle across the full rep spectrum and gives tendons a lighter week every other week."),
})

# 7. Powerbuilding -------------------------------------------------------------------
TOP = "Top set: heavy, finish with 1 rep left. Back-off sets at 85 to 90% of the top set weight, stop with 1 to 2 reps left"
TOPREPS = "Top set 5 (weeks 1-3), 3 (weeks 4-6), 1-2 (week 7); back-off sets of 5"
P.append({
    "id": "heavy-hybrid-powerbuilding",
    "name": "Heavy Hybrid",
    "hook": "Squat, bench and deadlift like a powerlifter, then finish each day like a bodybuilder. Four days, plus an optional pump day.",
    "description": ("For intermediate lifters who want their squat, bench and deadlift to climb while still building a physique. "
                    "Each main day opens with one heavy top set followed by back-off sets, then switches to hypertrophy work for the muscles that drive that lift. "
                    "The top sets get heavier and lower in reps over seven weeks, so you finish the block stronger than you started. A fifth day for arms, delts and "
                    "weak points is there when you have the time and energy."),
    "level": "intermediate", "setting": "gym", "days_per_week": 4, "length_weeks": 8,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "pull-up bar"],
    "machines_used": ["hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension", "pec deck", "reverse pec deck", "standing calf", "seated calf"],
    "effort_style": ("Main lifts: one heavy top set with a rep left in the tank, then back-off sets that stay crisp. Never miss a rep on a main lift. "
                     "Accessory work: hard sets, with the last set of machine and cable work taken to failure."),
    "schedule": ["Squat Day", "Bench Day", "Rest", "Deadlift Day", "Press Day", "Pump Day (optional)", "Rest"],
    "rotation": {"type": "fixed", "summary": "Same sessions every week; top-set reps drop from 5 to 3 to a heavy single as loads rise."},
    "sessions": [
        S("squat-day", "Squat Day", ["quads", "glutes", "hamstrings"], [
            E("Back squat", 4, TOPREPS, "4 min", TOP, None, "Same depth every rep. Ask someone to watch or film your top set."),
            E("Romanian deadlift", 3, "8-10", "3 min", TECH, None, "Hips back, flat back."),
            E("Leg press", 3, "10-12", "2 min", LASTFAIL, None, "Deep and controlled."),
            E("Seated leg curl", 3, "10-12", "90 sec", FAIL, LP, "Lean forward over the pad."),
            E("Standing calf raise", 3, "10-12", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
        ], 75),
        S("bench-day", "Bench Day", ["chest", "back", "triceps", "delts"], [
            E("Barbell bench press (paused)", 4, TOPREPS, "3-4 min", TOP, None, "Pause for one second on the chest every rep, as in competition."),
            E("Weighted pull-up", 3, "6-8", "3 min", TECH, None, "Dead hang, chest to the bar."),
            E("Incline dumbbell press", 3, "8-12", "2 min", LASTFAIL, None, "Full stretch at the bottom."),
            E("Chest-supported machine row", 3, "8-12", "2 min", FAIL, None, "Drive elbows back, stretch forward."),
            E("Single-arm cable lateral raise", 3, "12-15", "60 sec", FAIL, MYO, "Lead with the elbow."),
            E("Overhead cable triceps extension", 2, "10-12", "60 sec", FAIL, LP, "Elbows by your ears."),
        ], 75),
        S("deadlift-day", "Deadlift Day", ["posterior chain", "quads", "abs"], [
            E("Deadlift (conventional or sumo)", 3, TOPREPS.replace("back-off sets of 5", "two back-off sets of 4"), "4 min", TOP, None,
              "Wedge into the bar, push the floor away, lock out with the glutes. Reset between reps."),
            E("Hack squat", 3, "8-12", "2-3 min", LASTFAIL, None, "Deep, controlled."),
            E("Lying leg curl", 3, "8-12", "90 sec", FAIL, DROP, "Hips down, slow lowering."),
            E("Dumbbell walking lunge", 2, "10 per leg", "2 min", HARD, None, "Long stride."),
            E("Hanging leg raise", 3, "10-15", "60 sec", HARD, None, "Curl the pelvis up."),
        ], 70),
        S("press-day", "Press Day", ["shoulders", "chest", "upper back", "arms"], [
            E("Standing barbell overhead press", 4, "5-8", "3 min", TECH, None, "Squeeze glutes, press straight up, head through at the top."),
            E("Close-grip bench press", 3, "6-8", "3 min", TECH, None, "Elbows tucked, touch the lower chest."),
            E("Barbell row", 3, "8-10", "2 min", TECH, None, "Torso at 45 degrees."),
            E("Wide-grip lat pulldown", 3, "10-12", "90 sec", FAIL, DROP, "Full stretch at the top."),
            E("Dumbbell lateral raise", 3, "15-20", "60 sec", FAIL, None, "Lead with the elbows."),
            E("Reverse pec deck", 2, "15-20", "60 sec", FAIL, None, "Push wide."),
            E("EZ-bar curl", 3, "8-12", "60 sec", FAIL, None, "No swinging."),
        ], 75),
        S("pump-day", "Pump Day (optional)", ["chest", "side delts", "arms", "quads", "calves"], [
            E("Pec deck", 3, "12-15", "60 sec", FAIL, STATIC, "Open wide under control."),
            E("Single-arm cable lateral raise", 3, "15-20", "45 sec", FAIL, MYO, "Lead with the elbow."),
            E("Incline dumbbell curl", 3, "10-12", "60 sec", FAIL, LP, "Arms behind the torso.", "A1"),
            E("Triceps pushdown (rope)", 3, "12-15", "60 sec", FAIL, DROP, "Elbows pinned.", "A2"),
            E("Leg extension", 3, "15-20", "60 sec", FAIL, LP, "Pause at the top."),
            E("Seated calf raise", 3, "12-15", "45 sec", FAIL, None, "Full stretch at the bottom."),
        ], 45, "Skip this day if your top sets felt slow that week. It is a bonus, not the engine."),
    ],
    "weeks": [
        {"week": 1, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day", "pump-day"], "focus": "Top sets of 5 at a weight you could do 7 times. Back-off sets of 5. Learn the rhythm."},
        {"week": 2, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day", "pump-day"], "focus": "Top sets of 5, add 2.5 to 5 kg. Accessory sets to failure where written."},
        {"week": 3, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day", "pump-day"], "focus": "Top sets of 5, add again if week 2 had a rep left. Intensity techniques on."},
        {"week": 4, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day", "pump-day"], "focus": "Top sets drop to 3, about 5% heavier than your week 3 top set."},
        {"week": 5, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day", "pump-day"], "focus": "Top sets of 3, add 2.5 to 5 kg."},
        {"week": 6, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day", "pump-day"], "focus": "Top sets of 3, add again if week 5 had a rep left. Drop the pump day if you feel beaten up."},
        {"week": 7, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day"], "focus": "Peak. Work up to a heavy single you could have done twice, then two back-off sets of 3 at 85%. Accessories cut to 2 sets."},
        {"week": 8, "sessions": ["squat-day", "bench-day", "deadlift-day", "press-day"], "focus": "Deload, or test a new 1-rep max on one lift per day. Accessories at half volume."},
    ],
    "progression": ("Main lifts: add 2.5 kg (5 kg on squat and deadlift) to the top set each week if last week's top set had at least one clean rep left. "
                    "If it was a grind, repeat the weight. Back-off sets always follow the top set. Accessories: double progression within the rep range."),
    "deload": ("Week 8 is either a deload (half the sets, 70% of top set weights) or a test week. Start the next block with top sets about 5% heavier than week 1 of this one."),
    "why": ("Strength is specific to the lift, so the competition lifts are practised heavy every week, but even modest volume at 70 to 85% of max drives large strength gains in trained lifters (Androulakis-Korakakis et al. 2020). "
            "One top set plus back-offs gives heavy practice without the fatigue of many maximal sets, leaving room for hypertrophy work. "
            "Bigger muscles have more potential to produce force, so the bodybuilding work is part of the strength plan rather than a distraction."),
})

# 8. HIT ----------------------------------------------------------------------------------
W2 = "1 working set after 2 ramp-up sets"
P.append({
    "id": "one-hard-set-hit",
    "name": "One Hard Set",
    "hook": "Four short sessions, one all-out working set per exercise. Low volume, maximum effort, nothing wasted.",
    "description": ("For advanced lifters who know exactly what failure feels like and want short, very hard sessions with plenty of recovery. "
                    "Each exercise gets two or three ramp-up sets that build to your working weight, then one working set taken to failure and often beyond. "
                    "Sessions last about 45 minutes and you train four days a week. It suits busy schedules, lifters coming off high-volume burnout, and anyone who "
                    "enjoys chasing the logbook."),
    "level": "advanced", "setting": "gym", "days_per_week": 4, "length_weeks": 8,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "smith", "pull-up bar"],
    "machines_used": ["pec deck", "hack squat", "leg press", "leg extension", "lying leg curl", "reverse pec deck", "standing calf", "seated calf", "dip machine"],
    "effort_style": ("Every working set goes to complete failure. The first one or two exercises each day continue past failure with forced reps, slow negatives or "
                     "rest-pause. Barbell rows, Romanian deadlifts and deadlifts stop at technical failure only, never past it."),
    "schedule": ["Chest & Biceps", "Back & Rear Delts", "Rest", "Shoulders & Triceps", "Legs", "Rest", "Rest"],
    "rotation": {"type": "fixed", "summary": "Four sessions repeated weekly. Each sets a record to beat."},
    "sessions": [
        S("hit-chest-bi", "Chest & Biceps", ["chest", "biceps"], [
            E("Incline Smith machine press", 1, "6-8", "3 min", FAIL, "Past failure: 2 forced reps with a spotter, or 2 rest-pause reps",
              W2 + ". Bar to the upper chest, 3-second lowering."),
            E("Flat dumbbell press", 1, "6-8", "3 min", FAIL, None, "1 ramp-up set. Deep stretch, explode up."),
            E("Incline cable fly", 1, "8-10", "2 min", FAIL, LP, "Wide arc, pause in the stretch."),
            E("Barbell curl", 1, "6-8", "2 min", FAIL, NEG, W2 + ". Strict, no swinging."),
            E("Incline dumbbell curl", 1, "8-10", "2 min", FAIL, LP, "Arms hang behind the torso."),
        ], 45),
        S("hit-back", "Back & Rear Delts", ["lats", "upper back", "rear delts", "lower back"], [
            E("Straight-arm cable pulldown", 1, "8-10", "2 min", FAIL, None, "1 ramp-up set. Pre-fatigues the lats before the heavy pull."),
            E("Close-grip underhand lat pulldown", 1, "6-8", "3 min", FAIL, NEG, W2 + ". Pull to the upper chest, 3-second lowering."),
            E("Underhand barbell row", 1, "6-8", "3 min", TECH, None, W2 + ". Torso at about 70 degrees, row to the stomach."),
            E("Single-arm dumbbell row", 1, "6-8 per arm", "2 min", FAIL, "Rest-pause: at failure rest 15 seconds and get 2 to 3 more", "Brace on the bench, row to the hip."),
            E("Reverse pec deck", 1, "8-10", "2 min", FAIL, DROP, "Push wide."),
            E("Romanian deadlift", 1, "8-10", "3 min", TECH, None, W2 + ". Last exercise of the day, so the back is already warm. Hips back, flat back."),
        ], 50),
        S("hit-delts-tri", "Shoulders & Triceps", ["shoulders", "triceps"], [
            E("Seated Smith machine shoulder press", 1, "6-8", "3 min", FAIL, "Past failure: 2 forced reps or 2 rest-pause reps", W2 + ". Bar to chin level."),
            E("Dumbbell lateral raise", 1, "8-10", "2 min", FAIL, "Double drop set: strip about 25% twice, to failure each time", "Lead with the elbows."),
            E("Single-arm cable lateral raise", 1, "10-12", "90 sec", FAIL, LP, "Cable behind you."),
            E("Triceps pushdown (straight bar)", 1, "8-10", "2 min", FAIL, None, "1 ramp-up set. Pre-fatigues the triceps before the press."),
            E("Machine dip", 1, "6-8", "2 min", FAIL, NEG, W2 + ". Upright torso to bias triceps."),
            E("Overhead cable triceps extension", 1, "8-10", "2 min", FAIL, LP, "Elbows by your ears."),
        ], 45),
        S("hit-legs", "Legs", ["quads", "hamstrings", "calves"], [
            E("Leg extension", 1, "10-12", "2 min", FAIL, None, "1 ramp-up set. Pre-fatigues the quads and warms the knees."),
            E("Hack squat", 1, "8-10", "3 min", FAIL, "Triple drop set: strip a plate per side three times, to failure each time", W2 + ". Deep, 2-second lowering."),
            E("Leg press", 1, "10-12", "3 min", FAIL, None, "1 ramp-up set. Feet mid-platform, deep."),
            E("Lying leg curl", 1, "8-10", "2 min", FAIL, NEG, W2 + ". Hips down."),
            E("Romanian deadlift (dumbbell)", 1, "8-10", "2 min", TECH, None, "Hips back, deep hamstring stretch."),
            E("Standing calf raise", 1, "10-12", "90 sec", FAIL, "At failure, hold the bottom stretch for 20 seconds", "1 ramp-up set. " + PAUSE_BOTTOM + "."),
            E("Seated calf raise", 1, "12-15", "90 sec", FAIL, None, "Full stretch at the bottom."),
        ], 45),
    ],
    "weeks": [
        {"week": w, "sessions": ["hit-chest-bi", "hit-back", "hit-delts-tri", "hit-legs"],
         "focus": ("Find your working weights. Take every set to failure but skip the past-failure techniques."
                   if w == 1 else ("Deload. Ramp-up sets plus one working set stopped with 3 reps left. No techniques."
                                    if w == 8 else "Full intensity. Beat the logbook on every exercise: one more rep or a little more weight."))}
        for w in range(1, 9)],
    "progression": ("Beat the logbook. Every working set should add a rep or a small amount of weight compared with last week. When you reach the top of the rep range, "
                    "add load. If you fail to beat the log on an exercise two sessions running, swap it for a close variation; if you stall on several, take an extra rest day that week."),
    "deload": ("Week 8 drops all past-failure work and stops working sets with 3 reps left. After two blocks, take a full week off training."),
    "why": ("Growth tracks how close sets come to failure (Robinson et al. 2024), so a single genuinely all-out set captures much of the stimulus a multi-set approach provides. "
            "More sets still produce more growth on average (Pelland et al. 2024), so this programme trades some potential size for short sessions and big recovery margins. "
            "Pre-fatigue isolation work and stretch-focused exercise choices make every working set count."),
})

# 9. Legs + Priority ------------------------------------------------------------------
P.append({
    "id": "priority-protocol",
    "name": "Priority Protocol",
    "hook": "Push, pull and two leg days, plus a dedicated Priority Day for chest, delts and arms after a full rest.",
    "description": ("For intermediate lifters whose chest, shoulders or arms are lagging behind their legs and back. "
                    "The week runs legs, push, pull, rest, then a Priority Day that hits chest, side delts and arms first thing after a rest day, when you are freshest. "
                    "Leg days finish with a few sets of lateral raises, so side delts get hit four times a week. Everything else stays at maintenance-plus while the priority muscles grow."),
    "level": "intermediate", "setting": "gym", "days_per_week": 5, "length_weeks": 6,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "smith", "pull-up bar"],
    "machines_used": ["chest press", "pec deck", "shoulder press", "hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension",
                       "reverse pec deck", "preacher curl", "standing calf", "seated calf"],
    "effort_style": ("All machine, cable and isolation sets go to failure. Barbell lifts stop at the last perfect rep. Priority Day carries the most intensity techniques."),
    "schedule": ["Legs (Quads)", "Push", "Pull", "Rest", "Priority Day", "Legs (Posterior)", "Rest"],
    "rotation": {"type": "fixed", "summary": "Five sessions repeated weekly."},
    "sessions": [
        S("pp-legs-q", "Legs: Quads", ["quads", "hamstrings", "calves", "side delts"], [
            E("Hack squat", 3, "6-10", "3 min", LASTFAIL, DROP, "Deep, 2-second descent."),
            E("Leg press", 3, "10-12", "2 min", FAIL, None, "Deep and controlled."),
            E("Leg extension", 3, "12-15", "90 sec", FAIL, DROP, "Pause at the top."),
            E("Seated leg curl", 2, "10-12", "90 sec", FAIL, LP, "Lean forward."),
            E("Standing calf raise", 3, "10-12", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
            E("Single-arm cable lateral raise", 2, "15-20", "45 sec", FAIL, MYO, "Priority top-up. Lead with the elbow."),
        ], 65),
        S("pp-push", "Push", ["chest", "shoulders", "triceps"], [
            E("Incline dumbbell press", 3, "8-10", "2-3 min", LASTFAIL, None, "Deep stretch at the bottom."),
            E("Machine chest press", 2, "10-12", "2 min", FAIL, None, "Handles at mid-chest."),
            E("Machine shoulder press", 2, "8-12", "2 min", FAIL, None, "Lower to chin level."),
            E("Dumbbell lateral raise", 3, "12-15", "60 sec", FAIL, None, "Lead with the elbows."),
            E("Overhead cable triceps extension", 2, "10-12", "60 sec", FAIL, LP, "Elbows by your ears."),
        ], 55),
        S("pp-pull", "Pull", ["lats", "upper back", "rear delts", "biceps"], [
            E("Wide-grip lat pulldown", 3, "8-12", "2 min", FAIL, None, "Full stretch at the top."),
            E("Chest-supported T-bar row", 3, "8-10", "2-3 min", FAIL, None, "Chest on the pad."),
            E("Single-arm seated cable row", 2, "10-12 per arm", "90 sec", FAIL, None, "Rotate into the stretch."),
            E("Reverse pec deck", 3, "15-20", "60 sec", FAIL, None, "Push wide."),
            E("Incline dumbbell curl", 2, "10-12", "60 sec", FAIL, LP, "Arms behind the torso."),
            E("Dumbbell hammer curl", 2, "10-12", "60 sec", FAIL, None, "Thumbs up."),
        ], 60),
        S("pp-priority", "Priority Day", ["chest", "side delts", "biceps", "triceps"], [
            E("Single-arm cable lateral raise", 4, "10-15", "60 sec", FAIL, MYO, "First exercise of the day on purpose. Lead with the elbow, stop at shoulder height."),
            E("Incline Smith machine press", 3, "6-10", "2-3 min", LASTFAIL, RP, "Bench at 30 degrees, bar to the upper chest."),
            E("Pec deck", 3, "10-15", "90 sec", FAIL, STATIC, "Open wide, squeeze hard."),
            E("Bayesian cable curl", 3, "10-12", "60 sec", FAIL, LP, "Arm behind the body.", "A1"),
            E("Overhead cable triceps extension", 3, "10-12", "60 sec", FAIL, LP, "Deep stretch behind the head.", "A2"),
            E("Machine preacher curl", 2, "12-15", "45 sec", FAIL, DROP, "Full stretch at the bottom.", "B1"),
            E("Triceps pushdown (rope)", 2, "12-15", "45 sec", FAIL, DROP, "Elbows pinned.", "B2"),
            E("Dumbbell lateral raise", 2, "15-20", "45 sec", FAIL, "Partial reps after failure until you cannot lift the dumbbells", "Finisher."),
        ], 70),
        S("pp-legs-p", "Legs: Posterior", ["hamstrings", "glutes", "calves", "side delts"], [
            E("Romanian deadlift", 3, "6-10", "3 min", TECH, None, "Hips back, flat back."),
            E("Lying leg curl", 3, "10-12", "90 sec", FAIL, DROP, "Hips down."),
            E("Bulgarian split squat", 2, "8-12 per leg", "2 min", HARD, None, "Long stride."),
            E("Barbell hip thrust", 2, "8-12", "2 min", FAIL, None, "Chin tucked, hold the top."),
            E("Seated calf raise", 4, "12-15", "60 sec", FAIL, MYO, "Full stretch at the bottom."),
            E("Dumbbell lateral raise", 2, "15-20", "45 sec", FAIL, None, "Priority top-up."),
        ], 65),
    ],
    "weeks": standard_weeks(6, ["pp-legs-q", "pp-push", "pp-pull", "pp-priority", "pp-legs-p"]),
    "progression": PROGRESSION_DOUBLE + " Track the Priority Day most closely: it should improve every week.",
    "deload": DELOAD_STANDARD,
    "why": ("Exercises done early in a session, when you are fresh, get more reps and better performance, so lagging muscles go first on their own day after a rest day. "
            "Side delts get almost no work from pressing, so they need direct volume spread across four days to grow. "
            "The other muscles stay at a solid working volume so the extra priority work does not cost you size elsewhere."),
})

# 10. Glute-focused --------------------------------------------------------------------
P.append({
    "id": "glute-architect",
    "name": "Glute Architect",
    "hook": "A lower and upper split built around glute growth, with three glute sessions a week and a sculpted upper body to match.",
    "description": ("For women (or anyone) who want rounder, stronger glutes as the main goal, along with toned shoulders and back. "
                    "Two lower days hit the glutes from every angle: hip thrusts for the squeeze, deep squats and lunges for the stretch, and abduction work for the upper glutes. "
                    "Upper days keep the shoulders and back developing for a balanced, athletic shape, and finish with a short glute burner. An optional fifth day adds a third full glute session."),
    "level": "intermediate", "setting": "gym", "days_per_week": 4, "length_weeks": 8,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "smith", "bands", "pull-up bar"],
    "machines_used": ["hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension", "hip abduction", "hip adduction", "reverse pec deck"],
    "effort_style": ("Hip thrusts and squats stop at the last perfect rep on the first sets and go to failure on the last. Machine and cable glute work always goes to failure. "
                     "Romanian deadlifts stay at technical failure."),
    "schedule": ["Lower A (Glute Strength)", "Upper A", "Rest", "Lower B (Glutes & Quads)", "Upper B + Glutes", "Glute Pump (optional)", "Rest"],
    "rotation": {"type": "fixed", "summary": "Four core sessions plus an optional fifth, repeated weekly."},
    "sessions": [
        S("ga-lower-a", "Lower A: Glute Strength", ["glutes", "hamstrings"], [
            E("Barbell hip thrust", 4, "6-10", "2-3 min", LASTFAIL, "Last set: hold the top for 10 seconds after your final rep",
              "Shoulder blades on the bench edge, chin tucked, ribs down. Drive through your heels and hold the top for a second."),
            E("Romanian deadlift", 3, "8-10", "3 min", TECH, None, "Push the hips back until the hamstrings are fully stretched, back flat."),
            E("Bulgarian split squat (glute bias)", 3, "8-12 per leg", "2 min", HARD, None, "Longer stride and a forward lean. Sink deep into the front hip."),
            E("Seated leg curl", 3, "10-12", "90 sec", FAIL, LP, "Lean forward over the pad."),
            E("Hip abduction machine (leaning forward)", 3, "12-20", "60 sec", FAIL, MYO, "Lean your chest forward over your thighs to load the upper glutes."),
        ], 65),
        S("ga-upper-a", "Upper A", ["back", "shoulders", "chest", "arms"], [
            E("Lat pulldown", 3, "8-12", "2 min", LASTFAIL, None, "Pull your elbows to your sides, chest up."),
            E("Incline dumbbell press", 3, "8-12", "2 min", LASTFAIL, None, "30 degree bench."),
            E("Seated cable row", 3, "10-12", "90 sec", FAIL, None, "Sit tall, let the shoulders stretch forward."),
            E("Dumbbell lateral raise", 3, "12-15", "60 sec", FAIL, DROP, "Lead with the elbows."),
            E("Cable curl", 2, "12-15", "45 sec", FAIL, None, "Elbows still.", "A1"),
            E("Triceps pushdown (rope)", 2, "12-15", "45 sec", FAIL, None, "Elbows pinned.", "A2"),
        ], 50),
        S("ga-lower-b", "Lower B: Glutes & Quads", ["glutes", "quads", "adductors"], [
            E("Hack squat (deep)", 3, "8-12", "2-3 min", LASTFAIL, None, "Feet mid-platform and slightly wide. Sink as deep as you can, glutes stretch at the bottom."),
            E("Smith machine deficit reverse lunge", 3, "8-12 per leg", "2 min", HARD, None, "Front foot on a low step. Step back and sink deep, push through the front heel."),
            E("45 degree back extension (glute bias)", 3, "12-15", "90 sec", FAIL, None, "Feet turned out, round the upper back slightly and drive with the glutes. Hold a plate when easy."),
            E("Cable glute kickback", 2, "12-15 per leg", "60 sec", FAIL, LP, "Lean forward on the frame, kick back and slightly out, do not arch the lower back."),
            E("Leg extension", 2, "12-15", "60 sec", FAIL, None, "Pause at the top."),
            E("Hip adduction machine", 2, "12-15", "60 sec", FAIL, None, "Squeeze the pads together."),
        ], 65),
        S("ga-upper-b", "Upper B + Glute Finisher", ["back", "shoulders", "glutes"], [
            E("Pull-up (assisted if needed)", 3, "6-10", "2-3 min", LASTFAIL, None, "Use the assisted machine or a band until you can do 6 clean reps."),
            E("Seated dumbbell shoulder press", 3, "8-12", "2 min", LASTFAIL, None, "Lower to ear height."),
            E("Single-arm dumbbell row", 3, "10-12 per arm", "90 sec", FAIL, None, "Row to your hip."),
            E("Single-arm cable lateral raise", 3, "12-15", "60 sec", FAIL, MYO, "Lead with the elbow."),
            E("Reverse pec deck", 2, "15-20", "60 sec", FAIL, None, "Push wide."),
            E("Banded seated hip abduction", 2, "20-30", "45 sec", FAIL, "Partial reps after failure until you cannot move", "Band just above the knees, lean forward, push out hard."),
        ], 55),
        S("ga-glute-pump", "Glute Pump (optional)", ["glutes", "hamstrings"], [
            E("Barbell hip thrust (paused)", 3, "10-15", "2 min", FAIL, None, "2-second squeeze at the top of every rep."),
            E("Leg press, feet high and wide", 3, "12-15", "2 min", FAIL, None, "Feet high and wide, lower deep."),
            E("Lying leg curl", 2, "10-12", "90 sec", FAIL, DROP, "Hips down."),
            E("Cable glute kickback", 2, "15-20 per leg", "45 sec", FAIL, None, "Kick back and slightly out."),
            E("Hip abduction machine", 3, "15-25", "45 sec", FAIL, DDROP, "Alternate upright and leaning forward each set."),
        ], 45, "Run this day only if you are recovering well from the other four."),
    ],
    "weeks": standard_weeks(8, ["ga-lower-a", "ga-upper-a", "ga-lower-b", "ga-upper-b", "ga-glute-pump"]),
    "progression": PROGRESSION_DOUBLE + " Hip thrust is the headline lift: aim to add 2.5 to 5 kg every one to two weeks.",
    "deload": DELOAD_STANDARD,
    "why": ("Deep squats and hip thrusts grow the glutes to a similar degree (Plotkin et al. 2023), and squatting to full depth grows the glutes more than half squats (Kubo et al. 2019), so the plan uses both a stretch-focused and a squeeze-focused main lift. "
            "Abduction work targets the upper glutes that squats and thrusts reach less. "
            "Three glute exposures a week spreads volume out so every session is high quality instead of one marathon leg day."),
})
