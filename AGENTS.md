# AGENTS.md

## Project Overview

Present Pursuit is a mobile-first scavenger hunt built with Next.js and deployed on Vercel.

The current app is intentionally lightweight:
- Hunt content is stored locally in `src/content/hunt.json`
- Progress is tracked in a signed cookie via `src/lib/progress.ts`
- QR codes point to `/scan/[stepId]`
- The player can scan either with the in-page camera scanner or the phone camera app

This is a playful consumer-facing app, so UX polish matters as much as correctness.

## Stack

- Next.js App Router
- React
- TypeScript
- Biome for formatting and linting
- Plain CSS in `src/app/globals.css`
- `react-qr-code` for printable QR generation

## Important Commands

```bash
pnpm dev
pnpm dev:lan
pnpm dev:https
pnpm lint
pnpm format
pnpm build
```

Use Biome, not ESLint.

## Core Routes

- `/` intro page
- `/how-to` instructions page
- `/start` resets and starts the hunt
- `/hunt` redirects to the current step from cookie progress
- `/hunt/[stepId]` clue page
- `/scan/[stepId]` QR completion endpoint
- `/celebrate/[stepId]` post-scan celebration page for non-inline flows
- `/done` final completion page
- `/dev/qrs` printable QR sheet

## Content Model

Edit `src/content/hunt.json` for:
- app title and subtitle
- intro copy
- finish copy
- theme colors
- ordered hunt steps

Each step currently supports:
- `id`
- `order`
- `title`
- `type`
- `body`
- `mediaUrl` for image steps
- `embedUrl` for video steps
- optional `caption`

The schema still contains hint fields, but hint UI is currently removed from the player experience. Do not reintroduce hint UI unless asked.

## Progress And Scanning

- Progress is stored in a signed cookie named `present-pursuit-progress`
- Production should set `HUNT_COOKIE_SECRET`
- `src/lib/progress.ts` is the source of truth for progress shape and validation
- `src/app/scan/[stepId]/route.ts` handles QR completion
- The in-page scanner in `src/components/inline-qr-scanner.tsx` can call the scan route in inline mode and show a success dialog without leaving the clue page

When changing the scan flow:
- keep external camera-app scans working
- keep inline scanner behavior working
- avoid hydration mismatches in client components
- remember that camera APIs need a secure context on mobile

## UI And Design Expectations

This app should feel magical, light, and mobile-friendly rather than utilitarian.

Current direction:
- blue-violet palette
- sparkles / unicorn energy
- concise copy
- large tap targets
- minimal friction on clue pages

Be careful with mobile layouts:
- avoid tall expanding sections on clue pages
- prefer dialogs for scanner and similar overlays
- mobile primary actions should be centered and full width when appropriate
- desktop can stay more compact

Avoid adding a heavy UI framework unless there is a clear reason. Native dialogs plus the existing CSS are the current baseline.

## Files Worth Knowing

- `src/content/hunt.json`: editable hunt content
- `src/lib/hunt.ts`: config parsing and step helpers
- `src/lib/progress.ts`: signed cookie progress
- `src/components/hunt-step-card.tsx`: main clue card UI
- `src/components/inline-qr-scanner.tsx`: camera scanner and inline success dialog
- `src/components/progress-tracker.tsx`: completed-step dots
- `src/app/globals.css`: shared visual system and component styling
- `README.md`: keep this updated when behavior or setup changes

## Working Agreement For Future Changes

- Keep the README in sync with user-facing behavior and setup
- Prefer small, focused commits for major changes
- Run `pnpm lint` and `pnpm build` after meaningful changes
- Do not switch the project away from Biome
- Preserve the current route structure unless there is a strong reason to change it
- Favor centralized hunt content over hardcoded clue copy in components
- If adding more polish, prioritize the mobile clue flow first
