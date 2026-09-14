# MRT & underground construction — Gate A build brief

**Revision: mrt-r1 · prepared 2026-09-14 · approved by the user (“Approved”) on 2026-09-14.**

User authorisation: “Go, start the MRT & underground construction”. This started research; the subsequent “Approved” message approved mrt-r1. See content/workflow/approval-evidence.md. Tuas remains accepted; Marina Barrage remains queued.

## Review decision

Approve a connected educational exhibit titled **A city beneath a city**, with a recognisable Singapore map, an original station-and-tunnel cutaway, nine story stops, interactive construction, and a separate Marina Bay freezing case study. No surveyed station replica is proposed. Preserve the 512 KiB MRT GLB ceiling; no budget increase requested. If the proposed environment cannot meet it, simplify decorative geometry first and return for approval before changing scope or budget.

The expected visual centrepiece is a street that opens into a deep station section: visitors follow people down, rewind to construction, and see how the surrounding ground stays supported. A close camera then enters the boring machine and follows the installation of a tunnel ring. Numbered structures explain the view at every point. These are proposed visuals, not existing implementation.

## 1. What exists now

Singapore has an operating rail network with underground and elevated sections. The construction focus here is underground stations and bored tunnels; this must not imply all MRT is underground. Current context includes the completed Circle Line loop. Other extensions retain dated planned/construction labels until an opening is verified.

The starting view after MRT selection is national context. The opening detailed scene shows a completed, representative station with train, concourse, platform, access and tunnel lining. It begins with the passenger purpose, then rewinds the works. Bencoolen, Rochor and Marina Bay are real contextual anchors, not names for the composite station.

Existing implementation: a starter MRT world GLB and generic world storyline. They are not an accepted detailed exhibit. Preserve the baseline asset until Gate A. Read for this brief: ENGINEERING-MARVEL-STANDARD, USER-EXPECTATIONS, MARVEL-WORKFLOW, SOURCE-PROVENANCE, ARCHITECTURE and PERFORMANCE-BUDGET.

## 2. Evidence and accuracy

The [research dossier](mrt-RESEARCH.md) records coverage, queries, verification and exclusions. The [claim ledger](../../content/workflow/mrt-claims.json) holds 24 assertions/design interpretations with passage locators. The [source register](../../content/workflow/mrt-sources.json) holds 19 sources, dates, applicability and reuse restrictions. Facts are documented or qualified; authored geometry is schematic. Only the 2050 continuation is envisioned.

Government/client accounts are not automatically independent corroboration. The manufacturer provides an additional source for the generic EPB mechanism, not a Singapore contract attribution. No official photos, drawings, map artwork or underground GIS will be bundled. Unknown dimensions stay unknown; exact geometry requires a new evidence/approval decision.

## 3. Storyboard

Claim IDs below have the prefix `mrt-`.

| Stop | Visitor question | Visual and camera | Interaction / evidence |
|---|---|---|---|
| 1. The journey today | What does this space do? | Surface entrance → concourse → platform → tunnel; warm station lighting against earth section | Follow a schematic passenger path, inspect numbered parts; visual, dtl-purpose, rings |
| 2. Why a railway? | Why was the investment made? | Return to native map; settlement-to-city connections | Toggle historical context and dated future projects; rationale, opening, era2000, current-loop |
| 3. Find room underground | What is already in the way? | Section reveals separate utility, foundation and rail layers | Reveal constraints and investigation markers; investigation, monitoring. No invented survey log |
| 4. Hold the ground | Why build walls before digging? | Close view of one wall panel, then wider excavation | Scrub panel construction and compare supported excavation; wall, topdown, bottomup |
| 5. Build beneath the roof | How does a station take shape? | Fixed three-quarter section with access opening visible | Top-down playback; independent bottom-up comparison; topdown, bottomup. Never combine the two sequences |
| 6. Bore and line | How is a tunnel made? | Camera travels from cutter to shield tail and finished ring | Qualitative advance/extraction balance; assemble a ring and reveal grout; epb, rings, grout, logistics |
| 7. Protect the city | How do nearby structures stay usable? | Monitoring markers over the station; named Rochor context card | Inspect support/load-path arrows and monitoring purpose; monitoring, rochor. No calculated movement |
| 8. A temporary frozen barrier | Why would engineers freeze the ground? | Explicit transition to separate Marina Bay case diagram | Grow/merge frozen zones, reveal excavation, then remove temporary treatment in completed mode; freeze |
| 9. From civil works to service | Why isn’t a finished tunnel ready for trains? | Return to main station, reveal track/systems and then operating scene | Switch construction → fit-out/testing → passenger operation → maintenance explanation; testing, renewal; finish with Back to Singapore |

