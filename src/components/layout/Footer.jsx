import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#1A2E56] text-white relative font-sans overflow-hidden">
      {/* TOP DECORATIVE WAVE (Optional but Modern) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden line-height-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-[60px] fill-[#F8FAFC]"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 pt-32 pb-10 relative z-20">
        {/* NEWSLETTER BANNER - Now using Relative positioning for visibility */}
        <div className="relative z-30 bg-white/50 rounded-[2rem] rounded-br-[6rem] p-8 lg:p-12 mb-20 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden">
          {/* Subtle Internal Decoration */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

          <div className="max-w-xl text-center lg:text-left relative z-10">
            <h3 className="text-2xl lg:text-3xl font-black text-[#1A2E56] mb-2 uppercase tracking-tighter">
              Ready for a cleaner wardrobe?
            </h3>
            <p className="text-[#1A2E56]/80 font-medium text-sm lg:text-base">
              Subscribe for laundry hacks and exclusive 20% off your first
              professional wash.
            </p>
          </div>

          <form
            className="flex w-full lg:w-auto shadow-xl rounded-full overflow-hidden bg-white p-1.5 relative z-10"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire newsletter submission endpoint
              const form = e.currentTarget;
              const input = form.querySelector('input[type="email"]');
              if (input) console.log('Newsletter signup:', input.value);
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              aria-label="Email address for newsletter"
              placeholder="Your email address"
              className="flex-grow min-w-0 px-4 lg:px-6 py-3 bg-transparent text-[#1A2E56] focus:outline-none placeholder:text-slate-400 font-medium text-sm lg:text-base"
            />
            <button className="bg-[#1A2E56] text-white px-6 lg:px-8 py-3 rounded-full font-black uppercase text-[10px] lg:text-xs tracking-widest hover:bg-[#E5B14A] transition-all duration-300 active:scale-95 whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 border-b border-white/10 pb-16">
          {/* COLUMN 1: LOGO & ABOUT */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="group flex items-center gap-3">
              <svg
                width="34"
                height="34"
                viewBox="0 0 100 100"
                className="drop-shadow-sm transition-transform duration-500 group-hover:-rotate-6"
              >
                <defs>
                  <linearGradient
                    id="klean-footer-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6C8CFF" />
                    <stop offset="100%" stopColor="#3B63C9" />
                  </linearGradient>
                </defs>

                <rect
                  x="15"
                  y="10"
                  width="70"
                  height="80"
                  rx="14"
                  fill="url(#klean-footer-gradient)"
                />

                <circle
                  cx="50"
                  cy="55"
                  r="28"
                  fill="none"
                  stroke="white"
                  strokeWidth="4"
                  opacity="0.85"
                />
              </svg>

              <div className="flex flex-col leading-none">
                <h1 className="text-lg font-black tracking-tighter uppercase text-white">
                  klean<span className="text-[#6C8CFF]">.</span>
                </h1>

                <span className="text-[9px] text-white/50 font-bold uppercase tracking-[0.35em] mt-1">
                  Enterprise
                </span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed text-[15px] font-medium max-w-sm">
              Providing professional eco-friendly laundry and dry cleaning
              services. We treat your garments with the care they deserve,
              ensuring longevity and a fresh finish every time.
            </p>

            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E5B14A] hover:text-[#1A2E56] transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: LUGBE OUTLETS */}
          <div className="lg:col-span-2">
            <h4 className="text-2xl font-black uppercase tracking-widest text-[#26C1C9] mb-8 underline decoration-2 underline-offset-8 decoration-[#E5B14A]">
              Lugbe
            </h4>
            <ul className="space-y-4">
              {[
                "Head Office",
                "Pyakasa",
                "FHA Office",
                "Piwoyi",
                "Sabon-Lugbe",
              ].map((loc) => (
                <li key={loc}>
                  <Link
                    to="#"
                    className="text-slate-300 hover:text-white flex items-center gap-2 group text-lg font-semibold transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="text-[#E5B14A] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                    />
                    {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: KUBWA OUTLETS */}
          <div className="lg:col-span-2">
            <h4 className="text-2xl font-black uppercase tracking-widest text-[#26C1C9] mb-8 underline decoration-2 underline-offset-8 decoration-[#E5B14A]">
              Kubwa
            </h4>
            <ul className="space-y-4">
              {["NNPC Office", "Phase 3", "NYSC Office", "FHA Kubwa"].map(
                (loc) => (
                  <li key={loc}>
                    <Link
                      to="#"
                      className="text-slate-300 hover:text-white flex items-center gap-2 group text-lg font-semibold transition-colors"
                    >
                      <ChevronRight
                        size={14}
                        className="text-[#E5B14A] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all"
                      />
                      {loc}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-2xl font-black uppercase tracking-widest text-[#26C1C9] mb-8 underline decoration-2 underline-offset-8 decoration-[#E5B14A]">
              Contact
            </h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#E5B14A]" />
                </div>
                <p className="text-lg text-slate-300 font-medium leading-relaxed">
                  7, VON Garden City Estate, Opp Trademore Estate, Lugbe, Abuja
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#E5B14A]" />
                </div>
                <p className="text-lg text-slate-300 font-bold">
                  +234 810 138 9942
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
            © 2026 Klean Laundry Services Ltd.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <Link to="#" className="hover:text-[#E5B14A] transition-colors">
              Privacy
            </Link>
            <Link to="#" className="hover:text-[#E5B14A] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
