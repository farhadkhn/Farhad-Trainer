# Farhad Trainer V2.0.0 — Rebuilt

This is a fresh rebuild, not a visual patch of V1.

## Major changes
- New premium mobile-first dashboard and navigation
- IndexedDB storage for drafts, completed workouts, metrics, progress photos, and check-ins
- Drafts restore when you leave and return to a workout
- Completed workout history shows exact set-by-set weight, reps, and RPE
- Expandable exercise cards
- Previous / Suggested / Coach progression view
- Apply suggested weight button
- Per-exercise rest timer
- Learn tab with muscle map, step-by-step form, common mistakes, substitutions, and YouTube demo search
- Weekly muscle coverage map
- Body-weight and training-volume charts
- Progress photo timeline: front / side / back
- Weekly check-ins with automatic coaching guidance
- Tuesday / Thursday / Saturday 12-week calendar export
- Offline PWA / Add to Home Screen
- Visible `V2.0.0 · Rebuilt` label
- Network-first service worker plus a Refresh App Files button to prevent old V1 cache from sticking

## Upload to GitHub
Replace the old repository-root files with these files:

- index.html
- styles.css
- app.js
- manifest.webmanifest
- sw.js
- icon-192.png
- icon-512.png
- README.md

GitHub Pages should redeploy automatically from `main` / root.

## Important after deployment
Open the live site. You should see **V2.0.0 · Rebuilt** at the top.

If you still see the old app, open **Settings → Refresh app files**. This unregisters the old service worker, clears old caches, and reloads the site.

V2 uses a new IndexedDB database name, so old V1 data does not automatically migrate.
