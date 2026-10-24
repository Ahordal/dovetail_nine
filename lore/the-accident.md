---
status: draft
related:
  - "[[the-secret]]"
  - "[[phase-mechanics]]"
  - "[[canon]]"
---

# The Accident

How Dovetail-9 failed, modeled on real cascade failures. Every safety system worked as designed; their combined behavior opened a two-second gap.

Framework: the **Swiss cheese model** (James Reason). Every safety layer has holes. Disaster happens when the holes in every layer line up at once.

## The safety layers

The full plant and every safeguard are in [[x9-power-system]]. The layers whose holes lined up:

| Layer | Purpose | Its hole |
|---|---|---|
| Array throttle-back | SIGMA throttles the Anchor Core back to holding power to cut harmonic feedback at its source | The array is a resonator: it rings down over **about two seconds**, and stopping it fully would drop the pin |
| Valdez active harmonic shielding | Keeps harmonics out of crewed sections and away from the conduits | Designed against **prolonged** exposure (the Dovetail-5 lesson), not a sudden full-power transient |
| Primary power bus | Powers the shielding | Trips on a surge, by design |
| Isolated backup bus | Takes over within milliseconds | Isolated from electrical faults, but **not from the station's power authority** |
| Shield capacitor banks | Bridge sub-second gaps | Bank B under-charged on the day, waived |
| Containment-priority protocol | Gives the X9's auxiliaries (cryogenics, charge injectors, dampening coils) every watt in a transient | Ranks shielding below them (Power Priority Matrix rev. 4) |
| Dampening coils | Cancel harmonic feedback at the trap | Sized for the residual feedback behind working Valdez shielding, not the full flood |
| Radiation shielding | Three shells, offset penetrations | Proof against any source short of one that would destroy the station, **unless a path opens** |
| Ventilation | Recirculates air station-wide | No isolation for airborne radioactivity: radiation inside the crewed station was considered impossible |

**Why containment outranks shielding:** losing containment means the singularity's stored spin energy (~2.6 × 10²⁸ J) discharging uncontrolled, with no known limit to the damage (see [[dynex-t-core-x9-ignis]]). The ZK-Class failsafe (antimatter injection, ~3.2 km destruction radius) is the *controlled* worst case. Protecting containment at all costs is a defensible engineering call.

## Months before

- **Design basis.** Shielding is specified to protect crew health over weeks of exposure. A brief outage is judged harmless, like stepping out of a radiation shelter for a moment. No earlier station had reached a full-power cascade with crew aboard, so nobody modeled one.
- **Power Priority Matrix, rev. 4.** Shielding is moved below containment late in development. **[open]** Who signed it and why: certification, schedule, or cost.
- **Containment-priority protocol** written by DYNEX and Nashiro engineers. SIGMA executes it automatically.

## Test campaign

- Low-power tests produce the early warning signs in [[phase-mechanics]]: repeated sensor frames, clock drift, temperature dips.
- **The glitch.** During one test, a containment flicker triggers the protocol for a few milliseconds. Shielding power dips, and in that same moment a micro-node registers **inside a shielded section**, near a conduit run. It is filed as **two separate tickets**, "power fluctuation" and "sensor fault", and both are closed. Nobody links them.
- A junior researcher notices and messages a colleague privately. It goes no further.
- **[proposed]** Later tests show smaller dips. Each is accepted because nothing bad happened. The deviation becomes normal.

## The day

- **Schedule pressure [proposed].** Full-power stabilization must happen while the corridor's phase is in the right position, a narrow window. Missing it means months of delay. Nashiro sets the date.
- **Pre-run checks.** Shield capacitor bank B reads below spec. The administrator, with no doubts about the experiment, signs a waiver.
- **Final hour [proposed].** The corridor's phase drifts faster than predicted and the window is closing. The ramp to full power is accelerated.

## The two seconds

Times from the moment the Anchor Core reaches full power.

| Time | Event |
|---|---|
| T+0.000 s | Primary node forms in the corridor. Harmonic feedback travels back through the conduits into the X9. |
| T+0.040 s | X9 output surges toward its 7.8 EW threshold. Containment field wavers. The wavering field induces surges in the station's wiring. |
| T+0.052 s | Primary bus breakers trip on the induced surge, correctly. Shielding switches to the backup bus. |
| T+0.055 s | SIGMA throttles the array back to holding power, correctly. It begins ringing down, and feedback keeps coming until it settles. |
| T+0.058 s | Containment-priority protocol fires, correctly. The X9's auxiliaries are fighting the wavering field at full demand, and SIGMA gives them every watt, backup bus included. |
| T+0.060 s | Shielding falls back on its capacitor banks. Under-charged bank B drains first. |
| T+0.5 s | Capacitors exhausted. **Shielding down.** Harmonics flood along the conduit runs, into the crewed sections and into the X9's dome where the conduits pass through its shells. The dampening coils are overwhelmed. |
| T+0.5 to 0.6 s | Secondary nodes form across every deck, and inside the shells around the conduit penetrations, where the harmonics are strongest and the nodes largest. |
| T+0.6 to 2.0 s | Inside those nodes the shield material is held still, and **light passes straight through**. Straight paths open through the shells. The black hole's glow, and a far bigger burst of gamma rays thrown off by the wavering field, pour out along them: down the conduit duct fore and aft, and out through the structure. Every crew member takes a lethal dose. |
| T+2.0 s | The array settles at holding power. Feedback stops. The pin holds, and the station is caught in it. |
| T+2.1 s | Containment stabilizes. The dampening coils catch up and dissolve the nodes inside the dome; the shells are whole again. Protocol releases power. |
| T+2.4 s | **Shielding restored.** About two seconds too late. The nodes on the decks, beyond the coils' reach, persist. |

