import { z } from 'zod';
export const id = z.string().regex(/^[a-z][a-z0-9-]{1,79}$/);
export const accuracy = z.enum(['documented', 'reconstructed', 'schematic', 'envisioned']);
export const system = z.enum(['surface', 'dtss', 'mrt']);
export const levelSchema = z.enum(['public', 'student', 'engineer', 'planning']);
export type Level = z.infer<typeof levelSchema>;
const date = z.iso.date();
const vec3 = z.tuple([z.number().finite(), z.number().finite(), z.number().finite()]);
export const temporalSchema = z
  .strictObject({
    valid_from: date.nullable(),
    valid_to: date.nullable(),
    era: z.enum(['historical', 'present', 'future']),
    status: z.enum([
      'operating',
      'under-construction',
      'planned',
      'decommissioned',
      'representative',
      'scenario',
    ]),
    confidence: z.enum(['high', 'medium', 'low']),
    scenario_id: id.nullable(),
  })
  .refine((t) => !t.valid_from || !t.valid_to || t.valid_from < t.valid_to, 'Invalid time interval')
  .refine((t) => t.era !== 'future' || t.scenario_id !== null, 'Future requires scenario');
export const sourceSchema = z.strictObject({
  source_id: id,
  organisation: z.string().min(1),
  title: z.string().min(1),
  url: z.url().startsWith('https://'),
  access_date: date,
  publication_date: date.nullable(),
  update_date: date.nullable(),
  licence: z.string().min(1),
  terms_url: z.url().nullable(),
  redistribution_status: z.enum(['permitted', 'restricted', 'unverified']),
  intended_use: z.string().min(1),
  asset_ids: z.array(id),
  reliability_level: z.enum(['primary', 'peer-reviewed', 'secondary']),
  notes: z.string().min(1),
});
const modelPath = z.string().regex(/^\/models\/[a-z0-9-]+\.glb$/);
export const assetSchema = z
  .strictObject({
    asset_id: id,
    name: z.string().min(1),
    system,
    category: z.string().min(1),
    accuracy_class: accuracy,
    source_ids: z.array(id),
    geometry_origin: z.enum(['original', 'derived']),
    geometry_source_ids: z.array(id),
    geometry_file: modelPath.nullable(),
    coordinate_space: z.enum(['local-schematic', 'svy21-local']),
    coordinates: vec3,
    bounds: z
      .strictObject({ min: vec3, max: vec3 })
      .refine((b) => b.min.every((v, i) => v < b.max[i]), 'Invalid bounds'),
    lods: z.array(
      z.strictObject({
        level: z.number().int().min(0).max(4),
        file: modelPath,
        max_distance_m: z.number().positive(),
      }),
    ),
    temporal: temporalSchema,
    description: z.string().min(1),
    public_description: z.string().min(1),
    engineering_description: z.string().min(1),
  })
  .refine(
    (a) => a.accuracy_class !== 'documented' || a.geometry_source_ids.length > 0,
    'Documented geometry requires direct geometry evidence',
  )
  .refine(
    (a) => a.geometry_origin !== 'derived' || a.geometry_source_ids.length > 0,
    'Derived geometry requires source IDs',
  )
  .refine(
    (a) => a.geometry_origin !== 'original' || a.geometry_source_ids.length === 0,
    'Original geometry cannot conceal derivation',
  )
  .refine(
    (a) => a.coordinate_space !== 'local-schematic' || a.accuracy_class === 'schematic',
    'Local schematic cannot claim geographic precision',
  )
  .refine(
    (a) => a.accuracy_class !== 'envisioned' || a.temporal.scenario_id !== null,
    'Envisioned asset requires scenario',
  );
export const commandSchema = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('resetScene') }),
  z.strictObject({ type: z.literal('focusAsset'), asset_id: id }),
  z.strictObject({ type: z.literal('setLayerVisibility'), layer: system, visible: z.boolean() }),
  z.strictObject({
    type: z.literal('setCamera'),
    preset: z.enum(['overview', 'underground', 'tunnel', 'rail']),
  }),
  z.strictObject({ type: z.literal('showSection'), enabled: z.boolean() }),
  z.strictObject({
    type: z.literal('traceSystem'),
    system: z.literal('dtss'),
    enabled: z.boolean(),
  }),
  z.strictObject({
    type: z.literal('showAnnotation'),
    annotation_id: z.enum(['purpose', 'flow', 'depth', 'rail']),
  }),
  z.strictObject({ type: z.literal('showSource'), source_id: id }),
  z.strictObject({ type: z.literal('setEra'), era: z.literal('present') }),
]);
export const batchSchema = z.array(commandSchema).max(16);
export type SceneCommand = z.infer<typeof commandSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type Source = z.infer<typeof sourceSchema>;
export const storySchema = z.strictObject({
  story_id: id,
  title: z.string().min(1),
  accuracy_class: accuracy,
  source_ids: z.array(id).min(1),
  asset_ids: z.array(id).min(1),
  narratives: z.strictObject({
    public: z.string().min(1),
    student: z.string().min(1),
    engineer: z.string().min(1),
    planning: z.string().min(1),
  }),
  commands: batchSchema,
});
/** Input: local east,north,height (metres). glTF's standard Z-up to Y-up transform. */
export function toRuntime([east, north, height]: [number, number, number]): [
  number,
  number,
  number,
] {
  return [east, height, -north];
}
export function validAt(t: z.infer<typeof temporalSchema>, at: string): boolean {
  date.parse(at);
  return (!t.valid_from || at >= t.valid_from) && (!t.valid_to || at < t.valid_to);
}
