import test from 'node:test';
import assert from 'node:assert/strict';
import { initialWorld, runCommands, askWorld, validateWorld, projects } from '../packages/world';
test('all nine dossiers have fully sourced snapshots and future qualifications', () => {
  assert.equal(projects.length, 9);
  assert.deepEqual(validateWorld(), []);
});
test('invalid scene batches are rejected atomically', () => {
  for (const commands of [
    [
      { type: 'focus', project: 'tuas' },
      { type: 'stage', stage: 9 },
    ],
    [{ type: 'focus', project: 'secret-tunnel' }],
    [{ type: 'era', year: 1930 }],
    [{ type: 'mode', mode: 'execute', code: 'alert(1)' }],
  ])
    assert.equal(runCommands(initialWorld, commands), initialWorld);
});
test('Tuas construction request opens a physical sequence and preserves era', () => {
  const a = askWorld('How was Tuas Port built?');
  const s = runCommands({ ...initialWorld, year: 1965 }, a.commands);
  assert.equal(s.project, 'tuas');
  assert.equal(s.mode, 'construction');
  assert.equal(s.stage, 0);
  assert.equal(s.year, 1965);
});
test('era commands do not reset camera-relevant project or construction progress', () => {
  const s = runCommands({ ...initialWorld, project: 'mrt', stage: 2, mode: 'construction' }, [
    { type: 'era', year: 2050 },
  ]);
  assert.equal(s.project, 'mrt');
  assert.equal(s.stage, 2);
  assert.equal(s.year, 2050);
});
test('unsupported questions do not fabricate an asset', () => {
  assert.deepEqual(askWorld('Show a classified alignment').commands, []);
});
