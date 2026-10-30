const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbynZcKE5dachi2tGvOgOz70Lje9PWCMUrhVrVWb8HTLfuHpyECRjRwNoKJPgltUD4YLqw/exec";

function getVisitorId() {
  const key = "campus_buddy_visitor_id";
  let id = localStorage.getItem(key);

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }

  return id;
}

function getDevice() {
  const ua = navigator.userAgent;

  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/Android|iPhone|Mobile/i.test(ua)) return "mobile";

  return "desktop";
}

function getVisitorData() {
  const params = new URLSearchParams(location.search);

  return {
    id: getVisitorId(),
    landingUrl: location.href,
    ip: "",
    referer: document.referrer || "",
    time_stamp: new Date().toISOString(),
    utm: params.get("utm_source") || params.get("utm") || "",
    device: getDevice()
  };
}

function sendVisitorData() {
  const data = JSON.stringify(getVisitorData());

  const url = new URL(SCRIPT_URL);
  url.searchParams.set("action", "insert");
  url.searchParams.set("table", "visitors");
  url.searchParams.set("data", data);

  $.ajax({
    url: url.toString(),
    dataType: "jsonp",
    timeout: 10000,

    success: function (response) {
      console.log("방문 기록 응답:", response);
    },

    error: function (_xhr, status, error) {
      console.error("방문 기록 전송 오류:", status, error);
    }
  });
}

document.addEventListener("DOMContentLoaded", sendVisitorData);