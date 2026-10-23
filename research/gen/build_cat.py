import json, re, sys
from collections import OrderedDict

GROUPS = OrderedDict([
 ("BP","Bars and plates"),
 ("RB","Racks and benches"),
 ("DK","Dumbbells and kettlebells"),
 ("CA","Cables and attachments"),
 ("CH","Chest machines"),
 ("BK","Back machines"),
 ("SH","Shoulder machines"),
 ("AR","Arm machines"),
 ("LQ","Leg machines: quads"),
 ("LH","Leg machines: hamstrings and glutes"),
 ("LC","Leg machines: calves and other"),
 ("CO","Core machines"),
 ("CV","Cardio"),
 ("HY","Conditioning and HYROX"),
 ("SM","Strongman"),
 ("BW","Bodyweight and accessories"),
 ("MR","Mobility and rehab"),
])

PL, SEL, FW, BWT, CAB, AIR, MOT = "plate-loaded","selectorised","free weight","bodyweight","cable","air/flywheel","motorised"
H,G,HO,C,BB,BX,U,O,R = "home","garage","hotel","commercial","bodybuilding","box","uni","outdoor","rehab"

ITEMS = []
def I(id, name, grp, aliases, muscles, loading, common, desc):
    ITEMS.append(dict(id=id, name=name, group=GROUPS[grp], aliases=aliases, muscles=muscles,
                      loading=loading, common_in=common, _desc=desc))

# ---------------- Bars and plates ----------------
I("bb","Olympic barbell and plates","BP",["barbell","Olympic bar","20 kg bar","power bar","deadlift bar","women's 15 kg bar","bar and plates"],["fullbody"],FW,[H,G,C,BB,BX,U],
 "a 2.2 m steel bar with knurled grip sections and rotating 50 mm sleeves at each end, loaded with a stack of black iron and rubber-coated weight plates of decreasing diameter held by spring collars, resting on the floor")
I("bumpers","Bumper plates","BP",["rubber bumpers","Olympic bumpers","competition plates","drop plates"],["fullbody"],FW,[G,BX,U,C],
 "a set of thick solid rubber weight plates of equal 450 mm diameter but different widths, with steel centre hubs, stacked upright on a simple plate rack, coloured red, blue, yellow, green and black")
I("ez","EZ curl bar","BP",["EZ bar","cambered curl bar","W bar"],["biceps","triceps"],FW,[H,G,C,BB,U,HO],
 "a short 1.2 m chrome bar with a zig-zag W-shaped centre section offering angled grips, with short plain sleeves at each end loaded with a small plate on each side and spring collars")
I("tricepbar","Triceps / hammer curl bar","BP",["tricep bar","hammer curl bar","neutral grip curl bar","rectangle bar"],["triceps","biceps","forearms"],FW,[G,C,BB],
 "a short bar formed into an open rectangular frame with two parallel neutral grip handles running across the inside, with short loading sleeves at each end")
I("trapbar","Trap / hex bar","BP",["hex bar","trap bar","shrug bar","open trap bar"],["quads","glutes","hams","traps"],FW,[G,C,BX,U,BB],
 "a hexagonal steel frame bar that the lifter stands inside, with two parallel knurled handles on opposite sides of the hexagon, raised high handles as an option, and long loading sleeves protruding from each end")
I("ssb","Safety squat bar","BP",["SSB","yoke bar","Hatfield bar"],["quads","glutes","upback"],FW,[G,C,BB,U],
 "a thick padded barbell with a cambered centre that sits on the shoulders, a padded yoke wrapped around the neck section and two handles projecting forwards and down from the pad, with the sleeves angled slightly downwards")
I("swissbar","Swiss / football bar","BP",["football bar","multi-grip bar","neutral grip bar"],["chest","triceps","fdelt","upback"],FW,[G,C,BB,U],
 "a barbell built as a long open ladder frame, with several pairs of neutral grip handles running crossways between two parallel rails, some angled, and standard loading sleeves at each end")
I("cambered","Cambered bar","BP",["cambered squat bar","buffalo bar","bow bar","duffalo bar"],["quads","glutes","chest"],FW,[G,C,BB],
 "a long Olympic-length barbell whose centre section bends downwards in a pronounced drop on each side so the loaded sleeves hang below shoulder height, or a gently curved bow bar version")
I("axle","Axle / fat bar","BP",["axle","fat bar","thick bar","Apollon axle"],["forearms","fullbody"],FW,[G,BB],
 "a thick un-knurled steel bar about 50 mm in diameter with no rotating sleeves, the whole bar the same thickness end to end, loaded with plates near each end")
I("earthquake","Bamboo / earthquake bar","BP",["earthquake bar","bamboo bar","oscillating bar","kettlebell hanging bar"],["upback","rdelt","fdelt"],FW,[G,R,BX],
 "a flexible bamboo or fibreglass bar about 2 m long, with kettlebells hanging from elastic bands looped around each end so the load swings and oscillates")
I("fixedbb","Fixed-weight barbells","BP",["pre-loaded barbells","fixed barbells","studio barbells"],["fullbody"],FW,[C,HO,U],
 "a row of short barbells with plates permanently welded at each end, each one with a numbered weight on the end cap, resting horizontally on a tiered upright rack")
I("landmine","Landmine","BP",["landmine attachment","barbell pivot","corner barbell"],["fullbody","fdelt","upback"],FW,[G,C,BX,U],
 "a heavy steel floor base or rack-mounted post with a rotating sleeve that pivots in all directions, holding one end of a barbell that rises at an angle with a single plate loaded on the far end")
I("landminehandle","Landmine handles","BP",["V-bar landmine handle","landmine row handle","T-bar handle","Viking press handles","Meadows handle"],["upback","lats","fdelt"],FW,[G,C,BX],
 "a steel sleeve that slides onto the end of a barbell, fitted with a choice of grips: a pair of neutral handles in a V shape, a wide T handle or two parallel overhead press handles")
I("chains","Chains","BP",["lifting chains","accommodating resistance chains"],["fullbody"],FW,[G,BB],
 "a pair of heavy steel link chains, each draped over a thinner loading chain, hanging from both sleeves of a barbell so the links pile on the floor")
I("fatgrips","Thick grips","BP",["Fat Gripz","grip thickeners","Alpha Grips"],["forearms","biceps"],FW,[H,G,C],
 "a pair of thick rubber tubular sleeves with a slit along their length, made to clip around a bar or dumbbell handle to widen it")

# ---------------- Racks and benches ----------------
I("rack","Power rack / squat rack","RB",["power cage","squat cage","full rack"],["fullbody"],FW,[H,G,C,BB,BX,U],
 "a tall four-post steel cage with holes punched up each upright, J-hooks holding a barbell at shoulder height, horizontal safety bars running front to back at waist height inside the cage and a pull-up bar across the top")
I("halfrack","Half rack / squat stands","RB",["half rack","squat stands","wall-mounted rack","folding rack"],["fullbody"],FW,[H,G,C,HO],
 "a pair of tall upright steel posts on a rectangular base with J-hooks holding a barbell, short spotter arms projecting forwards and a pull-up bar connecting the tops, open at the front")
I("monolift","Monolift","RB",["mono lift","powerlifting monolift"],["quads","glutes"],FW,[BB,G],
 "a heavy two-post squat stand with hooks on swinging arms that hold the bar then pivot out of the way, a foot-operated lever cam at the base and long safety arms projecting forward")
I("rig","Functional training rig","RB",["crossfit rig","pull-up rig","free-standing rig","wall rig"],["fullbody"],FW,[BX,C,U],
 "a long run of connected steel uprights and crossbeams forming several squat bays, with multiple pull-up bars at different heights, monkey bar rungs across the top, J-hooks on the uprights and hanging gymnastic rings")
I("multigym","Home multi-gym","RB",["multi gym","all-in-one gym","multi-station","home gym station"],["fullbody"],SEL,[H,HO],
 "a single-stack steel home gym with a central weight stack, a padded seat with a chest press arm, a high pulley with lat bar, a low pulley at the front and a leg extension and curl roller pad at the base of the seat")
I("smith","Smith machine","RB",["Smith","guided barbell"],["fullbody"],PL,[C,BB,HO,U,H],
 "a tall steel frame with a barbell fixed to vertical guide rods so it runs straight up and down, with hooks on the bar that rotate into slots on the uprights, plate pegs on the bar and adjustable safety stops at the base")
I("smithangled","Angled Smith machine","RB",["incline Smith","angled Smith","7 degree Smith","counterbalanced Smith"],["fullbody"],PL,[C,BB],
 "a Smith machine whose twin guide rods lean backwards at a slight angle of about 7 degrees, with a counterweighted barbell on the rails, rotating hooks and plate pegs, and safety stops at the base")
I("bench","Adjustable bench","RB",["FID bench","incline bench","utility bench","flat incline decline bench"],["chest","fdelt","triceps"],FW,[H,G,C,BB,HO,U],
 "a padded weight bench with a long back pad that ratchets from flat to fully upright on a steel ladder, a separate adjustable seat pad, a wheeled front leg and a handle at the rear")
I("flatbench","Flat bench","RB",["flat utility bench","bench"],["chest","triceps"],FW,[H,G,C,BB,HO,U],
 "a long narrow padded flat bench on a sturdy three-point steel frame at knee height, with no uprights")
I("declinebench","Decline bench","RB",["decline sit-up bench","Olympic decline bench","decline press bench"],["chest","triceps","abs"],FW,[C,BB,U],
 "a padded bench angled head-down at about 20 degrees with a padded leg hook roller at the raised end to lock the legs in and a small pair of bar uprights at the low end")
I("benchrack","Bench press station","RB",["Olympic flat bench","flat bench press","bench with uprights","combo rack"],["chest","triceps","fdelt"],FW,[C,BB,U,HO],
 "a flat padded bench joined to a pair of steel uprights at the head end with bar catches at two heights, a barbell resting in the catches and plate storage horns on the uprights")
I("inclinestation","Incline bench station","RB",["Olympic incline bench","incline bench press"],["chest","fdelt","triceps"],FW,[C,BB,U],
 "a fixed incline back pad at about 30 to 45 degrees with a small seat, tall steel uprights behind the head holding a barbell, and a raised spotter platform at the rear")
