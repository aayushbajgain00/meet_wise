import axios from "axios";
import User from "../model/user.js";

export async function getTeamsAccessTokenForAppUser(userId) {
  const user = await User.findById(userId);
  if (!user?.microsoftAuth) throw new Error("User not linked to Microsoft account");

  const { accessToken, refreshToken, expiresAt } = user.microsoftAuth;
  if (accessToken && new Date() < new Date(expiresAt) - 60000) {
    return accessToken;
  }

  // Refresh token flow
  const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
  const params = new URLSearchParams();
  params.append("client_id", process.env.MS_CLIENT_ID);
  params.append("client_secret", process.env.MS_CLIENT_SECRET);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const { data } = await axios.post(tokenUrl, params);

  user.microsoftAuth.accessToken = data.access_token;
  user.microsoftAuth.refreshToken = data.refresh_token || refreshToken;
  user.microsoftAuth.expiresAt = new Date(Date.now() + data.expires_in * 1000);
  await user.save();

  return data.access_token;
}
