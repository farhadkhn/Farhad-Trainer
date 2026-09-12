# Farhad Trainer V2.4.1 — Loading Fix

This patch fixes the V2.4 dashboard getting stuck on “Loading…”.

## Root cause addressed
Older saved workout entries can have slightly different field shapes from newer versions. V2.4 assumed every historical record used the newest schema, so one legacy record could abort the Home rendering process.

## Fixes
- Defensive migration/compatibility handling for legacy workout records
- Dashboard reads Weight / Sessions / PRs / Adherence independently
- A malformed old record can no longer leave every card stuck on Loading…
- Next-workout detection understands both `workoutId` and older `workout` fields
- Unknown legacy exercises no longer crash PR calculations
- Progress history remains tappable and deletable
- Workout history remains persistent and deletable
- Fixed missing body-measurement numeric helper
- Uses the SAME IndexedDB database as V2.1–V2.4 so existing history is preserved

After uploading to GitHub Pages, open the site and refresh once. If Safari still shows V2.4, use the browser reload again or Settings → Refresh app files from the prior version before replacing it.
