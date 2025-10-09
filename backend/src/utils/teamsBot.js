import puppeteer from "puppeteer";

export async function joinTeamsMeeting(joinUrl) {
  console.log(`🤖 Launching browser to join Teams meeting: ${joinUrl}`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-fake-ui-for-media-stream",
    ],
  });

  const page = await browser.newPage();
  await page.goto(joinUrl, { waitUntil: "networkidle2", timeout: 60000 });

  try {
    // Step 1: Click "Join on web instead"
    const joinOnWebButton = await Promise.race([
      page.waitForSelector("button[data-tid='joinOnWeb']", { timeout: 15000 }),
      page.waitForSelector("button.join-btn", { timeout: 15000 }),
    ]);
    if (joinOnWebButton) {
      await joinOnWebButton.click();
      console.log("✅ Clicked 'Join on Web Instead'");
    }

    // Wait a bit for the next screen
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 2: Fill guest name if asked
    // const nameField = await page.$("input[name='username'], input[data-tid='guest-name-input']");
    // if (nameField) {
    //   await nameField.click({ clickCount: 3 });
    //   await nameField.type("MeetWise Bot", { delay: 50 });
    //   console.log("✏️ Entered bot name: MeetWise Bot");
    // }

    // Step 2: Fill guest name if asked and click Join
const nameField = await page.$("input[data-tid='guest-name-input']");
if (nameField) {
  await nameField.click({ clickCount: 3 });
  await nameField.type("MeetWise Bot 🤖", { delay: 40 });
  console.log("✏️ Entered bot name: MeetWise Bot 🤖");

  // Click join button directly after typing name
  const joinBtn = await page.$("button[data-tid='prejoin-join-button']");
  if (joinBtn) {
    await joinBtn.click();
    console.log("✅ Clicked 'Join Now' after typing name");
  } else {
    console.warn("⚠️ Join button not found — Teams UI may have changed.");
  }
}


    // Step 3: Click “Join now” or equivalent
    const joinButton =
      (await page.$("button[data-tid='prejoin-join-button']")) ||
      (await page.$("button[data-tid='prejoin-join-button__guest']")) ||
      (await page.$("button[aria-label*='Join now']")) ||
      (await page.$("button[type='submit']"));
    if (joinButton) {
      await joinButton.click();
      console.log("✅ Clicked 'Join Now'");
    } else {
      console.warn("⚠️ Could not find Join button — might already be inside meeting.");
    }

    // Step 4: Optional — verify the bot is in meeting
    const inMeeting = await page.$("div[data-tid='meeting-state-banner']");
    if (inMeeting) console.log("✅ Verified: Bot is inside meeting UI");

    // Step 5: Stay in meeting (2 minutes)
    await new Promise(resolve => setTimeout(resolve, 120000)); // 2 mins
    console.log("🎉 Bot stayed in the meeting for 2 minutes.");

    // Step 6: Leave meeting gracefully
    await page.close();
    await browser.close();
    console.log("👋 Bot left the meeting.");
  } catch (err) {
    console.error("❌ Join error:", err.message);
    await browser.close();
  }
}





// import puppeteer from "puppeteer";

// export async function joinTeamsMeeting(joinUrl) {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: [
//       "--use-fake-ui-for-media-stream",
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//     ],
//   });

//   const page = await browser.newPage();
//   await page.goto(joinUrl);

//   console.log(`🤖 Bot is attempting to join Microsoft Teams meeting: ${joinUrl}`);

//   try {
//     await page.waitForSelector("button[data-tid='joinOnWeb']",{timeout:10000});
//     await page.click("button[data-tid='joinOnWeb']");
//     console.log("✅ Joined via web");
//   } catch (err) {
//     console.error("❌ Unable to auto-join", err.message);
//   }
// }
