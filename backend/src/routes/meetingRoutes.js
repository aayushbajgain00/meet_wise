import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Meeting from "../model/meeting.js";
import { transcribeRecording } from "../service/transcriptionService.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const recordingsDir = path.resolve(__dirname, "../../recordings");
if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, { recursive: true });
}

// Setup multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, recordingsDir); // backend/recordings
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/**
 * GET /meetings
 * List all meetings (latest first)
 */
router.get("/", async (_req, res) => {
  try {
    const items = await Meeting.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching meetings:", err);
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
});

/**
 * GET /meetings/:id
 * Fetch single meeting
 */
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

/**
 * POST /meetings/upload
 * Upload a file + create meeting record
 */
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const generatedMeetingId = new mongoose.Types.ObjectId().toString();

    const newMeeting = await Meeting.create({
      platform: "zoom", // or detect
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

/**
 * POST /meetings/transcribe
 * Accept an audio/video file, transcribe it, and return structured text
 */
router.post("/transcribe", upload.single("file"), async (req, res) => {
  console.log("Target Hit")
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const tempFilePath = req.file.path;

  try {
    const transcription = await transcribeRecording({
      filePath: tempFilePath,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
    });

    res.json({
      file: {
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      transcript: {
        text: transcription.text,
        segments: transcription.segments || null,
        language: transcription.language || transcription.lang || null,
        duration: transcription.duration || null,
        provider: transcription.provider || "openai",
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

/**
 * DELETE /meetings/:id
 * Delete meeting + remove local files
 */
router.delete("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Not found" });

    // remove any local files
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
