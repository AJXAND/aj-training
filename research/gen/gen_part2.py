from gen_part1 import *

P = []

# 1. PPL x2 ------------------------------------------------------------------
push_a = S("push-a", "Push A: Upper Chest", ["upper chest", "chest", "side delts", "triceps"], [
    E("Incline barbell press (30 degrees)", 3, "6-8", "3 min", TECH, None,
      "Shoulder blades pinned back and down. Touch just below the collarbone and press up and slightly back."),
    E("Machine chest press", 3, "8-12", "2 min", FAIL, DROP,
      "Set the seat so the handles line up with mid-chest. Let the handles come back until you feel a deep pec stretch."),
    E("Seated cable fly", 2, "12-15", "90 sec", FAIL, LP,
      "Soft, fixed elbows. Hug a wide tree and pause for a second in the stretch."),
    E("Seated dumbbell shoulder press", 2, "8-10", "2 min", HARD, None,
      "Bench at 75 to 80 degrees. Lower until the dumbbells reach ear height."),
    E("Single-arm cable lateral raise", 3, "12-15", "60 sec", FAIL, MYO,
      "Cable behind you at hand height. Lead with the elbow and raise out to the side, stopping at shoulder height."),
    E("Overhead cable triceps extension", 3, "10-12", "90 sec", FAIL, LP,
      "Elbows by your ears. Let the rope travel well behind your head for a full long-head stretch."),
    E("Triceps pushdown (straight bar)", 2, "12-15", "60 sec", FAIL, DROP,
      "Elbows pinned to your sides. Lock out hard at the bottom of every rep."),
], 70)
pull_a = S("pull-a", "Pull A: Lat Width", ["lats", "upper back", "rear delts", "biceps"], [
    E("Weighted pull-up", 3, "6-10", "3 min", TECH, None,
      "Start from a dead hang. Drive your elbows down to your back pockets and bring your chest to the bar. Use a lat pulldown if you cannot do 6."),
    E("Chest-supported T-bar row", 3, "8-10", "2-3 min", FAIL, RP,
      "Chest glued to the pad. Pull to the lower ribs and let the shoulder blades travel forward at the bottom."),
    E("Half-kneeling single-arm cable pulldown", 2, "10-12", "90 sec", FAIL, LP,
      "Reach high to stretch the lat, then pull your elbow down to your hip."),
    E("Cable pullover (rope)", 2, "12-15", "60 sec", FAIL, None,
      "Hinge slightly, arms nearly straight, sweep the rope down to your thighs."),
    E("Reverse pec deck", 3, "15-20", "60 sec", FAIL, DROP,
      "Neutral grip. Push out wide with the backs of your hands and keep your shoulders down."),
    E("Incline dumbbell curl", 3, "8-12", "90 sec", FAIL, LP,
      "Bench at 45 degrees, arms hanging straight down behind your torso. No swinging."),
    E("Cable rope hammer curl", 2, "10-12", "60 sec", FAIL, None,
      "Elbows still. Curl the rope to your shoulders and squeeze."),
], 70)
legs_a = S("legs-a", "Legs A: Quads", ["quads", "hamstrings", "calves", "abs"], [
    E("Hack squat", 3, "6-10", "3 min", LASTFAIL, "Last set: drop set. At failure, strip a plate per side and go to failure again",
      "Feet low and shoulder-width. Lower over 2 seconds, sit as deep as you can while your lower back stays on the pad."),
    E("Seated leg curl", 3, "10-12", "90 sec", FAIL, LP,
      "Lean your torso forward to stretch the hamstrings more. Control the way up."),
    E("Leg press", 3, "10-15", "2 min", FAIL, None,
      "Feet mid-platform. Lower until your knees are close to your chest without your tailbone peeling off the pad."),
    E("Leg extension", 3, "12-15", "90 sec", FAIL, DDROP,
      "Lean back slightly and grip the handles. Pause for a second at the top."),
    E("Dumbbell walking lunge", 2, "10-12 per leg", "2 min", HARD, None,
      "Long stride, let the front knee travel forward and push through the whole foot."),
    E("Standing calf raise", 4, "8-12", "60 sec", FAIL, LP,
      "Pause 2 seconds at the bottom of every rep in a full stretch. No bouncing."),
    E("Hanging leg raise", 2, "10-15", "60 sec", HARD, None,
      "Curl the pelvis up towards the ribs rather than just swinging the legs."),
], 75)
push_b = S("push-b", "Push B: Flat Press and Delts", ["chest", "front delts", "side delts", "triceps"], [
    E("Barbell bench press", 3, "5-8", "3 min", TECH, None,
      "Feet planted, upper back tight. Touch mid-chest and press back towards your face."),
    E("Machine shoulder press", 3, "8-12", "2 min", FAIL, RP,
      "Back flat on the pad. Lower until your hands are just below your chin."),
    E("Weighted dip", 2, "8-12", "2 min", FAIL, None,
      "Slight forward lean. Sink until your shoulders drop just below your elbows if your shoulders allow it."),
    E("Pec deck", 2, "12-15", "90 sec", FAIL, STATIC,
      "Handles in line with the lower chest. Let the arms open wide under control."),
    E("Dumbbell lateral raise", 4, "12-20", "60 sec", FAIL, RUN_RACK,
      "Slight forward lean. Raise in line with your body and lead with the elbows."),
    E("EZ-bar skull crusher", 3, "8-12", "90 sec", FAIL, None,
      "Lower the bar behind your head, not to your forehead, to stretch the long head."),
], 65)
pull_b = S("pull-b", "Pull B: Back Thickness", ["upper back", "lats", "traps", "biceps"], [
    E("Barbell row", 3, "6-10", "3 min", TECH, None,
      "Torso at about 45 degrees and braced hard. Row to the belly button and stop the set the moment your back starts to round."),
    E("Neutral-grip lat pulldown", 3, "8-12", "2 min", FAIL, DROP,
      "Lean back slightly, pull to the upper chest, and get a full stretch at the top."),
    E("Wide-grip seated cable row", 2, "10-12", "90 sec", FAIL, None,
      "Elbows out at about 45 degrees. Pull to the lower chest to hit upper back and rear delts."),
    E("Dumbbell shrug", 2, "10-15", "60 sec", FAIL, None,
      "Straight up towards the ears, hold for a second, no rolling."),
    E("Face pull", 2, "15-20", "60 sec", FAIL, None,
      "Rope at forehead height. Pull apart and finish with your hands beside your ears."),
    E("Bayesian cable curl", 3, "10-12", "90 sec", FAIL, LP,
      "Face away from the cable with the arm behind your body. Curl without the elbow drifting forward."),
    E("Machine preacher curl", 2, "10-15", "60 sec", FAIL, DROP,
      "Armpits on top of the pad and fully straighten the arm at the bottom."),
], 70)
legs_b = S("legs-b", "Legs B: Hamstrings and Glutes", ["hamstrings", "glutes", "adductors", "calves"], [
    E("Romanian deadlift", 3, "6-10", "3 min", TECH, None,
      "Push the hips back until you feel a strong hamstring stretch. The bar slides down your thighs and your back stays flat."),
    E("Lying leg curl", 3, "8-12", "90 sec", FAIL, DROP,
      "Hips pressed into the pad. Curl up hard and lower over 3 seconds."),
    E("Bulgarian split squat", 3, "8-12 per leg", "2 min", HARD, None,
      "Long stride with a slight forward lean to bias the glutes. Go deep."),
    E("45 degree back extension", 2, "12-15", "90 sec", FAIL, None,
      "Round the upper back slightly and drive with the glutes. Hold a plate once bodyweight is easy."),
    E("Leg press, feet high and wide", 2, "12-15", "2 min", FAIL, None,
      "Feet high on the platform. Push through the heels and lower deep."),
    E("Hip adduction machine", 2, "12-15", "60 sec", FAIL, LP,
      "Start from the widest comfortable position and squeeze the pads together."),
    E("Seated calf raise", 4, "12-15", "60 sec", FAIL, MYO,
      "Full stretch at the bottom, full squeeze at the top."),
], 70)

