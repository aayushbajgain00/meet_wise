import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "../component/toastprovider";

export default function MeetingStatus() {
  const toast = useToast();
  const push = toast?.push ?? (() => {});

  const [meetings, setMeetings] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/meetings/status");
      setMeetings(data || []);
    } catch (e) {
      push("Could not load meetings (backend not reachable)", "error");
      // Mock data for UI
      setMeetings([
        {
          id: "1",
          title: "Team Sync",
          date: "28 Aug 25",
          duration: "45 mins",
          status: "Completed",
        },
        {
          id: "2",
          title: "Client Meeting",
          date: "25 Aug 25",
          duration: "1 hr",
          status: "Completed",
        },
      ]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h1>Meeting status</h1>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 16,
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
              }}
            >
              Title
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
              }}
            >
              Date
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
              }}
            >
              Duration
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((m) => (
            <tr key={m.id}>
              <td style={{ padding: "8px" }}>{m.title}</td>
              <td style={{ padding: "8px" }}>{m.date}</td>
              <td style={{ padding: "8px" }}>{m.duration}</td>
              <td style={{ padding: "8px" }}>{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
