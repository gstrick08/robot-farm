import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {narrationPlan} from '../narration.js';
import {rankVoices,speechRate} from '../presentation.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const extract=n=>html.match(new RegExp(`function ${n}\\([^]*?\\n\\}`))[0];
let voices=[{name:'Fred',lang:'en-US',voiceURI:'fred',localService:true},{name:'Samantha',lang:'en-US',voiceURI:'sam',localService:true}], spoken, canceled=0;
const timers=new Map();let nextTimer=0;
let clipsPlayed=[],clipOK=true;
const c=vm.createContext({narrationPlan,narrator:{stop(){},async play(part){clipsPlayed.push(part);return clipOK;}},rankVoices,speechRate,S:{settings:{voice:'',rate:.85}},FAST:false,console:{debug(){}},sound:{speech(){}},
 $:()=>({classList:{add(){},remove(){}}}),SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},
 synth:{getVoices:()=>voices,cancel(){canceled++;},speak(u){spoken=u;},speaking:true},
 setTimeout(fn){timers.set(++nextTimer,fn);return nextTimer;},clearTimeout(id){timers.delete(id);}
});
vm.runInContext(`let voice=null,talkId=0,currentSpeech=Promise.resolve(),finishSpeech,cancelDevice;${['pickVoice','stopSpeech','deviceSpeech','say'].map(extract).join('\n')}`,c);
let p=c.say('Find the word. tractor.');assert.equal(spoken.voice.voiceURI,'sam');assert.equal(spoken.rate,.85);assert.equal(spoken.pitch,1);spoken.onend();await p;
p=c.say('Voice preview','sam',1.05);assert.equal(spoken.rate,1.05,'preview uses unsaved slider value');spoken.onend();await p;
voices.push({name:'Ava',lang:'en-US',voiceURI:'ava-premium',localService:true});p=c.say('Hello');assert.equal(spoken.voice.voiceURI,'ava-premium','late-loaded premium voice is selected');spoken.onend();await p;
c.S.settings.voice='sam';p=c.say('Hello');assert.equal(spoken.voice.voiceURI,'sam','parent selection persists');spoken.onend();await p;
c.S.settings.rate=NaN;p=c.say('Hello');assert.equal(spoken.rate,.95);const before=canceled;[...timers.values()][0]();await p;assert.equal(canceled,before+1,'stuck speech is canceled before unlock');
assert.match(html,/say\('Hi! I am your robot[^]*?\+\$\('#setRate'\)\.value/);
console.log('Speech selection, saved/preview speed, late voices and stuck-speech recovery passed ✔');

c.S.settings.voice='';p=c.say('You got it!');await p;assert.equal(clipsPlayed.at(-1).text,'You got it!');
clipOK=false;p=c.say('You got it!');await new Promise(setImmediate);assert.equal(spoken.text,'You got it!');spoken.onend();await p;
p=c.say('Unknown first prompt');const p2=c.say('Unknown second prompt');await p;spoken.onend();await p2;
console.log('Recorded narration, missing-clip fallback and interrupted device speech release prompts ✔');

let release;clipOK=true;c.narrator.play=()=>new Promise(r=>release=r);
p=c.say('You got it!');let finished=false;p.then(()=>finished=true);await new Promise(setImmediate);assert.equal(finished,false,'answer flow waits for recording end');release(true);await p;
p=c.say('You got it!');c.stopSpeech();await p;release(false);
console.log('Answer flow waits for recorded completion and releases on screen exit ✔');
