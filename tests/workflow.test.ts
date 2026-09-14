import test from 'node:test';
import assert from 'node:assert/strict';
import progress from '../content/workflow/progress.json';
import claims from '../content/workflow/tuas-claims.json';
import sources from '../content/workflow/tuas-sources.json';
import mrtClaims from '../content/workflow/mrt-claims.json';
import mrtSources from '../content/workflow/mrt-sources.json';
import reclamationClaims from '../content/workflow/reclamation-claims.json';
import reclamationSources from '../content/workflow/reclamation-sources.json';
import barrageClaims from '../content/workflow/barrage-claims.json';
import barrageSources from '../content/workflow/barrage-sources.json';
import { validateWorkflow } from '../packages/workflow';
import {
  projects,
  researchSources,
  projectSchema,
  runCommands,
  initialWorld,
  constructionStages,
  modelStage,
} from '../packages/world';
import { detailedExhibitSchema } from '../packages/world/detail';
const check = (p: unknown = progress, l: unknown = claims, s: unknown[] = sources, c = projects) =>
  validateWorkflow(
    p,
    [l, mrtClaims, barrageClaims, reclamationClaims],
    [...researchSources, ...s, ...mrtSources, ...barrageSources, ...reclamationSources],
    c,
  );
test('baseline records accepted demos and approved Tekong build', () =>
  assert.deepEqual(check(), []));
test('cannot build without approval or with stale approval', () => {
  const p = structuredClone(progress);
  p.projects[1].stage = 'building';
  p.projects[1].research_approval = null;
  assert.match(check(p).join(' '), /Gate A/);
  const approved = {
    ...p,
    projects: p.projects.map((x) =>
      x.project_id === 'tuas'
        ? {
            ...x,
            research_approval: {
              date: '2026-09-14',
              quote: 'test fixture only',
              evidence_file: 'fixture',
              revision: 'old',
            },
          }
        : x,
    ),
  };
  assert.match(check(approved).join(' '), /Gate A/);
});
test('parallel research, unauthorised advancement and order changes fail', () => {
  const p = structuredClone(progress);
  p.projects[1].stage = 'building';
  p.projects[2].stage = 'researching';
  p.projects[2].start_authorisation = null;
  const e = check(p).join(' ');
  assert.match(e, /More than one/);
  assert.match(e, /predecessor/);
  assert.match(e, /authorisation/);
  p.projects.reverse();
  assert.match(check(p).join(' '), /order/);
});
test('acceptance requires actual records and revision compatibility', () => {
  const p = structuredClone(progress);
  p.projects[1].stage = 'accepted';
  p.projects[1].acceptance = null;
  assert.match(check(p).join(' '), /acceptance/);
});
test('missing evidence and accuracy/provenance are rejected', () => {
  const l = structuredClone(claims);
  l.claims[0].evidence[0].source_id = 'missing';
  assert.match(check(progress, l).join(' '), /missing evidence/);
  assert.match(
    check(progress, {
      ...claims,
      claims: [{ ...claims.claims[0], accuracy_class: undefined }],
    }).join(' '),
    /Invalid claim/,
  );
  assert.match(
    check(progress, claims, [{ ...sources[0], licence: undefined }]).join(' '),
    /provenance/,
  );
});
const detail = () =>
  detailedExhibitSchema.parse({
    research_revision: 'tuas-r1',
    claim_ids: ['tuas-visual-mechanisms'],
    accuracy_class: 'schematic',
    components: [
      {
        id: 'caisson',
        title: 'Caisson',
        description: 'Illustrative',
        accuracy_class: 'schematic',
        claim_ids: ['tuas-caisson-function'],
      },
    ],
    stops: [
      {
        id: 'first',
        title: 'First',
        body: 'Inspect',
        camera: [1, 2, 3],
        target: [0, 0, 0],
        component_ids: ['caisson'],
        claim_ids: ['tuas-caisson-function'],
      },
    ],
    stages: Array.from({ length: 7 }, (_, i) => ({
      title: `Stage ${i}`,
      body: 'Illustrative',
      model_stage: i,
      accuracy_class: 'schematic',
      claim_ids: ['tuas-visual-mechanisms'],
    })),
  });
test('detailed content needs approved revision and resolvable claims', () => {
  const catalog = projects.map((p) =>
    p.project_id === 'tuas' ? projectSchema.parse({ ...p, detailed_exhibit: detail() }) : p,
  );
  const unapproved = structuredClone(progress);
  unapproved.projects[1].research_approval = null;
  assert.match(check(unapproved, claims, sources, catalog).join(' '), /Gate A/);
  catalog.find((p) => p.project_id === 'tuas')!.detailed_exhibit!.stages[0].claim_ids = ['missing'];
  assert.match(check(progress, claims, sources, catalog).join(' '), /missing\/wrong-project claim/);
});
test('project-specific stages work beyond five and invalid batches remain atomic', () => {
  const catalog = projects.map((p) =>
    p.project_id === 'tuas' ? projectSchema.parse({ ...p, detailed_exhibit: detail() }) : p,
  );
  const s = runCommands(
    initialWorld,
    [
      { type: 'focus', project: 'tuas' },
      { type: 'stage', stage: 6 },
    ],
    catalog,
  );
  assert.equal(s.stage, 6);
  assert.equal(constructionStages(catalog.find((p) => p.project_id === 'tuas')!).length, 7);
  assert.equal(
    modelStage(
      catalog.find((p) => p.project_id === 'tuas')!,
      6,
    ),
    6,
  );
  assert.equal(
    runCommands(
      initialWorld,
      [
        { type: 'focus', project: 'tuas' },
        { type: 'stage', stage: 7 },
      ],
      catalog,
    ),
    initialWorld,
  );
  assert.equal(runCommands(initialWorld, [{ type: 'stage', stage: 0 }], catalog), initialWorld);
  assert.equal(runCommands(s, [{ type: 'focus', project: 'mrt' }], catalog).stage, 8);
});

test('unselected recommendations and deferred marvels cannot start research', () => {
  for (const id of ['caverns', 'newater', 'power', 'coast']) {
    const p = structuredClone(progress);
    p.projects.find((project) => project.project_id === id)!.stage = 'researching';
    assert.match(check(p).join(' '), /outside selected reduced programme/);
  }
});
