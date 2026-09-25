import { Mesh, MeshStandardMaterial, type Material, type Object3D } from 'three';
/** Editorial material treatment only; colours/finish are not surveyed specifications. */
export const dtssPalette: Record<string, { color: string; roughness: number; metalness: number }> =
  {
    'warm-concrete': { color: '#d4cec0', roughness: 0.88, metalness: 0 },
    'compacted-fill': { color: '#928879', roughness: 1, metalness: 0 },
    'excavated-strata': { color: '#354a49', roughness: 0.96, metalness: 0 },
    'structural-steel': { color: '#9bb0b4', roughness: 0.34, metalness: 0.4 },
    porcelain: { color: '#e2e0ca', roughness: 0.42, metalness: 0 },
    'infrastructure-teal': { color: '#629e98', roughness: 0.38, metalness: 0.08 },
    'safety-ochre': { color: '#d4a557', roughness: 0.52, metalness: 0.15 },
    'water-section': { color: '#2e737c', roughness: 0.3, metalness: 0 },
  };
export function ownDtssMaterials(scene: Object3D): Material[] {
  const owned = new Map<Material, Material>();
  const clone = (source: Material) => {
    if (owned.has(source)) return owned.get(source)!;
    const m = source.clone() as MeshStandardMaterial,
      treatment = dtssPalette[source.name];
    if (m.isMeshStandardMaterial && treatment) {
      m.color.set(treatment.color);
      m.roughness = treatment.roughness;
      m.metalness = treatment.metalness;
    }
    owned.set(source, m);
    return m;
  };
  scene.traverse((o) => {
    if ((o as Mesh).isMesh) {
      const mesh = o as Mesh;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(clone)
        : clone(mesh.material);
    }
  });
  return [...owned.values()];
}
