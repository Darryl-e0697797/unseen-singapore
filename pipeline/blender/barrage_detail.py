"""barrage-r1: original compressed site and displaced schematic mechanism section."""
def part(o,r):o['role']=r;return o
def B(n,p,s,m,r):return part(box(n,p,s,m),r)
def C(n,p,r,d,m,axis,role):return part(cylinder(n,p,r,d,m,axis),role)
def E(n,a,b,w,m,r):return part(beam(n,a,b,w,m),r)
stage=0
B('reservoir',(0,10,1),(68,19,.3),water,'reservoir')
B('sea',(0,-11,.4),(68,19,.3),teal,'sea')
B('land',(-29,6,1),(11,28,2),sand,'land')
stage=1
for x in [-12,12]:
 for y in range(-10,11):B('sheetpile',(x,y,3),(.4,1,6),steel,'enclosure')
for y in [-10,10]:
 for x in range(-12,13):B('sheetpile',(x,y,3),(1,.4,6),steel,'enclosure')
stage=2
B('work-water',(0,0,2),(23,19,3),water,'work-water')
C('dewater-pump',(-10,-7,1.5),.65,2,gold,'z','temporary')
E('dewater-hose',(-10,-7,2),(-14,-12,5),.22,gold,'temporary')
stage=3
B('barrier-base',(1,0,.25),(58,8,.5),concrete,'foundation')
for x in range(-27,28,6):B('pier',(x,0,3),(1,6,6),concrete,'piers')
# Enlarged teaching section: hides overview. No as-built internal dimensions.
B('section-base',(0,0,.1),(14,20,.5),concrete,'section-base')
for x in [-6,6]:B('section-side',(x,0,3),(1,7,6),concrete,'section-base')
B('section-reservoir',(0,6,2.4),(11,8,.25),water,'section-reservoir')
B('section-sea',(0,-6,.8),(11,8,.25),teal,'section-sea')
stage=4
for x in range(-24,25,6):B('crest-gate',(x,0,2.7),(5,.6,5),teal,'gates')
B('section-gate',(0,0,2.7),(11,.5,5),teal,'section-gate')
for x in [-5,5]:E('gate-stiffener',(x,-.3,.3),(x,-.3,5.1),.15,teal,'section-gate')
stage=5
B('hall-floor',(-29,6,2),(10,25,.5),concrete,'hall')
B('hall-back',(-33,6,4),(1,25,4),concrete,'hall')
for y in range(-4,15,3):
 C('drainage-pump',(-28,y,3),.7,3,steel,'z','pumps')
 C('pump-motor',(-28,y,5),1,1,teal,'z','pumps')
# Seven machines exactly, merged after authoring.
# Open housing, shaft, generic impeller and outlet in separate cutaway.
for x in [17,23]:B('pump-cut-wall',(x,0,3),(.5,10,6),concrete,'pump-housing')
B('pump-bed',(20,0,.3),(6,10,.5),concrete,'pump-housing')
C('shaft',(20,0,4),.28,6,steel,'z','shaft')
C('hub',(20,0,2),.7,1,steel,'z','shaft')
for a in range(0,360,90):
 t=math.radians(a);o=B('generic-blade',(20+1.1*math.cos(t),1.1*math.sin(t),2),(2,.7,.18),gold,'impeller');o.rotation_euler[2]=t;o.rotation_euler[0]=.3
C('section-motor',(20,0,7),1.6,2,teal,'z','motor')
for x in [18,22]:E('motor-support',(x,0,1),(x,0,6),.18,steel,'pump-housing')
E('intake',(20,8,1),(20,2,1),1.4,water,'pump-flow-bed')
E('discharge',(20,-2,3),(20,-10,3),1.4,teal,'pump-flow-bed')
stage=6
B('bridge',(0,1.7,6),(60,3,.5),light,'bridge')
for y in [.1,3.2]:
 E('railing',(-29,y,7),(29,y,7),.1,steel,'bridge-rail')
 for x in range(-29,30,2):E('rail-post',(x,y,6.2),(x,y,7),.08,steel,'bridge-rail')
B('roof',(-29,6,6),(11,26,.6),green,'roof')
# Walkable terraced approach and simple human-scale cues.
for i in range(8):B('roof-approach',(-29,-11-i*.65,1+i*.5),(10,.7,.4),green,'roof')
stage=7
for x,y in [(-28,4),(-25,7),(4,2),(14,2)]:
 C('person',(x,y,7),.17,1.3,gold,'z','people')
 C('head',(x,y,7.8),.2,.35,gold,'z','people')
stage=8
for x in range(-24,25,6):B('possible-seal',(x,0,5.6),(5,.6,.5),gold,'future')
# Original schematic mechanical detail, not proprietary pump shop geometry.
stage=5
for z in [1,4.8]:
 for a in range(0,360,30):
  t=math.radians(a);C('flange-bolt',(20+1.85*math.cos(t),1.85*math.sin(t),z),.12,.3,steel,'z','pump-housing')
# Half-open cylindrical housing makes the vertical shaft and generic impeller legible.
verts=[];faces=[]
for z in [.7,4.8]:
 for radius in [2.05,2.3]:
  for i in range(17):
   a=math.radians(0+180*i/16);verts.append((20+radius*math.cos(a),radius*math.sin(a),z))
for i in range(16):
 for j in [0,1]:
  a=j*17+i;faces.append((a,a+1,a+35,a+34))
 for e in [0,1]:
  a=e*34+i;faces.append((a,a+17,a+18,a+1))
me=bpy.data.meshes.new('cutaway-housing');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('cutaway-housing',me);bpy.context.collection.objects.link(o);finish(o,'cutaway-housing',steel);part(o,'pump-housing')
for a in range(0,360,30):
 t=math.radians(a);B('motor-cooling-fin',(20+1.65*math.cos(t),1.65*math.sin(t),7),(.15,.15,1.7),teal,'motor')
# Gate stiffeners explain a structural panel without claiming exact stiffener spacing.
stage=4
for z in [1.3,2.8,4.3]:B('section-gate-stiffener',(0,-.4,z),(10.8,.2,.18),teal,'section-gate')
