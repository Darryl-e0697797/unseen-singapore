# Optimisation boundary

Current generated assets have no textures and two geometric LODs. `npm run assets:check` records bytes, mesh/triangle counts, bounds and validates hashes. The browser selects the lower LOD in low quality mode.

Future large assets: evaluate Meshopt or Draco against transfer and decode time; KTX2 for texture-heavy stories; inspect normals and cutaway edges at each LOD. Keep uncompressed original exports regenerable. Compression is not a substitute for spatial chunking, instancing and load-on-demand.
