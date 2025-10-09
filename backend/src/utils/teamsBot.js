import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

export async function joinTeamsMeeting(meetingUrl) {
  console.log(`🤖 Bot preparing to join Teams meeting: ${meetingUrl}`);

  const recordingsDir = path.join(process.cwd(), "public/recordings");
  fs.mkdirSync(recordingsDir, { recursive: true });
  const output = path.join(recordingsDir, `teams_meeting_${Date.now()}.mp4`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--enable-gpu",
      "--window-size=1366,768",
      "--autoplay-policy=no-user-gesture-required",
      "--mute-audio",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  console.log("🌐 Opening meeting page...");
  await page.goto(meetingUrl, { waitUntil: "networkidle2", timeout: 60000 });

  // 1️⃣ Click “Join on Web Instead”
  try {
    const joinOnWeb = await Promise.race([
      page.waitForSelector("a[data-tid='joinOnWeb']", { timeout: 15000 }),
      page.waitForSelector("button[data-tid='joinOnWeb']", { timeout: 15000 }),
    ]);
    if (joinOnWeb) {
      await joinOnWeb.click();
      console.log("✅ Clicked 'Join on Web Instead'");
    }
  } catch {
    console.log("⚠️ Could not find 'Join on Web Instead'");
  }

  // 2️⃣ Enter guest name
  try {
    await page.waitForSelector('input[data-tid="guest-name-input"], input[type="text"]', { timeout: 20000 });
    await page.click('input[data-tid="guest-name-input"], input[type="text"]', { clickCount: 3 });
    await page.type('input[data-tid="guest-name-input"], input[type="text"]', "MeetWise Bot 🤖", { delay: 40 });
    console.log("✏️ Entered guest name");
  } catch {
    console.log("⚠️ Could not find name field");
  }

  // 3️⃣ Disable mic & camera
  for (const t of ['[data-tid="toggle-camera"]', '[data-tid="toggle-microphone"]']) {
    try {
      if (await page.$(t)) await page.click(t);
    } catch {}
  }
  console.log("🎙️ Disabled mic and camera");

  // 4️⃣ Click “Join now”
  try {
    const joinBtn =
      (await page.$('button[data-tid="prejoin-join-button"]')) ||
      (await page.$('button[aria-label*="Join now"]'));
    if (joinBtn) {
      await joinBtn.click();
      console.log("🚀 Clicked 'Join now'");
    } else {
      await page.keyboard.press("Enter");
    }
  } catch {
    console.log("⚠️ Join button not found");
  }

  // 5️⃣ Wait for meeting to load
  try {
    await page.waitForSelector('[data-tid="meeting-call-controls"]', { timeout: 40000 });
    console.log("✅ Inside meeting UI");
  } catch {
    console.log("⚠️ Meeting UI not detected, continuing anyway");
  }

  // 6️⃣ Start recording
  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true,
    fps: 25,
    videoFrame: { width: 1366, height: 768 },
    aspectRatio: "16:9",
  });

  await recorder.start(output);
  console.log(`🎥 Recording started → ${output}`);

  // 7️⃣ Keep recording for up to 30 minutes
  const RECORD_TIME_MS = 30 * 60 * 1000; // 30 minutes
  console.log(`🕒 Recording will run for up to ${RECORD_TIME_MS / 60000} minutes...`);

  const start = Date.now();
  while (Date.now() - start < RECORD_TIME_MS) {
    try {
      await page.waitForSelector('[data-tid="meeting-call-controls"]', { timeout: 10000 });
    } catch {
      console.log("🚪 Meeting ended early — stopping recording...");
      break;
    }
  }

  // 8️⃣ Stop and finalize
  console.log("🛑 Stopping recording...");
  await recorder.stop();
  console.log("💾 Recording finalized successfully.");

  await page.waitForTimeout(5000); // ensure buffer flush
  await browser.close();
  console.log(`✅ Saved playable MP4 → ${output}`);
}



// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";
// import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

// export async function joinTeamsMeeting(meetingUrl) {
//   console.log(`🤖 Bot preparing to join Teams meeting: ${meetingUrl}`);

