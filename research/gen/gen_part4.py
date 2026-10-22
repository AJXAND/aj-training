from gen_part1 import *
from gen_part3 import P

# 11. V-taper ---------------------------------------------------------------------------
P.append({
    "id": "wide-frame-v-taper",
    "name": "Wide Frame",
    "hook": "Shoulders four times a week and lats three times. A five-day plan built to widen your frame and sharpen the V-taper.",
    "description": ("For intermediate lifters who want broader shoulders and a wider back so the waist looks smaller. "
                    "Side delts are trained four times a week and lats three times, always early in the session. Chest, legs and arms stay at a strong working volume. "
                    "There is no heavy weighted oblique work, because building the waist is the opposite of what this plan is for."),
    "level": "intermediate", "setting": "gym", "days_per_week": 5, "length_weeks": 6,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "smith", "pull-up bar"],
    "machines_used": ["chest press", "lateral raise machine", "hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension", "reverse pec deck", "standing calf", "seated calf"],
    "effort_style": ("Lateral raises, pulldowns and all isolation work go to failure every set. Pull-ups, presses and squats stop at the last perfect rep."),
    "schedule": ["Upper (Width)", "Lower", "Delts & Arms", "Rest", "Upper (Chest & Back)", "Lower + Delts", "Rest"],
    "rotation": {"type": "fixed", "summary": "Five sessions repeated weekly."},
    "sessions": [
        S("wf-upper-width", "Upper: Width", ["side delts", "lats", "chest", "rear delts"], [
            E("Single-arm cable lateral raise", 3, "12-15", "60 sec", FAIL, MYO, "Starts the session while you are fresh. Lead with the elbow."),
            E("Weighted pull-up (wide grip)", 3, "6-10", "3 min", TECH, None, "Dead hang, drive the elbows down and out."),
            E("Half-kneeling single-arm cable pulldown", 3, "10-12", "90 sec", FAIL, LP, "Reach high, pull the elbow to your hip."),
            E("Incline dumbbell press", 3, "8-10", "2 min", LASTFAIL, None, "30 degree bench."),
            E("Chest-supported machine row", 2, "10-12", "90 sec", FAIL, None, "Drive the elbows back."),
            E("Reverse pec deck", 2, "15-20", "60 sec", FAIL, DROP, "Push wide."),
        ], 65),
        S("wf-lower", "Lower", ["quads", "hamstrings", "calves", "abs"], [
            E("Hack squat", 3, "6-10", "3 min", LASTFAIL, None, "Deep, 2-second descent."),
            E("Romanian deadlift", 3, "8-10", "3 min", TECH, None, "Hips back, flat back."),
            E("Leg extension", 2, "12-15", "90 sec", FAIL, DROP, "Pause at the top."),
            E("Seated leg curl", 2, "10-12", "90 sec", FAIL, LP, "Lean forward."),
            E("Standing calf raise", 3, "10-12", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
            E("Hanging leg raise", 2, "10-15", "60 sec", HARD, None, "Curl the pelvis up. Trains the abs without thickening the waist."),
        ], 60),
        S("wf-delts-arms", "Delts & Arms", ["side delts", "front delts", "rear delts", "biceps", "triceps"], [
            E("Seated dumbbell shoulder press", 3, "8-10", "2 min", LASTFAIL, None, "Lower to ear height."),
            E("Dumbbell lateral raise", 4, "12-20", "60 sec", FAIL, RUN_RACK, "Lead with the elbows."),
            E("Cable Y-raise", 2, "12-15", "60 sec", FAIL, None, "Cables crossed low, raise in a Y shape to just above head height."),
            E("Rear delt cable fly", 2, "15-20", "45 sec", FAIL, None, "Pull wide at shoulder height."),
            E("Bayesian cable curl", 3, "10-12", "60 sec", FAIL, LP, "Arm behind the body.", "A1"),
            E("Overhead cable triceps extension", 3, "10-12", "60 sec", FAIL, LP, "Deep stretch behind the head.", "A2"),
            E("Cable rope hammer curl", 2, "12-15", "45 sec", FAIL, None, "Thumbs up.", "B1"),
            E("Triceps pushdown (rope)", 2, "12-15", "45 sec", FAIL, DROP, "Elbows pinned.", "B2"),
        ], 65),
        S("wf-upper-cb", "Upper: Chest & Back", ["chest", "lats", "upper back", "side delts"], [
            E("Incline Smith machine press", 3, "6-10", "2-3 min", LASTFAIL, None, "Bar to the upper chest."),
            E("Neutral-grip lat pulldown", 3, "8-12", "2 min", FAIL, DROP, "Full stretch at the top."),
            E("Machine chest press", 2, "10-12", "2 min", FAIL, None, "Deep stretch."),
            E("Wide-grip seated cable row", 3, "10-12", "90 sec", FAIL, None, "Elbows out, pull to the lower chest."),
            E("Cable pullover (rope)", 2, "12-15", "60 sec", FAIL, None, "Arms nearly straight."),
            E("Lean-away dumbbell lateral raise", 2, "12-15 per arm", "60 sec", FAIL, LP, "Hold a post and lean away."),
        ], 65),
        S("wf-lower-delts", "Lower + Delts", ["quads", "glutes", "hamstrings", "side delts", "rear delts"], [
            E("Leg press", 3, "10-15", "2 min", LASTFAIL, None, "Deep and controlled."),
            E("Lying leg curl", 3, "10-12", "90 sec", FAIL, DROP, "Hips down."),
            E("Bulgarian split squat", 2, "10-12 per leg", "2 min", HARD, None, "Long stride."),
            E("Seated calf raise", 3, "12-15", "60 sec", FAIL, None, "Full stretch at the bottom."),
            E("Machine lateral raise", 3, "12-15", "60 sec", FAIL, MYO, "Pads on the outside of the elbows, lead with them."),
            E("Face pull", 2, "15-20", "45 sec", FAIL, None, "Hands finish beside your ears."),
        ], 60),
    ],
    "weeks": standard_weeks(6, ["wf-upper-width", "wf-lower", "wf-delts-arms", "wf-upper-cb", "wf-lower-delts"]),
    "progression": PROGRESSION_DOUBLE + " On lateral raises, chase reps hard before adding weight: strict 20-rep sets beat sloppy heavy ones.",
    "deload": DELOAD_STANDARD,
    "why": ("Shoulder width comes mostly from the side delts and lat width, and both respond well to frequent, moderately heavy, high-effort work. "
            "Splitting about 16 to 20 weekly side delt sets across four days keeps each session short enough to do with full effort. "
            "Lengthened-position choices like single-arm pulldowns and lean-away raises add tension where the evidence suggests growth is greatest."),
})

