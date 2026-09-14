import { z } from 'zod';
import programmeData from '../../content/workflow/programme.json';
import { accuracy, sourceSchema } from '../shared/schema';
import { projectIds, type Project } from '../world';
const programme = z
  .strictObject({
    remaining_limit: z.literal(4),
    selected_remaining: z.array(z.enum(projectIds)).max(4),
    recommended_remaining: z.array(z.enum(projectIds)),
    deferred: z.array(z.enum(projectIds)),
    recommendations_approved: z.boolean(),
  })
  .parse(programmeData);
const text = z.string().min(1);
const approval = z.strictObject({
  date: z.iso.date(),
  quote: text,
  evidence_file: text,
  revision: text.nullable(),
});
export const progressSchema = z.strictObject({
  version: z.literal(1),
  projects: z
    .array(
      z.strictObject({
        project_id: z.enum(projectIds),
        stage: z.enum([
          'queued',
          'researching',
          'awaiting-research-approval',
          'building',
          'awaiting-acceptance',
          'accepted',
        ]),
        research_revision: text.nullable(),
        research_approval: approval.nullable(),
        acceptance: approval.nullable(),
        accepted_build_commit: z
          .string()
          .regex(/^[a-f0-9]{7,40}$/)
          .nullable(),
        start_authorisation: approval.nullable(),
        baseline_model_sha256: z.string().regex(/^[a-f0-9]{64}$/),
      }),
    )
    .length(9),
});
export const claimSchema = z.strictObject({
  claim_id: text,
  project_id: z.enum(projectIds),
  statement: text,
  accuracy_class: accuracy,
  verification: z.enum(['corroborated', 'single-source', 'qualified', 'illustrative']),
  evidence: z.array(z.strictObject({ source_id: text, locator: text })).min(1),
  phase: text,
  limitations: text,
});
export const ledgerSchema = z.strictObject({
  revision: text,
  project_id: z.enum(projectIds),
  claims: z.array(claimSchema).min(1),
});
export type Progress = z.infer<typeof progressSchema>;
export type Ledger = z.infer<typeof ledgerSchema>;
export function validateWorkflow(
  input: unknown,
  ledgerInputs: unknown[],
  sourceInputs: unknown[],
  catalog: readonly Project[],
) {
  const errors: string[] = [];
  const parsed = progressSchema.safeParse(input);
  if (!parsed.success) return ['Invalid progress register: ' + parsed.error.message];
  const progress = parsed.data;
  const order = [
    'dtss',
    'tuas',
    'mrt',
    'barrage',
    'reclamation',
    'caverns',
    'newater',
    'power',
    'coast',
  ];
  if (progress.projects.some((p, i) => p.project_id !== order[i]))
    errors.push('Project order differs from approved programme');
  const ledgers: Ledger[] = [];
  for (const input of ledgerInputs) {
    const l = ledgerSchema.safeParse(input);
    if (!l.success) errors.push('Invalid claim ledger: ' + l.error.message);
    else ledgers.push(l.data);
  }
  const sources = z.array(sourceSchema).safeParse(sourceInputs);
  if (!sources.success) return [...errors, 'Invalid source provenance: ' + sources.error.message];
  const sourceIds = new Set(sources.data.map((s) => s.source_id));
  if (sourceIds.size !== sources.data.length) errors.push('Duplicate source IDs');
  if (new Set(progress.projects.map((p) => p.project_id)).size !== 9)
    errors.push('Duplicate/missing projects');
  if (progress.projects.filter((p) => !['queued', 'accepted'].includes(p.stage)).length > 1)
    errors.push('More than one active marvel');
  const claims = new Map<string, z.infer<typeof claimSchema>>();
  for (const ledger of ledgers)
    for (const c of ledger.claims) {
      if (c.project_id !== ledger.project_id) errors.push(`${c.claim_id}: wrong ledger project`);
      if (claims.has(c.claim_id)) errors.push(`Duplicate claim ${c.claim_id}`);
      claims.set(c.claim_id, c);
      for (const e of c.evidence)
        if (!sourceIds.has(e.source_id))
          errors.push(`${c.claim_id}: missing evidence source ${e.source_id}`);
      if (c.verification === 'corroborated' && new Set(c.evidence.map((e) => e.source_id)).size < 2)
        errors.push(`${c.claim_id}: corroboration needs two sources`);
    }
  if (programme.selected_remaining.length > programme.remaining_limit)
    errors.push('Reduced programme exceeds remaining build limit');
  for (const [i, p] of progress.projects.entries()) {
    if (
      !['queued', 'accepted'].includes(p.stage) &&
      !['dtss', 'tuas', ...programme.selected_remaining].includes(p.project_id)
    )
      errors.push(`${p.project_id}: outside selected reduced programme`);
    if (p.stage !== 'queued' && i > 0) {
      if (progress.projects[i - 1].stage !== 'accepted')
        errors.push(`${p.project_id}: predecessor not accepted`);
      if (!p.start_authorisation)
        errors.push(`${p.project_id}: missing next-project authorisation`);
    }
    if (
      ['researching', 'awaiting-research-approval', 'building', 'awaiting-acceptance'].includes(
        p.stage,
      ) &&
      !p.research_revision
    )
      errors.push(`${p.project_id}: missing research revision`);
    if (
      (['awaiting-research-approval', 'building', 'awaiting-acceptance'].includes(p.stage) ||
        (p.stage === 'accepted' && p.project_id !== 'dtss')) &&
      !ledgers.some((l) => l.project_id === p.project_id && l.revision === p.research_revision)
    )
      errors.push(`${p.project_id}: missing current claim ledger`);
    if (
      ['building', 'awaiting-acceptance'].includes(p.stage) &&
      (!p.research_approval || p.research_approval.revision !== p.research_revision)
    )
      errors.push(`${p.project_id}: Gate A approval missing or stale`);
    // DTSS predates the new gate process; only its existing acceptance is grandfathered.
    if (p.stage === 'accepted') {
      if (!p.acceptance || !p.accepted_build_commit)
        errors.push(`${p.project_id}: missing acceptance/build commit`);
      if (
        p.project_id !== 'dtss' &&
        (!p.research_approval ||
          p.research_approval.revision !== p.research_revision ||
          p.acceptance?.revision !== p.research_revision)
      )
        errors.push(`${p.project_id}: accepted revision is not approved`);
    }
    const project = catalog.find((c) => c.project_id === p.project_id);
    const detail = project?.detailed_exhibit;
    if (detail && !['building', 'awaiting-acceptance', 'accepted'].includes(p.stage))
      errors.push(`${p.project_id}: detailed content is incompatible with workflow stage`);
    if (
      detail &&
      (!p.research_approval ||
        p.research_approval.revision !== detail.research_revision ||
        detail.research_revision !== p.research_revision)
    )
      errors.push(`${p.project_id}: detailed content requires matching Gate A approval`);
    const refs = [
      ...(project?.claim_ids ?? []),
      ...(detail?.claim_ids ?? []),
      ...(detail?.components.flatMap((c) => c.claim_ids) ?? []),
      ...(detail?.stops.flatMap((c) => c.claim_ids) ?? []),
      ...(detail?.stages.flatMap((c) => c.claim_ids) ?? []),
    ];
    for (const id of refs)
      if (claims.get(id)?.project_id !== p.project_id)
        errors.push(`${p.project_id}: missing/wrong-project claim ${id}`);
  }
  return errors;
}
