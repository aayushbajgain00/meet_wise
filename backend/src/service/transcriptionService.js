import fs from "fs";
import OpenAI from "openai";

let cachedClient = null;

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error("Missing OPENAI_API_KEY environment variable");
    err.status = 500;
    throw err;
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }
  return cachedClient;
};

const MODEL_PREFERENCE = ["gpt-4o-mini-transcribe", "whisper-1"];
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 800;

const buildFileForOpenAI = async (filePath, originalName) => {
  const stream = fs.createReadStream(filePath);
  const safeName = originalName || `recording-${Date.now()}.mp3`;
  return OpenAI.toFile(stream, safeName);
};

export const transcribeRecording = async ({ filePath, originalName, mimeType }) => {
  const client = getOpenAIClient();
  const file = await buildFileForOpenAI(filePath, originalName);

  let lastErr;
  for (const model of MODEL_PREFERENCE) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      try {
        const response = await client.audio.transcriptions.create({
          model,
          file,
          response_format: "verbose_json",
          temperature: 0,
        });

        return {
          text: response.text,
          segments: response.segments,
          language: response.language,
          duration: response.duration,
          provider: `openai:${model}`,
          raw: response,
          file: {
            name: originalName,
            mimeType,
          },
        };
      } catch (error) {
        lastErr = error;

        const status = error?.status || error?.response?.status;
        const errorCode = error?.response?.data?.error?.code;
        const message = error?.response?.data?.error?.message || "";
        const isModelIssue =
          errorCode === "model_not_found" || message.toLowerCase().includes("model");
        const isNetworkIssue =
          error?.code === "ECONNRESET" || error?.cause?.code === "ECONNRESET";
        const isRetryable =
          isNetworkIssue || isModelIssue || [400, 408, 425, 429, 500, 502, 503, 504].includes(status);

        if (!isRetryable || attempt === MAX_RETRIES - 1) {
          break;
        }

        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!lastErr) {
      break;
    }
  }

  if (lastErr?.response?.data) {
    const err = new Error("OpenAI transcription error");
    err.status = lastErr.status || lastErr.response.status || 502;
    err.detail = lastErr.response.data;
    throw err;
  }

  if (lastErr?.code === "ECONNRESET" || lastErr?.cause?.code === "ECONNRESET") {
    const err = new Error("Failed to reach OpenAI. Please try again in a moment.");
    err.status = 504;
    throw err;
  }

  throw lastErr || new Error("Unknown transcription failure");
};
