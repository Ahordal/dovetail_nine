# Interface Mockup: Reference Material

A clickable prototype of the site's interface, kept as development reference. Not production code.

- **Live version:** https://claude.ai/artifact/SzzETicttuzH7m4dq3GSPm (private; share from its page to show others)
- **Source:** `Boot.dc.html` and `Main.dc.html` in this folder. They use the artifact canvas's own component format, so they won't run as plain web pages. The real site will rebuild these ideas in Vite + React.

## Boot and login (`Boot.dc.html`)

1. **Connect.** The screen waits on "BLDS-X READY · UDC PORT 1 · NO LINK" with a CONNECT SLATE button. Browsers need a click before playing sound; in-story, it's Quell plugging in.
2. **SIGMA logo:** the Σ in a broken circle with a red arc; the circle rotates slowly (one turn per 8 s, still under reduced-motion settings) while the Σ stays put; the public designation, and "Nashiro Dynamics · Dovetail-9 Research Station".
3. **Boot sequence:** station systems come online one line at a time (teal for normal, amber for warnings). Shows everything at once under reduced-motion settings.
4. **SIGMA's greeting:** "Welcome aboard Dovetail-9. External device detected on UDC port 1."
5. **Command prompt:** only `help` and `login` (no name needed). `help` opens the help menu and also prints the commands on the response line. `login` before the systems check finishes gets "Station systems still initializing."
6. **Logging-in screen:** `login` replaces the boot log with "LOGGING IN" and the spinning cursor, over "Verifying bioelectric signature", for ~1.8 s. Then a beep, and the same screen confirms "[ OK ] SIGNATURE MATCH / Bioelectric signature matches device BLDS-X." for ~1.1 s.
7. **Welcome screen:** then a new screen: "SIGMA // IDENTITY VERIFIED", "Welcome aboard, Mr. Quell. Clearance: GUEST.", and an ENTER STATION DIRECTORY button.
8. **Help icon:** opens the command list. **Speaker icon:** mute and unmute.

### Sound design

Generated in the browser with the Web Audio API: no audio files, nothing to license. Inspired by a 1990s PC boot.

| Sound | Detail |
|---|---|
| POST beep | Square wave, 980 Hz, 0.18 s |
| Link beeps | Startup beeps for the ~1.75 s link phase: one square-wave beep on connect (1760 Hz, 0.12 s), and one at 1568 Hz (0.14 s) when the link is established. Otherwise quiet. On screen: "ESTABLISHING LINK TO SIGMA CORE" with an old-school spinning line cursor (cycling through bar, slash, dash, backslash), replaced by "SIGMA core link: ESTABLISHED" as the first boot line. |
| Fan | Soft low-passed noise, continues quietly after boot |
| Drive clicks | 1 to 3 short band-passed noise bursts per boot line |
| Ready chime | Two sine notes, 660 then 880 Hz |

Timing: POST beep, then the link phase (one startup beep, ~1.75 s of the loading cursor, a beep as the link is established), then boot lines every 0.22 s with clicks, then the chime.

Tried and removed:
- a rising drive spin-up (motor plus whine, later capped at 75% pitch and faded out)
- a whoosh layer
- rhythmic *Aliens*-style drive chatter (steady ticks every ~55 ms, alternating two pitches, plus seek clicks)
- continuous chatter running through the whole systems check
- Geiger-counter clicks during the link phase (random-timed broadband clicks with bursts)

## Station directory (`Main.dc.html`)

- **Slate frame:** Blackline shell (BLDS-X, UDC link, battery, station time) around SIGMA's screen.
- **Current location flag:** "◉ QUELL ▸ DECK 02 / GALLEY" in the status bar, and a red YOU tag on his folder in the tree.
- *Out of date:* the mockup still shows the slate under `devices/`. Canon now puts it under TOOLS, outside the station tree.
- **File tree** with `DOVETAIL-9` as the master folder: Deck 01 to Deck 12, each with its rooms beneath, and Quell's slate under `devices/`. Folders are collapsible; all decks start collapsed. Opens on the station overview.
- **Location panel:** what Quell sees, his scanner reading, the files and sub-folders there. Files open in a viewer.
- **Terminal line:** `ls`, `cd <name>`, `cd ..`, `cd /`, `open <file>`, `help`, alongside clicking.

## Look

- Ground `#0B0C0D`, panels `#0F1112` / `#121416`, slate frame `#17191B`, borders `#2A2D30`.
- Text off-white `#E8E4DA`, muted `#A8A49A`.
- Accent SIGMA red `#E0504A`; warnings amber `#D9A441`; readings teal `#9FC7C2`.
- Type: IBM Plex Mono (body), Chakra Petch (headings and labels).

## Canon status

Everything here follows the lore, except these, invented for the mockup and **not canon**:

- deck names and layout beyond `DOVETAIL-9` as the master folder
- crew names (shown as placeholders)
- 214 environmental faults, power to 7 of 12 decks, 11 °C / 98 kPa, station times
- "test 14" in the researcher's message
- the lock badges (SEALED, NO POWER, CLEARANCE 3): illustrations of candidate mechanisms, none committed
