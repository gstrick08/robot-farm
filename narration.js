import { NARRATION_CLIPS } from './narration-clips.js';
const tokens = text => [...text.matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)].map(m=>({word:m[0].replaceAll('’',"'").toLowerCase(),start:m.index,end:m.index+m[0].length}));
const clips = NARRATION_CLIPS.map(clip=>({...clip,words:tokens(clip.text).map(t=>t.word)})).sort((a,b)=>b.words.length-a.words.length);
export function narrationPlan(text) {
  const words=tokens(text),plan=[];let start=0,i=0;
  while(i<words.length){
    const clip=clips.find(c=>c.words.every((w,n)=>words[i+n]?.word===w));
    if(!clip){i++;continue;}
    if(words[i].start>start){const fallback=text.slice(start,words[i].start).trim();if(/[\p{L}\p{N}]/u.test(fallback))plan.push({text:fallback});}
    plan.push({text:clip.text,file:clip.file,duration:clip.duration});i+=clip.words.length;start=words[i-1].end;
  }
  const fallback=text.slice(start).trim();if(/[\p{L}\p{N}]/u.test(fallback))plan.push({text:fallback});
  return plan.length?plan:[{text}];
}
export function createNarrator(audio = new Audio()) {
  let finish=null;
  audio.preload='auto';audio.preservesPitch=true;
  const stop=()=>{audio.pause();finish?.(false);};
  return {stop,play(clip,rate){
    stop();
    console.debug('🎙️ Helena', clip.file);
    return new Promise(resolve=>{
      let done=false,timer;
      const fin=ok=>{if(done)return;done=true;clearTimeout(timer);audio.onended=audio.onerror=null;audio.pause();finish=null;resolve(ok);};
      finish=fin;audio.onended=()=>fin(true);audio.onerror=()=>fin(false);
      audio.src=clip.file;audio.playbackRate=Math.max(.65,Math.min(1.2,rate/.95));
      timer=setTimeout(()=>fin(false),10000+clip.duration*1000/audio.playbackRate);
      try{Promise.resolve(audio.play()).catch(()=>fin(false));}catch{fin(false);}
    });
  }};
}
