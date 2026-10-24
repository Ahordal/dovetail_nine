# Interface Mockup: Reference Material

A clickable prototype of the site's interface, kept as development reference. Not production code.

- **Live version:** https://claude.ai/artifact/SzzETicttuzH7m4dq3GSPm (private; share from its page to show others)
- **Source:** `Boot.dc.html`, `Home.dc.html` and `Main.dc.html` in this folder. They use the artifact canvas's own component format, so they won't run as plain web pages. The real site will rebuild these ideas in Vite + React.

**What the screen is:** a generic station terminal running SIGMA's system, Alien: Isolation style. No device frame around it. Quell's slate is a tool, used on demand, and doesn't appear in the boot or login.

## Home page (`Landing.dc.html`)

The site's front door, before the terminal boots. A stand-in image (a dark station with a ship approaching its lit docking bay, a red star below) is shown whole, on a pure black page (`#000000`, darker than the terminal screens), fitted to the width with its top and bottom edges faded into the black, so both arms of the station stay in view. Below it, in the dark space: **DOVETAIL-9** in Chakra Petch bold (700), very large (44 to 128 px), with "DOVETAIL-" in dark grey `#5E6368` and the "9" in SIGMA red. Beside it (below it on phones): an outlined off-white **BEGIN ▸** button that opens the boot screen; it fills off-white on hover. The image is an uploaded stand-in, not final art.

## Boot and login (`Boot.dc.html`)

1. **Wake.** A small status strip ("TERMINAL DT9-T01B · 03:58") over a standby screen: "TERMINAL DT9-T01B · STANDBY" with a compact WAKE TERMINAL button, given generous space above and below. Browsers need a click before playing sound.
2. **SIGMA logo:** 136 px emblem and a 46 px title (70% and 32 px on phones). The Σ in a broken circle with a red arc. The circle spins like a coin spun on a table, upright and turning around its vertical axis, with the Σ inside turning together with it as one piece. (A counter-rotating Σ, a quarter turn out of step, was tried and replaced.) Both have 6 px of depth (25 stacked layers 0.25 px apart, each edge the same colour as its face: off-white ring and Σ, red arc), so a solid edge shows side-on. One turn per 8 s each; both still under reduced-motion settings. Below: the public designation and "Nashiro Dynamics · Dovetail-9 Research Station".
3. **Boot sequence: the terminal's own self-check, not the station's systems.** Modeled on a real PC boot (power, firmware, POST, boot device, operating system, network, login), futurized for a station. Each stage has a small heading:

   | Stage | Check | Result |
   |---|---|---|
   | Power | Station power bus | NOMINAL |
   | | Terminal | DT9-T01B · DECK 01 |
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

   **Memory test:** like an old PC, the working-memory line counts up through the RAM in GB (0 to 262,144 GB over about 1.4 s, a soft tick every few steps) before settling on "256 TB · TESTED OK". The list pauses while it counts.

   **Completion:** the log ends with "[ OK ] BOOT SEQUENCE COMPLETE · TOTAL TIME n s", the real time from Wake Terminal to the last check. Timestamps on each line are real elapsed times too.

   The unclean shutdown is the terminal going dark mid-session in 2467. Lines appear every 0.16 s (~4.3 s total); stage headings get no drive click. Scale follows the lore: Quell's BLDS-X slate carries 4.2 PB and a Stratovan Q-bit lattice processor, so a fixed station terminal sits in the TB to PB range. Teal for normal, amber for warnings. On phones the timestamps hide, the label column is capped at 38% of the width (labels wrap so results get the room), the log text drops to 12 px, and the side padding tightens. Everything at once under reduced-motion settings.
