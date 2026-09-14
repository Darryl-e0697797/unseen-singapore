'use client';
import { useEffect } from 'react';
import { Marker, type Map } from 'maplibre-gl';
import context from '../../../../content/geography/reclamation-context.json';
export default function ReclamationMapLayer({ map }: { map: Map }) {
  useEffect(() => {
    const id = 'reclamation-context';
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: context.dike_context },
      },
    });
    map.addLayer({
      id,
      type: 'line',
      source: id,
      paint: { 'line-color': '#e5b878', 'line-width': 4, 'line-dasharray': [2, 1.5] },
    });
    const markers = [
      ['POLDER · approximate context', context.polder_anchor],
      ['STORMWATER POND', context.pond_anchor],
    ] as const;
    const pins = markers.map(([name, xy]) => {
      const el = document.createElement('div');
      el.className = 'tuas-map-marker reclamation-map-marker';
      el.textContent = name;
      return new Marker({ element: el, anchor: 'bottom', offset: [0, -10] })
        .setLngLat(xy as [number, number])
        .addTo(map);
    });
    return () => {
      pins.forEach((p) => p.remove());
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
    };
  }, [map]);
  return null;
}
