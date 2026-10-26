(() => {
  "use strict";
  // Dates are deliberately relative and fictional; never present as official deadlines.
  const scenarios = {
    leave: { question: "휴학 신청하려면 무엇을 준비해야 해?", answer: "휴학을 계획하고 있구나! 🌱\n학적 상태와 신청 가능 여부를 먼저 확인하고, 학사안내를 살펴본 다음 신청 절차를 진행하면 좋아. 아래 단계는 체험용 예시야.", steps: [["학적 상태 및 휴학 자격 확인", 2], ["공식 학사 공지 확인", 4], ["필요 서류 확인", 7], ["휴학 신청 절차 진행", 10]] },
    graduation: { question: "졸업 준비는 무엇부터 시작해야 해?", answer: "졸업 요건은 입학 연도와 전공에 따라 달라져 🎓\n먼저 이수 현황을 점검하고 학과의 공식 요건과 대조해 보자. 아래 일정은 예시야.", steps: [["이수 학점 현황 확인", 1], ["전공·교양 필수 요건 점검", 3], ["학과 졸업 안내 확인", 6], ["미충족 요건 상담 문의", 9]] },
    scholarship: { question: "장학금 신청은 어떻게 준비해?", answer: "장학금마다 자격과 서류가 달라 💌\n내게 해당하는 공지를 확인하고 서류를 준비해 보자. 아래 단계는 실제 신청 기간과 무관한 체험용 예시야.", steps: [["지원 가능한 장학 공지 찾기", 1], ["신청 자격 확인", 3], ["증빙 서류 준비", 5], ["장학금 신청서 제출", 8]] }
  };
  const $ = (id) => document.getElementById(id);
  const dateKey = (d) => [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
  const addDays = (n) => { const d = new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate()+n); return dateKey(d); };
  const track = (event, detail={}) => { try { const a=JSON.parse(localStorage.getItem('campusBuddyEvents')||'[]'); a.push({event,detail,time:new Date().toISOString()}); localStorage.setItem('campusBuddyEvents',JSON.stringify(a.slice(-200))); } catch (_) {} };
  let selected='leave';
  let tasks=[];
  let month=new Date(); month.setDate(1);
  const storage='campusBuddyPlannerV2';
  try { const saved=JSON.parse(localStorage.getItem(storage)||'null'); if(saved && scenarios[saved.selected] && Array.isArray(saved.tasks)) { selected=saved.selected; tasks=saved.tasks.filter(t=>typeof t.title==='string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date)); } } catch (_) {}
  const save=()=>localStorage.setItem(storage,JSON.stringify({selected,tasks}));
  function renderScenario() {
    document.querySelectorAll('[data-scenario]').forEach(b=>{ b.classList.toggle('active',b.dataset.scenario===selected); b.setAttribute('aria-pressed',String(b.dataset.scenario===selected)); });
    $('flow-question').textContent=scenarios[selected].question;
    $('flow-answer').textContent=scenarios[selected].answer;
  }
  function renderTasks() {
    $('task-list').replaceChildren();
    $('task-empty').hidden=tasks.length>0;
    $('task-count').textContent=`${tasks.filter(t=>t.done).length} / ${tasks.length}`;
    tasks.forEach((task,i)=>{
      const label=document.createElement('label'); label.className='todo-row'+(task.done?' completed':'');
      const cb=document.createElement('input'); cb.type='checkbox'; cb.checked=!!task.done;
      cb.addEventListener('change',()=>{tasks[i].done=cb.checked; save();renderTasks();track('todo_toggle',{done:cb.checked,scenario:selected});});
      const wrap=document.createElement('span');
      const name=document.createElement('span'); name.className='todo-name'; name.textContent=task.title;
      const small=document.createElement('small');small.textContent=`예시 예정일: ${task.date}`;
      wrap.append(name,small); label.append(cb,wrap); $('task-list').append(label);
    });
    $('download-calendar').disabled=tasks.length===0;
  }
  function renderCalendar() {
    const year=month.getFullYear(),m=month.getMonth();
    $('calendar-title').textContent=`${year}년 ${m+1}월`;
    const grid=$('calendar-grid');grid.replaceChildren();
    ['일','월','화','수','목','금','토'].forEach(s=>{const e=document.createElement('div');e.className='calendar-weekday';e.textContent=s;grid.append(e);});
    const offset=new Date(year,m,1).getDay(); const days=new Date(year,m+1,0).getDate();
    for(let i=0;i<offset+days;i++) {
      const e=document.createElement('div');e.className='calendar-day';
      if(i<offset){e.classList.add('muted');grid.append(e);continue;}
      const day=i-offset+1; const key=dateKey(new Date(year,m,day));e.textContent=String(day);
      if(key===dateKey(new Date()))e.classList.add('today');
      tasks.filter(t=>t.date===key).forEach(t=>{const b=document.createElement('span');b.className='calendar-dot';b.textContent=(t.done?'✓ ':'')+t.title;e.append(b);});
      grid.append(e);
    }
    const events=$('calendar-events');events.replaceChildren();
    const inMonth=tasks.filter(t=>t.date.startsWith(`${year}-${String(m+1).padStart(2,'0')}`)).sort((a,b)=>a.date.localeCompare(b.date));
    if(!inMonth.length)events.textContent='이 달에는 생성된 예시 일정이 없어요.';
    inMonth.forEach(t=>{const p=document.createElement('p');p.textContent=`${t.date.slice(5)} · ${t.title}${t.done?' ✓':''}`;events.append(p);});
  }
  function refresh(){renderScenario();renderTasks();renderCalendar();}
  document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.scenario;tasks=[];save();refresh();track('scenario_select',{scenario:selected});}));
  $('generate-plan').addEventListener('click',()=>{tasks=scenarios[selected].steps.map(([title,days])=>({title,date:addDays(days),done:false}));month=new Date();month.setDate(1);save();refresh();track('plan_generate',{scenario:selected,count:tasks.length});});
  $('reset-tasks').addEventListener('click',()=>{tasks=[];save();refresh();track('plan_reset',{scenario:selected});});
  $('prev-month').addEventListener('click',()=>{month.setMonth(month.getMonth()-1);renderCalendar();track('calendar_navigate',{direction:'prev'});});
  $('next-month').addEventListener('click',()=>{month.setMonth(month.getMonth()+1);renderCalendar();track('calendar_navigate',{direction:'next'});});
  $('today-month').addEventListener('click',()=>{month=new Date();month.setDate(1);renderCalendar();});
  const escapeIcs=s=>s.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  $('download-calendar').addEventListener('click',()=>{
    if(!tasks.length)return;
    const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Campus Buddy//Fake Door Demo//KO','CALSCALE:GREGORIAN'];
    tasks.forEach((t,i)=>{const d=t.date.replace(/-/g,'');const next=new Date(`${t.date}T12:00:00`);next.setDate(next.getDate()+1);lines.push('BEGIN:VEVENT',`UID:campusbuddy-${Date.now()}-${i}@demo.local`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;VALUE=DATE:${d}`,`DTEND;VALUE=DATE:${dateKey(next).replace(/-/g,'')}`,`SUMMARY:${escapeIcs('[체험용] '+t.title)}`,'DESCRIPTION:캠퍼스 버디 가상 체험 일정입니다. 실제 학교 마감일이 아닙니다.','END:VEVENT');});
    lines.push('END:VCALENDAR');const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='campus-buddy-demo.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);track('calendar_export',{scenario:selected,count:tasks.length});
  });
  refresh();
})();
