import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, User } from "lucide-react";
import LaundryWoman from "@/assets/Dryclean.png";
import Powercoin from "@/assets/news-1.jpg";
import Benefits from "@/assets/news-2.jpg";
import Chooseus from "@/assets/chooseus-1.jpg";
import ServiceDry from "@/assets/service-dryclean.jpg";
import ServiceLaund from "@/assets/service-laundry.jpg";

const blogs = [
  {
    id: 1,
    date: "16 Nov",
    title: "DRY CLEANING SAVES MONEY IN THE LONG RUN",
    author: "klean@Admin",
    comments: "No Comments",
    excerpt:
      "There are not many of passages of lorem ipsum available alteration in some form. Donec ...",
    image: LaundryWoman,
  },
  {
    id: 2,
    date: "27 Apr",
    title: "5 BENEFITS OF DRY CLEANING",
    author: "klean@Admin",
    comments: "No Comments",
    excerpt:
      "When it comes to keeping your wardrobe looking sharp and lasting longer, dry cleaning offers ...",
    image: Benefits,
  },
  {
    id: 3,
    date: "16 Nov",
    title: "OUR POWER COIN LAUNDRY SERVICE AT IT'S BEST",
    author: "klean@Admin",
    comments: "No Comments",
    excerpt:
      "There are not many of passages of lorem ipsum available alteration in some form. Donec ...",
    image: Powercoin,
  },
  {
    id: 4,
    date: "05 Dec",
    title: "FABRIC CARE: TIPS FOR LUXURY SILKS",
    author: "klean@Admin",
    comments: "2 Comments",
    excerpt:
      "Handling delicate fabrics requires a touch of expertise and the right chemical balance...",
    image: ServiceDry,
  },
  {
    id: 5,
    date: "12 Jan",
    title: "WHY ECO-FRIENDLY SOLVENTS MATTER",
    author: "klean@Admin",
    comments: "5 Comments",
    excerpt:
      "Sustainability in dry cleaning isn't just a trend; it's the future of garment longevity...",
    image: Chooseus,
  },
  {
    id: 6,
    date: "20 Feb",
    title: "COMMERCIAL LAUNDRY SOLUTIONS",
    author: "klean@Admin",
    comments: "1 Comment",
    excerpt:
      "Scaling your business requires reliable partners for your staff uniforms and linen...",
    image: ServiceLaund,
  },
];

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Update items per slide based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerSlide(1);
      else if (window.innerWidth < 1024) setItemsPerSlide(2);
      else setItemsPerSlide(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(blogs.length / itemsPerSlide);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Reset index if totalSlides changes (on resize) to prevent empty view
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerSlide]);

  return (
    <section
      className="min-h-screen lg:h-screen w-full bg-[#F8FAFC] font-sans flex flex-col justify-center items-center overflow-hidden py-12 lg:py-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] w-full px-6 lg:px-12">
        {/* HEADER AREA */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 gap-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 bg-[#4F7DF3]/10 px-4 py-2 rounded-full w-fit mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F7DF3]">
                Latest news
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#4F7DF3] tracking-tighter uppercase leading-none">
              Our Blog Insights
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#1A2E56] hover:text-white transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:bg-[#1A2E56] hover:text-white transition-all"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </div>

        {/* SLIDER STAGE */}
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIdx) => (
              <div
                key={slideIdx}
                className={`min-w-full grid gap-8 box-border grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}
              >
                {blogs
                  .slice(
                    slideIdx * itemsPerSlide,
                    slideIdx * itemsPerSlide + itemsPerSlide,
                  )
                  .map((post) => (
                    <div key={post.id} className="relative h-full py-4 px-1">
                      <div className="bg-white rounded-[2rem] rounded-br-[7rem] border border-slate-100 overflow-hidden flex flex-col h-full transition-shadow duration-500 hover:shadow-2xl relative">
                        <div className="relative w-full aspect-video lg:aspect-[16/10] overflow-hidden shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />

                          {/* THE UPDATED BADGE */}
                          <div className="absolute top-0 right-0 bg-[#00A878] text-white px-6 py-2 font-bold uppercase text-[10px] tracking-widest rounded-bl-3xl shadow-md">
                            {post.date}
                            {/* The rounded "cut" effect */}
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full"></div>
                          </div>
                        </div>

                        <div className="p-6 lg:p-10 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mb-4 tracking-widest">
                            <span className="text-[#1A2E56] flex items-center gap-1">
                              <User size={14} className="text-[#26C1C9]" />{" "}
                              {post.author.split("@")[0]}
                            </span>
                            <span className="opacity-30">|</span>
                            <span className="flex items-center gap-1">
                              <MessageCircle
                                size={14}
                                className="text-[#26C1C9]"
                              />{" "}
                              {post.comments}
                            </span>
                          </div>

                          <h3 className="text-lg lg:text-xl font-black text-[#1A2E56] leading-tight mb-4 uppercase line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-6 line-clamp-3 font-medium">
                            {post.excerpt}
                          </p>

                          <div className="mt-auto">
                            <button className="relative overflow-hidden bg-[#E5B14A] text-white font-black px-8 py-4 lg:py-5 cursor-pointer rounded-full text-xs uppercase tracking-[0.2em] group/btn transition-colors duration-300 hover:text-white w-full sm:w-auto">
                              <span className="relative z-10">Read More</span>
                              <span className="absolute top-0 left-0 w-0 h-full bg-[#1A2E56] transition-all duration-500 ease-in-out group-hover/btn:w-1/2"></span>
                              <span className="absolute top-0 right-0 w-0 h-full bg-[#1A2E56] transition-all duration-500 ease-in-out group-hover/btn:w-1/2"></span>
                            </button>
                          </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-dashed border-[#26C1C9]/30 rounded-br-[7rem] pointer-events-none" />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* PROGRESS INDICATOR */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === i ? "w-12 bg-[#26C1C9]" : "w-3 bg-slate-200"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
