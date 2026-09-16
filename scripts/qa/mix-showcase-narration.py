from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess,json
R=Path(__file__).resolve().parents[2];O=R/'docs/showcase';N=O/'narration';timings=json.loads((N/'timing.json').read_text());duration=88
log=open(N/'mix.log','w')
def run(a):subprocess.run(a,check=True,stdout=log,stderr=log)
# Normalise the narrator consistently, then place clips on the actual edit timeline.
for seg in timings:
 out=N/f"{seg['index']:02}.wav"
 run(['ffmpeg','-y','-i',seg['file'],'-af','highpass=f=75,loudnorm=I=-19:TP=-2:LRA=7','-ar','48000',str(out)])
args=['ffmpeg','-y'];filters=[]
for s in timings:args+=['-i',str(N/f"{s['index']:02}.wav")]
for s in timings:filters.append(f"[{s['index']}:a]adelay={round(s['start']*1000)}:all=1[a{s['index']}]")
filters.append(''.join(f"[a{s['index']}]" for s in timings)+f'amix=inputs={len(timings)}:normalize=0,apad,atrim=duration=88[voice]')
args+=['-filter_complex',';'.join(filters),'-map','[voice]','-ar','48000',str(N/'voice-track.wav')];run(args)
# Stretch only the music to the new runtime; sidechain ducking follows the voice.
run(['ffmpeg','-y','-i',str(N/'voice-track.wav'),'-i',str(O/'UNSEEN-background-score.wav'),'-filter_complex','[0:a]aformat=channel_layouts=stereo,asplit=2[voice][key];[1:a]atempo=0.93181818,volume=0.63[bed];[bed][key]sidechaincompress=threshold=0.018:ratio=8:attack=15:release=450[ducked];[voice][ducked]amix=inputs=2:normalize=0,loudnorm=I=-18:TP=-1.5:LRA=7,atrim=duration=88[mix]','-map','[mix]','-ar','48000',str(N/'final-mix.wav')])
# Burn speech captions into the existing footer, preserving the map attribution above it.
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',27);small=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',20)
labels=['','THE ATLAS','01 / DTSS','01 / DTSS','02 / TUAS PORT','03 / MRT','04 / BARRAGE','04 / BARRAGE','04 / BARRAGE','05 / TEKONG','SINGAPORE','']
inputs=['ffmpeg','-y','-i',str(O/'UNSEEN-narrated-picture.mp4'),'-i',str(N/'final-mix.wav')];fil=[];last='0:v'
for k,seg in enumerate(timings[1:11]):
 idx=seg['index'];image=Image.new('RGBA',(1920,1080));draw=ImageDraw.Draw(image);draw.rectangle((0,980,1920,1080),fill='#102e34');draw.rectangle((36,998,40,1060),fill='#d5b875');draw.text((62,1003),labels[idx],font=small,fill='#d5b875')
 lines=[];line=''
 for word in seg['text'].split():
  trial=(line+' '+word).strip()
  if draw.textlength(trial,font=font)>1390:lines.append(line);line=word
  else:line=trial
 lines.append(line)
 if len(lines)>2:raise RuntimeError(f'Caption too tall: {idx}')
 for j,line in enumerate(lines):draw.text((390,997+j*36),line,font=font,fill='#f0f0e4')
 png=N/f'caption-{idx}.png';image.save(png);inputs+=['-loop','1','-i',str(png)]
 end=timings[idx+1]['start']-.05
 fil.append(f"[{last}][{k+2}:v]overlay=0:0:enable='between(t,{seg['start']},{end})'[v{k}]");last=f'v{k}'
inputs+=['-filter_complex',';'.join(fil),'-map',f'[{last}]','-map','1:a','-t','88','-r','30','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',str(O/'UNSEEN-Singapore-narrated-showcase.mp4')];run(inputs)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(O/'UNSEEN-Singapore-voiceover.srt').write_text('\n'.join(f"{i+1}\n{stamp(s['start'])} --> {stamp(s['end'])}\n{s['text']}\n" for i,s in enumerate(timings)))
(O/'Voiceover-script.md').write_text('# Voiceover transcript\n\nSynthetic narration: macOS Daniel, 155 words/minute unless timing.json records an adjustment.\n\n'+'\n\n'.join(f"**{s['start']:.1f}s** — {s['text']}" for s in timings))
print('Narrated showcase rendered: 88 seconds.')
