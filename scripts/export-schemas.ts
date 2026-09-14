import { z } from 'zod';
import { mkdirSync, writeFileSync } from 'node:fs';
import { sourceSchema, assetSchema, storySchema, batchSchema } from '../packages/shared/schema';
mkdirSync('content/schemas', { recursive: true });
for (const [name, schema] of Object.entries({
  source: sourceSchema,
  asset: assetSchema,
  story: storySchema,
  commands: batchSchema,
})) {
  writeFileSync(
    `content/schemas/${name}.schema.json`,
    JSON.stringify(z.toJSONSchema(schema), null, 2) + '\n',
  );
}
console.log(
  'Exported JSON Schemas. Cross-field refinements remain enforced by runtime Zod validation.',
);
