'use client';
import { Component, type ReactNode } from 'react';
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SceneFallback /> : this.props.children;
  }
}

export function SceneFallback() {
  return (
    <div className="scene-fallback" role="status">
      <span className="eyebrow">READING MODE</span>
      <h3>The story is still here.</h3>
      <p>
        The 3D model could not load on this device. You can explore every explanation and source
        using the chapter controls.
      </p>
      <button onClick={() => window.location.reload()}>Retry 3D</button>
    </div>
  );
}
