import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

import Meeting from "../model/meeting.js";
import { transcribeRecording } from "../service/transcriptionService.js";
import { sendTranscriptSummaryEmail } from "../service/emailService.js";

const recordingsRoot = path.resolve("public/recordings");
fs.mkdirSync(recordingsRoot, { recursive: true });

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
  if (segments.length) {
    return segments
      .map((segment) => segment.text || "")
      .filter(Boolean)
      .slice(0, 3)
      .join(" ");
  }
  return "Transcript generated successfully.";
};

const applyTranscriptionToMeeting = async (meetingDoc, transcription) => {
  const transcriptSegments = (transcription.segments || []).map((segment) => ({
    startMs: toMilliseconds(segment.start ?? segment.startMs ?? 0),
    endMs: toMilliseconds(segment.end ?? segment.endMs ?? 0),
    text: segment.text || "",
  }));

  meetingDoc.status = "done";
  meetingDoc.transcript = {
    textFull: transcription.text || "",
    segments: transcriptSegments,
    lang: transcription.language || transcription.lang || "en",
    wordCount: transcription.text
      ? transcription.text.trim().split(/\s+/).filter(Boolean).length
      : 0,
  };
  meetingDoc.insights = {
    summary: buildSummary(transcription.text, transcriptSegments),
  };

  await meetingDoc.save();
  return meetingDoc;
};

/**
 * Main function: join Teams meeting, record, save file, and transcribe.
 */
