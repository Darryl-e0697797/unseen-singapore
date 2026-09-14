'use client';
import { useEffect } from 'react';
import { Marker, type Map } from 'maplibre-gl';
import type { FeatureCollection, LineString } from 'geojson';

// Original, manually generalised corridors interpreted from PUB's DTSS overview.
// These are NOT surveyed, digitised or hydraulic alignments. Coordinates provide
// regional context only; no local-sewer topology or connection to a landmark is implied.
// Source: https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS
const corridors: { phase: number; name: string; coordinates: number[][] }[] = [
  {
    phase: 1,
    name: 'North tunnel · approximate corridor',
    coordinates: [
      [103.757, 1.425],
      [103.775, 1.414],
      [103.794, 1.421],
      [103.817, 1.41],
      [103.825, 1.392],
      [103.846, 1.395],
      [103.85, 1.369],
      [103.846, 1.354],
      [103.857, 1.331],
      [103.884, 1.33],
      [103.911, 1.338],
      [103.94, 1.329],
      [103.962, 1.32],
      [103.985, 1.321],
    ],
  },
  {
    phase: 1,
    name: 'Spur · approximate corridor',
    coordinates: [
      [103.812, 1.326],
      [103.819, 1.345],
      [103.834, 1.352],
      [103.846, 1.354],
    ],
  },
  {
    phase: 2,
    name: 'South tunnel · approximate corridor',
    coordinates: [
      [103.625, 1.286],
      [103.641, 1.313],
      [103.676, 1.324],
      [103.712, 1.324],
      [103.743, 1.319],
      [103.765, 1.3],
      [103.79, 1.282],
      [103.819, 1.273],
      [103.841, 1.267],
      [103.857, 1.276],
    ],
  },
  {
    phase: 2,
    name: 'Industrial tunnel · approximate corridor',
    coordinates: [
      [103.625, 1.286],
      [103.64, 1.301],
      [103.672, 1.307],
      [103.702, 1.311],
    ],
  },
  {
    phase: 2,
    name: 'South spur · approximate corridor',
    coordinates: [
      [103.79, 1.282],
      [103.804, 1.292],
      [103.812, 1.309],
    ],
  },
];
export const dtssLandmarks = [
  {
    name: 'Kranji WRP',
    detail: 'Existing reclamation area; redevelopment planned. Approximate regional marker.',
    coordinate: [103.757, 1.425],
    icon: 'plant',
    plant: true,
  },
  {
    name: 'Changi WRP',
    detail: 'Phase 1 reclamation destination. Approximate facility marker.',
    coordinate: [103.985, 1.321],
    icon: 'plant',
    plant: true,
  },
  {
    name: 'Tuas WRP',
    detail: 'Phase 2 destination; phased commissioning from 2027. Approximate facility marker.',
    coordinate: [103.625, 1.286],
    icon: 'plant',
    plant: true,
  },
  {
    name: 'Mandai Wildlife Reserve',
    detail: 'Surface landmark from PUB’s overview; this marker does not imply a sewer connection.',
    coordinate: [103.792, 1.404],
    icon: 'tree',
  },
  {
    name: 'Jurong Lake Gardens',
    detail: 'Surface landmark from PUB’s overview; routes nearby are generalised.',
    coordinate: [103.729, 1.337],
    icon: 'pagoda',
  },
  {
    name: 'Botanic Gardens',
    detail:
      'Surface landmark from PUB’s overview; no underground alignment beneath the landmark is asserted.',
    coordinate: [103.815, 1.315],
    icon: 'tree',
  },
  {
    name: 'Marina Bay / CBD',
    detail:
      'Surface orientation landmark. Icon represents the Marina Bay skyline, not a sewer asset.',
    coordinate: [103.853, 1.286],
    icon: 'skyline',
  },
  {
    name: 'Gardens by the Bay',
    detail: 'Surface landmark from PUB’s overview; no individual sewer connection is mapped.',
    coordinate: [103.866, 1.281],
    icon: 'supertree',
  },
  {
    name: 'Changi Airport',
    detail: 'Surface landmark from PUB’s overview; no airport sewer connection is mapped.',
    coordinate: [103.994, 1.358],
    icon: 'tower',
  },
] as const;
const drawings: Record<string, string> = {
  plant: '<path d="M7 29V16l9-5 9 5 9-5v18H7M7 21h27M16 11v18M25 16v13"/><path d="M8 32h27"/>',
  tree: '<path d="M20 34V17M20 25l-8-5M20 21l9-6"/><path d="M8 21C-1 11 12 3 18 8C21-2 37 5 32 14C43 23 26 30 20 23C15 29 5 28 8 21Z"/>',
  pagoda:
    '<path d="M8 31h25M12 31V12h17v19M4 25l17-6 17 6H4M7 17l14-6 14 6H7M10 9l11-6 11 6H10M21 3V0"/>',
  skyline: '<path d="M5 31V12h7v19M17 31V12h7v19M29 31V12h7v19M2 10L0 5h39l-3 5H2M3 34h35"/>',
  supertree:
    '<path d="M20 34V16M16 34l2-18M24 34l-2-18M20 19L4 8M20 19L36 8M20 19L12 4M20 19L28 4"/><ellipse cx="20" cy="8" rx="17" ry="5"/>',
  tower: '<path d="M17 34V17h7v17M13 17l-4-8h23l-4 8H13M13 9V5h15v4M20 5V0M12 34h18"/>',
};
export default function DtssMapLayer({
  map,
  phase1,
  phase2,
  landmarks,
  onLandmark,
}: {
  map: Map;
  phase1: boolean;
  phase2: boolean;
  landmarks: boolean;
  onLandmark: (text: string) => void;
}) {
  useEffect(() => {
    const data: FeatureCollection<LineString> = {
      type: 'FeatureCollection',
      features: corridors
        .filter((c) => (c.phase === 1 ? phase1 : phase2))
        .map((c) => ({
          type: 'Feature',
          properties: { phase: c.phase, name: c.name },
          geometry: { type: 'LineString', coordinates: c.coordinates },
        })),
    };
    map.addSource('dtss-corridors', {
      type: 'geojson',
      data,
      attribution:
        'DTSS context interpreted from <a href="https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS" target="_blank">PUB</a> · approximate corridors',
    });
    map.addLayer({
      id: 'dtss-halo',
      type: 'line',
      source: 'dtss-corridors',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#133d3b', 'line-width': 12, 'line-opacity': 0.6 },
    });
    map.addLayer({
      id: 'dtss-routes',
      type: 'line',
      source: 'dtss-corridors',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': ['case', ['==', ['get', 'phase'], 1], '#90ebc5', '#ffe179'],
        'line-width': 5,
      },
    });
    map.addLayer({
      id: 'dtss-route-detail',
      type: 'line',
      source: 'dtss-corridors',
      paint: {
        'line-color': '#fff',
        'line-width': 1,
        'line-dasharray': [2, 12],
        'line-opacity': 0.65,
      },
    });
    const pins = dtssLandmarks
      .filter((p) => landmarks || 'plant' in p)
      .map((p) => {
        const el = document.createElement('button');
        el.className = `dtss-landmark ${'plant' in p ? 'is-plant' : ''}`;
        el.setAttribute('aria-label', `About ${p.name}`);
        // All SVG path data is authored above; no external HTML is injected.
        el.innerHTML = `<svg viewBox="-2 -3 44 42" aria-hidden="true">${drawings[p.icon]}</svg>`;
        const label = document.createElement('span');
        label.textContent = p.name;
        el.append(label);
        el.onclick = () => onLandmark(`${p.name} — ${p.detail}`);
        return new Marker({ element: el, anchor: 'bottom' })
          .setLngLat([...p.coordinate])
          .addTo(map);
      });
    const count = () => {
      map.getCanvas().dataset.dtssRoutes = String(
        map.queryRenderedFeatures({ layers: ['dtss-routes'] }).length,
      );
    };
    map.on('idle', count);
    map.getCanvas().dataset.dtssOverlay = 'true';
    return () => {
      map.off('idle', count);
      pins.forEach((p) => p.remove());
      for (const id of ['dtss-route-detail', 'dtss-routes', 'dtss-halo'])
        if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource('dtss-corridors')) map.removeSource('dtss-corridors');
      map.getCanvas().dataset.dtssOverlay = 'false';
      delete map.getCanvas().dataset.dtssRoutes;
    };
  }, [map, phase1, phase2, landmarks, onLandmark]);
  return null;
}
