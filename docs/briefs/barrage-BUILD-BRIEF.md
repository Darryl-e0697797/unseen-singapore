# Marina Barrage — When rain meets the tide

**Gate A: barrage-r1 — approved.** User replied “Approve” on 2026-09-14. Prepared 2026-09-14 by Codex. Detailed build accepted on 2026-09-15; see barrage-GATE-B.md. Read: engineering-marvel standard, user expectations, workflow and performance budget. This brief proposes a detailed educational exhibit; no site-operating simulator or surveyed twin.

[Research dossier](barrage-RESEARCH.md) · [20-claim evidence ledger](../../content/workflow/barrage-claims.json) · [11-source registry](../../content/workflow/barrage-sources.json)

## 1. What exists now

Open on the green roof, bridge and water barrier in their recognisable geographic setting. First explanation: “This separates the reservoir from the sea. Gates and pumps let excess rainwater out.” Clearly label both water bodies before entering a section. The current facility, construction illustration and proposed future retrofit must have distinct state badges.

## 2. Research ledger and limits

The linked ledger supplies source passages, phase, accuracy and limitations for every factual component. Important claims: purpose, gates, pumps, gravity, high-tide, controls, catchment, water-loop, opening, freshwater, rationale, public-roof, temporary-pumping, cofferdam, retrofit, future-gap. Prefix all with `barrage-` in content.

Original model geometry is schematic even when component count is documented. Do not convert a sourced mechanism into a claim that every illustrated internal part matches the installed equipment. Exact historic worksite layouts, isolation procedures, foundation depths and proprietary internals are outside this revision.

## 3. Storyboard

| Stop | Visitor question | View and interaction | Claim suffixes |
|---|---|---|---|
| 1. A park that manages water | What am I looking at? | Oblique whole-site view; numbered key reveals reservoir, sea, gates, pumps and roof. | purpose, public-roof, channel |
| 2. Why build here? | Why keep the sea out? | Selected-project native map shows upstream context; dated planning cards, no historical coastline fiction. | rationale, catchment, historic-view |
| 3. Building in water | How can workers build below water? | Schematic temporary enclosure; remove water to reveal a dry work area. Distinguish temporary pump from permanent machines. | cofferdam, temporary-pumping |
| 4. Putting the barrier together | What has to connect? | Conceptual structure/equipment assembly; equipment enters highlighted bays; label illustrative sequence immediately. | gates, pumps, teaching-model |
| 5. Rain at low tide | Can water leave on its own? | Section through one gate, labelled upstream/downstream levels. Lower crest gate and trace outward flow. | gravity, controls |
| 6. Rain at high tide | Why are pumps necessary? | Keep tidal barrier closed; section beside it reveals an axial-flow pump and outward route. Toggle rain/tide teaching states. | high-tide, pumps, motor, teaching-model |
| 7. Becoming freshwater | Was it freshwater on opening day? | Dated 2008 → 2009 → 2010 transition; colour change labelled conceptual, not measured salinity. | opening, freshwater, water-loop |
| 8. Keeping it dependable | Who decides what operates? | Highlight gates and pump hall; explain monitoring and maintenance without invented isolation choreography. | controls, pumps |
| 9. Facing future seas | What could change? | Return to whole structure; optional ghosted gap-treatment concept beside unchanged current state. Clearly label proposed / envisioned geometry. | retrofit, future-gap |

Proposed construction playback is an educational ordering of work categories, not a reproduction of the contractor's programme. No exact durations or complete historical phase allocation. If users need that deeper reconstruction, obtain the original technical drawings/paper and revise this brief first.

## 4. Map and time

- On selection only: barrage location, reservoir-versus-sea labels, and named upstream waterways. Keep flow context inside the map, not a popup.
- Frame Marina South and Marina East; landmark context includes Gardens by the Bay and Marina Bay. Markers are orientation aids, not evidence of hydraulic connection.
- Reuse current licensed base map. Proposed new anchor coordinates must be checked against its visible shoreline before implementation; no numerical coordinates approved here. No hand-drawn authoritative catchment polygon. Generalised connections must follow visible waterways and be labelled approximate.
- Plan and photographic views retain the same selected-project layer lifecycle. Labels remain legible in pitched views; no decorative station relocation or changes to accepted MRT overlay.

