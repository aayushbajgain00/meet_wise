import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";

export async function joinTeamsMeeting(meetingUrl) {
  console.log(`🤖 Bot preparing to join Teams meeting: ${meetingUrl}`);

  const recordingsDir = path.join(process.cwd(), "public/recordings");
  fs.mkdirSync(recordingsDir, { recursive: true });
  const filePath = path.join(recordingsDir, `teams_meeting_${Date.now()}.mp4`);

  // ⚙️ Puppeteer launch configuration
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", // ✅ use your real Chrome
    userDataDir: `C:/Users/${process.env.USERNAME}/AppData/Local/Google/Chrome/User Data/Default`, // ✅ your profile
    ignoreDefaultArgs: ["--enable-automation"],
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1366,768",
      "--autoplay-policy=no-user-gesture-required",
      "--disable-infobars",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--use-file-for-fake-video-capture=./fake.y4m",
      "--use-file-for-fake-audio-capture=./fake.wav",
      "--allow-file-access-from-files",
    ],
  });

  const page = await browser.newPage();

  // 🧠 make it look like a real user browser
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );

  console.log("🌐 Opening meeting page...");
  await page.goto(meetingUrl, { waitUntil: "networkidle2", timeout: 0 });

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
    console.log("⚠️ 'Join on Web Instead' not found — may already be on pre-join page");
  }

  // 2️⃣ Handle “Join as Guest” (if appears)
  try {
    await page.waitForSelector("button[data-tid='joinAsGuest'], button:has-text('Join as guest')", {
      timeout: 15000,
    });
    await page.click("button[data-tid='joinAsGuest'], button:has-text('Join as guest')");
    console.log("👤 Clicked 'Join as Guest'");
  } catch {
    console.log("⚠️ No 'Join as Guest' button — skipping");
  }

  // 3️⃣ Enter guest name
  try {
    await page.waitForSelector('input[data-tid="guest-name-input"], input[type="text"]', {
      timeout: 20000,
    });
    await page.click('input[data-tid="guest-name-input"], input[type="text"]', { clickCount: 3 });
    await page.type('input[data-tid="guest-name-input"], input[type="text"]', "MeetWise Bot 🤖", {
      delay: 40,
    });
    console.log("✏️ Entered guest name");
    await page.keyboard.press("Enter");
  } catch {
    console.log("⚠️ Could not find or type name field — continuing");
  }

  // 4️⃣ Disable mic & camera
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

  // 5️⃣ Click “Join now”
  try {
    let joinBtn = null;
    for (let i = 0; i < 5; i++) {
      joinBtn =
        (await page.$('button[data-tid="prejoin-join-button"]')) ||
        (await page.$('button[aria-label*="Join now"]')) ||
        (await page.$('button:has-text("Join now")'));
      if (joinBtn) break;
      await page.waitForTimeout(2000);
    }

    if (joinBtn) {
      await joinBtn.click();
      console.log("🚀 Clicked 'Join now' button");
    } else {
      console.log("⚠️ Could not find 'Join now' — trying Enter key");
      await page.keyboard.press("Enter");
    }
  } catch {
    console.log("⚠️ Failed to click 'Join now' button");
  }

  // 6️⃣ Retry if “Rejoin call” appears
  try {
    const rejoinBtn = await page.waitForSelector('button:has-text("Rejoin call")', {
      timeout: 10000,
    });
    if (rejoinBtn) {
      await rejoinBtn.click();
      console.log("🔁 Clicked 'Rejoin call' to recover connection");
    }
  } catch {}

  // 7️⃣ Wait for meeting UI
  try {
    await page.waitForSelector(
      '[data-tid="meeting-call-controls"], video, canvas, [aria-label*="Leave"]',
      { timeout: 60000 }
    );
    console.log("✅ Successfully joined the meeting!");
  } catch {
    console.log("⚠️ Could not detect meeting UI — continuing anyway");
  }

  // 8️⃣ Start recording
  const recorder = new PuppeteerScreenRecorder(page, {
    followNewTab: true,
    fps: 24,
    videoFrame: { width: 1366, height: 768 },
    aspectRatio: "16:9",
  });

  await recorder.start(filePath);
  console.log(`🎬 Recording started → ${filePath}`);

  // 9️⃣ Monitor until meeting ends or 30 min timeout
  const RECORD_TIME_MS = 30 * 60 * 1000;
  console.log(`🕒 Recording will run up to ${RECORD_TIME_MS / 60000} minutes`);

  const start = Date.now();
  let meetingEnded = false;
  let joined = false;

  while (Date.now() - start < RECORD_TIME_MS && !meetingEnded) {
    try {
      const result = await page.evaluate(() => {
        const txt = document.body.innerText.toLowerCase();
        const hasControls = !!document.querySelector('[data-tid="meeting-call-controls"]');
        return {
          joined: hasControls,
          ended:
            txt.includes("call ended") ||
            txt.includes("left the meeting") ||
            txt.includes("something went wrong") ||
            txt.includes("rejoin"),
        };
      });

      if (result.joined) joined = true;
      if (joined && result.ended) {
        meetingEnded = true;
        console.log("🛑 Meeting ended — stopping recording");
        await recorder.stop();
        break;
      }
    } catch (err) {
      console.log("⚠️ Monitor error:", err.message);
    }
    await new Promise((r) => setTimeout(r, 8000));
  }

  // 🔚 Stop & close
  if (!meetingEnded) {
    console.log("🛑 Time limit reached — stopping recording");
    await recorder.stop();
  }

  await page.waitForTimeout(3000);
  await browser.close();
  console.log(`💾 Saved MP4 recording → ${filePath}`);
}
