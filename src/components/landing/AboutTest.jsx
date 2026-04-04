import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    title: "Fantastic experience",
    comment: "When ever Its time for me to get my Garments I always get them on time",
    rating: 5,
    author: "Michael Smith",
  },
  {
    id: 2,
    title: "Great design",
    comment: "My clothes are always delivered on time when it's due date. Garment care is never late!!!!",
    rating: 4.5,
    author: "Mabel Adewale",
  },
  {
    id: 3,
    title: "Easy to use",
    comment: "I am delighted with the way they clean my Upholstery",
    rating: 4,
    author: "Chinelo Mbah",
  },
  {
    id: 4,
    title: "Easy customization",
    comment: "The excellent packaging of the Garments gives my clothes a new feel",
    rating: 5,
    author: "George. A",
  },
];

export default function AboutTestimonials() {
  return (
    <section className="py-24 bg-white font-sans">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* HEADER AREA */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 block mb-4">
                WORDS DON'T LIE
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-[#1A2E56] leading-tight tracking-tight">
                What Our Clients Say
              </h2>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xs font-medium">
              Authoritatively incentivize client-focused scenarios through market-driven leadership skills.
            </p>
          </div>

          {/* TESTIMONIALS GRID */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div 
                key={item.id} 
                className="bg-white border border-slate-100 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
              >
                <h4 className="text-xl font-bold text-[#1A2E56] mb-4 uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-[13px] leading-relaxed mb-8 flex-grow">
                  "{item.comment}"
                </p>
                
                <div className="mt-auto">
                  {/* STAR RATING */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < Math.floor(item.rating) ? "#E5B14A" : "transparent"} 
                        className={i < Math.floor(item.rating) ? "text-[#E5B14A]" : "text-slate-200"}
                      />
                    ))}
                  </div>
                  <p className="text-lg font-black text-[#1A2E56] tracking-tight">
                    {item.author}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}