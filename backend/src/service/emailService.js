import nodemailer from "nodemailer";

let cachedTransporter = null;

const buildTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("Email service is not configured (missing SMTP credentials). Skipping email send.");
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return cachedTransporter;
};

const getTransporter = () => {
  if (cachedTransporter) return cachedTransporter;
  return buildTransporter();
};

export const sendTranscriptSummaryEmail = async ({ to, subject, summary, meetingId, transcriptUrl }) => {
  if (!to) {
    console.warn("Email not sent: missing recipient");
    return;
  }

  const transporter = getTransporter();
  if (!transporter) return; // configuration missing

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const safeSubject = subject?.trim() || "Transcript summary";
  const safeSummary = summary || "(No transcript text available)";

  const textBody = `Here is your transcript summary for "${safeSubject}":\n\n${safeSummary}\n\nMeeting ID: ${meetingId}`;
  const htmlBody = `
    <p>Here is your transcript summary for <strong>${safeSubject}</strong>:</p>
    <blockquote>${safeSummary}</blockquote>
    <p>Meeting ID: ${meetingId}</p>
    ${transcriptUrl ? `<p><a href="${transcriptUrl}">View full transcript</a></p>` : ""}
  `;

  await transporter.sendMail({
    from,
    to,
    subject: safeSubject,
    text: textBody,
    html: htmlBody,
  });
};
