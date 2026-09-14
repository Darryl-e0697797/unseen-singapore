import test from 'node:test';
import assert from 'node:assert/strict';
import {
  surfaceBearing,
  surfaceFraming,
  surfacePitch,
} from '../apps/web/components/explorer/surface-camera';
test('atlas camera flattens at wide zoom and preserves district tilt', () => {
  for (const [w, h] of [
    [1208, 1042],
    [1440, 900],
    [390, 690],
    [2560, 1400],
  ]) {
    const f = surfaceFraming(w, h);
    assert.equal(surfacePitch(f.flatZoom, 52, w, h), 0);
    assert.equal(surfacePitch(f.detailZoom, 52, w, h), 52);
    assert.equal(surfacePitch(15, 0, w, h), 0);
    assert(f.minZoom >= 11);
    assert.equal(Math.abs(surfaceBearing(f.flatZoom, -24, w, h)), 0);
    assert.equal(surfaceBearing(f.detailZoom, -24, w, h), -24);
    let previous = 0;
    for (let z = f.flatZoom; z < f.detailZoom; z += 0.1) {
      const p = surfacePitch(z, 65, w, h);
      assert(p >= previous && p <= 52);
      previous = p;
    }
  }
});
