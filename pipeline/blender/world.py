"""Original, representative engineering exhibits; no surveyed or confidential geometry.
Blender Z-up metres -> glTF Y-up. Stage extras drive cumulative construction reveal.
"""
import bpy, math, json, hashlib, os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'apps/web/public/models'
manifest={'coordinate_space':'local-schematic','unit':'metre','accuracy_class':'schematic','geometry_origin':'original','files':[]}
stage=0

def mat(name, color, metallic=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=.7;p.inputs['Metallic'].default_value=metallic
 return m

def finish(o,name,m):
 o.name=name;o.data.materials.append(m);o['stage']=stage;o['accuracy_class']='schematic';return o

def box(name,p,s,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);return finish(o,name,m)

def cylinder(name,p,r,d,m,axis='z'):
 bpy.ops.mesh.primitive_cylinder_add(vertices=24,radius=r,depth=d,location=p);o=bpy.context.object
 if axis=='x':o.rotation_euler[1]=math.pi/2
 if axis=='y':o.rotation_euler[0]=math.pi/2
 return finish(o,name,m)

def beam(name,a,b,w,m):
 from mathutils import Vector
 d=Vector(b)-Vector(a);o=box(name,(Vector(a)+Vector(b))/2,(w,w,d.length),m);o.rotation_euler=d.to_track_quat('Z','Y').to_euler();return o

def shell(name,x,length,r,z,m):
 # Open 240-degree cylindrical shell; view exposes working interior.
 verts=[];faces=[];n=32
 for end in [x-length/2,x+length/2]:
  for radius in [r,r+.5]:
   for i in range(n+1):
    t=math.radians(-120+240*i/n);verts.append((end,radius*math.cos(t),z+radius*math.sin(t)))
 for i in range(n):
  for j in [0,1]:
   a=j*(n+1)+i;b=a+2*(n+1);faces.append((a,a+1,b+1,b))
  for e in [0,1]:
   a=e*2*(n+1)+i;faces.append((a,a+n+1,a+n+2,a+1))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);return finish(o,name,m)

