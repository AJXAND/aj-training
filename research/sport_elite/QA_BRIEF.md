You are quality-checking structured sport coaching data for a training app (AJ Training). The files follow /home/claude/ajtraining/research/sport_elite/SCHEMA.md. Read it first. Exercise keys: /home/claude/ajtraining/research/gen/exkeys.tsv (now includes these new keys: pushupplus, decel, isosplit, scrumhold, splitjump, dropstick, landpunch, fingerext, benchthrow).

How the app uses the data (so you know what matters):
- variants: the athlete picks one. Its q and prehab change the plan. NEW FIELD "add": a list of slot objects (same shape as session slots: role, ex, sets{new,inter,adv}, reps, rir, note) that the app inserts into that athlete's gym sessions (shared across the week). The variant "note" is shown to the athlete as what changes in their plan.
- sessions: used as the gym sessions for that season, in order, cycling if they train more days than there are sessions.
- conditioning: placed on days in the week. NEW FIELD "for": list of variant ids; if present, only athletes who picked one of those variants (or no variant) get it.
- tests: shown with bands; the app works out the athlete's band from the number. better = "lower" or "higher". Bands can be "1.85", "1.75-1.85", "<1.72", ">50", "45+". For time in minutes use "m:ss" like "5:15".

For each file you are given, fix in place (keep valid JSON):
1. Variant notes that promise extra work ("Adds scrum isometric holds...", "Extra push press") must be backed by an "add" list with real slots (1-3 slots, keys from exkeys.tsv). Then rewrite the note to say what the plan does, e.g. "Your plan adds scrum holds and extra neck work, and less running." Never promise something the plan doesn't do; advice the athlete does themselves is fine if worded as advice ("Do your kicking practice on fresh legs").
2. Conditioning items meant for one position or event (names or text like "(backs)", "forwards", "bowlers", "goalkeepers") get "for": [matching variant ids] and the position words come out of the name.
3. Use the new exercise keys where the file's missing_ex or notes show they were wanted (e.g. push-up plus, deceleration drill, isometric split squat hold, scrum hold, split jump, drop landing to stick, landmine punch, band finger extension, bench throw). Put the best key first.
4. Every session has at least 3 slots. Max 6 variants per sport (merge the closest if more).
5. Tests: bands must be consistent with "better" (for lower-is-better, elite is the smallest number). Remove a test only if it has no bands AND no clear self-comparison value; otherwise keep (empty bands is allowed: the athlete compares with themselves).
6. Text is shown on a phone to athletes: plain UK English, short, no em or en dashes, no internal keys in backticks, no "N/I/A columns", no references to "the research", "section 7.3", "schema" or "brief". Spell out abbreviations once where unclear (MD-2 is fine: the app explains match-day numbering).
7. Don't change numbers unless they are clearly wrong or inconsistent; don't invent studies or URLs.
8. Remove "missing_ex" entries that are now covered by new keys.

Validate each file: json.load, every ex key (sessions and variant add) in exkeys.tsv, no "—" or "–".
Reply in under 150 words: files checked, main fixes, anything still wrong.
