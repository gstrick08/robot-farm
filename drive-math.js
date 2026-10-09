// Driving has no learning rewards or saved-state fields.
export const ROADS = [
  { name: 'Barn loop', points: [[180,245],[650,245],[650,550],[180,550],[180,245]], start: { x: 330, y: 550, angle: 0 }, pickup: [330,550], drop: [430,245] },
  { name: 'Orchard bends', points: [[150,550],[300,550],[300,400],[510,400],[510,245],[680,245]], start: { x: 190, y: 550, angle: 0 }, pickup: [190,550], drop: [650,245] },
  { name: 'River bridge', points: [[150,550],[400,550],[400,235],[680,235],[680,550]], start: { x: 200, y: 550, angle: 0 }, pickup: [200,550], drop: [650,235] },
];
export const distance = (a, b) => Math.hypot(a.x - b[0], a.y - b[1]);
export function roadDistance(x, y, points) {
  let nearest = Infinity;
  for (let i = 1; i < points.length; i++) {
    const [ax, ay] = points[i - 1], [bx, by] = points[i], dx = bx - ax, dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    nearest = Math.min(nearest, Math.hypot(x - ax - t * dx, y - ay - t * dy));
  }
  return nearest;
}
export function driveStep(state, input, elapsed, road) {
  const dt = Math.max(0, Math.min(.05, elapsed)); // A background tab never makes a vehicle jump.
  const turn = Number(!!input.right) - Number(!!input.left);
  const throttle = input.forward || input.reverse ? Number(!!input.forward) - Number(!!input.reverse) : turn ? 1 : 0;
  const onRoad = roadDistance(state.x, state.y, road.points) <= 48;
  const targetSpeed = throttle * (onRoad ? 110 : 55);
  state.speed += (targetSpeed - state.speed) * Math.min(1, dt * 8);
  if (Math.abs(state.speed) < .1) state.speed = 0;
  state.angle += turn * state.speed / 72 * dt;
  state.x = Math.max(115, Math.min(720, state.x + Math.cos(state.angle) * state.speed * dt));
  state.y = Math.max(210, Math.min(590, state.y + Math.sin(state.angle) * state.speed * dt));
  const hitchX = state.x - Math.cos(state.angle) * 38, hitchY = state.y - Math.sin(state.angle) * 38;
  const dx = hitchX - state.trailerX, dy = hitchY - state.trailerY;
  state.trailerAngle = Math.atan2(dy, dx);
  state.trailerX = hitchX - Math.cos(state.trailerAngle) * 60;
  state.trailerY = hitchY - Math.sin(state.trailerAngle) * 60;
  return state;
}
export function newDrive(road) {
  return { ...road.start, speed: 0, trailerX: road.start.x - 98, trailerY: road.start.y, trailerAngle: road.start.angle };
}
export function deliveryStep(job, state, road) {
  if (job.deliveries >= 3) return null;
  if (!job.loaded && distance(state, road.pickup) < 48) { job.loaded = true; return 'pickup'; }
  if (job.loaded && distance(state, road.drop) < 48) { job.loaded = false; job.deliveries++; return job.deliveries === 3 ? 'complete' : 'delivery'; }
  return null;
}
