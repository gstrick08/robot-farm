# Robot Farm

A kindergarten reading game for iPad: Heart Words (sight words) and letter names, wrapped in a robot-on-a-blocky-farm game, with letter sounds and decoding coming next. It practices the DIBELS 8 / mCLASS skills and includes a daily 5-minute parent "Mission Control" read-aloud.

- **Play:** open the site in Safari → Share → Add to Home Screen.
- **Grown-up area:** hold ⚙️ for 3 seconds, then answer the math question.
- Progress stays on the device. Backup and restore are in the grown-up area.

**Dev:** `python3 -m http.server`, then open `/?fast` (silent and quick). `?today=YYYY-MM-DD` fakes the date.
**Rules check:** `node tools/check.mjs`
**Deploying:** bump `VERSION` in `sw.js` so installed copies update.

Font: Andika by SIL International, under the SIL Open Font License (`fonts/OFL.txt`).
