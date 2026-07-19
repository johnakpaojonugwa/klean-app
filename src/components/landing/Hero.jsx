import React from "react";
import { ArrowRight, Calendar, Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import HeroBg from "@/assets/image2.jpg";

export default function Hero() {
  const scrollToHow = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* THE BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 z-0">
        <img
          src={HeroBg}
          alt="Modern Laundry Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"  
          decoding="async"
        />
        {/* DYNAMIC OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0F172A]/95 via-[#0F172A]/80 to-transparent z-10" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* MAIN CONTENT */}
          <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            {/* Trust Badge */}
            <div className="flex items-center gap-2 w-fit bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">
                ⭐ Premium Laundry Experience
              </p>
            </div>

            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter">
              You do life <br />
              <span className="text-[#4F7DF3]">we do the cleaning.</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-lg leading-relaxed font-medium">
              We combine advanced technology with traditional care to provide
              the finest laundry and dry cleaning service in the city. Fast,
              reliable, and eco-friendly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="bg-[#4F7DF3] text-white px-8 py-5 rounded-2xl font-black tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl shadow-[#4F7DF3]/30"
              >
                SCHEDULE PICKUP <ArrowRight size={16} />
              </Link>

              <button
                onClick={scrollToHow}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-5 rounded-2xl font-black tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white/20 transition-all"
              >
                <Play size={14} fill="currentColor" />
                HOW IT WORKS
              </button>
            </div>

            {/* Features List */}
            <div className="flex flex-wrap gap-6 pt-4">
              {["24h Turnaround", "Eco-Friendly", "Free Delivery"].map(
                (text) => (
                  <div key={text} className="flex items-center gap-2">
                    <CheckCircle
                      size={18}
                      className="text-[#4F7DF3] shrink-0"
                    />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-100">
                      {text}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
