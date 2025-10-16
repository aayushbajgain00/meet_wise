import { useEffect, useMemo, useState } from "react";
import { FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import api from "../lib/api";
import TranscriptViewer from "../component/TranscriptViewer.jsx";
import Modal from "../component/Modal.jsx";
import { useToast } from "../component/toastprovider.jsx";

const bytesToMb = (bytes = 0) => (bytes / 1024 / 1024).toFixed(2);

export default function Transcripts() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareMeeting, setShareMeeting] = useState(null);
  const [shareEmails, setShareEmails] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [shareLoading, setShareLoading] = useState(false);
  const toast = useToast();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/meetings");
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching transcripts", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    try {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setUserEmail(String(parsed.email).trim());
        }
      }
    } catch (err) {
      console.warn("Unable to parse stored user info", err);
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) prepareFile(file);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) prepareFile(file);
  };

  const prepareFile = (file) => {
    setSelectedFile(file);
    setTitle("");
    setCancelled(false);
  };

  const transcribeFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    if (title.trim()) {
      formData.append("title", title.trim());
    }
    if (userEmail) {
      formData.append("email", userEmail);
    }

    const { data } = await api.post("/api/meetings/transcribe", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 0,
    });
    return data;
  };

  const startTranscription = async () => {
    if (!selectedFile) return;
    setBusy(true);
    try {
      const result = await transcribeFile(selectedFile);
      const meeting = result?.meeting;

      if (meeting) {
        setRecords((prev) => [meeting, ...prev]);
        setActiveMeeting(meeting);
        setShowModal(true);
      } else {
        await fetchHistory();
      }

      setSelectedFile(null);
      setTitle("");
      setCancelled(false);
    } catch (error) {
      console.error("Transcription failed", error);
    } finally {
      setBusy(false);
    }
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setTitle("");
    setCancelled(true);
    setTranscribeProgress(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/meetings/${id}`);
      setRecords((prev) => prev.filter((item) => item._id !== id));
      if (activeMeeting?._id === id) {
        setShowModal(false);
        setActiveMeeting(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleShare = (meeting) => {
    setShareMeeting(meeting);
    setShareEmails("");
    setShareMessage("");
    setShareModalOpen(true);
  };

  const submitShare = async (event) => {
    event.preventDefault();
    if (!shareMeeting) return;

    const emails = String(shareEmails || "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    if (!emails.length) {
      alert("Please enter at least one email address.");
      return;
    }

    setShareLoading(true);
    try {
      await api.post(`/api/meetings/${shareMeeting._id}/share`, {
        emails,
        message: shareMessage,
      });
      toast?.push?.("Transcript shared successfully", "success");
      setShareModalOpen(false);
      setShareMeeting(null);
    } catch (error) {
      console.error("Share failed", error);
      toast?.push?.(
        error?.response?.data?.message || error.message || "Failed to share transcript.",
        "error"
      );
    } finally {
      setShareLoading(false);
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
      <h2 className="text-center text-lg text-sky-600 font-medium mb-6">
        Never miss a word, Always stay wise
      </h2>

      <div className="mb-6 grid gap-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <FaCloudUploadAlt className="text-4xl mx-auto text-gray-500 mb-3" />
          <p className="mb-2 text-gray-600">Drag & drop or click to upload</p>
          <label className="cursor-pointer inline-block px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
            Browse File
            <input type="file" className="hidden" accept="audio/*,video/*" onChange={handleFileUpload} />
          </label>
          <p className="text-sm text-gray-400 mt-2">Audio or video, up to 50MB</p>
        </div>

        {fileMeta && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-800">File ready to transcribe</p>
                <p>{fileMeta.name}</p>
                <p>Type: {fileMeta.type} • Size: {fileMeta.size} MB</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Transcript title</label>
              <input
                type="text"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="e.g. Weekly standup recording"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={busy}
              />
            </div>
            <div className="flex items-center gap-3">
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
        )}

        {cancelled && !selectedFile && (
          <p className="text-sm text-slate-500">Upload cancelled.</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-gray-700 font-semibold mb-4">History</h3>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-400">No transcripts uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {records.map((meeting) => (
              <li
                key={meeting._id}
                className="flex flex-col gap-2 border border-slate-200 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <FaFileAlt className="text-slate-500 mt-1" />
                  <div>
                    <p className="font-semibold text-slate-800">{meeting.topic || "Uploaded transcript"}</p>
                    <p className="text-xs text-slate-500">
                      {meeting.createdAt ? new Date(meeting.createdAt).toLocaleString() : ""}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(meeting.transcript?.segments?.length || 0)} segments · {meeting.transcript?.lang?.toUpperCase?.() || ""}
                    </p>
                    {meeting.insights?.summary && (
                      <p className="mt-2 text-xs italic text-slate-500">
                        {meeting.insights.summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMeeting(meeting);
                      setShowModal(true);
                    }}
                    className="px-4 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(meeting)}
                    className="px-4 py-2 rounded-md border border-sky-500 text-sky-500 text-sm font-semibold hover:bg-sky-50"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(meeting._id)}
                    className="px-4 py-2 rounded-md border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showModal && activeMeeting && (
        <Modal
          title={activeMeeting.topic || "Transcript"}
          onClose={() => setShowModal(false)}
          actions={[{ label: "Close", onClick: () => setShowModal(false) }]}
        >
          {activeMeeting.insights?.summary && (
            <p className="mb-4 text-sm italic text-slate-600">
              {activeMeeting.insights.summary}
            </p>
          )}
          <TranscriptViewer
            text={activeMeeting.transcript?.textFull || activeMeeting.transcript?.text || ""}
            segments={activeMeeting.transcript?.segments || []}
            metadata={{ name: activeMeeting.topic }}
          />
        </Modal>
      )}

      {shareModalOpen && shareMeeting && (
        <Modal
          title={`Share “${shareMeeting.topic || "Transcript"}”`}
          onClose={() => setShareModalOpen(false)}
        >
          <form className="space-y-4" onSubmit={submitShare}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email addresses
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="teammate@example.com, manager@example.com"
                value={shareEmails}
                onChange={(event) => setShareEmails(event.target.value)}
                disabled={shareLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Message (optional)
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                rows={3}
                placeholder="Add a short note"
                value={shareMessage}
                onChange={(event) => setShareMessage(event.target.value)}
                disabled={shareLoading}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600"
                disabled={shareLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-70"
                disabled={shareLoading}
              >
                {shareLoading ? "Sharing..." : "Share"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
