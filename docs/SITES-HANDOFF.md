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

## Private deployment — 2026-09-15

Version 1 deployed successfully to https://unseen-singapore.darrylkai.chatgpt.site (owner-private). The atlas is at /explore/. Deployment ID appgdep_6aa8865d5d248191a1436ac3ef1dc77c. Source snapshot: 9a59fa9de356fb14f4f41ce0e44e723f6b4a6e86. The package helper requires a supported root output directory; build:static now stages the export in root out/. Final public visibility and hosted visual acceptance remain pending; no final showcase video has been recorded.

## Public website — 2026-09-15

User explicitly authorised public website and code. Sites access is public. Version 3 (source a7024b92af93be1792ec3221ce09c9536da7696f; deployment appgdep_6aa89061ab488191afcdafe676fe1c70) succeeded. Verified logged-out browser: / opens the atlas, /portfolio/ opens the updated case study. Public atlas passed 25 regressions. Portfolio source updates are in https://github.com/Darryl-e0697797/unseen-singapore/pull/1 pending protected-main review; subsequent branch commit changes only test routes. GitHub main protections require review and validate status, prevent force-push/deletion, and retain owner administration.

## Mobile gateway public deployment — 2026-09-16

User approved the local phone preview: “Looks good. Deploy to the ChatGPT site”. Published version 5 at the existing public URL https://unseen-singapore.darrylkai.chatgpt.site. Source a8768ed1d48614fc8fc0887774317c51470a1ff7; saved version appgprj_6aa8853c69b08191932465df901e9cc8~appgver_650326e9a7688191989da474b27f2b6a; deployment appgdep_6aaa317281d081918a1d0a11e0d5a3e1 succeeded. Public access preserved. Previous version 4 remains available for rollback. Seven logged-out public-origin checks passed: WebKit iPhone profile and Chrome touch playback/captions/rotation/clipboard-denial/no-JavaScript fallback, plus desktop catalogue navigation. The user reported the phone preview looked good; no independent claim is made that every physical-device checklist item or LinkedIn in-app behaviour was verified. Sites source is updated; no GitHub protected-main changes were made in this deployment.
