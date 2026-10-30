(()=> {
  'use strict';
  const messages=document.getElementById('messages'),question=document.getElementById('question'),modal=document.getElementById('modal-backdrop'),signup=document.getElementById('signup'),success=document.getElementById('success');
  const answers=[ {
    match:/휴학|복학/,text:'휴학·복학은 보통 학교 포털의 학적 관련 메뉴와 학사안내에서 확인할 수 있어요! 🌱\n\n정확한 신청 기간과 자격은 학기마다 달라질 수 있으니 공식 학사 공지를 확인해야 해요. 정식 서비스에서는 관련 공지 링크도 함께 제공할 예정이에요.'
  }, {
    match:/졸업|학점|채플/,text:'졸업 요건은 입학 연도, 학과, 이수 과정에 따라 달라질 수 있어요 🎓\n\n학교의 공식 졸업요건 안내와 소속 학과 공지를 확인해 주세요. 앞으로는 내 학적 정보에 맞는 확인 항목을 정리해 드릴 계획이에요.'
  }, {
    match:/장학|등록금/,text:'장학금은 종류마다 신청 대상과 기간이 달라요 💌\n\n학교 장학 공지와 소속 학과 공지에서 최신 정보를 확인해 주세요. 정식 서비스에서는 나에게 맞는 공지를 모아 보여주는 기능을 준비하고 있어요.'
  }, {
    match:/수강|강의/,text:'수강신청 일정은 학교 학사일정과 수강편람에서 확인하는 것이 가장 정확해요 📚\n\n정식 서비스에서는 중요한 수강신청 날짜를 모아 안내할 예정이에요.'
  }
  ];
  function track(event,detail= {
  }) {
    const item= {
      event,detail,time:new Date().toISOString()
    };
    try {
      const saved=JSON.parse(localStorage.getItem('campusBuddyEvents')||'[]');
      saved.push(item);
      localStorage.setItem('campusBuddyEvents',JSON.stringify(saved.slice(-200)))
    }
    catch(e) {
    }
    console.info('[FakeDoor]',item)
  }
  function addBubble(text,who) {
    const el=document.createElement('div');
    el.className='bubble '+who;
    el.textContent=text;
    messages.appendChild(el);
    messages.scrollTop=messages.scrollHeight
  }
  function ask(text) {
    addBubble(text,'user');
    const scenario=window.CampusBuddyDemo?.match(text);
    track('demo_question',{category:scenario||'other'});
    const response=scenario ? window.CampusBuddyDemo.getAnswer(scenario) : '궁금한 질문이구나! 🧸\n\n지금은 휴학·졸업·장학금·수강신청에 대한 가상 체험을 제공하고 있어. 해당 주제로 질문하면 버디가 예시 답변과 플래너를 만들어줄게. 실제 학사 정보는 아직 조회하지 않아.';
    setTimeout(()=>{
      addBubble(response,'bot');
      if(scenario){
        const button=document.createElement('button');
        button.className='chat-action';button.type='button';
        button.textContent='✨ 이 답변으로 플래너 만들기 →';
        button.addEventListener('click',()=>window.CampusBuddyDemo.makePlan(scenario));
        messages.append(button);messages.scrollTop=messages.scrollHeight;
      }
    },350);
  }
  document.getElementById('chat-form').addEventListener('submit',e=> {
    e.preventDefault();
    const text=question.value.trim();
    if(!text)return;
    question.value='';
    ask(text)
  });
  document.querySelectorAll('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
  document.querySelectorAll('[data-cta]').forEach(b=>b.addEventListener('click',()=> {
    track('cta_click', {
      placement:b.dataset.cta
    });
    signup.style.display='block';
    success.classList.remove('show');
    document.getElementById('email').value='';
    document.getElementById('error').textContent='';
    modal.classList.add('show');
    document.getElementById('email').focus()
  }));
  function close() {
    modal.classList.remove('show')
  }
  document.getElementById('close-modal').onclick=close;
  document.getElementById('done').onclick=close;
  modal.addEventListener('click',e=> {
    if(e.target===modal)close()
  });
  document.addEventListener('keydown',e=> {
    if(e.key==='Escape')close()
  });
  document.getElementById('waitlist-form').addEventListener('submit',e=> {
    e.preventDefault();
    const email=document.getElementById('email');
    if(!email.checkValidity()) {
      document.getElementById('error').textContent='올바른 이메일 주소를 입력해 주세요.';
      return
    }
    track('waitlist_submit_demo', {
      note:'Email deliberately not stored'
    });
    signup.style.display='none';
    success.classList.add('show')
  });
  document.getElementById('hero-demo').addEventListener('click',()=>track('demo_open'));
  track('page_view')
})();
