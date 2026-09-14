"""Original schematic geometry, in metres. No agency alignment or geometry used."""
import bpy, math, json, hashlib
from pathlib import Path
root = Path(__file__).resolve().parents[2]
out = root/'apps/web/public/models'
out.mkdir(parents=True, exist_ok=True)

def material(name, rgb):
    m=bpy.data.materials.new(name); m.diffuse_color=(*rgb,1); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*rgb,1); bs.inputs['Roughness'].default_value=.82
    return m

def cube(name, xyz, size, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz)
    o=bpy.context.object; o.name=name; o.scale=size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(mat); return o

def export(path):
    bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB', export_yup=True, export_extras=True, export_cameras=False, export_lights=False)

manifest={'schema_version':1,'blender_version':bpy.app.version_string,'coordinate_space':'local-schematic','unit':'metre','accuracy_class':'schematic','files':[]}
for suffix,n in [('',32),('-low',12)]:
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    bpy.context.scene.unit_settings.system='METRIC'; bpy.context.scene.unit_settings.scale_length=1
    lining=material('dtss-matte-teal',(.15,.40,.36)); rim=material('concrete-edge',(.61,.70,.63))
    verts=[]; faces=[]
    # Hollow cutaway shell, 100 m illustrative segment; no actual design dimensions.
    for x in [-50,50]:
        for r in [2.5,3.1]:
            for i in range(n+1):
                theta=math.radians(-90+255*i/n)
                verts.append((x,r*math.cos(theta),-17-.02*(x+50)+r*math.sin(theta)))
    ring=n+1
    for i in range(n):
        for side in [0,1]:
            a=side*ring+i; b=a+2*ring
            face=(a,a+1,b+1,b)
            faces.append(face if side else tuple(reversed(face)))
        for end in [0,1]:
            a=end*2*ring+i; faces.append((a,a+ring,a+ring+1,a+1))
    for i in [0,n]: faces.append((i,i+ring,i+3*ring,i+2*ring))
    mesh=bpy.data.meshes.new('dtss-section'); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new('dtss-section'+suffix,mesh); bpy.context.collection.objects.link(obj); obj.data.materials.append(lining)
    obj['asset_id']='dtss-section'; obj['accuracy_class']='schematic'
    # Visible bands articulate the tunnel as constructed lining, not a glowing path.
    for x in range(-50,51,10):
        curve=bpy.data.curves.new('lining-joint','CURVE'); curve.dimensions='3D'; curve.bevel_depth=.07; curve.bevel_resolution=0
        poly=curve.splines.new('POLY'); poly.points.add(n)
        for i,pt in enumerate(poly.points):
            t=math.radians(-90+255*i/n); pt.co=(x,3.14*math.cos(t),-17-.02*(x+50)+3.14*math.sin(t),1)
        ob=bpy.data.objects.new('joint-'+str(x),curve); bpy.context.collection.objects.link(ob); ob.data.materials.append(rim)
    for x in [-30,30]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=n, radius=1.5, depth=16, location=(x,0,-8))
        o=bpy.context.object; o.name='representative-shaft-'+str(x); o.data.materials.append(lining); o['asset_id']='dtss-section'
        cube('shaft-cap-'+str(x),(x,0,.25),(4,4,.5),rim)
    file=out/f'dtss-section{suffix}.glb'; export(file)
    manifest['files'].append({'file':file.name,'bytes':file.stat().st_size,'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),'lod':1 if suffix else 0})
    if not suffix:
        bpy.ops.wm.save_as_mainfile(filepath=str(root/'assets/generated/dtss-section.blend'))
# Axis fixture: locations must export to east=(1,0,0), north=(0,0,-1), up=(0,1,0).
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
m=material('axis',(.5,.5,.5))
for name,xyz in [('east',(1,0,0)),('north',(0,1,0)),('up',(0,0,1))]: cube(name,xyz,(.1,.1,.1),m)
export(out/'axis-fixture.glb')
(root/'assets/processed/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
