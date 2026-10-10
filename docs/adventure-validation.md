# Adventure design integration — 10 October 2026

The approved design is integrated into the real game: original projected farm island, shaded toy machinery, articulated tractor trailer, three road layouts, raised controls, brighter materials and compact celebrations. Reading scenes retain the existing equipment-progress animation and the original answer layouts and teaching fonts. Contextual praise uses the ten approved lines; “Eagle eyes” is removed. This update installs no recorded narration and spends no credits.

## Verification

- Eight Node suites passed: frozen learning rules, presentation/offline cache, backup/restore/report, driving, equipment, speech, saved-job recovery, and new artwork/contextual praise checks. `logic.js` is byte-identical to baseline `1bf061b`.
- Full browser suite passed all five mission types, two misses/hints, silver answers, ten-gold and fifteen-question limits, rewards, quitting, exact saved-job resume/reload, pending actions, original mini-reader, parent gate, placement, shop, teacher practice/pass and custom lists.
- Phone/tablet matrix passed 320×568, 568×320, 375×667, 667×375, 393×852, 844×390, 768×1024, 1024×768 and 1180×820 plus two simulated safe-area configurations. Kid controls retained 72px minimum target sizes. Reduced-motion actions passed.
- Standard and bonus celebrations passed an additional six-size portrait/landscape matrix. Fixed short-screen reward overflow and small gaps between hub start/navigation controls and the idle robot overlapping navigation on the smallest phone found during testing.
- Actual held-pointer driving completed all three roads, three deliveries each. Learning save remained unchanged. Independent trailer angle/position, reverse steering, input release and elapsed-time bounds have Node checks.
- Cache `robotfarm-6` includes `adventure.css` and `adventure-world.js`. With the isolated test server stopped, the game reloaded its island artwork, resumed the pending three-answer action, returned to reading and preserved the same six choices/order and three bag slots through another offline reload. The new river bridge rendered offline too.
- No browser console warnings/errors were observed in the reading, driving and offline checks.
- The existing user game retained its visible 34 seeds, zero coins and the same two completed jobs after loading the update. Disposable test fixtures stayed on port 8014.

The driving harness now instruments only its generated test module instead of reading old SVG transforms. It disables service-worker registration in its generated iframe; about:srcdoc has an empty hostname and had unintentionally installed a test cache. That cache was cleared before final celebration/offline checks. No test hooks ship in the game.

## Remaining acceptance

Browser-size tests are not physical-device Safari tests. Real iPhone/iPad touch response, frame rate, installed Home Screen behavior, native voice playback and share sheets still need device acceptance. The renderer caps pixel density at 2× and skips stationary drive redraws, but actual mobile performance has not been measured. No deployment or merge was performed.

The Helena audition was previously approved. The full revised narration pack, refreshed quote and credit purchase are still pending; the game continues to use browser/device speech synthesis.

Evidence is in `docs/screenshots/adventure/` and the local `outputs/robot-farm-review/adventure-upgrade/` report folder.
