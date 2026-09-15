'use client';
import { hasDetailedDemo, detailedDemoCount, demoLabel } from './demo-readiness';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import * as maplibregl from 'maplibre-gl';
import { type Map as LibreMap, type StyleSpecification, type RasterTileSource } from 'maplibre-gl';
import { projects, type Project, type ProjectId, type Year } from '@unseen/world';
import { mapLocations, mapViews, surfaceSource } from '@unseen/world/geography';
import 'maplibre-gl/dist/maplibre-gl.css';
import './surface-map.css';
import { surfaceBearing, surfaceFraming, surfacePitch } from './surface-camera';
import ReclamationMapLayer from './reclamation-map-layer';
import BarrageMapLayer from './barrage-map-layer';
import MrtMapLayer from './mrt-map-layer';
import TuasMapLayer from './tuas-map-layer';
import DtssMapLayer from './dtss-map-layer';
const attribution = `<img src="${surfaceSource.attributionLogo}" alt="OneMap" style="width:20px;height:20px;vertical-align:middle"/> <a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a> © contributors | <a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a>`;
const style: StyleSpecification = {
  version: 8,
  sources: {
    onemap: {
      type: 'raster',
      tiles: [surfaceSource.tileTemplate.replace('Default', 'Satellite')],
      tileSize: 256,
      minzoom: 11,
      maxzoom: 19,
      attribution,
    },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': '#d8e6e5' } },
    {
      id: 'onemap-plan',
      type: 'raster',
      source: 'onemap',
      paint: { 'raster-saturation': 0, 'raster-contrast': 0.03, 'raster-fade-duration': 180 },
    },
  ],
};
const systemGroups = [
  { id: 'all', label: 'All systems' },
  { id: 'detailed', label: 'Detailed' },
  { id: 'simplified', label: 'Simplified' },
  { id: 'water', label: 'Water' },
  { id: 'land', label: 'Land & coast' },
  { id: 'underground', label: 'Underground' },
] as const;
const groups: Record<string, ProjectId[]> = {
  all: projects.map((p) => p.project_id),
  detailed: projects.filter(hasDetailedDemo).map((p) => p.project_id),
  simplified: projects.filter((p) => !hasDetailedDemo(p)).map((p) => p.project_id),
  water: ['dtss', 'newater', 'barrage'],
  land: ['tuas', 'reclamation', 'coast'],
  underground: ['dtss', 'mrt', 'caverns', 'power'],
};
const subscribeControls = () => () => {};
export default function SurfaceMap({
  initialProject,
  year,
  hidden,
  onEnter,
  onCatalog,
  reduceMotion,
}: {
  year: Year;
  initialProject?: 'tuas' | 'mrt' | 'barrage' | 'reclamation' | null;
  hidden: boolean;
  onEnter: (p: Project) => void;
  onCatalog: () => void;
  reduceMotion: boolean;
}) {
  const controlsReady = useSyncExternalStore(subscribeControls, () => true, () => false);
  const container = useRef<HTMLDivElement>(null),
    map = useRef<LibreMap | null>(null),
    markers = useRef<maplibregl.Marker[]>([]),
    onEnterRef = useRef(onEnter),
    motion = useRef(reduceMotion);
  const [selected, setSelected] = useState<ProjectId | null>(null),
    [phase1, setPhase1] = useState(true),
    [phase2, setPhase2] = useState(true),
    [landmarks, setLandmarks] = useState(true),
    [landmarkNote, setLandmarkNote] = useState(
      'Select a landmark to understand its place in the surface context.',
    ),
    [filter, setFilter] = useState('all'),
    [search, setSearch] = useState(''),
    [pitched, setPitched] = useState(true),
    [buildings, setBuildings] = useState(true),
    [layer, setLayer] = useState<'Default' | 'Grey' | 'Satellite'>('Satellite'),
    [tileStatus, setTileStatus] = useState<'loading' | 'ready' | 'error'>('loading'),
    [buildingsReady, setBuildingsReady] = useState(false),
    [buildingError, setBuildingError] = useState(false),
    [sourcesOpen, setSourcesOpen] = useState(false),
    [view, setView] = useState('Marina Bay'),
    [loadError, setLoadError] = useState(false),
    [retry, setRetry] = useState(0),
    [readyVersion, setReadyVersion] = useState(0);
  const selectedProject = projects.find((p) => p.project_id === selected) ?? null;
  useEffect(() => {
    onEnterRef.current = onEnter;
    motion.current = reduceMotion;
  }, [onEnter, reduceMotion]);
  const visit = useCallback((id: ProjectId) => {
    setSelected(id);
    // Preserve the approved network fit extents in selected-project context.
    map.current?.setMinZoom(9.5);
    if (id === 'dtss') {
      setPhase1(true);
      setPhase2(true);
      setLayer('Default');
      (map.current?.getSource('onemap') as RasterTileSource | undefined)?.setTiles([
        'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png',
      ]);
    }
    const loc = mapLocations[id];
    setView(id === 'dtss' ? 'DTSS · island collection logic' : loc.label);
    if (id === 'dtss') {
      map.current?.fitBounds(
        [
          [103.62, 1.22],
          [104.02, 1.46],
        ],
        {
          padding:
            innerWidth > 760
              ? { left: 380, right: 390, top: 90, bottom: 80 }
              : { left: 25, right: 25, top: 245, bottom: 245 },
          pitch: 0,
          bearing: 0,
          duration: motion.current ? 0 : 1600,
        },
      );
      return;
    }
    if (id === 'mrt') {
      map.current?.fitBounds(
        [
          [103.62, 1.25],
          [104.01, 1.46],
        ],
        {
          padding:
            innerWidth > 760
              ? { left: 240, right: 390, top: 110, bottom: 100 }
              : { left: 25, right: 25, top: 210, bottom: 280 },
          pitch: 0,
          bearing: 0,
          duration: motion.current ? 0 : 1500,
        },
      );
      return;
    }
    if (id === 'reclamation') {
      map.current?.fitBounds(
        [
          [104.004, 1.405],
          [104.061, 1.442],
        ],
        {
          padding:
            innerWidth > 760
              ? { left: 320, right: 410, top: 140, bottom: 90 }
              : { left: 25, right: 25, top: 100, bottom: 260 },
          pitch: 0,
          bearing: 0,
          duration: motion.current ? 0 : 1400,
        },
      );
      return;
    }
    if (id === 'barrage') {
      map.current?.fitBounds(
        [
          [103.842, 1.268],
          [103.89, 1.312],
        ],
        {
          padding:
            innerWidth > 760
              ? { left: 240, right: 390, top: 110, bottom: 100 }
              : { left: 25, right: 25, top: 220, bottom: 265 },
          pitch: 0,
          bearing: 0,
          duration: motion.current ? 0 : 1500,
        },
      );
      return;
    }
    if (id === 'tuas') {
      map.current?.fitBounds(
        [
          [103.58, 1.2],
          [103.88, 1.34],
        ],
        {
          padding:
            innerWidth > 760
              ? { left: 260, right: 390, top: 150, bottom: 100 }
              : { left: 30, right: 30, top: 220, bottom: 250 },
          pitch: 0,
          bearing: 0,
          duration: motion.current ? 0 : 1600,
        },
      );
      return;
    }
    map.current?.flyTo({
      center: loc.coordinate,
      zoom: loc.zoom,
      pitch: ['mrt', 'barrage'].includes(id) ? 48 : 25,
      bearing: -12,
      duration: motion.current ? 0 : 1600,
      padding: {
        left: innerWidth > 760 ? 220 : 0,
        right: 0,
        top: 0,
        bottom: innerWidth > 760 ? 0 : 100,
      },
    });
  }, []);
  useEffect(() => {
    if (!initialProject || readyVersion === 0 || hidden) return;
    const frame = requestAnimationFrame(() => visit(initialProject));
    return () => cancelAnimationFrame(frame);
  }, [initialProject, readyVersion, hidden, visit]);
  useEffect(() => {
    if (!container.current) return;
    let active = true;
    const controller = new AbortController();
    const start = mapViews.marina;
    maplibregl.setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
    maplibregl.setWorkerCount(2);
    let m: LibreMap;
    try {
      m = new maplibregl.Map({
        container: container.current,
        style,
        center: start.coordinate,
        zoom: innerWidth < 760 ? 14.15 : start.zoom,
        pitch: start.pitch,
        bearing: start.bearing,
        minZoom: surfaceFraming(container.current.clientWidth, container.current.clientHeight)
          .minZoom,
        maxZoom: 18.5,
        maxPitch: 52,
        transformCameraUpdate: (next) => ({
          bearing: surfaceBearing(
            next.zoom,
            next.bearing,
            container.current?.clientWidth ?? innerWidth,
            container.current?.clientHeight ?? innerHeight,
          ),
          pitch: surfacePitch(
            next.zoom,
            next.pitch,
            container.current?.clientWidth ?? innerWidth,
            container.current?.clientHeight ?? innerHeight,
          ),
        }),
        maxBounds: [
          [103.5, 1.13],
          [104.2, 1.5],
        ],
        attributionControl: false,
        renderWorldCopies: false,
        canvasContextAttributes: { antialias: true },
        maxTileCacheSize: 100,
      });
    } catch {
      const failure = setTimeout(() => setLoadError(true), 0);
      return () => clearTimeout(failure);
    }
    map.current = m;
    m.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');
    m.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');
    m.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }),
      'top-right',
    );
    m.getCanvas().setAttribute(
      'aria-label',
      'Singapore geographic surface. Drag to pan, scroll to zoom, shift-drag to rotate.',
    );
    m.on('idle', () => {
      if (m.getLayer('cbd-massing')) {
        m.getCanvas().dataset.visibleBuildings = String(
          m.queryRenderedFeatures({ layers: ['cbd-massing'] }).length,
        );
        m.getCanvas().dataset.buildingVisibility = String(
          m.getLayoutProperty('cbd-massing', 'visibility'),
        );
        m.getCanvas().dataset.sourceBuildings = String(
          m.querySourceFeatures('cbd-footprints').length,
        );
      }
    });
    m.on('resize', () => {
      const el = m.getContainer();
      m.setMinZoom(
        m.getMinZoom() < 11 ? 9.5 : surfaceFraming(el.clientWidth, el.clientHeight).minZoom,
      );
      m.setPitch(surfacePitch(m.getZoom(), m.getPitch(), el.clientWidth, el.clientHeight));
    });
    m.on('moveend', () => {
      const c = m.getCenter();
      m.getCanvas().dataset.mapCenter = `${c.lng.toFixed(5)},${c.lat.toFixed(5)}`;
      m.getCanvas().dataset.mapZoom = m.getZoom().toFixed(2);
      m.getCanvas().dataset.mapPitch = m.getPitch().toFixed(1);
      setPitched(m.getPitch() > 10);
    });
    m.on('sourcedata', (e) => {
      if (e.sourceId === 'cbd-footprints' && e.isSourceLoaded) {
        setBuildingsReady(true);
        m.getCanvas().dataset.buildingsLoaded = 'true';
      }
      if (e.sourceId === 'onemap' && e.tile?.state === 'loaded') {
        setTileStatus('ready');
        m.getCanvas().dataset.surfaceLoaded = 'true';
        if (warning) clearTimeout(warning);
      }
    });
    m.on('error', (e) => {
      if ('sourceId' in e && e.sourceId === 'onemap') setTileStatus('error');
    });
    const warning = setTimeout(() => {
      if (active && m.getCanvas().dataset.surfaceLoaded !== 'true') setTileStatus('error');
    }, 18000);
    m.on('load', () => {
      m.getCanvas().dataset.surface = 'onemap';
      setReadyVersion((v) => v + 1);
      for (const [i, p] of projects.entries()) {
        const el = document.createElement('button');
        el.className = 'geo-marker';
        el.dataset.project = p.project_id;
        el.style.setProperty('--project-color', p.color);
        el.setAttribute('aria-label', `Locate ${p.title}`);
        el.title = `${p.title} · ${demoLabel(p)}`;
        const number = document.createElement('span');
        number.className = 'geo-marker-number';
        number.textContent = String(i + 1).padStart(2, '0');
        const label = document.createElement('span');
        label.className = 'geo-marker-label';
        label.textContent =
          p.project_id === 'dtss'
            ? 'DTSS'
            : p.project_id === 'mrt'
              ? 'MRT'
              : p.project_id === 'tuas'
                ? 'TUAS PORT'
                : mapLocations[p.project_id].label.toUpperCase();
        el.append(number, label);
        el.onclick = () => visit(p.project_id);
        markers.current.push(
          new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat(mapLocations[p.project_id].coordinate)
            .addTo(m),
        );
      }
      fetch('/geography/cbd-buildings.geojson', { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error('Building layer unavailable');
          return r.json();
        })
        .then((data) => {
          if (!active) return;
          m.addSource('cbd-footprints', {
            type: 'geojson',
            data,
            attribution:
              '<a href="/geography/cbd-buildings.geojson" target="_blank">CBD derived data · ODbL</a>',
          });
          m.addLayer({
            id: 'cbd-massing',
            type: 'fill-extrusion',
            source: 'cbd-footprints',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': [
                'case',
                ['==', ['get', 'height_basis'], 'osm-height'],
                '#99aca4',
                '#c3c9b9',
              ],
              'fill-extrusion-height': ['get', 'height_m'],
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.87,
              'fill-extrusion-vertical-gradient': true,
            },
          });
          m.getCanvas().dataset.buildingCount = String(data.features.length);
          m.on('click', 'cbd-massing', (e) => {
            const f = e.features?.[0];
            if (!f) return;
            const props = f.properties;
            const card = document.createElement('div');
            card.className = 'building-popup';
            const title = document.createElement('strong');
            title.textContent = props.name;
            const note = document.createElement('p');
            note.textContent =
              props.height_basis === 'osm-height'
                ? `OSM-tagged height: ${props.height_m} m · community data, not independently verified.`
                : props.height_basis === 'levels-estimate'
                  ? `Massing estimated from mapped floors: ${props.height_m} m. Not a measured height.`
                  : 'Height unknown. Shown at an illustrative 12 m.';
            const a = document.createElement('a');
            a.href = `https://www.openstreetmap.org/way/${props.osm_id}`;
            a.textContent = 'Inspect mapped footprint ↗';
            a.target = '_blank';
            a.rel = 'noreferrer';
            card.append(title, note, a);
            new maplibregl.Popup({ maxWidth: '260px' })
              .setLngLat(e.lngLat)
              .setDOMContent(card)
              .addTo(m);
          });
          m.on('mouseenter', 'cbd-massing', () => {
            m.getCanvas().style.cursor = 'pointer';
          });
          m.on('mouseleave', 'cbd-massing', () => {
            m.getCanvas().style.cursor = '';
          });
        })
        .catch((e) => {
          if (active && e.name !== 'AbortError') setBuildingError(true);
        });
    });
    const resize = new ResizeObserver(() => m.resize());
    resize.observe(container.current);
    return () => {
      active = false;
      controller.abort();
      if (warning) clearTimeout(warning);
      resize.disconnect();
      markers.current.forEach((x) => x.remove());
      markers.current = [];
      m.remove();
      map.current = null;
    };
  }, [visit, retry]);
  useEffect(() => {
    markers.current.forEach((marker) => {
      const el = marker.getElement();
      const id = el.dataset.project as ProjectId;
      const p = projects.find((p) => p.project_id === id)!;
      el.hidden = !groups[filter].includes(id);
      el.classList.toggle('chosen', id === selected);
      el.classList.toggle(
        'pre-project',
        p.snapshots.find((s) => s.year === year)!.status === 'pre-project',
      );
    });
  }, [filter, selected, year, readyVersion]);
  useEffect(() => {
    const m = map.current;
    if (m?.getLayer('cbd-massing'))
      m.setLayoutProperty(
        'cbd-massing',
        'visibility',
        buildings && pitched && year === 2026 ? 'visible' : 'none',
      );
  }, [buildings, buildingsReady, pitched, year]);
  useEffect(() => {
    if (!hidden) map.current?.resize();
  }, [hidden]);
  function returnToOverview() {
    const start = mapViews.marina;
    setSelected(null);
    setFilter('all');
    setSearch('');
    setView('Marina Bay');
    setBuildings(true);
    setPitched(true);
    setSourcesOpen(false);
    changeStyle('Satellite', false);
    map.current?.flyTo({
      center: start.coordinate,
      zoom: innerWidth < 760 ? 14.15 : start.zoom,
      pitch: start.pitch,
      bearing: start.bearing,
      padding: { left: 0, right: 0, top: 0, bottom: 0 },
      duration: motion.current ? 0 : 1200,
    });
  }
  function bookmark(key: keyof typeof mapViews) {
    const v = mapViews[key];
    setView(v.label);
    setSelected(null);
    map.current?.flyTo({
      center: v.coordinate,
      zoom: v.zoom,
      pitch: v.pitch,
      bearing: v.bearing,
      duration: motion.current ? 0 : 1900,
      padding: { left: innerWidth > 760 ? 230 : 0, right: 0, top: 0, bottom: 0 },
    });
  }
  function togglePlan(plan: boolean) {
    changeStyle(plan ? 'Default' : 'Satellite');
    map.current?.easeTo({
      zoom: plan
        ? map.current.getZoom()
        : Math.max(
            map.current.getZoom(),
            surfaceFraming(
              container.current?.clientWidth ?? innerWidth,
              container.current?.clientHeight ?? innerHeight,
            ).detailZoom,
          ),
      pitch: plan ? 0 : 52,
      bearing: plan ? 0 : -24,
      duration: motion.current ? 0 : 900,
    });
    setPitched(!plan);
  }
  function changeStyle(
    value: 'Default' | 'Grey' | 'Satellite',
    projectSelected = Boolean(selected),
  ) {
    map.current?.setMinZoom(
      value === 'Satellite' && !projectSelected
        ? surfaceFraming(
            container.current?.clientWidth ?? innerWidth,
            container.current?.clientHeight ?? innerHeight,
          ).minZoom
        : 9.5,
    );
    setLayer(value);
    setTileStatus('loading');
    map.current?.getCanvas().removeAttribute('data-surface-loaded');
    (map.current?.getSource('onemap') as RasterTileSource | undefined)?.setTiles([
      `https://www.onemap.gov.sg/maps/tiles/${value}/{z}/{x}/{y}.png`,
    ]);
  }
  const matches = projects.filter(
    (p) =>
      groups[filter].includes(p.project_id) &&
      `${p.title} ${p.theme} ${mapLocations[p.project_id].label}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <section
      className={`geographic-surface ${selected === 'dtss' ? 'show-dtss-network' : selected === 'mrt' ? 'show-mrt-network' : selected === 'barrage' ? 'show-barrage-network' : selected === 'reclamation' ? 'show-reclamation-network' : ''}`}
      hidden={hidden}
      inert={!controlsReady}
      data-controls-ready={controlsReady}
      aria-label="Singapore surface atlas"
    >
      <div className="geographic-map" ref={container} />
      {selected === 'mrt' && readyVersion > 0 && map.current && (
        <MrtMapLayer map={map.current} year={year} onBack={returnToOverview} />
      )}
      {selected === 'reclamation' && readyVersion > 0 && map.current && (
        <ReclamationMapLayer map={map.current} />
      )}
      {selected === 'barrage' && readyVersion > 0 && map.current && (
        <BarrageMapLayer map={map.current} />
      )}
      {selected === 'tuas' && readyVersion > 0 && map.current && <TuasMapLayer map={map.current} />}
      {selected === 'dtss' && readyVersion > 0 && map.current && (
        <DtssMapLayer
          map={map.current}
          phase1={phase1}
          phase2={phase2}
          landmarks={landmarks}
          onLandmark={setLandmarkNote}
        />
      )}
      {selected === 'dtss' && (
        <section className="dtss-map-legend" aria-label="DTSS map layers">
          <button className="dtss-back-overview" onClick={returnToOverview}>
            ← Back to Singapore
          </button>
          <span>BELOW SINGAPORE · NETWORK OVERVIEW</span>
          <h2>A city connected, underground.</h2>
          <div className="dtss-layer-buttons">
            <button aria-pressed={phase1} onClick={() => setPhase1(!phase1)}>
              <i className="phase-one" />
              Phase 1
            </button>
            <button aria-pressed={phase2} onClick={() => setPhase2(!phase2)}>
              <i className="phase-two" />
              Phase 2
            </button>
            <button aria-pressed={landmarks} onClick={() => setLandmarks(!landmarks)}>
              Landmarks
            </button>
          </div>
          <p>
            Approximate deep-tunnel corridors interpreted from PUB’s overview. Link sewers and
            property connections are not individually mapped. Current/planned context in every era.
          </p>
          <a
            href="https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS"
            target="_blank"
            rel="noreferrer"
          >
            Compare PUB’s original plan ↗
          </a>
          <p className="dtss-landmark-note" aria-live="polite">
            {landmarkNote}
          </p>
        </section>
      )}
      <div className="map-topline">
        <span>THE SURFACE ATLAS</span>
        <span>
          <i /> {view}
        </span>
      </div>
      <aside className="surface-sidebar" id="world-content">
        <div className="surface-lead">
          <span className="surface-eyebrow">A NATION, ENGINEERED</span>
          <h1>
            Singapore.
            <br />
            <em>Look closer.</em>
          </h1>
          <p>
            Follow the streets. Find a system.
            <br />
            Step inside the engineering.
          </p>
        </div>
        <label className="surface-search">
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Find an engineering project"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a project or district"
          />
          <span className="search-count">{matches.length}</span>
        </label>
        <div className="demo-counts" aria-label="Demo levels"><span><b>{detailedDemoCount}</b> Detailed</span><span><b>{projects.length - detailedDemoCount}</b> Simplified</span></div>
        <div className="surface-filters" aria-label="Filter engineering systems">
          {systemGroups.map((g) => (
            <button key={g.id} aria-pressed={filter === g.id} onClick={() => setFilter(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
        <div className="surface-projects">
          {matches.map((p) => {
            const n = projects.indexOf(p);
            const snapshot = p.snapshots.find((s) => s.year === year)!;
            return (
              <button
                key={p.project_id}
                aria-pressed={selected === p.project_id}
                onClick={() => visit(p.project_id)}
              >
                <span className="surface-project-number" style={{ color: p.color }}>
                  {String(n + 1).padStart(2, '0')}
                </span>
                <span>
                  <strong>
                    {p.project_id === 'dtss'
                      ? 'Deep Tunnel Sewerage'
                      : p.project_id === 'newater'
                        ? 'NEWater & the water loop'
                        : p.title}
                  </strong>
                                    <small>{year === 2026 ? p.theme : snapshot.status.replaceAll('-', ' ')}</small>
                </span>
                <span className="demo-level-badge">{demoLabel(p)}</span>
                <span>↗</span>
              </button>
            );
          })}
          {!matches.length && (
            <p className="surface-no-results">No matching project. Try water, Tuas or MRT.</p>
          )}
        </div>
        <button className="atlas-link" onClick={onCatalog}>
          Open the full engineering atlas <span>↗</span>
        </button>
      </aside>
      <nav className="map-bookmarks" aria-label="Map destinations">
        {Object.entries(mapViews).map(([key, v]) => (
          <button
            key={key}
            onClick={() => bookmark(key as keyof typeof mapViews)}
            aria-pressed={view === v.label}
          >
            {v.label}
          </button>
        ))}
      </nav>
      <div className="map-view-controls">
        <div className="plan-toggle">
          <button aria-pressed={!pitched} onClick={() => togglePlan(true)}>
            2D plan
          </button>
          <button aria-pressed={pitched} onClick={() => togglePlan(false)}>
            3D context
          </button>
        </div>
        <button
          className="building-toggle"
          aria-pressed={buildings}
          disabled={!buildingsReady || year !== 2026}
          onClick={() => setBuildings(!buildings)}
        >
          ▥ <span>CBD buildings</span>
        </button>
        <button
          className="surface-layer-button"
          onClick={() => changeStyle(layer === 'Satellite' ? 'Default' : 'Satellite')}
        >
          ▧ <span>{layer === 'Satellite' ? 'Street map' : 'Photo map'}</span>
        </button>
      </div>
      {selectedProject && (
        <article className="map-place-card" aria-label="Selected engineering project">
          <div className="place-card-top">
            <span>
              {mapLocations[selectedProject.project_id].label} / {year === 1958 ? '1950s' : year}
            </span>
            <button aria-label="Close selected project" onClick={returnToOverview}>
              ×
            </button>
          </div>
          <h2>{selectedProject.title}</h2>
          {selected === 'reclamation' && (
            <div className="dtss-network-key">
              <b>LAND BELOW THE SEA</b>
              <span>Dashed ochre · approximate dike context</span>
              <details className="reclamation-map-notes">
                <summary>Map accuracy &amp; source</summary>
                <small>
                  Approximate public-source context; not surveyed drainage GIS. Tile vintages
                  differ. Smaller drains and station locations are omitted. Pulau Unum conservation
                  is explained in the story.
                </small>
                <a
                  href="https://www.pub.gov.sg/Resources/News-Room/PressReleases/2025/09/Tekong-Polder"
                  target="_blank"
                  rel="noreferrer"
                >
                  PUB: polder and water management ↗
                </a>
              </details>
              <button onClick={returnToOverview}>← Back to Singapore</button>
            </div>
          )}
          {selected === 'barrage' && (
            <div className="dtss-network-key">
              <p>
                Approximate waterway and landmark markers · upstream branches omitted; no surveyed
                catchment boundary. Modern map reference in every era.
              </p>
              <button onClick={returnToOverview}>← Back to Singapore</button>
            </div>
          )}
          {selected === 'tuas' && (
            <div className="dtss-network-key">
              <b>A PORT BUILT WESTWARD</b>
              <span>Phase 1 · operating and expanding</span>
              <span>Phase 2 · separate construction programme</span>
              <span>2040s · full-port capacity target</span>
              <small>
                Approximate orientation markers on today’s map. No surveyed phase polygons. The
                detailed exhibit focuses on Phase 1, with a labelled Phase 2 comparison.
              </small>
              <button onClick={returnToOverview}>← Back to Singapore</button>
            </div>
          )}
          {selected === 'dtss' && (
            <div className="dtss-network-key">
              <b>ISLAND-WIDE COLLECTION NETWORK</b>
              <span>
                Homes & industry → local sewers → link sewers → deep tunnels → reclamation
              </span>
              <span>Changi · Phase 1 operating</span>
              <span>Tuas · Phase 2, phased commissioning from 2027</span>
              <span>Kranji redevelopment · planned third node</span>
              <small>
                Lines follow the broad corridors in PUB’s overview, manually generalised onto
                OneMap. They are not surveyed routes. Landmark icons orient you above ground; they
                do not mark sewer connections.
              </small>
              <a
                href="https://www.pub.gov.sg/Resources/News-Room/PressReleases/2023/03/Redevelopment-of-Kranji-Water-Reclamation-Plant"
                target="_blank"
                rel="noreferrer"
              >
                PUB: three-node system ↗
              </a>
              <a
                href="https://www.pub.gov.sg/Professionals/Requirements/Used-Water/DTSS"
                target="_blank"
                rel="noreferrer"
              >
                PUB: network & current programme ↗
              </a>
            </div>
          )}
          <p><strong>{demoLabel(selectedProject)}</strong></p>
          <p className="place-status">
            {year === 2026
              ? selectedProject.current_status
              : selectedProject.snapshots.find((s) => s.year === year)!.status.replaceAll('-', ' ')}
          </p>
          <p>
            {year === 2026
              ? selectedProject.summary
              : selectedProject.snapshots.find((s) => s.year === year)!.summary}
          </p>
          <div className="place-metric">
            <b>{selectedProject.metric.value}</b>
            <span>{selectedProject.metric.label}</span>
          </div>
          <button className="enter-engineering" onClick={() => onEnterRef.current(selectedProject)}>
            {hasDetailedDemo(selectedProject) ? 'Enter the engineering story' : 'Explore simplified demo'} <span>↗</span>
          </button>
          <small>{mapLocations[selectedProject.project_id].note}</small>
        </article>
      )}
      {!selectedProject && (
        <div className="surface-invitation">
          <span>START WITH A QUESTION</span>
          <h2>
            What holds
            <br />
            this city together?
          </h2>
          <button onClick={() => visit('barrage')}>
            Discover Marina Barrage <span>↗</span>
          </button>
          <button
            className="quick-tuas"
            onClick={() => onEnterRef.current(projects.find((p) => p.project_id === 'tuas')!)}
          >
            Begin at Tuas Port ↗
          </button>
        </div>
      )}
      <div className="surface-legend">
        <span className="map-live-dot" />{' '}
        {year === 2026
          ? 'LIVE BASEMAP · PRESENT-DAY CONTEXT'
          : `${year === 1958 ? '1950s' : year} STORIES · BASEMAP REMAINS PRESENT-DAY`}
        <button onClick={() => setSourcesOpen(!sourcesOpen)} aria-expanded={sourcesOpen}>
          Map & model provenance ⓘ
        </button>
      </div>
      {sourcesOpen && (
        <div className="surface-provenance">
          <button aria-label="Close map provenance" onClick={() => setSourcesOpen(false)}>
            ×
          </button>
          <h3>Geography with a clear source.</h3>
          <p>
            Street and orthophoto surfaces are streamed from OneMap. Photographs are not live;
            capture dates vary. Streets, coastlines and labels come from the provider; they are not
            generated by UNSEEN.
          </p>
          <p>
            CBD building footprints are OpenStreetMap community data. Height tags are used where
            available; floors yield an estimate, and missing heights are shown at an illustrative 12
            m. Click a building to see its basis. Coverage is partial, not an island-wide digital
            twin.
          </p>
          <p>
            Engineering pins are approximate story locations. They do not disclose underground
            routes or access points. Historical and future lenses change the stories, not the
            basemap date.
          </p>
          <a href="https://www.onemap.gov.sg/docs/maps/index.html" target="_blank" rel="noreferrer">
            OneMap documentation ↗
          </a>
          <a href="/geography/cbd-buildings.geojson" download>
            Download CBD derived data · ODbL ↗
          </a>
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap licence ↗
          </a>
        </div>
      )}
      {tileStatus === 'loading' && (
        <p className="surface-loading" role="status">
          Loading the street-level map…
        </p>
      )}
      {(tileStatus === 'error' || loadError) && (
        <div className="surface-error" role="status">
          <b>The live map is unavailable.</b>
          <p>You can still open every engineering story from the project list.</p>
          <button
            onClick={() => {
              setTileStatus('loading');
              setLoadError(false);
              setBuildingsReady(false);
              setBuildingError(false);
              setLayer('Satellite');
              setView(mapViews.marina.label);
              setSelected(null);
              setRetry((r) => r + 1);
            }}
          >
            Retry map
          </button>
          <button onClick={() => onEnterRef.current(projects[2])}>Open Tuas story ↗</button>
        </div>
      )}
      {buildingError && (
        <p className="building-error">Building layer unavailable · the 2D map remains usable</p>
      )}
    </section>
  );
}
