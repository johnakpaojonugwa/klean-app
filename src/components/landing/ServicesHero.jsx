import ServiceBg from "@/assets/services-hero.jpg";

export default function ServicesHero() {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[80vh] flex items-center pt-20 overflow-hidden bg-[#0f172a]">
      <div className="absolute inset-0 z-0">
        <img
          src={ServiceBg}
          alt="Services at Klean Laundry Services"
          className="w-full h-auto object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        {/* DYNAMIC OVERLAY - Switched to 'to-r' to support right-side text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A2E56]/40 to-[#1A2E56] z-10"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* MAIN CONTENT - Added 'lg:col-start-2' to move it right */}
          <div className="lg:col-start-2 flex flex-col space-y-6 animate-in fade-in slide-in-from-right duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Klean <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px white" }}
              >
                Services
              </span>
            </h1>

            <p className="text-slate-300 text-lg max-w-lg font-medium leading-relaxed">
              We handle your garments with the utmost care, using eco-friendly
              methods that preserve fabric integrity and color vibrancy. From
              delicate silks to everyday wear, we ensure a pristine clean every
              time.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20"></div>
    </section>
  );
}
