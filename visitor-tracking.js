/* 기존 수업의 Google Apps Script JSONP insert 규격을 사용합니다. */
window.BUDDY_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbynZcKE5dachi2tGvOgOz70Lje9PWCMUrhVrVWb8HTLfuHpyECRjRwNoKJPgltUD4YLqw/exec';
// 교수님 수업 자료의 180일 쿠키 기반 방문자 ID를 그대로 사용합니다.
function getCookieValue(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
}
function setCookieValue(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
function getUVfromCookie() {
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  const existingHash = getCookieValue('user');
  if (!existingHash) {
    setCookieValue('user', hash, 180);
    return hash;
  }
  return existingHash;
}
// 기존 신청 폼 코드가 사용하는 이름도 동일한 쿠키 ID로 연결합니다.
function getVisitorId() { return getUVfromCookie(); }

function getDevice(){const ua=navigator.userAgent;return /iPad|Tablet/i.test(ua)?'tablet':/Android|iPhone|Mobile/i.test(ua)?'mobile':'desktop';}
function getTimeStamp(){const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;}
function insertBuddyRow(table, row){
  return new Promise((resolve,reject)=>{
    if(!window.jQuery){reject(new Error('jQuery가 로드되지 않았습니다.'));return;}
    jQuery.ajax({url:window.BUDDY_SCRIPT_URL+'?action=insert&table='+encodeURIComponent(table)+'&data='+encodeURIComponent(JSON.stringify(row)),dataType:'jsonp',timeout:15000,success:r=>r&&r.success===true?resolve(r):reject(new Error(JSON.stringify(r))),error:(_x,status,error)=>reject(new Error(status+' '+(error||'')))});
  });
}
// 교수님 예제의 JSONP IP 조회를 완료한 뒤 방문 기록을 보냅니다.
// 조회가 실패해도 페이지는 정상 동작하며 2초 후 unknown으로 기록합니다.
var ip = 'unknown';
var ipResolved = false;
var visitSent = false;
function getIP(json) {
  ip = json && json.ip ? json.ip : 'unknown';
  ipResolved = true;
  if (document.readyState !== 'loading') sendCampusBuddyVisit();
}
function sendCampusBuddyVisit() {
  if (visitSent) return;
  visitSent = true;
  const params = new URLSearchParams(location.search);
  insertBuddyRow('visitors', {
    id: getUVfromCookie(),
    landingUrl: location.href,
    ip: ip,
    referer: document.referrer,
    time_stamp: getTimeStamp(),
    utm: params.get('utm_source') || params.get('utm') || '',
    device: getDevice()
  }).then(r => console.log('방문 기록 응답:', r))
    .catch(e => console.warn('방문자 기록 실패:', e.message));
}
document.addEventListener('DOMContentLoaded', () => {
  if (ipResolved) sendCampusBuddyVisit();
  else setTimeout(sendCampusBuddyVisit, 2000);
});
// 기존 index.html의 <script src="https://jsonip.com?...">와 동일한 호출
(function () {
  const script = document.createElement('script');
  script.src = 'https://jsonip.com?format=jsonp&callback=getIP';
  script.async = true;
  script.onerror = () => console.warn('IP 조회 실패: unknown으로 기록합니다.');
  document.head.appendChild(script);
})();