I("shoulderbench","Shoulder press bench","RB",["military press bench","Olympic shoulder bench","seated press bench"],["fdelt","sdelt","triceps"],FW,[C,BB],
 "a near-upright padded backrest with a small seat, tall steel uprights behind the head holding a barbell overhead and a footrest platform for a spotter at the back")
I("preacher","Preacher bench","RB",["Scott bench","preacher curl bench","standing preacher bench"],["biceps"],FW,[C,BB,U,H],
 "a seat in front of an angled padded arm rest sloping down and away from the user, with a pair of bar catches at the base of the pad to rest an EZ bar")
I("sealrow","Seal row bench","RB",["seal row","high prone bench","chest-supported row bench"],["upback","lats","rdelt"],FW,[G,BB,C],
 "a long flat padded bench raised on tall legs to about waist height, with a step and a pair of bar catches underneath so the user can lie face down and row a barbell or dumbbells up to the pad")
I("hipthrustbench","Hip thrust bench","RB",["hip thruster","glute bench","hip thrust station","Bret Contreras hip thruster"],["glutes","hams"],FW,[G,C,BB,H],
 "a low padded back support bench at knee height, with a curved pad for the upper back, a floor base the user sits on, and band pegs or a barbell resting across the hips area")
I("platform","Deadlift platform","RB",["lifting platform","Olympic platform","drop pad"],["fullbody"],FW,[G,C,BB,BX,U],
 "a large square wooden centre panel flanked on both sides by thick black rubber mats, raised slightly above the floor, with a loaded barbell resting on the rubber sections")
I("blocks","Pulling / jerk blocks","RB",["jerk blocks","pulling blocks","plyo blocks","deadlift blocks"],["fullbody"],FW,[G,BX,BB],
 "a pair of stacked wooden or foam cubes of adjustable height, placed under each end of a loaded barbell so the bar sits off the floor at knee height")
I("jhooks","Spotter / safety arms","RB",["safety arms","safeties","spotter arms","J-hooks","straps"],["fullbody"],FW,[H,G,C,BB,U],
 "a pair of long steel safety arms with a rubber-lined top surface pinned to the uprights of a rack, alongside a pair of J-shaped bar hooks")
I("legattach","Bench leg extension / curl attachment","RB",["leg developer","leg roller attachment","bench leg attachment"],["quads","hams"],PL,[H,G],
 "a pivoting steel arm attached to the front of a weight bench, with two pairs of foam rollers for the shins and a loading horn for plates at the end of the arm")

# ---------------- Dumbbells and kettlebells ----------------
I("db","Dumbbells","DK",["fixed dumbbells","hex dumbbells","pro-style dumbbells","dumbbell rack"],["fullbody"],FW,[H,G,C,BB,HO,U,BX],
 "a two-tier rack holding a row of pairs of fixed round rubber-ended dumbbells with knurled chrome handles, increasing in size along the row")
I("adjdb","Adjustable dumbbells","DK",["selector dumbbells","spin-lock dumbbells","PowerBlock","Bowflex dumbbells"],["fullbody"],FW,[H,G],
 "a pair of adjustable dumbbells sitting in their moulded cradles, each with a handle inside a stack of nested weight plates and a selector dial or pin to choose the load")
I("heavydb","Heavy dumbbells (50 kg+)","DK",["heavy dumbbells","bodybuilding dumbbells"],["fullbody"],FW,[BB,C],
 "a rack of very large round dumbbells with thick plates welded to chunky knurled handles, the heaviest pairs at the end being much bigger than the others")
I("kb","Kettlebells","DK",["kettlebell","competition kettlebells","cast iron kettlebells"],["fullbody","glutes","hams"],FW,[H,G,C,BX,HO,U],
 "a row of cast iron ball-shaped weights with flat bottoms and thick looped handles on top, coloured by weight, from small to large")
I("adjkb","Adjustable kettlebell","DK",["adjustable kettlebell","plate-loaded kettlebell"],["fullbody","glutes"],FW,[H,G],
 "a kettlebell made of a handle and core that accepts stacked weight plates locked into its base, with a selector dial or locking pin")
I("clubs","Clubbells / Indian clubs","DK",["Indian clubs","clubbells","steel clubs"],["fdelt","forearms","upback"],FW,[G,BX,R],
 "a pair of bowling-pin-shaped steel or wooden clubs, narrow at the knurled handle and widening to a heavy rounded end")
I("mace","Steel mace","DK",["mace bell","gada"],["fdelt","forearms","abs"],FW,[G,BX],
 "a long steel bar about 1 m long with a heavy steel ball welded to one end and a knurled shaft")

# ---------------- Cables and attachments ----------------
I("cable_hi","High pulley","CA",["high cable","pushdown station","triceps tower"],["triceps","lats"],CAB,[C,BB,HO,U,H],
 "a single upright steel tower with a weight stack in a guarded frame and one pulley mounted at the top, the cable hanging down with a straight bar attached")
I("cable_mid","Adjustable pulley (any height)","CA",["cable column","adjustable cable","cable tower","single cable station"],["fullbody"],CAB,[C,BB,HO,U,H],
 "a single tall steel tower with a weight stack and a pulley carriage that slides up and down a vertical rail with a pop-pin to set any height, a D-handle clipped to the cable")
I("cable_low","Low pulley","CA",["low cable","floor pulley"],["biceps","glutes","upback"],CAB,[C,BB,HO,U,H],
 "a cable station with a pulley fixed just above floor level at the base of a weight stack tower, with the cable running out horizontally to a handle on the floor")
I("seatedcablerow","Seated cable row","CA",["cable row","low row station","seated row station"],["upback","lats","biceps"],CAB,[C,BB,HO,U],
 "a long low padded bench running away from a weight stack, with an angled footplate at the stack end and a cable emerging from a pulley at foot height with a close-grip V handle")
I("cable_dual","Cable crossover (two stacks)","CA",["cable crossover","crossover machine","double cable","dual cable"],["chest","fullbody"],CAB,[C,BB,HO,U],
 "a wide steel frame with two separate weight stack towers on either side joined by a crossbar with a pull-up bar, each tower with a pulley that slides up and down a vertical rail")
I("functional","Functional trainer","CA",["dual adjustable pulley","FTS","cable motion","Freemotion","Keiser functional trainer"],["fullbody"],CAB,[C,HO,U,H,G],
 "a compact steel frame with two weight stacks side by side and a pair of swinging pulley arms that slide up and down vertical columns on each side, with multi-grip pull-up handles on the top crossbar")
I("latpd","Lat pulldown","CA",["pulldown","lat machine","cable pulldown"],["lats","upback","biceps"],CAB,[C,BB,HO,U,H],
 "an upright frame with a seat and padded thigh roller pads in front of a weight stack, a high pulley above the seat holding a long wide bar with angled ends")
I("latrow","Lat pulldown / low row combo","CA",["combo lat row","dual pulley pulldown row"],["lats","upback","biceps"],CAB,[C,HO,U,H],
 "a single weight stack machine with a seat and thigh pads under a high pulley holding a lat bar, plus a low pulley and footplate at the front for seated rows")
I("cablerope","Triceps rope","CA",["rope","rope attachment","pushdown rope"],["triceps","rdelt","abs"],CAB,[C,BB,HO,U,H,G],
 "a thick braided nylon rope folded in two with a steel snap-link ring at the centre and a rubber stopper ball at each end")
I("straightbar","Straight cable bar","CA",["straight bar","short bar","pushdown bar"],["triceps","biceps"],CAB,[C,BB,HO,U],
 "a short knurled chrome bar about 50 cm long with a swivel mount and clip ring in the centre")
I("ezcable","EZ cable bar","CA",["EZ attachment","cambered pushdown bar"],["biceps","triceps"],CAB,[C,BB],
 "a short chrome bar with a zig-zag W-shaped bend and a central swivel clip ring")
I("vbar","V-bar","CA",["V handle","close-grip handle","double D handle","row handle"],["upback","lats","triceps"],CAB,[C,BB,HO,U],
 "a small triangular steel handle with two parallel neutral rubber-gripped handles side by side and a clip ring at the point of the V")
I("dhandle","D-handle","CA",["single handle","stirrup handle","D handle"],["fullbody"],CAB,[C,BB,HO,U,H],
 "a single D-shaped steel stirrup with a rotating rubber or knurled grip and a ring at the top for clipping to a cable")
I("latbar","Lat bar","CA",["long bar","wide pulldown bar","lat pulldown bar"],["lats","upback"],CAB,[C,BB,HO,U],
 "a long chrome bar about 120 cm wide with ends bent downwards and outwards and rubber grips, with a central swivel clip ring")
I("maggrip","MAG grip / multi-grip handles","CA",["MAG grip","Mag bar","neutral wide bar","multi-grip lat bar","row bar"],["lats","upback"],CAB,[C,BB],
 "a set of row and pulldown handles with a cast aluminium frame in a long U shape, with parallel neutral or pronated grips set at different widths and a clip ring in the centre")
I("anklestrap","Ankle strap","CA",["ankle cuff","cable ankle strap"],["glutes","hams","abductors"],CAB,[C,BB,HO,U,H],
 "a padded neoprene cuff with a hook-and-loop fastening and a metal D ring sewn on, designed to wrap around the ankle and clip to a low cable")

# ---------------- Chest machines ----------------
I("chestpress","Seated chest press (selectorised)","CH",["chest press","converging chest press","seated press machine"],["chest","triceps","fdelt"],SEL,[C,HO,U,BB],
 "a pin-loaded machine with an upright padded seat and backrest, a weight stack behind the seat, and two handle arms that swing forwards from beside the shoulders with vertical and horizontal grips")
I("isochestpress","Iso-lateral chest press (plate-loaded)","CH",["Hammer chest press","iso-lateral bench press","iso-lateral wide chest","plate-loaded chest press","horizontal chest press"],["chest","triceps","fdelt"],PL,[C,BB,U],
 "a plate-loaded machine with an upright padded seat and back pad, two independent pivoting lever arms coming over the shoulders from behind to handles in front of the chest, and a loading horn for plates at the rear of each arm")
I("lyingchestpress","Lying chest press machine","CH",["iso-lateral bench press","lying press","decline/flat bench machine","horizontal bench press machine"],["chest","triceps","fdelt"],PL,[BB,C],
 "a flat padded bench with two independent lever arms arching over the top, each ending in handles above the chest, with plate loading horns at the head end and a footrest at the foot")
