// src/controller/teamsUserOauthController.js
import crypto from "crypto";
import axios from "axios";
import User from "../model/user.js";

const stateStore = new Map();

function makeState(userId) {
  const s = crypto.randomBytes(16).toString("hex");
  const to = setTimeout(() => stateStore.delete(s), 10 * 60 * 1000);
  stateStore.set(s, { userId, to });
  return s;
}

function consumeState(s) {
  const v = stateStore.get(s);
  if (!v) return null;
  clearTimeout(v.to);
  stateStore.delete(s);
  return v;
}

// GET /teams/oauth/start?app_user_id=<mongoUserId>&return_to=<optional>
export function startTeamsOAuth(req, res) {
  const { app_user_id, return_to } = req.query;
  if (!app_user_id) return res.status(400).send("Missing app_user_id");

  const state = makeState(app_user_id);
  const redirectUri = process.env.MS_OAUTH_REDIRECT_URI;
  const url = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");

  url.searchParams.set("client_id", process.env.MS_CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "offline_access openid email profile User.Read Calendars.ReadWrite OnlineMeetings.ReadWrite");
  url.searchParams.set("state", return_to ? `${state}|${encodeURIComponent(return_to)}` : state);
  
  res.redirect(url.toString());
}

// GET /teams/oauth/callback?code=...&state=...
export async function handleTeamsOAuthCallback(req, res) {
  try {
    const { code, state } = req.query;
    const [raw, back] = String(state || "").split("|");
    const st = consumeState(raw);
    if (!code || !st?.userId) return res.status(400).send("Invalid OAuth state");

    const redirectUri = process.env.MS_OAUTH_REDIRECT_URI;
    const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

    const params = new URLSearchParams();
    params.append("client_id", process.env.MS_CLIENT_ID);
    params.append("client_secret", process.env.MS_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirectUri);

    const { data } = await axios.post(tokenUrl, params);

    const user = await User.findById(st.userId);
    if (!user) return res.status(404).send("App user not found");

    user.microsoftAuth = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      scope: data.scope,
      tokenType: data.token_type,
    };
    await user.save();

    const returnTo = back ? decodeURIComponent(back) : (process.env.FRONTEND_BASE_URL || "http://localhost:3000");
    res.send(`<script>window.close();</script> Teams connected. <a href="${returnTo}">Continue</a>`);
  } catch (err) {
    console.error("Teams OAuth callback error:", err?.response?.data || err);
    res.status(500).send("Teams OAuth failed");
  }
}
