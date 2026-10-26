// Ways through the hull: the access trunks, crawlways and hatches, and the lift doorways.
import { dy, S, CRAWL, f, LIFTS, LW, add, mx, BAY, LANDING_DOORS } from './frame.mjs';
import { CG, DW, FL, DOOR, bx, CA, doorBot, AL, door9Top, SHAFT_DOORS } from './hull.mjs';
import { X, FUEL_LADDERS, TRUNKS, TW, Yk } from './rooms.mjs';

export const DOOR_SIDE = [[-1, -1, 1], [1, 1, -1]];

// Crawlways (0.9 m, too low to stand) run mid-band, between the gold feeders above and the water lines below.
export function drawAccess() {
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
}

// Lift doorways: only where a room on this face meets the shaft. Standard 3 m crew doors, like the airlocks';
// the cargo hallway's are 4 m, for loads coming up from the hold.
export function drawLiftDoors() {
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
