# Helena narration — integration status (10 October 2026)

The approved audition is now connected to game narration, together with the completed trailer/farm batch. Twenty complete recordings (about 634 KB of AAC audio) play locally. Grown-up settings offer **Hear Helena**, recorded narration with device fallback, and an explicit automatic device-voice option. Saved device-voice selections remain respected.

The finalized seven-batch script was quoted at **20 credits**. Batches 4 and 5 completed (5.8 quoted credits); batches 1 and 6 were rejected for provider rate limiting, and batches 2 and 3 for insufficient credits. Batch 7 was not submitted after that failure. The account reported 2.2 credits remaining. The five remaining batches cost 14.2 credits at the current quotes, so another 12 credits are needed. No failed batch was blindly resubmitted; no subscription or credit purchase was made.

Batch 4 supplies twelve complete trailer/farm lines. The eight previously approved audition lines are reused. Batch 5's compound/fragments recording is saved locally outside the repository and awaits reliable splitting/review before installation. The full voice pack is incomplete: most words, letter names and job instructions still use device speech. No child's name, custom list or progress was sent to the generation provider.

Playback goes through the game's existing awaited `say()` flow. Matching uses complete words and preserves unknown text for device speech, including pronunciation overrides. Recording failure and autoplay rejection fall back to device narration. New prompts, leaving a screen, backgrounding and page exit cancel narration and settle waiting promises. Pitch is preserved when the talking-speed setting changes. Both speech paths have recovery timers, and music remains quiet during narration. Recorded files are included in the offline cache.

Audio provenance: Helena preset `3c2b83c0-2e0a-5ae8-998a-a5fe71b7eccd`, Seed Audio, speech rate -5. Audition job `2c88bf1c-1e77-4df5-b104-e9b50cb0c7da`; trailer/farm job `7543ec05-588a-4095-8a18-a9926f60a26f`. Clip boundaries and source filenames are recorded in `narration-clips.js`. These are AI-generated recordings. Provider output-use permission is described in [Higgsfield Terms, section 4.4](https://higgsfield.ai/terms-of-use-agreement); this is not a guarantee of exclusive copyright.

The approved ten praise lines remain unchanged and “Eagle eyes” stays removed. Future lists cannot be recorded until their actual words are known. No isolated phonemes or exported Apple system-voice recordings are included.

The local review page is `tools/narration-audit.html`: each installed line can be heard beside its script. Final listening/pronunciation approval and physical iPhone/iPad Safari playback remain pending.

## Verification

Twelve Node suites passed, including recorded routing, complete-word boundaries, unknown/custom text fallback, pitch preservation, autoplay/missing-file recovery, new-prompt cancellation, awaited answer flow and screen-exit recovery. The full browser suite passed game flows, saved jobs, learning rewards, parent settings, reports, phone/tablet layouts and reduced motion. Real browser playback, interruption/replay and all twenty AAC files' decodes/durations passed. With the test server stopped, the final robotfarm-13 game reloaded, opened the parent gate and played both clips of its Helena preview offline; the same audio checks passed offline. Physical Safari playback and listening approval remain pending.
