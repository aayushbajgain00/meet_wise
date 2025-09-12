import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "../component/toastprovider"; // ✅ lowercase path

export default function MeetingStatus() {
  const toast = useToast();
  const push = toast?.push ?? (() => {}); // ✅ safe fallback

  const [jobs, setJobs] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/jobs");
      setJobs(data || []);
    } catch (e) {
      push("Could not load jobs (backend not reachable)", "error");
      // Mock data so UI still shows
      setJobs([
        { id: "job123", status: "processing" },
        { id: "job124", status: "failed", error: "Timeout contacting Zoom" },
      ]);
    }
  };

  const retry = async (id) => {
    try {
      await api.post(`/jobs/${id}/retry`);
      push("Retry triggered", "success");
      load();
    } catch {
      push("Retry failed", "error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h1>Meeting Status</h1>
      <div className="card" style={{ display: "grid", gap: 8 }}>
        {jobs.map((j) => (
          <div
            key={j.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <b>{j.id}</b> — {j.status} {j.error ? `• ${j.error}` : ""}
            </div>
            {j.status === "failed" && (
              <button className="btn" onClick={() => retry(j.id)}>
                Retry
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
