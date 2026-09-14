import { z } from 'zod';
import { accuracy } from '../shared/schema';
const claimRefs = z.array(z.string().min(1)).min(1);
const point = z.tuple([z.number().finite(), z.number().finite(), z.number().finite()]);
export const detailedExhibitSchema = z
  .strictObject({
    research_revision: z.string().min(1),
    claim_ids: claimRefs,
    accuracy_class: accuracy,
    components: z
      .array(
        z.strictObject({
          id: z.string().min(1),
          title: z.string().min(1),
          description: z.string().min(1),
          accuracy_class: accuracy,
          claim_ids: claimRefs,
        }),
      )
      .min(1),
    stops: z
      .array(
        z.strictObject({
          id: z.string().min(1),
          title: z.string().min(1),
          body: z.string().min(1),
          camera: point,
          target: point,
          component_ids: z.array(z.string()).min(1),
          claim_ids: claimRefs,
        }),
      )
      .min(1),
    stages: z
      .array(
        z.strictObject({
          title: z.string().min(1),
          body: z.string().min(1),
          model_stage: z.number().int().nonnegative(),
          accuracy_class: accuracy,
          claim_ids: claimRefs,
        }),
      )
      .min(1),
  })
  .superRefine((value, ctx) => {
    const ids = value.components.map((c) => c.id);
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({ code: 'custom', message: 'Duplicate component IDs' });
    if (new Set(value.stops.map((s) => s.id)).size !== value.stops.length)
      ctx.addIssue({ code: 'custom', message: 'Duplicate stop IDs' });
    for (const s of value.stops)
      for (const id of s.component_ids)
        if (!ids.includes(id)) ctx.addIssue({ code: 'custom', message: `Unknown component ${id}` });
  });
