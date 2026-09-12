# Farhad Trainer V2.4.5 — Data Restored

## What was actually wrong
V2.0–V2.3 stored your real data in:

`FarhadTrainerV2DB`

with:
- `sessions`
- `drafts`
- `metrics`
- `checkins`
- `settings`

V2.4 accidentally switched to a different database:

`FarhadTrainerV21`

and also renamed the progress store from `metrics` to `measurements`.

That made the old workouts and progress appear to be gone even though Safari still had them.

## V2.4.5 fix
- Goes back to the original `FarhadTrainerV2DB`
- Reads your original `sessions` history again
- Reads your original `metrics` progress entries again
- Automatically imports anything you entered during V2.4.x from `FarhadTrainerV21`
- Also attempts to import records from the earliest `FarhadTrainerV2` prototype
- Keeps YouTube exercise-guide links
- Keeps the dedicated History page
- Keeps workout deletion and progress-entry deletion
- Keeps lb and no RPE input

No reset is needed. Do NOT clear Safari website data, because that would erase IndexedDB.
