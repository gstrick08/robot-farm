// Original artwork. Drawing never reads or writes learning progress.
import { ROADS } from './drive-math.js';
export function farmWorld(canvas) {
 const ctx=canvas.getContext('2d');let W=1,H=1,S=1,CX=0,CY=0,view='hub',vehicle=null,route=ROADS[0];
 const project=(x,y,z=0)=>[CX+(x-y)*.8*S,CY+(x+y)*.4*S-z*S];
 function path(points,fill,stroke=null,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
 function line(points,color,width){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
 function gradient(a,b,colors){const g=ctx.createLinearGradient(...a,...b);colors.forEach((c,i)=>g.addColorStop(i/(colors.length-1),c));return g;}
 function ellipse(x,y,z,rx,ry,color){const [a,b]=project(x,y,z);ctx.beginPath();ctx.ellipse(a,b,rx*S,ry*S,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
 function polygon(points,z,color){path(points.map(([x,y])=>project(x,y,z)),color);}
 function box(x,y,z,w,d,h,colors,angle=0){
  const c=Math.cos(angle),s=Math.sin(angle),p=(a,b,k)=>project(x+a*c-b*s,y+a*s+b*c,z+k);
  const top=[p(-w/2,-d/2,h),p(w/2,-d/2,h),p(w/2,d/2,h),p(-w/2,d/2,h)];
  const foot=[p(-w/2,-d/2,0),p(w/2,-d/2,0),p(w/2,d/2,0),p(-w/2,d/2,0)];
  const [light,front,side]=colors;
  path([top[1],top[2],foot[2],foot[1]],gradient(top[1],foot[2],[side,front]));
  path([top[2],top[3],foot[3],foot[2]],gradient(top[3],foot[2],[front,side]));
  path(top,gradient(top[0],top[2],[light,front]));line([top[3],top[0],top[1]],'#ffffff70',Math.max(1,1.4*S));
 }
 function ball(x,y,z,r,colors){const [a,b]=project(x,y,z);const g=ctx.createRadialGradient(a-r*S*.4,b-r*S*.45,r*S*.1,a,b,r*S);g.addColorStop(0,colors[0]);g.addColorStop(.5,colors[1]);g.addColorStop(1,colors[2]);ctx.beginPath();ctx.arc(a,b,r*S,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();}
 function cylinder(x,y,z,r,h,colors){const [a,b]=project(x,y,z+h),[c,d]=project(x,y,z);ctx.fillStyle=gradient([a-r*S,b],[a+r*S,b],colors);ctx.beginPath();ctx.ellipse(c,d,r*S,r*S*.42,0,0,Math.PI);ctx.lineTo(a-r*S,b);ctx.ellipse(a,b,r*S,r*S*.42,0,Math.PI,Math.PI*2);ctx.closePath();ctx.fill();ellipse(x,y,z+h,r,r*.42,colors[0]);}
 function tree(x,y,size=1){ellipse(x+12,y+10,1,36*size,17*size,'#234d3529');cylinder(x,y,0,5*size,44*size,['#d6af6b','#a97536','#71572b']);ball(x,y,59*size,35*size,['#cbf48b','#6bb956','#278564']);ball(x-10,y-9,75*size,22*size,['#d5fa90','#75c25a','#3c9963']);}
 function corn(x,y){line([project(x,y,0),project(x,y,30)],'#42975a',3*S);line([project(x-8,y,13),project(x,y,20),project(x+8,y,25)],'#83c94a',4*S);ball(x+3,y,29,4,['#fff7a4','#efc754','#c69b34']);}
 function bot(x,y,z=0,k=1,color=['#abf1e8','#35b8be','#13849d']){
  ellipse(x+3,y+4,z,21*k,9*k,'#0b5a6033');box(x-8*k,y,z,9*k,11*k,11*k,['#b9d7dd','#6699ac','#315e7b']);box(x+8*k,y,z,9*k,11*k,11*k,['#b9d7dd','#6699ac','#315e7b']);
  box(x,y,z+9*k,26*k,20*k,24*k,color);ball(x,y,z+27*k,5*k,['#fff3bc','#f6c847','#e79524']);
  const [a,b]=project(x,y,z+49*k);ctx.fillStyle=gradient([a-22*k*S,b-15*k*S],[a+18*k*S,b+19*k*S],color);ctx.beginPath();ctx.roundRect(a-22*k*S,b-18*k*S,44*k*S,34*k*S,12*k*S);ctx.fill();
  ctx.fillStyle='#163e56';ctx.beginPath();ctx.roundRect(a-17*k*S,b-9*k*S,34*k*S,19*k*S,7*k*S);ctx.fill();
  ctx.fillStyle='#e9ffcd';ctx.beginPath();ctx.roundRect(a-10*k*S,b-4*k*S,5*k*S,9*k*S,3*k*S);ctx.roundRect(a+5*k*S,b-4*k*S,5*k*S,9*k*S,3*k*S);ctx.fill();
  line([[a-3*k*S,b+8*k*S],[a,b+10*k*S],[a+3*k*S,b+8*k*S]],'#b8faf3',1.5*k*S);
  line([project(x,y,z+67*k),project(x,y,z+77*k)],'#477687',3*k*S);ball(x,y,z+79*k,4*k,['#fff2b0','#fac448','#e8a53a']);
  line([[a-13*k*S,b-14*k*S],[a+3*k*S,b-14*k*S]],'#e8ffffa0',2*k*S);
 }
 function wheel(x,y,z,r){const [a,b]=project(x,y,z);const g=gradient([a-r*S,b],[a+r*S,b],['#586778','#172f45','#0f253b']);ctx.beginPath();ctx.ellipse(a,b,r*S*.65,r*S, -.12,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#7993a6';ctx.lineWidth=2*S;ctx.stroke();ctx.beginPath();ctx.ellipse(a-2*S,b-1*S,r*S*.34,r*S*.56,-.12,0,Math.PI*2);ctx.fillStyle=gradient([a-8*S,b-10*S],[a+8*S,b+10*S],['#fff2ad','#e8ac39','#c18b2e']);ctx.fill();}
 function tractor(x,y,angle=0,k=1,loaded=true,towing=true){
  const c=Math.cos(angle),s=Math.sin(angle),pos=(a,b)=>[x+(a*c-b*s)*k,y+(a*s+b*c)*k];
  const part=(a,b,z,w,d,h,palette)=>{const p=pos(a,b);box(...p,z*k,w*k,d*k,h*k,palette,angle);};
  const tire=(a,b,r)=>{const p=pos(a,b);wheel(...p,r*k,r*k);};
  ellipse(x+6,y+8,0,62*k,25*k,'#173f542e');
  tire(-20,-24,22);tire(33,-22,14);
  part(2,0,14,90,40,12,['#d7e6e8','#62889c','#356077']);
  part(22,0,26,48,40,28,['#fcdd75','#f3a74b','#ce7134']);
  part(-20,0,26,33,36,48,['#d1fcf5','#73c6d0','#287999']);
  part(-20,0,70,43,44,7,['#fffce1','#e9eddb','#8dc3be']);
  part(-20,20,37,20,2,27,['#d8fdff','#7fb8d2','#407eaa']);
  part(33,22,36,10,3,11,['#fff5ac','#fff5ac','#eaca56']);
  part(22,-13,52,5,5,27,['#d9e1e4','#5e7789','#284657']);
  tire(-20,25,24);tire(34,24,15);
  if(!towing)return;
  const tp=pos(-97,0);line([project(...pos(-41,0),18*k),project(...pos(-75,0),18*k)],'#738a91',4*k*S);
  drawTrailer(tp[0],tp[1],angle,k,loaded);
 }
 function drawTrailer(x,y,angle,k,loaded){
  const c=Math.cos(angle),s=Math.sin(angle),pos=(a,b)=>[x+(a*c-b*s)*k,y+(a*s+b*c)*k];
  ellipse(x+5,y+6,0,44*k,18*k,'#173f5425');
  const tr=(a,b,z,w,d,h,palette)=>{const [u,v]=pos(a,b);box(u,v,z*k,w*k,d*k,h*k,palette,angle);};
  const tw=(a,b)=>{const p=pos(a,b);wheel(...p,12*k,12*k);};tw(-10,-26);tr(0,0,12,62,49,10,['#ffdc78','#f1b04a','#b77331']);tr(0,-23,22,62,5,24,['#ffe49e','#e9ac46','#b37337']);tr(-29,0,22,5,49,24,['#ffe49e','#e9ac46','#b37337']);
  if(loaded){for(const [a,b] of [[-16,-9],[9,-9],[-16,9],[9,9]]){const [u,v]=pos(a,b);box(u,v,22*k,19*k,16*k,17*k,['#faffad','#bcd45e','#729d4b'],angle);}}
  tr(0,23,22,62,5,24,['#ffe49e','#e9ac46','#b37337']);tw(-10,27);
 }
 function workshop(x,y){ellipse(x+8,y+15,0,92,36,'#254a6422');box(x,y,0,126,86,80,['#fbf7d5','#e3d5a3','#abae8a']);box(x,y,79,145,102,12,['#a2eff1','#3cadba','#247c98']);box(x,y+44,4,64,3,60,['#547b9d','#416483','#27485e']);box(x,y+46,65,68,4,5,['#fbdb71','#fac053','#c9972d']);box(x+49,y+44,28,12,3,25,['#e7fcff','#96dfe5','#3f9aaf']);
  line([project(x-10,y+46,11),project(x-10,y+46,50)],'#91bdc9',3*S);line([project(x+10,y+46,11),project(x+10,y+46,50)],'#91bdc9',3*S);
 }
 function barn(x,y){ellipse(x+13,y+16,0,70,32,'#26476929');box(x,y,0,90,80,65,['#ffdf9c','#e8b877','#b98a51']);const p=[[x-57,y-47],[x+57,y-47],[x+57,y+47],[x-57,y+47]];polygon(p,67,'#278c91');box(x,y+42,3,42,3,43,['#72a1a6','#437480','#214a62']);cylinder(x+80,y-3,0,24,92,['#ecf3df','#93bfbb','#547d8a']);ball(x+80,y-3,93,24,['#ddf5ed','#92c3bd','#638c99']);}
 function popcorn(x,y){ellipse(x+8,y+10,0,64,30,'#254a6424');box(x,y,0,68,60,16,['#e9f6ef','#8bb6b5','#3e758c']);box(x,y,16,62,52,56,['#d3fcf0','#8acec9','#3d9dba']);box(x,y,70,78,66,15,['#fff3b0','#fac459','#d98d34']);box(x,y+28,22,43,3,35,['#f7ffdb','#afe1cf','#6ab9ae']);for(let i=0;i<7;i++)ball(x-20+(i%4)*12,y+27,28+Math.floor(i/4)*14,7,['#fffde2','#fff0a6','#e0cb72']);}
 function road(points,width=44){line(points.map(([x,y])=>project(x,y,1)),'#719868',width*S+9*S);line(points.map(([x,y])=>project(x,y,2)),'#e2ce99',width*S);line(points.map(([x,y])=>project(x,y,2)),'#fff1bd',2*S);}
 function marker(x,y){ellipse(x,y,2,43,18,'#ffffb842');const [a,b]=project(x,y,3);ctx.beginPath();ctx.ellipse(a,b,32*S,13*S,0,0,Math.PI*2);ctx.strokeStyle='#fffa8c';ctx.lineWidth=4*S;ctx.stroke();const [u,v]=project(x,y,53);path([[u,v+12*S],[u-12*S,v-8*S],[u+12*S,v-8*S]],'#fff9ae','#c99b39',S);}
 function render(){
  if(W<=0||H<=0)return;
  ctx.clearRect(0,0,W,H);
  S=Math.min(W/1140,H/710);CX=W*.51;CY=H*.56;
  // Distant islands and soft water reflections give the flat UI a physical world.
  for(let i=0;i<3;i++){const x=W*(.26+i*.29),y=H*(.34+i*.04);ctx.fillStyle='#6cb9c233';ctx.beginPath();ctx.ellipse(x,y,W*.08,H*.025,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#effcf668';ctx.beginPath();ctx.ellipse(x,y-7,W*.06,H*.012,0,0,Math.PI*2);ctx.fill();}
  const rim=[[-400,-280],[345,-280],[430,-185],[430,235],[340,300],[-330,300],[-430,200],[-430,-190]];
  ellipse(0,10,-93,460,168,'#227f9b28');ellipse(0,0,-89,475,175,'#b1f3f530');
  path([...rim.map(([x,y])=>project(x,y,0)),...rim.slice().reverse().map(([x,y])=>project(x,y,-68))],gradient(project(0,0,0),project(0,0,-90),['#83b465','#456c68','#36596d']));
  polygon(rim,-20,'#6b9471');polygon(rim,0,gradient(project(-400,-280),project(430,300),['#dcf7a7','#9bd279','#70b69b']));
  line(rim.concat([rim[0]]).map(([x,y])=>project(x,y,1)),'#edffc47a',4*S);
  for(let i=0;i<24;i++){const x=-340+(i*117)%690,y=-210+(i*73)%450;ellipse(x,y,1,3,1.3,'#ecffb555');}
  polygon([[-355,-190],[-140,-190],[-140,-32],[-355,-32]],2,'#987958');for(let i=0;i<6;i++)for(let j=0;j<6;j++)corn(-336+i*32,-171+j*23);
  const riverBridge=view==='drive'&&route===ROADS[2];
  const river=riverBridge?[[-420,-30],[-180,-40],[50,-25],[420,-35]]:[[282,-220],[315,-140],[300,0],[343,125],[290,245]];
  line(river.map(([x,y])=>project(x,y,1)),'#eefebd',51*S);
  line(river.map(([x,y])=>project(x,y,1)),gradient(project(280,-200),project(340,240),['#84edf2','#40b8df','#368ccc']),43*S);
  if(view==='drive'){
   road(route.points.map(([x,y])=>[(x-410)*1.1,(y-395)*1.1]),106);
  }else{road([[-98,-80],[170,-80],[170,155],[-240,155],[-240,50]],42);}
  const bx=riverBridge?-11:305,by=riverBridge?-30:125;
  box(bx,by,2,136,59,8,['#fff0c2','#d7b784','#9c8458']);for(let i=0;i<8;i++)line([project(bx-60+i*17,by-30,11),project(bx-60+i*17,by+30,11)],'#f6dfb2',3*S);
  const objects=view==='drive'?[
   {sort:-600,draw:()=>barn((route.drop[0]-410)*1.1,(route.drop[1]-395)*1.1-100)},
   {sort:-597,draw:()=>tree(-367,-230,.85)},{sort:110,draw:()=>tree(360,-230,.95)},
   {sort:-70,draw:()=>tree(-340,270,.8)},
  ]:[{sort:-330,draw:()=>barn(20,-177)},{sort:-440,draw:()=>tree(-367,-230,.85)},{sort:-50,draw:()=>tree(350,-190,.95)},{sort:80,draw:()=>tree(-340,270,.8)},{sort:250,draw:()=>popcorn(150,225)},{sort:-140,draw:()=>workshop(-270,95)},{sort:160,draw:()=>bot(125,28,0,.84)},{sort:-190,draw:()=>bot(-205,10,0,.7,['#eee6ff','#ae9ee5','#7776b7'])},{sort:430,draw:()=>bot(275,188,0,.65,['#fff1bb','#edbd50','#cc8c3a'])}];
  if(view==='drive'&&vehicle){
   const x=(vehicle.x-410)*1.1,y=(vehicle.y-395)*1.1,tx=(vehicle.trailerX-410)*1.1,ty=(vehicle.trailerY-395)*1.1;
   line([project(x-Math.cos(vehicle.angle)*38*1.1,y-Math.sin(vehicle.angle)*38*1.1,18),project(tx,ty,18)],'#738a91',4*S);
   objects.push({sort:x+y,draw:()=>tractor(x,y,vehicle.angle,1.1,vehicle.loaded,false)},{sort:tx+ty,draw:()=>drawTrailer(tx,ty,vehicle.trailerAngle,1.1,vehicle.loaded)});
   const target=vehicle.loaded?route.drop:route.pickup;marker((target[0]-410)*1.1,(target[1]-395)*1.1);
  }
  else objects.push({sort:130,draw:()=>tractor(20,110,0,1.13,true)});
  objects.sort((a,b)=>a.sort-b.sort).forEach(o=>o.draw());

 }
 function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);render();}
 const observer=new ResizeObserver(resize);observer.observe(canvas);
 return {setView(value,road=ROADS[0]){view=value;route=road;render();},drive(state,loaded){
  if(vehicle&&vehicle.loaded===loaded&&['x','y','angle','trailerX','trailerY','trailerAngle'].every(k=>vehicle[k]===state[k]))return;
  vehicle={...state,loaded};render();
 },resize,destroy(){observer.disconnect();}};
}
