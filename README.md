# BAD ANGLE — Fight Filmer Simulator

You are the cameraman. You are not good at this. Keep the scrap in frame,
try not to film the tarmac, and whatever you do — don't get excited.

A small 3D web game where you play a **cameraman filming a fight** rather
than a fighter: move with WASD, aim the phone with the mouse, zoom with
scroll / Q E, and shout. Takes are recorded and can be replayed from your
"tape".

> **Note:** `AGENTS.md` in this repo is the platform's sandbox build
> contract (how the app is generated and previewed in the isolated
> builder). This README is for humans reading the repo directly.

## Stack

- **React 19** + **TanStack Router / Start** (file-based routes, SSR)
- **@react-three/fiber** + **three** for the 3D fight scene
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **better-auth** for sign-in / per-user data
- **PGLite** (in-browser Postgres) locally, **Postgres** via `DATABASE_URL`
  on deploy; migrations in `migrations/`
- **Zustand** for the game/tape store

## Run it

```bash
npm install
npm run dev        # vite dev server on http://localhost:8080
```

No `DATABASE_URL` needed locally — the app falls back to PGLite and
applies the same `migrations/` at startup.

## Scripts

| Command                 | What it does                                    |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Vite dev server (host 0.0.0.0:8080)            |
| `npm run build`         | Vite/Nitro build, then `db:migrate` (skips w/o `DATABASE_URL`) |
| `npm run preview`       | Serve the production build locally             |
| `npm run typecheck`     | `tsc --noEmit`                                 |
| `npm run lint`          | `eslint .`                                     |
| `npm test`              | `node --test` over `scripts/**/*.test.mjs` (zero-dep unit tests) |
| `npm run format`        | `prettier --write .`                           |
| `npm run db:migrate`    | Apply `migrations/` to `DATABASE_URL` (deploy-time) |

## Tests

Unit tests are plain `node --test` (no test framework) and live in
`scripts/*.test.mjs`. They cover the platform head-injection / PWA-chrome
logic (`grok-pwa-shared.mjs`, `grok-pwa-plugin.mjs`), brand/OG-card checks,
and the PWA plugin. The test suite is designed to be hermetic — each test
pins its own working directory so it is not affected by the app's real
`src/lib/og/site.json`.

CI (`.github/workflows/ci.yml`) runs `typecheck`, `lint`, `test` and a
full `build` on every push to `main` and on every PR.

## Layout

- `src/routes/` — file-based routes (`index` is the game, `login` is auth,
  `api/` holds server functions).
- `src/game/` — the 3D scene, input, physics sim, audio, and the tape
  (recording/replay) store.
- `src/lib/` — auth, db, OG/share-card helpers, multiplayer.
- `src/components/` — UI (Radix primitives in `ui/`, game overlays in `game/`).
- `server/` — Nitro server functions (auth, `tape` API, PWA middleware).
- `migrations/` — SQL applied to Postgres at deploy / to PGLite at startup.
- `scripts/` — zero-dep test suite + build/deploy helper scripts.
- `public/`, `assets/`, `screenshots/` — static assets and reference shots.
