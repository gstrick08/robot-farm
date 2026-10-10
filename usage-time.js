// Local active-time estimates: background/unfocused tabs and long idle periods do not count.
export const TIME_KEY='robotfarm.time.v1';
export const emptyUsage=()=>({v:1,since:null,totalMs:0,days:{},sessions:[]});
export function validUsage(value) {
  const ms=n=>Number.isSafeInteger(n)&&n>=0;
  const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const date=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d);
  return obj(value)&&value.v===1&&(value.since===null||date(value.since))&&ms(value.totalMs)&&obj(value.days)&&Object.entries(value.days).every(([d,n])=>date(d)&&ms(n))
    &&Array.isArray(value.sessions)&&value.sessions.length<=100&&value.sessions.every(s=>obj(s)&&typeof s.id==='string'&&s.id.length<=100&&ms(s.start)&&ms(s.end)&&s.end<=8640000000000000&&s.end>=s.start&&ms(s.ms)&&s.ms<=s.end-s.start&&Array.isArray(s.activities)&&s.activities.length<=100&&s.activities.every(a=>obj(a)&&typeof a.label==='string'&&a.label.length<=80&&ms(a.ms)));
}
export function createUsage(storage,{now=()=>Date.now(),active=()=>!document.hidden&&document.hasFocus(),engaged=()=>false,day=ms=>{const d=new Date(ms);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`},id=globalThis.crypto?.randomUUID?.() || `visit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`}={}) {
  const read=()=>{try{const value=JSON.parse(storage.getItem(TIME_KEY));return validUsage(value)?value:emptyUsage()}catch{return emptyUsage()}};
  let tick=now(),lastInput=tick,wasActive=active(),label='Welcome screen',stopped=false,failed=false;
  let pendingMs=0,pendingDays={},pendingActivities={};
  const start=tick;
  function flush() {
    const end=now();if(wasActive&&active()&&engaged())lastInput=end;
    const until=Math.min(end,lastInput+60000),delta=wasActive?Math.max(0,until-tick):0;
    const from=tick;tick=end;wasActive=active();
    const value=read();if(stopped)return value;
    pendingMs+=delta;pendingActivities[label]=(pendingActivities[label]||0)+delta;
    if(!pendingMs)return value;
    // Split at local midnight so the seven-day total stays correct across a date change.
    let cursor=from;
    while(delta&&cursor<until){const date=new Date(cursor);date.setHours(24,0,0,0);const next=Math.min(until,date.getTime());pendingDays[day(cursor)]=(pendingDays[day(cursor)]||0)+next-cursor;cursor=next;}
    value.since ||= Object.keys(pendingDays)[0];value.totalMs+=pendingMs;
    for(const [date,ms] of Object.entries(pendingDays))value.days[date]=(value.days[date]||0)+ms;
    let session=value.sessions.find(s=>s.id===id);
    if(!session){session={id,start,end,ms:0,activities:[]};value.sessions.push(session);value.sessions=value.sessions.slice(-100);}
    session.end=Math.max(end,session.end);session.ms+=pendingMs;
    for(const [name,ms] of Object.entries(pendingActivities)){if(!ms)continue;let activity=session.activities.find(a=>a.label===name);if(!activity){activity={label:name,ms:0};if(session.activities.length<100)session.activities.push(activity);else activity=session.activities.at(-1);}activity.ms+=ms;}
    try{storage.setItem(TIME_KEY,JSON.stringify(value));pendingMs=0;pendingDays={};pendingActivities={};failed=false;}catch{failed=true;}
    return value;
  }
  return {flush,snapshot:flush,get failed(){return failed},input(){flush();lastInput=now();wasActive=active();},activity(next){flush();label=String(next).slice(0,80);},pause(){flush();wasActive=false;},resume(){tick=now();lastInput=tick;wasActive=active();},stop(){flush();stopped=true;}};
}
export function duration(ms) {
  const seconds=Math.floor(ms/1000),minutes=Math.floor(seconds/60),hours=Math.floor(minutes/60);
  return hours?`${hours}h ${minutes%60}m`:minutes?`${minutes}m ${seconds%60}s`:`${seconds}s`;
}
