'use client';
import { useModel } from './use-model';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Line } from '@react-three/drei';
import {
  Color,
  DoubleSide,
  InstancedMesh,
  Object3D,
  Shape,
  Vector3,
  Mesh,
  PCFShadowMap,
} from 'three';
import ReclamationScene from './reclamation-scene';
import { reclamationExhibit, type ReclamationControls } from './reclamation-controls';
import BarrageScene from './barrage-scene';
import { barrageExhibit, type BarrageControls } from './barrage-controls';
import MrtScene from './mrt-scene';
import { SceneFallback } from '../scene-boundary';
import { mrtExhibit, type MrtControls } from './mrt-controls';
import TuasScene from './tuas-scene';
import { tuasExhibit, type TuasControls } from './tuas-journey';
import { dtssStops } from './dtss-journey';
import type { OrbitControls as OrbitType } from 'three-stdlib';
import geography from '../../../../content/geography/singapore.json';
import { modelStage, projects, type Project, type WorldState } from '@unseen/world';

function inside(x: number, z: number, ring: number[][]) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function Island({ reveal }: { reveal: boolean }) {
  const shapes = useMemo(
    () =>
      geography.rings.map((r) => {
        const s = new Shape();
        r.forEach(([x, z], i) =>
          i ? s.lineTo(x / 1000, -z / 1000) : s.moveTo(x / 1000, -z / 1000),
        );
        return s;
      }),
    [],
  );
  const city = useRef<InstancedMesh>(null);
  const buildings = useMemo(() => {
    const r = geography.rings[0];
    const a: { x: number; z: number; h: number; w: number }[] = [];
    const rand = (n: number) => {
      const v = Math.sin(n * 127.1 + 71) * 43758.5453;
      return v - Math.floor(v);
    };
    for (let i = 0; i < 1600; i++) {
      const x = rand(i * 4) * 43 - 22,
        z = rand(i * 4 + 1) * 23 - 14;
      if (inside(x * 1000, z * 1000, r) && !(x > -8 && x < 1 && z < -5)) {
        const downtown = Math.exp(-((x - 1) ** 2 + (z - 4) ** 2) / 24);
        a.push({
          x,
          z,
          h: 0.1 + rand(i * 4 + 2) * 0.4 + downtown * rand(i * 4 + 3) * 2.8,
          w: 0.13 + rand(i * 4 + 4) * 0.28,
        });
      }
    }
    return a;
  }, []);
  useEffect(() => {
    const o = new Object3D();
    buildings.forEach((b, i) => {
      o.position.set(b.x, b.h / 2 + 0.18, b.z);
      o.scale.set(b.w, b.h, b.w * 0.8);
      o.rotation.y = (i % 4) * 0.3;
      o.updateMatrix();
      city.current?.setMatrixAt(i, o.matrix);
      city.current?.setColorAt(i, new Color(i % 5 === 0 ? '#778c76' : '#d2d0ba'));
    });
    if (city.current) {
      city.current.instanceMatrix.needsUpdate = true;
      if (city.current.instanceColor) city.current.instanceColor.needsUpdate = true;
    }
  }, [buildings]);
  return (
    <group>
      {shapes.map((s, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
          <extrudeGeometry
            args={[
              s,
              {
                depth: 0.45,
                bevelEnabled: true,
                bevelSegments: 1,
                steps: 1,
                bevelSize: 0.06,
                bevelThickness: 0.04,
              },
            ]}
          />
          <meshStandardMaterial
            color={reveal ? '#55746d' : '#aab69a'}
            transparent
            opacity={reveal ? 0.42 : 1}
            roughness={0.92}
          />
        </mesh>
      ))}
      <instancedMesh
        ref={city}
        args={[undefined, undefined, buildings.length]}
        visible={!reveal}
        castShadow
      >
        <boxGeometry />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      {geography.rings.map((r, i) => (
        <Line
          key={i}
          points={r.map(([x, z]) => [x / 1000, 0.1, z / 1000])}
          color="#c9d5bb"
          lineWidth={1}
          transparent
          opacity={0.45}
        />
      ))}
      <Html position={[-4, 0.6, -8]} center className="map-caption">
        CENTRAL CATCHMENT<span>orientation context</span>
      </Html>
    </group>
  );
}
function Markers({
  year,
  onSelect,
  reveal,
}: {
  year: WorldState['year'];
  onSelect: (p: Project) => void;
  reveal: boolean;
}) {
  return (
    <>
      {projects.map((p, i) => {
        const snap = p.snapshots.find((s) => s.year === year)!;
        const muted = ['pre-project', 'pre-operation', 'context'].includes(snap.status);
        return (
          <group key={p.project_id} position={[p.anchor[0] / 1000, 0, p.anchor[1] / 1000]}>
            <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.43, 0.49, 48]} />
              <meshBasicMaterial color={muted ? '#6e8585' : p.color} side={DoubleSide} />
            </mesh>
            <Line
              points={[
                [0, 0.2, 0],
                [0, 2.3 + (i % 2) * 0.9, 0],
              ]}
              color={muted ? '#647a7a' : p.color}
              lineWidth={1}
            />
            <Html position={[0, 2.3 + (i % 2) * 0.9, 0]} center zIndexRange={[5, 0]}>
              <button
                className={`world-pin ${muted ? 'dormant' : ''}`}
                style={{ '--pin': p.color } as React.CSSProperties}
                onClick={() => onSelect(p)}
                aria-label={`Explore ${p.title}`}
              >
                <span className="pin-index">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  {p.project_id === 'dtss'
                    ? 'DTSS'
                    : p.project_id === 'mrt'
                      ? 'MRT'
                      : p.project_id === 'tuas'
                        ? 'TUAS PORT'
                        : p.title
                            .replace('Jurong Rock ', '')
                            .replace(' transmission tunnels', '')
                            .toUpperCase()}
                  <small>{year === 2026 ? p.theme : snap.status.replaceAll('-', ' ')}</small>
                </span>
              </button>
            </Html>
            {reveal && ['dtss', 'mrt', 'caverns', 'power'].includes(p.project_id) && !muted && (
              <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.24, 0.24, 2.3, 16, 1, true]} />
                <meshStandardMaterial color={p.color} side={DoubleSide} />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}
function Model({
  project,
  stage,
  mode,
}: {
  project: Project;
  stage: number;
  mode: WorldState['mode'];
}) {
  const { scene } = useModel(project.model_file);
  const { gl } = useThree();
  useEffect(() => {
    gl.domElement.setAttribute('data-model-loaded', project.project_id);
    return () => {
      gl.domElement.removeAttribute('data-model-loaded');
    };
  }, [gl, project]);
  const clone = useMemo(() => {
    const s = scene.clone(true);
    s.traverse((o) => {
      if (o instanceof Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    return s;
  }, [scene]);
  useFrame((_, dt) => {
    let moving = false;
    clone.traverse((o) => {
      if (o instanceof Mesh) {
        const s = Number(o.userData.stage ?? 0);
        o.visible = mode !== 'construction' || s <= stage;
        const target = mode === 'exploded' ? s * 5 : 0;
        const base = o.userData.baseY ?? (o.userData.baseY = o.position.y);
        const next = base + target;
        if (Math.abs(o.position.y - next) > 0.01) {
          o.position.y += (next - o.position.y) * Math.min(dt * 6, 1);
          moving = true;
        }
      }
    });
    if (moving) _.invalidate();
  });
  return (
    <group>
      <primitive object={clone} />
      <Html position={[-30, 1, 22]} className="model-label">
        ORIGINAL EXPLANATORY MODEL
        <span>
          {project.project_id === 'coast'
            ? 'ENVISIONED · NOT THE PROPOSED ALIGNMENT'
            : 'SCHEMATIC · NOT A SURVEY OR SIMULATION'}
        </span>
      </Html>
    </group>
  );
}
function DtssDetails({
  focus,
  onFocus,
  animated,
  visible,
}: {
  focus: number;
  onFocus: (n: number) => void;
  animated: boolean;
  visible: boolean;
}) {
  const dots = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const { gl } = useThree();
  useEffect(() => {
    gl.domElement.setAttribute('data-dtss-focus', String(focus));
  }, [gl, focus]);
  useFrame(({ clock, invalidate }) => {
    if (!visible || !dots.current) return;
    for (let i = 0; i < 18; i++) {
      dummy.position.set(
        -23 + ((i * 2.5 + (animated ? clock.elapsedTime * 2 : 0)) % 45),
        1.3,
        0.15,
      );
      dummy.updateMatrix();
      dots.current.setMatrixAt(i, dummy.matrix);
    }
    dots.current.instanceMatrix.needsUpdate = true;
    if (animated) invalidate();
  });
  const anchors: [number, number, number][] = [
    [-26, 24, 0],
    [29, 5, 0],
    [2, 7, 0],
    [-15, 10, 0],
    [-6, 6, -2.4],
  ];
  return (
    <group>
      {anchors.map((p, i) => (
        <Html key={i} position={p} center zIndexRange={[8, 0]}>
          <button
            className="dtss-hotspot"
            aria-label={`Inspect DTSS ${dtssStops[i + 1].label}`}
            aria-pressed={focus === i + 1}
            onClick={() => onFocus(i + 1)}
          >
            {i + 2}
            {(i === 0 || i === 3) && (
              <span className="dtss-shaft-caption">
                {i === 0 ? 'Construction access' : 'Gate isolation'}
              </span>
            )}
          </button>
        </Html>
      ))}
      <instancedMesh ref={dots} args={[undefined, undefined, 18]} visible={visible}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshBasicMaterial color="#b4f1e4" />
      </instancedMesh>
      <Html position={[-3, 1, 4]} center className="dtss-flow-label">
        → TOWARD TREATMENT · DIRECTION ONLY
      </Html>
    </group>
  );
}
function Navigation({
  project,
  flight,
  reset,
  inspect,
  reduceMotion,
  onFlightEnd,
  dtssFocus,
  tuas,
  mrt,
  barrage,
  reclamation,
}: {
  project: Project | null;
  flight: boolean;
  reset: number;
  inspect: boolean;
  reduceMotion: boolean;
  onFlightEnd: () => void;
  dtssFocus: number;
  tuas: TuasControls;
  mrt: MrtControls;
  barrage: BarrageControls;
  reclamation: ReclamationControls;
}) {
  const controls = useRef<OrbitType>(null);
  const { camera, invalidate, size } = useThree();
  const target = useRef(new Vector3());
  const goal = useRef(new Vector3());
  const moving = useRef(true);
  const keys = useRef(new Set<string>());
  useEffect(() => {
    target.current.set(0, project ? 5 : 0, project ? 0 : -1);
    goal.current.set(project ? 64 : 35, project ? 47 : 37, project ? 75 : 45);
    if (project?.project_id === 'dtss' && !inspect) {
      goal.current.fromArray(dtssStops[dtssFocus].camera);
      target.current.fromArray(dtssStops[dtssFocus].target);
      const fit = Math.max(1, (dtssFocus === 0 ? 1.3 : 0.9) / (size.width / size.height));
      goal.current.sub(target.current).multiplyScalar(fit).add(target.current);
    }
    if (project?.project_id === 'tuas' && !inspect) {
      const stop = tuasExhibit.stops[tuas.focus];
      goal.current.fromArray(stop.camera);
      target.current.fromArray(stop.target);
      const fit = Math.max(1, 1.25 / (size.width / size.height));
      goal.current.sub(target.current).multiplyScalar(fit).add(target.current);
    }
    if (project?.project_id === 'mrt' && !inspect) {
      const stop = mrtExhibit.stops[mrt.focus];
      goal.current.fromArray(stop.camera);
      target.current.fromArray(stop.target);
      goal.current
        .sub(target.current)
        .multiplyScalar(Math.max(1, 1.25 / (size.width / size.height)))
        .add(target.current);
    }
    if (project?.project_id === 'barrage' && !inspect) {
      const stop = barrageExhibit.stops[barrage.focus];
      goal.current.fromArray(stop.camera);
      target.current.fromArray(stop.target);
      goal.current
        .sub(target.current)
        .multiplyScalar(Math.max(1, 1.25 / (size.width / size.height)))
        .add(target.current);
    }
    if (project?.project_id === 'reclamation' && !inspect) {
      const stop = reclamationExhibit.stops[reclamation.focus];
      goal.current.fromArray(stop.camera);
      target.current.fromArray(stop.target);
      goal.current
        .sub(target.current)
        .multiplyScalar(Math.max(1, 1.25 / (size.width / size.height)))
        .add(target.current);
    }
    if (project && inspect) {
      const enclosed = ['dtss', 'mrt', 'caverns', 'power'].includes(project.project_id);
      goal.current.set(enclosed ? 23 : 30, enclosed ? 5 : 14, enclosed ? -2 : 29);
      target.current.set(0, 4, 0);
    }
    moving.current = true;
    invalidate();
  }, [
    project,
    reset,
    inspect,
    dtssFocus,
    tuas.focus,
    mrt.focus,
    barrage.focus,
    reclamation.focus,
    invalidate,
    size.width,
    size.height,
  ]);
  useEffect(() => {
    if (!flight) return;
    const pressed = keys.current;
    const down = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,button,select,[contenteditable]'))
        return;
      if (e.key === 'Escape') {
        onFlightEnd();
        return;
      }
      if (
        ['w', 'a', 's', 'd', 'q', 'e', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(
          e.key,
        )
      ) {
        e.preventDefault();
        keys.current.add(e.key);
        invalidate();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    const clear = () => keys.current.clear();
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
      pressed.clear();
    };
  }, [flight, invalidate, onFlightEnd]);
  useFrame((_, dt) => {
    const c = controls.current;
    if (!c) return;
    if (moving.current) {
      const a = reduceMotion ? 1 : 1 - Math.exp(-dt * 3.3);
      camera.position.lerp(goal.current, a);
      c.target.lerp(target.current, a);
      c.update();
      if (camera.position.distanceTo(goal.current) < 0.02) moving.current = false;
      else invalidate();
    }
    if (flight && keys.current.size) {
      const speed = (project ? 22 : 12) * Math.min(dt, 0.05);
      const forward = new Vector3();
      camera.getWorldDirection(forward);
      const right = new Vector3().crossVectors(forward, camera.up).normalize();
      const delta = new Vector3();
      for (const k of keys.current) {
        if (k === 'w' || k === 'ArrowUp') delta.addScaledVector(forward, speed);
        if (k === 's' || k === 'ArrowDown') delta.addScaledVector(forward, -speed);
        if (k === 'a' || k === 'ArrowLeft') delta.addScaledVector(right, -speed);
        if (k === 'd' || k === 'ArrowRight') delta.addScaledVector(right, speed);
        if (k === 'q') delta.y -= speed;
        if (k === 'e') delta.y += speed;
      }
      camera.position.add(delta);
      c.target.add(delta);
      c.update();
      invalidate();
    }
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping={!reduceMotion}
      dampingFactor={0.08}
      minDistance={project ? 4 : 15}
      maxDistance={project ? 190 : 100}
      maxPolarAngle={project ? Math.PI * 0.94 : Math.PI * 0.48}
      onStart={() => {
        moving.current = false;
      }}
    />
  );
}
// Lightweight DOM telemetry for repeatable browser QA; no renderer handle is exposed.
function RenderTelemetry({ state }: { state: WorldState }) {
  const { gl, camera } = useThree();
  useFrame(() => {
    requestAnimationFrame(() => {
      gl.domElement.dataset.renderCalls = String(gl.info.render.calls);
      gl.domElement.dataset.triangles = String(gl.info.render.triangles);
      gl.domElement.dataset.geometryCount = String(gl.info.memory.geometries);
      gl.domElement.dataset.camera = camera.position
        .toArray()
        .map((n) => n.toFixed(2))
        .join(',');
      gl.domElement.dataset.project = state.project ?? 'island';
      gl.domElement.dataset.stage = String(state.stage);
    });
  });
  return null;
}
export default function Scene({
  onTuasInspect,
  onMrtInspect,
  onBarrageInspect,
  onReclamationInspect,
  tuas,
  mrt,
  barrage,
  reclamation,
  state,
  dtssFocus,
  onDtssFocus,
  reveal,
  flight,
  reset,
  inspect,
  onSelect,
  onFlightEnd,
  reduceMotion,
}: {
  onTuasInspect: (id: number) => void;
  onMrtInspect: (id: number) => void;
  onBarrageInspect: (id: number) => void;
  onReclamationInspect: (id: number) => void;
  state: WorldState;
  tuas: TuasControls;
  mrt: MrtControls;
  barrage: BarrageControls;
  reclamation: ReclamationControls;
  dtssFocus: number;
  onDtssFocus: (n: number) => void;
  reveal: boolean;
  flight: boolean;
  reset: number;
  inspect: boolean;
  onSelect: (p: Project) => void;
  onFlightEnd: () => void;
  reduceMotion: boolean;
}) {
  const p = projects.find((p) => p.project_id === state.project) ?? null;
  const webglAvailable = useMemo(() => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      if (!context) return false;
      context.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch {
      return false;
    }
  }, []);
  if (!webglAvailable) return <SceneFallback />;
  return (
    <Canvas
      frameloop="demand"
      dpr={
        (p?.project_id === 'tuas' && tuas.low) ||
        (p?.project_id === 'mrt' && mrt.low) ||
        (p?.project_id === 'barrage' && barrage.low) ||
        (p?.project_id === 'reclamation' && reclamation.low)
          ? 1
          : [1, 1.5]
      }
      shadows={
        (p?.project_id === 'tuas' && tuas.low) ||
        (p?.project_id === 'mrt' && mrt.low) ||
        (p?.project_id === 'barrage' && barrage.low) ||
        (p?.project_id === 'reclamation' && reclamation.low)
          ? false
          : { type: PCFShadowMap }
      }
      camera={{ position: [40, 45, 58], fov: 43, near: 0.1, far: 650 }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = PCFShadowMap;
      }}
    >
      <color attach="background" args={['#102b33']} />
      <fog
        attach="fog"
        args={[
          '#102b33',
          p?.project_id === 'dtss' ? 350 : p ? 140 : 75,
          p?.project_id === 'dtss' ? 650 : p ? 300 : 165,
        ]}
      />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#d8e9e8', '#344844', 1.1]} />
      <directionalLight
        position={[20, 60, 25]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-camera-far={180}
        shadow-bias={-0.001}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, p ? -3.55 : -0.55, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#163b45" roughness={0.64} metalness={0.25} />
      </mesh>
      <gridHelper
        args={[p ? 210 : 120, p ? 42 : 40, '#28454d', '#193c46']}
        position={[0, p ? -3.5 : -0.5, 0]}
      />
      {p ? (
        <Suspense
          fallback={
            <Html center>
              <div className="model-loading">ASSEMBLING THE EXHIBIT…</div>
            </Html>
          }
        >
          {p.project_id === 'reclamation' ? (
            <ReclamationScene
              value={reclamation}
              onInspect={onReclamationInspect}
              year={state.year}
              mode={state.mode}
              stage={state.stage}
            />
          ) : p.project_id === 'barrage' ? (
            <BarrageScene
              value={barrage}
              onInspect={onBarrageInspect}
              year={state.year}
              mode={state.mode}
              stage={state.stage}
            />
          ) : p.project_id === 'mrt' ? (
            <MrtScene
              value={mrt}
              onInspect={onMrtInspect}
              year={state.year}
              mode={state.mode}
              stage={state.stage}
            />
          ) : p.project_id === 'tuas' ? (
            <TuasScene
              onInspect={onTuasInspect}
              year={state.year}
              value={tuas}
              stage={modelStage(p, state.stage)}
              mode={state.mode}
            />
          ) : (
            <Model project={p} stage={modelStage(p, state.stage)} mode={state.mode} />
          )}
        </Suspense>
      ) : (
        <>
          <Island reveal={reveal} />
          <Markers year={state.year} onSelect={onSelect} reveal={reveal} />
        </>
      )}
      {p?.project_id === 'dtss' && (
        <DtssDetails
          focus={dtssFocus}
          onFocus={onDtssFocus}
          animated={!reduceMotion && state.mode === 'finished'}
          visible={state.mode !== 'construction' || state.stage === 4}
        />
      )}
      <RenderTelemetry state={state} />
      <Navigation
        project={p}
        tuas={tuas}
        mrt={mrt}
        barrage={barrage}
        reclamation={reclamation}
        dtssFocus={dtssFocus}
        flight={flight}
        reset={reset}
        inspect={inspect}
        reduceMotion={reduceMotion}
        onFlightEnd={onFlightEnd}
      />
    </Canvas>
  );
}