I("incchestpress","Incline chest press (selectorised)","CH",["incline press machine","incline chest press"],["chest","fdelt","triceps"],SEL,[C,HO,U],
 "a pin-loaded machine with a seat and a backrest reclined at about 30 degrees, a weight stack behind, and two handle arms that move upwards and forwards at an incline")
I("isoincpress","Iso-lateral incline press (plate-loaded)","CH",["Hammer incline press","iso-lateral incline","super incline press","plate-loaded incline"],["chest","fdelt","triceps"],PL,[C,BB,U],
 "a plate-loaded machine with a seat and reclined back pad, two independent lever arms that pivot from behind and above to handles that drive up and forward at an incline, each with a loading horn")
I("declinepress","Decline chest press machine","CH",["iso-lateral decline press","decline press"],["chest","triceps"],PL,[C,BB],
 "a plate-loaded machine with a seat and upright back pad, thigh pads holding the legs, and two independent lever arms whose handles push forward and downwards from chest height, each with a loading horn")
I("pecdeck","Pec deck","CH",["pec fly","chest fly machine","butterfly machine","pec deck / rear delt"],["chest","fdelt"],SEL,[C,BB,HO,U,H],
 "a pin-loaded machine with an upright seat and backrest, a weight stack behind, and two long swinging arms on either side ending in vertical handles or elbow pads that close together in front of the chest")
I("platefly","Plate-loaded chest fly","CH",["iso-lateral fly","plate-loaded pec fly","standing fly"],["chest"],PL,[BB,C],
 "a plate-loaded machine with a seat and back pad and two long lever arms pivoting from above each shoulder, ending in vertical handles out to the sides, with loading horns on each arm")
I("chestback","Iso-lateral chest / back combo","CH",["chest/back","iso-lateral chest back","combo press row"],["chest","upback","lats"],PL,[C,U],
 "a plate-loaded machine with a seat that faces either way, and two lever arms that can be pushed forwards as a chest press or pulled back as a row, with a chest pad and loading horns")
I("pushupm","Plate-loaded push-up / dip combo","CH",["dip press","dip machine"],["chest","triceps"],PL,[BB],
 "a plate-loaded machine with a seat and back pad and two lever arms with low handles beside the hips that press straight downwards, with loading horns at the rear")

# ---------------- Back machines ----------------
I("latpdplate","Iso-lateral pulldown (plate-loaded)","BK",["Hammer pulldown","plate-loaded pulldown","wide pulldown","iso-lateral wide pulldown"],["lats","upback","biceps"],PL,[C,BB,U],
 "a plate-loaded machine with a seat and thigh roller pads, two independent lever arms reaching up and over the head to angled high handles, with loading horns on the rear of each arm")
I("frontpulldown","Iso-lateral front pulldown","BK",["front lat pulldown","iso-lateral front lat"],["lats","biceps"],PL,[C,BB],
 "a plate-loaded machine with a seat and thigh pads, two lever arms that come down from in front of the face with neutral handles, each arm with a loading horn at the back")
I("rowm","Iso-lateral row (plate-loaded)","BK",["chest-supported row machine","Hammer row","iso-lateral row","plate-loaded row"],["upback","lats","rdelt","biceps"],PL,[C,BB,U],
 "a plate-loaded machine with a seat and a vertical chest pad, two independent lever arms in front with neutral and pronated handles, and loading horns on each arm")
I("seatedrowm","Seated row machine (selectorised)","BK",["chest-supported row","pin-loaded row","seated row machine","mid row"],["upback","lats","rdelt","biceps"],SEL,[C,HO,U],
 "a pin-loaded machine with a seat and an adjustable vertical chest pad, a weight stack at the side or rear, and two handles on arms in front that are pulled towards the torso")
I("highrow","High row machine","BK",["iso-lateral high row","high row"],["lats","upback"],PL,[C,BB,U],
 "a plate-loaded machine with a seat, a thigh pad and two independent lever arms coming down from above and in front at an angle, ending in handles, with loading horns on each arm")
I("lowrow","Low row machine","BK",["iso-lateral low row","low row"],["upback","lats"],PL,[C,BB,U],
 "a plate-loaded machine with a low seat and a chest pad, two independent lever arms with low handles near the floor that are pulled back towards the hips, with loading horns on each arm")
I("dyrow","DY row","BK",["Dorian Yates row","iso-lateral D.Y. row"],["lats","upback"],PL,[C,BB],
 "a plate-loaded machine with a seat and chest pad, two lever arms with handles that pull back and up in an arc towards the lower ribs, with loading horns on each arm")
I("tbar","T-bar row","BK",["T-bar","lever T-bar","standing T-bar row"],["upback","lats"],PL,[C,BB],
 "a long steel lever arm pivoting at floor level from a base, with a footplate the user stands on astride the bar, a handle crossbar with neutral and wide grips at the near end and a loading horn for plates")
I("cstbar","Chest-supported T-bar row","BK",["incline lever row","lying T-bar row","prone T-bar row"],["upback","lats","rdelt"],PL,[C,BB,G],
 "a plate-loaded machine with an inclined chest pad on a frame, a footplate behind, and a pivoting lever arm beneath the pad with a handle crossbar offering wide and neutral grips and a loading horn at the far end")
I("pulloverm","Pullover machine","BK",["Nautilus pullover","pullover"],["lats"],SEL,[BB,C],
 "a pin-loaded machine with an upright seat and lap belt, elbow pads on a large rotating cam arm that sweeps from overhead down to the stomach, and a weight stack behind")
I("dipm","Assisted pull-up / dip machine","BK",["Gravitron","assisted chin dip","chin dip assist"],["lats","biceps","chest","triceps"],SEL,[C,HO,U],
 "a tall pin-loaded machine with a kneeling pad that pushes up from below, pull-up handles across the top and parallel dip handles at mid height, and a weight stack behind")
I("pullupplate","Plate-loaded pull-up / chin assist","BK",["kneeling pulldown","assisted chin plate"],["lats"],PL,[BB],
 "a tall plate-loaded frame with high pull-up handles and a kneeling pad on a lever arm that gives counterbalance, with a loading horn on the lever")
I("backext","Back extension machine","BK",["lumbar extension","lower back machine"],["lowback","glutes"],SEL,[C,HO,U],
 "a pin-loaded machine with a seat, a footrest, a lap pad and a high padded backrest roller on a rotating arm that pushes backwards, with a weight stack to the side")
I("shrugm","Shrug machine","BK",["plate-loaded shrug","standing shrug","seated shrug","ground base shrug"],["traps"],PL,[BB,C],
 "a plate-loaded machine with two lever arms either side of the user, handles at hip height and loading horns at the front, standing on a platform between them")
I("deadliftm","Deadlift / ground base machine","BK",["ground base deadlift","deadlift machine","RDL machine","combo deadlift shrug"],["glutes","hams","upback","traps"],PL,[C,BB],
 "a plate-loaded lever machine with a long floor platform, two pivoting arms on either side ending in handles at knee height, and loading horns for plates on each arm")
I("neckm","Neck machine","BK",["4-way neck","neck flexion extension"],["neck"],SEL,[U,BB],
 "a pin-loaded machine with a seat and a padded head ring on a rotating arm, set so the user presses the head forward, back or to either side against the pad, with a weight stack behind")

# ---------------- Shoulder machines ----------------
I("shoulderpress","Shoulder press machine (selectorised)","SH",["seated shoulder press","overhead press machine","military press machine"],["fdelt","sdelt","triceps"],SEL,[C,HO,U],
 "a pin-loaded machine with an upright seat and back pad, a weight stack behind, and two handle arms beside the head that press straight up overhead")
I("isoshoulderpress","Iso-lateral shoulder press (plate-loaded)","SH",["Hammer shoulder press","plate-loaded shoulder press"],["fdelt","sdelt","triceps"],PL,[C,BB,U],
 "a plate-loaded machine with an upright seat and back pad, two independent lever arms coming forward from behind with handles at shoulder height that drive upwards, with loading horns on each arm")
I("latraisem","Lateral raise machine","SH",["side raise machine","delt raise","standing lateral raise","plate-loaded lateral raise"],["sdelt"],SEL,[C,BB,U],
 "a pin-loaded machine with a seat and chest pad, two arms with elbow pads or handles out to the sides that rotate upwards away from the body, and a weight stack behind")
I("revdelt","Rear delt machine","SH",["reverse pec deck","rear delt fly","reverse fly"],["rdelt","upback"],SEL,[C,BB,HO,U],
 "a pin-loaded machine with a seat facing a vertical chest pad, two swinging arms with handles in front of the chest that open out to the sides, and a weight stack behind")
I("jammer","Jammer","SH",["ground base jammer","standing press jammer"],["fdelt","triceps","quads","chest"],PL,[C,BB,BX],
 "a standing plate-loaded machine with two long lever arms pivoting near the floor at the rear, rising in front of the user to handles at shoulder height, with loading horns at the ends")
I("vikingm","Viking press machine","SH",["Viking press","landmine Viking press"],["fdelt","triceps"],PL,[BB,G],
 "a standing frame with a lever pivoting at floor level, rising to a pair of parallel overhead handles at shoulder height, and a loading horn for plates on the end of the lever")

# ---------------- Arm machines ----------------
I("curlm","Biceps curl machine","AR",["arm curl","seated curl","bicep machine"],["biceps"],SEL,[C,HO,U],
 "a pin-loaded machine with a seat in front of an angled padded arm rest, a rotating cam arm with handles that curls towards the face, and a weight stack beside")
I("preacherm","Preacher curl machine","AR",["plate-loaded preacher curl","Hammer biceps curl","preacher machine"],["biceps"],PL,[C,BB],
 "a seat in front of an angled padded arm rest, with two independent lever arms with handles that curl upwards and a loading horn for plates on each arm")
I("triextm","Triceps extension machine","AR",["triceps machine","overhead triceps machine","arm extension"],["triceps"],SEL,[C,HO,U],
 "a pin-loaded machine with a seat in front of an angled padded arm rest, a rotating arm with handles that extends forwards and down, and a weight stack beside")
I("tridipm","Seated dip machine","AR",["triceps dip machine","seated dip","dip press"],["triceps","chest"],SEL,[C,HO,U],
 "a pin-loaded machine with a seat and back pad, two handles beside the hips on arms that push straight down, and a weight stack behind")
