import type { ProjectId } from './index';
export type MapLocation = {
  coordinate: [number, number];
  zoom: number;
  label: string;
  placement: 'regional-context' | 'public-landmark';
  note: string;
};
// WGS84 [longitude, latitude]. Curated approximate thematic centres, never routes/access points.
export const mapLocations: Record<ProjectId, MapLocation> = {
  dtss: {
    coordinate: [103.993, 1.334],
    zoom: 13.1,
    label: 'Changi water system',
    placement: 'regional-context',
    note: 'Changi regional context. This pin does not locate a tunnel alignment or access shaft.',
  },
  mrt: {
    coordinate: [103.845, 1.282],
    zoom: 15.1,
    label: 'Downtown mobility',
    placement: 'regional-context',
    note: 'Downtown transport context. The station exhibit is generic; it does not reproduce this station layout.',
  },
  tuas: {
    coordinate: [103.624, 1.273],
    zoom: 13.2,
    label: 'Tuas waterfront',
    placement: 'regional-context',
    note: 'Approximate Tuas Port context. Model is a representative quay section, not the entire terminal or its surveyed layout.',
  },
  newater: {
    coordinate: [103.953, 1.314],
    zoom: 13.8,
    label: 'Eastern water loop',
    placement: 'regional-context',
    note: 'Eastern Singapore water-reuse story marker. It is not a live plant access location.',
  },
  barrage: {
    coordinate: [103.871, 1.28],
    zoom: 15.6,
    label: 'Marina Barrage',
    placement: 'public-landmark',
    note: 'Approximate public landmark location. The engineering model is schematic.',
  },
  reclamation: {
    coordinate: [104.043, 1.402],
    zoom: 12.8,
    label: 'Pulau Tekong',
    placement: 'regional-context',
    note: 'Island-scale polder context. No internal facilities, boundaries or surveyed dike alignment are supplied.',
  },
  coast: {
    coordinate: [103.939, 1.297],
    zoom: 12.9,
    label: 'East Coast',
    placement: 'regional-context',
    note: 'East Coast study context only. This marker and the exhibit do not define a future Long Island outline.',
  },
  caverns: {
    coordinate: [103.69, 1.282],
    zoom: 13,
    label: 'Jurong Island',
    placement: 'regional-context',
    note: 'Island-scale context only; does not locate caverns or access shafts.',
  },
  power: {
    coordinate: [103.789, 1.343],
    zoom: 12.7,
    label: 'Western transmission context',
    placement: 'regional-context',
    note: 'Regional story marker, not an electrical tunnel route or an access location.',
  },
};
export const mapViews = {
  island: {
    label: 'Whole island',
    coordinate: [103.823, 1.35] as [number, number],
    zoom: 11.55,
    pitch: 0,
    bearing: 0,
  },
  marina: {
    label: 'Marina Bay',
    coordinate: [103.856, 1.287] as [number, number],
    zoom: 14.8,
    pitch: 52,
    bearing: -24,
  },
  tuas: {
    label: 'Tuas Port',
    coordinate: [103.625, 1.283] as [number, number],
    zoom: 13.7,
    pitch: 30,
    bearing: -20,
  },
  coast: {
    label: 'East Coast',
    coordinate: [103.938, 1.299] as [number, number],
    zoom: 13.25,
    pitch: 0,
    bearing: 0,
  },
} as const;
export const surfaceSource = {
  source_id: 'onemap-basemap',
  tileTemplate: 'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png',
  minzoom: 11,
  maxzoom: 19,
  tileSize: 256,
  documentation: 'https://www.onemap.gov.sg/docs/maps/index.html',
  terms: 'https://www.onemap.gov.sg/legal/apitermsofservice.html',
  attributionLogo: 'https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png',
};
