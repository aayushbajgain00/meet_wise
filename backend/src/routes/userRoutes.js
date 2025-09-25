import { Router } from "express";

import { registerUser, loginUser, updateProfile } from "../controller/usercontroller.js";

const router = Router();

// ✅ Register with email + password
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", updateProfile);


export default router;