P.append({
    "id": "relentless-ppl",
    "name": "Relentless PPL",
    "hook": "A six-day push, pull, legs split with two different versions of every session, built to grow everything twice a week.",
    "description": ("For intermediate lifters with at least a year of consistent training who can get to the gym six days a week. "
                    "Each muscle is hit twice a week from two angles: the A sessions lean on stretch-focused presses and pulls for upper chest, lats and quads, "
                    "the B sessions on heavy flat pressing, back thickness and the hamstrings and glutes. Main lifts stay heavy and clean, "
                    "machines and cables carry the hard sets to failure, so you get plenty of growth stimulus without beating up your joints."),
    "level": "intermediate", "setting": "gym", "days_per_week": 6, "length_weeks": 6,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "pull-up bar", "dip bars"],
    "machines_used": ["chest press", "pec deck", "shoulder press", "hack squat", "leg press", "seated leg curl", "lying leg curl",
                       "leg extension", "reverse pec deck", "preacher curl", "standing calf", "seated calf", "hip adduction"],
    "effort_style": ("Barbell presses, rows, pull-ups and RDLs stop at the last perfect rep. Machines, cables and isolation exercises go to genuine failure on every "
                     "working set, with one intensity technique on the final set where listed."),
    "schedule": ["Push A", "Pull A", "Legs A", "Push B", "Pull B", "Legs B", "Rest"],
    "rotation": {"type": "fixed", "summary": "Six distinct sessions run in the same order every week; effort ramps up across the block."},
    "sessions": [push_a, pull_a, legs_a, push_b, pull_b, legs_b],
    "weeks": standard_weeks(6, ["push-a", "pull-a", "legs-a", "push-b", "pull-b", "legs-b"]),
    "progression": PROGRESSION_DOUBLE,
    "deload": DELOAD_STANDARD,
    "why": ("Hitting each muscle twice a week with about 12 to 18 hard sets sits in the zone where the Pelland et al. (2024) meta-regression shows growth still climbing before returns flatten. "
            "Isolation choices favour long muscle lengths, such as seated leg curls (Maeo et al. 2021), overhead triceps work (Maeo et al. 2023) and incline curls, because training muscles in a stretched position produces more growth. "
            "Failure is saved for machines and cables, where it is safe and repeatable, while barbell lifts stay crisp so fatigue does not leak into the next session."),
})