I("standcurlm","Standing curl machine","AR",["standing biceps curl","standing preacher"],["biceps"],PL,[BB],
 "a standing frame with an upright angled arm pad at chest height and a lever arm with a curl handle that rotates upward, with a loading horn for plates")

# ---------------- Leg machines: quads ----------------
I("legpress","45-degree leg press","LQ",["leg press","linear leg press","sled leg press","plate-loaded leg press"],["quads","glutes","adductors"],PL,[C,BB,U,HO,G],
 "a large plate-loaded machine with a reclined padded seat near the floor and a heavy carriage with a wide footplate that slides up and down rails angled at 45 degrees, with loading horns on the carriage and safety catch handles")
I("hlegpress","Horizontal leg press","LQ",["seated leg press","selectorised leg press","cable leg press"],["quads","glutes"],SEL,[C,HO,U],
 "a pin-loaded machine with an adjustable sliding seat and backrest, a vertical footplate in front, handles at the sides of the seat and a weight stack along the side")
I("vertlegpress","Vertical leg press","LQ",["vertical press"],["quads","glutes"],PL,[BB,G],
 "a plate-loaded machine with a padded backrest flat on the floor, a sled with a footplate running straight up and down vertical rails directly overhead, and loading horns on the sled")
I("isolegpress","Iso-lateral leg press (plate-loaded)","LQ",["Hammer leg press","iso-lateral horizontal leg press","seated lever leg press"],["quads","glutes"],PL,[C,BB],
 "a plate-loaded machine with an inclined seat and two independent footplates on lever arms in front, each lever with a loading horn so the legs can push separately")
I("legpresshack","Leg press / hack squat combo","LQ",["leg press hack combo"],["quads","glutes"],PL,[H,G],
 "a compact plate-loaded machine with a sled on 45-degree rails, whose padded seat and shoulder pads flip between leg press and hack squat positions, with a footplate at the bottom and loading horns")
I("hack","Hack squat","LQ",["hack squat machine","plate-loaded hack squat"],["quads","glutes"],PL,[C,BB,U],
 "a plate-loaded machine with a back pad and shoulder pads on a sled that rides up and down rails angled at about 45 degrees, a large angled footplate at the base and loading horns on the sled")
I("revhack","Reverse hack / hack squat combo","LQ",["reverse hack","hack squat reverse","front-facing hack"],["glutes","hams","quads"],PL,[C,BB],
 "a hack squat machine whose sled has a chest pad as well as a back pad so the user can face into it, with shoulder pads, angled rails, a large footplate and loading horns")
I("pendulum","Pendulum squat","LQ",["pendulum","pendulum squat"],["quads","glutes"],PL,[C,BB],
 "a plate-loaded machine with a padded back and shoulder pads on a long swinging arm that pivots from the top of a rear frame, an angled footplate at the base and a loading horn on the arm")
I("vsquat","V-squat","LQ",["V squat","squat press"],["quads","glutes"],PL,[C,BB],
 "a plate-loaded machine with shoulder pads on a lever arm that moves up and slightly forward in an arc from a pivot behind the user, an angled footplate and loading horns at the rear")
I("supersquat","Super squat / power squat","LQ",["power squat","lever squat","leverage squat","super squat"],["quads","glutes"],PL,[C,BB,G],
 "a plate-loaded lever machine with two shoulder pads on a long arm pivoting at the front, a large inclined footplate, side handles and a loading horn on the end of the arm")
I("squatlunge","Squat lunge machine","LQ",["squat lunge","lunge machine"],["quads","glutes"],PL,[C,BB],
 "a plate-loaded machine with shoulder pads and handles on a long lever pivoting from the front at floor level, with a long flat platform to stand on in a squat or lunge stance and a loading horn")
I("beltsquat","Belt squat machine","LQ",["lever belt squat","belt squat"],["quads","glutes"],PL,[C,BB,G],
 "a raised platform with a pivoting lever arm running underneath, a hip belt on a chain hanging from the lever between the feet, handrails at waist height and a loading horn at the end of the lever")
I("pitshark","Pit Shark / hip belt squat machine","LQ",["Pit Shark","hip belt squat","belt squat machine"],["quads","glutes"],PL,[BB,C],
 "a wide square platform with a swing arm beneath it on a central post, a hip belt hanging from the swing arm, waist-high handrails all round and plate loading posts on the arm")
I("beltsquatplat","Portable belt squat platform","LQ",["DIY belt squat","belt squat stand","dip belt squat boxes"],["quads","glutes"],FW,[H,G],
 "a pair of sturdy boxes or a low steel platform with a gap in the middle, used with a dip belt and chain holding plates hanging between the feet")
I("legext","Leg extension","LQ",["leg extension machine","quad extension"],["quads"],SEL,[C,HO,U,BB],
 "a pin-loaded machine with a seat and reclined backrest, a padded shin roller on a lever arm in front of the ankles that rotates upwards, handles by the seat and a weight stack at the side")
I("isolegext","Iso-lateral leg extension (plate-loaded)","LQ",["plate-loaded leg extension","Hammer leg extension"],["quads"],PL,[C,BB],
 "a plate-loaded machine with a seat and backrest and two independent lever arms with shin roller pads in front of each ankle, each with a loading horn")
I("legextcurl","Leg extension / curl combo","LQ",["dual leg extension curl","leg ext curl"],["quads","hams"],SEL,[H,HO,C],
 "a pin-loaded machine with a seat and backrest, a shin roller in front of the ankles and a second roller above the knees so the same arm can extend the knees or curl them, with a weight stack at the side")
I("sissy","Sissy squat bench","LQ",["sissy squat machine","sissy squat stand"],["quads"],BWT,[G,BB,C],
 "a small steel frame with a footplate, a padded ankle lock and a tall padded calf brace on an upright, so the user leans back while kneeling forward")
I("stepupm","Step-up machine","LQ",["selectorised step up","step-up station"],["glutes","quads"],SEL,[C],
 "a pin-loaded machine with a raised step box at knee height, handles in front and a hip belt or shoulder pads connected by cable to a weight stack")

# ---------------- Leg machines: hamstrings and glutes ----------------
I("lyingcurl","Lying leg curl","LH",["prone leg curl","plate-loaded lying curl"],["hams"],SEL,[C,HO,U,BB],
 "a pin-loaded machine with a face-down padded bench angled at the hips, front handles, a padded roller resting on the back of the ankles on a lever arm that curls upwards, and a weight stack at the side")
I("seatedcurl","Seated leg curl","LH",["seated hamstring curl"],["hams"],SEL,[C,HO,U,BB],
 "a pin-loaded machine with an upright seat and backrest, a padded thigh hold-down bar above the knees and a roller behind the ankles on a lever arm that pushes downwards, with a weight stack at the side")
I("standcurl","Standing leg curl","LH",["single-leg standing curl"],["hams"],SEL,[C,BB],
 "a pin-loaded machine where the user stands leaning on a vertical chest pad, with a thigh pad in front of one knee and a roller behind the ankle on a lever that curls up behind, plus a weight stack")
I("kneelcurl","Kneeling leg curl","LH",["kneeling hamstring curl","iso-lateral kneeling curl"],["hams"],PL,[C,BB],
 "a plate-loaded machine with a knee pad and forearm pad, a roller behind one ankle on a lever arm that curls upwards and a loading horn at the end of the lever")
I("hipext","45-degree back extension","LH",["45-degree hyperextension","Roman chair","back extension bench","hyper bench"],["glutes","hams","lowback"],BWT,[C,BB,HO,U,G],
 "a steel frame inclined at 45 degrees with a large angled footplate, a pair of padded ankle rollers and an adjustable padded hip pad near the top")
I("hyper90","90-degree hyperextension","LH",["horizontal back extension","flat Roman chair"],["lowback","glutes","hams"],BWT,[C,U],
 "a horizontal steel frame with a padded hip pad at the front and ankle rollers at the rear so the user lies face down and bends at the hips over the front")
I("ghd","Glute-ham developer","LH",["GHD","glute ham raise","GHR bench"],["hams","glutes","abs"],BWT,[BX,G,C,U],
 "a long steel frame with a large rounded thigh pad, a footplate with padded ankle rollers behind it adjustable on a rail, and handles at the front")
I("revhyper","Reverse hyper","LH",["reverse hyperextension","Westside reverse hyper"],["glutes","hams","lowback"],PL,[G,BB,BX],
 "a tall steel frame with a flat face-down pad at hip height, two front handles, and a swinging arm hanging beneath the back of the pad with an ankle strap and a loading horn for plates")
I("nordicbench","Nordic curl bench","LH",["Nordic bench","Nordic hamstring curl","Nordic station"],["hams"],BWT,[G,U,BB,C,R],
 "a long padded kneeling bench with a low steel frame, padded ankle hooks behind the knees and a slightly inclined board in front, so the user kneels and leans forward")
I("glutedrive","Hip thrust machine","LH",["Glute Drive","hip thrust machine","glute bridge machine","plate-loaded hip thrust","pendulum hip press"],["glutes","hams"],PL,[C,BB],
 "a low plate-loaded machine with a reclined back pad, a padded belt or lever pad that sits across the hips, a footplate in front, and loading horns on each side of the hip lever")
I("standhipthrust","Standing hip thrust machine","LH",["Booty Builder standing hip thrust","standing glute thrust"],["glutes"],SEL,[C],
 "a standing machine with a footplate, a vertical chest pad, and a padded belt behind the hips connected to a weight stack or plate lever that the user drives forwards")
I("kickbackm","Glute kickback machine","LH",["rear kick machine","glute machine","donkey kick machine","glute press"],["glutes"],SEL,[C,BB],
 "a pin-loaded machine with a chest or forearm pad, a knee pad and a footplate on a lever arm behind that pushes backwards and up, with a weight stack at the side")
I("abductor","Hip abductor","LH",["outer thigh machine","abduction machine","inner/outer thigh combo"],["glutes","abductors"],SEL,[C,HO,U],
 "a pin-loaded machine with a reclined seat and two padded leg arms on the outside of the knees that push outwards, with a weight stack at the rear")
I("standabductor","Standing hip abduction machine","LH",["standing abductor","3D abductor"],["glutes","abductors"],SEL,[C],
 "a pin-loaded machine where the user stands holding front handles, with a padded lever against the outside of one thigh that swings outwards and a weight stack at the side")
