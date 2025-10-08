// src/routes/teamsUserAuthRoutes.js
import { Router } from "express";
import {
  startTeamsOAuth,
  handleTeamsOAuthCallback,
} from "../controller/teamsUserOauthController.js";

const router = Router();

// Microsoft Teams OAuth flow
router.get("/oauth/start", startTeamsOAuth);
router.get("/oauth/callback", handleTeamsOAuthCallback);

export default router;
