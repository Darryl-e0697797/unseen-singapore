import { packModel, unpackModel } from '../packages/shared/model-transport.ts';
import { gzipSync } from 'node:zlib';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = `${root}apps/web/public/vendor/maplibre`;
mkdirSync(target, { recursive: true });
for (const name of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'])
  copyFileSync(`${root}node_modules/maplibre-gl/dist/${name}`, `${target}/${name}`);
copyFileSync(`${root}node_modules/maplibre-gl/LICENSE.txt`, `${target}/LICENSE.txt`);
console.log('Prepared MapLibre module worker, shared module and BSD licence.');

// Keep canonical GeoJSON provenance; JSON extension enables host MIME/compression detection.
copyFileSync(`${root}apps/web/public/geography/cbd-buildings.geojson`, `${root}apps/web/public/geography/cbd-buildings.json`);

for (const name of readdirSync(`${root}apps/web/public/models`).filter((name) => name.endsWith('.glb'))) {
  rmSync(`${root}apps/web/public/models/${name}.gz`, { force: true });
  const original = readFileSync(`${root}apps/web/public/models/${name}`);
  const packed = packModel(original);
  if (!Buffer.from(unpackModel(packed)).equals(original)) throw new Error(`Model round-trip failed: ${name}`);
  writeFileSync(`${root}apps/web/public/models/${name}.pack.gz`, gzipSync(packed, { level: 9 }));
}