I("adductor","Hip adductor","LH",["inner thigh machine","adduction machine"],["adductors"],SEL,[C,HO,U],
 "a pin-loaded machine with a reclined seat and two padded leg arms on the inside of the knees that squeeze inwards, with a weight stack at the rear")
I("multihip","Multi-hip machine","LH",["4-way hip","multi hip"],["glutes","adductors","abductors","hipflex"],SEL,[C,U,R],
 "a pin-loaded machine with a standing platform that raises and lowers, front handles and a rotating padded lever at hip height that can be set for kicks forwards, backwards, inwards and outwards")
I("revlunge","Reverse lunge machine","LH",["lunge machine","Booty Builder lunge"],["glutes","quads"],PL,[C],
 "a standing machine with a footplate at the front and a lever with shoulder pads or handles that the user steps back away from into a lunge, loaded with plates")
I("splitsquatm","Split squat machine","LH",["split squat","Bulgarian split squat stand","split squat stand"],["quads","glutes"],FW,[C,G],
 "a frame with a forward footplate and a padded roller behind on an adjustable post to rest the rear foot on, sometimes with a lever and loading horn above for shoulder loading")

# ---------------- Leg machines: calves and other ----------------
I("calfm","Standing calf raise","LC",["standing calf machine","calf raise machine","plate-loaded calf raise"],["calves"],SEL,[C,BB,U],
 "a pin-loaded machine with two padded shoulder pads on a lever above, a raised calf block underfoot and a weight stack behind")
I("seatedcalf","Seated calf raise","LC",["seated calf machine"],["calves"],PL,[C,BB,U],
 "a plate-loaded machine with a low seat, a padded bar resting across the top of the thighs, a raised foot block under the balls of the feet and a loading horn above the knees")
I("donkeycalf","Donkey calf raise","LC",["donkey calf machine"],["calves"],PL,[BB],
 "a plate-loaded machine with a foot block, a forearm rest in front and a padded lever resting across the lower back and hips, with plate loading horns")
I("calfpress","Calf press machine","LC",["seated calf press","calf extension","calf press"],["calves"],SEL,[C,HO,U],
 "a pin-loaded machine with a reclined seat and a short footplate in front on which only the balls of the feet rest, pressing forwards, with a weight stack at the side")
I("tibm","Tibialis machine","LC",["tib raise machine","tib bar machine","dorsiflexion machine"],["tibialis"],PL,[BB,G,R],
 "a low seat with a padded roller across the top of the feet on a lever arm in front, with a heel cup and a loading horn for plates at the end of the lever")
I("tibbar","Tibialis bar","LC",["tib bar","tib dorsi bar"],["tibialis"],FW,[G,H,R],
 "a short steel bar with a padded roller across the top of the foot, a short plate loading post and a strap to hold the foot")
I("calfblock","Calf raise block","LC",["calf block","calf step","slant block"],["calves"],BWT,[H,G,C],
 "a solid wooden or steel block with a sloped top surface covered in grip tape, designed to stand on with the heels hanging off")

# ---------------- Core machines ----------------
I("abcrunchm","Ab crunch machine","CO",["abdominal machine","crunch machine"],["abs"],SEL,[C,HO,U],
 "a pin-loaded machine with a seat, padded foot rollers and padded handles or chest pads on an arm above, which curl down towards the knees, and a weight stack at the side")
I("torso","Rotary torso","CO",["torso rotation machine","oblique machine"],["obliques","abs"],SEL,[C,U],
 "a pin-loaded machine with a rotating seat, padded knee and chest pads and handles, which twists from side to side, with a weight stack at the rear")
I("captain","Captain's chair","CO",["vertical knee raise","VKR","power tower","dip station"],["abs","hipflex"],BWT,[C,HO,U,H],
 "a tall steel station with a padded back rest, two padded forearm rests with handles at elbow height so the legs hang free, and often a pull-up bar on top")
I("declinesitup","Decline sit-up bench","CO",["sit-up bench","decline ab bench"],["abs"],BWT,[C,HO,U,H],
 "a padded bench angled head-down with an adjustable height and foot rollers at the raised end to lock the feet")
I("abbench","Ab crunch bench","CO",["ab board","ab bench","crunch board"],["abs"],BWT,[C,H],
 "a short low padded bench with a curved back pad and front foot rollers, used for crunches lying flat")
I("abcoaster","Ab coaster","CO",["ab coaster","knee-up glider"],["abs"],BWT,[C],
 "a steel frame with a curved rail on which a padded knee carriage slides up and down, with arm rests and handles at the top")

# ---------------- Cardio ----------------
I("treadmill","Treadmill","CV",["running machine","motorised treadmill"],["cardio"],MOT,[H,C,HO,U,R],
 "a motorised running machine with a long flat rubber belt deck, side rails, front handlebars and an upright console with a screen")
I("inclinetm","Incline trainer","CV",["high-incline treadmill","incline walker"],["cardio","glutes","calves"],MOT,[C,HO,H],
 "a motorised treadmill that tilts steeply upwards to a 30 to 40 percent incline, with a long belt, front handles and a large touchscreen console")
I("curvedtm","Curved / self-powered treadmill","CV",["curved treadmill","AirRunner","manual treadmill","Woodway","Skillmill"],["cardio"],AIR,[BX,C,U],
 "a non-motorised treadmill with a concave curved slatted running surface that dips in the middle, and handles at the front")
I("rower","Rowing machine","CV",["rower","indoor rower","Concept2","water rower","erg"],["cardio","upback","quads"],AIR,[H,G,C,BX,HO,U],
 "a long horizontal rail with a sliding seat, angled footplates with straps, a handle on a chain at the front and a flywheel inside a fan housing or water tank")
I("skierg","SkiErg","CV",["ski erg","ski machine"],["cardio","lats","triceps"],AIR,[BX,C,U,G],
 "a tall narrow upright frame with a flywheel housing at the top, two handles on cords dropping from pulleys, and an optional floor platform")
I("bikeerg","BikeErg","CV",["bike erg"],["cardio","quads"],AIR,[BX,C],
 "an upright bike with an air-resistance flywheel enclosed in a fan cage at the front, a saddle, pedals and adjustable handlebars")
I("airbike","Assault / air bike","CV",["fan bike","Assault bike","Echo bike","Airdyne"],["cardio","fullbody"],AIR,[BX,C,G,U],
 "an upright bike with a large fan wheel at the front, moving handlebars linked to the pedals, a saddle and a small console")
I("uprightbike","Upright bike","CV",["exercise bike","stationary bike"],["cardio","quads"],AIR,[H,C,HO,U],
 "an upright stationary bike with a saddle, pedals, handlebars and console on a sleek frame with an enclosed flywheel")
I("recumbent","Recumbent bike","CV",["reclined bike"],["cardio","quads"],AIR,[C,HO,U,R],
 "a stationary bike with a low seat with backrest and pedals in front of the user, with side handles and a console")
I("spinbike","Spin bike","CV",["indoor cycle","studio bike","Peloton bike","Wattbike"],["cardio","quads"],AIR,[H,C,HO,U],
 "an indoor cycling bike with a heavy exposed flywheel at the front, a narrow saddle, drop handlebars and a resistance knob")
I("turbo","Smart turbo trainer","CV",["turbo trainer","smart trainer","Wahoo Kickr"],["cardio","quads"],AIR,[H],
 "a compact folding stand that a road bike's rear wheel or frame attaches to, with a resistance unit at the rear")
I("elliptical","Cross-trainer","CV",["elliptical","cross trainer"],["cardio"],AIR,[H,C,HO,U],
 "a machine with two long foot pedals tracking an oval path, moving handles linked to the pedals, and a console on a front upright")
I("amt","Adaptive motion trainer","CV",["AMT","Precor AMT","open stride trainer"],["cardio"],AIR,[C],
 "a large cardio machine with two foot pedals hanging from swinging arms, moving handles, and a curved upright frame, allowing the stride length to change freely")
I("arctrainer","Arc trainer","CV",["Cybex arc trainer"],["cardio","glutes","quads"],AIR,[C,U],
 "a cardio machine with foot pedals that move in an arc, moving handles and a raised console")
I("lateraltrainer","Lateral trainer","CV",["side-to-side trainer","Octane lateral X"],["cardio","glutes","abductors"],AIR,[C],
 "a cardio machine with foot pedals that swing outwards and inwards as well as forwards, and a central upright console")
I("stairs","Stair climber","CV",["StairMaster","stairmill","revolving stairs"],["cardio","glutes","quads"],MOT,[C,HO,U],
 "a tall motorised machine with a revolving staircase of steps, side handles and a console at chest height")
I("stepper","Stepper","CV",["step machine","mini stepper"],["cardio","glutes"],AIR,[C,H],
 "a machine with two independent pedals that move up and down, side rails and a console")
I("versaclimber","VersaClimber","CV",["vertical climber","climber machine"],["cardio","fullbody"],AIR,[BX,C],
 "a tall vertical mast with foot pedals and hand grips that slide up and down alternately, and a small display")
I("jacobs","Jacob's ladder","CV",["ladder mill","climbing ladder"],["cardio","fullbody"],MOT,[BX,C],
 "an inclined frame with a continuous ladder of horizontal rungs running in a loop at about 40 degrees, with a hip belt on a tether")
I("ube","Upper body ergometer","CV",["arm bike","hand bike","arm ergometer","UBE"],["cardio","fdelt"],AIR,[R,C,U],
 "a table-height stand with two crank handles connected to a flywheel, a chair in front for the user")
I("nustep","Recumbent cross-trainer","CV",["NuStep","seated stepper"],["cardio"],AIR,[R],
 "a seated machine with a swivelling chair, pedals in front and long moving handles connected to the pedals")

# ---------------- Conditioning and HYROX ----------------
I("sled","Sled / prowler","HY",["prowler","push sled","drag sled","HYROX sled"],["quads","glutes","cardio"],FW,[BX,C,G,U],
 "a steel sled with flat runners, two vertical push poles of different heights, a central loading post for plates and a tow ring for a rope")
I("sledrope","Sled pull rope","HY",["sled rope","tow rope","harness"],["upback","lats","biceps"],FW,[BX,C],
 "a long thick braided rope clipped to the front of a loaded sled, coiled on the floor in front of it")
