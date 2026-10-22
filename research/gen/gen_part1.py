# Shared helpers and constants for the premade programme library.

def E(name, sets, reps, rest, effort, technique=None, cue="", group=None):
    d = {"exercise": name, "sets": sets, "reps": reps, "rest": rest, "effort": effort,
         "technique": technique, "cue": cue}
    if group:
        d["superset"] = group
    return d

def S(sid, name, focus, exercises, minutes=None, note=None):
    d = {"id": sid, "name": name, "focus": focus, "exercises": exercises}
    if minutes:
        d["approx_minutes"] = minutes
    if note:
        d["note"] = note
    return d

# Effort wording (plain English, no RIR jargon)
FAIL = "To failure: the last rep you can complete with full range and control"
TECH = "To technical failure: stop at the last rep you can do with perfect form, never grind an ugly rep"
HARD = "Hard: stop when you have about 1 good rep left"
SHY = "Stop with about 2 good reps left"
LASTFAIL = "First sets stop with 1 good rep left; last set to failure"

# Intensity techniques
LP = "After failure, keep going with half reps in the stretched half of the movement until you cannot move it"
DROP = "Last set: drop set. At failure, strip about 25% of the weight and go to failure again"
DDROP = "Last set: double drop set. Strip about 25% twice, going to failure each time"
MYO = "Last set: myo-reps. At failure, rest 5 slow breaths, do 3 to 5 more reps, and repeat 3 times"
RP = "Last set: rest-pause. At failure, rest 15 seconds, go to failure again, then repeat once more"
STATIC = "After the last rep of the final set, hold the deepest stretch for 30 seconds"
NEG = "Last set: at failure, do 2 to 3 extra lowering-only reps taking 4 seconds each (a partner or the other arm lifts it)"
PAUSE_BOTTOM = "Pause 2 seconds in the bottom stretch of every rep"
RUN_RACK = "Last set: run the rack. At failure, grab dumbbells 2 kg lighter and go again, three times in a row"

PROGRESSION_DOUBLE = (
    "Double progression. Each exercise has a rep range. When you hit the top of the range on every working set, "
    "add the smallest load jump next session (2.5 kg on barbells and machines, 1 to 2 kg per dumbbell) and build the reps back up. "
    "On isolation work, add reps first and load second. If you miss the bottom of the range, keep the weight and beat it next time.")

DELOAD_STANDARD = (
    "The final week is a deload: same sessions and exercises, half the sets, the same weights or 10% lighter, and every set stops "
    "with 3 or more reps left. No intensity techniques. Take an early deload if your main lifts go backwards two sessions in a row, "
    "sleep and motivation drop, or joints start to ache.")

def standard_weeks(n_weeks, order, deload=True, calibrate=True):
    """Week-by-week plan for straight blocks that repeat the same week."""
    weeks = []
    for w in range(1, n_weeks + 1):
        if deload and w == n_weeks:
            note = "Deload. Half the sets, same or slightly lighter weights, nothing near failure, no intensity techniques."
        elif calibrate and w == 1:
            note = ("Calibration week. Run every session but stop each set with about 2 good reps left and skip intensity techniques. "
                    "Log every weight and rep: this is your baseline.")
        elif calibrate and w == 2:
            note = "Train as written. Sets marked to failure now go to failure. Intensity techniques stay off for one more week."
        else:
            note = "Full programme, intensity techniques on. Beat last week on every exercise by at least one rep or a small load jump."
        weeks.append({"week": w, "sessions": order, "focus": note})
    return weeks

def ab_weeks(n_weeks, order_a, order_b, deload=True):
    weeks = []
    for w in range(1, n_weeks + 1):
        order = order_a if w % 2 == 1 else order_b
        label = "Week A" if w % 2 == 1 else "Week B"
        if deload and w == n_weeks:
            note = f"{label}, deload. Half the sets, same or slightly lighter weights, nothing near failure."
        elif w == 1:
            note = f"{label}. Calibration: stop every set with about 2 good reps left, skip techniques, log everything."
        elif w == 2:
            note = f"{label}. Calibration for the B sessions: stop every set with about 2 good reps left, log everything."
        else:
            note = f"{label}. Full effort and intensity techniques. Beat the numbers from the last time you ran this exact session."
        weeks.append({"week": w, "rotation": label, "sessions": order, "focus": note})
    return weeks
