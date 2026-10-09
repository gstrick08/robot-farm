# Visual upgrade validation — 9 October 2026

Baseline: `1bf061b80170d2f7dcdcc4d5c550415548823253`. Branch: `visual-upgrade`. `logic.js` has no changes. No production deployment or merge was performed.

## Passed

- Original `node tools/check.mjs`; new presentation/mixer/offline asset checks; actual backup/restore/report functions exercised in Node with browser services replaced by local stubs. Inline module syntax and whitespace checks passed.
- A pre-upgrade played v1 save loaded with its original 60 tiles, item records, coins=2, seeds=13, goldenSeeds=1 and completed mission index 0. The fixture contains no personal name. Save structure remains v1; music preferences are stored separately.
- Fresh start, color choice, three ready carrots; normal and golden planting; overnight sprout/ready progression; two-tap shop purchase and placement. Fixed an inherited `body.placing` selector collision exposed by that check.
- All five missions completed after a deliberate second-miss hint and silver correction, followed by 10 gold answers. Silver did not fill the bag. Word Hunt also completed at the 15-question cap with no gold. Glitch shrank on correct answers and awarded its existing five coins.
- Spoken replay immediately disabled every choice and unlocked after speech. A non-fast letter answer filled a bag slot; quitting retained that earned seed (13 → 14).
- Full 17-word and 52-letter placement checks; every letter instant answer became known. Three days of word placement, then a clean shuffled practice page, produced READY TO TEST. The page held all 17 distinct words in shuffled order.
- Mission Control modeled an Again item, counted its instant re-read as Slow, and asked that item once more at the end. A completed session awarded its existing three coins.
- Teacher-passed state persisted and the farm displayed a 1 / 6 medal ceremony. Restore through the actual file chooser loaded the original v1 item records and removed the later practice-ready marker, as expected.
- Mac device voice list/preview and music preference controls exercised. All 11 AAC files decoded in WebKit, including the 24-second loop. Mixer tests assert immediate silence during speech, missions, read-aloud, practice, parent screens and backgrounding; FAST avoids audio fetch/decode.
- Farm reviewed in Mac Safari at 1024×768 and 1180×820. Final WebKit 1024×768 tile size was 78.203px, with all 60 tiles; mission/home/replay/plant/shop touch targets meet the 72px requirement. Teaching font selection is preserved, and rescued labels explicitly use Andika.
- Local offline smoke test on isolated port 8003: installed the full cache using the local harness, stopped the server, reloaded the actual game, and entered the 60-tile farm successfully. This is not a certification of iPad installed-app updating.

## Limits and remaining acceptance checks

- Actual iPad: inspect exposed Premium/Enhanced voices, tune speed/pitch by ear, test first-tap audio and return from background, install/update via Home Screen, disconnect networking, play sound offline, and measure frame rate on a circa-2021 device.
- Reduced-motion styles and bounded particle counts were inspected; an actual iPad reduced-motion run is still needed. Desktop portrait was inspected; the touch-only rotation overlay needs iPad verification.
- Backup export invoked through the parent UI, but the automation backend returned no downloadable file. Byte-for-byte v1 export and restore are covered by `check-ui.mjs`; Files/share-sheet export needs native device acceptance.
- No error was identified in the game sources. The automation console intermittently reports a MutationObserver observer error with no source URL; the application does not use MutationObserver. A clean native Safari console check is required before claiming strict zero-console acceptance.
- The default .85 speech speed was preserved. Successful browser speech execution and locking are verified; subjective voice warmth and pronunciation need listening on the intended iPad.

## Preserved behaviors needing separate approval

Repeated Mission Control sessions retain the original coin rewards; the parent pronunciation preview retains list order; adding more than six lists remains possible; backup validation retains its existing minimal checks. Changing these would affect existing behavior and was excluded from visual polish.

The voice-pack proposal remains in the local design audit: family recordings, a chosen neural TTS service after terms/account approval, or system-voice recordings only after verifying public distribution rights. No voice files, isolated phonemes, paid service, library or new learning rule were added.

## Tractor trails follow-up

The approved equipment direction is implemented as three immediately available roads: Barn loop, Orchard bends and River bridge. Each has three deterministic cargo deliveries. Driving uses an independent in-memory session; it has no learning rewards, timers, penalties or new v1 fields. Steering buttons also move forward, so one finger is sufficient. Releasing controls, leaving the screen, blurring or backgrounding clears input; background return bounds elapsed time.

`node tools/check-driving.mjs` covers motion, reverse steering, one-finger controls, trailer orientation, stop behavior, bounded elapsed time, cargo stops, nonduplicated loads and three-delivery completion. Driving modules are included in the offline cache and driving music stays off. Real iPad multi-touch feel and measured frame rate remain device acceptance checks.

Browser route harness completed all three roads (3/3 each) through held pointer controls, including automatic loading/unloading and finish screens. The before/after learning-save strings were identical.

The final worker was installed on isolated port 8005, the server was stopped, the game reloaded, and River bridge loaded and returned to the farm without network service. Both driving runtime modules are precached. Driving controls measured at least 78px at the tested small viewport; farm tiles remained 78.203px, with all 60 present. The three road layouts were also captured for review.
