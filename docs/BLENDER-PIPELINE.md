# Blender to browser

## Contract
Metres, right-handed X east/Y north/Z up; local origin. glTF exporter performs Y-up conversion. Mesh names include stable asset ID and LOD. Export custom properties for identity and accuracy class. Principled materials with restrained matte surfaces; no embedded cameras/lights in distributable asset.

## Commands
`npm run assets:generate` finds BLENDER_BIN or the installed macOS application and runs Blender headless with pipeline/blender/generate.py. Generation resets only its own background process scene. Fixed seed, configurable segment tessellation, no manual edits required. Writes .blend into assets/generated (ignored), high/low GLB variants into apps/web/public/models and a geometry manifest into assets/processed. `npm run validate` checks registry references, distribution paths, dimensions and budgets. `npm run assets:check` checks glTF format, counts, bounding box and coordinate fixture.

## First proof
A cutaway tunnel segment and shaft form one selectable representative asset. Ring lining remains open on the viewing side so its interior can be seen. Dimensions are authored demonstration dimensions, not a particular DTSS design. Low and high LODs share bounds and identity. An axis fixture exports separate metre markers to verify orientation before the first story is implemented.

## Subsequent pipeline
GIS adapter rejects missing CRS, invalid topology and unknown licence status. Clip at tile boundaries and rebase before Blender import. Building footprints extrude only where height provenance exists; inferred heights labelled reconstructed. Tunnel profiles are procedural and use public dimensions only with source IDs. Assign collections per system and accuracy class. Apply transforms; triangulate, validate normals, reject missing textures and excessive bounds; export manifest with hashes and metrics.

Compression is measured: Meshopt/Draco for geometry, KTX2 for large textures after fidelity check. Tiny first assets use uncompressed GLB to avoid decoder overhead. Never add all national assets to one GLB. Regeneration must be reviewable through manifests; Blender versions are recorded because binary export need not be byte-identical across versions.

## Nine-project world exhibits

Run `blender --background --python-exit-code 1 --python pipeline/blender/world.py`, then `npm run assets:check`. Models export to `apps/web/public/models/world-*.glb`; metadata is in `assets/processed/world-manifest.json`. Every mesh carries an integer construction `stage` from 0–4 and `accuracy_class: schematic`. Geometry is joined by stage/material. Blender's metre/Z-up output is exported as glTF metre/Y-up; a 70 m local schematic plinth verifies scale in the loader check.

The world manifest and GLTFLoader verification cover hashes, bytes, triangles, stages, draw-call authoring limits and bounds. Each exhibit must remain under 512 KiB and 35 mesh groups. These deliberately small assets use progressive loading: the selected detailed model loads on demand; the country overview uses cheap instanced context. The generic models have no validated engineering dimensions despite using metres internally.
