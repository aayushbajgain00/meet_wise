import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 z-50 w-full backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "bg-white/95 shadow-md py-2"
            : "bg-transparent shadow-none py-6"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 transition-all duration-300">
          {/* Left: Logo */}
          <Link to="/app" className="flex items-center gap-3">
            <img
              src="/MeetWise_logo.png"
              alt="Meetwise"
              className={`object-contain transition-all duration-300 ${
                scrolled ? "h-20" : "h-20"
              }`} // ✅ BIG logo (up to 112px tall)
            />
            <span
              className={`font-semibold text-[#1EA6FF] transition-all duration-300 ${
                scrolled ? "text-2xl" : "text-3xl"
              }`}
            >
              
            </span>
          </Link>

          {/* Center: Slogan */}
          <div className="hidden md:block text-center transition-all duration-300">
            <h1
              className={`font-semibold text-[#4F83E0] whitespace-nowrap ${
                scrolled
                  ? "text-[20px] sm:text-[22px]"
                  : "text-[26px] sm:text-[30px]"
              }`}
            >
              Never miss a word, Always stay wise
            </h1>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-[#1EA6FF] px-4 py-2 text-sm font-semibold text-[#1EA6FF] transition hover:bg-[#EAF6FF]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-[#1EA6FF] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#178cd6]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer below navbar */}
      <div className="h-32 md:h-36" />
    </>
  );
}
