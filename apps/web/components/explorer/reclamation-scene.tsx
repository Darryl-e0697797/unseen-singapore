'use client';
import { useModel } from './use-model';
import { useMemo, useEffect } from 'react';
import { Html, Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Vector3 } from 'three';
import {
  reclamationLabels,
  reclamationOperation,
  reclamationRoleVisible,
  type ReclamationControls,
} from './reclamation-controls';
export default function ReclamationScene({
  value,
  onInspect,
  year,
  mode,
  stage,
}: {
  value: ReclamationControls;
  onInspect: (id: number) => void;
  year: number;
  mode: string;
  stage: number;
}) {
  const { scene } = useModel('/models/world-reclamation.glb');
  const { gl, invalidate } = useThree();
  const model = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      if (o instanceof Mesh) {
        o.userData.origin = o.position.clone();
        o.material = (o.material as MeshStandardMaterial).clone();
        o.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);
  useEffect(
    () => () => {
      model.traverse((o) => {
        if (o instanceof Mesh) (o.material as MeshStandardMaterial).dispose();
      });
    },
    [model],
  );
  const op = reclamationOperation(value, year);
  useEffect(() => {
    const t = mode === 'construction' ? (stage === 2 ? 1 : 0) : value.progress / 100;
    model.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const role = o.userData.role ?? '';
      o.visible = reclamationRoleVisible(role, Number(o.userData.stage), value, mode, stage, year);
      o.position.copy(o.userData.origin as Vector3);
      o.scale.set(1, 1, 1);
      o.castShadow = !value.low;
      const m = o.material as MeshStandardMaterial;
      m.opacity = 1;
      m.transparent = false;
      m.depthWrite = true;
      if (mode !== 'construction' && value.focus === 4) {
        if (role === 'dike') {
          m.transparent = true;
          m.opacity = 1 - t * 0.88;
          m.depthWrite = t < 0.5;
        }
        if (['rock', 'grass'].includes(role)) o.position.x += (role === 'rock' ? -1 : 1) * t * 6;
      }
      if (role === 'future') {
        m.transparent = true;
        m.opacity = 0.4;
        m.depthWrite = false;
      }
      if (role === 'workwater') {
        o.scale.y = Math.max(0.01, 1 - t * 3);
        o.position.y -= Math.min(1, t * 3);
      }
      if (mode !== 'construction' && value.focus === 2 && role === 'land') {
        m.transparent = true;
        m.opacity = 0.35;
        m.depthWrite = false;
      }
      if (role === 'surcharge') {
        o.position.y -= Math.min(t * 4, 2);
        o.position.x += Math.max(0, t - 0.5) * 30;
      }
    });
    gl.domElement.setAttribute('data-model-loaded', 'reclamation');
    gl.domElement.setAttribute('data-reclamation-focus', String(value.focus));
    gl.domElement.setAttribute(
      'data-reclamation-flow',
      op.discharge ? 'discharge' : op.circulation ? 'circulation' : 'idle',
    );
    gl.domElement.setAttribute('data-reclamation-progress', String(value.progress));
    invalidate();
  }, [value, mode, stage, year, model, gl, invalidate, op.circulation, op.discharge]);
  const routes: [number, number, number][][] = op.discharge
    ? [
        [
          [21, 1, -4],
          [20, 1, -9],
          [-5, 1, -9],
          [-25, 2, -9],
        ],
      ]
    : op.circulation
      ? [
          [
            [21, 1, -4],
            [14, 1, 7],
            [9, 1, 11],
            [3, 1, 11],
            [3, 1, -11],
            [21, 1, -11],
            [21, 1, -4],
          ],
        ]
      : [];
  return (
    <group>
      <primitive object={model} />
      {reclamationLabels(value, mode, stage, year).map((p) => (
        <group key={p.id} position={p.position}>
          <mesh>
            <sphereGeometry args={[value.component === p.id ? 0.48 : 0.24, 12, 8]} />
            <meshBasicMaterial color={value.component === p.id ? '#ffe1a4' : '#c9b17d'} />
          </mesh>
          <Html center zIndexRange={[4, 0]} position={[0, 1.3, 0]}>
            <button
              className="mrt-hotspot reclamation-hotspot"
              aria-label={`Inspect Tekong structure ${p.id}: ${p.title}`}
              aria-pressed={value.component === p.id}
              onClick={() => onInspect(p.id)}
            >
              {String(p.id).padStart(2, '0')}
            </button>
          </Html>
        </group>
      ))}
      {year >= 2026 && [0, 1, 4, 8].includes(value.focus) && (
        <>
          <Line
            points={[
              [-33, 1.5, 19],
              [30, 1.5, 19],
            ]}
            color="#e6ca8c"
            dashed
            dashSize={1}
            gapSize={0.5}
          />
          <Html position={[12, 1.5, 20]} center>
            <div className="mrt-case-label reclamation-reference">
              SEA-LEVEL REFERENCE<small>vertical contrast exaggerated</small>
            </div>
          </Html>
        </>
      )}
      {year >= 2026 &&
        mode !== 'construction' &&
        routes.map((points, i) => {
          const path = points.map((p) => new Vector3(...p));
          const t = (value.progress / 100) * (path.length - 1);
          const j = Math.min(path.length - 2, Math.floor(t));
          const dot = path[j].clone().lerp(path[j + 1], t - j);
          return (
            <group key={i}>
              <Line points={points} color={op.discharge ? '#f4bc73' : '#a9eee0'} lineWidth={3} />
              {path.slice(1).map((end, k) => {
                const start = path[k];
                const mid = start.clone().lerp(end, 0.65);
                const dir = end.clone().sub(start).normalize();
                const side = new Vector3(-dir.z, 0, dir.x).multiplyScalar(0.7);
                const back = mid.clone().addScaledVector(dir, -1.4);
                return (
                  <Line
                    key={k}
                    points={[back.clone().add(side), mid, back.clone().sub(side)]}
                    color="#ffe7b2"
                    lineWidth={3}
                  />
                );
              })}
              <mesh position={dot}>
                <sphereGeometry args={[0.6, 12, 8]} />
                <meshBasicMaterial color="#fff1bb" />
              </mesh>
            </group>
          );
        })}
    </group>
  );
}
