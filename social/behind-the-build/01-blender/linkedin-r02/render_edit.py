"""Deterministic episode edit. Real app footage + labelled Blender replay.
Run with Python/Pillow and ffmpeg. No network or app mutations.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,json,textwrap,os
B=Path(__file__).resolve().parent;ROOT=B.parents[3];E=B/'edit';E.mkdir(exist_ok=True)
# Locate confirmed project, independent of invocation directory.
ROOT=next(p for p in B.parents if (p/'pipeline/blender/world.py').exists())
FONT='/System/Library/Fonts/Supplemental/Arial.ttf';SERIF='/System/Library/Fonts/Supplemental/Georgia.ttf';MONO='/System/Library/Fonts/Menlo.ttc'
log=open(E/'render.log','w')
def run(a):subprocess.run(a,check=True,stdout=log,stderr=log)
def font(n,kind='sans'):return ImageFont.truetype({'sans':FONT,'serif':SERIF,'mono':MONO}[kind],n)
def text(d,xy,s,size=44,color='#f0efe3',kind='sans',spacing=12):d.multiline_text(xy,s,font=font(size,kind),fill=color,spacing=spacing)
def raw(name):
 p=ROOT/'docs/showcase/raw'/name;d=json.loads((p/'frames.json').read_text());fs=[]
 for f in d['frames']:
  if not fs or f['timestamp']-fs[-1]['timestamp']>=1/32:fs.append(f)
 lines=['ffconcat version 1.0']
 for i,f in enumerate(fs):
  end=fs[i+1]['timestamp'] if i+1<len(fs) else d['ended']
  lines += ["file '"+str(p/f['file'])+"'",f'duration {max(.001,end-f["timestamp"]):.6f}']
 lines += ["file '"+str(p/fs[-1]['file'])+"'"]
 dest=E/(name+'.ffconcat');dest.write_text('\n'.join(lines));return dest
for name in ['assembly','overview','detail']:
 run(['ffmpeg','-y','-framerate','15','-i',str((B if name=='assembly' else B.parent/'draft-r01')/'frames'/name/'%04d.png'),'-r','30','-c:v','libx264','-crf','18','-pix_fmt','yuv420p',str(E/(name+'.mp4'))])
shots=[
 ('hook',3,'app-entry',2.8,'From an empty scene.\nTo an underground world.','BEHIND THE BUILD #1 · ASTRA × BLENDER','Actual app capture'),
 ('assembly',8,'assembly',0,'Watch the model\ntake shape.','SCRIPTED COMPONENTS · AUTHORING ORDER','Blender assembly replay · Compressed'),
 ('blender',12,'blender',0,'Inside Blender.\nPiece by piece.','ACTUAL BLENDER WINDOW CAPTURE','Assembly replay · Accelerated'),
 ('code',5,'detail',0,'One ring.\nThen a tunnel.','THE REAL BLENDER PYTHON SOURCE','Workflow replay · Source + render'),
 ('build',1,'log',3.5,'Geometry becomes\nan app asset.','AN ACTUAL BLENDER REBUILD','Workflow replay · Recorded build log'),
 ('result',5,'overview',0,'The completed\nengineering cutaway.','SURFACE CONTEXT + UNDERGROUND STRUCTURE','Workflow replay · Blender render'),
 ('app',4,'app',5.5,'Now step inside\nthe story.','THE MATCHING OUTPUT IN UNSEEN','Actual app capture'),
 ('key',4,'app',9.5,'Every component\nhas a purpose.','NUMBERED EXPLANATIONS IN THE APP','Actual app capture · Drawing key'),
 ('end',3,'overview',0,'Explore what lies\nbeneath Singapore.','UNSEEN SINGAPORE','Workflow replay · Blender render'),
]
manifest=[]
for fmt,W,H in [('4x5',1080,1350),('16x9',1920,1080)]:
 parts=[]
 for name,dur,source,start,title,kicker,origin in shots:
  portrait=fmt=='4x5';im=Image.new('RGBA',(W,H),'#102e34');d=ImageDraw.Draw(im)
  x=54 if portrait else 64
  text(d,(x,35),'UNSEEN / SINGAPORE',23,'#d6bc82');text(d,(W-210,39),'BUILD PROCESS',17,'#b1c6bd')
  d.line((x,84,W-x,84),fill='#49655f',width=1)
  text(d,(x,116),title,53 if portrait else 64,kind='sans' if name=='end' else 'serif',spacing=6)
  if portrait: box=(40,295,1000,704)
  else:box=(50,280,1320,730)
  bx,by,bw,bh=box
  if name=='code':
   box=(40,650,1000,410) if portrait else (50,310,1030,670);bx,by,bw,bh=box
   cx,cy=(60,305) if portrait else (1125,345)
   text(d,(cx,cy),'dtss_detail.py · source excerpt',27,'#d6bc82')
   excerpt="for x in range(-21,23,2):\n shell('precast-structural-ring',\n  x,1.92,3.5,4.3,concrete)"
   text(d,(cx,cy+64),excerpt,34 if portrait else 29,'#d8e4dc','mono',15)
  if name=='build':box=(70,310,940,720) if portrait else (60,290,1170,750);bx,by,bw,bh=box
  if name=='key':box=(170,295,740,756) if portrait else (70,285,1220,730);bx,by,bw,bh=box
  d.rectangle((bx,by,bx+bw,by+bh),fill=(0,0,0,0))
  if portrait:
   text(d,(54,1110),kicker,30,'#d6bc82')
   text(d,(54,1160),origin,34,'#b7cec5')
   text(d,(54,1212),'Schematic · Not a survey model',34)
   if name=='assembly': text(d,(54,1260),'Modelling order · Not construction sequence',25,'#b7cec5')
  else:
   if name!='code': text(d,(1430,345),'BEHIND\nTHE BUILD\n01',38,'#d6bc82',spacing=10)
   if name!='code': text(d,(1430,550),'Blender Python\n↓\nExported geometry\n↓\nInteractive explanation',27,'#d8e4dc',spacing=10)
   text(d,(64,1030),kicker,22,'#d6bc82');text(d,(W-640,970),origin,22,'#b7cec5')
   text(d,(W-640,1010),'Schematic · Not a survey model',23)
   if name=='assembly': text(d,(1430,790),'Modelling order,\nnot construction\nsequence.',23,'#b7cec5')
  if name=='end':
   # Use a smaller scene above a clear, held URL/next-episode end treatment.
   if portrait:
    d.rectangle((35,1010,1045,1300),fill='#102e34');text(d,(54,1060),'Explore UNSEEN Singapore',32,'#d6bc82');text(d,(54,1120),'unseen-singapore.darrylkai.chatgpt.site',29);text(d,(54,1190),'Explore the engineering.',27,'#b7cec5');text(d,(54,1242),'Schematic · Not a survey model',30);text(d,(54,1290),'Workflow replay · Blender render',25,'#b7cec5')
   else:
    d.rectangle((1400,530,1900,925),fill='#102e34');text(d,(1430,545),'Explore UNSEEN',30,'#d6bc82');text(d,(1430,600),'unseen-singapore.\ndarrylkai.chatgpt.site',28);text(d,(1430,720),'Explore the\nengineering.',25,'#b7cec5')
  overlay=E/f'{fmt}-{name}.png';im.save(overlay)
  if source.startswith('app'):
   args=['-f','concat','-safe','0','-i',str(raw('dtss-entry' if source=='app-entry' else 'dtss'))]
   crop='crop=1490:838:0:138' if name!='key' else 'crop=400:430:1500:410'
  elif source=='blender':
   args=['-i',str(B/'capture/blender-selected.mp4')];crop='crop=1640:768:0:0' if portrait else 'null'
  elif source=='log':
   args=['-i',str(ROOT/'docs/showcase/teaser/build-live.webm')];crop='crop=865:675:990:295'
  else:args=['-i',str(E/(source+'.mp4'))];crop='null'
  vf=f'[0:v]trim=start={start}:duration={dur},setpts=PTS-STARTPTS,fps=30,{crop},scale={bw}:{bh}:force_original_aspect_ratio=decrease:force_divisible_by=2,pad={bw}:{bh}:(ow-iw)/2:(oh-ih)/2:color=0x102e34[v];[1:v][v]overlay={bx}:{by}[base];[base][1:v]overlay=0:0,scale=in_range=auto:out_range=tv,format=yuv420p,setparams=range=limited[out]'
  dest=E/f'{fmt}-{name}.mp4'
  run(['ffmpeg','-y',*args,'-loop','1','-i',str(overlay),'-filter_complex',vf,'-map','[out]','-an','-t',str(dur),'-r','30','-c:v','libx264','-preset','fast','-crf','20','-color_range','tv','-video_track_timescale','15360',str(dest)])
  parts.append(dest)
  if fmt=='4x5':manifest.append(dict(name=name,duration=dur,source=source,start=start,title=title,kicker=kicker,origin=origin))
 listing=E/f'{fmt}.ffconcat';listing.write_text('\n'.join("file '"+str(p)+"'" for p in parts))
 run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart',str(B/f'final_{fmt}.mp4')])
(B/'edit-manifest.json').write_text(json.dumps(manifest,indent=2))
def stamp(n):return f'00:{int(n)//60:02}:{int(n)%60:02},000'
t=0;srt=[]
for i,m in enumerate(manifest):
 srt.append(f'{i+1}\n{stamp(t)} --> {stamp(t+m["duration"])}\n'+m['title'].replace('\n',' ')+'\n'+m['origin']+'\nSchematic · Not a survey model\n');t+=m['duration']
(B/'onscreen_text.srt').write_text('\n'.join(srt))
# Graphic cover: actual verified replay render, original type treatment.
im=Image.new('RGB',(1080,1350),'#102e34');d=ImageDraw.Draw(im)
text(d,(60,60),'UNSEEN / BEHIND THE BUILD #1',27,'#d6bc82')
text(d,(60,155),'FROM ENGINEERING\nIDEA TO 3D',68,kind='serif',spacing=15)
render=Image.open(B.parent/'draft-r01/frames/overview/0045.png').convert('RGB');render.thumbnail((1080,680));im.paste(render,((1080-render.width)//2,430))
d=ImageDraw.Draw(im)
text(d,(60,1150),'GPT-6 Astra × Blender',41,'#d6bc82');text(d,(60,1220),'DTSS · Schematic educational model',27);text(d,(60,1280),'Workflow replay · Schematic model',21,'#b7cec5');im.save(B/'cover.png')
print('Rendered 45-second portrait and landscape drafts')
