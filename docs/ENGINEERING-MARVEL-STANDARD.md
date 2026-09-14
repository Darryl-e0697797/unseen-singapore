# Engineering marvel detailed-build standard

Recorded: 2026-09-14. Basis: the original project prompt, subsequent user instructions and the DTSS iteration. Read before every detailed engineering build.

**Acceptance milestone:** The user said, “I am satisfied with DTSS already”. DTSS is the accepted reference for depth, presentation and interaction. This does not turn its schematic geometry into verified engineering data or imply that all original product ambitions have been delivered.

## The experience each marvel must deliver

Start with what exists today: a recognisable surface setting and an accessible explanation of what the infrastructure does. From that context, let the visitor enter the engineering story and inspect the systems and components that make it possible.

The work must answer:

- What is it now, and which parts are operating, being built, planned or envisioned?
- Why was it needed? What problem, constraints and alternatives shaped the idea?
- How did the idea become a master plan, programme and construction sequence?
- How was it built: site preparation, temporary works, machines, logistics, assembly, interfaces, protection, testing and commissioning as applicable?
- What is innovative, how does that innovation work, and why was that choice useful?
- How does it operate, connect to other systems and remain maintainable?
- How did it evolve, and what documented future plans or separately labelled scenarios come next?

Do not assume DTSS’s six stops or its component categories apply to every project. Choose the right story structure for the actual marvel. A static dossier or a generic 3D object is insufficient: the scene must help explain the engineering.

## Spatial and visual expectations

1. **Protect the entry experience.** The initial portfolio/overview introduces Singapore and all projects. No particular marvel takes over on first load.
2. **Activate on selection.** Clicking a marvel reveals its relevant island/district context, network or footprint, then offers entry into the detailed environment.
3. **Use the map itself.** Integrate relevant routes, extents and landmarks into the pan/zoom/tilt interface. A floating official-plan image may be a secondary reference, but cannot replace the primary spatial experience.
4. **Keep Singapore recognisable.** Surface geography and iconic landmarks orient the visitor. Retain a readable 2D plan and photographic 3D context where available and appropriate. Photo tiles are not imported underground models or a verified terrain survey.
5. **Show the connections.** Explain upstream/downstream relationships and destinations. Avoid arbitrary line ends that imply a complete network. Label omitted branches, approximate corridors and unknown connections.
6. **Go inside.** Use detailed cutaways, component inspection, camera stops, staged construction and separated layers where they clarify the project. Surface context should make depth and scale understandable.
7. **Make mechanisms visible.** Flow direction, gradients, forces, lifting, sequencing, isolation, diversion or material layers should change visually when explored. Explain causes and consequences, not only component names.
8. **Explain representative assemblies.** Label components and their purpose. If different phases or sites are combined in one scene, identify the composite and avoid suggesting that it is one real layout.
9. **Provide an obvious way out.** A visible “Back to Singapore” or equally clear control must restore the overview, remove project overlays and restore normal discovery controls. A small close icon is not sufficient as the only exit.
10. **Preserve the working experience.** Verify entry, selection, exploration, return and reselection. Leave the browser on the normal overview after QA unless the user specifically wants another state shown.

The visual ambition remains a premium engineering documentary: cinematic, architectural, educational and impressive through useful interaction. Avoid neon spectacle, misleading digital-twin precision and interface clutter. Ordinary modern laptops and a usable mobile experience remain requirements.

## Research and accuracy before geometry

Prepare a claim/source ledger before substantial modelling. Prefer the responsible agency’s public materials and use technical presentations, historical documents and project publications for component-specific claims. An agency homepage or general overview is not adequate evidence for every construction detail.

For each consequential claim record the source URL, organisation, publication/access dates, relevant page or section, project phase, applicability and any conflicting evidence. Check source terms and attribution before importing data or assets.

Keep the original accuracy classes visible where needed:

| Class | Meaning |
| --- | --- |
| Documented | Directly supported by reliable public evidence. |
| Reconstructed | Derived from evidence with stated assumptions. |
| Schematic | Explains relationships; does not claim surveyed geometry. |
| Envisioned | A labelled future scenario or creative interpretation. |

Never invent precise routes, component placement, dimensions, gradients, dates or capacities. Do not imply that animated particles validate hydraulic behaviour, or that a construction sequence is a contract programme. If an official illustration is stylised, manually relocating its broad corridors onto a geographic map still produces an approximate interpretation, not authoritative GIS.

Resolve conflicting classifications explicitly. Prefer a clearly supported claim over blending incompatible figures. Distinguish historical forecasts from the latest documented programme. Preserve uncertainties without removing the explanation: replace a misleading visual with a useful, accurately labelled alternative.

## Time and planning

