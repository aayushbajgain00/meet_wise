import mongoose from "mongoose";

const RecordingFileSchema = new mongoose.Schema(
  {
    fileId: String,
    fileType: String,     // MP4 / M4A
    playUrl: String,
    downloadUrl: String,  // Zoom download URL (requires OAuth token)
    localPath: String,    // saved file path
    bytes: Number,
    status: { type: String, default: "downloaded" } // downloaded|queued|processed
  },
  { _id: false }
);

const SegmentSchema = new mongoose.Schema(
  {
    startMs: Number,
    endMs: Number,
    speaker: String,
    text: String
  },
  { _id: false }
);

const InsightSchema = new mongoose.Schema(
  {
    summary: String,
    decisions: [String],
    actionItems: [{ title: String, owner: String, due: Date, priority: String }],
    topics: [String],
    risks: [String]
  },
  { _id: false }
);

const MeetingSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ["zoom", "meet", "teams", "upload"],
      default: "zoom",
    },
    externalMeetingId: String, // Zoom meeting UUID (unique per occurrence)
    topic: String,
    hostEmail: String,
    startTime: Date,
    endTime: Date,

    status: {
      type: String,
      enum: ["recorded", "downloading", "queued", "processing", "done", "error"],
      default: "recorded"
    },

    recordings: [RecordingFileSchema],

    transcript: {
      textFull: String,
      segments: [SegmentSchema],
      lang: String,
      wordCount: Number
    },

    insights: InsightSchema,

    error: String
  },
  { timestamps: true }
);

MeetingSchema.index(
  { platform: 1, externalMeetingId: 1 },
  {
    unique: true,
    partialFilterExpression: { externalMeetingId: { $exists: true, $ne: null } },
  }
);

export default mongoose.model("Meeting", MeetingSchema);
