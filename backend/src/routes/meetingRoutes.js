import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import Meeting from "../model/meeting.js";
import { transcribeRecording } from "../service/transcriptionService.js";
import { sendTranscriptSummaryEmail } from "../service/emailService.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const recordingsDir = path.resolve(__dirname, "../../recordings");
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, recordingsDir);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", async (_req, res) => {
  try {
    const items = await Meeting.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching meetings:", err);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.sendStatus(404);
    res.json(meeting);
  } catch (err) {
    console.error("Error fetching meeting:", err);
    res.status(500).json({ message: "Failed to fetch meeting" });
  }
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const generatedMeetingId = new mongoose.Types.ObjectId().toString();

    const newMeeting = await Meeting.create({
      platform: "upload",
      externalMeetingId: generatedMeetingId,
      topic: req.file.originalname,
      status: "recorded",
      recordings: [
        {
          fileId: req.file.filename,
          fileType: req.file.mimetype,
          localPath: req.file.path,
          bytes: req.file.size,
          status: "uploaded",
        },
      ],
      transcript: { textFull: "", segments: [], lang: "en", wordCount: 0 },
    });

    res.json(newMeeting);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

const toMilliseconds = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return value > 1000 ? Math.round(value) : Math.round(value * 1000);
};

const buildSummary = (text = "", segments = []) => {
  const trimmed = (text || "").trim();
  if (trimmed) {
    const sentences = trimmed
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean);
    return sentences.slice(0, 3).join(" ");
  }

  if (Array.isArray(segments) && segments.length) {
    return segments
      .map((segment) => segment.text || "")
      .filter(Boolean)
      .slice(0, 3)
      .join(" ");
  }

  return "Transcript generated successfully.";
};

router.post("/transcribe", upload.single("file"), async (req, res) => {
  console.log("Target Hit");
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const generatedMeetingId = new mongoose.Types.ObjectId().toString();
  const tempFilePath = req.file.path;
  const recipientEmail = String(req.body?.email || "").trim();
  const providedTitle = String(req.body?.title || "").trim();

  try {
    const transcription = await transcribeRecording({
      filePath: tempFilePath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    const transcriptSegments = (transcription.segments || []).map((segment, index) => ({
      startMs: toMilliseconds(segment.start ?? segment.startMs ?? 0),
      endMs: toMilliseconds(segment.end ?? segment.endMs ?? 0),
      text: segment.text || "",
    }));

    const summaryText = buildSummary(transcription.text, transcriptSegments);

    const meetingDoc = await Meeting.create({
      platform: "upload",
      externalMeetingId: generatedMeetingId,
      topic: providedTitle || req.file.originalname || "Uploaded Recording",
      hostEmail: recipientEmail || undefined,
      status: "done",
      recordings: [],
      transcript: {
        textFull: transcription.text || "",
        segments: transcriptSegments,
        lang: transcription.language || transcription.lang || "en",
        wordCount: transcription.text
          ? transcription.text.trim().split(/\s+/).filter(Boolean).length
          : 0,
      },
      insights: {
        summary: summaryText,
      },
    });

    if (recipientEmail) {
      sendTranscriptSummaryEmail({
        to: recipientEmail,
        subject: meetingDoc.topic,
        summary: summaryText,
        meetingId: meetingDoc._id,
      }).catch((emailErr) =>
        console.warn("Failed to send transcript summary email", emailErr)
      );
    }

    const segmentsForResponse = transcriptSegments.length ? transcriptSegments : null;

    res.json({
      meetingId: meetingDoc._id,
      file: {
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      transcript: {
        text: transcription.text,
        segments: segmentsForResponse,
        language: transcription.language || transcription.lang || null,
        duration: transcription.duration || null,
        provider: transcription.provider || "openai",
        meetingId: meetingDoc._id,
      },
      meeting: {
        _id: meetingDoc._id,
        topic: meetingDoc.topic,
        status: meetingDoc.status,
        createdAt: meetingDoc.createdAt,
        hostEmail: meetingDoc.hostEmail,
        transcript: meetingDoc.transcript,
        insights: meetingDoc.insights,
      },
    });
  } catch (error) {
    console.error("Transcription failed:", error);
    const status = error.statusCode || error.status || 500;
    res.status(status).json({
      message: error.message || "Transcription failed",
      detail: error.detail || undefined,
    });
  } finally {
    fs.promises
      .unlink(tempFilePath)
      .catch((err) => console.warn("Unable to remove temp file", err));
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Not found" });

    if (meeting.recordings && meeting.recordings.length > 0) {
      meeting.recordings.forEach((rec) => {
        if (rec.localPath && fs.existsSync(rec.localPath)) {
          fs.unlinkSync(path.resolve(rec.localPath));
        }
      });
    }

    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting meeting:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
