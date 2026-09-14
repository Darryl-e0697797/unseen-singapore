# Architecture decisions

## ADR-001 — Web canonical, Unreal optional (2026-09-14)
Accept Next.js + TypeScript + React Three Fiber/Three.js. URL access and progressive rendering outweigh a native engine's cinematic fidelity. No Unreal installation found; no requirement to install it.

## ADR-002 — Versioned structured content first
Accept JSON + Zod, npm workspace with shared source packages. Avoid a database until editing/query requirements demand one. Validation is executable and colocated with contracts.

## ADR-003 — Schematic first, no invented coordinates
Do not import unreviewed national geometry. Initial local teaching scene deliberately has no geographic anchor; all meshes labelled SCHEMATIC. Singapore silhouette provides orientation only. Sourced facts are DOCUMENTED independently. GIS expansion needs licence and datum review.

## ADR-004 — Authored controller before model service
No supplied credentials and no need to block deterministic interaction. Use honest local intent routing and curated narrative levels. Same strict command boundary later accepts model output. No user question leaves device in this version.

## ADR-005 — Reproducible Blender proof
Install Blender cask when missing, generate representative cutaway and lower LOD. Export original authored geometry; do not download agency media. Verify axis fixture and browser selection before first slice.

## ADR-006 — Stable local units
Metres throughout, X east / Y north / Z up in Blender and X east / Y up / Z south in browser. glTF converts once. Local schematic scenes have no WGS84 claims.

## ADR-007 — Scope gate and source status
Phase 2 commissioning is scheduled from 2027 per PUB accessed 2026-09-14; never show all DTSS as operating in 2026. Historical and future UI stay unavailable until data exists. No simulated numeric outputs.

## ADR-008 — Performance proportional to payload
First small GLBs are uncompressed and texture-free. Export two LODs, instance context buildings, lazy-load canvas. Introduce compression only when it saves more than decoder cost. Local Node 26 tested; pin Node 24 LTS for CI/deployment after compatibility verification.

## ADR-009 — Pin compatible React
The registry latest React 19.3 is outside React Three Fiber 9.7's >=19 <19.3 peer range. Use React/React DOM 19.2 with the lockfile rather than forcing incompatible peers. Retest before framework upgrades.

## 2026-09-14 — Expand to a national engineering atlas

The user explicitly requested a much deeper, navigable 3D world and a five-era timeline. The earlier DTSS vertical slice stays at `/` as the portfolio entry, with `/explore` as the dedicated immersive experience. Nine project dossiers include the original themes and two underground examples. Default era is 2026; default exhibits show the completed explanatory structure with current operating/planning status visible.

The national map and local exhibits use separate scales. Natural Earth provides cleared, generalised context in SVY21-derived coordinates; nine approximate thematic pins open original local-metre Blender scenes. This preserves an extensible geographic hierarchy without pretending an exhibit is accurately positioned or dimensioned. A 2050 lens cannot imply a common completion promise. Historical years change project evidence/status and retain spatial orientation; verified historical coastlines remain an explicit missing dataset.

New deterministic commands live in `packages/world`, separately from the established DTSS command contract. Authored question routing selects a project, era and construction stage; unknown commands fail atomically. No live language model is silently claimed. Existing interfaces remain backwards compatible.

Construction meshes carry stage extras. Blender batches geometry by stage/material, so playback hides/reveals physical assemblies. Exploded views and close inspection use the same asset. The port includes schematic caisson cells, reclaimed ground, cranes, hoists, a tapered ship hull, container detail and AGV scale cues. Animations explain dependencies; no engineering simulation is claimed.

Model recommendation: GPT-6 Astra with xhigh reasoning for architecture, source synthesis and difficult 3D implementation; high for routine development; max for bounded critical reviews. Raising effort alone does not supply historical datasets, site-specific technical models, expert validation or production art direction.

## Geographic surface, 2026-09-14

Use OneMap’s documented raster embedding service for legible Singapore street context, and independently attributed OSM footprints for limited CBD extrusion. Keep the basemap and schematic engineering exhibits in separate renderers/scales. Preserve the map instance on story entry so returning restores geographic orientation. Serve MapLibre v6’s module worker and matching shared module together from generated public files. Do not imply the community heights are surveyed, or that a present-day map represents 1958/2050.


## 2026-09-14 — Explicit sequential approvals and extensible exhibits

The user's new two-gate instruction supersedes the earlier preparation-only policy. Store actual approval evidence with a research revision; never infer approval from a passing build. DTSS acceptance is grandfathered without representing engineering certification. Tuas research is authorised, but modelling is paused at Gate A and all later research is queued.

Keep legacy exhibits compatible via optional claim references and detailed-exhibit metadata. New detailed stories may have their own component tour and construction-stage count; map logical stages to authored model stage IDs. Validate commands against the selected exhibit and reject invalid batches atomically. Keep source-review obligations explicit: automated references and provenance checks do not prove a claim true.

The Tuas research baseline proposes a Phase 1 engineering core with clearly separate Phase 2 comparison. Exact unavailable geometry, ballast procedures and numeric simulations are excluded. Any asset-budget increase requires approval of the brief before enforcement changes. Whole-app acceptance precedes LinkedIn material production; deployment and posting have separate authorisations.


## Tuas detailed candidate: phase separation and measurable limits

Within approved `tuas-r1`, use role-tagged Blender groups for temporary and permanent components. Explicit camera stops and nine construction stages are independent; interactions explain mechanisms without physical simulation. Phase 2 is a source-based comparison over the labelled Phase 1 teaching district, not a fabricated second as-built model. Earlier eras remove the port geometry; later targets remain scenarios.

