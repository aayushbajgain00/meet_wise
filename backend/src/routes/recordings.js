import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const recordingsDir = path.join(process.cwd(), "public/recordings");

// ✅ List all recordings
router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(recordingsDir)) return res.json([]);
    const files = fs.readdirSync(recordingsDir)
      .filter(f => f.endsWith(".mp4"))
      .map(f => ({
        name: f,
        url: `http://localhost:5000/recordings/${f}`,
      }));
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
