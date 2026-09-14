"""Rights-cleared Natural Earth context. Not a historical or surveyed coastline."""
from pathlib import Path
import zipfile, io, json, hashlib
import shapefile
from pyproj import Transformer
root=Path(__file__).resolve().parents[2]
archive=root/'assets/source/ne_10m_admin_0_countries.zip'
z=zipfile.ZipFile(archive)
base='ne_10m_admin_0_countries'
r=shapefile.Reader(shp=io.BytesIO(z.read(base+'.shp')),shx=io.BytesIO(z.read(base+'.shx')),dbf=io.BytesIO(z.read(base+'.dbf')))
t=Transformer.from_crs('EPSG:4326','EPSG:3414',always_xy=True)
origin=[28000,35000]
for sr in r.iterShapeRecords():
    if sr.record.as_dict().get('ADMIN')=='Singapore':
        parts=list(sr.shape.parts)+[len(sr.shape.points)]
        rings=[]
        for i in range(len(parts)-1):
            ring=[]
            for lon,lat in sr.shape.points[parts[i]:parts[i+1]]:
                e,n=t.transform(lon,lat); ring.append([round(e-origin[0],2),round(-(n-origin[1]),2)])
            rings.append(ring)
        (root/'content/geography/singapore.json').write_text(json.dumps({'source_id':'natural-earth','source_crs':'EPSG:4326','projected_crs':'EPSG:3414','origin_m':origin,'runtime_axes':'x=east,z=south,y=up','unit':'metres','rings':rings,'geometry_epoch':None,'note':'Generalised Natural Earth context; not a historical or 2026 survey coastline.','input_sha256':hashlib.sha256(archive.read_bytes()).hexdigest()},separators=(',',':'))+'\n')
        print(f'Extracted {len(rings)} Singapore rings; {sum(map(len,rings))} points')
        break
else: raise RuntimeError('Singapore not found')
