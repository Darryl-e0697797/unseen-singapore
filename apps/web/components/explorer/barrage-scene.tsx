'use client';
import { useModel } from './use-model';
import { useEffect, useMemo, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import type { Line2, LineSegments2 } from 'three-stdlib';
import { Mesh, MeshStandardMaterial, Vector3, Euler } from 'three';
import {
  barrageLabels,
  barrageOperation,
  barrageRoleVisible,
  barrageSection,
  type BarrageControls,
} from './barrage-controls';
function BarrageLabels({
  labels,
  selected,
  onInspect,
}: {
  labels: ReturnType<typeof barrageLabels>;
  selected: number;
  onInspect: (id: number) => void;
}) {
  const buttons = useRef(new Map<number, HTMLButtonElement>()),
    lines = useRef(new Map<number, Line2 | LineSegments2>());
  const { camera, size } = useThree();
  useFrame(() => {
    const points = labels
      .map((p) => {
        const v = new Vector3(...p.position).project(camera);
        return { p, v, x: ((v.x + 1) * size.width) / 2, y: ((1 - v.y) * size.height) / 2 };
      })
      .sort((a, b) => a.x - b.x);
    const placed: { x: number; y: number }[] = [];
    points.forEach(({ p, v, x, y }, i) => {
      const button = buttons.current.get(p.id);
      if (!button) return;
      let cx = Math.max(24, Math.min(size.width - 24, x)),
        cy = Math.max(28, Math.min(size.height - 28, y - 22));
      if (size.width < 600) {
        cx = ((i + 0.5) * size.width) / points.length;
        cy = size.height - 26;
      } else {
        let tries = 0;
        while (
          placed.some((q) => Math.abs(q.x - cx) < 38 && Math.abs(q.y - cy) < 38) &&
          tries++ < 8
        )
          cy = Math.max(25, cy - 40);
      }
      placed.push({ x: cx, y: cy });
      button.style.transform = `translate(${cx - x}px,${cy - y}px)`;
      v.x = (cx / size.width) * 2 - 1;
      v.y = 1 - (cy / size.height) * 2;
      v.unproject(camera);
      lines.current.get(p.id)?.geometry.setPositions([...p.position, ...v.toArray()]);
    });
  });
  return (
    <>
      {labels.map((p) => (
        <group key={p.id}>
          <Line
            ref={(el) => {
              if (el) lines.current.set(p.id, el);
              else lines.current.delete(p.id);
            }}
            points={[p.position, [p.position[0], p.position[1] + 2, p.position[2]]]}
            color="#e5d09c"
            lineWidth={1}
          />
          <Html position={p.position} center zIndexRange={[8, 0]}>
            <button
              ref={(el) => {
                if (el) buttons.current.set(p.id, el);
                else buttons.current.delete(p.id);
              }}
              className="mrt-hotspot barrage-hotspot"
              aria-label={`Inspect Barrage structure ${p.id}: ${p.title}`}
              aria-pressed={selected === p.id}
              onClick={() => onInspect(p.id)}
            >
              {String(p.id).padStart(2, '0')}
            </button>
          </Html>
        </group>
      ))}
    </>
  );
}
export default function BarrageScene({
  value,
  onInspect,
  year,
  mode,
  stage,
}: {
  value: BarrageControls;
  onInspect: (id: number) => void;
  year: number;
  mode: string;
  stage: number;
}) {
  const { scene } = useModel('/models/world-barrage.glb');
  const { gl, invalidate } = useThree();
  const model = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      if (o instanceof Mesh) {
        o.userData.origin = o.position.clone();
        o.userData.rotation = o.rotation.clone();
        o.material = (o.material as MeshStandardMaterial).clone();
        o.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);
  const op = barrageOperation(value, year);
  useEffect(
    () => () => {
      model.traverse((o) => {
        if (o instanceof Mesh) (o.material as MeshStandardMaterial).dispose();
      });
    },
    [model],
  );
  useEffect(() => {
    const t = value.progress / 100;
    model.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const role = o.userData.role ?? '',
        s = Number(o.userData.stage);
      o.position.copy(o.userData.origin as Vector3);
      o.rotation.copy(o.userData.rotation as Euler);
      o.scale.set(1, 1, 1);
      o.visible = barrageRoleVisible(role, s, value, mode, stage, year);
      o.castShadow = !value.low;
      const mat = o.material as MeshStandardMaterial;
      mat.transparent = false;
      mat.opacity = 1;
      mat.depthWrite = true;
      if (role === 'section-gate' && op.gateOpen) o.rotation.x += Math.PI * 0.48;
      if (role === 'section-sea') o.position.y += value.weather === 'high' ? 3 : 0;
      if (role === 'work-water') {
        o.scale.y = Math.max(0.02, 1 - t);
        o.position.y -= 1.5 * t;
      }
      if (role === 'future') {
        mat.transparent = true;
        mat.opacity = 0.45;
        mat.depthWrite = false;
      }
      if (role === 'reservoir') mat.color.set(value.focus === 6 && t < 0.5 ? '#387b88' : '#276476');
      if (role === 'impeller' && op.pumping) o.rotation.y += t * Math.PI * 10;
      if (
        value.focus === 3 &&
        mode !== 'construction' &&
        ['gates', 'pumps', 'bridge'].includes(role)
      )
        o.position.y += Math.max(0, 1 - (t * 3 - (s - 4))) * 4;
    });
    gl.domElement.setAttribute('data-model-loaded', 'barrage');
    gl.domElement.setAttribute('data-barrage-focus', String(value.focus));
    gl.domElement.setAttribute('data-barrage-gate', op.gateOpen ? 'open' : 'closed');
    gl.domElement.setAttribute('data-barrage-pumps', op.pumping ? 'running' : 'idle');
    gl.domElement.setAttribute('data-barrage-progress', String(value.progress));
    invalidate();
  }, [value, mode, stage, year, model, gl, invalidate, op.gateOpen, op.pumping]);
  const section = barrageSection(value, mode);
  return (
    <group>
      <primitive object={model} />
      <BarrageLabels
        labels={barrageLabels(value, mode, stage, year)}
        selected={value.component}
        onInspect={onInspect}
      />
      {section && year >= 2026 && (
        <>
          <Html position={[-9, 8, -10]} center>
            <div className="mrt-case-label barrage-water-label">
              RESERVOIR
              <br />
              <small>inside the barrier</small>
            </div>
          </Html>
          <Html position={[-9, 5, 12]} center>
            <div className="mrt-case-label barrage-water-label">
              SEA
              <br />
              <small>
                {value.weather === 'high' ? 'higher tide' : 'lower tide'} · schematic level
              </small>
            </div>
          </Html>
        </>
      )}
      {section &&
        year >= 2026 &&
        (op.gateOpen || op.pumping) &&
        [0, 1, 2].map((i) => {
          const z = -7 + ((value.progress / 7 + i * 5) % 15),
            x = op.pumping ? 20 : 0,
            y = op.pumping ? 3.7 : 1.3;
          return (
            <Line
              key={i}
              points={[
                [x, y, z - 1],
                [x, y, z + 1],
                [x - 0.5, y, z + 0.2],
                [x, y, z + 1],
                [x + 0.5, y, z + 0.2],
              ]}
              color="#f4cf7d"
              lineWidth={3}
            />
          );
        })}
    </group>
  );
}
