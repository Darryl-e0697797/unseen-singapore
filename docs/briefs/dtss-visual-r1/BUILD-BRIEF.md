# DTSS visual upgrade — dtss-visual-r1

2026-09-24 · Gate A review package · awaiting approval of this named revision.

User start instruction: “Start next milestone”, following the proposed DTSS visual upgrade. This starts preparation; no approval of an unseen baseline is recorded. The accepted DTSS remains accepted. This is the sole proposed upgrade; other eight exhibits are outside the visual change scope.

## Outcome and visual direction

Make the existing teaching cutaway feel like a carefully lit architectural exhibit: warm matte concrete, subdued earth, cooler metal highlights and clearly separated protective surfaces. Retain the teal/cream UNSEEN identity. Engineering legibility takes precedence over cinematic effects.

Build in the existing Blender → GLB → browser pipeline. No Unreal migration, AI-generated infrastructure imagery, new runtime service or paid dependency in this milestone. No public deployment, GitHub release or new showcase production is included in this Gate A request.

## Baseline audit

Read ENGINEERING-MARVEL-STANDARD, USER-EXPECTATIONS, MARVEL-WORKFLOW, progress/programme registers, web instructions, DTSS-FACT-CHECK and PERFORMANCE-BUDGET.

- Accepted model: world-dtss.glb, 1,621,180 bytes, 22 mesh groups, eight materials; SHA-256 320ba7faf829dfc9258c8d30dffcba6652e09146bca1a79c2b693a182cb163b8.
- Every material currently has approximately 0.7 roughness. Material response offers a bounded improvement without additional engineering components.
- The renderer already uses a hemisphere fill, directional light, 2048 shadow map and demand rendering. Adding more lights/effects by default would not itself address readability.
- DTSS does not participate in the DPR/shadow low-quality switches in scene.tsx; newer detailed exhibits do.
- scene.clone(true) retains shared materials. Any DTSS-specific runtime material treatment must clone owned materials and clean them up; avoid modifying cached resources used elsewhere.
- Meshes are joined by stage/material. The 368-object video replay cannot simply replace the web asset: it could multiply draw calls. Preserve grouped export; retain existing five construction stages and six numbered component stops.
- Existing QA documents include measurements from multiple release dates, some superseded. They are reference data, not a current baseline. Capture before/after from the same production build environment during implementation.

## Evidence review and boundaries

Sources revisited 2026-09-24. PUB pages state last updated 03 March 2026. No source images, map data or third-party textures are imported by this proposal. Public access is not treated as redistribution permission. Link and paraphrase; maintain existing attribution.

| ID | Fact or visual treatment | Evidence and locator | Classification / limitations |
| --- | --- | --- | --- |
| V1 | Phase 1 complete; Phase 2 commissioning remains a future phased programme | https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS ; Phase 1 / Phase 2 sections | Documented, single agency. Phase 1 completed 2008; Phase 2 phased commissioning from 2027. Do not turn the composite into an all-operating 2026 scene. |
| V2 | Secondary lining and fibre-optic structural monitoring have distinct purposes | https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS/ConveyanceSystem ; Tunnel Lining | Documented function, single-source. Improved material contrast is schematic; colour, reflectance, thickness and surface finish are not surveyed specifications. |
| V3 | Gate isolation and air management are separate systems | Same conveyance page; Tunnel Isolation Gates / Air Flow Management | Documented functions, single-source. Keep existing guide-only gate depiction; no new gate position, layout or operation animation. |
| V4 | Model is a combined teaching assembly with illustrative ring/shaft/TBM dimensions | docs/DTSS-FACT-CHECK.md; pipeline/blender/dtss_detail.py and world.py | Schematic. Retain historical T-04 source and Phase 2 applicability. No new ring counts, reinforcement, geology or shaft-adjacency claim. |
| V5 | Warmer concrete, cooler steel, rough earth and controlled protective-surface sheen | Editorial design decision, current material audit | Schematic art direction, not a factual physical-material calibration. No wetness, corrosion damage or defects implied by decorative textures. |

Separate challenge pass: current PUB overview calls 206 km a deep-tunnel network in general prose, while its phase breakdown includes link sewers. Keep the existing explicit distinction; no metric rewrite. Phase 2 49/49 km split versus older 35/63 km classifications remains an unresolved historical discrepancy in the accepted audit; this visual revision does not resolve it. No independent source is claimed merely because two PUB pages agree.

## Storyboard and component inventory

