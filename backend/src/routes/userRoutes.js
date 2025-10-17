import { Router } from "express";
import express from "express";
import multer from "multer";
import path from "path";
import User from "../model/user.js";

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


// ✅ Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // save to /uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });


// ✅ Register with email + password
router.post("/register", registerUser);
router.post("/login", loginUser);
// router.put("/profile", updateProfile);
router.post("/microsoft-login", microsoftLogin);
router.get("/google", startGoogleOAuth);
router.get("/google/callback", handleGoogleOAuthCallback);
router.get("/profile", getProfile); // Add this route
router.put("/profile", upload.single("photo"), updateProfile);

// Account settings routes
router.put("/account/password", changePassword);
router.delete("/account", deleteAccount);

export default router;
