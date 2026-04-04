import BookingBg from "@/assets/booking-bg1.jpg";

export default function BookingHero() {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[80vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={BookingBg}
          alt="Book Your Laundry Service with Klean"
          className="w-full h-auto object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A2E56]/40 to-[#1A2E56] z-10"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="lg:col-start-2 flex flex-col space-y-6 animate-in fade-in slide-in-from-right duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
            Book Your <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1px white" }}
            >
              Laundry Service
            </span>
          </h1>
        </div>
      </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20"></div>
    </section>
  );
}
