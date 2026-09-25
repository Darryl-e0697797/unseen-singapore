# Development log

## 2026-09-14 — Foundation and pipeline session
Objective: establish a credible, extensible architecture; prove generated Blender geometry inside an interactive web scene; build first DTSS teaching slice only after proof.

Attempted: machine inventory, public-source research, full foundation documentation, tool installation, typed contracts and deterministic scene controller.

Succeeded: empty existing Git repository identified; dedicated codex/foundation branch created. Hardware/tool inventory documented without device identifiers. PUB and LTA primary-source pages located. Architecture and methodology documented before asset generation.

Failures/unknowns: Blender absent initially. Unreal not found (optional). PUB terms URL did not resolve through web reader; media redistribution remains unverified and blocked. No proprietary or survey geometry available, so initial scene is explicitly local-schematic.

Human intervention: none. No credentials supplied or required for authored guide.

Architecture changes: chosen source-only shared packages inside npm workspace; no model provider yet. Historical, Tuas and future stages remain roadmap scope.

Lessons: status evidence must distinguish scheduled commissioning from operation; geometry credibility cannot be inherited from narrative sources.

Validation and measured results appended as milestones complete.

### Pipeline proof completed
Blender 5.2.1 LTS installed through Homebrew. Generated dtss-section.glb (97,068 bytes; 3,348 triangles) and low LOD (45,952 bytes; 1,268 triangles). Axis fixture verifies Y-up export and metre positions. Chrome test loaded GLB and selected the actual mesh; no console/page errors. Screenshot: pipeline-proof.png, visually inspected. Eight deterministic tests, lint and typecheck pass. Initial dependency resolution failed on React 19.3 peer range and was resolved using 19.2. Initial asset-check execution needed ES module mode for top-level await; fixed via package type=module. Blender warns use_nodes is deprecated for a future 6.0 release; generation currently succeeds. No human intervention.

### First DTSS chapter completed
Attempted: integrate architectural surface context, section reveal, camera presets, GLB selection, independent layers, authored question routing, four explanation levels, source disclosure, temporal coverage notices and reduced/mobile/reading modes.

Succeeded: first working chapter and retained /pipeline proof route. All geometry is labelled schematic. Actual camera/trace movement is observed by browser tests, not inferred solely from state. Sources and original-vs-derived geometry metadata are validated; restricted media derivatives fail the build gate. Code was formatted for maintainability. Production build succeeds; no runtime provider/credentials needed.

Failures and fixes: first reveal left the front earth volume occluding the tunnel; visual inspection caught this and the cut face now becomes transparent. Decorative arrows polluted button accessible names and caused exact-label browser tests to fail; arrows are now hidden from assistive technology. A mobile full-page capture exposed the offscreen skip link; it now uses clipping until focused. React lint identified imperative hook-value mutation patterns; material construction and frame callbacks were adjusted to match renderer lifecycle. Retry after a cached asset failure reloads the document for a fresh network request.

Validation: 9 deterministic tests; 5 Chrome browser tests including mesh proof, camera movement, tracing, layers, explanation levels, sources, unsupported precision requests, mobile/reduced motion, failed GLB and keyboard operation. Desktop and mobile screenshots visually inspected. Production performance measured separately; see performance-local.json and PERFORMANCE-BUDGET.md. Public deployment, real-device mobile/Safari performance and independent engineering review remain outstanding.

Human intervention: none. Architecture changes: geometry acquisition references are now distinct from narrative references and rights clearance is executable. Next.js generated local AGENTS.md rules during first launch; its bundled app/lazy-loading guides were read before the main slice work. Meaningful commits separate architecture, pipeline proof and the first chapter.

Lessons: rendered section visibility and accessible button names need browser checks; small geometry and authored scene commands are enough to test the central interaction before national data acquisition. Schematic accuracy labels belong in the persistent interface, not just documentation.

Final compatibility check: Three.js 0.186 warns that the default PCFSoftShadowMap has been removed. The renderer now explicitly selects PCFShadowMap; typecheck, lint and production build were rerun. This keeps the new dependency stack free of that runtime deprecation.

## 2026-09-14 — The engineering world and research atlas

**Objective:** Respond to the user's request for greater depth, all flagship themes, 1950s/1965/2000/2026/2050 coverage and a substantially more immersive 3D experience.

