# Farhad Trainer V2.1 — Flexible Recomp

This update implements the changes requested in the voice conversation.

## Changes
- **Strict completed-set validation.** Weighted sets require: checked + weight > 0 + reps > 0. Planks require: checked + seconds > 0. Farmer carries require: checked + weight > 0 + seconds > 0. Invalid checked sets are excluded from history, volume, PRs, and progression.
- **Flexible Workout A → B → C sequence.** The program is no longer tied to Tuesday / Thursday / Saturday. Complete the next workout whenever your schedule allows.
- **Recurring body measurements.** Choose every 2 weeks or every 4 weeks. The Home screen shows when the next check-in is due.
- **Automatic measurement comparison.** Weight, waist, chest, arm, and thigh are compared with the previous check-in.
- **Progress-photo comparison.** Latest and previous front / side / back photos can be viewed side-by-side when both are available.
- **Weight and waist trend charts.**
- Existing V2 features remain: IndexedDB drafts/history, progression suggestions, rest timer, muscle maps, form cues, common mistakes, YouTube demo search, weekly check-ins, offline PWA.

## Deploy
Upload the 8 files in this package to the root of your existing GitHub repository and replace the existing files. After GitHub Pages updates, open **Settings → Refresh app files** once. The header should read **V2.1 · Flexible Recomp**.
