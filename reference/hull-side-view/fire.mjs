// Fire suppression.
import { dy, S, svg, EARLY, GOLD, CRAWL, f, mx, FIRE_PLANTS, LIFTS, LW, BAY, SPAN, add } from './frame.mjs';
import { FL } from './hull.mjs';

// Fire suppression: one red network (mist for crewed rooms, inert gas for electronics, by zone). Each Deck 08 plant
// feeds a main along every deck's room ceilings via a riser beside its lift; Deck 12's main ties the halves together.
export function drawFire() {
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
