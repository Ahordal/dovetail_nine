// Power: fuel and backup on Deck 12, the X9 plant, the trusses, the station grid and its feeders.
import { f, mx, dy, S, add, DH, LIFTS, LW, tags, tag, X1, X0, gold, GOLD } from './frame.mjs';
import { FL, hollow, PD, DW, DOOR, midY, ccx, cr } from './hull.mjs';
import { feed, RA, RB } from './rooms.mjs';

// Deck 12, under the bay: all fuel and backup power. Water and waste live a deck up, either side of the bay.
export function drawFuel() {
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

// Engineering plant around the X9 (see lore x9-power-system): shells, penetrations, auxiliaries, heat and power halls.
export function drawEngineering() {
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
export function drawTrusses() {
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
}

// The station grid: Bus A from the main generator, Bus B from the backup set, risers beside both lift cores,
// feeders along each deck's service band. Gold, behind everything (see GOLD above).
export function drawGrid() {
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

// Power feeders (gold) to every new major system, from the two risers along each deck's service band.
export function drawFeeders() {
  feed(1, RA, 143.1, 1, 1.4); feed(1, RA, 156, 1, 2.8); feed(1, RA, 185.5, 1, 1.3);
  feed(1, RB, 256.9, 1, 1.4); feed(1, RB, 214.5, 1, 1.3); feed(1, RB, 236, 1, 1.7);
  feed(2, RA, 143, 2, 0.9); feed(2, RB, 280.3, 2, 1.4);
  feed(3, RA, 140.15, 3, 1.4); feed(3, RA, 100, 4, 11.5); feed(3, RB, 300, 4, 11.5);
  feed(4, RA, 36.1, 4, 5.4); feed(4, RB, 363.9, 4, 5.4);   // onto a pod, clear of the centred tag
  feed(5, RA, 90, 5, 3.2); feed(5, RB, 315.8, 5, 2.4); feed(3, RB, 220.5, 3, 2.4);
  feed(6, RA, 14.4, 6, 1.7); feed(6, RB, 385.6, 6, 1.7);
  feed(7, RA, 124, 7, 2.6); feed(7, RB, 276, 7, 2.6);
  feed(8, RA, 95, 8, 0.9);
}