//   const recordingsDir = path.join(process.cwd(), "public/recordings");
//   fs.mkdirSync(recordingsDir, { recursive: true });
//   const output = path.join(recordingsDir, `teams_meeting_${Date.now()}.mp4`);

//   // ✅ Full-render browser launch (GPU + window)
//   const browser = await puppeteer.launch({
//     headless: false,
//     defaultViewport: null,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--use-fake-ui-for-media-stream",
//       "--use-fake-device-for-media-stream",
//       "--enable-gpu",
//       "--enable-accelerated-2d-canvas",
//       "--window-size=1366,768",
//       "--autoplay-policy=no-user-gesture-required",
//       "--allow-insecure-localhost",
//       "--disable-infobars",
//       "--disable-dev-shm-usage",
//       "--mute-audio",
//       "--disable-extensions",
//     ],
//   });

//   const page = await browser.newPage();
//   await page.setViewport({ width: 1366, height: 768 });
//   console.log("🌐 Opening meeting page...");
//   await page.goto(meetingUrl, { waitUntil: "networkidle2" });

//   // 1️⃣ Click "Join on Web Instead"
//   try {
//     await page.waitForSelector('a[data-tid="joinOnWeb"]', { timeout: 15000 });
//     await page.click('a[data-tid="joinOnWeb"]');
//     console.log("✅ Clicked 'Join on Web Instead'");
//   } catch {
//     console.log("⚠️ 'Join on Web Instead' not found — continuing...");
//   }

//   // 2️⃣ Enter bot name
//   try {
//     await page.waitForSelector('input[type=\"text\"]', { timeout: 15000 });
//     await page.click('input[type=\"text\"]', { clickCount: 3 });
//     await page.type('input[type=\"text\"]', "MeetWise Bot", { delay: 50 });
//     console.log("✏️ Entered bot name: MeetWise Bot");
//   } catch {
//     console.log("⚠️ Could not set bot name");
//   }

//   // 3️⃣ Disable mic & camera
//   try {
//     const toggles = ['[data-tid=\"toggle-camera\"]', '[data-tid=\"toggle-microphone\"]'];
//     for (const t of toggles) if (await page.$(t)) await page.click(t);
//     console.log("🎙️ Disabled mic and camera");
//   } catch {
//     console.log("⚠️ Could not disable mic/camera");
//   }

//   // 4️⃣ Click "Join now"
//   try {
//     const joinButton =
//       (await page.$('button[data-tid=\"prejoin-join-button\"]')) ||
//       (await page.$('button:has-text(\"Join now\")'));
//     if (joinButton) {
//       await joinButton.click();
//       console.log("🚀 Clicked 'Join now'");
//     } else {
//       await page.keyboard.press("Enter");
//     }
//   } catch {
//     console.log("⚠️ Join button not found");
//   }

//   // 5️⃣ Wait for meeting UI to appear
//   try {
//     await page.waitForSelector('[data-tid=\"meeting-call-controls\"]', { timeout: 30000 });
//     console.log("✅ Meeting UI detected — starting recording");
//   } catch {
//     console.log("⚠️ Meeting UI not detected, starting recording anyway");
//   }

//   // 6️⃣ Start recording
//   const recorder = new PuppeteerScreenRecorder(page, {
//     followNewTab: true,
//     fps: 24,
//     videoFrame: { width: 1366, height: 768 },
//     aspectRatio: "16:9",
//   });
//   await recorder.start(output);
//   console.log(`🎥 Recording started → ${output}`);

//   // 7️⃣ Keep recording until stopped
//   console.log("⏳ Bot running. Press CTRL + C to stop and save recording.");
//   await new Promise(() => {});

//   // 8️⃣ Stop recording gracefully
//   process.on("SIGINT", async () => {
//     console.log("\n🛑 Stopping recording...");
//     await recorder.stop();
//     await browser.close();
//     console.log(`💾 Saved recording: ${output}`);
//     process.exit();
//   });
// }
