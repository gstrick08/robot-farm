# Robot Farm — saved jobs and engaging equipment actions

Verified 10 October 2026. The updated game is open at the existing local preview. The existing local save retained its visible seed count and completed daily jobs when loading the update. Disposable test saves were used only on separate ports 8011 and 8012.

## Changes

- Leaving a job and returning on the same day resumes its exact question, choice order, faded mistakes, second-miss hint, gold bag, machine progress and pending action break. Reloading the page works too.
- Quit awards only unpaid earned gold. Completion awards the remainder, with the original golden seed and Glitch rewards. Interrupted paired writes recover the matching save and checkpoint together. Malformed checkpoints and stale backups do not overwrite valid learning progress.
- Daily jobs continue rotating. Any unpaid earned gold is banked when an old checkpoint expires. Changing the active word list or daily slot count clears incompatible question checkpoints, with earned gold retained. Reading records remain in the original robotfarm.v1 schema; checkpoints are separate.
- Every three correct or helped answers opens a large machine button: tractor boost, cargo lift or popcorn power. Star bursts and a brief machine bounce happen after answering. There are no extra learning rewards, countdowns, penalties or motion while a question is open. Reduced motion skips the particles and bounce.
- Completed job cards and the completion screen offer an optional original mini reader. Pages use familiar words from the child's current/review lists. The child tries first and can tap sound help. No Hooked on Phonics book text or Astro characters were copied.
- Progress backups include paused jobs; old v1 backups still load. The offline cache now includes checkpoint support (robotfarm-5).

## Verification

All seven Node check suites passed: frozen learning rules, presentation/offline assets, backup/restore/report, equipment, speech selection, driving and job checkpoints. logic.js is byte-identical to the original baseline. Interrupted-write recovery, malformed checkpoints, duplicate payouts and banking expired-job gold have explicit checks.

The final browser suite passed on a fresh localhost origin: all five mission modes; two misses followed by silver; ten-gold completion; fifteen-question cap; exact rewards; quit and same-question resume; pending machine-action resume; mini-reader navigation; farm harvest/planting/shop; parent math gate; placement and async session races; custom lists; teacher practice/pass and medals; full Mission Control. No browser warnings or errors were reported during the final suite.

The layout matrix passed 320×568, 568×320, 375×667, 667×375, 393×852, 844×390, 768×1024, 1024×768 and 1180×820, plus two simulated iPhone safe-area configurations. Reading, action and reader controls retained at least 72px target sizes and fit their tested viewport. Reduced-motion actions passed.

With the 8012 test server completely stopped, the cached phone-sized game reopened, resumed a three-seed pending machine action and returned to reading. A second offline reload preserved the same six choices, their order and all three filled bag slots.

## Still pending

**Human narration is not implemented yet.** The current standard device voice may still sound robotic. The original brief explicitly requires approval before generating or committing voice files or using an online/paid service. The voice-pack proposal contains an eight-line audition and two routes: an AI narrator with voice selection and a cost quote before generation, or parent recordings through a free local recording page. No narration has been generated or purchased.

Physical iPhone/iPad Safari listening, performance, Home Screen installation and native share sheets remain unverified. These are viewport/functional checks, not physical-device acceptance. Progress is local to the browser/device and origin; changing the website address or clearing browser storage does not transfer it. Use backups to transfer progress. Daily schedules still rotate; this update does not turn daily jobs into permanent levels.

The inherited parent-gated Mission Control can be repeated for its original three-coin reward; this update preserves that rule. The draft PR remains unmerged and main has not been changed or deployed.

Reference: Hooked on Phonics' published learn → practice → read → celebrate sequence, https://www.hookedonphonics.com/. This mini reader is additional practice for the existing school-word game, not a full phonics curriculum.

Evidence: saved-job-end-to-end-test-log.txt, saved-job-node-test-log.txt, saved-job-offline-test-log.txt, iphone-tractor-action.png, iphone-mini-reader.png, iphone-paused-job.png and iphone-offline-resumed-job.png.