## How the radiation got out

- **Solid shielding can't fail in two seconds,** and it cuts radiation by a fixed factor: to kill through it, the source would have to be about ten billion times stronger, enough to destroy the station. So the radiation must have bypassed it.
- **The nodes opened the path.** A node holds anything with mass and lets light through ([[phase-mechanics]]). Nodes that formed inside the shells made those sections transparent to gamma rays for as long as they stood.
- **They lined up with the conduits,** because that is where the harmonics came in. The beams went down the conduit duct along the Deck 06 spine, which is why the hot spots follow the conduit runs.
- **The dose:** through an open path, the glow alone gives about 7 Gy at 100 m and far more nearer in. The glow itself is constant, but the wavering field threw off a burst of gamma rays many times stronger (a tiny fraction of the surge, harmless to the station's structure), enough to be lethal through the decks across the hull.
- **It spread after the flash.** Gamma rays striking steel knock out neutrons, which made the station's metal radioactive along the beam paths and the air radioactive with argon-41. Life support carried that air to every deck. Argon-41 fades within hours; the metal stays radioactive for years.
- **Why the dying took a day or two:** nobody escaped the dose. There was no ship, no refuge, and the station had slipped out of phase. Those in the beams died within minutes to hours; the rest took a lower but lethal dose from the flash, the air and the walls.
- **Why it stopped:** once containment steadied, the dampening coils dissolved the nodes inside the dome and the shells became solid again. Without that, the glow would still be pouring out.

## Cross-check

| Safeguard | Did it work as designed? | Why it didn't stop the deaths |
|---|---|---|
| Array throttle-back | Yes, at T+0.055 s | Ring-down takes about two seconds; the window was those two seconds |
| Primary bus breakers | Yes | They removed the shielding's main supply |
| Backup bus | Yes, electrically | SIGMA's power authority redirected it, as the protocol required |
| Capacitor banks | Partly | Bank B, under-charged and waived, drained first; even full banks were sized for a switchover, not two seconds |
| Containment-priority protocol | Yes | It protected containment by starving the shielding |
| Dampening coils | Yes | Overwhelmed by the flood they were never sized for, then cleared the dome's nodes once they caught up |
| Radiation shielding | Yes: it never failed | Nodes made sections of it transparent |
| Radiation monitors | Yes | Detection only; nowhere to go |
| Ventilation | Yes | No isolation for airborne radioactivity, so it spread argon-41 everywhere |
| ZK-Class Override | Yes, correctly not triggered | Containment control was never lost beyond recovery |
| Containment | Held | That was the point: the protocol worked |

**Without Power Priority Matrix rev. 4,** the backup bus keeps the Valdez shielding up, the harmonics never flood the conduits, the dampening coils cope, no nodes form in the shells, and the crew lives. That is why rev. 4 matters, and why the cover-up hides it.

To the crew, the whole thing felt like a single instant: a flash. Then the alarms. Those nearest the core and conduits collapsed within minutes to hours; the rest lasted a day or two, cut off, writing messages that could not leave the station (see [[phase-mechanics]]).

## After

- SIGMA logs thousands of alarms in the first second. There is nobody left to read them.
- The station is phase-locked and drifts out of phase with normal space. Nashiro loses signal.
- Nashiro issues a blackout order. Records are later sealed under NCIA/2470.

## The official account **[proposed]**

DYNEX's sealed technical dossier on the X9 tells a different story, and it's the one in the corporate record:

- An "unforeseen resonance wave" from the corridor synced with the containment coils and the magnetic bottle oscillated.
- The containment protocol pulled every reserve to stiffen the fields, spiking toward the 7.8 EW ceiling.
- Safety interlocks **cycled the primary radiation shutters open for two seconds** to vent overpressure, "exposing the adjacent core spaces".
- There are no such shutters in the design. The invention explains a two-second radiation release without admitting what really opened the shells.

It is **half true**: radiation did kill the crew. What it hides is *why* the shielding failed. It never mentions the harmonic shielding, the backup bus, Power Priority Matrix rev. 4, capacitor bank B or the waiver, and it places the radiation at "shutters near the core", not pouring through nodes in the shells and down the conduit duct to every deck. A reader who finds both this account and the station's own records can see what the official version leaves out.

## Real-world parallels

| Real accident | Pattern | Dovetail-9 equivalent |
|---|---|---|
| **Chernobyl** (1986) | A safety test, delayed and rushed. A known design flaw (the control rods briefly *raised* power when inserted) had been noticed before but not widely shared | The full-power run, pushed by the corridor window. The X9's harmonic sensitivity was in DYNEX's own notes |
| **Three Mile Island** (1979) | A stuck valve, and an indicator that showed what the valve was *told* to do, not what it did. A near-identical incident at another plant two years earlier was never passed on | The glitch: split across two tickets, so nobody saw the whole picture |
| **Challenger** (1986) | O-ring damage seen on earlier flights, accepted because nothing had gone wrong yet. Engineers' objections overruled on launch day | Smaller dips accepted after the glitch. Researchers' concerns kept private. The administrator's waiver |
| **Fukushima Daiichi** (2011) | Backup generators existed, but one cause (the tsunami) took them out along with the main power. The design assumed a smaller wave than came | The backup bus existed, but the containment protocol could reach it. Shielding designed for prolonged exposure, not a transient |
| **2003 Northeast blackout** | Alarm software failed silently, so operators didn't know the grid was failing until it cascaded | The containment protocol worked silently and correctly, and nobody saw the shielding drop until it was over |

## Open choices

1. Who signed Power Priority Matrix rev. 4, and why.
2. Whether the corridor-window schedule pressure is canon.
3. How many tests showed dips after the glitch.
4. Who the junior researcher was, and who they messaged.
