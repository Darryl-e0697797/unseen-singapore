'use client';
import { useModel } from './use-model';
import { useEffect, useMemo, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, Vector3 } from 'three';
import type { Line2 } from 'three-stdlib';
import { visibleTuasLabels, type TuasLabel } from './tuas-labels';
import type { TuasControls } from './tuas-journey';
function StructureLabel({
  label,
  selected,
  onInspect,
}: {
  label: TuasLabel;
  selected: boolean;
  onInspect: (id: number) => void;
}) {
  const button = useRef<HTMLButtonElement>(null),
    line = useRef<Line2>(null);
  const { camera, size } = useThree();
  const projection = useRef(new Vector3());
  useFrame(() => {
    const projected = projection.current;
    const el = button.current;
    if (!el) return;
    projected.fromArray(label.position).project(camera);
    const x = ((projected.x + 1) * size.width) / 2,
      y = ((1 - projected.y) * size.height) / 2;
    const halfW = el.offsetWidth / 2 + 8,
      halfH = el.offsetHeight / 2 + 8;
    const cx = Math.max(halfW, Math.min(size.width - halfW, x)),
      cy = Math.max(halfH, Math.min(size.height - halfH, y));
    el.style.transform = `translate(${cx - x}px,${cy - y}px)`;
    projected.x = (cx / size.width) * 2 - 1;
    projected.y = 1 - (cy / size.height) * 2;
    projected.unproject(camera);
    line.current?.geometry.setPositions([...label.anchor, ...projected.toArray()]);
  });
  return (
    <group>
      <Line
        ref={line}
        points={[label.anchor, label.position]}
        color={selected ? '#fff0be' : '#b2c8bf'}
        lineWidth={1}
      />
      <Html position={label.position} center zIndexRange={[8, 0]}>
        <button
          ref={button}
          className="tuas-hotspot"
          aria-label={`Inspect structure ${label.id}: ${label.name}`}
          aria-pressed={selected}
          onClick={() => onInspect(label.id)}
        >
          <b>{String(label.id).padStart(2, '0')}</b>
          <span>{label.name}</span>
        </button>
      </Html>
    </group>
  );
}
export default function TuasScene({
  value,
  year,
  stage,
  mode,
  onInspect,
}: {
  onInspect: (id: number) => void;
  year: number;
  value: TuasControls;
  stage: number;
  mode: string;
}) {
  const { scene } = useModel('/models/world-tuas.glb');
  const { gl, invalidate } = useThree();
  const clone = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      if (o instanceof Mesh) {
        o.userData.origin = o.position.clone();
        o.material = (o.material as MeshStandardMaterial).clone();
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);
  useEffect(
    () => () => {
      clone.traverse((o) => {
        if (o instanceof Mesh) (o.material as MeshStandardMaterial).dispose();
      });
    },
    [clone],
  );
  useEffect(() => {
    const t = value.progress / 100;
    clone.traverse((o) => {
      if (!(o instanceof Mesh)) return;
      const s = Number(o.userData.stage),
        r = o.userData.role ?? '',
        base = o.userData.origin as Vector3;
      o.position.copy(base);
      o.scale.set(1, 1, 1);
      o.visible = mode !== 'construction' || s <= stage;
      const construction = mode === 'construction';
      if (s === 2) o.visible = construction ? stage === 2 : value.focus === 3;
      if (s === 3) o.visible = construction ? stage === 3 : value.focus === 4;
      if (s === 6) o.visible = construction ? stage === 6 : value.focus === 5;
      if (r === 'preload') o.visible = o.visible && value.treatment;
      if (r === 'water') o.visible = !value.section;
      if (value.section && (s >= 7 || r === 'deck')) o.visible = false;
      if (value.focus === 4 && !construction && s >= 4) o.visible = false;
      if (value.focus === 3 && !construction && s >= 4) o.visible = false;
      if (r === 'tow' && !construction) {
        o.position.x += Math.min(t * 2, 1) * 14;
        o.position.z -= Math.min(t * 2, 1) * 11;
        o.position.y -= Math.max(0, t * 2 - 1) * 2.5;
      }
      if (r === 'tug' && !construction) o.position.x += Math.min(t * 2, 1) * 10;
      if (r === 'slipform') o.position.y += (t - 0.5) * 6;
      if (r === 'fill' && value.focus === 5) o.scale.y = 1 - (value.treatment ? t * 0.12 : 0);
      if (r === 'agv' && !construction) {
        const drive = Math.max(0, (t - 0.75) * 4);
        o.position.x += 7 * (1 - drive);
        o.position.z -= drive * 10;
      }
      if (r === 'cargo' && !construction) {
        const path = [
          [7, 0, 15],
          [7, 10, 15],
          [7, 10, 0],
          [7, 0, 0],
          [0, 0, -10],
        ];
        const segment = Math.min(3, Math.floor(t * 4)),
          f = t * 4 - segment;
        o.position.add(
          new Vector3()
            .fromArray(path[segment])
            .lerp(new Vector3().fromArray(path[segment + 1]), f),
        );
      }
      const material = o.material as MeshStandardMaterial;
      material.transparent = r === 'fill' && value.section;
      material.opacity = material.transparent ? 0.23 : 1;
      material.depthWrite = !material.transparent;
      if (mode === 'exploded') o.position.y += s * 2;
      if (year < 2026 && s > 0) o.visible = false;
      o.castShadow = !value.low;
    });
    gl.domElement.setAttribute('data-model-loaded', 'tuas');
    gl.domElement.setAttribute('data-tuas-focus', String(value.focus));
    gl.domElement.setAttribute('data-tuas-progress', String(value.progress));
    gl.domElement.setAttribute('data-tuas-section', String(value.section));
    invalidate();
  }, [clone, value, year, stage, mode, gl, invalidate]);
  return (
    <group>
      <primitive object={clone} />
      {visibleTuasLabels(value, year, stage, mode).map((label) => (
        <StructureLabel
          key={label.id}
          label={label}
          selected={value.component === label.id}
          onInspect={onInspect}
        />
      ))}
      {year >= 2026 &&
        value.focus === 5 &&
        value.treatment &&
        [0, 1, 2].map((i) => (
          <Line
            key={i}
            points={[
              [4 + i * 4, 4 + value.progress * 0.06, -7],
              [4 + i * 4, 12, -7],
              [6 + i * 4, 12, -7],
            ]}
            color="#81d4c0"
            lineWidth={2}
          />
        ))}
      {(year === 2050 || (value.focus === 7 && value.phase === 'future')) && (
        <>
          <Line
            points={[
              [22, 12, -18],
              [32, 12, -18],
              [32, 12, 3],
              [22, 12, 3],
              [22, 12, -18],
            ]}
            dashed
            dashSize={1}
            gapSize={1}
            color="#e0bc78"
          />
          <Html position={[27, 15, 0]} center>
            <span className="tuas-scene-label">Envisioned expansion cue</span>
          </Html>
        </>
      )}
      <Html position={[-25, -2, 22]} className="model-label">
        TUAS / ORIGINAL BLENDER MODEL<span>COMPRESSED DISTANCES · SCHEMATIC COMPONENTS</span>
      </Html>
    </group>
  );
}
