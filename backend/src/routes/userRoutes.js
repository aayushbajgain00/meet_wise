import { Router } from "express";

import { registerUser, loginUser } from "../controller/usercontroller.js";

const router = Router();

// ✅ Register with email + password
router.post("/register", registerUser);
router.post("/login", loginUser);


export default router;
