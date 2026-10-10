# Progress report and active time

Open grown-up settings, then **View progress report**. The report uses the child's saved name and presents seven-day activity, mastered words, known letters, word-list cards, alphabet progress, current letter focus, and active app time. Counts use the original learning rules. Big/little letter progress remains separate; mastery and known-item counts retain their independent definitions.

**Share image** opens the native file-sharing sheet when available. Otherwise the PNG downloads for attaching to a message. **Save image** downloads the same locally rendered card. **Print / PDF** uses the browser's print dialog and a print layout without the game or toolbar. **Copy summary** keeps an accessible text alternative. The image is prepared before Share is enabled to preserve the mobile browser's user gesture. Names, lists, and session labels are escaped in the report; no rendering service receives the data.

Time tracking begins with this update. Earlier play time was not recorded and cannot be recovered from lesson counts. Total active time includes grown-up screens, and each visit shows its activity breakdown, including reading jobs and driving. A visit starts when the game opens or reloads. The report shows the latest five visits and offers expandable earlier visits; up to 100 visit records are retained. Lifetime and daily totals survive history trimming. Shared images contain the latest five visits.

The timer saves every 15 seconds and on interactions, screen changes, focus/visibility changes, report/backup creation, and page exit. Background or unfocused tabs do not count. After a minute without input, time stops until another interaction. Held tractor controls remain active rather than triggering the idle limit. Time is an estimate of active app use, not proof of uninterrupted attention. Sudden browser/device termination can lose the final unsaved interval.

Time is stored separately at `robotfarm.time.v1`, leaving `robotfarm.v1` unchanged. New backups preserve it; old backups restore an empty timing history. Reset clears time with the other game data. Failed time writes retry without double-counting and do not affect learning saves. Local-midnight splitting keeps daily totals accurate. A local visit-id fallback lets the game boot on LAN HTTP where secure-context UUID APIs are unavailable.

## Verification

Eleven Node suites passed, including new report and time checks. They cover read-only report data, original known/mastered rules, future/old-date exclusion, name escaping, session history, idle/background pauses, held controls, repeated flushes, storage retries, reload totals, midnight splits, LAN UUID fallback, and time backup validation/restore. `logic.js` remains unchanged from baseline `1bf061b`.

The full browser suite passed lesson limits/rewards, saved-job resume, farm/shop, parent gate, placement, teacher practice/pass, settings, eleven phone/tablet/safe-area layouts, reduced-motion actions, and celebration layouts. Report checks passed PNG generation/decoding, accurate metrics, native-sharing payload/cancellation, Print/PDF handler, long-name escaping and 44px report controls at 320×568, 568×320, 393×852, 768×1024, and 1024×768. Geometry checks allow half a pixel for fractional browser rounding.

A real Save image action created a readable 900px-wide PNG in Downloads. The test browser's download-event observer did not receive that native download; the resulting local file was inspected directly. Sharing and print handlers were tested with local stubs, without sending a child's report or opening external dialogs. Actual Safari share sheets and PDF pagination still need physical-device acceptance.

The final robotfarm-12 offline cache includes both report and timing modules. With the port 8016 test server stopped, the root game reloaded offline, the parent gate and report opened, timing persisted, and image export became ready. Test progress uses the fictional name Alex on port 8016; real child data/screenshots remain outside the repository. Local evidence is in `outputs/robot-farm-review/progress-report/`.