The mobile Tuas model stays visible above an independently scrolling story so controls visibly affect it. This change is scoped to Tuas to preserve DTSS. Combined JavaScript transfer exceeds the inherited budget despite modest geometry and local frame performance. Record this as a release blocker; do not reinterpret the user's model-byte approval as permission to raise JavaScript or hardware budgets.


## Tuas structure identification

Use stable structure numbers separately from chronological construction stages: a caisson remains structure 04 when the drawing changes. Pair technical names with familiar descriptions (concrete wall, driverless carrier, rising mould), and provide one purpose explanation per selected structure. Label selection preserves the drawing, camera and stage so readers can connect the explanation to the object they clicked. These annotations interpret the existing approved evidence; they do not imply survey precision.


## Reduced remaining programme and drawing literacy

Treat MRT and underground construction as one detailed marvel. Prioritise MRT and Marina Barrage, recommend Pulau Tekong polder third and Jurong Rock Caverns as an optional fourth. Keep the existing starter exhibits without committing to detailed development of all nine. A machine-readable programme separates selected, recommended and deferred projects; workflow validation blocks research/build outside the selected set. Two-gate approval requirements continue unchanged.

Every detailed exhibit needs a “What am I looking at?” key with stable numbers, everyday names, component purposes and a visible connection to the drawing. DTSS uses its existing component-tour numbers; Tuas retains its structure numbers independent of construction stages.


## 2026-09-14 — MRT research and build brief

MRT is one bounded underground-construction exhibit. Pair an original station/TBM teaching section with a separate labelled Marina Bay freezing case; do not create a fictitious combined real station. Preserve the 512 KiB asset ceiling. Specific network coordinates must pass geographic provenance validation; unknown survey detail is excluded. Gate A applies to mrt-r1 before modelling.


## MRT geographic station placement — 2026-09-14

MRT station placement will use verified geographic anchors rather than positions traced from a schematic network map. Separate station, exit and story-landmark identities. The Gate A brief now requires coordinate and visual comparison checks; no runtime/model changes.

## MRT — Reference identity before positional agreement (2026-09-14)

Use an explicitly identified OneMap named platform/station reference for each network node and retain the LTA station polygons for comparison. A source polygon centroid, exit and interchange platform are different reference types. Preserve originals, check SVY21/WGS84 conversion, investigate future-platform matches, and record differences rather than averaging them. Generalised route vertices reuse exactly the rendered station anchors. Unopened stations require status evidence independently of their presence in a geographic dataset.

The detailed section stays in local schematic coordinates. Original Blender geometry and qualitative construction playback cannot acquire surveyed accuracy from nearby map references. MRT's local GLB/mesh budget remains unchanged; the existing whole-app JavaScript overrun stays an open release blocker, separate from Gate B product acceptance.

## 2026-09-14 — MRT accepted; Marina Barrage Gate A

Recorded actual user acceptance and next-project authorisation. Prepared barrage-r1 research, 20 claims, 11 primary-source records and a nine-stop visual brief with twelve drawing labels. Excluded unverified detailed historical phasing, dimensions and isolation choreography. No runtime code or model changes. Barrage awaits its own research approval; no approval or performance waiver inferred.

## 2026-09-14 — Marina Barrage implementation

Recorded explicit barrage-r1 Gate A approval, then authored only Barrage using BARRAGE_ONLY. Separate compressed site and enlarged displaced gate/pump section preserve spatial honesty. Weather choices switch the explanatory view as needed; no excess rain leaves pumps idle. Twelve stable part numbers use leader lines and a spaced mobile row. Native map markers remain approximate and omit upstream branches; direct map return was added. Nine construction controls remain conceptual and distinguish the future proposal. Unchanged 512 KiB / 35 mesh budget passed. Existing JavaScript and real-device release blockers remain; no next marvel authorised.

## 2026-09-15 — Marina Barrage accepted

Recorded the user’s actual “Approve” as Gate B acceptance of barrage-r1 at `9cfbe5d74f90e729cd47a3c9822543bc1bb5c4f9`. DTSS, Tuas, MRT and Marina Barrage are now accepted. No next marvel selected or authorised; existing release limitations remain. Documentation and workflow records only; no runtime or asset changes.

## 2026-09-15 — Frame regional imagery as an atlas

Use zoom-dependent tilt and bearing limits to avoid exposing a tilted rectangular photographic sheet at island scale. Keep close views dimensional; broad views become north-up. The 3D context button chooses an appropriate minimum district zoom. Retain selected engineering-network fit bounds and source attribution. Do not introduce a new imagery provider or fabricated terrain to hide the provider's coverage edge.

## 2026-09-15 — Five-demo release and Tekong scope

User selected Pulau Tekong as next and requested five detailed-demo indicators with other projects WIP. Scope is DTSS, Tuas, MRT, Barrage, reclamation. Research revision reclamation-r1 proposes a polder section with distinct water paths and source-linked components. Do not conflate product readiness with real-world infrastructure status. Gate A is still required before geometry; WIP UI follows acceptance. Record actual app interactions for the showcase after integration review; use Vercel as the hosting candidate, subject to release, account/plan and deployment approval.

## 2026-09-15 — Tekong teaching section and native geographic context

Keep the polder as an explicitly compressed continuous section, with temporary works and alternative/future states isolated from current geometry. Use two distinct station functions without inventing installed pump counts. Source-backed mechanisms use qualitative controls, not simulations. Native map overlays show a manually generalised dike segment and pond context; no station pin or surveyed boundary is inferred from publicity artwork. Hide unrelated discovery UI on selected mobile map views while retaining prominent return and entry. Tekong waits for visual acceptance; five-demo/WIP work follows that acceptance.
