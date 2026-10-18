# Interface Mockup: Reference Material

A clickable prototype of the site's interface, kept as development reference. Not production code.

- **Live version:** https://claude.ai/artifact/SzzETicttuzH7m4dq3GSPm (private; share from its page to show others)
- **Source:** `Boot.dc.html` and `Main.dc.html` in this folder. They use the artifact canvas's own component format, so they won't run as plain web pages. The real site will rebuild these ideas in Vite + React.

**What the screen is:** a generic station terminal running SIGMA's system, Alien: Isolation style. No device frame around it. Quell's slate is a tool, used on demand, and doesn't appear in the boot or login.

## Boot and login (`Boot.dc.html`)

1. **Wake.** A small status strip ("TERMINAL DT9-T01A · 03:58") over a standby screen: "TERMINAL DT9-T01A · STANDBY" with a compact WAKE TERMINAL button. Browsers need a click before playing sound.
2. **SIGMA logo:** 136 px emblem and a 46 px title (70% and 32 px on phones). The Σ in a broken circle with a red arc. The circle spins like a coin spun on a table, upright and turning around its vertical axis, while the Σ inside spins the opposite way, a quarter turn out of step so the two are visibly separate. Both have 6 px of depth (25 stacked layers 0.25 px apart, each edge the same colour as its face: off-white ring and Σ, red arc), so a solid edge shows side-on. One turn per 8 s each; both still under reduced-motion settings. Below: the public designation and "Nashiro Dynamics · Dovetail-9 Research Station".
3. **Boot sequence: the terminal's own self-check, not the station's systems.** Modeled on a real PC boot (power, firmware, POST, boot device, operating system, network, login), futurized for a station. Each stage has a small heading:

   | Stage | Check | Result |
   |---|---|---|
   | Power | Station power bus | NOMINAL |
   | | Terminal | DT9-T01A · DECK 01 |
   | Firmware | Nashiro terminal firmware | v7.2 · CHECKSUM OK |
   | Power-on self-test | Processor | STRATOVAN Q-LATTICE · 16 CORES · OK |
   | | Working memory | 256 TB · TESTED OK |
   | | Display | PHOTONIC PANEL · OK |
   | | Input | KEYBOARD · TOUCH · OK |
   | | Thermal | 12 °C · WITHIN LIMITS |
   | | Storage | QUANTUM-MEM ARRAY · 2.0 PB · DETECTED |
   | Boot | Boot device | LOCAL ARRAY · PARTITION 1 |
   | | Boot integrity | NASHIRO SIGNATURE VALID |
   | Operating system | Kernel | SIGMA TERMINAL OS 4.12 · LOADED |
   | | Filesystem check | UNCLEAN SHUTDOWN DETECTED (warning) |
   | | Filesystem repair | 3 BLOCKS UNREADABLE · ISOLATED (warning) |
   | | Services | STARTED |
   | Network | Section network | DECK 01 · ADDRESS ASSIGNED |
   | | SIGMA core link | ESTABLISHED |
   | | Clock | SYNCED TO SIGMA · 03:58 |
   | Security | Security module | ACTIVE |
   | | Last session | 3,652 DAYS AGO (warning) |

   The unclean shutdown is the terminal going dark mid-session in 2467. Lines appear every 0.16 s (~4.3 s total); stage headings get no drive click. Scale follows the lore: Quell's BLDS-X slate carries 4.2 PB and a Stratovan Q-bit lattice processor, so a fixed station terminal sits in the TB to PB range. Teal for normal, amber for warnings. On phones the timestamps hide so each line stays on one row. Everything at once under reduced-motion settings.
4. **Greeting:** "Terminal ready."
5. **Command prompt:** appears only once the self-check finishes and the terminal is ready. Only `help` and `login` (no name needed). `help` expands the prompt box upward to list the commands for the current screen ("COMMANDS ON THIS SCREEN"); typing `help` again, or any other command, folds it away. Entering `help` also dismisses the phone keyboard so it doesn't cover the list. `login` before the self-check finishes gets "Station systems still initializing."
6. **Logging-in screen:** "LOGGING IN" with the spinning cursor, over "Authenticating general user", for ~1.8 s. Then a beep, and "[ OK ] ACCESS GRANTED / General user session opened." for ~1.1 s.
7. **Welcome screen:** "SIGMA // GENERAL ACCESS", "Welcome to Dovetail-9. Access level: GENERAL. Restricted areas and files require higher clearance.", and an ENTER STATION DIRECTORY button.
8. **Speaker icon:** mute and unmute. (The separate help icon and pop-up panel were removed: help lives in the prompt.)
9. **Fits one screen:** the terminal fills exactly the window height (100dvh on phones). Logo at the top, prompt pinned at the bottom, and the boot log scrolls in between, following each new line. On phones the emblem shrinks to 70% and the title and subtitles get smaller.

