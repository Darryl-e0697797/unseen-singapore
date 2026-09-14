"""Original Tuas teaching district, tuas-r1. Distances compressed, not contract geometry.
Reproducible Blender authoring; stage and role extras drive the documentary.
"""
# Roles survive batching for temporary works and reversible interactive movement.
def role(name):
 for o in bpy.context.selected_objects:o['role']=name

def caisson(x,y,z,name):
 start=set(bpy.context.scene.objects)
 box(name+'-base',(x,y,z+.35),(13.8,9.8,.7),concrete)
 for dy in [-4.6,4.6]:box(name+'-wall',(x,y+dy,z+5),(13.8,.6,9.4),concrete)
 for dx in [-6.6,-2.2,2.2,6.6]:box(name+'-cell',(x+dx,y,z+5),(.6,9.8,9.4),concrete)
 for o in set(bpy.context.scene.objects)-start:o['role']=name

stage=0
box('sea-section',(0,-8,7.6),(69,24,.16),water);role('water')
box('seabed-cut-face',(0,0,-.2),(68,40,2),dark)
for z in [-.7,-.3,.1]:box('sediment-seam',(0,-20.02,z),(68,.05,.07),sand)
stage=1
box('local-sand-replacement',(0,0,1.1),(43,14,1.5),sand)
box('prepared-rock-mound',(0,0,2.1),(43,12,.7),steel)
# Discrete aggregate cues along the exposed edge, deterministic placement.
for x in range(-20,21):
 cylinder('rock-mound-texture',(x,-5.8,2.35+(x%3)*.08),.35,.4,steel)
stage=2
caisson(-25,11,2.5,'fabrication')
for x in [-31,-19]:
 for y in [5,17]:beam('casting-bay-post',(x,y,2.5),(x,y,17),.24,steel)
beam('casting-bay-roof',(-31,11,17),(-19,11,17),.4,steel)
for x in range(-30,-19,2):
 beam('illustrative-rebar',(x,6.6,3),(x,6.6,14),.045,gold)
for z in range(4,15,2):beam('rebar-tie',(-30,6.6,z),(-20,6.6,z),.045,gold)
for y in [6,16]:box('slipform-walkway',(-25,y,10),(15,1,.45),gold);role('slipform')
stage=3
# Moving assembly is original; no ballast plumbing or stable draft is implied.
caisson(-14,-11,5,'tow')
box('tug-hull',(-27,-13,8),(5,2.7,1),steel);role('tug')
box('tug-wheelhouse',(-28,-13,9),(1.8,2,1.6),light);role('tug')
stage=4
for x in [-7,7]:caisson(x,0,2.5,'installed')
for x in range(-12,14,4):box('quay-fender',(x,-5.1,10.5),(.8,.5,2.2),dark)
stage=5
box('retained-fill',(0,11,7),(38,12,9),sand);role('fill')
for z in [4,7,10]:box('fill-cut-seam',(19.04,11,z),(.08,12,.12),concrete)
stage=6
for x in [0,4,8,12,16]:
 for y in [7,11,15]:beam('vertical-drain',(x,y,2.7),(x,y,12),.09,teal)
box('temporary-surcharge',(8,11,13.4),(21,12,3),sand);role('preload')
for x in [2,10,17]:
 beam('monitoring-staff',(x,6,11.6),(x,6,14),.08,gold)
 box('monitoring-head',(x,6,14),(.5,.4,.25),gold)
stage=7
box('terminal-deck',(0,8,12.35),(39,25,.4),concrete);role('deck')
for x in range(-18,19,3):box('traffic-lane',(x,2,12.58),(1.3,.1,.03),light);role('deck')
for x in [-12,7]:
 for y in [-3,3]:
  for dx in [-1.8,1.8]:beam('quay-crane-leg',(x+dx,y,12.5),(x+dx,y,26),.32,gold)
  beam('crane-brace',(x-1.8,y,13),(x+1.8,y,23),.18,gold)
 beam('crane-boom',(x,-17,26),(x,8,26),.45,gold)
 beam('crane-mast',(x,3,26),(x,3,30),.32,gold)
 beam('backstay',(x,3,30),(x,-15,26),.09,steel)
 for dx in [-.65,.65]:beam('hoist',(x+dx,-11,26),(x+dx,-11,17),.05,steel)
 box('spreader',(x,-11,17),(3,1.5,.25),gold)
# Yard gantry is visibly a separate transfer destination.
for x in [-8,10]:beam('yard-gantry-leg',(x,14,12.6),(x,14,20),.3,teal)
beam('yard-gantry-cross',(-8,14,20),(10,14,20),.4,teal)
stage=8
for x in range(-15,16,5):
 for y in [9,14]:
  for z in [13.5,15.3]:box('yard-container',(x,y,z),(4.5,2.3,1.7),teal)
 for dx in [-1.5,-.5,.5,1.5]:box('container-rib',(x+dx,7.82,15.3),(.06,.06,1.5),steel)
outline=[(-22,-3.5),(15,-3.5),(21,0),(15,3.5),(-22,3.5)]
verts=[(x,y-13,z) for z in [5.8,10] for x,y in outline]
faces=[tuple(range(4,-1,-1)),tuple(range(5,10))]+[(i,(i+1)%5,(i+1)%5+5,i+5) for i in range(5)]
me=bpy.data.meshes.new('original-hull');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('original-hull',me);bpy.context.collection.objects.link(o);finish(o,'original-hull',steel)
box('ship-superstructure',(-18,-13,13),(4,5,6),light)
box('bridge-glazing',(-15.95,-13,14),(.06,4,1.1),steel)
for x in range(-10,15,5):
 for y in [-15,-12]:box('ship-container',(x,y,11),(4.5,2.4,2),light)
box('AGV-platform',(0,2,13),(4,2,.6),gold);role('agv')
for x in [-1.3,1.3]:
 for y in [1,3]:cylinder('AGV-wheel',(x,y,12.8),.35,.2,steel,'y');role('agv')
box('transfer-container',(0,2,14.2),(3.7,1.8,1.8),gold);role('cargo')
# Adult scale figure is schematic; dimensions/layout across the district are compressed.
cylinder('person',(17,3,13.2),.17,.7,light)
cylinder('hardhat',(17,3,13.7),.2,.16,gold)
# Trussed crane booms, ship rails, bollards and container doors supply readable scale.
stage=7
for x in [-12,7]:
 for y in range(-16,8,2):
  beam('boom-upper-chord',(x,y,27),(x,y+2,27),.13,gold)
  beam('boom-lattice',(x,y,26),(x,y+2,27),.10,gold)
 for y in [-3,3]:
  for dx in [-1.8,1.8]:
   for z in range(14,24,2):beam('crane-lattice',(x+dx,y,z),(x-dx,y,z+2),.09,gold)
for x in range(-16,17,4):
 cylinder('mooring-bollard',(x,-3.8,12.8),.17,.5,steel)
stage=8
for x in range(-20,15,3):
 for y in [-16.3,-9.7]:beam('ship-railing-post',(x,y,10),(x,y,10.8),.035,steel)
for y in [-16.3,-9.7]:beam('ship-rail',(-20,y,10.8),(15,y,10.8),.035,steel)
for x in range(-15,16,5):
 for y in [9,14]:
  box('container-door',(x+2.26,y,15.3),(.035,2.1,1.5),light)
  for dy in [-.5,.5]:beam('door-lock',(x+2.3,y+dy,14.6),(x+2.3,y+dy,16),.04,steel)
