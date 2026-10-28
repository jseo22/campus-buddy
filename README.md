# Campus Buddy (캠퍼스 버디) — Fake Door 데모

## 실행
Cursor/VS Code에서 이 폴더를 연 뒤 `index.html`을 Live Server로 실행하세요.

## 파일 구성
- `index.html`: 랜딩페이지 및 교수님 예제 기반 방문자 추적 코드
- `styles.css`: 화면 스타일
- `script.js`: 챗봇 데모 및 출시 알림 모달 (실제 이메일 수집 없음)
- `planner.js`: 시나리오 체크리스트, 달력 및 ICS 다운로드

## 방문 기록
`index.html`은 jQuery JSONP 방식으로 Google Apps Script의 `visitors` 시트에 페이지 방문 기록을 전송합니다. 브라우저에서의 실제 전송 성공 여부는 Network/Console 및 스프레드시트에서 확인하세요.

**주의:** 공개 GitHub 저장소에 올리면 `index.html`의 Apps Script 배포 URL도 공개됩니다. 공개 기록 API의 오남용 위험을 검토하고, IP 등 방문자 정보 수집 시 개인정보 고지 및 관련 요건을 확인하세요.

시나리오와 마감일은 데모용 가상 데이터이며 공식 학교 행정 안내가 아닙니다. 클릭 이벤트는 브라우저 localStorage에만 저장되고 Google Sheets로 전송되지 않습니다.