**Implemented:** `/explore`; generalised Singapore geography; nine original staged Blender exhibits; present-day summaries; 45 sourced chapters; 45 engineering notebook entries; 45 temporal snapshots; event chronologies; 30-source research registry; full research artifact; orbit, flight, close inspection, exploded assemblies and construction playback; all-project timeline matrix; authored spatial question routing; responsive reading experience.

**Research findings:** 2023 DTSS excavation and future commissioning differ; 2022 Tuas opening and full 2040s development differ; Long Island's September 2026 preparatory programme is not its final outline; a 2050 planning lens is not a common project deadline. Conflicting historical dates and outdated forecasts are recorded in the atlas verification ledger.

**What failed and was fixed:** Blender's join operation invalidated cached object references; grouping now queries surviving scene objects. Desktop model framing initially overlapped headings; the canvas receives dedicated exhibit space. Mobile markers initially covered the introduction; mobile now separates intro and canvas and uses indexed markers. Browser automation found missing accessible names on icon-only mobile navigation buttons; explicit labels fixed them. No human intervention or credentials were needed for these branches.

**Architecture changes:** A new typed world package preserves the old DTSS contract; authored Blender stage extras control construction; public-domain orientation geometry is transformed through the reproducible GIS pipeline. Research generation and asset checks are reproducible scripts.

**Limits:** The country model is generalised, buildings illustrative, and exhibits schematic. Historical coastlines, high-fidelity facility interiors, full contract-level programmes, comparative future geometry, live grounded AI and expert engineering validation remain future work. This is an expanded working documentary foundation, not the finished national digital world.

**Final verification:** ESLint, TypeScript, 14 unit tests, 8 browser tests, asset/provenance checks and the production build passed. Deliberate asset-load failure preserves sourced reading. Production performance and visual evidence are recorded in `docs/qa/world`. A production server was restarted after the final build so the browser receives matching HTML and JavaScript chunks.

## 2026-09-14 — Geographic surface inspired by OneMap

**Objective:** Replace the abstract national display with an explorable Singapore plan and credible 3D urban context, following the user’s OneMap reference.

**Delivered:** Documented live OneMap basemap; flat plan and pitched map; 1,865 attributed CBD building footprints; height-basis inspection; four camera bookmarks; nine searchable engineering destinations; fly-to preview cards; preserved map location when returning from the existing staged exhibits; responsive controls and explicit temporal provenance.

**Data:** The bounded OSM API extract contains 1,456 height-tagged footprints, 131 floor-derived estimates and 278 illustrative 12 m extrusions. Derived GeoJSON is downloadable under ODbL with checksums, attribution and a reproducible transformation. No OneMap 3D meshes or imagery were copied. Live raster tiles use the documented embedding service and required attribution.

**Resolved:** Overpass timed out, and an initially larger core API bbox exceeded its node limit. A smaller CBD request succeeded. MapLibre v6’s separate module worker initially failed under bundler URL rewriting, leaving raster tiles visible but no buildings; explicitly serving its matching worker/shared files fixed this. Browser verification now checks actual rendered building features, not merely a successful GeoJSON fetch.

**Limits:** This is partial CBD massing rather than textured island-wide 3D. Project pins are approximate public/regional contexts. Historical/future dates change researched stories; the live basemap does not reconstruct those dates. Present-day buildings are hidden outside 2026.

**Verification:** ESLint and TypeScript passed; 14 unit tests and 10 browser tests passed. The two surface tests passed again after flattening buildings in plan view. Production build and geographic/asset validation passed. Live OneMap tiles and extrusions were visually checked on desktop, mobile and the restarted production app at port 3001.

## 2026-09-14 — DTSS component environment and photographic surface

**Delivered:** OneMap orthophoto style for 3D, existing street cartography for 2D, explicit photo/street switch; schematic island-scale east/west DTSS collection connections; Blender-built shaft, gantry, TBM cutter discs and shield, jacks, backup equipment, bolted structural rings, inner protection, isolation gate, air-management riser, fibre and surface context. Six interactive camera stops connect components to PUB-grounded rationale; runtime flow markers show direction only. Existing construction/explode, eras, sources and other eight exhibits remain available.

**Authoring:** Blender runs in background during asset generation, exports GLB, then exits. Three.js displays that model and animates the camera/flow in the browser. OneMap supplies streamed surface pixels; OSM supplies independently derived CBD massing. Neither supplies this underground model. DTSS regeneration command: `DTSS_ONLY=1 /Applications/Blender.app/Contents/MacOS/Blender --background --factory-startup --python pipeline/blender/world.py`.

