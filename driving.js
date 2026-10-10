import { art } from './art.js';
import { farmWorld } from './adventure-world.js';
import { ROADS, newDrive, driveStep, deliveryStep } from './drive-math.js';
const svg = body => `<svg viewBox="0 0 1024 768" aria-hidden="true" focusable="false">${body}</svg>`;
const arrow = d => `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export function createDriving(screen, { speak, effect, onExit }) {
  let level = 0, state, job, frame, last = 0, running = false;
  const input = {}, pointers = new Map();
  screen.innerHTML = `<div class="drive-top"><button class="round drive-home" aria-label="Back to equipment jobs"></button><h1>Tractor trails</h1><button class="round drive-roads" aria-label="Choose a road"></button><span class="drive-score" aria-label="Cargo deliveries"><span></span><b>0 / 3</b></span></div><div class="drive-world"></div><div class="drive-controls"><button data-drive="forward" aria-label="Drive forward">${arrow('M32 51 V12 M14 30 L32 12 50 30')}</button><button data-drive="left" aria-label="Steer left">${arrow('M51 32 H12 M30 14 L12 32 30 50')}</button><button data-drive="right" aria-label="Steer right">${arrow('M12 32 H51 M33 14 L51 32 33 50')}</button><button data-drive="reverse" aria-label="Drive backward">${arrow('M32 12 V51 M14 33 L32 51 50 33')}</button></div><div class="drive-menu"></div>`;
  const world = screen.querySelector('.drive-world'), menu = screen.querySelector('.drive-menu'), controls = screen.querySelector('.drive-controls');
  screen.querySelector('.drive-home').append(art('home'));
  screen.querySelector('.drive-roads').append(art('road'));
  screen.querySelector('.drive-score span').append(art('trailer'));
  const canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden','true'); world.append(canvas);
  const scene = farmWorld(canvas);
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
    stop(); scene.setView('hub'); scene.resize(); screen.querySelector('.drive-top h1').textContent = 'Tractor trails'; menu.hidden = false; controls.hidden = true; screen.querySelector('.drive-score').hidden = true; menu.replaceChildren();
    const heading = document.createElement('h2'); heading.textContent = 'Pick a road'; menu.append(heading);
    const row = document.createElement('div'); row.className = 'drive-road-cards'; menu.append(row);
    ROADS.forEach((road, i) => {
      const b = document.createElement('button'); b.className = 'drive-road-card'; b.setAttribute('aria-label', road.name);
      b.innerHTML = roadIcon(road) + `<span>${road.name}</span>`; b.onclick = () => start(i); row.append(b);
    });
    speak('Pick a road for your tractor and trailer.');
  }
  function start(i) {
    stop(); level = i; const road = ROADS[i]; state = newDrive(road); job = { loaded: true, deliveries: 0 };
    screen.dataset.road = road.name; screen.querySelector('.drive-score').hidden = false; menu.hidden = true; menu.replaceChildren(); controls.hidden = false;
    scene.setView('drive', road); scene.resize();
    screen.querySelector('.drive-score b').textContent = '0 / 3';
    running = true; screen.querySelector('.drive-top h1').textContent = road.name; paint(); frame = requestAnimationFrame(tick);
    speak(`${road.name}. Your trailer is loaded. Hold an arrow to drive to the glowing spot by the barn.`);
  }
  function paint() { scene.drive(state, job.loaded); }
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
