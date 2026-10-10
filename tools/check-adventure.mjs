import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {farmWorld} from '../adventure-world.js';
import {ROADS,newDrive,driveStep} from '../drive-math.js';
let fills=0,disconnects=0;
const context=new Proxy({}, {get(target,key){if(key in target)return target[key];if(key==='createLinearGradient'||key==='createRadialGradient')return ()=>({addColorStop(){}});return (...args)=>{for(const a of args)if(typeof a==='number')assert.ok(Number.isFinite(a),'finite canvas coordinates');if(key==='fill')fills++;};}});
globalThis.ResizeObserver=class{constructor(fn){this.fn=fn;}observe(){this.fn();}disconnect(){disconnects++;}};
globalThis.devicePixelRatio=3;
for(const [width,height] of [[0,0],[320,135],[393,500],[768,640],[1024,600],[1180,820]]) {
 const canvas={getContext:()=>context,getBoundingClientRect:()=>({width,height})},world=farmWorld(canvas);
 assert.equal(canvas.width,width*2,'pixel density capped for mobile');
 for(const road of ROADS){world.setView('drive',road);const state=newDrive(road),before=structuredClone(state);world.drive(state,true);assert.deepEqual(state,before,'art cannot mutate physics');
 const idle=fills;world.drive(state,true);assert.equal(fills,idle,'stationary scene does not redraw');
 for(let i=0;i<120;i++)driveStep(state,{right:true},1/60,road);world.drive(state,false);assert.notEqual(state.angle,state.trailerAngle,'trailer articulation exercised');}
 world.setView('hub');world.destroy();
}
assert.equal(disconnects,6);assert.ok(fills>1000);
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const praise=html.match(/function answerPraise\([^]*?\n\}/)[0];
const ctx=vm.createContext({pick:a=>a,L:{isLetterKey:k=>k.startsWith('L:')}});vm.runInContext(praise,ctx);
assert.ok(!ctx.answerPraise('L:A','gold',1000,false).includes('You read that word!'),'letter praise never calls it a word');
assert.ok(!ctx.answerPraise('W:like','gold',1000,false).includes('You fixed it!'),'first tries never imply a mistake');
assert.deepEqual([...ctx.answerPraise('W:like','silver',1000,false)],['You kept trying!','You figured it out!','You fixed it!']);
assert.ok(ctx.answerPraise('W:like','gold',5000,true).includes('You took your time!'));
assert.ok(!ctx.answerPraise('W:like','gold',1000,false).includes('You remembered that one!'));
console.log('Adventure: all roads, finite artwork, independent trailer, idle rendering and contextual praise passed ✔');
