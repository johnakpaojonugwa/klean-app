import AboutBg from "@/assets/aboutUs.jpg";

export default function AboutHero() {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[80vh] flex items-center pt-20 overflow-hidden bg-[#0f172a]">
      {/* THE BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 z-0">
        <img
          src={AboutBg}
          alt="About Klean Laundry Services"
          className="w-full h-auto object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        {/* DYNAMIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2E56] via-[#1A2E56]/80 to-transparent z-10"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* MAIN CONTENT */}
          <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left duration-1000">
            {/* BRAND ACCENT */}
            <div className="flex items-center gap-2">
              <span className="w-12 h-[2px] bg-[#26C1C9]"></span>
              <span className="text-[#26C1C9] font-black uppercase tracking-[0.3em] text-xs lg:text-sm">
                Established 2020
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter">
              Klean <br /> 
              <span className="text-transparent stroke-white stroke-1" style={{ WebkitTextStroke: '1px white' }}>About us</span>
            </h1>

            <p className="text-slate-300 text-lg max-w-lg font-medium leading-relaxed">
              Experience the gold standard of klean care. From luxury silks to everyday wear, we blend tradition with eco-friendly innovation.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM CURVE ACCENT - To blend into the next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20"></div>
    </section>
  );
}