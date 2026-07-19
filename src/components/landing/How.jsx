import React from "react";
import CollectImg from "@/assets/Icon1.png";
import CleanImg from "@/assets/Icon2.png";
import DeliveryImg from "@/assets/Icon3.png";
import { ArrowRight, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function How() {
  const steps = [
    {
      title: "YOU BOOK",
      desc: "Schedule a pickup that fits your busy lifestyle.",
      img: CollectImg,
    },
    {
      title: "WE COLLECT",
      desc: "We come to your door.",
      img: CollectImg,
    },
    {
      title: "WE CLEAN",
      desc: "Our specialists treat every garment with premium eco-friendly care.",
      img: CleanImg,
    },
    {
      title: "WE DELIVER",
      desc: "Fresh, perfectly pressed clothes delivered back to your doorstep.",
      img: DeliveryImg,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white relative z-20">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="flex items-center gap-2 bg-[#4F7DF3]/10 px-4 py-2 rounded-full">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F7DF3]">How it works</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#4F7DF3] uppercase tracking-tighter">
            Simplifying your laundry journey.
          </h2>
          <p className="text-slate-500 max-w-2xl text-sm md:text-base font-medium">
            Supported by 4 years of experience, we offer a personal and attentive service tailored to your unique needs.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-10 w-full">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-[#4F7DF3]/10 border border-slate-100 p-10 rounded-[32px] transition-all duration-500"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className="absolute -top-2 -right-2 bg-[#4F7DF3] text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full">
                  0{index + 1}
                </span>
              </div>
              
              <h3 className="text-lg font-black text-[#0F172A] mb-3 tracking-widest uppercase">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER INFO CARD */}
        <div className="p-8 md:p-16 text-center relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <p className="text-blue-900/80 text-md font-semibold md:text-lg leading-relaxed italic">
              "We currently serve Abuja from our two Lugbe branches, providing a seamless home collection and delivery experience."
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link
                 to="/booking"
                 className="bg-[#4F7DF3] text-white px-10 py-5 rounded-2xl cursor-pointer font-black text-[11px] tracking-[0.2em] hover:bg-[#3B63C9] hover:-translate-y-1 transition-all flex items-center gap-3 shadow-xl shadow-[#4F7DF3]/25 uppercase"
               >
                 Book Online Now <ArrowRight size={16} />
               </Link>
               
               <div className="flex items-center gap-2 group cursor-pointer">
                 <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:border-[#D4AF37] transition-all">
                    <Store size={16} className="text-slate-400 group-hover:text-[#D4AF37]" />
                 </div>
                 <p className="text-[#0F172A] font-black text-[11px] uppercase tracking-widest">
                    Visit our stores
                 </p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}