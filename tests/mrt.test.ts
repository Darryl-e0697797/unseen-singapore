import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialMrt,
  mrtRoleVisible,
  mrtLabels,
} from '../apps/web/components/explorer/mrt-controls';
test('MRT temporary equipment is absent from the completed station', () => {
  for (const role of ['braces', 'opening', 'tbm', 'conveyor', 'ice', 'freeze-pipes', 'segment'])
    assert.equal(mrtRoleVisible(role, 6, initialMrt, 'finished', 8, 2026), false, role);
  assert.equal(mrtRoleVisible('train', 8, initialMrt, 'finished', 8, 2026), true);
});
test('MRT freezing is a separate case and cannot leak into normal construction', () => {
  const v = { ...initialMrt, focus: 7 };
  assert.equal(mrtRoleVisible('ice', 8, v, 'finished', 8, 2026), true);
  assert.equal(mrtRoleVisible('train', 8, v, 'finished', 8, 2026), false);
  assert.equal(mrtRoleVisible('ice', 8, v, 'construction', 8, 2026), false);
  assert.deepEqual(
    mrtLabels(v, 'finished', 8, 2026).map((p) => p.id),
    [11],
  );
});
test('MRT alternative methods and historical states retain correct visibility', () => {
  assert.equal(
    mrtRoleVisible('roof', 3, { ...initialMrt, method: 'bottom-up' }, 'construction', 3, 2026),
    false,
  );
  assert.equal(mrtRoleVisible('roof', 3, initialMrt, 'construction', 3, 2026), true);
  assert.equal(mrtRoleVisible('train', 8, initialMrt, 'finished', 8, 2000), false);
  assert.deepEqual(mrtLabels(initialMrt, 'finished', 8, 1958), []);
});
test('MRT labels follow local assembly visibility and completed freezing removes treatment', () => {
  const ids = (focus: number, progress: number) =>
    mrtLabels({ ...initialMrt, focus, progress }, 'finished', 8, 2026).map((p) => p.id);
  assert(!ids(5, 0).includes(8));
  assert(!ids(5, 45).includes(9));
  assert(ids(5, 65).includes(9));
  assert(!ids(7, 100).includes(11));
  assert(
    !mrtRoleVisible(
      'freeze-pipes',
      8,
      { ...initialMrt, focus: 7, progress: 100 },
      'finished',
      8,
      2026,
    ),
  );
});
