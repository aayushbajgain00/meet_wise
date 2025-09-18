// src/utils/zoomSignature.js
import jwt from "jsonwebtoken";

export function generateZoomSignature(meetingNumber, role = 0) {
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2; // valid for 2 hours

  const payload = {
    sdkKey: process.env.ZOOM_CLIENT_ID,   // from Marketplace app
    mn: meetingNumber,
    role,  // 0 = participant, 1 = host
    iat,
    exp,
  };

  return jwt.sign(payload, process.env.ZOOM_CLIENT_SECRET, {
    algorithm: "HS256",
  });
}
