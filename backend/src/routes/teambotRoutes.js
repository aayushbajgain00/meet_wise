// import express from "express";
// import { joinTeamsMeeting, stopTeamsRecording } from "../utils/teamsBot.js";

// const router = express.Router();

// // Start recording
// router.post("/start", async (req, res) => {
//   const { meetingUrl } = req.body;
//   if (!meetingUrl) return res.status(400).json({ error: "Missing meetingUrl" });
//   try {
//     const result = await joinTeamsMeeting(meetingUrl);
//     res.json({ success: true, ...result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to start meeting recording" });
//   }
// });

// // Stop recording
// router.post("/stop", async (_req, res) => {
//   try {
//     await stopTeamsRecording();
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to stop recording" });
//   }
// });

// export default router;
