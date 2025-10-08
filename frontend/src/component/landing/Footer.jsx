import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} MeetWise. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#features" className="hover:text-slate-900">
            Solutions
          </a>
          <a href="#testimonials" className="hover:text-slate-900">
            Testimonials
          </a>
          <a href="#team" className="hover:text-slate-900">
            Team
          </a>
        </div>
      </div>
    </footer>
  );
}
