import React, { useMemo, useState } from "react";
import api from "../lib/api";
import { useToast } from "../component/toastprovider";
import TranscriptViewer from "../component/TranscriptViewer.jsx";
import Modal from "../component/Modal.jsx";

const toMB = (bytes) => (bytes / 1024 / 1024).toFixed(2);

export default function Upload() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { push } = useToast();

  const onFileChange = (event) => {
    const picked = event.target.files?.[0];
    setResult(null);
    setCancelled(false);
    setShowModal(false);
    setFile(picked || null);
  };

  const uploadAndTranscribe = async (selectedFile) => {
    const form = new FormData();
    form.append("file", selectedFile);

    const { data } = await api.post("/api/meetings/transcribe", form, {
      headers: { "Content-Type": "multipart/form-data" },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 0,
    });

    return data;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      push("Please choose an audio or video file first", "warning");
      return;
    }

    setBusy(true);
    try {
      const data = await uploadAndTranscribe(file);
      setResult(data);
      push("Transcription complete", "success");
      setShowModal(true);
    } catch (error) {
      console.error("Transcription request failed", error);
      const message =
        error?.response?.data?.message || error.message || "Transcription failed";
      push(message, "error");
    } finally {
      setBusy(false);
    }
  };

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      sizeMb: toMB(file.size),
      type: file.type || "Unknown",
    };
  }, [file]);

  return (
    <div className="container" style={{ display: "grid", gap: 24 }}>
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Upload & Transcribe</h1>
        <p className="mt-1 text-slate-500">
          Upload an audio or video file and we&apos;ll return an AI-generated transcript.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="card"
        style={{ display: "grid", gap: 16, maxWidth: 640 }}
      >
        <label className="font-semibold text-slate-700">Select recording</label>
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={onFileChange}
          disabled={busy}
        />

        {fileMeta ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-700">Selected File</p>
              <p>{fileMeta.name}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <p>
                <span className="font-semibold">Type:</span> {fileMeta.type}
              </p>
              <p>
                <span className="font-semibold">Size:</span> {fileMeta.sizeMb} MB
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="btn" disabled={busy}>
                {busy ? "Transcribing..." : "Transcribe"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={busy}
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setCancelled(true);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="btn" disabled={busy}>
            {busy ? "Transcribing..." : "Upload & Transcribe"}
          </button>
        )}
      </form>

      {result && !showModal && (
        <section className="card" style={{ display: "grid", gap: 16 }}>
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Transcript</h2>
              <p className="text-sm text-slate-500">
                Provider: {result.transcript?.provider || "Unknown"}
              </p>
            </div>
            <button
              type="button"
              className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
              onClick={() => setShowModal(true)}
            >
              View Transcript
            </button>
          </header>
          <TranscriptViewer
            text={result.transcript?.text || ""}
            segments={result.transcript?.segments || []}
            metadata={result.file}
          />
        </section>
      )}

      {cancelled && !file && !result && (
        <p className="text-sm text-slate-500">Upload cancelled.</p>
      )}

      {showModal && result && (
        <Modal
          title="Full Transcript"
          onClose={() => setShowModal(false)}
          actions={[
            {
              label: "Close",
              onClick: () => setShowModal(false),
            },
          ]}
        >
          <TranscriptViewer
            text={result.transcript?.text || ""}
            segments={result.transcript?.segments || []}
            metadata={result.file}
          />
        </Modal>
      )}
    </div>
  );
}
