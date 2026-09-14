"""mrt-r1 original station and separate historical mechanism scene. No surveyed layout."""
def part(o,r):o['role']=r;return o
def B(n,p,s,m,r):return part(box(n,p,s,m),r)
def E(n,a,b,w,m,r):return part(beam(n,a,b,w,m),r)
def C(n,p,r,d,m,axis,role):return part(cylinder(n,p,r,d,m,axis),role)
# Main section. Blender Z is height. Front opens towards negative Y.
stage=0
B('strata-back',(0,13,12),(68,3,27),sand,'ground')
for z in [3,8,15,22]:B('bedding',(0,11.45,z),(68,.06,.14),sand,'ground')
B('street-edge',(0,9,25),(68,8,.5),dark,'street')
for x in range(-30,32,4):B('road-marking',(x,6,25.3),(2,.12,.04),light,'street-detail')
for x in [-25,-13,3,23]:
 B('city-building',(x,12,29),(6,5,8),light,'street-detail')
 for z in [27,29,31]:
  for dx in [-1.8,0,1.8]:B('city-window',(x+dx,9.45,z),(.7,.06,1),dark,'street')
for x in [-22,2]:E('foundation',(x,10,25),(x,10,17),.55,steel,'constraints')
E('utility',(-31,7,22),(31,7,22),.4,teal,'constraints')
stage=1
B('retaining-wall',(-24,0,12),(1,21,24),concrete,'wall')
# End-wall opening visibly connects the schematic station track and bored tunnel.
B('end-wall-head',(10,0,17),(1,21,14),concrete,'wall')
B('end-wall-side',(10,4.25,5),(1,12.5,10),concrete,'wall')
B('end-wall-edge',(10,-10.25,5),(1,.5,10),concrete,'wall')
B('back-wall',(-7,10,12),(34,1,24),concrete,'wall')
B('panel-demonstration',(-24,-6,12),(1,5,24),concrete,'panel')
for y in [-8,-6,-4]:E('panel-rebar',(-24,y,1),(-24,y,23),.11,gold,'cage')
for z in range(2,24,2):E('cage-tie',(-24,-8,z),(-24,-4,z),.08,gold,'cage')
stage=2
for z in [19,11]:
 for x in [-19,-8,4]:E('temporary-strut',(x,-9,z),(x,9,z),.35,gold,'braces')
B('unexcavated-soil',(-7,0,8),(32,19,16),sand,'excavation')
stage=3
# Roof has a real opening, not a mark painted on a solid slab.
B('roof-left',(-16,0,24),(16,20,.7),concrete,'roof')
B('roof-right',(6,0,24),(8,20,.7),concrete,'roof')
for y in [-7,7]:B('roof-strip',(-3,y,24),(10,6,.7),concrete,'roof')
B('opening-rim',(-3,-4,24.5),(10,.22,.3),gold,'opening')
stage=4
B('concourse',(-7,2,15),(32,16,.65),concrete,'floor')
for x in [-19,-8,4]:B('column',(x,4,12),(.55,.55,23),concrete,'floor')
for i in range(19):
 B('escalator-step',(-15+i*.43,-3,7+i*.43),(.5,2,.32),concrete,'floor')
for y in [-4.1,-1.9]:E('escalator-handrail',(-15,y,8),(-7,y,16),.12,concrete,'floor')
stage=5
B('base',(-7,0,.3),(34,21,.6),concrete,'base')
B('platform',(-7,1,2),(32,8,2.6),light,'base')
for x in range(-22,10,2):B('platform-edge',(x,-3.1,3.34),(1.3,.15,.05),gold,'base')
stage=6
for x in range(13,34,3):part(shell('lining',x,2.8,3.4,4.5,concrete),'rings')
part(shell('shield',29,7,3.6,4.5,teal),'tbm')
C('cutter',(32.7,0,4.5),3.55,.3,gold,'x','cutter')
for a in range(0,360,45):
 t=math.radians(a);B('cutter-tool',(32.95,2.7*math.cos(t),4.5+2.7*math.sin(t)),(.35,.55,.55),gold,'cutter')
E('screw-core',(28,0,3),(23,-2,2),.35,steel,'conveyor')
for x in range(15,26):B('spoil-belt',(x,-2,2),(.9,1.1,.13),steel,'conveyor')
part(shell('annular-grout',18,2.6,3.95,4.5,gold),'grout')
for x in [-21,4]:
 E('instrument',(x,-9,19),(x,-9,23),.1,teal,'monitor')
 B('sensor',(x,-9,23),(.55,.35,.25),teal,'monitor')
stage=7
for y in [-6.8,-5.3]:E('running-rail',(-23,y,1.2),(34,y,1.2),.13,steel,'rail')
for x in range(-22,33,2):B('sleeper',(x,-6,1),(0.25,2.5,.2),steel,'rail')
B('systems-cabinet',(5,7,3),(2,1.3,3),teal,'rail')
for x in range(-20,8,4):
 B('screen-door-post',(x,-3,5),(.15,.2,3.3),steel,'rail')
 E('station-light',(x,0,14.55),(x+2,0,14.55),.14,light,'rail')
stage=8
for x in [-17,-6,5]:
 B('train-car',(x,-6,3.4),(10,3,3.6),teal,'train')
 for dx in [-3,0,3]:B('train-window',(x+dx,-7.52,3.8),(1.8,.04,1.2),dark,'train-window')
B('entrance',(-16,1,26),(7,5,3),teal,'access')
B('entrance-roof',(-16,1,27.7),(8,6,.3),teal,'access')
B('roof-closure',(-3,0,24),(10,8,.7),concrete,'closure')
# Separate Marina Bay case: never visible beside the station as if co-located.
for x in [-12,12]:C('existing-crossing',(x,0,17),2.5,22,concrete,'y','freeze-existing')
for x in [-10,-5,0,5,10]:
 for y in [-4,4]:
  C('freeze-pipe',(x,y,7),.13,15,steel,'z','freeze-pipes')
  C('frozen-column',(x,y,7),2.9,14,water,'z','ice')
part(shell('mined-lining',0,25,3.3,6,concrete),'freeze-lining')

# One original lining segment, animated into the ring; not a universal segment count.
stage=6
verts=[];faces=[]
for x in [-1.1,1.1]:
 for radius in [3.4,3.9]:
  for i in range(9):
   a=math.radians(25+55*i/8);verts.append((x,radius*math.cos(a),radius*math.sin(a)))
for i in range(8):
 for j in [0,1]:
  a=j*9+i;faces.append((a,a+1,a+19,a+18))
 for e in [0,1]:
  a=e*18+i;faces.append((a,a+9,a+10,a+1))
me=bpy.data.meshes.new('lining-piece');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('lining-piece',me);bpy.context.collection.objects.link(o);o.location=(20,0,4.5);finish(o,'lining-piece',gold);part(o,'segment')

# The tunnel shares the train/track axis; no disconnected bore beside the rails.
for o in bpy.context.scene.objects:
 if o.get('role') in ['rings','tbm','cutter','conveyor','grout','segment']:o.location.y -= 6

# Human-scale cues share the completed access mesh, keeping the authored mesh budget.
stage=8
for x,y,z in [(-18,1,3.3),(-5,0,3.3),(2,2,15.35)]:
 C('person-body',(x,y,z+.85),.21,1.1,teal,'z','access')
 C('person-head',(x,y,z+1.5),.19,.3,teal,'z','access')
 for dx in [-.13,.13]:E('person-leg',(x+dx,y,z),(x+dx,y,z+.65),.15,teal,'access')
