// Coordinates, the shared drawing list and the helpers every system uses.

export const S = 2.4;                 // drawing units per metre
export const X0 = 120, Y0 = 150;      // hull top-left
export const L = 400, DECK = 8;       // hull length, metres per deck
export const DH = DECK * S;           // 19.2
export const X1 = X0 + L * S;         // 1080
export const Y1 = Y0 + 12 * DH;       // 310.4
export const mx = (m) => +(X0 + m * S).toFixed(1);
export const dy = (k) => +(Y0 + (k - 1) * DH).toFixed(1);
export const f = (n) => +n.toFixed(1);
// Stepped profile: tiers on top, full length through the middle decks where the array attaches, keel modules below.
export const SPAN = [null, [130, 270], [95, 305], [60, 340], [25, 375], [0, 400], [0, 400], [0, 400], [0, 400], [10, 390], [25, 375], [45, 355], [100, 300]];
export const BAY = [151, 249];
export const LIFTS = [135, 265], LW = 4;   // the only positions that reach all 12 decks, clear of engineering and the bay   // centred under the superstructure
export const pts = [];
for (let k = 1; k <= 12; k++) pts.push([mx(SPAN[k][1]), dy(k)], [mx(SPAN[k][1]), dy(k + 1)]);
for (let k = 12; k >= 1; k--) pts.push([mx(SPAN[k][0]), dy(k + 1)], [mx(SPAN[k][0]), dy(k)]);
export const outline = pts.map(([x, y]) => x + "," + y).join(" ");

export let svg = [];
export const add = (s) => svg.push(s);

// The station power grid (gold) is drawn behind everything that follows: where it passes behind equipment, it's in the back wall.
export const GOLD = [], EARLY = [], CRAWL = [], TERMS = [];   // TERMS: every SIGMA terminal, for the data network
export const FIRE_PLANTS = [];   // fire suppression plants' outlets and tank inlets, for the red network
export const LANDING_DOORS = [];   // [metres along, deck]: housing landings out to their stair and corridor
export const gold = (pts) => GOLD.push(`<polyline class="grid-power" points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}"/>`);

// Numbered key tag for rooms too small to label; the legend names them.
// SIGMA's emblem: a white sigma in a broken ring, the ring's upper right arc in red.
export const sigmaLogo = (cx, cy, r) => {
  const pt = (deg) => { const a = deg * Math.PI / 180; return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`; };
  const arc = (a0, a1) => `M ${pt(a0)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${pt(a1)}`;
  const w = r * 0.44, h = r * 0.5, t = r * 0.15;
  const sig = [[w, -h + t], [w, -h], [-w, -h], [w * 0.15, 0], [-w, h], [w, h], [w, h - t]].map(([x, y]) => `${f(cx + x)},${f(cy + y)}`).join(" ");
  return `<g class="sigma-logo"><circle class="sl-bg" cx="${f(cx)}" cy="${f(cy)}" r="${r}"/><path class="sl-ring" d="${arc(4, 283)}"/><path class="sl-red" d="${arc(-68, -4)}"/><polyline class="sl-sigma" points="${sig}"/></g>`;
};
// Tags are drawn last so they sit solid over the conduits and lift lines.
export const tags = [];
// Optional vertical offset lets a tag share a narrow room with the you-are-here marker.
export const tag = (m, k, n, off = 0) => `<g class="tag sm"><circle cx="${f(mx(m))}" cy="${f(dy(k) + DH / 2 + off)}" r="4.8"/><text x="${f(mx(m))}" y="${f(dy(k) + DH / 2 + off + 1.75)}" text-anchor="middle">${n}</text></g>`;
