from pathlib import Path
import math, wave, struct, subprocess, tempfile
O=Path(__file__).resolve().parents[1]/'audio';O.mkdir(exist_ok=True)
temporary=tempfile.TemporaryDirectory(prefix='robotfarm-audio-');T=Path(temporary.name)
SR=22050
def render(name,length,notes):
 a=[0.0]*int(SR*length)
 for start,f,dur,vol in notes:
  for i in range(int(dur*SR)):
   j=int(start*SR)+i
   if j>=len(a):break
   t=i/SR;env=min(1,t/.012)*math.exp(-4*t/dur)*min(1,(dur-t)/.035)
   # Bell-like wooden pluck, harmonics kept soft.
   a[j]+=vol*env*(math.sin(2*math.pi*f*t)+.22*math.sin(2*math.pi*f*2*t)+.09*math.sin(2*math.pi*f*3*t))
 peak=max(abs(x) for x in a) or 1
 scale=min(1,.65/peak)
 with wave.open(str(T/(name+'.wav')),'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(b''.join(struct.pack('<h',int(x*scale*32767)) for x in a))
 subprocess.run(['afconvert',str(T/(name+'.wav')),str(O/(name+'.m4a')),'-f','m4af','-d','aac','-b','48000'],check=True)
cues={'tap':(.12,[(0,650,.10,.12)]),'gold':(.5,[(0,523,.28,.19),(.08,659,.28,.16),(.18,1047,.3,.13)]),'silver':(.35,[(0,523,.24,.11),(.1,659,.24,.09)]),'hmm':(.4,[(0,330,.34,.07),(.08,392,.3,.04)]),'coin':(.3,[(0,988,.18,.1),(.08,1319,.18,.08)]),'harvest':(.35,[(0,392,.16,.16),(.07,784,.25,.13)]),'bag':(.8,[(0,523,.5,.14),(.13,784,.5,.12),(.25,1047,.5,.1)]),'complete':(1.5,[(i*.14,f,.65,.12) for i,f in enumerate([523,659,784,659,1047])]),'rocket':(1.3,[(i*.09,180+i*35,.4,.025) for i in range(9)]),'medal':(1.8,[(i*.2,f,.65,.13) for i,f in enumerate([523,784,1047,784,1319])])}
for name,(length,notes) in cues.items():render(name,length,notes)
# Original eight-bar instrumental loop, 80 bpm; no speech or phonemes.
notes=[];beat=.75;chords=[[261.63,329.63,392],[220,261.63,349.23],[246.94,293.66,392],[220,329.63,440]]
for bar in range(8):
 chord=chords[bar%4];at=bar*4*beat
 for f in chord:notes.append((at,f,2.7,.022))
 for n,f in enumerate([chord[0]*2,chord[1]*2,chord[2]*2,chord[1]*2]):notes.append((at+n*beat,f,.52,.05))
render('farm',24,notes)
temporary.cleanup()
print('Created original instrumental music and ten gentle effect clips.')
