# Campus Buddy v6 — AI 채팅 / 일정 관리 분리

- `index.html`: 소개, 출시 알림 및 의견 제출 (`tab_final`)
- `chat.html`: AI 채팅 시연, 가상 공지, 자격 분석 입력
- `planner.html`: 누적 계획, 신청 자격 결과, 체크리스트, 서류, 캘린더, ICS 다운로드
- `script.js`: 공통 동작 및 localStorage 저장 (`campus_buddy_demo_plans_v5` 유지)
- `scenarios.js`: 가상 교환학생·장학금·휴학 데이터
- `visitor-tracking.js`: 기존 180일 `user` 쿠키 ID, jsonip JSONP IP 조회, `visitors` 시트 기록 및 `tab_final` 전송 로직 유지

Cursor Live Server로 `index.html`을 열고 AI 채팅 → 자격 분석 → 나의 플래너 흐름을 테스트하세요. 같은 도메인/경로에서 세 페이지가 열려야 localStorage 및 쿠키가 공유됩니다.

주의: 가상 공지와 자격 판정은 실제 학교 규정이 아닙니다. Google Sheets 통신과 IP 조회는 실제 배포 환경에서 별도 확인이 필요합니다.
