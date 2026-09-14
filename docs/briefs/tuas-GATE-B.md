# Tuas Port — detailed candidate for Gate B review

Research baseline: **tuas-r1**, explicitly approved by the user's “Approve” message. Accepted on 2026-09-14 by the user: “and also Approve Tuas Mega Port build.” Accepted build: `af06f0cf8e6400ddf903bfabcbcfc27fceb02b09`. The review evidence below remains applicable; whole-app release limitations remain open. MRT and every later marvel remain queued.

## Run and review

Open [UNSEEN locally](http://127.0.0.1:3001/explore). The initial view remains Singapore. Choose Tuas from the project list for the native-map orientation, then **Enter the engineering story**. The direct **Begin at Tuas Port** shortcut also works.

1. **The port today:** inspect the ship, quay cranes and yard; scrub or play the illustrative container hand-off.
2. **Why move west:** return to native map context showing Tuas, Pasir Panjang, city terminals and Sultan Shoal. Markers are approximate; no official phase boundary is invented.
3. **Prepare what lies beneath:** inspect the exposed local replacement zone and rock mound.
4. **Make the giant:** inspect the representative casting bay, cellular caisson, rebar cues and moving slipform.
5. **Float. Place. Retain:** play/pause/reset towing and lowering. Later fill and terminal works are absent in this placement view.
6. **Turn fill into a platform:** transparent fill exposes drainage paths. Apply/remove surcharge and scrub qualitative consolidation. No calculated time or settlement is claimed.
7. **Connect the working terminal:** follow a container through an illustrative quay-to-yard cycle.
8. **Build for decades:** compare Phase 1, Phase 2 evidence and future targets. Future extension outlines are envisioned cues, not agency geometry.

The separate construction panel has **nine stages**. Camera stops and construction stages are independent controls. Earlier timeline dates show pre-project context rather than a fabricated historic port. Return to 2026 for the detailed reference. Back/reset controls remain explicit; Tuas exit clears its map context. DTSS retains its accepted navigation and assets.

## Evidence and authoring audit

- [Approved brief](tuas-BUILD-BRIEF.md), [research dossier](../research/TUAS-RESEARCH.md), [claims](../../content/workflow/tuas-claims.json), [sources](../../content/workflow/tuas-sources.json).
- [Detailed exhibit definition](../../content/workflow/tuas-exhibit.json): evidence-linked components, eight camera stops and nine construction stages.
- [Blender authoring](../../pipeline/blender/tuas_detail.py) through `TUAS_ONLY=1 …/Blender --background --factory-startup --python pipeline/blender/world.py`. Blender exports and exits; no live authoring service is implied.
- Each exported Tuas stage carries `claim_ids`, `research_revision` and `accuracy_class`. Asset validation checks these references against the content definition. This verifies coverage, not engineering truth.
- Geometry, vessels, material palette, markers and animations are original schematic work. No agency imagery, drawings or surveyed coordinates were imported into the detailed model.
- Phase applicability, source passages, single-source/qualified status and limitations are available under each stop's **Evidence & accuracy** disclosure.
- The source conflict between PSA's 18 operating berths target and MPA's 21-berth overview target remains disclosed. Dates of operations, official opening, reclamation completion and full future capacity are separate.

## Review evidence

[Present-day composition](../qa/tuas/present.png) · [fabrication](../qa/tuas/stop-4.png) · [placement](../qa/tuas/stop-5.png) · [ground improvement](../qa/tuas/stop-6.png) · [mobile controls](../qa/tuas/mobile.png).

Lint, TypeScript/production build, 21 unit tests, all 15 browser tests and data/geography/workflow/GLB checks passed. Browser coverage includes Tuas mechanisms and nine stages, desktop/mobile navigation, keyboard controls, reduced-motion context, all nine assets and DTSS regressions. Failed asset tests deliberately abort downloads and verify readable content remains. Upstream Three.Clock deprecation persists.

The mobile Tuas layout keeps the model visible while the story panel scrolls. Desktop inspection checked the arrival scene, placement and transparent ground cutaway; screenshots cover the component views. Play/pause and slider tests verify mechanism changes; local playback cadence was measured. Visual acceptance remains yours.

## Performance and release limitations

[Machine-readable production sample](../qa/tuas/performance.json); [reproduction script](../../scripts/qa/tuas-performance.mjs).

- GLB: **618,688 bytes** against the approved 2 MiB cap; 9,452 authored triangles.
- Local high detail: **44 draw calls / 17,538 rendered triangles**. Low detail: **23 / 8,770**.
- Local useful text: 391 ms; story entry to loaded model: 742 ms. No Tuas model request before entering a story.
- Local browser frame intervals during playback: median 16.7 ms / p95 16.8 ms. No page errors in this measurement.
- **Release blocker:** combined map-and-story JS/modules measured **998,933 bytes gzip**, over the existing **650 KiB** target. The budget has not been relaxed. Cross-renderer loading needs further optimisation/release review.
- Ordinary integrated-GPU laptop, physical mobile, cold fast-4G and GPU/decoded memory remain unmeasured. Local Mac results do not establish these.
- Exact cell layout, dimensions throughout the district, reinforcement, foundation depth, tow/draft/ballast procedure, soil/drain spacing, settlement rates, real traffic controls and official phase polygons are not supplied or simulated.
- Live tile availability remains external. The model is an explanatory district with compressed relationships, not a complete operational digital twin.

## Gate B decision

Review the candidate and request Tuas revisions or explicitly accept it. Any acceptance must distinguish the unresolved release-budget/device requirements from visual/product acceptance. No production clearance, deployment permission or next-project authorisation is inferred. Starting MRT requires your explicit authorisation after Tuas acceptance.


### Review revision: numbered structure labels

The model now has stable numbered callouts and a matching “What am I looking at?” drawing key. Click a number for a plain-language explanation without changing the drawing. Labels follow moving components and only identify structures present in the current view. [Mobile example](../qa/tuas/numbered-mobile.png). All 16 browser tests passed; the prior performance measurement is retained as historical evidence and does not include the new annotations. Release blockers and Gate B status are unchanged.
