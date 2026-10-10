import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {rankVoices,speechRate} from '../presentation.js';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const extract=n=>html.match(new RegExp(`function ${n}\\([^]*?\\n\\}`))[0];
let voices=[{name:'Fred',lang:'en-US',voiceURI:'fred',localService:true},{name:'Samantha',lang:'en-US',voiceURI:'sam',localService:true}], spoken, canceled=0;
const timers=new Map();let nextTimer=0;
const c=vm.createContext({rankVoices,speechRate,S:{settings:{voice:'',rate:.85}},FAST:false,console:{debug(){}},sound:{speech(){}},
 $:()=>({classList:{add(){},remove(){}}}),SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},
 synth:{getVoices:()=>voices,cancel(){canceled++;},speak(u){spoken=u;},speaking:true},
 setTimeout(fn){timers.set(++nextTimer,fn);return nextTimer;},clearTimeout(id){timers.delete(id);}
});
vm.runInContext(`let voice=null,talkId=0,currentSpeech=Promise.resolve();${extract('pickVoice')}\n${extract('say')}`,c);
let p=c.say('Find the word. tractor.');assert.equal(spoken.voice.voiceURI,'sam');assert.equal(spoken.rate,.85);assert.equal(spoken.pitch,1);spoken.onend();await p;
p=c.say('Voice preview','sam',1.05);assert.equal(spoken.rate,1.05,'preview uses unsaved slider value');spoken.onend();await p;
voices.push({name:'Ava',lang:'en-US',voiceURI:'ava-premium',localService:true});p=c.say('Hello');assert.equal(spoken.voice.voiceURI,'ava-premium','late-loaded premium voice is selected');spoken.onend();await p;
c.S.settings.voice='sam';p=c.say('Hello');assert.equal(spoken.voice.voiceURI,'sam','parent selection persists');spoken.onend();await p;
c.S.settings.rate=NaN;p=c.say('Hello');assert.equal(spoken.rate,.95);const before=canceled;[...timers.values()][0]();await p;assert.equal(canceled,before+1,'stuck speech is canceled before unlock');
assert.match(html,/say\('Hi! I am your robot[^]*?\+\$\('#setRate'\)\.value/);
console.log('Speech selection, saved/preview speed, late voices and stuck-speech recovery passed ✔');
