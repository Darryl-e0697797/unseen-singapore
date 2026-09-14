# Marina Barrage — Gate B review

**barrage-r1 accepted on 2026-09-15.** User replied “Approve”; accepted build `9cfbe5d74f90e729cd47a3c9822543bc1bb5c4f9`. No next marvel is authorised. Your Gate A reply was “Approve”, recorded before modelling in the workflow evidence. Production preview: [UNSEEN](http://127.0.0.1:3001/explore).

## Walkthrough

Select **Marina Barrage** on the Singapore map, then **Enter the engineering story**, or use the project catalogue shortcut.

1. Start with the full barrier, nine gate bays, seven permanent drainage machines and public roof. Select numbers in the drawing or the “What am I looking at?” key.
2. **Why build here?** → **Back to Barrage map** shows reservoir, named waterways, sea and landmark context on the map itself. The map card has a direct **Back to Singapore** action.
3. **Building in water:** scrub removal of water from an illustrative temporary enclosure. Construction pumps are separate from the permanent drainage system.
4. **Putting it together:** scrub conceptual equipment placement and completion. The app explicitly distinguishes this from a historical contractor programme.
5. **Rain at low tide / Rain at high tide:** compare relative levels, gate state and water direction. A change of conditions also switches to the appropriate explanatory view. **No excess rain** leaves drainage pumps idle.
6. **Becoming freshwater:** compare the three dated milestones, with an explicitly conceptual colour transition.
7. **Keeping it dependable:** read what informs operations and what the model cannot prescribe.
8. **Facing future seas:** enable the optional ghosted concept. Current and proposed structures remain distinct; the future geometry is classified envisioned in both content and GLB extras.
9. Use **Reset view**, return to the map, return to Singapore, and re-enter. Historical eras hide the modern facility rather than invent an earlier structure.

## Delivered and visually reviewed

Nine guided stops, nine explanatory stage controls and twelve stable drawing numbers. Original Blender model with a compressed whole-site view, enlarged gate section, generic open pump housing, motor/shaft/impeller, temporary enclosure and optional future concept. The gate rotates towards the sea when lowered. Direction arrows and the mechanism scrubber are illustrative, not hydraulic analysis.

Desktop and 390×844 mobile screenshots were inspected. Corrections during review: dark-on-dark control text, crowded water labels, missing direct map return, oversized mobile map card, and overlapping mobile drawing numbers. Mobile numbers now occupy a spaced row with leaders to their structures. Bounding-box inspection of ten captured desktop/mobile views found no numbered-label overlaps or labels outside the viewport. This does not establish perfect layout at every possible orbit, zoom or device size.

- [Present-day view](../qa/barrage/present.png)
- [Pump cutaway](../qa/barrage/desktop-6.png)
- [Mobile cutaway and numbered leaders](../qa/barrage/mobile-6.png)
- [Mobile native map](../qa/barrage/map-mobile.png)
- [All layout bounds](../qa/barrage/label-bounds.json)

## Source and asset audit

[Research dossier](barrage-RESEARCH.md), [claim ledger](../../content/workflow/barrage-claims.json), [source registry](../../content/workflow/barrage-sources.json), [detailed content](../../content/workflow/barrage-exhibit.json).

The 20-claim baseline is retained. Stops and component explanations reference specific claims; model groups carry the approved research revision and stage evidence. The model checker verifies references, classifications and nine main crest-gate panels. The Blender script asserts seven permanent drainage pumps before merging. No official drawings, photographs, logos, catchment polygon or engineering GIS were imported. Manually placed map markers were visually checked against the existing photographic basemap and remain approximate orientation points; omitted upstream branches are disclosed.

Exact historical cofferdam phasing, dimensions, ground properties, equipment internals and isolation procedures remain excluded. The enlarged mechanism is displaced for explanation, not an as-built adjacency claim. Thermal, hydraulic, structural and salinity simulations are not implemented. Existing basemap/service attribution is retained. This audit checks evidence use and presentation, not engineering certification.

Reproduce only this model with:

```sh
npm run workflow:check -- barrage
BARRAGE_ONLY=1 /Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python pipeline/blender/world.py
npm run assets:check
```

The build preflight requires stage `building`; after Gate B presentation, move back to that stage only for authorised Barrage revisions. Do not bypass approval guards or regenerate accepted exhibits unnecessarily.

## Technical verification

- Lint, TypeScript, content/geography/workflow validation, asset checks and production build passed.
- **30 unit tests passed.** Barrage tests cover mutually consistent rain/tide states, temporary/future visibility, historical hiding and drawing-label behaviour.
- **27 browser tests passed** across the complete existing suite, including DTSS/Tuas/MRT regressions and five Barrage cases.
- **Five Barrage tests rerun against the production server passed** after the visual corrections: navigation/reset/stage controls, keyboard inspection, playback, mobile/reduced motion, timeline/future visibility, failed model, unavailable WebGL, failed tiles and direct map return.
- Intentional failure tests produce expected load-error logs while verifying the readable fallback. The existing upstream Three.Clock deprecation remains; it is not suppressed.
- Only the Barrage model changed. Accepted DTSS, Tuas and MRT GLBs were not regenerated.

Reproduce production checks with the preview running on port 3001:

```sh
npx playwright test --config scripts/qa/barrage-production.config.ts
node scripts/qa/barrage-layout.mjs
node scripts/qa/barrage-performance.mjs
```

## Performance and release limitations

Model: approximately **484 KB**, **7,548 authored triangles**, **29 mesh groups**. Passes the unchanged 512 KiB /35-group limits. No pre-entry Barrage GLB request observed.

[Local measurement](../qa/barrage/performance.json): M4 Pro, Chrome, 1440×1000, unthrottled localhost production. Roughly 0.4 s to useful text and 0.8 s from catalogue entry to loaded model. Overview: 36 rendered calls /6,438 triangles in high graphics; 22 /3,238 in low graphics. Mechanism browser frame intervals approximately 16.7 ms median /16.8 ms p95. These are local browser measurements, not ordinary-laptop or mobile-device guarantees, and frame cadence alone is not GPU timing.

**Not cleared for publication:** combined requested JavaScript remains about **1.04 MB gzip**, above the unchanged **650 KiB** ceiling. No waiver is recorded. Critical-only transfer, cold fast-4G timing, ordinary integrated-GPU hardware, physical mobile devices and decoded/GPU memory remain open. Whole-app acceptance, licensing/source-freshness release review and public deployment authorisation are still required. Local build success and this Gate B package do not satisfy those release gates.

Your visual/product acceptance is recorded. Revisions stay within Marina Barrage. No other marvel's research or modelling starts without your acceptance and explicit next-project authorisation.
