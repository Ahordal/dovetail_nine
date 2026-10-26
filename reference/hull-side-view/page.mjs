// The page around the drawing: header, layer toggles, legend, record and scripts.
import { sigmaLogo } from './frame.mjs';
import { css } from './style.mjs';

export const page = (W, H) => `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>Dovetail-9 Hull Section</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
${css}</style>
<div class="wrap">
  <header>
    <span class="eyebrow">DOVETAIL-9 · MAIN HULL · SIDE VIEW · DRAFT</span>
    <h1>Hull section, decks 01 to 12</h1>
    <p class="lede">Looking at the side of the hull where the docking bay opens. Drawn to scale: 400 m at its longest, 12 decks of about 8 m each. The profile is stepped like the exterior image: tiers on top, full length through the middle decks where the array attaches, modules hanging below.</p>
  </header>
  <figure class="sheet" style="margin: 0">
    <div class="viewport" id="hull-viewport" tabindex="0" aria-label="Hull drawing. Scroll or pinch to zoom, drag to pan; plus, minus and zero keys also work.">
    <div class="zoom" role="group" aria-label="Zoom">
      <button type="button" data-zoom="in" aria-label="Zoom in">+</button>
      <button type="button" data-zoom="out" aria-label="Zoom out">−</button>
      <button type="button" data-zoom="fit" aria-label="Fit whole drawing">Fit</button>
      <output id="hull-zoom-level" aria-live="polite">100%</output>
    </div>
    <svg id="hull" viewBox="0 0 ${W} ${H}" role="img" aria-label="Side view of the Dovetail-9 hull: twelve decks stacked, numbered from the top. A tram runs the full length of Deck 06, beside the conduits and keel. The Core Chamber, a dashed sphere, sits at the middle of the hull across Decks 05 to 07 inside the engineering section. The docking bay is an open space across Decks 08 to 11, centred along the hull under the stepped superstructure, holding the Mistral, seen from astern, with a boarding umbilical to Airlock B on Deck 09. Two jagged comms spires on top, a taller one left of centre and a shorter twin-tipped one to its right, with smaller masts and dishes around them, and the Anchor Core array continuing from both ends.">
    </svg>
    </div>
    <fieldset class="layers" id="hull-layers">
      <legend>LAYERS</legend>
      <label><input type="checkbox" value="power" checked>Power</label>
      <label><input type="checkbox" value="water" checked>Water</label>
      <label><input type="checkbox" value="air" checked>Air</label>
      <label><input type="checkbox" value="data" checked>SIGMA network</label>
      <label><input type="checkbox" value="fire" checked>Fire suppression</label>
      <label><input type="checkbox" value="access" checked>Maintenance access</label>
      <label><input type="checkbox" value="doors" checked>Doors and hatches</label>
      <label><input type="checkbox" value="equipment" checked>Equipment</label>
    </fieldset>
    <p class="zoom-hint">Scroll or pinch to zoom, drag to pan.</p>
<div class="legend">
      <ul aria-label="Room key">
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true">${sigmaLogo(14, 6, 5.5)}</svg>SIGMA&apos;s core, Decks 01 to 04</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">1</text></g></svg>SIGMA operations room, Deck 04</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">2</text></g></svg>R&amp;D, Deck 05: Node Physics, the damped test cell</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">3</text></g></svg>Experiment control, Deck 05</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">4</text></g></svg>Lift lobby and tram stop, Deck 06</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">5</text></g></svg>Bank A capacitor hall, Deck 07</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">6</text></g></svg>Bank B capacitor hall, Deck 07</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">A</text></g></svg>Airlock A, Deck 09, its umbilical pulled back</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">B</text></g></svg>Airlock B, Deck 09: the umbilical to the Mistral</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">7</text></g></svg>Ready room, from the lift to each airlock: Deck 09, and Deck 10 for cargo</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">8</text></g></svg>Cargo hold, Decks 09 to 10: truss shelving, a ceiling crane</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">9</text></g></svg>Cargo dock, raised a deck above the bay floor</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">C</text></g></svg>Cargo airlock, Deck 10, inside the cargo door</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">10</text></g></svg>Docking control, Deck 10: a wide window and control desk</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">11</text></g></svg>Bay workshop, Deck 11: bench, parts cabinet, a window onto the bay</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">12</text></g></svg>Fuel transfer pumps and filters, Deck 12</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">13</text></g></svg>Fuel tank halls, Deck 12</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">14</text></g></svg>Backup fuel cells, hydrogen and oxygen, Deck 12, piped up to hose stations in the bay</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">15</text></g></svg>Switchgear and batteries, Deck 12</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">16</text></g></svg>Water recovery plant, Deck 11: filters, reactor, reverse osmosis, UV</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">17</text></g></svg>Water tanks, Deck 11: four potable, two wastewater</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">18</text></g></svg>Waste plant, Deck 11: urine distiller, brine, digester</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">19</text></g></svg>Observation gallery, Deck 05, a viewport into the chamber</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">20</text></g></svg>Cryogenic plant, Deck 05: keeps the X9's coils cold</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">21</text></g></svg>Trap auxiliaries, Deck 05: charge injectors, position control</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">22</text></g></svg>Harvest Ring turbine hall, Deck 07: the station's main power</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">23</text></g></svg>Backup generator set, Deck 07: feeds the isolated backup bus</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">24</text></g></svg>Penetration vaults, Deck 06: conduits leave the dome; dampening coil drivers</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">25</text></g></svg>Switch room A, Deck 06: Bus A, the primary bus</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">26</text></g></svg>Switch room B, Deck 06: Bus B, backup and the X9's auxiliaries</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">27</text></g></svg>Lift machinery, Deck 01</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">28</text></g></svg>Command, Deck 01, around SIGMA's column</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">29</text></g></svg>Comms room and the beacon, Deck 01</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">30</text></g></svg>Administration and records, Deck 01</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">31</text></g></svg>Senior staff suites, Deck 02: Level 6, each with a private washroom</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">32</text></g></svg>Galley, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">33</text></g></svg>Mess, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">34</text></g></svg>Recreation lounge, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">35</text></g></svg>Laundry and stores, Deck 02</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">36</text></g></svg>Hydroponics, Decks 03 to 04, two storeys</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">37</text></g></svg>Medical clinic, Deck 03</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">38</text></g></svg>Science office, Deck 03: the Director&apos;s office, briefing room, records</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">39</text></g></svg>Crew cabins, stacked two high with a stair at each end: singles for senior grades, doubles with bunks for juniors</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">40</text></g></svg>Escape pods: 14 lifeboats, hatches under lockdown</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">41</text></g></svg>Materials lab, Deck 05: fatigue rig, spectrometer</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">42</text></g></svg>Array access, Deck 06: airlock, suits, tools</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">43</text></g></svg>Life support, Deck 07: oxygen, CO₂ scrubbing, air handling</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">44</text></g></svg>Maintenance shops, Deck 07</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">45</text></g></svg>Security: office, armoury, holding cell, Deck 08</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">46</text></g></svg>Fire and emergency stores, Deck 08</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">57</text></g></svg>Fire suppression plant, Deck 08, one at each end: mist tank and pumps, inert gas cylinders</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">47</text></g></svg>Gym, Deck 08</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">48</text></g></svg>Logistics stores, Deck 10</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">49</text></g></svg>Recycling and sorting, Deck 11</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">50</text></g></svg>Time standards lab, Deck 05: the master clocks</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">51</text></g></svg>Corridor analysis, Deck 05: Stratovan analyzers, the phase map</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">52</text></g></svg>Array receiver room, Deck 05: the forward array&apos;s sensors</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">53</text></g></svg>Exposure lab, Deck 03: neural rhythms, cultures, growth chambers</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">54</text></g></svg>Washroom: toilets, showers, sinks</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">55</text></g></svg>Common room for each cabin block</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="5"/><text x="14" y="8.3" text-anchor="middle">56</text></g></svg>Pod muster station, Deck 09: benches, emergency lockers, pod status board</li>
      </ul>
      <ul aria-label="Line styles">
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="behind" x1="2" y1="6" x2="26" y2="6"/></svg>Deeper in the hull than this face</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="lift" x1="9" y1="0" x2="9" y2="12"/><line class="lift" x1="19" y1="0" x2="19" y2="12"/><circle class="stop" cx="14" cy="6" r="1.8"/><rect class="door door-open" x="18.5" y="2" width="1" height="8"/></svg>Lift stop and doorway</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="tram" x1="2" y1="6" x2="26" y2="6"/></svg>Tram, Deck 06</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="conduit" x1="2" y1="6" x2="26" y2="6"/></svg>Conduits and keel</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="grid-power" d="M 2 7 H 12 A 2 2 0 0 1 16 7 H 26 M 14 1 V 12"/></svg>Station power grid; a hop where two lines cross without joining</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="shaft" x="9" y="0" width="10" height="12"/><line class="rung" x1="10" y1="4" x2="18" y2="4"/><line class="rung" x1="10" y1="8" x2="18" y2="8"/></svg>Access shaft with ladder (engineering)</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="crawl" x="1" y="1" width="26" height="3"/><rect class="shaft" x="11.5" y="2.5" width="5" height="9.5"/><line class="ladder" x1="13" y1="3" x2="13" y2="12"/><line class="ladder" x1="15" y1="3" x2="15" y2="12"/><rect class="junction" x="10" y="0" width="8" height="5"/><rect class="door door-open" x="12" y="1.2" width="4" height="2.6"/></svg>Maintenance access: crawlway, vertical way, junction box and hatch</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="plant"><rect x="2" y="1" width="24" height="3"/><line class="flange" x1="10" y1="1" x2="10" y2="4"/><line class="flange" x1="18" y1="1" x2="18" y2="4"/><rect x="4" y="6" width="6" height="5.5" rx="1.5"/><circle cx="16" cy="9" r="2.2"/><line class="pipe" x1="21" y1="6" x2="21" y2="12"/></g></svg>Airlock machinery, locked hatch from each ready room</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="plant"><line class="pipe hidden" x1="2" y1="5" x2="26" y2="5"/><line class="pipe hidden" x1="2" y1="7.5" x2="26" y2="7.5"/></g></svg>Pipes hidden inside a wall</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="window" x="13.5" y="1" width="1" height="10"/></svg>Window</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><circle class="shell" cx="14" cy="6" r="5"/><rect class="trap" x="11" y="4.5" width="6" height="3" rx="1"/></svg>Core shells and the trap housing</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><polyline class="busbar" points="2,8 9,8 9,4 19,4 19,8 26,8"/></svg>Dog-leg power penetration</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="radline" x1="2" y1="6" x2="26" y2="6"/></svg>Radiator coolant loop</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="radiator" x="4" y="1" width="9" height="4"/><rect class="radiator" x="15" y="1" width="9" height="4"/><rect class="emitter" x="12.8" y="6" width="2.4" height="4"/></svg>Radiator panels and emitters on the array</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="emitter" x="12.8" y="5" width="2.4" height="2.2"/></svg>Harmonic emitter along the conduits</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="hot"><circle cx="14" cy="6" r="2.6"/><circle class="hot-hub" cx="14" cy="6" r="0.7"/></g></svg>Radiation hot spot, left by the accident</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="frost" d="M 8 4 l 3 3 m 0 -3 l -3 3 M 17 4 l 3 3 m 0 -3 l -3 3"/></svg>Frost on cryogenic lines</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="term" x="13.6" y="6" width="0.8" height="6"/><rect class="term-screen" x="10.5" y="1.5" width="7" height="4.5"/></svg>SIGMA terminal</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="clock"><rect x="10" y="2" width="8" height="8"/><circle cx="14" cy="6" r="1.6"/></g></svg>Reference clock, one on every deck</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="tap" x1="14" y1="0" x2="14" y2="12"/></svg>Branch up from the conduits: R&amp;D&apos;s tap, the receivers&apos; feed</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="water" d="M 2 7 H 12 A 2 2 0 0 1 16 7 H 26 M 14 1 V 12"/></svg>Water lines; a hop where two cross without joining</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="duct duct-o" d="M 3 6 H 25"/><path class="duct duct-i" d="M 3 6 H 25"/></svg>Air duct, supply and return in one casing; dashed behind the hold</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="data" d="M 3 6 H 25"/></svg>SIGMA network, from the core to every terminal</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="fire" d="M 3 3 H 25"/><path class="fire-nozzle" d="M 14 3 V 5.5 M 12.3 7.2 L 15.7 7.2 L 14 5.2 Z"/></svg>Fire suppression main along each ceiling, a nozzle in every room; dashed behind the hold</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><path class="tank-potable" d="M 5 12 V 4 Q 5 1 9 1 Q 13 1 13 4 V 12 Z"/><path class="tank-waste" d="M 15 12 V 4 Q 15 1 19 1 Q 23 1 23 4 V 12 Z"/></svg>Water tanks: potable, wastewater</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="door door-open" x="12" y="1" width="4" height="10"/></svg>Door, unlocked as Quell finds it</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><rect class="door door-locked" x="12" y="1" width="4" height="10"/></svg>Door, locked as Quell finds it</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><line class="ladder" x1="13" y1="0" x2="13" y2="12"/><line class="ladder" x1="15" y1="0" x2="15" y2="12"/><line class="rung" x1="13" y1="3" x2="15" y2="3"/><line class="rung" x1="13" y1="6" x2="15" y2="6"/><line class="rung" x1="13" y1="9" x2="15" y2="9"/></svg>Open ladder, cargo dock to bay floor</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="clamp"><rect x="11" y="0" width="2.4" height="8.5"/><circle cx="12.2" cy="4" r="1.6"/><rect x="8.5" y="8.5" width="7.4" height="2.2"/></g></svg>Docking clamp, four in all</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="gantry"><rect x="2" y="0.5" width="24" height="2"/><rect x="10" y="2.5" width="6" height="2.5"/><line x1="13" y1="5" x2="13" y2="9"/><polyline points="10,11.5 10,9 16,9 16,11.5"/></g></svg>Gantry crane on its ceiling rail</li>
        <li><svg class="swatch" viewBox="0 0 28 12" aria-hidden="true"><g class="tag"><circle cx="14" cy="6" r="4"/></g><g class="here"><circle class="here-ring" cx="14" cy="6" r="5"/></g></svg>You are here</li>
      </ul>
    </div>
    <figcaption class="caption">Each deck: about 5 m floor to ceiling (dark band) plus about 3 m of service space above it (lighter band); floors sit on the deck lines. Doors between rooms are left to the deck plans. Each capacitor hall charges from the chamber and feeds the emitters along the Deck 06 conduits. Heights come from the exterior image. Lengths don't: the image sees the hull at an angle, so how long each deck runs and where the masts stand are first guesses. The bay is centred under the superstructure.</figcaption>
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
        <li><b>Engineering</b> around the chamber, 137 to 263 m along on Decks 05 to 07, meeting both lift shafts, with two vertical access shafts through it, one either side of the chamber.</li>
        <li><b>Two lift cores</b> at about 135 m and 265 m, the only positions that reach all 12 decks.</li>
        <li><b>SIGMA&apos;s core</b>: a 5 m column on the chamber&apos;s axis, from Deck 04 up into command on Deck 01, operations room at its base.</li>
        <li><b>Experiment control</b> on Deck 05, a shared Science and Engineering room just inside engineering, with R&amp;D beside it across a sealed lock.</li>
        <li><b>Shielding plant</b> on Deck 07 in engineering: capacitor Banks A and B either side of the chamber, Valdez&apos;s own section. Emitters spread along the conduits and around the crewed sections; the bay sits outside the shield.</li>
        <li><b>Stepped profile.</b> Decks 05 to 08 run the full 400 m; decks above and below get shorter. Exact lengths are a first guess.</li>
        <li><b>Docking bay</b> across Decks 08 to 11, centred along the hull under the superstructure, unpressurized, open to space, about 98 m long.</li>
        <li><b>Docking ring:</b> the clamps inside the bay that hold the ship.</li>
        <li><b>Airlock B</b> on Deck 09 in the bay wall, joined to the ship by a boarding umbilical. <b>Airlock A</b> faces it across the bay, its own umbilical pulled back.</li>
        <li><b>Maintenance access:</b> a trunk beside each lift core, Deck 12 to Deck 01, with a landing and hatch at every deck. Deck 12&apos;s crawlway joins them under the bay and drops into every fuel room; Deck 05&apos;s leads into engineering&apos;s shafts through locked hatches.</li>
      </ul>
    </section>
  </div>
</div>

<script>
// The drawing is its own file, shared with the slate map. It loads into the page so the styles and layer toggles reach it.
fetch('../drawing.svg').then(function (r) { return r.text(); }).then(function (t) {
  var svg = document.getElementById('hull'), src = new DOMParser().parseFromString(t, 'image/svg+xml').documentElement;
  Array.from(src.childNodes).forEach(function (n) { svg.appendChild(document.importNode(n, true)); });
});

// Zoom and pan by rewriting the drawing's viewBox, so line work stays crisp at any scale.
// The viewBox always matches the window's shape, so the maths maps pointer to drawing 1:1.
(function () {
  var svg = document.getElementById('hull');
  var vp = document.getElementById('hull-viewport');
  var out = document.getElementById('hull-zoom-level');
  if (!svg || !vp) return;
  var W0 = ${W}, H0 = ${H}, MAXZ = 16;
  var A = 1, fitW = W0, v = { x: 0, y: 0, w: W0, h: H0 };
  function measure() {
    var r = vp.getBoundingClientRect();
    A = r.width ? r.height / r.width : H0 / W0;
    fitW = Math.max(W0, H0 / A);
  }
  function apply() {
    svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
    if (out) out.textContent = Math.round(fitW / v.w * 100) + '%';
  }
  function clamp() {
    v.w = Math.min(fitW, Math.max(fitW / MAXZ, v.w));
    v.h = v.w * A;
    v.x = v.w >= W0 ? (W0 - v.w) / 2 : Math.min(W0 - v.w, Math.max(0, v.x));
    v.y = v.h >= H0 ? (H0 - v.h) / 2 : Math.min(H0 - v.h, Math.max(0, v.y));
  }
  function fit() { v.w = fitW; clamp(); apply(); }
  function toSvg(cx, cy) {
    var r = svg.getBoundingClientRect();
    return { x: v.x + (cx - r.left) / r.width * v.w, y: v.y + (cy - r.top) / r.height * v.h };
  }
  function zoomAt(f, px, py) {
    var nw = Math.min(fitW, Math.max(fitW / MAXZ, v.w / f));
    var k = nw / v.w;
    v.x = px - (px - v.x) * k;
    v.y = py - (py - v.y) * k;
    v.w = nw;
    clamp();
    apply();
  }
  function zoomCentre(f) { zoomAt(f, v.x + v.w / 2, v.y + v.h / 2); }
  function pan(dxPx, dyPx) {
    var r = svg.getBoundingClientRect();
    v.x -= dxPx / r.width * v.w;
    v.y -= dyPx / r.height * v.h;
    clamp();
    apply();
  }
  measure();
  fit();
  // Keep the same zoom level when the window changes shape.
  window.addEventListener('resize', function () {
    var z = fitW / v.w, cx = v.x + v.w / 2, cy = v.y + v.h / 2;
    measure();
    v.w = fitW / z; v.h = v.w * A; v.x = cx - v.w / 2; v.y = cy - v.h / 2;
    clamp();
    apply();
  });

  vp.addEventListener('wheel', function (e) {
    e.preventDefault();
    var p = toSvg(e.clientX, e.clientY);
    zoomAt(Math.exp(-e.deltaY * 0.0015), p.x, p.y);
  }, { passive: false });

  // One pointer pans; two pointers pinch-zoom around their midpoint.
  var pts = new Map(), pinch = null;
  vp.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.zoom')) return;
    vp.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    vp.classList.add('dragging');
  });
  vp.addEventListener('pointermove', function (e) {
    var prev = pts.get(e.pointerId);
    if (!prev) return;
    var cur = { x: e.clientX, y: e.clientY };
    pts.set(e.pointerId, cur);
    if (pts.size === 1) {
      pan(cur.x - prev.x, cur.y - prev.y);
    } else if (pts.size === 2) {
      var a = Array.from(pts.values());
      var d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
      var mid = toSvg((a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2);
      if (pinch) zoomAt(d / pinch, mid.x, mid.y);
      pinch = d;
    }
  });
  function end(e) {
    pts.delete(e.pointerId);
    if (pts.size < 2) pinch = null;
    if (!pts.size) vp.classList.remove('dragging');
  }
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);

  vp.querySelector('.zoom').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.zoom === 'in') zoomCentre(1.5);
    else if (b.dataset.zoom === 'out') zoomCentre(1 / 1.5);
    else fit();
  });

  // Keys only while the drawing has focus.
  vp.addEventListener('keydown', function (e) {
    var step = 40;
    if (e.key === '+' || e.key === '=') zoomCentre(1.25);
    else if (e.key === '-' || e.key === '_') zoomCentre(0.8);
    else if (e.key === '0') fit();
    else if (e.key === 'ArrowLeft') pan(step, 0);
    else if (e.key === 'ArrowRight') pan(-step, 0);
    else if (e.key === 'ArrowUp') pan(0, step);
    else if (e.key === 'ArrowDown') pan(0, -step);
    else return;
    e.preventDefault();
  });
})();
// Layer toggles; each viewer's choice is remembered where storage allows.
(function () {
  var svg = document.getElementById('hull');
  var box = document.getElementById('hull-layers');
  if (!svg || !box) return;
  var KEY = 'hull-layers-hidden', hidden = [];
  try { hidden = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  box.querySelectorAll('input').forEach(function (input) {
    function sync() { svg.classList.toggle('hide-' + input.value, !input.checked); }
    input.checked = hidden.indexOf(input.value) < 0;
    sync();
    input.addEventListener('change', function () {
      sync();
      var off = [];
      box.querySelectorAll('input').forEach(function (i) { if (!i.checked) off.push(i.value); });
      try { localStorage.setItem(KEY, JSON.stringify(off)); } catch (e) {}
    });
  });
})();
</script>
`;
