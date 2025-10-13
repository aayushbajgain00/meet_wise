import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import BotRoutes from "./routes/botRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhook.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import schedulerRoutes from "./routes/schedulerRoutes.js";
import "./service/schedulerService.js";
import zoomMeetingsRoutes from "./routes/zoomMeetingRoutes.js"
import zoomUserAuthRoutes from "./routes/zoomUserAuthRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors(
//   {
//     origin: [
//       "http://localhost:5173",
//       "http://127.0.0.1:5173",
//       "http://localhost:5174",
//       "http://127.0.0.1:5174",
//       "http://localhost:3000",
//       "http://127.0.0.1:3000",
//       "https://58a442f3b33e.ngrok-free.app",
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }
// ));

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  
  // "https://58a442f3b33e.ngrok-free.app", 
];

const corsOptions = {
  origin: (origin, cb) => {
    // allow tools like Postman/cURL (no Origin header)
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin ${origin}`));
  },
  credentials: true, // required when frontend uses withCredentials
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning", "X-User-Id"],
  optionsSuccessStatus: 204,
};

// ✅ Single cors() use is enough; it also handles preflight in Express 5
app.use(cors(corsOptions));

app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Serve local recordings (dev only)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  "/recordings",
  express.static(path.join(__dirname, process.env.RECORDINGS_DIR || "recordings"))
);

// Routes
app.use("/webhooks", webhookRoutes);
app.use("/bots", BotRoutes);
app.use("/api/user", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/scheduler", schedulerRoutes);
app.use("/zoom/meetings", zoomMeetingsRoutes);
app.use("/zoom", zoomUserAuthRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to meetwise");
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI) // 👈 no deprecated options here
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
