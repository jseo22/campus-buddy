/* 모든 요건, 서류, 날짜는 가상 데모 데이터입니다. */
window.BUDDY_SCENARIOS = {
 exchange: {
  title:'교환학생', emoji:'✈️', color:'#7564da', match:/교환|해외|파견|토플|toefl/i,
  notice:'[가상 공지] 2027학년도 교환학생 모집: 재학생 중 2학년 이상, 평점 3.0 이상, TOEFL iBT 80점 이상인 학생을 대상으로 해. 지원서 마감은 2026년 11월 20일이야.',
  fields:[{key:'status',label:'현재 학적 상태',type:'select',options:[['enrolled','재학'],['leave','휴학'],['graduated','졸업']]},{key:'year',label:'학년',type:'number',placeholder:'예: 3',min:1,max:6},{key:'gpa',label:'평점 (4.3 만점)',type:'number',placeholder:'예: 3.4',min:0,max:4.3,step:0.01},{key:'toefl',label:'TOEFL iBT 점수',type:'number',placeholder:'예: 75',min:0,max:120}],
  rules:[{field:'status',label:'재학 상태',test:v=>v==='enrolled',tip:'지원 시 재학 상태를 확인해야 해.'},{field:'year',label:'2학년 이상',test:v=>Number(v)>=2,tip:'학년 조건을 충족한 뒤 지원할 수 있어.'},{field:'gpa',label:'평점 3.0 이상',test:v=>Number(v)>=3,tip:'평점 3.0 이상이 필요해.'},{field:'toefl',label:'TOEFL 80점 이상',test:v=>Number(v)>=80,tip:'어학 성적을 높이거나 재응시 일정을 준비해.'}],
  tasks:[['모집 공고 및 지원 대학 확인','2026-11-05'],['미충족 요건 보완 계획 세우기','2026-11-07'],['교환학생 온라인 지원서 제출','2026-11-20']],
  docs:[['영문 성적증명서','2026-11-13'],['TOEFL 성적표','2026-11-16'],['학업계획서','2026-11-18']]
 },
 scholarship:{
  title:'장학금',emoji:'🎓',color:'#26a88d',match:/장학|등록금|지원금/i,
  notice:'[가상 공지] 2027학년도 희망 장학금: 재학생, 평점 3.2 이상, 소득구간 8 이하가 신청 대상이야. 신청 마감은 2026년 11월 25일이야.',
  fields:[{key:'status',label:'학적 상태',type:'select',options:[['enrolled','재학'],['leave','휴학'],['graduated','졸업']]},{key:'gpa',label:'평점 (4.3 만점)',type:'number',placeholder:'예: 3.5',min:0,max:4.3,step:0.01},{key:'income',label:'소득구간',type:'number',placeholder:'예: 7',min:0,max:10}],
  rules:[{field:'status',label:'재학 상태',test:v=>v==='enrolled',tip:'재학 상태를 확인해야 해.'},{field:'gpa',label:'평점 3.2 이상',test:v=>Number(v)>=3.2,tip:'성적 조건을 충족해야 해.'},{field:'income',label:'소득구간 8 이하',test:v=>Number(v)<=8,tip:'소득구간 확인 및 증빙을 준비해.'}],
  tasks:[['장학금 공고 및 선발 기준 확인','2026-11-08'],['소득구간 확인','2026-11-12'],['장학금 신청서 제출','2026-11-25']],
  docs:[['장학금 신청서','2026-11-20'],['성적증명서','2026-11-21'],['소득구간 확인 자료','2026-11-23']]
 },
 leave:{
  title:'휴학',emoji:'🌱',color:'#e48b59',match:/휴학|학적|복학/i,
  notice:'[가상 공지] 2027학년도 휴학 신청: 재학생이며 1학기 이상 이수한 학생은 신청 가능해. 휴학 신청 마감은 2026년 11월 18일이야.',
  fields:[{key:'status',label:'학적 상태',type:'select',options:[['enrolled','재학'],['leave','휴학'],['graduated','졸업']]},{key:'semesters',label:'이수한 학기 수',type:'number',placeholder:'예: 4',min:0,max:20},{key:'reason',label:'휴학 사유',type:'select',options:[['general','일반 휴학'],['medical','질병 휴학']] }],
  rules:[{field:'status',label:'재학 상태',test:v=>v==='enrolled',tip:'현재 학적 상태를 먼저 확인해.'},{field:'semesters',label:'1학기 이상 이수',test:v=>Number(v)>=1,tip:'최소 이수 학기 조건을 확인해야 해.'}],
  tasks:[['휴학 신청 절차 확인','2026-11-05'],['신청 사유 및 서류 준비','2026-11-10'],['휴학 신청서 제출','2026-11-18']],
  docs:[['휴학 신청서','2026-11-15'],['학적 확인 자료','2026-11-16']]
 }
};
