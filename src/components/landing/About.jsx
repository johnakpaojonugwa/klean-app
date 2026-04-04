import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import AboutPerson from "@/assets/about.gif";

export default function About() {
  const [activeTab, setActiveTab] = useState("vision");

  const content = {
    mission:
      "To provide world-class laundry solutions that simplify lives through quality care and prompt delivery.",
    vision:
      "To be the leading provider of premium laundry and dry cleaning services in Nigeria, delivering excellence, reliability, and innovation.",
    faith:
      "We believe in integrity, customer obsession, and the pursuit of perfect cleanliness in every fabric we touch.",
  };

  return (
    <section className="py-24 bg-[#4F7DF3]/10 relative overflow-hidden">
      {/* BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 pointer-events-none overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center lg:justify-end">
          <div className="relative w-full lg:w-[60%] h-[70%] lg:h-[85%] opacity-40 lg:opacity-100">
            <img
              src={AboutPerson}
              alt="Background image of a person doing laundry"
              className="w-full h-full object-contain object-center lg:object-right"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[#4F7DF3]/5 lg:bg-transparent backdrop-blur-[2px] lg:backdrop-blur-none" />
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_100%)] lg:[mask-image:radial-gradient(ellipse_at_right,transparent_20%,black_90%)] pointer-events-none" 
                 style={{ backgroundColor: 'rgba(79, 125, 243, 0.1)' }} />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#4F7DF3]/20">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F7DF3]">
              About Klean
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#4F7DF3] uppercase tracking-tighter">
            Our Mission & Core Values.
          </h2>
          <p className="text-slate-600 max-w-2xl text-sm md:text-base font-medium">
            Klean Enterprise is a family business specialising in high quality, 
            Commercial Drycleaning & Domestic Laundry using non-aggressive 
            eco-friendly technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="flex flex-col space-y-10 max-w-xl">
            
            {/* TAB NAVIGATION - ANIMATED UNDERLINE */}
            <div className="flex flex-wrap gap-x-10 gap-y-2 border-b border-white/40">
              {["mission", "vision", "faith"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[12px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer relative ${
                    activeTab === tab ? "text-[#4F7DF3]" : "text-slate-400 hover:text-slate-500"
                  }`}
                >
                  {tab === "faith" ? "Article of Faith" : tab}
                  
                  {/* ACTIVE UNDERLINE: Animates from left on click */}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#4F7DF3] animate-in fade-in slide-in-from-left-full duration-300 ease-out" />
                  )}
                </button>
              ))}
            </div>

            {/* CONTENT CARD */}
            <div className="backdrop-blur-md p-8 md:p-12 rounded-[40px] min-h-[100px] flex flex-col justify-center transition-all duration-500">
              <h3 className="text-[#4F7DF3] text-[11px] font-black tracking-[0.3em] uppercase mb-4">
                Our {activeTab === "faith" ? "Core Belief" : activeTab}
              </h3>
              <p className="text-[#0F172A] text-lg md:text-2xl leading-relaxed font-medium tracking-tight italic">
                "{content[activeTab]}"
              </p>
            </div>

            <button className="bg-[#4F7DF3] text-white px-10 py-5 rounded-2xl w-fit font-black text-[11px] tracking-[0.2em] uppercase hover:bg-[#3B63C9] hover:-translate-y-1 transition-all flex items-center gap-3 shadow-xl shadow-[#4F7DF3]/25">
              Read More <ArrowRight size={16} />
            </button>
          </div>

          {/* RIGHT SIDE - Stats Badge */}
          <div className="relative flex justify-center lg:justify-end min-h-[150px] lg:min-h-fit">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-white flex flex-col items-center">
              <span className="text-4xl font-black text-[#4F7DF3]">4+</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                Years of<br />Excellence
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}