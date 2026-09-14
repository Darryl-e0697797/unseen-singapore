import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialBarrage,
  barrageOperation,
  barrageLabels,
  barrageRoleVisible,
} from '../apps/web/components/explorer/barrage-controls';
test('Barrage teaching states keep tidal barrier and pumping consistent', () => {
  const v = { ...initialBarrage, focus: 5 };
  assert.deepEqual(barrageOperation({ ...v, weather: 'low' }, 2026), {
    gateOpen: true,
    pumping: false,
  });
  assert.deepEqual(barrageOperation({ ...v, weather: 'high' }, 2026), {
    gateOpen: false,
    pumping: true,
  });
  assert.deepEqual(barrageOperation(v, 2026), { gateOpen: false, pumping: false });
  assert.deepEqual(barrageOperation({ ...v, weather: 'high' }, 2000), {
    gateOpen: false,
    pumping: false,
  });
});
test('Barrage work enclosure, section and future proposal never leak into present overview', () => {
  for (const role of ['enclosure', 'temporary', 'section-gate', 'impeller', 'future'])
    assert.equal(barrageRoleVisible(role, 1, initialBarrage, 'finished', 0, 2026), false, role);
  assert.equal(
    barrageRoleVisible(
      'future',
      8,
      { ...initialBarrage, focus: 8, future: true },
      'finished',
      0,
      2026,
    ),
    true,
  );
  assert.equal(
    barrageRoleVisible(
      'future',
      8,
      { ...initialBarrage, focus: 8, future: true },
      'finished',
      0,
      2000,
    ),
    false,
  );
});
test('Drawing labels follow visible parts and historical geometry stays absent', () => {
  assert.deepEqual(barrageLabels(initialBarrage, 'finished', 0, 1965), []);
  const construction = barrageLabels({ ...initialBarrage, focus: 2 }, 'finished', 0, 2026).map(
    (p) => p.id,
  );
  assert.deepEqual(construction, [10, 11]);
  const dry = barrageLabels({ ...initialBarrage, focus: 4, weather: 'low' }, 'finished', 0, 2026);
  assert.equal(dry.find((p) => p.id === 3)?.position[2], 4);
  assert(!dry.some((p) => p.id === 7));
});
