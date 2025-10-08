// src/pages/Home.jsx
import React from "react";

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Make every meeting count
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          MeetWise helps you capture, organise, and summarise meetings effortlessly —
          so your team stays aligned and productive.
        </p>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Turn meetings into lasting knowledge
          </h2>
          <p className="text-gray-700 mb-6">
            Turn your meetings into reusable knowledge. MeetWise allows you to
            watch recorded sessions, review discussions, and extract valuable
            insights with ease.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
            Get Started →
          </button>
        </div>

        {/* Video */}
        <div className="w-full">
          <video
            className="w-full rounded-2xl shadow-lg"
            controls
            autoPlay
            muted
            loop
          >
            <source src="/vv2.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Extra Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <img
            src="vv.jpg"
            alt="Meeting screenshot"
            className="rounded-2xl shadow-lg"
          />
        </div>
        <div>
          <p className="text-gray-700 text-lg">
            Your meetings are always within reach. MeetWise keeps a clear,
            organized library of your recordings, ready to watch anytime,
            anywhere.
          </p>
        </div>
      </section>
    </div>
  );
}
