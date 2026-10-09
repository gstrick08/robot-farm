// Presentation-only helpers; the learning rules remain in logic.js.
const novelty = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|trinoids|whisper|wobble|zarvox/i;
export function voiceQuality(v) {
  if (/premium/i.test(v.name)) return 'Device labels this Premium';
  if (/enhanced/i.test(v.name)) return 'Device labels this Enhanced';
  return novelty.test(v.name) ? 'Character / novelty voice' : 'Standard English voice';
}
export function rankVoices(voices) {
  const score = v => (/premium|enhanced/i.test(v.name) ? 100 : 0) + (/^en-US$/i.test(v.lang) ? 20 : 0) + (/samantha/i.test(v.name) ? 5 : 0) - (novelty.test(v.name) ? 50 : 0);
  return voices.filter(v => /^en(?:-|_|$)/i.test(v.lang)).sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
}
export const musicAllowed = (screen, speaking, hidden) => !speaking && !hidden && ['start', 'farm', 'reward'].includes(screen);
export function audioPreferences(value) {
  return { music: typeof value?.music === 'boolean' ? value.music : false,
    volume: Number.isFinite(value?.volume) ? Math.max(0, Math.min(.5, value.volume)) : .18 };
}
