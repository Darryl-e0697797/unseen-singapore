import sourceData from '../../content/sources/registry.json';
import assetData from '../../content/systems/assets.json';
import storyData from '../../content/stories/dtss.json';
import { z } from 'zod';
import { assetSchema, sourceSchema, storySchema } from '../shared/schema';
export const sources = z.array(sourceSchema).parse(sourceData);
export const assets = z.array(assetSchema).parse(assetData);
export const stories = z.array(storySchema).parse(storyData);
export const registry = {
  assets: assets.map((a) => a.asset_id),
  sources: sources.map((s) => s.source_id),
};
