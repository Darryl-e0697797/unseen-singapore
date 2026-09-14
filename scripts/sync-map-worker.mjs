import { copyFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const target = `${root}apps/web/public/vendor/maplibre`;
mkdirSync(target, { recursive: true });
for (const name of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'])
  copyFileSync(`${root}node_modules/maplibre-gl/dist/${name}`, `${target}/${name}`);
copyFileSync(`${root}node_modules/maplibre-gl/LICENSE.txt`, `${target}/LICENSE.txt`);
console.log('Prepared MapLibre module worker, shared module and BSD licence.');
