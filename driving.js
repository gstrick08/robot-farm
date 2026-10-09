import { art } from './art.js';
import { ROADS, newDrive, driveStep, deliveryStep } from './drive-math.js';
const tractor = `<g stroke="#294844" stroke-width="3" stroke-linejoin="round"><rect x="-43" y="-13" width="18" height="42" rx="7" fill="#354a46"/><rect x="25" y="-13" width="18" height="42" rx="7" fill="#354a46"/><rect x="-35" y="-64" width="14" height="26" rx="5" fill="#354a46"/><rect x="21" y="-64" width="14" height="26" rx="5" fill="#354a46"/><rect x="-27" y="-76" width="54" height="99" rx="14" fill="#91b875"/><rect x="-22" y="-70" width="44" height="43" rx="9" fill="#c5d995"/><path d="M-12 -60 H12 M-12 -49 H12 M-12 -38 H12" stroke="#76965e"/><rect x="-21" y="-17" width="42" height="31" rx="8" fill="#82bdc7"/><path d="M-13 -12 L13 9" stroke="#e4f2df"/><rect x="-23" y="-72" width="8" height="10" rx="3" fill="#fff0be"/><rect x="15" y="-72" width="8" height="10" rx="3" fill="#fff0be"/></g>`;
const trailer = `<g stroke="#294844" stroke-width="3" stroke-linejoin="round"><path d="M0 -60 V-38" stroke-width="6"/><rect x="-36" y="-2" width="13" height="33" rx="5" fill="#354a46"/><rect x="23" y="-2" width="13" height="33" rx="5" fill="#354a46"/><rect x="-27" y="-36" width="54" height="74" rx="8" fill="#d6bc8e"/><rect x="-20" y="-28" width="40" height="59" rx="5" fill="#ecdcb8"/><g class="drive-cargo" fill="#b3c68a"><rect x="-15" y="-20" width="30" height="19" rx="4"/><rect x="-15" y="5" width="30" height="20" rx="4"/></g></g>`;
const barn = `<path d="M-78 -25 L0 -80 78 -25Z" fill="#648d80"/><rect x="-67" y="-25" width="134" height="70" rx="12" fill="#e1ceb0"/><rect x="-38" y="-5" width="76" height="50" rx="7" fill="#4e6960"/><path d="M-27 7 H27 M-27 22 H27" stroke="#8fa18d" stroke-width="5"/>`;
const svg = body => `<svg viewBox="0 0 1024 768" aria-hidden="true" focusable="false">${body}</svg>`;
const arrow = d => `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export function createDriving(screen, { speak, effect, onExit }) {
  let level = 0, state, job, nodes, frame, last = 0, running = false;
  const input = {}, pointers = new Map();
  screen.innerHTML = `<div class="drive-top"><button class="round drive-home" aria-label="Back to equipment jobs"></button><h1>Tractor trails</h1><button class="round drive-roads" aria-label="Choose a road"></button><span class="drive-score" aria-label="Cargo deliveries"><span></span><b>0 / 3</b></span></div><div class="drive-world"></div><div class="drive-controls"><button data-drive="forward" aria-label="Drive forward">${arrow('M32 51 V12 M14 30 L32 12 50 30')}</button><button data-drive="left" aria-label="Steer left">${arrow('M51 32 H12 M30 14 L12 32 30 50')}</button><button data-drive="right" aria-label="Steer right">${arrow('M12 32 H51 M33 14 L51 32 33 50')}</button><button data-drive="reverse" aria-label="Drive backward">${arrow('M32 12 V51 M14 33 L32 51 50 33')}</button></div><div class="drive-menu"></div>`;
  const world = screen.querySelector('.drive-world'), menu = screen.querySelector('.drive-menu'), controls = screen.querySelector('.drive-controls');
  screen.querySelector('.drive-home').append(art('home'));
  screen.querySelector('.drive-roads').append(art('road'));
  screen.querySelector('.drive-score span').append(art('trailer'));
  const clearInput = () => { for (const key of Object.keys(input)) delete input[key]; pointers.clear(); controls.querySelectorAll('button').forEach(b => b.classList.remove('pressed')); if (state) state.speed = 0; };
  function stop() { running = false; cancelAnimationFrame(frame); clearInput(); last = 0; }
  const keys = { ArrowUp: 'forward', ArrowDown: 'reverse', ArrowLeft: 'left', ArrowRight: 'right' };
  const active = () => running && screen.classList.contains('on');
  const release = e => {
    const key = pointers.get(e.pointerId); if (!key) return;
    pointers.delete(e.pointerId); input[key] = [...pointers.values()].includes(key);
    if (!input[key]) controls.querySelector(`[data-drive="${key}"]`).classList.remove('pressed');
  };
  controls.querySelectorAll('button').forEach(b => {
    b.onpointerdown = e => { if (!active()) return; e.preventDefault(); pointers.set(e.pointerId, b.dataset.drive); input[b.dataset.drive] = true; b.classList.add('pressed'); try { b.setPointerCapture(e.pointerId); } catch {} };
    b.onpointerup = b.onpointercancel = b.onlostpointercapture = release;
    b.oncontextmenu = e => e.preventDefault();
  });
  window.addEventListener('keydown', e => { if (active() && keys[e.key]) { e.preventDefault(); input[keys[e.key]] = true; } });
  window.addEventListener('keyup', e => { if (keys[e.key]) input[keys[e.key]] = false; });
  window.addEventListener('blur', clearInput);
  document.addEventListener('visibilitychange', () => {
    clearInput(); cancelAnimationFrame(frame); last = 0;
    if (running && !document.hidden) frame = requestAnimationFrame(tick);
  });
  screen.querySelector('.drive-home').onclick = () => { stop(); onExit(); };
  screen.querySelector('.drive-roads').onclick = openRoads;
  function roadIcon(road) {
    const points = road.points.map(p => p.join(',')).join(' ');
    return svg(`<rect x="50" y="150" width="710" height="500" rx="80" fill="#a6c38a"/><polyline points="${points}" fill="none" stroke="#d9c998" stroke-width="105" stroke-linejoin="round"/>`);
  }
  function openRoads() {
    stop(); menu.hidden = false; controls.hidden = true; screen.querySelector('.drive-score').hidden = true; menu.replaceChildren();
    const heading = document.createElement('h2'); heading.textContent = 'Pick a road'; menu.append(heading);
    const row = document.createElement('div'); row.className = 'drive-road-cards'; menu.append(row);
    ROADS.forEach((road, i) => {
      const b = document.createElement('button'); b.className = 'drive-road-card'; b.setAttribute('aria-label', road.name);
      b.innerHTML = roadIcon(road) + `<span>${i + 1}</span>`; b.onclick = () => start(i); row.append(b);
    });
    speak('Pick a road for your tractor and trailer.');
  }
  function start(i) {
    stop(); level = i; const road = ROADS[i]; state = newDrive(road); job = { loaded: true, deliveries: 0 };
    screen.dataset.road = road.name; screen.querySelector('.drive-score').hidden = false; menu.hidden = true; menu.replaceChildren(); controls.hidden = false;
    const points = road.points.map(p => p.join(',')).join(' ');
    const scenery = i === 2 ? `<path d="M65 365 Q240 330 430 372 T765 355" fill="none" stroke="#80bfcb" stroke-width="75"/>` : '';
    const bridge = i === 2 ? `<rect x="348" y="310" width="104" height="114" rx="9" fill="#b9a17a" stroke="#486757" stroke-width="4"/><path d="M348 325 H452 M348 346 H452 M348 368 H452 M348 390 H452 M348 412 H452" stroke="#e1ceb0" stroke-width="5"/>` : '';
    const trees = (i === 1 ? [[160,300],[195,365],[390,235],[670,425]] : [[110,200],[740,315],[120,620]]).map(([x,y]) => `<g transform="translate(${x} ${y})"><rect x="-6" y="0" width="12" height="38" rx="4" fill="#9c7254"/><rect x="-25" y="-35" width="50" height="50" rx="18" fill="#78a269" stroke="#486757" stroke-width="3"/></g>`).join('');
    world.innerHTML = svg(`<rect width="1024" height="768" fill="#c4e9e5"/><path d="M0 170 Q260 100 520 170 T1024 140 V768 H0Z" fill="#a9c691"/><rect x="65" y="170" width="700" height="478" rx="65" fill="#94b67b" stroke="#486757" stroke-width="4"/>${scenery}<polyline points="${points}" fill="none" stroke="#82976b" stroke-width="100" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${points}" fill="none" stroke="#d9c998" stroke-width="88" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${points}" fill="none" stroke="#eee0bb" stroke-width="3" stroke-dasharray="14 15" stroke-linejoin="round"/>${bridge}${trees}<g transform="translate(${road.drop[0]} ${road.drop[1]-95})" stroke="#486757" stroke-width="4" stroke-linejoin="round">${barn}</g><g transform="translate(${road.pickup[0]} ${road.pickup[1]+68})" fill="#f0db9d" stroke="#8d7853" stroke-width="3"><rect x="-38" y="-13" width="32" height="26" rx="5"/><rect x="6" y="-13" width="32" height="26" rx="5"/></g><g class="drive-marker"><circle r="40" fill="none" stroke="#fff0bb" stroke-width="9"/><circle r="29" fill="none" stroke="#486757" stroke-width="3"/></g><g class="drive-trailer">${trailer}</g><g class="drive-tractor">${tractor}</g>`);
    nodes = Object.fromEntries(['tractor','trailer','cargo','marker'].map(k => [k, world.querySelector('.drive-' + k)]));
    screen.querySelector('.drive-score b').textContent = '0 / 3';
    running = true; paint(); frame = requestAnimationFrame(tick);
    speak(`${road.name}. Your trailer is loaded. Hold an arrow to drive to the glowing spot by the barn.`);
  }
  function paint() {
    nodes.tractor.setAttribute('transform', `translate(${state.x} ${state.y}) rotate(${state.angle * 180 / Math.PI + 90})`);
    nodes.trailer.setAttribute('transform', `translate(${state.trailerX} ${state.trailerY}) rotate(${state.trailerAngle * 180 / Math.PI + 90})`);
    nodes.cargo.style.opacity = job.loaded ? '1' : '0';
    const target = job.loaded ? ROADS[level].drop : ROADS[level].pickup;
    nodes.marker.setAttribute('transform', `translate(${target[0]} ${target[1]})`);

  }
  function tick(now) {
    if (!active() || document.hidden) return;
    driveStep(state, input, last ? (now - last) / 1000 : 0, ROADS[level]); last = now;
    const event = deliveryStep(job, state, ROADS[level]); paint();
    if (event) screen.querySelector('.drive-score b').textContent = `${job.deliveries} / 3`;
    if (event === 'complete') return finish();
    if (event === 'pickup') { effect('pop'); speak('Trailer loaded. Back to the barn!'); }
    if (event === 'delivery') { effect('gold'); speak('Nice delivery! Pick up another load.'); }
    frame = requestAnimationFrame(tick);
  }
  function finish() {
    stop(); controls.hidden = true; menu.hidden = false; menu.replaceChildren();
    const medal = art('tractor'); medal.classList.add('drive-finish-art'); menu.append(medal);
    const title = document.createElement('h2'); title.textContent = '3 / 3'; menu.append(title);
    const row = document.createElement('div'); row.className = 'drive-finish-buttons'; menu.append(row);
    const next = document.createElement('button'); next.className = 'round'; next.setAttribute('aria-label', level < ROADS.length - 1 ? 'Next road' : 'Choose a road'); next.append(art('road')); next.onclick = () => level < ROADS.length - 1 ? start(level + 1) : openRoads();
    const home = document.createElement('button'); home.className = 'round'; home.setAttribute('aria-label', 'Back to equipment jobs'); home.append(art('home')); home.onclick = onExit; row.append(home, next);
    effect('win'); speak('All three loads delivered! Great driving.');
  }
  return { openRoads, stop };
}
