import React from "react";

const teamMembers = [
  {
    name: "Aayush Bajgain",
    role: "Team Leader",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rachan Phuyal",
    role: "Product Strategist",
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Abin Tamang",
    role: "UX Researcher",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ashish Roka",
    role: "AI Engineer",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bhojraj Basnet",
    role: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Joshan Karki",
    role: "Customer Success",
    image: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?auto=format&fit=crop&w=400&q=80",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="bg-[#f8fafc] py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <header className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Meet the Team</h2>
          <p className="mt-3 text-base text-slate-600">
            Meet our team of professionals ready to serve you.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <img src={member.image} alt={member.name} className="h-60 w-full object-cover" />
              <div className="space-y-1 p-6 text-center">
                <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                <p className="text-sm font-medium text-[#2563eb]">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
