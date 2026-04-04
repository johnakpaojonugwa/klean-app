import { Linkedin, ArrowRight } from "lucide-react"; 
import CEO from "@/assets/profile-pics.jpg";
import ActingCEO from "@/assets/about-us-ceo-.png";

export default function MeetTeam() {
  return (
    <section className="relative bg-[#1a2e56] py-24 text-white font-sans overflow-hidden">
      {/* IMPROVED WAVE: Pure white for a crisp transition to the next section */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-20 fill-white transform rotate-180"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10 pt-10">
        <h2 className="text-5xl lg:text-6xl font-black mb-2 tracking-tighter uppercase italic">
          Meet Our Team
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-16 text-[#26C1C9]">
          The minds behind the magic
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-12 items-center">
          {[
            { name: "John Akpa", role: "Founder", img: CEO },
            { name: "Josh Brandy", role: "Acting CEO", img: ActingCEO },
          ].map((member, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl text-slate-800 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="relative w-40 h-40 mx-auto mb-8">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#26C1C9] animate-spin-slow group-hover:scale-110 transition-transform duration-500" />
                <img
                  src={member.img}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              <h3 className="text-2xl font-black tracking-tight text-[#1a2e56]">
                {member.name}
              </h3>
              <p className="text-sm font-bold text-[#E5B14A] mb-6 uppercase tracking-widest">
                {member.role}
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Klean Enterprise
                </p>
                <a href="#" className="text-slate-400 hover:text-[#0077b5] transition-colors">
                  <Linkedin size={20} fill="currentColor" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center">
          <button className="group bg-[#E5B14A] text-[#1a2e56] px-10 py-4 cursor-pointer rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all hover:bg-white active:scale-95">
            Join the team
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-60 italic">
            we are hiring
          </p>
        </div>
      </div>
    </section>
  );
}