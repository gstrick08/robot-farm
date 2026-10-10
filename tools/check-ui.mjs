import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as L from '../logic.js';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const fixture = JSON.parse(readFileSync(new URL('fixtures/played-v1.json', import.meta.url)));
const functionSource = name => {
  const match = html.match(new RegExp(`(?:async )?function ${name}\\([^]*?\\n\\}`));
  assert.ok(match, `${name} is present`); return match[0];
};
let blob, reloads = 0, notices = [], exportedName;
const context = vm.createContext({
  THING: Object.fromEntries(['chicken','pig','sheep','cow','horse','soil','flower','tree','rock','brick','wood','water','house','tractor','cap','tophat','crown','ship'].map(k=>[k,{}])), CROPS: {carrot:1,corn:1,strawberry:1,pumpkin:1}, S: structuredClone(fixture), L, TODAY: () => '2026-10-09', navigator: {}, Blob, File,
  URL: { createObjectURL: b => { blob = b; return 'blob:local-test'; }, revokeObjectURL() {} },
  el: () => ({ click() { exportedName = this.download; } }), setTimeout() {},
  confirm: () => true, alert: text => notices.push(text),
  location: { reload() { reloads++; } }, save() {},
});
vm.runInContext(`const listKeys = l => l.words.map(w => 'W:' + w);
const peek = k => S.items[k] || L.newItem();
const status = it => L.isMastered(it) ? 'mastered' : L.isKnown(it) ? 'known' : it.last ? 'learning' : 'new';
${['saveBackup','validBackup','restoreBackup','report'].map(functionSource).join('\n')}`, context);
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
const report = context.report();
assert.match(report, /Heart Words List 1: 0 of 17 words mastered/);
assert.match(report, /Letters: 0 of 52 known, 0 mastered/);
assert.match(report, /1 mission, 0 Mission Control sessions/);
console.log('Backup, restore and report checks passed ✔');
