import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-8 px-6">
        {/* Logos Section - Left */}
        <div className="flex items-center gap-6">
            <img
            src="/1.jpeg"
            alt="Readygrad Logo"
            className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
          />
          <img
            src="/2.jpeg"
            alt="College Logo"
            className="h-8 w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
          />
        
        </div>

        {/* Copyright - Right */}
        <p className="text-sm text-slate-500 transition-colors duration-300 hover:text-slate-700">
          © {new Date().getFullYear()} MeetWise. All rights reserved.
        </p>
      </div>
    </footer>
  );
}