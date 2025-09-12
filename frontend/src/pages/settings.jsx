export default function Settings() {
  return (
    <div className="container">
      <h1>Settings</h1>

      <section className="card" style={{ marginTop:12 }}>
        <h3>Consent & Notifications</h3>
        <label style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input type="checkbox" /> Require consent before recording
        </label>
        <label style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input type="checkbox" /> Auto-notify participants via email
        </label>
        <label style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input type="checkbox" /> Show in-app banner when recording starts
        </label>
        <button className="btn" style={{ marginTop:8 }}>Save</button>
      </section>
    </div>
  );
}
