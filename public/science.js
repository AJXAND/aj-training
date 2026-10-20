/* AJ Training · science library. Every rule the app uses, the study behind it, and exactly how the app applies it.
   Citations checked against publisher, PMC or PubMed records in Oct 2026. Items marked "check" were only partly verifiable. */
(function(){
"use strict";
const LIB = [
 {id:"intensity", title:"Running: easy vs hard", items:[
  {kind:"review", t:"What is best practice for training intensity and duration distribution in endurance athletes?", c:"Seiler. International Journal of Sports Physiology and Performance, 2010", u:"https://doi.org/10.1123/ijspp.5.3.276",
   f:"Successful endurance athletes do about 80% of sessions at low intensity and about 20% hard; adding more high-intensity work doesn't reliably help well-trained athletes.", a:"Plans are ~80% easy running with hard sessions capped at 1-2 a week."},
  {kind:"rct", t:"Polarized training has greater impact on key endurance variables than threshold, high intensity, or high volume training", c:"Stöggl & Sperlich. Frontiers in Physiology, 2014", u:"https://doi.org/10.3389/fphys.2014.00033",
   f:"Over 9 weeks, polarised training improved VO2peak 11.7% vs 4.8% for HIIT; threshold-only and high-volume groups didn't improve. Small groups.", a:"Build phases use a polarised mix by default."},
  {kind:"meta", t:"Comparison of polarized versus other types of endurance training intensity distribution on athletes' endurance performance", c:"Oliveira et al. Sports Medicine, 2024", u:"https://doi.org/10.1007/s40279-024-02034-z",
   f:"Polarised training gave a small extra VO2peak gain (SMD 0.24) but no difference in time-trial performance versus other mixes.", a:"Either polarised or pyramidal works; the app keeps hard work limited rather than prescribing one exact model."}]},
 {id:"progression-run", title:"Running: progression and injury", items:[
  {kind:"rct", t:"How much running is too much? Identifying high-risk running sessions in a 5200-person cohort study", c:"Frandsen, ... Nielsen. British Journal of Sports Medicine, 2025", u:"https://doi.org/10.1136/bjsports-2024-109380",
   f:"A single run more than 10% longer than your longest run of the previous 30 days raised injury rate (up to 2.3x for runs over double). Week-to-week totals showed no link.", a:"Long runs never exceed your recent longest by more than 10%, and logging a run that does triggers a warning."},
  {kind:"rct", t:"No effect of a graded training program on the number of running-related injuries in novice runners", c:"Buist et al. American Journal of Sports Medicine, 2008", u:"https://doi.org/10.1177/0363546507307505",
   f:"A gradual '10% rule' programme had the same injury rate as a standard one (20.8% vs 20.3%).", a:"Weekly volume still builds gently (~7%), but the app doesn't present the 10% rule as proven."},
  {kind:"rct", t:"Excessive progression in weekly running distance and risk of running-related injuries", c:"Nielsen et al. Journal of Orthopaedic & Sports Physical Therapy, 2014", u:"https://doi.org/10.2519/jospt.2014.5164",
   f:"Weekly increases over 30% showed a non-significant trend to more distance-related injuries.", a:"Treated as a soft guide only."}]},
 {id:"taper", title:"Running: taper", items:[
  {kind:"meta", t:"Effects of tapering on performance: a meta-analysis", c:"Bosquet et al. Medicine & Science in Sports & Exercise, 2007", u:"https://doi.org/10.1249/mss.0b013e31806010e0",
   f:"Best results with a 2-week taper, cutting volume 41-60% while keeping intensity and frequency.", a:"Marathon and longer: 2-week taper; shorter races: 1 week. Volume drops, hard sessions stay."}]},
 {id:"strength-run", title:"Running: strength training", items:[
  {kind:"meta", t:"Effects of strength training on running economy in highly trained runners", c:"Balsalobre-Fernández, Santos-Concejero & Grivas. Journal of Strength and Conditioning Research, 2016", u:"https://doi.org/10.1519/JSC.0000000000001316",
   f:"2-3 strength or plyometric sessions a week for 8-12 weeks gave a large improvement in running economy.", a:"Two strength sessions a week in base and build, one in peak and taper."},
  {kind:"review", t:"Effects of strength training on the physiological determinants of middle- and long-distance running performance", c:"Blagrove, Howatson & Hayes. Sports Medicine, 2018", u:"https://doi.org/10.1007/s40279-017-0835-7",
   f:"Running economy improved about 2-8% in most of 24 studies.", a:"Described as a 2-8% economy gain, not a guarantee."}]},
 {id:"heat", title:"Running: heat", items:[
  {kind:"review", t:"Adaptations and mechanisms of human heat acclimation", c:"Périard, Racinais & Sawka. Scandinavian Journal of Medicine & Science in Sports, 2015", u:"https://doi.org/10.1111/sms.12408",
   f:"75-80% of heat adaptations happen in the first 4-7 days; full benefit takes about 10-14 days. Roughly 1 day of heat exposure keeps 5 days of adaptation.", a:"Desert races get 10-14 heat sessions in the last ~2.5 weeks."},
  {kind:"meta", t:"Effects of heat adaptation on physiology, perception and exercise performance in the heat: an updated meta-analysis", c:"Tyler, Reeve, Sieh & Cheung. Journal of Science in Sport and Exercise, 2024", u:"https://doi.org/10.1007/s42978-023-00263-8",
   f:"Heat adaptation improved performance in the heat (g=0.7); passive heat (sauna, hot baths) works too.", a:"Sauna or a hot bath straight after an easy run counts as a heat session."}]},
 {id:"fuel", title:"Running: fuelling and multi-day ultras", items:[
  {kind:"review", t:"A step towards personalized sports nutrition: carbohydrate intake during exercise", c:"Jeukendrup. Sports Medicine, 2014", u:"https://pubmed.ncbi.nlm.nih.gov/24791914/",
   f:"Up to 60 g/h for 2-3 hours; up to 90 g/h of mixed glucose and fructose for longer events. Lower for slow ultra paces.", a:"Long runs over ~90 minutes prompt fuelling practice at 60-90 g/h."},
  {kind:"rct", t:"Compromised energy and macronutrient intake of ultra-endurance runners during a multi-stage ultra-marathon in a hot environment", c:"Costa et al. International Journal of Sports Science, 2013", u:"https://doi.org/10.5923/j.sports.20130302.03",
   f:"In a 5-day, 225 km hot stage race, runners averaged only 24 g carbohydrate an hour while running; 85% had gut problems.", a:"Gut training on long runs is built into multi-day plans."},
  {kind:"rct", t:"Energy balance during a self-sufficient, multistage ultramarathon", c:"Hough & Earle. Journal of Human Performance in Extreme Environments, 2017", u:"https://doi.org/10.7771/2327-2937.1103",
   f:"Case study at the Marathon des Sables: ~4,900 kcal burned vs ~2,950 eaten per day, a ~1,900 kcal daily deficit.", a:"Multi-day plans flag that race food should be energy-dense. Single-person data, so indicative only."}]},
 {id:"habits", title:"Habits", items:[
  {kind:"rct", t:"How are habits formed: modelling habit formation in the real world", c:"Lally, van Jaarsveld, Potts & Wardle. European Journal of Social Psychology, 2010", u:"https://doi.org/10.1002/ejsp.674",
   f:"Habits took 18 to 254 days to become automatic (about 66 days typical). Missing one opportunity did not materially affect habit formation.", a:"Streaks forgive one miss a week, and the app sets expectations at about 2 months, not 21 days."},
  {kind:"meta", t:"Time to form a habit: a systematic review and meta-analysis of health behaviour habit formation", c:"Singh, Murphy, Maher & Smith. Healthcare, 2024", u:"https://doi.org/10.3390/healthcare12232488",
   f:"Median 59-66 days to form a habit; morning and self-chosen habits formed faster.", a:"You choose your own habits; templates suggest a morning slot where it fits."},
  {kind:"meta", t:"Implementation intentions and goal achievement: a meta-analysis of effects and processes", c:"Gollwitzer & Sheeran. Advances in Experimental Social Psychology, 2006", u:"https://doi.org/10.1016/S0065-2601(06)38002-1",
   f:"Planning 'when X happens, I will do Y' had a medium-to-large effect on reaching goals (d=0.65) across 94 tests.", a:"Each habit has an optional plan line, shown on the habit."},
  {kind:"meta", t:"Does monitoring goal progress promote goal attainment? A meta-analysis", c:"Harkin et al. Psychological Bulletin, 2016", u:"https://doi.org/10.1037/bul0000025",
   f:"Monitoring progress improved goal attainment (d=0.40), more so when progress was physically recorded.", a:"Every habit shows a 28-day strip and a 30-day hit rate."},
  {kind:"meta", t:"Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts", c:"Paluch et al. Lancet Public Health, 2022", u:"https://doi.org/10.1016/S2468-2667(21)00302-9",
   f:"Risk kept falling up to about 8,000-10,000 steps a day for under-60s and 6,000-8,000 for over-60s.", a:"The steps template defaults to 8,000."},
  {kind:"meta", t:"Daily steps and health outcomes in adults: a systematic review and dose-response meta-analysis", c:"Ding et al. Lancet Public Health, 2025", u:"https://doi.org/10.1016/S2468-2667(25)00164-1",
   f:"7,000 steps a day was linked to 47% lower mortality than 2,000, close to the benefit at 10,000.", a:"Supports a 7,000-10,000 target range.", check:"Details from the university summary"},
  {kind:"review", t:"Recommended amount of sleep for a healthy adult: AASM and SRS consensus", c:"Watson et al. Journal of Clinical Sleep Medicine, 2015", u:"https://doi.org/10.5664/jcsm.4758",
   f:"Adults should sleep 7 or more hours a night on a regular basis.", a:"The sleep template defaults to 7.5 h."},
  {kind:"review", t:"Scientific opinion on dietary reference values for water", c:"EFSA NDA Panel. EFSA Journal, 2010", u:"https://doi.org/10.2903/j.efsa.2010.1459",
   f:"Adequate total water intake is 2.0 L a day for women and 2.5 L for men (food and drink), more in heat or with activity.", a:"The water template defaults to 2.5 L."},
  {kind:"meta", t:"Interventions for smokeless tobacco use cessation", c:"Livingstone-Banks et al. Cochrane Database of Systematic Reviews, 2025", u:"https://doi.org/10.1002/14651858.CD015314.pub2",
   f:"Behavioural support and varenicline raised quit rates; evidence specific to snus is limited.", a:"The quit template tracks slips and cravings and points to GP or pharmacist support; it gives no medication advice."}]},
 {id:"volume", title:"Weekly volume", items:[
  {kind:"meta", t:"The resistance training dose response: meta-regressions on weekly volume and frequency", c:"Pelland, Remmert, Robinson, Hinson, Zourdos et al. Sports Medicine, 2025", u:"https://doi.org/10.1007/s40279-025-02344-w",
   f:"Muscle growth keeps rising with weekly sets but with diminishing returns: each further detectable step costs ~6 extra sets at 5-10 sets, ~8.5 at 11-18 and ~11 at 19-29. Strength plateaus at about 5 sets. Counting indirect sets as half fitted the data best.",
   a:"Weekly sets are counted fractionally (direct 1, indirect 0.5). Default targets are ~10-12 per muscle, ~18 for your priorities."},
  {kind:"meta", t:"Dose-response relationship between weekly resistance training volume and increases in muscle mass", c:"Schoenfeld, Ogborn & Krieger. Journal of Sports Sciences, 2017", u:"https://doi.org/10.1080/02640414.2016.1210197",
   f:"Each extra weekly set added ~0.37% to the gain. Under 5 sets: 5.4%, 5-9 sets: 6.6%, 10+ sets: 9.8%.", a:"No muscle is programmed below ~10 sets unless you choose a short session."},
  {kind:"review", t:"Systematic review of different resistance training volumes on muscle hypertrophy", c:"Baz-Valle, Balsalobre-Fernández, Alix-Fages & Santos-Concejero. Journal of Human Kinetics, 2022", u:"https://pubmed.ncbi.nlm.nih.gov/35291645/",
   f:"Recommends 12-20 weekly sets per muscle for trained men; going higher gave no extra benefit for quads or biceps (triceps did respond).", a:"Priority muscles are capped around 18-20 sets."},
  {kind:"prac", t:"Training volume landmarks (MV, MEV, MAV, MRV)", c:"Israetel / Renaissance Periodization. Practitioner guidance, not peer reviewed", u:"https://rpstrength.com/training-volume-landmarks-muscle-growth/",
   f:"About 6 sets a week maintains a muscle; growth needs more, up to what you can recover from, then a deload.", a:"Used as a sanity check on the targets, not as a source of numbers."}]},
 {id:"frequency", title:"Frequency", items:[
  {kind:"meta", t:"Effects of resistance training frequency on measures of muscle hypertrophy", c:"Schoenfeld, Ogborn & Krieger. Sports Medicine, 2016", u:"https://doi.org/10.1007/s40279-016-0543-8",
   f:"Training a muscle twice a week beat once a week (effect size 0.49 vs 0.30).", a:"Every split the builder offers trains each muscle at least twice a week."},
  {kind:"meta", t:"How many times per week should a muscle be trained to maximize hypertrophy?", c:"Schoenfeld, Grgic & Krieger. Journal of Sports Sciences, 2019", u:"https://doi.org/10.1080/02640414.2018.1555906",
   f:"With weekly volume equated, frequency made almost no difference to growth.", a:"Frequency is used to spread sets out so no session gets too long, not as a growth lever by itself."}]},
 {id:"rir", title:"Effort and failure", items:[
  {kind:"meta", t:"Exploring the dose-response relationship between estimated proximity to failure and strength and hypertrophy", c:"Robinson, Pelland, Remmert, Refalo, Jukic, Steele & Zourdos. Sports Medicine, 2024", u:"https://doi.org/10.1007/s40279-024-02069-2",
   f:"Growth increases as sets finish closer to failure; strength gains are similar across a wide range of reps in reserve.", a:"Hard weeks run from ~3 RIR down to 0-1 RIR. The target RIR shows on every exercise."},
  {kind:"meta", t:"Influence of resistance training proximity-to-failure on skeletal muscle hypertrophy", c:"Refalo, Helms, Trexler, Hamilton & Fyfe. Sports Medicine, 2023", u:"https://doi.org/10.1007/s40279-022-01784-y",
   f:"Training to outright failure gave at most a trivial extra benefit over stopping just short.", a:"True failure is kept for the last set of isolation lifts late in a block. Barbell rows and RDLs are flagged 'technical failure only'."}]},
 {id:"load", title:"Reps and load", items:[
  {kind:"meta", t:"Strength and hypertrophy adaptations between low- vs high-load resistance training", c:"Schoenfeld, Grgic, Ogborn & Krieger. Journal of Strength and Conditioning Research, 2017", u:"https://doi.org/10.1519/JSC.0000000000002200",
   f:"With sets taken to failure, heavy and light loads built similar muscle; heavy loads built more strength.", a:"Rep ranges sit in the productive 6-15 zone; the Size + strength goal makes the first barbell lift each day 4-6 reps.", check:"Percentages from a secondary summary"},
  {kind:"meta", t:"Resistance training load effects on muscle hypertrophy and strength gain: network meta-analysis", c:"Lopez et al. Medicine & Science in Sports & Exercise, 2021", u:"https://doi.org/10.1249/MSS.0000000000002585",
   f:"Hypertrophy was similar for ≤8, 9-15 and >15 rep maxes; strength favoured heavier loads.", a:"Same as above."}]},
 {id:"rest", title:"Rest between sets", items:[
  {kind:"rct", t:"Longer interset rest periods enhance muscle strength and hypertrophy in resistance-trained men", c:"Schoenfeld et al. Journal of Strength and Conditioning Research, 2016", u:"https://doi.org/10.1519/JSC.0000000000001272",
   f:"3 min rest vs 1 min: front-thigh muscle +13.3% vs +6.9%, squat strength +15.2% vs +7.6%.", a:"Big lifts get 2.5-3 min rest; the rest timer starts automatically."},
  {kind:"meta", t:"Give it a rest: a systematic review with Bayesian meta-analysis on rest intervals and hypertrophy", c:"Singer, Wolf, ... Swinton & Schoenfeld. Frontiers in Sports and Active Living, 2024", u:"https://doi.org/10.3389/fspor.2024.1429789",
   f:"A small benefit for resting more than 60 s; little extra beyond ~90 s for smaller exercises.", a:"Isolation lifts get 75-90 s, never under 60 s."}]},
 {id:"lengthened", title:"Exercise choice: training long", items:[
  {kind:"rct", t:"Greater hamstrings hypertrophy after training at long vs short muscle lengths", c:"Maeo et al. Medicine & Science in Sports & Exercise, 2021", u:"https://doi.org/10.1249/MSS.0000000000002523",
   f:"Seated leg curls (hamstrings stretched) grew the hamstrings 14.1% vs 9.3% for lying curls.", a:"Seated leg curl is preferred when a gym has one; SHWC doesn't, so lying curl is used there."},
  {kind:"rct", t:"Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead vs neutral arm position", c:"Maeo et al. European Journal of Sport Science, 2023", u:"https://pubmed.ncbi.nlm.nih.gov/35819335/",
   f:"Overhead extensions grew the whole triceps 19.9% vs 13.9% for pushdowns (long head 28.5% vs 19.6%).", a:"Every week includes overhead triceps work alongside pushdowns.", check:"DOI not confirmed; PubMed record linked"},
  {kind:"rct", t:"Partial range of motion training elicits favorable improvements in muscular adaptations when carried out at long muscle lengths", c:"Pedrosa, Lima, Schoenfeld et al. European Journal of Sport Science, 2022", u:"https://doi.org/10.1080/17461391.2021.1927199",
   f:"Leg extensions in the stretched part of the range grew the quads most.", a:"Leg extension notes cue leaning back to bias the stretch."},
  {kind:"meta", t:"Partial vs full range of motion resistance training: a systematic review and meta-analysis", c:"Wolf, Androulakis-Korakakis, Fisher, Schoenfeld & Steele. International Journal of Strength and Conditioning, 2023", u:"https://doi.org/10.47206/ijsc.v3i1.182",
   f:"Full range is about as good as partials overall; lengthened partials may help growth but the evidence is uncertain.", a:"Stretch-biased exercises are favoured; lengthened partials are optional, never required."},
  {kind:"rct", t:"Greater gastrocnemius muscle hypertrophy after partial range of motion training performed at long muscle lengths", c:"Kassiano et al. Journal of Strength and Conditioning Research, 2023", u:"https://doi.org/10.1519/JSC.0000000000004460",
   f:"Calf raises in the stretched range roughly doubled growth compared with full range.", a:"Calf raises are cued with a full stretch and a pause at the bottom.", check:"Percentages from a secondary summary"}]},
 {id:"order", title:"Exercise order", items:[
  {kind:"meta", t:"What influence does resistance exercise order have on muscle strength gains and hypertrophy?", c:"Nunes, Grgic, Cunha, ... Schoenfeld. European Journal of Sport Science, 2021", u:"https://doi.org/10.1080/17461391.2020.1733672",
   f:"Order made no difference to growth, but exercises done first gained the most strength.", a:"Compounds go first, then the day's priority muscles. Extras added for other muscles go at the end."}]},
 {id:"progression", title:"Progression", items:[
  {kind:"rct", t:"Progressive overload without progressing load? The effects of load or repetition progression on muscular adaptations", c:"Plotkin, Coleman, Van Every, ... Schoenfeld. PeerJ, 2022", u:"https://doi.org/10.7717/peerj.14142",
   f:"Adding reps at a fixed weight built as much muscle as adding weight.", a:"'What to lift next' uses double progression: beat last time by a rep, then add load once you hit the top of the range. On a cut, matching last time counts as a win."}]},
 {id:"deload", title:"Deloads", items:[
  {kind:"review", t:"Integrating deloading into strength and physique sports training programmes: an international Delphi consensus", c:"Bell, Strafford, Coleman, Androulakis Korakakis & Nolan. Sports Medicine - Open, 2023", u:"https://doi.org/10.1186/s40798-023-00633-0",
   f:"Experts agree a deload cuts volume and effort while weight on the bar can stay; they set no fixed schedule.", a:"Deload week: half the sets at ~3 RIR, same weights."},
  {kind:"review", t:"Practical deload recommendations (follow-up to the Delphi consensus)", c:"Bell et al. Strength and Conditioning Journal, 2025", check:"Title paraphrased; DOI linked", u:"https://doi.org/10.1519/SSC.0000000000000910",
   f:"Suggests planned deloads roughly every 4-8 weeks, plus early deloads when performance drops.", a:"Blocks are 5 or 6 weeks with the last as a deload. The app also flags an early deload when first sets fall two sessions running."}]},
 {id:"interference", title:"Cardio and lifting", items:[
  {kind:"meta", t:"Compatibility of concurrent aerobic and strength training for skeletal muscle size and function", c:"Schumann, Feuerbacher, Sünkeler, Freitag, Rønnestad, Doma & Lundberg. Sports Medicine, 2022", u:"https://doi.org/10.1007/s40279-021-01587-7",
   f:"Adding cardio didn't reduce muscle growth or max strength. Only explosive strength suffered, more so when both were done in the same session.", a:"Leg days are placed away from the day before tennis or padel, for performance in both rather than to protect growth."}]},
 {id:"rate-gain", title:"Rate of weight gain", items:[
  {kind:"rct", t:"Effect of small and large energy surpluses on strength, muscle, and skinfold thickness in resistance-trained individuals", c:"Helms et al. Sports Medicine - Open, 2023", u:"https://doi.org/10.1186/s40798-023-00651-y",
   f:"Trained lifters on a ~5% or ~15% surplus gained similar muscle thickness; the larger surplus mainly added skinfold thickness (fat).", a:"For trained lifters the bulk default is ~0.25% of body weight a week; beginners are offered up to ~0.5%."},
  {kind:"review", t:"Nutrition recommendations for bodybuilders in the off-season: a narrative review", c:"Iraki, Fitschen, Espinar & Helms. Sports, 2019", u:"https://doi.org/10.3390/sports7070154",
   f:"A 10-20% surplus and ~0.25-0.5% of body weight gained per week; faster gain mostly adds fat in trained lifters.", a:"The bulk slider highlights 0.25-0.5% a week; your pace sets the daily surplus."},
  {kind:"rct", t:"Effect of small and large energy surpluses on strength, muscle and skinfold thickness in resistance-trained individuals", c:"Helms, Spence, Sousa, Kreiger, Taylor, Oranchuk, Dieter & Watkins. Sports Medicine - Open, 2023", u:"https://doi.org/10.1186/s40798-023-00651-y",
   f:"+5% and +15% surpluses built similar muscle over 8 weeks; +15% added more fat.", a:"Defaults sit at the lean end of the range."},
  {kind:"rct", t:"Effect of nutritional intervention on body composition and performance in elite athletes", c:"Garthe, Raastad, Refsnes & Sundgot-Borgen. European Journal of Sport Science, 2013", u:"https://doi.org/10.1080/17461391.2011.643923",
   f:"Eating ~600 kcal a day more gained more weight and much more fat, with no significant extra lean mass.", a:"The slider warns when you pick a faster-than-recommended bulk."}]},
 {id:"rate-loss", title:"Rate of fat loss", items:[
  {kind:"review", t:"Achieving an optimal fat loss phase in resistance-trained athletes: a narrative review", c:"Ruiz-Castellano, Espinar, Contreras, Mata, Aragon & Martínez-Sanz. Nutrients, 2021", u:"https://doi.org/10.3390/nu13093255",
   f:"Recommends losing 0.5-1.0% of body weight a week, and the leaner you are the more conservative the deficit should be.", a:"The pace slider recommends 0.5-1.0% a week, narrowing to 0.25-0.5% once you're lean (men under ~12%, women under ~22% body fat; those cut-offs are convention)."},
  {kind:"review", t:"Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation", c:"Helms, Aragon & Fitschen. Journal of the International Society of Sports Nutrition, 2014", u:"https://doi.org/10.1186/1550-2783-11-20",
   f:"Lose 0.5-1% of body weight a week; fat 15-30% of calories, carbs the rest.", a:"The cut slider highlights 0.5-1% a week."},
  {kind:"rct", t:"Effect of two different weight-loss rates on body composition and strength in elite athletes", c:"Garthe et al. International Journal of Sport Nutrition and Exercise Metabolism, 2011", u:"https://lida.sport-iat.de/ta/Record/4020442?lng=en",
   f:"Losing ~0.7% a week gained lean mass (+2.1%); losing ~1-1.4% a week did not (-0.2%).", a:"Cut default is 0.6% a week.", check:"DOI not confirmed; library record linked"}]},
 {id:"protein", title:"Protein", items:[
  {kind:"meta", t:"A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains", c:"Morton, Murphy, McKellar, Schoenfeld, Henselmans, Helms, Aragon, ... Phillips. British Journal of Sports Medicine, 2018", u:"https://bjsm.bmj.com/content/52/6/376",
   f:"Gains in lean mass levelled off at 1.62 g/kg a day (upper confidence limit 2.2 g/kg).", a:"Bulk and maintenance protein: Minimum 1.6, Standard 2.0, High 2.4 g/kg. Nothing below 1.6 is offered."},
  {kind:"review", t:"A systematic review of dietary protein during caloric restriction in resistance trained lean athletes", c:"Helms, Zinn, Rowlands & Brown. International Journal of Sport Nutrition and Exercise Metabolism, 2014", u:"https://doi.org/10.1123/ijsnem.2013-0054",
   f:"While dieting, 2.3-3.1 g per kg of lean mass, higher for leaner people and bigger deficits.", a:"Cut protein: Minimum 1.8, Standard 2.2, High 2.6 g/kg of body weight (about 2.1-3.1 g/kg of lean mass at typical body fat)."},
  {kind:"meta", t:"Systematic review and meta-analysis of protein intake to support muscle mass and function in healthy adults", c:"Nunes, Colenso-Semple, McKellar, ... Atherton. Journal of Cachexia, Sarcopenia and Muscle, 2022", u:"https://doi.org/10.1002/jcsm.12922",
   f:"Across 74 trials, more protein with lifting increased lean mass; ≥1.6 g/kg also helped lower-body strength.", a:"The protein options never go below 1.6 g/kg."}]},
 {id:"fat", title:"Fat and carbs", items:[
  {kind:"review", t:"Nutrition recommendations for bodybuilders in the off-season", c:"Iraki, Fitschen, Espinar & Helms. Sports, 2019", u:"https://doi.org/10.3390/sports7070154",
   f:"Fat 0.5-1.5 g/kg (about 20-35% of calories); carbs fill the rest to fuel training.", a:"Fat never drops below 0.6 g/kg. Balanced = 27% of calories from fat, higher carb = 20%, higher fat = 35%."}]},
 {id:"energy", title:"Energy and expenditure", items:[
  {kind:"review", t:"What is the required energy deficit per unit weight loss?", c:"Hall. International Journal of Obesity, 2008", u:"https://doi.org/10.1038/sj.ijo.0803720",
   f:"The 7,700 kcal per kg rule is a rough average; lean people lose more lean tissue per kg, so it overstates the energy per kg for them.", a:"Your weight change is converted to energy with a Forbes/Hall body-composition model (about 5,500-6,500 kcal per kg at your body fat, not 7,700), using a trend line fitted through every weigh-in. Only fully logged days count, and the estimate is recalculated every day."},
  {kind:"text", t:"Katch-McArdle resting energy equation", c:"McArdle, Katch & Katch. Exercise Physiology (textbook)", u:"",
   f:"Resting energy = 370 + 21.6 × lean body mass (kg). Uses body fat, so it suits lean, muscular people better than weight-only formulas.", a:"Starting expenditure = Katch-McArdle resting burn + daily life (job), steps, cycling, training and logged cardio, plus ~10% for digesting food. Your own food and weight data then takes over."},
  {kind:"review", t:"2024 Adult Compendium of Physical Activities", c:"Herrmann et al. Journal of Sport and Health Science, 2024", u:"https://doi.org/10.1016/j.jshs.2023.10.010",
   f:"Standard energy costs (METs) for hundreds of activities, from tennis singles to walking speed.", a:"Cardio calories use the Compendium MET for the exact activity and intensity, scaled by your weight; resting burn is subtracted so calories aren't double counted."}]},
 {id:"superset", title:"Supersets", items:[
  {kind:"rct", t:"The effects of traditional, superset, and tri-set resistance training structures on perceived intensity and physiological responses", c:"Weakley, Till, Read, ... Jones. European Journal of Applied Physiology, 2017", u:"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5556132/",
   f:"Supersets and tri-sets got the same work done in much less time than traditional sets, with higher perceived effort and a bigger heart-rate and lactate response.", a:"With supersets on, isolation lifts for different muscles are paired and share rest, so more sets fit into your session. Compounds keep full rest."}]},
 {id:"steps", title:"Daily steps", items:[
  {kind:"review", t:"How many steps/day are enough? Preliminary pedometer indices for public health", c:"Tudor-Locke & Bassett. Sports Medicine, 2004", u:"https://doi.org/10.2165/00007256-200434010-00001",
   f:"Proposed step bands for adults: under 5,000 a day sedentary, 5,000-7,499 low active, 7,500-9,999 somewhat active, 10,000+ active, 12,500+ highly active.", a:"If you don't know your steps, the activity question offers typical days mapped to these bands."},
  {kind:"review", t:"How many steps/day are enough? For adults", c:"Tudor-Locke et al. International Journal of Behavioral Nutrition and Physical Activity, 2011", u:"https://doi.org/10.1186/1479-5868-8-79",
   f:"Healthy adults typically take 4,000-18,000 steps a day; 7,000-8,000 is roughly equivalent to meeting activity guidelines.", a:"The steps slider spans 1,000-30,000 with these bands labelled."}]},
 {id:"bodyfat", title:"Body fat ranges", items:[
  {kind:"prac", t:"Body fat percentage categories", c:"American Council on Exercise (ACE) body-fat chart", u:"https://www.acefitness.org/resources/everyone/tools-calculators/percent-body-fat-calculator/",
   f:"Men: essential 2-5%, athletes 6-13%, fitness 14-17%, average 18-24%, above 25%. Women: essential 10-13%, athletes 14-20%, fitness 21-24%, average 25-31%, above 32%.", a:"The body-fat guide uses these bands for your sex. It only fine-tunes resting burn, so a rough estimate is fine.", check:"Practitioner categories, not derived from outcome trials"}]},
 {id:"recomp", title:"Recomposition", items:[
  {kind:"review", t:"Body recomposition: can trained individuals build muscle and lose fat at the same time?", c:"Barakat, Pearson, Escalante, Campbell & De Souza. Strength and Conditioning Journal, 2020", u:"https://doi.org/10.1519/SSC.0000000000000584",
   f:"Yes, in trained lifters with progressive training, high protein and good sleep, though slowly.", a:"Recomp holds calories at maintenance with protein at 2.0-2.4 g/kg; progress is judged on lifts and photos, not the scale."}]}
];
const KIND = {meta:["Meta-analysis","meta"], rct:["Trial",""], review:["Review",""], prac:["Practitioner","prac"], text:["Textbook",""]};
let q = "", focus = null;
function draw(){
  let o = document.getElementById("sci");
  if (!o){ o = document.createElement("div"); o.id = "sci"; o.className = "sci"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Science library"); document.body.appendChild(o);
    o.addEventListener("click", e => { if (e.target.closest("[data-sciclose]")){ o.classList.add("out"); setTimeout(() => o.remove(), 260); if (!document.getElementById("ob")) document.body.style.overflow = ""; } });
    o.addEventListener("input", e => { if (e.target.id === "sciq"){ q = e.target.value.toLowerCase(); list(); } });
    o.innerHTML = `<div class="obtop"><button class="iconbtn" data-sciclose aria-label="Close">${ICON.back}</button><div class="date" style="flex:1">Science library</div></div>
      <div class="obbody"><h1 class="obtitle">The evidence</h1>
        <p class="obnote" style="margin-top:0">Every rule your programme, progression and targets follow, the study behind it, and exactly how the app uses it. ${LIB.reduce((a, t) => a + t.items.length, 0)} sources.</p>
        <label class="scisearch">${ICON.search}<input id="sciq" placeholder="Search studies or topics" autocomplete="off"></label><div id="scil" class="stack" style="gap:14px"></div></div>`;
  }
  document.body.style.overflow = "hidden"; list();
  if (focus){ const t = o.querySelector(`[data-topic="${focus}"]`); if (t){ t.querySelectorAll("details").forEach((d, i) => { d.open = i === 0; d.classList.add("hl"); }); setTimeout(() => t.scrollIntoView({block:"start"}), 30); } }
}
function list(){
  const box = document.getElementById("scil"); if (!box) return;
  const m = x => !q || (x.t + " " + x.c + " " + x.f + " " + x.a).toLowerCase().includes(q);
  box.innerHTML = LIB.map(t => { const items = t.items.filter(x => m(x) || t.title.toLowerCase().includes(q)); if (!items.length) return "";
    return `<section class="scitopic" data-topic="${t.id}"><h3>${esc(t.title)}</h3>${items.map(x => `<details class="sciitem"><summary><b>${esc(x.t)}</b><span><i class="scikind ${KIND[x.kind][1]}">${KIND[x.kind][0]}</i>${esc(x.c)}</span></summary>
      <div class="scibody"><div><em>What it found</em>${esc(x.f)}</div><div><em>How the app uses it</em>${esc(x.a)}</div>
      ${x.check ? `<div><em>Note</em><span class="muted">${esc(x.check)}</span></div>` : ""}${x.u ? `<a href="${esc(x.u)}" target="_blank" rel="noopener">Read the paper</a>` : ""}</div></details>`).join("")}</section>`; }).join("") || `<div class="empty">No matches.</div>`;
}
window.AJScience = {open(id){ focus = id || null; draw(); }, LIB};
})();
