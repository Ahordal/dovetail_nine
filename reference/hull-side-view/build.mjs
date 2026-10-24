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
const goldAt = svg.length, GOLD = [];
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
const tag = (m, k, n, off = 0) => `<g class="tag"><circle cx="${f(mx(m))}" cy="${f(dy(k) + DH / 2 + off)}" r="5"/><text x="${f(mx(m))}" y="${f(dy(k) + DH / 2 + off + 2.3)}" text-anchor="middle">${n}</text></g>`;
// Lift shafts top to bottom, outlined solid. A dot marks each deck served;
// doorways are drawn only where a room on this face meets the shaft.
// Deck 09's stops sit mid-room, under the 4.5 m ceiling of the ready rooms.
const RC = 4.5;
for (const L of LIFTS) {
  add(`<rect class="lift" x="${f(mx(L - LW / 2))}" y="${Y0}" width="${f(LW * S)}" height="${f(Y1 - Y0)}"/>`);
  for (let k = 1; k <= 12; k++) add(`<circle class="stop" cx="${mx(L)}" cy="${f(k === 9 ? dy(10) - RC * S / 2 : dy(k) + DH / 2)}" r="1.8"/>`);
  add(`<text class="t-note" x="${mx(L)}" y="${Y0 - 4}" text-anchor="middle">LIFT</text>`);
}
// Lift lobbies on Deck 06: where the lifts meet the tram, its two main stops.
for (const [m0, m1] of [[123, LIFTS[0] - LW / 2], [LIFTS[1] + LW / 2, 277]]) {
  add(`<rect class="room" x="${f(mx(m0))}" y="${dy(6)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  tags.push(tag((m0 + m1) / 2, 6, 4));
}

// Tram along Deck 06.
const tramY = f(dy(7) - 1.6);
// Faded wherever it runs through a room or section on Deck 06 (the lobbies, engineering, the lifts between).
const TRAM_FADE = [123, 277];
add(`<line class="tram" x1="${X0 + 4}" y1="${tramY}" x2="${mx(TRAM_FADE[0])}" y2="${tramY}"/>`);
add(`<line class="tram tram-behind" x1="${mx(TRAM_FADE[0])}" y1="${tramY}" x2="${mx(TRAM_FADE[1])}" y2="${tramY}"/>`);
add(`<line class="tram" x1="${mx(TRAM_FADE[1])}" y1="${tramY}" x2="${X1 - 4}" y2="${tramY}"/>`);
add(`<text class="t-label t-accent" x="${X1 - 6}" y="${f(dy(6) + 3 * S + 7.6)}" text-anchor="end">TRAM · FULL LENGTH</text>`);

// Engineering: the section around the Core Chamber, Decks 05 to 07.
// Engineering runs out to meet both lift shafts.
const EX = [LIFTS[0] + LW / 2, LIFTS[1] - LW / 2];   // 137 to 263 m
const ex0 = mx(EX[0]), ex1 = mx(EX[1]), ey0 = dy(5), ey1 = dy(8);
add(`<rect class="section" x="${ex0}" y="${ey0}" width="${f(ex1 - ex0)}" height="${f(ey1 - ey0)}"/>`);
// Conduits along the spine from the chamber out to both arrays.
const cr = f(11 * S), ccx = mx(200);
add(`<line class="conduit" x1="${X0}" y1="${f(midY)}" x2="${f(ccx - cr)}" y2="${f(midY)}"/><line class="conduit" x1="${f(ccx + cr)}" y1="${f(midY)}" x2="${X1}" y2="${f(midY)}"/>`);
add(`<text class="t-note" x="${f(X0 + 30)}" y="${f(midY - 3)}">CONDUITS · KEEL</text>`);
// Two vertical access shafts through engineering, midway between the chamber and the section edge.
for (const m of [164.5, 235.5]) {
  add(`<rect class="shaft" x="${f(mx(m) - 1.5 * S)}" y="${ey0}" width="${f(3 * S)}" height="${f(ey1 - ey0)}"/>`);
  // A ladder down the shaft: two rails, rungs one per metre between them.
  for (const x of [mx(m) - 1.5 * S + 1.2, mx(m) + 1.5 * S - 1.2]) add(`<line class="ladder" x1="${f(x)}" y1="${ey0}" x2="${f(x)}" y2="${ey1}"/>`);
  for (let y = ey0 + S; y < ey1 - 0.5; y += S) add(`<line class="rung" x1="${f(mx(m) - 1.5 * S + 1.2)}" y1="${f(y)}" x2="${f(mx(m) + 1.5 * S - 1.2)}" y2="${f(y)}"/>`);
}
// Experiment control on Deck 05, just inside engineering, with R&D next door outside it.
for (const [m0, m1, n] of [[112, LIFTS[0] - LW / 2, 2], [LIFTS[0] + LW / 2, 163, 3]]) {
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
  const l0 = mx(BAY[0] + 1), l1 = mx(BAY[0] + 2), top = dy(11) - FL - 1 * S, bot = dy(12);
  add(`<path class="ladder" d="M ${l0} ${bot} V ${f(top)} H ${l1} V ${bot}"/>`);
  for (let y = dy(11) + FL + S; y < bot - 0.5; y += S) add(`<line class="rung" x1="${l0}" y1="${f(y)}" x2="${l1}" y2="${f(y)}"/>`);
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
// Airlock machinery on Deck 08 above each airlock and ready room: air recovery, pumps, valves, door ram. No access.
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
  for (const [m, h, w, bh] of [[107.2, 0, 2.2, 1.6], [109.6, 0, 1.4, 1.1], [116.4, 0, 2.6, 2.0], [112.8, 4.4, 1.8, 1.3], [118.3, 4.4, 1.2, 0.9], [107.6, 8.8, 2.4, 1.8], [114.9, 13.2, 1.6, 1.2], [124.0, 0, 2.2, 1.8], [124.4, 1.8, 1.6, 1.3], [129.2, 0, 1.6, 1.0]]) {
    add(`<rect class="crate" x="${f(mx(m))}" y="${Y(h + bh)}" width="${f(w * S)}" height="${f(bh * S)}"/>`);
  }
}
// Hold crane: a ceiling rail the length of the storage area, its trolley parked over the open floor with the grab lowered.
{
  const railY = cgTop, tx = mx(127.5);
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
  hollow([`M ${X(11.4)} ${Y(0.5)} V ${Y(3.2)}`, `M ${X(0.85)} ${Y(0)} V ${Y(1.45)} H ${X(11.4)}`]);
  box(10.7, 12.1, 0.1, 0.5);
  // Bigger tanks than the crew plant's: the cargo airlock holds far more air.
  box(0.6, 6.4, 3.3, 4.9, 3.5); box(0.6, 6.4, 5.3, 6.9, 3.5);
  ln(6.4, 4.1, 11.0, 4.1, "pipe"); ln(6.4, 5.5, 11.0, 5.5, "pipe");
  // Two pumps on the tank line, so a cycle this size doesn't take all day.
  for (const u of [7.4, 9.4]) {
    add(`<circle cx="${X(u)}" cy="${Y(6.7)}" r="${f(0.9 * S)}"/>`);
    box(u - 0.8, u + 0.8, 7.55, 7.8);
  }
  // Valve manifold, then controls and power.
  box(11.0, 11.8, 3.2, 7.8);
  for (const h of [4.1, 5.5]) add(`<circle cx="${X(11.4)}" cy="${Y(h)}" r="${f(0.35 * S)}"/>`);
  box(12.1, 12.8, 4.4, 7.6);
  ln(12.2, 5.2, 12.7, 5.2, "flange"); ln(12.2, 5.8, 12.7, 5.8, "flange");
  // Cargo door ram, its rod straight up to the door's foot; the door drops into this space when open.
  box(13.1, 13.7, 3.4, 7.6);
  ln(13.4, 3.4, 13.4, 0.9, "pipe");
  box(13.0, 14, 0.1, 0.9);
  add(`</g>`);
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
  for (const m of [269, 273, 277, 281]) {
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
  const POT = [81.5, 90, 98.5, 107], WW = [115.5, 124];
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
  wl([[117, 4.33], [117, 6.2], [57.2, 6.2], [57.2, 1.6]]);
  wl([[121.5, 1.0], [124, 1.0]]);
  // Treatment train, left to right, then straight into the first potable tank; the potable tanks share a level line.
  wl([[57.2, 1.0], [81.5, 1.0]]);
  for (const m of POT.slice(0, 3)) wl([[m + 6, 1.0], [m + 8.5, 1.0]]);
  // Out of the last potable tank to the supply pump, then low behind the wastewater tanks and up the left core.
  wl([[113, 1.0], [113.45, 1.0]]);
  add(`<path class="water" d="M ${X(115.0)} ${Y(0.6)} H ${X(SX)} V ${dy(1)}"/>`);
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
  add(`<circle cx="${X(114.25)}" cy="${Y(0.8)}" r="${f(0.8 * S)}"/>`); box(113.4, 115.1, 0, 0.05);
  add(`</g>`);
  for (const m of POT) tank(m, "tank-potable");
  for (const m of WW) tank(m, "tank-waste");
  // Waste plant: toilets come down the right core into a collection tank; a distiller recovers the urine's water,
  // a brine processor takes the rest, solids go to a digester and dryer. Recovered water climbs the right core.
  const BT = 269, DG = 286.5;
  add(`<path class="water" d="M ${X(DBX)} ${dy(1)} V ${Y(5.0)} H ${X(BT + 3)} V ${Y(4.4)}"/>`);
  wl([[BT + 6, 1.0], [298.5, 1.0]]);
  // Recovered water: up from the pump, over the toilet drain, up the right core, across in the Deck 04 service band,
  // over the left core's supply riser, and into the grey-water drain.
  add(`<path class="water" d="M ${X(298.5)} ${Y(1.8)} V ${Y(5.6)}${run(+X(298.5), Y(5.6), +X(RX), [+X(DBX)])} V ${y4}${run(+X(RX), y4, +X(DX), [+X(SX)])}"/>`);
  add(`<g class="plant">`);
  add(`<rect x="${X(276.5)}" y="${Y(2.0)}" width="${f(4.5 * S)}" height="${f(1.6 * S)}" rx="${f(0.8 * S)}"/>`); box(277, 277.6, 0, 0.4); box(280.4, 281, 0, 0.4);
  box(282.5, 285.3, 0, 2.4);
  box(DG + 7, DG + 10.5, 0, 2.2);
  add(`<circle cx="${X(298.5)}" cy="${Y(1.0)}" r="${f(0.8 * S)}"/>`); box(297.6, 299.4, 0, 0.05);
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
    for (const e of [lx - 0.4, lx + 0.4]) add(`<line class="ladder" x1="${X(e)}" y1="${Yk(7, 3.4)}" x2="${X(e)}" y2="${Yk(7, 0)}"/>`);
    for (let h = 0.4; h < 3.3; h += 0.5) add(`<line class="rung" x1="${X(lx - 0.4)}" y1="${Yk(7, h)}" x2="${X(lx + 0.4)}" y2="${Yk(7, h)}"/>`);
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
  gold([[X(114.25), FH(10)], [X(114.25), Yk(11, 1.6)]]);
  // Deck 10, Bus B: docking control's traffic board.
  gold([[X(RB), FH(10)], [X(260), FH(10)], [X(260), Yk(10, 2.6)]]);
  // Deck 11: cargo airlock machinery (A); the workshop and the waste plant (B).
  gold([[X(RA), FH(11)], [X(149.1), FH(11)]]);
  gold([[X(RB), FH(11)], [X(256.3), FH(11)], [X(256.3), Yk(11, 2.9)]]);
  gold([[X(RB), FH(11)], [X(283.9), FH(11)], [X(283.9), Yk(11, 2.4)]]);
  // Deck 12: fuel transfer (A); the fuel cells' switchgear feeds Bus B as the emergency supply.
  gold([[X(RA), FH(12)], [X(130.5), FH(12)], [X(130.5), Yk(12, 2.8)]]);
  gold([[X(291.9), Yk(12, 2.8)], [X(291.9), FH(12)], [X(RB), FH(12)]]);
  tags.push(tag((SA[0] + SA[1]) / 2, 6, 25, -4.5), tag((SB[0] + SB[1]) / 2, 6, 26, -4.5));
}
// Lift doorways: only where a room on this face meets the shaft. Standard 3 m crew doors, like the airlocks';
// the cargo hallway's are 4 m, for loads coming up from the hold.
{
  const [l0, l1] = [LIFTS[0] - LW / 2, LIFTS[0] + LW / 2], [r0, r1] = [LIFTS[1] - LW / 2, LIFTS[1] + LW / 2];
  const door = (k, h = DOOR) => [dy(k + 1) - FL - h * S, dy(k + 1) - FL];
  const doors = [
    [l0, door(5)],              // R&D
    [l0, door(6)], [r1, door(6)], // lift lobbies and tram stops
    [l1, door(9)], [r0, door(9)], // ready rooms A and B
    [l0, door(10, 4)], [l1, door(10, 4)], // cargo hallway: storage one side, cargo ready room the other
    [r0, door(10)], [r0, door(11)], // docking control, bay workshop
    [r0, door(5)], [l1, door(7)], [r0, door(7)], // trap auxiliaries, turbine hall, backup generator hall
    [l1, door(6)], [r0, door(6)], // switch rooms A and B
    [l0, door(11)], [r1, door(11)], // Deck 11: water tanks, waste plant
    [l0, door(12)], [l1, door(12)], [r0, door(12)], [r1, door(12)], // Deck 12: fuel transfer, tank halls, switchgear
  ];
  // Cargo airlock doors, a full deck high: the cargo door opens on vacuum, so locked; the inner door is unlocked.
  for (const [x, st] of [[bx, "door-locked"], [mx(CA), "door-open"]]) add(`<rect class="airlock ${st}" x="${f(x - DW / 2)}" y="${f(dy(10) + FL)}" width="${DW}" height="${f(doorBot(10) - dy(10) - FL)}"/>`);
  // Inner pressure doors, ready room to airlock: inside the pressurized station, so unlocked.
  for (const m of [BAY[0] - AL, BAY[1] + AL]) add(`<rect class="door door-open" x="${f(mx(m) - DW / 2)}" y="${f(door9Top)}" width="${DW}" height="${f(DOOR * S)}"/>`);
  for (const [m, [y0, y1]] of doors) add(`<rect class="door door-open" x="${f(mx(m) - DW / 2)}" y="${f(y0)}" width="${DW}" height="${f(y1 - y0)}"/>`);
}
svg.splice(goldAt, 0, ...GOLD);
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
    --open: #9fc7c2; --locked: #e5534b; --unlocked: #57b36a; --gold: #d6b44c;
    --display: "Chakra Petch", "Segoe UI", sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    color-scheme: dark;
  }
  @media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69; --locked: #b42318; --unlocked: #1f7a3a; --gold: #8a6c00;
    color-scheme: light; } }
  :root[data-theme="light"] {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69; --locked: #b42318; --unlocked: #1f7a3a; --gold: #8a6c00;
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
  .rung { stroke: var(--muted); stroke-width: 0.6; }
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
  .ladder { fill: none; stroke: var(--muted); stroke-width: 0.7; }
  .room-wall { stroke: var(--muted); stroke-width: 1; }
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
    <p class="zoom-hint">Scroll or pinch to zoom, drag to pan.</p>
<div class="legend">
      <ul aria-label="Room key">
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true">${sigmaLogo(14, 6, 5.5)}</svg>SIGMA&apos;s core, Decks 01 to 04</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">1</text></g></svg>SIGMA operations room, Deck 04</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">2</text></g></svg>R&amp;D, Deck 05</li>
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
      </ul>
      <ul aria-label="Line styles">
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="behind" x1="2" y1="6" x2="26" y2="6"/></svg>Deeper in the hull than this face</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="lift" x1="9" y1="0" x2="9" y2="12"/><line class="lift" x1="19" y1="0" x2="19" y2="12"/><circle class="stop" cx="14" cy="6" r="1.8"/><rect class="door door-open" x="18.5" y="2" width="1" height="8"/></svg>Lift stop and doorway</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="tram" x1="2" y1="6" x2="26" y2="6"/></svg>Tram, Deck 06</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="conduit" x1="2" y1="6" x2="26" y2="6"/></svg>Conduits and keel</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="grid-power" d="M 2 7 H 12 A 2 2 0 0 1 16 7 H 26 M 14 1 V 12"/></svg>Station power grid; a hop where two lines cross without joining</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="shaft" x="9" y="0" width="10" height="12"/><line class="rung" x1="10" y1="4" x2="18" y2="4"/><line class="rung" x1="10" y1="8" x2="18" y2="8"/></svg>Access shaft with ladder</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="plant"><rect x="2" y="1" width="24" height="3"/><line class="flange" x1="10" y1="1" x2="10" y2="4"/><line class="flange" x1="18" y1="1" x2="18" y2="4"/><rect x="4" y="6" width="6" height="5.5" rx="1.5"/><circle cx="16" cy="9" r="2.2"/><line class="pipe" x1="21" y1="6" x2="21" y2="12"/></g></svg>Airlock machinery, no access</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="plant"><line class="pipe hidden" x1="2" y1="5" x2="26" y2="5"/><line class="pipe hidden" x1="2" y1="7.5" x2="26" y2="7.5"/></g></svg>Pipes hidden inside a wall</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="window" x="13.5" y="1" width="1" height="10"/></svg>Window</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><circle class="shell" cx="14" cy="6" r="5"/><rect class="trap" x="11" y="4.5" width="6" height="3" rx="1"/></svg>Core shells and the trap housing</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><polyline class="busbar" points="2,8 9,8 9,4 19,4 19,8 26,8"/></svg>Dog-leg power penetration</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="radline" x1="2" y1="6" x2="26" y2="6"/></svg>Radiator coolant loop</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="radiator" x="4" y="1" width="9" height="4"/><rect class="radiator" x="15" y="1" width="9" height="4"/><rect class="emitter" x="12.8" y="6" width="2.4" height="4"/></svg>Radiator panels and emitters on the array</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="emitter" x="12.8" y="5" width="2.4" height="2.2"/></svg>Harmonic emitter along the conduits</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="hot"><circle cx="14" cy="6" r="2.6"/><circle class="hot-hub" cx="14" cy="6" r="0.7"/></g></svg>Radiation hot spot, left by the accident</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="frost" d="M 8 4 l 3 3 m 0 -3 l -3 3 M 17 4 l 3 3 m 0 -3 l -3 3"/></svg>Frost on cryogenic lines</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="water" d="M 2 7 H 12 A 2 2 0 0 1 16 7 H 26 M 14 1 V 12"/></svg>Water lines; a hop where two cross without joining</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="tank-potable" d="M 5 12 V 4 Q 5 1 9 1 Q 13 1 13 4 V 12 Z"/><path class="tank-waste" d="M 15 12 V 4 Q 15 1 19 1 Q 23 1 23 4 V 12 Z"/></svg>Water tanks: potable, wastewater</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="door door-open" x="12" y="1" width="4" height="10"/></svg>Door, unlocked as Quell finds it</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="door door-locked" x="12" y="1" width="4" height="10"/></svg>Door, locked as Quell finds it</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="ladder" x1="11" y1="0" x2="11" y2="12"/><line class="ladder" x1="17" y1="0" x2="17" y2="12"/><line class="rung" x1="11" y1="4" x2="17" y2="4"/><line class="rung" x1="11" y1="8" x2="17" y2="8"/></svg>Open ladder, cargo dock to bay floor</li>
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
        <li><b>Experiment control</b> on Deck 05, a shared Science and Engineering room just inside engineering, with R&amp;D next door and a door from each.</li>
        <li><b>Shielding plant</b> on Deck 07 in engineering: capacitor Banks A and B either side of the chamber, Valdez&apos;s own section. Emitters spread along the conduits and around the crewed sections; the bay sits outside the shield.</li>
        <li><b>Stepped profile.</b> Decks 05 to 08 run the full 400 m; decks above and below get shorter. Exact lengths are a first guess.</li>
        <li><b>Docking bay</b> across Decks 08 to 11, centred along the hull under the superstructure, unpressurized, open to space, about 98 m long.</li>
        <li><b>Docking ring:</b> the clamps inside the bay that hold the ship.</li>
        <li><b>Airlock B</b> on Deck 09 in the bay wall, joined to the ship by a boarding umbilical. <b>Airlock A</b> faces it across the bay, its own umbilical pulled back.</li>
      </ul>
    </section>
    <section>
      <h2><span class="tag open">NOT PLACED YET</span></h2>
      <ul>
        <li><b>Access shaft</b> routes.</li>
        <li><b>Needs a dedicated place:</b> array access at both ends, command and comms, life support, hydroponics.</li>
        <li><b>Everything else</b>: R&amp;D, quarters, galley, medical, hydroponics, administration.</li>
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
</script>
`;
writeFileSync(new URL('./hull-side-view.html', import.meta.url), html);
console.log('ok', W, H);
