# Grown-up settings

Hold the gear for three seconds and answer the grown-up question. The section menu jumps to Child, Words, Letters, Play & sound, or Backup.

- **Child:** change the name used in greetings and job welcomes. Preview uses the edited name; save to keep it. Blank uses “friend.” Names are limited to 30 characters and are escaped in the form.
- **Words:** edit existing lists or add another list. Commas and new lines work; `read=reed` supplies a pronunciation override. Save each list and mark the desired list current. Earlier lists remain in review.
- **Letters:** select one or more letters and big, little, or both cases. Save before using focused practice. Letter jobs and Mission Control use those targets; distractors may include other letters, matching jobs model the opposite case, and the mixed bonus job still reviews all known items. Full 52-letter placement and alphabet progress remain available.
- **Play & sound:** calmer visuals, sound effects, installed English voice with previews, talking speed, farm music and volume, two to five daily missions, and robot color. Spoken learning prompts stay enabled. Calmer visuals suppress decorative animation and particles; tractor driving still moves in response to controls. Device reduced-motion preferences remain respected.
- **Backup:** custom letter/visual/effect preferences travel with the learning backup. Old backups remain supported and restore the default letter focus. Reset clears learning, job checkpoints, audio and parent preferences after the existing two confirmations.

Name, voice, color, rate, and daily limit retain their original v1 fields. New preferences use `robotfarm.preferences.v1`; the original `robotfarm.v1` learning schema is unchanged. Focus changes retire only unfinished letter/matching checkpoints, bank unpaid earned seeds once, and keep paused word jobs. Changes to name, calmer visuals, or effects keep job checkpoints. Existing daily-limit/list changes retain their original checkpoint rotation behavior.

No names or word lists are sent to an online service. This update does not generate or install the pending recorded narration pack.
