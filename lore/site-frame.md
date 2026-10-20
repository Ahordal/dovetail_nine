---
status: draft
related:
  - "[[the-secret]]"
---

# Site Frame

Who the reader is and what interface they use.

## Decision

- **The reader is Quell, on the station, in 2477 (option 1). [settled]** They discover the station's secrets through its terminals, Alien: Isolation style.
- **Navigation:** type commands or click (option 3) as the base. A **deck map** added once the station layout exists. With the reader as Quell, the map doubles as his body: choosing a deck is Quell going there. See The place model below.
- **The data dump stays in the story**, as something Quell does, not as the frame.
- **Timeframe: about 24 hours aboard [settled].** No day-by-day structure; the story moves by hours.
- **Logs are tied to places [settled]:** each entry records what Quell finds in a particular area, timestamped by station time.
- *Superseded:* option 6, where the reader received the dump.
- **Option 7's twist no longer works as written.** It needed Quell to escape and read his own dump, but canon now says he doesn't escape. Kept below for reference; any revival would need rethinking (for example, a version where the reader is Quell still aboard, re-reading, close to Gemini's purgatory idea).

## The place model **[settled]**

Quell moves between **places**, not terminals. A terminal is one thing he can use in a place, as in Alien: Isolation.

- **The main screen is the place,** in Quell's frame (his amber, not SIGMA's look): where he is, what he sees, the exits, and the **things in the room**, each with its own actions.
- **Actions open different interfaces.** Using a wall terminal opens SIGMA's terminal interface, which wakes when he uses it. Other things open their own: a close look at a body, a locker, a door panel. What each thing offers is written per place.
- **Travel asks first.** Choosing an exit or a deck brings up a prompt naming the destination, the method (on foot, lift, ladder) and the time it costs, with GO and CANCEL. Then the trip plays, and he arrives at the new place's screen, not at its terminal.
- **The slate stays always at hand** from every screen, as before.
- *Superseded:* "moving through the station means using the terminal at each place", and the terminal as the one interface. Both were settled earlier and are replaced by this model.

**[proposed]**
- The trip as a short sequence: the route on the slate (walking, lift or ladder), then Quell's first-person note on what he sees as he arrives. Mocked up in `reference/interface-mockup/`.
- The slate's map starts mostly blank and fills in as he explores; linking the slate to a terminal by UDC can download a deck's layout, giving terminals a reason to be used beyond their files.

## The file-tree model **[settled]**

The whole experience works as a file tree:

- **Folders are places** (decks, then rooms). **Files are what's in them** (terminal contents, records, logs). Terminals are things within a place, not the folders themselves.
- **Opening a folder is Quell going there.**
- **Decks are named by number [settled]:** Deck 01, Deck 02, up to Deck 12. Each deck's rooms sit in a sub-tree beneath it.
- **The station tree holds only places [settled].** `DOVETAIL-9/` at the top is the station overview, the starting screen.
- **Quell's slate lives under TOOLS, outside the station tree [settled].** It's what he carries, so using it never moves him. The slate is one tool among several, and **each tool has one or more actions**.
- A map, if added later, is a picture of the same folders.

```
DOVETAIL-9/                ← places only
├── Deck 01/
│   └── ...
├── Deck 02/
│   ├── Galley/
│   │   ├── GAL-02_crew-messages/
│   │   └── ...
│   └── ...
├── ... Deck 09/
│   ├── Airlock A/         ← where Quell boards (docking bay, see [[dovetail-9-station]])
│   └── ...
└── ... Deck 12/

TOOLS                      ← carried; usable anywhere
├── slate        (logs, ...)
├── scanner      (scan, ...)
├── spoof        (...)
└── override     (...)
```

- Which tools exist and what each action does are **mechanisms, not yet committed**.

Interface prototype (boot screen, sound, file tree): `reference/interface-mockup/`.

### Mechanisms: **not yet committed**

Candidates discussed, still to be decided:

- ~~a description shown on entering each folder~~ Now part of the place model: Quell's own note on arrival, kept in his slate's logs
- saving as Quell recording a log entry on the slate, which gives the boot code; possibly only where the slate can reach the Mistral
- sealed, unpowered, and clearance-locked folders, and how each is opened
- `spoof` and `override`, and their cost
- station time advancing with each move and action. **[proposed]** Game time is not real time: the clock (station time and the slate's countdown) moves only when Quell acts, each action costing a set amount (a neighbouring room a couple of minutes, a ladder between decks far more). SIGMA's delays and echo events also take time off it. The mockup's real-time countdown predates this.
- echoes as files in the rooms where they happen
- how far the reader can jump between distant folders
- the tools and their actions

**Current location flag [settled]:** the interface always shows where Quell is, both in the status bar and on his folder in the tree.

### Twist layer notes (archived)

- The reader is Quell, who escaped in the Mistral with memory damage from phase-node exposure, and sent the dump to himself as well as everyone. **Conflicts with canon:** Quell does not escape.
- **Kept from Gemini's version:**
  - early logs written about "Quell" in the third person, breaking into first person as the twist nears
  - metadata clues (files drafted on the receiving ship, timestamps that don't match the broadcast)
  - SIGMA as caretaker or warden of a man re-reading his own memories
  - each site visit as a "reboot" where Quell forgets again, while SIGMA remembers.
- **Rejected from Gemini's version** as conflicting with canon: "Dr."/"Doctor" (he isn't one), radiation or core leakage as the cause of his decline (it's phase-node exposure), a "core vent" (it's the failsafe), and Quell still aboard the station.
- **[proposed]** For SIGMA to message the reader live in the twist layer, a fragment of SIGMA travelled with him through the slate's AI tether. Needs a rule in [[phase-mechanics]] or the slate's lore if adopted.
- "Quell still aboard the station" was rejected for this layer at the time; it is now canon for the main story.

The station's records (crew files, emails, specs, logs) are the same under every option.

## Settled so far

- The site is a terminal the reader explores to learn about Dovetail-9.
- The mystery is in the past: what happened to the crew in 2467.
- **The station terminal is a generic SIGMA terminal [settled]:** SIGMA's system, as found anywhere aboard Dovetail-9. The boot and login are simply **logging onto the station's systems**, with no slate involved. It is one of several interfaces, opened by using a terminal in a place (see The place model).
- **Terminals work like those in Alien: Isolation [settled].** Any terminal gives general access: the station map and general information. But some areas are **protected** and some documents are **scrambled**. Those are what the slate's tools are for.
- **Every terminal has its own ID and shows where it is [settled].**
- **Terminals carry their own area's information and systems [settled]:** an engineering terminal has engineering systems, and so on. This sits on top of the general access every terminal gives.
- **[proposed]** Public terminals in shared areas, restricted terminals in specialised areas, where some local systems need clearance.
- **General terminals show the station layout and where you are [settled].** A navigation map is the goal once the station layout exists (see Navigation above). The layout itself is not yet decided.
- **Quell's notes live on his slate, not on the terminals [settled].** Terminals show only station content.
- **The scanner is a tool, or a function of certain devices [settled]**, such as the slate's corridor scans. Terminals don't show scan readings.
- **Scanning works anywhere [settled].** It only reads its surroundings and doesn't act on the station, so it needs no UDC link (unlike spoof and override). `scan` is a room command. **[proposed]** The scan is Quell's Kestral RS-9V resonance scanner, the device that detects echoes, with its readings shown on the slate or on a screen of its own.
- **No personal identification at login [settled].** SIGMA does not verify who is using a terminal.
- **The slate is a tool, used on demand [settled].** When something is locked or restricted, the reader goes to TOOLS, picks the slate, **jacks in**, then chooses an ability (override, spoof, and so on). It is not plugged in by default and is not the screen.
- *Superseded:* the earlier leaning of a rugged Blackline slate frame around SIGMA's interface.
- **The slate is always at hand [settled].** It's a tablet with its own screen and built-in tools. A dedicated, always-present button brings its screen up over the terminal, in Blackline's own look, distinct from SIGMA's. Its standalone functions (Quell's notes, his window timer, dosimeter, the link to the Mistral) work anywhere; its tools that act on the station (spoof, override, and so on) need a UDC connection.
- **The window countdown is on the slate, not the terminals [settled].** Quell doesn't trust SIGMA to keep his schedule, so he sets his own timer the moment he learns why the station phases. It's his number on his device, which leaves room for it to disagree with SIGMA's, or to show time he can't account for.
- SIGMA, if live, is **scripted**, not AI (no budget for an API).
- **Progress is resumed with a boot code [settled].** The game state is packed into a short code the reader can copy, and entered from the main menu (the front door, before the terminal boots) to pick up where they left off. No accounts and no server, and it works across devices. Since it's entered before login, it doesn't conflict with there being no identification at login. Where the reader gets the code and what it looks like are **[open]**.

## Options

| # | Option | Reader is | SIGMA | Who triggers the failsafe |
|---|---|---|---|---|
| 1 | You are Quell | Quell, live, 2477 | Live | Reader |
| 2 | You are Quell, memory lost | Quell, reading his own logs to recover lost days | Live | Reader |
| 3 | Later visitor | Someone boarding in a later alignment window | Live | Reader |
| 4 | Looking for Quell | A later visitor searching for him, like Ripley searching for her mother | Live | Reader |
| 5 | Found slate | Someone who found the slate off-station | Records only | Quell |
| 6 | **Data dump** (recommended) | Someone who received the dump Quell broadcast on salvage channels | Records only | Quell |
| 7 | Data dump + twist | Seems a stranger; is actually Quell, who survived with memory damage | Records only | Quell |
| 8 | You are SIGMA | The station AI, watching Quell | Is the reader | Quell |
| 9 | Quell messages you | Someone on the other end of his comm link | Live | Quell, guided by reader |
| 10 | Pure archive | An unnamed browser of SIGMA's database, no story | Records only | None |

## Notes by option

- **1:** Logs describe days the reader is living; they would cover only the physical side.
- **2:** Grounded in Dovetail-5's "recursive memory events", but a familiar trope.
- **3, 4:** Need a reason Quell didn't trigger the failsafe himself.
- **5:** Reader can't change anything.
- **6:** Sent during the alignment window, before it closes with him aboard. (Originally written with Quell triggering the failsafe; canon has since changed.) Motive: X9 Unit 002 still exists, so Nashiro could try again. SIGMA's records keep their Nashiro locks; Quell includes his `spoof`/`override` tools so receivers can get in. Corruption comes from transmitting through a degraded corridor. Possible SIGMA beat: it unlocks Level 6 so the crew are remembered.
- **7:** A layer on top of 6: receiving ship shown as ISRV MISTRAL, too-personal password hints, matching neural readings, a reveal file. **No longer compatible:** it requires Quell to escape.
- **8:** Unique, but contradicts the pitch (being trapped *by* the AI) and is hard to build.
- **9:** Breaks the isolation; "nobody is coming" stops being true.
- **10:** Easiest; risks reading like a wiki.