for project in ['dtss','mrt','tuas','newater','barrage','reclamation','coast','caverns','power']:
 if os.environ.get('RECLAMATION_ONLY') and project != 'reclamation':continue
 if os.environ.get('BARRAGE_ONLY') and project != 'barrage':continue
 if os.environ.get('MRT_ONLY') and project != 'mrt':continue
 if os.environ.get('TUAS_ONLY') and project != 'tuas':continue
 if os.environ.get('DTSS_ONLY') and project != 'dtss':continue
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 concrete=mat('warm-concrete',(.66,.68,.61));dark=mat('excavated-strata',(.24,.30,.29));sand=mat('compacted-fill',(.54,.45,.32));teal=mat('infrastructure-teal',(.20,.52,.49));gold=mat('safety-ochre',(.82,.54,.24));water=mat('water-section',(.12,.36,.44),.2);steel=mat('structural-steel',(.36,.45,.49),.3);light=mat('porcelain',(.84,.85,.76));green=mat('landscape',(.35,.43,.27))
 stage=0
 box('exhibit-plinth',(0,0,-2),(70,42,3),dark)
 if project in ['dtss','caverns','power']:
  box('geological-back-wall',(0,15,6),(68,6,14),sand)
  for z in [1,4,8,11]:box('geological-bedding',(0,11.9,z),(68,.1,.18),concrete)
 if project=='dtss':
  exec((ROOT/'pipeline/blender/dtss_detail.py').read_text())
 elif project=='mrt':
  exec((ROOT/'pipeline/blender/mrt_detail.py').read_text())
 elif project=='tuas':
  exec((ROOT/'pipeline/blender/tuas_detail.py').read_text())
 elif project=='newater':
  stage=1;box('treatment-deck',(0,0,0),(64,34,1),concrete)
  stage=2
  for x in [-24,-14]:
   box('pretreatment-basin',(x,0,2),(8,24,4),teal);box('basin-water',(x,0,4.05),(7,23,.1),water)
  stage=3
  for x in [-3,3,9]:
   for z in [2,4,6]:
    cylinder('RO-pressure-vessel',(x,0,z),.8,22,light,'y')
   for y in [-10,10]:box('membrane-rack',(x,y,3.5),(2,.4,7),steel)
  stage=4
  cylinder('UV-chamber',(20,0,4),2,14,teal,'y')
  for x in [-24,-14,3,20]:beam('process-header',(x,-14,1),(x,-14,4),.5,gold)
  beam('process-connection',(-26,-14,4),(24,-14,4),.5,gold)
 elif project=='barrage':
  exec((ROOT/'pipeline/blender/barrage_detail.py').read_text())
 elif project=='reclamation':
  exec((ROOT/'pipeline/blender/reclamation_detail.py').read_text())
 elif project=='coast':
  stage=0;box('sea',(0,0,0),(69,40,.3),water);box('existing-mainland',(0,14,1),(66,10,2),green)
  stage=1;box('study-corridor',(0,-5,.3),(60,1,.15),gold)
  stage=2
  for x in [-20,0,20]:box('conceptual-protection-foundation',(x,-7,.6),(18,8,1),sand)
  stage=3
  for x in [-20,0,20]:
   box('envisioned-island',(x,-7,1.7),(17,8,2),sand);box('envisioned-landscape',(x,-7,2.8),(15,7,.2),green)
  stage=4
  for x in [-10,10]:box('illustrative-controlled-opening',(x,-7,2),(2,8,3),teal)
  box('illustrative-pumping-station',(-27,-7,4),(4,5,4),concrete)
 elif project=='caverns':
  stage=1;cylinder('access-shaft',(-29,5,8),3,16,concrete)
  stage=2
  for y in [-7,4]:
   ob=shell('excavated-rock-chamber',0,47,5,6,dark);ob.location.y=y
  stage=3
  for y in [-7,4]:
   for x in range(-20,21,10):
    ob=shell('representative-support-band',x,.3,4.8,6,concrete);ob.location.y=y
  stage=4
  for y in [-7,4]:box('storage-volume',(0,y,2),(45,6,.2),gold)
  for x in [-24,24]:beam('access-gallery',(x,-7,2),(x,5,2),1.2,concrete)
 elif project=='power':
  stage=1;cylinder('access-shaft',(-28,0,7),3,14,concrete)
  stage=2
  for x in range(-24,29,4):shell('concrete-tunnel-ring',x,3.8,4.5,5,concrete)
  stage=3
  for x in range(-22,27,6):
   for z in [3,5,7]:beam('cable-rack',(x,2,z),(x,3.4,z),.2,steel)
  stage=4
  for z in [3,5,7]:
   for y in [2.2,2.6,3]:cylinder('high-voltage-cable',(2,y,z+.2),.15,50,gold,'x')
  box('maintenance-walkway',(2,-1,1.1),(50,2,.3),teal)
 if project=='barrage':
  assert len([o for o in bpy.context.scene.objects if o.name.startswith('drainage-pump')])==7, 'Seven permanent drainage pumps'
  assert len([o for o in bpy.context.scene.objects if o.name.startswith('crest-gate')])==9, 'Barrage must show nine crest gates'
 path=OUT/f'world-{project}.glb'
 # Join geometry within stage and material to keep exhibit draw calls bounded.
 for s in range(9 if project in ['tuas','mrt','barrage','reclamation'] else 5):
  meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.get('stage')==s]
  mats=set((o.data.materials[0].name,o.get('role','')) for o in meshes)
  for mn,role_name in sorted(mats):
   group=[o for o in bpy.context.scene.objects if o.type=='MESH' and o.get('stage')==s and o.data.materials[0].name==mn and o.get('role','')==role_name]
   bpy.ops.object.select_all(action='DESELECT')
   for o in group:o.select_set(True)
   bpy.context.view_layer.objects.active=group[0];bpy.ops.object.join();bpy.context.object.name=f'stage-{s}-{mn}-{role_name}';bpy.context.object['stage']=s
 if project == 'mrt':
  for o in bpy.context.scene.objects:
   if o.get('role') == 'cutter':
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
    bpy.context.scene.cursor.location=(32.7,-6,4.5);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
 if project == 'barrage':
  for o in bpy.context.scene.objects:
   if o.get('role') in ['section-gate','impeller']:
    bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
    bpy.context.scene.cursor.location=(0,0,.2) if o.get('role') == 'section-gate' else (20,0,2)
    bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
 if project in ['tuas','mrt','barrage','reclamation']:
  detail=json.loads((ROOT/f'content/workflow/{project}-exhibit.json').read_text())
  for o in bpy.context.scene.objects:
   if o.type=='MESH':
    o['claim_ids']=detail['stages'][o['stage']]['claim_ids'];o['research_revision']=project+'-r1'
    if project in ['barrage','reclamation'] and o.get('role') == 'future':o['accuracy_class']='envisioned'
    if project == 'mrt':
     role_claim={'monitor':'mrt-monitoring','constraints':'mrt-investigation','ice':'mrt-freeze','freeze-pipes':'mrt-freeze','freeze-existing':'mrt-freeze','freeze-lining':'mrt-freeze','panel':'mrt-wall','cage':'mrt-wall'}
     if o.get('role') in role_claim:o['claim_ids']=list(dict.fromkeys(o['claim_ids']+[role_claim[o['role']]]))
 tris=sum(len(p.vertices)-2 for o in bpy.context.scene.objects if o.type=='MESH' for p in o.data.polygons)
 bpy.ops.export_scene.gltf(filepath=str(path),export_format='GLB',export_yup=True,export_extras=True,export_cameras=False,export_lights=False)
 manifest['files'].append({'project_id':project,'file':path.name,'bytes':path.stat().st_size,'triangles':tris,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'stages':9 if project in ['tuas','mrt','barrage','reclamation'] else 5})
if os.environ.get('RECLAMATION_ONLY') or os.environ.get('BARRAGE_ONLY') or os.environ.get('DTSS_ONLY') or os.environ.get('TUAS_ONLY') or os.environ.get('MRT_ONLY'):
 previous=json.loads((ROOT/'assets/processed/world-manifest.json').read_text())
 manifest['files']+= [e for e in previous['files'] if e['project_id']!=('reclamation' if os.environ.get('RECLAMATION_ONLY') else 'barrage' if os.environ.get('BARRAGE_ONLY') else 'mrt' if os.environ.get('MRT_ONLY') else 'tuas' if os.environ.get('TUAS_ONLY') else 'dtss')]
(ROOT/'assets/processed/world-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
