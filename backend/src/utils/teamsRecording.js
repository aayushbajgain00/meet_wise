import axios from "axios";
import fs from "fs";
import path from "path";
import { getTeamsAccessTokenForAppUser } from "./teamsAuth.js";

/**
 * Fetches and saves the full Teams recording once available in OneDrive/SharePoint.
 * @param {string} userId - The MongoDB _id of the user who owns the meeting.
 * @param {string} meetingId - The Microsoft Graph meeting ID.
 * @returns {Promise<string|null>} - Path to saved file or null if failed.
 */
export async function fetchAndSaveRecording(userId, meetingId) {
  const accessToken = await getTeamsAccessTokenForAppUser(userId);
  const outputDir = path.resolve("public", "recordings");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `teams_${meetingId}.mp4`);
  let recording = null;
  let tries = 0;
  const maxTries = 15; // Try up to 15 times (~5 minutes total)
  const waitMs = 20000; // 20 seconds per retry

  console.log(`📡 Waiting for Teams recording of meeting ${meetingId}...`);

  // Poll Microsoft Graph until the recording becomes "available"
  while (tries < maxTries) {
    tries++;
    try {
      const res = await axios.get(
        `https://graph.microsoft.com/v1.0/me/onlineMeetings/${meetingId}/recordings`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const recs = res.data.value || [];
      if (recs.length > 0) {
        const available = recs.find((r) => r.status === "available");
        if (available) {
          recording = available;
          console.log(`✅ Recording is ready (attempt ${tries})`);
          break;
        } else {
          console.log(`⏳ Attempt ${tries}: Recording not ready (status: ${recs[0].status})`);
        }
      } else {
        console.log(`⏳ Attempt ${tries}: No recording yet.`);
      }
    } catch (err) {
      console.warn(`⚠️ Attempt ${tries} failed: ${err.message}`);
    }

    // Wait before retrying
    await new Promise((r) => setTimeout(r, waitMs));
  }

  if (!recording) {
    console.error("❌ Recording never became available after max retries.");
    return null;
  }

  console.log("🎬 Downloading Teams recording...");

  try {
    const recId = recording.id;
    const recStream = await axios.get(
      `https://graph.microsoft.com/v1.0/me/onlineMeetings/${meetingId}/recordings/${recId}/content`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        responseType: "stream",
      }
    );

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(outputPath);
      recStream.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log(`📼 Recording successfully saved: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.error("❌ Failed to download recording:", err.message);
    return null;
  }
}
