# Walkthrough feedback log

Recorded during the step-by-step review. Nothing here is fixed yet; we work through the list after the full walkthrough.

## Stop 1: Launch and first-time setup

1. **Section cards look greyed out** on "What do you want to use?" (unselected state is too faded; should look clearly tappable).
2. **Status bar area is black** above the page. It should match the page: fully white in light theme, fully black in dark theme, on every screen.
3. **Body shouldn't be a separate section.** Weight tracking goes hand in hand with food, so it belongs with Nutrition rather than being its own option.
4. **About you design needs work.** Labels/subtitles use inconsistent weights (e.g. "Sex (for energy…)" is dark and large, "First name" / "Date of birth" are grey and small, "Height"/"Weight" are bold headings), and the vertical spacing is uneven.
5. **Date of birth should be typed**, in day/month/year format with an example placeholder (e.g. 01/04/1999), not a date picker.
6. **Height: type it as well as slide, and choose cm or ft/in.**
7. **Height conversion bug:** shows "5 ft 12 in" instead of rolling over to 6 ft 0 in.
8. **Weight: type it as well as slide, choose kg, lb or st/lb, and the range should go up to 200 kg.**
9. **"You're set" cards also look greyed out** (same issue as item 1).
10. **No password reset on the sign-in screen.** ✅ Done straight away (AJ needed it): "Forgot password?" on sign-in (emails a link that opens a set-new-password screen) and "Change password" in Settings → Account.

## Stop 2: Dashboard

11. **Setup prompts are split up**: two setup cards, then the "Today / Rest day" card, then the third setup card. All setup prompts should sit together at the top.
12. **Sections below should show a clear "not set up yet" state** (workout, nutrition, etc.) instead of empty/placeholder content, designed better than a plain "pending" label.
13. **Dashboard layout needs a rethink**: it should be the most useful screen in the app, with real overviews and one-tap quick links to most things.
14. **Food logger redesign** (inspo: MacroFactor's logger, attached): tabs for Scan / Search / AI / Quick add / Library, favourites row, recent foods with one-tap +, running calorie total, log several foods at once. Must look and work distinctly ours, not a copy.
15. **+ menu is decent; make it better.**
16. **Remove every mention of "Claude"** in the app; call it **"AJ Training AI"** for now (to be renamed with the app).
17. **App name needed**: all-in-one life improvement app, propeller logo (for now), main audience gym-goers using it mostly for workouts and food.

Spotted by me during this stop (to check):
- The + menu still says "Habits: Wake time, steps, snus" (AJ-specific).
- Demo shows **1,590 kcal maintenance** for a 75 kg, 175 cm male, which looks far too low; check the starting expenditure for brand-new users.
- Morning weigh-in banner text says "from AJ Training" (will follow the rename).

## Stop 3: Plan builder (gym)

18. **Rename "Both" to "Hybrid".**
19. **More plan types**: e.g. gym-focused but with some running/cardio alongside (not just gym / endurance / hybrid).
20. **Wording on load**: "heavier work mainly adds strength" is wrong when reps are still in the hypertrophy range. Be more precise and careful with claims throughout.
21. **Goal options**: Build muscle, Build strength, Powerbuilding (combo), Aesthetics. Every programme lets you prioritise body parts; Aesthetics actively steers which ones to target for the look you want.
22. **Not male-only**: Aesthetics should let the user choose what they think makes them look best, with different suggested looks/priorities for men and women.
23. **Beginners**: lower volume and slightly higher reps to learn form, but rarely above ~15 reps. Back it with science, including the psychology of training close to failure.
24. **"Which days can you train?" is ambiguous**: is it the days you will train, or days you're available and the plan picks? Real schedules change week to week, so the plan needs a genuinely clever, flexible scheduling solution.
25. **Session length should be evidence-based**: show a recommended sweet spot with guidance either side.
26. **Gym equipment setup is the big one**:
    - Presets: home (a few dumbbells, bands), garage gym (barbell, plates, more dumbbells, dip/pull-up bars), commercial gym, bodybuilding gym, etc., each pre-filled with typical machines.
    - Then tick/untick what your gym actually has, and this must be very fast even for big gyms (incredible UX, not tapping 30 chips).
    - Every machine MUST have a picture, all in one uniform style.
    - Choose which dumbbell weights and which plates you have.
27. **Multiple gyms must be set up right here** in the flow (not only in Settings). Progress on each machine is tied to the gym you used it at.
28. **"Tennis, padel or hard cardio" step is awful / AJ-specific**: needs a searchable picker covering any sport in the world, each with a uniform icon.
29. **Asking which days you do cardio is a bad idea**: almost nobody has fixed cardio days. Rethink how sport/cardio is accounted for.
30. **Pick a split shows nothing** (BUG: with 7 days selected there are no split options). It should give a genuinely smart recommended split based on all previous answers, not the same one regardless.
31. **Choose your own split**, but guided: warn honestly when a choice limits results (e.g. legs once a week: "you won't get maximum growth").
32. **Fully custom splits with no limits** (e.g. AJ's legs / push / pull / legs / upper / rest / priorities). Possibly analysed live by AI against the science and turned into a programme matching all preferences.
33. **Priority muscle picker**: OK, but needs muscle icons and much better design, and should link to the look-based recommender.
34. **"Anything to protect?" needs AI**: let the user type the issue and analyse it live (an ankle injury is different from tight ankles that make squatting without heel elevation hard).
35. **Lifts you love/hate**: good idea, far better execution needed. Far more exercises exist than shown, but it mustn't become a long list. Every exercise needs an illustration of it being performed. Must be skippable.
36. **Block length only 5 or 6 weeks**: is that evidence-based? Holidays and work trips don't fit. Needs much more customisation.
37. **Week 1 at 3 RIR for intermediates**: AJ disagrees; start at ~1 RIR and go to 0-1 after. Review against the evidence.
38. **Make the block step better in general.**
39. **Building the plan doesn't work** (BUG: hangs, linked to the 7-day split issue). Must be fast and show live progress of what it's doing.

Names: none of the first six landed. Keep the propeller logo; more options needed.