**Sources and limits:** PUB DTSS overview and Phase 2 Conveyance System pages underpin the tour. SLA’s OneMap3D launch PDF identifies the orthophoto style. Satellite XYZ was verified with a single HTTP request and live browser display. The island lines are original diagrammatic connections, not traced alignments. The cutaway compresses distances/depth and is not an as-built or hydraulic model. Photo capture dates are not known. DTSS has a 2 MiB lazy-load budget to accommodate component detail; other exhibits retain 512 KiB.

**Verification:** ESLint, TypeScript, 14 unit tests, 11 browser tests, geographic validation, GLB checks and production build passed. The final shared hotspot/guide handler passed the DTSS browser test again. Model: 1,511,344 bytes, 28,528 triangles, 22 meshes, five construction stages. Live photographic map and DTSS detail were visually checked; port 3001 was restarted with the matching production build.

Final in-app tall viewport check required aspect-aware DTSS camera distance and a longer fog range. Updated framing, rebuilt production, and reran all four DTSS/world browser tests successfully.

## 2026-09-14 — DTSS factual corrections and mechanism diagrams

Audited all six DTSS component stops and five construction stages against PUB/NAS/NEA sources; detailed claim ledger in `docs/DTSS-FACT-CHECK.md`. Removed invented geographic lines because they falsely suggested complete route endpoints. Added Changi/Tuas/redeveloped Kranji system context and current/planned distinctions. Removed the permanently raised gate and rebuilt an indicative designated gate shaft with guides. Added sourced normal/isolation diversion and separate air-function explanation. Added adjustable, explicitly exaggerated gravity profile and influent pumping to treatment. Flow direction in the cutaway now leads away from the depicted upstream link connection. No numerical gradient or complete surveyed alignment is asserted.

Source discrepancies: 49+49 km on current conveyance page versus 35+63 km in 2023 annex; both total 98 km but categories differ. Kept the unambiguous Phase 1 48 km deep-tunnel metric. A 1:100 notation in a drawing is not evidence of an actual tunnel gradient. Gate mobilization and 32 shafts are specifically supported by June 2023 newsletter p5.

**Verification:** ESLint, TypeScript, all 12 browser tests, provenance/geography and GLB checks, and the production build passed. Live production inspection verified the gate-diversion toggle and exaggerated gravity profile, including keyboard adjustment. Blender regenerated the gate shaft and exited; the browser displays the exported model. Exact route geometry, actual gradient, and component dimensions remain unverified illustrative geometry.

## 2026-09-14 — Restore visible DTSS network and identify shafts

Selecting DTSS on the surface now opens PUB’s official island-wide network illustration, streamed from its overview page with attribution, zoom/scroll controls, failure fallback and a return-to-OneMap switch. It is deliberately a separate published plan, not an unverified georeferenced street overlay. The full illustration fits initially; zoom reveals detail. The image includes current/planned context and does not claim historical reconstruction. Construction-access and gate-isolation captions now distinguish the two shafts; tour copy explicitly rejects a surveyed adjacent-pair interpretation. No geometry was changed.

Verification: lint and production build passed, including TypeScript and data/asset validation. Four surface/DTSS browser tests passed. Live production checks confirmed the remote PUB image loaded at its native 6667-pixel width, network switching worked, and both shaft captions appeared. The network remains an overview rather than every local property connection.

## 2026-09-14 — DTSS integrated map overlay

Replaced the floating PUB image viewer with native MapLibre lines and map-anchored landmark icons. Five manually generalised deep-tunnel corridors distinguish Phase 1 and Phase 2; nine contextual markers identify the three WRP areas, Mandai, Jurong Lake Gardens, Botanic Gardens, Marina Bay/CBD, Gardens by the Bay and Changi Airport. Phase and landmark controls, click-to-read landmark notes, 2D/photographic tilt, and returning from the exhibit work in the map itself. Removed the unused image component. Adjusted bounds/minimum zoom to accommodate the legend and project card on narrower windows.

Accuracy boundary: these are original approximate regional corridors interpreted visually from PUB’s overview, not surveyed or digitised engineering routes. They do not include the full link-sewer network or individual property connections. Icons are original schematic silhouettes; their positions are approximate. Current/planned context persists across timeline selection and is labelled explicitly. No hydraulic topology between landmarks is implied.

