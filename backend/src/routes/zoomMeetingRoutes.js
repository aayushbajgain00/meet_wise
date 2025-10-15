// src/routes/zoomMeetingsRoutes.js
import { Router } from "express";
import axios from "axios";
// import { getZoomAccessToken } from "../utils/zoomAuth.js";
import { getZoomAccessTokenForAppUser } from "../utils/zoomUserAuth.js";
import ScheduledMeeting from "../model/schedule.js";

const router = Router();

/**
 * POST /zoom/meetings/create
 * Create a REAL Zoom meeting (no scheduling).
 */
router.post("/create", async (req, res) => {
  try {
    const appUserId = req.header("X-User-Id");
    if (!appUserId) return res.status(400).json({ message: "Missing X-User-Id" });

    const { topic, start_time, duration = 30, timezone = "Australia/Darwin" } = req.body;
    if (!topic || !start_time) {
      return res.status(400).json({ message: "topic and start_time are required" });
    }

    // const accessToken = await getZoomAccessToken();
    const accessToken = await getZoomAccessTokenForAppUser(appUserId);

    const payload = {
      topic,
      type: 2, // scheduled
      start_time,           // ISO8601 (UTC "Z" or local with timezone below)
      duration,
      timezone,             // helps Zoom display
      settings: {
        waiting_room: false,
        join_before_host: true,
        approval_type: 2,
      },
    };

    const { data } = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      payload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return res.status(201).json({
      id: data.id,
      uuid: data.uuid,
      passcode: data.password || data.passcode || "",
      join_url: data.join_url,
      start_url: data.start_url,
      start_time: data.start_time,
      timezone: data.timezone,
      created_at: data.created_at,
    });
  } catch (err) {
    console.error("❌ Zoom create meeting failed:", err?.response?.data || err);
    return res.status(500).json({ message: "Failed to create Zoom meeting" });
  }
});

/**
 * POST /zoom/meetings/create-and-schedule
 * Create on Zoom AND schedule the bot to join automatically at the same time.
 *
 * Body: { topic, start_time (ISO-UTC), duration?, timezone? }
 */
router.post("/create-and-schedule", async (req, res) => {
  console.log("create and schedule", req.body);

  try {
    const appUserId = req.header("X-User-Id");
    if (!appUserId) return res.status(400).json({ message: "Missing X-User-Id" });

    const { topic, start_time, duration = 30, timezone = "Australia/Darwin" } = req.body;
    if (!topic || !start_time) {
      return res.status(400).json({ message: "topic and start_time are required" });
    }

    // const accessToken = await getZoomAccessToken();
     const accessToken = await getZoomAccessTokenForAppUser(appUserId);

    // 1) Create Zoom meeting
    const createPayload = {
      topic,
      type: 2,
      start_time,
      duration,
      timezone,
      settings: {
        waiting_room: false,
        join_before_host: true,
        approval_type: 2,
      },
    };

    const { data } = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      createPayload,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const meetingId = String(data.id);
    const passcode = data.password || data.passcode || "";
    const scheduledTime = data.start_time; // ISO from Zoom

    // 2) Create scheduler record so your cron will auto-join
    const scheduled = await ScheduledMeeting.create({
      meetingId,
      password: passcode,
      topic,
      scheduledTime,
      autoJoin: true,
      status: "scheduled",
    });

    return res.status(201).json({
      zoom: {
        id: meetingId,
        uuid: data.uuid,
        passcode,
        join_url: data.join_url,
        start_url: data.start_url,
        start_time: data.start_time,
        timezone: data.timezone,
        created_at: data.created_at,
      },
      scheduler: scheduled,
    });
  } catch (err) {
    const z = err?.response?.data || err;
    console.error("❌ create-and-schedule failed:", z);
    return res.status(500).json({ message: "Failed to create & schedule", detail: z });
  }
});

export default router;
