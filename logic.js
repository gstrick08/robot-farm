// Robot Farm: game rules and word content. No DOM in here, so tools/check.mjs can test it with Node.

export const N_GOLD = 10; // gold seeds that fill the bag and finish a mission
export const CAP = 15;    // a mission always ends by this many questions, so he can never get stuck

// ---------- dates: local time (toISOString() is UTC and flips the date in the evening) ----------
export const today = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);

// ---------- shuffling ----------
export function shuffle(arr, rnd = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// The teacher reorders the list on the test, so a reshuffle never hands back the list's own order.
export function reshuffle(arr, rnd = Math.random) {
  for (let t = 0; t < 10; t++) {
    const a = shuffle(arr, rnd);
    if (arr.length < 2 || a.some((x, i) => x !== arr[i])) return a;
  }
  return [...arr.slice(1), arr[0]]; // ponytail: rotate if the RNG keeps giving the same order
}

// ---------- letters ----------
export const ABC = [...'abcdefghijklmnopqrstuvwxyz'];
// Spelled so the device voice says the letter's name: a bare "a" is read "uh", a bare "r" can come out "R" or "are".
export const LETTER_NAMES = {
  a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'eff', g: 'jee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay',
  l: 'ell', m: 'em', n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'are', s: 'ess', t: 'tee', u: 'you', v: 'vee',
  w: 'double you', x: 'ex', y: 'why', z: 'zee',
};
export const LETTER_KEYS = ABC.flatMap(c => ['L:' + c.toUpperCase(), 'L:' + c]);
export const keyText = k => k.slice(2);
export const isLetterKey = k => k.startsWith('L:');
export const isUpper = ch => ch !== ch.toLowerCase();
export const letterName = ch => LETTER_NAMES[ch.toLowerCase()];

// Look-alikes used as the "hard" wrong choices once a letter is known (b/d/p/q twin trouble lives here).
const CONFUSE = {
  b: 'dpqh', d: 'bpqa', p: 'qbdg', q: 'pgbd', g: 'qpy', a: 'odeg', e: 'ca', c: 'eo', o: 'ac', m: 'nwh', n: 'mhur',
  h: 'nb', u: 'nvy', v: 'uwy', w: 'mv', y: 'vgj', i: 'jt', j: 'ig', t: 'fi', f: 't', r: 'n', s: 'z', z: 's',
  k: 'x', x: 'k', l: 'it',
  B: 'DPR', D: 'BOP', P: 'RBF', R: 'PBK', E: 'FL', F: 'EP', M: 'NW', N: 'MZH', W: 'MV', V: 'UWY', U: 'VJ',
  O: 'QCD', Q: 'OG', C: 'GO', G: 'CQO', H: 'NA', K: 'XR', X: 'KY', Y: 'VX', Z: 'NS', S: 'Z', T: 'FL', L: 'TE',
  J: 'U', A: 'H', I: 'TL',
};

// One right answer only: never two forms of the same letter, and never capital I next to lowercase l.
export function letterOptions(target, count, hard, rnd = Math.random, oneCase = false) {
  const t = keyText(target);
  const clash = (a, b) => a.toLowerCase() === b.toLowerCase() || a + b === 'Il' || a + b === 'lI';
  const fits = c => !oneCase || isUpper(c) === isUpper(t);
  const prefer = hard ? shuffle([...(CONFUSE[t] || '')], rnd) : [];
  const out = [t];
  for (const c of [...prefer, ...shuffle(LETTER_KEYS.map(keyText), rnd)]) {
    if (out.length >= count) break;
    if (fits(c) && !out.some(o => clash(o, c))) out.push(c);
  }
  return shuffle(out, rnd).map(c => 'L:' + c);
}

// ---------- words ----------
const norm = w => w.toLowerCase().replace(/[^a-z]/g, '');
// Words that sound the same can never share a question: "tap 'to'" with "two" on screen has two right answers.
const HOMOPHONES = [
  'to two too', 'one won', 'there their theyre', 'for four fore', 'i eye aye', 'no know', 'see sea', 'be bee',
  'by buy bye', 'here hear', 'right write', 'blue blew', 'read red reed', 'new knew', 'eight ate', 'your youre',
  'our hour are', 'would wood', 'where wear ware', 'made maid', 'some sum', 'son sun', 'not knot', 'so sew sow',
  'whole hole', 'night knight', 'meet meat', 'week weak', 'flower flour', 'dear deer', 'tail tale', 'pair pear',
  'plane plain', 'piece peace', 'mail male', 'road rode', 'sail sale', 'wait weight', 'which witch', 'hi high',
  'knows nose', 'way weigh', 'wrap rap', 'rose rows', 'break brake', 'tea tee', 'ant aunt', 'cent sent scent',
  'in inn', 'or oar ore', 'all awl', 'bare bear', 'board bored', 'fair fare', 'hair hare', 'heard herd',
  'lead led', 'oh owe', 'past passed', 'rain reign rein', 'ring wring', 'threw through', 'toe tow', 'we wee',
  'you ewe yew', 'do dew due', 'him hymn', 'cell sell', 'none nun', 'scene seen', 'stair stare',
  'tide tied', 'wail whale', 'waist waste', 'weather whether', 'ball bawl', 'berry bury', 'groan grown',
].map(g => g.split(' '));
const HOMO = new Map();
for (const g of HOMOPHONES) for (const w of g) HOMO.set(w, new Set([...(HOMO.get(w) || []), ...g]));
export const soundsLike = (a, b) => norm(a) === norm(b) || !!HOMO.get(norm(a))?.has(norm(b));

// Wrong-choice bank: common, kid-safe words (never asked, only shown as look-alikes).
export const LOOKALIKES = [...new Set((
  'a and away big blue can come down find for funny go help here in is it jump little look make me my not one play ' +
  'red run said see the three to two up we where yellow you all am are at ate be black brown but came did do eat four ' +
  'get good have he into like must new no now on our out please pretty ran ride saw say she so soon that there they ' +
  'this too under want was well went what white who will with yes after again an any as ask by could every fly from ' +
  'give going had has her him his how just know let may of old once open over put round some stop take thank them ' +
  'then think walk were when sad sand sat sit set ten tan hat hot hit cat cot cut dog dig pig bag bug bed bad bud rod ' +
  'sun fun fan fin map mop man men pen pan pin top tip tap hop hip lip lap log leg lid kid kit fit fox box mix six wet ' +
  'web win wig yet jam jet job hug hum hen hid nap net nut cup cap cub tub rug rat rip than those these hair hers lake ' +
  'lick lime line paid sail slid cone same your own collar litter later wear tree free three thin then this sing ' +
  'song long wing ring king'
).split(' '))];

const similarity = (a, b) => {
  a = norm(a); b = norm(b);
  const inB = new Set(b);
  return (a[0] === b[0] ? 2 : 0) + (a.at(-1) === b.at(-1) ? 1 : 0) - Math.abs(a.length - b.length) * 0.7 +
    [...a].filter(c => inB.has(c)).length / Math.max(1, a.length) * 2;
};

// New words get very different wrong choices (easy, near-errorless). Known words get look-alikes (careful reading).
export function wordOptions(target, pool, count, hard, rnd = Math.random) {
  const cands = [...new Set([...pool, ...LOOKALIKES])].filter(w => !soundsLike(w, target));
  const ranked = cands.map(w => [(hard ? 1 : -1) * similarity(target, w) + rnd() * 1.5, w])
    .sort((a, b) => b[0] - a[0]).map(x => x[1]);
  const out = [target];
  for (const w of ranked) {
    if (out.length >= count) break;
    if (!out.some(o => soundsLike(o, w))) out.push(w);
  }
  return shuffle(out, rnd);
}

// Lowercase everything except the word "I" (and I'm / I'll), the way a kindergarten word list prints.
export const normalizeWord = w => w.trim().toLowerCase().replace(/^i(?=$|')/, 'I');
// "said, the, read=reed" → words + say-it-like overrides for words the voice could misread.
export function parseList(text) {
  const words = [], say = {};
  for (const raw of text.split(/[\n,;]+/)) {
    const [w, s] = raw.split('=');
    const word = normalizeWord(w || '');
    if (!word || words.includes(word)) continue;
    words.push(word);
    if (s && s.trim()) say[word] = s.trim();
  }
  return { words, say };
}

// ---------- progress per word/letter ----------
export const newItem = () => ({ gold: 0, silver: 0, miss: 0, box: 0, days: [], fast: 0, slow: 0, again: 0, coop: null, last: null });
export const isNew = it => !it.last;
export const isKnown = it => it.box >= 2;
// Mastered = right on 3 different days, including an instant read-aloud to a grown-up, and the latest read-aloud wasn't a miss.
export const isMastered = it => it.days.length >= 3 && it.fast >= 1 && it.coop !== 'again';
const addDay = (it, d) => { if (!it.days.includes(d)) it.days = [...it.days, d].slice(-10); };

export function recordSolo(it, medal, d) { // 'gold' | 'silver' | 'miss'
  it.last = d;
  if (medal === 'miss') { it.miss++; it.box = Math.max(0, it.box - 1); return; }
  it[medal]++;
  if (medal !== 'gold') return;
  addDay(it, d);
  // Taps can lift an item at most 2 steps a day: "known" by the end of a good first day, but real strength takes more days.
  if (it.upDay !== d) { it.upDay = d; it.ups = 0; }
  if (it.ups < 2) { it.ups++; it.box = Math.min(5, it.box + 1); }
}

export function recordCoop(it, result, d) { // 'fast' | 'slow' | 'again'
  it.last = d; it.coop = result; it[result]++;
  if (result === 'fast') { it.box = Math.min(5, it.box + 1); addDay(it, d); }
  if (result === 'again') it.box = Math.min(it.box, 1);
}

// ---------- what to practice (incremental rehearsal) ----------
// One new item mixed among known ones keeps him right ~85% of the time. Nothing known yet → rotate two new ones.
export function pickFocus(candidates, knownPool, items, rnd = Math.random) {
  const it = k => items[k] || newItem();
  const unknown = shuffle(candidates.filter(k => !isKnown(it(k))), rnd)
    .sort((a, b) => !!it(b).last - !!it(a).last); // started-but-not-known first; stable sort keeps the shuffle
  const known = shuffle(knownPool.filter(k => isKnown(it(k))), rnd);
  return { focus: unknown.slice(0, known.length >= 3 ? 1 : 2), known };
}

// The new item comes back at growing gaps (0, 2, 5, 9, 14); known items fill the rest, never the same one twice in a row.
const SLOTS = [[0, 2, 5, 9, 14], [1, 4, 7, 11]];
export function buildQueue(focus, known, len, rnd = Math.random) {
  if (!known.length) return roundRobin(focus, len, rnd);
  const q = Array(len).fill(null);
  focus.slice(0, 2).forEach((f, i) => SLOTS[i].forEach(p => { if (p < len) q[p] = f; }));
  let bag = [];
  for (let p = 0; p < len; p++) {
    if (q[p]) continue;
    if (!bag.length) bag = shuffle(known, rnd);
    const i = bag.findIndex(x => x !== q[p - 1] && x !== q[p + 1]);
    q[p] = bag.splice(Math.max(0, i), 1)[0];
  }
  return q;
}
function roundRobin(items, len, rnd) {
  if (items.length < 2) return Array(items.length ? len : 0).fill(items[0]);
  const q = [];
  while (q.length < len) for (const x of shuffle(items, rnd)) if (q.length < len && x !== q.at(-1)) q.push(x);
  return q;
}

// ---------- one mission ----------
// Only first-try answers (gold) fill the seed bag, so rushing makes a mission LONGER. CAP still ends it, so he can't get stuck.
export const createMission = (queue, nGold = N_GOLD, cap = CAP) =>
  ({ queue: [...queue], nGold, cap, golds: 0, silvers: 0, asked: 0, current: null, firstTry: true, lastPos: [] });
export const missionDone = m => m.golds >= m.nGold || m.asked >= m.cap || !m.queue.length;
export function nextTarget(m) {
  if (missionDone(m)) return (m.current = null);
  m.asked++; m.firstTry = true;
  return (m.current = m.queue.shift());
}
// 'gold' | 'silver' for the right tap; 'miss' for the first wrong tap on a question; 'wrong' for later ones.
export function answer(m, correct) {
  if (correct) {
    const medal = m.firstTry ? 'gold' : 'silver';
    m[medal + 's']++;
    return medal;
  }
  if (!m.firstTry) return 'wrong';
  m.firstTry = false;
  if (!m.queue.slice(0, 5).includes(m.current)) m.queue.splice(Math.min(3, m.queue.length), 0, m.current); // ask it again soon
  return 'miss';
}

// Keep the right answer from sitting in the same spot 3 times running (kids spot "it's always the middle one").
export function placeTarget(opts, target, lastPos, rnd = Math.random) {
  const o = [...opts];
  let i = o.indexOf(target);
  if (o.length > 1 && lastPos.length >= 2 && lastPos.every(p => p === i)) {
    const j = (i + 1 + Math.floor(rnd() * (o.length - 1))) % o.length;
    [o[i], o[j]] = [o[j], o[i]];
    i = j;
  }
  lastPos.push(i);
  if (lastPos.length > 2) lastPos.shift();
  return o;
}

// 2 choices for a brand-new item, up to 4 once it's known; 2 again right after a miss (quietly easier).
export const choiceCount = (it, easeOff) => easeOff ? 2 : Math.min(4, 2 + it.box);

// Each day gets 3 missions from this cycle, so words, letters and the Glitch boss all rotate.
const CYCLE = ['hunt', 'letters', 'pods', 'twins', 'boss'];
export const dailyMissions = (dayIndex, perDay) =>
  Array.from({ length: perDay }, (_, i) => CYCLE[(dayIndex * 3 + i) % CYCLE.length]);

// ---------- farm ----------
export const cropStage = (crop, d) => {
  const age = daysBetween(crop.planted, d);
  return age >= 2 ? 'ready' : age >= 1 ? 'sprout' : 'seed';
};

// The teacher's Heart Words, List 1 (from the take-home strip). Lists 2-6 get typed in the grown-up area as they arrive.
export const LIST_1 = ['a', 'see', 'and', 'am', 'I', 'like', 'me', 'the', 'did', 'man', 'on', 'not', 'but', 'can', 'ten', 'get', 'him'];
