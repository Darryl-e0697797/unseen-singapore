# UNSEEN Singapore — architecture

“Walk through the engineering that built a nation.”

## Product boundary
An interactive engineering documentary, not a survey-grade digital twin. Facts and geometry carry separate provenance. The first release is an authored DTSS explanation in a Singapore-inspired architectural context. Neither the context buildings nor underground lines assert actual positions. National GIS, historical coastlines, Tuas and 2050 scenarios follow only after evidence and performance gates.

## System
Browser → Next.js App Router shell → lazy React Three Fiber canvas → deterministic scene reducer → registry-resolved GLB assets. An authored question router retrieves curated narratives and emits validated commands through the same boundary intended for a future model provider. No credentials required for the initial slice. A future server-only model adapter returns data, never executable JavaScript. No remote model is represented as connected in the initial release.

Content JSON → Zod validation + referential checks → typed data package → narrative and sources UI. Blender Python → GLB + manifest → asset checks → web public/models. Small distributable GLBs are versioned; raw source acquisitions and .blend working files are ignored. No database until editorial concurrency, volume or query patterns justify it.

## Repository and responsibilities
- apps/web: page shell, responsive controls, accessible narrative and sources, renderer adapter; Vercel root directory.
- packages/shared: runtime schemas and coordinate/temporal contracts.
- packages/scene-engine: pure state transitions and atomic command validation.
- packages/ai-controller: authored retrieval, explanation levels, provider boundary.
- packages/data: validated content access, no application imports.
- content/{sources,systems,stories,eras}: versioned editorial records.
- pipeline/{blender,gis,optimisation}: reproducible generation and processing.
- assets/{source,generated,processed}: acquisition, authoring, build products.
- scripts: validation and developer commands; tests: deterministic and browser checks.
- docs: decisions, standards, roadmap and evidence of progress.

Use npm workspaces for the web application; shared source packages are compiled by the app through TypeScript aliases. Separate publishable package builds only when another consumer exists.

## Loading and failure
Server renders readable introduction and content. WebGL initializes on the client. GLB load failure or missing WebGL yields a useful HTML explanation. No API dependency for reading or exploring. Reduced motion disables continuous tracing and uses immediate camera changes. Mobile has text-first framing and optional 3D. Model/network failures never remove sources or basic controls.

## Scale path
Country overview tiles → district chunks → flagship systems → detailed stories → components. Keep global projected coordinates in content and rebase each chunk before GPU upload. Screen-space LOD and instancing, with byte and triangle gates on every artifact. No general-purpose country mesh. Stable asset identifiers connect selection, retrieval and provenance.

## Security and publication
Command allowlist, strict fields, registered identifiers, bounded batches and camera presets. Treat questions, retrieved documents and model responses as untrusted data. No eval, arbitrary code, URLs, filesystem paths or direct model mutations. Future service: input/output limits, rate limiting, timeout, redacted observability, server-only secrets. Release requires licensing review, factual review, accessibility/browser QA and measured device budgets. Independent project; no agency endorsement.

## Initial infrastructure
macOS / Apple M4 Pro (12 CPU cores, 16 GPU cores), 48 GB RAM, ~315 GiB available. Node 26.4.0, npm 11.17.0, Python 3.14.7, Git 2.55.0. Chrome and Safari present. Blender initially absent; installing official Homebrew cask. Unreal not found in Applications, user Applications or Spotlight; not a dependency. No personal machine identifiers are retained.
