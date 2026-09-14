# Singapore orientation geography

`singapore.py` extracts the Singapore feature from Natural Earth's 1:10m Admin-0 countries dataset. Natural Earth permits modification and redistribution as public-domain data. Registry: `content/research/sources.json`, `natural-earth`.

Reproduce with Python 3.14:

```sh
python3 -m venv .venv
.venv/bin/pip install -r pipeline/gis/requirements.txt
curl -fL https://naturalearth.s3.amazonaws.com/10m_cultural/ne_10m_admin_0_countries.zip -o assets/source/ne_10m_admin_0_countries.zip
.venv/bin/python pipeline/gis/singapore.py
```

Input coordinates are EPSG:4326. Project with pyproj to EPSG:3414 (SVY21), subtract `[28000,35000]` metres, use runtime `x=east`, `z=-north`, `y=up`. The national renderer divides by 1000 to display kilometres. Exhibit scenes use separate local metres; there is no implied dimensional continuity between an exhibit and a map pin.

The extracted feature has 40 vertices and a single generalised mainland ring. This is orientation geometry, not an up-to-date coastline, offshore-island inventory, cadastral boundary, reclaimed-area survey, or historical reconstruction. Geometry epoch is deliberately null. Do not morph it into historical shorelines. Current Tuas / polder / cavern markers may lie outside this generalised polygon. They identify themes, not certified locations. All nine markers remain catalogue entries in all eras, with dated statuses.

Download input is ignored. The transformed output and SHA-256 digest are versioned. Dataset metadata and reuse terms were checked 2026-09-14.

## Current geographic surface

The default /explore surface now streams OneMap’s documented raster tiles; the Natural Earth output above is retained as a legacy asset. Source records live in `content/geography/sources.json`.

CBD massing is transformed from an explicitly bounded OSM API XML extract:

```sh
curl -fL 'https://api.openstreetmap.org/api/0.6/map?bbox=103.845,1.276,103.866,1.3' -o assets/source/cbd-buildings-osm.xml
npm run geography:generate
npm run validate
```

Do not repeatedly refresh this extract during builds. API responses change; metadata records SHA-256 digests and retrieval date. The transformation retains closed building ways only, not multipolygon relations or building parts. It emits footprints, names, source way IDs and height basis; contributor identities are excluded. Tagged heights are community data, levels use 3.2 m per floor, and missing heights use an explicitly illustrative 12 m. Derived data is shared under ODbL in the public GeoJSON. OneMap raster imagery is streamed, not stored in the repository.

### MRT geographic references

Run `python3 pipeline/gis/mrt.py` from the repository root with the pinned GIS requirements installed. This is offline: inputs are `assets/source/TrainStation_Mar2026.zip` and `assets/source/mrt-onemap-references.json`. Output is `content/geography/mrt-network.json`. Source hashes, reference identities, CRS round trips and footprint comparisons are retained. `tests/mrt-geography.test.ts` checks identities, hashes, exclusions and route-anchor coverage. Updating source data requires a fresh status/identity review; do not treat all LTA polygons as operating stations. See the MRT research dossier for licensing and acquisition details.
