import React from "react";
import { DollarSign, Bell, ShieldCheck, Truck, Sparkles } from "lucide-react";
import LaundryWoman from "@/assets/image7.jpg";

export default function Benefits() {
  const benefitCards = [
    {
      title: "Pocket Friendly Price",
      icon: <DollarSign className="w-12 h-12 md:w-20 md:h-20 text-[#D4AF37]" />,
    },
    {
      title: "Instant Order Update",
      icon: <ShieldCheck className="w-12 h-12 md:w-20 md:h-20 text-[#D4AF37]" />,
    },
    {
      title: "Reliability",
      icon: <Bell className="w-12 h-12 md:w-20 md:h-20 text-[#D4AF37]" />,
    },
    {
      title: "Express Fast Delivery",
      icon: <Truck className="w-12 h-12 md:w-20 md:h-20 text-[#D4AF37]" />,
    },
  ];

  return (
    <section className="py-24 bg-[#4F7DF3]/10 relative overflow-hidden min-h-screen flex items-center">
      
      {/* BACKGROUND WEAVE PATTERN (Left Side) */}
      <div className="absolute top-0 left-0 w-1/2 h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="weave" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 20 L40 20 M20 0 L20 40" stroke="currentColor" strokeWidth="1" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#weave)" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          {/* LEFT SIDE: GRID CONTENT */}
          <div className="flex flex-col space-y-12">
            <div className="space-y-2">
              <div className="bg-white/50 border border-[#4F7DF3]/20 px-4 py-2 rounded-full w-50">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#4F7DF3]">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#4f7df3] leading-tight uppercase tracking-tight">
                Our Laundry <br /> Benefits
              </h2>
              <div className="text-[#4F7DF3] pt-2 hidden md:block">
                <Sparkles size={24} fill="currentColor" />
              </div>
            </div>

            {/* BENEFIT GRID WITH CENTRAL CIRCLE */}
            <div className="relative inline-grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl md:max-w-3xl">
              {benefitCards.map((card, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-10 flex flex-col items-start justify-center space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-50 min-h-[180px]"
                >
                  {card.icon}
                  <h3 className="text-[#1A2E56] font-medium text-xl md:text-3xl leading-tight tracking-wide">
                    {card.title}
                  </h3>
                </div>
              ))}

              {/* CENTRAL GOLD CIRCLE ACCENT */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#D4AF37] rounded-full hidden md:flex items-center justify-center border-4 border-[#D4AF37] shadow-lg text-white">
                <Sparkles size={30} fill="white" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: DESCRIPTION & IMAGE */}
          <div className="flex flex-col space-y-8">
            <p className="text-[#64748B] text-lg leading-relaxed max-w-lg font-medium">
              We take special interest in handling your fabrics; each item is tested 
              before cleaning. We believe your clothes are personal to you and so 
              we do our best to treat them well.
            </p>
            
            <div className="relative pt-10 hidden lg:block">
              <img 
                src={LaundryWoman} 
                alt="Woman using washing machine" 
                className="w-full h-full object-contain scale-110 translate-x-10"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}