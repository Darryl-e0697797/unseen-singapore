import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import network from '../content/geography/mrt-network.json';
import sources from '../content/geography/sources.json';
test('MRT anchors retain source identity, CRS accuracy and reviewed footprint differences', () => {
  for (const [path, hash] of Object.entries(network.source_hashes))
    assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), hash);
  const names = new Set(network.stations.map((s) => s.name));
  assert.equal(names.size, network.stations.length);
  assert.equal(names.size, 146);
  for (const s of network.stations) {
    assert(sources.some((source) => source.source_id === s.source_id));
    assert.equal(s.accuracy_class, 'documented');
    assert(s.source_feature.toUpperCase().startsWith(s.name.toUpperCase() + ' MRT STATION ('));
    assert(!/\((CR|JS|JE|JW)/.test(s.source_feature), 'Future platform selected');
    assert(s.conversion_error_m <= 1);
    assert(s.coordinate[0] > 103.6 && s.coordinate[0] < 104.1);
    assert(s.coordinate[1] > 1.2 && s.coordinate[1] < 1.5);
    if (s.distance_to_lta_footprint_m === null)
      assert(['Keppel', 'Cantonment', 'Prince Edward Road'].includes(s.name));
    else assert(s.distance_to_lta_footprint_m <= 25);
    assert(s.review && s.anchor_type && s.access_date);
  }
  for (const line of network.lines) for (const name of line.stations) assert(names.has(name));
  assert.deepEqual(new Set(network.lines.flatMap((l) => l.stations)), names);
  for (const unopened of ['Marina South', 'Mount Pleasant', "Founders' Memorial"])
    assert(!names.has(unopened));
  assert.match(network.stations.find((s) => s.name === 'Ang Mo Kio')!.source_feature, /NS16/);
});
