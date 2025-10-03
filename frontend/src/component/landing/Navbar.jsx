import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2563eb] text-white shadow">
            <span className="text-xl font-black">🦉</span>
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900">Meetwise</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#2563eb]">
              Never miss a word
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 sm:flex">
          <a href="#features" className="hover:text-slate-900">
            Solutions
          </a>
          <a href="#testimonials" className="hover:text-slate-900">
            Testimonials
          </a>
          <a href="#team" className="hover:text-slate-900">
            Team
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-[#2563eb] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#1d4ed8]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
