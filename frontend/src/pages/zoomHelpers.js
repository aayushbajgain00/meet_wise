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
