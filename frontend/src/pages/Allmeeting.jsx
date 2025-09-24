import React, { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import api from "../lib/api"; // <-- axios instance you already created

export default function AllMeetings() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    // Load meetings from backend
    api.get("/meetings")
      .then((res) => setMeetings(res.data))
      .catch((err) => console.error("Error fetching meetings:", err));
  }, []);

  const statusColors = {
    Completed: "bg-green-100 text-green-700 border border-green-300",
    Ongoing: "bg-blue-100 text-blue-700 border border-blue-300",
    Failed: "bg-red-100 text-red-700 border border-red-300",
    Upcoming: "bg-purple-100 text-purple-700 border border-purple-300",
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Meetings</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="px-4 py-2 flex items-center gap-2">
                  <FaFileAlt className="text-gray-600" /> {m.title}
                </td>
                <td className="px-4 py-2">{m.date}</td>
                <td className="px-4 py-2">{m.duration}</td>
                <td className="px-4 py-2">{m.time}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${statusColors[m.status]}`}>
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
