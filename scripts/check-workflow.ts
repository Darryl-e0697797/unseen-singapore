import { upgradesSchema, validateUpgrades } from '../packages/workflow/upgrades';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { projects, researchSources } from '../packages/world';
import { progressSchema, validateWorkflow } from '../packages/workflow';
const json = (file: string) => JSON.parse(readFileSync(file, 'utf8'));
const progress = progressSchema.parse(json('content/workflow/progress.json'));
const names = readdirSync('content/workflow');
const ledgers = names
  .filter((f) => f.endsWith('-claims.json'))
  .map((f) => json('content/workflow/' + f));
const sources = names
  .filter((f) => f.endsWith('-sources.json'))
  .flatMap((f) => json('content/workflow/' + f));
const errors = validateWorkflow(progress, ledgers, [...researchSources, ...sources], projects);
for (const p of progress.projects) {
  for (const evidence of [p.research_approval, p.acceptance, p.start_authorisation].filter(
    (e) => e !== null,
  )) {
    if (
      !existsSync(evidence.evidence_file) ||
      !readFileSync(evidence.evidence_file, 'utf8').includes(evidence.quote)
    )
      errors.push(`${p.project_id}: approval quotation missing from evidence file`);
  }
  if (['queued', 'researching', 'awaiting-research-approval'].includes(p.stage)) {
    const hash = createHash('sha256')
      .update(readFileSync(`apps/web/public/models/world-${p.project_id}.glb`))
      .digest('hex');
    if (hash !== p.baseline_model_sha256)
      errors.push(`${p.project_id}: model changed before Gate A`);
  }
}
const upgrades = upgradesSchema.parse(json('content/workflow/upgrades.json'));
errors.push(...validateUpgrades(upgrades, progress));
for (const row of upgrades.upgrades) {
  if (
    !existsSync(row.brief) ||
    createHash('sha256').update(readFileSync(row.brief)).digest('hex') !== row.brief_sha256
  )
    errors.push(`${row.revision}: approved brief changed`);
  for (const evidence of [row.start_authorisation, row.approval, row.acceptance].filter(
    (e) => e !== null,
  )) {
    if (
      !existsSync(evidence.evidence_file) ||
      !readFileSync(evidence.evidence_file, 'utf8').includes(evidence.quote)
    )
      errors.push(`${row.revision}: approval quotation missing`);
  }
}
const target = process.argv[2];
if (target) {
  const p = progress.projects.find((p) => p.project_id === target);
  const approvedUpgrade = upgrades.upgrades.some(
    (r) => r.project_id === target && r.stage === 'building',
  );
  if (
    !approvedUpgrade &&
    (!p || p.stage !== 'building' || p.research_approval?.revision !== p.research_revision)
  )
    errors.push(`${target}: detailed build is not authorised; explicit Gate A approval required`);
}
assert.deepEqual(errors, [], 'Marvel approval/evidence checks failed');
console.log(
  `Workflow valid: ${progress.projects
    .filter((p) => !['queued', 'accepted'].includes(p.stage))
    .map((p) => p.project_id + ' ' + p.stage)
    .join(', ')}. Approval authenticity and engineering truth require human/source review.`,
);
