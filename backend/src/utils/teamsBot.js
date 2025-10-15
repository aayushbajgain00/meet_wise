import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
// import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
import pkg from "puppeteer-video-recorder";
const { PuppeteerScreenRecorder } = pkg;



export async function joinTeamsMeeting(meetingUrl) {
  console.log(`🤖 Joining Teams meeting: ${meetingUrl}`);

  const recordingsDir = path.join(process.cwd(), "public/recordings");
  fs.mkdirSync(recordingsDir, { recursive: true });
  const filePath = path.join(recordingsDir, `teams_meeting_${Date.now()}.mp4`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--disable-dev-shm-usage",
      "--window-size=1366,768",
      "--autoplay-policy=no-user-gesture-required",
      "--mute-audio",
      "--disable-infobars",
      "--allow-file-access-from-files",
      "--use-fake-ui-for-media-stream",
    ],
  });

  const page = await browser.newPage();
  await page.goto(meetingUrl, { waitUntil: "domcontentloaded" });

  // 💡 Handle "Join on Web"
  try {
    await page.waitForSelector('a[data-tid="joinOnWeb"]', { timeout: 20000 });
    await page.click('a[data-tid="joinOnWeb"]');
    console.log("✅ Clicked 'Join on Web'");
  } catch {
    console.log("⚠️ 'Join on Web' not found — likely already on pre-join");
  }

  // 💡 Allow permissions if popup appears
  try {
    const permButton = await page.$("button:has-text('Allow')");
    if (permButton) {
      await permButton.click();
      console.log("🔓 Allowed camera/mic permissions");
    }
  } catch {}

  // 💡 Enter Bot Name
  try {
    await page.waitForSelector('input[type="text"]', { timeout: 15000 });
    await page.type('input[type="text"]', "MeetWise Bot");
  } catch {
    console.log("⚠️ Could not type name");
  }

  // 💡 Disable mic and camera
  try {
    const selectors = [
      '[data-tid="toggle-microphone"]',
      '[data-tid="toggle-camera"]',
    ];
    for (const sel of selectors) {
      const btn = await page.$(sel);
      if (btn) await btn.click();
    }
    console.log("🎙️ Disabled mic & camera");
  } catch (e) {
    console.log("⚠️ Mic/cam toggle failed:", e.message);
  }

  // 💡 Click Join button
  try {
    const joinBtn = await page.waitForSelector(
      'button[data-tid="prejoin-join-button"]',
      { timeout: 25000 }
    );
    await joinBtn.click();
    console.log("🚀 Joining meeting...");
  } catch {
    console.log("⚠️ Join button not found — maybe auto-joined");
  }

  // 💡 Handle Lobby (“Someone will let you in”)
  try {
    await page.waitForFunction(
      () => document.body.innerText.includes("Someone in the meeting should let you in"),
      { timeout: 10000 }
    );
    console.log("🕓 In lobby — waiting to be admitted...");
  } catch {
    console.log("✅ Skipped lobby or already inside meeting");
  }

  // 💡 Wait for actual meeting video UI
  try {
    await page.waitForSelector('[data-tid="meeting-call-controls"], canvas, video', {
      timeout: 60000,
    });
    console.log("✅ Meeting UI detected — starting recording");
  } catch {
    console.log("⚠️ Meeting video UI not detected, continuing anyway");
  }

  // 🎥 Start recording
  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true,
    fps: 24,
    videoFrame: { width: 1366, height: 768 },
    aspectRatio: "16:9",
  });

  await recorder.start(filePath);
  console.log(`🎬 Recording started → ${filePath}`);

  // 🧠 Monitor until meeting ends
  let meetingEnded = false;
  let joined = false;

  const interval = setInterval(async () => {
    try {
      const result = await page.evaluate(() => {
        const txt = document.body.innerText.toLowerCase();
        const hasControls = !!document.querySelector(
          '[data-tid="meeting-call-controls"]'
        );
        return {
          joined: hasControls,
          ended:
            txt.includes("call ended") ||
            txt.includes("left the meeting") ||
            txt.includes("something went wrong"),
        };
      });

      if (result.joined) joined = true;
      if (joined && result.ended && !meetingEnded) {
        meetingEnded = true;
        clearInterval(interval);
        console.log("🛑 Meeting ended — stopping recording");
        await recorder.stop();
        await browser.close();
        console.log(`💾 Saved recording → ${filePath}`);
      }
    } catch (err) {
      console.log("⚠️ check error:", err.message);
    }
  }, 8000);

  browser.on("disconnected", async () => {
    if (!meetingEnded) {
      console.log("🔻 Browser closed manually — finalizing...");
      try {
        await recorder.stop();
        console.log(`💾 Saved before exit → ${filePath}`);
      } catch {}
    }
  });
}
