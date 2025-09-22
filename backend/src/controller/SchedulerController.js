// src/controller/schedulerController.js
import ScheduledMeeting from "../model/schedule.js";

export const scheduleMeeting = async (req, res) => {
  try {
    const { meetingId, password, topic, scheduledTime } = req.body;
    if (!meetingId || !scheduledTime) {
      return res.status(400).json({ message: "meetingId and scheduledTime required" });
    }

    const scheduled = await ScheduledMeeting.create({
      meetingId,
      password,
      topic,
      scheduledTime,
      autoJoin: true,
    });

    res.status(201).json(scheduled);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listScheduledMeetings = async (req, res) => {
  try {
    const items = await ScheduledMeeting.find({}).sort({ scheduledTime: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