Verification: lint, TypeScript and production build/data/asset validation passed. All three surface browser tests passed, including rendered-route counts, both phase toggles, landmark toggling/selection, story return and cleanup. Live production review checked the street plan and photographic tilted overlay. Server restarted with the final build.

## 2026-09-14 — DTSS acceptance and reusable detailed-build standard

The user accepted DTSS and requested that their prompts, expectations and lessons be recorded before each subsequent marvel build. Preserved the full original attached prompt, added a quoted-excerpt expectation record, a reusable engineering-marvel standard and a per-project build-brief template. Added root AGENTS.md instructions requiring these to be read and a project brief prepared before substantial detailed work. The standard retains accuracy boundaries, native-map expectations, deep component storytelling, historical/future distinctions and the navigation/QA lessons. At that time this was a preparation requirement, not an extra approval gate; superseded by the explicitly requested two-gate programme below. No next marvel was started and no app behaviour changed.

Validation: reviewed the documents against the available conversation, separated user quotes from interpretation, and checked the local documentation links. DTSS acceptance is explicitly distinguished from surveyed accuracy and completion of the original long-term roadmap.


## 2026-09-14 — Sequential programme and Tuas Gate A package

Implemented the user-requested research/build approval gates in project instructions, roadmap, standard and brief template. Added a machine-readable ordered register with actual DTSS acceptance and Tuas start-authorisation quotations. Tuas is awaiting approval of research revision `tuas-r1`; all later projects remain queued. No research approval was inferred and no detailed geometry was changed.

Added evidence/provenance and workflow checks, including single-active-project enforcement, revision-matched Gate A, acceptance/next-project authorisation, claim references and unchanged model hashes before approval. These enforce consistency, not source truth or approval authenticity. Optional detailed exhibits support component stops, cameras and variable construction sequences; command validation uses the selected project's stage range and preserves atomic rejection. Existing exhibits retain their five-stage behaviour.

Prepared Tuas research coverage, query trail, a separate verification pass, 18 source records and 38 scoped claim/illustration records. The Gate A brief proposes eight stops and nine stages focused on Phase 1 caissons and ground improvement, with labelled Phase 2 comparison and future targets. A Tuas-only 2 MiB GLB cap is proposed, not applied. Model authoring waits for explicit approval.

Validation: lint, TypeScript during production build, 21 unit tests, all 13 browser tests, geography/source/workflow/GLB checks and production build passed. The negative preflight `npm run workflow:check -- tuas` failed specifically because Gate A is absent, as intended. Browser regressions covered DTSS, selection/return, mobile and failed assets. Existing upstream Three.Clock deprecation remains. No new visual-quality or real-device performance acceptance is claimed; those belong to the detailed-build review and whole-app release.


## 2026-09-14 — Tuas approved build and Gate B candidate

Recorded the user's actual “Approve” message against `tuas-r1` and the Tuas-only 2 MiB GLB cap, then passed the build preflight. Authored and exported the Tuas-only Blender district with nine staged groups of marine preparation, fabrication, towing/placement, reclamation, ground treatment and terminal components. Added stage-level claim/revision extras and validation. No other marvel GLB changed.

Connected eight camera stops, evidence disclosures, placement/slipform/consolidation/container sliders and play/pause/reset. Temporary works appear in relevant stops rather than as permanent operating equipment. Corrected premature fill in the placement view, transparent ground cutaway visibility, and mobile canvas/controls separation during visual review. Tuas exit clears its native-map context; DTSS navigation remains unchanged. Historical eras show pre-project seabed context with dated explanations; future context retains explicit target/scenario labels.

Validation: 21 unit tests, all 15 browser tests, lint, TypeScript/build and source/geography/workflow/GLB checks passed. A final Tuas-only browser rerun passed after mobile framing correction. The first browser run hit an intermediate syntax error during editing; corrected before the clean full run. The production sample recorded zero page errors, 44 high-detail / 23 low-detail calls and roughly 16.7 ms frame intervals on the local Mac. Asset is 618,688 bytes. Combined JS/modules measured 998,933 gzip bytes, exceeding the unchanged 650 KiB target: publication remains blocked. Physical-device, fast-4G and memory checks remain open.

