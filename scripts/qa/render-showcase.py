"""Edit actual timestamped browser captures; retain original frames as evidence."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, subprocess, os
NARRATED=os.environ.get("UNSEEN_NARRATED")=="1"
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'docs/showcase'; RAW=OUT/'raw'; EDIT=OUT/('edit-narrated' if NARRATED else 'edit'); EDIT.mkdir(exist_ok=True)
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'; SERIF='/System/Library/Fonts/Supplemental/Georgia.ttf'
def font(n,serif=False): return ImageFont.truetype(SERIF if serif else FONT,n)
def run(args): subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=open(OUT/'render.log','a'))
def caption(name,title,detail,n):
 im=Image.new('RGBA',(1920,1080)); d=ImageDraw.Draw(im); d.rectangle((0,980,1920,1080),fill='#102e34'); d.rectangle((36,998,40,1060),fill='#d5b875'); d.text((62,1003),name,font=font(20),fill='#d5b875'); d.text((390,996),title,font=font(30),fill='#f0f0e4'); d.text((390,1040),detail,font=font(19),fill='#b7cec5');
 for i in range(5):d.rectangle((1690+i*38,1010,1718+i*38,1013),fill='#d5b875' if i<n else '#416067')
 p=EDIT/(name.replace(' / ','-').replace(' ','-')+'.png');im.save(p);return p
clips=[]; manifest=[]
def clip(name,duration,title,detail,n,start=0):
 data=json.loads((RAW/name/'frames.json').read_text()); fs=data['frames']; chosen=[]
 for f in fs:
  if not chosen or f['timestamp']-chosen[-1]['timestamp']>=1/32:chosen.append(f)
 lines=['ffconcat version 1.0']
 for i,f in enumerate(chosen):
  end=chosen[i+1]['timestamp'] if i+1<len(chosen) else data['ended']
  lines.extend(["file '"+str(RAW/name/f['file'])+"'",f"duration {max(1/120,end-f['timestamp']):.6f}"])
 lines.append("file '"+str(RAW/name/chosen[-1]['file'])+"'")
 listing=EDIT/(name+'.ffconcat');listing.write_text('\n'.join(lines)+'\n')
 labels={'overview-final':'THE ATLAS','dtss-entry':'01 / DTSS','dtss':'01 / DTSS','tuas-motion':'02 / TUAS PORT','mrt':'03 / MRT','barrage-final':'04 / BARRAGE','tekong':'05 / TEKONG','return-map':'SINGAPORE'}; overlay=caption(labels.get(name,name.upper()),title,detail,n); dest=EDIT/(name+'.mp4')
 run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(listing),'-loop','1','-i',str(overlay),'-filter_complex',f'[0:v]trim=start={start}:duration={duration},setpts=PTS-STARTPTS,fps=30[v];[v][1:v]overlay=0:0,fade=t=in:st=0:d=0.2,fade=t=out:st={duration-.2}:d=0.2[out]','-map','[out]','-t',str(duration),'-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(dest)])
 clips.append(dest); manifest.append(dict(clip=name,duration=duration,title=title,detail=detail,source='actual browser frames',capture=data['tabUrl'],rawFrames=len(fs)))
def card(name,lines,kicker,footer,bg,duration):
 im=Image.open(bg).convert('RGB').crop((312,86,1920,977)).resize((1920,1080)); shade=Image.new('RGBA',im.size); sd=ImageDraw.Draw(shade)
 for x in range(1920): sd.line((x,0,x,1080),fill=(6,27,32,int(235-90*x/1920)))
 im=Image.alpha_composite(im.convert('RGBA'),shade);d=ImageDraw.Draw(im)
 d.text((110,100),'UNSEEN / SINGAPORE',font=font(28),fill='#d5b875');d.line((110,165,1810,165),fill='#77958a',width=1)
 d.text((110,235),kicker,font=font(22),fill='#b8ccc0')
 for i,line in enumerate(lines): d.text((105,300+i*125),line,font=font(106,True),fill='#f0efe3')
 d.text((110,845),footer,font=font(30),fill='#f0efe3');d.text((110,960),'HUMAN-DIRECTED  /  BUILT WITH GPT-6 ASTRA',font=font(20),fill='#b8ccc0')
 if name=='ending': d.text((110,904),'github.com/Darryl-e0697797/unseen-singapore',font=font(27),fill='#d5b875')
 d.text((110,1016),'Map: OneMap / SLA · OpenStreetMap contributors · CBD data: ODbL',font=font(16),fill='#b8ccc0')
 png=EDIT/(name+'.png');im.convert('RGB').save(png);dest=EDIT/(name+'.mp4')
 run(['ffmpeg','-y','-loop','1','-i',str(png),'-t',str(duration),'-vf',f'fade=t=in:st=0:d=0.4,fade=t=out:st={duration-.3}:d=0.3','-r','30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p',str(dest)])
 clips.append(dest);manifest.append(dict(clip=name,duration=duration,title=' '.join(lines),detail=footer,source='editorial title over actual app screenshot'))
card('opening',['What holds','Singapore together?'],'LOOK BEYOND THE SKYLINE.','Five engineering stories. One interactive world.',OUT/'frames/overview.png',5)
clip('overview-final',8,'Start with the city. Then look closer.','Nine exhibits · Five detailed construction journeys',0)
clip('dtss-entry',6,'Follow a system beneath Singapore.','DTSS · Geographic context leads into the underground story',1)
clip('dtss',10,'Inside the tunnel: boring, rings and protection.','Numbered components explain their purpose · Illustrative cutaway',1)
clip('tuas-motion',10,'Float. Place. Retain.','Tuas Port · A schematic caisson placement sequence',2)
clip('mrt',8,'Build beneath a living city.','Bore and line the tunnel · Explore its numbered components',3)
clip('barrage-final',14,'The tide changes how excess water leaves.','Marina Barrage · Low-tide gates and high-tide pumping',4)
clip('tekong',14,'Land below sea level needs water management.','Pulau Tekong · Explore the dike, drainage and pumping story',5)
if NARRATED: clip('return-map',6,'Five stories. One connected city.','Human-directed · Built with GPT-6 Astra',5)
card('ending',['Go beneath','the surface.'],'EXPLORE IT YOURSELF.','unseen-singapore.darrylkai.chatgpt.site',OUT/'frames/overview.png',7)
listing=EDIT/'master.txt';listing.write_text('\n'.join("file '"+str(p)+"'" for p in clips))
run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart',str(OUT/('UNSEEN-narrated-picture.mp4' if NARRATED else 'UNSEEN-Singapore-showcase.mp4'))])
(OUT/('narrated-edit-manifest.json' if NARRATED else 'edit-manifest.json')).write_text(json.dumps(manifest,indent=2))
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
t=0;srt=[]
for i,m in enumerate(manifest):
 srt.append(f"{i+1}\n{stamp(t)} --> {stamp(t+m['duration'])}\n{m['title']}\n{m['detail']}\n");t+=m['duration']
(OUT/('UNSEEN-narrated-chapters.srt' if NARRATED else 'UNSEEN-Singapore-captions.srt')).write_text('\n'.join(srt));Image.open(EDIT/'opening.png').save(OUT/'UNSEEN-Singapore-thumbnail.jpg',quality=95)
print(f'Rendered {t}s showcase')
