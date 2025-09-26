import { useEffect, useMemo, useState } from "react";
import { FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import api from "../lib/api";
import TranscriptViewer from "../component/TranscriptViewer.jsx";

const bytesToMb = (bytes = 0) => (bytes / 1024 / 1024).toFixed(2);

export default function Transcripts() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [cancelled, setCancelled] = useState(false);

  // Fetch meeting list from backend
  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/meetings"); // matches index.js
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  // Handle upload (from input)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) prepareFile(file);
    // allow re-selecting the same file
    e.target.value = "";
  };

  // Handle drag/drop upload
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) prepareFile(file);
  };
  const prepareFile = (file) => {
    setSelectedFile(file);
    setTranscription(null);
    setCancelled(false);
  };

  const uploadMeetingRecord = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/meetings/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const transcribeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/api/meetings/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 0,
    });
    return res.data;
  };

  const startTranscription = async () => {
    if (!selectedFile) return;

    setBusy(true);
    try {
      console.log("I1")
      const meeting = await uploadMeetingRecord(selectedFile);
      setFiles((prev) => [meeting, ...prev]);

      const transcriptData = await transcribeFile(selectedFile);
      setTranscription(transcriptData);
      setSelectedFile(null);
      setCancelled(false);
    } catch (err) {
      console.error("Transcription failed", err);
    } finally {
      setBusy(false);
    }
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setTranscription(null);
    setCancelled(true);
  };

  // Delete meeting
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/meetings/${id}`);
      setFiles((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const fileMeta = useMemo(() => {
    if (!selectedFile) return null;
    return {
      name: selectedFile.name,
      type: selectedFile.type || "Unknown",
      size: bytesToMb(selectedFile.size),
    };
  }, [selectedFile]);

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-center text-lg text-sky-600 font-medium mb-6">
        Never miss a word, Always stay wise
      </h2>

      {/* Upload Section */}
      <div className="mb-6 grid gap-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <FaCloudUploadAlt className="text-4xl mx-auto text-gray-500 mb-3" />
          <p className="mb-2 text-gray-600">Drag & drop or click to upload</p>
          <label className="cursor-pointer inline-block px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
            Browse File
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>
          <p className="text-sm text-gray-400 mt-2">Audio or video, up to 50MB</p>
        </div>

        {fileMeta && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-800">File ready to upload</p>
                <p>{fileMeta.name}</p>
                <p>
                  Type: {fileMeta.type} • Size: {fileMeta.size} MB
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={startTranscription}
                  disabled={busy}
                  className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${busy ? "bg-sky-300" : "bg-sky-500 hover:bg-sky-600"}`}
                >
                  {busy ? "Transcribing..." : "Transcribe"}
                </button>
                <button
                  type="button"
                  onClick={cancelSelection}
                  disabled={busy}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {cancelled && !selectedFile && !transcription && (
          <p className="text-sm text-slate-500">Upload cancelled.</p>
        )}

        {transcription && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Transcript Preview</h3>
            <TranscriptViewer
              text={transcription.transcript?.text || ""}
              segments={transcription.transcript?.segments || []}
              metadata={transcription.file}
            />
          </div>
        )}
      </div>

      {/* History */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-4">History</h3>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : files.length === 0 ? (
          <p className="text-gray-400">No transcripts uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {files.map((meeting) => (
              <li
                key={meeting._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center gap-2">
                  <FaFileAlt className="text-gray-500" />
                  <span className="font-medium">{meeting.topic}</span>
                  <span className="text-sm text-gray-400 ml-2">
                    {new Date(meeting.createdAt).toDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  {/* File access */}
                  {meeting.recordings?.[0]?.localPath && (
                    <a
                      href={`http://localhost:5000/${meeting.recordings[0].localPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      View
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(meeting._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
