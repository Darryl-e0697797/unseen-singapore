"""60-second reveal-first edit. All infrastructure shots are actual app capture."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,json
R=Path(__file__).resolve().parents[2];O=R/'docs/showcase';T=O/'teaser';T.mkdir(exist_ok=True);RAW=O/'raw';log=open(T/'render.log','w')
F='/System/Library/Fonts/Supplemental/Arial.ttf';S='/System/Library/Fonts/Supplemental/Georgia.ttf'
def run(a):subprocess.run(a,check=True,stdout=log,stderr=log)
def font(n,serif=False):return ImageFont.truetype(S if serif else F,n)
def listing(name):
 p=RAW/name;d=json.loads((p/'frames.json').read_text());fs=[]
 for f in d['frames']:
  if not fs or f['timestamp']-fs[-1]['timestamp']>=1/32:fs.append(f)
 ls=['ffconcat version 1.0']
 for i,f in enumerate(fs):
  end=fs[i+1]['timestamp'] if i+1<len(fs) else d['ended'];ls += ["file '"+str(p/f['file'])+"'",f'duration {max(1/120,end-f["timestamp"]):.6f}']
 ls += ["file '"+str(p/fs[-1]['file'])+"'"];out=T/(name+'.ffconcat');out.write_text('\n'.join(ls));return out
parts=[];manifest=[]
def raw(name,start,dur,label='',detail='',hero=False,filename=None,append=True):
 out=T/((filename or name)+'.mp4');vf=f'trim=start={start}:duration={dur},setpts=PTS-STARTPTS,fps=30'
 if hero:vf+=',crop=1490:838:0:138,scale=1920:1080'
 args=['ffmpeg','-y','-f','concat','-safe','0','-i',str(listing(name))]
 if label:
  im=Image.new('RGBA',(1920,1080));d=ImageDraw.Draw(im);d.rectangle((0,984,1920,1080),fill='#102e34');d.rectangle((40,1002,44,1056),fill='#d6bc82');d.text((67,1006),label,font=font(23),fill='#d6bc82');d.text((410,1005),detail,font=font(29),fill='#f0f0e4');png=T/((filename or name)+'.png');im.save(png)
  args+=['-loop','1','-i',str(png),'-filter_complex',f'[0:v]{vf}[v];[v][1:v]overlay=0:0[out]','-map','[out]']
 else:args+=['-vf',vf]
 args+=['-t',str(dur),'-r','30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-video_track_timescale','15360',str(out)];run(args)
 if append:parts.append(out);manifest.append(dict(source=name,start=start,duration=dur,label=label,crop=hero))
 return out

def card(name,lines,sub,dur,bg):
 im=Image.open(bg).convert('RGB').resize((1920,1080));shade=Image.new('RGBA',(1920,1080),(7,28,34,218));im=Image.alpha_composite(im.convert('RGBA'),shade);d=ImageDraw.Draw(im)
 d.line((108,210,330,210),fill='#d6bc82',width=4)
 for i,line in enumerate(lines):d.text((104,275+i*115),line,font=font(86,True),fill='#f0efe3')
 d.text((110,760),sub,font=font(34),fill='#d6bc82')
 d.text((110,1008),'UNSEEN SINGAPORE  /  ACTUAL APP FOOTAGE · ILLUSTRATIVE ENGINEERING MODELS',font=font(17),fill='#adc4bc')
 png=T/(name+'.png');im.convert('RGB').save(png);out=T/(name+'.mp4');run(['ffmpeg','-y','-loop','1','-i',str(png),'-t',str(dur),'-r','30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-video_track_timescale','15360',str(out)]);parts.append(out);manifest.append(dict(card=name,duration=dur,text=lines,subtitle=sub))
# A standard editorial wipe between actual surface and cutaway shots; not a new app feature.
surface=raw('overview-final',0,1.8,filename='hook-surface',append=False)
under=raw('dtss-entry',2.8,2.7,hero=True,filename='hook-under',append=False)
hook=T/'hook.mp4';run(['ffmpeg','-y','-i',str(surface),'-i',str(under),'-filter_complex','[0:v]settb=AVTB,format=yuv420p[a];[1:v]settb=AVTB,format=yuv420p[b];[a][b]xfade=transition=wipeup:duration=0.5:offset=1.3[v]','-map','[v]','-t','4','-r','30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-video_track_timescale','15360',str(hook)]);parts.append(hook);manifest.append(dict(shot='surface-to-underground',duration=4,transition='editorial wipe between actual app captures'))
card('title',['UNSEEN Singapore'],'The engineering beneath a nation.',3,O/'frames/dtss-flow.png')
raw('dtss',0.7,5,'01 / DTSS','Inside the deep tunnel.',True,filename='fly-dtss')
raw('mrt',0.7,4,'02 / MRT','Beneath a living city.',True,filename='fly-mrt')
raw('tuas-orbit',0.7,4,'03 / TUAS PORT','A waterfront, engineered.',True,filename='fly-tuas')
raw('barrage-final',2.5,6,'ENGINEERING STORIES','Change the conditions. Watch the system respond.',filename='story-barrage')
raw('tekong',6,4,'ENGINEERING STORIES','Follow the water through the polder.',filename='story-tekong')
card('astra',['Built using','GPT-6 Astra'],'Research. Authoring. Code. Iteration.',2,O/'frames/build-proof-final.png')
proof=T/'actual-build.mp4';run(['ffmpeg','-y','-ss','0.5','-i',str(T/'build-live.webm'),'-t','6','-r','30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-video_track_timescale','15360',str(proof)]);parts.append(proof);manifest.append(dict(source='actual isolated Blender process, CLI recording',duration=6))
raw('tuas-motion',0.5,4,'FLOAT. PLACE. RETAIN.','Tuas Port · Caisson placement',True,filename='product-tuas')
raw('tekong',1,4,'LAND BELOW THE SEA','Pulau Tekong · Inside the dike',True,filename='product-tekong')
raw('return-map',2,4,'ONE CONNECTED WORLD','Five detailed journeys. Nine exhibits.',filename='product-map')
card('challenge',['One engineer.','One frontier AI model.','How much can we build?'],'',5,O/'frames/overview.png')
card('explore',['Explore','UNSEEN Singapore'],'unseen-singapore.darrylkai.chatgpt.site',5,O/'frames/overview.png')
ls=T/'master.txt';ls.write_text('\n'.join("file '"+str(p)+"'" for p in parts));run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(ls),'-c','copy','-movflags','+faststart',str(T/'picture.mp4')]);(T/'edit-manifest.json').write_text(json.dumps(manifest,indent=2));print('60-second picture edit complete')
