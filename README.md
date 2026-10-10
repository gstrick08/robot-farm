# Robot Farm

A kindergarten reading game for iPhone and iPad: Heart Words (sight words) and letter names, wrapped in a robot-on-a-blocky-farm game, with letter sounds and decoding coming next. It practices the DIBELS 8 / mCLASS skills and includes a daily 5-minute parent "Mission Control" read-aloud.

- **Play:** open the site in Safari → Share → Add to Home Screen.
- **Grown-up area:** hold ⚙️ for 3 seconds, then answer the math question.
- Progress stays on the device. Backup and restore are in the grown-up area.

**Dev:** `python3 -m http.server`, then open `/?fast` (silent and quick). `?today=YYYY-MM-DD` fakes the date.
**Checks:** `node tools/check.mjs`, `node tools/check-presentation.mjs`, `node tools/check-ui.mjs`, `node tools/check-driving.mjs`, `node tools/check-equipment.mjs`, `node tools/check-speech.mjs`
**Deploying:** bump `VERSION` in `sw.js` so installed copies update.

Font: Andika by SIL International, under the SIL Open Font License (`fonts/OFL.txt`).


Visual upgrade: original SVG art, stable farm tiles, short skippable celebrations, local AAC sound effects, and optional gentle farm music. Voice previews list only English voices the browser exposes. Learning progress still uses `robotfarm.v1` with `v: 1`; optional music preferences use a separate `robotfarm.audio.v1` key and are not included in progress backups.

For manual local checks, open `/tools/browser-audit.html`. Its disposable fixture controls are enabled only on localhost. The offline control installs a worker only on the local test origin; use a separate port, open the game directly, stop that server and reload. Production worker registration remains disabled on localhost in the game itself.

See [asset credits](CREDITS.md), [validation and device checklist](docs/validation.md), and [screenshots](docs/screenshots/). This branch needs real-iPhone/iPad acceptance before merging into the live site.

Tractor trails: tap the tractor-and-trailer button on the farm, then pick the barn loop, orchard bends or river bridge. Hold an arrow to drive; left/right also move forward for one-finger steering. Arrow keys work on a keyboard. Cargo loads/unloads automatically at the marked stops; three deliveries finish a road. Every road is available immediately. Driving sessions are temporary and never alter learning progress, coins, seeds or daily mission limits.

Equipment jobs are now the main hub. The four original scenes rotate across the existing daily mission slots: assemble a tractor, work a field, load and haul corn, and make popcorn. Correct answers advance the equipment; helped answers still earn silver, and only first-try gold fills the seed bag. The equipment pauses before the next question. Every job keeps the same 10-gold / 15-question limit, teaching prompts, shuffled choices, fonts and progress schema. There are no extra job rewards or required missions. Home visits the farm, the tractor opens the three driving roads, and the rocket opens the parent-gated Mission Control.

For equipment integration checks, serve an isolated localhost port and open `/tools/equipment-audit.html`. It uses a generated iframe containing the current game source, with test hooks appended only to that disposable document. It never adds debug hooks to the production game.

Phone/tablet follow-up: portrait and landscape layouts use large answer and driving controls, safe-area spacing and a panning farm that preserves tile sizes. The manifest allows either orientation. Automatic speech prefers local Premium/Enhanced English voices; unsaved speed changes apply to previews, and saved voice/speed preferences remain intact. Install an enhanced voice through Apple’s accessibility voice settings if the browser only exposes standard voices. Native Safari listening, touch performance, share sheets and Home Screen installation still need physical-device acceptance.

The localhost equipment harness also includes a complete flow test and a phone/tablet layout matrix. It generates test hooks only in the disposable iframe; none ship in the main game.
