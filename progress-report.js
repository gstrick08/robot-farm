import { emptyUsage, validUsage, duration } from './usage-time.js';
import * as L from './logic.js';
import { focusedLetters } from './preferences.js';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stateOf = it => L.isMastered(it) ? 'mastered' : L.isKnown(it) ? 'known' : it.last ? 'learning' : 'new';
export const REPORT_STATES = {mastered:'Mastered',known:'Known',learning:'Practicing',new:'Not started'};
export function reportData(state, today, prefs, usage) {
  const entry = key => ({text:L.keyText(key),state:stateOf(state.items[key] || L.newItem())});
  const lists = state.lists.slice(0,state.cur+1).map((list,i) => ({number:i+1,words:list.words.map(w=>entry('W:'+w)),passed:list.passed,ready:list.ready}));
  const words = [...new Set(state.lists.slice(0,state.cur+1).flatMap(l=>l.words))].map(w=>entry('W:'+w));
  const letters = L.LETTER_KEYS.map(entry);
  const count = (items,status) => items.filter(x=>x.state===status).length;
  const week = Array.from({length:7},(_,i)=>{
    const day = new Date(today+'T12:00:00');day.setDate(day.getDate()-6+i);
    const date=L.today(day), log=state.log[date];
    const number=n=>Number.isInteger(n)&&n>=0?n:0;
    return {date,label:new Intl.DateTimeFormat('en-US',{weekday:'short'}).format(day),played:!!log,missions:number(log?.m),control:number(log?.c)};
  });
  const time=validUsage(usage)?usage:emptyUsage();
  return {time,timeWeek:week.reduce((sum,d)=>sum+(time.days[d.date]||0),0),name:state.settings.child || 'Your child',date:today,dateLabel:new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date(today+'T12:00:00')),lists,letters,words,
    wordTotal:words.length,wordMastered:count(words,'mastered'),letterKnown:L.LETTER_KEYS.filter(k=>L.isKnown(state.items[k] || L.newItem())).length,letterMastered:count(letters,'mastered'),
    week,days:week.filter(d=>d.played).length,missions:week.reduce((n,d)=>n+d.missions,0),control:week.reduce((n,d)=>n+d.control,0),focus:focusedLetters(prefs).map(L.keyText)};
}
export function reportMarkup(data) {
  const chips=items=>items.map(x=>`<span class="report-chip ${x.state}">${escape(x.text)}<span class="sr-only">: ${REPORT_STATES[x.state]}</span></span>`).join('');
  const legend=Object.entries(REPORT_STATES).map(([state,label])=>`<span><i class="${state}"></i>${label}</span>`).join('');
  const max=Math.max(1,...data.week.map(d=>d.missions+d.control));
  const focus=data.focus.length===52?'Full alphabet · big and little letters':data.focus.join(' · ');
  const visits=sessions=>sessions.map(session=>`<div class="report-session"><div><b>${escape(new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(session.start)))}</b><strong>${duration(session.ms)}</strong></div><p>${session.activities.filter(a=>a.ms>=1000).map(a=>escape(a.label)+' · '+duration(a.ms)).join(' &nbsp; / &nbsp; ') || 'Just getting started'}</p></div>`).join('');
  return `<article class="progress-card" aria-label="Learning progress report">
    <header class="report-hero"><div><p class="report-eyebrow">ROBOT FARM · LEARNING REPORT</p><h1>${escape(data.name)}’s learning journey</h1><p>${escape(data.dateLabel)}</p></div><div class="report-mascot" aria-hidden="true"></div></header>
    <section class="report-section"><h2>A little practice, every day</h2><p class="report-muted">Last 7 days · ${escape(data.week[0].date)} to ${escape(data.date)}</p>
      <div class="report-stats">${[[data.days,'Days played'],[data.missions,'Equipment jobs finished'],[data.control,'Mission Control sessions']].map(([n,label])=>`<div><strong>${n}</strong><span>${label}</span></div>`).join('')}</div>
      <div class="report-week" aria-label="Daily completed jobs and read-aloud sessions">${data.week.map(d=>`<div aria-label="${escape(d.date)}: ${d.missions} jobs and ${d.control} read-aloud sessions"><span class="report-day-count">${d.missions+d.control}</span><div class="report-bar-track"><i style="height:${(d.missions+d.control)/max*100}%"></i></div><span>${d.label}</span></div>`).join('')}</div>
      <p class="report-muted">Each bar counts finished jobs and Mission Control read-aloud sessions.</p>
    </section>
    <section class="report-overview">${[[data.wordMastered,data.wordTotal,'Heart words mastered'],[data.letterKnown,52,'Letters known']].map(([n,total,label])=>`<div><h2>${label}</h2><strong>${n}<small> / ${total}</small></strong><progress value="${n}" max="${Math.max(1,total)}" aria-label="${label}: ${n} of ${total}"></progress></div>`).join('')}</section>
    <section class="report-section"><h2>Time in Robot Farm</h2><div class="report-time-stats"><div><strong>${duration(data.time.totalMs)}</strong><span>Total active time</span></div><div><strong>${duration(data.timeWeek)}</strong><span>Active time · last 7 days</span></div></div><p class="report-muted">${data.time.since?'Tracking since '+escape(data.time.since)+'.':'Time tracking starts with this update.'} Active time includes grown-up screens. Background time and idle periods after one minute are excluded. Earlier play time was not recorded.</p>
      <h3>Recent app sessions</h3>${data.time.sessions.length?`<div class="report-sessions">${visits(data.time.sessions.slice(-5).reverse())}</div>`:'<p class="report-muted">No active time recorded yet. Each app visit appears here after you start using it.</p>'}
      ${data.time.sessions.length>5?`<details class="report-session-history"><summary>View earlier app sessions (${data.time.sessions.length-5})</summary>${visits(data.time.sessions.slice(0,-5).reverse())}</details>`:''}
      <p class="report-muted">A visit starts when the game opens or reloads. The latest 100 visits are kept; lifetime and daily totals are preserved. Shared images show the five most recent visits.</p>
    </section>
    <div class="report-legend" aria-label="Progress key">${legend}</div>
    ${data.lists.map(list=>`<section class="report-section"><div class="report-section-heading"><h2>Heart Words · List ${list.number}</h2><span class="report-list-badge">${list.passed?'Teacher passed':list.ready?'Ready for teacher check':'Growing skills'}</span></div><p class="report-muted">${list.words.filter(w=>w.state==='mastered').length} of ${list.words.length} mastered${list.passed?' · Passed '+escape(list.passed):list.ready?' · Ready since '+escape(list.ready):''}</p><div class="report-chips">${chips(list.words)}</div></section>`).join('')}
    <section class="report-section"><h2>Alphabet progress</h2><p class="report-muted">${data.letterKnown} of 52 known · ${data.letterMastered} mastered. Big and little letters are tracked separately.</p><div class="report-chips report-alphabet">${chips(data.letters.filter(x=>L.isUpper(x.text)))}</div><div class="report-chips report-alphabet">${chips(data.letters.filter(x=>!L.isUpper(x.text)))}</div><p class="report-focus"><b>Current letter focus:</b> ${escape(focus)}</p></section>
    <section class="report-next"><h2>Keep the momentum going</h2><p>Try a short farm job, then read a few familiar words together. Give extra time to the purple “Practicing” items and celebrate the effort.</p></section>
    <footer class="report-footer"><p>Mastered means success on three different days, including an instant read-aloud to a grown-up. Known items are familiar in the game and still get review.</p><p>Saved game practice · not a standardized reading assessment</p></footer>
  </article>`;
}

