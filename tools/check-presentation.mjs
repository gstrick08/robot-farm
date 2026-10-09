import assert from 'node:assert/strict';
import { rankVoices, voiceQuality, musicAllowed, audioPreferences } from '../presentation.js';
import { sounds, SOUND_FILES } from '../sounds.js';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const voices = [
  { name: 'Bells', lang: 'en-US', voiceURI: 'bells' },
  { name: 'English Enhanced', lang: 'en-GB', voiceURI: 'enhanced' },
  { name: 'Samantha', lang: 'en-US', voiceURI: 'sam' },
  { name: 'French Premium', lang: 'fr-FR', voiceURI: 'fr' },
];
assert.deepEqual(rankVoices(voices).map(v => v.voiceURI), ['enhanced', 'sam', 'bells']);
assert.equal(voices.length, 4, 'ranking does not mutate the device list');
assert.match(voiceQuality(voices[0]), /novelty/);
assert.match(voiceQuality(voices[1]), /Enhanced/);
for (const screen of ['mission', 'coop', 'parent', 'page', 'drive']) assert.equal(musicAllowed(screen, false, false), false);
for (const screen of ['start', 'farm', 'reward']) {
  assert.equal(musicAllowed(screen, false, false), true);
  assert.equal(musicAllowed(screen, true, false), false, 'speech always mutes music');
  assert.equal(musicAllowed(screen, false, true), false, 'background always mutes music');
}
assert.deepEqual(audioPreferences({ volume: 4, music: 'yes' }), { volume: .5, music: false });
assert.deepEqual(audioPreferences({ volume: NaN }), { volume: .18, music: false });
const fixture = JSON.parse(readFileSync(new URL('fixtures/played-v1.json', import.meta.url)));
assert.equal(fixture.v, 1); assert.equal(fixture.farm.length, 60); assert.equal(fixture.seeds, 13); assert.equal(fixture.goldSeeds, 1);
for (const name of SOUND_FILES) assert.ok(existsSync(new URL(`../audio/${name}.m4a`, import.meta.url)), `${name} clip exists`);
// Verify actual mixer gating, not only its pure predicate.
let gain = 1, requests = 0;
const ac = { currentTime: 0, destination: {},
  createGain: () => ({ gain: { set value(v) { gain = v; }, cancelScheduledValues() {}, setValueAtTime(v) { gain = v; }, setTargetAtTime(v) { gain = v; } }, connect() {} }),
  decodeAudioData: async () => ({}), createBufferSource: () => ({ connect() {}, start() {} }),
};
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => { requests++; return { ok: true, arrayBuffer: async () => new ArrayBuffer(0) }; };
try {
  const mixer = sounds(ac, false, { music: true, volume: .2 }); await mixer.ready;
  assert.equal(gain, .2); mixer.speech(true); assert.equal(gain, 0);
  mixer.scene('mission'); mixer.speech(false); assert.equal(gain, 0);
  mixer.scene('farm'); assert.equal(gain, .2); mixer.visibility(true); assert.equal(gain, 0);
  const before = requests, silent = sounds(ac, true, { music: true, volume: .2 }); await silent.ready;
  assert.equal(requests, before, 'fast mode skips audio fetch/decode'); assert.equal(silent.play('gold'), true); assert.equal(gain, 0);
} finally { globalThis.fetch = originalFetch; }
console.log('Presentation checks passed ✔');

// Exercise the service worker install: every required local asset must be precached.
const events = {}, cached = [];
const worker = { self: { addEventListener: (type, fn) => events[type] = fn, skipWaiting() {} },
  caches: { open: async name => ({ addAll: async paths => { assert.equal(name, 'robotfarm-3'); cached.push(...paths); } }) },
};
vm.runInNewContext(readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), worker);
let installed; events.install({ waitUntil: p => installed = p }); await installed;
for (const asset of cached.filter(p => p !== './')) assert.ok(existsSync(new URL('../' + asset, import.meta.url)), 'Cached asset exists: ' + asset);
for (const name of SOUND_FILES) assert.ok(cached.includes('audio/' + name + '.m4a'));
for (const asset of ['ui.css', 'art.js', 'presentation.js', 'sounds.js', 'driving.js', 'drive-math.js', 'equipment.js', 'fonts/Fredoka-Latin.woff2']) assert.ok(cached.includes(asset));
console.log('Offline asset checks passed ✔');