export async function joinTeamsMeeting(meetingUrl, metadata = {}) {
  console.log(`🤖 Joining Teams meeting: ${meetingUrl}`);

  // 📁 Create recordings folder
  const recordingsDir = path.join(process.cwd(), "public/recordings");
  fs.mkdirSync(recordingsDir, { recursive: true });
  const filePath = path.join(recordingsDir, `teams_meeting_${Date.now()}.mp4`);

  // 🧭 Launch Chrome
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    defaultViewport: { width: 1366, height: 768 },
    args: [
      "--use-fake-ui-for-media-stream",
      "--enable-usermedia-screen-capturing",
      "--allow-http-screen-capture",
      "--autoplay-policy=no-user-gesture-required",
      "--no-sandbox",
    ],
  });

  const page = await browser.newPage();
  await page.goto(meetingUrl, { waitUntil: "domcontentloaded" });
  console.log("🌐 Teams meeting page opened");

  // 💡 Click “Join on Web Instead” if visible
  try {
    const joinWeb = await page.waitForSelector('a[data-tid="joinOnWeb"]', {
      timeout: 15000,
    });
    await joinWeb.click();
    console.log("✅ Clicked 'Join on Web Instead'");
  } catch {
    console.log("⚠️ 'Join on Web Instead' not found — continuing");
  }

  // ✏️ Enter guest name
  try {
    await page.waitForSelector('input[type=\"text\"]', { timeout: 15000 });
    await page.type('input[type=\"text\"]', "MeetWise Bot", { delay: 50 });
    console.log("✏️ Entered guest name");
  } catch {
    console.log("⚠️ No guest name field found");
  }

  // 🎙️ Disable mic & camera
  try {
    const selectors = [
      '[data-tid=\"toggle-microphone\"]',
      '[data-tid=\"toggle-camera\"]',
    ];
    for (const s of selectors) {
      const el = await page.$(s);
      if (el) await el.click();
    }
    console.log("🎙️ Disabled mic & camera");
  } catch {
    console.log("⚠️ Mic/camera toggle skipped");
  }

  // 🚀 Join meeting
  try {
    const joinBtn = await page.waitForSelector(
      'button[data-tid=\"prejoin-join-button\"]',
      { timeout: 15000 }
    );
    await joinBtn.click();
    console.log("🚀 Joining meeting...");
  } catch {
    console.log("⚠️ Couldn’t find Join button — continuing");
  }

  await page.waitForTimeout(8000);

  // 🧠 Allow Node to receive recording
  await page.exposeFunction("saveRecording", async (base64Data) => {
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
    console.log(`💾 Recording saved → ${filePath}`);
  });

  console.log("🎬 Starting in-browser recording…");

  // 🧩 Start recording
  await page.evaluate(() => {
    window._meetwiseStop = false;
    async function startRecording() {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true,
      });

      const mimeType =
        MediaRecorder.isTypeSupported("video/mp4;codecs=avc1,mp4a")
          ? "video/mp4;codecs=avc1,mp4a"
          : "video/webm;codecs=vp9,opus";

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        console.log("🛑 Recording stopped — saving file…");
        const blob = new Blob(chunks, { type: mimeType });
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        await window.saveRecording(base64);
      };

      recorder.start();
      console.log("🎥 Recording started!");

      const autoStop = setTimeout(() => {
        if (recorder.state !== "inactive") {
          recorder.stop();
          console.log("⏰ Auto-stopped after 30 min");
        }
      }, 30 * 60 * 1000);

      const observer = new MutationObserver(() => {
        const txt = document.body.innerText.toLowerCase();
        if (
          txt.includes("call ended") ||
          txt.includes("left the meeting") ||
          txt.includes("something went wrong") ||
          txt.includes("you’ve been removed") ||
          txt.includes("rejoin")
        ) {
          console.log("🚪 Meeting ended — stopping recorder");
          if (recorder.state !== "inactive") recorder.stop();
          clearTimeout(autoStop);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      const interval = setInterval(() => {
        if (window._meetwiseStop && recorder.state !== "inactive") {
          recorder.stop();
          clearTimeout(autoStop);
          clearInterval(interval);
          observer.disconnect();
          console.log("🖐 Manual stop triggered");
        }
      }, 3000);
    }
    startRecording();
  });

  const end = Date.now() + 30 * 60 * 1000;
  while (Date.now() < end) {
    const stillInMeeting = await page.evaluate(() => {
      const txt = document.body.innerText.toLowerCase();
      return !(
        txt.includes("call ended") ||
        txt.includes("left the meeting") ||
        txt.includes("something went wrong") ||
        txt.includes("you’ve been removed") ||
        txt.includes("rejoin")
      );
    });
    if (!stillInMeeting) break;
    await new Promise((r) => setTimeout(r, 5000));
  }

  try {
    await page.evaluate(() => (window._meetwiseStop = true));
  } catch {}

  await page.waitForTimeout(8000);
  await browser.close();
  console.log(`✅ Browser closed — recording finalized at ${filePath}`);

  // 🧾 Save meeting record in DB
  const meetingDoc = await Meeting.create({
    platform: "teams",
    externalMeetingId:
      metadata.externalMeetingId || new mongoose.Types.ObjectId().toString(),
    topic: metadata.topic || "Teams Meeting Recording",
    status: "processing",
    recordings: [
      {
        fileId: path.basename(filePath),
        fileType: "video/mp4",
        localPath: filePath,
        bytes: fs.statSync(filePath).size,
        status: "captured",
      },
    ],
    transcript: { textFull: "", segments: [], lang: "en", wordCount: 0 },
  });

  // 🧠 Transcribe + summarize
  try {
    const transcription = await transcribeRecording({
      filePath,
      originalName: path.basename(filePath),
      mimeType: "video/mp4",
    });

    await applyTranscriptionToMeeting(meetingDoc, transcription);

    if (meetingDoc.hostEmail) {
      await sendTranscriptSummaryEmail({
        to: meetingDoc.hostEmail,
        subject: meetingDoc.topic,
        summary: meetingDoc.insights.summary,
        meetingId: meetingDoc._id,
      });
    }
  } catch (err) {
    console.error("Recording transcription failed", err);
    meetingDoc.status = "error";
    meetingDoc.error = err.message;
    await meetingDoc.save();
  }

  return meetingDoc;
}
