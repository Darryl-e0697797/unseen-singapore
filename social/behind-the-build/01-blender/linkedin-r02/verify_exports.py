from pathlib import Path
import subprocess,json
B=Path(__file__).resolve().parent
results={}
for fmt,dims in [('4x5',(1080,1350)),('16x9',(1920,1080))]:
 p=B/f'final_{fmt}.mp4'
 subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],check=True)
 r=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=codec_name,width,height,pix_fmt,r_frame_rate,nb_frames:format=duration,size','-of','json',str(p)]))
 v=r['streams'][0];assert (v['width'],v['height'])==dims
 assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p' and v['r_frame_rate']=='30/1'
 assert v['nb_frames']=='1350' and float(r['format']['duration'])==45
 assert len(r['streams'])==1,'This draft is intentionally silent'
 results[fmt]=r
 for t in [1,5,10,14,18,23,28,34,38,42]:
  subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',str(p),'-frames:v','1',str(B/'edit'/f'check-{fmt}-{t}.jpg')],check=True)
(B/'QA-metadata.json').write_text(json.dumps(results,indent=2))
manifest=json.loads((B/'edit-manifest.json').read_text());t=0;cues=[]
for i,m in enumerate(manifest):
 start=t;t+=m['duration']
 lines=[m['title'].replace('\n',' '),m['kicker'],m['origin'],'Schematic · Not a survey model']
 if m['name']=='assembly': lines+=['Modelling order · Not construction sequence']
 if m['name']=='end': lines+=['Explore UNSEEN Singapore','unseen-singapore.darrylkai.chatgpt.site','Explore the engineering.']
 cues.append(f'{i+1}\n00:00:{start:02},000 --> 00:00:{t:02},000\n'+'\n'.join(lines)+'\n')
(B/'onscreen_text.srt').write_text('\n'.join(cues))
print('Both complete exports passed decode, size, duration, codec, pixel-format and frame-count checks.')
