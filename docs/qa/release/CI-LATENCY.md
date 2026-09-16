# CI and latency verification — 2026-09-15

Implementation: 079b7d0b91103f897d44d17eb55882e4ba67f1bd (public review branch).

Lint, typecheck, 36 unit tests, source/workflow/geography/asset checks, normal production build and static export pass locally. All 26 production exhibit/map browser checks pass, and the DTSS early-selection regression passed five consecutive repetitions.

All 15 cold-load measurements (three per detailed exhibit) passed the unchanged useful-text <=2.5 s / selected-model <=5 s targets. See latency-budget.json for individual trials. Chrome on local M4 Pro, fresh contexts, disabled cache, CDP 1.6 Mbps down / 750 Kbps up /150 ms latency, compressed local static server. Worker throttling is not independently verified; these are not real-phone or hosted-network measurements.

| Exhibit | Cold model load range |
|---|---|
| dtss | 4.593–4.644 s |
| tuas | 4.362–4.393 s |
| mrt | 4.328–4.378 s |
| barrage | 4.311–4.410 s |
| reclamation | 4.129–4.261 s |

Useful text: worst 0.679 s. Lossless byte-shuffling + gzip preserves each source GLB exactly; original portable GLBs and manifest hashes remain unchanged. Model/engine loading starts together; hidden map layers stop requesting/rendering unnecessary content. Browsers without native decompression use original GLBs.

The existing combined JS/worker size ceiling remains unresolved; real phone/integrated-laptop frame performance and GPU memory remain unmeasured. No full-release clearance or showcase recording is implied.

Final GitHub checks passed at 079b7d0: verify run 34915481463 (36 unit tests, 34 browser tests) and validate run 34915481457. Both verify and validate are now required on main, with the existing review requirement retained. PR #1 remains unmerged.

Sites version 4 deployed successfully from that exact source commit. Public URL: https://unseen-singapore.darrylkai.chatgpt.site . Deployment appgdep_6aa89a2b3fa88191be21a893619766db. Local port 3001 also refreshed.

Hosted verification: all 26 production browser regressions passed against public Sites version 4 (1.5 minutes), including native decompression fallback and all five detailed journeys. Hosted model transport returns 200; building JSON has application/json and gzip encoding.
