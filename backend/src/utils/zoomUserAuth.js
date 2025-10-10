// // src/utils/zoomUserAuth.js
// import axios from "axios";
// import User from "../model/user.js";

// const ZOOM_TOKEN_URL = "https://zoom.us/oauth/token";

// const b64 = (id, secret) => Buffer.from(`${id}:${secret}`).toString("base64");

// export async function exchangeZoomCodeForTokens(code, redirectUri) {
//   const params = new URLSearchParams({
//     grant_type: "authorization_code",
//     code,
//     redirect_uri: redirectUri,
//   });

//   const { data } = await axios.post(ZOOM_TOKEN_URL, params, {
//     headers: {
//       Authorization: `Basic ${b64(process.env.ZOOM_CLIENT_ID, process.env.ZOOM_CLIENT_SECRET)}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });

//   return data; // { access_token, refresh_token, expires_in, scope, ... }
// }

// export async function refreshZoomTokens(refreshToken) {
//   const params = new URLSearchParams({
//     grant_type: "refresh_token",
//     refresh_token: refreshToken,
//   });

//   const { data } = await axios.post(ZOOM_TOKEN_URL, params, {
//     headers: {
//       Authorization: `Basic ${b64(process.env.ZOOM_CLIENT_ID, process.env.ZOOM_CLIENT_SECRET)}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });

//   return data;
// }

// /** Get a valid Zoom access token for your app user (auto-refresh if needed). */
// export async function getZoomAccessTokenForAppUser(appUserId) {
//   const user = await User.findById(appUserId);
//   if (!user || !user.zoomAuth?.accessToken) {
//     throw new Error("User has not connected Zoom.");
//   }

//   const now = Date.now();
//   const exp = user.zoomAuth.expiresAt ? new Date(user.zoomAuth.expiresAt).getTime() : 0;

//   if (!exp || exp - now < 60_000) {
//     const data = await refreshZoomTokens(user.zoomAuth.refreshToken);
//     user.zoomAuth.accessToken = data.access_token;
//     user.zoomAuth.refreshToken = data.refresh_token ?? user.zoomAuth.refreshToken;
//     user.zoomAuth.expiresAt = new Date(Date.now() + (data.expires_in ?? 3600) * 1000);
//     user.zoomAuth.scope = data.scope ?? user.zoomAuth.scope;
//     await user.save();
//   }

//   return user.zoomAuth.accessToken;
// }
