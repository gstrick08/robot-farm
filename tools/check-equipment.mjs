import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JOBS, jobFor, equipmentProgress } from '../equipment.js';
import * as L from '../logic.js';
assert.equal(JOBS.length, 4);
for (const perDay of [2, 3, 4, 5]) {
  for (let day = 0; day < 20; day++) {
    const missions = L.dailyMissions(day, perDay);
    assert.equal(missions.length, perDay);
    for (let n = 0; n < missions.length; n++) assert.ok(JOBS[jobFor(day, perDay, n)]);
  }
}
assert.deepEqual(Array.from({length:4},(_,i)=>jobFor(0,3,i)), [0,1,2,3]);
const progress = (golds,silvers) => equipmentProgress({golds,silvers,nGold:10,cap:15});
assert.equal(progress(0,0),0);
assert.ok(progress(0,1)>0, 'helped answers can advance the scene without gold');
assert.ok(progress(0,14)<1, 'helped scene does not finish before the cap');
assert.equal(progress(0,15),1);
assert.equal(progress(10,0),1);
for(let golds=0;golds<10;golds++) for(let silvers=0;silvers<15-golds;silvers++) assert.ok(progress(golds,silvers)<1);
const mission=L.createMission(Array(17).fill('W:like')), snapshot=structuredClone(mission);
equipmentProgress(mission); assert.deepEqual(mission,snapshot,'presentation does not mutate the learning state');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(html.includes("show(S.placing ? 'farm' : 'yard')"), 'pending placement still opens the farm');
assert.ok(html.includes('if (g !== qGen) return;\n    if (record)'), 'equipment delay is guarded when leaving a mission');
assert.ok(!readFileSync(new URL('../equipment.js',import.meta.url),'utf8').includes('localStorage'));
console.log('Equipment job and mission-boundary checks passed ✔');
