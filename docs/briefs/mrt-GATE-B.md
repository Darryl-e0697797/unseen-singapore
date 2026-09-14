# MRT & underground construction — Gate B review candidate

Research revision **mrt-r1** was approved by the user (“Approved”, 14 September 2026). **MRT was accepted** by the user on 14 September 2026 (“Approve, continue with Marina Barrage”). Marina Barrage is now awaiting approval of its research brief. Whole-app release requirements below remain open.

## Open and review

Open [UNSEEN](http://127.0.0.1:3001/explore). Select **MRT & underground construction** on Singapore's map, then **Enter the engineering story**. The catalogue provides a direct story shortcut. MRT layers appear only after selection. Back to Singapore clears them.

1. **The journey today:** completed station, train, stair connection, human-scale cues and tunnel section. Match the model's numbers with **What am I looking at?**; click either side for plain-language explanations.
2. **Why a railway?** Return to the native map, highlight individual lines and inspect the five geographic story anchors. Station references stay fixed when labels move. Switch between 2D plan and 3D context.
3. **Find room underground:** reveal schematic utilities, foundations and investigation context. These are not surveyed services.
4. **Hold the ground:** scrub/play the slurry-supported panel, reinforcement cage and concrete sequence.
5. **Build beneath the roof:** compare independent top-down and bottom-up sequences. The roof opening and temporary support change with construction.
6. **Bore and line:** turn the cutter, advance the representative shield, follow rearward spoil arrows, place a lining piece and reveal annular grout. The example does not assert a universal segment count or calculate face pressure.
7. **Protect the city:** inspect monitoring markers and qualitative ground-to-wall-to-support arrows. Rochor is contextual evidence, not the location of this invented station.
8. **A temporary frozen barrier:** a separately labelled Marina Bay historical diagram. Frozen zones grow and the lining is revealed; temporary ice and pipes are removed at the completed end of playback. No thermal analysis or real pipe layout is claimed.
9. **From concrete to service:** return to railway fit-out, testing, operation and maintenance. Reset restores the initial completed view; Back to MRT map and Back to Singapore remain explicit.

The independent construction panel has nine stages. Historical eras hide the modern teaching section; 2050 remains envisioned, with present-day map references retained for orientation. The model is an original schematic with compressed distances, not a replica of Bencoolen, Rochor or Marina Bay.

## Evidence and reproducibility

- [Approved brief](mrt-BUILD-BRIEF.md), [research and verification](mrt-RESEARCH.md), [24 claims](../../content/workflow/mrt-claims.json), [19 narrative sources](../../content/workflow/mrt-sources.json).
- [Detailed content](../../content/workflow/mrt-exhibit.json): nine stops, twelve stable component identities and nine construction stages, with accuracy and claim references.
- [Blender authoring](../../pipeline/blender/mrt_detail.py), executed offline through `MRT_ONLY=1 …/Blender --background --factory-startup --python pipeline/blender/world.py`. Blender exports and exits; it is not a runtime service. No underground models were imported from OneMap.
- [Geographic source registry](../../content/geography/sources.json), [every station comparison](../../content/geography/mrt-network.json), [offline audit generator](../../pipeline/gis/mrt.py). Pinned source inputs carry hashes and attribution under Singapore Open Data Licence.
- **146 station anchors**, six operating lines plus CG/CE branches. All 143 available LTA footprint matches are inside or within **6.01m** of the corresponding footprint. Three newer CCL6 stations lack a March footprint and are explicitly OneMap-only references. Coordinate round trips are below one metre. This is software/source agreement, not surveyed accuracy.
- 52 centroid differences over 25m are documented as comparisons between different reference types, often interchange platforms. No points were averaged or snapped. Future CR/JRL platform results and unopened stations are excluded from the operating overlay.
- New source checks preserve both construction-stage and relevant component provenance. Automated coverage checks do not establish that the source interpretation is true.

## Verification and visual record

Passed lint, TypeScript/production build, data/geography/workflow and asset validation, **27 unit tests**, a full **21-test browser regression**, and the expanded **five-test MRT browser suite** (22 distinct browser cases across the suites). Covered nine stages, controls, keyboard selection, reduced motion, back/reset, repeated navigation, historical labels, failed MRT asset, unavailable WebGL and failed basemap tiles. DTSS/Tuas regression checks passed.

Visual review corrected track/tunnel alignment, dark-control contrast and mobile map-panel overlap. Desktop and 390×844 mobile emulation were inspected. Local animation checks cover construction/camera transitions, cutter/spoil/lining playback and the separate freezing state. Production measurements are in [performance.json](../qa/mrt/performance.json); scripts are retained under `scripts/qa/mrt-*.mjs`.

[Completed station](../qa/mrt/present.png) · [wall panel](../qa/mrt/stop-4.png) · [station construction](../qa/mrt/stop-5.png) · [tunnel mechanism](../qa/mrt/stop-6.png) · [freezing case](../qa/mrt/stop-8.png) · [mobile tunnel controls](../qa/mrt/mobile-tbm.png).

Map review: [Toa Payoh](../qa/mrt/map-Toa-Payoh.png), [Bencoolen](../qa/mrt/map-Bencoolen.png), [Rochor](../qa/mrt/map-Rochor.png), [Marina Bay](../qa/mrt/map-Marina-Bay.png), [Cantonment](../qa/mrt/map-Cantonment.png), [tilted Cantonment](../qa/mrt/map-Cantonment-tilted.png), [mobile plan](../qa/mrt/map-mobile.png), [mobile tilted view](../qa/mrt/map-mobile-tilted.png). Marina Bay and nearby Dhoby Ghaut provide interchange comparisons. All station coordinates additionally have the offline ledger review; screenshots are not a substitute for that audit.

## Performance and release limits

The final authored MRT GLB is **478,396 bytes / 467.2 KiB**, **35 meshes**, **8,064 triangles**: within the unchanged 512 KiB / 35-mesh limits. It is not requested before story entry. Low graphics disables shadows and reduces pixel density; geometry remains the same bounded teaching asset.

Measured locally on an M4 Pro, Chrome, unthrottled localhost production: completed view around 43 calls / 9,064 rendered triangles including shadows; low mode 25 calls / 4,548 triangles. Browser frame cadence during playback was about 16.7ms median. Exact current timing and transfer results are retained in the linked JSON. These are not ordinary-laptop/mobile or fast-4G measurements, and browser frame cadence is not GPU timing.

**Whole-app release blocker:** combined requested JavaScript/modules remain approximately **1.04 MB gzip**, above the existing **650 KiB** target. No budget was relaxed. Cold fast-4G timing, ordinary integrated-GPU laptop, physical mobile, decoded/GPU memory, source freshness and final whole-app acceptance remain open. Live OneMap tiles remain an external dependency; tile failure does not remove the locally stored network or engineering guide.

Unknown/schematic: exact station architecture, geology, underground alignments/depths, reinforcement, shield configuration, ring count, ground pressures, movement magnitudes, freezing layout/thermal behaviour, actual contract logistics and commissioning procedures. Generalised map connections can differ substantially from tunnel routes. The source footprint is not an entrance coordinate; at interchanges the displayed named platform reference need not coincide with other platforms or printed basemap labels.

## Gate B

Review this MRT candidate and request revisions or explicitly accept it. Acceptance does not clear the remaining whole-app release issues. Starting Marina Barrage requires separate explicit next-project authorisation. No deployment, public posting or LinkedIn materials have been prepared or authorised.

## Acceptance recorded

2026-09-14: user said “Approve, continue with Marina Barrage”. MRT accepted at `4f8593e1abd76c37823becef8b209390d90cd698`; existing release limitations remain. See workflow approval evidence.
