import React, { useState } from "react";
import "./homepage.css";

export default function HomePage() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="hp">
      {/* Thin blue divider */}
      <div className="hp-divider" />

      {/* Success pill */}
      {showBanner && (
        <div className="hp-success" role="status">
          You Are Successfully Logged In
        </div>
      )}

      {/* Hero with play + caption */}
      <section className="hp-hero">
        <div className="hp-hero-media">
          <img
            src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=1200&auto=format&fit=crop"
            alt="Video guide"
          />
          <button className="hp-play" aria-label="Play video guide">▶</button>
        </div>
        <div className="hp-hero-caption">Video Guide to our website</div>
      </section>

      {/* Floating help button */}
      <button className="hp-help" title="Help" aria-label="Help">?</button>
    </div>
  );
}
