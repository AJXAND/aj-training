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

## Stop 3b: Plan builder (running)

40. **Type your own goal**, analysed by AI.
41. **Ultra = anything longer than a marathon**, not "50-100 km".
42. **Distance goals (e.g. 5k) wrongly assume an event**: by default, estimate from current fitness (science-backed) how long it will take to reach the goal; optionally add an event date and the plan builds towards it.
43. **Sliders look poor everywhere in the app**: redesign them.
44. **"Where are you now?" needs real thought**: should cover everyone from can barely jog to elite, backed by science, and adjust the plan accordingly.
45. **Run days**: same problem as gym days (most people don't have fixed days); needs a great flexible-scheduling solution.
46. **Strength sessions capped at 2**: allow fewer or more, with 2 recommended if that's optimal for running performance.
47. **Gym equipment step**: same issues as item 26.
48. ✅ The running plan did build this time.
49. **More programme types**: HYROX, CrossFit, triathlon and the other most popular formats to start with (add more over time), all evidence-backed.

## Stop 4: Plan review, Plan page, workouts

50. **No Workout tab** while there is a Food tab; the overall navigation feels off and less intuitive than it should be. Consider renaming Plan to **Train**, with the plan shown elsewhere or differently on the same page.
51. **"Your block" review needs work**: the black tick lines on the weekly-sets bars aren't understandable (they mark the target, but that isn't clear).
52. **Volumes badly wrong**: e.g. 2 sets a week of upper back (on the Plan page) is far too little; priorities (chest, side delts, lats) came out at 7-8 sets instead of ~18, so priority selection didn't work. (4 days × 60 min; the time cap is squeezing everything.)
53. **Move workouts on the Plan page**: drag/move a session to another day and the plan smartly reorganises to keep you on track.

Spotted by me during this stop:
- **Numbers disagree between screens**: review shows Upper back 6 / Triceps 6.5 (fractional, direct + half indirect) while Plan's "Sets this week" shows 2 and 4 (direct only). Must use one consistent count.

54. **Rest times feel far too long** (compounds currently 3 min, isolations 1.5 min). Everything must be evidence-backed and explained; let users adjust.
55. **"Start lower a · My" button looks awful** (bad casing and the gym name truncated).
56. **Workout picking**: one tap to start today's workout; week and month shown separately. Possibly Today / Week / Month tabs.
57. **Supersets** in the live workout.
58. **Substitute an exercise** with a close alternative, for a reason (machine taken, body doesn't feel right for it).
59. **Live workout layout**: the current exercise expands and the others collapse, with a clear "you're here" state. Logging weight and reps must be super fast and never glitchy.
60. **Auto-suggested weights and reps** for the next session from last time (progressive overload), at least as an option; design the best way to do it.

## Stop 5: Food and nutrition goal

61. **Icons inconsistent**: "Build your plan" uses the app logo while food and habits use icons. All should be icons.
62. **Pointless scrolling** in the nutrition onboarding (and maybe elsewhere): the page scrolls/bounces but nothing moves. Polish it (no scroll when content fits; proper behaviour when it doesn't).
63. **"How active are you?" too restrictive and still built around AJ** (cycling commute as a headline question, etc.). Needs to fit everyone.
64. **What if people don't know their daily steps?** Offer a way to estimate it (e.g. descriptions of typical days, or read from Health).
65. **"Check your numbers": weight and body fat must be editable there**, with visual body-fat range guides for both men and women.
66. **Target weight slider/stepper lets you go the wrong way**: the + goes past the top of the range, and on a cut you can choose a target heavier than now. Constrain it to the goal direction.
67. **Projection graph looks awful and doesn't change with the chosen rate.** Redesign so it visibly reflects the pace.
68. **Protein as preset options, not a slider**: offer choices based on preference, show the recommended amounts, and don't allow going below the minimum.
69. **Same pointless-scroll issue on the macros page.**
70. **Food log and the whole food tracking system need serious work**, in both function and design (ties to item 14).

Spotted by me during this stop:
- **Calories disagree**: the pace screen says 2,140 kcal (2,760 − 620), but the Food page target shows 2,310. Find out why (probably the training-day calorie split or a stale value) and make it consistent.
- Food log empty state still says "tell Claude" (item 16).


## To do (decided)

- **Rebrand to Wingman or Wingmate** (keep the propeller logo). Exact .com/.app taken for both; candidates that appear free: wingmanfit.com, wingmatefit.com, joinwingmate.com, wingmanfit.app, wingmatefit.app. Exact App Store names "Wingman" and "WingMate" are used by other apps, so the listing name needs a suffix (e.g. "Wingmate: Gym & Food Coach"). Trademark search still to do before committing.
- **Name parked**: AJ doesn't want the low-quality domain variants; revisit naming later (Wingman/Wingmate still favourites).
