import React from "react";

const testimonial = {
  quote:
    "MeetWise has completely changed how our team works. No more scrambling for notes—everything is captured, summarized, and shared instantly.",
  name: "Ingso Limbu",
  role: "Project Manager, TechNova Solutions",
  avatar: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=200&q=80",
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <header className="text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#2563eb]">
            Testimonials
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            What People Say About MeetWise
          </h2>
        </header>

        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-[#f8fafc] p-8 shadow-sm sm:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="h-20 w-20 rounded-full object-cover shadow"
            />
            <div className="space-y-4">
              <p className="text-lg italic text-slate-700">“{testimonial.quote}”</p>
              <div>
                <p className="text-base font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 hidden flex-col gap-2 text-slate-300 md:flex">
            <span className="text-2xl">‹</span>
            <span className="text-2xl">›</span>
          </div>
        </div>
      </div>
    </section>
  );
}
