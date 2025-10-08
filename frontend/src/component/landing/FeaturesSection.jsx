import React from "react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Automated Transcription",
    description:
      "Get accurate, real-time meeting transcripts so you never miss important details.",
    icon: "📝",
  },
  {
    title: "Smart Summaries",
    description:
      "Receive concise action items, key decisions, and highlights instantly after every call.",
    icon: "✨",
  },
  {
    title: "Multi-Platform Support",
    description:
      "Seamlessly connect with Zoom, Teams, and Google Meet—MeetWise works wherever you do.",
    icon: "🔗",
  },
  {
    title: "Team Collaboration",
    description:
      "Share notes, assign tasks, and keep everyone aligned—all from one platform.",
    icon: "🤝",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#f8fafc] py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#2563eb]">
            Category
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            We Offer Smart Meeting Solutions
          </h2>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
