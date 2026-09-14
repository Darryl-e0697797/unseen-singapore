# ChatGPT Sites handoff

The user selected Sites and intends to host the app there. This document does not authorise deployment or claim a live URL.

## Reproducible static package

Run `npm ci` and `npm run build:static` from the repository root. Export output is `apps/web/.next-static`; the separate `.next-static` build directory preserves the normal local production build. The export includes `/`, `/explore/`, `/pipeline/`, GLBs and MapLibre module-worker dependencies. It requires no runtime secrets.

For local verification: `python3 -m http.server 3002 --bind 127.0.0.1 --directory apps/web/.next-static`. Run browser regressions with `UNSEEN_PREVIEW_URL=http://127.0.0.1:3002 npx playwright test --config scripts/qa/reclamation-production.config.ts`.

At authorised Sites setup, use the owning project's real project ID and static directory configuration. Package the exact validated export using the installed Sites packaging helper. Do not invent a project ID or assume a successful local build establishes target-origin compatibility.

## Target-origin checks

- `/explore/` and `/pipeline/` direct navigation and refresh work.
- `.mjs` has a JavaScript MIME type; worker/shared modules resolve from `/vendor/maplibre/`.
- All nine GLBs load lazily and have valid types; no routing fallback returns HTML for missing assets.
- HTTPS map requests and external source links work; provider attribution remains visible.
- Static host applies appropriate security/cache headers. Next.js `headers()` is intentionally excluded from export because it requires a server; configure equivalents at the host where supported.
- Verify mobile/desktop navigation and the captioned capture against the actual final URL.

Do not deploy while the release status lists unresolved publication blockers. Keep the previous accepted source/artifact revision for rollback. Vercel is not part of this hosting plan.
