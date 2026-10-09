import { musicAllowed } from './presentation.js';
export const SOUND_FILES = ['tap', 'gold', 'silver', 'hmm', 'coin', 'harvest', 'bag', 'complete', 'rocket', 'medal', 'farm'];
export function sounds(ac, fast, preferences) {
  const buffers = new Map(), musicGain = ac.createGain();
  musicGain.gain.value = 0; musicGain.connect(ac.destination);
  let screen = 'start', speaking = false, hidden = false, musicSource;
  function update() {
    const allowed = preferences.music && musicAllowed(screen, speaking, hidden) && !fast;
    musicGain.gain.cancelScheduledValues(ac.currentTime);
    // Prompts mute immediately; resuming ambience fades in gently.
    if (!allowed) musicGain.gain.setValueAtTime(0, ac.currentTime);
    else musicGain.gain.setTargetAtTime(preferences.volume, ac.currentTime, .3);
    if (allowed && !musicSource && buffers.has('farm')) {
      musicSource = ac.createBufferSource(); musicSource.buffer = buffers.get('farm'); musicSource.loop = true;
      musicSource.connect(musicGain); musicSource.start();
    }
  }
  const ready = fast ? Promise.resolve() : Promise.all(SOUND_FILES.map(async name => {
    try {
      const response = await fetch(`audio/${name}.m4a`);
      if (!response.ok) throw new Error('Audio asset unavailable');
      buffers.set(name, await ac.decodeAudioData(await response.arrayBuffer()));
    } catch { /* Device speech and synthesized effects remain available if decoding fails. */ }
  })).then(update);
  return {
    ready,
    play(name) {
      if (fast) return true;
      if (!buffers.has(name)) return false;
      const source = ac.createBufferSource(); source.buffer = buffers.get(name); source.connect(ac.destination); source.start(); return true;
    },
    scene(value) { screen = value; update(); },
    speech(value) { speaking = value; update(); },
    visibility(value) { hidden = value; update(); },
    update,
  };
}
