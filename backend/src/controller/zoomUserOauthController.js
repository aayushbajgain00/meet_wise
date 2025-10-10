// // src/controller/zoomUserOauthController.js
// import crypto from "crypto";
// import { exchangeZoomCodeForTokens } from "../utils/zoomUserAuth.js";
// import User from "../model/user.js";

// const stateStore = new Map();

// function makeState(userId) {
//   const s = crypto.randomBytes(16).toString("hex");
//   const to = setTimeout(() => stateStore.delete(s), 10 * 60 * 1000);
//   stateStore.set(s, { userId, to });
//   return s;
// }
// function consumeState(s) {
//   const v = stateStore.get(s);
//   if (!v) return null;
//   clearTimeout(v.to);
//   stateStore.delete(s);
//   return v;
// }

// // GET /zoom/oauth/start?app_user_id=<mongoUserId>&return_to=<optional>
// export function startZoomOAuth(req, res) {
//   const { app_user_id, return_to } = req.query;
//   if (!app_user_id) return res.status(400).send("Missing app_user_id");

//   const state = makeState(app_user_id);
//   const redirectUri = process.env.ZOOM_OAUTH_REDIRECT_URI;
//   const url = new URL("https://zoom.us/oauth/authorize");
//   url.searchParams.set("response_type", "code");
//   url.searchParams.set("client_id", process.env.ZOOM_CLIENT_ID);
//   url.searchParams.set("redirect_uri", redirectUri);
//   url.searchParams.set("state", return_to ? `${state}|${encodeURIComponent(return_to)}` : state);
//   res.redirect(url.toString());
// }

// // GET /zoom/oauth/callback?code=...&state=...
// export async function handleZoomOAuthCallback(req, res) {
//   try {
//     const { code, state } = req.query;
//     const [raw, back] = String(state || "").split("|");
//     const st = consumeState(raw);
//     if (!code || !st?.userId) return res.status(400).send("Invalid OAuth state");

//     const redirectUri = process.env.ZOOM_OAUTH_REDIRECT_URI;
//     const data = await exchangeZoomCodeForTokens(code, redirectUri);

//     const user = await User.findById(st.userId);
//     if (!user) return res.status(404).send("App user not found");

//     user.zoomAuth = {
//       accessToken: data.access_token,
//       refreshToken: data.refresh_token,
//       expiresAt: new Date(Date.now() + (data.expires_in ?? 3600) * 1000),
//       scope: data.scope,
//       zoomUserId: data.user_id ?? user.zoomAuth?.zoomUserId,
//       accountId: data.account_id ?? user.zoomAuth?.accountId,
//     };
//     await user.save();

//     const returnTo = back ? decodeURIComponent(back) : (process.env.FRONTEND_BASE_URL || "http://localhost:3000");
//     res.send(`<script>window.close();</script> Zoom connected. <a href="${returnTo}">Continue</a>`);
//   } catch (e) {
//     console.error("Zoom OAuth callback error:", e?.response?.data || e);
//     res.status(500).send("Zoom OAuth failed");
//   }
// }
