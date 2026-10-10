import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as L from '../logic.js';
import {validJobs} from '../job-progress.js';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const fixture = JSON.parse(readFileSync(new URL('fixtures/played-v1.json', import.meta.url)));
const functionSource = name => {
  const match = html.match(new RegExp(`(?:async )?function ${name}\\([^]*?\\n\\}`));
  assert.ok(match, `${name} is present`); return match[0];
};
let blob, reloads = 0, notices = [], exportedName;
const context = vm.createContext({
  THING: Object.fromEntries(['chicken','pig','sheep','cow','horse','soil','flower','tree','rock','brick','wood','water','house','tractor','cap','tophat','crown','ship'].map(k=>[k,{}])), CROPS: {carrot:1,corn:1,strawberry:1,pumpkin:1}, S: structuredClone(fixture), jobSessions: [], M: null, validJobs, structuredClone, jobContext:()=> 'test', L, TODAY: () => '2026-10-09', navigator: {}, Blob, File,
  URL: { createObjectURL: b => { blob = b; return 'blob:local-test'; }, revokeObjectURL() {} },
  el: () => ({ click() { exportedName = this.download; } }), setTimeout() {},
  confirm: () => true, alert: text => notices.push(text),
  location: { reload() { reloads++; } }, save() {},
});
vm.runInContext(`const listKeys = l => l.words.map(w => 'W:' + w);
const peek = k => S.items[k] || L.newItem();
const status = it => L.isMastered(it) ? 'mastered' : L.isKnown(it) ? 'known' : it.last ? 'learning' : 'new';
${['saveBackup','validBackup','restoreBackup','report','checkpoint','payJobSeeds'].map(functionSource).join('\n')}`, context);
await context.saveBackup();
assert.equal(exportedName, 'robot-farm-backup-2026-10-09.json');
assert.deepEqual(JSON.parse(await blob.text()), fixture, 'export contains all v1 progress');
context.S = { v: 1, coins: 999 };
context.restoreBackup({ text: () => blob.text() }); await new Promise(setImmediate);
assert.deepEqual(JSON.parse(JSON.stringify(context.S)), fixture, 'restore preserves the original state shape');
assert.equal(reloads, 1);
context.confirm = () => false;
context.restoreBackup({ text: async () => JSON.stringify({ ...fixture, coins: 999 }) }); await new Promise(setImmediate);
assert.equal(context.S.coins, fixture.coins, 'cancelled restore changes nothing');
context.restoreBackup({ text: async () => '{}' }); await new Promise(setImmediate);
assert.equal(notices.length, 1); assert.equal(reloads, 1);
for (const bad of [{v:1,items:{},farm:[]},{...fixture,farm:[]},{...fixture,coins:-1},{...fixture,lists:null},{...fixture,farm:fixture.farm.map(t=>({...t,crop:{kind:'invalid',planted:'2026-10-09'}}))}]) {
 assert.equal(context.validBackup(bad), false, 'malformed saves cannot replace progress');
}
assert.equal(context.validBackup(fixture), true);
const m=L.createMission(Array(17).fill('W:like'));L.nextTarget(m);
const savedJob={context:'test',n:0,job:0,type:'hunt',phase:'question',m,paidGold:0,question:{options:['W:like','W:look'],wrong:[],hint:false,font:'Andika',teach:false}};
context.jobSessions=[savedJob];await context.saveBackup();
const withJobs=JSON.parse(await blob.text());assert.deepEqual(withJobs.jobSessions,[savedJob],'backup contains paused job');
context.jobSessions=[];context.confirm=()=>true;context.restoreBackup({text:async()=>JSON.stringify(withJobs)});await new Promise(setImmediate);
assert.deepEqual(JSON.parse(JSON.stringify(context.jobSessions)),[savedJob],'backup restores paused job');
assert.equal('jobSessions' in context.S,false,'learning state stays v1');
context.restoreBackup({text:async()=>JSON.stringify({...withJobs,jobSessions:[{bad:true}]})});await new Promise(setImmediate);assert.equal(notices.at(-1),'That file is not a Robot Farm backup.','invalid job checkpoints rejected');
context.jobSessions=[{...savedJob,m:{...m,golds:2,asked:2},paidGold:1}];context.jobContext=()=> 'next-day';
const oldSeeds=context.S.seeds;context.checkpoint();assert.equal(context.S.seeds,oldSeeds+1,'expired daily job banks only unpaid earned gold');
context.checkpoint();assert.equal(context.S.seeds,oldSeeds+1,'expired job never banks twice');
const report = context.report();
assert.match(report, /Heart Words List 1: 0 of 17 words mastered/);
assert.match(report, /Letters: 0 of 52 known, 0 mastered/);
assert.match(report, /1 mission, 0 Mission Control sessions/);
console.log('Backup, restore and report checks passed ✔');
