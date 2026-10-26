// Water, SIGMA's data network and air.
import { f, mx, dy, S, add, DH, LIFTS, LW, tags, tag, GOLD, TERMS, BAY, SPAN } from './frame.mjs';
import { FL } from './hull.mjs';
import { water, DX, run, X, SX, WY, DBX, Yk, SUITE_WASH, WASH, RX, TRUNKS } from './rooms.mjs';
import { DOOR_SIDE } from './doors.mjs';

// Deck 11 beyond the lifts: the water system. Treatment and tanks on the left, the waste plant on the right.
// Drains fall down the lift cores to here, the lowest living-side deck; potable water is pumped back up the left core.
export function drawWaterPlant() {
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

// Water branches (teal) off the supply riser: galley, clinic, both hydroponics bays, both life support plants.
// Vacuum toilets: suction, not gravity, so the left-side washrooms' waste rises from Deck 04 and crosses Deck 03's
// band to the right core's toilet drain. VR is Deck 04's riser, beside its washroom.
export function drawWaterBranches() {
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
}

// SIGMA's network: a line from the column along each of Decks 01 to 04, and down the access trunks (where the
// risers run) to the lower decks. Each deck's line reaches its farthest terminal; a drop serves each one.
export function drawNetwork() {
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

// Air: a life support plant at each end of Deck 07 serves its own half. A riser beside each lift's outer wall,
// Deck 12 to 01, feeds a duct along every deck's service band. Each duct carries supply and return side by side.
export function drawAir() {
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
