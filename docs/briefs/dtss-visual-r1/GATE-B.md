# DTSS visual r1 — local candidate for visual acceptance

2026-09-24. Gate A approved by the user’s “Approve” after presentation of dtss-visual-r1. Gate B pending. No deployment or public posting.

## Review the candidate

Open http://127.0.0.1:3001/explore → Explore 9 projects → Deep Tunnel Sewerage System.

1. Compare the whole section: warmer structural concrete, cooler steel, distinct protective layers, softer shadow filtering and a quiet plinth/background without the grid.
2. Press **Reveal underground**. The surface-biased camera descends to the cutaway over 2.4 seconds. **Skip reveal** ends it immediately; reduced-motion preference jumps to the endpoint. This is a presentation transition, not a surveyed city-to-tunnel alignment or construction programme.
3. Use **What am I looking at?** to inspect the six components. Existing component geometry, labels, facts, construction stages and map corridors remain.
4. Select **Low detail**: DPR 1, shadows off. Narrow screens start in this mode when entering DTSS. Full geometry remains available; it is a rendering-quality switch, not a different surveyed model.
5. At **Flow & monitoring**, flow animation is opt-in with Animate/Pause controls. It remains direction-only, respects reduced motion and stops requesting frames while the page is hidden.
6. Test Reset, construction stages, exploded view and Back to Singapore. The review browser is left on the overview.

## Implementation

Existing GLB is unchanged: 1,621,180 bytes, 22 mesh groups; SHA-256 320ba7faf829dfc9258c8d30dffcba6652e09146bca1a79c2b693a182cb163b8. No downloaded textures, extra texture memory, generated engineering components, new dependency or decoder. DTSS owns its material clones, leaving cached materials untouched and disposing its owned materials on teardown. This revision applies a reproducible runtime presentation to the Blender-authored asset; it does not claim that Blender runs on the website.

New upgrade records preserve historical acceptance and hash-lock the approved brief. Missing approvals, stale hashes/revisions, concurrent work and acceptance without Gate B evidence are rejected in deterministic tests.

## Evidence

- Matched screenshots for all six stops: `docs/qa/dtss-visual/before/stop-0.png` through stop-5 and corresponding after files.
- Phone and low rendering: `docs/qa/dtss-visual/after/mobile.png`, `low.png`.
- Local metrics: before/metrics.json and after/metrics.json.
- Cold-network sample: after/performance.json.
- Tests: 39 deterministic tests pass; lint/type checks and production build pass; content/geography/assets/workflow validation passes. 26 existing exhibit regressions pass. Three new DTSS visual/reveal/phone checks pass (phone assertion corrected to verify mobile map return rather than a desktop-only heading).
- Actual browser reveal sampled visually and normal/reduced-motion/skip transitions exercised in automated browser checks. Screenshots are not treated as a complete human motion review.

## Performance and release limits

Same local Chrome viewport (1440×1000), unthrottled production comparison: baseline entry 880 ms; see after/metrics.json for candidate entry. Single samples are observations, not a statistically established speedup. Whole-scene high rendering changed from 47 to 46 draw calls by removing the grid, with 64,594 rendered triangles including shadow passes. Low: 24 calls /33,018 triangles. No topology increase.

One cold CDP sample (1.6 Mbps down, 750 Kbps up, 150 ms latency, local Mac CPU/GPU): useful text 4,766 ms **fails ≤2,500 ms**; model ready after selection 3,790 ms **passes ≤5,000 ms**; requested JS recompressed gzip 1,038,505 bytes **fails ≤650 KiB**. These include existing app/map costs; no same-network before sample establishes this revision’s latency delta. Worker throttling was not independently verified. No budget was relaxed.

Reveal browser animation-frame intervals: median and p95 approximately 16.7 ms on this machine. This is browser cadence, not GPU timing or an ordinary-laptop guarantee. Physical phone, ordinary integrated-GPU laptop and active GPU memory remain unmeasured. Real-device and whole-app payload/first-text budgets remain release requirements.

## Acceptance requested

Review visual clarity, the reveal and component navigation. Acceptance would approve this bounded DTSS presentation, not resolve the documented release limits or authorise deployment/other exhibit upgrades. Scope remains dtss-visual-r1. Existing phase/site/gradient/shaft-adjacency limitations remain in force.
