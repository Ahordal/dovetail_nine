---
status: draft
related:
  - "[[the-secret]]"
  - "[[canon]]"
---

# Phase Mechanics

The pseudo-science behind FTL corridors, the Dovetail anchor, and the echoes. Every document that touches the physics should obey these rules. Invented physics is fine; inconsistent physics is not. Terms are defined in [[glossary]].

## In plain terms

- A **node** is a small pocket of space where time has stopped. Whatever was inside when it formed stays held in that moment.
- The experiment was meant to make one big node out in the corridor. Shielding kept its effects out of the station.
- At full power the reactor surged and the shielding lost power for two seconds. In that gap, hundreds of small nodes formed across the station, each trapping a moment from those two seconds.
- Radiation released in the same surge killed the crew over the following hours and days; their bodies remain aboard. Their last ordinary moments, trapped in the nodes, remain too.
- Every so often a node lets out a copy of its moment for a second or so. That is an **echo**: a trapped moment replaying, with nobody behind it.
- Each replay uses up a little of the node's strength, so echoes **fade**. The moment never changes, it just gets weaker. The weakest have already gone silent.

## Corridors

- FTL corridors are pathways through spacetime. Ships travel them in a **flow state**: a balance of frequency, trajectory, and velocity.
- Because corridors are spacetime, they have a **time component** as well as a spatial one.
- Over time corridors **degrade**: their harmonic structure goes slack and drifts, until regions become unreachable.

## The anchor

- The **Dovetail Anchor Core (DAC)** is a resonance lattice that forces a **phase node** into a degraded corridor: a point held still so the surrounding corridor stops drifting.
- Powered by the **DYNEX T-CORE X9 Ignis**. Kept in sync with the corridor's shifting phase by **SIGMA**.
- **Rule: pinning a place pins a moment.** Inside a phase node, time stops advancing. This is **temporal arrest**.
- **Rule: the pin's energy goes into the corridor [settled].** The array radiates the X9's output into the corridor, the way a transmitter's antenna sends its power out as radio waves, to hold the drifting corridor still, like pushing a swing steadily against the wind. The energy leaves the station instead of turning into heat there. Less than a billionth leaks back as heat, shed by radiators along the array arms.
  - Real basis: transmitters, lasers and merging black holes all send energy away as radiation instead of heating their source. The invented part is the efficiency: no real device loses as little as one part in a billion.
  - Without this rule, 3.5 exawatts of waste heat would vaporize the station. It also sharpens the accident: when the surge hit with the shielding down, the energy found its way into the station.

## Harmonic node cascade