Stop count is independent of construction-stage count. Expanded engineer notes remain optional; the first paragraph and drawing key must make sense without them.

## 4. Geographic and temporal context

Native map overlay appears only after MRT selection. Show all six operating MRT lines as **generalised network corridors** with named termini and interchanges; show underground/elevated status only where checked, otherwise leave it unspecified. Link the agency map for comparison. LRT, depot sidings and every service track are outside the detailed network scope and labelled omitted. No short arbitrary corridor ends presented as the whole network.

Context pins: Toa Payoh (first service), Bencoolen/SMU (depth and city context), Rochor (diversions), Marina Bay (separate freezing case), and Cantonment/former Tanjong Pagar Railway Station (CCL6 context). Coordinates must be verified at build time from permitted existing geographic data or source-backed station anchors. Mark them approximate; straight/generalised connections are not tunnel alignments. Do not trace source map artwork as if it were GIS. Precise underground alignments and depths are excluded.

| Era | Display rule |
|---|---|
| 1950s / 1958 UI | Pre-MRT operating state. No underground railway fabricated; present-day basemap labelled |
| 1965 | Pre-service planning context; no exact 1965 proposed network drawn |
| 2000 | Established original railway and emerging later plans; no modern detailed station passed off as a 2000 structure. Use contextual text where historical route evidence is insufficient |
| 2026 | Dated operating network, including CCL6; TEL5/DTL3e kept as announced targets until opening confirmation. Construction mode is an explicit historical rewind |
| 2050 | Envisioned continuation with dated official programmes in notes. No invented official 2050 network |

The live plan and photographic basemap remain present-day context in every era. Future lines use distinct dashed styling, not the operating-line style. Source freshness is checked again before implementation of status labels and before release.

### Station-position acceptance requirement — user clarification

Station points must align with the geographic map, not with the layout of the schematic rail diagram. Use LTA station-point data as the primary candidate, cross-check against OneMap, and record the source feature ID, station name/code, coordinate reference system, source date and anchor type. LTA publishes station points separately from exit points: an entrance, platform/station reference and nearby landmark are not interchangeable. Never place a station at the SMU or former railway-station landmark merely because that landmark anchors a story.

Preserve the chosen geographic anchor through coordinate conversion and rendering (implementation tolerance ≤1 metre against the source point, not a claim of survey accuracy). Flag differences over 25 metres between like-for-like reference points for documented review; do not average or silently snap them. Different entrances/platforms at an interchange require explicit identities or a labelled composite anchor. Missing or conflicting stations cannot be filled with guessed coordinates.

Route geometry may be generalised between stations, but its station vertices must use the exact same anchors as the point layer. Move labels with leader lines to avoid collisions; never move station points for layout. Check alignment with the existing OneMap rail depiction at neighbourhood/street zooms, in plan and tilted views, desktop and mobile. A displaced basemap text label is not a coordinate reference. Keep station labels distinct from case-study/landmark pins and project-entry markers.

Gate B must include coordinate comparison results for every rendered station plus visual checks of all five story anchors and representative interchanges. Any unexplained mismatch remains an acceptance failure. These are required checks for implementation, not checks already passed on an unbuilt overlay.

## 5. Component inventory: “What am I looking at?”

Numbers identify structures, not playback stages. Every item has a plain-language purpose, matching on-model button and selected key explanation. In the separate freezing scene, only its relevant numbers appear.

