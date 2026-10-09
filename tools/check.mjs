// Run: node tools/check.mjs. It fails loudly if a game rule breaks.
import assert from 'node:assert/strict';
import * as L from '../logic.js';

// Seeded RNG so a failure reproduces.
let seed = 42;
const rng = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Dates are local, and survive daylight-saving changes.
assert.equal(L.today(new Date(2026, 9, 9, 23, 30)), '2026-10-09');
assert.equal(L.daysBetween('2026-03-07', '2026-03-09'), 2);
assert.equal(L.daysBetween('2026-10-31', '2026-11-02'), 2);

// The teacher shuffles the list, so we never hand it back in list order.
const list = ['the', 'and', 'a', 'I'];
for (let i = 0; i < 10000; i++) assert.notDeepEqual(L.reshuffle(list, rng), list);
assert.deepEqual(L.reshuffle(['a', 'b'], () => 0.99), ['b', 'a']);

// Word questions: exactly one right answer, never two words that sound the same.
const pool = [...L.LIST_1, 'there', 'one', 'for', 'no', 'be', 'by', 'here', 'right', 'read', 'do', 'our'];
for (let i = 0; i < 3000; i++) {
  const target = pool[i % pool.length];
  for (const hard of [false, true]) {
    const opts = L.wordOptions(target, pool, 2 + (i % 5), hard, rng);
    assert.equal(opts.length, 2 + (i % 5));
    assert.equal(opts.filter(o => o === target).length, 1);
    for (const a of opts) for (const b of opts) if (a !== b) assert.ok(!L.soundsLike(a, b), `${a}/${b} in one question`);
  }
}
assert.ok(L.soundsLike('to', 'two') && L.soundsLike('I', 'eye') && L.soundsLike('there', "they're"));

// Letter questions: one right answer, one form per letter, never capital I beside lowercase l.
for (let i = 0; i < 5000; i++) {
  const target = L.LETTER_KEYS[i % 52], t = L.keyText(target), oneCase = i % 3 === 0;
  const opts = L.letterOptions(target, 2 + (i % 3), i % 2 === 0, rng, oneCase).map(L.keyText);
  assert.equal(opts.length, 2 + (i % 3));
  assert.equal(opts.filter(c => c === t).length, 1);
  assert.equal(new Set(opts.map(c => c.toLowerCase())).size, opts.length, `two forms of one letter: ${opts}`);
  assert.ok(!(opts.includes('I') && opts.includes('l')), 'I and l together');
  if (oneCase) assert.ok(opts.every(c => L.isUpper(c) === L.isUpper(t)));
}

// Incremental rehearsal: the new item returns at growing gaps, and nothing repeats back to back.
const known = ['k1', 'k2', 'k3', 'k4'];
const q = L.buildQueue(['new'], known, 17, rng);
assert.deepEqual(q.flatMap((x, i) => (x === 'new' ? [i] : [])), [0, 2, 5, 9, 14]);
for (let i = 1; i < q.length; i++) assert.notEqual(q[i], q[i - 1]);
const rr = L.buildQueue(['n1', 'n2'], [], 12, rng);
assert.equal(rr.length, 12);
for (let i = 1; i < rr.length; i++) assert.notEqual(rr[i], rr[i - 1]);
assert.deepEqual(L.buildQueue([], [], 5, rng), []);

// Focus picks a word he's started over a brand-new one, and only one new thing once he knows 3.
const k = (box, last = 'x') => ({ ...L.newItem(), box, last });
const items = { 'W:a': k(2), 'W:b': k(2), 'W:c': k(3), 'W:d': k(1) };
const keys = ['W:a', 'W:b', 'W:c', 'W:d', 'W:e'];
const f = L.pickFocus(keys, keys, items, rng);
assert.deepEqual(f.focus, ['W:d']);
assert.equal(f.known.length, 3);

// A random-tapping "rusher" always finishes, but gets less gold and a longer mission than a careful player.
function play(careful, choices = 3) {
  const m = L.createMission(L.buildQueue(['new'], known, L.CAP + 2, rng));
  while (L.nextTarget(m)) {
    for (let left = choices; ; left--) { // a wrong choice fades out after each miss
      const r = L.answer(m, careful || rng() < 1 / left);
      if (r === 'gold' || r === 'silver') break;
    }
  }
  return m;
}
let rushGold = 0, rushAsked = 0;
for (let i = 0; i < 2000; i++) {
  const c = play(true);
  assert.equal(c.golds, L.N_GOLD);
  assert.equal(c.asked, L.N_GOLD);
  const r = play(false);
  assert.ok(r.asked <= L.CAP);
  rushGold += r.golds; rushAsked += r.asked;
}
assert.ok(rushGold / 2000 < L.N_GOLD * 0.6, `rusher averaged ${rushGold / 2000} gold`);
assert.ok(rushAsked / 2000 > L.N_GOLD + 2, `rusher averaged ${rushAsked / 2000} questions`);

// The right answer never sits in the same spot 3 times running.
const lastPos = [], spots = [];
for (let i = 0; i < 300; i++) spots.push(L.placeTarget(['t', 'a', 'b', 'c'], 't', lastPos, rng).indexOf('t'));
for (let i = 2; i < spots.length; i++) assert.ok(!(spots[i] === spots[i - 1] && spots[i] === spots[i - 2]));

// Mastery needs 3 different days AND an instant read-aloud. A read-aloud miss takes it away.
const it = L.newItem();
for (const d of ['2026-10-01', '2026-10-02', '2026-10-03']) L.recordSolo(it, 'gold', d);
assert.ok(L.isKnown(it) && !L.isMastered(it), 'taps alone never master a word');
L.recordCoop(it, 'fast', '2026-10-03');
assert.ok(L.isMastered(it));
L.recordCoop(it, 'again', '2026-10-04');
assert.ok(!L.isMastered(it) && !L.isKnown(it));
const oneDay = L.newItem();
for (let i = 0; i < 5; i++) L.recordSolo(oneDay, 'gold', '2026-10-01');
assert.equal(oneDay.box, 2, 'taps lift an item at most 2 steps a day');
L.recordCoop(oneDay, 'fast', '2026-10-01');
assert.ok(!L.isMastered(oneDay), 'one big day is not mastery');
L.recordSolo(oneDay, 'gold', '2026-10-02');
assert.equal(oneDay.box, 4, 'a new day can lift it again');

// List typing: commas, newlines, semicolons, "say it like" overrides; the word "I" stays capital.
assert.deepEqual(L.parseList('The, i\nsaid; read=reed, the'), { words: ['the', 'I', 'said', 'read'], say: { read: 'reed' } });

// Daily missions rotate through every type.
const types = new Set();
for (let d = 0; d < 5; d++) L.dailyMissions(d, 3).forEach(x => types.add(x));
assert.deepEqual([...types].sort(), ['boss', 'hunt', 'letters', 'pods', 'twins']);

// Crops: planted → sprout the next day → ready the day after.
assert.equal(L.cropStage({ planted: '2026-10-09' }, '2026-10-09'), 'seed');
assert.equal(L.cropStage({ planted: '2026-10-09' }, '2026-10-10'), 'sprout');
assert.equal(L.cropStage({ planted: '2026-10-09' }, '2026-10-11'), 'ready');

console.log('All checks passed ✔');
