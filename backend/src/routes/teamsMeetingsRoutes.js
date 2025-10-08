import { Router } from "express";
import axios from "axios";
import { getTeamsAccessTokenForAppUser } from "../utils/teamsAuth.js";
import ScheduledMeeting from "../model/schedule.js";
import { joinTeamsMeeting } from "../utils/teamsBot.js";

const router = Router();

// POST /teams/meetings/create
router.post("/create", async (req, res) => {
  try {
    const appUserId = req.header("X-User-Id");
    if (!appUserId) return res.status(400).json({ message: "Missing X-User-Id" });

    const { topic, start_time, duration = 30 } = req.body;
    if (!topic || !start_time) {
      return res.status(400).json({ message: "topic and start_time are required" });
    }

    const accessToken = await getTeamsAccessTokenForAppUser(appUserId);

    const payload = {
      subject: topic,
      startDateTime: start_time,
      endDateTime: new Date(new Date(start_time).getTime() + duration * 60000).toISOString(),
    };

    const { data } = await axios.post(
      "https://graph.microsoft.com/v1.0/me/onlineMeetings",
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return res.status(201).json({
      id: data.id,
      join_url: data.joinUrl,
      subject: data.subject,
      start_time: data.startDateTime,
      end_time: data.endDateTime,
    });
  } catch (err) {
    console.error("❌ Teams create meeting failed:", err?.response?.data || err);
    return res.status(500).json({ message: "Failed to create Teams meeting" });
  }
});

// POST /teams/meetings/create-and-schedule
// router.post("/create-and-schedule", async (req, res) => {
//   try {
//     const appUserId = req.header("X-User-Id");
//     if (!appUserId) return res.status(400).json({ message: "Missing X-User-Id" });

//     const { topic, start_time, duration = 30 } = req.body;
//     if (!topic || !start_time) return res.status(400).json({ message: "Missing fields" });

//     const accessToken = await getTeamsAccessTokenForAppUser(appUserId);

//     const payload = {
//       subject: topic,
//       startDateTime: start_time,
//       endDateTime: new Date(new Date(start_time).getTime() + duration * 60000).toISOString(),
//     };

//     const { data } = await axios.post(
//       "https://graph.microsoft.com/v1.0/me/onlineMeetings",
//       payload,
//       { headers: { Authorization: `Bearer ${accessToken}` } }
//     );

//     const scheduled = await ScheduledMeeting.create({
//       meetingId: data.id,
//       topic,
//       scheduledTime: data.startDateTime,
//       autoJoin: true,
//       status: "scheduled",
//     });

//     return res.status(201).json({
//       teams: {
//         id: data.id,
//         join_url: data.joinUrl,
//         start_time: data.startDateTime,
//         end_time: data.endDateTime,
//       },
//       scheduler: scheduled,
//     });
//   } catch (err) {
//     console.error("❌ Teams create-and-schedule failed:", err?.response?.data || err);
//     res.status(500).json({ message: "Failed to create & schedule Teams meeting" });
//   }
// });

router.post("/create-and-schedule", async (req, res) => {
  try {
    const appUserId = req.header("X-User-Id");
    if (!appUserId) return res.status(400).json({ message: "Missing X-User-Id" });

    const { topic, start_time, duration = 30 } = req.body;
    if (!topic || !start_time) return res.status(400).json({ message: "Missing fields" });

    const accessToken = await getTeamsAccessTokenForAppUser(appUserId);

    const payload = {
      subject: topic,
      startDateTime: start_time,
      endDateTime: new Date(new Date(start_time).getTime() + duration * 60000).toISOString(),
    };

    const { data } = await axios.post(
      "https://graph.microsoft.com/v1.0/me/onlineMeetings",
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Save meeting info
    const scheduled = await ScheduledMeeting.create({
      meetingId: data.id,
      topic,
      scheduledTime: data.startDateTime,
      autoJoin: true,
      status: "scheduled",
    });

    // ✅ Launch Puppeteer after a small delay (e.g., 5 sec)
    setTimeout(async () => {
      try {
        console.log(`🤖 Bot preparing to join Teams meeting: ${data.joinUrl}`);
        await joinTeamsMeeting(data.joinUrl);
      } catch (e) {
        console.error("❌ Bot join failed:", e.message);
      }
    }, 5000);

    return res.status(201).json({
      teams: {
        id: data.id,
        join_url: data.joinUrl,
        start_time: data.startDateTime,
        end_time: data.endDateTime,
      },
      scheduler: scheduled,
    });
  } catch (err) {
    console.error("❌ Teams create-and-schedule failed:", err?.response?.data || err);
    res.status(500).json({ message: "Failed to create & schedule Teams meeting" });
  }
});

export default router;