Delivered `docs/briefs/tuas-GATE-B.md` with walkthrough, source audit, screenshots, measurements and limitations. Register is awaiting acceptance, not accepted. No MRT research, deployment or LinkedIn materials were started.


## 2026-09-14 — Numbered Tuas structures for non-engineers

Responded to the user's request for DTSS-style labels. Added stable numbered structure callouts with leader lines and an accessible matching drawing key. Clicking either selects a plain-language component explanation with the existing claim evidence. The drawing stays in place instead of unexpectedly switching construction stages. Labels follow the moving caisson, tug, mould and AGV; temporary/absent geometry does not retain an incorrect label. Mobile callouts are constrained to the canvas, with leader lines adjusted to the visible labels.

No geometry, research baseline, approval or DTSS behaviour changed. Lint, TypeScript/production build, source/asset/workflow checks and all 16 browser tests passed. The three Tuas browser tests passed again after viewport containment, including numbered click-through, construction visibility, surcharge removal and mobile label bounds. Desktop arrival composition inspected in the live browser; mobile evidence is `docs/qa/tuas/numbered-mobile.png`. Existing release-budget/device limitations remain open; previous performance samples predate these annotations.


## 2026-09-14 — DTSS drawing key and reduced programme

Added a six-part “What am I looking at?” key to DTSS, matching the existing numbered model hotspots and camera stops with plain-language component purposes. No geometry changed. Made the key mandatory in the build standard, project instructions and brief template. Recorded the user's actual Tuas acceptance against af06f0c. Reduced the remaining programme to a maximum of four: MRT and Marina Barrage selected, polder and caverns recommended, other detailed developments deferred. Recommendations are not approvals or next-project start authorisations.

Lint, production build/type checks, source/asset/workflow validation and unit tests passed. All three DTSS browser tests and three Tuas browser tests passed; the new DTSS test checks drawing-key camera selection and reverse selection from a model hotspot. Inspected the DTSS key in the local production browser and restored the Singapore overview. No new research dossier, modelling or publication started.


## 2026-09-14 — MRT research and build brief

Recorded MRT start authorisation and prepared mrt-r1 Gate A dossier, 19-source register, 24-claim ledger and nine-stop visual brief. Challenged official date errors, construction-method conflation and stale forecasts. No detailed geometry/runtime change; MRT awaits research approval. Proposed original cutaway and separate Marina Bay case within unchanged budgets.

Validation: lint, content/geographic/workflow checks, unchanged asset checks and all 22 unit tests passed. The workflow hash check confirms the MRT GLB still matches its pre-approval baseline. No browser/runtime changes were made, so no new visual or frame-performance claims are made.


## MRT geographic station placement — 2026-09-14

Recorded the user’s station-alignment clarification in mrt-r1. Inspected the existing OneMap plan renderer and verified available official station/exit source categories. Added per-station provenance, coordinate preservation, discrepancy review and map-alignment acceptance requirements. Actual station ingestion and visual checks remain pending implementation; no claim that points have already been corrected.

## 2026-09-14 — Approved MRT detailed build

Recorded the user's actual “Approved” message for mrt-r1 and passed the modelling preflight. Authored the MRT-only Blender section and separate freezing diagram within 512 KiB / 35 meshes. Connected nine source-linked stops, twelve numbered component explanations, nine construction stages, alternative station methods, local mechanism playback and explicit return/reset controls.

Created a permitted, offline-reproducible 146-station map layer. Corrected the assumption that the LTA extract contained station points: it contains polygons. OneMap named station references are preserved and checked against those footprints. Corrected future-platform search matches (notably Ang Mo Kio CR11 versus operating NS16), excluded unopened stops, retained all reference comparisons and source hashes. No surveyed tunnels are inferred from the surface network.

Visual QA caught disconnected track/tunnel geometry, inherited low-contrast controls and overlapping mobile map panels; corrected each. A WebGL-unavailable test caught an empty scene and prompted an explicit readable fallback. DTSS/Tuas regressions passed. See `docs/briefs/mrt-GATE-B.md` for tests, measurements, screenshot walkthrough and remaining release blockers. MRT awaits user acceptance; no next marvel was started.

## 2026-09-14 — MRT accepted; Marina Barrage Gate A

