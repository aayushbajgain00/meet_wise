import React from "react";

const teamMembers = [
  {
    name: "Aayush Bajgain",
    role: "Team Lead and FullStack Developer",
    image: "/aayush.png",
  },
  {
    name: "Rachan Phuyal",
    role: "AI/ML Developer",
    image: "/rachan.png",
  },
  {
    name: "Abin Tamang",
    role: "UI/UX Designer and frontend Developer",
    image: "/abin.png",
  },
  {
    name: "Ashish Roka",
    role: "Technical Lead and AI Developer ",
    image: "/aashish.png",
  },
  {
    name: "Bhojraj Basnet",
    role: "Full Stack Developer",
    image: "/bhoj.png",
  },
  {
    name: "Joshan Karki",
    role: "UI/UX Designer and QA Engineer",
    image: "/joshan.png",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="bg-[#f8fafc] py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#2563eb]">Team</p>
          <h2 className="mt-3 text-3xl font-bold text-[#1B1D29] sm:text-[42px]">Meet the Team</h2>
          <p className="mt-3 text-base text-[#4F566B]">
            A passionate team of builders working to make every meeting smarter.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              className="relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img src={member.image} alt={member.name} className="h-64 w-full object-cover" />
              <div className="space-y-1 p-6 text-center">
                <h3 className="text-lg font-semibold text-[#1B1D29]">{member.name}</h3>
                <p className="text-sm font-medium text-[#2563eb]">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
