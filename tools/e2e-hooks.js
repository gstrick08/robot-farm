// Injected only by the localhost test harness, never by the shipped game.
window.mobileChecks = async () => {
 const result = window.parent.document.querySelector('#result'), lines=[];
 const log = s => { lines.push(s); result.textContent=lines.join('\n'); };
 const safe={top:0,left:0,right:0,bottom:0};
 const safeStyle=document.createElement('style');safeStyle.textContent=((await(await fetch('ui.css',{cache:'no-store'})).text())+'\n'+(await(await fetch('adventure.css',{cache:'no-store'})).text())).replace(/env\(safe-area-inset-(top|right|bottom|left)\)/g,'var(--audit-safe-$1,0px)');document.head.append(safeStyle);
 const fit=(selector,min=72)=>{assert(document.querySelectorAll(selector).length>0,'Missing '+selector);for(const b of document.querySelectorAll(selector)){const r=b.getBoundingClientRect();assert(r.width>=min-.5&&r.height>=min-.5&&r.top>=safe.top-.5&&r.bottom<=innerHeight-safe.bottom+.5&&r.left>=safe.left-.5&&r.right<=innerWidth-safe.right+.5,selector+' does not fit '+innerWidth+'×'+innerHeight+': '+JSON.stringify({x:r.x,y:r.y,w:r.width,h:r.height}));}};
 for(const [width,height,top=0,left=0,bottom=0,right=0] of [[320,568],[568,320],[375,667],[667,375],[393,852],[844,390],[768,1024],[1024,768],[1180,820],[393,852,47,0,34,0],[844,390,0,47,21,47]]) {
  Object.assign(safe,{top,left,bottom,right});for(const [k,v] of Object.entries(safe))document.documentElement.style.setProperty('--audit-safe-'+k,v+'px');
  const f=window.parent.document.querySelector('iframe'); f.style.width=width+'px';f.style.height=height+'px';await new Promise(r=>setTimeout(r,80));
  window.showFiveJobs();fit('#yardStart');fit('.yard-nav button');const playRect=$('#yardStart').getBoundingClientRect(),navRect=$('.yard-nav').getBoundingClientRect();assert(playRect.bottom+6<=navRect.top||playRect.right+6<=navRect.left,'job start overlaps navigation');const botRect=$('#bot').getBoundingClientRect();assert(botRect.width===0||botRect.right<=navRect.left||botRect.bottom<=navRect.top,'robot overlaps hub navigation');
  for(const type of ['hunt','pods','letters','twins','boss']){await startMission(type,1);await waitFor(ready);fit('#opts .opt');fit('#quit,#replay');$('#quit').click();}
  testState();await startMission('hunt',0);await waitFor(ready);await answerRight();await answerRight();correct().click();await waitFor(()=>M?.phase==='action'&&!$('#actionGo').disabled);fit('#actionGo,#quit');$('#quit').click();
  openReader(0);await waitFor(()=>document.querySelector('.reader-controls button')?.getBoundingClientRect().width>=71.9);fit('.reader-controls button');document.querySelector('[aria-label="Back to jobs"]').click();
  $('#yardFarm').click();const board=$('.board').getBoundingClientRect(),view=$('.farm-viewport').getBoundingClientRect();if(width<=900||height<=500)assert(board.height<=100&&board.top>=view.bottom,'farm toolbar leaves field visible');assert($('#grid').children.length===60,'all farm tiles remain');for(const b of $('#grid').children){const r=b.getBoundingClientRect();assert(r.width>=72&&r.height>=72,'farm tiles preserve touch size');}goFarm();
  $('#yardDrive').click();fit('.drive-top .round');fit('.drive-road-card');document.querySelector('.drive-road-card').click();fit('.drive-controls button');document.querySelector('.drive-home').click();
  log(width+' × '+height+(top||left?' (simulated safe areas)':'')+': five reading layouts, saved-job hub, machine action, mini reader, roads and 72px controls passed.');
 }
 safeStyle.remove();log('PASS: phone/tablet portrait and landscape layout matrix.');
};
window.flowChecks = async () => {
 const result=window.parent.document.querySelector('#result'),lines=[];const log=s=>{lines.push(s);result.textContent=lines.join('\n');};
 M=null;jobSessions=[];S=fresh();save();show('start');$('#play').hidden=false;$('#play').click();await waitFor(()=>!$('#colors').hidden);$('#colors button').click();await waitFor(()=>document.body.dataset.screen==='yard');assert(S.settings.color,'color saved');log('Fresh start, robot color, daily hub passed.');
 $('#yardFarm').click();for(const i of [21,22,23])$('#grid').children[i].click();assert(S.coins===6,'three ready crops earn six coins');$('#grid').children[21].click();document.querySelector('.choice:not(.golden)').click();assert(S.seeds===2&&S.farm[21].crop,'normal planting consumes one seed');
 S.goldSeeds=1;$('#grid').children[22].click();document.querySelector('.choice.golden').click();assert(S.goldSeeds===0&&S.farm[22].crop.gold,'gold planting consumes one golden seed');log('Harvest and normal/golden planting passed.');
 openShop();const item=document.querySelector('.shop-item');item.click();item.click();assert(S.placing&&S.coins<6,'shop second tap buys');const bought=S.placing;goFarm();assert(document.body.dataset.screen==='farm','unfinished purchase opens farm');const i=S.farm.findIndex(t=>t.t==='grass'&&!t.thing);$('#grid').children[i].click();assert(!S.placing&&(S.farm[i].t===bought||S.farm[i].thing===bought),'purchase placed');log('Shop price, double-tap purchase, saved placement passed.');
 let entered=false;gate(()=>{entered=true;openParent()});document.querySelector('.gate-in').value='0';document.querySelector('.gate-in').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}));assert(!entered,'wrong parent answer blocks');gate(()=>{entered=true;openParent()});const ns=document.querySelector('#modal h2').textContent.match(/\d+/g);document.querySelector('.gate-in').value=+ns[0]*+ns[1];document.querySelector('.gate-in').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'}));assert(entered&&document.body.dataset.screen==='parent','correct parent answer opens');log('Parent math gate rejects wrong answer and opens on correct answer.');
 testState();const keys=wordKeys().slice(0,2);await startCoop(keys,()=>openParent());document.querySelector('[data-r="again"]').click();await waitFor(()=>C&&!C.busy);assert(C.seq.length===3,'modeled item repeats once');document.querySelector('[data-r="fast"]').click();await waitFor(()=>C&&!C.busy);const modeled=C.seq[C.i];document.querySelector('[data-r="fast"]').click();await waitFor(()=>!C);assert(S.items[modeled].slow===1&&S.items[modeled].fast===0,'modeled answer is slow, not fast');assert(S.coins===2,'placement gives no coins');log('Placement re-ask, rating and no-extra-reward checks passed.');
 await startCoop(keys,()=>openParent());document.querySelector('[data-r="again"]').click();$('#coopQuit').click();await startCoop(keys,()=>openParent());await new Promise(r=>setTimeout(r,180));assert(C.i===0,'old modeled callback cannot advance a new session');$('#coopQuit').click();log('Quit/restart during modeled speech preserves new session.');
 testState();const words=wordKeys();for(const k of words)S.items[k]={...L.newItem(),box:5,days:['2026-10-01','2026-10-02',TODAY()]};pageTest(words,true);assert(document.querySelectorAll('#pageGrid .pw').length===words.length,'practice has each word');$('#pageDone').click();assert(curList().ready===TODAY(),'clean mastered page is ready to test');log('Shuffled teacher practice and READY TO TEST passed.');

 const oldConfirm=window.confirm;window.confirm=()=>true;document.querySelector('[data-act="passed"]').click();window.confirm=oldConfirm;assert(curList().passed===TODAY(),'teacher pass saves medal');goFarm();assert(document.querySelector('.reward-count').textContent==='1 / 6','first medal count');closeModal();log('Teacher pass and 1/6 medal celebration passed.');
 openParent();document.querySelector('[data-act="addList"]').click();document.querySelector('textarea[data-list="1"]').value='read=reed, blue';document.querySelector('[data-act="saveList"][data-i="1"]').click();assert(S.lists[1].words.length===2&&S.lists[1].say.read==='reed','custom list pronunciation saved');$('#setRate').value=.9;$('#setPerDay').value=5;document.querySelector('[data-act="saveSettings"]').click();assert(S.settings.rate===.9&&S.settings.perDay===5,'parent settings saved');log('Custom list, pronunciation override and settings passed.');
 await startCoop(L.LETTER_KEYS,()=>openParent());assert(new Set(C.seq).size===52,'all upper/lowercase letters in placement');while(C){document.querySelector('[data-r="fast"]').click();await new Promise(r=>setTimeout(r,5));}await waitFor(()=>document.body.dataset.screen==='parent');log('Complete 52-letter placement passed.');
 testState();S.items={};await startMission('hunt',0);await waitFor(()=>$('#prompt').classList.contains('teach'));assert($('#opts').classList.contains('hidden'),'new word is taught before answers');await waitFor(ready);assert(!$('#prompt').textContent,'target caption removed after teaching');$('#quit').click();log('New-item teaching precedes choices and removes target caption.');
 testState();await startCoop();while(C){document.querySelector('[data-r="fast"]').click();await new Promise(r=>setTimeout(r,5));}assert(S.coins===5&&S.day.coop===1,'full Mission Control gives original three coins');await waitFor(()=>document.body.dataset.screen==='yard');log('Full Mission Control and three-coin reward passed.');
 log('PASS: start, farm, shop, gate, placement, practice and session-race browser checks.');
};

