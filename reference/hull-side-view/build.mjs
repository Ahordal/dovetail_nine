// Builds hull-side-view.html: a to-scale side elevation of Dovetail-9's hull.
// Each system lives in its own module; this file sets the draw order, then finishes the drawing and writes the page.
import { writeFileSync } from 'node:fs';
import { X0, Y1, X1, Y0, DH, L, mx, f, svg, add, GOLD, EARLY, CRAWL, tags } from './frame.mjs';
import { goldAt, hullMid, hereMarker } from './hull.mjs';   // draws the hull, the decks and the bay
import { T, drawRooms } from './rooms.mjs';
import { drawFuel, drawEngineering, drawTrusses, drawGrid, drawFeeders } from './power.mjs';
import { drawAccess, drawLiftDoors } from './doors.mjs';
import { drawWaterPlant, drawWaterBranches, drawNetwork, drawAir } from './services.mjs';
import { drawFire } from './fire.mjs';
import { page } from './page.mjs';

drawFuel();
drawWaterPlant();
drawEngineering();
drawTrusses();
drawGrid();
drawRooms();
drawFeeders();
drawWaterBranches();
drawAccess();
drawNetwork();
T.forEach((t) => tags.push(t));
drawLiftDoors();
drawAir();
drawFire();
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

writeFileSync(new URL('./hull-side-view.html', import.meta.url), page(W, H, svg));
console.log('ok', W, H);
