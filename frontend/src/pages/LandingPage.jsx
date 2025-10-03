import React from "react";

import Navbar from "../component/landing/Navbar.jsx";
import HeroSection from "../component/landing/HeroSection.jsx";
import FeaturesSection from "../component/landing/FeaturesSection.jsx";
import TestimonialsSection from "../component/landing/TestimonialsSection.jsx";
import TeamSection from "../component/landing/TeamSection.jsx";
import Footer from "../component/landing/Footer.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  );
}