Recorded actual user acceptance and next-project authorisation. Prepared barrage-r1 research, 20 claims, 11 primary-source records and a nine-stop visual brief with twelve drawing labels. Excluded unverified detailed historical phasing, dimensions and isolation choreography. No runtime code or model changes. Barrage awaits its own research approval; no approval or performance waiver inferred.

Validation for this research-only revision: workflow and content/geography validation, all 27 unit tests, lint, typecheck, asset validation and diff whitespace checks passed. Existing model files unchanged; no browser/production performance claims made for the unbuilt Barrage design. Updated workflow test fixtures to include the new claim/source ledger.

## 2026-09-14 — Marina Barrage Gate B candidate

Built nine-stop detailed journey, twelve numbered component explanations, original Blender asset, rain/tide modes, construction-water removal, assembly playback, freshwater milestones and optional proposed retrofit. Integrated selected-only map context and direct return. Visual QA corrected low contrast, overlapping mobile labels and an oversized mobile map card. See barrage-GATE-B.md for evidence, test results and open release requirements.

## 2026-09-15 — Marina Barrage accepted

Recorded the user’s actual “Approve” as Gate B acceptance of barrage-r1 at `9cfbe5d74f90e729cd47a3c9822543bc1bb5c4f9`. DTSS, Tuas, MRT and Marina Barrage are now accepted. No next marvel selected or authorised; existing release limitations remain. Documentation and workflow records only; no runtime or asset changes.

## 2026-09-15 — Surface camera framing

Responded to the user's screenshot of the tilted imagery rectangle and empty background. Wide zoom now progressively flattens and returns north-up; 3D entry moves to a viewport-aware district zoom before tilting. Overview photographic zoom-out is bounded, while selected network fits retain their previous lower zoom allowance. No geographic points, tiles, datasets or accepted exhibit assets changed. Local source/API inspection used MapLibre's pre-update camera transform hook. Lint, typecheck, 31 unit tests, production build and four surface browser tests passed; MRT/Barrage browser regressions also passed during the change. Live imagery screenshots: docs/qa/surface-framing. Provider coverage limits still exist; this change improves camera framing rather than inventing geography outside coverage.

## 2026-09-15 — Pulau Tekong research and five-demo release

Recorded actual start authorisation, selected reclamation as the fifth detailed demo, and deferred the other four. Prepared reclamation-r1: 24 claims, 12 source records, research query/coverage log, separate discrepancy review and nine-stop visual brief. Current facts are distinguished from historical quantities/forecasts; no detailed assets or runtime stories changed. Gate A remains pending. Added post-acceptance WIP catalogue, real-app showcase recording and Vercel hosting proposal. Existing JS/device release blockers retained; no deployment or posting.

Research-turn validation: `npm run validate` and `git diff --check` pass; workflow reports reclamation awaiting research approval and verifies the existing model hash. No runtime or geometry changed, so browser/build performance results are not newly claimed.

## 2026-09-15 — Tekong detailed candidate

Recorded user “approve” for reclamation-r1 and passed the build preflight before modelling. Added original offline Blender asset, nine-stage/nine-stop exhibit, fourteen source-linked component identities, dike reveal, ground/work-cell controls, distinct water routes and geographic context. Included historical hiding, envisioned crest, keyboard/reduced-motion/reading fallbacks and explicit map/overview returns. Preserved the eight other GLBs. Fixed mobile map crowding and construction/tour state leakage found during review.

Lint/type/34 unit/source/workflow/geography/asset/build checks pass; 24 distinct browser regression tests pass, with Tekong four rerun on final code. Local asset 231,188 bytes/2,892 triangles/33 meshes. Performance and source/visual limits recorded in reclamation-GATE-B.md; JS budget still blocks public release. Marked awaiting acceptance, not accepted. No WIP promotion, next marvel or showcase/publication performed before Gate B.

## 2026-09-15 — Post-Tekong release direction

Updated the release plan, roadmap and project instructions to use “Future build” for four deferred projects, distinguish five detailed demos after acceptance, complete whole-app checks and capture a captioned real-app showcase. Added the requested GitHub open-source audit/reproducibility work and replaced Vercel with user-led ChatGPT Sites hosting and a compatibility check. Confirmed GitHub authentication and no configured remote. No repository/upload, deployment, catalogue promotion or video capture performed; Tekong remains awaiting acceptance. Preserved the pre-existing packages/world/index.ts change.

## 2026-09-15 — Tekong drawing-key discoverability

