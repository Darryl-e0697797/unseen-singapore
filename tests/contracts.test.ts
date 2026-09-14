import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCommands, initialScene } from '../packages/scene-engine';
import {
  batchSchema,
  temporalSchema,
  assetSchema,
  toRuntime,
  validAt,
} from '../packages/shared/schema';
import { registry, assets } from '../packages/data';
import { askSingapore } from '../packages/ai-controller';
test('untrusted command batch rejects atomically', () => {
  const before = structuredClone(initialScene);
  assert.throws(() =>
    applyCommands(
      before,
      [
        { type: 'showSection', enabled: true },
        { type: 'focusAsset', asset_id: 'invented' },
      ],
      registry,
    ),
  );
  assert.deepEqual(before, initialScene);
  assert.throws(() =>
    batchSchema.parse([{ type: 'setCamera', preset: 'overview', code: 'alert(1)' }]),
  );
  assert.throws(() =>
    batchSchema.parse(Array.from({ length: 17 }, () => ({ type: 'resetScene' }))),
  );
  assert.throws(() =>
    applyCommands(before, [{ type: 'showSource', source_id: 'invented' }], registry),
  );
});
test('reveal trace and reset preserve coherent state', () => {
  const r = applyCommands(initialScene, askSingapore('follow one drop').commands, registry);
  assert(r.reveal && r.tracing);
  const off = applyCommands(
    r,
    [{ type: 'setLayerVisibility', layer: 'dtss', visible: false }],
    registry,
  );
  assert(!off.tracing);
  const reset = applyCommands(off, [{ type: 'resetScene' }], registry);
  assert.equal(reset.camera, 'overview');
  assert(!reset.reveal);
  assert(reset.layers.dtss);
  assert(reset.cameraRevision > r.cameraRevision);
});
test('unknown and unavailable questions do not fabricate content', () => {
  for (const q of [
    '2050 flood simulation',
    '1930 coastline',
    'Tuas port',
    'potato quantum giraffe',
    'x'.repeat(501),
  ]) {
    const a = askSingapore(q);
    assert.equal(a.intent, 'unavailable');
    assert.equal(a.commands.length, 0);
    assert.equal(a.source_ids.length, 0);
  }
});
test('narrative levels change substance and all supported answers validate', () => {
  for (const q of ['why was this built', 'follow one drop', 'why depth', 'show rail context']) {
    const variants = ['public', 'student', 'engineer', 'planning'].map((l) =>
      askSingapore(q, l as 'public'),
    );
    assert.equal(new Set(variants.map((v) => v.narrative)).size, 4);
    for (const a of variants)
      assert.doesNotThrow(() => applyCommands(initialScene, a.commands, registry));
  }
});
test('coordinate contract and temporal boundaries', () => {
  assert.deepEqual(toRuntime([10, 20, -30]), [10, -30, -20]);
  const t = {
    valid_from: '2020-01-01',
    valid_to: '2026-01-01',
    era: 'present',
    status: 'operating',
    confidence: 'high',
    scenario_id: null,
  } as const;
  assert(validAt(t, '2020-01-01'));
  assert(!validAt(t, '2026-01-01'));
  assert.throws(() => temporalSchema.parse({ ...t, era: 'future' }));
  assert.throws(() => temporalSchema.parse({ ...t, valid_to: '2019-01-01' }));
});
test('schematic geometry cannot acquire documented status by association', () => {
  assert.throws(() => assetSchema.parse({ ...assets[0], accuracy_class: 'documented' }));
  assert.throws(() =>
    assetSchema.parse({ ...assets[0], geometry_file: '/models/../../secrets.glb' }),
  );
});
test('precision requests and unrelated why questions do not receive a guessed answer', () => {
  for (const q of [
    'exact DTSS coordinates',
    'DTSS hydraulic simulation',
    'why is the moon green?',
    'flow rate of this tunnel',
  ])
    assert.equal(askSingapore(q).intent, 'unavailable');
});
test('turning section off stops trace, and trace cannot begin while hidden', () => {
  const hidden = applyCommands(
    initialScene,
    [{ type: 'traceSystem', system: 'dtss', enabled: true }],
    registry,
  );
  assert(!hidden.tracing);
  const active = applyCommands(initialScene, askSingapore('follow one drop').commands, registry);
  assert(!applyCommands(active, [{ type: 'showSection', enabled: false }], registry).tracing);
});

test('provenance gate rejects restricted or missing geometry evidence and broken references', async () => {
  const { validateCatalog } = await import('../packages/data/validate');
  const { sources, stories } = await import('../packages/data');
  const derived = structuredClone(assets);
  derived[0].geometry_origin = 'derived';
  derived[0].geometry_source_ids = ['pub-dtss'];
  assert.throws(() => validateCatalog(derived, sources, stories), /redistribution not cleared/);
  const missing = structuredClone(stories);
  missing[0].source_ids = ['missing-source'];
  assert.throws(() => validateCatalog(assets, sources, missing), /Unknown story source/);
  assert.throws(() => validateCatalog([...assets, assets[0]], sources, stories), /Duplicate ID/);
  assert.throws(() =>
    assetSchema.parse({ ...assets[0], geometry_origin: 'derived', geometry_source_ids: [] }),
  );
});
