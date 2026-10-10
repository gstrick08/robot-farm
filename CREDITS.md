# Asset credits

The hero, LED face, hats, crops and growth stages, animals, scenery and interface icons in `art.js` and the tractor/trailer/road scenery in `driving.js` and the workshop, side-view tractor, field implement, corn trailer and popcorn machine in `equipment.js` are original SVG drawings made for Robot Farm. No third-party character art or textures are included.

The ten effects and 24-second instrumental farm loop in `audio/` are original procedural compositions made for this game, without speech, phonemes or sampled recordings. Their reproducible source is `tools/make-sounds.py` (Python standard library plus macOS `afconvert`; optional asset authoring only, no runtime build step). No system-voice recordings or cloud TTS were generated.

| Font | Source | License included |
| --- | --- | --- |
| Andika Regular, existing teaching font | [SIL Andika](https://software.sil.org/andika/) | SIL Open Font License 1.1, `fonts/OFL.txt` |
| Fredoka Latin variable woff2, display UI only | [Google Fonts Fredoka](https://github.com/google/fonts/tree/main/ofl/fredoka), distributed by fonts.gstatic.com | SIL Open Font License 1.1, `fonts/Fredoka-OFL.txt` |

Fonts, drawings and AAC audio are all served locally and precached. Teaching choices, modeled words, letters, read-aloud cards, practice pages and rescued-bot labels retain their teaching fonts; Fredoka is limited to the display UI.

No emoji remain in the solo kid interface, farm, shop or celebrations. Emoji remain in the grown-up area and its parent-operated controls: status markers, school badges, backup/report buttons, the practice-page seed marker, and the neutral Mission Control rating strip. Legacy emoji strings remain as internal icon identifiers and saved hat values so v1 saves continue to load; they are rendered as matching SVG art.

The book icon, star bursts and mini-reader text are original Robot Farm content. Hooked on Phonics is referenced for its published learn/practice/read/celebrate structure only: https://www.hookedonphonics.com/. No book text, branding, character artwork or recordings from Hooked on Phonics or Astro were used.
