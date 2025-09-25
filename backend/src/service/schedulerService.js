// src/scheduler.js
import cron from "node-cron";
import ScheduledMeeting from "../model/schedule.js";
import { joinZoomMeeting } from "../utils/ZoomPuppet.js";

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const dueMeetings = await ScheduledMeeting.find({
    autoJoin: true,
    scheduledTime: { $lte: now },
    status: "scheduled",
  });

  for (const m of dueMeetings) {
    try {
      console.log(`⏰ Time to join meeting ${m.meetingId}`);
    //   await joinZoomMeeting(m.meetingId, m.password);
        await joinZoomMeeting("123456789", "abc123"); //yeslai hata bharey
      m.status = "joining";
      await m.save();
    } catch (err) {
      console.error("❌ Bot failed to join", err.message);
      m.status = "failed";
      await m.save();
    }
  }
});

console.log("📅 Scheduler service started...");
