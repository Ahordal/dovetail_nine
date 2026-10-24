---
status: draft
type: power-system
related:
  - "[[dynex-t-core-x9-ignis]]"
  - "[[the-accident]]"
  - "[[phase-mechanics]]"
  - "[[dovetail-9-station]]"
  - "[[canon]]"
---

# X9 Power System **[proposed]**

How Dovetail-9 is powered, built around the X9 like a real reactor plant: what holds the black hole, how power gets out, how heat is removed, how radiation is stopped, how the station's own electricity works, and every safeguard. [[the-accident]] is built from this design's gaps and cross-checked against it.

## What is invented

Everything here follows real physics and real reactor practice except three things, named so nothing else quietly becomes magic:

1. **Corridor physics** (already canon): harmonics, nodes, the pin, phase-lock ([[phase-mechanics]]).
2. **Near-lossless coupling into the corridor:** the array sends the X9's power into the corridor, losing less than a billionth as heat (already canon).
3. **Exawatt spin extraction from a femtometre black hole.** The principle is real (the Blandford–Znajek process), but doing it at this scale needs fields far stronger than any known physics allows. This is DYNEX's proprietary breakthrough, the **Graviton Lattice**. It also covers holding the black hole with fields at that scale.

## The numbers

Order-of-magnitude, from the standard formulas.

| | |
|---|---|
| Mass | ~10¹² kg (a billion tonnes) |
| Horizon | ~1.5 femtometres across, about the size of a proton |
| Hawking glow | ~360 MW, mostly gamma rays around 10 MeV, plus electron-positron pairs and neutrinos (harmless) |
| Glow temperature | ~10¹¹ K |
| Lifetime | ~3 trillion years |
| Gravity | ~7 g at 1 m, ~0.07 g at 10 m: strong in the chamber, negligible outside |
| Spin reserve | ~2.6 × 10²⁸ J, about 235 years at full output |
| Output | 3.5 EW from spin: 1.3 EW drives the trap, ~2.2 EW goes to the array |
| Load on the inner wall | ~450 kW per square metre at 8 m, in the range real fusion walls are designed for |

## 1. Containment: holding the black hole

