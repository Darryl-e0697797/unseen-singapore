'use client';
import { useEffect } from 'react';
import { Marker, type Map } from 'maplibre-gl';
// WGS84 manually placed orientation points, not surveyed works or catchment boundaries.
// PUB names these waterways as catchment connections; no inferred pipes or basin outline.
export const barragePlaces = [
  { name: 'Tidal barrier', xy: [103.8712, 1.2807] },
  { name: 'Marina Reservoir', xy: [103.8701, 1.2892] },
  { name: 'Singapore River', xy: [103.8505, 1.2867] },
  { name: 'Kallang River', xy: [103.8681, 1.3025] },
  { name: 'Geylang River', xy: [103.8795, 1.3031] },
  { name: 'Gardens by the Bay', xy: [103.8648, 1.282] },
  { name: 'Singapore Strait', xy: [103.879, 1.275] },
];
export default function BarrageMapLayer({ map }: { map: Map }) {
  useEffect(() => {
    const markers = barragePlaces.map((p, i) => {
      const el = document.createElement('div');
      el.className = 'tuas-map-marker barrage-map-marker';
      el.textContent = p.name;
      return new Marker({
        element: el,
        anchor:
          i === 2 || i === 3 || i === 5 ? 'bottom-right' : i === 0 ? 'top-left' : 'bottom-left',
        offset: i === 0 ? [24, 14] : [0, -12],
      })
        .setLngLat(p.xy as [number, number])
        .addTo(map);
    });
    return () => markers.forEach((m) => m.remove());
  }, [map]);
  return null;
}
