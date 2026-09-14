# Ask Singapore controller

## First release
An explicitly labelled authored guide. Keyword intent routing selects curated, sourced responses and validated visual commands; no live language model is connected. Supports rationale, flow, depth, MRT context, reveal and reset. History, Tuas and future queries return honest coverage limits. Unknown questions return suggestions, never a plausible invented answer. Questions are processed locally and are not persisted.

Each response includes intent, explanation level, title, narrative, source_ids and commands. Four variants: public (purpose), student (process/causality), engineer (constraints and what the model cannot measure), planning (system trade-offs). Changes in level rerun the same intent.

## Model adapter later
Browser POST /api/ask → bounded input → retrieve only reviewed story records → model structured output → strict Zod schema → registry and era preflight → answer + atomic command batch. Renderer has no model SDK. The model cannot create assets, invent IDs, inject URLs or request scripts. Narrative claims must resolve to reviewed claim IDs; otherwise return uncertainty. Server fallback to authored guide on provider error.

Credentials, timeout, rate limit, abuse throttling and cost ceiling are deployment configuration. Do not collect personal questions by default. Test prompt injection, malformed objects, unknown assets, overlong batches, contradictory eras and unsupported content. A future narration adapter may use accessible speech controls; never autoplay speech.

## National atlas routing

`packages/world` adds strict `focus`, `era`, `stage`, `mode`, and `reset` command variants. Batches validate atomically before changing state. `askWorld` is explicitly authored keyword routing, with a refusal to provide precise/survey/confidential alignments. “How was Tuas Port built?” opens Tuas at the first construction stage, while the source-backed story and notebook remain accessible. This is not a claim that a live LLM is configured.
