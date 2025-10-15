import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex  w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/MeetWise_logo.png"
            alt="Meetwise"
            className="h-14 w-auto"
          />
          <span className="sr-only">Meetwise homepage</span>
        </Link>

        <p className="hidden text-xl font-semibold text-[#1EA6FF] underline underline-offset-4 sm:block">
          Never miss a word, Always stay wise
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl border border-[#1EA6FF] px-4 py-2 text-sm font-semibold text-[#1EA6FF] transition hover:bg-[#EAF6FF]"
          >
            login
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-[#1EA6FF] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#178cd6]"
          >
            Sign up
          </Link>
        </div>
      </div>
      <div className="h-px w-full bg-[#85c6ff]" aria-hidden="true" />
    </header>
  );
}
