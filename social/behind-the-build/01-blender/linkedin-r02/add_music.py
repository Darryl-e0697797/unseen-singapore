from pathlib import Path
import subprocess
B=Path(__file__).resolve().parent
ROOT=next(p for p in B.parents if (p/'docs/showcase/UNSEEN-original-score.wav').exists())
for fmt in ['4x5','16x9']:
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(B/f'final_{fmt}.mp4'),'-i',str(ROOT/'docs/showcase/UNSEEN-original-score.wav'),'-filter_complex','[1:a]atrim=duration=45,asetpts=PTS-STARTPTS,loudnorm=I=-23:TP=-2:LRA=7,afade=t=in:st=0:d=1,afade=t=out:st=41.5:d=3.5[a]','-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t','45','-movflags','+faststart',str(B/f'final_{fmt}_music.mp4')],check=True)