I("turf","Turf track","HY",["astro track","sled track"],["fullbody"],BWT,[BX,C,U],
 "a long strip of green artificial turf laid flat on a gym floor, edged with white lane lines")
I("battleropes","Battle ropes","HY",["battle rope","conditioning rope"],["cardio","fdelt","forearms"],BWT,[BX,C,G],
 "a long heavy rope looped around an anchor point, with both ends lying on the floor with grip sleeves")
I("ropetrainer","Rope pull machine","HY",["rope trainer","Marpo","endless rope trainer"],["lats","biceps","cardio"],AIR,[BX,C],
 "a tall frame with an endless rope that runs through a resistance unit, so the user pulls hand over hand")
I("flywheel","Flywheel trainer","HY",["kBox","Exxentric","flywheel squat platform","kPulley"],["quads","glutes","fullbody"],AIR,[U,R,C],
 "a low square platform with a flywheel housed inside, and a strap connected to a harness or handle above")
I("wallball","Wall ball and target","HY",["wall ball","medicine ball target"],["quads","fdelt"],FW,[BX,C,G],
 "a soft medicine ball with stitched seams in front of a wall-mounted target at about 3 m height")
I("sandbag","Sandbag","HY",["HYROX sandbag","strongman sandbag","Bulgarian bag"],["fullbody"],FW,[BX,G,C],
 "a heavy padded bag filled with sand, with handles on the sides")
I("medball","Medicine ball","HY",["med ball","soft medicine ball"],["abs","fullbody"],FW,[H,G,C,BX,HO,U,R],
 "a round rubber ball about the size of a football with a grippy textured dimpled surface, resting on a gym floor beside two smaller ones")
I("slamball","Slam ball","HY",["dead ball","no-bounce ball"],["fullbody","abs"],FW,[BX,C,G],
 "a heavy thick-walled black rubber ball with a ribbed, textured surface and a visible fill valve, slightly squashed where it rests on the floor")
I("box","Plyo box","HY",["jump box","soft plyo box","box jump"],["quads","glutes","calves"],BWT,[BX,C,G,U,H],
 "a three-height box with rectangular faces of different dimensions, made of plywood with a hand-hold cut-out on each side, or covered in thick foam with vinyl")
I("agility","Agility ladder / hurdles","HY",["speed ladder","mini hurdles","agility cones"],["cardio","calves"],BWT,[BX,U,O],
 "a flat strap ladder with yellow plastic rungs laid on artificial turf, next to a row of small plastic step-over hurdles and some marker cones")
I("sledgehammer","Sledgehammer","HY",["sledge","hammer and tyre"],["obliques","abs","fdelt"],FW,[BX,G],
 "a long wooden or steel-shafted hammer about 90 cm long with a heavy flat-faced steel head, leaning against a large tractor tyre lying flat on the floor")
I("jumprope","Jump rope","HY",["skipping rope","speed rope"],["cardio","calves"],BWT,[H,G,C,BX,HO],
 "a thin coated steel cable rope with two slim aluminium handles containing bearings, laid out in a loop on the floor")
I("weightvest","Weighted vest","HY",["weight vest","plate carrier","Murph vest"],["fullbody"],FW,[H,G,BX],
 "a short tactical-style vest with front and back pockets holding flat steel weight plates, held on by wide hook-and-loop side straps")
I("torquetank","Resisted push sled (wheeled)","HY",["Torque Tank","wheeled sled","magnetic push sled"],["quads","glutes","cardio"],AIR,[BX,C,U],
 "a compact wheeled push sled with a central resistance unit and dial, two vertical push handles and a low frame on four wheels that can be used on any floor")

# ---------------- Strongman ----------------
I("yoke","Yoke","SM",["super yoke","yoke carry"],["fullbody","traps","quads"],FW,["strongman",G,BB],
 "a tall rectangular steel frame with two vertical uprights and a padded crossbar at shoulder height, loading horns on the lower legs and a flat base, so the user stands under the crossbar and lifts it")
I("farmerhandles","Farmer's handles","SM",["farmer's walk handles","farmers carry handles"],["forearms","traps","fullbody"],FW,["strongman",G,BX,BB],
 "a pair of long steel bars, each with a central knurled handle raised on a frame and loading horns at each end, sitting parallel on the floor loaded with plates")
I("framecarry","Frame carry","SM",["frame","deadlift frame","carry frame"],["forearms","traps","fullbody"],FW,["strongman"],
 "a large rectangular steel frame with two long parallel side rails with handles, loading posts on each end and connecting cross members, sitting on the floor")
I("stones","Atlas stones","SM",["Atlas stone","stone of strength","stone trainer","loading platform"],["fullbody","glutes","upback"],FW,["strongman",G,BX],
 "a set of round grey concrete spheres of increasing size resting on the floor, next to a square steel loading platform at chest height")
I("husafell","Husafell stone","SM",["Husafell","flat stone carry"],["fullbody","upback"],FW,["strongman"],
 "a large flat triangular slab of stone or cast steel with a pointed top, carried against the chest")
I("tyre","Tyre","SM",["tractor tyre","tyre flip"],["fullbody"],FW,["strongman",BX,G],
 "a huge black tractor tyre about 1.5 m across with deep treads, lying flat on its side on the ground")
I("log","Log","SM",["log press","strongman log"],["fdelt","triceps","fullbody"],FW,["strongman",G],
 "a thick hollow steel cylinder about 30 cm across with two neutral handles cut into a recess in its middle and standard loading sleeves at each end")
I("circusdb","Circus dumbbell","SM",["thick-handled dumbbell","strongman dumbbell"],["fdelt","triceps","forearms"],FW,["strongman"],
 "a dumbbell with a very thick handle and two large spherical or plate-loaded heads on each end")
I("keg","Keg","SM",["strongman keg","keg toss"],["fullbody"],FW,["strongman",BX],
 "a metal or plastic barrel-shaped keg, weighted with sand or water, standing on its end")
I("conanwheel","Conan's wheel","SM",["Conan wheel","wheel walk"],["fullbody","abs"],FW,["strongman"],
 "a long steel lever arm attached to a central pivot post, with a crook handle at the end that the user carries in the crook of the arms as they walk in a circle, and loading horns near the end")
I("armover","Arm-over-arm pull","SM",["truck pull rope","hand-over-hand sled","arm over arm"],["lats","biceps","upback"],FW,["strongman"],
 "a loaded sled at the end of a long thick rope that passes over a low bench or seated platform, so the user pulls the rope hand over hand")
I("fingal","Fingal's fingers","SM",["Fingal's fingers"],["fullbody","fdelt"],FW,["strongman"],
 "a set of long steel poles hinged at their bottom ends, which the user walks up from horizontal to vertical, increasing in size")
I("carDL","Car deadlift frame","SM",["deadlift jack","car deadlift"],["fullbody","glutes","hams"],FW,["strongman"],
 "a long steel lever frame with handles at one end and plate loading horns at the other, sitting on a pivot, simulating lifting a car")
I("hercules","Hercules hold","SM",["Hercules pillars","pillar hold"],["forearms","upback"],FW,["strongman"],
 "two tall upright steel pillars set apart, each with a handle attached by a chain, which the user holds to keep the pillars from falling")

# ---------------- Bodyweight and accessories ----------------
I("pullup","Pull-up bar","BW",["chin-up bar","doorway pull-up bar"],["lats","biceps"],BWT,[H,G,C,BX,U,O],
 "a horizontal steel bar mounted at head height, with knurled grips at each end")
I("dip","Dip bars","BW",["dip station","dip attachment","parallel bars"],["chest","triceps"],BWT,[H,G,C,BX,U,O],
 "two parallel horizontal bars mounted on a frame at about waist height, with padded or knurled grips")
I("rings","Gymnastic rings","BW",["Olympic rings","wooden rings"],["lats","chest","triceps"],BWT,[G,BX,U,H],
 "a pair of wooden rings suspended from two long webbing straps with cam buckles, hanging side by side")
I("trx","Suspension trainer (TRX)","BW",["TRX","suspension straps"],["fullbody"],BWT,[H,HO,C,BX],
 "a single anchor strap splitting into two adjustable nylon webbing straps with rubber handles and foot cradles at the bottom")
I("anchor","Foot anchor / Nordic strap","BW",["somewhere to anchor feet","foot anchor","door anchor","sofa"],["hams","abs"],BWT,[H,G],
 "a padded strap that wraps around a door or a fixed bar, with a looped end for the ankles")
I("wallbars","Wall bars","BW",["stall bars","Swedish ladder"],["fullbody","abs"],BWT,[G,R,U],
 "a tall wooden frame mounted to the wall with evenly spaced horizontal rungs from floor to ceiling")
I("bands","Resistance bands","BW",["power bands","loop bands","band pegs"],["fullbody"],BWT,[H,G,C,BX,HO,R],
 "a set of long, flat latex rubber bands in different colours and thicknesses, coiled on the floor")
I("minibands","Mini bands / hip circle","BW",["hip circle","booty band","glute band"],["glutes","abductors"],BWT,[H,G,C,R],
 "a set of short, wide fabric or latex loop bands in different colours")
I("hangboard","Fingerboard / hangboard","BW",["hangboard","fingerboard"],["forearms","lats"],BWT,[H,G],
 "a wooden or resin board mounted on the wall above a doorway, with edges and pockets of various depths for gripping")
I("abwheel","Ab wheel","BW",["ab roller","ab wheel"],["abs"],BWT,[H,G,C,HO],
 "a small rubber wheel with a central axle and two short foam-covered handles sticking out from each side")
I("swissball","Stability ball","BW",["Swiss ball","exercise ball","gym ball"],["abs","fullbody"],BWT,[H,C,HO,R],
 "a large inflatable PVC ball about 65 cm across")
I("parallettes","Parallettes","BW",["parallette bars","push-up handles"],["chest","triceps","abs"],BWT,[H,G,BX],
 "a pair of low parallel bars on short legs, each about 60 cm long")
I("dipbelt","Dip / weight belt","BW",["dip belt","chin belt"],["fullbody"],FW,[G,C,BB],
 "a curved leather or nylon belt with a heavy chain running through two rings at each end")
I("climbrope","Climbing rope","BW",["rope climb"],["lats","biceps","forearms"],BWT,[BX,G,U],
 "a thick, braided rope hanging vertically from a ceiling beam to the floor")
