import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
// import { fileURLToPath } from "url";

import BotRoutes from "./routes/botRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// import webhookRoutes from "./routes/webhook.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import schedulerRoutes from "./routes/schedulerRoutes.js";
import "./service/schedulerService.js";
// import zoomMeetingsRoutes from "./routes/zoomMeetingRoutes.js"
// import zoomUserAuthRoutes from "./routes/zoomUserAuthRoutes.js"

// ✅ NEW: Microsoft Teams routes
import teamsMeetingsRoutes from "./routes/teamsMeetingsRoutes.js";
import teamsUserAuthRoutes from "./routes/teamsUserAuthRoutes.js";


// import teamsBotRoutes from "./routes/teambotRoutes.js";
import recordingsRouter from "./routes/recordings.js";


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


// Allow JSON body parsing
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));



// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Serve local recordings (dev only)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(
//   "/recordings",
//   express.static(path.join(__dirname, process.env.RECORDINGS_DIR || "public/recordings"))
// );

// ✅ API route to list all recordings
app.get("/api/recordings", (req, res) => {
  const dir = path.join(process.cwd(), "public/recordings");
  if (!fs.existsSync(dir)) return res.json([]);

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mp4"))
    .map((f) => ({
      name: f,
      url: `http://localhost:${PORT}/recordings/${f}`,
      createdAt: fs.statSync(path.join(dir, f)).mtime,
      size: (fs.statSync(path.join(dir, f)).size / (1024 * 1024)).toFixed(2) + " MB",
    }));

  res.json(files);
});

app.use("/api/recordings", recordingsRouter);
// Serve video streaming route
app.use("/recordings", recordingsRouter);


// app.use("/api/teamsbot", teamsBotRoutes);


// Routes
// app.use("/webhooks", webhookRoutes);
app.use("/bots", BotRoutes);
app.use("/api/user", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/scheduler", schedulerRoutes);
// app.use("/zoom/meetings", zoomMeetingsRoutes);
// app.use("/zoom", zoomUserAuthRoutes);

// ✅ Microsoft Teams integrations
app.use("/teams/meetings", teamsMeetingsRoutes);
app.use("/teams", teamsUserAuthRoutes);

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
