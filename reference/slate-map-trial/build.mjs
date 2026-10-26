// Builds slate-map.html: a try-out of the station map as an app on Quell's slate, under fog of war.
// Loads the hull side view's drawing (../../site/drawing.svg), so run ../hull-side-view/build.mjs first.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { S, X0, Y0, DH, outline as hull } from '../hull-side-view/frame.mjs';
import { css as hullCss } from '../hull-side-view/style.mjs';

const SITE = new URL('../../site/', import.meta.url);
const drawing = readFileSync(new URL('drawing.svg', SITE), 'utf8');
const [W, H] = drawing.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);

// The hull page's drawing styles, minus its page layout and light theme; colours re-pointed at the slate.
const css = '\n' + hullCss.replace(/@media \(prefers-color-scheme: light\)[\s\S]*?color-scheme: light; \} \}/, '')
  .replace(/:root\[data-theme="light"\] \{[\s\S]*?color-scheme: light; \}/, '')
  .replace(/:root \{/, '#map {')
  .replace(/\n  body \{[\s\S]*?\}\n/, '\n');

// Reveal units: every room outline, the hold and bay, and a core cell per lift per deck (shaft, trunk, risers).
const dy = (k) => Y0 + (k - 1) * DH, mx = (m) => X0 + m * S;
const deckOf = (y) => Math.min(12, Math.max(1, Math.floor((y - Y0 + 0.5) / DH) + 1));
const units = [...drawing.matchAll(/<rect class="(room|bay)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)]
  .map((r) => r.slice(2).map(Number)).filter(([, , w, h]) => w > 2 && h > 2);
units.push([mx(105), dy(9), (133 - 105) * S, 2 * DH]);   // cargo hold, two storeys
for (let k = 1; k <= 12; k++) for (const [a, b] of [[127.5, 142], [258, 272.5]]) units.push([mx(a), dy(k), (b - a) * S, DH]);
const U = units.map(([x, y, w, h], i) => ({ i, x, y, w, h, k: deckOf(y), core: i >= units.length - 24 }));

const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Slate Station Map</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${css}
  /* Layout: Quell's Blackline slate, full width, the map app open; the station drawing under fog of war. */
  :root {
    --void: #050403; --bezel: #1b1813; --edge: #3b342a; --screen: #0e0c08; --rule: #2a241a;
    --amber: #e8a33d; --amber-dim: #9b7a45; --amber-line: #5a4a2a; --teal: #9fc7c2;
    --display: "Chakra Petch", "Segoe UI", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    color-scheme: dark;
  }
  [hidden] { display: none !important; }
  html, body { height: 100%; }
  body { background: var(--void); color: var(--amber); font: 13px/1.5 var(--mono);
    padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 20px; box-sizing: border-box; }
  .slate { position: relative; max-width: 1280px; height: 100%; margin: 0 auto; box-sizing: border-box; display: flex; flex-direction: column; padding: 14px;
    background: var(--bezel); border: 1px solid var(--edge); border-radius: 22px; box-shadow: 0 18px 48px rgba(0,0,0,.65), inset 0 0 0 2px #0d0c09; }
  .screw { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: var(--edge); box-shadow: inset 0 0 0 1px #0d0c09; }
  .screen { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; background: var(--screen); border: 1px solid var(--edge); border-radius: 10px; overflow: hidden; }
  .top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 12px; padding: 10px 14px; border-bottom: 1px solid var(--edge); font-size: 11px; letter-spacing: .12em; color: var(--amber-dim); }
  .brand { font: 700 13px var(--display); letter-spacing: .2em; color: var(--amber); }
  .tabs { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 14px; border-bottom: 1px solid var(--edge); }
  button { font: 600 11px var(--display); letter-spacing: .14em; color: var(--amber); background: none; border: 1px solid var(--amber-line); border-radius: 6px; min-height: 34px; padding: 0 12px; cursor: pointer; }
  button:hover { background: #211b10; }
  button:focus-visible { outline: 2px solid var(--teal); outline-offset: 2px; }
  button[aria-pressed="true"] { background: var(--amber); border-color: var(--amber); color: var(--screen); }
  button:disabled { opacity: .35; cursor: default; background: none; }
  .app { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px 14px; }
  .bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 6px 16px; font-size: 11px; letter-spacing: .12em; color: var(--amber-dim); }
  .bar b { color: var(--amber); font-weight: 500; }
  .key { display: flex; flex-wrap: wrap; gap: 4px 14px; }
  .key span { display: inline-flex; align-items: center; gap: 6px; }
  .sw { width: 12px; height: 12px; border-radius: 2px; border: 1px solid var(--amber-line); }
  .sw.seen { background: linear-gradient(90deg, #d6b44c 0 33%, #9fc7c2 33% 66%, #e070d0 66%); border-color: transparent; }
  .sw.plan { background: #5a4a2a; }
  .sw.fog { background: var(--void); }
  .view { position: relative; flex: 1 1 auto; min-height: 260px; border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; touch-action: none; cursor: grab; background: var(--void); }
  .view.dragging { cursor: grabbing; }
  .view svg { display: block; width: 100%; height: 100%; }
  .zoom { position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; }
  .zoom button { min-width: 34px; padding: 0 8px; background: var(--screen); }
  .prompt { position: absolute; left: 8px; right: 8px; bottom: 8px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px 14px; padding: 10px 12px;
    background: var(--screen); border: 1px solid var(--amber); border-radius: 6px; }
  .prompt p { margin: 0; min-width: 0; }
  .prompt div { display: flex; gap: 6px; }
  .trial { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding-top: 10px; border-top: 1px dashed var(--amber-line); }
  .trial .lab { font-size: 10px; letter-spacing: .14em; color: var(--amber-dim); margin-right: 4px; }
  .trial button { min-height: 30px; padding: 0 9px; font-size: 10.5px; }
  .note { color: var(--amber-dim); }
  .placeholder { margin: auto; text-align: center; color: var(--amber-dim); letter-spacing: .12em; font-size: 11px; }
  /* Fog: hot spots only after a survey; the hit areas only for rooms Quell knows exist. */
  #map:not(.survey) .hot { display: none; }
  .hit { fill: transparent; cursor: pointer; }
  .hit:hover { fill: rgba(232, 163, 61, .10); }
  .hullline { fill: none; stroke: var(--amber-line); stroke-width: 1; stroke-dasharray: 3 3; }
  .you circle { fill: none; stroke: var(--amber); stroke-width: 1.2; }
  .you .ping { transform-box: fill-box; transform-origin: center; animation: ping 2.4s ease-out infinite; }
  @keyframes ping { from { transform: scale(.6); opacity: .9; } to { transform: scale(2); opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .you .ping { animation: none; opacity: .4; } }
  @media (max-width: 560px) { body { padding-block: 10px; } .slate { padding: 8px; border-radius: 16px; } .top .link { display: none; } }
  #map { --bg: #050403; --panel: #0e0c08; }
</style>
<div class="slate">
  <span class="screw" style="top:6px;left:6px"></span><span class="screw" style="top:6px;right:6px"></span>
  <span class="screw" style="bottom:6px;left:6px"></span><span class="screw" style="bottom:6px;right:6px"></span>
  <div class="screen">
    <div class="top"><span><span class="brand">BLACKLINE</span> · BLDS-X</span><span class="link">LINK · MISTRAL · PWR 98%</span></div>
    <div class="tabs" role="group" aria-label="Slate apps">
      <button type="button" data-app="timer" aria-pressed="false">TIMER</button>
      <button type="button" data-app="logs" aria-pressed="false">LOGS</button>
      <button type="button" data-app="dose" aria-pressed="false">DOSE</button>
      <button type="button" data-app="map" aria-pressed="true">MAP</button>
      <button type="button" data-app="mistral" aria-pressed="false">MISTRAL</button>
      <button type="button" data-app="tools" aria-pressed="false">TOOLS</button>
    </div>
    <div class="app" id="app-map">
      <div class="bar">
        <span>DOVETAIL-9 · HULL SECTION · <b id="where">AIRLOCK B · DECK 09</b></span>
        <span class="key"><span><i class="sw seen"></i>SEEN</span><span><i class="sw plan"></i>PLAN ONLY · STATE UNKNOWN</span><span><i class="sw fog"></i>UNMAPPED</span></span>
      </div>
      <div class="view" id="view">
        <svg id="map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Quell's map of Dovetail-9: only rooms he has seen or downloaded are drawn.">
          <defs>
            <g id="dt9"></g>
            <filter id="planfx" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.3 0.3 0.3 0 0.05  0.24 0.24 0.24 0 0.03  0.12 0.12 0.12 0 0  0 0 0 1 0"/></filter>
            <mask id="m-plan" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/><g id="plan-holes" fill="#fff"></g></mask>
            <mask id="m-seen" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/><g id="seen-holes" fill="#fff"></g></mask>
          </defs>
          <polygon class="hullline" points="${hull}"/>
          <use href="#dt9" mask="url(#m-plan)" filter="url(#planfx)"/>
          <use href="#dt9" mask="url(#m-seen)"/>
          <g id="hits"></g>
          <g class="you" id="you"><circle class="ping" r="6"/><circle r="2.2"/></g>
        </svg>
        <div class="zoom"><button type="button" data-z="in" aria-label="Zoom in">+</button><button type="button" data-z="out" aria-label="Zoom out">−</button><button type="button" data-z="fit">FIT</button></div>
        <div class="prompt" id="prompt" hidden><p id="prompt-text"></p><div><button type="button" id="go">GO</button><button type="button" id="cancel">CANCEL</button></div></div>
      </div>
      <div class="trial">
        <span class="lab">TRY-OUT · LINK TERMINAL ON DECK</span>
        <span id="decks"></span>
        <button type="button" id="survey" aria-pressed="false">RADIATION SURVEY</button>
        <button type="button" id="reset">RESET MAP</button>
      </div>
      <p class="note" style="margin:0;font-size:11px">Tap a mapped room to travel there. Linking a terminal downloads its deck as a plan: rooms and routes, but door states and damage stay unknown (greyed) until Quell goes there. Radiation shows only after a survey.</p>
    </div>
    <div class="app" id="app-other" hidden><p class="placeholder">NOT PART OF THIS TRY-OUT</p></div>
  </div>
</div>
<script>
// The station drawing is the hull side view's own file, loaded into both views of the map. The slate draws its own marker.
fetch('../drawing.svg').then(function (r) { return r.text(); }).then(function (t) {
  var g = document.getElementById('dt9'), src = new DOMParser().parseFromString(t, 'image/svg+xml').documentElement;
  Array.from(src.childNodes).forEach(function (n) { g.appendChild(document.importNode(n, true)); });
  var here = g.querySelector('.here'); if (here) here.remove();
});
(function () {
  var U = ${JSON.stringify(U.map((u) => [+u.x.toFixed(1), +u.y.toFixed(1), +u.w.toFixed(1), +u.h.toFixed(1), u.k, u.core ? 1 : 0]))};
  var W = ${W}, H = ${H}, NS = 'http://www.w3.org/2000/svg';
  var START = { seen: [], plan: [], at: null, survey: false };
  // Quell comes aboard at Airlock B: that room and its ready room are all he has seen.
  U.forEach(function (u, i) { if (u[4] === 9 && u[1] > 300 && u[0] > 715 && u[0] < 752 && !u[5]) START.seen.push(i); });
  START.at = START.seen[0];
  var KEY = 'slate-map-trial', st;
  try { st = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  if (!st || !st.seen) st = JSON.parse(JSON.stringify(START));
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  function has(a, i) { return a.indexOf(i) >= 0; }
  function deckName(k) { return 'DECK ' + (k < 10 ? '0' : '') + k; }
  function where(i) { var u = U[i]; return deckName(u[4]) + ' · ' + Math.round((u[0] - 120) / 2.4) + ' TO ' + Math.round((u[0] + u[2] - 120) / 2.4) + ' M'; }
  // Seeing a room also shows its deck's lift core: Quell came through it.
  function coreOf(k) { return U.map(function (u, i) { return u[5] && u[4] === k ? i : -1; }).filter(function (i) { return i >= 0; }); }
  function rect(g, u, cls) { var r = document.createElementNS(NS, 'rect'); r.setAttribute('x', u[0]); r.setAttribute('y', u[1]); r.setAttribute('width', u[2]); r.setAttribute('height', u[3]); if (cls) r.setAttribute('class', cls); g.appendChild(r); return r; }
  var map = document.getElementById('map'), seenG = document.getElementById('seen-holes'), planG = document.getElementById('plan-holes'), hits = document.getElementById('hits');
  function draw() {
    var seen = st.seen.slice();
    st.seen.forEach(function (i) { coreOf(U[i][4]).forEach(function (c) { if (!has(seen, c)) seen.push(c); }); });
    var plan = []; st.plan.forEach(function (k) { U.forEach(function (u, i) { if (u[4] === k) plan.push(i); }); });
    seenG.textContent = ''; planG.textContent = ''; hits.textContent = '';
    plan.forEach(function (i) { rect(planG, U[i]); });
    seen.forEach(function (i) { rect(seenG, U[i]); });
    U.forEach(function (u, i) {
      if (u[5] || !(has(seen, i) || has(plan, i)) || i === st.at) return;
      var r = rect(hits, u, 'hit'); r.addEventListener('click', function () { if (!moved) ask(i); });
    });
    var a = U[st.at]; var you = document.getElementById('you');
    you.setAttribute('transform', 'translate(' + (a[0] + a[2] / 2) + ' ' + (a[1] + a[3] - 6) + ')');
    document.getElementById('where').textContent = where(st.at);
    map.classList.toggle('survey', st.survey);
    document.getElementById('survey').setAttribute('aria-pressed', st.survey);
    document.querySelectorAll('#decks button').forEach(function (b) { b.setAttribute('aria-pressed', has(st.plan, +b.dataset.k)); });
    save();
  }
  var pending = null;
  function ask(i) { pending = i; document.getElementById('prompt-text').textContent = 'Go to ' + where(i) + '?'; document.getElementById('prompt').hidden = false; document.getElementById('go').focus(); }
  function closePrompt() { pending = null; document.getElementById('prompt').hidden = true; }
  document.getElementById('go').onclick = function () { if (pending === null) return; if (!has(st.seen, pending)) st.seen.push(pending); st.at = pending; closePrompt(); draw(); };
  document.getElementById('cancel').onclick = closePrompt;
  var decks = document.getElementById('decks');
  for (var k = 1; k <= 12; k++) { var b = document.createElement('button'); b.type = 'button'; b.dataset.k = k; b.textContent = (k < 10 ? '0' : '') + k; b.style.marginRight = '4px';
    b.onclick = function () { var k = +this.dataset.k, p = st.plan.indexOf(k); if (p < 0) st.plan.push(k); else st.plan.splice(p, 1); draw(); }; decks.appendChild(b); }
  document.getElementById('survey').onclick = function () { st.survey = !st.survey; draw(); };
  document.getElementById('reset').onclick = function () { st = JSON.parse(JSON.stringify(START)); closePrompt(); draw(); focusYou(); };
  document.querySelectorAll('.tabs button').forEach(function (t) { t.onclick = function () {
    document.querySelectorAll('.tabs button').forEach(function (o) { o.setAttribute('aria-pressed', o === t); });
    document.getElementById('app-map').hidden = t.dataset.app !== 'map'; document.getElementById('app-other').hidden = t.dataset.app === 'map'; }; });

  // Zoom and pan by rewriting the viewBox, matched to the window's shape.
  var vp = document.getElementById('view'), A = 1, fitW = W, v = { x: 0, y: 0, w: W, h: H }, moved = false;
  function measure() { var r = vp.getBoundingClientRect(); A = r.width ? r.height / r.width : H / W; fitW = Math.max(W, H / A); }
  function clamp() { v.w = Math.min(fitW, Math.max(fitW / 20, v.w)); v.h = v.w * A;
    v.x = v.w >= W ? (W - v.w) / 2 : Math.min(W - v.w, Math.max(0, v.x)); v.y = v.h >= H ? (H - v.h) / 2 : Math.min(H - v.h, Math.max(0, v.y)); }
  function apply() { map.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h); }
  function zoomAt(f, px, py) { var nw = Math.min(fitW, Math.max(fitW / 20, v.w / f)), q = nw / v.w; v.x = px - (px - v.x) * q; v.y = py - (py - v.y) * q; v.w = nw; clamp(); apply(); }
  function toSvg(cx, cy) { var r = map.getBoundingClientRect(); return { x: v.x + (cx - r.left) / r.width * v.w, y: v.y + (cy - r.top) / r.height * v.h }; }
  function focusYou() { var a = U[st.at]; v.w = fitW / 4; v.h = v.w * A; v.x = a[0] + a[2] / 2 - v.w / 2; v.y = a[1] + a[3] / 2 - v.h / 2; clamp(); apply(); }
  measure(); focusYou();
  window.addEventListener('resize', function () { var z = fitW / v.w, cx = v.x + v.w / 2, cy = v.y + v.h / 2; measure(); v.w = fitW / z; v.h = v.w * A; v.x = cx - v.w / 2; v.y = cy - v.h / 2; clamp(); apply(); });
  vp.addEventListener('wheel', function (e) { e.preventDefault(); var p = toSvg(e.clientX, e.clientY); zoomAt(Math.exp(-e.deltaY * 0.0015), p.x, p.y); }, { passive: false });
  var pts = new Map(), pinch = null, travel = 0;
  vp.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); travel = 0; moved = false; });
  vp.addEventListener('pointermove', function (e) {
    var prev = pts.get(e.pointerId); if (!prev) return; var cur = { x: e.clientX, y: e.clientY }; pts.set(e.pointerId, cur);
    travel += Math.abs(cur.x - prev.x) + Math.abs(cur.y - prev.y); if (travel > 6 && !moved) { moved = true; vp.setPointerCapture(e.pointerId); vp.classList.add('dragging'); }
    if (pts.size === 1 && moved) { var r = map.getBoundingClientRect(); v.x -= (cur.x - prev.x) / r.width * v.w; v.y -= (cur.y - prev.y) / r.height * v.h; clamp(); apply(); }
    else if (pts.size === 2) { var a = Array.from(pts.values()), d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y), m = toSvg((a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2); if (pinch) zoomAt(d / pinch, m.x, m.y); pinch = d; moved = true; }
  });
  function end(e) { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (!pts.size) vp.classList.remove('dragging'); }
  vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
  document.querySelector('.zoom').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.z === 'fit') { v.w = fitW; clamp(); apply(); } else zoomAt(b.dataset.z === 'in' ? 1.5 : 1 / 1.5, v.x + v.w / 2, v.y + v.h / 2); });
  draw();
})();
</script>`;
mkdirSync(new URL('slate-map/', SITE), { recursive: true });
writeFileSync(new URL('slate-map/index.html', SITE), html);
console.log('ok', U.length, 'reveal units');
