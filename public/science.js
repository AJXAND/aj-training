/* AJ Training · science library. Every rule the app uses, the study behind it, and exactly how the app applies it.
   Citations checked against publisher, PMC or PubMed records in Oct 2026. Items marked "check" were only partly verifiable. */
(function(){
"use strict";
const LIB = [
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
  {kind:"review", t:"Nutrition recommendations for bodybuilders in the off-season: a narrative review", c:"Iraki, Fitschen, Espinar & Helms. Sports, 2019", u:"https://doi.org/10.3390/sports7070154",
   f:"A 10-20% surplus and ~0.25-0.5% of body weight gained per week; faster gain mostly adds fat in trained lifters.", a:"The bulk slider highlights 0.25-0.5% a week; your pace sets the daily surplus."},
  {kind:"rct", t:"Effect of small and large energy surpluses on strength, muscle and skinfold thickness in resistance-trained individuals", c:"Helms, Spence, Sousa, Kreiger, Taylor, Oranchuk, Dieter & Watkins. Sports Medicine - Open, 2023", u:"https://doi.org/10.1186/s40798-023-00651-y",
   f:"+5% and +15% surpluses built similar muscle over 8 weeks; +15% added more fat.", a:"Defaults sit at the lean end of the range."},
  {kind:"rct", t:"Effect of nutritional intervention on body composition and performance in elite athletes", c:"Garthe, Raastad, Refsnes & Sundgot-Borgen. European Journal of Sport Science, 2013", u:"https://doi.org/10.1080/17461391.2011.643923",
   f:"Eating ~600 kcal a day more gained more weight and much more fat, with no significant extra lean mass.", a:"The slider warns when you pick a faster-than-recommended bulk."}]},
 {id:"rate-loss", title:"Rate of fat loss", items:[
  {kind:"review", t:"Evidence-based recommendations for natural bodybuilding contest preparation: nutrition and supplementation", c:"Helms, Aragon & Fitschen. Journal of the International Society of Sports Nutrition, 2014", u:"https://doi.org/10.1186/1550-2783-11-20",
   f:"Lose 0.5-1% of body weight a week; fat 15-30% of calories, carbs the rest.", a:"The cut slider highlights 0.5-1% a week."},
  {kind:"rct", t:"Effect of two different weight-loss rates on body composition and strength in elite athletes", c:"Garthe et al. International Journal of Sport Nutrition and Exercise Metabolism, 2011", u:"https://lida.sport-iat.de/ta/Record/4020442?lng=en",
   f:"Losing ~0.7% a week gained lean mass (+2.1%); losing ~1-1.4% a week did not (-0.2%).", a:"Cut default is 0.6% a week.", check:"DOI not confirmed; library record linked"}]},
 {id:"protein", title:"Protein", items:[
  {kind:"meta", t:"A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains", c:"Morton, Murphy, McKellar, Schoenfeld, Henselmans, Helms, Aragon, ... Phillips. British Journal of Sports Medicine, 2018", u:"https://bjsm.bmj.com/content/52/6/376",
   f:"Gains in lean mass levelled off at 1.62 g/kg a day (upper confidence limit 2.2 g/kg).", a:"Bulk and maintenance protein defaults to 2.0 g/kg, adjustable 1.6-2.4."},
  {kind:"review", t:"A systematic review of dietary protein during caloric restriction in resistance trained lean athletes", c:"Helms, Zinn, Rowlands & Brown. International Journal of Sport Nutrition and Exercise Metabolism, 2014", u:"https://doi.org/10.1123/ijsnem.2013-0054",
   f:"While dieting, 2.3-3.1 g per kg of lean mass, higher for leaner people and bigger deficits.", a:"Cut protein defaults to 2.3 g/kg body weight, adjustable to 2.7."},
  {kind:"meta", t:"Systematic review and meta-analysis of protein intake to support muscle mass and function in healthy adults", c:"Nunes, Colenso-Semple, McKellar, ... Atherton. Journal of Cachexia, Sarcopenia and Muscle, 2022", u:"https://doi.org/10.1002/jcsm.12922",
   f:"Across 74 trials, more protein with lifting increased lean mass; ≥1.6 g/kg also helped lower-body strength.", a:"The protein slider never goes below 1.6 g/kg."}]},
 {id:"fat", title:"Fat and carbs", items:[
  {kind:"review", t:"Nutrition recommendations for bodybuilders in the off-season", c:"Iraki, Fitschen, Espinar & Helms. Sports, 2019", u:"https://doi.org/10.3390/sports7070154",
   f:"Fat 0.5-1.5 g/kg (about 20-35% of calories); carbs fill the rest to fuel training.", a:"Fat never drops below 0.6 g/kg. Balanced = 27% of calories from fat, higher carb = 20%, higher fat = 35%."}]},
 {id:"energy", title:"Energy and expenditure", items:[
  {kind:"review", t:"What is the required energy deficit per unit weight loss?", c:"Hall. International Journal of Obesity, 2008", u:"https://doi.org/10.1038/sj.ijo.0803720",
   f:"The 7,700 kcal per kg rule is a rough average; lean people lose more lean tissue per kg, so it overstates the energy per kg for them.", a:"7,700 kcal/kg is used only to turn your weight trend into an expenditure estimate, which is re-measured every week from your logs, so errors self-correct."},
  {kind:"text", t:"Katch-McArdle resting energy equation", c:"McArdle, Katch & Katch. Exercise Physiology (textbook)", u:"",
   f:"Resting energy = 370 + 21.6 × lean body mass (kg). Uses body fat, so it suits lean, muscular people better than weight-only formulas.", a:"Starting expenditure = Katch-McArdle × 1.6, using body fat from your photos, until your own data takes over."},
  {kind:"review", t:"2024 Adult Compendium of Physical Activities", c:"Herrmann et al. Journal of Sport and Health Science, 2024", u:"https://doi.org/10.1016/j.jshs.2023.10.010",
   f:"Standard energy costs (METs) for hundreds of activities, from tennis singles to walking speed.", a:"Cardio calories use the Compendium MET for the exact activity and intensity, scaled by your weight; resting burn is subtracted so calories aren't double counted."}]},
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
