"""Animate actual authoring-order objects; no change to accepted app geometry.
This is a compressed assembly visualisation, not original elapsed-time capture.
"""
import bpy, os, math, json
from pathlib import Path
from mathutils import Vector
B=Path(__file__).resolve().parent
SOURCE=B/'source/pipeline/blender/world.py'
os.environ['DTSS_ONLY']='1'
# Stop before export-time joining so individual authoring components remain visible.
source=SOURCE.read_text().split(" path=OUT/f'world-{project}.glb'")[0]
source=source.replace("o['accuracy_class']='schematic';return o", "o['accuracy_class']='schematic';authoring_order.append(o);return o")
ns={'__file__':str(SOURCE),'__name__':'__main__','authoring_order':[]}
exec(compile(source,str(SOURCE),'exec'),ns)
objects=ns['authoring_order'];scene=bpy.context.scene
scene.render.engine='BLENDER_WORKBENCH'
scene.render.resolution_x=1280;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.fps=15
scene.frame_start=1;scene.frame_end=270
shade=scene.display.shading
shade.light='STUDIO';shade.color_type='MATERIAL';shade.show_shadows=True;shade.show_cavity=True;shade.cavity_type='BOTH';shade.background_type='WORLD'
scene.world.color=(.025,.07,.08);scene.view_settings.view_transform='Standard'
manifest=[]
for i,o in enumerate(objects):
 reveal=2+int(i*238/max(1,len(objects)-1))
 for prop in ['hide_render','hide_viewport']:
  setattr(o,prop,True);o.keyframe_insert(data_path=prop,frame=1)
  setattr(o,prop,False);o.keyframe_insert(data_path=prop,frame=reveal)
 manifest.append({'order':i+1,'name':o.name,'stage':o.get('stage'),'reveal_frame':reveal})
bpy.ops.object.camera_add();cam=bpy.context.object;scene.camera=cam;cam.name='Assembly presentation camera';cam.data.type='ORTHO';cam.data.ortho_scale=100
# Fixed framing makes placement readable; orbit belongs to the finished-product shot.
a=math.radians(-56);cam.location=(100*math.cos(a),100*math.sin(a),57)
cam.rotation_euler=(Vector((0,0,17))-cam.location).to_track_quat('-Z','Y').to_euler()
scene.frame_set(270)
bpy.ops.wm.save_as_mainfile(filepath=str(B/'dtss-assembly-replay.blend'))
(B/'assembly-order.json').write_text(json.dumps(manifest,indent=2))
folder=B/'frames/assembly';folder.mkdir(parents=True,exist_ok=True)
for f in range(1,271):
 scene.frame_set(f);scene.render.filepath=str(folder/f'{f-1:04}.png');bpy.ops.render.render(write_still=True)
print('ASSEMBLY_COMPLETE',len(objects),'components, 270 frames')
