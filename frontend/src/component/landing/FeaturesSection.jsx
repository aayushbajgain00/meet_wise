import React from "react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Automated Transcription",
    description:
      "Get accurate, real-time meeting transcripts so you never miss important details.",
    image: "/auth_transcript.png",
  },
  {
    title: "Smart Summaries",
    description:
      "Receive concise action items, key decisions, and highlights instantly after every call.",
    image: "/summaries.png",
  },
  {
    title: "Multi-Platform Support",
    description:
      "Seamlessly connect with Zoom, Teams, and Google Meet—MeetWise works wherever you do.",
    image: "/multi_platform.png",
  },
  {
    title: "Team Collaboration",
    description:
      "Share notes, assign tasks, and keep everyone aligned—all from one platform.",
    image: "/tech_collab.png",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-white py-20">
      <img
        src="/category_right_design.png"
        alt="Decorative dots"
        className="pointer-events-none absolute right-10 top-16 hidden h-28 w-28 lg:block"
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2563eb]">
            Category
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#1B1D29] sm:text-[42px]">
            We Offer Smart Meeting Solutions
          </h2>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