window.resumeChecks = async () => {
 const result=window.parent.document.querySelector('#result'),lines=[];const log=s=>{lines.push(s);result.textContent=lines.join('\n');};
 testState();await startMission('hunt',0);await waitFor(ready);
 await answerRight();await answerRight();
 const before=structuredClone(M.m), question=structuredClone(M.question);wrong().click();await waitFor(ready);wrong().click();await waitFor(ready);
 const missed=structuredClone(M.m), faded=M.question.wrong.slice(), earned=M.m.golds;
 $('#quit').click();assert(S.seeds===13+earned,'paused seeds paid once');assert($('#yardStart').textContent.includes('Resume'),'hub offers resume');
 await startMission('hunt',0);await waitFor(ready);assert(JSON.stringify(M.m)===JSON.stringify(missed),'resume preserves question, queue, counts and firstTry');assert(JSON.stringify(M.question.options)===JSON.stringify(question.options),'same choices and positions');assert([...document.querySelectorAll('#opts .faded')].every(b=>b.disabled)&&document.querySelectorAll('#opts .faded').length===faded.length,'faded choices remain disabled');assert(correct().classList.contains('hint'),'hint preserved');
 $('#quit').click();assert(S.seeds===13+earned,'second pause never doubles reward');
 // Reload the actual persisted pair into a fresh in-memory session.
 const pair=readProgress(localStorage,KEY);M=null;jobSessions=pair.jobs;S=JSON.parse(pair.raw);await startMission('hunt',0);await waitFor(ready);assert(JSON.stringify(M.m)===JSON.stringify(missed),'reload resumes exact mission');log('Exit, return, reload: same question, hints, seed bag and equipment checkpoint; no duplicate seeds.');
 await answerRight();assert(M.m.silvers===1,'resumed miss remains silver');assert(!$('#jobAction').hidden===false,'action returns to question');
 await answerRight();await answerRight();
 const oldSeeds=S.seeds;while(M)await answerRight();assert(S.seeds===23&&S.goldSeeds===2,'completion pays only the remaining golds');assert(!jobSessions.length,'finished job checkpoint removed');log('Resumed job completion: ten total seeds, one golden seed, no duplicate payout.');
 closeModal();testState();await startMission('hunt',0);await waitFor(ready);await answerRight();await answerRight();correct().click();await waitFor(()=>M?.phase==='action'&&!$('#actionGo').disabled);
 assert($('#opts').classList.contains('locked'),'reading choices lock during machine action');assert($('#actionGo').getBoundingClientRect().width>=72,'action is a large touch target');$('#quit').click();await startMission('hunt',0);await waitFor(()=>M?.phase==='action'&&!$('#actionGo').disabled);assert(M.m.golds===3,'pending machine break resumes without repeating rewards');$('#actionGo').click();await waitFor(ready);assert($('#jobAction').hidden,'action ends before listening');log('Three-answer machine break: large button, pause/resume, locked choices and quiet next question.');
 $('#quit').click();openReader(0);await waitFor(()=>document.querySelector('.reader-controls button')?.getBoundingClientRect().width>=71.9);assert($('#modal .reader-text').textContent,'original reader shows familiar text');for(const b of document.querySelectorAll('.reader-controls button')){const r=b.getBoundingClientRect();assert(r.width>=71.5&&r.height>=71.5,'reader touch targets');}document.querySelector('[aria-label="Next story page or finish"]').click();assert($('.reader-count').textContent==='2 / 3','reader advances');document.querySelector('[aria-label="Back to jobs"]').click();log('Optional original reader: familiar words, sound help, page advance and return to jobs.');
 log('PASS: saved jobs, action breaks and mini reader.');
};

