# OnlyCamps

OnlyCamps is a discovery and planning MVP for elementary summer camps around
Natick, Framingham, Wayland, and Sudbury, Massachusetts.

The first version focuses on the ahead-of-season problem: parents need to know
which camps exist, when registration may open, what weeks and day lengths they
cover, what activities they offer, and where to verify details on the official
camp site.

## What Is Built

- Source-backed camp discovery with official provider links.
- Filters for town, rising grade, weeks, activity, day length, cost, and drive.
- AI-style query input that translates parent questions into filter changes.
- Save-to-plan workflow that shows which summer weeks are covered or still open.
- Registration watch list for September and January planning windows.
- Sponsored local-offer slots for future cross-sell and advertising tests.

## Data Note

The current catalog is demo seed data with official source links attached. Dates,
prices, eligibility, licensing, and availability should be verified on each
provider site before families book.

## Run Locally

Use Node.js `>=22.13.0`. The repo is pinned to pnpm via `packageManager`.

```bash
corepack enable
pnpm install
pnpm run dev
```

Open `http://localhost:3000/`.

## Verify

```bash
pnpm run lint
pnpm run build
```

GitHub Actions runs the same lint and build checks on pushes to `main` and on
pull requests.

## Useful Files

- `app/page.tsx`: main OnlyCamps experience and seed catalog.
- `app/layout.tsx`: app metadata.
- `app/globals.css`: global styling and Tailwind import.
- `public/screenshot.jpeg`: canonical app preview image.
- `.github/workflows/ci.yml`: GitHub Actions verification workflow.
- `.openai/hosting.json`: Sites hosting configuration.
