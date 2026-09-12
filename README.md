# Farhad Trainer V2.4.2 — Button Fix

This patch fixes the V2.4.1 initialization bug that caused all buttons to stop working.

The issue was a mismatch between the HTML and JavaScript: the JavaScript expected controls that were not present in the deployed page. Initialization stopped before button event handlers were attached.

V2.4.2:
- Binds only to controls that actually exist.
- Keeps the same `FarhadTrainerV21` IndexedDB database, preserving existing data.
- Keeps dashboard stats from getting stuck on Loading.
- Workout History remains tappable and deletable.
- Progress History remains tappable and deletable.
- Measurement help buttons work.
- RPE remains removed.
- Weight remains in lb.

After upload to GitHub Pages, refresh Safari. The header should show `V2.4.2 · Button Fix`.
