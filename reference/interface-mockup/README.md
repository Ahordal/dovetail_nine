# Interface Mockup: Reference Material

A clickable prototype of the site's interface, kept as development reference. Not production code.

- **Live version:** https://claude.ai/artifact/SzzETicttuzH7m4dq3GSPm (private; share from its page to show others)
- **Source:** `Boot.dc.html` and `Main.dc.html` in this folder. They use the artifact canvas's own component format, so they won't run as plain web pages. The real site will rebuild these ideas in Vite + React.

**What the screen is:** a generic station terminal running SIGMA's system, Alien: Isolation style. No device frame around it. Quell's slate is a tool, used on demand, and doesn't appear in the boot or login.

## Boot and login (`Boot.dc.html`)

1. **Wake.** A small status strip ("TERMINAL DT9-T01A · 03:58") over a standby screen: "TERMINAL DT9-T01A · STANDBY" with a WAKE TERMINAL button. Browsers need a click before playing sound.
2. **SIGMA logo:** the Σ in a broken circle with a red arc. The circle spins like a coin spun on a table, upright and turning around its vertical axis, while the Σ inside spins the opposite way, a quarter turn out of step so the two are visibly separate. Both have 6 px of depth (25 stacked layers 0.25 px apart, each edge the same colour as its face: off-white ring and Σ, red arc), so a solid edge shows side-on. One turn per 8 s each; both still under reduced-motion settings. Below: the public designation and "Nashiro Dynamics · Dovetail-9 Research Station".
3. **Boot sequence: the terminal's own self-check, not the station's systems.** SIGMA core link, terminal ID and deck, firmware, ROM checksum, memory test, display, input, local storage (3 faulted sectors), clock sync, security module, and last session (3,652 days ago). Teal for normal, amber for warnings. On phones the timestamps hide so each line stays on one row. Everything at once under reduced-motion settings.
4. **Greeting:** "Terminal ready."
5. **Command prompt:** only `help` and `login` (no name needed). `help` opens the help menu and also prints the commands on the response line. `login` before the self-check finishes gets "Station systems still initializing."
6. **Logging-in screen:** "LOGGING IN" with the spinning cursor, over "Authenticating general user", for ~1.8 s. Then a beep, and "[ OK ] ACCESS GRANTED / General user session opened." for ~1.1 s.
7. **Welcome screen:** "SIGMA // GENERAL ACCESS", "Welcome to Dovetail-9. Access level: GENERAL. Restricted areas and files require higher clearance.", and an ENTER STATION DIRECTORY button.
8. **Help icon:** opens the command list. **Speaker icon:** mute and unmute.

Station systems (reactor, power, life support, shielding, beacon, crew aboard) belong on a separate station status screen, not in the boot. Not yet mocked up.

### Sound design

Generated in the browser with the Web Audio API: no audio files, nothing to license. Inspired by a 1990s PC boot.

| Sound | Detail |
|---|---|
| POST beep | Square wave, 980 Hz, 0.18 s |
| Link beeps | Startup beeps for the ~1.75 s link phase: one square-wave beep on connect (1760 Hz, 0.12 s), and one at 1568 Hz (0.14 s) when the link is established. Otherwise quiet. On screen: "ESTABLISHING LINK TO SIGMA CORE" with an old-school spinning line cursor (cycling through bar, slash, dash, backslash), replaced by "SIGMA core link: ESTABLISHED" as the first boot line. |
| Fan | Soft low-passed noise, continues quietly after boot |
| Drive clicks | 1 to 3 short band-passed noise bursts per boot line |
| Ready chime | Two sine notes, 660 then 880 Hz |
| Login beep | 1568 Hz square wave when access is granted |

Timing: POST beep, then the link phase (one startup beep, ~1.75 s of the loading cursor, a beep as the link is established), then boot lines every 0.22 s with clicks, then the chime.

Tried and removed:
- a rising drive spin-up (motor plus whine, later capped at 75% pitch and faded out)
- a whoosh layer
- rhythmic *Aliens*-style drive chatter (steady ticks every ~55 ms, alternating two pitches, plus seek clicks)
- continuous chatter running through the whole systems check
- Geiger-counter clicks during the link phase (random-timed broadband clicks with bursts)

## Station directory (`Main.dc.html`)

- **Status strip:** "◉ QUELL ▸ DECK 02 / GALLEY" (the current location flag) and station time. A red YOU tag also marks his folder in the tree.
- **SIGMA header** with "ACCESS: GENERAL".
- **File tree** with `DOVETAIL-9` as the master folder: Deck 01 to Deck 12, each with its rooms beneath. Places only. Folders are collapsible; all decks start collapsed. Opens on the station overview.
- **Location panel:** what Quell sees, his scanner reading, the files and sub-folders there. Files open in a viewer.
- **Terminal line:** `ls`, `cd <name>`, `cd ..`, `cd /`, `open <file>`, `help`, alongside clicking.
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
- terminal ID DT9-T01A, SIGMA Terminal OS 4.12, memory and storage figures, station times
- "test 14" in the researcher's message
- the lock badges (SEALED, NO POWER, CLEARANCE 3): illustrations of candidate mechanisms, none committed
