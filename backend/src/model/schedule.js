// src/model/scheduledMeeting.js
import mongoose from "mongoose";

const ScheduledMeetingSchema = new mongoose.Schema(
  {
    meetingId: { type: String, required: true },       // Zoom meeting number
    password: { type: String },                        // optional
    topic: { type: String },                           // user-given title
    scheduledTime: { type: Date, required: true },     // when bot should join
    autoJoin: { type: Boolean, default: true },        // should bot auto-join
    status: {
      type: String,
      enum: ["scheduled", "joining", "joined", "failed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ScheduledMeeting", ScheduledMeetingSchema);
