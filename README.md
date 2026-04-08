# Present Pursuit

A mobile-first scavenger hunt app built with Next.js for simple Vercel deployment.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

For local network testing:

```bash
pnpm dev:lan
```

For local HTTPS testing:

```bash
pnpm dev:https
```

## Current Hunt Flow

- Hunt content lives in [src/content/hunt.json](/Users/aaron/Development/present-hunt/src/content/hunt.json)
- Starting the hunt hits `/start`, which creates a signed progress cookie
- Each physical QR code points to `/scan/[stepId]`
- Scanning a valid QR updates progress, shows a celebration screen with confetti, and then lets the player continue
- The app tracks completed steps and unlocks the final `/done` page only after the full trail is complete

Progress is stored in a signed cookie via [src/lib/progress.ts](/Users/aaron/Development/present-hunt/src/lib/progress.ts). Set `HUNT_COOKIE_SECRET` in Vercel so production cookies are signed with your own secret.

## Customising The Hunt

Edit [src/content/hunt.json](/Users/aaron/Development/present-hunt/src/content/hunt.json):

- app title and intro copy
- finish copy
- theme colors
- ordered steps
- clue type, body, captions, and media references

Add local clue images or illustrations to `public/` and reference them with paths like `/media/my-clue.jpg`.
The current mascot images live in `public/media/unicorns/`.

## Main Routes

- `/` intro page
- `/how-to` lightweight instructions
- `/start` resets and starts the tracked hunt
- `/hunt` redirects to the current clue based on cookie progress
- `/hunt/[stepId]` clue pages
- `/scan/[stepId]` QR scan endpoint
- `/celebrate/[stepId]` post-scan success screen
- `/done` final reveal page
- `/dev/qrs` printable QR sheet

## Notes

- The in-page scanner works best on HTTPS, which is why Vercel previews are useful for real mobile testing.
- The app currently uses a lightweight CSS approach and native dialog behavior instead of a UI framework.
- If cookies are cleared, the hunt progress resets.
