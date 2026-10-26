# CLAUDE.md

Guidance for Claude Code when working in this project.

## Project

Dovetail-9: an interactive sci-fi narrative told through an in-universe web terminal (Nashiro Dynamics' SIGMA station OS). Current phase is **worldbuilding**, not site development.

- `canon.md`: settled facts and open questions. Wins any conflict with other files.
- `lore/`: private, out-of-universe notes for the writer. Never shown on the site.
- `documents/` (future): in-universe files the reader finds on the terminal.
- Every station fact in `lore/` must be discoverable in the game through some in-universe source (see `lore/site-frame.md`). When adding station lore, note where the reader could find it. Out-of-universe notes (what's invented, real-world parallels, reasoning) stay private.

## Consistency rule

Before recording any answer or new idea, check it against `canon.md` and every relevant `lore/` file, especially `lore/phase-mechanics.md`. If it contradicts an existing rule or fact, **flag the conflict and propose a resolution before writing it down**. Never silently record a contradiction.

Physics is pseudo-science with consistent rules: invented is fine, inconsistent is not.

## Interview style

When developing lore with the user, ask **one question at a time**, yes/no where possible. Offer a recommendation when asked "what do you think".

## Frontmatter

Wiki links in YAML frontmatter must be quoted, one per line, or GitHub fails to parse it:

    related:
      - "[[phase-mechanics]]"

## Writing

- Use plain language when explaining.
- No em dashes in site copy or lore; use commas or periods.

## Reference site (hull view and slate map)

Published on Vercel from `site/`, redeployed on every push to `main`. The site and repo are public; `site/robots.txt`, a `noindex, nofollow` meta tag on every page and the `X-Robots-Tag` header in `vercel.json` keep it out of search. Every new page needs that meta tag.

Build and publish:

1. Edit the modules in `reference/hull-side-view/` (or `reference/slate-map-trial/build.mjs`), never the files in `site/`.
2. `node build.mjs` in `reference/hull-side-view/`, then in `reference/slate-map-trial/` (it reads `site/drawing.svg`, so always second).
3. Commit the source and the rebuilt `site/` files, then push. Never read the built HTML or SVG back; they are large.

To preview locally, serve `site/` (for example `npx serve site`); the pages fetch `../drawing.svg`, which fails from `file://`.

Hull view modules, in draw order: `hull.mjs` (draws on import: exterior, decks, lifts, tram, engineering shell, core, bay and its rooms), then `build.mjs` calls `power.mjs` fuel, `services.mjs` water plant, power's engineering, trusses and grid, `rooms.mjs`, power's feeders, water branches, `doors.mjs` access trunks, the data network, lift doors, air, `fire.mjs`. Then tags, the you-are-here marker and the rulers. `frame.mjs` holds coordinates and shared lists; `style.mjs` the CSS; `page.mjs` the page around the drawing.

Drawing conventions:

- Coordinates: `S` = 2.4 drawing units per metre. Hull top-left at (`X0` 120, `Y0` 150), 400 m long, 12 decks of 8 m (`DH` 19.2 units). `mx(m)` is metres along from the aft end; `dy(k)` is the top of deck `k`. Room fit-outs measure height `h` up from the floor with `Yk(k, h)`.
- Service band: the top 3 m of each deck, above the room ceiling. Heights below the deck top: air ducts 0.8 m, gold power feeders 1.4 m, crawlways centred at 2.25 m (0.9 m high), data 2.875 m, water branches 3.2 m (just under the band). Fire mains run 3.6 m down (Deck 06 5.7, Deck 07 4.0, Deck 09 4.1).
- Draw order: anything pushed to `GOLD`, `EARLY` or `CRAWL` is spliced in behind everything drawn after the hull (`goldAt`), so feeders, water and data lines read as being in the back wall. Room tags go in `tags` and are drawn last, centred in the smallest room outline that holds them.
- Colours (CSS tokens): power `--gold`, water `--open` (teal), data `--data` (magenta), air `--air` (violet), fire `--fire` (red), tram `--accent` (amber), structure and rooms `--muted`, open doors `--unlocked`, locked doors `--locked`.