I("pegboard","Pegboard","BW",["peg board"],["lats","biceps","forearms"],BWT,[BX,G],
 "a tall wooden board mounted vertically on the wall, with rows of holes and two removable wooden pegs")
I("slidder","Sliders","BW",["gliding discs","core sliders"],["abs","hams"],BWT,[H,HO],
 "a pair of round flat plastic discs used for sliding exercises on smooth floors")
I("wristroller","Wrist roller","BW",["forearm roller"],["forearms"],FW,[G,C,BB],
 "a short wooden or steel bar with a rope wound around the middle, ending in a carabiner for weight plates")
I("grippers","Grip trainers","BW",["hand grippers","Captains of Crush","pinch block"],["forearms"],BWT,[H,G],
 "a pair of steel torsion spring grippers with knurled aluminium handles")
I("neckharness","Neck harness","BW",["head harness","neck strap"],["neck"],FW,[G,BB],
 "a leather or nylon head harness with straps that go over the top and around the back of the head, ending in a chain for weights")
I("hangstraps","Hanging ab straps","BW",["ab slings","hanging ab slings"],["abs","hipflex"],BWT,[H,G,C],
 "x")
I("stepplat","Aerobic step","BW",["step platform","Reebok step"],["quads","glutes","cardio"],BWT,[C,HO,H],
 "x")
I("sprintharness","Resisted sprint harness","HY",["sprint parachute","partner harness","speed chute"],["quads","glutes","cardio"],BWT,[U,O,BX],
 "x")

# ---------------- Mobility and rehab ----------------
I("foamroller","Foam roller","MR",["foam roller","grid roller","massage roller"],["fullbody"],BWT,[H,G,C,HO,U,BX,R],
 "x")
I("massageball","Massage ball","MR",["lacrosse ball","peanut ball","trigger point ball"],["fullbody"],BWT,[H,G,C,R],
 "x")
I("massagegun","Massage gun","MR",["percussion gun","Theragun"],["fullbody"],MOT,[H,G,C],
 "x")
I("yogamat","Exercise / yoga mat","MR",["yoga mat","stretching mat","gym mat"],["fullbody"],BWT,[H,C,HO,U,R],
 "x")
I("dowel","PVC pipe / dowel","MR",["mobility stick","broomstick","PVC pipe"],["fullbody"],BWT,[G,BX,R],
 "x")
I("stretchstrap","Stretch strap","MR",["yoga strap","stretch out strap"],["fullbody"],BWT,[H,R,C],
 "x")
I("stretchm","Stretching machine","MR",["stretch trainer","Precor stretch trainer","Life Fitness stretch"],["fullbody"],BWT,[C,U],
 "x")
I("slantboard","Slant board","MR",["incline board","knees-over-toes board"],["quads","calves","tibialis"],BWT,[H,G,R],
 "x")
I("balanceboard","Balance / wobble board","MR",["wobble board","rocker board"],["calves","abs"],BWT,[R,H],
 "x")
I("bosu","BOSU ball","MR",["half ball","balance trainer"],["abs","fullbody"],BWT,[C,R,H],
 "x")
I("reformer","Pilates reformer","MR",["reformer"],["fullbody","abs"],CAB,[R,C,H],
 "x")
I("inversion","Inversion table","MR",["inversion board"],["lowback"],BWT,[H,R],
 "x")
I("plinth","Treatment plinth","MR",["physio couch","treatment table"],["fullbody"],BWT,[R],
 "x")
I("parallelbars","Rehab parallel bars","MR",["walking bars","gait bars"],["quads","glutes"],BWT,[R],
 "x")
I("totalgym","Incline bodyweight trainer","MR",["Total Gym","incline sled trainer"],["fullbody"],BWT,[H,R],
 "x")
I("rehablegpress","Rehab leg press / jump trainer","MR",["Shuttle MVP","shuttle leg press"],["quads","glutes","calves"],CAB,[R],
 "x")
I("antigravity","Anti-gravity treadmill","MR",["AlterG","unweighted treadmill"],["cardio"],MOT,[R],
 "x")
I("isokinetic","Isokinetic dynamometer","MR",["Biodex","isokinetic machine"],["quads","hams"],MOT,[R],
 "x")
I("vibration","Vibration plate","MR",["Power Plate","whole body vibration"],["fullbody"],MOT,[C,H,R],
 "x")

I("racklevers","Rack lever arms","RB",["lever arms","jammer arms","rack jammer arms"],["fullbody","fdelt","chest"],PL,[G,C],
 "a pair of long steel lever arms that pin into the lower holes of a power rack upright at each side and pivot upwards, each with a handle near the free end and a short loading sleeve for plates")
I("diypulley","Plate-loaded pulley (DIY)","CA",["loading pin pulley","rack pulley","LAT pulley system"],["lats","triceps","biceps"],CAB,[H,G],
 "a single steel pulley clamped to the top crossmember of a rack, with a steel cable running over it down to a vertical loading pin with plates at the bottom and a handle at the other end")
I("jungle","Multi-station cable jungle","CA",["4-stack multi-station","jungle gym","multi-station"],["fullbody"],CAB,[C,HO,U],
 "a large central steel frame with four weight stacks arranged around it, each feeding a different station: a lat pulldown seat, a low row bench, a high and low adjustable pulley and a crossover arm")
I("treadwall","Climbing wall / treadwall","HY",["bouldering wall","Treadwall","rotating climbing wall"],["lats","forearms","fullbody"],MOT,[U,C],
 "a tall panelled wall covered in coloured resin climbing holds, either a fixed bouldering wall with crash mats beneath or a motorised rotating wall panel loop")
I("punchbag","Punch bag","HY",["heavy bag","boxing bag","speed bag"],["cardio","fdelt","abs"],BWT,[C,BX,G,H,HO],
 "a long cylindrical black leather heavy bag about 1.2 m tall hanging from a ceiling bracket by four chains joined to a swivel, with a pair of boxing gloves on the floor beneath")
I("rebounder","Mini trampoline / rebounder","HY",["rebounder","mini trampoline"],["cardio","calves"],BWT,[H,C,R],
 "a small round trampoline about 1 m across on six short legs, with a black jumping mat and a padded cover over the springs, and an optional T-shaped handle bar")
I("ankleweights","Ankle weights","BW",["cuff weights","ankle cuffs with weight"],["glutes","hipflex","abductors"],FW,[H,C,R],
 "a pair of padded fabric cuffs filled with sand or iron pellets, with hook-and-loop straps that wrap around the ankle")
I("monkeybars","Monkey bars","BW",["overhead ladder","outdoor bars"],["lats","forearms","biceps"],BWT,[O,BX,G],
 "a horizontal steel ladder raised about 2.2 m off the ground on two A-frame supports at each end, with evenly spaced round rungs")
I("shoulderpulley","Shoulder pulley / wheel","MR",["over-door shoulder pulley","shoulder wheel","overhead pulley"],["fdelt","sdelt"],BWT,[R,H],
 "a wall-mounted wheel with a rotating handle on its rim and an adjustable arm, beside an over-door pulley with a rope running through and two handles on its ends")

I("standadductor","Standing hip adduction machine","LH",["standing adductor","Booty Builder standing adductor"],["adductors"],SEL,[C],
 "a pin-loaded machine where the user stands on a platform holding front handles, with a padded lever against the inside of one thigh that sweeps inwards across the body, and a weight stack at the side")

