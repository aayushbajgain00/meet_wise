// zoomHelpers.js

// Extract {meetingId, pwd} from common Zoom link shapes
export function parseZoomLink(raw) {
  const val = (raw || "").trim();
  if (!val) return { error: "Paste a Zoom meeting link." };

  // numeric only -> treat as ID
  if (/^\d{7,}$/.test(val)) return { meetingId: val, pwd: "" };

  let u;
  try {
    u = new URL(val);
  } catch {
    return { error: "Invalid URL. It must start with http(s)://" };
  }

  const host = u.hostname.toLowerCase();
  if (!host.includes("zoom.us")) {
    return { error: "Please provide a Zoom link (zoom.us)." };
  }

  let meetingId = "";
  let pwd = u.searchParams.get("pwd") || "";

  const wcJoin = u.pathname.match(/\/wc\/(\d+)\/join/i);
  if (wcJoin) meetingId = wcJoin[1];

  const jMatch = u.pathname.match(/\/j\/(\d+)/i);
  if (jMatch) meetingId = jMatch[1];

  const sMatch = u.pathname.match(/\/s\/(\d+)/i);
  if (sMatch) meetingId = sMatch[1];

  if (!meetingId) {
    const tail = u.pathname.match(/(\d+)$/);
    if (tail) meetingId = tail[1];
  }

  if (!meetingId) return { error: "Could not find a meeting ID in this Zoom link." };
  return { meetingId, pwd };
}

// Build Zoom app + web URLs
export function buildZoomJoinTargets({ meetingId, pwd, displayName }) {
  const id = encodeURIComponent(meetingId);
  const app =
    `zoommtg://zoom.us/join?action=join&confno=${id}` +
    (pwd ? `&pwd=${encodeURIComponent(pwd)}` : "");

  const baseWeb = `https://zoom.us/wc/${id}/join`;
  const qs = new URLSearchParams();
  if (pwd) qs.set("pwd", pwd);
  if (displayName) qs.set("uname", displayName);
  const web = `${baseWeb}${qs.toString() ? `?${qs.toString()}` : ""}`;

  return { appUrl: app, webUrl: web };
}

// Try Zoom app first; fall back to web client
export function openZoom(appUrl, webUrl) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appUrl;
    document.body.appendChild(iframe);
    setTimeout(() => (window.location.href = webUrl), 1200);
    return;
  }

  window.location.href = appUrl;
  setTimeout(() => (window.location.href = webUrl), 1200);
}
