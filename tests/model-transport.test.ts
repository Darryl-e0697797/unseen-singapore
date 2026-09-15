import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gzipSync, gunzipSync } from 'node:zlib';
import { packModel, unpackModel } from '../packages/shared/model-transport';
test('compressed model transport preserves every byte of the accepted DTSS model', () => {
  const original = readFileSync('apps/web/public/models/world-dtss.glb');
  const packed = gzipSync(packModel(original));
  assert.deepEqual(Buffer.from(unpackModel(gunzipSync(packed))), original);
  assert.ok(packed.length < gzipSync(original).length);
});
test('model transport handles partial lanes and rejects damaged headers/lengths', () => {
  for (const size of [0, 1, 11, 12, 13, 255]) {
    const original = Uint8Array.from({ length: size }, (_, i) => i % 251);
    assert.deepEqual(unpackModel(packModel(original)), original);
  }
  assert.throws(() => unpackModel(new Uint8Array(9)));
  assert.throws(() => unpackModel(packModel(new Uint8Array(20)).slice(0, -1)));
});