The existing “What am I looking at?” drawing key sat below the tour and mechanism controls. Added a prominent “What am I seeing?” shortcut above the stop list, opening the key, focusing its summary and scrolling it into view. Respects reduced motion and historical geometry visibility. Production build, lint, typecheck and all four Tekong browser checks pass, including a mobile regression for reopening/focusing the key. Refreshed local production server on port 3001. Tekong remains awaiting acceptance.

## 2026-09-15 — Keep Tekong explanation consistent

User requested removal of the added “What am I seeing?” shortcut. Removed it and its shortcut-specific test; retained the standard “What am I looking at?” drawing key, numbered component buttons and explanations used by the other detailed exhibits. This supersedes the preceding discoverability shortcut.

## 2026-09-15 — Tekong accepted; release catalogue

Recorded user “Approve” as Tekong Gate B acceptance at 9ec97c063a44866de08a3872d544e3721b644f2d. Added workflow-derived demo readiness: five detailed demos, four Future build entries, a detailed-demo filter, selection-card labels and honest overview/starter labels. No further marvel research. Lint, typecheck, 34 unit tests, source/geography/workflow/asset checks and production build pass. New browser check verifies five/four counts, filtering and overview action. Updated local performance sample: 1,054,999 gzip JS bytes, above unchanged 650 KiB ceiling; real-device/GPU/cold-network and licensing checks still open. No final video capture or publication.

Final catalogue verification: all 25 browser regressions pass against refreshed production, including all five exhibits and new five/four readiness checks. See docs/qa/release/STATUS.md for unresolved release requirements.

## 2026-09-15 — Detailed and Simplified catalogue levels

User clarified all nine builds have useful detail. Renamed public levels to Detailed/Simplified, added outlined per-project badges at the right of the discovery row, compact count treatment and both level filters. Simplified projects retain entry to their existing demos. Acceptance records unchanged.

## 2026-09-15 — Static release preparation

Created private GitHub repository and configured origin without uploading source. Added separate static export and preview-origin support; updated README, Sites handoff, code license, attribution inventory, contribution guide and CI source/static-build checks. Inspected OneMap official terms; derivative/satellite permissions remain unresolved. Measured cold-network loading: atlas text 13.51 s and selected Tekong model 14.51 s, both over target. No budget waiver, video capture, public-source upload or deployment.

## 2026-09-15 — Faster initial atlas and private Sites candidate

Server-rendered the atlas chrome with hydration-safe controls, preloaded the 3D module on catalogue intent, and added a compressed static preview. Useful text improves to 662 ms; controls ready 2.45 s; cold selected model 7.68 s. Previous measurement used uncompressed transfer. No model/visual fidelity reduced. Clean-source build validated. Created Sites project and saved/deployed private version 1 for review. Public GitHub visibility remains pending read-versus-write clarification; no public-main privacy is possible.

## 2026-09-15 — Public source and matching homepage

User explicitly confirmed public code, protected main and a public Sites website. Published the clean source snapshot (without private working history/raw prompt files) to Darryl-e0697797/unseen-singapore. Main requires one approving review, the validate check and conversation resolution; force-push/deletion blocked, owner administration retained. Sites access is public. Found root route still served legacy portfolio while local use was /explore; changed root to atlas and preserved /portfolio. Public /explore loads the map and nine entries. Publishing Sites version 2 from 16363bc9125527f6024942469427d7b9959ba2d5. Other-device screenshot/URL difference still unconfirmed; do not infer hardware equivalence.

User confirmed the apparent device difference was the older landing page with its 3D-world link. Refreshed the retained /portfolio/ case study with current nine-exhibit scope, mechanisms, sources and honest Astra attribution. Published Sites version 3 and verified atlas/portfolio routes from a logged-out browser. Public atlas 25 browser checks pass; portfolio route regressions pass. Portfolio changes are on a review PR, preserving protected main. No final showcase recorded in this turn.

## 2026-09-15 — CI stabilization and cold-loading targets

