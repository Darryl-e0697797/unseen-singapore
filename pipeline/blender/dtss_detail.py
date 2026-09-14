"""DTSS documentary cutaway. Original indicative components, not contract geometry.
Executed inside world.py's authoring helpers; all dimensions are illustrative metres.
"""
# Keep the standard plinth, but expose a much deeper relationship to the surface.
stage = 0
box('soil-horizon-upper',(0,15,19.5),(68,6,13),sand)
for z in [15,18,23]: box('strata-seam',(0,11.95,z),(68,.12,.15),concrete)
box('surface-road',(0,14,26.2),(68,6,.35),dark)
for x in range(-30,32,4): box('road-centre-mark',(x,14,26.4),(1.7,.12,.04),light)
for x,h in [(-19,8),(-9,12),(3,7),(15,10),(26,6)]:
 box('surface-context-building',(x,18,26+h/2),(6,4,h),light)
 for z in range(28,26+h,2):
  for dx in [-1.8,0,1.8]:box('facade-window',(x+dx,15.98,z),(.9,.05,.8),steel)
# Open shaft with individually visible rings, access ladder, platforms and crane.
stage = 1
for z in range(4,27,2):
 o=shell('shaft-lining-ring',0,1.9,4,0,concrete)
 o.rotation_euler[1]=math.pi/2;o.location=(-27,0,z)
for z in range(4,26):beam('access-ladder-rung',(-29.5,2.1,z),(-28.5,2.1,z),.07,gold)
for x in [-29.5,-28.5]:beam('ladder-rail',(x,2.1,3),(x,2.1,26),.08,gold)
for z in [10,18,26]:box('shaft-service-landing',(-27,2.5,z),(4,2,.18),steel)
for x in [-32,-22]:
 beam('gantry-column',(x,-1,26),(x,-1,33),.4,gold)
beam('gantry-crossbeam',(-32,-1,33),(-22,-1,33),.5,gold)
beam('hoist-cable',(-27,-1,33),(-27,-1,7),.06,steel)
box('lifting-cradle',(-27,-1,7),(2,1.4,.4),gold)
# Tunnel boring machine: shield, disc cutters, drive hub, thrust jacks, backup deck.
cylinder('TBM-face',(29,0,4.3),3.9,.8,gold,'x')
cylinder('TBM-drive-hub',(29.55,0,4.3),.85,.5,steel,'x')
for j in range(3):
 radius=1.4+j*.9
 for i in range(8+j*4):
  t=i*math.tau/(8+j*4)+j*.2
  cylinder('TBM-disc-cutter',(29.6,radius*math.cos(t),4.3+radius*math.sin(t)),.23,.22,steel,'x')
for x in [25,27]:shell('TBM-protective-shield',x,1.9,3.8,4.3,teal)
for i in range(8):
 t=i*math.tau/8
 cylinder('TBM-thrust-jack',(23,3.2*math.cos(t),4.3+3.2*math.sin(t)),.17,3,steel,'x')
box('TBM-backup-deck',(17,0,2),(9,3,.3),steel)
for x in [14,18,21]:box('TBM-service-cabinet',(x,1,3),(1.4,1,1.5),gold)
beam('TBM-spoil-conveyor',(10,0,3),(28,0,4),.5,dark)
# Structural rings and bolted joints. The camera-facing wall is deliberately cut away.
stage = 2
for x in range(-21,23,2):
 shell('precast-structural-ring',x,1.92,3.5,4.3,concrete)
 for i in range(6):
  t=math.radians(-112+i*44)
  y=3.53*math.cos(t);z=4.3+3.53*math.sin(t)
  cylinder('segment-joint-bolt',(x+.85,y,z),.075,.12,steel,'x')
# Corrosion barrier is separated at its end so the three layers can be read.
stage = 3
shell('secondary-corrosion-protection',-3,35,3.16,4.3,teal)
shell('inner-protective-skin',-5,30,3.08,4.3,light)
# A separate, indicative gate shaft: guides remain, gates are mobilised for isolation.
# PUB DTSS2 TODAY June 2023 p5; no permanently parked raised door is implied.
for z in range(4,27,2):
 o=shell('designated-gate-shaft',0,1.9,3.8,0,concrete)
 o.rotation_euler[1]=math.pi/2;o.location=(-15,0,z)
for y in [-2.5,2.5]:beam('embedded-gate-guide',(-15,y,1),(-15,y,26),.22,steel)
beam('air-management-riser',(-8,2.6,6),(-8,2.6,27),.5,teal)
box('illustrative-odour-control-enclosure',(-8,5,27),(5,4,2),teal)
# Operational layer. No flow simulation: runtime particles show direction only.
stage = 4
box('used-water-invert',(-1,-.1,1.05),(47,2.3,.16),water)
for y in [2.4,2.65]:cylinder('monitoring-fibre',(-1,y,6.3),.06,45,gold,'x')
for x in [-18,-6,6,18]:box('fibre-junction-indicator',(x,2.4,6.3),(.3,.3,.3),gold)
# Link sewer and drop connection; compressed spatial relationship is explanatory.
cylinder('link-sewer',(-27,7,19),.8,11,teal,'y')
for y in [3,6,9,12]:cylinder('link-sewer-collar',(-27,y,19),.92,.15,steel,'y')
# Human scale reference on the construction deck (not an operating sewer worker).
cylinder('scale-person-body',(17,-1,3),.25,1,light)
cylinder('scale-person-hardhat',(17,-1,3.7),.3,.2,gold)
for y in [-1.15,-.85]:beam('scale-person-leg',(17,y,2),(17,y,2.6),.14,dark)
