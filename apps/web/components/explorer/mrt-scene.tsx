'use client';
import { useEffect, useMemo } from 'react';
import { Html, Line, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { mrtLabels, mrtRoleVisible, mrtStage, type MrtControls } from './mrt-controls';
export default function MrtScene({
  value,
  mode,
  stage,
  year,
  onInspect,
}: {
  value: MrtControls;
  mode: string;
  stage: number;
  year: number;
  onInspect: (id: number) => void;
}) {
  const { scene } = useGLTF('/models/world-mrt.glb'),
    { gl, invalidate } = useThree();
  const model = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      if (o instanceof Mesh) {
        o.material = (o.material as MeshStandardMaterial).clone();
        o.userData.origin = o.position.clone();
        o.userData.rotation = o.rotation.clone();
        o.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  useEffect(
    () => () =>
      model.traverse((o) => {
        if (o instanceof Mesh) (o.material as MeshStandardMaterial).dispose();
      }),
    [model],
  );
  useEffect(() => {
    const t = value.progress / 100;
    model.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const r = o.userData.role ?? '',
        s = Number(o.userData.stage);
      o.position.copy(o.userData.origin as Vector3);
      o.rotation.copy(o.userData.rotation);
      o.scale.set(1, 1, 1);
      o.visible = mrtRoleVisible(r, s, value, mode, stage, year);
      o.castShadow = !value.low;
      const m = o.material as MeshStandardMaterial;
      m.transparent = false;
      m.opacity = 1;
      m.depthWrite = true;
      if (r === 'excavation') {
        const f = [1, 1, 0.8, 0.6, 0.2, 0, 0, 0, 0][mrtStage(value, mode, stage)];
        o.scale.y = f;
        o.position.y -= 8 * (1 - f);
      }
      if (r === 'panel' && value.focus === 3) {
        m.transparent = t < 0.67;
        m.opacity = t < 0.67 ? 0.2 : 1;
        m.depthWrite = !m.transparent;
        m.color.set(t < 0.34 ? '#427f85' : t < 0.67 ? '#bd9156' : '#b5b7a5');
      }
      if (value.focus === 5 && ['tbm', 'cutter'].includes(r)) o.position.x += t * 1.5;
      if (r === 'cutter' && value.focus === 5) o.rotation.x += t * Math.PI * 6;
      if (r === 'segment') {
        o.position.y += (1 - t) * 5;
        o.rotation.x += (1 - t) * 1.4;
      }
      if (r === 'ice') {
        o.visible = o.visible && t < 0.8;
        o.scale.x = o.scale.z = 0.05 + Math.min(1, t * 2.8);
        m.transparent = true;
        m.opacity = 0.33;
        m.depthWrite = false;
      }
      if (r === 'freeze-lining') o.visible = o.visible && t > 0.35;
      if (mode === 'exploded') o.position.y += s * 0.8;
    });
    gl.domElement.setAttribute('data-model-loaded', 'mrt');
    gl.domElement.setAttribute('data-mrt-focus', String(value.focus));
    gl.domElement.setAttribute('data-mrt-progress', String(value.progress));
    gl.domElement.setAttribute('data-mrt-method', value.method);
    invalidate();
  }, [value, mode, stage, year, model, gl, invalidate]);
  return (
    <group>
      <primitive object={model} />
      {mrtLabels(value, mode, stage, year).map((p) => (
        <group key={p.id}>
          <Line
            points={[p.position, [p.position[0], p.position[1] + 2, p.position[2]]]}
            color="#e5d09c"
            lineWidth={1}
          />
          <Html
            position={[p.position[0], p.position[1] + 2, p.position[2]]}
            center
            zIndexRange={[8, 0]}
          >
            <button
              className="mrt-hotspot"
              aria-label={`Inspect MRT structure ${p.id}: ${p.title}`}
              aria-pressed={value.component === p.id}
              onClick={() => onInspect(p.id)}
            >
              {String(p.id).padStart(2, '0')}
            </button>
          </Html>
        </group>
      ))}
      {value.focus === 6 && mode !== 'construction' && year >= 2026 && (
        <group>
          {[15, 19].map((y) => (
            <Line
              key={y}
              points={[
                [-28, y, 2],
                [-24, y, 2],
                [-17, y, 2],
                [-19, y + 0.7, 2],
                [-17, y, 2],
                [-19, y - 0.7, 2],
              ]}
              color="#e5bc70"
              lineWidth={3}
            />
          ))}
          <Html position={[-19, 22, 2]} center>
            <div className="mrt-case-label">
              GROUND → WALL → SUPPORT
              <br />
              <small>Qualitative load path · no calculated force</small>
            </div>
          </Html>
        </group>
      )}
      {value.focus === 5 && mode !== 'construction' && year >= 2026 && (
        <group>
          {[0, 1, 2].map((i) => {
            const x = 26 - ((value.progress / 10 + i * 3) % 10);
            return (
              <Line
                key={i}
                points={[
                  [x + 1, 2.8, 8],
                  [x, 2.8, 8],
                  [x + 0.5, 3.2, 8],
                  [x, 2.8, 8],
                  [x + 0.5, 2.4, 8],
                ]}
                color="#e5bc70"
                lineWidth={3}
              />
            );
          })}
        </group>
      )}
      {value.focus === 7 && mode !== 'construction' && year >= 2026 && (
        <Html position={[0, 24, 0]} center>
          <div className="mrt-case-label">
            MARINA BAY · SEPARATE HISTORICAL CASE
            <br />
            <small>Temporary ground treatment · schematic</small>
          </div>
        </Html>
      )}
    </group>
  );
}