# 12. Arm specialisation -----------------------------------------------------------------
P.append({
    "id": "sleeves-up-arm-spec",
    "name": "Sleeves Up",
    "hook": "A six-week arm specialisation block. Arms trained first, three times a week, while the rest of you holds steady.",
    "description": ("For intermediate lifters whose arms have stopped growing on a normal programme. "
                    "For six weeks, biceps and triceps move to the front of the session on both upper days and get a dedicated pump block at the end of the second lower day. "
                    "Chest, back and legs drop to a lower but still effective volume so you can recover from the extra arm work. Run it, then go back to a balanced programme."),
    "level": "intermediate", "setting": "gym", "days_per_week": 4, "length_weeks": 6,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines", "pull-up bar", "dip bars"],
    "machines_used": ["chest press", "hack squat", "leg press", "seated leg curl", "lying leg curl", "leg extension", "reverse pec deck", "preacher curl", "standing calf", "seated calf"],
    "effort_style": ("Every arm set goes to failure, with stretched half reps or drop sets on the last set. Compound lifts for the rest of the body stop at the last perfect rep."),
    "schedule": ["Upper A (Arms First)", "Lower A", "Rest", "Upper B (Arms First)", "Lower B + Arm Pump", "Rest", "Rest"],
    "rotation": {"type": "fixed", "summary": "Four sessions repeated weekly; arms are trained three times."},
    "sessions": [
        S("su-upper-a", "Upper A: Arms First", ["biceps", "triceps", "back", "chest"], [
            E("EZ-bar curl", 3, "6-10", "60 sec, then press", FAIL, None, "Elbows slightly forward, no hip swing, 2-second lowering.", "A1"),
            E("Close-grip bench press", 3, "6-10", "90 sec, then curl", TECH, None, "Elbows tucked, touch the lower chest.", "A2"),
            E("Incline dumbbell curl", 3, "10-12", "60 sec", FAIL, LP, "Arms hang behind the torso.", "B1"),
            E("Overhead cable triceps extension", 3, "10-12", "60 sec", FAIL, LP, "Deep stretch behind the head.", "B2"),
            E("Chin-up (underhand)", 2, "6-10", "2 min", TECH, None, "Full stretch at the bottom. Hits the biceps hard too."),
            E("Incline machine chest press", 2, "8-12", "2 min", FAIL, None, "Deep stretch."),
            E("Chest-supported machine row", 2, "8-12", "90 sec", FAIL, None, "Drive the elbows back."),
            E("Single-arm cable lateral raise", 2, "12-15", "45 sec", FAIL, None, "Lead with the elbow."),
        ], 70),
        S("su-lower-a", "Lower A", ["quads", "hamstrings", "calves"], [
            E("Hack squat", 3, "6-10", "3 min", LASTFAIL, None, "Deep, 2-second descent."),
            E("Romanian deadlift", 3, "8-10", "3 min", TECH, None, "Hips back, flat back."),
            E("Seated leg curl", 2, "10-12", "90 sec", FAIL, LP, "Lean forward."),
            E("Leg extension", 2, "12-15", "90 sec", FAIL, None, "Pause at the top."),
            E("Standing calf raise", 3, "10-12", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
        ], 55),
        S("su-upper-b", "Upper B: Arms First", ["biceps", "triceps", "back", "shoulders"], [
            E("Bayesian cable curl", 3, "10-12 per arm", "60 sec", FAIL, LP, "Arm behind the body, elbow stays back.", "A1"),
            E("EZ-bar skull crusher", 3, "8-12", "60 sec", FAIL, None, "Lower the bar behind your head.", "A2"),
            E("Cross-body dumbbell hammer curl", 3, "8-12", "60 sec", FAIL, None, "Curl across to the opposite shoulder.", "B1"),
            E("Weighted dip (upright)", 3, "8-12", "90 sec", FAIL, None, "Torso upright to bias triceps.", "B2"),
            E("Neutral-grip lat pulldown", 2, "8-12", "2 min", FAIL, None, "Full stretch at the top."),
            E("Seated dumbbell shoulder press", 2, "8-10", "2 min", HARD, None, "Lower to ear height."),
            E("Wide-grip seated cable row", 2, "10-12", "90 sec", FAIL, None, "Elbows out."),
            E("Reverse pec deck", 2, "15-20", "45 sec", FAIL, None, "Push wide."),
        ], 70),
        S("su-lower-b", "Lower B + Arm Pump", ["quads", "glutes", "hamstrings", "biceps", "triceps", "forearms"], [
            E("Leg press", 3, "10-15", "2 min", LASTFAIL, None, "Deep and controlled."),
            E("Lying leg curl", 3, "10-12", "90 sec", FAIL, None, "Hips down."),
            E("Dumbbell walking lunge", 2, "10 per leg", "2 min", HARD, None, "Long stride."),
            E("Seated calf raise", 3, "12-15", "60 sec", FAIL, None, "Full stretch at the bottom."),
            E("Machine preacher curl", 2, "12-15", "45 sec", FAIL, DROP, "Full stretch at the bottom.", "A1"),
            E("Triceps pushdown (rope)", 2, "12-15", "45 sec", FAIL, DROP, "Elbows pinned.", "A2"),
            E("Reverse-grip EZ-bar curl", 2, "12-15", "45 sec", FAIL, None, "Overhand grip. Builds the forearms and brachialis for thicker-looking arms."),
        ], 60),
    ],
    "weeks": standard_weeks(6, ["su-upper-a", "su-lower-a", "su-upper-b", "su-lower-b"]),
    "progression": PROGRESSION_DOUBLE + " Measure your relaxed upper arm at the start and end of the block, same time of day, same tape.",
    "deload": DELOAD_STANDARD + " After the block, return to a balanced programme for at least 6 weeks before specialising again.",
    "why": ("Exercises performed first in a session are performed better, so moving arm work to the front lets the arms take the best sets of the day. "
            "About 15 to 18 direct sets per arm muscle each week, spread over three sessions, is well above what most programmes give the arms but still recoverable for a short block. "
            "Overhead triceps extensions grow the triceps more than pushdowns (Maeo et al. 2023), and stretch-biased curls follow the same logic for the biceps."),
})

# 13. Minimalist 2-day ---------------------------------------------------------------------
P.append({
    "id": "twice-weekly-minimalist",
    "name": "Twice Weekly",
    "hook": "Two full-body sessions a week, about an hour each. The smallest programme that still builds real muscle.",
    "description": ("For busy people, students in exam season, parents, or anyone who can only get to the gym twice a week. "
                    "Each session trains the whole body with the best exercise for each muscle and asks for honest, hard effort on every set. "
                    "Volume is low, so effort has to be high; that trade works well for beginners and is a solid maintenance or slow-gain plan for experienced lifters."),
    "level": "beginner", "setting": "gym", "days_per_week": 2, "length_weeks": 8,
    "equipment": ["barbell", "rack", "bench", "dumbbells", "cable", "machines"],
    "machines_used": ["hack squat", "leg press", "seated leg curl", "standing calf"],
    "effort_style": ("Machine and cable sets go to failure. Barbell lifts stop with 1 good rep left. No rest-pause or drop sets: on a two-day plan, clean hard sets are enough."),
    "schedule": ["Session A", "Rest", "Rest", "Session B", "Rest", "Rest", "Rest"],
    "rotation": {"type": "fixed", "summary": "Two sessions, two or three days apart."},
    "sessions": [
        S("tw-a", "Session A", ["full body"], [
            E("Hack squat", 3, "6-10", "3 min", HARD, None, "Deep, 2-second descent."),
            E("Barbell bench press", 3, "6-10", "3 min", HARD, None, "Touch mid-chest, shoulder blades pinned."),
            E("Lat pulldown", 3, "8-12", "2 min", FAIL, None, "Full stretch at the top, pull to the upper chest."),
            E("Seated leg curl", 2, "10-12", "90 sec", FAIL, None, "Lean forward."),
            E("Dumbbell lateral raise", 2, "12-15", "60 sec", FAIL, None, "Lead with the elbows."),
            E("Incline dumbbell curl", 2, "10-12", "60 sec", FAIL, None, "Arms behind the torso.", "A1"),
            E("Overhead cable triceps extension", 2, "10-12", "60 sec", FAIL, None, "Elbows by your ears.", "A2"),
            E("Standing calf raise", 2, "10-15", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
        ], 60),
        S("tw-b", "Session B", ["full body"], [
            E("Romanian deadlift", 3, "6-10", "3 min", TECH, None, "Hips back, flat back."),
            E("Incline dumbbell press", 3, "8-12", "2 min", FAIL, None, "30 degree bench."),
            E("Chest-supported dumbbell row", 3, "8-12", "2 min", FAIL, None, "Face down on an incline bench, row to your hips."),
            E("Leg press", 2, "10-15", "2 min", FAIL, None, "Deep and controlled."),
            E("Single-arm cable lateral raise", 2, "12-15", "60 sec", FAIL, None, "Lead with the elbow."),
            E("Bayesian cable curl", 2, "10-12", "60 sec", FAIL, None, "Arm behind the body.", "A1"),
            E("Triceps pushdown (rope)", 2, "12-15", "60 sec", FAIL, None, "Elbows pinned.", "A2"),
        ], 60),
    ],
    "weeks": [
        {"week": w, "sessions": ["tw-a", "tw-b"],
         "focus": ("Find your weights. Stop every set with about 2 good reps left." if w == 1
                   else "Lighter week: two sets per exercise, nothing near failure." if w == 8
                   else "Full effort. Beat last week on every exercise.")}
        for w in range(1, 9)],
    "progression": PROGRESSION_DOUBLE,
    "deload": "Week 8 is a lighter week. After that, deload only when progress stalls across several lifts.",
    "why": ("Reviews of minimal-dose training (Iversen et al. 2021) show that a few hard sets per muscle twice a week reliably builds strength and muscle, especially in newer lifters. "
            "Because growth depends heavily on how close sets get to failure (Robinson et al. 2024), the low set count is offset by high effort. "
            "Two sessions, two or three days apart, gives each muscle two exposures and full recovery between them."),
})

# 14. Home dumbbell-only ---------------------------------------------------------------------
P.append({
    "id": "home-iron-dumbbell",
    "name": "Home Iron",
    "hook": "A four-day upper and lower plan that builds real muscle with nothing but a pair of adjustable dumbbells and a bench.",
    "description": ("For anyone training at home with adjustable dumbbells and a bench. "
                    "The limitation with dumbbells is load, especially for legs, so this plan uses single-leg exercises, slow lowering, paused reps and higher rep ranges "
                    "to make moderate weights genuinely hard. Every set is taken close to or to failure, because that is what makes lighter loads work."),
    "level": "beginner", "setting": "home", "days_per_week": 4, "length_weeks": 6,
    "equipment": ["dumbbells", "bench"],
    "optional_equipment": ["pull-up bar", "bands"],
    "machines_used": [],
    "effort_style": ("Every working set goes to failure or within one rep of it. With limited weights, slow 3-second lowering and pauses are how you keep sets hard."),
    "schedule": ["Upper A", "Lower A", "Rest", "Upper B", "Lower B", "Rest", "Rest"],
    "rotation": {"type": "fixed", "summary": "Four sessions repeated weekly."},
    "sessions": [
        S("hi-upper-a", "Upper A", ["chest", "back", "shoulders", "arms"], [
            E("Dumbbell bench press", 3, "8-15", "2 min", LASTFAIL, None, "Lower over 3 seconds to a deep stretch, then press."),
            E("Single-arm dumbbell row", 3, "10-15 per arm", "90 sec", FAIL, None, "Brace on the bench, row to your hip, full stretch at the bottom."),
            E("Seated dumbbell shoulder press", 3, "8-12", "2 min", LASTFAIL, None, "Bench just short of upright."),
            E("Chest-supported dumbbell row (wide)", 2, "12-15", "90 sec", FAIL, None, "Face down on an incline bench, elbows out, for upper back and rear delts."),
            E("Dumbbell lateral raise", 3, "12-20", "60 sec", FAIL, MYO, "Lead with the elbows."),
            E("Lying dumbbell triceps extension", 2, "10-15", "60 sec", FAIL, LP, "Lower the dumbbells behind your head for a deep stretch.", "A1"),
            E("Incline dumbbell curl", 2, "10-15", "60 sec", FAIL, LP, "Arms behind the torso.", "A2"),
        ], 60),
        S("hi-lower-a", "Lower A", ["quads", "glutes", "hamstrings", "calves"], [
            E("Bulgarian split squat", 3, "8-12 per leg", "2 min", FAIL, None, "The main leg builder. Dumbbells in each hand, 3-second lowering, sink deep."),
            E("Dumbbell Romanian deadlift", 3, "10-15", "2 min", TECH, None, "3-second lowering, pause in the stretch."),
            E("Heel-elevated dumbbell goblet squat", 3, "12-20", "90 sec", FAIL,
              "Last set: mechanical drop. At failure, put the dumbbell down and do bodyweight heel-elevated squats to failure",
              "Heels on plates or a wedge. Upright torso, knees forward, deep."),
            E("Single-leg dumbbell hip thrust", 2, "10-15 per leg", "60 sec", FAIL, None, "Shoulders on the bench, dumbbell on the working hip."),
            E("Single-leg dumbbell calf raise", 3, "10-15 per leg", "60 sec", FAIL, LP, "Stand on a step. " + PAUSE_BOTTOM + "."),
        ], 55),
        S("hi-upper-b", "Upper B", ["chest", "lats", "shoulders", "arms"], [
            E("Incline dumbbell press", 3, "8-12", "2 min", LASTFAIL, None, "30 degree bench, deep stretch."),
            E("Dumbbell pullover", 3, "10-15", "90 sec", FAIL, LP, "Across the bench, lower behind the head for a full lat and chest stretch."),
            E("Pull-up (if you have a bar) or single-arm dumbbell row", 3, "6-12", "2 min", FAIL, None, "Pull-ups with a dead hang, or rows with a 2-second pause at the top."),
            E("Lean-away dumbbell lateral raise", 3, "12-15 per arm", "60 sec", FAIL, None, "Hold a door frame and lean away."),
            E("Dumbbell fly", 2, "12-15", "60 sec", FAIL, LP, "Soft elbows, stretch wide at the bottom."),
            E("Dumbbell hammer curl", 2, "10-15", "60 sec", FAIL, None, "Thumbs up.", "A1"),
            E("Overhead dumbbell triceps extension", 2, "10-15", "60 sec", FAIL, None, "One dumbbell in both hands, deep stretch.", "A2"),
        ], 60),
        S("hi-lower-b", "Lower B", ["glutes", "hamstrings", "quads", "calves", "abs"], [
            E("Deficit dumbbell reverse lunge", 3, "8-12 per leg", "2 min", FAIL, None, "Front foot on a low step, step back and sink deep."),
            E("Single-leg dumbbell Romanian deadlift", 3, "10-12 per leg", "90 sec", TECH, None, "Hold a wall lightly for balance so you can load it."),
            E("Lying dumbbell leg curl", 2, "10-15", "90 sec", FAIL, None, "Face down on a bench, dumbbell between your feet. Use a light weight and a partner to place it at first."),
            E("Dumbbell step-up", 2, "10-12 per leg", "90 sec", HARD, None, "Knee-height step, drive through the top foot, no push from the back leg."),
            E("Standing dumbbell calf raise", 3, "15-20", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
            E("Dumbbell weighted crunch", 2, "12-15", "60 sec", HARD, None, "Ribs to hips."),
        ], 55),
    ],
    "weeks": standard_weeks(6, ["hi-upper-a", "hi-lower-a", "hi-upper-b", "hi-lower-b"]),
    "progression": ("Rep-first progression. Work up to the top of the rep range on every set, then go up one dumbbell increment. If you are already at your heaviest dumbbells, "
                    "progress by adding a 3-second lowering, then a pause in the stretch, then an extra set, in that order."),
    "deload": DELOAD_STANDARD,
    "why": ("Loads anywhere from about 30% of your max upwards build similar muscle when sets are taken close to failure (Schoenfeld et al. 2017; Lasevicius et al. 2018), so dumbbells are enough if effort is high. "
            "Single-leg work like Bulgarian split squats doubles the effective load on each leg. "
            "Slow lowering and stretch pauses make each rep harder without needing heavier weights."),
})

# 15. Bodyweight / calisthenics -------------------------------------------------------------------
P.append({
    "id": "gravity-built-calisthenics",
    "name": "Gravity Built",
    "hook": "A four-day bodyweight plan that builds muscle with a pull-up bar, dip bars and bands. Harder variations replace heavier weights.",
    "description": ("For anyone training at home, in a park or while travelling who wants to build muscle, not just endurance. "
                    "Every exercise has a ladder of variations: when you hit the top of the rep range, you move to the harder version. "
                    "You will need a pull-up bar, dip bars or parallel bars, a resistance band and a backpack you can load with books for extra weight."),
    "level": "intermediate", "setting": "both", "days_per_week": 4, "length_weeks": 8,
    "equipment": ["pull-up bar", "dip bars", "bands", "bodyweight"],
    "machines_used": [],
    "effort_style": ("Every set goes to failure or within one rep of it. With bodyweight, lighter variations only build muscle when you push them hard, so finishing sets close to failure is non-negotiable."),
    "schedule": ["Upper A", "Lower A", "Rest", "Upper B", "Lower B", "Rest", "Rest"],
    "rotation": {"type": "fixed", "summary": "Four sessions repeated weekly; exercise variations get harder as you progress."},
    "sessions": [
        S("gb-upper-a", "Upper A", ["lats", "chest", "shoulders", "triceps"], [
            E("Pull-up", 4, "5-12", "2-3 min", LASTFAIL, None, "Dead hang, chest to the bar. Under 5 reps: use a band. Over 12: add a loaded backpack."),
            E("Dip", 4, "6-15", "2 min", LASTFAIL, None, "Slight forward lean, sink until shoulders are below elbows. Over 15: add the backpack."),
            E("Feet-elevated inverted row", 3, "8-15", "90 sec", FAIL, None, "Under a low bar or sturdy table. Pull your chest to the bar, body straight."),
            E("Feet-elevated pike push-up", 3, "6-12", "2 min", FAIL, None, "Hips high, lower the top of your head towards the floor in front of your hands."),
            E("Banded lateral raise", 3, "15-25", "60 sec", FAIL, MYO, "Stand on the band, lead with the elbows."),
            E("Bodyweight triceps extension", 2, "8-15", "90 sec", FAIL, None, "Hands on a bar at hip height, lower your forehead under the bar by bending the elbows. Higher bar is easier."),
        ], 60),
        S("gb-lower-a", "Lower A", ["quads", "glutes", "hamstrings", "calves", "core"], [
            E("Bulgarian split squat", 3, "10-20 per leg", "2 min", FAIL, "Last set: mechanical drop to reverse lunges to failure", "3-second lowering, deep. Add the backpack once you pass 20."),
            E("Nordic hamstring curl (lowering only)", 3, "4-8", "2 min", FAIL, None, "Anchor your heels under a sofa or bar. Lower as slowly as you can, catch yourself with your hands, push back up."),
            E("Assisted sissy squat", 3, "8-15", "90 sec", FAIL, None, "Hold a post, rise onto your toes, let your knees travel forward as you lean back. Huge quad stretch."),
            E("Single-leg hip thrust", 3, "10-20 per leg", "60 sec", FAIL, None, "Shoulders on a sofa or bench, drive through the heel and hold the top."),
            E("Single-leg calf raise off a step", 3, "12-20 per leg", "60 sec", FAIL, LP, PAUSE_BOTTOM + "."),
            E("Hollow body hold", 3, "20-40 sec", "60 sec", HARD, None, "Lower back pressed into the floor."),
        ], 55),
        S("gb-upper-b", "Upper B", ["back", "chest", "biceps", "rear delts"], [
            E("Chin-up", 4, "5-12", "2-3 min", LASTFAIL, NEG, "Underhand, full stretch at the bottom. Add the backpack over 12."),
            E("Deficit push-up (progress to archer push-up)", 4, "8-20", "2 min", FAIL, None, "Hands on handles or books so the chest sinks deep. At 20, switch to archer push-ups."),
            E("Wide inverted row", 3, "8-15", "90 sec", FAIL, None, "Wide grip, pull to the lower chest, elbows out."),
            E("Pseudo-planche push-up", 3, "6-12", "2 min", FAIL, None, "Hands turned out by your hips, lean forward over them. Hits front delts and chest."),
            E("Banded face pull", 2, "15-25", "60 sec", FAIL, None, "Band anchored at head height, pull apart to your ears."),
            E("Banded curl", 3, "12-20", "60 sec", FAIL, LP, "Stand on the band, elbows still."),
        ], 60),
        S("gb-lower-b", "Lower B", ["quads", "hamstrings", "glutes", "calves", "abs"], [
            E("Shrimp squat or pistol squat to a box", 3, "5-10 per leg", "2 min", FAIL, None, "Choose the variation that lands you in the rep range. Lower the box as you get stronger."),
            E("Sliding leg curl", 3, "8-15", "90 sec", FAIL, None, "Lie on your back with heels on a towel on a smooth floor. Lift your hips and slide your heels in and out. Go single-leg when easy."),
            E("Heel-elevated cyclist squat", 3, "15-25", "90 sec", FAIL, None, "Heels on a book, feet close together, upright torso, knees far forward."),
            E("High step-up", 2, "10-15 per leg", "90 sec", HARD, None, "Knee-height or higher. Drive through the top foot only."),
            E("Two-leg calf raise off a step", 3, "20-30", "60 sec", FAIL, None, PAUSE_BOTTOM + "."),
            E("Hanging leg raise", 3, "8-15", "60 sec", HARD, None, "Curl the pelvis up, no swinging."),
        ], 55),
    ],
    "weeks": standard_weeks(8, ["gb-upper-a", "gb-lower-a", "gb-upper-b", "gb-lower-b"]),
    "progression": ("Variation ladder. When you hit the top of the rep range on every set, move to the next harder version or add weight in a backpack, "
                    "then build the reps back up. Examples: push-up to deficit push-up to archer push-up; band-assisted pull-up to pull-up to weighted pull-up; "
                    "box pistol to lower box to full pistol."),
    "deload": DELOAD_STANDARD,
    "why": ("Push-ups build chest and triceps as well as the bench press when effort and load are matched (Kikuchi and Nakazato 2017), and light loads grow muscle when taken close to failure. "
            "The variation ladder is how bodyweight training applies progressive overload. "
            "Exercises like Nordic curls, sissy squats and deficit push-ups load muscles in deep stretch, which tends to produce more growth."),
})