The latest requested comparison points are **1950s, 1965, 2000, 2026 and the 2050s**. The current interface represents the 1950s with 1958 and the future with 2050. The original brief also proposed 1930s context; retain that as broader ambition rather than silently replacing the implemented era set.

For every marvel, explain its status at each selected era. A project that did not exist should have pre-project context, not a fabricated historical asset. Separate documented future programmes from envisioned scenarios. If the basemap, buildings or network remain present-day across timeline changes, label this rather than implying historical reconstruction. Same-camera spatial transformations remain an aspiration where evidence permits.

## DTSS lessons to carry forward

| What happened | Lesson for the next build |
| --- | --- |
| The initial interface and basic models did not meet the desired depth. | Build a coherent environment and complete engineering story, not just more text or decorative geometry. |
| Four illustrative collection lines looked like an incomplete real network. | Establish network scope, destinations and omitted branches before drawing. Check what endpoints imply. |
| Removing those lines left the map without a useful network view. | A factual correction must preserve the user’s ability to understand the system. |
| A floating PUB map restored information but disappointed as an experience. | Use native map layers and map-anchored landmarks; retain the original source for comparison. |
| A permanently raised gate suggested an unsupported arrangement. | Verify operational state and deployment method before modelling a component’s position. |
| Adding a gate shaft beside the construction shaft caused “Why are there 2 shafts?” | Explain each shaft’s function immediately. Editorial adjacency does not establish real-world adjacency or a universal two-shaft requirement. |
| “Gravity flow” was mainly text and a level tunnel. | Show a longitudinal profile and direction. Label exaggerated fall; distinguish conveyance from pumping at treatment. |
| Gate and air functions were conflated. | Explain distinct subsystems and their interfaces separately. |
| Geometry combined Phase 1 construction methods with Phase 2 features. | Make phase/site composition explicit and source each feature at the correct level. |
| The browser was left on the selected DTSS state after testing. | An unchanged initial page can still appear broken if QA leaves the user in an unexplained state. Restore the overview. |
| The close icon did not provide an obvious return path. | Put a labelled back action in the main project controls and test its full reset behaviour. |
| A legend covered a landmark at a narrower viewport. | Test the visible map area, fit bounds and clickable controls at more than one viewport. |
| The user asked whether Blender was running or OneMap supplied the world. | Explain asset provenance honestly: Blender authors/exports, the browser renders; OneMap supplies surface tiles. |

## DTSS accepted limits — do not erase these in later work

The native overlay has manually generalised deep-tunnel corridors and nine contextual landmark/WRP markers. It is not a complete sewer GIS; smaller link-sewer branches and property connections remain omitted. The detailed environment is a composite teaching model. Actual gradients, exact alignments, component dimensions and adjacent shaft placement are not verified. The adjustable gravity diagram is not a simulation. The accepted milestone does not authorise describing any of these as survey-accurate.

See [DTSS fact-check](DTSS-FACT-CHECK.md) for detailed sources, discrepancies and corrections, and [development log](DEVLOG.md) for implementation evidence.

## Required preparation and completion record

Before the next detailed build, fill in [the build brief](briefs/BUILD-BRIEF-TEMPLATE.md) for that project. Include the initial state, selection flow, map scope, narrative, components, sources, chronology, unknowns, performance budget and a clear return path. The user subsequently required Gate A approval of the named research and visual brief before detailed modelling, and Gate B acceptance plus explicit authorisation before work on the next marvel. Follow MARVEL-WORKFLOW.md; document routine choices within the approved scope.

Before reporting completion:

- Verify the initial page has no automatically selected project or project-specific overlay.
- Exercise the complete click → context → detailed story → back → reselection journey.
- Check factual labels, source links, commissioning status and what the geometry implies.
- Check visible flow/mechanism behaviour, labels, camera framing and construction stages.
- Inspect desktop and mobile layouts; controls and landmarks must remain reachable.
- Run checks appropriate to the changes, including source/asset validation and production build where applicable. Do not use passing compilation as proof of visual quality.
- Verify the served app uses the matching build and remains reachable.
- Record results, limitations, failures and new lessons in the development log; leave a clear review state.

## Sequential approval policy update — 2026-09-14

The user approved a two-gate programme: research → user approval → build → review → user acceptance. This supersedes earlier no-extra-checkpoint wording. See [workflow](MARVEL-WORKFLOW.md). LinkedIn materials wait until the complete app is accepted; deployment/posting need separate authorisation.


## Mandatory drawing key — user update

Every current and future detailed exhibit must include **“What am I looking at?”**. Match numbered on-model labels with a keyboard-accessible key and a plain-language explanation of each part's purpose. Expand jargon before assuming engineering knowledge. Labels must reflect visible structures and follow moving parts; test mobile readability. Include this requirement in each Gate A brief and Gate B checklist.
