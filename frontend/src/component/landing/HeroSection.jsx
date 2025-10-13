import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-start">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">
            Smart Meetings. Clear Insights. Better Results
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Meet <span className="text-[#2563eb]">Smarter</span>, Work Faster, Decide Better
          </h1>
          <p className="text-lg text-slate-600">
            MeetWise captures, transcribes, and summarizes your meetings in real time. Focus on the conversation while we handle the notes, action items, and insights—so your team never misses a detail.
          </p>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-amber-300"
            >
              Find out more
            </Link>
            <a
              href="#demo"
              className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-900 shadow">
                ►
              </span>
              Play Demo
            </a>
          </div>
        </div>

        <div className="relative w-full max-w-xl">
          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80"
              alt="Team collaborating"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden h-24 w-24 rounded-2xl bg-[#2563eb]/10 lg:block" />
        </div>
      </div>
    </section>
  );
}
