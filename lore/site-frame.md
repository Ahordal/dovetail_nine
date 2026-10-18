---
status: draft
related:
  - "[[the-secret]]"
---

# Site Frame

Who the reader is and what interface they use.

## Decision

- **The reader is Quell, on the station, in 2477 (option 1). [settled]** They discover the station's secrets through its terminals, Alien: Isolation style.
- **Navigation:** type commands or click (option 3) as the base. A **deck map** added once the station layout exists. With the reader as Quell, the map doubles as his body: choosing a deck is Quell going there.
- **The data dump stays in the story**, as something Quell does, not as the frame.
- **Timeframe: about 24 hours aboard [settled].** No day-by-day structure; the story moves by hours.
- **Logs are tied to places [settled]:** each entry records what Quell finds in a particular area, timestamped by station time.

## The file-tree model **[settled]**

The whole experience works as a file tree:

- **Folders are places** (decks, then rooms). **Files are what's in them** (terminal contents, records, logs).
- **Opening a folder is Quell going there.**
- Quell's own material (logs, tools) sits in its own branch, separate from the station's.
- A map, if added later, is a picture of the same folders.

```
DOVETAIL-9/
├── deck-01_docking-ring/
├── deck-02_habitation/
│   ├── galley/
│   │   ├── GAL-02_crew-messages/
│   │   └── ...
│   └── ...
└── ...
SLATE/
├── logs/
└── tools/
```

### Mechanisms: **not yet committed**

Candidates discussed, still to be decided:

- a description shown on entering each folder (what Quell sees and senses)
- sealed, unpowered, and clearance-locked folders, and how each is opened
- `spoof` and `override`, and their cost
- station time advancing with each move and action
- echoes as files in the rooms where they happen
- how far the reader can jump between distant folders
- *Superseded:* option 6, where the reader received the dump.
- **Option 7's twist no longer works as written.** It needed Quell to escape and read his own dump, but canon now says he doesn't escape. Kept below for reference; any revival would need rethinking (for example, a version where the reader is Quell still aboard, re-reading, close to Gemini's purgatory idea).

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
- Interface leaning: **Quell's BLDS-X slate**. Rugged Blackline shell outside, SIGMA's corporate interface inside. Suits phones.
- SIGMA, if live, is **scripted**, not AI (no budget for an API).

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
