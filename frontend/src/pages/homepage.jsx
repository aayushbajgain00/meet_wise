import React from "react";
import "./homepage.css";

export default function HomePage() {
  return (
    <>
      {/* Search + Button */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or keyword..."
          aria-label="Search by title or keyword"
        />
        <button type="button">Capture</button>
      </div>

      {/* Welcome Card */}
      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="media">
          <img
            src="https://via.placeholder.com/600x300"
            alt="Meetwise demo placeholder"
          />
        </div>
        <h2 id="welcome-title">Welcome Aboard, User! 🎉</h2>
        <p>
          Meetwise is ready to automate your meetings and streamline your
          workflows. Let’s get started with smarter collaboration today.
        </p>
      </section>
    </>
  );
}
