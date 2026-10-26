// The page's stylesheet: tokens, layout, and every drawing class.
export const css = `  /* Layout: one wide to-scale drawing, the station's own amber-on-black, with the record of decisions below. */
  :root {
    --bg: #0b0c0d; --panel: #111315; --line: #2a2d30; --deck: #1d2023; --service: #0e1011;
    --fg: #e8e4da; --muted: #8c8880; --accent: #e8a33d; --void: #030405; --ship: #a8a49a;
    --open: #9fc7c2; --locked: #e5534b; --unlocked: #57b36a; --gold: #d6b44c; --leaf: #5ee35a; --air: #a9a3f0; --data: #e070d0; --fire: #ff2626;
    --display: "Chakra Petch", "Segoe UI", sans-serif;
    --mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;
    color-scheme: dark;
  }
  @media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69; --locked: #b42318; --unlocked: #1f7a3a; --gold: #8a6c00; --leaf: #2e9a2a; --air: #5a4fc4; --data: #a0308f; --fire: #e8000b;
    color-scheme: light; } }
  :root[data-theme="light"] {
    --bg: #eceef0; --panel: #ffffff; --line: #b9bfc5; --deck: #cfd4d8; --service: #e2e5e8;
    --fg: #15181b; --muted: #5a5f65; --accent: #a5650c; --void: #c3c9ce; --ship: #4a4f55; --open: #2f6f69; --locked: #b42318; --unlocked: #1f7a3a; --gold: #8a6c00; --leaf: #2e9a2a; --air: #5a4fc4; --data: #a0308f; --fire: #e8000b;
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
  .layers { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 14px; margin: 0; padding: 8px 14px 0; border: 0; font-size: 12px; color: var(--muted); }
  .layers legend { float: left; margin-right: 4px; padding: 0; font-size: 11px; letter-spacing: 0.12em; }
  .layers label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
  .layers input { margin: 0; accent-color: var(--accent); }
  /* Each layer hides by a class on the drawing, so the legend's swatches never change. */
  #hull.hide-power :is(.power, .grid-power, .power-node),
  #hull.hide-data :is(.data, .data-node),
  #hull.hide-air :is(.duct, .duct-behind),
  #hull.hide-fire :is(.fire, .fire-nozzle),
  #hull.hide-water :is(.water, .water-waste, .water-hidden, .tank-potable, .tank-waste),
  #hull.hide-access :is(.crawl, .junction, .shaft, .ladder, .rung, .hatch),
  #hull.hide-doors :is(.door, .airlock),
  #hull.hide-equipment :is(.plant, .racks, .term, .term-screen, .clock, .gantry, .clamp, .trap, .shell, .emitter, .radiator, .radline, .busbar, .frost, .plant-leaf) { display: none; }
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
  .power, .grid-power { fill: none; stroke: var(--gold); stroke-width: 0.6; stroke-linejoin: round; }
  .power-node { fill: var(--gold); }
  .power.tram-behind { stroke-opacity: 0.45; }
  .tram-behind { stroke-opacity: 0.3; }
  .rung { stroke: var(--muted); stroke-width: 0.3; }
  .data { fill: none; stroke: var(--data); stroke-width: 0.5; }
  .data-core { stroke-width: 0.7; }
  .data-node { fill: var(--data); }
  .data-behind { stroke-width: 0.4; stroke-dasharray: 1.2 0.9; }
  .fire { fill: none; stroke: var(--fire); stroke-width: 0.5; stroke-linejoin: round; }
  .fire-behind { stroke-width: 0.4; stroke-dasharray: 1.2 0.9; }
  .fire-nozzle { fill: var(--fire); stroke: var(--fire); stroke-width: 0.3; stroke-linejoin: round; }
  .duct { fill: none; stroke-linecap: square; }
  .duct-o { stroke: var(--air); stroke-width: 1.1; }
  .duct-i { stroke: var(--bg); stroke-width: 0.4; }
  .duct-behind { stroke: var(--air); stroke-width: 0.35; stroke-dasharray: 1.2 0.9; }
  .shaft { fill: var(--bg); stroke: var(--deck); stroke-width: 1; }
  .lift { fill: none; stroke: var(--muted); stroke-width: 0.9; }
  .behind { fill: none; stroke: var(--muted); stroke-width: 0.9; stroke-dasharray: 3 2; }
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
  .ladder { fill: none; stroke: var(--muted); stroke-width: 0.35; }
  .room-wall { stroke: var(--muted); stroke-width: 1; }
  .crawl { fill: var(--panel); stroke: var(--muted); stroke-width: 0.7; }
  .junction { fill: var(--panel); stroke: var(--fg); stroke-width: 0.5; }
  .term { fill: var(--panel); stroke: var(--fg); stroke-width: 0.4; }
  .clock rect { fill: var(--panel); stroke: var(--fg); stroke-width: 0.4; }
  .clock circle { fill: var(--accent); }
  .tap { stroke: var(--muted); stroke-width: 0.9; }
  .term-screen { fill: var(--accent); stroke: var(--fg); stroke-width: 0.4; }
  .plant-leaf { fill: var(--leaf); stroke: none; }
  .water, .water-waste, .water-hidden { fill: none; stroke: var(--open); stroke-width: 0.6; stroke-linejoin: round; }
  .tank-potable { fill: var(--panel); stroke: var(--open); stroke-width: 0.6; }
  .tank-waste { fill: var(--panel); stroke: var(--muted); stroke-width: 0.6; }
  .shell { fill: none; stroke: var(--muted); stroke-width: 0.6; stroke-dasharray: 2 2; }
  .trap { fill: var(--panel); stroke: var(--fg); stroke-width: 0.6; }
  .busbar { fill: none; stroke: var(--muted); stroke-width: 1.4; }
  .emitter { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .radiator { fill: none; stroke: var(--muted); stroke-width: 0.5; }
  .radline { fill: none; stroke: var(--muted); stroke-width: 0.6; stroke-dasharray: 4 1 1 1; }
  .frost { fill: none; stroke: var(--open); stroke-width: 0.4; }
  .hot circle { fill: var(--accent); }
  .hot .hot-hub { fill: var(--bg); }
  .hold-floor { stroke: var(--muted); stroke-width: 1; }
  .hold { fill: none; stroke: var(--muted); stroke-width: 1; }
  .hold-mask { fill: var(--bg); }
  .racks .upright { stroke: var(--muted); stroke-width: 0.9; }
  .racks .shelf { stroke: var(--muted); stroke-width: 0.9; }
  .racks .chord { stroke: var(--muted); stroke-width: 0.5; }
  .racks .web { fill: none; stroke: var(--muted); stroke-width: 0.4; }
  .racks .brace { stroke: var(--muted); stroke-width: 0.4; stroke-opacity: 0.7; }
  .racks .crate { fill: var(--line); stroke: var(--muted); stroke-width: 0.5; }
  .racks .kit { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .racks .reel { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .plant rect, .plant circle { fill: var(--panel); stroke: var(--muted); stroke-width: 0.5; }
  .plant line { stroke: var(--muted); stroke-width: 0.5; }
  .plant .flange { stroke-width: 0.35; }
  .plant .pipe { stroke-width: 0.45; }
  .plant .hidden { stroke-dasharray: 1.2 0.9; }
  .plant .pipe-o { fill: none; stroke: var(--muted); stroke-width: 1.65; }
  .plant .pipe-i { fill: none; stroke: var(--panel); stroke-width: 0.75; }
  .clamp rect, .clamp circle { fill: var(--bg); stroke: var(--muted); stroke-width: 1; }
  .umbilical { fill: none; stroke: var(--ship); stroke-width: 0.9; stroke-dasharray: 3 2; }
  .airlock, .door { fill: var(--ship); }
  .door-open { fill: var(--unlocked); }
  .door-locked { fill: var(--locked); }
  .window { fill: var(--bg); stroke: var(--ship); stroke-width: 0.4; }
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
  .tag.sm text { font-size: 5px; letter-spacing: 0; }   /* inherited spacing pushes text-anchor off centre */
  .tag.sm circle { stroke-width: 0.7; }
  .legend { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 6px 24px; padding: 10px 14px; border-top: 1px solid var(--line); }
  .legend ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; }
  .legend li { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--muted); }
  .sheet .swatch { display: inline-block; width: 28px; min-width: 0; height: 12px; flex: none; overflow: visible; }
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
`;