# 2. PPL + Upper/Lower ----------------------------------------------------------
P.append({
    "id": "hybrid-five",
    "name": "Hybrid Five",
    "hook": "Heavy upper and lower days followed by a high-output push, pull and legs block. Five days, strength and size in one week.",
    "description": ("For intermediate lifters who want to get stronger on the big lifts while still training like a bodybuilder. "
                    "The first two days are lower-rep strength sessions built around the bench, squat, pull-up and RDL. After a rest day, "
                    "push, pull and legs switch to moderate weights, higher reps and intensity techniques. Every muscle is trained twice a week with a "
                    "different rep range each time, so you get the strength of a heavy day and the volume of a pump day without either one crowding out the other."),
    "level": "intermediate", "setting": "gym", "days_per_week": 5, "length_weeks": 6,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "pull-up bar"],
    "machines_used": ["chest press", "hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension", "reverse pec deck", "standing calf", "seated calf"],
    "effort_style": ("Upper and Lower days: heavy, crisp sets that stop at the last perfect rep, with long rests. Push, Pull and Legs days: most sets go to failure, "
                     "with drop sets, myo-reps and stretched half reps on the last set of isolation work."),
    "schedule": ["Upper (Strength)", "Lower (Strength)", "Rest", "Push", "Pull", "Legs", "Rest"],
    "rotation": {"type": "fixed", "summary": "Five distinct sessions repeated weekly."},
    "sessions": [
        S("upper-strength", "Upper (Strength)", ["chest", "back", "shoulders", "arms"], [
            E("Barbell bench press", 4, "5-7", "3 min", TECH, None,
              "Set the upper back first, then the feet. Touch mid-chest every rep with no bounce."),
            E("Weighted pull-up", 3, "5-8", "3 min", TECH, None,
              "Dead hang at the bottom and chest to the bar. Add weight with a belt once you get 8 clean reps."),
            E("Seated dumbbell shoulder press", 2, "8-10", "2 min", HARD, None,
              "Bench just short of upright. Press up and slightly in, lower to ear height."),
            E("Chest-supported machine row", 3, "8-10", "2 min", FAIL, None,
              "Chest on the pad. Drive the elbows back and let the shoulder blades stretch forward each rep."),
            E("EZ-bar curl", 2, "8-10", "90 sec", FAIL, None,
              "Elbows slightly in front of the body, no hip swing.", "A1"),
            E("Overhead cable triceps extension", 2, "10-12", "90 sec", FAIL, LP,
              "Elbows by your ears and a deep stretch behind the head.", "A2"),
        ], 70),
        S("lower-strength", "Lower (Strength)", ["quads", "hamstrings", "glutes", "calves", "abs"], [
            E("High-bar back squat", 4, "5-7", "3-4 min", TECH, None,
              "Big breath and brace before you descend. Sit between your heels and reach at least parallel."),
            E("Romanian deadlift", 3, "6-8", "3 min", TECH, None,
              "Soft knees, hips back, bar against the thighs. Stop where your hamstrings are fully stretched and your back is still flat."),
            E("Leg extension", 2, "10-12", "90 sec", FAIL, None,
              "Pause for a second at the top, lower over 2 seconds."),
            E("Seated leg curl", 3, "10-12", "90 sec", FAIL, LP,
              "Lean forward over the thigh pad to put the hamstrings on stretch."),
            E("Standing calf raise", 3, "8-12", "60 sec", FAIL, None, PAUSE_BOTTOM + ". No bouncing."),
            E("Cable crunch", 3, "10-15", "60 sec", HARD, None,
              "Curl the ribs towards the hips. The hips stay still."),
        ], 70),
        S("push", "Push", ["chest", "side delts", "triceps"], [
            E("Incline dumbbell press", 3, "8-12", "2-3 min", LASTFAIL, None,
              "Bench at 30 degrees. Let the dumbbells sink to chest level for a full stretch, then press."),
            E("Machine chest press", 2, "10-12", "2 min", FAIL, DROP,
              "Handles at mid-chest height. Deep stretch at the start of every rep."),
            E("Low-to-high cable fly", 2, "12-15", "90 sec", FAIL, LP,
              "Cables at hip height. Sweep up to eye level, squeezing the upper chest."),
            E("Single-arm cable lateral raise", 4, "12-15", "60 sec", FAIL, MYO,
              "Cable behind you. Lead with the elbow and stop at shoulder height."),
            E("Cross-body cable triceps extension", 2, "12-15", "60 sec", FAIL, None,
              "Two cables crossed at head height. Extend outward and slightly down."),
            E("Triceps pushdown (rope)", 2, "12-15", "60 sec", FAIL, DROP,
              "Elbows pinned. Split the rope apart at the bottom."),
        ], 60),
        S("pull", "Pull", ["lats", "upper back", "rear delts", "biceps"], [
            E("Wide-grip lat pulldown", 3, "8-12", "2 min", FAIL, DROP,
              "Thighs locked under the pad. Pull to the upper chest and let the bar rise until your arms are fully straight."),
            E("Single-arm dumbbell row", 3, "8-12 per arm", "90 sec", FAIL, None,
              "Brace on the bench. Row to your hip and let the shoulder reach forward at the bottom."),
            E("Cable pullover (rope)", 2, "12-15", "60 sec", FAIL, None,
              "Arms nearly straight, sweep down to the thighs, stretch fully overhead."),
            E("Reverse pec deck", 3, "15-20", "60 sec", FAIL, MYO,
              "Push wide with the backs of your hands and keep the shoulders down."),
            E("Incline dumbbell curl", 2, "10-12", "90 sec", FAIL, LP,
              "Arms hang behind the torso. Curl without the elbows drifting forward."),
            E("Cable rope hammer curl", 2, "12-15", "60 sec", FAIL, None,
              "Thumbs up, elbows still, squeeze at the top."),
        ], 60),
        S("legs", "Legs", ["quads", "hamstrings", "glutes", "calves"], [
            E("Hack squat", 3, "8-12", "2-3 min", LASTFAIL,
              "Last set: mechanical drop. At failure, step off and immediately do heel-elevated bodyweight squats to failure",
              "Feet low on the platform. Control the descent over 2 seconds and go as deep as your hips allow."),
            E("Lying leg curl", 3, "10-12", "90 sec", FAIL, DROP, "Hips down on the pad, 3-second lowering."),
            E("Dumbbell walking lunge", 2, "12 per leg", "2 min", HARD, None,
              "Long stride, upright torso, push through the front foot."),
            E("Leg extension", 2, "15-20", "90 sec", FAIL, LP, "Pause at the top, slow on the way down."),
            E("Machine or barbell hip thrust", 2, "10-12", "2 min", FAIL, None,
              "Chin tucked, ribs down. Drive through the heels and hold the top for a second."),
            E("Seated calf raise", 4, "12-15", "60 sec", FAIL, LP, "Full stretch at the bottom of every rep."),
        ], 65),
    ],
    "weeks": standard_weeks(6, ["upper-strength", "lower-strength", "push", "pull", "legs"]),
    "progression": ("Upper and Lower days: when you hit the top of the rep range on every set of the first lift, add 2.5 kg (5 kg on squats if it moved fast). "
                    "Push, Pull and Legs days: double progression, adding reps first and load once you reach the top of the range on all sets."),
    "deload": DELOAD_STANDARD,
    "why": ("Pelland et al. (2024) found that higher frequency helps strength even when it adds little for size, so the big lifts are trained heavily twice in different contexts. "
            "Hypertrophy is similar across a wide range of loads when sets are hard, so the second exposure uses lighter, joint-friendly work pushed close to failure. "
            "Splitting heavy and pump work across separate days keeps the heavy sessions fresh and the pump sessions honest."),
})

