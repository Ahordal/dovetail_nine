// The hull and its decks, the lifts and tram, engineering's shell and the core, the docking bay and the rooms around it.
// Importing this module draws them, first, in this order.
import { dy, DH, Y0, Y1, X0, X1, add, f, S, mx, outline, L, SPAN, LIFTS, LW, svg, tags, tag, sigmaLogo, BAY } from './frame.mjs';

// Anchor Core array stubs, both ends, on the hull's axis.
export const midY = dy(6) + DH / 2;   // the Deck 06 spine: keel, conduits, array axis
export const hullMid = (Y0 + Y1) / 2;
for (const [a, b] of [[24, X0], [X1, X1 + 96]]) {
  add(`<g class="truss"><line x1="${a}" y1="${f(midY - 8)}" x2="${b}" y2="${f(midY - 8)}"/><line x1="${a}" y1="${f(midY + 8)}" x2="${b}" y2="${f(midY + 8)}"/>`);
  let zig = '';
  for (let x = a, up = true; x < b; x += 12, up = !up) zig += `${f(x)},${f(midY + (up ? -8 : 8))} `;
  add(`<polyline points="${zig}${b},${f(midY - 8)}"/></g>`);
}
// A reinforcement ring around each truss stub, octagonal end-on, marker lights top and bottom.
for (const cx of [72, X1 + 48]) {
  const w = 5, h = 19, c = 5;
  add(`<polygon class="ring" points="${cx - w},${f(midY - h + c)} ${cx - w + c},${f(midY - h)} ${cx + w - c},${f(midY - h)} ${cx + w},${f(midY - h + c)} ${cx + w},${f(midY + h - c)} ${cx + w - c},${f(midY + h)} ${cx - w + c},${f(midY + h)} ${cx - w},${f(midY + h - c)}"/>`);
  for (const y of [midY - h, midY + h]) add(`<circle class="truss-light" cx="${cx}" cy="${f(y)}" r="1.4"/>`);
}

// Two comms spires, after the exterior image: a taller one left of centre, a shorter twin-tipped one to its right.
export const up = (h) => f(Y0 - h * S);
export const block = (m0, m1, h0, h1) => add(`<rect class="spire-block" x="${mx(m0)}" y="${up(h1)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"/>`);
// Tapering truss mast from base to top, cross-arms at the given heights, then a single whip.
export const truss = (c, base, top, whip, w, arms) => {
  add(`<polyline class="mast" points="${mx(c - w)},${up(base)} ${mx(c - 0.4)},${up(top)} ${mx(c + 0.4)},${up(top)} ${mx(c + w)},${up(base)}"/>`);
  let zz = "";
  for (let h = base, left = true; h < top; h += 2.8, left = !left) { const hw = w - (h - base) * (w - 0.4) / (top - base); zz += `${f(mx(c + (left ? -hw : hw)))},${up(h)} `; }
  add(`<polyline class="mast-thin" points="${zz}"/>`);
  add(`<line class="mast" x1="${mx(c)}" y1="${up(top)}" x2="${mx(c)}" y2="${up(whip)}"/>`);
  for (const [h, l, r] of arms) add(`<line class="mast-thin" x1="${mx(c - l)}" y1="${up(h)}" x2="${mx(c + r)}" y2="${up(h)}"/>`);
};
block(164, 196, 0, 5); block(170, 190, 5, 10); block(175, 185, 10, 15); block(177.5, 182.5, 15, 18);
block(212, 236, 0, 5); block(217, 231, 5, 9); block(220, 228, 9, 12);
truss(180, 18, 46, 58, 2.5, [[24, 5, 3], [31, 2, 4.5], [38, 3.5, 1.5], [50, 1.5, 1.5]]);
truss(224, 12, 34, 44, 2, [[19, 3, 4], [27, 2.5, 1.5], [39, 1.2, 1.2]]);
// Equipment boxes on the roof tiers.
for (const [m0, m1, h, base] of [[146, 154, 3, 0], [156, 162, 4.5, 0], [199, 207, 3, 0], [240, 246, 3.5, 0], [250, 258, 2.5, 0], [110, 116, 2, -8], [284, 292, 3, -8]]) block(m0, m1, base, base + h);
// Satellite masts of varied height, some with arms or a beacon.
export const masts = [[113, -6, 9, 0], [150, 3, 13, 0], [159, 4.5, 26, 0], [168, 5, 22, 0], [187, 10, 33, 1], [203, 3, 20, 0], [229, 9, 40, 1], [233, 5, 24, 0], [243, 3.5, 29, 0], [254, 2.5, 12, 0], [288, -5, 12, 0]];
export const beacons = [[180, 58], [224, 44]];
for (const [m, base, top, beacon] of masts) {
  add(`<line class="mast-thin" x1="${mx(m)}" y1="${up(base)}" x2="${mx(m)}" y2="${up(top)}"/>`);
  if (top - base > 15) add(`<line class="mast-thin" x1="${mx(m - 1.6)}" y1="${up(top - 6)}" x2="${mx(m + 1.6)}" y2="${up(top - 6)}"/>`);
  if (beacon) beacons.push([m, top]);
}
// Dishes, seen edge-on: an arc on a short stub, each facing its own way.
for (const [m, h, r, ang] of [[159, 18, 4.5, -35], [243, 19, 3.8, 40], [203, 14, 3, -20], [187, 26, 2.6, 25]]) {
  add(`<g transform="translate(${mx(m)} ${up(h)}) rotate(${ang})"><line class="mast-thin" x1="0" y1="0" x2="0" y2="${f(2.2 * S)}"/><path class="dish" d="M ${f(-r * S)} 0 Q 0 ${f(r * S * 0.9)} ${f(r * S)} 0 Z"/></g>`);
}
for (const [m, h] of beacons) add(`<circle class="mast-light" cx="${mx(m)}" cy="${up(h)}" r="2.2"/>`);
add(`<text class="t-note" x="${mx(250)}" y="${up(36)}">comms spires</text>`);

