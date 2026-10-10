// Presentation-only helpers; the learning rules remain in logic.js.
const novelty = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|trinoids|whisper|wobble|zarvox|\bfred\b/i;
const tier = v => /premium/i.test(v.name + ' ' + v.voiceURI) ? 200 : /enhanced/i.test(v.name + ' ' + v.voiceURI) ? 120 : 0;
export function voiceQuality(v) {
  if (novelty.test(v.name)) return 'Character / novelty voice';
  if (/premium/i.test(v.name)) return 'Device labels this Premium';
  if (/enhanced/i.test(v.name)) return 'Device labels this Enhanced';
  return tier(v) ? 'Device identifies a higher-quality voice' : 'Standard installed English voice';
}
export function rankVoices(voices) {
  const score = v => tier(v) + (/^en[-_]US$/i.test(v.lang) ? 20 : 0) + (/ava|allison|samantha|susan|alex/i.test(v.name) ? 5 : 0) - (novelty.test(v.name) ? 1000 : 0);
  return voices.filter(v => /^en(?:-|_|$)/i.test(v.lang) && v.localService !== false).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
}
export const speechRate = value => Number.isFinite(value) ? Math.max(.6, Math.min(1.1, value)) : .95;
export const musicAllowed = (screen, speaking, hidden) => !speaking && !hidden && ['start', 'farm', 'reward'].includes(screen);
export function audioPreferences(value) {
  return { music: typeof value?.music === 'boolean' ? value.music : false,
    volume: Number.isFinite(value?.volume) ? Math.max(0, Math.min(.5, value.volume)) : .18 };
}
