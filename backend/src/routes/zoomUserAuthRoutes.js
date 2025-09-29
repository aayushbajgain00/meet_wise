// src/routes/zoomUserAuthRoutes.js
import { Router } from "express";
import { startZoomOAuth, handleZoomOAuthCallback } from "../controller/zoomUserOauthController.js";

const router = Router();
router.get("/oauth/start", startZoomOAuth);
router.get("/oauth/callback", handleZoomOAuthCallback);
export default router;
