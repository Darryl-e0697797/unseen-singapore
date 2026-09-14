# Pulau Tekong — Land below the sea

**Gate A: reclamation-r1 — approved by user on 2026-09-15 (“approve”).** Prepared 2026-09-15. Authorised scope: the fifth detailed engineering demo, followed by WIP treatment for the four remaining starter projects. No next marvel is authorised. Read: engineering standard, user expectations, workflow, architecture and performance budget.

[Research and conflicts](reclamation-RESEARCH.md) · [24-claim ledger](../../content/workflow/reclamation-claims.json) · [12-source registry](../../content/workflow/reclamation-sources.json)

## 1. First impression and purpose

Begin with present-day northwest Pulau Tekong on the map, then enter a recognisable coastal landscape. Opening question: **“How can dry land sit below the sea?”** A labelled sea-level reference and a continuous section connect the outside water, dike and low interior. Present the completed infrastructure using the latest source milestone, without asserting when military training commenced.

The hero moment is an oblique landscape becoming an explorable section. Visitors first understand the whole, then reveal the material layers and water pathways. Keep the warm architectural palette and numbered drawing language of the accepted exhibits.

## 2. Story stops and engineering scope

Claim suffixes below refer to the linked ledger; it is the factual baseline. Each stage remains a teaching reconstruction, not a day-by-day contractor programme.

| Stop                                | Visitor question                  | Scene / purposeful interaction                                                                                          | Claim suffixes                              |
| ----------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1. Land below the sea               | What am I looking at?             | Coast-to-interior overview; horizontal reference plane; key highlights matching geometry.                               | present, levels, teaching                   |
| 2. A different way to make land     | Why choose a polder?              | Same-scale conceptual infill/polder sections; toggle fill volume qualitatively, not a quantity calculator.              | purpose, design, present                    |
| 3. Make the ground ready            | Can soft ground carry the works?  | Section inset shows drainage strips and temporary loading; scrub compression with exaggerated movement labelled.        | ground, marine                              |
| 4. Build where the water is         | How do structures go below water? | Local work cell; dry it, assemble an outlet, complete the corresponding barrier segment, remove temporary works.        | outlets, temporary, contract                |
| 5. Inside the dike                  | What keeps the sea out?           | Peel back facing and core, revealing the internal barrier and landward collector.                                       | barrier, surfaces                           |
| 6. A landscape with plumbing        | Where does rain go?               | Whole-system flow map and section; distinct pathways, omitted branches marked.                                          | water, network                              |
| 7. Two different pumping jobs       | Why are there two stations?       | Dry-weather and wet-weather teaching states; animate each appropriate route; keep named stations visibly distinct.      | pumps, trigger                              |
| 8. Finish, check and maintain       | What makes the system dependable? | Dated commissioning cards; inspection emphasis. Optional small barge-recovery vignette explains construction logistics. | completion, operator, monitoring, logistics |
| 9. Adapt without raising everything | What could change later?          | Return to coast; optional translucent crest extension with future-scenario badge; Pulau Unum context remains separate.  | environment, future                         |

Construction playback has separate dependencies for marine preparation, local outlet work, closure/protection, ground treatment, water infrastructure, testing and current state. It must not imply that every operation happened once in a strict global order. Story navigation can visit an explanation outside playback order.

## 3. What am I looking at?

Stable drawing numbers are component identifiers, distinct from story-stop numbers. Visible labels follow moving geometry; selecting a key row and selecting its model label do the same thing. Use plain-language purposes rather than names alone.

| No. | Component / purpose                                      | Claim suffix     |
| --- | -------------------------------------------------------- | ---------------- |
| 1   | Sea — outside water reference                            | levels           |
| 2   | Low-lying land — the usable interior                     | present, levels  |
| 3   | Coastal dike — the enclosing barrier                     | levels           |
| 4   | Seaward rock facing — wave protection                    | surfaces         |
| 5   | Landward planted slope — erosion protection              | surfaces         |
| 6   | Inner barrier wall — limits saline ingress               | barrier          |
| 7   | Seepage collector — keeps that path distinct             | barrier          |
| 8   | Interior drainage — collects and conveys water           | network          |
| 9   | Storage pond — buffers inflow                            | water            |
| 10  | Central station — recirculation route                    | pumps            |
| 11  | Drainage station — discharge route                       | pumps, trigger   |
| 12  | Inlet/outlet structures — connect appropriate pathways   | network, outlets |
| 13  | Temporary work enclosure — dry construction space        | outlets          |
| 14  | Temporary loading and ground drains — ground preparation | ground           |

