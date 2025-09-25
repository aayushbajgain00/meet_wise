import { useEffect, useState } from "react";
import { FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import api from "../lib/api";

export default function Transcripts() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) await uploadFile(file);
  };

  // Handle drag/drop upload
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) await uploadFile(file);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/meetings/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles([res.data, ...files]);
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // Delete meeting
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/meetings/${id}`);
      setFiles(files.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-center text-lg text-sky-600 font-medium mb-6">
        Never miss a word, Always stay wise
      </h2>

      {/* Upload Section */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 bg-white"
        onDragOver={(e) => e.preventDefault()} // prevent browser from opening file
        onDrop={handleDrop}
      >
        <FaCloudUploadAlt className="text-4xl mx-auto text-gray-500 mb-3" />
        <p className="mb-2 text-gray-600">Drag & drop or click to upload</p>
        <label className="cursor-pointer inline-block px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
          Browse File
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
        <p className="text-sm text-gray-400 mt-2">
          PDF, audio, or video, up to 50MB
        </p>
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
