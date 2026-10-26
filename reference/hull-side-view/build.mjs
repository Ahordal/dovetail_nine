// Builds hull-side-view.html: a to-scale side elevation of Dovetail-9's hull.
import { writeFileSync } from 'node:fs';

const S = 2.4;                 // drawing units per metre
const X0 = 120, Y0 = 150;      // hull top-left
const L = 400, DECK = 8;       // hull length, metres per deck
const DH = DECK * S;           // 19.2
const X1 = X0 + L * S;         // 1080
const Y1 = Y0 + 12 * DH;       // 310.4
const mx = (m) => +(X0 + m * S).toFixed(1);
const dy = (k) => +(Y0 + (k - 1) * DH).toFixed(1);
const f = (n) => +n.toFixed(1);
// Stepped profile: tiers on top, full length through the middle decks where the array attaches, keel modules below.
const SPAN = [null, [130, 270], [95, 305], [60, 340], [25, 375], [0, 400], [0, 400], [0, 400], [0, 400], [10, 390], [25, 375], [45, 355], [100, 300]];
const BAY = [151, 249];
const LIFTS = [135, 265], LW = 4;   // the only positions that reach all 12 decks, clear of engineering and the bay   // centred under the superstructure
const pts = [];
for (let k = 1; k <= 12; k++) pts.push([mx(SPAN[k][1]), dy(k)], [mx(SPAN[k][1]), dy(k + 1)]);
for (let k = 12; k >= 1; k--) pts.push([mx(SPAN[k][0]), dy(k + 1)], [mx(SPAN[k][0]), dy(k)]);
const outline = pts.map(([x, y]) => x + "," + y).join(" ");

let svg = [];
const add = (s) => svg.push(s);

