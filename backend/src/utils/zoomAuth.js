import axios from "axios";

let cachedToken = null;
let tokenExpiry = 0; // epoch seconds

export async function getZoomAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && now < tokenExpiry - 60) return cachedToken;

  const url = "https://zoom.us/oauth/token";
  const params = new URLSearchParams();
  params.append("grant_type", "account_credentials");
  params.append("account_id", process.env.ZOOM_ACCOUNT_ID);

  const auth = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  const { data } = await axios.post(url, params, {
    headers: { Authorization: `Basic ${auth}` }
  });

  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in;
  return cachedToken;
}