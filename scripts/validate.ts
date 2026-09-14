import { existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { assets, sources, stories } from '../packages/data';
import { validateCatalog } from '../packages/data/validate';
validateCatalog(assets, sources, stories);
for (const asset of assets) {
  for (const file of [asset.geometry_file, ...asset.lods.map((l) => l.file)].filter(Boolean)) {
    assert(
      existsSync(`apps/web/public${file}`),
      `Missing asset ${file}; run npm run assets:generate`,
    );
  }
}
console.log(
  `Validated ${assets.length} assets, ${sources.length} sources, ${stories.length} stories and their command batches.`,
);
import { projects, researchSources, validateWorld } from '../packages/world';
assert.deepEqual(validateWorld(), [], 'Engineering atlas provenance failed');
for (const p of projects)
  assert(existsSync(`apps/web/public${p.model_file}`), `Missing world exhibit ${p.model_file}`);
console.log(
  `Validated ${projects.length} engineering dossiers, ${researchSources.length} research sources and 45 temporal snapshots.`,
);
import geography from '../content/geography/singapore.json';
const geographySource = researchSources.find((s) => s.source_id === geography.source_id);
assert.equal(
  geographySource?.redistribution_status,
  'permitted',
  'Geography must have cleared redistribution',
);
assert.equal(geography.projected_crs, 'EPSG:3414');
assert.equal(
  geography.geometry_epoch,
  null,
  'This generalised context must not acquire an invented survey epoch',
);
