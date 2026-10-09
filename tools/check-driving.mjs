import assert from 'node:assert/strict';
import { ROADS, newDrive, driveStep, deliveryStep, roadDistance } from '../drive-math.js';
assert.equal(ROADS.length, 3);
for (const road of ROADS) {
  for (const point of [road.pickup, road.drop]) assert.equal(roadDistance(...point, road.points), 0, 'cargo stops lie on the road');
  const state = newDrive(road), start = state.x;
  assert.equal(Math.hypot(state.x-road.pickup[0],state.y-road.pickup[1]), 0, 'every road starts with cargo at its pickup');
  for (let i = 0; i < 120; i++) driveStep(state, { forward: true }, 1 / 60, road);
  assert.ok(state.x > start); assert.ok(Number.isFinite(state.trailerAngle));
  for (let i = 0; i < 120; i++) driveStep(state, {}, 1 / 60, road);
  assert.equal(state.speed, 0, 'released controls stop the tractor');
  const stopped = state.x; driveStep(state, {}, 5, road); assert.equal(state.x, stopped, 'background return cannot jump');
  const job = { loaded: false, deliveries: 0 };
  for (let i = 0; i < 3; i++) {
    assert.equal(deliveryStep(job, { x: road.pickup[0], y: road.pickup[1] }, road), 'pickup');
    assert.equal(deliveryStep(job, { x: road.pickup[0], y: road.pickup[1] }, road), null, 'parking at pickup never duplicates cargo');
    assert.equal(deliveryStep(job, { x: road.drop[0], y: road.drop[1] }, road), i === 2 ? 'complete' : 'delivery');
  }
  assert.equal(deliveryStep(job, { x: road.pickup[0], y: road.pickup[1] }, road), null, 'a level ends after three deliveries');
  const a = newDrive(road), b = newDrive(road);
  driveStep(a, { forward: true, right: true }, .05, road); driveStep(b, { forward: true, right: true }, 10, road);
  assert.deepEqual(a, b, 'elapsed time is bounded');
  assert.ok(a.angle > 0, 'forward right steers clockwise');
  const oneFinger = newDrive(road); driveStep(oneFinger, { left: true }, .05, road); assert.ok(oneFinger.speed > 0 && oneFinger.angle < 0, 'one steering button drives without requiring two fingers');
  const reverse = newDrive(road); driveStep(reverse, { reverse: true, right: true }, .05, road); assert.ok(reverse.angle < 0, 'reverse steering follows the wheels');
}
console.log('Driving checks passed ✔');
