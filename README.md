# Robot Farm

A kindergarten reading game for iPad: Heart Words (sight words) and letter names, wrapped in a robot-on-a-blocky-farm game, with letter sounds and decoding coming next. It practices the DIBELS 8 / mCLASS skills and includes a daily 5-minute parent "Mission Control" read-aloud.

- **Play:** open the site in Safari → Share → Add to Home Screen.
- **Grown-up area:** hold ⚙️ for 3 seconds, then answer the math question.
- Progress stays on the device. Backup and restore are in the grown-up area.

**Dev:** `python3 -m http.server`, then open `/?fast` (silent and quick). `?today=YYYY-MM-DD` fakes the date.
**Checks:** `node tools/check.mjs`, `node tools/check-presentation.mjs`, `node tools/check-ui.mjs`, `node tools/check-driving.mjs`
**Deploying:** bump `VERSION` in `sw.js` so installed copies update.

Font: Andika by SIL International, under the SIL Open Font License (`fonts/OFL.txt`).


Visual upgrade: original SVG art, stable farm tiles, short skippable celebrations, local AAC sound effects, and optional gentle farm music. Voice previews list only English voices the browser exposes. Learning progress still uses `robotfarm.v1` with `v: 1`; optional music preferences use a separate `robotfarm.audio.v1` key and are not included in progress backups.

For manual local checks, open `/tools/browser-audit.html`. Its disposable fixture controls are enabled only on localhost. The offline control installs a worker only on the local test origin; use a separate port, open the game directly, stop that server and reload. Production worker registration remains disabled on localhost in the game itself.

See [asset credits](CREDITS.md), [validation and iPad checklist](docs/validation.md), and [screenshots](docs/screenshots/). This branch needs real-iPad acceptance before merging into the live site.

Tractor trails: tap the tractor-and-trailer button on the farm, then pick the barn loop, orchard bends or river bridge. Hold an arrow to drive; left/right also move forward for one-finger steering. Arrow keys work on a keyboard. Cargo loads/unloads automatically at the marked stops; three deliveries finish a road. Every road is available immediately. Driving sessions are temporary and never alter learning progress, coins, seeds or daily mission limits.
