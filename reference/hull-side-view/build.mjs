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
// Lift shafts top to bottom, dashed since they sit deeper than this face. A dot marks each deck served;
// which side the doors open on is left to the deck plans.
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
  // Ladder rungs, drawn one per metre.
  for (let y = ey0 + S; y < ey1 - 0.5; y += S) add(`<line class="rung" x1="${f(mx(m) - 1.5 * S + 1.2)}" y1="${f(y)}" x2="${f(mx(m) + 1.5 * S - 1.2)}" y2="${f(y)}"/>`);
}
// Experiment control on Deck 05, just inside engineering, with R&D next door outside it.
for (const [m0, m1, n] of [[112, 137, 2], [137, 163, 3]]) {
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
for (const [m0, m1, n] of [[166, 188, 5], [212, 234, 6]]) {
  add(`<rect class="room" x="${f(mx(m0))}" y="${dy(7)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  tags.push(tag((m0 + m1) / 2, 7, n));
  // Charge from the chamber's Harvest Rings, out to the emitters along the Deck 06 conduits.
  const inner = m0 < 200 ? m1 : m0, ry = dy(7) + 3 * S + (DH - 3 * S) / 2;
  const edge = Math.sqrt((11 * S) ** 2 - (ry - midY) ** 2) * (m0 < 200 ? -1 : 1);
  add(`<line class="power" x1="${f(mx(inner))}" y1="${f(ry)}" x2="${f(mx(200) + edge)}" y2="${f(ry)}"/>`);
  add(`<line class="power" x1="${f(mx((m0 + m1) / 2))}" y1="${dy(7)}" x2="${f(mx((m0 + m1) / 2))}" y2="${f(midY)}"/><circle class="power-node" cx="${f(mx((m0 + m1) / 2))}" cy="${f(midY)}" r="1.6"/>`);
}
// Core Chamber: a ~22 m sphere behind this face, black hole at the middle of Deck 06.
add(`<circle class="core" cx="${ccx}" cy="${f(midY)}" r="${cr}"/><circle class="singularity" cx="${ccx}" cy="${f(midY)}" r="1.6"/>`);
add(`<text class="t-note t-ship" x="${ccx}" y="${f(midY - 9)}" text-anchor="middle">CORE</text>`);
add(`<text class="t-note t-ship" x="${ccx}" y="${f(midY + 14)}" text-anchor="middle">CHAMBER</text>`);
// Faint watermark across Deck 05, drawn last so the chamber and shafts don't hide letters.
add(`<text class="t-watermark" x="${f(ex0 + 8)}" y="${f(ey0 + 16)}" textLength="${f(ex1 - ex0 - 16)}" lengthAdjust="spacing">ENGINEERING</text>`);

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
add(`<rect class="platform" x="${bx}" y="${dy(11)}" width="${f(10 * S)}" height="${f(0.7 * S)}"/>`);
for (const m of [3, 9]) add(`<line class="dock-leg" x1="${f(mx(BAY[0] + m))}" y1="${f(dy(11) + 0.7 * S)}" x2="${f(mx(BAY[0] + m))}" y2="${dy(12)}"/>`);
tags.push(tag(BAY[0] + 5, 10, 9, 3.2));
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
// Floor lines are 1 unit thick, centred on the deck line: doors stop flush against them, above and below.
const FL = 0.5;
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
for (const x of [wall, bx]) add(`<rect class="airlock" x="${f(x - 0.8)}" y="${f(door9Top)}" width="1.6" height="${f(DOOR * S)}"/>`);
// Room tags centred in the low rooms; B's sits toward the door to share with the you-are-here dot.
const tag9 = (m, n) => tag(m, 9, n, (ceil9 + dy(10)) / 2 - dy(9) - DH / 2);
const hereM = BAY[1] + AL - 1.6;
tags.push(tag9(BAY[0] - AL / 2, "A"), tag9(BAY[1] + 2.2, "B"));
// Airlock machinery on Deck 08 above each airlock and ready room: air recovery, pumps, valves, door ram. No access.
const plant = (x0, flip) => {
  // x0 is the space's left edge in metres; flip mirrors the layout so the two sides differ.
  const X = (m) => f(mx(flip ? x0 + 14 - m : x0 + m)), Y = (h) => f(dy(8) + h * S);
  const box = (m0, m1, h0, h1, rx = 0) => add(`<rect x="${f(Math.min(+X(m0), +X(m1)))}" y="${Y(h0)}" width="${f(Math.abs(m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${rx}"` : ""}/>`);
  const ln = (m0, h0, m1, h1, cls = "") => add(`<line${cls ? ` class="${cls}"` : ""} x1="${X(m0)}" y1="${Y(h0)}" x2="${X(m1)}" y2="${Y(h1)}"/>`);
  add(`<g class="plant">`);
  // Air recovery tanks: air pumped out of the airlock is stored here, not vented.
  box(0.5, 6.4, 0.9, 2.7, 3.5);
  box(0.5, 6.4, 3.1, 4.9, 3.5);
  // Depressurisation pump on its base.
  add(`<circle cx="${X(2.8)}" cy="${Y(6.3)}" r="${f(1.0 * S)}"/>`);
  box(1.4, 4.2, 7.3, 7.7);
  // Valve manifold: tanks and pump feed a riser that drops through the floor into the airlock.
  ln(6.4, 1.8, 8.6, 1.8, "pipe"); ln(6.4, 4.0, 8.6, 4.0, "pipe"); ln(3.8, 6.3, 8.6, 6.3, "pipe");
  box(8.6, 9.6, 1.2, 8.0);
  for (const h of [1.8, 4.0, 6.3]) add(`<circle cx="${X(9.1)}" cy="${Y(h)}" r="${f(0.4 * S)}"/>`);
  // Controls and power for the cycle.
  box(10.2, 11.7, 4.4, 7.7);
  ln(10.5, 5.2, 11.4, 5.2, "flange"); ln(10.5, 5.8, 11.4, 5.8, "flange");
  // Outer door ram above the bay wall: cylinder, rod down to the door head.
  box(12.3, 13.4, 0.9, 5.8);
  ln(12.85, 5.8, 12.85, 8.0, "pipe");
  // Below Deck 08's floor, the service space over the airlock and ready room (h 8 to 11.5).
  // Return duct from the station's air system, coming in past the lift, up into the tanks.
  box(0, 6.0, 8.5, 9.6);
  for (const m of [2.0, 4.0]) ln(m, 8.5, m, 9.6, "flange");
  ln(5.4, 4.9, 5.4, 8.5, "pipe");
  // Supply pair in from the station side, teeing into the riser.
  ln(0, 10.1, 8.85, 10.1, "pipe"); ln(0, 10.6, 9.35, 10.6, "pipe");
  add(`<circle cx="${X(3.6)}" cy="${Y(10.35)}" r="${f(0.4 * S)}"/>`);
  // The manifold's riser continues down to a vent in the airlock ceiling.
  ln(8.85, 8.0, 8.85, 11.1, "pipe"); ln(9.35, 8.0, 9.35, 11.1, "pipe");
  box(8.3, 9.9, 11.1, 11.5);
  // Ram rod on down to the door head; the outer door lifts into this space when open.
  ln(12.85, 8.0, 12.85, 10.9, "pipe"); ln(12.85, 10.9, 14, 10.9, "pipe");
  box(13.4, 14, 10.4, 11.5);
  add(`</g>`);
};
plant(LIFTS[0] + LW / 2, false);
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
add(`<polygon class="hold" points="${mx(CG[0])},${cgTop} ${mx(ST)},${cgTop} ${mx(ST)},${dy(10)} ${bx},${dy(10)} ${bx},${cgBot} ${mx(CG[0])},${cgBot}"/>`);
// The lift passes through the hallway only, with its one cargo stop there on Deck 10.
add(`<rect class="lift" x="${f(mx(LIFTS[0] - LW / 2))}" y="${dy(10)}" width="${f(LW * S)}" height="${f(DH)}"/>`);
for (const k of [10]) add(`<circle class="stop" cx="${mx(LIFTS[0])}" cy="${f(dy(k) + DH / 2)}" r="1.8"/>`);
// The cargo door: Deck 10's full height, below Airlock A, opening onto the raised dock.
// The cargo door runs the full deck, from the deck above's floor plate down to its own.
add(`<rect class="airlock" x="${f(bx - 0.8)}" y="${f(dy(10) + FL)}" width="1.6" height="${f(doorBot(10) - dy(10) - FL)}"/>`);
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
add(`<rect class="airlock" x="${f(mx(CA) - 0.8)}" y="${f(dy(10) + FL)}" width="1.6" height="${f(doorBot(10) - dy(10) - FL)}"/>`);
tags.push(tag(CA + 3, 10, "C", -4));
// Its machinery on Deck 11 below, sealed: tanks, pump, manifold, controls, and the ram the cargo door drops on.
{
  const X = (m) => f(mx(CA + m)), Y = (h) => f(dy(11) + h * S);
  const box = (m0, m1, h0, h1, rx = 0) => add(`<rect x="${X(m0)}" y="${Y(h0)}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${rx}"` : ""}/>`);
  const ln = (m0, h0, m1, h1, cls = "") => add(`<line${cls ? ` class="${cls}"` : ""} x1="${X(m0)}" y1="${Y(h0)}" x2="${X(m1)}" y2="${Y(h1)}"/>`);
  add(`<g class="plant">`);
  box(0.4, 3.4, 3.6, 5.4, 3); box(0.4, 3.4, 5.8, 7.6, 3);
  box(3.9, 4.7, 3.4, 7.6);
  ln(3.4, 4.5, 3.9, 4.5, "pipe"); ln(3.4, 6.7, 3.9, 6.7, "pipe");
  for (const h of [4.5, 6.7]) add(`<circle cx="${X(4.3)}" cy="${Y(h)}" r="${f(0.35 * S)}"/>`);
  add(`<circle cx="${X(5.8)}" cy="${Y(6.6)}" r="${f(0.9 * S)}"/>`);
  box(5.0, 6.6, 7.5, 7.8);
  ln(4.7, 6.6, 4.9, 6.6, "pipe");
  box(5.1, 6.5, 3.6, 5.2);
  ln(5.4, 4.2, 6.2, 4.2, "flange"); ln(5.4, 4.7, 6.2, 4.7, "flange");
  // Supply pair in the service band, teeing into the riser up to a vent in the airlock floor.
  ln(0, 1.2, 4.1, 1.2, "pipe"); ln(0, 1.7, 4.5, 1.7, "pipe");
  ln(4.1, 3.4, 4.1, 0.5, "pipe"); ln(4.5, 3.4, 4.5, 0.5, "pipe");
  box(3.6, 5.0, 0.1, 0.5);
  // Door ram: rod up to the door's foot; the cargo door drops into this space when open.
  box(7.0, 7.6, 3.6, 7.6);
  ln(7.3, 3.6, 7.3, 0.7, "pipe"); ln(7.3, 0.7, 8, 0.7, "pipe");
  add(`</g>`);
}
tags.push(tag(123.5, 9, 8, 1));
// You are here: Quell's current place, same pinging dot as the terminal's current location box.
const hereX = f(mx(hereM)), hereY = f((ceil9 + dy(10)) / 2);
const hereMarker = `<g class="here"><circle class="here-ring" cx="${hereX}" cy="${hereY}" r="6"/><circle class="here-dot" cx="${hereX}" cy="${hereY}" r="3"/></g>`;   // drawn last, above everything
add(`<text class="t-note t-ship" x="${f((sx + sw + wall) / 2)}" y="${f(door9Mid + 2.6)}" text-anchor="middle">UMBILICAL</text>`);

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
for (const [x0, x1] of [[X0 - 8, 8], [X1 + 8, X1 + 152]]) {
  const d = x1 > x0 ? 1 : -1;
  add(`<line class="ruler" x1="${x0}" y1="${ry}" x2="${x1}" y2="${ry}"/><polyline class="ruler arrow" points="${x1 - 5 * d},${f(ry - 3)} ${x1},${ry} ${x1 - 5 * d},${f(ry + 3)}"/>`);
  // Fixed length (the shorter left extension) so both labels fit and match, whatever font loads.
  add(`<text class="t-note t-array" x="${f((x0 + x1) / 2)}" y="${f(ry - 5)}" text-anchor="middle" textLength="${f(X0 - 20)}" lengthAdjust="spacingAndGlyphs">Array continues ~650 metres</text>`);
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
    --open: #9fc7c2;
    --display: "Chakra Petch", "Segoe UI", sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    color-scheme: dark;
  }
  @media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69;
    color-scheme: light; } }
  :root[data-theme="light"] {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69;
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
  .power { stroke: var(--fg); stroke-width: 1; stroke-dasharray: 1.5 2; }
  .power-node { fill: var(--fg); }
  .tram-behind { stroke-opacity: 0.3; }
  .rung { stroke: var(--muted); stroke-width: 0.6; }
  .shaft { fill: var(--bg); stroke: var(--deck); stroke-width: 1; }
  .lift { fill: none; stroke: var(--muted); stroke-width: 0.9; stroke-dasharray: 3 2; }
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
  .hold-floor { stroke: var(--muted); stroke-width: 1; }
  .hold { fill: var(--bg); stroke: var(--muted); stroke-width: 1; }
  .racks .upright { stroke: var(--muted); stroke-width: 0.9; }
  .racks .shelf { stroke: var(--muted); stroke-width: 0.9; }
  .racks .chord { stroke: var(--muted); stroke-width: 0.5; }
  .racks .web { fill: none; stroke: var(--muted); stroke-width: 0.4; }
  .racks .brace { stroke: var(--muted); stroke-width: 0.4; stroke-opacity: 0.7; }
  .racks .crate { fill: var(--line); stroke: var(--muted); stroke-width: 0.5; }
  .plant rect, .plant circle { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .plant line { stroke: var(--muted); stroke-width: 0.5; }
  .plant .flange { stroke-width: 0.35; }
  .plant .pipe { stroke-width: 0.45; }
  .clamp rect, .clamp circle { fill: var(--bg); stroke: var(--muted); stroke-width: 1; }
  .umbilical { fill: none; stroke: var(--ship); stroke-width: 0.9; stroke-dasharray: 3 2; }
  .airlock { fill: var(--ship); }
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
  .here-dot { fill: #9fc7c2; }
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
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">7</text></g></svg>Ready room, Deck 09, from the lift to each airlock</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">8</text></g></svg>Cargo hold, Decks 09 to 10: truss shelving, a ceiling crane</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">9</text></g></svg>Cargo dock, raised a deck above the bay floor</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">C</text></g></svg>Cargo airlock, Deck 10, inside the cargo door</li>
      </ul>
      <ul aria-label="Line styles">
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="lift" x1="2" y1="6" x2="26" y2="6"/></svg>Deeper in the hull than this face</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="lift" x1="9" y1="0" x2="9" y2="12"/><line class="lift" x1="19" y1="0" x2="19" y2="12"/><circle class="stop" cx="14" cy="6" r="1.8"/></svg>Lift stop</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="tram" x1="2" y1="6" x2="26" y2="6"/></svg>Tram, Deck 06</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="conduit" x1="2" y1="6" x2="26" y2="6"/></svg>Conduits and keel</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="power" x1="2" y1="6" x2="26" y2="6"/></svg>Shielding power</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="shaft" x="9" y="0" width="10" height="12"/><line class="rung" x1="10" y1="4" x2="18" y2="4"/><line class="rung" x1="10" y1="8" x2="18" y2="8"/></svg>Access shaft with ladder</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="plant"><rect x="2" y="1" width="24" height="3"/><line class="flange" x1="10" y1="1" x2="10" y2="4"/><line class="flange" x1="18" y1="1" x2="18" y2="4"/><rect x="4" y="6" width="6" height="5.5" rx="1.5"/><circle cx="16" cy="9" r="2.2"/><line class="pipe" x1="21" y1="6" x2="21" y2="12"/></g></svg>Airlock machinery, no access</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="clamp"><rect x="11" y="0" width="2.4" height="8.5"/><circle cx="12.2" cy="4" r="1.6"/><rect x="8.5" y="8.5" width="7.4" height="2.2"/></g></svg>Docking clamp, four in all</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="gantry"><rect x="2" y="0.5" width="24" height="2"/><rect x="10" y="2.5" width="6" height="2.5"/><line x1="13" y1="5" x2="13" y2="9"/><polyline points="10,11.5 10,9 16,9 16,11.5"/></g></svg>Gantry crane on its ceiling rail</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="here"><circle class="here-ring" cx="14" cy="6" r="5"/><circle class="here-dot" cx="14" cy="6" r="2.5"/></g></svg>You are here</li>
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
        <li><b>Two lift cores</b> at about 135 m and 265 m, the only positions that reach all 12 decks. Dashed: deeper in the hull than this face.</li>
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
        <li><b>Observation gallery</b>, where in engineering it looks into the chamber.</li>
        <li><b>Access shaft</b> routes.</li>
        <li><b>Which end is forward</b>, where the array focuses its node.</li>
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