| Era | Presentation |
|---|---|
| 1950s / UI 1958 | Pre-project card. No Barrage geometry; current map explicitly labelled modern reference. |
| 1965 | Pre-project, without implying a Barrage masterplan existed then. |
| 2000 | Before construction; planning context, no completed dam. |
| 2026 | Operating facility; separately dated 2025 retrofit proposal. |
| 2050 | Future-context view, not a promised completion date or flood prediction. Optional concept geometry is envisioned and visually ghosted. |

## 5. What am I looking at?

Stable drawing numbers, not automatically renumbered with each stop. Each visible label and keyboard-selectable key row highlights the same structure and shows one plain-language purpose. Hidden components do not leave dangling labels. Numbers identify components, while story-stop numbers identify chapters.

| Drawing no. | Structure / plain purpose | Stops | Claim suffix |
|---|---|---|---|
| 1 | Reservoir — stores collected rainwater | 1,2,5–9 | catchment |
| 2 | Sea — tide changes the outside water level | 1,5,6,9 | high-tide |
| 3 | Crest gate — separates the water bodies and lowers for release | 1,4–9 | gates, gravity |
| 4 | Gate bay / supporting structure — holds the gate in the barrier | 4–6 | teaching-model |
| 5 | Bridge — crosses above the barrier | 1,4,9 | gates (brochure bridge context) |
| 6 | Pump hall — houses the drainage equipment | 1,4,6,8 | pumps |
| 7 | Drainage pump — moves excess water to sea | 4,6,8 | pumps |
| 8 | Electric motor — drives the pump | 6,8 | motor |
| 9 | Green roof — recreation and insulation | 1 | public-roof |
| 10 | Temporary enclosure — separates the work area from water | 3 | cofferdam |
| 11 | Construction pump — removes water during building | 3 | temporary-pumping |
| 12 | Possible future gap treatment — proposed adaptation area | 9 only | future-gap |

Pump shaft and generic impeller may be schematically separated for understanding; exact blade count, housing shape and discharge culvert routing cannot be asserted. No maintenance gate added merely to fill a story stop.

## 6. Geometry, mechanism and performance

Blender-authored reproducible script, metre units and object names tied to claim IDs; offline Blender export, no runtime Blender. Original authored shapes only. Retain a nine-bay overall rhythm and seven-pump inventory; use instancing/merged material groups to fit budgets. One enlarged, explicitly schematic gate/pump section provides legibility without pretending an impossible co-located section is surveyed. Horizontal/vertical exaggeration and diagram displacement must be on-screen immediately.

Motion: purposeful camera transitions with reset; explicit play/pause; stop when hidden; reduced-motion mode uses discrete states and static arrows. Rain and relative tide controls explain cause and effect without numeric forecasts. Calm, rainy-low-tide and rainy-high-tide presets must update labels, gate state and flow direction together. No constant pumping merely because tide is high.

**No budget increase requested:** Barrage GLB ≤512 KiB, ≤35 authored mesh groups; active triangles ≤120,000 desktop /60,000 low; draw calls ≤150/90; texture dimension ≤1024 and decoded texture ≤8 MiB. Lazy-load only after exhibit entry. Existing total JS ≤650 KiB, critical non-3D ≤250 KiB, GPU <128 MiB, desktop ≥45 FPS/mobile ≥30 FPS, useful text ≤2.5 s and interactive 3D ≤5 s remain required targets under documented conditions.

The existing app exceeds the total JS target; accepting this brief does not waive that blocker. Real ordinary-laptop/mobile, cold-network and GPU-memory measurements remain open. If this design cannot fit the approved geometry budget, simplify it or return with a revised brief before heavier assets are approved.

## 7. Navigation and acceptance

Singapore overview → select Barrage → native map context → enter detailed story → back to Barrage map → back to Singapore. Explicit labelled Back and Reset always available; restore discovery controls and remove project overlays on exit. Preserve accepted DTSS, Tuas and MRT. Leave browser at initial overview after QA.

Gate B must include runnable preview, source audit, screenshots and motion review, measured performance and remaining limitations. Required tests: no initial takeover; selection/layer cleanup; nine stops and valid scene commands; drawing-key/visible-label agreement; rain/tide state consistency; assembly playback; back/reset/reselection; timeline statuses; keyboard/focus and reduced motion; mobile/desktop label overlap and camera clipping; failed asset/tile/WebGL reading fallback. Run lint/type/unit/browser/content/asset/production checks. These are planned checks, not results of this research turn.

Your Gate A approval of **barrage-r1** was recorded before modelling under your requested two-gate workflow. Gate B acceptance was recorded on 2026-09-15. No research of the next marvel is authorised by this brief.
