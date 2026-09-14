# Tuas Port — Gate A review, tuas-r1

Prepared 2026-09-14. **Awaiting your approval. No detailed modelling authorised yet.**

## The proposed experience

**“Before a ship can berth, build the ground beneath it.”**

Open on a recognisable operating container-port scene. Let the visitor follow a container, then peel away the deck and quay to discover the caisson wall and improved ground. Rewind into construction: prepare the seabed, fabricate a caisson, float and place it, fill behind it, improve the ground and bring the terminal into operation. The memorable moment is a large caisson descending into a cutaway water section, followed by an interactive ground-improvement explanation.

The engineering core is Phase 1. A separate, clearly labelled Phase 2 comparison explains documented changes without blending methods into a supposedly real single contract. Future context stays distinct from today's operating scene.

## Research result and limits

The [research dossier](../research/TUAS-RESEARCH.md) records coverage, a second verification pass, source discrepancies and exclusions. The [claim ledger](../../content/workflow/tuas-claims.json) contains 38 statements/illustrative choices, linked to 18 [source records](../../content/workflow/tuas-sources.json). Not all sources are independent: MPA publications share an origin and the geotechnical paper has project-team authors.

Latest operating evidence: [PSA, 6 August 2026](https://www.singaporepsa.com/2026/08/06/tuas-port-marks-25-million-teus-as-psa-singapore-advances-the-future-of-port-operations/) reports 14 operating berths. Use a dated status, not a live count. Long-term capacity is a target, not present throughput. Target discrepancies are visible in the dossier rather than silently reconciled.

The model can explain component function, construction relationships and the reasoning behind the method. It cannot establish exact phase boundaries, cell/rebar geometry, tow/ballast procedures, foundation depths, operational tolerances across all areas or a validated settlement/traffic model. Unverified dimensions remain visibly illustrative.

## Storyboard and interaction decisions

| Stop | Opening composition and action | Visitor learns | Claim IDs (tuas- prefix) |
| --- | --- | --- | --- |
| 1. The port today | Oblique harbour view with ship, quay, yard and one moving container. Select present/planned context. | What operates now; capacity versus throughput. | operating, capacity, automation |
| 2. Why move west? | Return to native Singapore map; highlight Tuas and the former/current terminal contexts. Select dated milestones. | Consolidation, planning and land-use trade-offs. | consolidation, rationale, waterfront |
| 3. Build a foundation | Water becomes a sectional plane. Reveal an indicative sand replacement zone where needed and prepared rock mound; scrub preparation. | A caisson needs supported, prepared ground. | foundation, rock-mound |
| 4. Make the giant | Move to an explicitly representative casting bay. Reveal concrete envelope, simplified cells, reinforcement and rising formwork. Toggle process labels. | Fabrication and safer repeatable production. | caisson-scale, rebar, slipform, geotextile |
| 5. Float, place, retain | Follow a schematic tug/caisson movement; pause towing, immersion and seating. Reveal fill behind and within the wall. | Why the caisson is a retaining and berthing structure. | float-place, caisson-function, reused-fill |
| 6. Turn fill into a platform | Open a ground cross-section. Toggle preloading and drainage; animate qualitative water escape/settlement, then reveal instrument symbols. | Why ground treatment and measurement matter. | drains, monitoring, settlement |
| 7. Assemble the working terminal | Reveal deck, crane, yard and AGV route. Follow one container through quay-to-yard hand-off. | Civil works and systems integration are different steps. | terminal-interface, automation |
| 8. Build for decades | Compare Phase 1/2 evidence and future targets; show sea-level datum, environment and logistics context. | Resilience, maintenance questions and future uncertainty. | elevation, environment, corals, phase2-methods, supply-chain, energy-target |

Use an original architectural palette: warm concrete, muted steel, deep water, restrained equipment accents. Create readable materials, contact shadows and depth cues. No copied agency imagery, logos, engineering drawings or vessel replicas. No random glowing lines.

Construction playback will have **nine** selectable states: context → seabed preparation → caisson fabrication → tow → placement → reclamation fill → ground improvement → terminal works → operational reference. These are educational milestones with parallel work compressed for explanation, not a contract schedule. The camera tour and construction stages are separate controls.

## Map and time

- Activate Tuas context only on Tuas selection; keep the initial Singapore discovery view unchanged.
- Native map markers: Tuas, Pasir Panjang, Keppel/Brani/Tanjong Pagar context and Sultan Shoal where supported as geographic orientation. Labels explain relevance and approximate placement; no navigational routes or property boundaries are claimed.
- Show phase status as a legend and labelled context, not invented official phase polygons. The detailed pier district is a separate schematic exhibit.
- Preserve the existing 2D plan / photographic 3D context controls and explicit “Back to Singapore”. Return restores ordinary discovery and clears project layers.
- 1950s: pre-project regional/maritime context; no fabricated dated shoreline. 1965: before the container-port decision. 2000: Pasir Panjang milestone, Tuas pre-project. 2026: dated operating/building status. 2050: target/scenario context, not a guaranteed completed digital twin.
- Same-camera era comparison changes sourced status and selected schematic states; present-day map imagery remains explicitly current context.

## Component inventory and geometry policy

| Component | Authoring treatment | Must not imply |
| --- | --- | --- |
| Sea, seabed, replacement zone, rock mound | Original section with material differentiation and selectable layers | Surveyed bathymetry or a universal foundation profile |
| Caisson and quay | Rounded published outer envelope; clearly schematic cells and joints | Exact internal structure or structural certification |
| Casting bay / rebar / slipform | Functional original assemblies and short sequence | A traced factory or specified reinforcement design |
| Tugs / placement equipment | Low-poly functional silhouettes | Actual vessel specification or approved marine procedure |
| Fill, cap, preload, drains | Exaggerated explanatory cross-section | Real spacing, soil parameters or consolidation prediction |
| Monitoring symbols | Instruments labelled by purpose | Live site measurements or a maintenance timetable |
| Ship, quay/yard cranes, AGV, containers | Instanced original models; one illustrative logistics cycle | Real dispatch software, control logic or validated capacity |
| Climate/environment callouts | Source-linked narrative plus explicit datum/target labels | Zero environmental impact or guaranteed resilience |

Create repeatable Blender scripts with named components, stage IDs and metre conventions. The runtime handles reversible camera/visibility/animation states. The optional detailed-exhibit schema links stops and stages to claims. No new live AI service; the authored guide remains labelled.

## Proposed budget, subject to this approval

The current Tuas starter is capped at 512 KiB. **Request a Tuas-only detailed GLB cap of 2 MiB**, matching the accepted DTSS cap; do not change enforcement until Gate A approval. Keep initial country loading lazy with no Tuas asset fetched before entering its story. Keep 35 authored stage/material groups where feasible and remain within the shared 150/90 desktop/low draw-call ceilings, 120k/60k active triangles and 1024 texture limit. Use instancing and a low-detail option; no new heavyweight rendering dependency.

Keep the existing timing targets: useful text ≤2.5 s and interactive 3D ≤5 s on the documented fast-4G baseline; orbit ≥45 FPS desktop / ≥30 mobile. Real hardware and decoded-memory checks remain release evidence, not assumptions derived from a fast local Mac. If these limits cannot be met, reduce detail or return with a justified revised brief rather than silently raise them.

## Gate B acceptance checklist

- Present state is understandable before entering the construction story.
- All eight camera stops and nine stages explain their intended component/mechanism.
- Caisson sequence can pause/reset; ground improvement is visibly informative and labelled qualitative.
- Source links and phase applicability accompany engineering assertions; conflicts/unknowns remain discoverable.
- Initial overview, native map, story entry, back/reset and reselection work without project takeover.
- Desktop/mobile, keyboard, reduced motion, failed map/model loads and readable fallback checked.
- Lint/type/unit/browser/asset/source/build checks pass; regression includes DTSS.
- Production preview and performance results accompany the review; evidence differentiates local and real-device measurements.
- User accepts the exact build; MRT research begins only after explicit next-project authorisation.

## Approval requested

Approve **tuas-r1**, including the Phase 1-focused story, labelled Phase 2 comparison, schematic exclusions and Tuas-only 2 MiB budget proposal, or request revisions. No Gate A approval is recorded yet.
