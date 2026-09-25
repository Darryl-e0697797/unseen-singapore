import test from 'node:test';
import assert from 'node:assert/strict';
import { Group, Mesh, MeshStandardMaterial, BoxGeometry } from 'three';
import { ownDtssMaterials } from '../apps/web/components/explorer/dtss-materials';
test('DTSS owns treatments without mutating cached shared materials or duplicating each mesh material', () => {
  const original = new MeshStandardMaterial({ roughness: 0.7 });
  original.name = 'warm-concrete';
  const scene = new Group();
  scene.add(new Mesh(new BoxGeometry(), original), new Mesh(new BoxGeometry(), original));
  const untouched = scene.clone(true),
    treated = scene.clone(true),
    owned = ownDtssMaterials(treated);
  assert.equal(owned.length, 1);
  assert.equal(original.roughness, 0.7);
  assert.equal((untouched.children[0] as Mesh).material, original);
  assert.notEqual((treated.children[0] as Mesh).material, original);
  assert.equal((treated.children[0] as Mesh).material, (treated.children[1] as Mesh).material);
  assert.equal((owned[0] as MeshStandardMaterial).roughness, 0.88);
  owned.forEach((m) => m.dispose());
});