No label remains attached to a removed component. Construction-only entries are hidden or explicitly unavailable in the current-state key. Mobile uses an expandable key below controls; keyboard focus highlights the component without requiring pointer precision. Provide an equivalent text explanation for WebGL failure.

## 4. Geographic and temporal context

Activate a native selected-project map layer only after selection. Frame northwest Tekong with Pulau Unum and broader Pulau Ubin/Changi orientation. Generalised polder context, pond and drainage categories must align with the photographic/plan shoreline. Do not draw an authoritative boundary or an entire drain network from a stylised infographic. Verify any new point against the live basemap before accepting it; preserve its geographic anchor when avoiding label collisions. Pump markers need sufficient visual evidence or should remain schematic within the inset, not invented precise pins.

The map layer must state: **“Approximate public-source context; not surveyed drainage GIS.”** Plans remain usable in 2D and photographic context; return removes all project-specific layers. Source art may be linked for comparison, not pasted over the interface as the main experience.

| Era          | Treatment                                                                            |
| ------------ | ------------------------------------------------------------------------------------ |
| 1950s / 1958 | Pre-polder context. Modern basemap visibly labelled; no fabricated period shoreline. |
| 1965         | Pre-polder; no claim that the later contract existed.                                |
| 2000         | Earlier reclamation programme, clearly distinguished from the polder.                |
| 2026         | Completed-infrastructure context, with dated works/commissioning milestones.         |
| 2050         | Adaptation teaching scenario; no asserted official Tekong completion target.         |

Construction view is a separate mode from year selection. Historical dates must not quietly show completed polder geometry as contemporary. A historic-context card can offer “Explore the later engineering” explicitly.

## 5. Assets, mechanism and performance

Existing `world-reclamation.glb` is a five-stage starter. It stays unchanged before approval. Approved work will replace it using reproducible Blender Python, metre units, named component objects and claim/revision extras. Blender runs offline for export; Three.js renders the exhibit. OneMap provides surface context, not this engineered geometry.

Propose one landscape and an enlarged section inset, with immediately visible labels for compressed horizontal distance, exaggerated vertical relief and illustrative internals. Do not imply the section is a single surveyed cut across every station. Cameras: whole site, sea-level section, work cell, dike detail, water-system overview, pump route and return. Transitions should reveal a relationship rather than spin for decoration.

Qualitative rain/circulation presets must update route arrows, labels and station emphasis together. Play/pause/reset controls are required. No real-time hydrology, geotechnical calculation, exact weather/sea-level forecast or pump failure simulation. Normal rain and dry-weather states do not imply continuous sea pumping. Reduced motion uses static arrows/discrete stages; animation stops when hidden.

**No budget increase:** GLB ≤512 KiB, ≤35 authored mesh groups; active triangles ≤120,000 desktop/60,000 low; draw calls ≤150/90; textures ≤1024 and ≤8 MiB decoded. Lazy-load on story entry. Retain whole-app JS ≤650 KiB, critical non-3D ≤250 KiB, GPU target <128 MiB, ≥45/30 FPS desktop/mobile, useful text ≤2.5 s and interactive 3D ≤5 s under documented conditions. Simplify optional logistics geometry first if needed; no silent ceiling increases.

The existing combined JavaScript measurement exceeds its budget. This remains a whole-app release blocker, with ordinary-device, cold-network and GPU tests outstanding. Brief approval does not waive it.

## 6. Review and navigation

Overview → select Tekong → native map context → detailed story → Back to Tekong map → Back to Singapore. Always provide labelled back/reset; clear overlays and restore discovery controls. Preserve accepted DTSS/Tuas/MRT/Barrage and the recent surface-framing fix. Leave the browser on the overview after QA.

Gate B requires source and geometry audit, runnable preview, motion walkthrough, desktop/mobile screenshots, production performance and remaining limits. Tests: initial overview, no premature model load, map selection/cleanup, nine stops and command ranges, component/key agreement, temporary-work visibility, separate pump paths, construction playback, era labels, back/reset/reselection, keyboard and reduced motion, small-screen overlap/camera clipping, failed assets/tiles/WebGL fallback. Run lint, type, unit, browser, provenance, workflow, asset and production checks.

After user acceptance, implement the five-demo/WIP catalogue treatment and whole-app release review described in [release plan](../FIVE-DEMO-RELEASE.md). No source-media reuse or deployment is authorised by this brief.
