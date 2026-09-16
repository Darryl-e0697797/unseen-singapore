from pathlib import Path
import subprocess,json
R=Path(__file__).resolve().parents[2];O=R/'docs/showcase';T=O/'teaser';A=T/'audio';cues=json.loads((A/'timing.json').read_text());log=open(T/'audio-mix.log','w')
def run(a):subprocess.run(a,check=True,stdout=log,stderr=log)
for c in cues:run(['ffmpeg','-y','-i',c['file'],'-af','highpass=f=75,loudnorm=I=-19:TP=-2:LRA=7','-ar','48000',str(A/f"{c['index']}.wav")])
args=['ffmpeg','-y'];filters=[]
for c in cues:args+=['-i',str(A/f"{c['index']}.wav")];filters.append(f"[{c['index']}:a]adelay={round(c['start']*1000)}:all=1[a{c['index']}]")
filters+=[''.join(f"[a{c['index']}]" for c in cues)+f'amix=inputs={len(cues)}:normalize=0,apad,atrim=duration=60[voice]'];args+=['-filter_complex',';'.join(filters),'-map','[voice]','-ar','48000',str(A/'voice.wav')];run(args)
run(['ffmpeg','-y','-i',str(A/'voice.wav'),'-i',str(O/'UNSEEN-background-score.wav'),'-filter_complex','[0:a]aformat=channel_layouts=stereo,asplit=2[v][key];[1:a]atempo=1.366666667,volume=0.75[bed];[bed][key]sidechaincompress=threshold=0.018:ratio=8:attack=15:release=350[duck];[v][duck]amix=inputs=2:normalize=0,loudnorm=I=-18:TP=-2:LRA=7,atrim=duration=60[m]','-map','[m]','-ar','48000',str(A/'mix.wav')])
run(['ffmpeg','-y','-i',str(T/'picture.mp4'),'-i',str(A/'mix.wav'),'-map','0:v','-map','1:a','-t','60','-c:v','copy','-c:a','aac','-b:a','192k','-movflags','+faststart',str(O/'UNSEEN-Singapore-reveal-first-60s.mp4')])
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
(O/'UNSEEN-reveal-first-voiceover.srt').write_text('\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}\n" for i,c in enumerate(cues)))
(T/'voiceover.md').write_text('# Synthetic voiceover — Daniel\n\n'+'\n\n'.join(f"{c['start']:.1f}s — {c['text']}" for c in cues));print('Finished 60-second reveal-first showcase')
