import React, { useState, useEffect, useRef } from "react";
import { Layers, Users, ShieldCheck, Trophy } from "lucide-react";

// Individual Counter Component
const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Intersection Observer to start counting only when visible on screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasStarted(true);
      },
      { threshold: 0.1 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Math.floor for clean integers; toLocaleString for commas
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

const stats = [
  { id: 1, value: 25, label: "Services Rendered", Icon: Layers },
  { id: 2, value: 120986, label: "Satisfied Clients", Icon: Users },
  { id: 3, value: 21, label: "Affiliations & Certifications", Icon: ShieldCheck },
  { id: 4, value: 11, label: "Awards", Icon: Trophy },
];

export default function Statistics() {
  return (
    <section className="bg-[#D4AF37] py-24 relative overflow-hidden font-sans">
      {/* DECORATIVE BACKGROUND BLOBS */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#1A2E56] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-90" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1A2E56] rounded-full translate-x-1/4 translate-y-1/4 opacity-90" />
      
      {/* FLOATING BUBBLE DETAILS */}
      <div className="absolute top-12 left-[15%] w-12 h-12 border-2 border-white/20 rounded-full" />
      <div className="absolute top-1/2 right-[5%] w-8 h-8 border-2 border-white/10 rounded-full" />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-20">
          {stats.map(({ id, value, label, Icon }) => (
            <div key={id} className="flex flex-col items-center text-center group">
              <div className="w-52 h-52 lg:w-60 lg:h-60 bg-[#1A2E56] rounded-full flex flex-col items-center justify-center text-white transition-all duration-500 hover:scale-105 hover:bg-[#1e3666]">
                
                <Icon size={36} strokeWidth={1.5} className="mb-3 opacity-90 transition-transform duration-500 group-hover:-translate-y-2" />
                
                <h3 className="text-4xl lg:text-5xl font-black tracking-tight mb-1">
                  <CountUp end={value} />
                </h3>
                
                <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] max-w-[140px] leading-tight opacity-90">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}