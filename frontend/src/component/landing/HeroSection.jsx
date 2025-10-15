import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="absolute left-0 top-0 h-1 w-full bg-[#8ec5ff]" aria-hidden="true" />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-12 px-6 lg:flex-row lg:items-center">
        <div className="max-w-xl space-y-7">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#F26A32]">
            Smart Meetings. Clear Insights. Better Results
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] text-[#112240] sm:text-[52px]">
            Meet
            <span className="relative inline-block px-2 text-[#1B3D8F]">
              Smarter
              <span className="absolute inset-x-1 bottom-0 h-2 translate-y-1 rounded-full bg-[#F26A32]" aria-hidden="true" />
            </span>
            ,
            <br />
            Work Faster,
            <br />
            Decide Better
          </h1>
          <p className="text-base leading-7 text-[#4F566B]">
            MeetWise captures, transcribes, and summarizes your meetings in real time. Focus on the conversation while we
            handle the notes, action items, and insights—so your team never misses a detail.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="rounded-xl bg-[#F9B233] px-6 py-3 text-sm font-semibold text-[#1B1D29] shadow-sm transition hover:bg-[#f7a816]"
            >
              Find out more
            </Link>
            <button
              type="button"
              className="flex items-center gap-3 text-sm font-semibold text-[#4F566B] transition hover:text-[#1B1D29]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F26A32] text-white shadow">
                ►
              </span>
              Play Demo
            </button>
          </div>
        </div>

        <div className="relative w-full max-w-xl">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src="/section_1.png"
              alt="Team collaborating in a meeting"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
