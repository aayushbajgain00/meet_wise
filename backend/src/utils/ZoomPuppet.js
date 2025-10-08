import puppeteer from "puppeteer";
import { generateZoomSignature } from "./ZoomSignature.js";

export async function joinZoomMeeting(meetingId, password = "") {
  const signature = generateZoomSignature(meetingId, 0);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--use-fake-ui-for-media-stream", // auto-allow mic/cam
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  const page = await browser.newPage();

  await page.setContent(`
    <html>
      <body>
        <script src="https://source.zoom.us/2.18.0/lib/vendor/react.min.js"></script>
        <script src="https://source.zoom.us/2.18.0/lib/vendor/react-dom.min.js"></script>
        <script src="https://source.zoom.us/zoom-meeting-2.18.0.min.js"></script>
        <script>
          ZoomMtg.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
          ZoomMtg.preLoadWasm();
          ZoomMtg.prepareJssdk();

          ZoomMtg.init({
            leaveUrl: "https://zoom.us",
            success: function() {
              ZoomMtg.join({
                sdkKey: "${process.env.ZOOM_CLIENT_ID}",
                signature: "${signature}",
                meetingNumber: "${meetingId}",
                userName: "MeetWise Bot",
                passWord: "${password}",
                success: () => console.log("✅ Bot joined meeting!"),
                error: (err) => console.error("❌ Join error", err)
              });
            },
            error: (err) => console.error("❌ Init error", err)
          });
        </script>
      </body>
    </html>
  `);

  console.log(`🤖 Bot is attempting to join Zoom meeting ${meetingId}`);
}
