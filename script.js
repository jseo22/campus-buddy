(()=>{'use strict';
const $=id=>document.getElementById(id), scenarios=window.BUDDY_SCENARIOS;
const KEY='campus_buddy_demo_plans_v5';
let plans=[];try{plans=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(plans))plans=[];}catch(e){plans=[];}
let active='all', month=new Date();month.setDate(1);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(plans));}catch(e){console.warn('저장 실패',e);}};
function track(event,detail={}){console.info('[Campus Buddy Demo]',event,detail);try{const a=JSON.parse(localStorage.getItem('campusBuddyEvents')||'[]');a.push({event,detail,time:new Date().toISOString()});localStorage.setItem('campusBuddyEvents',JSON.stringify(a.slice(-200)));}catch(e){}}
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function bubble(text,who='bot'){const el=node('div','bubble '+who,text);if($('messages')){$('messages').append(el);$('messages').scrollTop=$('messages').scrollHeight;}return el;}
function identify(text){return Object.keys(scenarios).find(k=>scenarios[k].match.test(text));}
function ask(text){if(!$('messages'))return;bubble(text,'user');const type=identify(text);track('demo_question',{type:type||'unsupported'});if(!type){bubble('지금은 교환학생, 장학금, 휴학 시나리오를 체험할 수 있어! 🧸\n\n예를 들어 “교환학생 신청하고 싶어”라고 물어봐.');return;}
 const sc=scenarios[type];bubble(`${sc.emoji} ${sc.title} 관련 가상 공지를 찾았어!\n\n${sc.notice}\n\n이 공고가 너에게 해당하는지 확인하고, 필요한 서류와 일정까지 만들어볼까?`);
 const panel=node('div','chat-action');const btn=node('button','btn','🔎 내 신청 자격 분석하기');btn.type='button';btn.onclick=()=>{panel.remove();renderQuestions(type);};panel.append(btn);$('messages').append(panel);$('messages').scrollTop=$('messages').scrollHeight;
}
function renderQuestions(type){const sc=scenarios[type];bubble('신청 자격을 확인하려면 아래 항목을 입력해줘. 실제 개인정보 대신 가상의 값을 입력해도 돼.');const form=node('form','chat-question-form');const fields={};sc.fields.forEach(f=>{const label=node('label','',f.label);let input;if(f.type==='select'){input=node('select');const empty=node('option','','선택해줘');empty.value='';input.append(empty);f.options.forEach(([v,t])=>{const o=node('option','',t);o.value=v;input.append(o);});}else{input=node('input');input.type='number';input.placeholder=f.placeholder||'';if(f.min!==undefined)input.min=f.min;if(f.max!==undefined)input.max=f.max;if(f.step)input.step=f.step;}input.required=true;fields[f.key]=input;label.append(input);form.append(label);});const submit=node('button','btn','✨ 내 결과 분석하기');submit.type='submit';form.append(submit);form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const values=Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value]));form.remove();createPlan(type,values);});$('messages').append(form);$('messages').scrollTop=$('messages').scrollHeight;}
function createPlan(type,values){const sc=scenarios[type];const results=sc.rules.map(r=>({label:r.label,pass:r.test(values[r.field]),tip:r.tip}));const failed=results.filter(r=>!r.pass);const verdict=failed.length===0?'신청 가능 (가상 판정)':'현재 일부 요건 미충족 (가상 판정)';const dateId=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const tasks=sc.tasks.map(([title,date],i)=>({id:dateId+'-t'+i,title,date,done:false,kind:'task'}));
if(failed.length)failed.forEach((r,i)=>tasks.splice(1+i,0,{id:dateId+'-f'+i,title:'부족한 조건 준비: '+r.label,date:'2026-11-09',done:false,kind:'task'}));
const docs=sc.docs.map(([title,date],i)=>({id:dateId+'-d'+i,title,date,done:false,kind:'doc'}));if(type==='leave'&&values.reason==='medical')docs.push({id:dateId+'-medical',title:'진단서 (질병 휴학 예시)',date:'2026-11-16',done:false,kind:'doc'});
const plan={id:dateId,type,title:sc.title,values,results,verdict,tasks,docs,createdAt:new Date().toISOString()};plans.push(plan);save();active='all';month=new Date('2026-11-01T12:00:00');bubble(`${failed.length?'아직 충족하지 못한 요건이 '+failed.length+'개 있어.':'가상 신청 요건을 모두 충족했어!'}\n\n${sc.title} 계획을 추가했어. 준비할 일 ${tasks.length}개, 서류 ${docs.length}개와 각각의 기한을 통합 캘린더에서 확인해봐. 🗓️`);
track('plan_created',{type,verdict});window.location.href='planner.html';
}
function visible(){return plans.filter(p=>active==='all'||p.type===active);}
function renderFilters(){const el=$('plan-filters');el.replaceChildren();const types=[['all','전체 일정'],...Object.keys(scenarios).map(k=>[k,scenarios[k].emoji+' '+scenarios[k].title])];types.forEach(([key,title])=>{const b=node('button','filter-chip'+(active===key?' selected':''),title);b.type='button';b.onclick=()=>{active=key;renderAll();};el.append(b);});}
function makeItem(item,plan){const row=node('label','check-row');const cb=node('input');cb.type='checkbox';cb.checked=item.done;cb.addEventListener('change',()=>{item.done=cb.checked;save();renderAll();track('item_checked',{type:plan.type,kind:item.kind,done:item.done});});const body=node('span','check-body');const title=node('span','check-title'+(item.done?' done':''),item.title);const meta=node('small','',item.date+' · '+scenarios[plan.type].emoji+' '+plan.title);body.append(title,meta);row.append(cb,body);return row;}
function renderGroupedItems(container,selected,kind){
 const groups=new Map();
 selected.forEach(plan=>{if(!groups.has(plan.type))groups.set(plan.type,[]);groups.get(plan.type).push(plan);});
 groups.forEach((typePlans,type)=>{
  const sc=scenarios[type];const all=typePlans.flatMap(p=>kind==='task'?p.tasks:p.docs);
  if(!all.length)return;
  const group=node('details','plan-category');group.open=true;
  const heading=node('summary','plan-category-heading');
  const name=node('span','plan-category-name',sc.emoji+' '+sc.title+' 준비');
  const progress=node('span','plan-category-progress',all.filter(t=>t.done).length+' / '+all.length+' 완료');
  heading.append(name,progress);group.append(heading);
  const content=node('div','plan-category-content');
  typePlans.forEach((plan,i)=>{
   const items=kind==='task'?plan.tasks:plan.docs;
   if(!items.length)return;
   const sub=node('div','plan-category-batch');
   if(typePlans.length>1){const date=new Date(plan.createdAt);const label=Number.isNaN(date.getTime())?'생성한 계획 '+(i+1):date.toLocaleDateString('ko-KR')+' 생성한 계획 '+(i+1);sub.append(node('div','plan-batch-title',label));}
   items.forEach(item=>sub.append(makeItem(item,plan)));
   content.append(sub);
  });
  group.append(content);container.append(group);
 });
}
function renderAll(){renderFilters();const selected=visible();const eligibility=$('eligibility-summary');eligibility.replaceChildren();const taskEl=$('task-list'),docEl=$('document-list');taskEl.replaceChildren();docEl.replaceChildren();const tasks=selected.flatMap(p=>p.tasks),docs=selected.flatMap(p=>p.docs);
 selected.forEach(p=>{const card=node('div','eligibility-entry');const title=node('strong','',scenarios[p.type].emoji+' '+p.title+' · '+p.verdict);card.append(title);p.results.forEach(r=>card.append(node('div','rule '+(r.pass?'pass':'fail'),(r.pass?'✓ ':'! ')+r.label+(r.pass?' · 충족':' · 미충족 — '+r.tip))));eligibility.append(card);});
 renderGroupedItems(taskEl,selected,'task');renderGroupedItems(docEl,selected,'doc');
 if(!selected.length){eligibility.textContent='해당 분야의 계획이 없어.';taskEl.textContent='일정이 없어.';docEl.textContent='서류가 없어.';}
 else{if(!tasks.length)taskEl.textContent='해야 할 일이 없어.';if(!docs.length)docEl.textContent='준비할 서류가 없어.';}
 $('task-count').textContent=tasks.filter(t=>t.done).length+' / '+tasks.length;$('doc-count').textContent=docs.filter(d=>d.done).length+' / '+docs.length;renderCalendar();}
