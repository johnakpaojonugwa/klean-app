import { ArrowRight, Shirt, Waves, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ServiceDryclean from "@/assets/service-dryclean.jpg";
import ServiceLaundry from "@/assets/service-laundry.jpg";
import StainRemoval from "@/assets/stain-removal.jpg";

export default function Services() {
  const services = [
    {
      title: "Dry Cleaning Services",
      img: ServiceDryclean,
      icon: <Shirt className="w-8 h-8" />,
      // The organic "blob" shape for the text container
      blobShape: "rounded-[40%_60%_70%_30%/40%_50%_60%_50%]",
    },
    {
      title: "Laundry Services",
      img: ServiceLaundry,
      icon: <Waves className="w-8 h-8" />,
      blobShape: "rounded-[50%_50%_60%_40%/40%_60%_40%_60%]",
    },
    {
      title: "Stain Removal Services",
      img: StainRemoval,
      icon: <Sparkles className="w-8 h-8" />,
      blobShape: "rounded-[60%_40%_30%_70%/50%_40%_50%_60%]",
    },
  ];

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      {/* DECORATIVE BUBBLES */}
      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 flex flex-col gap-4 opacity-40 pointer-events-none">
        <div className="w-32 h-32 rounded-full border-[1.5px] border-blue-200 shadow-[inset_0_0_20px_rgba(79,125,243,0.1)]" />
        <div className="w-16 h-16 rounded-full border border-blue-100 ml-12" />
        <div className="w-24 h-24 rounded-full border-[1.5px] border-blue-200 mt-[-20px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center mb-20 space-y-4">
          <div className="flex items-center gap-2 bg-[#4F7DF3]/10 px-4 py-2 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F7DF3]">
              Our Services
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#4f7df3] uppercase tracking-tighter max-w-3xl">
            Premium cleaning and stress-free services.
          </h2>
          <p className="text-slate-500 max-w-2xl text-sm md:text-base font-medium">
            Nigeria's premier dry-cleaning firm. We provide unparalleled service
            with a focus on quality and customer satisfaction.
          </p>
        </div>

        {/* SERVICES GRID */}
        <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group w-72 h-80 flex flex-col items-center"
            >
              {/* CIRCULAR IMAGE (Top Layer) */}
              <div className="w-56 h-56 rounded-full overflow-hidden shadow-lg border-4 border-white relative z-0">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* STYLISH TEXT BLOB (Overlapping Layer) */}
              <div
                className={`absolute bottom-4 w-full h-36 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] ${service.blobShape} flex flex-col items-center justify-center p-6 text-center border border-slate-50 transition-all duration-500 group-hover:translate-y-[-8px] z-10`}
              >
                {/* ICON */}
                <div className="text-[#D4AF37] mb-2 transform transition-transform group-hover:scale-110">
                  {service.icon}
                </div>

                {/* TEXT */}
                <h3 className="text-[#4f7df3] font-black text-lg tracking-tight leading-tight">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-16">
          <Link to="/services" className="bg-[#4F7DF3] text-white px-10 py-5 rounded-2xl w-fit font-black text-[11px] tracking-[0.2em] uppercase hover:bg-[#3B63C9] hover:-translate-y-1 transition-all flex items-center gap-3 shadow-xl shadow-[#4F7DF3]/25">
            More Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
