import React from "react";

export default function FeatureCard({ image, title, description }) {
  return (
    <article className="flex h-full flex-col items-center gap-4 text-center">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-32 w-32 rounded-2xl object-cover shadow-md"
        />
        <span
          className="absolute -right-4 bottom-4 h-8 w-10 rounded-lg bg-[#FBE3C7]"
          aria-hidden="true"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#1B1D29]">{title}</h3>
        <p className="text-sm leading-6 text-[#4F566B]">{description}</p>
      </div>
    </article>
  );
}
