import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { sourceSchema } from '../packages/shared/schema';
import { mapLocations, mapViews, surfaceSource } from '../packages/world/geography';
import { projectIds } from '../packages/world';
import sources from '../content/geography/sources.json';
import metadata from '../content/geography/buildings-metadata.json';
const registry = z.array(sourceSchema).parse(sources);
assert.equal(new Set(registry.map((s) => s.source_id)).size, registry.length);
for (const s of registry) assert.equal(s.redistribution_status, 'permitted');
assert.deepEqual(Object.keys(mapLocations).sort(), [...projectIds].sort());
for (const loc of [...Object.values(mapLocations), ...Object.values(mapViews)]) {
  assert(loc.coordinate[0] > 103.5 && loc.coordinate[0] < 104.2);
  assert(loc.coordinate[1] > 1.13 && loc.coordinate[1] < 1.5);
  assert(loc.zoom >= 11 && loc.zoom <= 19);
}
assert.equal(surfaceSource.minzoom, 11);
assert.equal(surfaceSource.maxzoom, 19);
const data = readFileSync('apps/web/public/geography/cbd-buildings.geojson');
assert(data.length < 1024 * 1024, 'Bounded geometry budget');
assert.equal(createHash('sha256').update(data).digest('hex'), metadata.output_sha256);
const feature = z.object({
  type: z.literal('Feature'),
  id: z.number().int(),
  properties: z.object({
    osm_id: z.number().int(),
    name: z.string(),
    height_m: z.number().min(1).max(400),
    height_basis: z.enum(['osm-height', 'levels-estimate', 'illustrative-default']),
    source_id: z.literal('osm-cbd-buildings'),
  }),
  geometry: z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()])).min(4)).length(1),
  }),
});
const collection = z
  .object({
    type: z.literal('FeatureCollection'),
    licence: z.literal('ODbL-1.0'),
    attribution: z.string(),
    features: z.array(feature),
  })
  .parse(JSON.parse(data.toString()));
assert.equal(collection.features.length, metadata.features);
const ids = new Set();
for (const f of collection.features) {
  assert(!ids.has(f.id));
  ids.add(f.id);
  const ring = f.geometry.coordinates[0];
  assert.deepEqual(ring[0], ring.at(-1));
  if (f.properties.height_basis === 'illustrative-default') assert.equal(f.properties.height_m, 12);
  for (const [lon, lat] of ring) {
    assert(
      lon > 103.8 && lon < 103.9 && lat > 1.25 && lat < 1.32,
      'Unexpected out-of-area geometry',
    );
  }
}
console.log(
  `Validated OneMap service configuration, nine map centres, and ${collection.features.length} attributed CBD footprints.`,
);

// These bounds/provenance checks do not certify surveyed positions.
const tekong = JSON.parse(readFileSync('content/geography/reclamation-context.json', 'utf8'));
assert.equal(tekong.accuracy_class, 'reconstructed');
assert.match(tekong.note, /Not surveyed/);
const tekongSources = new Set(
  JSON.parse(readFileSync('content/workflow/reclamation-sources.json', 'utf8')).map(
    (s: { source_id: string }) => s.source_id,
  ),
);
for (const id of tekong.source_ids) assert(tekongSources.has(id), 'Missing Tekong context source');
for (const [lon, lat] of [...tekong.dike_context, tekong.pond_anchor, tekong.polder_anchor]) {
  assert(
    lon > 104 && lon < 104.07 && lat > 1.4 && lat < 1.45,
    'Tekong context outside reviewed extent',
  );
}

assert.equal(tekong.basemap_reference_source_id, 'onemap-basemap');
assert.equal(tekong.redistribution_status, 'unverified');
assert(tekong.licensing_note.length > 0);
