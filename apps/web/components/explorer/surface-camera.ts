// Keep regional raster coverage below the horizon at atlas-scale zooms.
// This controls framing only; it never moves geographic features or markers.
export function surfaceFraming(width: number, height: number) {
  const scale = Math.max(0, Math.log2(Math.max(width, height) / 1200));
  return { minZoom: 11.65 + scale, flatZoom: 11.8 + scale, detailZoom: 13.5 + scale };
}
export function surfacePitch(zoom: number, requestedPitch: number, width: number, height: number) {
  const { flatZoom, detailZoom } = surfaceFraming(width, height);
  const t = Math.max(0, Math.min(1, (zoom - flatZoom) / (detailZoom - flatZoom)));
  return Math.min(requestedPitch, 52 * t * t * (3 - 2 * t));
}

export function surfaceBearing(zoom: number, bearing: number, width: number, height: number) {
  const { flatZoom, detailZoom } = surfaceFraming(width, height);
  const t = Math.max(0, Math.min(1, (zoom - flatZoom) / (detailZoom - flatZoom)));
  const limit = 180 * t * t;
  return Math.max(-limit, Math.min(limit, bearing));
}
