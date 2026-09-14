"""reclamation-r1. Original compressed landscape and open-front polder section.
Horizontal dimensions are illustrative; height contrast deliberately enlarged.
"""
def B(n,p,s,m,r):
 o=box(n,p,s,m);o['role']=r;return o
def E(n,a,b,w,m,r):
 o=beam(n,a,b,w,m);o['role']=r;return o
def profile(n,points,y0,y1,m,r):
 vs=[(x,y,z) for y in [y0,y1] for x,z in points];k=len(points)
 fs=[tuple(range(k-1,-1,-1)),tuple(range(k,k*2))]+[(i,(i+1)%k,(i+1)%k+k,i+k) for i in range(k)]
 me=bpy.data.meshes.new(n);me.from_pydata(vs,[],fs);me.update();o=bpy.data.objects.new(n,me);bpy.context.collection.objects.link(o);finish(o,n,m);o['role']=r;return o
stage=0
B('outside-sea',(-26,0,1.3),(16,40,.35),water,'sea')
B('interior-earth',(9,0,-1),(46,34,2),sand,'land')
for z in [-1.7,-.9]:B('section-strata',(9,-17.05,z),(46,.12,.12),concrete,'land')
stage=1
for x in [-17,-4]:
 for y in range(-6,7):B('sheet-pile',(x,y,2),(.3,.9,6),steel,'enclosure')
for y in [-6,6]:
 for x in range(-17,-3):B('sheet-pile',(x,y,2),(.9,.3,6),steel,'enclosure')
B('work-water',(-10.5,0,1.3),(12,11,2),water,'workwater')
B('temporary-pump',(-4,5,2.5),(1.5,1.5,1.5),gold,'enclosure')
E('temporary-hose',(-4,5,2),(-20,5,3),.25,gold,'enclosure')
stage=2
for y in [-2,2]:B('outlet-side',(-11,y,.5),(16,.5,2),concrete,'outlet')
B('outlet-roof',(-11,0,1.7),(16,4.5,.4),concrete,'outlet')
B('outlet-bed',(-11,0,-.5),(16,4.5,.4),concrete,'outlet')
stage=3
profile('dike-core',[(-20,0),(-14,6),(-11,6),(-3,0)],-16,16,sand,'dike')
profile('outer-revetment',[(-20.5,0),(-14.5,6.1),(-14,6),(-20,0)],-16,16,steel,'rock')
# Small irregular stones remain merged into one authored role/material group.
for j in range(16):
 for i in range(6):
  x=-20+i*.96;z=(x+20)*1.0+.12
  o=B('revetment-stone',(x,-15+j*2,z),(1.1,1.6,.28),steel,'rock');o.rotation_euler[1]=-.65
profile('planted-face',[(-11,6.1),(-2.8,.1),(-3,0),(-11,6)],-16,16,green,'grass')
B('barrier-wall',(-12.5,0,1),(.65,32,9),teal,'wall')
B('crest-road',(-12.5,0,6.2),(2.6,32,.18),concrete,'dike')
# Return embankments contextualise enclosure without claiming an exact island footprint.
for y in [-17,17]:B('return-dike',(8,y,1.2),(47,2,2.4),green,'returns')
B('eastern-return',(31,0,1.2),(2,34,2.4),green,'returns')
B('seepage-drain',(-1.8,0,.15),(.65,31,.3),gold,'seepage')
stage=4
B('polder-surface',(10,0,.05),(38,30,.2),green,'surface')
B('temporary-surcharge',(8,0,3),(20,18,5),sand,'surcharge')
for x in range(0,19,3):
 for y in range(-6,7,3):E('vertical-drain',(x,y,-3),(x,y,1),.12,teal,'ground')
stage=5
B('pond-bed',(21,4,.2),(14,18,.4),concrete,'pond-bank')
B('storage-water',(21,4,.45),(12.8,16.8,.15),water,'pond')
for y in [-11,11]:E('main-drain',(1,y,.35),(24,y,.35),.65,water,'drains')
for x in [3,9,15]:E('secondary-drain',(x,-11,.35),(x,11,.35),.35,water,'drains')
E('cutoff-drain',(28,14,.4),(-20,14,.4),.5,teal,'cutoff')
stage=6
for x,y,r in [(14,-7,'central'),(-5,9,'discharge')]:
 B('station-floor',(x,y,.6),(6,6,.5),concrete,r)
 B('station-hall',(x,y,2),(5,5,2.5),teal,r)
 B('station-roof',(x,y,3.4),(6,6,.25),light,r)
 for dx in [-1.5,0,1.5]:B('station-louvre',(x+dx,y-2.52,2),(.7,.08,1),dark,r)
E('sea-discharge',(-5,9,1),(-23,9,1),.7,teal,'discharge')
E('pond-to-station',(20,9,.7),(-5,9,.7),.55,teal,'discharge')
stage=7
# Restrained scale cues and maintenance access.
for y in range(-14,15,4):E('crest-post',(-13.7,y,6.3),(-13.7,y,7),.08,light,'care')
E('crest-rail',(-13.7,-15,7),(-13.7,15,7),.08,light,'care')
stage=8
B('future-crest',(-12.5,0,7.2),(3.2,32,1.8),gold,'future')
# Comparison platform is an illustrative alternative, not a completed project component.
stage=4
B('infill-comparison',(9,0,2.3),(40,30,4.5),sand,'comparison')
