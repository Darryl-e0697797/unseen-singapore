import test from 'node:test';
import assert from 'node:assert/strict';
import {
  initialReclamation,
  reclamationLabels,
  reclamationOperation,
  reclamationRoleVisible,
} from '../apps/web/components/explorer/reclamation-controls';
test('Tekong circulation and discharge are distinct and absent in historic views', () => {
  const v = { ...initialReclamation, focus: 6 };
  assert.deepEqual(reclamationOperation(v, 2026), { circulation: true, discharge: false });
  assert.deepEqual(reclamationOperation({ ...v, weather: 'wet' }, 2026), {
    circulation: false,
    discharge: true,
  });
  assert.deepEqual(reclamationOperation(v, 1965), { circulation: false, discharge: false });
});
test('Tekong temporary works respect local construction dependencies', () => {
  for (const role of ['enclosure', 'workwater', 'surcharge', 'ground', 'future', 'comparison'])
    assert(!reclamationRoleVisible(role, 1, initialReclamation, 'finished', 0, 2026), role);
  assert(reclamationRoleVisible('enclosure', 1, initialReclamation, 'construction', 2, 2026));
  assert(!reclamationRoleVisible('enclosure', 1, initialReclamation, 'construction', 3, 2026));
  assert(
    !reclamationRoleVisible(
      'outlet',
      2,
      { ...initialReclamation, focus: 3, progress: 0 },
      'finished',
      0,
      2026,
    ),
  );
  assert(
    reclamationRoleVisible(
      'outlet',
      2,
      { ...initialReclamation, focus: 3, progress: 50 },
      'finished',
      0,
      2026,
    ),
  );
});
test('Tekong labels follow peeled components and historic views contain no future geometry', () => {
  assert.deepEqual(reclamationLabels(initialReclamation, 'finished', 0, 2000), []);
  const v = { ...initialReclamation, focus: 4, progress: 100 };
  assert.equal(reclamationLabels(v, 'finished', 0, 2026).find((p) => p.id === 4)?.position[0], -24);
  assert(
    !reclamationRoleVisible('future', 8, { ...v, focus: 8, future: true }, 'finished', 0, 1965),
  );
  for (let focus = 0; focus < 9; focus++)
    for (let progress = 0; progress <= 100; progress += 25) {
      const labels = reclamationLabels(
        { ...initialReclamation, focus, progress },
        'finished',
        0,
        2026,
      );
      assert.equal(new Set(labels.map((p) => p.id)).size, labels.length);
    }
});
