// frontend/src/pages/zoomHelpers.js
export function parseZoomLink(raw) {
  const val = (raw || "").trim();

  // numeric only -> treat as ID
  if (/^\d{7,}$/.test(val)) return { meetingId: val, pwd: "" };
  if (!val) return { error: "Paste a Zoom meeting link or ID." };

  let u;
  try {
    u = new URL(val);
  } catch {
    return { error: "Invalid URL. It must start with http(s)://" };
  }

  const host = u.hostname.toLowerCase();
  if (!/zoom\.us$/.test(host) && !/\.zoom\.us$/.test(host)) {
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

export function buildZoomJoinTargets({ meetingId, pwd = "", displayName = "" }) {
  const cleanId = String(meetingId || "").replace(/[^0-9]/g, "");
  if (!cleanId) throw new Error("meetingId is required");

  const encodedName = encodeURIComponent(displayName || "Guest");
  const base = `https://zoom.us/j/${cleanId}`;
  const query = new URLSearchParams();
  if (pwd) query.set("pwd", pwd);
  if (displayName) query.set("uname", displayName);

  const webUrl = query.toString() ? `${base}?${query}` : base;
  const appUrl = query.toString()
    ? `zoommtg://zoom.us/join?confno=${cleanId}&${query.toString()}`
    : `zoommtg://zoom.us/join?confno=${cleanId}`;

  return { appUrl, webUrl };
}

export function openZoom(appUrl, webFallbackUrl) {
  if (typeof window === "undefined") return;

  if (appUrl) {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = appUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
      document.body.removeChild(iframe);
      if (webFallbackUrl) {
        window.location.href = webFallbackUrl;
      }
    }, 1500);
  } else if (webFallbackUrl) {
    window.open(webFallbackUrl, "_blank", "noopener");
  }
}
