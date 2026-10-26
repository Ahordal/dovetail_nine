# Hull side view

A to-scale side elevation of Dovetail-9's main hull: the 12 decks, the stepped profile, the Core Chamber and engineering, the shielding plant, the docking bay with the Mistral, the comms spires and the array stubs. It draws what [dovetail-9-station](../../lore/dovetail-9-station.md) records; the lore wins any conflict.

- It's an inboard profile: it shows how things stack (decks, big volumes, vertical routes and lift stops). Doors between rooms, and anything that depends on position across the hull's width, belong in the deck-by-deck plans still to come.
- `build.mjs` generates `site/drawing.svg` and `site/hull-side-view/index.html`. Edit the modules, not the output, then run `node build.mjs` from this folder. Each system has its own module; `build.mjs` sets the draw order.
- Published view: the `hull-side-view/` page on the Vercel site, redeployed on every push to `main`.
- Heights come from the exterior image; lengths along the hull are first guesses, since the image sees the hull at an angle.
