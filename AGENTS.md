# UNSEEN Singapore — mandatory sequential build workflow

Read `docs/ENGINEERING-MARVEL-STANDARD.md`, `docs/briefs/USER-EXPECTATIONS.md`, `docs/MARVEL-WORKFLOW.md` and `content/workflow/progress.json` before any detailed marvel work. Follow `apps/web/AGENTS.md` for web changes.

The user explicitly approved implementation of a two-gate programme on 2026-09-14. This replaces the older instruction that research preparation was not an approval checkpoint.

- DTSS, Tuas, MRT and Marina Barrage are accepted. Pulau Tekong reclamation is the only active marvel, awaiting visual acceptance of reclamation-r1. The selected release totals five detailed demos; caverns, NEWater, power and coast are deferred (public label: “Future build”). Read content/workflow/programme.json and docs/FIVE-DEMO-RELEASE.md. Only one marvel may be active.
- Research the active marvel extensively and prepare its sourced visual build brief first.
- **Gate A:** stop for explicit user approval of the named research revision before detailed modelling. Implementation of the programme is not approval of a later research package.
- Run `npm run workflow:check -- <project-id>` before detailed modelling; it must pass. Never insert an approval on the user's behalf or change baseline hashes merely to bypass a failure.
- **Gate B:** present the working marvel, evidence, visual QA, tests, performance and limits. Wait for acceptance AND explicit authorisation before researching or building the next marvel.
- Material factual or visual-scope changes invalidate the approved baseline; revise the brief/revision and request approval before dependent modelling.
- Record actual user approval quotations and evidence in the register. Passing tests, silence and assistant completion are not consent.
- Preserve the normal Singapore overview and explicit return navigation. Leave the browser on that overview after testing unless the user asks otherwise.
- Update DEVLOG/DECISIONS and per-project research. Maintain source licensing and accuracy classifications.
- Do not generate LinkedIn materials until the complete app is accepted. Public deployment/posting require separate user authorisation.

Checks enforce record consistency, not engineering truth or cryptographic identity. The existing nine starter exhibits are legacy foundations, not nine accepted detailed builds. DTSS is grandfathered only for its recorded product acceptance; its schematic limitations remain.

- Every detailed exhibit must include “What am I looking at?”: a numbered drawing key, matching clickable on-model labels, and plain-language component purposes. Keep it keyboard-accessible, readable on mobile, and consistent with visible geometry. This is mandatory for future briefs and acceptance reviews.

- Post-Tekong release: use the exact public label “Future build” for the other four projects; highlight five detailed demos only after acceptance. Complete whole-app checks before captioned actual-app showcase capture. Prepare the requested GitHub open-source release with licensing/history review and ChatGPT Sites handoff; do not set up Vercel. See docs/FIVE-DEMO-RELEASE.md.

Current milestone (2026-09-15): user accepted Tekong reclamation-r1 after drawing-key standardisation. All five selected demos are accepted; no marvel is active. Proceed with the five-demo catalogue and whole-app release checks. Four deferred marvels remain Future build. This supersedes earlier awaiting-acceptance status in this document.

Latest user refinement (2026-09-15): label exhibit depth “Detailed” and “Simplified”, replacing “Detailed demo”/“Future build” in the interface. Keep all nine demos accessible; five are detailed and four introductory/simplified. Use compact counts and outlined badges beside project titles. This does not authorise additional detailed modelling or change acceptance records.
