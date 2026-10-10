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

## Earlier inherited behavior

Repeated Mission Control sessions retain the original coin rewards; the parent pronunciation preview retains list order; adding more than six lists remains possible; backup validation originally retained minimal checks; the phone/tablet follow-up below now rejects malformed restores. Changing these would affect existing behavior and was excluded from visual polish.

The voice-pack proposal remains in the local design audit: family recordings, a chosen neural TTS service after terms/account approval, or system-voice recordings only after verifying public distribution rights. No voice files, isolated phonemes, paid service, library or new learning rule were added.

## Tractor trails follow-up

The approved equipment direction is implemented as three immediately available roads: Barn loop, Orchard bends and River bridge. Each has three deterministic cargo deliveries. Driving uses an independent in-memory session; it has no learning rewards, timers, penalties or new v1 fields. Steering buttons also move forward, so one finger is sufficient. Releasing controls, leaving the screen, blurring or backgrounding clears input; background return bounds elapsed time.

`node tools/check-driving.mjs` covers motion, reverse steering, one-finger controls, trailer orientation, stop behavior, bounded elapsed time, cargo stops, nonduplicated loads and three-delivery completion. Driving modules are included in the offline cache and driving music stays off. Real iPad multi-touch feel and measured frame rate remain device acceptance checks.

Browser route harness completed all three roads (3/3 each) through held pointer controls, including automatic loading/unloading and finish screens. The before/after learning-save strings were identical.

The final worker was installed on isolated port 8005, the server was stopped, the game reloaded, and River bridge loaded and returned to the farm without network service. Both driving runtime modules are precached. Driving controls measured at least 78px at the tested small viewport; farm tiles remained 78.203px, with all 60 present. The three road layouts were also captured for review.

## Equipment learning follow-up

Approved design: guided original equipment jobs now wrap the existing daily reading missions. The main hub presents tractor assembly, field work, corn hauling and popcorn processing. Jobs rotate across the configured 2–5 daily slots; there are no additional learning missions or job currencies. The farm, roads, parent gate, Mission Control and school tools remain accessible. `logic.js` is byte-identical to the original baseline. The v1 learning schema and localStorage key are unchanged.

All five Node checks passed, including the new `check-equipment.mjs` job rotation, presentation progress and mission boundary checks. Offline asset installation now uses `robotfarm-3` and includes `equipment.js`.

`tools/equipment-audit.html` runs the current index source inside a generated localhost iframe with isolated test hooks. On fresh port 8008, all five mission types passed deliberate first and second misses, fading and disabled wrong choices, second-miss hints, silver without gold-bag fill, equipment actions, ten-gold completion, exact seed rewards and the unchanged Glitch bonus. A full 15-silver mission ended at the cap with no gold rewards. Quitting retained earned seeds and prevented stale questions. Road navigation preserved the learning save. A played v1 fixture loaded with the original schema, 13 seeds and one golden seed.

All five answer layouts fit inside 1024×768 with touch targets at least 72px. The five-job hub buttons measured 236×82px; navigation buttons measured 72×72px and remained within the viewport. The equipment screens were also captured at 1180×820. CSS disables equipment transform/opacity transitions under reduced motion; actual device accessibility-setting behavior remains part of iPad acceptance.

A direct non-fast session at port 8006 preserved its existing progress on reload. Spoken instructions preceded the choices, and prompt replay disabled all five choices until speech finished. The production game on the isolated port produced no console errors. Early development harness syntax/selector errors were corrected before the passing run; no errors occurred on the passing port 8008 run or its direct game tab.

The final worker was installed on port 8008, the server was stopped, and the direct game reloaded. The job hub and popcorn reading mission, including its machinery SVG and choices, worked without network service. No console errors occurred in that offline game.

Native iPad speech quality, measured 60fps, home-screen worker update and multi-touch driving still require real-device acceptance. Parent reading/assessment functions were unchanged in this follow-up; their earlier checks and the backup/restore/report Node checks remain the evidence for those flows.

## End-to-end, speech and phone/tablet follow-up

