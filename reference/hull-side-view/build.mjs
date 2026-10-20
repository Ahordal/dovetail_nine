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
const BAY = [151, 249];   // centred under the superstructure
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
  add(`<text class="t-watermark t-deck-num" x="${f(mx(SPAN[k][0]) + 7)}" y="${f(y + 3 * S + 10.4)}">${String(k).padStart(2, '0')}</text>`);
}
add(`</g>`);
add(`<polygon class="hull-edge" points="${outline}"/>`);

// Tram along Deck 06.
const tramY = f(dy(7) - 1.6);
// Faded through engineering: it passes behind, in its own shielded tube.
add(`<line class="tram" x1="${X0 + 4}" y1="${tramY}" x2="${mx(140)}" y2="${tramY}"/>`);
add(`<line class="tram tram-behind" x1="${mx(140)}" y1="${tramY}" x2="${mx(260)}" y2="${tramY}"/>`);
add(`<line class="tram" x1="${mx(260)}" y1="${tramY}" x2="${X1 - 4}" y2="${tramY}"/>`);
add(`<text class="t-label t-accent" x="${X1 - 6}" y="${f(dy(6) + 3 * S + 7.6)}" text-anchor="end">TRAM · FULL LENGTH</text>`);

// Engineering: the section around the Core Chamber, Decks 05 to 07.
const ex0 = mx(140), ex1 = mx(260), ey0 = dy(5), ey1 = dy(8);
add(`<rect class="section" x="${ex0}" y="${ey0}" width="${f(ex1 - ex0)}" height="${f(ey1 - ey0)}"/>`);
// Conduits along the spine from the chamber out to both arrays.
const cr = f(11 * S), ccx = mx(200);
add(`<line class="conduit" x1="${X0}" y1="${f(midY)}" x2="${f(ccx - cr)}" y2="${f(midY)}"/><line class="conduit" x1="${f(ccx + cr)}" y1="${f(midY)}" x2="${X1}" y2="${f(midY)}"/>`);
add(`<text class="t-note" x="${f(X0 + 30)}" y="${f(midY - 3)}">CONDUITS · KEEL</text>`);
// Two vertical access shafts through engineering, midway between the chamber and the section edge.
for (const m of [(140 + 189) / 2, (211 + 260) / 2]) {
  add(`<rect class="shaft" x="${f(mx(m) - 1.5 * S)}" y="${ey0}" width="${f(3 * S)}" height="${f(ey1 - ey0)}"/>`);
  // Ladder rungs, drawn one per metre.
  for (let y = ey0 + S; y < ey1 - 0.5; y += S) add(`<line class="rung" x1="${f(mx(m) - 1.5 * S + 1.2)}" y1="${f(y)}" x2="${f(mx(m) + 1.5 * S - 1.2)}" y2="${f(y)}"/>`);
}
// A door: a thicker stretch of shared wall, floor to three quarters of the deck.
// Nudge (in drawing units) keeps a door on the room side when the wall borders a shaft.
const door = (m, k, nudge = 0) => `<line class="door" x1="${f(mx(m) + nudge)}" y1="${f(dy(k + 1) - 0.75 * DH)}" x2="${f(mx(m) + nudge)}" y2="${dy(k + 1)}"/>`;
// Experiment control on Deck 05, just inside engineering, with R&D next door outside it.
for (const [m0, m1, name] of [[112, 140, "R&amp;D"], [140, 163, "EXP CONTROL"]]) {
  const w = (m1 - m0) * S;
  add(`<rect class="section" x="${f(mx(m0))}" y="${dy(5)}" width="${f(w)}" height="${f(DH)}"/>`);
  add(`<text class="t-note" x="${f(mx((m0 + m1) / 2))}" y="${f(dy(5) + DH / 2 + 2.6)}" text-anchor="middle"${w < 60 ? ` textLength="${f(w - 6)}" lengthAdjust="spacingAndGlyphs"` : ""}>${name}</text>`);
}
// The sealed R&D lock between the two rooms, and a hatch from experiment control into the access shaft.
add(door(140, 5));
add(door(163, 5, -0.8));
// Shielding plant on Deck 07: capacitor halls from each shaft in toward the chamber, a door into each shaft.
add(door(166, 7, 0.8));
add(door(234, 7, -0.8));
for (const [m0, m1, name] of [[166, 188, "BANK A"], [212, 234, "BANK B"]]) {
  add(`<rect class="section" x="${f(mx(m0))}" y="${dy(7)}" width="${f((m1 - m0) * S)}" height="${f(DH)}"/>`);
  add(`<text class="t-note" x="${f(mx((m0 + m1) / 2))}" y="${f(dy(7) + DH / 2 + 2.6)}" text-anchor="middle">${name}</text>`);
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
const r = f(13 * S);
add(`<text class="t-note t-ship" x="${f(cx - r - 6)}" y="${f(cy + 2.6)}" text-anchor="end">MISTRAL →</text>`);

// Boarding umbilical and Airlock A's door, both the full height of Deck 09.
const floor9 = dy(10), wall = f(bx + 98 * S);
add(`<rect class="umbilical" x="${f(sx + sw)}" y="${dy(9)}" width="${f(wall - sx - sw)}" height="${f(DH)}"/>`);
add(`<rect class="airlock" x="${f(wall - 1.5)}" y="${dy(9)}" width="3" height="${f(DH)}"/>`);
add(`<text class="t-watermark t-room" x="${f(wall + 8)}" y="${f(dy(9) + DH / 2 + 4)}">AIRLOCK A</text>`);
add(`<text class="t-note t-ship" x="${f((sx + sw + wall) / 2)}" y="${f(dy(9) + DH / 2 + 2.6)}" text-anchor="middle">UMBILICAL</text>`);

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
  .sheet svg { display: block; width: 100%; min-width: 820px; height: auto; }
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
  .door { stroke: var(--muted); stroke-width: 1.6; }
  .section { fill: none; stroke: var(--deck); stroke-width: 1; }
  .conduit { stroke: var(--muted); stroke-width: 1.4; }
  .core { fill: var(--bg); stroke: var(--fg); stroke-width: 1; stroke-dasharray: 4 3; }
  .singularity { fill: var(--fg); }
  .bay { fill: var(--bg); stroke: var(--deck); stroke-width: 1; }
  .ship rect, .ship path { fill: var(--panel); stroke: var(--ship); stroke-width: 1; }
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
  .t-room { font-size: 11px; letter-spacing: 0.12em; }
  .t-scale { font: 400 8px var(--mono); fill: var(--muted); font-variant-numeric: tabular-nums; }
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
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Side view of the Dovetail-9 hull: twelve decks stacked, numbered from the top. A tram runs the full length of Deck 06, beside the conduits and keel. The Core Chamber, a dashed sphere, sits at the middle of the hull across Decks 05 to 07 inside the engineering section. The docking bay is an open space across Decks 08 to 11, centred along the hull under the stepped superstructure, holding the Mistral, seen from astern, with a full-deck-height boarding umbilical to Airlock A on Deck 09. Two jagged comms spires on top, a taller one left of centre and a shorter twin-tipped one to its right, with smaller masts and dishes around them, and the Anchor Core array continuing from both ends.">
      ${svg.join('\n      ')}
    </svg>
    <figcaption class="caption">Each deck: about 5 m floor to ceiling (dark band) plus about 3 m of service space above it (lighter band); floors sit on the deck lines. The dashed circle is behind this face. Dotted lines are shielding power: each bank charges from the chamber and feeds the emitters along the Deck 06 conduits. Heights come from the exterior image. Lengths don't: the image sees the hull at an angle, so how long each deck runs and where the masts stand are first guesses. The bay is centred under the superstructure.</figcaption>
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
        <li><b>Engineering</b> around the chamber, 140 to 260 m along on Decks 05 to 07, with two vertical access shafts through it, one either side of the chamber.</li>
        <li><b>Experiment control</b> on Deck 05, a shared Science and Engineering room just inside engineering, with R&amp;D next door and a door from each.</li>
        <li><b>Shielding plant</b> on Deck 07 in engineering: capacitor Banks A and B either side of the chamber, Valdez&apos;s own section. Emitters spread along the conduits and around the crewed sections; the bay sits outside the shield.</li>
        <li><b>Stepped profile.</b> Decks 05 to 08 run the full 400 m; decks above and below get shorter. Exact lengths are a first guess.</li>
        <li><b>Docking bay</b> across Decks 08 to 11, centred along the hull under the superstructure, unpressurized, open to space, about 98 m long.</li>
        <li><b>Docking ring:</b> the clamps inside the bay that hold the ship.</li>
        <li><b>Airlock A</b> on Deck 09 in the bay wall, joined to the ship by a boarding umbilical.</li>
      </ul>
    </section>
    <section>
      <h2><span class="tag open">NOT PLACED YET</span></h2>
      <ul>
        <li><b>Observation gallery</b>, where in engineering it looks into the chamber.</li>
        <li><b>Lift shafts:</b> how many, where, which decks they stop at.</li>
        <li><b>Access shaft</b> routes.</li>
        <li><b>Which end is forward</b>, where the array focuses its node.</li>
        <li><b>Needs a dedicated place:</b> SIGMA&apos;s core, array access at both ends, command and comms, life support, hydroponics.</li>
        <li><b>Everything else</b>: R&amp;D, quarters, galley, medical, hydroponics, administration.</li>
      </ul>
    </section>
  </div>
</div>
`;
writeFileSync(new URL('./hull-side-view.html', import.meta.url), html);
console.log('ok', W, H);