OVR = {
"hangstraps":"a pair of padded nylon loops with steel carabiners at the top, clipped to an overhead pull-up bar so the upper arms rest in the loops and the body hangs below",
"stepplat":"a low rectangular moulded plastic step about 1 m long with a ridged non-slip rubber top and stackable riser blocks under each end",
"sprintharness":"a padded waist belt with a long nylon tether running behind to a trailing fabric parachute or to a partner's hand loop, laid out on a running track",
"foamroller":"a firm foam cylinder about 15 cm across and 45 cm long with a textured grid surface over a hollow plastic core, lying on a gym floor",
"massageball":"a small hard rubber ball the size of a tennis ball beside a double peanut-shaped ball made of two joined spheres",
"massagegun":"a handheld percussive massage device shaped like a hairdryer, with a rubber grip handle, a motor body and a round foam head on a short shaft",
"yogamat":"a thin rectangular rubber exercise mat about 180 cm long, partly rolled up at one end, lying flat on a wooden floor",
"dowel":"a straight lightweight white PVC pipe or wooden dowel about 1.5 m long and 3 cm thick, lying on a gym floor",
"stretchstrap":"a long flat nylon webbing strap with a series of sewn loops along its length for the hands and feet",
"stretchm":"a compact steel frame with a padded seat at the front, padded knee pads below and two curved handlebars above on a ladder of grip positions, used to sit and pull into assisted stretches",
"slantboard":"a flat wooden board about 40 cm wide raised at the back to a steep incline of 20 to 30 degrees on fixed legs, with grip tape covering the top surface",
"balanceboard":"a round flat wooden disc about 40 cm across with a half-sphere pivot underneath it so it tilts in all directions, with a grip surface on top",
"bosu":"a large inflated half-sphere of blue rubber about 60 cm across fixed to a flat rigid black plastic base with two handles cut into its rim",
"reformer":"a long low wooden or aluminium bed frame with a padded sliding carriage on rails, shoulder blocks, an adjustable footbar at one end, springs underneath and two ropes with hand loops on pulleys",
"inversion":"a tall A-shaped steel frame with a padded backrest on a central pivot, ankle locking rollers at the bottom and handles at the sides, tilted head-down",
"plinth":"a long padded medical treatment couch on a height-adjustable electric steel base, with an adjustable backrest section and a face hole at one end",
"parallelbars":"two long parallel handrails about 3 m long on adjustable height posts, set about 60 cm apart on a flat base platform",
"totalgym":"a long padded glide board running on rails along an inclined steel column that adjusts in height, with a squat footplate at the base and two cable handles over pulleys at the top",
"rehablegpress":"a long low frame on which the user lies on their back on a sliding padded carriage, pushing against a large flat footplate in front, with resistance cords underneath",
"antigravity":"a treadmill enclosed in a sealed inflatable fabric chamber at waist height, with a zip-in waist opening, side handles and a front console",
"isokinetic":"a large clinical machine with a padded adjustable chair with straps, a motorised dynamometer head on a column beside it and a lever arm with a shin pad, linked to a computer screen",
"vibration":"a low flat platform with a rubber-covered top, a central upright column with handles and a small display console at waist height",
"pullup":"a straight knurled steel bar mounted horizontally above head height between two wall brackets or across the top of a rack, with angled neutral grip handles at each end",
"dip":"a pair of parallel steel bars about 50 cm apart and 1.2 m high on a sturdy free-standing frame, with knurled or rubber grips",
"rings":"a pair of smooth wooden rings about 23 cm across, hanging side by side from long black webbing straps with cam buckles from an overhead beam",
"trx":"a single anchor strap at the top splitting into two adjustable yellow and black nylon webbing straps with rubber handles and foot cradles at the bottom, hanging from a door or bar",
"anchor":"a padded nylon strap with a foam ankle loop and a flat anchor tab that closes inside a door, alongside a low padded bar for hooking the feet under",
"wallbars":"a tall wooden frame about 2.4 m high fixed flat to a wall, with evenly spaced round wooden rungs running from floor to near the ceiling",
"bands":"a set of long flat looped latex bands of different colours and widths, coiled on the floor and one hooked over a steel peg at the base of a rack",
"minibands":"a set of short wide loop bands made of woven fabric with rubber grip strips, in three colours of increasing thickness, laid flat",
"hangboard":"a wooden or resin board mounted on a wall above a doorway, with a row of edges, pockets and slopers of various depths along its face and a jug hold at each end",
"abwheel":"a small rubber-tyred wheel about 18 cm across with a central axle and two short foam-covered handles sticking out either side",
"swissball":"a large smooth inflated PVC ball about 65 cm across, resting on a gym floor",
"parallettes":"a pair of low parallel steel or wooden bars about 60 cm long on short splayed legs, set side by side on the floor",
"dipbelt":"a curved padded leather or nylon belt with a heavy steel chain running from one end ring to the other with a carabiner, with a weight plate hanging on the chain",
"climbrope":"a thick braided natural fibre rope about 4 cm across hanging vertically from a steel beam high above, reaching down to the gym floor",
"pegboard":"a tall rectangular wooden board fixed vertically to a wall, with two columns of round holes running up its length and two wooden pegs sitting in holes near the bottom",
"slidder":"a pair of round flat plastic gliding discs about 18 cm across, with a smooth underside and a soft foam top, resting on a wooden floor",
"wristroller":"a short knurled steel bar with a length of rope wound around its middle and a carabiner at the end of the rope holding a weight plate",
"grippers":"a pair of steel torsion spring hand grippers with knurled aluminium handles, beside a small steel pinch block with a loading pin",
"neckharness":"a leather or nylon head harness with straps that go over the top and around the back of the head, joined by a short chain with a carabiner for hanging weight plates",
"sandbag":"a heavy cylindrical bag made of thick black cordura nylon with several side and end grab handles, stuffed tight and resting on the floor",
"husafell":"a large flat triangular slab of stone or a cast steel equivalent shaped like a thick arrowhead, about 60 cm tall, lying flat on rubber flooring",
"circusdb":"a large single dumbbell with a very thick rotating handle about 6 cm across and two big hollow spherical heads, one with a loading port, standing on its end",
"keg":"a steel beer keg with two built-in side handles, weighted with sand or water, standing upright on the floor",
"fingal":"a set of three long steel poles of increasing length, each hinged at its base on a ground bracket and lying flat on the floor, ready to be flipped upright",
"carDL":"a long steel lever frame with two parallel handles at one end at knee height and plate loading horns at the other end, pivoting on a raised fulcrum near the middle",
"hercules":"two tall upright steel pillars set apart on hinged bases, each with a handle on a short chain, so the user stands between them holding both handles to stop the pillars falling",
"wallball":"a soft stitched vinyl medicine ball about 35 cm across, in front of a flat wall with a round target painted or mounted at 3 m height",
"ube":"a table-height pedestal with two crank handles that rotate around a central axle connected to a flywheel, and a display console, with a chair placed in front",
"nustep":"a seated machine with a large swivelling padded chair with armrests, two pedals in front and two long moving handles linked to the pedals, with a small console",
"turbo":"a compact folding stand that a road bike's rear axle locks into, with the rear wheel removed and the bike chain running on a cassette mounted on a resistance unit with a heavy flywheel",
"stepper":"a compact machine with two independent pedals that move up and down on hydraulic arms, side handrails and a small console",
"jumprope":"a thin coated steel cable rope with two slim aluminium handles containing bearings, laid out in a loop on the floor","arctrainer":"a cardio machine with two long foot pedals on arms that travel along a curved arc track from a low rear pivot, moving handles in front linked to the pedals and a raised console on a central upright",
"ropetrainer":"a tall vertical steel frame with an endless thick rope that loops around a pulley at the top and runs through a resistance unit at the bottom, with a seat or standing platform in front",
"flywheel":"a low square aluminium platform with a flywheel disc mounted inside a frame at one end, a strap running up from the centre of the platform to a padded harness or handle above",
"mace":"a long steel bar about 1 m long with a heavy steel ball welded to one end and a knurled shaft, standing upright on the ball end",
"straightbar":"a short knurled chrome bar about 50 cm long with a swivel mount and a clip ring in the centre for connecting to a cable",
"ezcable":"a short chrome bar about 50 cm long with a zig-zag W-shaped bend, knurled grips and a central swivel clip ring for connecting to a cable",
"sledrope":"a long thick braided rope about 15 m long, clipped to the tow ring at the front of a loaded steel sled, coiled loosely on the floor in front of it",
"battleropes":"a long heavy braided rope about 4 cm thick looped around a steel anchor point fixed to the floor, with both ends lying parallel on the floor with grip sleeves",
"turf":"a long strip of green artificial turf about 2 m wide and 20 m long laid flat on a gym floor, edged with white lane lines and distance markers",
"stairs":"a tall motorised machine with a revolving staircase of steps that rotate downwards like an escalator, side handrails and a console at chest height",
"versaclimber":"a tall vertical mast about 2.5 m high angled slightly forwards, with two foot pedals at the base and two hand grips higher up that slide up and down alternately, and a small display",
"recumbent":"a stationary bike with a low wide seat with a padded backrest, pedals in front of the user at hip height, side handles and a console on an upright",
}


def fix():
    seen=set()
    for it in ITEMS:
        assert it["id"] not in seen, it["id"]; seen.add(it["id"])
        if it["id"] in OVR: it["_desc"]=OVR[it["id"]]
    return ITEMS
fix()

# ---------------- build ----------------
PROPER = {"Olympic","Nordic","Jacob's","SkiErg","BikeErg","VersaClimber","EZ","DY","T-bar","V-squat","V-bar","Pit","Viking","Conan's","Husafell","Fingal's","Hercules","Pilates","MAG","BOSU","PVC","Assault","GHD","Smith"}
PLURAL = {"db","kb","adjdb","heavydb","bumpers","chains","clubs","dip","rings","bands","parallettes","slidder","grippers","stones","battleropes","landminehandle","fixedbb","jhooks","monkeybars","ankleweights","hangstraps","racklevers","fatgrips","farmerhandles","wallbars","blocks","minibands","parallelbars","fingal","stretchstrap"}
OLD = ["bb","ez","trapbar","ssb","swissbar","cambered","axle","fixedbb","landmine","chains","rack","halfrack","bench","flatbench","declinebench","benchrack","inclinestation","preacher","platform","jhooks","db","kb","adjdb","pullup","dip","rings","trx","anchor","bands","box","hangboard","abwheel","swissball","parallettes","dipbelt","medball","slamball","wallball","battleropes","climbrope","pegboard","cable_hi","cable_mid","cable_low","cable_dual","functional","latpd","chestpress","incchestpress","declinepress","pecdeck","revdelt","shoulderpress","latraisem","smith","dipm","rowm","tbar","seatedrowm","highrow","lowrow","pulloverm","latpdplate","backext","curlm","preacherm","triextm","tridipm","legpress","hlegpress","hack","pendulum","beltsquat","vsquat","legext","lyingcurl","seatedcurl","standcurl","kneelcurl","hipext","ghd","revhyper","nordicbench","glutedrive","kickbackm","multihip","adductor","abductor","calfm","seatedcalf","donkeycalf","tibbar","abcrunchm","torso","captain","declinesitup","treadmill","curvedtm","rower","skierg","bikeerg","airbike","uprightbike","recumbent","spinbike","elliptical","stairs","stepper","versaclimber","jacobs","sled","sandbag","yoke","farmerhandles","stones","tyre","log","turf"]
assert len(OLD)==118, len(OLD)
ids={i["id"] for i in ITEMS}
missing=[k for k in OLD if k not in ids]
assert not missing, missing

def subject(it):
    n=it["name"]; first=n.split()[0]
    if first not in PROPER and not first[0].isdigit():
        n=n[0].lower()+n[1:]
    if it["id"] in PLURAL: return "A set of "+n
    art = "An" if n[0].lower() in "aeiou" else "A"
    return f"{art} {n}"

out=[]
for it in ITEMS:
    d=it.pop("_desc").rstrip(".")
    it["image_prompt"]=f"{subject(it)}, {d}."
    out.append(it)
# order by group order
gorder=list(GROUPS.values())
out.sort(key=lambda x: gorder.index(x["group"]))
cat={"groups":[{"name":g,"count":sum(1 for x in out if x["group"]==g)} for g in gorder],"items":out}
txt=json.dumps(cat,indent=1,ensure_ascii=False)
assert "—" not in txt and "–" not in txt
json.dump(cat,open("/home/claude/ajtraining/research/equipment_catalogue.json","w"),indent=1,ensure_ascii=False)

md=["# AJ Training equipment catalogue","",f"{len(out)} items in {len(gorder)} groups. Full data (aliases, muscles, loading, gym types, image prompts) is in equipment_catalogue.json. Items marked * keep a key from the old onboard.js EQG list.",""]
for g in gorder:
    its=[x for x in out if x["group"]==g]
    md.append(f"## {g} ({len(its)})"); md.append("")
    for x in its:
        star="*" if x["id"] in OLD else ""
        md.append(f"- {x['name']}{star} `{x['id']}` ({x['loading']})")
    md.append("")
m="\n".join(md)
assert "—" not in m
open("/home/claude/ajtraining/research/equipment_catalogue.md","w").write(m)
for g in cat["groups"]: print(g["count"], g["name"])
print(len(out))