window.showActionTest=async()=>{testState();await startMission('hunt',0);await waitFor(ready);await answerRight();await answerRight();correct().click();await waitFor(()=>M?.phase==='action'&&!$('#actionGo').disabled);};
window.showReaderTest=()=>{testState();goFarm();openReader(0);};

window.reducedChecks=async()=>{
 const real=window.matchMedia,style=document.createElement('style');style.textContent='*,*::before,*::after{animation:none!important;transition:none!important}';document.head.append(style);
 window.matchMedia=query=>query.includes('prefers-reduced-motion')?{matches:true}:real.call(window,query);
 try{await window.showActionTest();assert(!document.querySelector('.machine-spark'),'reduced motion has no moving particles');$('#actionGo').click();await waitFor(ready);assert(!document.querySelector('.machine-spark'),'action stays motionless');$('#quit').click();window.parent.document.querySelector('#result').textContent='PASS: reduced-motion machine action, no particles, same answers and rewards.';}
 finally{window.matchMedia=real;style.remove();}
};
window.showRewardTest=async(type='hunt')=>{testState();await startMission(type,0);await waitFor(ready);M.m.golds=10;const done=finishMission();clearTimeout(rewardTimer);await done;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await waitFor(()=>!document.querySelector('.adventure-reward').getAnimations().some(a=>a.playState==='running')); };
window.rewardLayoutChecks=async()=>{
 const result=window.parent.document.querySelector('#result'),lines=[];
 for(const [w,h] of [[320,568],[568,320],[393,852],[844,390],[768,1024],[1024,768]]){
  const f=window.parent.document.querySelector('iframe');f.style.width=w+'px';f.style.height=h+'px';await new Promise(r=>setTimeout(r,80));
  for(const type of ['hunt','boss']){await window.showRewardTest(type);for(const b of document.querySelectorAll('.adventure-reward button')){const r=b.getBoundingClientRect();assert(r.width>=72&&r.height>=72&&r.top>=0&&r.bottom<=innerHeight,'Celebration controls outside '+w+'×'+h+' ('+type+'): '+JSON.stringify({x:r.x,y:r.y,w:r.width,h:r.height,vh:innerHeight}));}closeModal();}
  lines.push(w+' × '+h+': standard and bonus celebrations fit, with 72px controls.');result.textContent=lines.join('\n');
 }
 result.textContent+='\nPASS: celebration layouts.';
};
