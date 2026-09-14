# Verification ledger

## Environment
2026-09-14, local M4 Pro Mac mini, 48 GB memory, Chrome installed. Tests on this workstation do not establish performance on ordinary laptops or real phones. Responsive browser emulation is distinct from mobile hardware testing.

## Foundation gates
- Runtime schemas: strict command fields, batch length, temporal intervals, source and asset identity.
- Pure reducer: atomic rejection, reset, layer/trace coherence.
- Authored guide: four different levels, supported intent routing, unavailable/precision requests.
- Source references: bidirectional asset references and story references checked.
- Geometry: GLB header, size, hash, triangles, metre scale, vertical orientation and east/north/up axis fixture.
- Browser proof: actual mesh raycast selection and console check before first vertical slice.

## Release gates still required beyond local slice
Independent engineering/content review; permission review for source linking and any agency media; real-device laptop/mobile performance and GPU memory; Safari/WebKit verification; full keyboard/screen-reader audit; model-provider adversarial tests if a provider is introduced; licensed geographic dataset review before georeferenced geometry.

Measured results will be appended below. Do not infer passing status from a listed test.

## Pipeline proof — passed
Chrome at 1280×720: generated model loaded, actual mesh selected via raycast, no console/page errors. Visually inspected docs/pipeline-proof.png. GLB high=97,068 bytes / 3,348 triangles, low=45,952 bytes / 1,268 triangles. All three coordinate fixture directions passed. Eight unit tests, lint and typecheck passed.

## First chapter — local checks passed
- 9 deterministic tests: command allowlist/atomic rejection, reference safety, coherent reset and tracing, temporal/coordinate constraints, narrative levels, unsupported questions, and source/redistribution gates.
- 5 Chrome browser tests: pipeline raycast proof; reveal, actual camera movement and marker progression; sources and question levels; mobile 390×844 with reduced motion and reading fallback; failed GLB with usable content; keyboard reveal/reset.
- Desktop screenshots at 1440×1040 and mobile full-page screenshot inspected. No horizontal overflow in mobile emulation.
- Lint, TypeScript, asset/source validation and optimized Next.js production build passed.
- Production measurements are recorded in performance-local.json. GPU memory, real ordinary hardware and Safari remain release gates.

Artifacts: desktop-surface.png, desktop-reveal.png, mobile-reveal.png, pipeline-proof.png. Browser error-output artifacts are ignored; source screenshots are versioned as milestone evidence. `npm run test:e2e` runs against a local development server by default; performance uses a separate production server.

Production console follow-up: no page errors or console errors during reveal. One upstream advisory remains: React Three Fiber's clock triggers Three.js's `Clock` → `Timer` deprecation warning. It does not prevent rendering; migrate through an upstream-compatible Fiber/Three release rather than replacing the renderer clock ad hoc. The removed shadow-map warning was fixed by explicitly selecting supported PCF shadows.