function renderCalendar(){const year=month.getFullYear(),m=month.getMonth(),grid=$('calendar-grid');$('calendar-title').textContent=year+'년 '+(m+1)+'월';grid.replaceChildren();['일','월','화','수','목','금','토'].forEach(d=>grid.append(node('div','cal-weekday',d)));
const first=new Date(year,m,1).getDay(),days=new Date(year,m+1,0).getDate();for(let i=0;i<first;i++)grid.append(node('div','cal-blank'));
const items=visible().flatMap(p=>[...p.tasks,...p.docs].map(t=>({...t,plan:p})));for(let day=1;day<=days;day++){const date=`${year}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;const cell=node('div','cal-day');cell.append(node('span','cal-num',String(day)));items.filter(t=>t.date===date).forEach(t=>{const event=node('div','cal-event'+(t.done?' done':''),(t.done?'✓ ':'')+t.title);event.style.borderLeftColor=scenarios[t.plan.type].color;event.title=scenarios[t.plan.type].title+' · '+t.title;cell.append(event);});grid.append(cell);}
const list=$('calendar-events');list.replaceChildren();const ordered=items.filter(t=>t.date.slice(0,7)===`${year}-${String(m+1).padStart(2,'0')}`).sort((a,b)=>a.date.localeCompare(b.date));if(!ordered.length)list.textContent='이 달에 예정된 일정이 없어.';ordered.forEach(t=>{const row=node('div','calendar-list-row');const dot=node('span','event-dot');dot.style.background=scenarios[t.plan.type].color;row.append(dot,node('span','',t.date+' · '+t.title+(t.done?' ✓ 완료':'')));list.append(row);});}
function downloadICS(){const items=visible().flatMap(p=>[...p.tasks,...p.docs].map(t=>({...t,plan:p})));if(!items.length)return;const esc=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Campus Buddy//Demo//KO'];items.forEach(t=>{const date=t.date.replace(/-/g,'');const next=new Date(t.date+'T12:00:00');next.setDate(next.getDate()+1);const end=[next.getFullYear(),String(next.getMonth()+1).padStart(2,'0'),String(next.getDate()).padStart(2,'0')].join('');lines.push('BEGIN:VEVENT','UID:'+t.id+'@campusbuddy-demo','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'').replace(/Z$/,'Z'),'DTSTART;VALUE=DATE:'+date,'DTEND;VALUE=DATE:'+end,'SUMMARY:'+esc('['+t.plan.title+'] '+t.title),'DESCRIPTION:'+esc('시연용 가상 일정 · 실제 학사 일정 아님'+(t.done?' · 완료':'')),'END:VEVENT');});lines.push('END:VCALENDAR');const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='campus-buddy-demo.ics';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);track('calendar_download');}
if($('chat-form')){
$('chat-form').addEventListener('submit',e=>{e.preventDefault();const v=$('question').value.trim();if(v){$('question').value='';ask(v);}});
document.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
}
if($('calendar-grid')){
$('prev-month').onclick=()=>{month.setMonth(month.getMonth()-1);renderCalendar();};
$('next-month').onclick=()=>{month.setMonth(month.getMonth()+1);renderCalendar();};
$('today-month').onclick=()=>{month=new Date();month.setDate(1);renderCalendar();};
$('download-calendar').onclick=downloadICS;
$('clear-plans').onclick=()=>{if(confirm('시연용 계획과 완료 상태를 모두 삭제할까?')){plans=[];save();renderAll();track('plans_cleared');}};
renderAll();
}
if($('feedback-form')){
$('feedback-form').addEventListener('submit',async e=>{e.preventDefault();if(!$('feedback-form').reportValidity())return;const btn=$('submit'),status=$('submit-result');btn.disabled=true;btn.textContent='제출 중...';status.textContent='';try{await insertBuddyRow('tab_final',{id:getVisitorId(),email:$('submit-email').value.trim(),advice:$('submit-advice').value.trim()});status.textContent='신청이 접수됐어! 고마워 💜';$('feedback-form').reset();track('waitlist_submit');}catch(err){status.textContent='제출에 실패했어. 잠시 후 다시 시도해줘.';console.error(err);}finally{btn.disabled=false;btn.textContent='출시 알림 신청하기 →';}});
}
track('page_view');
})();
