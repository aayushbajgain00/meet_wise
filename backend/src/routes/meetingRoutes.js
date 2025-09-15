import express from "express";
import Meeting from "../model/meeting.js";

const router = express.Router();

// list latest meetings (for quick testing)
router.get("/", async (req, res) => {
  const items = await Meeting.find({}).sort({ createdAt: -1 }).limit(20);
  res.json(items);
});

// get one
router.get("/:id", async (req, res) => {
  const m = await Meeting.findById(req.params.id);
  if (!m) return res.sendStatus(404);
  res.json(m);
});

export default router;