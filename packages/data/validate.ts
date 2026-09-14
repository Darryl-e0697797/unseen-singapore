import type { z } from 'zod';
import type { Asset, Source, storySchema } from '../shared/schema';
import { applyCommands, initialScene } from '../scene-engine';
/** Editorial gate, independent of filesystem and renderer. */
export function validateCatalog(
  assets: Asset[],
  sources: Source[],
  stories: z.infer<typeof storySchema>[],
) {
  const require = (condition: unknown, message: string) => {
    if (!condition) throw new Error(message);
  };
  const registry = {
    assets: assets.map((a) => a.asset_id),
    sources: sources.map((s) => s.source_id),
  };
  for (const ids of [registry.assets, registry.sources, stories.map((s) => s.story_id)])
    require(new Set(ids).size === ids.length, 'Duplicate ID');
  for (const asset of assets) {
    for (const id of asset.source_ids) {
      const source = sources.find((s) => s.source_id === id);
      require(source, 'Unknown source');
      require(source?.asset_ids.includes(asset.asset_id), 'Missing reverse reference');
    }
    for (const id of asset.geometry_source_ids) {
      const source = sources.find((s) => s.source_id === id);
      require(source, 'Unknown geometry source');
      require(source?.redistribution_status === 'permitted', 'Geometry redistribution not cleared');
    }
  }
  for (const source of sources)
    for (const id of source.asset_ids)
      require(assets
        .find((a) => a.asset_id === id)
        ?.source_ids.includes(source.source_id), 'Broken reverse asset reference');
  for (const story of stories) {
    story.source_ids.forEach((id) =>
      require(registry.sources.includes(id), 'Unknown story source'),
    );
    story.asset_ids.forEach((id) => require(registry.assets.includes(id), 'Unknown story asset'));
    applyCommands(initialScene, story.commands, registry);
  }
}
