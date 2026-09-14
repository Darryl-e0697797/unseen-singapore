"""Offline, reproducible station-anchor audit. Run from repository root.
Inputs: retained OneMap search results and LTA March 2026 station polygons.
Station references are not exits or surveyed tunnel centres. Never snap/average.
"""
from pathlib import Path
import hashlib, json, math, tempfile, zipfile
import shapefile
from pyproj import CRS, Transformer
from shapely.geometry import Point, shape

source = Path('assets/source/mrt-onemap-references.json')
archive = Path('assets/source/TrainStation_Mar2026.zip')
data = json.loads(source.read_text())
with tempfile.TemporaryDirectory() as directory:
    zipfile.ZipFile(archive).extractall(directory)
    root = Path(directory)
    reader = shapefile.Reader(str(next(root.rglob('*.shp'))))
    crs = CRS.from_wkt(next(root.rglob('*.prj')).read_text())
    to_wgs = Transformer.from_crs(crs, 'EPSG:4326', always_xy=True)
    to_xy = Transformer.from_crs('EPSG:4326', crs, always_xy=True)
    footprints = list(reader.iterShapeRecords())
    stations = []
    for entry in data['references']:
        name, result = entry['name'], entry['result']
        xy = [float(result['X']), float(result['Y'])]
        coordinate = [float(result['LONGITUDE']), float(result['LATITUDE'])]
        error = math.dist(xy, to_xy.transform(*coordinate))
        assert error <= 1, (name, 'CRS mismatch', error)
        assert not result['SEARCHVAL'].split('(')[-1].startswith(('CR','JS','JE','JW'))
        comparisons = []
        for index, feature in enumerate(footprints):
            if feature.record['STN_NAM_DE'].upper() != name.upper()+' MRT STATION':
                continue
            polygon = shape(feature.shape.__geo_interface__)
            centroid = [polygon.centroid.x, polygon.centroid.y]
            comparisons.append(dict(feature_index=index, centroid_svy21=centroid,
                centroid_wgs84=list(to_wgs.transform(*centroid)),
                distance_metres=round(math.dist(xy, centroid), 2),
                distance_to_footprint_m=round(polygon.distance(Point(*xy)), 2)))
        nearest = min((f['distance_to_footprint_m'] for f in comparisons), default=None)
        assert nearest is None or nearest <= 25, (name, nearest)
        assert comparisons or name in ['Keppel','Cantonment','Prince Edward Road']
        stations.append(dict(name=name, coordinate=coordinate, source_id='onemap-mrt-stations',
            source_feature=result['SEARCHVAL'], source_xy=xy,
            anchor_type='OneMap named station reference (not an exit); interchange uses this named platform reference',
            accuracy_class='documented', access_date=data['access_date'],
            conversion_error_m=round(error, 6), footprint_comparison=comparisons,
            distance_to_lta_footprint_m=nearest,
            review='Different anchor types: named platform reference versus footprint centroid. Point is within 25m of matching LTA footprint; no averaging or snapping.' if comparisons else
            'CCL6 station absent from March 2026 extract; OneMap named station reference retained. Opened July 2026.'))
output = dict(source_crs='OneMap WGS84 / SVY21',
    accuracy='Station reference points; generalised connecting lines, not surveyed tunnel alignments.',
    source_hashes={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in [source,archive]},
    stations=stations, lines=data['lines'])
Path('content/geography/mrt-network.json').write_text(json.dumps(output,indent=2)+'\n')
print(f'{len(stations)} station anchors; max conversion error {max(s["conversion_error_m"] for s in stations):.6f}m; max distance from matching LTA footprint {max(s["distance_to_lta_footprint_m"] or 0 for s in stations):.2f}m')
