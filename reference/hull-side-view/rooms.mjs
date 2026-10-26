// Room fit-out helpers, and the rooms beyond the bay and engineering.
import { mx, dy, S, LIFTS, LW, add, f, TERMS, gold, GOLD, tag, LANDING_DOORS, Y0, EARLY, DH, FIRE_PLANTS } from './frame.mjs';
import { FL, midY, DW, DOOR } from './hull.mjs';

export const X = (m) => mx(m), Yk = (k, h) => dy(k + 1) - FL - h * S, FH = (k) => dy(k) + 1.4 * S;
export const RA = 138.8, RB = 400 - 138.8, SX = 136.4, DX = 133.6, DBX = LIFTS[1] + LW / 2 - 0.6, RX = LIFTS[1] - LW / 2 + 0.6;
export const room = (k, m0, m1, k1 = k) => add(`<rect class="room" x="${f(X(m0))}" y="${dy(k)}" width="${f((m1 - m0) * S)}" height="${f(dy(k1 + 1) - dy(k))}"/>`);
export const box = (k, m0, m1, h0, h1, cls = "", rx = 0) => add(`<rect${cls ? ` class="${cls}"` : ""} x="${f(X(m0))}" y="${f(Yk(k, h1))}" width="${f((m1 - m0) * S)}" height="${f((h1 - h0) * S)}"${rx ? ` rx="${f(rx)}"` : ""}/>`);
export const circ = (k, m, h, r) => add(`<circle cx="${f(X(m))}" cy="${f(Yk(k, h))}" r="${f(r * S)}"/>`);
export const hl = (k, m0, m1, h) => add(`<line class="flange" x1="${f(X(m0))}" y1="${f(Yk(k, h))}" x2="${f(X(m1))}" y2="${f(Yk(k, h))}"/>`);
export const term = (k, m) => { TERMS.push([k, m]); box(k, m - 0.08, m + 0.08, 0, 1.1, "term"); box(k, m - 0.45, m + 0.45, 1.1, 1.7, "term-screen"); };
export const run = (x0, y, x1, hops, cls) => {   // a horizontal run that hops over the given x positions
  const dir = x1 > x0 ? 1 : -1, h = 1.0; let d = `M ${f(x0)} ${f(y)}`;
  for (const hx of hops.slice().sort((a, b) => dir * (a - b))) d += ` H ${f(hx - dir * h)} A ${h} ${h} 0 0 ${dir > 0 ? 1 : 0} ${f(hx + dir * h)} ${f(y)}`;
  return d + ` H ${f(x1)}`;
};
export const feed = (k, r, m, k2, h2) => gold([[X(r), FH(k)], [X(m), FH(k)], [X(m), Yk(k2, h2)]]);   // gold: riser to a load
// Water branches run at room-ceiling height, just under the service band, so they never ride alongside a gold feeder.
export const WY = (k) => dy(k) + 3.2 * S;
export const water = (k, m, k2, h2, hops = []) => GOLD.push(`<path class="water" d="${run(X(SX), WY(k), X(m), hops.map(X))} V ${f(Yk(k2, h2))}"/>`);
export const T = [];
export const tg = (m, k, n, off = 0) => T.push(tag(m, k, n, off));
// Maintenance access: a trunk beside each lift core, Deck 12 to Deck 01, the only columns that reach every deck
// outside engineering and the bay, and where the risers run. Each run is a vertical way (1.2 m, a ladder) with a
// landing and hatch at every deck; runs step sideways by short crawls only to clear lift doors and the tram lobbies.
// [metres along, lowest deck, highest deck], bottom run first.
export const TRUNKS = [
  [[129.4, 11, 7], [121.5, 6, 5], [140.5, 4, 2]],
  [[270, 11, 7], [278.5, 6, 5], [259.5, 4, 2]],
];
// Deck 12's band joins the trunks under the bay; ladders drop from it into every fuel room, no more than 30 m apart.
export const FUEL_LADDERS = [128.5, 150.75, 163.75, 186.1, 213.9, 236.25, 249.25, 274.4];
export const TW = 1.2;
export const WAYS = TRUNKS.flat().flatMap(([m, k0, k1]) => Array.from({ length: k0 - k1 + 1 }, (_, i) => [k1 + i, m]));
export const LADDERS = WAYS.concat(FUEL_LADDERS.map((m) => [12, m]));
export const blocked = (k, a, b) => LADDERS.some(([lk, lm]) => lk === k && a < lm + TW / 2 + 0.8 && b > lm - TW / 2 - 0.8);

// Room fit-outs by type. Each takes the deck and the span; everything is a closed shape.
// Crew housing by seniority: suites for Level 6 staff, single cabins (3 m) for senior grades, doubles (4 m, bunk
// beds) for juniors. The section cuts one row of cabins; a second row faces it across the block's corridor.
export const WASH = [], SUITE_WASH = [];   // washroom sinks and suite washrooms, for the water lines below
// Living rooms are stacked two high in the deck's 4.8 m: a lower tier, a thin floor, an upper tier opening onto a
// gallery along the corridor (behind the cut). Stairs at both ends of every block give each cabin two ways out.
export const TIER = [0, 2.45];
export const slab = (k, lo, hi) => add(`<rect class="room" x="${f(X(lo))}" y="${f(Yk(k, 2.45))}" width="${f((hi - lo) * S)}" height="${f(0.15 * S)}"/>`);
export const stair = (k, lo, hi, rise) => {   // a flight up to the upper tier, climbing toward rise (+1 right, -1 left)
  room(k, lo, hi); const n = 12, run = 0.27, start = rise > 0 ? lo + 0.35 : hi - 0.35;
  let pts = `${f(X(start))},${f(Yk(k, 0))}`;
  for (let i = 0; i < n; i++) { const m = start + rise * i * run, h = (i + 1) * 2.45 / n; pts += ` ${f(X(m))},${f(Yk(k, h))} ${f(X(m + rise * run))},${f(Yk(k, h))}`; }
  const top = start + rise * n * run;
  pts += ` ${f(X(top))},${f(Yk(k, 2.2))} ${f(X(start + rise * 0.3))},${f(Yk(k, 0))}`;
  add(`<polygon class="kit" points="${pts}"/>`);
  slab(k, Math.min(top, rise > 0 ? hi : lo), Math.max(top, rise > 0 ? hi : lo));   // the top landing
};
export const cabin = (k, lo, hi) => {
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
export const washroom = (k, lo) => {
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
export const common = (k, lo) => {
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
export const block = (k, core, d, landing, singles, doubles) => {
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
export const desks = (k, m0, m1, step = 4) => { add(`<g class="racks">`); for (let m = m0 + 1; m + 2.4 < m1 - 0.8; m += step) { if (blocked(k, m, m + 2.4)) continue; box(k, m, m + 2.4, 0.75, 0.9, "kit"); box(k, m + 0.15, m + 0.35, 0, 0.75, "kit"); box(k, m + 2.05, m + 2.25, 0, 0.75, "kit"); } add(`</g>`); };
export const lockers = (k, m0, m1, h = 2.2) => { add(`<g class="racks">`); for (let m = m0; m + 0.9 <= m1; m += 1.0) if (!blocked(k, m, m + 0.9)) box(k, m, m + 0.9, 0, h, "kit"); add(`</g>`); };

// The rest of the station: command, living, science, life support, security, stores and the escape pods.
export function drawRooms() {
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
}
