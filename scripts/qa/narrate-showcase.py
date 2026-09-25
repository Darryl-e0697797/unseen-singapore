"""Generate a timed synthetic narration using macOS's installed Daniel voice."""
from pathlib import Path
import subprocess,json
R=Path(__file__).resolve().parents[2];O=R/'docs/showcase/narration';O.mkdir(exist_ok=True)
segments=[
(0.7,4.7,'What holds Singapore together?'),
(5.4,12.7,'Unseen takes you from the city above into five engineering stories below, and along its shores.'),
(13.4,18.7,'How does used water move beneath a whole city?'),
(19.4,28.7,'The deep tunnel system uses gravity. Explore the boring machine, then the concrete rings and protective lining.'),
(29.3,38.8,'How do you build a waterfront? At Tuas, follow a concrete caisson into position, to help retain reclaimed fill.'),
(39.3,46.8,'How do you tunnel beneath a living city? Watch excavation and lining work together.'),
(47.3,50.8,'How does the barrage respond to rain?'),
(51.0,55.4,'At low tide, gates release excess water.'),
(55.6,60.7,'At high tide, pumps move it to sea.'),
(61.3,74.7,'How can land sit below sea level? At Pulau Tekong, a dike protects the land, while drainage, storage and pumping manage water inside.'),
(75.4,80.8,'Five connected stories. Built with human direction and GPT six Astra.'),
(81.3,87.7,'These are teaching models, with sources inside. Explore Unseen Singapore for yourself.'),
]
results=[]
for i,(start,end,text) in enumerate(segments):
 src=O/f'{i:02}.txt';src.write_text(text);audio=O/f'{i:02}.aiff';rate=155
 while True:
  subprocess.run(['say','-v','Daniel','-r',str(rate),'-f',str(src),'-o',str(audio)],check=True)
  dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(audio)]))
  if dur<=end-start or rate>=178:break
  rate+=5
 if dur>end-start:raise RuntimeError(f'Narration {i} overruns {dur} / {end-start}')
 results.append(dict(index=i,start=start,end=start+dur,slotEnd=end,text=text,rate=rate,file=str(audio)))
 print(i,round(dur,2),'seconds',rate,'wpm',flush=True)
(O/'timing.json').write_text(json.dumps(results,indent=2))
