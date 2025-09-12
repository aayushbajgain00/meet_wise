import React, { useState } from "react";
import api from "../lib/api";
import { useToast } from "../component/toastprovider";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();

  const uploadWithRetry = async (f, tries = 3) => {
    let delay = 800;
    for (let i=0; i<tries; i++) {
      try {
        const form = new FormData();
        form.append("file", f);
        await api.post("/uploads", form, { headers: { "Content-Type": "multipart/form-data" }});
        push("Upload successful", "success");
        return;
      } catch (e) {
        if (i === tries - 1) throw e;
        await new Promise(r => setTimeout(r, delay));
        delay *= 2; // backoff
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return push("Please choose a file");
    setBusy(true);
    try { await uploadWithRetry(file); }
    catch { push("Upload failed after retries", "error"); }
    finally { setBusy(false); }
  };

  return (
    <div className="container">
      <h1>Upload</h1>
      <form onSubmit={onSubmit} className="card" style={{ display:"grid", gap:12, maxWidth:520 }}>
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0])} />
        <button className="btn" disabled={busy}>{busy ? "Uploading..." : "Upload"}</button>
      </form>
    </div>
  );
}
