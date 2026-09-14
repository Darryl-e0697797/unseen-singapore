'use client';
import { useEffect } from 'react';
import { Marker, type Map } from 'maplibre-gl';
// Approximate orientation markers, not official phase boundaries or navigational positions.
const places = [
  { name: 'Tuas · operating + expanding', xy: [103.615, 1.265] },
  { name: 'Pasir Panjang · consolidation context', xy: [103.785, 1.278] },
  { name: 'City terminals · Keppel / Brani / Tanjong Pagar', xy: [103.837, 1.265] },
  { name: 'Sultan Shoal · environmental context', xy: [103.65, 1.24] },
];
export default function TuasMapLayer({ map }: { map: Map }) {
  useEffect(() => {
    const markers = places.map((p) => {
      const el = document.createElement('div');
      el.className = 'tuas-map-marker';
      el.textContent = p.name;
      return new Marker({ element: el, anchor: 'bottom' })
        .setLngLat(p.xy as [number, number])
        .addTo(map);
    });
    return () => markers.forEach((m) => m.remove());
  }, [map]);
  return null;
}
