import { projects, constructionStages, modelStage } from '../packages/world';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Mesh } from 'three';
const manifest = JSON.parse(readFileSync('assets/processed/manifest.json', 'utf8'));
const results = [];
for (const name of ['dtss-section.glb', 'dtss-section-low.glb', 'axis-fixture.glb']) {
  const b = readFileSync(`apps/web/public/models/${name}`);
  assert.equal(b.toString('ascii', 0, 4), 'glTF');
  assert.equal(b.readUInt32LE(4), 2);
  assert.equal(b.readUInt32LE(8), b.length);
  assert(b.length < 2 * 1024 * 1024, 'GLB over budget');
  const gltf = await new GLTFLoader().parseAsync(
    b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength),
    '',
  );
  let triangles = 0,
    meshes = 0;
  gltf.scene.traverse((o) => {
    if (o instanceof Mesh) {
      meshes++;
      triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
    }
  });
  assert(triangles < 20000, 'Asset triangle budget');
  const box = new Box3().setFromObject(gltf.scene);
  assert(!box.isEmpty());
  if (name === 'axis-fixture.glb') {
    for (const [id, v] of Object.entries({ east: [1, 0, 0], north: [0, 0, -1], up: [0, 1, 0] })) {
      const o = gltf.scene.getObjectByName(id);
      assert(o);
      o.position
        .toArray()
        .forEach((n, i) => assert(Math.abs(n - v[i]) < 1e-5, `Axis conversion failed: ${id}`));
    }
  } else {
    assert(box.min.y < -19 && box.max.y < 1, 'Vertical orientation mismatch');
    assert(
      Math.abs(box.min.x + 50) < 0.2 && Math.abs(box.max.x - 50) < 0.2,
      'Metre scale mismatch',
    );
    const entry = manifest.files.find((f: { file: string }) => f.file === name);
    assert(entry);
    assert.equal(entry.sha256, createHash('sha256').update(b).digest('hex'));
    assert.equal(entry.bytes, b.length);
  }
  results.push({
    file: name,
    bytes: b.length,
    triangles,
    meshes,
    bounds: { min: box.min.toArray(), max: box.max.toArray() },
  });
}
writeFileSync('assets/processed/geometry-report.json', JSON.stringify(results, null, 2) + '\n');
console.log(results);
const worldManifest = JSON.parse(readFileSync('assets/processed/world-manifest.json', 'utf8'));
const worldResults = [];
for (const entry of worldManifest.files) {
  const b = readFileSync(`apps/web/public/models/${entry.file}`);
  assert.equal(createHash('sha256').update(b).digest('hex'), entry.sha256);
  assert.equal(b.length, entry.bytes);
  assert(
    b.length < (['dtss', 'tuas'].includes(entry.project_id) ? 2 * 1024 * 1024 : 512 * 1024),
    'Exhibit byte budget',
  );
  const gltf = await new GLTFLoader().parseAsync(
    b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength),
    '',
  );
  const project = projects.find((p) => p.project_id === entry.project_id)!;
  const expectedStages = new Set(constructionStages(project).map((_, i) => modelStage(project, i)));
  const stages = new Set<number>();
  let triangles = 0,
    meshes = 0;
  gltf.scene.traverse((o) => {
    if (o instanceof Mesh) {
      const stage = o.userData.stage;
      assert(
        Number.isInteger(stage) && expectedStages.has(stage),
        `Invalid construction stage ${entry.file}`,
      );
      if (['tuas', 'mrt', 'barrage', 'reclamation'].includes(entry.project_id)) {
        const required = constructionStages(
          projects.find((p) => p.project_id === entry.project_id)!,
        )[stage];
        assert.equal(o.userData.research_revision, entry.project_id + '-r1');
        const requiredClaims = 'claim_ids' in required ? required.claim_ids : [];
        if (entry.project_id === 'mrt') {
          const known = new Set(
            JSON.parse(readFileSync('content/workflow/mrt-claims.json', 'utf8')).claims.map(
              (c: { claim_id: string }) => c.claim_id,
            ),
          );
          assert(Array.isArray(o.userData.claim_ids));
          for (const id of requiredClaims)
            assert(o.userData.claim_ids.includes(id), 'Missing stage evidence');
          for (const id of o.userData.claim_ids) assert(known.has(id), 'Unknown model evidence');
          if (o.userData.role === 'monitor')
            assert(o.userData.claim_ids.includes('mrt-monitoring'));
          if (o.userData.role?.startsWith('freeze-') || o.userData.role === 'ice')
            assert(o.userData.claim_ids.includes('mrt-freeze'));
        } else assert.deepEqual(o.userData.claim_ids, requiredClaims);
        assert.equal(
          o.userData.accuracy_class,
          ['barrage', 'reclamation'].includes(entry.project_id) && o.userData.role === 'future'
            ? 'envisioned'
            : 'schematic',
        );
      }
      stages.add(stage);
      meshes++;
      triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
    }
  });
  assert.deepEqual([...stages].sort(), [...expectedStages].sort());
  assert.equal(triangles, entry.triangles);
  assert(meshes <= 35, 'Draw-call authoring budget');
  if (entry.project_id === 'barrage') {
    const roles: Record<string, number> = {};
    gltf.scene.traverse((o) => {
      if (o instanceof Mesh)
        roles[o.userData.role] =
          (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
    });
    assert.equal(roles.gates, 9 * 12, 'Nine main crest gates');
    assert(
      roles.pumps > 0 && roles['section-gate'] > 0 && roles.impeller > 0,
      'Barrage mechanism geometry',
    );
  }
  const box = new Box3().setFromObject(gltf.scene);
  assert(
    Math.abs(box.min.x + 35) < 0.01 && Math.abs(box.max.x - 35) < 0.01,
    'Exhibit metre-scale plinth',
  );
  assert(Math.abs(box.min.y + 3.5) < 0.01, 'Blender/glTF vertical orientation');
  worldResults.push({
    file: entry.file,
    bytes: b.length,
    triangles,
    meshes,
    stages: [...stages].sort(),
    bounds: { min: box.min.toArray(), max: box.max.toArray() },
  });
}
writeFileSync(
  'assets/processed/world-geometry-report.json',
  JSON.stringify(worldResults, null, 2) + '\n',
);
console.log(
  `Validated ${worldResults.length} staged world exhibits; ${worldResults.reduce((n, r) => n + r.bytes, 0)} bytes total.`,
);