// Anchor Core array stubs, both ends, on the hull's axis.
const midY = dy(6) + DH / 2;   // the Deck 06 spine: keel, conduits, array axis
const hullMid = (Y0 + Y1) / 2;
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
const up = (h) => f(Y0 - h * S);
const block = (m0, m1, h0, h1) => add(`<rect class="spire-block" x="${mx(m0)}" y="${up(h1)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"/>`);
// Tapering truss mast from base to top, cross-arms at the given heights, then a single whip.
const truss = (c, base, top, whip, w, arms) => {
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
const masts = [[113, -6, 9, 0], [150, 3, 13, 0], [159, 4.5, 26, 0], [168, 5, 22, 0], [187, 10, 33, 1], [203, 3, 20, 0], [229, 9, 40, 1], [233, 5, 24, 0], [243, 3.5, 29, 0], [254, 2.5, 12, 0], [288, -5, 12, 0]];
const beacons = [[180, 58], [224, 44]];
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
// The station power grid (gold) is drawn behind everything that follows: where it passes behind equipment, it's in the back wall.
const goldAt = svg.length, GOLD = [], EARLY = [], CRAWL = [], TERMS = [];   // TERMS: every SIGMA terminal, for the data network
const FIRE_PLANTS = [];   // fire suppression plants' outlets and tank inlets, for the red network
const LANDING_DOORS = [];   // [metres along, deck]: housing landings out to their stair and corridor
const gold = (pts) => GOLD.push(`<polyline class="grid-power" points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}"/>`);

// Numbered key tag for rooms too small to label; the legend names them.
// SIGMA's emblem: a white sigma in a broken ring, the ring's upper right arc in red.
const sigmaLogo = (cx, cy, r) => {
  const pt = (deg) => { const a = deg * Math.PI / 180; return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`; };
  const arc = (a0, a1) => `M ${pt(a0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(a1)}`;
  const w = r * 0.44, h = r * 0.5, t = r * 0.15;
  const sig = [[w, -h + t], [w, -h], [-w, -h], [w * 0.15, 0], [-w, h], [w, h], [w, h - t]].map(([x, y]) => `${f(cx + x)},${f(cy + y)}`).join(" ");
  return `<g class="sigma-logo"><circle class="sl-bg" cx="${f(cx)}" cy="${f(cy)}" r="${r}"/><path class="sl-ring" d="${arc(4, 283)}"/><path class="sl-red" d="${arc(-68, -4)}"/><polyline class="sl-sigma" points="${sig}"/></g>`;
};
// Tags are drawn last so they sit solid over the conduits and lift lines.
const tags = [];
// Optional vertical offset lets a tag share a narrow room with the you-are-here marker.
const tag = (m, k, n, off = 0) => `<g class="tag sm"><circle cx="${f(mx(m))}" cy="${f(dy(k) + DH / 2 + off)}" r="4.8"/><text x="${f(mx(m))}" y="${f(dy(k) + DH / 2 + off + 1.75)}" text-anchor="middle">${n}</text></g>`;
// Lift shafts top to bottom, outlined solid. A dot marks each deck served;
// doorways are drawn only where a room on this face meets the shaft.
// Deck 09's stops sit mid-room, under the 4.5 m ceiling of the ready rooms.
const RC = 4.5;
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
const tramY = f(dy(7) - 1.6);
// Faded wherever it runs through a room or section on Deck 06 (the lobbies, engineering, the lifts between).
const TRAM_FADE = [119.5, 280.5];
// The tram stops at the array-access airlocks at both ends.
add(`<line class="tram" x1="${mx(6.5)}" y1="${tramY}" x2="${mx(TRAM_FADE[0])}" y2="${tramY}"/>`);
add(`<line class="tram tram-behind" x1="${mx(TRAM_FADE[0])}" y1="${tramY}" x2="${mx(TRAM_FADE[1])}" y2="${tramY}"/>`);
add(`<line class="tram" x1="${mx(TRAM_FADE[1])}" y1="${tramY}" x2="${mx(393.5)}" y2="${tramY}"/>`);

// Engineering: the section around the Core Chamber, Decks 05 to 07.
// Engineering runs out to meet both lift shafts.
const EX = [LIFTS[0] + LW / 2, LIFTS[1] - LW / 2];   // 137 to 263 m
const ex0 = mx(EX[0]), ex1 = mx(EX[1]), ey0 = dy(5), ey1 = dy(8);
add(`<rect class="section" x="${ex0}" y="${ey0}" width="${f(ex1 - ex0)}" height="${f(ey1 - ey0)}"/>`);
// Conduits along the spine from the chamber out to both arrays.
const cr = f(11 * S), ccx = mx(200);
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
const SHAFT_DOORS = [163, 166, 234, 237].flatMap((m) => [5, 6, 7].map((k) => [m, k]));
// R&D and experiment control on Deck 05, just inside engineering, sharing a wall and the sealed lock.
const RD = [LIFTS[0] + LW / 2, 150];
for (const [m0, m1, n] of [[RD[0], RD[1], 2], [RD[1], 163, 3]]) {
  const w = (m1 - m0) * S;
  add(`<rect class="room" x="${f(mx(m0))}" y="${dy(5)}" width="${f(w)}" height="${f(DH)}"/>`);
  tags.push(tag((m0 + m1) / 2, 5, n));
}
// SIGMA's core: a 5 m column from Deck 04 up into command on Deck 01, on the chamber's axis.
const CW = 5, cx0 = 200 - CW / 2;
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
const FL = 0.5, DW = 1;
// Docking bay: Decks 08 to 11, centred under the superstructure.
const bx = mx(BAY[0]), bw = f((BAY[1] - BAY[0]) * S), by = dy(8), bh = f(4 * DH);
add(`<rect class="bay" x="${bx}" y="${by}" width="${bw}" height="${bh}"/>`);
add(`<text class="t-watermark" x="${f(bx + 8)}" y="${f(dy(12) - 6)}" textLength="${f(bw - 16)}" lengthAdjust="spacing">DOCKING BAY</text>`);

// The Mistral seen from astern (16.5 × 11.2 m): it flies in nose first, so its tail faces out of the bay.
const sw = f(16.5 * S), sh = f(11.2 * S);
// Centred on Deck 09 so the umbilical meets the middle of its hull.
const cx = f(bx + bw / 2), cy = f(dy(9) + DH / 2);
const sx = f(cx - sw / 2), sy = f(cy - sh / 2);
add(`<g class="ship"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="5"/><circle cx="${f(cx - 9)}" cy="${f(cy + 1)}" r="4.5"/><circle cx="${f(cx + 9)}" cy="${f(cy + 1)}" r="4.5"/></g>`);
// Gantry crane: a rail the length of the bay ceiling, the trolley parked over the cargo dock with its grab lowered.
const railY = dy(8), tx = mx(BAY[0] + 6);
add(`<g class="gantry"><rect x="${bx}" y="${railY}" width="${bw}" height="${f(0.9 * S)}"/>`);
add(`<rect x="${f(tx - 2.2 * S)}" y="${f(railY + 0.9 * S)}" width="${f(4.4 * S)}" height="${f(1.6 * S)}"/>`);
const grabY = dy(11) - 7 * S;
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
const r = f(12.5 * S);
add(`<text class="t-note t-ship" x="${f(cx - r - 6)}" y="${f(cy + 2.6)}" text-anchor="end">MISTRAL →</text>`);

// Boarding umbilical, and the airlock doors.
const floor9 = dy(10), wall = f(bx + 98 * S);
const doorBot = (k) => dy(k + 1) - FL;
// Airlocks and ready rooms get a 4.5 m ceiling; the rest of Deck 09 above them is service space.
// Airlocks stay small so each cycle pumps out less air; people only, cargo uses the cargo airlock below A.
const DOOR = 3, ceil9 = dy(10) - RC * S, door9Top = doorBot(9) - DOOR * S;
const door9Mid = (door9Top + doorBot(9)) / 2;
// Floor to just over the door, centred on it and on the ship. B's reaches the Mistral; A's is pulled back to its wall.
add(`<rect class="umbilical" x="${f(sx + sw)}" y="${f(door9Mid - 1.7 * S)}" width="${f(wall - sx - sw)}" height="${f(3.4 * S)}"/>`);
add(`<rect class="umbilical" x="${bx}" y="${f(door9Mid - 1.7 * S)}" width="${f(2.5 * S)}" height="${f(3.4 * S)}"/>`);
// Airlock rooms, one in each end wall of the bay: A on the left, B on the right, joined to the Mistral.
const AL = 6.5;
add(`<rect class="room" x="${wall}" y="${f(ceil9)}" width="${f(AL * S)}" height="${f(RC * S)}"/>`);
add(`<rect class="room" x="${f(bx - AL * S)}" y="${f(ceil9)}" width="${f(AL * S)}" height="${f(RC * S)}"/>`);
// Door colours give each door's state as Quell finds it: B is in use with the Mistral docked, A opens on vacuum.
for (const x of [wall, bx]) add(`<rect class="airlock ${x === wall ? "door-open" : "door-locked"}" x="${f(x - DW / 2)}" y="${f(door9Top)}" width="${DW}" height="${f(DOOR * S)}"/>`);
// Room tags centred in the low rooms.
const tag9 = (m, n) => tag(m, 9, n, (ceil9 + dy(10)) / 2 - dy(9) - DH / 2);
tags.push(tag9(BAY[0] - AL / 2, "A"), tag9(BAY[1] + AL / 2, "B"));
// Airlock machinery on Deck 08 above each airlock and ready room: air recovery, pumps, valves, door ram. Locked hatch from the ready room.
// Big pipes are hollow: every outer edge first, then every fill, so tees and bends merge cleanly.
const PD = 0.5;
const hollow = (runs) => {
  for (const d of runs) add(`<path class="pipe-o" d="${d}"/>`);
  for (const d of runs) add(`<path class="pipe-i" d="${d}"/>`);
};
// Floor-to-ceiling height of Deck 09's low rooms, in metres below Deck 08's top.
const H9 = (ceil9 - dy(8)) / S;
const plant = (x0, flip, link) => {
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
const CG = [105, BAY[0]], cgTop = dy(9), cgBot = dy(11);
const ST = LIFTS[0] - LW / 2;   // storage meets the lift shaft
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
const CA = BAY[0] - 8;
add(`<rect class="room" x="${mx(CA)}" y="${dy(10)}" width="${f(8 * S)}" height="${f(DH)}"/>`);
tags.push(tag(CA + 4, 10, "C"));
// Cargo ready room: the hallway's end, from the lift to the cargo airlock. Suits for working the dock.
const CR = LIFTS[0] + LW / 2;
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
const GA = [BAY[1], LIFTS[1] - LW / 2];
const gx = mx(GA[0]), gw = f((GA[1] - GA[0]) * S);
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
const hereX = f(mx(BAY[1] + AL / 2)), hereY = f((ceil9 + dy(10)) / 2);
const hereMarker = `<g class="here"><circle class="here-ring" cx="${hereX}" cy="${hereY}" r="6"/></g>`;   // drawn last, above everything
add(`<text class="t-note t-ship" x="${f((sx + sw + wall) / 2)}" y="${f(door9Mid + 2.6)}" text-anchor="middle">UMBILICAL</text>`);

// Deck 12, under the bay: all fuel and backup power. Water and waste live a deck up, either side of the bay.
{
  const X = (m) => f(mx(m)), Y = (h) => f(dy(13) - FL - h * S), Yb = (h) => f(dy(12) - FL - h * S);
  const room = (m0, m1) => add(`<rect class="room" x="${X(m0)}" y="${dy(12)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  const box = (m0, m1, h0, h1, rx = 0) => add(`<rect x="${X(m0)}" y="${Y(h1)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${rx}"` : ""}/>`);
  const ln = (m0, h0, m1, h1, cls) => add(`<line class="${cls}" x1="${X(m0)}" y1="${Y(h0)}" x2="${X(m1)}" y2="${Y(h1)}"/>`);
  const [l0, l1] = [LIFTS[0] - LW / 2, LIFTS[0] + LW / 2], [r0, r1] = [LIFTS[1] - LW / 2, LIFTS[1] + LW / 2];
  const FU = [178, 222], HD = 3.5;   // fuel cell section span, header height
  for (const [m0, m1] of [[100, l0], [l1, FU[0]], FU, [FU[1], r0], [r1, 300]]) room(m0, m1);
  add(`<g class="plant">`);
  // One fuel header from the transfer pumps through both tank halls, hidden behind the left lift.
  const tanks = [139, 152, 165, 224.5, 237.5, 250.5];
  // Laid out mirror-symmetric about 200 m, under the middle of the Mistral.
  const GEN = [179.5, 214.5], FT = [189.25, 200.5], RS = [187.4, 212.6];
  const runs = [`M ${X(108.6)} ${Y(HD)} H ${X(l0)}`, `M ${X(l1)} ${Y(HD)} H ${X(r0)}`];
  for (const m of [...tanks, ...FT]) runs.push(`M ${X(m + 5.25)} ${Y(HD)} V ${Y(3.0)}`);
  for (const m of [108.6, 110.8, 113.0, 115.2]) runs.push(`M ${X(m)} ${Y(HD)} V ${Y(3.0)}`);
  for (const [m, top] of [[119, 2.0], [124.75, 2.6]]) runs.push(`M ${X(m)} ${Y(HD)} V ${Y(top)}`);
  for (const m of GEN) runs.push(`M ${X(m + 3)} ${Y(HD)} V ${Y(2.6)}`);
  // Two risers climb through the bay floor to the hose stations.
  for (const m of RS) runs.push(`M ${X(m)} ${Y(HD)} V ${Yb(0)}`);
  hollow(runs);
  for (const h of [HD - PD / 2, HD + PD / 2]) add(`<line class="pipe hidden" x1="${X(l0)}" y1="${Y(h)}" x2="${X(l1)}" y2="${Y(h)}"/>`);
  // Fuel transfer: filter columns, a transfer pump, the manifold, controls.
  for (const m of [108.6, 110.8, 113.0, 115.2]) box(m - 0.6, m + 0.6, 0, 3.0, f(0.6 * S));
  add(`<circle cx="${X(119)}" cy="${Y(1.0)}" r="${f(1.0 * S)}"/>`); box(117.7, 120.3, 0, 0.1);
  box(122, 127.5, 0, 2.6);
  box(129.5, 131.5, 0, 2.8);
  // Fuel tank halls, and the fuel cells' hydrogen and oxygen tanks, all on saddles.
  for (const m of [...tanks, ...FT]) {
    box(m, m + 10.5, 0.6, 3.0, f(1.2 * S));
    for (const o of [1.5, 8.2]) box(m + o, m + o + 0.8, 0, 0.6);
  }
  // Backup fuel cells: station power when the X9's output can't reach it; hydrogen and oxygen in, only water out.
  for (const [m, out] of [[GEN[0], 1.4], [GEN[1], 4.6]]) {
    box(m, m + 6, 0, 2.6, 2);
    add(`<circle cx="${X(m + out)}" cy="${Y(1.3)}" r="${f(0.8 * S)}"/>`);
    const c = out < 3 ? m + 3 : m + 0.6;
    box(c, c + 2.4, 0.5, 2.1);
  }
  // Fuel hose stations on the bay floor, either side of the floor clamps: a cabinet and its hose reel.
  for (const m of RS) {
    add(`<rect x="${X(m - 1.2)}" y="${Yb(1.6)}" width="${f(2.4 * S)}" height="${f(1.6 * S)}"/>`);
    add(`<circle cx="${X(m)}" cy="${Yb(0.85)}" r="${f(0.5 * S)}"/><circle cx="${X(m)}" cy="${Yb(0.85)}" r="${f(0.15 * S)}"/>`);
  }
  // Switchgear and batteries: the fuel cells' electrical side, beyond the right lift.
  for (const m of [268.5, 277.2, 280.7]) {
    box(m, m + 3, 0, 2.4);
    for (const h of [0.8, 1.6]) ln(m, h, m + 3, h, "flange");
  }
  for (const m of [286, 288.4, 290.8]) { box(m, m + 2.2, 0, 2.8); box(m + 0.5, m + 1.7, 1.9, 2.4); }
  add(`</g>`);
  // Fuel cell power cables, in a tray near the ceiling, to Bus B's riser.
  const CT = 4.6, gc = [GEN[0] + 4.2, GEN[1] + 1.8], sw = 287.1;
  const pl = (x1, y1, x2, y2, cls = "power") => add(`<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
  // The tray ends at Bus B's riser beside the right lift; the switchgear and batteries hang off the riser (grid block below).
  pl(X(gc[0]), Y(CT), X(400 - 138.8), Y(CT));
  pl(X(gc[0]), Y(CT), X(gc[0]), Y(2.1)); pl(X(gc[1]), Y(CT), X(gc[1]), Y(2.1));
  // Maintenance reaches the fuel cell section through a door from each tank hall.
  for (const m of FU) add(`<rect class="door door-open" x="${f(mx(m) - DW / 2)}" y="${Y(DOOR)}" width="${DW}" height="${f(DOOR * S)}"/>`);
  tags.push(tag((100 + l0) / 2, 12, 12), tag((l1 + FU[0]) / 2, 12, 13), tag((FU[1] + r0) / 2, 12, 13), tag(200, 12, 14), tag((r1 + 300) / 2, 12, 15));
}
// Deck 11 beyond the lifts: the water system. Treatment and tanks on the left, the waste plant on the right.
// Drains fall down the lift cores to here, the lowest living-side deck; potable water is pumped back up the left core.
{
  const X = (m) => f(mx(m)), Y = (h) => f(dy(12) - FL - h * S);
  const room = (m0, m1) => add(`<rect class="room" x="${X(m0)}" y="${dy(11)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  const box = (m0, m1, h0, h1, rx = 0) => add(`<rect x="${X(m0)}" y="${Y(h1)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${rx}"` : ""}/>`);
  const wl = (pts, cls = "water") => add(`<polyline class="${cls}" points="${pts.map(([m, h]) => `${X(m)},${Y(h)}`).join(" ")}"/>`);
  // An upright tank with a domed top, 6 m across and 4.4 m tall.
  const tank = (m0, cls) => add(`<path class="${cls}" d="M ${X(m0)} ${Y(0)} V ${Y(3.6)} Q ${X(m0)} ${Y(4.4)} ${X(m0 + 3)} ${Y(4.4)} Q ${X(m0 + 6)} ${Y(4.4)} ${X(m0 + 6)} ${Y(3.6)} V ${Y(0)} Z"/>`);
  const [l0, r1] = [LIFTS[0] - LW / 2, LIFTS[1] + LW / 2], WP = [45, 80], WT = [80, l0], WS = [r1, 305];
  for (const [m0, m1] of [WP, WT, WS]) room(m0, m1);
  // Packed toward the plant, leaving the corner by the lift for the access trunk.
  const POT = [81.5, 89.3, 97.1, 104.9], WW = [113.6, 121.2], PUMP = 112.0;
  // Pipes first, so tanks and equipment sit over their ends. Every water line is a single line; where two must cross,
  // the one on top hops over the other (no connection).
  const DX = 133.6, SX = 136.4, DBX = LIFTS[1] + LW / 2 - 0.6, RX = LIFTS[1] - LW / 2 + 0.6;   // risers inside the lift cores
  const y4 = f(dy(4) + 1.5 * S), HOP = 1.0;
  // A horizontal run that hops over the given x positions.
  const run = (x0, y, x1, hops) => {
    const dir = x1 > x0 ? 1 : -1; let d = "";
    for (const hx of hops.slice().sort((a, b) => dir * (a - b))) d += ` H ${f(hx - dir * HOP)} A ${HOP} ${HOP} 0 0 ${dir > 0 ? 1 : 0} ${f(hx + dir * HOP)} ${y}`;
    return d + ` H ${f(x1)}`;
  };
  // Feed: drawn up from the first wastewater tank, overhead, and down into the strainer.
  wl([[WW[0] + 1.5, 4.33], [WW[0] + 1.5, 5.1], [57.2, 5.1], [57.2, 1.6]]);
  wl([[WW[0] + 6, 1.0], [WW[1], 1.0]]);
  // Treatment train, left to right, then straight into the first potable tank; the potable tanks share a level line.
  wl([[57.2, 1.0], [81.5, 1.0]]);
  for (let i = 0; i < 3; i++) wl([[POT[i] + 6, 1.0], [POT[i + 1], 1.0]]);
  // Out of the last potable tank to the supply pump, then low behind the wastewater tanks and up the left core.
  wl([[POT[3] + 6, 1.0], [PUMP - 0.8, 1.0]]);
  add(`<path class="water" d="M ${X(PUMP + 0.75)} ${Y(0.6)} H ${X(SX)} V ${dy(1)}"/>`);
  // Grey water and condensate come down the left core and fill the wastewater tanks from the top.
  add(`<path class="water" d="M ${X(DX)} ${dy(1)} V ${Y(5.0)} H ${X(WW[0] + 3)} V ${Y(4.4)}"/>`);
  wl([[WW[1] + 3, 5.0], [WW[1] + 3, 4.4]]);
  add(`<g class="plant">`);
  // Treatment: strainer, pump, filter beds, catalytic reactor, reverse osmosis rack, UV.
  box(56.5, 58, 0, 1.6);
  add(`<circle cx="${X(59.6)}" cy="${Y(1.0)}" r="${f(0.8 * S)}"/>`); box(58.7, 60.5, 0, 0.1);
  for (const m of [61.4, 63, 64.6]) box(m, m + 1.2, 0, 2.6, f(0.6 * S));
  box(67, 71, 0.5, 1.5, f(0.5 * S)); box(67.6, 68.2, 0, 0.5); box(69.8, 70.4, 0, 0.5);
  box(72.5, 77.5, 0.3, 2.3);
  for (const h of [0.7, 1.3, 1.9]) add(`<rect x="${X(72.8)}" y="${Y(h + 0.2)}" width="${f(4.4 * S)}" height="${f(0.4 * S)}" rx="${f(0.2 * S)}"/>`);
  box(78.3, 79.3, 0.3, 2.2);
  // The supply pump between the potable and wastewater tanks.
  add(`<circle cx="${X(PUMP)}" cy="${Y(0.8)}" r="${f(0.8 * S)}"/>`); box(PUMP - 0.85, PUMP + 0.85, 0, 0.05);
  add(`</g>`);
  for (const m of POT) tank(m, "tank-potable");
  for (const m of WW) tank(m, "tank-waste");
  // Waste plant: toilets come down the right core into a collection tank; a distiller recovers the urine's water,
  // a brine processor takes the rest, solids go to a digester and dryer. Recovered water climbs the right core.
  // Set back from the lift, leaving its corner for the access trunk.
  const BT = 271.5, DG = 289, WPP = 301;
  add(`<path class="water" d="M ${X(DBX)} ${dy(1)} V ${Y(5.0)} H ${X(BT + 3)} V ${Y(4.4)}"/>`);
  wl([[BT + 6, 1.0], [WPP, 1.0]]);
  // Recovered water: up from the pump, over the toilet drain, up the right core, across in the Deck 04 service band,
  // over the left core's supply riser, and into the grey-water drain.
  add(`<path class="water" d="M ${X(WPP)} ${Y(1.8)} V ${Y(5.6)}${run(+X(WPP), Y(5.6), +X(RX), [+X(DBX)])} V ${y4}${run(+X(RX), y4, +X(DX), [+X(SX), +X(142.3)])}"/>`);   // 142.3: hops Deck 04's vacuum toilet riser
  add(`<g class="plant">`);
  add(`<rect x="${X(BT + 7.5)}" y="${Y(2.0)}" width="${f(4.5 * S)}" height="${f(1.6 * S)}" rx="${f(0.8 * S)}"/>`); box(BT + 8, BT + 8.6, 0, 0.4); box(BT + 11.4, BT + 12, 0, 0.4);
  box(BT + 13.5, BT + 16.3, 0, 2.4);
  box(DG + 7, DG + 10.5, 0, 2.2);
  add(`<circle cx="${X(WPP)}" cy="${Y(1.0)}" r="${f(0.8 * S)}"/>`); box(WPP - 0.9, WPP + 0.9, 0, 0.05);
  add(`</g>`);
  tank(BT, "tank-waste");
  tank(DG, "tank-waste");
  tags.push(tag((WP[0] + WP[1]) / 2 + 6, 11, 16), tag((WT[0] + WT[1]) / 2, 11, 17), tag((WS[0] + WS[1]) / 2, 11, 18));
}
// Engineering plant around the X9 (see lore x9-power-system): shells, penetrations, auxiliaries, heat and power halls.
{
  const X = (m) => f(mx(m)), cy = midY;
  const Yk = (k, h) => f(dy(k + 1) - FL - h * S);   // h metres above deck k's floor
  const room = (m0, m1, k) => add(`<rect class="room" x="${X(m0)}" y="${dy(k)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  const box = (m0, m1, k, h0, h1, rx = 0, cls = "") => add(`<rect${cls ? ` class="${cls}"` : ""} x="${X(m0)}" y="${Yk(k, h1)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${rx}"` : ""}/>`);
  const ln = (m0, k0, h0, m1, k1, h1, cls) => add(`<line class="${cls}" x1="${X(m0)}" y1="${Yk(k0, h0)}" x2="${X(m1)}" y2="${Yk(k1, h1)}"/>`);
  // The dome's own straight walls, Deck 05 to Deck 07.
  for (const m of [187, 213]) add(`<line class="room-wall" x1="${X(m)}" y1="${dy(5)}" x2="${X(m)}" y2="${dy(8)}"/>`);
  // Inside the dome: Shell 2 and Shell 1 inside the outer structural shell, the trap housing at the centre.
  add(`<circle class="shell" cx="${ccx}" cy="${f(cy)}" r="${f(8.5 * S)}"/><circle class="shell" cx="${ccx}" cy="${f(cy)}" r="${f(6.5 * S)}"/>`);
  add(`<rect class="trap" x="${f(ccx - 2.25 * S)}" y="${f(cy - 1.15 * S)}" width="${f(4.5 * S)}" height="${f(2.3 * S)}" rx="1.5"/>`);
  add(`<circle class="singularity" cx="${ccx}" cy="${f(cy)}" r="1.6"/>`);
  // Power leaves Shell 1 by dog-leg penetrations, no straight line out, then runs on as the conduits.
  for (const d of [-1, 1]) {
    const x = (m) => f(ccx + d * m * S);
    add(`<polyline class="busbar" points="${x(6.5)},${f(cy)} ${x(8)},${f(cy)} ${x(8)},${f(cy - 1.6 * S)} ${x(9.5)},${f(cy - 1.6 * S)} ${x(9.5)},${f(cy)} ${x(11)},${f(cy)}"/>`);
    // Primary heat exchanger in the outer band: radioactive coolant stays in the dome, heat crosses to a clean loop.
    add(`<rect class="trap" x="${f(ccx + d * 9.8 * S - 0.6 * S)}" y="${f(cy + 5.2 * S)}" width="${f(1.2 * S)}" height="${f(2.4 * S)}"/>`);
  }
  // Deck 05: observation gallery, cryogenic plant, trap auxiliaries.
  // Rooms against the dome all stop on its two straight walls, at 187 m and 213 m, clear of the shells.
  const CW0 = 187, CW1 = 213;
  const GAL = [166, CW0], CRY = [CW1, 234], AUX = [237, LIFTS[1] - LW / 2];
  for (const [m0, m1] of [GAL, CRY, AUX]) room(m0, m1, 5);
  add(`<rect class="window" x="${f(mx(GAL[1]) - DW / 2)}" y="${Yk(5, 3.6)}" width="${DW}" height="${f(2.6 * S)}"/>`);
  add(`<g class="racks">`);
  box(168, 171, 5, 0, 1.1, 0, "kit"); box(168.4, 170.6, 5, 1.1, 1.8, 0, "crate");   // restricted engineering terminal
  for (const m of [174, 178, 182]) { ln(m, 5, 0.45, m + 2.4, 5, 0.45, "shelf"); for (const e of [m + 0.2, m + 2.2]) ln(e, 5, 0, e, 5, 0.45, "upright"); }   // benches facing the viewport
  add(`</g>`);
  add(`<g class="plant">`);
  // Cryogenic plant: cold box and compressors; its lines run into the dome to keep the coils at about -250 C.
  box(222, 226.5, 5, 0, 3.0, 2); box(227.5, 230.5, 5, 0, 2.4);
  for (const m of [214, 218]) { add(`<circle cx="${X(m)}" cy="${Yk(5, 1.0)}" r="${f(1.0 * S)}"/>`); box(m - 1.3, m + 1.3, 5, 0, 0.1); }
  // Trap auxiliaries: charge injector supplies, position control, the dampening coils' power.
  for (const m of [239, 242, 245, 248, 251]) { box(m, m + 2.2, 5, 0, 2.8); box(m + 0.5, m + 1.7, 5, 1.9, 2.4); }
  box(254.5, 261.5, 5, 0, 1.0);
  hollow([`M ${X(224.25)} ${Yk(5, 3.0)} V ${Yk(5, 3.6)} H ${f(ccx + Math.sqrt(cr * cr - (+Yk(5, 3.6) - cy) ** 2))}`]);
  add(`</g>`);
  // Frost on the cryogenic line.
  for (const m of [213.6, 215.6, 217.6, 219.6]) add(`<path class="frost" d="M ${X(m)} ${f(+Yk(5, 3.6) - 2)} l 1.2 1.2 m 0 -1.2 l -1.2 1.2"/>`);
  // Charge-injector and control cables from the auxiliaries into the dome.
  add(`<line class="power" x1="${X(237)}" y1="${Yk(5, 4.4)}" x2="${f(ccx + Math.sqrt(cr * cr - (+Yk(5, 4.4) - cy) ** 2))}" y2="${Yk(5, 4.4)}"/>`);
  // Deck 06: penetration vaults either side of the chamber, where the conduits leave the dome; dampening coil drivers.
  const VL = [166, CW0], VR = [CW1, 234];
  for (const [m0, m1] of [VL, VR]) room(m0, m1, 6);
  add(`<g class="plant">`);
  for (const [m0, m1] of [VL, VR]) for (let m = m0 + 2; m < m1 - 2.5; m += 4.5) box(m, m + 2.4, 6, 3.6, 5.4);
  add(`</g>`);
  // Valdez harmonic emitters along the conduits, the whole length of the spine.
  for (let m = 8; m < 400; m += 16) if (m < 165 || m > 235) add(`<rect class="emitter" x="${f(mx(m) - 1.2)}" y="${f(cy - 2.9)}" width="2.4" height="2.2"/>`);
  // Deck 07: the main Harvest Ring turbine hall and the isolated backup generator set, each with a catwalk and ladder.
  const HL = [LIFTS[0] + LW / 2, 163], HR = [237, LIFTS[1] - LW / 2];
  for (const [m0, m1] of [HL, HR]) room(m0, m1, 7);
  add(`<g class="plant">`);
  const runs = [];
  for (const [[m0, m1], flip] of [[HL, false], [HR, true]]) {
    const M = (u) => flip ? m1 - u : m0 + u;
    const a = (u0, u1) => [Math.min(M(u0), M(u1)), Math.max(M(u0), M(u1))];
    // Turbine and generator on the floor; the catwalk above reaches the valve gallery.
    const [t0, t1] = a(3, 14); box(t0, t1, 7, 0.3, 2.6, f(1.0 * S));
    const [g0, g1] = a(15, 20); box(g0, g1, 7, 0, 2.4);
    const [c0, c1] = a(1, 24); box(c0, c1, 7, 3.4, 3.6);
    // Ladder from the floor up to the catwalk.
    const lx = M(23);
    for (const e of [lx - 0.25, lx + 0.25]) add(`<line class="ladder" x1="${X(e)}" y1="${Yk(7, 3.4)}" x2="${X(e)}" y2="${Yk(7, 0)}"/>`);
    for (let h = 0.4; h < 3.3; h += 0.5) add(`<line class="rung" x1="${X(lx - 0.25)}" y1="${Yk(7, h)}" x2="${X(lx + 0.25)}" y2="${Yk(7, h)}"/>`);
    runs.push(`M ${X(M(8.5))} ${Yk(7, 2.6)} V ${Yk(7, 4.6)}`);
  }
  // Clean secondary loop from the dome's heat exchangers to both halls, behind the capacitor halls on the way.
  runs.push(`M ${X(HL[0] + 8.5)} ${Yk(7, 4.6)} H ${X(HL[1])}`, `M ${X(HR[0])} ${Yk(7, 4.6)} H ${X(HR[1] - 8.5)}`);
  hollow(runs);
  // Where a level line meets the dome's outer circle.
  const domeEdge = (y, d) => f(ccx + d * Math.sqrt(cr * cr - (y - cy) ** 2));
  for (const h of [4.6 - PD / 2, 4.6 + PD / 2]) {
    const y = +Yk(7, h);
    add(`<line class="pipe hidden" x1="${X(HL[1])}" y1="${y}" x2="${domeEdge(y, -1)}" y2="${y}"/><line class="pipe hidden" x1="${domeEdge(y, 1)}" y1="${y}" x2="${X(HR[0])}" y2="${y}"/>`);
  }
  add(`</g>`);
  // Radiator loop: from each hall up to the spine, out along the conduits and onto the trusses.
  for (const [x0, x1, up] of [[mx(HL[0] + 2), 24, mx(HL[0] + 2)], [mx(HR[1] - 2), X1 + 96, mx(HR[1] - 2)]]) {
    add(`<polyline class="radline" points="${f(up)},${Yk(7, 3.6)} ${f(up)},${f(cy + 2.2)} ${f(x1)},${f(cy + 2.2)}"/>`);
  }
  // Radiation hot spots left by the accident, worst near the dome and along the conduit duct.
  for (const m of [150, 172, 186, 214, 228, 250, 115, 285, 70, 330]) {
    const x = mx(m), y = cy - 6.4;
    add(`<g class="hot"><circle cx="${f(x)}" cy="${f(y)}" r="2.1"/><circle class="hot-hub" cx="${f(x)}" cy="${f(y)}" r="0.55"/></g>`);
  }
  tags.push(tag((GAL[0] + GAL[1]) / 2, 5, 19), tag((CRY[0] + CRY[1]) / 2, 5, 20), tag((AUX[0] + AUX[1]) / 2, 5, 21));
  tags.push(tag((VL[0] + VL[1]) / 2, 6, 24, -4.5), tag((VR[0] + VR[1]) / 2, 6, 24, -4.5));
  tags.push(tag((HL[0] + HL[1]) / 2, 7, 22), tag((HR[0] + HR[1]) / 2, 7, 23));
}
// The trusses: conduits and the radiator loop run out to emitter housings and radiator panels.
for (const [a, b] of [[24, X0], [X1, X1 + 96]]) {
  add(`<line class="conduit" x1="${a}" y1="${f(midY)}" x2="${b}" y2="${f(midY)}"/>`);
  for (let x = a + 6; x < b - 6; x += 24) {
    if (Math.abs(x - (a < X0 ? 72 : X1 + 48)) < 10) continue;
    add(`<rect class="radiator" x="${f(x)}" y="${f(midY - 17)}" width="12" height="6"/><rect class="radiator" x="${f(x)}" y="${f(midY + 11)}" width="12" height="6"/>`);
    // Each panel stands on a strut from the truss chord.
    add(`<line class="radiator" x1="${f(x + 6)}" y1="${f(midY - 11)}" x2="${f(x + 6)}" y2="${f(midY - 8)}"/><line class="radiator" x1="${f(x + 6)}" y1="${f(midY + 11)}" x2="${f(x + 6)}" y2="${f(midY + 8)}"/>`);
    add(`<rect class="emitter" x="${f(x + 4.8)}" y="${f(midY - 1.6)}" width="2.4" height="3.2"/>`);
  }
}
// The station grid: Bus A from the main generator, Bus B from the backup set, risers beside both lift cores,
// feeders along each deck's service band. Gold, behind everything (see GOLD above).
{
  const X = (m) => mx(m), FH = (k) => dy(k) + 1.4 * S;    // a feeder's height: in deck k's service band
  const Yk = (k, h) => dy(k + 1) - FL - h * S;            // h metres above deck k's floor
  const RA = 138.8, RB = 400 - 138.8;
  // Risers, Deck 01 to Deck 12.
  gold([[X(RA), FH(1)], [X(RA), FH(12)]]);
  gold([[X(RB), FH(1)], [X(RB), Yk(12, 4.6)]]);   // down to the fuel cells' cable tray
  // Switch rooms on Deck 06, above their generator halls: switchboards, a generator breaker, and the tie to the riser.
  const SA = [LIFTS[0] + LW / 2, 163], SB = [237, LIFTS[1] - LW / 2];
  for (const [m0, m1] of [SA, SB]) add(`<rect class="room" x="${f(X(m0))}" y="${dy(6)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  add(`<g class="plant">`);
  for (const [cab, gen, r, d] of [[[141, 143.6, 146.2, 148.8, 151.4], 154.5, RA, 1], [[256.8, 254.2, 251.6, 249, 246.4], 245.5, RB, -1]]) {
    for (const m of cab) { const a = d > 0 ? m : m - 2.2; add(`<rect x="${f(X(a))}" y="${f(Yk(6, 2.8))}" width="${f(2.2 * S)}" height="${f(2.8 * S)}"/><rect x="${f(X(a + 0.5))}" y="${f(Yk(6, 2.4))}" width="${f(1.2 * S)}" height="${f(0.5 * S)}"/>`); }
    add(`<rect x="${f(X(gen - 1.1))}" y="${f(Yk(6, 3.2))}" width="${f(2.2 * S)}" height="${f(3.2 * S)}"/>`);
    // Generator up through the floor into its breaker; switchboards out to the riser.
    gold([[X(gen), Yk(7, 2.4)], [X(gen), Yk(6, 0)]]);
    gold([[X(cab[0] - (d > 0 ? 0 : 0)), Yk(6, 2.0)], [X(r), Yk(6, 2.0)]]);
  }
  add(`</g>`);
  // SIGMA's core takes both buses on Deck 03; its switchboard is also the tie between them.
  gold([[X(RA), FH(3)], [X(197.5), FH(3)]]);
  gold([[X(RB), FH(3)], [X(202.5), FH(3)]]);
  // Deck 05, Bus B: the trap auxiliaries and the cryogenic plant.
  gold([[X(RB), FH(5)], [X(229), FH(5)], [X(229), Yk(5, 2.4)]]);
  gold([[X(240.1), FH(5)], [X(240.1), Yk(5, 2.8)]]);
  // Deck 07: capacitor racks in both halls, bank A charged from Bus A, bank B from Bus B.
  add(`<g class="plant">`);
  for (const m of [167.5, 170, 172.5, 180.5, 183, 185.5]) for (const mm of [m, 400 - m - 2]) add(`<rect x="${f(X(mm))}" y="${f(Yk(7, 3.0))}" width="${f(2 * S)}" height="${f(3 * S)}"/><line class="flange" x1="${f(X(mm + 0.3))}" y1="${f(Yk(7, 2.0))}" x2="${f(X(mm + 1.7))}" y2="${f(Yk(7, 2.0))}"/>`);
  add(`</g>`);
  // These feeders hop over each generator's link up to its switch room: crossing, not connected.
  for (const [r, gen, rack] of [[RA, 154.5, 171], [RB, 245.5, 229]]) {
    const dir = rack > r ? 1 : -1, y = f(FH(7)), h = 1.0;
    GOLD.push(`<path class="grid-power" d="M ${f(X(r))} ${y} H ${f(X(gen) - dir * h)} A ${h} ${h} 0 0 ${dir > 0 ? 1 : 0} ${f(X(gen) + dir * h)} ${y} H ${f(X(rack))} V ${f(Yk(7, 3.0))}"/>`);
  }
  // Deck 08: each airlock's machinery from its own side, into the cycle controls.
  gold([[X(RA), dy(8) + 0.5 * S], [X(147.95), dy(8) + 0.5 * S], [X(147.95), dy(8) + 4.4 * S]]);
  gold([[X(RB), dy(8) + 0.5 * S], [X(252.05), dy(8) + 0.5 * S], [X(252.05), dy(8) + 4.4 * S]]);
  // Deck 10 band, Bus A: down into the water supply pump and the reverse-osmosis rack below.
  gold([[X(RA), FH(10)], [X(75), FH(10)], [X(75), Yk(11, 2.3)]]);
  gold([[X(112), FH(10)], [X(112), Yk(11, 1.6)]]);
  // Deck 10, Bus B: docking control's traffic board.
  gold([[X(RB), FH(10)], [X(260), FH(10)], [X(260), Yk(10, 2.6)]]);
  // Deck 11: cargo airlock machinery (A); the workshop and the waste plant (B).
  gold([[X(RA), FH(11)], [X(149.1), FH(11)]]);
  gold([[X(RB), FH(11)], [X(256.3), FH(11)], [X(256.3), Yk(11, 2.9)]]);
  gold([[X(RB), FH(11)], [X(286.4), FH(11)], [X(286.4), Yk(11, 2.4)]]);
  // Deck 12: fuel transfer (A); the fuel cells' switchgear feeds Bus B as the emergency supply.
  gold([[X(RA), FH(12)], [X(130.5), FH(12)], [X(130.5), Yk(12, 2.8)]]);
  gold([[X(291.9), Yk(12, 2.8)], [X(291.9), FH(12)], [X(RB), FH(12)]]);
  tags.push(tag((SA[0] + SA[1]) / 2, 6, 25, -4.5), tag((SB[0] + SB[1]) / 2, 6, 26, -4.5));
}
// The rest of the station: command, living, science, life support, security, stores and the escape pods.
{
  const X = (m) => mx(m), Yk = (k, h) => dy(k + 1) - FL - h * S, FH = (k) => dy(k) + 1.4 * S;
  const RA = 138.8, RB = 400 - 138.8, SX = 136.4, DX = 133.6, DBX = LIFTS[1] + LW / 2 - 0.6, RX = LIFTS[1] - LW / 2 + 0.6;
  const room = (k, m0, m1, k1 = k) => add(`<rect class="room" x="${f(X(m0))}" y="${dy(k)}" width="${f((m1 - m0) * S)}" height="${f(dy(k1 + 1) - dy(k))}"/>`);
  const box = (k, m0, m1, h0, h1, cls = "", rx = 0) => add(`<rect${cls ? ` class="${cls}"` : ""} x="${f(X(m0))}" y="${f(Yk(k, h1))}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${f(rx)}"` : ""}/>`);
  const circ = (k, m, h, r) => add(`<circle cx="${f(X(m))}" cy="${f(Yk(k, h))}" r="${f(r * S)}"/>`);
  const hl = (k, m0, m1, h) => add(`<line class="flange" x1="${f(X(m0))}" y1="${f(Yk(k, h))}" x2="${f(X(m1))}" y2="${f(Yk(k, h))}"/>`);
  const term = (k, m) => { TERMS.push([k, m]); box(k, m - 0.08, m + 0.08, 0, 1.1, "term"); box(k, m - 0.45, m + 0.45, 1.1, 1.7, "term-screen"); };
  const run = (x0, y, x1, hops, cls) => {   // a horizontal run that hops over the given x positions
    const dir = x1 > x0 ? 1 : -1, h = 1.0; let d = `M ${f(x0)} ${f(y)}`;
    for (const hx of hops.slice().sort((a, b) => dir * (a - b))) d += ` H ${f(hx - dir * h)} A ${h} ${h} 0 0 ${dir > 0 ? 1 : 0} ${f(hx + dir * h)} ${f(y)}`;
    return d + ` H ${f(x1)}`;
  };
  const feed = (k, r, m, k2, h2) => gold([[X(r), FH(k)], [X(m), FH(k)], [X(m), Yk(k2, h2)]]);   // gold: riser to a load
  // Water branches run at room-ceiling height, just under the service band, so they never ride alongside a gold feeder.
  const WY = (k) => dy(k) + 3.2 * S;
  const water = (k, m, k2, h2, hops = []) => GOLD.push(`<path class="water" d="${run(X(SX), WY(k), X(m), hops.map(X))} V ${f(Yk(k2, h2))}"/>`);
  const T = [];
  const tg = (m, k, n, off = 0) => T.push(tag(m, k, n, off));
  // Maintenance access: a trunk beside each lift core, Deck 12 to Deck 01, the only columns that reach every deck
  // outside engineering and the bay, and where the risers run. Each run is a vertical way (1.2 m, a ladder) with a
  // landing and hatch at every deck; runs step sideways by short crawls only to clear lift doors and the tram lobbies.
  // [metres along, lowest deck, highest deck], bottom run first.
  const TRUNKS = [
    [[129.4, 11, 7], [121.5, 6, 5], [140.5, 4, 2]],
    [[270, 11, 7], [278.5, 6, 5], [259.5, 4, 2]],
  ];
  // Deck 12's band joins the trunks under the bay; ladders drop from it into every fuel room, no more than 30 m apart.
  const FUEL_LADDERS = [128.5, 150.75, 163.75, 186.1, 213.9, 236.25, 249.25, 274.4];
  const TW = 1.2;
  const WAYS = TRUNKS.flat().flatMap(([m, k0, k1]) => Array.from({ length: k0 - k1 + 1 }, (_, i) => [k1 + i, m]));
  const LADDERS = WAYS.concat(FUEL_LADDERS.map((m) => [12, m]));
  const blocked = (k, a, b) => LADDERS.some(([lk, lm]) => lk === k && a < lm + TW / 2 + 0.8 && b > lm - TW / 2 - 0.8);

  // Room fit-outs by type. Each takes the deck and the span; everything is a closed shape.
  // Crew housing by seniority: suites for Level 6 staff, single cabins (3 m) for senior grades, doubles (4 m, bunk
  // beds) for juniors. The section cuts one row of cabins; a second row faces it across the block's corridor.
  const WASH = [], SUITE_WASH = [];   // washroom sinks and suite washrooms, for the water lines below
  // Living rooms are stacked two high in the deck's 4.8 m: a lower tier, a thin floor, an upper tier opening onto a
  // gallery along the corridor (behind the cut). Stairs at both ends of every block give each cabin two ways out.
  const TIER = [0, 2.45];
  const slab = (k, lo, hi) => add(`<rect class="room" x="${f(X(lo))}" y="${f(Yk(k, 2.45))}" width="${f((hi - lo) * S)}" height="${f(0.15 * S)}"/>`);
  const stair = (k, lo, hi, rise) => {   // a flight up to the upper tier, climbing toward rise (+1 right, -1 left)
    room(k, lo, hi); const n = 12, run = 0.27, start = rise > 0 ? lo + 0.35 : hi - 0.35;
    let pts = `${f(X(start))},${f(Yk(k, 0))}`;
    for (let i = 0; i < n; i++) { const m = start + rise * i * run, h = (i + 1) * 2.45 / n; pts += ` ${f(X(m))},${f(Yk(k, h))} ${f(X(m + rise * run))},${f(Yk(k, h))}`; }
    const top = start + rise * n * run;
    pts += ` ${f(X(top))},${f(Yk(k, 2.2))} ${f(X(start + rise * 0.3))},${f(Yk(k, 0))}`;
    add(`<polygon class="kit" points="${pts}"/>`);
    slab(k, Math.min(top, rise > 0 ? hi : lo), Math.max(top, rise > 0 ? hi : lo));   // the top landing
  };
  const cabin = (k, lo, hi) => {
    room(k, lo, hi);
    for (const b of TIER) {
      const bx = (m0, m1, h0, h1, c) => box(k, m0, m1, h0 + b, h1 + b, c);
      if (hi - lo < 3.5) { bx(lo + 0.2, lo + 2.2, 0, 0.6, "kit"); bx(lo + 0.3, lo + 0.8, 0.6, 0.75, "crate"); bx(lo + 2.4, lo + 2.85, 0, 2.2, "kit"); continue; }
      // Bunk: two end posts from the floor, the mattresses fitted between them.
      bx(lo + 0.4, lo + 0.5, 0, 1.9, "kit"); bx(lo + 2.3, lo + 2.4, 0, 1.9, "kit");
      bx(lo + 0.5, lo + 2.3, 0.3, 0.6, "kit"); bx(lo + 0.5, lo + 2.3, 1.4, 1.7, "kit");
      bx(lo + 2.8, lo + 3.7, 0, 2.2, "kit");   // one double wardrobe
    }
  };
  // Washroom (5 m): two toilet stalls, two showers, a sink counter, stacked so both tiers share one water drop.
  const washroom = (k, lo) => {
    room(k, lo, lo + 5);
    for (const b of TIER) {
      for (const m of [lo + 1.0, lo + 2.0]) box(k, m - 0.05, m + 0.05, b, b + 2.0, "kit");
      for (const m of [lo + 0.2, lo + 1.2]) box(k, m, m + 0.6, b, b + 0.5, "crate");
      for (const m of [lo + 2.1, lo + 2.9]) box(k, m, m + 0.7, b, b + 2.1, "kit");
      box(k, lo + 3.8, lo + 4.8, b + 0.75, b + 0.9, "kit");
    }
    WASH.push([k, lo + 4.3]); T.push(tag(lo + 2.5, k, 54, -4.5));
  };
  // Common room (5 m), one per tier: sofa, table, a wall screen, a terminal.
  const common = (k, lo) => {
    room(k, lo, lo + 5);
    for (const b of TIER) {
      box(k, lo + 0.3, lo + 2.5, b, b + 0.8, "kit"); box(k, lo + 2.9, lo + 4.1, b + 0.6, b + 0.7, "kit"); box(k, lo + 3.45, lo + 3.55, b, b + 0.6, "kit");
      box(k, lo + 0.6, lo + 2.2, b + 1.3, b + 2.2, "crate");
      box(k, lo + 4.42, lo + 4.58, b, b + 1.1, "term"); box(k, lo + 4.05, lo + 4.95, b + 1.1, b + 1.7, "term-screen");
    }
    T.push(tag(lo + 2.5, k, 55, -4.5));
  };
  // A block from its lift-core end: a landing where the lift and access trunk open, a stair, the washroom and common
  // room, the singles, the doubles, and a second stair at the far end, running away from the core in direction d.
  // Returns where it ends.
  const block = (k, core, d, landing, singles, doubles) => {
    let p = core + d * landing;
    const seg = (len) => { const a = p, b = p + d * len; p = b; return [Math.min(a, b), Math.max(a, b)]; };
    room(k, Math.min(core, core + d * landing), Math.max(core, core + d * landing));
    LANDING_DOORS.push([core + d * landing, k]);
    add(`<g class="racks">`);
    const [s0, s1] = seg(4); stair(k, s0, s1, d);
    const t0 = p; washroom(k, seg(5)[0]); common(k, seg(5)[0]);
    const c0 = p;
    for (let i = 0; i < singles; i++) { const [lo, hi] = seg(3); cabin(k, lo, hi); }
    for (let i = 0; i < doubles; i++) { const [lo, hi] = seg(4); cabin(k, lo, hi); }
    slab(k, Math.min(t0, p), Math.max(t0, p));
    const [f0, f1] = seg(4); stair(k, f0, f1, -d);
    add(`</g>`); T.push(tag((c0 + p) / 2, k, 39, -4.5).replace("tag sm", "tag sm keep"));   // centred on the cabins, not one cabin
    return p;
  };
  const desks = (k, m0, m1, step = 4) => { add(`<g class="racks">`); for (let m = m0 + 1; m + 2.4 < m1 - 0.8; m += step) { if (blocked(k, m, m + 2.4)) continue; box(k, m, m + 2.4, 0.75, 0.9, "kit"); box(k, m + 0.15, m + 0.35, 0, 0.75, "kit"); box(k, m + 2.05, m + 2.25, 0, 0.75, "kit"); } add(`</g>`); };
  const lockers = (k, m0, m1, h = 2.2) => { add(`<g class="racks">`); for (let m = m0; m + 0.9 <= m1; m += 1.0) if (!blocked(k, m, m + 0.9)) box(k, m, m + 0.9, 0, h, "kit"); add(`</g>`); };

  // Deck 01: lift machinery either end, comms and the beacon, command around SIGMA's column, administration.
  for (const [m0, m1] of [[LIFTS[0] + LW / 2, 145], [255, LIFTS[1] - LW / 2]]) {
    // Mirrored either side, leaving the floor clear for the access trunk's hatch between motor and controls.
    room(1, m0, m1); add(`<g class="plant">`); const c = (m0 + m1) / 2, d = c < 200 ? 1 : -1;
    box(1, Math.min(c + d * 0.6, c + d * 3.6), Math.max(c + d * 0.6, c + d * 3.6), 0, 1.4); circ(1, c - d * 2.7, 1.2, 1.1); add(`</g>`); tg(c, 1, 27, -4.5);
  }
  room(1, 145, 175); add(`<g class="plant">`); for (const m of [147, 149.6, 152.2, 154.8, 157.4]) { box(1, m, m + 2.2, 0, 2.8); box(1, m + 0.5, m + 1.7, 1.9, 2.4); }
  box(1, 168.5, 172.5, 0, 3.6); box(1, 169.3, 171.7, 2.6, 3.2); add(`</g>`);
  // The beacon's feed up through the roof to the taller spire.
  add(`<line class="busbar" x1="${f(X(170.5))}" y1="${f(Yk(1, 3.6))}" x2="${f(X(170.5))}" y2="${Y0}"/>`);
  term(1, 162); tg(160, 1, 29, -4.5);
  room(1, 175, 225); add(`<g class="racks">`);
  for (const [a, b] of [[178, 183], [184, 189], [191, 196.5], [203.5, 209], [211, 216], [217, 222]]) { box(1, a, b, 0, 0.8, "kit"); box(1, a + 0.3, b - 0.3, 0.8, 1.3, "crate"); }
  box(1, 180, 194, 3.0, 4.4, "kit"); box(1, 206, 220, 3.0, 4.4, "kit"); add(`</g>`); term(1, 189.8); term(1, 210.2); tg(186, 1, 28, -4.5);
  room(1, 225, 255); desks(1, 225, 245); lockers(1, 247, 254); term(1, 236); tg(240, 1, 30, -4.5);

  // Deck 02: senior quarters, galley, mess, recreation, laundry.
  // Senior staff suites, Level 6: bed, wardrobe, a desk, and a private washroom. Stacked like the cabins, a landing by
  // the lift, a stair at each end. 95 to 104 is freed by the stacking, unassigned.
  room(2, 129, LIFTS[0] - LW / 2); room(2, 95, 104); LANDING_DOORS.push([129, 2]); add(`<g class="racks">`);
  stair(2, 125, 129, -1); stair(2, 104, 108, 1); slab(2, 108, 125);
  for (let i = 0; i < 3; i++) {
    const lo = 108 + i * 17 / 3, hi = lo + 17 / 3; room(2, lo, hi);
    for (const b of TIER) {
      box(2, lo + 0.2, lo + 2.2, b, b + 0.6, "kit"); box(2, lo + 0.3, lo + 0.8, b + 0.6, b + 0.75, "crate"); box(2, lo + 2.35, lo + 2.8, b, b + 2.2, "kit");
      box(2, lo + 3.0, lo + 4.2, b + 0.75, b + 0.9, "kit"); box(2, lo + 3.1, lo + 3.2, b, b + 0.75, "kit"); box(2, lo + 4.0, lo + 4.1, b, b + 0.75, "kit");
      box(2, hi - 1.1, hi - 0.1, b, b + 2.2, "kit");
    }
    SUITE_WASH.push(hi - 0.6);
  }
  add(`</g>`); tg(116.5, 2, 31, -4.5);
  room(2, LIFTS[0] + LW / 2, 158); add(`<g class="racks">`); box(2, 142, 155.2, 0, 0.9, "kit"); box(2, 144, 148, 2.2, 2.7, "kit"); box(2, 155.6, 157.6, 0, 2.2, "kit");
  box(2, 150, 151.1, 0.9, 1.5, "crate"); add(`</g>`); tg(148, 2, 32, -4.5);   // the coffee machine on the counter
  room(2, 158, 197.5); add(`<g class="racks">`); for (let m = 160; m < 195; m += 5) { box(2, m, m + 3, 0.75, 0.9, "kit"); box(2, m + 0.2, m + 0.4, 0, 0.75, "kit"); box(2, m + 2.6, m + 2.8, 0, 0.75, "kit"); } add(`</g>`); term(2, 196); tg(178, 2, 33, -4.5);
  room(2, 202.5, 233); room(2, 233, LIFTS[1] - LW / 2); add(`<g class="racks">`); for (const m of [235, 241]) { box(2, m, m + 4.5, 0, 0.9, "kit"); box(2, m, m + 0.6, 0.9, 1.6, "kit"); } box(2, 251, 260, 2.0, 3.6, "kit"); add(`</g>`); tg(248, 2, 34, -4.5);   // 202.5 to 233 unassigned
  room(2, LIFTS[1] + LW / 2, 305); add(`<g class="plant">`); for (const m of [269, 272, 275, 278]) { box(2, m, m + 2.6, 0, 1.4); circ(2, m + 1.3, 0.7, 0.45); } add(`</g>`); lockers(2, 284, 302); tg(286, 2, 35, -4.5);

  // Decks 03 and 04: hydroponics two storeys high at both ends; clinic and science offices on 03; quarters on 04.
  for (const [m0, m1] of [[60, LIFTS[0] - LW / 2], [LIFTS[1] + LW / 2, 340]]) {
    EARLY.push(`<rect class="hold-mask" x="${f(X(m0))}" y="${dy(3)}" width="${f((m1 - m0) * S)}" height="${f(dy(5) - dy(3))}"/>`);
    room(3, m0, m1, 4); add(`<g class="racks">`);
    for (let m = m0 + 3; m + 6 < m1 - 4; m += 9) {
      box(4, m, m + 6, 0, 11.5, "kit");
      // Each tray carries a row of leafy plants, bright green.
      for (let h = 1.2; h < 10; h += 1.6) {
        box(4, m + 0.3, m + 5.7, h, h + 0.35, "crate");
        for (let u = m + 0.75; u < m + 5.4; u += 0.7) add(`<ellipse class="plant-leaf" cx="${f(X(u))}" cy="${f(Yk(4, h + 0.62))}" rx="${f(0.34 * S)}" ry="${f(0.3 * S)}"/>`);
      }
    }
    add(`</g>`);
    const nt = m0 < 200 ? m1 - 3.2 : m0 + 0.6; add(`<path class="tank-waste" d="M ${f(X(nt))} ${f(Yk(4, 0))} V ${f(Yk(4, 2.4))} Q ${f(X(nt))} ${f(Yk(4, 3))} ${f(X(nt + 1.3))} ${f(Yk(4, 3))} Q ${f(X(nt + 2.6))} ${f(Yk(4, 3))} ${f(X(nt + 2.6))} ${f(Yk(4, 2.4))} V ${f(Yk(4, 0))} Z"/>`);
    term(4, m0 < 200 ? m1 - 4.2 : m0 + 4.2); tg((m0 + m1) / 2, 3, 36, 4);
  }
  room(3, LIFTS[0] + LW / 2, 181); room(3, 181, 197.5); add(`<g class="racks">`);   // 181 to 197.5 unassigned for (const m of [143, 148.3, 153.6, 158.9]) { box(3, m, m + 3.6, 0.5, 0.75, "kit"); box(3, m, m + 0.3, 0.75, 1.4, "kit"); box(3, m + 0.4, m + 3.4, 0, 0.5, "kit"); }
  box(3, 166, 172, 0.4, 1.6, "kit", 1.5); box(3, 162.6, 164.6, 0.8, 0.95, "kit"); box(3, 163.4, 163.8, 0, 0.8, "kit"); lockers(3, 174.5, 180.4); add(`</g>`); term(3, 173.2); tg(168, 3, 37, -4.5);
  // Exposure lab beside the clinic: EEG booth, incubators, biosafety cabinet, growth chambers, sample freezer.
  room(3, 202.5, 232); add(`<g class="racks">`);
  box(3, 204, 208, 0, 2.6, "kit"); box(3, 205.5, 206.7, 0, 1.0, "crate");
  box(3, 210, 218, 0, 0.9, "kit"); for (const m of [210.3, 212.3, 214.3]) box(3, m, m + 1.6, 0.9, 2.0, "crate");
  box(3, 219, 222, 0, 2.4, "kit"); box(3, 219.3, 221.7, 1.0, 1.8, "crate");
  for (const m of [223.5, 226]) {
    box(3, m, m + 2, 0, 2.2, "kit");
    for (const h of [0.6, 1.4]) for (let u = m + 0.4; u < m + 1.8; u += 0.6) add(`<ellipse class="plant-leaf" cx="${f(X(u))}" cy="${f(Yk(3, h))}" rx="${f(0.25 * S)}" ry="${f(0.22 * S)}"/>`);
  }
  box(3, 228.5, 230.8, 0, 1.9, "kit"); add(`</g>`); term(3, 209.1); tg(217, 3, 53, -4.5);
  // Science office: the Director's office, then the briefing room where the run was planned, and the records.
  room(3, 232, 242); add(`<g class="racks">`);
  box(3, 235, 238.5, 0.75, 0.9, "kit"); box(3, 235.2, 235.4, 0, 0.75, "kit"); box(3, 238.1, 238.3, 0, 0.75, "kit");
  box(3, 239.5, 241.5, 0, 1.2, "kit"); add(`</g>`); term(3, 233.4);
  room(3, 242, LIFTS[1] - LW / 2); add(`<g class="racks">`);
  box(3, 245, 253, 0.75, 0.9, "kit"); box(3, 245.3, 245.5, 0, 0.75, "kit"); box(3, 252.5, 252.7, 0, 0.75, "kit");
  box(3, 246, 252, 2.0, 3.2, "kit"); box(3, 246.3, 251.7, 2.2, 3.0, "crate");
  add(`</g>`); lockers(3, 254, 258, 2.2); term(3, 243.2); tg(249, 3, 38, -4.5);
  // Deck 04: Science's block; the right block takes Science's overflow and visiting crews.
  room(4, block(4, LIFTS[0] + LW / 2, 1, 5.5, 4, 4), 197.5);   // Science; the rest of the span is freed by stacking, unassigned
  room(4, 211.5, LIFTS[1] - LW / 2 - 5.5); room(4, LIFTS[1] - LW / 2 - 5.5, LIFTS[1] - LW / 2);   // unassigned, and the lift landing

  // Escape pods: 14 lifeboats of 12 seats, at the ends of Deck 04 and Deck 09, near the quarters. Their hatches are
  // under SIGMA's incident lockdown, so drawn locked.
  // Pods sit centred in the room, either side of its centred tag; the larger group goes to the hull end.
  const pods = (k, m0, m1, out, n) => {
    room(k, m0, m1); add(`<g class="ship">`);
    const cy = dy(k) + DH / 2, c = (m0 + m1) / 2, big = Math.ceil(n / 2), small = n - big;
    const [nl, nr] = out < 0 ? [big, small] : [small, big];
    const ms = [...Array.from({ length: nl }, (_, i) => c - 2.3 - 6.2 - i * 7.1), ...Array.from({ length: nr }, (_, i) => c + 2.3 + i * 7.1)];
    for (const m of ms) add(`<rect x="${f(X(m))}" y="${f(cy - 1.6 * S)}" width="${f(6.2 * S)}" height="${f(3.2 * S)}" rx="${f(1.4 * S)}"/>`);
    add(`</g>`);
    for (const m of ms) add(`<rect class="door door-locked" x="${f(X(m + 2.6))}" y="${f(cy - 1.0 * S)}" width="${f(1.0 * S)}" height="${f(2.0 * S)}"/>`);
    tg(c, k, 40, -4.5);
  };
  pods(4, 25, 58, -1, 4); pods(4, 342, 375, 1, 4); pods(9, 12, 43, -1, 3); pods(9, 357, 388, 1, 3);

  // Deck 05: Science's floor. Node Physics, Materials and Time Standards aft of the left lift; Corridor Harmonics
  // forward of the right one, its receiver room at the end nearest the node focus.
  const sh = (k, m0, m1, h) => add(`<line class="shelf" x1="${f(X(m0))}" y1="${f(Yk(k, h))}" x2="${f(X(m1))}" y2="${f(Yk(k, h))}"/>`);
  // Time standards lab: the master clock ensemble in vacuum housings, comparison racks, fibre out to every deck.
  room(5, 12, 48); room(5, 48, 85); add(`<g class="racks">`);   // 48 to 85 unassigned
  box(5, 15.5, 31, 0, 0.9, "kit");
  for (let m = 16; m < 30; m += 2.5) { box(5, m, m + 1.6, 0.9, 2.7, "kit", 0.6 * S); box(5, m + 0.4, m + 1.2, 1.5, 2.1, "crate"); }
  for (let m = 32.5; m < 37; m += 1.4) box(5, m, m + 1.2, 0, 2.4, "kit");
  box(5, 39.5, 44, 0.75, 0.9, "kit"); box(5, 39.7, 39.9, 0, 0.75, "kit"); box(5, 43.6, 43.8, 0, 0.75, "kit");
  box(5, 45, 47, 0, 3.0, "kit"); for (const h of [0.8, 1.6, 2.4]) sh(5, 45, 47, h);
  add(`</g>`); term(5, 13.2); tg(36, 5, 50, -4.5);
  // Materials lab: harmonic fatigue rig, coupon racks, gamma spectrometer, microscope bench, sample saw.
  room(5, 85, LIFTS[0] - LW / 2); add(`<g class="racks">`);
  box(5, 87, 93, 0, 3.2, "kit"); box(5, 89, 91, 1.0, 2.2, "crate"); sh(5, 87, 93, 0.6);
  box(5, 94.5, 98.5, 0, 2.4, "kit"); for (const h of [0.8, 1.6]) sh(5, 94.5, 98.5, h);
  box(5, 100, 103, 0, 1.6, "kit", 0.5 * S); box(5, 101, 102, 1.6, 2.6, "crate");
  box(5, 104.5, 109.5, 0.75, 0.9, "kit"); box(5, 104.7, 104.9, 0, 0.75, "kit"); box(5, 109.1, 109.3, 0, 0.75, "kit"); box(5, 106, 106.8, 0.9, 1.7, "crate");
  box(5, 111, 114, 0, 1.2, "kit"); add(`<circle class="reel" cx="${f(X(112.5))}" cy="${f(Yk(5, 1.5))}" r="${f(0.6 * S)}"/>`);
  // Out to the lift: write-up desks and the sample store, shelved coupons and cut sections.
  add(`</g>`); desks(5, 114, 127); lockers(5, 127.5, 132, 2.4); term(5, 86.2); tg(86, 5, 41, -4.5);
  // R&D, Node Physics: the control desk, a glovebox, and the damped test cell beside the lock into experiment control.
  add(`<g class="racks">`);
  box(5, 138.4, 140.6, 0.75, 0.9, "kit"); box(5, 138.6, 138.8, 0, 0.75, "kit"); box(5, 140.2, 140.4, 0, 0.75, "kit"); box(5, 138.9, 140.1, 0.9, 1.5, "crate");
  box(5, 141.2, 144.2, 0.9, 2.0, "kit"); box(5, 141.5, 143.9, 0, 0.9, "kit"); box(5, 141.7, 143.7, 1.1, 1.8, "crate");
  box(5, 144.8, 148.8, 0, 3.4, "kit"); box(5, 145.4, 148.2, 0.6, 2.8, "crate"); for (const h of [1.1, 2.3]) sh(5, 144.8, 148.8, h);
  add(`</g>`);
  // The tap: a branch of the Deck 06 conduits up through switch room A into the cell, switched from experiment control.
  add(`<line class="tap" x1="${f(X(145.4))}" y1="${f(midY)}" x2="${f(X(145.4))}" y2="${f(Yk(5, 0))}"/>`);
  // The lock into experiment control, sealed as Quell finds it.
  add(`<rect class="door door-locked" x="${f(X(150) - DW / 2)}" y="${f(Yk(5, DOOR))}" width="${DW}" height="${f(DOOR * S)}"/>`);
  // Corridor analysis: Stratovan analyzers, a row of analyst consoles, the wall phase map, model racks.
  room(5, LIFTS[1] + LW / 2, 318.5); room(5, 318.5, 341); add(`<g class="racks">`);   // 318.5 to 341 unassigned
  for (let m = 269.5; m < 277; m += 1.3) box(5, m, m + 1.2, 0, 2.4, "kit");
  box(5, 300, 312, 2.6, 4.2, "kit"); box(5, 300.4, 311.6, 2.9, 3.9, "crate");
  for (let m = 312.4; m < 317; m += 1.4) box(5, m, m + 1.2, 0, 2.4, "kit");
  add(`</g>`); desks(5, 278, 300); term(5, 268.2); tg(298.5, 5, 51, -4.5);
  // Array receiver room: the forward array's sensors come up from the conduits into the receivers.
  room(5, 341, 388); add(`<g class="racks">`);
  box(5, 344, 350, 0.75, 0.9, "kit"); box(5, 344.2, 344.4, 0, 0.75, "kit"); box(5, 349.6, 349.8, 0, 0.75, "kit"); box(5, 345, 346.4, 0.9, 1.4, "crate"); box(5, 347.4, 348.6, 0.9, 1.3, "crate");
  for (let m = 351.5; m < 357; m += 2.2) { box(5, m, m + 1.8, 0, 1.4, "kit"); add(`<circle class="reel" cx="${f(X(m + 0.9))}" cy="${f(Yk(5, 0.8))}" r="${f(0.4 * S)}"/>`); }
  box(5, 374.5, 377, 0, 1.6, "kit"); add(`<circle class="reel" cx="${f(X(375.75))}" cy="${f(Yk(5, 1.0))}" r="${f(0.35 * S)}"/>`);
  for (let m = 358; m < 369; m += 1.5) box(5, m, m + 1.4, 0, 2.6, "kit");
  box(5, 370.5, 373.5, 0, 1.8, "kit");
  add(`</g>`); term(5, 342.2); tg(359, 5, 52, -4.5);
  add(`<line class="tap" x1="${f(X(372))}" y1="${f(midY)}" x2="${f(X(372))}" y2="${f(Yk(5, 0))}"/>`);

  // Deck 06: array access at both ends of the tram: airlock out to the truss, suits and tools. Tram cars at the stops.
  for (const [m0, m1, d] of [[0, 20, -1], [380, 400, 1]]) {
    room(6, m0, m1); const ow = d < 0 ? m0 : m1, aw = d < 0 ? m0 + 6.5 : m1 - 6.5;
    add(`<rect class="room" x="${f(X(Math.min(ow, aw)))}" y="${f(Yk(6, 4.5))}" width="${f(6.5 * S)}" height="${f(4.5 * S)}"/>`);
    add(`<rect class="airlock door-locked" x="${f(X(ow) - DW / 2)}" y="${f(Yk(6, 3))}" width="${DW}" height="${f(3 * S)}"/>`);
    add(`<rect class="door door-open" x="${f(X(aw) - DW / 2)}" y="${f(Yk(6, 3))}" width="${DW}" height="${f(3 * S)}"/>`);
    const s0 = d < 0 ? m0 + 7.5 : m1 - 14; add(`<g class="racks">`); for (let m = s0; m < s0 + 6.4; m += 1.6) { box(6, m, m + 1.2, 0.2, 2.0, "kit", 0.5); box(6, m + 0.3, m + 0.9, 2.0, 2.4, "kit", 0.6); } add(`</g>`);
    lockers(6, d < 0 ? m0 + 15 : m1 - 19, d < 0 ? m0 + 19 : m1 - 15, 2.4);
    term(6, d < 0 ? m0 + 14.4 : m1 - 14.4); tg((m0 + m1) / 2 - d * 3, 6, 42, -4.5);
  }
  add(`<g class="ship">`); for (const m of [124.5, 268.5]) add(`<rect x="${f(X(m))}" y="${f(Yk(6, 3.0))}" width="${f(8 * S)}" height="${f(2.6 * S)}" rx="2"/>`); add(`</g>`);

  // Deck 07: life support at both ends by the lifts; maintenance shops beyond.
  for (const [m0, m1, d] of [[70, LIFTS[0] - LW / 2, 1], [LIFTS[1] + LW / 2, 330, -1]]) {
    room(7, m0, m1); add(`<g class="plant">`); const M = (u) => d > 0 ? m0 + u : m1 - u, A = (u0, u1) => [Math.min(M(u0), M(u1)), Math.max(M(u0), M(u1))];
    // Oxygen from water (electrolysers), carbon dioxide scrubber beds, air handlers, trace contaminant control.
    for (const u of [3, 8, 13]) { const [a, b] = A(u, u + 4); box(7, a, b, 0, 3.2); for (const h of [0.8, 1.6, 2.4]) hl(7, a + 0.3, b - 0.3, h); }
    for (const u of [20, 22, 24, 26]) { const [a, b] = A(u, u + 1.4); box(7, a, b, 0, 3.4, "", 0.7 * S); }
    for (const u of [31, 41]) { const [a, b] = A(u, u + 8); box(7, a, b, 0, 4.0); circ(7, (a + b) / 2, 2.0, 1.4); }
    const [a, b] = A(52, 56); box(7, a, b, 0, 2.6); add(`</g>`);
    term(7, M(57.6)); tg((m0 + m1) / 2, 7, 43, -4.5);
  }
  for (const [m0, m1] of [[5, 70], [330, 395]]) { room(7, m0, m1); desks(7, m0, m0 + 30, 6); if (m0 < 200) { lockers(7, 39, 48, 2.4); lockers(7, 52, 66, 2.4); } else lockers(7, m0 + 34, m1 - 4, 2.4); term(7, m0 + 32); tg((m0 + m1) / 2, 7, 44, -4.5); }

  // Deck 08: fire and emergency stores, security; crew quarters and the gym on the right.
  room(8, 10, 45); room(8, 45, 85); add(`<g class="plant">`); for (let m = 47; m < 63; m += 1.6) box(8, m, m + 1.1, 0, 2.2, "", 0.5 * S); for (const m of [66.5, 71.5, 76.5]) { circ(8, m, 1.0, 0.8); box(8, m - 0.9, m + 0.9, 0, 0.1); } add(`</g>`); term(8, 81.5); tg(65, 8, 46, -4.5);
  room(8, 85, LIFTS[0] - LW / 2); desks(8, 85, 105); lockers(8, 106.5, 115, 2.4);
  add(`<rect class="room" x="${f(X(116.8))}" y="${f(Yk(8, 4.5))}" width="${f(11 * S)}" height="${f(4.5 * S)}"/>`);
  for (let m = 117.6; m < 127.7; m += 0.8) add(`<line class="flange" x1="${f(X(m))}" y1="${f(Yk(8, 4.5))}" x2="${f(X(m))}" y2="${f(Yk(8, 0))}"/>`);
  term(8, 115.8); tg(100, 8, 45, -4.5);
  block(8, LIFTS[1] + LW / 2, 1, 5, 4, 5);   // Command, Security, Medical. Decks 08 to 10 share one plan, so walls stack
  room(8, 322, 352); room(8, 352, 392); add(`<g class="racks">`); for (const m of [325, 331, 337, 343]) { box(8, m, m + 5, 0, 0.6, "kit"); box(8, m + 1, m + 1.4, 0.6, 1.8, "kit"); } add(`</g>`); tg(337, 8, 47, -4.5);
  // Fire suppression plants at both outer ends of Deck 08: a mist water tank and pumps, an inert gas cylinder bank.
  for (const [m0, m1, d] of [[10, 45, 1], [352, 392, -1]]) {
    const M = (u) => d > 0 ? m0 + u : m1 - u, A = (u0, u1) => [Math.min(M(u0), M(u1)), Math.max(M(u0), M(u1))];
    add(`<g class="plant">`);
    { const [a, b] = A(2, 12); box(8, a, b, 0, 3.2, "", 1.0 * S); hl(8, a + 0.4, b - 0.4, 1.6); }
    for (const u of [14, 17]) { const [a, b] = A(u, u + 2.4); box(8, a, b, 0, 1.4); circ(8, (a + b) / 2, 0.7, 0.45); }
    for (let u = 21; u < 31; u += 1.2) { const [a, b] = A(u, u + 0.8); box(8, a, b, 0, 2.6, "", 0.4 * S); }
    { const [a, b] = A(20.6, 30.8); hl(8, a, b, 2.9); }
    add(`</g>`);
    term(8, M(33)); tg((m0 + m1) / 2, 8, 57, -4.5);
    FIRE_PLANTS.push({ k: 8, tank: [M(7), 3.2], outlets: [[M(18.2), 1.4], [M(25.7), 2.9]] });
  }

  // Decks 09 and 10: quarters at the outer ends; logistics stores; Deck 11: recycling beside the waste plant.
  // Pod muster station beside the Deck 09 pods: benches, emergency suit and ration lockers, the pod status board.
  room(9, 43, 76); room(9, 76, 105); add(`<g class="racks">`);   // 76 to 105 unassigned
  for (let m = 45; m < 58; m += 5) { box(9, m, m + 3, 0.4, 0.5, "kit"); box(9, m + 0.2, m + 0.3, 0, 0.4, "kit"); box(9, m + 2.7, m + 2.8, 0, 0.4, "kit"); }
  add(`</g>`); lockers(9, 59, 67, 2.4); add(`<g class="racks">`);
  box(9, 68, 74, 0, 1.2, "kit"); for (const h of [0.4, 0.8]) sh(9, 68, 74, h);
  box(9, 68.5, 73.5, 2.0, 3.2, "kit"); box(9, 68.8, 73.2, 2.2, 3.0, "crate");
  add(`</g>`); term(9, 75); tg(60, 9, 56, -4.5);
  room(9, block(9, LIFTS[1] + LW / 2, 1, 5, 4, 5), 357);   // Engineering, with the DYNEX and Valdez teams
  room(10, 25, 55); room(10, 55, 105); add(`<g class="racks">`); for (const m of [57, 66, 84, 93]) { box(10, m, m + 7, 0, 4.0, "kit"); for (const h of [1.3, 2.6]) hl(10, m, m + 7, h); box(10, m + 1, m + 3, 0, 1.0, "crate"); box(10, m + 4, m + 5.5, 1.3, 2.1, "crate"); } add(`</g>`); term(10, 102); tg(80, 10, 48, -4.5);   // 25 to 55 unassigned
  room(10, block(10, LIFTS[1] + LW / 2, 1, 5, 4, 5), 375);   // Maintenance, Habitation services
  room(11, 305, 332); room(11, 332, 355); add(`<g class="plant">`); box(11, 307, 314, 0, 2.6); for (let m = 316; m < 327; m += 3.5) box(11, m, m + 2.6, 0, 1.6); add(`</g>`); term(11, 330.8); tg(318, 11, 49, -4.5);   // 332 to 355 unassigned

  // Power feeders (gold) to every new major system, from the two risers along each deck's service band.
  feed(1, RA, 143.1, 1, 1.4); feed(1, RA, 156, 1, 2.8); feed(1, RA, 185.5, 1, 1.3);
  feed(1, RB, 256.9, 1, 1.4); feed(1, RB, 214.5, 1, 1.3); feed(1, RB, 236, 1, 1.7);
  feed(2, RA, 143, 2, 0.9); feed(2, RB, 280.3, 2, 1.4);
  feed(3, RA, 140.15, 3, 1.4); feed(3, RA, 100, 4, 11.5); feed(3, RB, 300, 4, 11.5);
  feed(4, RA, 36.1, 4, 5.4); feed(4, RB, 363.9, 4, 5.4);   // onto a pod, clear of the centred tag
  feed(5, RA, 90, 5, 3.2); feed(5, RB, 315.8, 5, 2.4); feed(3, RB, 220.5, 3, 2.4);
  feed(6, RA, 14.4, 6, 1.7); feed(6, RB, 385.6, 6, 1.7);
  feed(7, RA, 124, 7, 2.6); feed(7, RB, 276, 7, 2.6);
  feed(8, RA, 95, 8, 0.9);
  // Water branches (teal) off the supply riser: galley, clinic, both hydroponics bays, both life support plants.
  // Vacuum toilets: suction, not gravity, so the left-side washrooms' waste rises from Deck 04 and crosses Deck 03's
  // band to the right core's toilet drain. VR is Deck 04's riser, beside its washroom.
  const VR = 142.3, YV = dy(3) + 0.6 * S;
  water(2, 146, 2, 0.9); water(3, 163.6, 3, 0.95, [VR]);
  water(3, LIFTS[0] - LW / 2 - 1.9, 4, 3.0, [DX]); water(7, 80, 7, 3.2, [DX]);
  // The right half: one crossing in Deck 02's band, over the toilet drain, then a riser beside the right lift
  // down to life support's electrolysers, teeing into the hydroponics nutrient tank on the way.
  const WR = LIFTS[1] + LW / 2 + 4.5;
  GOLD.push(`<path class="water" d="${run(X(SX), WY(2), X(WR), [X(DBX)])} V ${f(WY(7))} H ${f(X(320))} V ${f(Yk(7, 3.2))}"/>`);
  GOLD.push(`<path class="water" d="M ${f(X(WR))} ${f(Yk(4, 2.0))} H ${f(X(LIFTS[1] + LW / 2 + 3.2))}"/>`);
  // Washrooms. The suites: one branch along Deck 02's ceiling, a drop into each. The right riser carries on to Deck 10.
  GOLD.push(`<path class="water" d="${run(X(SX), WY(2), X(Math.min(...SUITE_WASH)), [X(DX)])}"/>`);
  for (const m of SUITE_WASH) GOLD.push(`<path class="water" d="M ${f(X(m))} ${f(WY(2))} V ${f(Yk(2, 2.2))}"/>`);
  GOLD.push(`<path class="water" d="M ${f(X(WR))} ${f(WY(7))} V ${f(WY(10))}"/>`);
  for (const [k, m] of WASH) {
    if (m < 200) water(k, m, k, 0.9, [VR]);
    else if (k === 4) GOLD.push(`<path class="water" d="${run(X(WR), WY(k), X(m), [X(DBX), X(RX)])} V ${f(Yk(k, 0.9))}"/>`);
    else GOLD.push(`<path class="water" d="M ${f(X(WR))} ${f(WY(k))} H ${f(X(m))} V ${f(Yk(k, 0.9))}"/>`);
  }
  GOLD.push(`<path class="water" d="${run(X(Math.min(...SUITE_WASH)), YV, X(DBX), [X(DX), X(SX), X(RX)])}"/>`);
  for (const m of SUITE_WASH) GOLD.push(`<path class="water" d="M ${f(X(m))} ${f(YV)} V ${f(dy(3))}"/>`);
  GOLD.push(`<path class="water" d="M ${f(X(VR))} ${f(Yk(4, 0.3))} V ${f(YV)}"/>`);
  // Crawlways (0.9 m, too low to stand) run mid-band, between the gold feeders above and the water lines below.
  const CY = (k) => dy(k) + 2.25 * S, CH = 0.9;
  const crawl = (k, m0, m1) => CRAWL.push(`<rect class="crawl" x="${f(X(Math.min(m0, m1)))}" y="${f(CY(k) - CH / 2 * S)}" width="${f(Math.abs(m1 - m0) * S)}" height="${f(CH * S)}"/>`);
  // The two-storey hold has no band at decks 09 and 10: the way climbs straight through, with no landing there.
  const inHold = (k, m) => (k === 9 || k === 10) && m > CG[0] && m < LIFTS[0] - LW / 2;
  // Engineering's shafts are entered only through Deck 05's band, by locked junctions.
  const SHAFTS = [164.5, 235.5];
  crawl(12, FUEL_LADDERS[0], FUEL_LADDERS[FUEL_LADDERS.length - 1]);
  for (const [t, runs] of TRUNKS.entries()) {
    for (let i = 0; i < runs.length - 1; i++) crawl(runs[i][2], runs[i][0], runs[i + 1][0]);
    crawl(5, runs[2][0], SHAFTS[t]);
  }
  // Each run: a way from the band below its lowest deck to the band above its highest, a door into every deck it
  // passes, facing away from the lift.
  const DOOR_SIDE = [[-1, -1, 1], [1, 1, -1]];
  const junctions = [];
  for (const [t, runs] of TRUNKS.entries()) runs.forEach(([m, k0, k1], i) => {
    const top = CY(k1), bot = CY(k0 + 1);
    add(`<rect class="shaft" x="${f(X(m - TW / 2))}" y="${f(top)}" width="${f(TW * S)}" height="${f(bot - top)}"/>`);
    for (const e of [m - 0.25, m + 0.25]) add(`<line class="ladder" x1="${f(X(e))}" y1="${f(top)}" x2="${f(X(e))}" y2="${f(bot)}"/>`);
    for (let y = bot - 0.5 * S; y > top + 0.3 * S; y -= 0.5 * S) add(`<line class="rung" x1="${f(X(m - 0.25))}" y1="${f(y)}" x2="${f(X(m + 0.25))}" y2="${f(y)}"/>`);
    for (let k = k1; k <= k0; k++) {
      if (k === 9 && inHold(k, m)) continue;
      add(`<rect class="door door-open" x="${f(X(m + DOOR_SIDE[t][i] * TW / 2) - DW / 2)}" y="${f(Yk(k, 1.8))}" width="${DW}" height="${f(1.8 * S)}"/>`);
    }
    for (let k = k1; k <= k0 + 1; k++) if (!inHold(k, m)) junctions.push([k, m]);
  });
  // Ladders from Deck 12's band down into the fuel rooms, through a ceiling hatch.
  for (const m of FUEL_LADDERS) {
    const top = CY(12) + CH / 2 * S, bot = Yk(12, 0) + FL;
    for (const e of [m - 0.25, m + 0.25]) add(`<line class="ladder" x1="${f(X(e))}" y1="${f(top)}" x2="${f(X(e))}" y2="${f(bot)}"/>`);
    for (let y = bot - 0.5 * S; y > top + 0.3 * S; y -= 0.5 * S) add(`<line class="rung" x1="${f(X(m - 0.25))}" y1="${f(y)}" x2="${f(X(m + 0.25))}" y2="${f(y)}"/>`);
    junctions.push([12, m]);
  }
  // Junction boxes where ways meet crawlways or each other, each with its hatch. Ways closer than a box's width share one.
  const junction = (k, m0, m1, locked) => {
    add(`<rect class="junction" x="${f(X(m0 - 1.0))}" y="${f(CY(k) - 0.75 * S)}" width="${f((m1 - m0 + 2.0) * S)}" height="${f(1.5 * S)}"/>`);
    for (const m of new Set([m0, m1])) add(`<rect class="door hatch ${locked ? "door-locked" : "door-open"}" x="${f(X(m - 0.45))}" y="${f(CY(k) - 0.35 * S)}" width="${f(0.9 * S)}" height="${f(0.7 * S)}"/>`);
  };
  junctions.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  for (let i = 0; i < junctions.length; i++) {
    const [k, m0] = junctions[i];
    let m1 = m0;
    while (i + 1 < junctions.length && junctions[i + 1][0] === k && junctions[i + 1][1] - m1 < 2.0) m1 = junctions[++i][1];
    junction(k, m0, m1, false);
  }
  for (const m of SHAFTS) junction(5, m, m, true);
  // Deck 01: the top run's hatch opens straight up through the floor of lift machinery.
  for (const runs of TRUNKS) add(`<rect class="door door-open hatch" x="${f(X(runs[2][0] - 0.6))}" y="${f(dy(2) - DW / 2)}" width="${f(1.2 * S)}" height="${DW}"/>`);
  // Time Standards' reference clocks, one per deck, on the left trunk opposite its doors, since their fibre runs up it.
  const clock = (k, m, h = 2.2) => add(`<g class="clock"><rect x="${f(X(m - 0.3))}" y="${f(Yk(k, h + 0.6))}" width="${f(0.6 * S)}" height="${f(0.6 * S)}"/><circle cx="${f(X(m))}" cy="${f(Yk(k, h + 0.3))}" r="${f(0.12 * S)}"/></g>`);
  TRUNKS[0].forEach(([m, k0, k1], i) => { for (let k = k1; k <= k0; k++) clock(k, m - DOOR_SIDE[0][i] * (TW / 2 + 0.5)); });
  clock(1, 138.3, 2.8); clock(12, 127, 3.0);   // above lift machinery's motor; above fuel transfer's manifold
  // SIGMA's network: a line from the column along each of Decks 01 to 04, and down the access trunks (where the
  // risers run) to the lower decks. Each deck's line reaches its farthest terminal; a drop serves each one.
  {
    const DB = (k) => dy(k) + 2.875 * S;   // under the crawlways, above the water branches
    const COL = [197.5, 202.5];
    const run = (k) => (k >= 7 ? 0 : k >= 5 ? 1 : 2);
    const inTrunk = (t, i) => TRUNKS[t][i][0] - DOOR_SIDE[t][i] * 0.42;   // the trunk wall away from its doors
    const lines = [], risers = [], colDecks = new Set();
    for (const t of [0, 1]) {
      const side = TERMS.filter(([, m]) => (t ? m > 200 : m < 200))
        .map(([k, m]) => [k === 4 && (m < LIFTS[0] || m > LIFTS[1]) ? 3 : k, m, k]);   // hydroponics drops from Deck 03
      const low = Math.max(...side.map(([kl]) => kl));
      for (let k = 1; k <= low; k++) {
        const ms = side.filter(([kl]) => kl === k).map(([, m]) => m);
        if (k <= 4) { if (k === 4) ms.push(inTrunk(t, 2)); if (ms.length) { ms.push(COL[t]); colDecks.add(k); } }
        else if (ms.length || k === 5 || k === 7) ms.push(inTrunk(t, run(k)));
        if (k === 5) ms.push(inTrunk(t, 2));
        if (k === 7) ms.push(inTrunk(t, 1));
        if (ms.length > 1) lines.push(`M ${f(X(Math.min(...ms)))} ${f(DB(k))} H ${f(X(Math.max(...ms)))}`);
      }
      // Riser down the trunk runs, from Deck 04's line to the lowest deck with a terminal.
      // Drawn over the trunk shafts they run inside.
      risers.push(`M ${f(X(inTrunk(t, 2)))} ${f(DB(4))} V ${f(DB(5))}`, `M ${f(X(inTrunk(t, 1)))} ${f(DB(5))} V ${f(DB(7))}`);
      if (low > 7) risers.push(`M ${f(X(inTrunk(t, 0)))} ${f(DB(7))} V ${f(DB(low))}`);
      for (const [kl, m, k] of side) lines.push(`M ${f(X(m))} ${f(DB(kl))} V ${f(Yk(k, 1.7))}`);
    }
    for (const d of lines) GOLD.push(`<path class="data" d="${d}"/>`);
    for (const d of risers) add(`<path class="data" d="${d}"/>`);
    // Inside the column: a spine down its axis that every deck's line runs into, so they read as coming from SIGMA.
    const ks = [...colDecks];
    add(`<path class="data data-core" d="M ${f(X(200))} ${f(DB(Math.min(...ks)))} V ${f(DB(Math.max(...ks)))}${ks.map((k) => ` M ${f(X(COL[0]))} ${f(DB(k))} H ${f(X(COL[1]))}`).join("")}"/>`);
    for (const k of ks) add(`<circle class="data-node" cx="${f(X(200))}" cy="${f(DB(k))}" r="0.7"/>`);
    // Behind the two-storey hold, which hides them: dashed, as for anything deeper in the hull.
    add(`<clipPath id="hold-clip"><rect x="${f(X(105))}" y="${dy(9)}" width="${f((LIFTS[0] - LW / 2 - 105) * S)}" height="${f(dy(11) - dy(9))}"/></clipPath><g clip-path="url(#hold-clip)">`);
    for (const d of lines.concat(risers)) add(`<path class="data data-behind" d="${d}"/>`);
    add(`</g>`);
  }
  T.forEach((t) => tags.push(t));
}
// Lift doorways: only where a room on this face meets the shaft. Standard 3 m crew doors, like the airlocks';
// the cargo hallway's are 4 m, for loads coming up from the hold.
{
  const [l0, l1] = [LIFTS[0] - LW / 2, LIFTS[0] + LW / 2], [r0, r1] = [LIFTS[1] - LW / 2, LIFTS[1] + LW / 2];
  const door = (k, h = DOOR) => [dy(k + 1) - FL - h * S, dy(k + 1) - FL];
  const doors = [
    [l0, door(5)], [l1, door(5)], // Materials lab; R&D
    [l0, door(6)], [r1, door(6)], // lift lobbies and tram stops
    [l1, door(9)], [r0, door(9)], // ready rooms A and B
    [l0, door(10, 4)], [l1, door(10, 4)], // cargo hallway: storage one side, cargo ready room the other
    [r0, door(10)], [r0, door(11)], // docking control, bay workshop
    [r0, door(5)], [l1, door(7)], [r0, door(7)], // trap auxiliaries, turbine hall, backup generator hall
    [l1, door(6)], [r0, door(6)], // switch rooms A and B
    [l1, door(1)], [r0, door(1)], [l0, door(2)], [l1, door(2)], [r0, door(2)], [r1, door(2)], [l1, door(3)], [r0, door(3)], // decks 01 to 03
    [l0, door(4)], [l1, door(4)], [r0, door(4)], [r1, door(4)], [r1, door(5)], [l0, door(7)], [r1, door(7)], [l0, door(8)], [r1, door(8)], [r1, door(9)], [r1, door(10)], // decks 04 to 10
    [l0, door(11)], [r1, door(11)], // Deck 11: water tanks, waste plant
    [l0, door(12)], [l1, door(12)], [r0, door(12)], [r1, door(12)], // Deck 12: fuel transfer, tank halls, switchgear
  ];
  // Cargo airlock doors, a full deck high: the cargo door opens on vacuum, so locked; the inner door is unlocked.
  for (const [x, st] of [[bx, "door-locked"], [mx(CA), "door-open"]]) add(`<rect class="airlock ${st}" x="${f(x - DW / 2)}" y="${f(dy(10) + FL)}" width="${DW}" height="${f(doorBot(10) - dy(10) - FL)}"/>`);
  // Inner pressure doors, ready room to airlock: inside the pressurized station, so unlocked.
  for (const m of [BAY[0] - AL, BAY[1] + AL]) add(`<rect class="door door-open" x="${f(mx(m) - DW / 2)}" y="${f(door9Top)}" width="${DW}" height="${f(DOOR * S)}"/>`);
  for (const [m, k] of SHAFT_DOORS) doors.push([m, [dy(k + 1) - FL - 1.8 * S, dy(k + 1) - FL]]);
  for (const [m, k] of LANDING_DOORS) doors.push([m, door(k)]);
  for (const [m, [y0, y1]] of doors) add(`<rect class="door door-open" x="${f(mx(m) - DW / 2)}" y="${f(y0)}" width="${DW}" height="${f(y1 - y0)}"/>`);
}
// Air: a life support plant at each end of Deck 07 serves its own half. A riser beside each lift's outer wall,
// Deck 12 to 01, feeds a duct along every deck's service band. Each duct carries supply and return side by side.
{
  // Midway between the deck line and the power feeders; risers clear of the lift walls and the trunks' junction boxes.
  const DY = (k) => dy(k) + 0.8 * S, RIS = [131.6, 268.2];
  // Where each half's duct stops short of the middle: SIGMA's column, the chamber, the bay.
  const mid = (k) => (k <= 4 ? [197.5, 202.5] : k <= 7 ? [186, 214] : k <= 11 ? [BAY[0], BAY[1]] : [198.5, 201.5]);
  // Spans with no service band to run through: airlock plants, the two-storey hold and hydroponics, the cargo rooms.
  const SKIP = { 4: [[60, 133], [267, 340]], 8: [[133, 151], [249, 267]], 9: [[133, 151], [249, 267]], 10: [[105, 151]], 11: [[133, 151]] };
  const runs = [];
  for (let k = 1; k <= 12; k++) {
    const [c0, c1] = mid(k);
    for (const [a0, a1] of [[SPAN[k][0] + 1.5, c0], [c1, SPAN[k][1] - 1.5]]) {
      let segs = [[a0, a1]];
      for (const [s0, s1] of SKIP[k] || []) segs = segs.flatMap(([u, v]) => [[u, Math.min(v, s0)], [Math.max(u, s1), v]].filter(([p, q]) => q - p > 0.5));
      for (const [u, v] of segs) runs.push(`M ${f(mx(u))} ${f(DY(k))} H ${f(mx(v))}`);
    }
  }
  for (const m of RIS) runs.push(`M ${f(mx(m))} ${f(DY(1))} V ${f(DY(12))}`);
  // Drops from Deck 07's duct into the air handlers' tops.
  for (const m of [105, 115, 285, 295]) runs.push(`M ${f(mx(m))} ${f(DY(7))} V ${f(dy(8) - FL - 4.0 * S)}`);
  for (const d of runs) GOLD.push(`<path class="duct duct-o" d="${d}"/>`);
  for (const d of runs) GOLD.push(`<path class="duct duct-i" d="${d}"/>`);
  // The left riser runs behind the two-storey hold, which hides it: dashed, as for anything deeper in the hull.
  for (const e of [-0.23, 0.23]) add(`<line class="duct-behind" x1="${f(mx(RIS[0] + e))}" y1="${dy(9)}" x2="${f(mx(RIS[0] + e))}" y2="${dy(11)}"/>`);
}
// Fire suppression: one red network (mist for crewed rooms, inert gas for electronics, by zone). Each Deck 08 plant
// feeds a main along every deck's room ceilings via a riser beside its lift; Deck 12's main ties the halves together.
{
  // Lower on Deck 06, between the conduits and the tram; on Deck 07, below the halls' secondary loop; on Deck 09,
  // clear of the locked hatches in the ready rooms' low ceilings.
  const RY = (k) => dy(k) + ({ 6: 5.7, 7: 4.0, 9: 4.1 }[k] ?? 3.6) * S, WY = (k) => dy(k) + 3.2 * S, Yk = (k, h) => dy(k + 1) - FL - h * S;
  const RIS = [130.75, 268.95], HR = 1.0;
  // Every other line's straight runs, so red can hop wherever it crosses one without joining.
  const segs = [];
  const seg = (a, b, c, d) => { if (a === c || b === d) segs.push([Math.min(a, c), Math.min(b, d), Math.max(a, c), Math.max(b, d)]); };
  const collect = (s) => {
    const cls = (s.match(/^<(?:path|polyline|line) class="([^"]+)"/) || [])[1];
    if (!cls || !/^(grid-power|power|water|data|duct duct-o|duct-behind|tap)\b/.test(cls) || /data-core/.test(cls)) return;
    if (s.startsWith("<line")) return seg(...["x1", "y1", "x2", "y2"].map((a) => +s.match(new RegExp(` ${a}="([-0-9.]+)"`))[1]));
    if (s.startsWith("<polyline")) {
      const p = s.match(/points="([^"]+)"/)[1].trim().split(/\s+/).map((q) => q.split(",").map(Number));
      for (let i = 1; i < p.length; i++) seg(...p[i - 1], ...p[i]);
      return;
    }
    const t = s.match(/ d="([^"]+)"/)[1].match(/[MHVLA]|-?[\d.]+/g);
    let x = 0, y = 0;
    for (let i = 0; i < t.length;) {
      const c = t[i++];
      if (c === "M") { x = +t[i++]; y = +t[i++]; }
      else if (c === "H") { const n = +t[i++]; seg(x, y, n, y); x = n; }
      else if (c === "V") { const n = +t[i++]; seg(x, y, x, n); y = n; }
      else if (c === "L") { const nx = +t[i++], ny = +t[i++]; seg(x, y, nx, ny); x = nx; y = ny; }
      else if (c === "A") { i += 5; x = +t[i++]; y = +t[i++]; }
    }
  };
  [...svg, ...EARLY, ...GOLD, ...CRAWL].forEach(collect);
  // Crossings along a run, merged into one wider hop where they bunch together.
  const hops = (pos) => {
    const g = [];
    for (const p of [...new Set(pos)].sort((a, b) => a - b)) {
      if (g.length && p - g[g.length - 1][1] < 2 * HR + 0.4) g[g.length - 1][1] = p; else g.push([p, p]);
    }
    return g;
  };
  // Mains hop down, since the water branches run just above them; risers hop outward, away from the air ducts.
  const hRun = (x0, x1, y, up = false) => {
    const xs = segs.filter(([a, b, c, d]) => a === c && b < y - 0.3 && d > y + 0.3 && a > x0 + HR && a < x1 - HR).map((s) => s[0]);
    let d = `M ${f(x0)} ${f(y)}`;
    for (const [lo, hi] of hops(xs)) d += ` H ${f(lo - HR)} A ${f((hi - lo) / 2 + HR)} ${HR} 0 0 ${up ? 1 : 0} ${f(hi + HR)} ${f(y)}`;
    return { d: d + ` H ${f(x1)}`, xs };
  };
  const vRun = (x, y0, y1, right) => {
    const ys = segs.filter(([a, b, c, d]) => b === d && a < x - 0.3 && c > x + 0.3 && b > y0 + HR && b < y1 - HR).map((s) => s[1]);
    let d = `M ${f(x)} ${f(y0)}`;
    for (const [lo, hi] of hops(ys)) d += ` V ${f(lo - HR)} A ${HR} ${f((hi - lo) / 2 + HR)} 0 0 ${right ? 1 : 0} ${f(x)} ${f(hi + HR)}`;
    return d + ` V ${f(y1)}`;
  };
  const X = (m) => mx(m), red = [];
  // Mist tanks top up from the water supply: the left riser, and the right one where it passes Deck 08.
  for (const { k, tank: [m, h] } of FIRE_PLANTS) {
    const from = m < 200 ? 136.4 : LIFTS[1] + LW / 2 + 4.5;
    const { d } = hRun(Math.min(X(from), X(m)), Math.max(X(from), X(m)), WY(k), true);
    const w = `<path class="water" d="${d}"/><path class="water" d="M ${f(X(m))} ${f(WY(k))} V ${f(Yk(k, h))}"/>`;
    GOLD.push(w); collect(`<path class="water" d="${d}"/>`); collect(`<path class="water" d="M ${f(X(m))} ${f(WY(k))} V ${f(Yk(k, h))}"/>`);
  }
  // Mains stop where the air ducts do in the middle. Deck 03's main covers the two-storey hydroponics below it;
  // pod rooms are skipped, since the pods fill them and carry their own suppression.
  const mid = (k) => (k <= 4 ? [197.5, 202.5] : k <= 7 ? [186, 214] : k <= 11 ? [BAY[0], BAY[1]] : null);
  const SKIP = { 4: [[0, 133], [267, 400]], 9: [[0, 43], [357, 400]] };
  const mains = [];
  for (let k = 1; k <= 12; k++) {
    const lo = Math.min(SPAN[k][0] + 1.5, RIS[0]), hi = Math.max(SPAN[k][1] - 1.5, RIS[1]), c = mid(k);
    let spans = c ? [[lo, c[0]], [c[1], hi]] : [[lo, hi]];
    for (const [s0, s1] of SKIP[k] || []) spans = spans.flatMap(([u, v]) => [[u, Math.min(v, s0)], [Math.max(u, s1), v]].filter(([p, q]) => q - p > 0.5));
    for (const [u, v] of spans) mains.push([k, u, v]);
  }
  for (const m of RIS) red.push(vRun(X(m), RY(1), RY(12), m > 200));
  for (const { k, outlets } of FIRE_PLANTS) for (const [m, h] of outlets) red.push(`M ${f(X(m))} ${f(Yk(k, h))} V ${f(RY(k))}`);
  // Room walls and ladders at ceiling height, so nozzles land clear of them.
  const all = svg.join("");
  const walls = [...all.matchAll(/<rect class="room" x="([-0-9.]+)" y="([-0-9.]+)" width="([0-9.]+)" height="([0-9.]+)"/g)].map((r) => r.slice(1).map(Number));
  const ladders = [...all.matchAll(/<line class="ladder" x1="([-0-9.]+)" y1="([-0-9.]+)" x2="[-0-9.]+" y2="([-0-9.]+)"/g)].map((r) => r.slice(1).map(Number));
  const nozzles = [];
  for (const [k, u, v] of mains) {
    const { d, xs } = hRun(X(u), X(v), RY(k));
    red.push(d);
    const y = RY(k), edges = walls.filter(([, ry, , rh]) => ry < y && ry + rh > y).flatMap(([rx, , rw]) => [rx, rx + rw]);
    const avoid = [...xs, ...RIS.map(X), ...edges, ...ladders.filter(([, a, b]) => Math.min(a, b) < y + 2 && Math.max(a, b) > y - 1).map((l) => l[0]), ...LIFTS.flatMap((L) => [X(L - LW / 2), X(L), X(L + LW / 2)])];
    const inHold = (x) => (k === 9 || k === 10) && x > X(105) && x < X(LIFTS[0] - LW / 2);
    for (let m = u + 4; m < v - 1; m += 8) {
      const x = X(m);
      if (!inHold(x) && avoid.every((a) => Math.abs(a - x) > 1.8)) nozzles.push(`M ${f(x)} ${f(y)} V ${f(y + 0.9)} M ${f(x - 0.6)} ${f(y + 1.5)} L ${f(x + 0.6)} ${f(y + 1.5)} L ${f(x)} ${f(y + 0.8)} Z`);
    }
  }
  for (const d of red) GOLD.push(`<path class="fire" d="${d}"/>`);
  for (const d of nozzles) GOLD.push(`<path class="fire-nozzle" d="${d}"/>`);
  // Behind the two-storey hold, which hides them: dashed, as for anything deeper in the hull.
  add(`<g clip-path="url(#hold-clip)">`);
  for (const d of red) add(`<path class="fire fire-behind" d="${d}"/>`);
  add(`</g>`);
}
svg.splice(goldAt, 0, ...EARLY, ...GOLD, ...CRAWL);
// Centre each room tag side to side in the smallest room outline that holds it. Full-height rooms put it in one row
// per deck, near the top, clear of the kit; low rooms keep theirs centred.
{
  const rooms = [...svg.join("").matchAll(/<rect class="room" x="([-0-9.]+)" y="([-0-9.]+)" width="([0-9.]+)" height="([0-9.]+)"/g)].map((r) => r.slice(1).map(Number));
  for (let i = 0; i < tags.length; i++) {
    const t = tags[i].match(/^<g class="tag sm"><circle cx="([-0-9.]+)" cy="([-0-9.]+)"/);
    if (!t) continue;
    const [cx, cy] = [+t[1], +t[2]];
    const hits = rooms.filter(([x, y, w, h]) => cx > x && cx < x + w && cy > y && cy < y + h).sort((a, b) => a[2] * a[3] - b[2] * b[3]);
    if (!hits.length) { console.warn("no room for tag at", cx, cy); continue; }
    const [x, y, w, h] = hits[0], nx = x + w / 2, ny = h > DH * 0.9 ? y + DH / 2 - 4.5 : cy;
    if (process.env.TAGLOG && (Math.abs(nx - cx) > 0.5 || Math.abs(ny - cy) > 0.5)) console.log(tags[i].match(/>([^<]+)<\/text>/)[1], f(cx), f(cy), "->", f(nx), f(ny));
    tags[i] = tags[i].replace(/cx="[-0-9.]+" cy="[-0-9.]+"/, `cx="${f(nx)}" cy="${f(ny)}"`).replace(/<text x="[-0-9.]+" y="[-0-9.]+"/, `<text x="${f(nx)}" y="${f(ny + 1.75)}"`);
  }
}
tags.forEach(add);
add(hereMarker);

// Scale: length ruler and hull height.
const ry = f(Y1 + 22);
add(`<line class="ruler" x1="${X0}" y1="${ry}" x2="${X1}" y2="${ry}"/>`);
for (let m = 0; m <= L; m += 50) {
  add(`<line class="ruler" x1="${mx(m)}" y1="${f(ry - 4)}" x2="${mx(m)}" y2="${f(ry + 4)}"/>`);
  add(`<text class="t-scale" x="${mx(m)}" y="${f(ry + 16)}" text-anchor="middle">${m === L ? '400 m' : m}</text>`);
}
// The ruler carries on past a small gap at each end, arrows pointing on along the array.
// Forward is the right end, where the array focuses its node; the aft end is the counter-resonator.
for (const [x0, x1, end] of [[X0 - 8, 8, "Aft · counter-resonator"], [X1 + 8, X1 + 152, "Forward · node focus"]]) {
  const d = x1 > x0 ? 1 : -1;
  add(`<line class="ruler" x1="${x0}" y1="${ry}" x2="${x1}" y2="${ry}"/><polyline class="ruler arrow" points="${x1 - 5 * d},${f(ry - 3)} ${x1},${ry} ${x1 - 5 * d},${f(ry + 3)}"/>`);
  // Fixed length (the shorter left extension) so both labels fit and match, whatever font loads.
  add(`<text class="t-note t-array" x="${f((x0 + x1) / 2)}" y="${f(ry - 5)}" text-anchor="middle" textLength="${f(X0 - 20)}" lengthAdjust="spacingAndGlyphs">Array continues ~650 metres</text>`);
  add(`<text class="t-note t-array t-strong" x="${f((x0 + x1) / 2)}" y="${f(ry - 13)}" text-anchor="middle">${end}</text>`);
}
const hx = X1 + 110;
add(`<line class="ruler" x1="${hx}" y1="${Y0}" x2="${hx}" y2="${f(Y1)}"/><line class="ruler" x1="${hx - 4}" y1="${Y0}" x2="${hx + 4}" y2="${Y0}"/><line class="ruler" x1="${hx - 4}" y1="${f(Y1)}" x2="${hx + 4}" y2="${f(Y1)}"/>`);
add(`<text class="t-scale" x="${hx + 8}" y="${f(hullMid + 3)}">~96 m</text>`);

const W = hx + 50, H = f(ry + 26);

const html = `<title>Dovetail-9 Hull Section</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
  /* Layout: one wide to-scale drawing, the station's own amber-on-black, with the record of decisions below. */
  :root {
    --bg: #0b0c0d; --panel: #111315; --line: #2a2d30; --deck: #1d2023; --service: #0e1011;
    --fg: #e8e4da; --muted: #8c8880; --accent: #e8a33d; --void: #030405; --ship: #a8a49a;
    --open: #9fc7c2; --locked: #e5534b; --unlocked: #57b36a; --gold: #d6b44c; --leaf: #5ee35a; --air: #a9a3f0; --data: #e070d0; --fire: #ff2626;
    --display: "Chakra Petch", "Segoe UI", sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    color-scheme: dark;
  }
  @media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69; --locked: #b42318; --unlocked: #1f7a3a; --gold: #8a6c00; --leaf: #2e9a2a; --air: #5a4fc4; --data: #a0308f; --fire: #e8000b;
    color-scheme: light; } }
  :root[data-theme="light"] {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69; --locked: #b42318; --unlocked: #1f7a3a; --gold: #8a6c00; --leaf: #2e9a2a; --air: #5a4fc4; --data: #a0308f; --fire: #e8000b;
    color-scheme: light; }
  body { background: var(--bg); color: var(--fg); font: 14px/1.6 var(--mono);
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 28px 48px; }
  .wrap { max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
  header { display: flex; flex-direction: column; gap: 6px; }
  .eyebrow { font-size: 11px; letter-spacing: 0.16em; color: var(--muted); }
  h1 { margin: 0; font: 600 30px/1.15 var(--display); letter-spacing: 0.04em; text-wrap: balance; }
  .lede { margin: 0; max-width: 68ch; color: var(--muted); }
  .sheet { overflow-x: auto; border: 1px solid var(--line); border-radius: 6px; background: var(--panel); }
  .sheet svg { display: block; width: 100%; height: auto; }
  .viewport svg#hull { width: 100%; height: 100%; }
  .viewport { position: relative; height: clamp(360px, 72vh, 820px); overflow: hidden; touch-action: none; cursor: grab; outline-offset: -2px; }
  .viewport.dragging { cursor: grabbing; }
  .zoom { position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; align-items: center; z-index: 1; }
  .zoom button { min-width: 30px; height: 30px; padding: 0 8px; font: 500 14px var(--mono); color: var(--fg); background: var(--panel); border: 1px solid var(--line); border-radius: 4px; cursor: pointer; }
  .zoom button:hover { border-color: var(--muted); }
  .zoom output { min-width: 44px; text-align: right; font: 400 11px var(--mono); color: var(--muted); }
  .zoom-hint { margin: 0; padding: 6px 14px 0; font-size: 11px; color: var(--muted); }
  .layers { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; margin: 0; padding: 8px 14px 0; border: 0; font-size: 12px; color: var(--muted); }
  .layers legend { float: left; margin-right: 4px; padding: 0; font-size: 11px; letter-spacing: 0.12em; }
  .layers label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
  .layers input { margin: 0; accent-color: var(--accent); }
  /* Each layer hides by a class on the drawing, so the legend's swatches never change. */
  #hull.hide-power :is(.power, .grid-power, .power-node),
  #hull.hide-data :is(.data, .data-node),
  #hull.hide-air :is(.duct, .duct-behind),
  #hull.hide-fire :is(.fire, .fire-nozzle),
  #hull.hide-water :is(.water, .water-waste, .water-hidden, .tank-potable, .tank-waste),
  #hull.hide-access :is(.crawl, .junction, .shaft, .ladder, .rung, .hatch),
  #hull.hide-doors :is(.door, .airlock),
  #hull.hide-equipment :is(.plant, .racks, .term, .term-screen, .clock, .gantry, .clamp, .trap, .shell, .emitter, .radiator, .radline, .busbar, .frost, .plant-leaf) { display: none; }
  .hull-fill { fill: var(--bg); }
  .hull-edge { fill: none; stroke: var(--muted); stroke-width: 1.2; }
  .service { fill: var(--service); }
  .deck-line { stroke: var(--deck); stroke-width: 1; }
  .grid { stroke: var(--deck); stroke-width: 0.6; stroke-dasharray: 2 3; }
  .truss line, .truss polyline { stroke: var(--muted); stroke-width: 0.9; fill: none; }
  .mast { stroke: var(--deck); stroke-width: 1.4; fill: none; }
  .mast-thin { stroke: var(--deck); stroke-width: 0.8; fill: none; }
  .spire-block { fill: var(--bg); stroke: var(--deck); stroke-width: 1; }
  .dish { fill: var(--bg); stroke: var(--deck); stroke-width: 0.9; }
  .mast-light { fill: #ff3b30; filter: drop-shadow(0 0 2px #ff3b30) drop-shadow(0 0 6px rgba(255, 59, 48, 0.7)); animation: beacon 3.2s ease-in-out infinite; }
  .ring { fill: var(--bg); stroke: var(--muted); stroke-width: 1.2; }
  .truss-light { fill: var(--accent); filter: drop-shadow(0 0 2px var(--accent)) drop-shadow(0 0 5px var(--accent)); animation: marker 1.3s ease-in-out infinite; }
  @keyframes marker { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
  @keyframes beacon { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
  @media (prefers-reduced-motion: reduce) { .mast-light, .truss-light { animation: none; } }
  .tram { stroke: var(--accent); stroke-width: 2; stroke-dasharray: 9 4; }
  .power, .grid-power { fill: none; stroke: var(--gold); stroke-width: 0.6; stroke-linejoin: round; }
  .power-node { fill: var(--gold); }
  .power.tram-behind { stroke-opacity: 0.45; }
  .tram-behind { stroke-opacity: 0.3; }
  .rung { stroke: var(--muted); stroke-width: 0.3; }
  .data { fill: none; stroke: var(--data); stroke-width: 0.5; }
  .data-core { stroke-width: 0.7; }
  .data-node { fill: var(--data); }
  .data-behind { stroke-width: 0.4; stroke-dasharray: 1.2 0.9; }
  .fire { fill: none; stroke: var(--fire); stroke-width: 0.5; stroke-linejoin: round; }
  .fire-behind { stroke-width: 0.4; stroke-dasharray: 1.2 0.9; }
  .fire-nozzle { fill: var(--fire); stroke: var(--fire); stroke-width: 0.3; stroke-linejoin: round; }
  .duct { fill: none; stroke-linecap: square; }
  .duct-o { stroke: var(--air); stroke-width: 1.1; }
  .duct-i { stroke: var(--bg); stroke-width: 0.4; }
  .duct-behind { stroke: var(--air); stroke-width: 0.35; stroke-dasharray: 1.2 0.9; }
  .shaft { fill: var(--bg); stroke: var(--deck); stroke-width: 1; }
  .lift { fill: none; stroke: var(--muted); stroke-width: 0.9; }
  .behind { fill: none; stroke: var(--muted); stroke-width: 0.9; stroke-dasharray: 3 2; }
  .stop { fill: var(--muted); }
  .room { fill: none; stroke: var(--muted); stroke-width: 1; }
  .section { fill: none; stroke: var(--muted); stroke-width: 1; }
  .conduit { stroke: var(--muted); stroke-width: 1.4; }
  .core { fill: var(--bg); stroke: var(--fg); stroke-width: 1; stroke-dasharray: 4 3; }
  .singularity { fill: var(--fg); }
  .bay { fill: var(--bg); stroke: var(--muted); stroke-width: 1; }
  .ship rect, .ship path { fill: var(--panel); stroke: var(--ship); stroke-width: 1; }
  .gantry rect { fill: var(--bg); stroke: var(--muted); stroke-width: 1; }
  .gantry line { stroke: var(--muted); stroke-width: 0.8; }
  .gantry polyline { fill: none; stroke: var(--muted); stroke-width: 1.4; }
  .platform { fill: var(--muted); }
  .dock-leg { stroke: var(--muted); stroke-width: 1; }
  .ladder { fill: none; stroke: var(--muted); stroke-width: 0.35; }
  .room-wall { stroke: var(--muted); stroke-width: 1; }
  .crawl { fill: var(--panel); stroke: var(--muted); stroke-width: 0.7; }
  .junction { fill: var(--panel); stroke: var(--fg); stroke-width: 0.5; }
  .term { fill: var(--panel); stroke: var(--fg); stroke-width: 0.4; }
  .clock rect { fill: var(--panel); stroke: var(--fg); stroke-width: 0.4; }
  .clock circle { fill: var(--accent); }
  .tap { stroke: var(--muted); stroke-width: 0.9; }
  .term-screen { fill: var(--accent); stroke: var(--fg); stroke-width: 0.4; }
  .plant-leaf { fill: var(--leaf); stroke: none; }
  .water, .water-waste, .water-hidden { fill: none; stroke: var(--open); stroke-width: 0.6; stroke-linejoin: round; }
  .tank-potable { fill: var(--panel); stroke: var(--open); stroke-width: 0.6; }
  .tank-waste { fill: var(--panel); stroke: var(--muted); stroke-width: 0.6; }
  .shell { fill: none; stroke: var(--muted); stroke-width: 0.6; stroke-dasharray: 2 2; }
  .trap { fill: var(--panel); stroke: var(--fg); stroke-width: 0.6; }
  .busbar { fill: none; stroke: var(--muted); stroke-width: 1.4; }
  .emitter { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .radiator { fill: none; stroke: var(--muted); stroke-width: 0.5; }
  .radline { fill: none; stroke: var(--muted); stroke-width: 0.6; stroke-dasharray: 4 1 1 1; }
  .frost { fill: none; stroke: var(--open); stroke-width: 0.4; }
  .hot circle { fill: var(--accent); }
  .hot .hot-hub { fill: var(--bg); }
  .hold-floor { stroke: var(--muted); stroke-width: 1; }
  .hold { fill: none; stroke: var(--muted); stroke-width: 1; }
  .hold-mask { fill: var(--bg); }
  .racks .upright { stroke: var(--muted); stroke-width: 0.9; }
  .racks .shelf { stroke: var(--muted); stroke-width: 0.9; }
  .racks .chord { stroke: var(--muted); stroke-width: 0.5; }
  .racks .web { fill: none; stroke: var(--muted); stroke-width: 0.4; }
  .racks .brace { stroke: var(--muted); stroke-width: 0.4; stroke-opacity: 0.7; }
  .racks .crate { fill: var(--line); stroke: var(--muted); stroke-width: 0.5; }
  .racks .kit { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .racks .reel { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .plant rect, .plant circle { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .plant line { stroke: var(--muted); stroke-width: 0.5; }
  .plant .flange { stroke-width: 0.35; }
  .plant .pipe { stroke-width: 0.45; }
  .plant .hidden { stroke-dasharray: 1.2 0.9; }
  .plant .pipe-o { fill: none; stroke: var(--muted); stroke-width: 1.65; }
  .plant .pipe-i { fill: none; stroke: var(--panel); stroke-width: 0.75; }
  .clamp rect, .clamp circle { fill: var(--bg); stroke: var(--muted); stroke-width: 1; }
  .umbilical { fill: none; stroke: var(--ship); stroke-width: 0.9; stroke-dasharray: 3 2; }
  .airlock, .door { fill: var(--ship); }
  .door-open { fill: var(--unlocked); }
  .door-locked { fill: var(--locked); }
  .window { fill: var(--bg); stroke: var(--ship); stroke-width: 0.4; }
  .ruler { stroke: var(--muted); stroke-width: 0.9; }
  .arrow { fill: none; }
  .t-array { font-size: 6.8px; }
  .t-deck { font: 500 8px var(--mono); fill: var(--muted); letter-spacing: 0.06em; }
  .t-label { font: 600 9.5px var(--display); fill: var(--fg); letter-spacing: 0.12em; }
  .t-accent { fill: var(--accent); }
  .t-note { font: 400 7.5px var(--mono); fill: var(--muted); }
  .t-ship { fill: var(--ship); }
  .t-strong { fill: var(--fg); }
  .t-watermark { font: 600 16px var(--display); fill: var(--fg); fill-opacity: 0.14; pointer-events: none; }
  .t-deck-num { font-size: 13px; }
  .t-room { font-size: 11px; letter-spacing: 0.12em; stroke: var(--bg); stroke-width: 3px; stroke-linejoin: round; paint-order: stroke; }
  .t-scale { font: 400 8px var(--mono); fill: var(--muted); font-variant-numeric: tabular-nums; }
  .tag circle { fill: var(--panel); stroke: var(--muted); stroke-width: 0.9; }
  .sl-bg { fill: var(--bg); }
  .sl-ring { fill: none; stroke: var(--fg); stroke-width: 0.9; }
  .sl-red { fill: none; stroke: #c81c19; stroke-width: 0.9; }
  .sl-sigma { fill: none; stroke: var(--fg); stroke-width: 1.1; stroke-linejoin: miter; }
  .tag text { font: 600 6.5px var(--mono); fill: var(--fg); }
  .tag.sm text { font-size: 5px; letter-spacing: 0; }   /* inherited spacing pushes text-anchor off centre */
  .tag.sm circle { stroke-width: 0.7; }
  .legend { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 6px 24px; padding: 10px 14px; border-top: 1px solid var(--line); }
  .legend ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; }
  .legend li { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
  .sheet .swatch { display: inline-block; width: 28px; min-width: 0; height: 12px; flex: none; overflow: visible; }
  .here-ring { fill: none; stroke: #9fc7c2; stroke-width: 1.2; transform-box: fill-box; transform-origin: center; animation: here-ping 2.4s ease-out infinite; }
  @keyframes here-ping { from { transform: scale(0.6); opacity: 0.9; } to { transform: scale(1.8); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .here-ring { animation: none; opacity: 0.35; } }
  .sigma-core { fill: var(--bg); stroke: var(--muted); stroke-width: 1; }
  .caption { margin: 0; padding: 10px 14px; border-top: 1px solid var(--line); font-size: 12px; color: var(--muted); }
  .record { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
  .record section { min-width: 0; display: flex; flex-direction: column; gap: 10px; }
  .record h2 { margin: 0; display: flex; align-items: center; gap: 10px; font: 600 13px var(--display); letter-spacing: 0.14em; }
  .tag { font: 500 10px var(--mono); letter-spacing: 0.08em; padding: 1px 7px; border-radius: 3px; border: 1px solid currentColor; }
  .settled { color: var(--fg); } .proposed { color: var(--accent); } .open { color: var(--open); }
  .record ul { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .record li { padding-left: 14px; border-left: 2px solid var(--line); font-size: 13px; }
  .record li b { font-weight: 500; color: var(--fg); }
  .record li { color: var(--muted); }
</style>
<div class="wrap">
  <header>
    <span class="eyebrow">DOVETAIL-9 · MAIN HULL · SIDE VIEW · DRAFT</span>
    <h1>Hull section, decks 01 to 12</h1>
    <p class="lede">Looking at the side of the hull where the docking bay opens. Drawn to scale: 400 m at its longest, 12 decks of about 8 m each. The profile is stepped like the exterior image: tiers on top, full length through the middle decks where the array attaches, modules hanging below.</p>
  </header>
  <figure class="sheet" style="margin: 0">
    <div class="viewport" id="hull-viewport" tabindex="0" aria-label="Hull drawing. Scroll or pinch to zoom, drag to pan; plus, minus and zero keys also work.">
    <div class="zoom" role="group" aria-label="Zoom">
      <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
      <button type="button" data-zoom="out" aria-label="Zoom out">−</button>
      <button type="button" data-zoom="fit" aria-label="Fit whole drawing">Fit</button>
      <output id="hull-zoom-level" aria-live="polite">100%</output>
    </div>
    <svg id="hull" viewBox="0 0 ${W} ${H}" role="img" aria-label="Side view of the Dovetail-9 hull: twelve decks stacked, numbered from the top. A tram runs the full length of Deck 06, beside the conduits and keel. The Core Chamber, a dashed sphere, sits at the middle of the hull across Decks 05 to 07 inside the engineering section. The docking bay is an open space across Decks 08 to 11, centred along the hull under the stepped superstructure, holding the Mistral, seen from astern, with a boarding umbilical to Airlock B on Deck 09. Two jagged comms spires on top, a taller one left of centre and a shorter twin-tipped one to its right, with smaller masts and dishes around them, and the Anchor Core array continuing from both ends.">
      ${svg.join('\n      ')}
    </svg>
    </div>
    <fieldset class="layers" id="hull-layers">
      <legend>LAYERS</legend>
      <label><input type="checkbox" value="power" checked>Power</label>
      <label><input type="checkbox" value="water" checked>Water</label>
      <label><input type="checkbox" value="air" checked>Air</label>
      <label><input type="checkbox" value="data" checked>SIGMA network</label>
      <label><input type="checkbox" value="fire" checked>Fire suppression</label>
      <label><input type="checkbox" value="access" checked>Maintenance access</label>
      <label><input type="checkbox" value="doors" checked>Doors and hatches</label>
      <label><input type="checkbox" value="equipment" checked>Equipment</label>
    </fieldset>
    <p class="zoom-hint">Scroll or pinch to zoom, drag to pan.</p>
<div class="legend">
      <ul aria-label="Room key">
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true">${sigmaLogo(14, 6, 5.5)}</svg>SIGMA&apos;s core, Decks 01 to 04</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">1</text></g></svg>SIGMA operations room, Deck 04</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">2</text></g></svg>R&amp;D, Deck 05: Node Physics, the damped test cell</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">3</text></g></svg>Experiment control, Deck 05</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">4</text></g></svg>Lift lobby and tram stop, Deck 06</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">5</text></g></svg>Bank A capacitor hall, Deck 07</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">6</text></g></svg>Bank B capacitor hall, Deck 07</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">A</text></g></svg>Airlock A, Deck 09, its umbilical pulled back</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">B</text></g></svg>Airlock B, Deck 09: the umbilical to the Mistral</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">7</text></g></svg>Ready room, from the lift to each airlock: Deck 09, and Deck 10 for cargo</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">8</text></g></svg>Cargo hold, Decks 09 to 10: truss shelving, a ceiling crane</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">9</text></g></svg>Cargo dock, raised a deck above the bay floor</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">C</text></g></svg>Cargo airlock, Deck 10, inside the cargo door</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">10</text></g></svg>Docking control, Deck 10: a wide window and control desk</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">11</text></g></svg>Bay workshop, Deck 11: bench, parts cabinet, a window onto the bay</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">12</text></g></svg>Fuel transfer pumps and filters, Deck 12</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">13</text></g></svg>Fuel tank halls, Deck 12</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">14</text></g></svg>Backup fuel cells, hydrogen and oxygen, Deck 12, piped up to hose stations in the bay</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">15</text></g></svg>Switchgear and batteries, Deck 12</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">16</text></g></svg>Water recovery plant, Deck 11: filters, reactor, reverse osmosis, UV</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">17</text></g></svg>Water tanks, Deck 11: four potable, two wastewater</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">18</text></g></svg>Waste plant, Deck 11: urine distiller, brine, digester</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">19</text></g></svg>Observation gallery, Deck 05, a viewport into the chamber</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">20</text></g></svg>Cryogenic plant, Deck 05: keeps the X9's coils cold</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">21</text></g></svg>Trap auxiliaries, Deck 05: charge injectors, position control</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">22</text></g></svg>Harvest Ring turbine hall, Deck 07: the station's main power</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">23</text></g></svg>Backup generator set, Deck 07: feeds the isolated backup bus</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">24</text></g></svg>Penetration vaults, Deck 06: conduits leave the dome; dampening coil drivers</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">25</text></g></svg>Switch room A, Deck 06: Bus A, the primary bus</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">26</text></g></svg>Switch room B, Deck 06: Bus B, backup and the X9's auxiliaries</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">27</text></g></svg>Lift machinery, Deck 01</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">28</text></g></svg>Command, Deck 01, around SIGMA's column</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">29</text></g></svg>Comms room and the beacon, Deck 01</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">30</text></g></svg>Administration and records, Deck 01</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">31</text></g></svg>Senior staff suites, Deck 02: Level 6, each with a private washroom</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">32</text></g></svg>Galley, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">33</text></g></svg>Mess, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">34</text></g></svg>Recreation lounge, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">35</text></g></svg>Laundry and stores, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">36</text></g></svg>Hydroponics, Decks 03 to 04, two storeys</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">37</text></g></svg>Medical clinic, Deck 03</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">38</text></g></svg>Science office, Deck 03: the Director&apos;s office, briefing room, records</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">39</text></g></svg>Crew cabins, stacked two high with a stair at each end: singles for senior grades, doubles with bunks for juniors</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">40</text></g></svg>Escape pods: 14 lifeboats, hatches under lockdown</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">41</text></g></svg>Materials lab, Deck 05: fatigue rig, spectrometer</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">42</text></g></svg>Array access, Deck 06: airlock, suits, tools</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">43</text></g></svg>Life support, Deck 07: oxygen, CO₂ scrubbing, air handling</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">44</text></g></svg>Maintenance shops, Deck 07</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">45</text></g></svg>Security: office, armoury, holding cell, Deck 08</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">46</text></g></svg>Fire and emergency stores, Deck 08</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">57</text></g></svg>Fire suppression plant, Deck 08, one at each end: mist tank and pumps, inert gas cylinders</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">47</text></g></svg>Gym, Deck 08</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">48</text></g></svg>Logistics stores, Deck 10</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">49</text></g></svg>Recycling and sorting, Deck 11</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">50</text></g></svg>Time standards lab, Deck 05: the master clocks</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">51</text></g></svg>Corridor analysis, Deck 05: Stratovan analyzers, the phase map</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">52</text></g></svg>Array receiver room, Deck 05: the forward array&apos;s sensors</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">53</text></g></svg>Exposure lab, Deck 03: neural rhythms, cultures, growth chambers</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">54</text></g></svg>Washroom: toilets, showers, sinks</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">55</text></g></svg>Common room for each cabin block</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">56</text></g></svg>Pod muster station, Deck 09: benches, emergency lockers, pod status board</li>
      </ul>
      <ul aria-label="Line styles">
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="behind" x1="2" y1="6" x2="26" y2="6"/></svg>Deeper in the hull than this face</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="lift" x1="9" y1="0" x2="9" y2="12"/><line class="lift" x1="19" y1="0" x2="19" y2="12"/><circle class="stop" cx="14" cy="6" r="1.8"/><rect class="door door-open" x="18.5" y="2" width="1" height="8"/></svg>Lift stop and doorway</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="tram" x1="2" y1="6" x2="26" y2="6"/></svg>Tram, Deck 06</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="conduit" x1="2" y1="6" x2="26" y2="6"/></svg>Conduits and keel</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="grid-power" d="M 2 7 H 12 A 2 2 0 0 1 16 7 H 26 M 14 1 V 12"/></svg>Station power grid; a hop where two lines cross without joining</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="shaft" x="9" y="0" width="10" height="12"/><line class="rung" x1="10" y1="4" x2="18" y2="4"/><line class="rung" x1="10" y1="8" x2="18" y2="8"/></svg>Access shaft with ladder (engineering)</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="crawl" x="1" y="1" width="26" height="3"/><rect class="shaft" x="11.5" y="2.5" width="5" height="9.5"/><line class="ladder" x1="13" y1="3" x2="13" y2="12"/><line class="ladder" x1="15" y1="3" x2="15" y2="12"/><rect class="junction" x="10" y="0" width="8" height="5"/><rect class="door door-open" x="12" y="1.2" width="4" height="2.6"/></svg>Maintenance access: crawlway, vertical way, junction box and hatch</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="plant"><rect x="2" y="1" width="24" height="3"/><line class="flange" x1="10" y1="1" x2="10" y2="4"/><line class="flange" x1="18" y1="1" x2="18" y2="4"/><rect x="4" y="6" width="6" height="5.5" rx="1.5"/><circle cx="16" cy="9" r="2.2"/><line class="pipe" x1="21" y1="6" x2="21" y2="12"/></g></svg>Airlock machinery, locked hatch from each ready room</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="plant"><line class="pipe hidden" x1="2" y1="5" x2="26" y2="5"/><line class="pipe hidden" x1="2" y1="7.5" x2="26" y2="7.5"/></g></svg>Pipes hidden inside a wall</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="window" x="13.5" y="1" width="1" height="10"/></svg>Window</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><circle class="shell" cx="14" cy="6" r="5"/><rect class="trap" x="11" y="4.5" width="6" height="3" rx="1"/></svg>Core shells and the trap housing</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><polyline class="busbar" points="2,8 9,8 9,4 19,4 19,8 26,8"/></svg>Dog-leg power penetration</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="radline" x1="2" y1="6" x2="26" y2="6"/></svg>Radiator coolant loop</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="radiator" x="4" y="1" width="9" height="4"/><rect class="radiator" x="15" y="1" width="9" height="4"/><rect class="emitter" x="12.8" y="6" width="2.4" height="4"/></svg>Radiator panels and emitters on the array</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="emitter" x="12.8" y="5" width="2.4" height="2.2"/></svg>Harmonic emitter along the conduits</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="hot"><circle cx="14" cy="6" r="2.6"/><circle class="hot-hub" cx="14" cy="6" r="0.7"/></g></svg>Radiation hot spot, left by the accident</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="frost" d="M 8 4 l 3 3 m 0 -3 l -3 3 M 17 4 l 3 3 m 0 -3 l -3 3"/></svg>Frost on cryogenic lines</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="term" x="13.6" y="6" width="0.8" height="6"/><rect class="term-screen" x="10.5" y="1.5" width="7" height="4.5"/></svg>SIGMA terminal</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="clock"><rect x="10" y="2" width="8" height="8"/><circle cx="14" cy="6" r="1.6"/></g></svg>Reference clock, one on every deck</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="tap" x1="14" y1="0" x2="14" y2="12"/></svg>Branch up from the conduits: R&amp;D&apos;s tap, the receivers&apos; feed</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="water" d="M 2 7 H 12 A 2 2 0 0 1 16 7 H 26 M 14 1 V 12"/></svg>Water lines; a hop where two cross without joining</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="duct duct-o" d="M 3 6 H 25"/><path class="duct duct-i" d="M 3 6 H 25"/></svg>Air duct, supply and return in one casing; dashed behind the hold</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="data" d="M 3 6 H 25"/></svg>SIGMA network, from the core to every terminal</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="fire" d="M 3 3 H 25"/><path class="fire-nozzle" d="M 14 3 V 5.5 M 12.3 7.2 L 15.7 7.2 L 14 5.2 Z"/></svg>Fire suppression main along each ceiling, a nozzle in every room; dashed behind the hold</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="tank-potable" d="M 5 12 V 4 Q 5 1 9 1 Q 13 1 13 4 V 12 Z"/><path class="tank-waste" d="M 15 12 V 4 Q 15 1 19 1 Q 23 1 23 4 V 12 Z"/></svg>Water tanks: potable, wastewater</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="door door-open" x="12" y="1" width="4" height="10"/></svg>Door, unlocked as Quell finds it</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="door door-locked" x="12" y="1" width="4" height="10"/></svg>Door, locked as Quell finds it</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="ladder" x1="13" y1="0" x2="13" y2="12"/><line class="ladder" x1="15" y1="0" x2="15" y2="12"/><line class="rung" x1="13" y1="3" x2="15" y2="3"/><line class="rung" x1="13" y1="6" x2="15" y2="6"/><line class="rung" x1="13" y1="9" x2="15" y2="9"/></svg>Open ladder, cargo dock to bay floor</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="clamp"><rect x="11" y="0" width="2.4" height="8.5"/><circle cx="12.2" cy="4" r="1.6"/><rect x="8.5" y="8.5" width="7.4" height="2.2"/></g></svg>Docking clamp, four in all</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="gantry"><rect x="2" y="0.5" width="24" height="2"/><rect x="10" y="2.5" width="6" height="2.5"/><line x1="13" y1="5" x2="13" y2="9"/><polyline points="10,11.5 10,9 16,9 16,11.5"/></g></svg>Gantry crane on its ceiling rail</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="4"/></g><g class="here"><circle class="here-ring" cx="14" cy="6" r="5"/></g></svg>You are here</li>
      </ul>
    </div>
    <figcaption class="caption">Each deck: about 5 m floor to ceiling (dark band) plus about 3 m of service space above it (lighter band); floors sit on the deck lines. Doors between rooms are left to the deck plans. Each capacitor hall charges from the chamber and feeds the emitters along the Deck 06 conduits. Heights come from the exterior image. Lengths don't: the image sees the hull at an angle, so how long each deck runs and where the masts stand are first guesses. The bay is centred under the superstructure.</figcaption>
  </figure>
  <div class="record">
    <section>
      <h2><span class="tag settled">SETTLED</span></h2>
      <ul>
        <li><b>Hull</b> about 400 m long, 90 to 100 m tall.</li>
        <li><b>12 decks</b>, about 5 m floor to ceiling, service spaces between.</li>
        <li><b>Decks are shared.</b> The bay and the tram take a section of their decks; the rest holds other rooms and corridors.</li>
        <li><b>Tram</b> runs the full length on Deck 06 only.</li>
        <li><b>Lifts</b> between decks, <b>access shafts</b> vertical and horizontal, <b>corridors</b> on every deck.</li>
      </ul>
    </section>
    <section>
      <h2><span class="tag proposed">PROPOSED</span></h2>
      <ul>
        <li><b>Decks numbered from the top.</b> Deck 01 under the antennas.</li>
        <li><b>Hull about 100 m wide</b>, roughly square in cross-section. The bay reaches ~70 m in, nose first.</li>
        <li><b>Core Chamber</b> at the middle of the hull, Decks 05 to 07, the black hole at the middle of Deck 06.</li>
        <li><b>Deck 06 is the spine:</b> keel, conduits out to both arrays, and the tram passing beside the chamber.</li>
        <li><b>Engineering</b> around the chamber, 137 to 263 m along on Decks 05 to 07, meeting both lift shafts, with two vertical access shafts through it, one either side of the chamber.</li>
        <li><b>Two lift cores</b> at about 135 m and 265 m, the only positions that reach all 12 decks.</li>
        <li><b>SIGMA&apos;s core</b>: a 5 m column on the chamber&apos;s axis, from Deck 04 up into command on Deck 01, operations room at its base.</li>
        <li><b>Experiment control</b> on Deck 05, a shared Science and Engineering room just inside engineering, with R&amp;D beside it across a sealed lock.</li>
        <li><b>Shielding plant</b> on Deck 07 in engineering: capacitor Banks A and B either side of the chamber, Valdez&apos;s own section. Emitters spread along the conduits and around the crewed sections; the bay sits outside the shield.</li>
        <li><b>Stepped profile.</b> Decks 05 to 08 run the full 400 m; decks above and below get shorter. Exact lengths are a first guess.</li>
        <li><b>Docking bay</b> across Decks 08 to 11, centred along the hull under the superstructure, unpressurized, open to space, about 98 m long.</li>
        <li><b>Docking ring:</b> the clamps inside the bay that hold the ship.</li>
        <li><b>Airlock B</b> on Deck 09 in the bay wall, joined to the ship by a boarding umbilical. <b>Airlock A</b> faces it across the bay, its own umbilical pulled back.</li>
        <li><b>Maintenance access:</b> a trunk beside each lift core, Deck 12 to Deck 01, with a landing and hatch at every deck. Deck 12&apos;s crawlway joins them under the bay and drops into every fuel room; Deck 05&apos;s leads into engineering&apos;s shafts through locked hatches.</li>
      </ul>
    </section>
  </div>
</div>

<script>
// Zoom and pan by rewriting the drawing's viewBox, so line work stays crisp at any scale.
// The viewBox always matches the window's shape, so the maths maps pointer to drawing 1:1.
(function () {
  var svg = document.getElementById('hull');
  var vp = document.getElementById('hull-viewport');
  var out = document.getElementById('hull-zoom-level');
  if (!svg || !vp) return;
  var W0 = ${W}, H0 = ${H}, MAXZ = 16;
  var A = 1, fitW = W0, v = { x: 0, y: 0, w: W0, h: H0 };
  function measure() {
    var r = vp.getBoundingClientRect();
    A = r.width ? r.height / r.width : H0 / W0;
    fitW = Math.max(W0, H0 / A);
  }
  function apply() {
    svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
    if (out) out.textContent = Math.round(fitW / v.w * 100) + '%';
  }
  function clamp() {
    v.w = Math.min(fitW, Math.max(fitW / MAXZ, v.w));
    v.h = v.w * A;
    v.x = v.w >= W0 ? (W0 - v.w) / 2 : Math.min(W0 - v.w, Math.max(0, v.x));
    v.y = v.h >= H0 ? (H0 - v.h) / 2 : Math.min(H0 - v.h, Math.max(0, v.y));
  }
  function fit() { v.w = fitW; clamp(); apply(); }
  function toSvg(cx, cy) {
    var r = svg.getBoundingClientRect();
    return { x: v.x + (cx - r.left) / r.width * v.w, y: v.y + (cy - r.top) / r.height * v.h };
  }
  function zoomAt(f, px, py) {
    var nw = Math.min(fitW, Math.max(fitW / MAXZ, v.w / f));
    var k = nw / v.w;
    v.x = px - (px - v.x) * k;
    v.y = py - (py - v.y) * k;
    v.w = nw;
    clamp();
    apply();
  }
  function zoomCentre(f) { zoomAt(f, v.x + v.w / 2, v.y + v.h / 2); }
  function pan(dxPx, dyPx) {
    var r = svg.getBoundingClientRect();
    v.x -= dxPx / r.width * v.w;
    v.y -= dyPx / r.height * v.h;
    clamp();
    apply();
  }
  measure();
  fit();
  // Keep the same zoom level when the window changes shape.
  window.addEventListener('resize', function () {
    var z = fitW / v.w, cx = v.x + v.w / 2, cy = v.y + v.h / 2;
    measure();
    v.w = fitW / z; v.h = v.w * A; v.x = cx - v.w / 2; v.y = cy - v.h / 2;
    clamp();
    apply();
  });

  vp.addEventListener('wheel', function (e) {
    e.preventDefault();
    var p = toSvg(e.clientX, e.clientY);
    zoomAt(Math.exp(-e.deltaY * 0.0015), p.x, p.y);
  }, { passive: false });

  // One pointer pans; two pointers pinch-zoom around their midpoint.
  var pts = new Map(), pinch = null;
  vp.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.zoom')) return;
    vp.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    vp.classList.add('dragging');
  });
  vp.addEventListener('pointermove', function (e) {
    var prev = pts.get(e.pointerId);
    if (!prev) return;
    var cur = { x: e.clientX, y: e.clientY };
    pts.set(e.pointerId, cur);
    if (pts.size === 1) {
      pan(cur.x - prev.x, cur.y - prev.y);
    } else if (pts.size === 2) {
      var a = Array.from(pts.values());
      var d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
      var mid = toSvg((a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2);
      if (pinch) zoomAt(d / pinch, mid.x, mid.y);
      pinch = d;
    }
  });
  function end(e) {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (!pts.size) vp.classList.remove('dragging');
  }
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);

  vp.querySelector('.zoom').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.zoom === 'in') zoomCentre(1.5);
    else if (b.dataset.zoom === 'out') zoomCentre(1 / 1.5);
    else fit();
  });

  // Keys only while the drawing has focus.
  vp.addEventListener('keydown', function (e) {
    var step = 40;
    if (e.key === '+' || e.key === '=') zoomCentre(1.25);
    else if (e.key === '-' || e.key === '_') zoomCentre(0.8);
    else if (e.key === '0') fit();
    else if (e.key === 'ArrowLeft') pan(step, 0);
    else if (e.key === 'ArrowRight') pan(-step, 0);
    else if (e.key === 'ArrowUp') pan(0, step);
    else if (e.key === 'ArrowDown') pan(0, -step);
    else return;
    e.preventDefault();
  });
})();
// Layer toggles; each viewer's choice is remembered where storage allows.
(function () {
  var svg = document.getElementById('hull');
  var box = document.getElementById('hull-layers');
  if (!svg || !box) return;
  var KEY = 'hull-layers-hidden', hidden = [];
  try { hidden = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  box.querySelectorAll('input').forEach(function (input) {
    function sync() { svg.classList.toggle('hide-' + input.value, !input.checked); }
    input.checked = hidden.indexOf(input.value) < 0;
    sync();
    input.addEventListener('change', function () {
      sync();
      var off = [];
      box.querySelectorAll('input').forEach(function (i) { if (!i.checked) off.push(i.value); });
      try { localStorage.setItem(KEY, JSON.stringify(off)); } catch (e) {}
    });
  });
})();
</script>
`;
writeFileSync(new URL('./hull-side-view.html', import.meta.url), html);
console.log('ok', W, H);
