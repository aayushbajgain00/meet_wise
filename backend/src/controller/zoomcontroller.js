import crypto from "crypto";
import path from "path";
import fs from "fs";
import axios from "axios";
import Meeting from "../model/meeting.js";
import { getZoomAccessToken } from "../utils/zoomAuth.js";

const RECORDINGS_DIR = process.env.RECORDINGS_DIR || "recordings";
if (!fs.existsSync(RECORDINGS_DIR)) fs.mkdirSync(RECORDINGS_DIR, { recursive: true });

// 1) Handle Zoom URL validation (Marketplace "Validate" button)
export function zoomUrlValidation(req, res, next) {
  if (req.body?.event === "endpoint.url_validation") {
    const hashForValidate = crypto
      .createHmac("sha256", process.env.ZOOM_WEBHOOK_SECRET)
      .update(req.body.payload.plainToken)
      .digest("hex");
    return res.json({
      plainToken: req.body.payload.plainToken,
      encryptedToken: hashForValidate
    });
  }
  next();
}

// 2) Handle recording.completed events
export async function zoomRecordingCompleted(req, res) {
  try {
    if (req.body?.event !== "recording.completed") {
      return res.sendStatus(200);
    }

    const obj = req.body.payload.object;
    const meetingUuid = obj.uuid;     // unique per occurrence
    const meetingId = obj.id;         // 11-digit id (not unique across occurrences)
    const topic = obj.topic;
    const startTime = obj.start_time;
    const hostEmail = obj.host_email;
    const files = obj.recording_files || [];

    // Upsert Meeting by (platform, externalMeetingId)
    let meeting = await Meeting.findOne({ platform: "zoom", externalMeetingId: meetingUuid });

    if (!meeting) {
      meeting = await Meeting.create({
        platform: "zoom",
        externalMeetingId: meetingUuid,
        topic, startTime, hostEmail,
        status: "downloading",
        recordings: []
      });
    } else {
      meeting.status = "downloading";
      meeting.topic = topic;
      meeting.startTime = startTime;
      meeting.hostEmail = hostEmail;
      meeting.recordings = []; // reset then refill
    }

    const accessToken = await getZoomAccessToken();

    for (const f of files) {
      const type = (f.file_type || "").toLowerCase(); // mp4/m4a/chat/timeline
      if (!["mp4", "m4a"].includes(type)) continue;   // keep only media

      const fileId = f.id || `${Date.now()}`;
      const filename = `${meetingId}-${fileId}.${type}`;
      const outPath = path.join(RECORDINGS_DIR, filename);

      // Download from Zoom using OAuth token
      const response = await axios.get(f.download_url, {
        responseType: "stream",
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outPath);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const bytes = fs.statSync(outPath).size;

      meeting.recordings.push({
        fileId,
        fileType: type.toUpperCase(),
        playUrl: f.play_url,
        downloadUrl: f.download_url,
        localPath: outPath,
        bytes,
        status: "downloaded"
      });
    }

    meeting.status = "queued"; // handoff to ASR pipeline next
    await meeting.save();

    console.log(`✅ Zoom recording ingested: meeting=${meeting._id} files=${meeting.recordings.length}`);
    return res.sendStatus(200);
  } catch (err) {
    console.error("zoomRecordingCompleted error:", err?.response?.data || err);
    return res.sendStatus(500);
  }
}