- **Fields, not walls.** The black hole carries an electric charge, and the trap's fields grip that charge and hold it at the centre of the chamber, touching nothing. The chamber is held at vacuum.
- **The trap has to be active.** In real physics, no arrangement of steady fields can hold a charge stably (Earnshaw's theorem). Real particle traps get round this with fields that change constantly. The X9's trap is the same idea at enormous scale, which is why containment draws power continuously and can never just be "set".
- **Charge keeping.** A charged black hole slowly loses its charge, because its own glow carries charge away and it attracts opposite charges. **Charge injectors** fire electron or ion beams in to keep it topped up. Without charge, the trap can't grip it.
- **Position control.** Field sensors and a gravity-sensing array track the black hole's position many thousands of times a second. SIGMA closes the loop.
- **Phase-conjugate dampening coils** cancel the harmonic feedback that reaches the trap from the corridor along the conduits. They are sized for the *residual* feedback that gets past the Valdez harmonic shielding, not for the full flood.
- **The station is held around the black hole.** It outweighs the hull, so in practice the trap keeps the station in place around it.
- **Startup:** 420 PJ, delivered once, to raise the trap's fields and start extraction. After that, the trap runs on the X9's own output.

## 2. Power take-off

- **The black hole as a generator's rotor.** The trap's field lines thread the region just outside the horizon. The spin drags them round, and that rotating field sweeps past the superconducting coils of **Shell 1's flux ring**, which work like a generator's stator. Spin energy becomes electric current.
- **Out through the shells:** superconducting busbars leave through **offset penetrations** (no straight line from the chamber to outside), the standard reactor method for cables.
- **The conduits** are superconducting power trunks along the **Deck 06 spine**, in a shielded cryogenic duct, running fore and aft to the Anchor Core array. Superconductors carry steady current with zero resistance, which is real; the invented part is only the scale.
- **Temperatures:** the coils and trunks run at about −250 °C, a few metres from a glow of 10¹¹ K, with shielding and coolant between.

## 3. Heat removal

- **Primary loop, inside the dome only.** Shell 1's blanket is liquid **lead-lithium**: the lead stops gamma rays, the lithium catches neutrons. It absorbs the 360 MW glow as heat. This coolant becomes radioactive, so it **never leaves the dome**.
- **Intermediate heat exchanger,** inside Shell 3, passes the heat to a clean secondary loop. This is standard practice in real liquid-metal reactors, precisely so that radioactive coolant stays inside.
- **Hawking Harvest Rings:** turbines on the secondary loop turn part of that heat into electricity, roughly 100 MW: **the station's own power.**
- **Radiators:** the rest of the heat, plus the array's tiny losses (under a billionth of its exawatts, still gigawatts), goes along the spine to radiators on the array arms.

## 4. Radiation shielding

- **Shell 1:** the lead-lithium blanket takes most of the energy.
- **Shell 2:** tungsten carbide and borated polyethylene stop what's left of the gamma rays and slow and capture neutrons.
- **Shell 3:** the structural sphere, tied into the keel.
- **Every penetration is offset:** cables, cryogenic lines, the secondary coolant and sensor lines all dog-leg through the shells, so no straight path leads out.
- **Design basis:** normal leakage outside the dome is negligible, including surges up to the 7.8 EW threshold *with the field under control*.
- **The physics that matters:** solid shielding cuts radiation by a fixed factor. Nothing short of an open path can make it dangerous without a source large enough to destroy the station. In normal operation there is no open path.

## 5. The station's electricity

| Source | Feeds | Notes |
|---|---|---|
| **Primary bus**, from the Harvest Rings | Everything: life support, SIGMA, lights, lifts, the Valdez harmonic shielding, the X9's auxiliaries | Trips on a surge, by design |
| **Isolated backup bus**, from a separate Harvest Ring generator set | Takes over within milliseconds | Electrically isolated, but SIGMA's power authority can redirect it |
| **Shield capacitor banks A and B** (shielding plant, Deck 07) | Bridge the Valdez shielding through sub-second gaps | Sized to cover the switch to the backup bus, not to replace it |
| **Fuel cells**, Deck 12 | Station loads during a long outage | Hours to days; play no part in fast transients |

### The distribution grid

- **Bus A, the primary bus:** the main Harvest Ring generator (Deck 07, left) feeds **switch room A** directly above it on Deck 06.
- **Bus B, the isolated backup bus:** the separate backup generator set (Deck 07, right) feeds **switch room B** above it. Bus B normally carries the **X9's auxiliaries** (cryogenic plant, trap auxiliaries), and takes the Valdez shielding too if Bus A trips. That is why the two competed in the accident.
- **Emergency supply:** the fuel cells (Deck 12) feed Bus B's riser; their switchgear and batteries hang off it.
- **Risers:** Bus A rises beside the left lift core, Bus B beside the right, Deck 01 to Deck 12. Each deck's service band carries feeders from both.
- **The tie:** the two buses meet at SIGMA's own switchboard at the base of its core, Deck 03, which can take either side; SIGMA never goes dark while either bus lives.
- **Feeders as built:** SIGMA (both buses); trap auxiliaries and cryogenic plant (B); shield capacitor bank A (A) and bank B (B), which feed the emitters along the conduits; each airlock's machinery from its own side; cargo airlock machinery (A); docking control and the bay workshop (B); water recovery plant and supply pump (A); waste plant (B); fuel transfer (A). Decks 01 to 03 (command, galley, hydroponics) are fed the same way once placed.
- **The X9's own output never touches this grid.** Its exawatts go down the conduits to the array.
- **Where the reader finds it:** the electrical one-line diagram posted in both switch rooms, and SIGMA's load-shed table (Power Priority Matrix rev. 4).

**The X9's auxiliaries** draw on the *station's* power, as a real reactor's pumps and control systems do, even though the reactor makes far more: the charge injectors, the cryogenic plant that keeps the superconducting coils cold, the dampening coil drivers, the position sensors, the primary coolant pumps. Tens of megawatts. If the cryogenic plant falters, the coils can lose superconductivity (a quench) and the trap fails. This is what the **containment-priority protocol** protects: in a transient it guarantees the auxiliaries every watt, ahead of everything else (**Power Priority Matrix rev. 4**). The Valdez shielding also needs tens of megawatts, so in a transient the two compete.

## 6. Safeguards

| Safeguard | What it does | Design basis |
|---|---|---|
| Trap coil redundancy | Segmented field coils; the trap survives losing any two segments | Single and double coil faults |
| Charge injector redundancy | Several injectors, any one sufficient | Injector failure |
| Dampening coils | Cancel harmonic feedback at the trap | Residual feedback behind working Valdez shielding |
| Array throttle-back | SIGMA throttles the Anchor Core back to holding power to cut harmonic feedback at its source | The array is a resonator that rings down over **about two seconds**; stopping it fully would drop the pin |
| Quench protection | Dumps a coil's stored energy safely if it loses superconductivity | Single coil quench |
| Primary bus breakers | Trip on induced surges | Protects station equipment |
| Backup bus | Takes over the station's loads | Electrical faults (not SIGMA's own power authority) |
| Shield capacitor banks | Bridge the shielding over sub-second gaps | The switch to the backup bus |
| Containment-priority protocol | Gives the X9's auxiliaries every watt in a transient | Loss of containment control is the worst outcome possible |
| Valdez harmonic shielding | Keeps harmonics out of crewed sections and away from the conduits | Prolonged exposure (the Dovetail-5 lesson), not a full-power transient |
| Radiation shielding | Three shells, offset penetrations | Steady glow and controlled surges |
| Radiation monitors | Alarm and record | Detection only |
| Ventilation | Life support recirculates air station-wide | No isolation for airborne radioactivity: radiation inside the crewed station was considered impossible |
| ZK-Class Override | 2 kg of antimatter destroys the trap, the station and the array, cutting the field connection | Containment control lost beyond recovery. Not triggered unless that threshold is crossed |

## Two ways to lose containment

- **The fields switch off cleanly.** The black hole, smaller than an atom, passes through solid matter almost freely, melting a narrow channel with its glow, and falls out of the station. Nothing taps the spin, so the spin energy stays locked inside it. Very bad, but survivable.
- **The fields stay attached but go out of control.** Spin energy pours out along the field into anything that conducts, at exawatt rates and rising. This is the catastrophe the lore means by the spin reserve "discharging uncontrolled".
- **The failsafe turns the second into the first.** It can't destroy the black hole. It destroys the trap and everything it connects to, so the spin energy has nowhere to go. The bare black hole drifts away.
