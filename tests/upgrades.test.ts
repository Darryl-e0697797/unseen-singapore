import test from 'node:test';
import assert from 'node:assert/strict';
import progress from '../content/workflow/progress.json';
import upgrades from '../content/workflow/upgrades.json';
import { progressSchema } from '../packages/workflow';
import { validateUpgrades } from '../packages/workflow/upgrades';
const baseline = progressSchema.parse(progress);
test('approved upgrade preserves original acceptance and validates', () =>
  assert.deepEqual(validateUpgrades(upgrades, baseline), []));
test('upgrade rejects missing or stale approval and concurrent work', () => {
  const missing = structuredClone(upgrades);
  missing.upgrades[0].approval = null as never;
  assert.match(validateUpgrades(missing, baseline).join(), /Gate A/);
  const stale = structuredClone(upgrades);
  stale.upgrades[0].approval.revision = 'old';
  assert.match(validateUpgrades(stale, baseline).join(), /Gate A/);
  const changed = structuredClone(upgrades);
  changed.upgrades[0].brief_sha256 = '0'.repeat(64);
  assert.match(validateUpgrades(changed, baseline).join(), /Gate A/);
  const parallel = structuredClone(upgrades);
  parallel.upgrades.push({ ...parallel.upgrades[0], revision: 'another' });
  assert.match(validateUpgrades(parallel, baseline).join(), /More than one/);
  const competing = structuredClone(baseline);
  competing.projects[5].stage = 'researching';
  assert.match(validateUpgrades(upgrades, competing).join(), /More than one/);
  const accepted = structuredClone(upgrades);
  accepted.upgrades[0].stage = 'accepted';
  assert.match(validateUpgrades(accepted, baseline).join(), /Gate B/);
});
