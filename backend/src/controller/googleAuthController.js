import crypto from "crypto";
import axios from "axios";
import jwt from "jsonwebtoken";

import User from "../model/user.js";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const STATE_TTL_MS = 10 * 60 * 1000;
const MESSAGE_TYPE = "google-auth";

const stateStore = new Map();

const ensureGoogleConfig = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  const frontendUrl = (process.env.FRONTEND_BASE_URL || "http://localhost:3000").trim();
  const jwtSecret = process.env.JWT_SECRET?.trim();

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing Google OAuth environment variables");
  }

  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return { clientId, clientSecret, redirectUri, frontendUrl, jwtSecret };
};

const createState = () => {
  const state = crypto.randomBytes(16).toString("hex");
  const timeout = setTimeout(() => stateStore.delete(state), STATE_TTL_MS);
  stateStore.set(state, timeout);
  return state;
};

const consumeState = (state) => {
  const timeout = stateStore.get(state);
  if (!timeout) return false;
  clearTimeout(timeout);
  stateStore.delete(state);
  return true;
};

const buildPopupResponse = (payload, frontendUrl) => {
  const origin = new URL(frontendUrl).origin;
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Google authentication</title>
  </head>
  <body>
    <script>
      (function () {
        try {
          const payload = JSON.parse(window.atob("${encodedPayload}"));
          const message = { type: "${MESSAGE_TYPE}", payload };
          const targetOrigin = "${origin}";
          if (window.opener) {
            window.opener.postMessage(message, targetOrigin);
          } else if (window.parent) {
            window.parent.postMessage(message, targetOrigin);
          }
        } catch (error) {
          console.error("OAuth communication error", error);
        }
        window.close();
      })();
    </script>
    <p>You can close this window.</p>
  </body>
</html>`;
};

export const startGoogleOAuth = (req, res) => {
  try {
    console.log("Hit");
    const { clientId, redirectUri, frontendUrl } = ensureGoogleConfig();
    const state = createState();

    const authUrl = new URL(GOOGLE_AUTH_URL);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "openid email profile");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    console.log("Starting Google OAuth", {
      redirectUri,
      frontendUrl,
      clientIdPreview: `${clientId?.slice(0, 6)}...`,
    });

    return res.redirect(authUrl.toString());
  } catch (error) {
    console.error("Google OAuth start error", error);
    const message = error.message || "Unable to initiate Google authentication";
    return res.status(500).json({ success: false, message });
  }
};

const exchangeCodeForTokens = async (code, config) => {
  const body = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: "authorization_code",
  });

  const { data } = await axios.post(GOOGLE_TOKEN_URL, body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return data;
};

const fetchGoogleProfile = async (accessToken) => {
  const { data } = await axios.get(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};

export const handleGoogleOAuthCallback = async (req, res) => {
  try {
    const config = ensureGoogleConfig();
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).send(buildPopupResponse({ success: false, message: "Missing authorization code" }, config.frontendUrl));
    }

    if (!state || !consumeState(state)) {
      return res.status(400).send(buildPopupResponse({ success: false, message: "Invalid OAuth state" }, config.frontendUrl));
    }

    const tokens = await exchangeCodeForTokens(code, config);
    if (!tokens?.access_token) {
      return res.status(502).send(buildPopupResponse({ success: false, message: "Failed to obtain Google tokens" }, config.frontendUrl));
    }

    const profile = await fetchGoogleProfile(tokens.access_token);
    if (!profile?.email) {
      return res.status(502).send(buildPopupResponse({ success: false, message: "Google profile does not include email" }, config.frontendUrl));
    }

    let user = await User.findOne({ googleId: profile.sub });
    if (!user) {
      user = await User.findOne({ email: profile.email.toLowerCase() });
    }

    if (!user) {
      user = new User({
        name: profile.name || profile.given_name || profile.email,
        email: profile.email.toLowerCase(),
        googleId: profile.sub,
        picture: profile.picture,
        authProvider: "google",
        isVerified: Boolean(profile.email_verified),
      });
    } else {
      user.name = profile.name || user.name;
      user.picture = profile.picture || user.picture;
      if (!user.googleId) user.googleId = profile.sub;
      if (!user.password) user.authProvider = "google";
      if (profile.email_verified === true) user.isVerified = true;
    }

    await user.save();

    const appToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    const payload = {
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        authProvider: user.authProvider,
        isVerified: user.isVerified,
      },
      token: appToken,
    };

    return res.send(buildPopupResponse(payload, config.frontendUrl));
  } catch (error) {
    console.error("Google OAuth callback error", error);

    const config = (() => {
      try {
        return ensureGoogleConfig();
      } catch (_) {
        return { frontendUrl: "http://localhost:3000" };
      }
    })();

    const message =
      error.response?.data?.error_description ||
      error.response?.data?.error ||
      error.message ||
      "Google authentication failed";

    return res
      .status(500)
      .send(buildPopupResponse({ success: false, message }, config.frontendUrl));
  }
};
