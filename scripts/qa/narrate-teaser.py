from pathlib import Path
import json,subprocess
R=Path(__file__).resolve().parents[2];T=R/'docs/showcase/teaser';A=T/'audio';A.mkdir(exist_ok=True)
cues=[(.2,3.6,'Look beneath Singapore.'),(4.1,6.9,'Unseen Singapore.'),(7.4,12.7,'Explore tunnels, ports, and the systems that keep the city working.'),(13.3,19.6,'Go inside the construction. Follow how the pieces work together.'),(20.3,29.4,'Change the tide. Trace the water. Discover why each structure exists.'),(30.1,32.8,'Built using GPT six Astra.'),(33,37.8,"This is a real Blender rebuild, running from the project's code."),(38.4,44.6,'Five detailed journeys. Public sources. An interactive world you can explore.'),(50.15,54.85,'One engineer. One frontier AI model. How much can we build?'),(55.3,59.2,'Explore Unseen Singapore.')]
result=[]
for i,(start,end,text) in enumerate(cues):
 f=A/f'{i}.txt';f.write_text(text);a=A/f'{i}.aiff';rate=155
 while True:
  subprocess.run(['say','-v','Daniel','-r',str(rate),'-f',str(f),'-o',str(a)],check=True)
  dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(a)]))
  if dur<=end-start:break
  rate+=5
  if rate>190:raise RuntimeError('Narration too long')
 result.append(dict(index=i,start=start,end=start+dur,text=text,rate=rate,file=str(a)))
 print(i,round(dur,2),rate,flush=True)
(A/'timing.json').write_text(json.dumps(result,indent=2))
