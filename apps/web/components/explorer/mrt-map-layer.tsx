'use client';
import { useEffect, useState } from 'react';
import { Popup, type Map, type MapLayerMouseEvent, LngLatBounds } from 'maplibre-gl';
import network from '../../../../content/geography/mrt-network.json';
const anchors = ['Toa Payoh', 'Bencoolen', 'Rochor', 'Marina Bay', 'Cantonment'];
export default function MrtMapLayer({
  map,
  year,
  onBack,
}: {
  map: Map;
  year: number;
  onBack: () => void;
}) {
  const [line, setLine] = useState('All');
  useEffect(() => {
    const stationByName = new globalThis.Map(network.stations.map((s) => [s.name, s]));
    const features: GeoJSON.Feature[] = [
      ...network.lines
        .filter((l) => line === 'All' || l.id === line)
        .map((l) => ({
          type: 'Feature' as const,
          properties: { kind: 'route', color: l.color, name: l.id },
          geometry: {
            type: 'LineString' as const,
            coordinates: l.stations.map((n) => stationByName.get(n)!.coordinate),
          },
        })),
      ...network.stations
        .filter(
          (s) =>
            line === 'All' || network.lines.find((l) => l.id === line)!.stations.includes(s.name),
        )
        .map((s) => ({
          type: 'Feature' as const,
          properties: { kind: 'station', name: s.name, reference: s.source_feature },
          geometry: { type: 'Point' as const, coordinates: s.coordinate },
        })),
    ];
    map.addSource('mrt-network', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: year >= 2026 ? features : [] },
    });
    map.addLayer({
      id: 'mrt-corridors',
      type: 'line',
      source: 'mrt-network',
      filter: ['==', 'kind', 'route'],
      paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-opacity': 0.85 },
    });
    map.addLayer({
      id: 'mrt-stations',
      type: 'circle',
      source: 'mrt-network',
      filter: ['==', 'kind', 'station'],
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 2.5, 15, 5],
        'circle-color': '#f5f1df',
        'circle-stroke-color': '#244752',
        'circle-stroke-width': 1.5,
      },
    });
    map.addLayer({
      id: 'mrt-station-names',
      type: 'symbol',
      source: 'mrt-network',
      filter: ['==', 'kind', 'station'],
      minzoom: 13,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-offset': [0, 1.2],
        'text-anchor': 'top',
      },
      paint: { 'text-color': '#183b44', 'text-halo-color': '#fffdf0', 'text-halo-width': 2 },
    });
    const popup = new Popup({ closeButton: true });
    const click = (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f || f.geometry.type !== 'Point') return;
      const el = document.createElement('div');
      el.textContent = f.properties?.reference + ' · station reference, not an exit';
      popup
        .setLngLat(f.geometry.coordinates as [number, number])
        .setDOMContent(el)
        .addTo(map);
    };
    map.on('click', 'mrt-stations', click);
    map.getCanvas().dataset.mrtStations = String(year >= 2026 ? network.stations.length : 0);
    return () => {
      popup.remove();
      map.off('click', 'mrt-stations', click);
      for (const id of ['mrt-station-names', 'mrt-stations', 'mrt-corridors'])
        if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource('mrt-network')) map.removeSource('mrt-network');
      delete map.getCanvas().dataset.mrtStations;
    };
  }, [map, line, year]);
  return (
    <aside className="mrt-map-key" aria-label="MRT geographic network">
      <button className="mrt-map-back" onClick={onBack}>
        ← Back to Singapore
      </button>
      <b>MRT · geographic station anchors</b>
      <p>
        {year < 2026
          ? 'Historical context. Modern overlay hidden; the basemap remains present-day.'
          : year === 2050
            ? 'Present-day station references retained for orientation. No official 2050 network is implied.'
            : 'Station references on OneMap. Lines between them are generalised; they do not show surveyed tunnels.'}
      </p>
      <label>
        Highlight line{' '}
        <select value={line} onChange={(e) => setLine(e.target.value)}>
          <option>All</option>
          {network.lines.map((l) => (
            <option key={l.id}>{l.id}</option>
          ))}
        </select>
      </label>
      <div>
        {anchors.map((n) => (
          <button
            key={n}
            onClick={() => {
              const s = network.stations.find((s) => s.name === n)!;
              map.flyTo({
                center: s.coordinate as [number, number],
                zoom: 16,
                duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 900,
              });
            }}
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => {
            const b = new LngLatBounds();
            network.stations.forEach((s) => b.extend(s.coordinate as [number, number]));
            map.fitBounds(b, {
              padding: innerWidth > 760 ? { left: 280, right: 380, top: 90, bottom: 100 } : 60,
              duration: 0,
            });
          }}
        >
          Whole network
        </button>
      </div>
      <small>
        LRT, depots and service tracks omitted. TEL5/DTL3e: announced 2026 targets, opening not
        verified. Unopened Marina South, Mount Pleasant and Founders’ Memorial omitted.
      </small>
      <a
        href="https://www.onemap.gov.sg/legal/apitermsofservice.html"
        target="_blank"
        rel="noreferrer"
      >
        Station references © SLA OneMap · accessed 14 Sep 2026
      </a>
      <a
        href="https://datamall.lta.gov.sg/content/datamall/en/SingaporeOpenDataLicence.html"
        target="_blank"
        rel="noreferrer"
      >
        LTA Train Station · accessed 14 Sep 2026 · Singapore Open Data Licence 1.0
      </a>
    </aside>
  );
}
