"""Transform an explicit, bounded OSM extract into attributed CBD massing data.
Missing heights remain an identified 12m illustrative extrusion, never a surveyed height.
"""
import json, re, hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[2]
source=root/'assets/source/cbd-buildings-osm.xml'
import xml.etree.ElementTree as ET
xml=ET.parse(source).getroot()
nodes={n.attrib['id']:{'lat':float(n.attrib['lat']),'lon':float(n.attrib['lon'])} for n in xml.findall('node')}
elements=[]
for way in xml.findall('way'):
 tags={t.attrib['k']:t.attrib['v'] for t in way.findall('tag')}
 if 'building' not in tags:continue
 refs=[n.attrib['ref'] for n in way.findall('nd')]
 if not all(n in nodes for n in refs):continue
 elements.append({'id':int(way.attrib['id']),'tags':tags,'geometry':[nodes[n] for n in refs]})
data={'elements':elements,'osm3s':{'timestamp_osm_base':None}}
features=[]
for e in data['elements']:
 g=e.get('geometry',[]);t=e.get('tags',{})
 if len(g)<4 or g[0]!=g[-1]:continue
 coords=[[round(p['lon'],7),round(p['lat'],7)] for p in g]
 raw=t.get('height','');match=re.fullmatch(r'(\d+(?:\.\d+)?)\s*(?:m)?',raw)
 levels=t.get('building:levels','');lm=re.fullmatch(r'(\d+(?:\.\d+)?)',levels)
 if match:h=float(match[1]);basis='osm-height'
 elif lm:h=float(lm[1])*3.2;basis='levels-estimate'
 else:h=12;basis='illustrative-default'
 # Reject obviously invalid values, don't pretend a cap is the real height.
 if not 1<=h<=400:h=12;basis='illustrative-default'
 features.append({'type':'Feature','id':e['id'],'properties':{'osm_id':e['id'],'name':t.get('name','Unnamed building'),'height_m':h,'height_basis':basis,'source_id':'osm-cbd-buildings'},'geometry':{'type':'Polygon','coordinates':[coords]}})
geo={'type':'FeatureCollection','licence':'ODbL-1.0','attribution':'© OpenStreetMap contributors','licence_url':'https://www.openstreetmap.org/copyright','retrieved_at':'2026-09-14','note':'Derived CBD footprint subset. Height basis is recorded per feature; this is not an authoritative 3D model.','features':features}
output=root/'apps/web/public/geography/cbd-buildings.geojson'
output.write_text(json.dumps(geo,separators=(',',':'))+'\n')
meta={'source_id':'osm-cbd-buildings','licence':'ODbL-1.0','attribution':'© OpenStreetMap contributors','licence_url':'https://www.openstreetmap.org/copyright','source_timestamp':None,'source_endpoint':'https://api.openstreetmap.org/api/0.6/map?bbox=103.845,1.276,103.866,1.3','access_date':'2026-09-14','query_bbox':[103.845,1.276,103.866,1.3],'input_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'output_sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'features':len(features),'bytes':output.stat().st_size,'height_basis_counts':{basis:sum(f['properties']['height_basis']==basis for f in features) for basis in ['osm-height','levels-estimate','illustrative-default']},'note':'Community-mapped footprint context, partial CBD coverage; multipolygon relations/building parts not included. Heights are tagged, estimated from levels, or explicitly illustrative. Not an authoritative 3D model.'}
(root/'content/geography/buildings-metadata.json').write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta,indent=2))
