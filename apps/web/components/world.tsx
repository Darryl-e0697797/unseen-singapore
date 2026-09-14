'use client';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import {
  BoxGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OrthographicCamera,
  PCFShadowMap,
  Vector3,
} from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { SceneState } from '@unseen/scene-engine';
type Props = {
  state: SceneState;
  low: boolean;
  reduced: boolean;
  onSelect: (id: string) => void;
  onReady: () => void;
  onMetrics: (value: string) => void;
};
type Triple = [number, number, number];
function Block({
  position,
  size,
  color = '#e0dfcf',
  opacity = 1,
}: {
  position: Triple;
  size: Triple;
  color?: string;
  opacity?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity === 1}
      />
    </mesh>
  );
}
function Buildings({ reveal }: { reveal: boolean }) {
  const data = useMemo(() => {
    const buildings: { p: Triple; s: Triple }[] = [];
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 9; col++) {
        const x = -55 + col * 8.5,
          z = -36 + row * 12;
        if (x > 13 && z < -12) continue;
        const h = 7 + ((col * 17 + row * 13) % 23);
        buildings.push({ p: [x, h / 2 + 0.3, z], s: [4.3 + (col % 3), h, 4.7] });
      }
    for (let i = 0; i < 7; i++) buildings.push({ p: [-52 + i * 12, 3, 32], s: [8, 6, 7] });
    return buildings;
  }, []);
  const geometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#e9e5d8',
        roughness: 0.88,
        transparent: reveal,
        opacity: reveal ? 0.66 : 1,
        depthWrite: !reveal,
      }),
    [reveal],
  );
  const mesh = useMemo(() => {
    const m = new InstancedMesh(geometry, material, data.length),
      matrix = new Matrix4();
    data.forEach((b, i) => {
      matrix.makeScale(...b.s);
      matrix.setPosition(...b.p);
      m.setMatrixAt(i, matrix);
    });
    m.castShadow = true;
    m.receiveShadow = true;
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [data, geometry, material]);
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      mesh.dispose();
    },
    [geometry, material, mesh],
  );
  return <primitive object={mesh} />;
}
function Surface({ state }: { state: SceneState }) {
  const opacity = state.reveal ? 0.58 : 1;
  return (
    <group>
      <Block position={[0, -24, 0]} size={[132, 2, 92]} color="#bdbaa8" />
      {state.reveal ? (
        <>
          <Block position={[0, -11.5, -29]} size={[130, 23, 32]} color="#c2bdab" />
          <Block position={[0, -11.5, 34]} size={[130, 23, 22]} color="#c2bdab" opacity={0.08} />
          <Block position={[0, 0.05, 3]} size={[130, 0.2, 40]} color="#b5c1a9" opacity={0.1} />
          {[-18, -13, -8].map((y) => (
            <Block key={y} position={[0, y, 45.05]} size={[130, 0.15, 0.15]} color="#a9a48f" />
          ))}
        </>
      ) : (
        <Block position={[0, -11.5, 0]} size={[130, 23, 90]} color="#c2bdab" />
      )}
      <group visible={state.layers.surface}>
        <Block position={[0, 0.1, -29]} size={[130, 0.25, 32]} color="#acb99f" />
        <Block position={[0, 0.1, 34]} size={[130, 0.25, 22]} color="#acb99f" />
        {!state.reveal && <Block position={[0, 0.1, 3]} size={[130, 0.25, 40]} color="#acb99f" />}
        <Buildings reveal={state.reveal} />
        {[-43, -25, -7].map((x) => (
          <Block key={x} position={[x, 0.3, -22]} size={[1.7, 0.12, 42]} color="#d8d9c7" />
        ))}
        {[-29, -15, 26].map((z) => (
          <Block key={z} position={[-15, 0.3, z]} size={[96, 0.12, 2]} color="#d8d9c7" />
        ))}
        <Block position={[32, 0.4, -25]} size={[48, 0.6, 21]} color="#d9d8c6" />
        {[18, 32, 46].map((x) => (
          <group key={x}>
            <Block position={[x, 17, -25]} size={[6, 33, 8]} color="#e9e6d7" opacity={opacity} />
            <Block
              position={[x + 1, 17, -19.8]}
              size={[2, 33, 1]}
              color="#cfcebd"
              opacity={opacity}
            />
          </group>
        ))}
        <Block position={[32, 34, -25]} size={[42, 2.4, 11]} color="#e5e2d1" opacity={opacity} />
        <Block position={[32, 35.3, -25]} size={[37, 0.35, 7]} color="#8b9e85" opacity={opacity} />
        <Block position={[49, 0.5, 10]} size={[28, 0.8, 24]} color="#8caeaa" opacity={opacity} />
        <group position={[-43, 12, 32]}>
          <mesh>
            <torusGeometry args={[10, 0.22, 6, 48]} />
            <meshStandardMaterial color="#ece9d9" transparent opacity={opacity} />
          </mesh>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <group key={i}>
                <mesh position={[Math.cos(a) * 10, Math.sin(a) * 10, 0]}>
                  <boxGeometry args={[1, 1.3, 1]} />
                  <meshStandardMaterial color="#d3d3c3" />
                </mesh>
                <mesh rotation={[0, 0, a]} position={[Math.cos(a) * 5, Math.sin(a) * 5, 0]}>
                  <boxGeometry args={[10, 0.08, 0.08]} />
                  <meshStandardMaterial color="#e7e6d4" />
                </mesh>
              </group>
            );
          })}
          <Block position={[-2, -6, 0]} size={[0.6, 12, 0.6]} color="#e6e3d3" />
          <Block position={[2, -6, 0]} size={[0.6, 12, 0.6]} color="#e6e3d3" />
        </group>
      </group>
    </group>
  );
}
function Tunnel({
  low,
  onSelect,
  onReady,
}: {
  low: boolean;
  onSelect: Props['onSelect'];
  onReady: Props['onReady'];
}) {
  const { scene } = useGLTF(low ? '/models/dtss-section-low.glb' : '/models/dtss-section.glb');
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
  useEffect(() => onReady(), [onReady]);
  return (
    <primitive
      object={clone}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect('dtss-section');
      }}
    />
  );
}
function Rail({ onSelect }: { onSelect: Props['onSelect'] }) {
  return (
    <group
      position={[0, -7, -8]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect('mrt-context');
      }}
    >
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 113, 16, 1, true]} />
        <meshStandardMaterial color="#b0884d" roughness={0.8} />
      </mesh>
      <Block position={[2, 0, 0]} size={[19, 4.8, 6]} color="#c4a474" />
      <Block position={[2, 2.5, 0]} size={[20, 0.3, 7]} color="#dfcfad" />
    </group>
  );
}
function Drop({ moving }: { moving: boolean }) {
  const ref = useRef<Mesh>(null),
    phase = useRef(0),
    invalidate = useThree((s) => s.invalidate);
  useFrame(({ gl }, delta) => {
    if (ref.current) {
      if (moving) phase.current = (phase.current + Math.min(delta, 0.05) * 0.08) % 1;
      const x = -48 + phase.current * 96;
      ref.current.position.set(x, -18 - 0.02 * (x + 50), 1);
      gl.domElement.dataset.traceX = String(x);
      if (moving) invalidate();
    }
  });
  return (
    <mesh ref={ref} position={[-48, -18, 1]}>
      <sphereGeometry args={[0.8, 12, 8]} />
      <meshStandardMaterial color="#f4df9b" roughness={0.4} />
    </mesh>
  );
}
const cameras: Record<SceneState['camera'], { p: Triple; t: Triple; zoom: number }> = {
  overview: { p: [110, 90, 145], t: [0, 5, 0], zoom: 1 },
  underground: { p: [95, 45, 140], t: [0, -1, 0], zoom: 1 },
  tunnel: { p: [68, 17, 110], t: [0, -12, 0], zoom: 1.25 },
  rail: { p: [90, 42, 130], t: [0, -3, -8], zoom: 1.13 },
};
function CameraRig({ state, reduced }: { state: SceneState; reduced: boolean }) {
  const controls = useRef<OrbitControlsImpl>(null),
    active = useRef(true);
  const { size, invalidate } = useThree();
  const preset = cameras[state.camera],
    target = useMemo(() => new Vector3(...preset.t), [preset]);
  const position = useMemo(() => new Vector3(...preset.p), [preset]);
  const zoom = Math.min(size.width / 185, size.height / 130) * preset.zoom;
  useLayoutEffect(() => {
    active.current = true;
    invalidate();
  }, [state.cameraRevision, zoom, invalidate]);
  useFrame(({ camera }, delta) => {
    if (!active.current || !controls.current) return;
    const alpha = reduced ? 1 : 1 - Math.exp(-Math.min(delta, 0.1) * 5);
    camera.position.lerp(position, alpha);
    controls.current.target.lerp(target, alpha);
    const cam = camera as OrthographicCamera;
    cam.zoom += (zoom - cam.zoom) * alpha;
    cam.updateProjectionMatrix();
    controls.current.update();
    if (camera.position.distanceTo(position) < 0.02 && Math.abs(cam.zoom - zoom) < 0.001)
      active.current = false;
    else invalidate();
  });
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping={!reduced}
      minZoom={1}
      maxZoom={12}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.58}
      onStart={() => {
        active.current = false;
      }}
    />
  );
}
function Metrics({ report }: { report: Props['onMetrics'] }) {
  const previous = useRef('');
  useFrame(({ gl, camera }) => {
    gl.domElement.dataset.cameraPosition = JSON.stringify(camera.position.toArray());
    gl.domElement.dataset.cameraZoom = String((camera as OrthographicCamera).zoom);
    const label = `${gl.info.render.calls} draws · ${gl.info.render.triangles.toLocaleString()} triangles`;
    if (previous.current !== label) {
      previous.current = label;
      report(label);
    }
  });
  return null;
}
export default function World({ state, low, reduced, onSelect, onReady, onMetrics }: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const change = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  return (
    <Canvas
      orthographic
      frameloop="demand"
      dpr={low ? 1 : [1, 1.5]}
      shadows={low ? false : { type: PCFShadowMap }}
      camera={{ position: [110, 90, 145], zoom: 4, near: 0.1, far: 1500 }}
      gl={{ antialias: !low, powerPreference: 'low-power' }}
      fallback={
        <div className="scene-fallback">
          <h3>Explore in reading mode.</h3>
          <p>WebGL is unavailable. All explanations and sources remain below.</p>
        </div>
      }
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#f8f1da', '#b0bda9', 0.8]} />
      <directionalLight
        position={[-40, 100, 55]}
        intensity={2.4}
        castShadow={!low}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-bias={-0.001}
      />
      <Surface state={state} />
      <group visible={state.reveal && state.layers.dtss}>
        <Suspense fallback={null}>
          <Tunnel low={low} onSelect={onSelect} onReady={onReady} />
        </Suspense>
        {state.tracing && <Drop moving={!reduced && visible} />}
      </group>
      {state.reveal && state.layers.mrt && <Rail onSelect={onSelect} />}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -25.1, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
      <CameraRig state={state} reduced={reduced} />
      <Metrics report={onMetrics} />
    </Canvas>
  );
}