Fixed production CI configuration, hydration-aware search, elapsed-time Tuas playback and early DTSS map camera selection. Added verified lossless model transport with native-browser fallback, parallel engine/model loading and hidden map work suppression. Public source 079b7d0b91103f897d44d17eb55882e4ba67f1bd passes both GitHub workflows: 36 unit tests and 34 browser tests. Required main checks now include verify and validate; PR #1 retains its review gate. All 15 local throttled cold measurements meet text/model latency limits (worst 0.679/4.644 seconds); no geometry change or size-budget waiver. Sites version 4 deployed successfully and all 26 hosted exhibit/map regressions pass. Local production 3001 refreshed. See docs/qa/release/CI-LATENCY.md for conditions and outstanding real-device/JS-size limits. No final showcase recorded.

## 2026-09-16 — Mobile entry gateway

Added a lightweight, statically rendered entry for phone/touch visitors at `/` and `/explore`. The explorer is imported only for large fine-pointer displays or an explicit full-experience request. Rotation does not automatically launch the world. The gateway contains the actual 60-second film (720p, about 3 MB, tap-to-play with `preload=none`, inline controls and English captions), an approximately 56 KB poster, five readable exhibit summaries, desktop guidance, copy-link with denied-clipboard fallback, and optional entry/return. No app models or engineering facts were changed. Existing mobile scene regressions now explicitly opt into the full world.

Validation includes narrow-width overflow, no unsolicited map/model/video requests, video playback/caption loading, clipboard, explicit entry/return, media failure and reduced motion. Physical iPhone/Android and LinkedIn in-app-browser playback/performance remain unmeasured; browser emulation is not real-device evidence. Public Sites deployment is unchanged by this local work.

Final gateway verification: static production export passed all 40 browser tests, including all nine model regressions and six gateway tests. All 36 unit tests, type checking and production/static builds passed. Lint has no errors; one pre-existing unused-variable warning remains in the showcase build-proof script. The development-server run had one DTSS timeout during concurrent source edits; the same test passed in the final production export without changes to DTSS. The three viewport checks were repeated only to capture local resource timing evidence.

## 2026-09-16 — Normal mobile browser compatibility checks

At the user's direction, continued with browser testing instead of physical-phone testing (different Apple Accounts prevent the available mirroring setup). All six added compatibility checks passed against the existing production static export: three in Playwright WebKit with an iPhone profile and three in Chrome touch emulation. Checked touch navigation, actual video playback advancement, loaded captions, rotation, clipboard denial and content/native video availability with JavaScript disabled. Targeted lint and type checking passed. No production app changes were needed. Physical iPhone and LinkedIn in-app-browser compatibility remain unverified; public deployment remains unchanged.

## 2026-09-16 — Mobile gateway published

Following “Looks good. Deploy to the ChatGPT site”, deployed the exact validated gateway to the existing public Sites address. Version 5 succeeded; seven target-origin checks passed, including mobile video playback/captions and desktop atlas catalogue behaviour. No access-policy changes, GitHub main changes or social posts were made. See SITES-HANDOFF.md for rollback/source identifiers.


## 2026-09-24 — DTSS visual upgrade preparation

User requested “Start next milestone”. Prepared docs/briefs/dtss-visual-r1/BUILD-BRIEF.md and proposal.json after source/material/rendering/budget audit and a PUB source refresh. Proposes bounded materials, lighting, camera and low-quality-path improvements; existing geometry, engineering scope and budgets remain. Gate A for the named revision is pending; no model, renderer or deployment changed. Accepted progress history stays intact. The first-build validator needs explicit upgrade-history support before reopening DTSS for implementation; do not bypass it or fabricate approval.

## 2026-09-24 — DTSS visual r1 candidate

Recorded actual Gate A approval and added a separately validated upgrade ledger, retaining accepted history. Implemented DTSS-owned material treatment, softened lighting/shadow filtering, grid-free backdrop, narrow-screen low-quality default and a skippable 2.4-second surface-to-section camera reveal. Flow is opt-in; reduced-motion and page visibility respected. Existing GLB, geometry and engineering content unchanged. Lint/types/39 deterministic tests, production build/validation, 26 existing browser regressions and three new DTSS checks pass. Gate B package: docs/briefs/dtss-visual-r1/GATE-B.md. Cold model loading passes 5 s; first text/JS and device/GPU requirements remain open. No push/deployment/posting.

## 2026-09-25 — Blender showcase revision 2

Added the latest portrait/landscape music exports, actual Blender-window assembly replay segment, portable Blender source/package and capture qualifications. Both 45-second exports passed full decoding and format checks. GitHub sync includes the DTSS visual candidate for review; no visual acceptance or website deployment is implied.