Station systems (reactor, power, life support, shielding, beacon, crew aboard) belong on a separate station status screen, not in the boot. Not yet mocked up.

### Sound design

Generated in the browser with the Web Audio API: no audio files, nothing to license. Inspired by a 1990s PC boot.

| Sound | Detail |
|---|---|
| POST beep | Square wave, 980 Hz, 0.18 s |
| Startup beeps | For the ~1.75 s initializing phase: one square-wave beep as the terminal wakes (1760 Hz, 0.12 s), and one at 1568 Hz (0.14 s) as initialization completes. Otherwise quiet. On screen: "INITIALIZING TERMINAL" with an old-school spinning line cursor (cycling through bar, slash, dash, backslash), then the self-check begins. |
| Fan | Soft low-passed noise, continues quietly after boot |
| Print blips | As each boot line prints, a rapid run of 7 to 12 single electronic blips, in the spirit of the Nostromo's terminals in *Alien*: 6 ms square-wave blips about 12 ms apart, each at a random one of 2100, 2400 or 2800 Hz. None on stage headings. |
| Ready chime | Two sine notes, 660 then 880 Hz |
| Login beep | 1568 Hz square wave when access is granted |

Timing: POST beep, then the initializing phase (one startup beep, ~1.75 s of the loading cursor, a beep as it completes), then boot lines every 0.16 s, each with a run of print blips (none on stage headings), then the chime.

Tried and removed:
- a rising drive spin-up (motor plus whine, later capped at 75% pitch and faded out)
- a whoosh layer
- rhythmic *Aliens*-style drive chatter (steady ticks every ~55 ms, alternating two pitches, plus seek clicks)
- continuous chatter running through the whole systems check
- Geiger-counter clicks during the link phase (random-timed broadband clicks with bursts)
- drive clicks per boot line (1 to 3 band-passed noise bursts), replaced by the print blips

## Station directory (`Main.dc.html`)

- **Status strip:** "◉ QUELL ▸ DECK 02 / GALLEY" (the current location flag) and station time. A red YOU tag also marks his folder in the tree.
- **SIGMA header** with "ACCESS: GENERAL".
- **File tree** with `DOVETAIL-9` as the master folder: Deck 01 to Deck 12, each with its rooms beneath. Places only. Folders are collapsible; all decks start collapsed. Opens on the station overview.
- **Location panel:** what Quell sees, his scanner reading, the files and sub-folders there. Files open in a viewer.
- **Terminal line:** `ls`, `cd <name>`, `cd ..`, `cd /`, `open <file>`, `help`, alongside clicking. `help` expands the prompt box to list this screen's commands, the same way as on the boot screen.
- **Not yet mocked up:** the TOOLS area (slate and its abilities), and Quell's own logs, which were removed with the old `devices/` folder.

## Look

- Ground `#0B0C0D`, panels `#0F1112` / `#121416`, borders `#2A2D30`.
- Text off-white `#E8E4DA`, muted `#A8A49A`.
- Accent SIGMA red `#E0504A`; warnings amber `#D9A441`; readings teal `#9FC7C2`.
- Type: IBM Plex Mono (body), Chakra Petch (headings and labels).

## Canon status

Everything here follows the lore, except these, invented for the mockup and **not canon**:

- room names and layout beyond numbered decks under `DOVETAIL-9`
- crew names (shown as placeholders)
- terminal ID DT9-T01A, firmware v7.2, SIGMA Terminal OS 4.12, 16 cores, 256 TB memory, 2.0 PB storage, 12 °C, station times
- "test 14" in the researcher's message
- the lock badges (SEALED, NO POWER, CLEARANCE 3): illustrations of candidate mechanisms, none committed