// Decks: a service band above each ceiling, then the room, floor on the deck line.
add(`<defs><clipPath id="hull-clip"><polygon points="${outline}"/></clipPath></defs>`);
add(`<polygon class="hull-fill" points="${outline}"/>`);
add(`<g clip-path="url(#hull-clip)">`);
for (let k = 1; k <= 12; k++) {
  const y = dy(k);
  add(`<rect class="service" x="${X0}" y="${y}" width="${f(L * S)}" height="${f(3 * S)}"/>`);
  if (k > 1) add(`<line class="deck-line" x1="${X0}" y1="${y}" x2="${X1}" y2="${y}"/>`);
  // Slide a deck number past a lift shaft it would sit under.
  let lx = mx(SPAN[k][0]) + 7;
  for (const L of LIFTS) if (lx < mx(L + LW / 2) && lx + 18 > mx(L - LW / 2)) lx = mx(L + LW / 2) + 4;
  add(`<text class="t-watermark t-deck-num" x="${f(lx)}" y="${f(y + 3 * S + 10.4)}">${String(k).padStart(2, '0')}</text>`);
}
add(`</g>`);
add(`<polygon class="hull-edge" points="${outline}"/>`);
export const goldAt = svg.length;   // GOLD, EARLY and CRAWL are spliced in here, behind everything that follows
// Lift shafts top to bottom, outlined solid. A dot marks each deck served;
// doorways are drawn only where a room on this face meets the shaft.
// Deck 09's stops sit mid-room, under the 4.5 m ceiling of the ready rooms.
export const RC = 4.5;
for (const L of LIFTS) {
  add(`<rect class="lift" x="${f(mx(L - LW / 2))}" y="${Y0}" width="${f(LW * S)}" height="${f(Y1 - Y0)}"/>`);
  for (let k = 1; k <= 12; k++) add(`<circle class="stop" cx="${mx(L)}" cy="${f(k === 9 ? dy(10) - RC * S / 2 : dy(k) + DH / 2)}" r="1.8"/>`);
  add(`<text class="t-note" x="${mx(L)}" y="${Y0 - 4}" text-anchor="middle">LIFT</text>`);
}
// Lift lobbies on Deck 06: where the lifts meet the tram, its two main stops. Each reaches out past its access
// trunk, so the trunk opens into the lobby rather than onto the track.
for (const [m0, m1] of [[119.5, LIFTS[0] - LW / 2], [LIFTS[1] + LW / 2, 280.5]]) {
  add(`<rect class="room" x="${f(mx(m0))}" y="${dy(6)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  tags.push(tag((m0 + m1) / 2, 6, 4));
}

// Tram along Deck 06.
export const tramY = f(dy(7) - 1.6);
// Faded wherever it runs through a room or section on Deck 06 (the lobbies, engineering, the lifts between).
export const TRAM_FADE = [119.5, 280.5];
// The tram stops at the array-access airlocks at both ends.
add(`<line class="tram" x1="${mx(6.5)}" y1="${tramY}" x2="${mx(TRAM_FADE[0])}" y2="${tramY}"/>`);
add(`<line class="tram tram-behind" x1="${mx(TRAM_FADE[0])}" y1="${tramY}" x2="${mx(TRAM_FADE[1])}" y2="${tramY}"/>`);
add(`<line class="tram" x1="${mx(TRAM_FADE[1])}" y1="${tramY}" x2="${mx(393.5)}" y2="${tramY}"/>`);

// Engineering: the section around the Core Chamber, Decks 05 to 07.
// Engineering runs out to meet both lift shafts.
export const EX = [LIFTS[0] + LW / 2, LIFTS[1] - LW / 2];   // 137 to 263 m
export const ex0 = mx(EX[0]), ex1 = mx(EX[1]), ey0 = dy(5), ey1 = dy(8);
add(`<rect class="section" x="${ex0}" y="${ey0}" width="${f(ex1 - ex0)}" height="${f(ey1 - ey0)}"/>`);
// Conduits along the spine from the chamber out to both arrays.
export const cr = f(11 * S), ccx = mx(200);
add(`<line class="conduit" x1="${X0}" y1="${f(midY)}" x2="${f(ccx - cr)}" y2="${f(midY)}"/><line class="conduit" x1="${f(ccx + cr)}" y1="${f(midY)}" x2="${X1}" y2="${f(midY)}"/>`);
add(`<text class="t-note" x="${mx(24)}" y="${f(midY - 3)}">CONDUITS · KEEL</text>`);
// Two vertical access shafts through engineering, midway between the chamber and the section edge.
// Each stands in a 3 m wall zone, built to the station's access standard: 1.2 m wide, a 0.5 m ladder.
for (const m of [164.5, 235.5]) {
  add(`<rect class="shaft" x="${f(mx(m) - 0.6 * S)}" y="${ey0}" width="${f(1.2 * S)}" height="${f(ey1 - ey0)}"/>`);
  for (const x of [mx(m) - 0.25 * S, mx(m) + 0.25 * S]) add(`<line class="ladder" x1="${f(x)}" y1="${ey0}" x2="${f(x)}" y2="${ey1}"/>`);
  for (let y = ey0 + 0.5 * S; y < ey1 - 0.3; y += 0.5 * S) add(`<line class="rung" x1="${f(mx(m) - 0.25 * S)}" y1="${f(y)}" x2="${f(mx(m) + 0.25 * S)}" y2="${f(y)}"/>`);
}
// Doors from each shaft into the rooms either side of its wall zone, on every engineering deck: inspection and
// module replacement reach the generator, switch and capacitor halls without the lifts. Drawn with the lift doors below.
export const SHAFT_DOORS = [163, 166, 234, 237].flatMap((m) => [5, 6, 7].map((k) => [m, k]));
// R&D and experiment control on Deck 05, just inside engineering, sharing a wall and the sealed lock.
export const RD = [LIFTS[0] + LW / 2, 150];
for (const [m0, m1, n] of [[RD[0], RD[1], 2], [RD[1], 163, 3]]) {
  const w = (m1 - m0) * S;
  add(`<rect class="room" x="${f(mx(m0))}" y="${dy(5)}" width="${f(w)}" height="${f(DH)}"/>`);
  tags.push(tag((m0 + m1) / 2, 5, n));
}
// SIGMA's core: a 5 m column from Deck 04 up into command on Deck 01, on the chamber's axis.
export const CW = 5, cx0 = 200 - CW / 2;
add(`<rect class="sigma-core" x="${mx(cx0)}" y="${dy(1)}" width="${f(CW * S)}" height="${f(4 * DH)}"/>`);
// SIGMA's emblem, centred on the column's height.
tags.push(sigmaLogo(mx(200), dy(3), 5.5));
// Its operations room at the base, where Engineering services the hardware.
add(`<rect class="room" x="${mx(cx0 + CW)}" y="${dy(4)}" width="${f(9 * S)}" height="${f(DH)}"/>`);
tags.push(tag(cx0 + CW + 4.5, 4, 1));
// Shielding plant on Deck 07: capacitor halls from each shaft in toward the chamber.
for (const [m0, m1, n] of [[166, 187, 5], [213, 234, 6]]) {
  add(`<rect class="room" x="${f(mx(m0))}" y="${dy(7)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  tags.push(tag((m0 + m1) / 2, 7, n));
  // Charge from the chamber's Harvest Rings, out to the emitters along the Deck 06 conduits.
  add(`<line class="power" x1="${f(mx((m0 + m1) / 2))}" y1="${dy(7)}" x2="${f(mx((m0 + m1) / 2))}" y2="${f(midY)}"/><circle class="power-node" cx="${f(mx((m0 + m1) / 2))}" cy="${f(midY)}" r="1.6"/>`);
}
// Core Chamber: a ~22 m sphere behind this face, black hole at the middle of Deck 06.
add(`<circle class="core" cx="${ccx}" cy="${f(midY)}" r="${cr}"/><circle class="singularity" cx="${ccx}" cy="${f(midY)}" r="1.6"/>`);
add(`<text class="t-note t-ship" x="${ccx}" y="${f(midY - 9)}" text-anchor="middle">CORE</text>`);
add(`<text class="t-note t-ship" x="${ccx}" y="${f(midY + 14)}" text-anchor="middle">CHAMBER</text>`);
// Faint watermark across Deck 05, drawn last so the chamber and shafts don't hide letters.
add(`<text class="t-watermark" x="${f(ex0 + 8)}" y="${f(ey0 + 16)}" textLength="${f(ex1 - ex0 - 16)}" lengthAdjust="spacing">ENGINEERING</text>`);

// Floor lines are 1 unit thick, centred on the deck line: doors stop flush against them, above and below.
// Doors are drawn at wall thickness, told apart from walls by colour alone.
export const FL = 0.5, DW = 1;
// Docking bay: Decks 08 to 11, centred under the superstructure.
export const bx = mx(BAY[0]), bw = f((BAY[1] - BAY[0]) * S), by = dy(8), bh = f(4 * DH);
add(`<rect class="bay" x="${bx}" y="${by}" width="${bw}" height="${bh}"/>`);
add(`<text class="t-watermark" x="${f(bx + 8)}" y="${f(dy(12) - 6)}" textLength="${f(bw - 16)}" lengthAdjust="spacing">DOCKING BAY</text>`);

// The Mistral seen from astern (16.5 × 11.2 m): it flies in nose first, so its tail faces out of the bay.
export const sw = f(16.5 * S), sh = f(11.2 * S);
// Centred on Deck 09 so the umbilical meets the middle of its hull.
export const cx = f(bx + bw / 2), cy = f(dy(9) + DH / 2);
export const sx = f(cx - sw / 2), sy = f(cy - sh / 2);
add(`<g class="ship"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="5"/><circle cx="${f(cx - 9)}" cy="${f(cy + 1)}" r="4.5"/><circle cx="${f(cx + 9)}" cy="${f(cy + 1)}" r="4.5"/></g>`);
// Gantry crane: a rail the length of the bay ceiling, the trolley parked over the cargo dock with its grab lowered.
export const railY = dy(8), tx = mx(BAY[0] + 6);
add(`<g class="gantry"><rect x="${bx}" y="${railY}" width="${bw}" height="${f(0.9 * S)}"/>`);
add(`<rect x="${f(tx - 2.2 * S)}" y="${f(railY + 0.9 * S)}" width="${f(4.4 * S)}" height="${f(1.6 * S)}"/>`);
export const grabY = dy(11) - 7 * S;
add(`<line x1="${f(tx)}" y1="${f(railY + 2.5 * S)}" x2="${f(tx)}" y2="${f(grabY)}"/>`);
add(`<polyline points="${f(tx - 2 * S)},${f(grabY + 1.6 * S)} ${f(tx - 2 * S)},${f(grabY)} ${f(tx + 2 * S)},${f(grabY)} ${f(tx + 2 * S)},${f(grabY + 1.6 * S)}"/></g>`);
// Cargo dock: a raised platform outside the cargo door, a deck above the bay floor, where the gantry sets loads down.
// It carries the cargo airlock's floor straight out: same level, same thickness.
add(`<rect class="platform" x="${bx}" y="${f(dy(11) - FL)}" width="${f(10 * S)}" height="${2 * FL}"/>`);
for (const m of [3, 9]) add(`<line class="dock-leg" x1="${f(mx(BAY[0] + m))}" y1="${f(dy(11) + FL)}" x2="${f(mx(BAY[0] + m))}" y2="${dy(12)}"/>`);
// Open ladder from the dock down to the bay floor, in the gap by the wall; grab rails rise above the deck.
{
  const l0 = mx(BAY[0] + 1.25), l1 = mx(BAY[0] + 1.75), top = dy(11) - FL - 1 * S, bot = dy(12);
  add(`<path class="ladder" d="M ${l0} ${bot} V ${f(top)} H ${l1} V ${bot}"/>`);
  for (let y = dy(11) + FL + 0.5 * S; y < bot - 0.3 * S; y += 0.5 * S) add(`<line class="rung" x1="${l0}" y1="${f(y)}" x2="${l1}" y2="${f(y)}"/>`);
}
tags.push(tag(BAY[0] + 5, 10, 9));
// Docking clamps 1 to 4: two arms down from the bay ceiling, two up from the floor, each ending in a pad on the hull.
add(`<g class="clamp">`);
for (const [n, side, m] of [[1, -1, -4.5], [2, -1, 4.5], [3, 1, -4.5], [4, 1, 4.5]]) {
  const x = f(cx + m * S), hull = f(cy + side * sh / 2), root = side < 0 ? dy(8) : dy(12);
  const padY = side < 0 ? f(hull - 0.9 * S) : hull, joint = f((root + hull) / 2);
  add(`<rect x="${f(x - 0.55 * S)}" y="${f(Math.min(root, padY))}" width="${f(1.1 * S)}" height="${f(Math.abs(padY - root))}"/>`);
  add(`<rect x="${f(x - 1.6 * S)}" y="${padY}" width="${f(3.2 * S)}" height="${f(0.9 * S)}"/>`);
  add(`<circle cx="${x}" cy="${joint}" r="2"/><rect x="${f(x - 1.4 * S)}" y="${f(root - (side < 0 ? 0 : 0.8 * S))}" width="${f(2.8 * S)}" height="${f(0.8 * S)}"/>`);
}
add(`</g>`);
export const r = f(12.5 * S);
add(`<text class="t-note t-ship" x="${f(cx - r - 6)}" y="${f(cy + 2.6)}" text-anchor="end">MISTRAL →</text>`);

// Boarding umbilical, and the airlock doors.
export const floor9 = dy(10), wall = f(bx + 98 * S);
export const doorBot = (k) => dy(k + 1) - FL;
// Airlocks and ready rooms get a 4.5 m ceiling; the rest of Deck 09 above them is service space.
// Airlocks stay small so each cycle pumps out less air; people only, cargo uses the cargo airlock below A.
export const DOOR = 3, ceil9 = dy(10) - RC * S, door9Top = doorBot(9) - DOOR * S;
export const door9Mid = (door9Top + doorBot(9)) / 2;
// Floor to just over the door, centred on it and on the ship. B's reaches the Mistral; A's is pulled back to its wall.
add(`<rect class="umbilical" x="${f(sx + sw)}" y="${f(door9Mid - 1.7 * S)}" width="${f(wall - sx - sw)}" height="${f(3.4 * S)}"/>`);
add(`<rect class="umbilical" x="${bx}" y="${f(door9Mid - 1.7 * S)}" width="${f(2.5 * S)}" height="${f(3.4 * S)}"/>`);
// Airlock rooms, one in each end wall of the bay: A on the left, B on the right, joined to the Mistral.
export const AL = 6.5;
add(`<rect class="room" x="${wall}" y="${f(ceil9)}" width="${f(AL * S)}" height="${f(RC * S)}"/>`);
add(`<rect class="room" x="${f(bx - AL * S)}" y="${f(ceil9)}" width="${f(AL * S)}" height="${f(RC * S)}"/>`);
// Door colours give each door's state as Quell finds it: B is in use with the Mistral docked, A opens on vacuum.
for (const x of [wall, bx]) add(`<rect class="airlock ${x === wall ? "door-open" : "door-locked"}" x="${f(x - DW / 2)}" y="${f(door9Top)}" width="${DW}" height="${f(DOOR * S)}"/>`);
// Room tags centred in the low rooms.
export const tag9 = (m, n) => tag(m, 9, n, (ceil9 + dy(10)) / 2 - dy(9) - DH / 2);
tags.push(tag9(BAY[0] - AL / 2, "A"), tag9(BAY[1] + AL / 2, "B"));
// Airlock machinery on Deck 08 above each airlock and ready room: air recovery, pumps, valves, door ram. Locked hatch from the ready room.
// Big pipes are hollow: every outer edge first, then every fill, so tees and bends merge cleanly.
export const PD = 0.5;
export const hollow = (runs) => {
  for (const d of runs) add(`<path class="pipe-o" d="${d}"/>`);
  for (const d of runs) add(`<path class="pipe-i" d="${d}"/>`);
};
// Floor-to-ceiling height of Deck 09's low rooms, in metres below Deck 08's top.
export const H9 = (ceil9 - dy(8)) / S;
export const plant = (x0, flip, link) => {
  // x0 is the space's left edge in metres; flip mirrors the layout so the two sides differ.
  const X = (m) => f(mx(flip ? x0 + 14 - m : x0 + m)), Y = (h) => f(dy(8) + h * S);
  const box = (m0, m1, h0, h1, rx = 0) => add(`<rect x="${f(Math.min(+X(m0), +X(m1)))}" y="${Y(h0)}" width="${f(Math.abs(m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${rx}"` : ""}/>`);
  const ln = (m0, h0, m1, h1, cls = "") => add(`<line${cls ? ` class="${cls}"` : ""} x1="${X(m0)}" y1="${Y(h0)}" x2="${X(m1)}" y2="${Y(h1)}"/>`);
  add(`<g class="plant">`);
  // Riser from the manifold down to the airlock's ceiling vent; the station supply tees into it.
  const runs = [`M ${X(9.1)} ${Y(8.0)} V ${Y(11.1)}`, `M ${X(0)} ${Y(10.35)} H ${X(9.1)}`];
  // The link to the cargo machinery leaves the supply downward, into the wall beside the lift.
  if (link) runs.push(`M ${X(0.85)} ${Y(10.35)} V ${Y(H9)}`);
  hollow(runs);
  add(`<circle cx="${X(3.6)}" cy="${Y(10.35)}" r="${f(0.4 * S)}"/>`);
  // Air recovery tanks: air pumped out of the airlock is stored here, not vented.
  box(0.5, 6.4, 0.9, 2.7, 3.5);
  box(0.5, 6.4, 3.1, 4.9, 3.5);
  // Depressurisation pump on its base.
  add(`<circle cx="${X(2.8)}" cy="${Y(6.3)}" r="${f(1.0 * S)}"/>`);
  box(1.4, 4.2, 7.3, 7.7);
  // Valve manifold: tanks and pump feed it, the riser drops from its foot.
  ln(6.4, 1.8, 8.6, 1.8, "pipe"); ln(6.4, 4.0, 8.6, 4.0, "pipe"); ln(3.8, 6.3, 8.6, 6.3, "pipe");
  box(8.6, 9.6, 1.2, 8.0);
  for (const h of [1.8, 4.0, 6.3]) add(`<circle cx="${X(9.1)}" cy="${Y(h)}" r="${f(0.4 * S)}"/>`);
  box(8.3, 9.9, 11.1, 11.5);
  // Controls and power for the cycle.
  box(10.2, 11.7, 4.4, 7.7);
  ln(10.5, 5.2, 11.4, 5.2, "flange"); ln(10.5, 5.8, 11.4, 5.8, "flange");
  // Return duct from the station's air system, below Deck 08's floor, feeding the tanks past the pump.
  box(0, 6.0, 8.5, 9.6);
  for (const m of [2.0, 4.0]) ln(m, 8.5, m, 9.6, "flange");
  ln(1.1, 4.72, 1.1, 8.5, "pipe");
  // Outer door ram above the bay wall, its rod straight down to the door head; the door lifts into this space.
  box(12.3, 13.4, 0.9, 5.8);
  ln(12.85, 5.8, 12.85, 10.4, "pipe");
  box(12.3, 14, 10.4, 11.5);
  add(`</g>`);
};
plant(LIFTS[0] + LW / 2, false, true);
plant(BAY[1], true);

// Ready rooms on Deck 09, from each lift to its airlock: the level, walk-in way to the airlocks.
for (const [v0, v1] of [[BAY[1] + AL, LIFTS[1] - LW / 2], [LIFTS[0] + LW / 2, BAY[0] - AL]]) {
  add(`<rect class="room" x="${f(mx(v0))}" y="${f(ceil9)}" width="${f((v1 - v0) * S)}" height="${f(RC * S)}"/>`);
  tags.push(tag9((v0 + v1) / 2, 7));
}
// Cargo hold: the cargo door opens into a one-deck hallway on Deck 10, which runs past the lift and opens
// into a two-storey storage area (Decks 09 and 10). Its floor sits a deck above the bay floor, level with the dock.
export const CG = [105, BAY[0]], cgTop = dy(9), cgBot = dy(11);
export const ST = LIFTS[0] - LW / 2;   // storage meets the lift shaft
add(`<rect class="hold-mask" x="${mx(CG[0])}" y="${cgTop}" width="${f((ST - CG[0]) * S)}" height="${f(cgBot - cgTop)}"/>`);
add(`<polygon class="hold" points="${mx(CG[0])},${cgTop} ${mx(ST)},${cgTop} ${mx(ST)},${dy(10)} ${bx},${dy(10)} ${bx},${cgBot} ${mx(CG[0])},${cgBot}"/>`);
// The lift passes through the hallway only, with its one cargo stop there on Deck 10.
// Sides only, redrawn over the hold's fill; the hallway's floor and ceiling run straight across.
for (const m of [LIFTS[0] - LW / 2, LIFTS[0] + LW / 2]) add(`<line class="lift" x1="${mx(m)}" y1="${dy(10)}" x2="${mx(m)}" y2="${dy(11)}"/>`);
for (const k of [10]) add(`<circle class="stop" cx="${mx(LIFTS[0])}" cy="${f(dy(k) + DH / 2)}" r="1.8"/>`);
// Storage: three empty shelving levels carried on a truss frame, posts tied by diagonal bracing between levels.
add(`<g class="racks">`);
{
  const R0 = CG[0] + 1.5, R1 = CG[0] + 15, LEVELS = [4.4, 8.8, 13.2], DEPTH = 0.7, BAYS = 3;
  const posts = [];
  for (let k = 0; k <= BAYS; k++) posts.push(R0 + (R1 - R0) * k / BAYS);
  const Y = (h) => f(cgBot - h * S);
  for (const m of posts) add(`<line class="upright" x1="${f(mx(m))}" y1="${Y(0)}" x2="${f(mx(m))}" y2="${Y(LEVELS[2])}"/>`);
  // Each level is a shallow truss: two chords with a zigzag web, the deck plate on top.
  for (const h of LEVELS) {
    add(`<line class="shelf" x1="${f(mx(R0))}" y1="${Y(h)}" x2="${f(mx(R1))}" y2="${Y(h)}"/><line class="chord" x1="${f(mx(R0))}" y1="${Y(h - DEPTH)}" x2="${f(mx(R1))}" y2="${Y(h - DEPTH)}"/>`);
    let zz = "";
    for (let m = R0, up = true; m <= R1 + 0.01; m += 1.1, up = !up) zz += `${f(mx(Math.min(m, R1)))},${Y(up ? h : h - DEPTH)} `;
    add(`<polyline class="web" points="${zz}"/>`);
  }
  // Diagonal bracing in each bay, alternating direction level by level.
  const tiers = [0, ...LEVELS.map((h) => h - DEPTH)];
  for (let t = 0; t < 3; t++) {
    const h0 = t === 0 ? 0 : LEVELS[t - 1], h1 = tiers[t + 1];
    for (let k = 0; k < BAYS; k++) {
      const a = posts[k], b = posts[k + 1], flip = (k + t) % 2 === 1;
      add(`<line class="brace" x1="${f(mx(flip ? b : a))}" y1="${Y(h0)}" x2="${f(mx(flip ? a : b))}" y2="${Y(h1)}"/>`);
    }
  }
  // A few boxes here and there, drawn over the bracing: [metres along, level, width, height].
  for (const [m, h, w, bh] of [[107.2, 0, 2.2, 1.6], [109.6, 0, 1.4, 1.1], [116.4, 0, 2.6, 2.0], [112.8, 4.4, 1.8, 1.3], [118.3, 4.4, 1.2, 0.9], [107.6, 8.8, 2.4, 1.8], [114.9, 13.2, 1.6, 1.2], [124.0, 0, 2.2, 1.8], [124.4, 1.8, 1.6, 1.3], [126.6, 0, 1.4, 1.0]]) {
    add(`<rect class="crate" x="${f(mx(m))}" y="${Y(h + bh)}" width="${f(w * S)}" height="${f(bh * S)}"/>`);
  }
}
// Hold crane: a ceiling rail the length of the storage area, its trolley parked over the open floor with the grab lowered.
{
  const railY = cgTop, tx = mx(122.5);
  add(`<g class="gantry"><rect x="${mx(CG[0])}" y="${railY}" width="${f((LIFTS[0] - LW / 2 - CG[0]) * S)}" height="${f(0.7 * S)}"/>`);
  add(`<rect x="${f(tx - 1.8 * S)}" y="${f(railY + 0.7 * S)}" width="${f(3.6 * S)}" height="${f(1.3 * S)}"/>`);
  const gy = cgBot - 6 * S;
  add(`<line x1="${f(tx)}" y1="${f(railY + 2 * S)}" x2="${f(tx)}" y2="${f(gy)}"/>`);
  add(`<polyline points="${f(tx - 1.6 * S)},${f(gy + 1.3 * S)} ${f(tx - 1.6 * S)},${f(gy)} ${f(tx + 1.6 * S)},${f(gy)} ${f(tx + 1.6 * S)},${f(gy + 1.3 * S)}"/></g>`);
}
// A few crates left loose in the cargo airlock.
for (const [m, w, hgt] of [[145.5, 2.4, 2.0], [145.8, 1.8, 1.6], [148.05, 1.8, 1.4]]) {
  const below = m === 145.8 ? 2.0 : 0;
  add(`<rect class="crate" x="${f(mx(m))}" y="${f(cgBot - (below + hgt) * S)}" width="${f(w * S)}" height="${f(hgt * S)}"/>`);
}
add(`</g>`);
// Cargo airlock inside the cargo door, so the hold stays pressurized while loading.
export const CA = BAY[0] - 8;
add(`<rect class="room" x="${mx(CA)}" y="${dy(10)}" width="${f(8 * S)}" height="${f(DH)}"/>`);
tags.push(tag(CA + 4, 10, "C"));
// Cargo ready room: the hallway's end, from the lift to the cargo airlock. Suits for working the dock.
export const CR = LIFTS[0] + LW / 2;
add(`<rect class="room" x="${mx(CR)}" y="${dy(10)}" width="${f((CA - CR) * S)}" height="${f(DH)}"/>`);
tags.push(tag((CR + CA) / 2, 10, 7));
// Cargo machinery on Deck 11, lift to bay wall: the same 14 m as the plant above Airlock A, and joined to it.
{
  const X = (u) => f(mx(CR + u)), Y = (h) => f(dy(11) + h * S);
  const box = (m0, m1, h0, h1, rx = 0) => add(`<rect x="${X(m0)}" y="${Y(h0)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${rx}"` : ""}/>`);
  const ln = (m0, h0, m1, h1, cls = "") => add(`<line${cls ? ` class="${cls}"` : ""} x1="${X(m0)}" y1="${Y(h0)}" x2="${X(m1)}" y2="${Y(h1)}"/>`);
  add(`<g class="plant">`);
  // The link, hidden in the wall past both ready rooms: its two edges, dashed.
  for (const u of [0.85 - PD / 2, 0.85 + PD / 2]) add(`<line class="pipe hidden" x1="${X(u)}" y1="${f(ceil9)}" x2="${X(u)}" y2="${dy(11)}"/>`);
  // It surfaces here, bends, and tees into the riser that rises to the cargo airlock's floor vent.
  hollow([`M ${X(11.4)} ${Y(0.5)} V ${Y(2.5)}`, `M ${X(0.85)} ${Y(0)} V ${Y(1.45)} H ${X(11.4)}`]);
  box(10.7, 12.1, 0.1, 0.5);
  // Three short tanks, stacked to leave the maintenance ladder a clear way down beside them.
  const TANKS = [[1.95, 3.65], [3.9, 5.6], [5.85, 7.55]];
  for (const [h0, h1] of TANKS) { box(2.9, 6.4, h0, h1, 3.5); const h = (h0 + h1) / 2; ln(6.4, h, 11.0, h, "pipe"); }
  // Two pumps on the bottom tank's line, so a cycle this size doesn't take all day.
  for (const u of [7.4, 9.4]) {
    add(`<circle cx="${X(u)}" cy="${Y(6.7)}" r="${f(0.9 * S)}"/>`);
    box(u - 0.8, u + 0.8, 7.55, 7.8);
  }
  // Valve manifold, then controls and power.
  box(11.0, 11.8, 2.5, 7.8);
  for (const [h0, h1] of TANKS) add(`<circle cx="${X(11.4)}" cy="${Y((h0 + h1) / 2)}" r="${f(0.35 * S)}"/>`);
  box(12.1, 12.8, 4.4, 7.6);
  ln(12.2, 5.2, 12.7, 5.2, "flange"); ln(12.2, 5.8, 12.7, 5.8, "flange");
  // Cargo door ram, its rod straight up to the door's foot; the door drops into this space when open.
  box(13.1, 13.7, 3.4, 7.6);
  ln(13.4, 3.4, 13.4, 0.9, "pipe");
  box(13.0, 14, 0.1, 0.9);
  add(`</g>`);
}
// Maintenance ladders into each airlock plant from its ready room, through a locked hatch: pumps and rams need servicing.
{
  const ladder = (m, top, bot, hatchY) => {
    for (const e of [m - 0.25, m + 0.25]) add(`<line class="ladder" x1="${f(mx(e))}" y1="${f(top)}" x2="${f(mx(e))}" y2="${f(bot)}"/>`);
    for (let y = bot - 0.5 * S; y > top + 0.3 * S; y -= 0.5 * S) add(`<line class="rung" x1="${f(mx(m - 0.25))}" y1="${f(y)}" x2="${f(mx(m + 0.25))}" y2="${f(y)}"/>`);
    add(`<rect class="door door-locked hatch" x="${f(mx(m - 0.6))}" y="${f(hatchY - DW / 2)}" width="${f(1.2 * S)}" height="${DW}"/>`);
  };
  // Crew plants: up through the ready room ceiling and the service space to Deck 08's floor.
  for (const m of [LIFTS[0] + LW / 2 + 6.6, BAY[1] + 7.4]) ladder(m, dy(9) + FL, doorBot(9), ceil9);
  // Cargo plant: down through the cargo ready room floor, between the power line and the tanks.
  ladder(CR + 2.3, dy(11) + FL, dy(12) - FL, dy(11));
}
// The bay floor runs on under the cargo machinery to the lift.
add(`<line class="hold-floor" x1="${mx(CR)}" y1="${dy(12)}" x2="${bx}" y2="${dy(12)}"/>`);
// Bottom right, wall to lift: docking control on Deck 10 over the bay workshop on Deck 11.
export const GA = [BAY[1], LIFTS[1] - LW / 2];
export const gx = mx(GA[0]), gw = f((GA[1] - GA[0]) * S);
// Docking control: a near floor-to-ceiling window onto the bay and a long control desk facing it.
add(`<rect class="room" x="${gx}" y="${dy(10)}" width="${gw}" height="${f(DH)}"/>`);
{
  const X = (m) => f(mx(m)), Y = (h) => f(dy(11) - FL - h * S);
  const ln = (m0, h0, m1, h1, cls) => add(`<line class="${cls}" x1="${X(m0)}" y1="${Y(h0)}" x2="${X(m1)}" y2="${Y(h1)}"/>`);
  const box = (m0, m1, h0, h1, cls) => add(`<rect class="${cls}" x="${X(m0)}" y="${Y(h1)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"/>`);
  add(`<rect class="window" x="${f(gx - DW / 2)}" y="${Y(7.2)}" width="${DW}" height="${f(6.8 * S)}"/>`);
  add(`<g class="racks">`);
  // Control desk: a long console under the window, screens along its top.
  box(249.6, 256.0, 0, 0.9, "kit");
  ln(249.6, 0.9, 256.0, 0.9, "shelf");
  for (const m of [250.0, 251.6, 253.2, 254.8]) box(m, m + 1.1, 1.0, 1.7, "crate");
  // Traffic board on the back wall: the bay, the clamps and what's inbound.
  box(258.4, 262.4, 1.2, 2.6, "kit");
  box(259.0, 261.8, 1.5, 2.3, "crate");
  add(`</g>`);
}
tags.push(tag((GA[0] + GA[1]) / 2, 10, 10));
// Bay workshop at bay-floor level: pressurized, a window but no door to the bay; crews go out through Airlock B.
add(`<rect class="room" x="${gx}" y="${dy(11)}" width="${gw}" height="${f(DH)}"/>`);
{
  const X = (m) => f(mx(m)), Y = (h) => f(dy(12) - FL - h * S);
  const ln = (m0, h0, m1, h1, cls) => add(`<line class="${cls}" x1="${X(m0)}" y1="${Y(h0)}" x2="${X(m1)}" y2="${Y(h1)}"/>`);
  const box = (m0, m1, h0, h1, cls) => add(`<rect class="${cls}" x="${X(m0)}" y="${Y(h1)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"/>`);
  add(`<rect class="window" x="${f(gx - DW / 2)}" y="${Y(3.6)}" width="${DW}" height="${f(2.2 * S)}"/>`);
  add(`<g class="racks">`);
  // Desk and console under the window.
  ln(249.5, 0.9, 251.4, 0.9, "shelf");
  for (const m of [249.7, 251.2]) ln(m, 0, m, 0.9, "upright");
  box(249.8, 250.9, 0.9, 1.3, "crate");
  // Workbench with a vice, a spare clamp pad on it, and a tool board above.
  ln(254.6, 1.0, 258.0, 1.0, "shelf"); ln(254.6, 0.85, 258.0, 0.85, "chord");
  for (const m of [254.8, 257.8]) ln(m, 0, m, 0.85, "upright");
  box(255.0, 255.5, 1.0, 1.35, "crate");
  box(256.2, 257.6, 1.0, 1.25, "crate");
  box(254.9, 257.7, 1.6, 2.9, "kit");
  for (const m of [255.5, 256.3, 257.1]) ln(m, 1.9, m, 2.6, "brace");
  // Rolling tool chest: drawers, on castors.
  box(252.0, 253.3, 0.25, 1.25, "kit");
  for (const h of [0.5, 0.75, 1.0]) ln(252.0, h, 253.3, h, "brace");
  for (const m of [252.1, 252.95]) box(m, m + 0.25, 0, 0.25, "crate");
  // Welding gas, two bottles chained beside the bench.
  for (const m of [253.55, 254.0]) {
    add(`<rect class="kit" x="${X(m)}" y="${Y(1.5)}" width="${f(0.4 * S)}" height="${f(1.5 * S)}" rx="${f(0.2 * S)}"/>`);
    box(m + 0.12, m + 0.28, 1.5, 1.65, "crate");
  }
  // Spare parts crated by the cabinet, a cable reel on the wall above.
  box(258.4, 259.7, 0, 0.9, "crate"); box(258.6, 259.4, 0.9, 1.5, "crate");
  add(`<circle class="reel" cx="${X(259.1)}" cy="${Y(2.5)}" r="${f(0.5 * S)}"/><circle class="reel" cx="${X(259.1)}" cy="${Y(2.5)}" r="${f(0.15 * S)}"/>`);
  // A closed cabinet clear of the wall; bins sit on each shelf, not across it.
  box(260.6, 262.4, 0, 2.9, "kit");
  for (const h of [0.95, 1.9]) ln(260.6, h, 262.4, h, "shelf");
  for (const [m, h, w] of [[260.8, 0, 0.6], [261.6, 0, 0.5], [260.8, 0.95, 0.5], [261.5, 1.9, 0.6]]) box(m, m + w, h + 0.2, h + 0.6, "crate");
  add(`</g>`);
}
tags.push(tag((GA[0] + GA[1]) / 2, 11, 11));
// The hold's tag sits mid-storage, at the middle of its two storeys.
tags.push(tag((CG[0] + ST) / 2, 9, 8, DH / 2));
// You are here: Quell's current place, same pinging dot as the terminal's current location box.
// A pinging ring around Airlock B's tag, so the tag can stay centred.
export const hereX = f(mx(BAY[1] + AL / 2)), hereY = f((ceil9 + dy(10)) / 2);
export const hereMarker = `<g class="here"><circle class="here-ring" cx="${hereX}" cy="${hereY}" r="6"/></g>`;   // drawn last, above everything
add(`<text class="t-note t-ship" x="${f((sx + sw + wall) / 2)}" y="${f(door9Mid + 2.6)}" text-anchor="middle">UMBILICAL</text>`);
