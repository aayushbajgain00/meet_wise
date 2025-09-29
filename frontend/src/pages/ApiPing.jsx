import React, { useState } from "react";
import api from "../lib/api";

export default function ApiPing() {
  const [out, setOut] = useState("");

  const ping = async () => {
    try {
      const { data } = await api.get("/health");
      setOut(JSON.stringify(data));
    } catch (e) {
      setOut("Failed: " + (e?.message || "unknown"));
      console.error(e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <button onClick={ping}>Ping Backend</button>
      <pre>{out}</pre>
    </div>
  );
}
