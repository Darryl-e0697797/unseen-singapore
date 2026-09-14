import { batchSchema, type SceneCommand } from '../shared/schema';
export type SceneState = {
  reveal: boolean;
  layers: Record<'surface' | 'dtss' | 'mrt', boolean>;
  camera: 'overview' | 'underground' | 'tunnel' | 'rail';
  cameraRevision: number;
  selected: string | null;
  tracing: boolean;
  annotation: string | null;
  sources: string[];
  era: 'present';
};
export const initialScene: SceneState = {
  reveal: false,
  layers: { surface: true, dtss: true, mrt: true },
  camera: 'overview',
  cameraRevision: 0,
  selected: null,
  tracing: false,
  annotation: null,
  sources: [],
  era: 'present',
};
export type Registry = { assets: readonly string[]; sources: readonly string[] };
export function applyCommands(state: SceneState, input: unknown, registry: Registry): SceneState {
  const commands = batchSchema.parse(input);
  for (const c of commands) {
    if (c.type === 'focusAsset' && !registry.assets.includes(c.asset_id))
      throw new Error('Unknown asset');
    if (c.type === 'showSource' && !registry.sources.includes(c.source_id))
      throw new Error('Unknown source');
  }
  return commands.reduce(reduce, state);
}
function reduce(s: SceneState, c: SceneCommand): SceneState {
  switch (c.type) {
    case 'resetScene':
      return {
        ...initialScene,
        layers: { ...initialScene.layers },
        sources: [],
        cameraRevision: s.cameraRevision + 1,
      };
    case 'focusAsset':
      return { ...s, selected: c.asset_id };
    case 'setLayerVisibility':
      return {
        ...s,
        layers: { ...s.layers, [c.layer]: c.visible },
        tracing: c.layer === 'dtss' && !c.visible ? false : s.tracing,
      };
    case 'setCamera':
      return { ...s, camera: c.preset, cameraRevision: s.cameraRevision + 1 };
    case 'showSection':
      return { ...s, reveal: c.enabled, tracing: c.enabled ? s.tracing : false };
    case 'traceSystem':
      return { ...s, tracing: c.enabled && s.reveal && s.layers.dtss };
    case 'showAnnotation':
      return { ...s, annotation: c.annotation_id };
    case 'showSource':
      return { ...s, sources: [...new Set([...s.sources, c.source_id])] };
    case 'setEra':
      return { ...s, era: c.era };
  }
}
