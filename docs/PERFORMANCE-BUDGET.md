# Performance budget

Budgets are acceptance targets, not measured claims. Baseline: ordinary integrated-GPU laptop, 1440×900 DPR capped at 1.5; mobile 390×844 DPR capped at 1. Low mode caps DPR at 1, uses low LOD and removes shadows. Test production build, cold cache, simulated fast 4G and real hardware before publication.

| Metric | First slice ceiling | National architecture |
|---|---:|---|
| Initial JS gzip (incl lazy 3D after request) | 650 KiB | split by route/story |
| Critical non-3D JS gzip | 250 KiB | no 3D in reading fallback |
| First story GLBs | 2 MiB | chunk each ≤4 MiB |
| Active triangles | 120,000 desktop / 60,000 low | screen-space LOD |
| Draw calls | 150 desktop / 90 low | instanced buildings |
| Texture dimension | 1024 first slice | max 2048 selectively |
| Textures | 8 MiB decoded first slice | per-chunk eviction |
| Active GPU memory | target <128 MiB | instrument device tools |
| FPS while orbiting | target ≥45 desktop / ≥30 mobile | adaptive quality |
| Useful text | ≤2.5s target fast 4G | SSR |
| Interactive 3D | ≤5s target fast 4G | progressive loading |

Record GLB byte, primitive and triangle counts automatically. Runtime debug exposes renderer.info calls/triangles; browser QA reports actual tested machine and viewport. FPS/loading/GPU memory are not verified just by passing a build. Demand rendering when idle; moving flow only while explicitly enabled and tab visible. Turn motion off for reduced motion. Do not add texture compression or decoder payload without measured net benefit.

Failures block publication or require documented waiver with device, reason and mitigation. CI gates artifact bytes, schema and geometry counts; real-device frame time and memory stay a separate release gate.

## Local production measurement — 2026-09-14
See performance-local.json. Chrome, M4 Pro, 1440×1000, localhost, no network throttling. Canvas initialized in 429 ms in this run. Requested JS after gzip: 503,820 bytes (under 650 KiB total-first-story ceiling). Tracing view: 120 draw calls and 9,490 triangles in high detail; 74 draw calls and 3,198 triangles in low detail. Sampled browser frame intervals: median 16.7 ms and p95 16.8 ms over 120 frames while tracing. This is approximately 60 Hz on this machine, not a portable frame-rate guarantee. GPU memory, critical-only non-3D transfer, real phones and ordinary laptops remain unmeasured. Reproduce with a production server on port 3001 and `node scripts/qa/performance.mjs`.

## National explorer baseline

On the local M4 Pro, Chrome, 1440×1000, unthrottled localhost production: initial world ready in 449 ms; requested JS approximately 545 KB gzip (measured by recompression); island view 24 draw calls / 18,262 rendered triangles; detailed Tuas 24 calls / 11,522 rendered triangles including shadow rendering; active-flight animation intervals approximately 16.7 ms median and p95. These are a local sample, not an ordinary-laptop guarantee or a network performance claim. GPU memory is not measured. See `docs/qa/world/performance.json` and `scripts/qa/world-performance.mjs`.

All nine world GLBs together occupy 1,169,284 bytes; only the selected exhibit is requested initially. Each stays below 512 KiB and 35 authored material/stage mesh groups. The overview uses instanced buildings and a coarse island polygon, not all nine detailed scenes. The upstream Three.Clock deprecation comes from the current R3F dependency path and remains tracked rather than suppressed.

## Geographic surface update

The default surface now loads MapLibre, live raster tiles (tile cache capped at 100), its two matching worker modules and an 817,736-byte CBD GeoJSON. The derived dataset is checked against a 1 MiB cap. The earlier national Three.js draw counts do not describe this renderer. Detailed exhibit GLBs mount only after entering a story; the retained map is hidden during exhibit interaction. Surface tests assert worker-processed buildings actually render. Live tile availability remains an external dependency; a failure message preserves access to every authored engineering story.

The detailed DTSS exhibit has a separate 2 MiB limit (28,528 authored triangles); other world exhibits remain capped at 512 KiB. Direction-only flow uses 18 instanced points and respects reduced motion. Blender is an offline build dependency, not a running web service.


## Tuas detailed candidate — approved model budget and measured limits

The user explicitly approved `tuas-r1` and a Tuas-only 2 MiB GLB ceiling (approval evidence in the workflow register). Other limits are unchanged. Current Tuas asset: 618,688 bytes, 9,452 authored triangles. Every stage has claim IDs, schematic classification and research revision in GLB extras, checked against the exhibit definition.

Production sample in `docs/qa/tuas/performance.json`: M4 Pro / Chrome / 1440×1000 / unthrottled localhost. Useful text 391 ms; entry-to-loaded model 742 ms; no Tuas GLB request before entry. High detail 44 calls / 17,538 rendered triangles; low detail 23 / 8,770. Mechanism-playback browser frame intervals: median 16.7 ms, p95 16.8 ms. These measure local browser cadence, not simulation accuracy or real-device throughput.

**Release blocker:** combined requested JS/modules, including the live map and its worker modules plus the detailed story, measured 998,933 gzip bytes. This exceeds the 650 KiB target. No waiver or budget increase has been recorded. Cold fast-4G, critical-only JS, ordinary-laptop/mobile, decoded texture/GPU memory and complete-app acceptance remain open. See the review package; do not describe this candidate as production-cleared.

## Marina Barrage detailed candidate

Barrage retains the 512 KiB /35 authored mesh-group limit: approximately 484 KB, 7,548 triangles, 29 groups. `docs/qa/barrage/performance.json` records local M4 Pro/Chrome production measurements; no Barrage GLB before story entry, roughly 0.8 seconds to loaded story on unthrottled localhost. High overview 36 calls/6,438 triangles; low 22/3,238. Browser playback intervals approximately 16.7 ms median. Combined requested JavaScript remains approximately 1.04 MB gzip, above 650 KiB: **release blocker, no waiver**. Real-device, cold-network, critical-only transfer and GPU-memory requirements remain open. See `docs/briefs/barrage-GATE-B.md`.

## Pulau Tekong detailed candidate — 2026-09-15

Asset 231,188 bytes, 2,892 authored triangles, 33 mesh groups: within the unchanged 512 KiB/35 group ceiling. Local M4 Pro/Chrome production sample: story entry 785 ms, high overview 61 calls/4,520 rendered triangles, low 35/2,768; approximately 16.7 ms playback browser frame cadence. No model request before entry. See docs/qa/reclamation/performance.json for environment and limitations. Combined JS/worker sample 1,053,258 gzip bytes still exceeds 650 KiB; no waiver, ordinary-device/cold-network/GPU tests remain open. This candidate is not public-release cleared.
