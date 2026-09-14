# Pulau Tekong — Gate B review

2026-09-15. **reclamation-r1 implemented; awaiting user visual acceptance.** Approval of research was recorded before Blender authoring. This is a local review candidate, not public-release clearance.

Preview: http://127.0.0.1:3001/explore → Reclamation & the polder → Enter the engineering story. The catalogue also enters the exhibit directly. Normal startup remains the Singapore overview.

## Walkthrough

1. Start with the whole landscape and sea-level reference. Match the numbered on-model labels to **What am I looking at?**
2. Compare the higher-infill alternative, then inspect ground preparation. The compression and displacement are illustrative.
3. In **Build where the water is**, scrub the local dry-work sequence. Temporary enclosure, outlet and permanent protection appear at their respective steps.
4. **Inside the dike** peels facing layers away to expose the barrier and distinct seepage collector.
5. **A landscape with plumbing / Two different pumping jobs** separates circulation from discharge; static arrowheads retain direction when motion is disabled. The pond-at-operating-level preset is qualitative.
6. Finish with commissioning/maintenance context and the optional translucent future crest. No promised 2050 works are implied.
7. Return to the Tekong map, then Singapore. Native map context appears only on selection; the mobile view prioritises map, back and entry controls.

## Evidence and visual audit

The [approved brief](reclamation-BUILD-BRIEF.md), [research dossier](reclamation-RESEARCH.md), 24-claim ledger and 12-source registry remain the baseline. Nine stops and fourteen component identities have claim references. Blender stage extras declare research revision, accuracy and stage claims; future geometry is envisioned. The other eight GLB assets were not regenerated.

Original geometry is a compressed section, not the outline of the real polder. Stations are displaced for teaching; internal pump equipment/counts, control thresholds, exact ground layers, dike dimensions and a complete drainage network are not asserted. The optional barge-logistics vignette was omitted to keep the core sequence focused; its source remains in the dossier. No outside imagery was copied into model assets.

The official PUB infographic was rendered locally and visually inspected during implementation. Dike context and pond anchor were manually registered against a north-up OneMap photographic view; the native line is dashed and explicitly approximate, not a closed surveyed boundary. The older street tiles do not show the same shoreline detail. Station pins, uncertain Pulau Unum point coordinates and minor drains are omitted rather than falsely placed; conservation context remains in the storyline. The geographic data file and validator retain source IDs and bounded reconstructed coordinates. The surface itself is a modern reference in every era.

Desktop 1440×1000 and mobile 390×844 screenshots cover overview, work cell, ground preparation, peeled section, water paths, future view and map return. Mobile map revisions remove the discovery sidebar on selection and collapse longer accuracy notes so the entry/back actions remain visible. Labels were inspected for overlap and framing; section views deliberately crop distant base geometry. See [screenshots and label bounds](../qa/reclamation/) and [performance sample](../qa/reclamation/performance.json).

## Technical checks

- Lint, TypeScript, 34 unit tests, workflow/content/geography checks, asset checks and production build pass.
- 24 distinct browser tests across Tekong, accepted DTSS/Tuas/MRT/Barrage and the shared surface passed during this change. Tekong's four tests were rerun after the final state-isolation correction and pass.
- Covered nine construction stages, guided stops, component selection, playback/pause/reset, mobile, historical visibility, reduced motion, map return/reselection, overview cleanup, failed GLB and unavailable WebGL reading fallbacks. Shared tile-failure regression tests pass.
- Corrected construction mode so a previously peeled/animated tour state cannot displace labels or carry its material reveal into global construction playback.
- Matching production app is serving on port 3001. QA uses separate browser contexts and returns to the overview; no project takeover on startup.

## Performance and remaining release requirements

Tekong GLB: **231,188 bytes, 2,892 authored triangles, 33 mesh groups**, within 512 KiB /35 groups. No Tekong model requested before entry. Local Chrome on Apple M4 Pro, 1440×1000, unthrottled localhost: useful text 351 ms; story entry to loaded model 785 ms. Overview high mode 61 calls /4,520 rendered triangles; low 35 /2,768. Playback browser frame interval median and p95 approximately 16.7 ms. These are local samples, not real-phone or ordinary-laptop guarantees. Recorded sample precedes the final construction-state isolation change; default overview and playback assets are unchanged.

**Whole-app release blocker remains:** sampled combined requested JavaScript/worker modules 1,053,258 gzip bytes versus 650 KiB. No waiver. Cold-network, critical-only JS, real mobile/ordinary laptop, GPU/decoded memory, complete licensing and whole-app acceptance remain open. Do not describe this as production-cleared or publish it yet.

Gate B asks for acceptance of this detailed product/visual result. After acceptance, the already requested next work is five-demo/WIP catalogue treatment and whole-app release preparation, followed by actual-app showcase recording and hosting review. No sixth marvel, deployment, paid service or LinkedIn posting has been started.
