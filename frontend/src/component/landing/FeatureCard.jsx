import React from "react";

export default function FeatureCard({ icon, title, description }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#2563eb]/10 text-3xl">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </article>
  );
}