| No. | Plain-language label / purpose | Claim | Visibility |
|---|---|---|---|
| 01 | Station access — the route from street to train | visual | Completed/fit-out |
| 02 | Retaining wall — holds soil beside the excavation | wall | After installation; remains in cutaway |
| 03 | Temporary braces — support the excavation during work | topdown, bottomup | Applicable supported stages only |
| 04 | Roof and floor slabs — permanent levels of the station | topdown | Progressively constructed |
| 05 | Work opening — access for excavation beneath the roof | topdown | Top-down construction; closed in operation |
| 06 | Boring machine — cuts and supports the advancing face | epb | Tunnelling only |
| 07 | Spoil conveyor — takes excavated material rearward | epb | EPB mechanism view |
| 08 | Tunnel rings — permanent concrete lining | rings | Ring assembly onward |
| 09 | Annular grout — fills the gap outside the lining | grout | Reveal/assembly section; never loose soil |
| 10 | Monitoring instruments — track construction effects | monitoring | Construction/protection view; qualitative markers |
| 11 | Freeze pipes and frozen ground — temporary treatment at Marina Bay | freeze | Separate historical case only |
| 12 | Railway systems — track, power and control need integration and upkeep | testing, renewal | Fit-out/completed modes; generic representative components |

Keyboard selection must match pointer selection, with focus indication and announced explanation. On mobile, preserve visible model space while the key scrolls. Hide callouts for absent components, keep numbers stable, and draw leader lines to the selected visible part. Avoid two duplicate lists performing the same task.

## 6. Construction, assets and limits

Main top-down playback proposal: (0) preparation/constraints; (1) retaining walls; (2) shallow supported excavation; (3) roof with opening; (4) excavation and intermediate levels; (5) base/internal completion; (6) representative tunnel boring/lining; (7) railway fit-out and testing; (8) reinstated operating station. This is a compressed teaching sequence: real contracts overlap and tunnel launch/reception order varies. Stage 6 is a separate workstream presentation, not an assertion tunnels always follow station completion. Each stage gets evidence-linked metadata.

Bottom-up is an alternative method view, reusing the section; it does not overwrite the primary stage sequence. Wall-panel, ring-assembly and freezing controls are local mechanism timelines. Play/pause/reset is explicit. The finished scene must remove TBMs, temporary openings/braces and frozen ground where appropriate. No excavation animation runs in the default operating state.

Blender authors the original MRT-only asset offline through reproducible scripts. Use local schematic coordinates in metres, human/train scale references, procedural materials, instancing, cutaway groups and low LOD. No runtime Blender and no underground models from OneMap. Segmentation/spacing is illustrative; no universal ring count or surveyed depth. Load only on story entry, dispose resources on exit, stop motion in background/reduced-motion mode. Separate case geometry stays in the same bounded exhibit, not a second unbudgeted district.

Budgets remain: MRT GLB ≤512 KiB; active triangles ≤120k desktop/60k low; calls ≤150/90; total requested JS ≤650 KiB gzip, critical non-3D ≤250 KiB; textures ≤8 MiB decoded; target GPU memory <128 MiB; orbit ≥45/30 FPS; useful text ≤2.5s and 3D ≤5s on fast 4G. The existing combined-JS overrun remains a whole-app release blocker. Local Mac results cannot satisfy ordinary-device evidence. Do not trade away explanatory mechanisms for ornamental detail.

Excluded: exact station architecture, surveyed geology/routes, real-time train operations, ventilation/fire/evacuation simulation, numerical settlement/pressure/thermal modelling, detailed blasting or maintenance procedures, complete contract programmes and a new live AI service.

## 7. Navigation and acceptance

Singapore overview → select MRT → native map context → Enter engineering story → stops/mechanisms → Back to MRT map or Back to Singapore. Reset restores the opening completed state, camera and key. Exit removes MRT overlays and restores discovery controls. Repeat selection must behave identically; DTSS and Tuas remain unchanged. Leave the browser at normal Singapore overview after QA.

Gate B requires source/claim/asset validation; lint/type/unit/build; browser tests covering all stages, key/model synchronisation, absent-component labels, alternative-method reset, separate freezing-scene reset, repeated entry/back and timeline state. Test tile/asset failure, WebGL fallback, keyboard/reduced motion, mobile clipping and camera framing. Inspect motion as well as stills; measure production transfer, calls/triangles, load time and frame cadence. Record device/network conditions and unmeasured risks. Deliver walkthrough, screenshots, source audit and limitations for user acceptance.

**Approval recorded:** mrt-r1 was approved by the user on 2026-09-14. The proposed baseline above is retained as the design record. Implementation evidence and limitations are in mrt-GATE-B.md. Gate B acceptance remains separate.
