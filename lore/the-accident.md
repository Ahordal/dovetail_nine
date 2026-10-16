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

| Layer | Purpose | Its hole |
|---|---|---|
| Valdez active harmonic shielding | Blocks harmonics from entering crewed sections | Designed against **prolonged** exposure (the Dovetail-5 lesson), not a sudden full-power transient |
| Primary power bus | Powers the shielding | Trips on surge, by design |
| Isolated backup bus | Takes over within milliseconds | Isolated from electrical faults, but **not from the station's power authority** |
| Shield capacitor banks | Bridge sub-second gaps | Bank B under-charged on the day, waived |
| Containment-priority protocol | Diverts every reserve to X9 containment if it wavers | Ranks shielding below containment (Power Priority Matrix rev. 4) |
| X9 containment | Holds the singularity | DYNEX's own notes: destabilizes under prolonged harmonic exposure |

**Why containment outranks shielding:** losing containment means an uncontrolled singularity, with no known limit to the damage. The ZK-Class failsafe (antimatter injection, ~3.2 km destruction radius) is the *controlled* worst case. Protecting containment at all costs is a defensible engineering call.

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
| T+0.040 s | X9 output surges toward its 7.8 EW threshold. Containment field wavers. |
| T+0.052 s | Primary bus breakers trip, correctly. Shielding switches to the backup bus. |
| T+0.058 s | Containment-priority protocol fires, correctly. SIGMA diverts all reserves, backup bus included, to containment. |
| T+0.060 s | Shielding falls back on its capacitor banks. Under-charged bank B drains first. |
| T+0.5 s | Capacitors exhausted. **Shielding down.** Harmonics enter along the conduit runs. |
| T+0.6 to 2.0 s | Harmonic node cascade spreads through every deck. Nodes catch slivers of up to ~1.4 s. Crew knocked out of phase. |
| T+2.1 s | Containment stabilizes. Protocol releases power. |
| T+2.4 s | **Shielding restored.** About two seconds too late. The nodes persist. |

To the crew, the whole thing felt like a single instant: a flash.

## After

- SIGMA logs thousands of alarms in the first second. There is nobody left to read them.
- The station is pinned and drifts out of phase with normal space. Nashiro loses signal.
- Nashiro issues a blackout order. Records are later sealed under NCIA/2470.

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