All six Node checks pass, including actual speech orchestration with browser stubs (saved and unsaved preview rate, late-loaded quality voices, explicit parent selection, pitch, stuck-speech recovery). Inline-module syntax and diff whitespace checks pass. `logic.js` remains byte-identical to the baseline; the learning save key/schema and existing progress are preserved. Offline version is now `robotfarm-4`.

On isolated localhost port 8009, the generated equipment harness passed fresh start/color selection; harvesting and normal/golden planting; shop price, second-tap purchase and saved placement; incorrect/correct parent gate answers; modeled re-ask and forced slow rating; quit/restart during modeled speech; teacher shuffled practice and READY TO TEST; teacher pass and 1/6 medal; custom lists and pronunciation; saved settings; all 52 placement letters; new-item teaching before choices; and full Mission Control with its original three coins. The five mission integration tests also passed misses/hints, silver/no gold-bag fill, equipment action, ten-gold completion, 15-silver cap, exact rewards, quit and v1 fixture preservation.

The responsive matrix passes 320×568, 568×320, 375×667, 667×375, 393×852, 844×390, 768×1024, 1024×768 and 1180×820. Added simulated safe-area cases pass at 393×852 (top 47/bottom 34) and 844×390 (left/right 47/bottom 21). These are CSS simulations, not device emulation. Five reading layouts, job start/navigation without overlap, road cards, driving navigation and controls fit; required touch targets are at least 72px. Phone/tablet screenshots are saved alongside earlier screenshots.

The actual driving harness completed all three roads with held pointer controls: Barn loop 3/3, Orchard bends 3/3 and River bridge 3/3. Learning save remained exactly unchanged. All eleven AAC files decoded. A direct non-fast game replay disabled every answer while speech ran. Its existing nine seeds and zero coins remained intact.

With the v4 worker installed, the isolated server was stopped. A direct game reloaded at phone size, displayed a reading mission and loaded River bridge offline. No console errors appeared in the final browser runs. Development failures were fixed before the passing runs.

Fixed issues: a phone farm toolbar covering the field; forced portrait rotation screen; clipped choices on short landscape phones; shrinking Back/Replay and driving navigation targets; job/nav overlap on small phones; road menu spacing around notches; unsaved speed ignored in voice previews; stale Mission Control callbacks affecting a new session; incomplete backup files replacing progress; and stale daily hub after return from background. Backup export/restore/report use actual functions in Node; native iOS sharing/file-picker UI was not exercised.

Automatic speech now ranks local quality voices by name and voice URI, deprioritizes novelty voices including Fred, refreshes after late voice availability, and uses neutral pitch with calmer punctuation. New installations default to 0.95 speed. Existing saved rates/voices are preserved. This Mac exposes standard Samantha as its best available voice; no Premium/Enhanced voice was exposed, so subjective improvement on Apple hardware cannot be certified here. The parent panel provides current voice download guidance.

Remaining inherited behavior: repeated parent-gated Mission Control completions each award three coins; adding more than six word lists is still possible. These are outside this presentation/device change, and are reported rather than silently changing reward/curriculum rules.

Physical iPhone/iPad Safari acceptance remains: first-tap audio, voice warmth/pronunciation, actual notch/browser-bar behavior, multi-touch/drag feel, frame rate, background interruptions, native sharing/restore and Add to Home Screen/offline worker update. The desktop viewport and CSS safe-area checks do not certify those device behaviors. No main-branch push, merge or production deployment occurred.

### Final resumed checks — 10 October 2026

After the interruption, the phone farm toolbar was found to retain its earlier column direction, covering the field. It now forms a horizontally scrolling row at the bottom, with enough separation in short landscape screens. The layout harness now explicitly visits the farm at every size, verifies that the toolbar leaves the field visible, checks all 60 tiles and their 72px minimum size, and repeats the previous reading/road/safe-area checks. All eleven cases pass on fresh port 8010. The current preview retains its existing nine seeds and zero coins across the next-day reload. Its job rotation reflects the new day. The local preview server was restarted after the interrupted session.

The resumed complete-flow and five-mission browser suites also pass, with no console errors. The final v4 cache was installed on port 8010; after stopping the server, the phone-size game reloaded with the corrected farm toolbar (row, 88px inner height), displayed reading choices and opened River bridge. This verifies the final CSS is present offline.
