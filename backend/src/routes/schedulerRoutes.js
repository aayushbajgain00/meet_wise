// src/routes/schedulerRoutes.js
import { Router } from "express";
import { scheduleMeeting, listScheduledMeetings } from "../controller/SchedulerController.js";

const router = Router();

// Schedule a new meeting
router.post("/schedule", scheduleMeeting);

// List all scheduled meetings
router.get("/", listScheduledMeetings);

export default router;
