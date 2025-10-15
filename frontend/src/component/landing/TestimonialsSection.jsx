import React from "react";

const testimonial = {
  quote:
    "MeetWise has completely changed how our team works. No more scrambling for notes—everything is captured, summarized, and shared instantly.",
  name: "Ingso Limbu",
  role: "Project Manager, TechNova Solutions",
  avatar: "/testimonials.png",
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 lg:flex-row lg:items-center lg:justify-between">
        <header className="max-w-md space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7B8196]">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold text-[#1B1D29] sm:text-[42px]">
            What People Say About MeetWise
          </h2>
          <div className="flex items-center gap-2 pt-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1B1D29]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#DDE1EA]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#DDE1EA]" />
          </div>
        </header>

        <div className="relative max-w-2xl rounded-3xl bg-white px-8 py-10 shadow-xl">
          <div className="absolute -top-8 left-10 h-16 w-16 overflow-hidden rounded-full shadow-lg">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="h-full w-full object-cover"
            />
          </div>
          <blockquote className="pt-10 text-lg leading-8 text-[#4F566B]">
            “{testimonial.quote}”
          </blockquote>
          <footer className="mt-6 text-sm text-[#7B8196]">
            <p className="text-base font-semibold text-[#1B1D29]">{testimonial.name}</p>
            <p>{testimonial.role}</p>
          </footer>
        </div>
      </div>
    </section>
  );
}
