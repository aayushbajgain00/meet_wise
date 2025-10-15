import React, { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";

export default function Recordings() {
  const [recordings, setRecordings] = useState([]);
  const [selected, setSelected] = useState(null);

  // Fetch recordings from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/recordings")
      .then((res) => res.json())
      .then((data) => setRecordings(data))
      .catch((err) => console.error("Error loading recordings:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center gap-3 mb-6">
        <FaVideo className="text-3xl text-sky-600" />
        <h1 className="text-3xl font-bold text-gray-800">Meeting Recordings</h1>
      </div>

      {recordings.length === 0 ? (
        <p className="text-gray-500">No recordings found yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recordings.map((r) => (
            <div
              key={r.name}
              className="border border-gray-200 rounded-xl shadow-sm bg-white p-4 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelected(r.url)}
            >
              <video
                src={r.url}
                className="w-full h-32 object-cover rounded-md mb-3 bg-gray-200"
                muted
                preload="metadata"
              />
              <div className="text-center">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {r.name}
                </p>
                <p className="text-xs text-gray-500">
                  {r.size} • {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-xl shadow-lg p-4 w-11/12 md:w-3/4 lg:w-1/2">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>
            <video
              src={selected}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
