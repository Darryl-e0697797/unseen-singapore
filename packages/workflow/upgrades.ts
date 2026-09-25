import { z } from 'zod';
import type { Progress } from './index';
const evidence = z.strictObject({
  date: z.iso.date(),
  quote: z.string().min(1),
  evidence_file: z.string().min(1),
});
export const upgradesSchema = z.strictObject({
  version: z.literal(1),
  upgrades: z.array(
    z.strictObject({
      project_id: z.string().min(1),
      revision: z.string().min(1),
      stage: z.enum(['awaiting-research-approval', 'building', 'awaiting-acceptance', 'accepted']),
      brief: z.string().min(1),
      brief_sha256: z.string().regex(/^[a-f0-9]{64}$/),
      start_authorisation: evidence,
      approval: evidence
        .extend({ revision: z.string().min(1), brief_sha256: z.string().regex(/^[a-f0-9]{64}$/) })
        .nullable(),
      acceptance: evidence.nullable(),
    }),
  ),
});
export function validateUpgrades(input: unknown, progress: Progress): string[] {
  const parsed = upgradesSchema.safeParse(input);
  if (!parsed.success) return ['Invalid upgrade register'];
  const rows = parsed.data.upgrades,
    errors: string[] = [];
  if (new Set(rows.map((r) => r.revision)).size !== rows.length)
    errors.push('Duplicate upgrade revision');
  const active = rows.filter((r) => r.stage !== 'accepted');
  if (
    active.length +
      progress.projects.filter((p) => !['accepted', 'queued'].includes(p.stage)).length >
    1
  )
    errors.push('More than one active marvel or upgrade');
  for (const r of rows) {
    if (progress.projects.find((p) => p.project_id === r.project_id)?.stage !== 'accepted')
      errors.push(`${r.revision}: upgrade requires accepted baseline`);
    if (
      r.stage !== 'awaiting-research-approval' &&
      (!r.approval ||
        r.approval.revision !== r.revision ||
        r.approval.brief_sha256 !== r.brief_sha256)
    )
      errors.push(`${r.revision}: matching Gate A approval required`);
    if (r.stage === 'accepted' && !r.acceptance)
      errors.push(`${r.revision}: Gate B acceptance required`);
  }
  return errors;
}
