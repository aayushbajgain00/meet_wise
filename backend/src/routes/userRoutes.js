import { Router } from "express";

import {
  registerUser,
  loginUser,
  microsoftLogin,
  updateProfile,
  getProfile,
  changePassword,
  deleteAccount,
} from "../controller/usercontroller.js";
import {
  startGoogleOAuth,
  handleGoogleOAuthCallback,
} from "../controller/googleAuthController.js";

const router = Router();

// ✅ Register with email + password
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", updateProfile);
router.post("/microsoft-login", microsoftLogin);
router.get("/google", startGoogleOAuth);
router.get("/google/callback", handleGoogleOAuthCallback);
router.get("/profile", getProfile); // Add this route

// Account settings routes
router.put("/account/password", changePassword);
router.delete("/account", deleteAccount);

export default router;
