import { z } from 'zod';
import { detailedExhibitSchema } from './detail';
import reclamationExhibit from '../../content/workflow/reclamation-exhibit.json';
import barrageExhibit from '../../content/workflow/barrage-exhibit.json';
import mrtExhibit from '../../content/workflow/mrt-exhibit.json';
import tuasExhibit from '../../content/workflow/tuas-exhibit.json';
import projectData from '../../content/research/projects.json';
import sourceData from '../../content/research/sources.json';
import eraData from '../../content/research/eras.json';
import notebookData from '../../content/research/notebooks.json';
export const notebooks = z
  .record(
    z.enum([
      'dtss',
      'mrt',
      'tuas',
      'newater',
      'barrage',
      'reclamation',
      'coast',
      'caverns',
      'power',
    ]),
    z.array(z.object({ title: z.string(), body: z.string() })).length(5),
  )
  .parse(notebookData);
import { sourceSchema } from '../shared/schema';
export const years = [1958, 1965, 2000, 2026, 2050] as const;
export const yearSchema = z.union([
  z.literal(1958),
  z.literal(1965),
  z.literal(2000),
  z.literal(2026),
  z.literal(2050),
]);
export const projectIds = [
  'dtss',
  'mrt',
  'tuas',
  'newater',
  'barrage',
  'reclamation',
  'coast',
  'caverns',
  'power',
] as const;
const refs = z.array(z.string()).min(1);
export const projectSchema = z.object({
  project_id: z.enum(projectIds),
  title: z.string(),
  short_title: z.string(),
  theme: z.string(),
  anchor: z.tuple([z.number(), z.number()]),
  color: z.string().regex(/^#[\da-f]{6}$/i),
  current_status: z.string(),
  metric: z.object({ value: z.string(), label: z.string() }),
  summary: z.string(),
  source_ids: refs,
  claim_ids: refs.optional(),
  detailed_exhibit: detailedExhibitSchema.optional(),
  model_file: z.string().regex(/^\/models\/world-[a-z]+\.glb$/),
  accuracy_class: z.literal('schematic'),
  location_note: z.string(),
  chapters: z
    .array(
      z.object({
        title: z.string(),
        body: z.string(),
        source_ids: refs,
        kind: z.enum(['documented', 'interpretation']),
      }),
    )
    .length(5),
  stages: z.array(z.object({ title: z.string(), body: z.string() })).length(5),
  events: z.array(
    z.object({
      year: z.number().int(),
      title: z.string(),
      source_id: z.string(),
      target: z.boolean(),
    }),
  ),
  snapshots: z
    .array(
      z.object({
        year: yearSchema,
        status: z.enum([
          'pre-project',
          'operating',
          'construction',
          'planning',
          'scenario',
          'target',
          'early-work',
          'demonstration',
          'mixed',
          'context',
          'official-target',
          'pre-operation',
        ]),
        summary: z.string(),
        source_ids: refs,
      }),
    )
    .length(5),
});
export const projects = z.array(projectSchema).parse(
  projectData.map((p) =>
    p.project_id === 'tuas'
      ? {
          ...p,
          detailed_exhibit: tuasExhibit,
          current_status:
            'Operating and expanding · PSA reported 14 operating berths on 6 August 2026',
          claim_ids: ['tuas-operating', 'tuas-capacity'],
        }
      : p.project_id === 'mrt'
        ? {
            ...p,
            detailed_exhibit: mrtExhibit,
            claim_ids: ['mrt-visual'],
            current_status: 'Operating network · original underground teaching section',
          }
        : p.project_id === 'barrage'
          ? {
              ...p,
              detailed_exhibit: barrageExhibit,
              claim_ids: ['barrage-purpose'],
              current_status: 'Operating reservoir and tidal barrier · future retrofit proposed',
            }
          : p.project_id === 'reclamation'
            ? {
                ...p,
                detailed_exhibit: reclamationExhibit,
                claim_ids: ['reclamation-present'],
                current_status: 'Main works completed · testing and commissioning in 2025',
              }
            : p,
  ),
);
export const researchSources = z.array(sourceSchema).parse(sourceData);
export const eras = z
  .array(
    z.object({
      year: yearSchema,
      label: z.string(),
      title: z.string(),
      body: z.string(),
      source_ids: refs,
    }),
  )
  .parse(eraData);
export type Project = (typeof projects)[number];
export type Year = z.infer<typeof yearSchema>;
export type ProjectId = Project['project_id'];
export const commandSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('focus'), project: z.enum(projectIds) }).strict(),
  z.object({ type: z.literal('era'), year: yearSchema }).strict(),
  z.object({ type: z.literal('stage'), stage: z.number().int().min(0) }).strict(),
  z
    .object({ type: z.literal('mode'), mode: z.enum(['finished', 'construction', 'exploded']) })
    .strict(),
  z.object({ type: z.literal('reset') }).strict(),
]);
export type WorldState = {
  project: ProjectId | null;
  year: Year;
  stage: number;
  mode: 'finished' | 'construction' | 'exploded';
};
export const initialWorld: WorldState = { project: null, year: 2026, stage: 4, mode: 'finished' };
export function constructionStages(project: Project) {
  return project.detailed_exhibit?.stages ?? project.stages;
}
export function modelStage(project: Project, stage: number) {
  return project.detailed_exhibit?.stages[stage]?.model_stage ?? stage;
}
export function runCommands(
  state: WorldState,
  input: unknown,
  catalog: readonly Project[] = projects,
): WorldState {
  const result = z.array(commandSchema).max(10).safeParse(input);
  if (!result.success) return state;
  let next = state;
  for (const c of result.data) {
    switch (c.type) {
      case 'focus': {
        const project = catalog.find((p) => p.project_id === c.project);
        if (!project) return state;
        next = {
          ...next,
          project: c.project,
          mode: 'finished',
          stage: constructionStages(project).length - 1,
        };
        break;
      }
      case 'era':
        next = { ...next, year: c.year };
        break;
      case 'mode':
        next = { ...next, mode: c.mode };
        break;
      case 'stage': {
        const project = catalog.find((p) => p.project_id === next.project);
        if (!project || c.stage >= constructionStages(project).length) return state;
        next = { ...next, mode: 'construction', stage: c.stage };
        break;
      }
      case 'reset':
        next = { ...initialWorld, year: next.year };
        break;
    }
  }
  return next;
}
export function askWorld(question: string) {
  const q = question.toLowerCase();
  if (/exact|survey|classified|confidential|precise.*(route|alignment|coordinate)/.test(q))
    return {
      commands: [],
      project: undefined,
      message:
        'This atlas contains no survey-accurate underground routes or confidential infrastructure information. Choose a project to inspect its labelled schematic and public sources.',
    };
  const keys: Record<ProjectId, RegExp> = {
    dtss: /dtss|sewer|used water/,
    mrt: /mrt|rail|station|train/,
    tuas: /tuas|port|caisson/,
    newater: /newater|membrane|reuse|purif/,
    barrage: /barrage|reservoir|gate/,
    reclamation: /reclaim|polder|land mak/,
    coast: /coast|long island|sea level|resilien/,
    caverns: /cavern|rock|storage/,
    power: /power|electri|cable/,
  };
  const id = projectIds.find((id) => keys[id].test(q));
  const yr = years.find((y) => q.includes(String(y))) ?? (q.includes('1950') ? 1958 : undefined);
  const commands: z.infer<typeof commandSchema>[] = [];
  if (id) commands.push({ type: 'focus', project: id });
  if (yr) commands.push({ type: 'era', year: yr });
  if (id && /how|built|construct|build/.test(q)) commands.push({ type: 'stage', stage: 0 });
  return {
    commands,
    project: id,
    message: id
      ? `Opening ${projects.find((p) => p.project_id === id)!.title}${/how|built|construct|build/.test(q) ? ' at the first construction stage' : ''}. Explore the sourced chapters below.`
      : yr
        ? `Showing the ${yr === 1958 ? '1950s' : yr} evidence snapshot for every project.`
        : 'Choose a project name or ask about Tuas construction, MRT tunnelling, used water, reclamation or coastal resilience. This guide uses authored routing, not a live language model.',
  };
}
export function validateWorld() {
  const ids = new Set(researchSources.map((s) => s.source_id));
  const errors: string[] = [];
  for (const p of projects) {
    if (new Set(p.snapshots.map((s) => s.year)).size !== 5)
      errors.push(`${p.project_id}: incomplete timeline`);
    for (const id of [
      ...p.source_ids,
      ...p.chapters.flatMap((c) => c.source_ids),
      ...p.snapshots.flatMap((s) => s.source_ids),
      ...p.events.map((e) => e.source_id),
    ])
      if (!ids.has(id)) errors.push(`${p.project_id}: missing source ${id}`);
    if (
      !['scenario', 'target', 'official-target'].includes(
        p.snapshots.find((s) => s.year === 2050)!.status,
      )
    )
      errors.push(`${p.project_id}: future presented as fact`);
  }
  for (const e of eras)
    for (const id of e.source_ids)
      if (!ids.has(id)) errors.push(`era ${e.year}: missing source ${id}`);
  return errors;
}
