# Sequential engineering-marvel programme

User-authorised 2026-09-14. This supersedes older roadmap/preparation wording where it conflicts.

## Order and stages

DTSS, Tuas, MRT and Marina Barrage accepted. Pulau Tekong reclamation is active at Gate B, reclamation-r1. The selected release contains five detailed demos; caverns, NEWater, power tunnels and Long Island are deferred (public label: “Future build”). See docs/FIVE-DEMO-RELEASE.md.

Each next project remains queued until its predecessor has explicit acceptance and the user explicitly authorises that next project. Only one can be researching, awaiting research approval, building or awaiting acceptance. Existing starter assets do not count as accepted detailed builds.

1. **Researching:** inspect existing evidence; use primary online documents; prepare claim ledger, source registry, dates, phases, conflicts, visual brief, budget and storyboard.
2. **Awaiting research approval (Gate A):** deliver a concrete named revision. No detailed modelling. Unknowns must have an explicit visual treatment or exclusion. User requests for changes revise the same package.
3. **Building:** enter only after an actual user message approving that research revision. Build, fact-check, visually inspect and test within the approved scope.
4. **Awaiting acceptance (Gate B):** deliver a runnable preview, walkthrough, claim audit, testing/performance evidence, limitations and release risks.
5. **Accepted:** record the user's acceptance message, research revision and exact accepted build commit. Starting the next project requires a separate explicit authorisation, which can be in the same user message as acceptance.

Material changes to facts or scope require a new research revision and renewed Gate A approval. Do not relabel an altered package with its previous approved revision. DTSS's pre-workflow acceptance is preserved as a specific exception, not an exception for future projects.

## Records and executable checks

`content/workflow/progress.json` records workflow state and actual approval evidence. `*-claims.json` records sourced assertions and illustrative choices; `*-sources.json` uses the existing provenance schema. New detailed content references these claim IDs; legacy dossiers retain their existing source-level validation until their turn.

`npm run workflow:check` runs in the normal validate/build/CI path. It checks order, single active project, previous acceptance, next-project authorisation, matching revision/approval, source provenance, claim references and component applicability. Approval quotes must exist in their evidence file. Queued/pre-approval models must match their baseline hash.

`npm run workflow:check -- tuas` is the build preflight. It passes only while the selected project is in the approved building stage. It does not generate or request approval. An engineer must read the user message and record it accurately before changing state. These checks cannot authenticate a human message or independently verify engineering truth; repository review remains essential. They are not a security boundary against arbitrary direct file edits.

When extending content, use optional `detailed_exhibit` with research revision, evidence-linked components, camera stops and variable-length stages. Every detailed stage declares the model stage it reveals. The command reducer validates stage bounds against the selected project's sequence atomically, including multi-command batches. Existing five-stage exhibits retain their behaviour. A new detailed renderer is implemented only for an approved project; the shared schema alone does not claim new scenes exist.

## Research completion and fact review

Record queries, inspected source sections and gaps. Cover current status, why, alternatives, master planning, site investigation, construction, temporary works, interfaces, logistics, materials, innovation, commissioning, operation, maintenance, environment and time. Separate government/client/project-team evidence from independent corroboration. Two MPA publications do not constitute two independent reviewers. Never infer engineering truth solely from a passing validator.

Gate A needs a reviewed claim ledger, a complete proposed storyline and explicit exclusions. Missing exact drawings need not prevent a clearly labelled schematic. They do prevent claims of accurate geometry. A later authoritative correction must reopen the affected approval baseline.

## Production and release gates

Each Gate B packet records lint/type/unit/browser/source/asset/build results, desktop/mobile visual evidence, navigation resets, reduced motion/keyboard access, loading failures, measured performance and outstanding device tests. Use the existing performance budget; propose any revision at Gate A rather than silently raising limits.

Whole-app release remains pending until all marvels are accepted and integration QA is complete: repeated navigation, consistency across timelines, licensing, source freshness, real-device performance, accessibility, fallback paths, production configuration and deployment review. Then prepare a LinkedIn demonstration/case study based on actual research, Blender scripts, code and measured results. Do not imply government endorsement, validated simulation or a live Astra runtime when using the authored guide. Public deployment and posting require explicit authorisation.

## Current review and reduced scope

On 2026-09-15 the user authorised Pulau Tekong and requested five completed-demo badges plus WIP treatment for the other four after this build. This selects the three-additional-build option: MRT → Marina Barrage → reclamation, following DTSS and Tuas. No caverns research is authorised. The literal user message is recorded in approval-evidence.md.

Gate A/Gate B remain mandatory. The present request starts research, not approval of an unseen research baseline. After Tekong acceptance, finish catalogue status treatment and whole-app QA before final video capture. Hosting planning is authorised; deployment, purchase and posting still need explicit authorisation. Existing release blockers are not waived.

Every future brief/build includes the “What am I looking at?” numbered drawing key with plain-language purposes and matching model labels.

On 2026-09-15 the user refined the post-acceptance release: exact label “Future build”, captioned recording of actual interactions, GitHub open-source release and user-led ChatGPT Sites hosting. This supersedes the earlier WIP/Vercel proposal without recording Tekong acceptance or waiving release checks. See docs/FIVE-DEMO-RELEASE.md.

Current milestone (2026-09-15): user accepted Tekong reclamation-r1 after drawing-key standardisation. All five selected demos are accepted; no marvel is active. Proceed with the five-demo catalogue and whole-app release checks. Four deferred marvels remain Future build. This supersedes earlier awaiting-acceptance status in this document.
