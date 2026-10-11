// Additional parent preferences stay separate from the original learning save.
export const PREF_KEY = 'robotfarm.preferences.v1';
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export function preferences(value) {
  const letters = [...ALPHABET].filter(c => Array.isArray(value?.letters) && value.letters.includes(c));
  return { letters: letters.length ? letters : [...ALPHABET], case: ['both','upper','lower'].includes(value?.case) ? value.case : 'both', calm: value?.calm === true, effects: value?.effects !== false };
}
export function validPreferences(value) {
  return value && Array.isArray(value.letters) && value.letters.length > 0 && value.letters.length <= 26
    && value.letters.every(c => ALPHABET.includes(c) && typeof c === 'string' && c.length === 1)
    && new Set(value.letters).size === value.letters.length && ['both','upper','lower'].includes(value.case)
    && typeof value.calm === 'boolean' && typeof value.effects === 'boolean';
}
export function focusedLetters(value) {
  const p = preferences(value);
  return p.letters.flatMap(c => p.case === 'upper' ? ['L:'+c] : p.case === 'lower' ? ['L:'+c.toLowerCase()] : ['L:'+c,'L:'+c.toLowerCase()]);
}
export function focusContext(type, context, value) {
  if (!['letters','twins'].includes(type)) return context;
  const keys = focusedLetters(value);
  return keys.length === 52 ? context : JSON.stringify([context, keys]);
}