| Stop | Visitor sees / does | Proposed improvement |
| --- | --- | --- |
| Singapore / project context | Normal atlas, then DTSS network on selection | Preserve map geometry, landmarks, phase controls and omitted-branch notices. |
| 01 Whole system | Surface setting, two differently purposed shafts, tunnel and plant relationship explanation | Stable three-quarter framing, restrained backdrop, warmer/cooler material separation. Whole scene fits beside drawing key. |
| Enter the cutaway | User-triggered short transition from surface context to section | One slow camera move, immediate skip/reset, static endpoint for reduced motion. No auto-orbit or national-map geometric morph implying accurate coordinates. |
| 02 Construction shaft | Rings, access and lifting context | Light reaches shaft interior; existing thin components remain visible. Composite placement note stays immediate. |
| 03 TBM | Cutter, shield, jacks and support equipment | Material distinction and existing cutaway expose relationships. No invented motion or extra machinery. |
| 04 Rings and protection | Structural shell versus inner layers | Focused camera and stronger layer contrast; same source-qualified thicknesses and existing stage/exploded controls. |
| 05 Maintenance and air | Gate shaft guides and air-management illustration | Distinct focal points; no permanent raised gate added. |
| 06 Gravity | Existing direction-only particles and adjustable profile | Preserve non-simulation/exaggerated-fall labels; animation only by choice and while visible. |
| Return | Back to Singapore, then reselection | Restore atlas, clean project overlays, reset camera/state. |

“What am I looking at?” retains all six numbers, plain-language purposes, keyboard support and matching visible on-model anchors. Construction mode remains five existing stages. The new reveal is a presentation transition, not another construction stage or a verified contract sequence.

1950s/1958, 1965, 2000, 2026 and 2050 retain current content/status and pre-project labels. Present-day basemap remains explicitly present-day. No historical city reconstruction or future geometry is introduced.

## Build scope and performance contract

First pass: material parameters, DTSS-scoped lighting/shadow framing, background/floor restraint, camera polish and a DTSS low-quality path. Attempt no new texture downloads or post-processing dependency. If microtexture is justified after the first comparison, generate an original small shared map and measure it; no decorative engineering detail. No changes to mesh topology, component placement or physical dimensions are proposed in r1.

Preserve budgets from PERFORMANCE-BUDGET.md: DTSS GLB ≤2 MiB; desktop/low triangles ≤120,000/60,000; draw calls ≤150/90; first-slice texture dimensions ≤1024 and decoded total ≤8 MiB; GPU target <128 MiB. DPR high capped 1.5; low 1 with shadows off. Initial JS ≤650 KiB gzip including requested 3D; critical non-3D ≤250 KiB. Useful text ≤2.5 s and model ready ≤5 s under the documented cold-network profile; orbit target ≥45 FPS desktop / ≥30 mobile. No budget increases or silent waivers.

Keep heavy 3D lazy and mobile gateway intact. Compare model transfer, scene readiness, draw calls, triangles, frame intervals, idle rendering and memory where measurable against a same-machine baseline. Report existing budget failures separately from regressions; old M4 measurements do not prove ordinary-laptop or real-phone performance.

## Implementation order after approval

1. Record exact approval; add a revision-aware upgrade workflow/preflight while preserving all prior acceptance records. Current sequential checker assumes one first-build progression and cannot reopen DTSS without treating later accepted projects as invalid; extend with tests rather than rewriting accepted history or bypassing checks. The named DTSS build preflight must pass before detailed work.
2. Capture current production screenshots/performance for six stops, construction, exploded, normal/low and reduced motion. Preserve unrelated dirty working-tree changes.
3. Implement isolated DTSS presentation changes and reproducible material authoring if needed. Preserve material ownership and runtime export metadata.
4. Compare matched cameras before/after; remove effects that hurt component reading or exceed performance budgets.
5. Run lint, types, deterministic tests, source/asset/workflow validation, production build and relevant browser regression journeys. Inspect in motion, including repeated navigation, failed assets/WebGL, drawing-key focus, keyboard, mobile clipping and reduced motion.
6. Deliver Gate B: local preview, side-by-side images, motion walkthrough, before/after measurements, source audit and limitations. Leave browser on Singapore overview. Wait for visual acceptance before wider rollout, new showcase or deployment.

## Gate A decision

Approval requested for dtss-visual-r1 as specified above: one DTSS presentation upgrade, existing engineering scope and geometry, unchanged performance ceilings. Unreal/Higgsfield and public sharing are separate later decisions. The proposed appearance must be approved visually at Gate B; passing tests alone is insufficient.