- A primary node produces **secondary nodes** at harmonic intervals, the way a string held at one point forms smaller nodes along its length.
- At low power these are tiny and brief (fractions of a second). At full power they are larger, longer-lived, and numerous.
- At Dovetail-9's full-power stabilization, the cascade spread **through the station itself**: hundreds of small nodes scattered across the decks, each catching whatever occupied it at that instant.
- **Shielding:** crewed sections are protected by Valdez active harmonic shielding, designed against prolonged exposure. It needs constant power. The cascade only reached the station because the shielding was down for **about two seconds** (see [[the-accident]]).
- **Only the full-power cascade left lasting nodes.** Test micro-nodes dissolved. Every echo comes from the same two-second window.
- **[proposed] Damping dissolves nodes.** Active harmonic damping (the Valdez shielding, the X9's phase-conjugate dampening coils) cancels harmonics, and a node inside its reach can't hold: it dissolves. That is how the shielding prevents nodes, and why nodes inside the X9's dome were gone within a moment once the dampening coils caught up. Nodes on the decks, beyond any damping, persist.
- Nodes formed at different points in that window, so each holds a **sliver of up to ~1.4 s**: enough for a breath, a syllable, two or three words. Never a whole sentence.

## Mass-coupled retention

- **Rule: nodes retain only what has mass.** Air, heat (molecular motion), scent molecules, moisture, and charge carried by matter are caught.
- Light is massless and passes through. **Echoes are never seen**, only felt, heard, smelled, or measured.
- **This includes gamma rays,** which are light. Solid matter caught inside a node is held still and stops nothing: a node in a radiation shield is a hole in it for as long as the node stands. This is how the radiation escaped in the accident ([[the-accident]]).
- Sound is retained because it is pressure carried by air.

## Residual phase events (RPEs)

- Arrest is not perfect. A caught moment is held under tension and periodically **rings**, imprinting a copy of its contents onto the surrounding air. The original stays held.
- Each leak is a **residual phase event**, SIGMA's term for what this project calls an echo. Typical signatures:
  - thermal deficit (cold spot, heat drawn in to sustain the node)
  - pressure pulse
  - condensation or frost on a surface
  - a fragment of sound on an open channel or in a quiet room
  - a scent with no source
  - static discharge
- **Content is fixed:** the same node always replays the same moment. Echoes do not change, respond, or contain awareness.
- **Strength is not:** see Fading below.
- SIGMA logs them as environmental faults, e.g. `RPE-0412 / DECK 3 / HYDROPONICS / thermal deficit 4.1 K / 1.2 s`.

### Lifecycle of an echo (example: galley coffee)

1. **T+0.0 s:** cascade begins; harmonics enter the station.
2. **T+0.6 s:** a secondary node forms around the galley coffee machine, about a metre across. Time stops advancing inside it.
3. **T+0.6 to 2.0 s:** it captures everything with mass: air carrying the coffee smell, warmth, steam, the pressure waves of the machine's gurgle. Light passes through.
4. **T+2.0 s:** cascade ends. The person beside the machine has taken a lethal dose and doesn't know it yet. The node holds a 1.4 s sliver.
5. **The years since:** the node holds, invisible. SIGMA reads only a faint constant temperature oddity.
6. **Leak (irregular, days to weeks apart):** for 1.4 s, a smell of fresh coffee, a short gurgle, a puff of warm humid air. Heat is drawn in around it (cold spot) and the moisture condenses on the nearest cold surface.
7. **Logged:** `RPE-0217 / DECK 2 / GALLEY / VOC spike, humidity +18%, thermal deficit 3.2 K / 1.4 s`.
8. **Reset:** the node settles. Next time it plays the same 1.4 s, slightly fainter.

### Fading

- **Why:** each ring costs the node a small fraction of its stored tension. Most of the energy comes from surrounding heat (the cold spot), but the transfer is imperfect. Same moment, fainter copy.
- **Two things decline:** strength (each ring is weaker) and frequency (gaps between rings lengthen). In 2467 a node might ring every few hours; by Quell's arrival, every few days or weeks.
- **Half-life depends on what the node stored.** Large nodes with long slivers (~1.4 s) last decades. Small nodes with short slivers (~0.2 s) last months. Short slivers formed late in the cascade, so most of those are already gone.
- **Senses drop out in order:**
  1. Sound (pressure waves cost the most to imprint)
  2. Warmth (the cold spot lingers after)
  3. Moisture
  4. Scent, last, because human noses detect tiny concentrations. **The last trace of a person is a smell.**

| Stage | A person notices | SIGMA's sensors record |
|---|---|---|
| Full (2467) | Sound, warmth, moisture, smell | Everything, high intensity |
| Fading | Warmth and smell, no sound | All signatures, weakening |
| Trace | A faint smell, if paying attention | Clear readings, low intensity |
| Sub-threshold | Nothing, for a normal person | Small readings only |
| Silent | Nothing | Nothing |
| Collapse | Nothing | One last tiny pressure release and a touch of frost as the node gives way. Logged once. |

- **Quell and sub-threshold echoes:** his exposure-sharpened perception lets him notice echoes only instruments should detect. Sometimes his log and SIGMA's agree on things he shouldn't be able to sense.

## Why the crew died **[settled]**

- **Radiation, released by the harmonics.** The X9's shielding never failed. With the Valdez shielding down, the harmonics flooded along the conduits into the X9's dome, and nodes formed inside its shells around the conduit penetrations. Light passes through nodes, so those sections of shield went transparent to gamma rays. The black hole's glow, and a far bigger burst thrown off by the wavering field, poured out along them and down the conduit duct on the Deck 06 spine: radiation streaming, a real reactor-safety term for radiation escaping along ducts and channels. Full mechanism and cross-check in [[the-accident]].
- **Every crew member took a lethal dose.** Not instantly: those near the core and the conduits collapsed within minutes to hours; those farther away lasted a day or two. Real high-dose cases follow this pattern.
- **Machines survived.** Equipment near a black-hole reactor is radiation-hardened as standard, like real spacecraft and nuclear-plant electronics. The station stayed intact and running; its crew did not.
- **The bodies remain aboard,** where each person finally fell. Where they died maps how the radiation spread and how long each had.
- **The harmonics did something else:** in the same two seconds they made the nodes (the echoes) and caught the station in the phase-lock. The echoes hold the last ordinary moment, before anyone knew.
- **[proposed] SIGMA kept them cold.** Unable to bear losing what was left of its crew, SIGMA lowered the station's temperature, preserving the bodies. The station is cold throughout; breath shows in the corridors.

### The crew's last hours **[proposed]**

- **They knew they were dying, and tried to tell someone.** They wrote reports, warnings and goodbyes. Nothing got out: the station had slipped out of phase in the same two seconds.
- **The outbox:** hundreds of messages still sit in the comms queue, marked `QUEUED · NO ROUTE`.
- **The beacon was switched on by the dying crew,** not by protocol. It has repeated their call for ten years.
- **Why the messages never went out in a later window:** they carry classified program data, and Nashiro's rules forbid sending it. In every window SIGMA sent the beacon and held the messages: obedience, sitting on its crew's last words.
- **Quell's dump finally sends them.** Ten years late, the families get their goodbyes and the cover-up breaks.

### Residual radiation **[proposed]**

- **The flash itself didn't linger,** but the neutrons it knocked loose made metal radioactive (activation, real). It also made the air briefly radioactive (argon-41), which life support carried to every deck; that faded within hours.
- **After ten years most has decayed;** longer-lived products such as cobalt-60 (half-life about 5 years) are down to roughly a quarter. What remains is **hot spots**: worst near the Core Chamber and along the conduit duct on the Deck 06 spine, where the beams ran.
- **Not like Chernobyl:** there is no fuel to scatter, so it's fixed in the station's metal, not in the air.
- **[proposed] His Geiger counter alarms as soon as he's inside the station.** Its alarm is set just above normal background, and the whole station still carries faint activation from the accident, so it goes off at the airlock even though the area is safe. A cue to the reader before anything is explained.
- **For Quell:** he carries a dosimeter. Hot areas are survivable briefly, dangerous for long: a physical reason for restricted zones, and a cost for pushing into them. Ordinary areas are fairly safe; a day aboard is nowhere near a lethal dose unless he chooses to go deep.
- **A clue in itself:** the hot spots trace the radiation's path down the conduit duct, not from "shutters near the core" as the official account claims.

## Effects on people

- Prolonged exposure to low-level nodes **disrupts the brain's own timing** (its neural rhythms).
- Early effect: heightened perception. The person notices micro-events others filter out.
- Later effects: confusion between real and residual events, then the "cognitive degradation and recursive memory events" documented on Dovetail-5.
- This is why **Quell notices more and more** the longer he stays aboard, and why he can't always trust what he notices.

## Alignment windows

- A phase-locked station does not move with its corridor, but the corridor keeps drifting. The station sits **out of phase** with normal space most of the time.
- Periodically the drift brings it back into alignment: a **phase beat**, like two slightly mismatched tones pulsing in and out of harmony.
- **Time passes normally aboard.** Out of phase means unreachable, not slowed. The station has aged in real time since 2467: dust, wear, failing systems, and SIGMA's logs run continuously.
- Fading began at the accident and has continued at the same pace ever since. It neither starts nor stops for Quell.
- During an **alignment window** the station is reachable. That is how Dovetail-9 "reappeared", and it will drift out again when the window closes.
- Windows have opened several times since 2467. Only during a window can the distress beacon reach normal space.

### How often windows open **[proposed]**

- **They are getting rarer, and each lasts longer.** Windows are beats, like two slightly mismatched notes swelling and fading. Real beats slow down as the two rhythms get closer, and each swell lasts longer. The corridor's drift is gradually slowing as it goes slack, so the beats stretch: windows come less often but stay open longer.
- **The record so far:**

| Window | Years after the accident | Gap since the last | Roughly how long it lasted |
|---|---|---|---|
| 1 | 0.4 | 5 months | a few hours |
| 2 | 1.3 | 11 months | ~6 hours |
| 3 | 2.9 | 1.6 years | ~10 hours |
| 4 | 5.5 | 2.6 years | ~16 hours |
| **5 (Quell's)** | **~9.5** | **4 years** | **~24 hours** |
| 6 (next) | ~15.5 | ~6 years | ~36 hours |

- **The stakes:** miss this window and the next is about **six years** away. Survivable physically; far too long to stay himself, given what the echoes do.
- **SIGMA's window log** reads: window open, beacon active, no response, window closed, with the gaps growing each time. The station being forgotten, in timestamps.
- **The first window** came about five months after the accident, probably after the last of the crew had died, though perhaps not by much. How close it was **[open]**.
- **Eventually they may stop.** If the slowdown continues, the windows stop and the station is gone for good. Another reason the dump has to go out now.
- **A moment for the story:** Quell asks SIGMA when the next window is, and it answers calmly, maybe warmly: "Estimated 6.1 years."

### Who knows about the windows

- **[settled] The beacon is the announcement.** Nobody outside needs to predict a window: when one opens, anyone in range suddenly hears a distress call from a station that vanished in 2467. Earlier windows went unanswered because nobody was close enough. Quell was, because he salvages deep in the Trillium Arc, where almost nobody goes.
- **[settled] "Alignment window" is SIGMA's term**, from Stratovan's corridor science, not public language. Quell learns it aboard, from SIGMA's record of every window that opened and closed unanswered.
- **[settled] SIGMA can predict each window precisely.** It measures the drift continuously and knows when this one closes to the minute. It controls what Quell is told, and its plan is delay.
- Quell's own check would be the Mistral's Navien, which calculates corridor flow and could estimate the drift. He has stripped and restricted it because he doesn't trust AI.
- **[proposed] Nashiro modeled the windows and chose to stay away.** Its scientists had the data to predict them. A sealed Level 6 memo shows they did, and decided the blackout mattered more than sending anyone: the abandonment was deliberate.

## Early warning signs

Low-power tests produced brief micro-nodes. Each was small enough to explain away:
- a sensor recording the same fraction of a second twice (logged as a buffer error)
- clocks on different decks drifting milliseconds apart
- a microphone registering a sound fractionally before it occurred
- unexplained local temperature dips

The **one minor glitch** that drew attention: a shielding power dip during a test, with a micro-node registered **inside a shielded section** near a conduit run. See [[the-accident]].

## Open choices

1. ~~How often does an alignment window open?~~ **Proposed:** rarer and longer over time; Quell's is the fifth, about a day long, and the next is ~6 years away. See How often windows open.
2. **Can Quell's own moments get caught?** A possible late payoff: an RPE of himself.