// A local canvas keeps the shareable card offline and avoids sending children's data to a rendering service.
export function reportImage(data) {
  const canvas=document.createElement('canvas'),probe=canvas.getContext('2d');
  const W=900,pad=48,inner=W-pad*2,ops=[];
  let y=0;
  const color={mastered:['#fff0bc','#745315'],known:['#d8f1e9','#17574e'],learning:['#ece2fa','#694492'],new:['#eff2f3','#52646a']};
  const rect=(x,top,w,h,fill,r=18)=>ops.push(ctx=>{ctx.fillStyle=fill;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,top,w,h,r);else ctx.rect(x,top,w,h);ctx.fill()});
  const text=(value,x,top,size=20,fill='#234b50',weight='400')=>ops.push(ctx=>{ctx.fillStyle=fill;ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.fillText(String(value),x,top)});
  const wrap=(value,x,top,max,size=20,fill='#52646a',weight='400')=>{
    probe.font=`${weight} ${size}px Arial, sans-serif`;let line='',lines=[];
    for(const word of String(value).split(/\s+/)){if(line&&probe.measureText(line+' '+word).width>max){lines.push(line);line='';}for(const char of word){if(probe.measureText(line+char).width>max){lines.push(line);line='';}line+=char;}line+=' ';}
    if(line.trim())lines.push(line.trim());lines.forEach((line,i)=>text(line.trim(),x,top+i*size*1.4,size,fill,weight));return lines.length*size*1.4;
  };
  const chipRows=(items,start)=>{
    let x=pad,top=start;const h=42,gap=10;
    for(const item of items){probe.font='22px Andika, Arial, sans-serif';const width=Math.min(inner,Math.ceil(probe.measureText(item.text).width)+28);if(x+width>W-pad){x=pad;top+=h+gap;}const [bg,ink]=color[item.state];rect(x,top,width,h,bg,12);
      const tx=x+14,ty=top+29;ops.push(ctx=>{ctx.font='22px Andika, Arial, sans-serif';ctx.fillStyle=ink;ctx.fillText(item.text,tx,ty,width-28)});x+=width+gap;}
    return items.length?top+h:start;
  };
  rect(0,0,W,190,'#175b5b',0);text('ROBOT FARM  /  LEARNING REPORT',pad,45,17,'#b9e6d7','700');
  const titleHeight=wrap(data.name+'’s learning journey',pad,94,inner,40,'#fff','700');text(data.dateLabel,pad,94+titleHeight+10,21,'#d5f1e6');const heroHeight=Math.max(190,94+titleHeight+46);ops[0]=ctx=>{ctx.fillStyle='#175b5b';ctx.fillRect(0,0,W,heroHeight)};y=heroHeight+38;
  text('A little practice, every day',pad,y,27,'#234b50','700');y+=26;text('Last 7 days · '+data.week[0].date+' to '+data.date,pad,y,18);y+=28;
  const col=(inner-24)/3;
  for(const [i,n,label] of [[0,data.days,'Days played'],[1,data.missions,'Jobs finished'],[2,data.control,'Read-aloud sessions']]){const x=pad+i*(col+12);rect(x,y,col,108,'#fff');text(n,x+18,y+47,38,'#175b5b','700');text(label,x+18,y+80,18);}
  y+=130;const max=Math.max(1,...data.week.map(d=>d.missions+d.control)),bar=inner/7;
  for(const [i,d] of data.week.entries()){const x=pad+i*bar,h=(d.missions+d.control)/max*65;text(d.missions+d.control,x+38,y+15,19);rect(x+28,y+30,42,65,'#e5eeeb',8);if(h)rect(x+28,y+95-h,42,h,'#2b9180',Math.min(8,h/2));text(d.label,x+30,y+123,18);}
  y+=153;text('Bars count finished jobs and Mission Control read-aloud sessions.',pad,y,17);y+=32;
  for(const [i,n,total,label] of [[0,data.wordMastered,data.wordTotal,'Heart words mastered'],[1,data.letterKnown,52,'Letters known']]){const x=pad+i*(inner/2+6),width=inner/2-6;rect(x,y,width,130,'#fff');text(label,x+20,y+32,20,'#234b50','700');text(n+' / '+total,x+20,y+75,32,'#175b5b','700');rect(x+20,y+96,width-40,10,'#e5eeeb',5);if(n&&total)rect(x+20,y+96,(width-40)*n/total,10,'#e5b34b',5);}
  y+=170;text('Time in Robot Farm',pad,y,26,'#234b50','700');y+=38;text(duration(data.time.totalMs)+' total active time',pad,y,24,'#175b5b','700');y+=32;text(duration(data.timeWeek)+' in the last 7 days',pad,y,20);y+=30;
  y+=wrap((data.time.since?'Tracking since '+data.time.since+'. ':'Tracking starts with this update. ')+'Active time includes grown-up screens. Background time and idle periods after one minute are excluded. Earlier play time was not recorded.',pad,y,inner,17)+20;
  for(const session of data.time.sessions.slice(-5).reverse()){text(new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(session.start))+'  ·  '+duration(session.ms),pad,y,20,'#234b50','700');y+=28;y+=wrap(session.activities.filter(a=>a.ms>=1000).map(a=>a.label+' · '+duration(a.ms)).join(' / ')||'Just getting started',pad,y,inner,17)+18;}
  if(!data.time.sessions.length){text('No active time recorded yet.',pad,y,18);y+=30;}
  y+=12;for(const [i,[state,label]] of Object.entries(REPORT_STATES).entries()){rect(pad+i*200,y-16,14,14,color[state][0],4);text(label,pad+22+i*200,y-3,17);}y+=28;
  for(const list of data.lists){const top=y;const content=[];const startOps=ops.length;
    text('Heart Words · List '+list.number,pad,y+28,26,'#234b50','700');y+=58;
    text(list.words.filter(w=>w.state==='mastered').length+' of '+list.words.length+' mastered'+(list.passed?' · Teacher passed '+list.passed:list.ready?' · Ready for teacher check':''),pad,y,18);y+=20;y=chipRows(list.words,y)+22;
    content.push(...ops.splice(startOps));rect(pad-18,top-10,inner+36,y-top+8,'#fff');ops.push(...content);y+=32;
  }
  text('Alphabet progress',pad,y+24,26,'#234b50','700');y+=54;text(data.letterKnown+' of 52 known · '+data.letterMastered+' mastered',pad,y,18);y+=20;
  y=chipRows(data.letters.filter(x=>L.isUpper(x.text)),y)+14;y=chipRows(data.letters.filter(x=>!L.isUpper(x.text)),y)+28;
  y+=wrap('Current letter focus: '+(data.focus.length===52?'Full alphabet · big and little letters':data.focus.join(' · ')),pad,y,inner,18)+20;
  text('Keep the momentum going',pad,y,25,'#175b5b','700');y+=32;y+=wrap('Try a short farm job, then read a few familiar words together. Give extra time to the purple Practicing items and celebrate the effort.',pad,y,inner,20)+20;
  y+=wrap('Mastered: success on three different days, including an instant read-aloud to a grown-up. Known items are familiar in the game and still get review.',pad,y,inner,17)+15;
  y+=wrap('Saved game practice · not a standardized reading assessment',pad,y,inner,16)+pad;
  const scale=Math.min(1,Math.sqrt(14000000/(W*y)),16000/y);canvas.width=Math.ceil(W*scale);canvas.height=Math.ceil(y*scale);
  const ctx=canvas.getContext('2d');ctx.scale(scale,scale);ctx.fillStyle='#f0f6f2';ctx.fillRect(0,0,W,y);ops.forEach(draw=>draw(ctx));
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image could not be created')),'image/png'));
}
