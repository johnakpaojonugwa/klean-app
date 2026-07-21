import React from "react";
import BlogBg from "@/assets/img-3.jpg";

export default function BlogHero() {
  return (
    <section className="relative min-h-[50vh] lg:min-h-[70vh] flex items-center pt-20 overflow-hidden bg-[#0f172a]">
      {/* THE BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 z-0">
        <img
          src={BlogBg}
          alt="Klean Laundry Blog and Insights"
          className="w-full h-full object-cover object-center opacity-85"
          loading="lazy"
          decoding="async"
        />
        {/* DYNAMIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2E56] via-[#1A2E56]/70 to-transparent z-10"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* MAIN CONTENT */}
          <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              Our <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px white" }}
              >
                Blog
              </span>
            </h1>

            <p className="text-slate-300 text-lg max-w-lg font-medium leading-relaxed">
              Tips, guides, and updates from the laundry and fabric care experts. Discover how to preserve your garments and keep them looking fresh.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM CURVE ACCENT */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20"></div>
    </section>
  );
}
