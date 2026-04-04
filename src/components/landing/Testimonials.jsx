import React, { useState, useEffect } from "react";
import { Sparkle, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ikechukwu Mba",
    role: "Customer",
    text: "A trusted name in dry cleaning with unmatched attention to detail and fabric care.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sanya Odare",
    role: "Customer",
    text: "Highly reputable and quality-focused. They handled my wedding suit flawlessly.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: 3,
    name: "Chinelo Okoro",
    role: "Customer",
    text: "Fast express service with perfectly pressed, fresh-smelling clothes.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "John Simon",
    role: "Customer",
    text: "Reliable, professional, and always on time for our corporate uniforms.",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-[#1A2E56] relative overflow-hidden font-sans">
      {/* BUBBLE BACKGROUND */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-[10px] border-white/20" />
        <div className="absolute top-40 right-[10%] w-64 h-64 rounded-full border-[15px] border-white/10" />
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10 px-6 lg:px-20">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-center">
          {/* LEFT SIDE CONTENT */}
          <div className="xl:col-span-5">
            <div className="text-white space-y-4">
              {/* HEADER */}
              <div className="bg-white/80 border border-[#4F7DF3]/20 px-4 py-2 rounded-full w-50">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F7DF3]">
                  Testimonials
                </span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-black leading-[1.05] uppercase tracking-tighter">
                What Our <br /> Clients Say <br /> About Us
              </h2>
              <Sparkle
                className="text-[#D4AF37] mt-6"
                size={40}
                fill="currentColor"
              />
            </div>

            <div className="bg-[#D4AF37] p-10 mt-12 w-fit rounded-tr-[40px]">
              <div className="text-white">
                <div className="flex gap-1.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-white"
                    />
                  ))}
                </div>
                <p className="text-6xl font-black leading-none">5,700</p>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] mt-3">
                  Satisfied Customers
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: THE REPLICA SLIDER */}
          <div className="lg:col-span-7 relative">
            <div className="overflow-hidden py-12">
              {" "}
              {/* py-12 ensures the tail isn't cut */}
              <div
                className="flex transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                  // 80% card width + gap moves exactly 80% to keep 20% peek
                  transform: `translateX(-${currentIndex * 80}%)`,
                }}
              >
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className="min-w-[80%] pr-8" // Card takes 80%, leaving 20% for next slide
                  >
                    <div className="bg-white p-12 lg:p-16 relative min-h-[320px] flex flex-col justify-center ml-14">
                      {/* AVATAR */}
                      <div className="absolute -left-14 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[10px] border-[#D4AF37] overflow-hidden bg-white z-20">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>

                      <div className="ml-16 space-y-8">
                        <Quote className="text-[#D4AF37] opacity-30 w-10 h-10 md:w-20 md:h-20 absolute top-8 right-12" />
                        <p className="text-[#1A2E56] text-xl lg:text-3xl font-medium leading-relaxed relative z-10">
                          {item.text}
                        </p>
                        <div className="border-t border-slate-100 pt-8">
                          <p className="text-[#1A2E56] font-black uppercase text-xl tracking-widest">
                            {item.name}
                          </p>
                          <p className="text-[#4f7df3] font-bold text-sm uppercase mt-1">
                            {item.role}
                          </p>
                        </div>
                      </div>

                      {/* TAIL: Right bottom, no shadow */}
                      <div className="absolute -bottom-8 right-20 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[32px] border-t-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