# 3. Upper / Lower ---------------------------------------------------------------
P.append({
    "id": "blueprint-upper-lower",
    "name": "Blueprint Upper/Lower",
    "hook": "Four days a week, every muscle twice, every session with a clear job. The split most lifters should run for years.",
    "description": ("For lifters with six months or more of training who want a schedule that fits around work and still builds serious muscle. "
                    "Upper 1 is built around horizontal pressing and rowing, Upper 2 around vertical pulling and overhead pressing. Lower 1 is squat-led, "
                    "Lower 2 is hinge-led. Rest days fall naturally between pairs, so recovery is rarely a problem."),
    "level": "intermediate", "setting": "gym", "days_per_week": 4, "length_weeks": 8,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "pull-up bar", "dip bars"],
    "machines_used": ["chest press", "hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension", "reverse pec deck", "standing calf", "seated calf"],
    "effort_style": ("The first lift of each day stops at the last perfect rep. Everything after it goes to failure on the final set, and isolation work goes to failure on every set."),
    "schedule": ["Upper 1", "Lower 1", "Rest", "Upper 2", "Lower 2", "Rest", "Rest"],
    "rotation": {"type": "fixed", "summary": "Four distinct sessions repeated weekly. Weeks 1 to 3 build reps, weeks 4 to 7 push load, week 8 deloads."},
    "sessions": [
        S("upper-1", "Upper 1: Horizontal", ["chest", "upper back", "side delts", "arms"], [
            E("Barbell bench press", 3, "5-8", "3 min", TECH, None, "Touch mid-chest, keep your shoulder blades pinned, drive with your legs."),
            E("Chest-supported T-bar row", 3, "8-10", "2-3 min", LASTFAIL, None, "Pull to the lower ribs, full stretch at the bottom."),
            E("Incline dumbbell press", 2, "8-12", "2 min", LASTFAIL, None, "30 degree bench, deep stretch at the bottom."),
            E("Wide-grip lat pulldown", 2, "10-12", "90 sec", FAIL, None, "Full stretch at the top, pull to the upper chest."),
            E("Single-arm cable lateral raise", 3, "12-15", "60 sec", FAIL, MYO, "Lead with the elbow and stop at shoulder height."),
            E("EZ-bar curl", 2, "10-12", "60 sec", FAIL, None, "No swinging. Lower over 2 seconds.", "A1"),
            E("Overhead cable triceps extension", 2, "10-12", "60 sec", FAIL, LP, "Elbows by your ears, deep stretch.", "A2"),
        ], 70),
        S("lower-1", "Lower 1: Squat", ["quads", "glutes", "hamstrings", "calves"], [
            E("High-bar back squat", 3, "5-8", "3-4 min", TECH, None, "Brace, sit down between your heels, keep the chest up out of the hole."),
            E("Leg press", 2, "10-15", "2 min", FAIL, None, "Deep and controlled. Keep your lower back on the pad."),
            E("Seated leg curl", 3, "10-12", "90 sec", FAIL, LP, "Lean forward to stretch the hamstrings."),
            E("Leg extension", 2, "12-15", "90 sec", FAIL, DROP, "Pause for a second at the top."),
            E("45 degree back extension", 2, "10-15", "90 sec", HARD, None, "Hinge from the hips and squeeze the glutes at the top."),
            E("Standing calf raise", 3, "10-12", "60 sec", FAIL, LP, PAUSE_BOTTOM + "."),
        ], 65),
        S("upper-2", "Upper 2: Vertical", ["lats", "shoulders", "chest", "arms"], [
            E("Weighted pull-up", 3, "6-10", "3 min", TECH, None, "Dead hang to chest at the bar. Use a pulldown if needed."),
            E("Seated dumbbell shoulder press", 3, "8-10", "2 min", LASTFAIL, None, "Lower to ear height, press up and slightly in."),
            E("Seated cable row (close grip)", 3, "10-12", "90 sec", FAIL, DROP, "Let the shoulders stretch forward, then row to your stomach."),
            E("Weighted dip", 2, "8-12", "2 min", FAIL, None, "Slight forward lean, controlled depth."),
            E("Reverse pec deck", 2, "15-20", "60 sec", FAIL, None, "Push wide, shoulders down."),
            E("Incline dumbbell curl", 2, "10-12", "60 sec", FAIL, LP, "Arms hang straight down behind you.", "A1"),
            E("Triceps pushdown (rope)", 2, "12-15", "60 sec", FAIL, DROP, "Elbows pinned, split the rope at the bottom.", "A2"),
        ], 70),
        S("lower-2", "Lower 2: Hinge", ["hamstrings", "glutes", "quads", "calves", "abs"], [
            E("Romanian deadlift", 3, "6-10", "3 min", TECH, None, "Hips back, flat back, bar against the legs."),
            E("Hack squat", 3, "8-12", "2-3 min", LASTFAIL, None, "Deep and controlled, 2-second descent."),
            E("Lying leg curl", 3, "8-12", "90 sec", FAIL, DROP, "Hips down, 3-second lowering."),
            E("Bulgarian split squat", 2, "8-12 per leg", "2 min", HARD, None, "Long stride, slight forward lean."),
            E("Seated calf raise", 3, "12-15", "60 sec", FAIL, MYO, "Full stretch at the bottom."),
            E("Hanging leg raise", 2, "10-15", "60 sec", HARD, None, "Curl the pelvis up, no swinging."),
        ], 65),
    ],
    "weeks": [
        {"week": 1, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Calibration. Stop every set with about 2 good reps left, no techniques. Log everything."},
        {"week": 2, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Train as written, techniques off. Aim to add reps everywhere."},
        {"week": 3, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Techniques on. Push reps to the top of each range."},
        {"week": 4, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Load week. Anything that hit the top of its range gets heavier."},
        {"week": 5, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Beat week 4 by a rep or a small jump in load on every exercise."},
        {"week": 6, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Beat week 5. Add one extra set to the first isolation exercise of each session if you are recovering well."},
        {"week": 7, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Peak week. Best performance of the block on the first lift of each day."},
        {"week": 8, "sessions": ["upper-1", "lower-1", "upper-2", "lower-2"], "focus": "Deload. Half the sets, nothing near failure."},
    ],
    "progression": PROGRESSION_DOUBLE,
    "deload": DELOAD_STANDARD,
    "why": ("Training each muscle twice a week outperforms once a week for growth when weekly sets are not matched (Schoenfeld, Ogborn and Krieger 2016), and four days is the simplest way to get there. "
            "Putting the heavy compound first while you are fresh and finishing with stretch-biased isolation work gets both strength and size from each session. "
            "A planned deload after seven hard weeks clears fatigue before it stalls progress."),
})

# 4. Full body -----------------------------------------------------------------------
P.append({
    "id": "groundwork-full-body",
    "name": "Groundwork Full Body",
    "hook": "Three full-body sessions a week to learn the big lifts properly and put on your first real muscle.",
    "description": ("For beginners in their first six to twelve months of training, or anyone coming back after a long break. "
                    "Three different full-body sessions teach the squat, hinge, press and row on machines and free weights, with plenty of practice and "
                    "no unnecessary complexity. You will add weight to the bar almost every week, and that is the whole point."),
    "level": "beginner", "setting": "gym", "days_per_week": 3, "length_weeks": 8,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines"],
    "machines_used": ["chest press", "leg press", "seated leg curl", "lying leg curl", "leg extension", "standing calf"],
    "effort_style": ("For the first four weeks every set stops with 1 or 2 good reps left so you can practise technique. From week 5, the final set of each machine and "
                     "isolation exercise goes to failure. No drop sets or other techniques: adding weight is your intensity technique."),
    "schedule": ["Session A", "Rest", "Session B", "Rest", "Session C", "Rest", "Rest"],
    "rotation": {"type": "fixed", "summary": "Three distinct sessions on non-consecutive days."},
    "sessions": [
        S("fb-a", "Session A", ["full body", "quads"], [
            E("High-bar back squat", 3, "6-8", "3 min", SHY, None, "Brace, sit down between your heels, knees track over toes. Film a set from the side in week 1."),
            E("Dumbbell bench press", 3, "8-10", "2 min", SHY, None, "Lower until the dumbbells are level with your chest, press up and slightly in."),
            E("Lat pulldown", 3, "8-12", "2 min", SHY, None, "Pull your elbows down to your sides, chest up."),
            E("Seated leg curl", 2, "10-12", "90 sec", HARD, None, "Lean forward slightly, control the way up."),
            E("Single-arm cable lateral raise", 2, "12-15", "60 sec", HARD, None, "Lead with the elbow and stop at shoulder height."),
            E("Triceps pushdown (rope)", 2, "10-12", "60 sec", HARD, None, "Elbows pinned to your sides."),
        ], 55),
        S("fb-b", "Session B", ["full body", "hamstrings", "back"], [
            E("Romanian deadlift", 3, "8-10", "3 min", SHY, None, "Hips back, flat back, stop at a strong hamstring stretch. Start with dumbbells if the barbell feels awkward."),
            E("Chest-supported dumbbell row", 3, "8-12", "2 min", SHY, None, "Lie face down on an incline bench and row to your hips."),
            E("Incline dumbbell press", 3, "8-12", "2 min", SHY, None, "30 degree bench, full stretch at the bottom."),
            E("Leg extension", 2, "12-15", "90 sec", HARD, None, "Pause for a second at the top."),
            E("Dumbbell curl", 2, "10-12", "60 sec", HARD, None, "No swinging, lower slowly."),
            E("Plank", 2, "30-45 sec", "60 sec", HARD, None, "Squeeze glutes and pull ribs down."),
        ], 55),
        S("fb-c", "Session C", ["full body", "chest", "glutes"], [
            E("Leg press", 3, "10-12", "2-3 min", SHY, None, "Feet mid-platform, lower deep without your lower back peeling off the pad."),
            E("Machine chest press", 3, "8-12", "2 min", SHY, None, "Handles in line with mid-chest."),
            E("Seated cable row", 3, "10-12", "2 min", SHY, None, "Sit tall, row to your stomach, let the shoulders stretch forward."),
            E("Lying leg curl", 2, "10-12", "90 sec", HARD, None, "Hips down, slow lowering."),
            E("Dumbbell lateral raise", 2, "12-15", "60 sec", HARD, None, "Raise in line with the body to shoulder height."),
            E("Overhead cable triceps extension", 2, "10-12", "60 sec", HARD, None, "Elbows by your ears."),
            E("Standing calf raise", 2, "10-15", "60 sec", HARD, None, PAUSE_BOTTOM + "."),
        ], 60),
    ],
    "weeks": [
        {"week": w, "sessions": ["fb-a", "fb-b", "fb-c"],
         "focus": ("Technique weeks. Every set stops with 1 or 2 good reps left. Add weight whenever you hit the top of the range on all sets."
                   if w <= 4 else
                   ("Final set of every machine and isolation exercise goes to failure. Keep adding weight to the big lifts."
                    if w < 8 else "Lighter week: same sessions, two sets per exercise, nothing near failure. Then start again with heavier weights."))}
        for w in range(1, 9)],
    "progression": ("Add weight every time you hit the top of the rep range on all sets with good form. Expect 2.5 to 5 kg a week on the squat, RDL and leg press "
                    "for the first couple of months, and smaller jumps on upper-body lifts. If you miss the bottom of the range twice, drop the weight 10% and build back up."),
    "deload": ("Week 8 is a lighter week. After that, only deload when you stall on two or more main lifts for two sessions in a row."),
    "why": ("Beginners grow well from moderate volume and respond strongly to frequent practice, so three full-body sessions give each muscle three exposures a week. "
            "Stopping a rep or two short of failure grows muscle almost as well as failure (Refalo et al. 2023) while letting you learn the lifts safely. "
            "Machines sit alongside the barbell so every muscle gets trained hard even before your technique is perfect."),
})

# 5. Arnold split -------------------------------------------------------------------
P.append({
    "id": "golden-era-six",
    "name": "Golden Era Six",
    "hook": "Chest and back, shoulders and arms, legs, twice a week. The classic old-school split rebuilt with modern exercise selection.",
    "description": ("For advanced lifters who recover well and want high-volume, high-frequency training in the style of the 1970s. "
                    "Chest and back are trained together with alternating sets, so you get a huge upper-body pump and save time. Shoulders and arms get their own day, "
                    "so arms are trained fresh rather than as an afterthought. Every session appears in two versions, so you hit each muscle twice a week from different angles."),
    "level": "advanced", "setting": "gym", "days_per_week": 6, "length_weeks": 6,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "smith", "pull-up bar", "dip bars"],
    "machines_used": ["hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension", "reverse pec deck", "standing calf", "seated calf"],
    "effort_style": ("Paired sets: do the first exercise, rest about 60 seconds, do the second, rest about 90 seconds, repeat. Barbell lifts stop at the last perfect rep; "
                     "everything else goes to failure."),
    "schedule": ["Chest & Back A", "Shoulders & Arms A", "Legs A", "Chest & Back B", "Shoulders & Arms B", "Legs B", "Rest"],
    "rotation": {"type": "fixed", "summary": "Six distinct sessions run in the same order every week."},
    "sessions": [
        S("cb-a", "Chest & Back A", ["chest", "lats", "upper back"], [
            E("Incline barbell press", 3, "6-10", "60 sec, then pull", TECH, None, "Touch just below the collarbone with shoulder blades pinned.", "A1"),
            E("Weighted pull-up", 3, "6-10", "90 sec, then press", TECH, None, "Wide grip, dead hang, chest to the bar.", "A2"),
            E("Flat dumbbell press", 3, "8-12", "60 sec", FAIL, None, "Let the dumbbells sink to a deep stretch.", "B1"),
            E("Chest-supported T-bar row", 3, "8-12", "90 sec", FAIL, RP, "Row to the lower ribs.", "B2"),
            E("Dumbbell pullover", 2, "10-12", "90 sec", FAIL, LP, "Lie across a bench, arms slightly bent, lower behind the head until chest and lats are fully stretched."),
            E("Seated cable fly", 2, "12-15", "45 sec", FAIL, None, "Wide arc, pause in the stretch.", "C1"),
            E("Straight-arm cable pulldown", 2, "12-15", "60 sec", FAIL, None, "Arms long, sweep to the thighs.", "C2"),
        ], 70),
        S("sa-a", "Shoulders & Arms A", ["delts", "biceps", "triceps"], [
            E("Seated barbell overhead press (Smith or free)", 3, "6-10", "2-3 min", TECH, None, "Press in a straight line, head through at the top."),
            E("Dumbbell lateral raise", 4, "10-15", "60 sec", FAIL, RUN_RACK, "Lead with the elbows, slight forward lean."),
            E("Reverse pec deck", 3, "12-15", "60 sec", FAIL, None, "Push wide, shoulders down."),
            E("Barbell curl", 3, "8-10", "60 sec, then press", FAIL, None, "Elbows slightly forward, no hip swing.", "A1"),
            E("Close-grip bench press", 3, "8-10", "90 sec, then curl", TECH, None, "Hands just inside shoulder width, elbows tucked.", "A2"),
            E("Incline dumbbell curl", 2, "10-12", "60 sec", FAIL, LP, "Arms hang behind the torso.", "B1"),
            E("Overhead dumbbell triceps extension", 2, "10-12", "60 sec", FAIL, LP, "One heavy dumbbell held in both hands, deep stretch behind the head.", "B2"),
        ], 70),
        S("legs-a", "Legs A", ["quads", "hamstrings", "calves", "abs"], [
            E("High-bar back squat", 4, "6-10", "3-4 min", TECH, None, "Brace, sit between your heels, full depth."),
            E("Leg press", 3, "10-15", "2 min", FAIL, None, "Deep, controlled, lower back on the pad."),
            E("Lying leg curl", 3, "10-12", "90 sec", FAIL, DROP, "Hips down, 3-second lowering."),
            E("Leg extension", 3, "12-15", "90 sec", FAIL, LP, "Pause at the top."),
            E("Standing calf raise", 5, "10-15", "60 sec", FAIL, None, PAUSE_BOTTOM + ". Calves get extra sets in this programme."),
            E("Hanging leg raise", 3, "10-15", "60 sec", HARD, None, "Curl the pelvis up."),
        ], 70),
        S("cb-b", "Chest & Back B", ["chest", "upper back", "lats"], [
            E("Barbell bench press", 3, "6-8", "60 sec, then row", TECH, None, "Touch mid-chest and drive back towards your face.", "A1"),
            E("Barbell row", 3, "6-10", "90 sec, then press", TECH, None, "Torso at 45 degrees, row to the belly button, back stays flat.", "A2"),
            E("Weighted dip", 3, "8-12", "60 sec", FAIL, None, "Lean forward for chest.", "B1"),
            E("Close-grip chin-up", 3, "8-12", "90 sec", FAIL, None, "Underhand, shoulder-width, full stretch at the bottom.", "B2"),
            E("Low-to-high cable fly", 2, "12-15", "60 sec", FAIL, LP, "Sweep up to eye level."),
            E("Single-arm seated cable row", 2, "10-12 per arm", "60 sec", FAIL, LP, "Rotate slightly into the stretch, pull the elbow past your torso."),
        ], 65),
        S("sa-b", "Shoulders & Arms B", ["delts", "biceps", "triceps"], [
            E("Seated dumbbell shoulder press", 3, "8-10", "2 min", LASTFAIL, None, "Lower to ear height."),
            E("Single-arm cable lateral raise", 4, "12-15", "60 sec", FAIL, MYO, "Cable behind you, stop at shoulder height."),
            E("Wide-grip cable upright row", 2, "10-12", "60 sec", FAIL, None, "Hands wider than shoulders, pull elbows out to chest height only."),
            E("Face pull", 2, "15-20", "60 sec", FAIL, None, "Finish with hands beside your ears."),
            E("EZ-bar preacher curl", 3, "8-12", "60 sec, then extend", FAIL, None, "Full stretch at the bottom, no bouncing.", "A1"),
            E("EZ-bar skull crusher", 3, "8-12", "90 sec, then curl", FAIL, None, "Lower behind the head.", "A2"),
            E("Cable rope hammer curl", 2, "12-15", "45 sec", FAIL, None, "Thumbs up, elbows still.", "B1"),
            E("Triceps pushdown (rope)", 2, "12-15", "60 sec", FAIL, DROP, "Elbows pinned.", "B2"),
        ], 70),
        S("legs-b", "Legs B", ["hamstrings", "glutes", "quads", "calves"], [
            E("Romanian deadlift", 3, "6-10", "3 min", TECH, None, "Hips back, flat back."),
            E("Hack squat", 3, "8-12", "2-3 min", FAIL, DROP, "Deep, 2-second descent."),
            E("Seated leg curl", 3, "10-12", "90 sec", FAIL, LP, "Lean forward for a bigger stretch."),
            E("Dumbbell walking lunge", 2, "12 per leg", "2 min", HARD, None, "Long stride."),
            E("Seated calf raise", 5, "12-15", "60 sec", FAIL, MYO, "Full stretch at the bottom."),
            E("Cable crunch", 3, "10-15", "60 sec", HARD, None, "Ribs to hips."),
        ], 65),
    ],
    "weeks": standard_weeks(6, ["cb-a", "sa-a", "legs-a", "cb-b", "sa-b", "legs-b"]),
    "progression": PROGRESSION_DOUBLE,
    "deload": DELOAD_STANDARD,
    "why": ("Pairing chest with back lets one muscle rest while its opposite works, which keeps performance high and shortens sessions. "
            "Giving shoulders and arms a dedicated day means they get trained fresh twice a week instead of tired at the end of a big compound session. "
            "Weekly volume is high, so this suits advanced lifters who have the recovery to use it; the Pelland et al. (2024) data shows extra sets still add growth, just with diminishing returns."),
})
