import { Router } from "express";
import { createBot} from "../controller/botcontroller.js";

const router = Router();

router.post("/createBot", createBot); // POST /bots/createBot            // GET  /bots

export default router;
