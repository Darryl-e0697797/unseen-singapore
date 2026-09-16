"""Original instrumental score for the UNSEEN showcase. No samples or external music."""
from pathlib import Path
import numpy as np
import wave
def bandnoise(noise,lo,hi):
 f=np.fft.rfftfreq(len(noise),1/48000);mask=np.clip((f-lo)/300,0,1)*np.clip((hi-f)/500,0,1)
 return np.fft.irfft(np.fft.rfft(noise)*mask,n=len(noise))
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/showcase';SR=48000;DURATION=82
rng=np.random.default_rng(6026);mix=np.zeros((int(SR*DURATION),2),dtype=np.float32)
beat=60/88;bar=beat*4
hz=lambda midi:440*2**((midi-69)/12)
def add(signal,start,amp=1,pan=0):
 a=round(start*SR);b=min(len(mix),a+len(signal))
 if a<0 or b<=a:return
 gains=np.sqrt([(1-pan)/2,(1+pan)/2]);mix[a:b]+=np.asarray(signal[:b-a,None]*gains*amp,dtype=np.float32)
def tone(midi,dur,kind='pad'):
 t=np.arange(int(dur*SR))/SR;f=hz(midi)
 if kind=='pad':
  sig=(np.sin(2*np.pi*f*t)+.32*np.sin(2*np.pi*f*1.0018*t+.4)+.15*np.sin(4*np.pi*f*t))/1.47
  env=np.minimum(t/1.0,1)*np.minimum((dur-t)/1.5,1)*(.92+.08*np.sin(2*np.pi*.15*t))
 elif kind=='pluck':
  sig=np.sin(2*np.pi*f*t+1.3*np.exp(-t*4)*np.sin(2*np.pi*f*2*t))+.12*np.sin(2*np.pi*f*3*t)*np.exp(-t*5)
  env=(1-np.exp(-t*90))*np.exp(-t*2.5)*np.minimum((dur-t)/.1,1)
 else:
  sig=np.sin(2*np.pi*f*t)+.18*np.sin(4*np.pi*f*t);env=(1-np.exp(-t*30))*np.exp(-t*.8)*np.minimum((dur-t)/.2,1)
 return sig*env
# 15 two-bar phrases at 88 BPM, resolving onto D minor.
chords=[(38,[50,57,60,64,65]),(34,[50,53,57,62]),(41,[48,52,57,60]),(36,[48,55,62,64]),
        (38,[50,57,60,64,65]),(34,[50,53,57,62]),(41,[48,52,57,60]),(36,[48,55,62,64]),
        (31,[50,55,58,62]),(34,[50,53,57,62]),(41,[48,52,57,60]),(36,[48,55,62,64]),
        (34,[50,53,57,62]),(36,[48,55,62,64]),(38,[50,57,60,64,65])]
for phrase,(bass,notes) in enumerate(chords):
 start=phrase*2*bar
 for j,note in enumerate(notes):add(tone(note,2*bar+1.5),start,.035,(-.65+j*.3))
 for k in range(4):add(tone(bass,1.6,'bass'),start+k*2*beat,.07,0)
 if 1<=phrase<=13:
  pattern=[0,2,1,3,2,1,3,2]
  for k in range(16):
   note=notes[pattern[k%8]]+12
   strength=.038 if k%4==0 else .025
   pos=start+k*beat*.5
   sig=tone(note,2.2,'pluck');pan=(-.3 if k%2==0 else .3)
   add(sig,pos,strength,pan);add(sig,pos+beat*.75,strength*.22,-pan);add(sig,pos+beat*1.5,strength*.09,pan)
# Soft pulse, absent in introduction and ending.
for b in range(4,27):
 start=b*bar
 for k in [0,2]:
  t=np.arange(int(.35*SR))/SR
  sig=np.sin(2*np.pi*(49*t+28*.025*(1-np.exp(-t/.025))))*np.exp(-t*16)*(1-np.exp(-t*350))
  add(sig,start+k*beat,.085)
 for k in [1,3]:
  t=np.arange(int(.13*SR))/SR;noise=rng.normal(0,1,len(t));noise=bandnoise(noise,800,4200)
  add(noise*np.exp(-t*38)*(1-np.exp(-t*450)),start+k*beat,.013,.15)
 for k in range(8):
  t=np.arange(int(.055*SR))/SR;noise=rng.normal(0,1,len(t));noise=bandnoise(noise,7500,16000)
  add(noise*np.exp(-t*95)*(1-np.exp(-t*700)),start+(k+.5)*beat*.5,.008 if k%2 else .006,(-.4 if k%2 else .4))
# Sparse long echoes provide space without obscuring the main pattern.
dry=mix.copy()
for delay,amount in [(0.113,.12),(.197,.09),(.307,.07),(.443,.045)]:
 n=round(delay*SR);mix[n:]+=dry[:-n,::-1]*amount
fade=np.minimum(np.arange(len(mix))/SR/3,1)*np.clip((DURATION-np.arange(len(mix))/SR)/5,0,1)
mix*=fade[:,None];mix*=.72/max(float(np.max(np.abs(mix))),1e-8)
with wave.open(str(OUT/'UNSEEN-original-score.wav'),'wb') as wav:
 wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(SR);wav.writeframes(np.int16(np.clip(mix,-1,1)*32767).tobytes())
print('Original 82-second stereo score rendered: 88 BPM, D minor, no external samples.')
