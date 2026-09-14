'use client';
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { SceneBoundary } from './scene-boundary';
function Model({ select, loaded }: { select: () => void; loaded: () => void }) {
  const { scene } = useGLTF('/models/dtss-section.glb');
  useEffect(() => loaded(), [loaded]);
  return <primitive object={scene} onClick={select} />;
}
export default function Proof() {
  const [selected, setSelected] = useState(false),
    [ready, setReady] = useState(false);
  return (
    <main style={{ padding: 32 }}>
      <p>UNSEEN SINGAPORE · PIPELINE VERIFICATION</p>
      <h1>Blender → GLB → interactive scene</h1>
      <p>SCHEMATIC · original teaching geometry · metres</p>
      <div style={{ height: '65vh' }}>
        <SceneBoundary>
          <Canvas frameloop="demand" camera={{ position: [70, 40, 95], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[0, 60, 50]} intensity={3} />
            <Suspense fallback={null}>
              <Model select={() => setSelected(true)} loaded={() => setReady(true)} />
            </Suspense>
            <OrbitControls target={[0, -10, 0]} />
          </Canvas>
        </SceneBoundary>
      </div>
      <button onClick={() => setSelected(true)}>Select tunnel</button>
      <p role="status">
        {selected
          ? 'Selected: dtss-section. Representative cutaway; no real alignment.'
          : ready
            ? 'GLB loaded. Select the generated tunnel to inspect its identity.'
            : 'Loading generated GLB…'}
      </p>
    </main>
  );
}
