import { Router } from "express";

import { registerUser, loginUser, microsoftLogin } from "../controller/usercontroller.js";

const router = Router();

// ✅ Register with email + password
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/microsoft-login", microsoftLogin);


export default router;