4. **Greeting:** when the self-check finishes, the command line shows "SIGMA: Terminal ready. Type help for commands.", in the same style as the directory's opening message.
5. **Command prompt:** appears only once the self-check finishes and the terminal is ready. Only `login` (no name needed), `help` and `close`. `help` expands the prompt box upward to list the commands for the current screen ("AVAILABLE COMMANDS"); typing `help` again, `close`, any other command, or the ✕ in the list's corner folds it away. While the list is open, SIGMA's line reads "Available commands listed above. Type close to dismiss." (display only, not added to the message history), then returns to the previous message. On phones, entering any command dismisses the keyboard so SIGMA's reply isn't hidden. On desktop the prompt keeps focus throughout (including after the ✕), so the reader keeps typing. Every prompt shows a blinking block cursor in the accent colour (steady under reduced motion), and gets focus automatically on desktop when it appears. `login` before the self-check finishes gets "Station systems still initializing."
6. **Logging-in screen:** "LOGGING IN" with the spinning cursor, over "Authenticating general user", for ~1.8 s. Then a beep and "[ OK ] ACCESS GRANTED" (a system result, like the boot checks), while SIGMA types "General access session open." in the message bar, with its voice, for ~1.1 s, then the POST beep and the terminal home opens on its own. This terminal sits on the docking ring and is for navigation only, with no access to other systems, so there's no welcome screen or button in between. (An earlier welcome screen with session details and an ENTER STATION DIRECTORY button was removed.)
7. **Speaker icon:** mute and unmute. (The separate help icon and pop-up panel were removed: help lives in the prompt.)
8. **Fits one screen, edge to edge:** the terminal fills the whole window on desktop and phone, with no outer margin or border except a 20 px gap at the bottom (more on phones with a home-bar inset), so the command line never sits flush against the window edge. Exactly the window height (100dvh on phones). Both screens are held to the same centred 1280 px column, so the boot screen and the directory line up. The boot log is a three-column table (time, check, result) with 40 px between columns, shrink-wrapped and centred under the SIGMA logo; on phones it drops to two columns using the full width. Logo at the top, prompt pinned at the bottom, and the boot log scrolls in between, following each new line. The native scrollbar is hidden; when the log overflows, up and down buttons appear at its right edge (32 px squares matching the help list's ✕, which lines up with them; each scrolls about 60% of the view). Wheel and touch scrolling still work, and scrolling up isn't undone until a new line arrives. While the reader is at the bottom, the log stays pinned there even when its height changes (the prompt bar grows as SIGMA types its greeting), so the boot ends showing its last line. On phones the emblem shrinks to 70% and the title and subtitles get smaller.

Station systems (reactor, power, life support, shielding, beacon, crew aboard) belong on a separate station status screen, not in the boot. Not yet mocked up.

### Sound design

Generated in the browser with the Web Audio API: no audio files, nothing to license. Inspired by a 1990s PC boot.

| Sound | Detail |
|---|---|
| POST beep | Square wave, 980 Hz, 0.18 s. Plays on WAKE TERMINAL and again as the directory opens after login; the link follows ~260 ms later so the tone is heard |
| SIGMA's voice | One short sound per character as SIGMA types (see below). Also plays under the boot lines: 6 characters per line, filling the 0.16 s between lines, and a tick every few steps of the memory count. None on stage headings |
| Ready chime | Two sine notes, 660 then 880 Hz, once SIGMA has finished typing "Terminal ready" |
| Login beep | 1568 Hz square wave when access is granted |

Timing: POST beep, then ~1.75 s of the "INITIALIZING TERMINAL" loading cursor in silence, then boot lines every 0.16 s with SIGMA's voice under each (none on stage headings), then SIGMA types the ready line, then the chime.

**SIGMA's voice:** each SIGMA message types out one character every 26 ms (the first at 13 ms), with silent spaces. Each character is an 800 Hz sine mixed with noise band-passed at 800 Hz, a 10 ms attack and ~8 ms fade, low-passed at 6.6 kHz. Tuned by ear with the SIGMA Voice Tuner (https://claude.ai/artifact/HcDrrGDuKU9yesrYbLEQow), starting from measurements of a fan recreation of the *Alien* terminal sound: about 16 characters a second, energy around 3.5 kHz, half the clip's sound being noise. Plain output (listings, access errors) still appears at once. A repeated reply is retyped, so a second bad command still visibly answers. Under reduced motion, messages appear whole and silent.

Tried and removed:
- a rising drive spin-up (motor plus whine, later capped at 75% pitch and faded out)
- a whoosh layer
- a soft background fan hiss that ran continuously after boot
- rhythmic *Aliens*-style drive chatter (steady ticks every ~55 ms, alternating two pitches, plus seek clicks)
- continuous chatter running through the whole systems check
- two startup beeps during the initializing phase (one as it began, one as it finished)
- Geiger-counter clicks during the link phase (random-timed broadband clicks with bursts)
- drive clicks per boot line (1 to 3 band-passed noise bursts), replaced by the print blips
- print blips per boot line (7 to 12 square-wave blips, 6 ms each, at 2100, 2400 or 2800 Hz), replaced by SIGMA's voice
- a separate 1320 Hz directory beep, replaced by reusing the POST beep

## Terminal home (`Home.dc.html`)

What the login opens. The station is full of generic SIGMA terminals, each with its own ID: **public** terminals in shared areas, **restricted** terminals in specialised ones. The screen is the home page of the terminal Quell is standing at, not a file browser. The file tree is still how he moves; it just isn't the first thing shown.

- **Starts at Airlock B, terminal DT9-T01B**, the same terminal the boot screen logs into.
- **Header:** one bar, kept minimal. Left: the Σ logo and SIGMA, no subtitle. Right, on the same line: the terminal name ("TERMINAL DT9-T01B") in smaller, muted text (13 px against SIGMA's 22 px). The bar never wraps; on a narrow phone the terminal name truncates instead. **Status strip** underneath: ACCESS: GENERAL in green (granted access reads as good, not as a SIGMA-red warning) and a PUBLIC TERMINAL (teal) or RESTRICTED TERMINAL (amber) badge on the left; station time on the right. **UDC row** below that, on its own line: the connector icon and its status ("UDC · AVAILABLE"), only on terminals that have one. No location flag and no name: the terminal doesn't know who is using it (no identification at login), and location is already shown in the Current location box.
- **Station time runs in real time** from the reader's first arrival: 03:58, carrying on from the boot screen. It also stamps SIGMA's message history.
- **Command bar:** the classic bottom bar. The help list (`help`) is capped at 45% of the screen height and scrolls within itself, so the whole list is reachable on a phone. SIGMA's latest message on its line, an always-visible `>` input underneath with the blinking block cursor, and the history arrow (^) at its right, which expands the bar upward to list earlier SIGMA messages. (Several alternatives were tried and set aside: a hideable command line, a tools menu, a single console, a slate peeking from the corner.)
- **Quell's slate:** a Blackline tablet with its own screen, always at hand. A permanent **SLATE** button floats at the bottom-right just above the command bar, styled as Blackline hardware (amber, rugged) so it reads as a different device from SIGMA's terminal. Clicking it (or `slate`) brings the slate up **full screen** over the terminal (only a small safe-area margin around it; on desktop it never exceeds the terminal layout itself, 1280 px wide with the same 20 px top and bottom gap; the ✕ to put it away sits in the slate's own top bar): a bezel with corner screws, the Blackline BLDS-X header, and five apps: **Timer**, **Logs** (Quell's notes; empty until the arrival is redesigned), **Dose** (dosimeter, placeholder), **Mistral** (ship link and drive status, placeholder) and **Tools** (spoof, override, scan: "requires UDC link" until the slate is connected). Closes with ✕ or Esc; only one overlay open at a time.
- **The window countdown lives on the slate, and starts when the reader learns why the station phases.** The discovery is `SIGMA_alignment_record.sig`, posted at the Deck 01 hub: SIGMA's log of every window (each rarer and longer, all "beacon active, no response") and the next ~6 years off. Opening it makes the slate chirp twice and set a real-time timer from 16:00:00 ("SLATE · WINDOW TIMER SET"), saved in the browser so it runs while the page is shut. From then on the countdown shows on the SLATE button itself and large in the slate's Timer app, amber, turning red in the last hour. At zero SIGMA says "Alignment window closed. Next window: estimated 6.1 years." `window` asks SIGMA for its own figure; `reset window` clears both clocks (mockup only). Whether moves and actions also advance time is still an open mechanism.
- **Phone margins:** below 560 px wide, the side padding is halved (header, strip and command line 10 px; content 12 px; UDC row 7 px; the UDC modal sits 8 px from the screen edge).
- **One screen tall, like the boot screen:** the SIGMA header stays at the top and the command line at the bottom of the window; everything between (strip, UDC row, content) scrolls. Uses 100dvh so it follows a phone's keyboard and browser bars.
- **Station content only.** Quell's notes live on his slate and scanning is a tool, so neither appears on a terminal (the directory board still has both, from before this was decided).
- **Current location box:** at the top of the main column, a panel with 8 px rounded corners (off-black fill, thin border) holding the place name with only its deck beneath ("Deck 01", 16 px). Styled like station wayfinding: the deck number ("01") stencilled large and very faint across the right side, teal corner brackets inside the border, and a teal locator dot with a slow pulse ring before the label (still under reduced motion); the terminal ID is already in the header; the station layout sits directly below it. Locked places show the lock panel, in the station's voice.
- **Station layout (main view):** a schematic stand-in for the future navigation map, since the real layout isn't designed. A STATION LAYOUT button below the current location box (collapsed by default, ▸/▾) opens the main decks, 01 to 12 each listed separately, stacked in order along a rail with number, function, lock badge and room count, the current deck highlighted. No rooms here; clicking a deck opens its travel panel, which lists them.
- **[to revise] The map is moving to the slate** ([[site-frame]]): travel will be chosen from Quell's map on the slate, and a terminal will show only its own deck. The navigation described below predates that.
- **Navigation terminal: current location and station layout only.** The side column (posted files and their viewer, the area-systems box, the full-directory button) is removed, and the main column fills the width. Their code is still in the file, but `open` and `tree` now have nothing on screen to show, and that includes the alignment record that starts the window countdown.
- Deck functions not yet decided show as "[Not yet designed]".
- **UDC (Universal Data Connector):** a socket icon in the status strip, showing that a device can be plugged in. Available: teal outline with pins. Damaged: amber, broken outline with a crack. Disabled: grey, struck through. No UDC: nothing drawn, the absence is the signal. Usable connectors carry a small connect icon (two opposing arrows in a teal outline) so the row reads as something to click; the words stay in the modal. It disappears once a device is in, leaving the red socket and "UDC · UNREGISTERED DEVICE", which keeps the row on screen on phones. (A text **CONNECT ⇄** button was tried and replaced, as it repeated the modal.) so the row reads as something to plug into, not just a status; damaged and disabled ones show status only. Clicking it (or `udc`; `port` also works) opens a floating modal (centred over a dimmed screen, 460 px wide, 8 px corner radius, thin border and soft shadow; closes with Esc or a ✕ that sits above the modal, right-aligned with an 8 px gap, focus moves to the ✕ on open and back to the UDC button on close), framed like the whole interface: a top bar in the panel off-black `#0F1112` with "UNIVERSAL DATA CONNECTOR" centred and the same 5-pin socket icon centred below it, drawn larger (72 px) in its state colour (centred so it never sits under the close ✕); the body in the darker ground `#0B0C0D`; and a bottom bar, off-black again, with the status centred: "TERMINAL DT9-T01B · AVAILABLE", or "TERMINAL DT9-T01B · DATA SLATE CONNECTED" once a device is in. (A wide 26-pin banner was tried and replaced, to keep it identical to the icon.) In the body, a step at a time: first a single **CONNECT** button; clicking it asks you to **choose a device** (the data slate, BLDS-X, adaptive UDC, plus a placeholder for others) with a Back button; picking one runs a short link process, like the boot: a spinner with "LINKING DATA SLATE", then "[ OK ] HANDSHAKE" (ding, 1320 Hz) at 0.6 s, "[ OK ] PROTOCOL · NASHIRO TERMINAL OS" (ding, 990 Hz) at 1.25 s, and "[ OK ] LINK ESTABLISHED" with a longer completion ding (660 Hz) at 1.95 s. The dings are the "data accepted" sound from the SIGMA Voice Tuner: square tones through a 1.6 kHz low-pass, so they sound muffled. Typing `connect slate` runs the same process; closing the modal or walking away part-way cancels it. Once linked, the body shows the log and a single **DISCONNECT** button, the same shape as CONNECT but in SIGMA red. Connecting fills the socket in SIGMA red, relabels it "UDC · UNREGISTERED DEVICE", and SIGMA says "Unregistered device connected to UDC." Disconnecting gets "Unregistered device disconnected from UDC." Both are SIGMA messages, typed out with its voice. Damaged and disabled connectors explain why nothing can connect. Walking to another terminal unplugs. The slate's tools aren't mocked up yet. Which terminal has which state is spread out for the mockup, not canon. In the lore, UDC is the slate's own Blackline connector; calling the terminal socket UDC assumes UDC is a general standard the slate's adaptive version fits.
- **Moving** asks first, then plays the trip. The terminal-to-terminal model is retired (see `lore/site-frame.md`, The place model); arrival at the new place is being redesigned, so for now the trip lands straight on the location screen.
  1. **Pick a deck.** Clicking a deck on the station layout (or `cd deck 02`) opens a **deck panel**, styled like the UDC modal: the deck's number and function, then WHERE TO? listing the deck itself first ("Deck 02 hub · the deck itself · lift lobby") and then its rooms, each with its lock badge and "about n min". The current place is marked YOU and can't be picked. Rooms on the current deck (the boxes under it, or `cd galley`) skip this step, and so does `cd ..`. A room on another deck picked from the full directory opens its deck's panel.
  2. **Confirm.** TRAVEL TO, the place and deck, the route leg by leg ("On foot to Lift B · 60 m", "Lift B · Deck 01 to Deck 02", "On foot to Galley · 45 m"), the total time, the window left on arrival once the countdown has started, and a note on locked places ("You can get there, not necessarily in"). YES, TRAVEL (teal, focused) or ◂ BACK to the deck's places. Esc or ✕ closes.
  3. **The trip.** The screen goes black and an amber arrow, one thick solid chevron as wide as the passage, makes the journey, leg by leg, with the leg named above it ("ON FOOT · AIRLOCK B ▸ LIFT B", "LEG 1 OF 3") and station time before and after below ("WINDOW −2 MIN" once the countdown runs). Every trip starts on foot. **Running:** the arrow moves along a corridor between the two named ends, footsteps every 0.25 s. **Lift:** the decks it passes are stacked edge to edge as full-width bands in faint outline, with the shaft running through them; the arrow moves up or down the shaft and each deck fills amber and shows its number, large on the right, only while the arrow is on it, under a low hum, a ding per deck and a lower one on arrival. **Ladder**, where the lift doesn't stop: the same through a ladder well, a knock and ring per rung. **Tram**, the station's horizontal lift, for the far end of a deck (80 m or more): the corridor with a dashed rail down its middle, with a hum and a clack. Then a run to the room if it isn't the hub, a rising three-note arrival chime over a beat of black, and the new location. Any key or tap skips the rest of the trip.

  Game time: running at about 3 m/s, the lift 40 s plus 15 s a deck, a ladder 2.5 min a deck, the tram 45 s plus a little per metre, rounded up to whole minutes and taken off both clocks at once (between trips they still run in real time). Each leg lasts 0.7 to 4.2 s on screen. Under reduced motion each leg shows still for 0.8 s. Each deck has a hub terminal (DT9-T010, DT9-T020 and so on); there is no station-level terminal.
- **Connecting by command:** `connect <device>` (`connect slate`, or the start of the device's name), `disconnect`. `connect` alone lists what can be connected, so the name never has to be guessed. Same results and messages as the UDC modal: no UDC, damaged or disabled connectors explain why nothing can connect.
- **Arrival message:** "SIGMA: General access session open. Type help for commands." appears whole, not retyped: SIGMA already said the first part out loud on the login screen, where the browser allows sound.
- **Commands:** `ls`, `cd <place>` (nearby rooms, the hub, or any deck by name, number or function, such as `cd deck 02` or `cd research`), `cd ..` (back to the deck hub), `open <file>`, `tree`, `help`, `messages`, `close`.

## Station directory (`Main.dc.html`)

The earlier version of the screen after login, kept for comparison: the file tree as the main view.

- **Status strip:** "◉ QUELL ▸ DECK 02 / GALLEY" (the current location flag) and station time. A red YOU tag also marks his folder in the tree.
- **SIGMA header** with "ACCESS: GENERAL".
- **File tree** with `DOVETAIL-9` as the master folder: Deck 01 to Deck 12, each with its rooms beneath. Places only. Folders are collapsible; all decks start collapsed. Opens on the station overview.
- **Location panel:** what Quell sees, his scanner reading, the files and sub-folders there. Files open in a viewer.
- **Terminal line:** `ls`, `cd <name>`, `cd ..`, `cd /`, `open <file>`, `help`, alongside clicking. `help` expands the prompt box to list this screen's commands, the same way as on the boot screen. SIGMA's messages type out with its voice; the arrival message prints silently, since browsers hold sound until the first keypress. No mute button here yet.
- **Not yet mocked up:** the TOOLS area (slate and its abilities), and Quell's own logs, which were removed with the old `devices/` folder.

## Frame

Every screen sits between a matching **top bar** and **bottom bar**, both in the command line's style: 41 px tall, darker fill `#0F1112`, a 1 px divider toward the content, and 8 px rounded outer corners (top corners on the top bar, bottom corners on the bottom bar). A 20 px gap separates each from the window edge (more where a phone has a notch or home bar).

- **Top bar:** terminal ID and time on the boot screen (with the mute button); location flag and station time on the directory.
- **Bottom bar:** a working command line only where the reader can type (the boot screen once it's ready, and the directory). On standby, during the boot and logging in, it's the same shape, empty. It always draws above the boot log, so log text can't show through it when a phone keyboard squeezes the screen.
- The directory's command line stays pinned to the bottom of the window even when the content above is short.

## SIGMA's voice

**SIGMA has one dedicated spot: the message line in the bottom bar.** Its latest message always appears there, on every screen, including screens with no input (standby, logging in). A button at the right of the bar, or the `messages` command, expands the bar upwards to show SIGMA's earlier messages with their station times ("SIGMA MESSAGES", newest last and brightest; the same button or `close` folds it away). While the history is open the separate message line hides, since the list already ends with the latest message. Help and history share that space, so opening one closes the other. Neither clears the latest message.

Whenever SIGMA speaks, its name appears in SIGMA red and the message in off-white: on the response line ("SIGMA: General access session open."), and in the boot greeting. Plain system output, such as `ls` results and access errors, stays teal.

## Type scale (boot and login)

| Use | Style |
|---|---|
| All terminal text: boot log, status lines, typed input, help list, SIGMA messages | IBM Plex Mono 13 px, no extra letter spacing |
| Small uppercase labels: top bar, stage headings, "AVAILABLE COMMANDS", standby | 11 px, 0.12em letter spacing |
| Logo subtitles | 11 px, 0.14em |
| Buttons (WAKE TERMINAL) | Chakra Petch 600, 13 px, 0.14em, 44 px tall |
| SIGMA title | Chakra Petch 600, 46 px (32 px on phones) |

## Look

- Ground `#0B0C0D`, panels `#0F1112` / `#121416`, borders `#2A2D30`.
- Text off-white `#E8E4DA`, muted `#A8A49A`.
- Accent SIGMA red `#E0504A`; warnings amber `#D9A441`; readings teal `#9FC7C2`; granted access traffic-light green `#3DDC6A`.
- Badges: 1 px dim border in a darker shade of the text colour (green `#1E6B35`, teal `#2F4A47`, amber `#5A4A2A`), so side-by-side badges carry the same weight.
- Type: IBM Plex Mono (body), Chakra Petch (headings and labels).

## Canon status

Everything here follows the lore, except these, invented for the mockup and **not canon**:

- room names and layout beyond numbered decks under `DOVETAIL-9`
- crew names (shown as placeholders)
- terminal IDs (DT9-T01B and the rest) and which terminals are public or restricted, firmware v7.2, SIGMA Terminal OS 4.12, 16 cores, 256 TB memory, 2.0 PB storage, 12 °C, station times
- "test 14" in the researcher's message
- distances, Lift B, Ladder Well 3 (a ladder isn't in the station lore; the lifts and a horizontal lift are), the tram as the horizontal lift's form and when it's used, which decks the lift serves, running speed and the minutes each trip costs, and Quell's arrival notes (kept in the file for the place screen)
- the lock badges (SEALED, NO POWER, CLEARANCE 3): illustrations of candidate mechanisms, none committed
