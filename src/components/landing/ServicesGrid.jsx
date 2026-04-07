import { Sparkles, Waves, Zap, Shirt, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Assets
import ServiceDry from "@/assets/Dryclean.png";
import ServiceLaund from "@/assets/news-1.jpg";
import Chooseus from "@/assets/stain-removal.jpg";
import Benefits from "@/assets/news-2.jpg";

const services = [
  {
    id: 1,
    title: "Eco Dry Cleaning",
    price: "From ₦12,000",
    description: "Artisanal care for your finest silhouettes. We use earth-friendly solvents that protect fibers.",
    image: ServiceDry,
    icon: <Sparkles size={18} className="text-[#26C1C9]" />,
  },
  {
    id: 2,
    title: "Wash & Fold",
    price: "From ₦2,000/kg",
    description: "The ultimate weekly luxury. Your everyday essentials laundered and returned in crisp bundles.",
    image: ServiceLaund,
    icon: <Waves size={18} className="text-[#26C1C9]" />,
  },
  {
    id: 3,
    title: "Premium Press",
    price: "From ₦5,000",
    description: "Precision steaming and hand-finishing. We restore the sharp lines of your power suits.",
    image: Benefits,
    icon: <Zap size={18} className="text-[#26C1C9]" />,
  },
  {
    id: 4,
    title: "Master Stain Lab",
    price: "From ₦8,000",
    description: "Advanced spot-treatment for life's accidents targeting oil and ink with surgical precision.",
    image: Chooseus,
    icon: <Shirt size={18} className="text-[#26C1C9]" />,
  }
];

export default function ServiceGrid() {
  return (
    <section className="py-12 md:py-24 w-full bg-[#F8FAFC] font-sans overflow-x-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-20">
        
        {/* HEADER AREA */}
        <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <div className="flex items-center gap-2 bg-[#26C1C9]/10 px-4 py-2 rounded-full w-fit mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#26C1C9]">
              Specialized Care
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#1A2E56] tracking-tighter uppercase leading-[1.1] mb-6">
            Our Core Services
          </h2>
          <p className="text-slate-500 max-w-lg text-md sm:text-lg font-medium leading-relaxed px-4">
            Experience the gold standard of garment care with our four specialized cleaning pillars.
          </p>
        </div>

        {/* RESPONSIVE GRID SYSTEM */}
        {/* grid-cols-1 for mobile, md:grid-cols-2 for tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {services.map((service) => (
            <div key={service.id} className="relative group h-full">
              <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] rounded-br-[4rem] sm:rounded-br-[6rem] border border-slate-100 overflow-hidden flex flex-col sm:flex-row h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2">
                
                {/* IMAGE BOX */}
                {/* On mobile: full width. On SM+: 40% width. */}
                <div className="relative w-full sm:w-[40%] aspect-[4/3] sm:aspect-auto overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-0 left-0 bg-[#26C1C9] text-[#1A2E56] px-4 py-2 font-black uppercase text-[9px] tracking-widest rounded-br-2xl shadow-lg z-10">
                    {service.price}
                  </div>
                </div>

                {/* CONTENT BOX */}
                {/* Adjusting padding for smaller screens */}
                <div className="p-6 sm:p-8 lg:p-10 sm:w-[60%] flex flex-col justify-center relative">
                  <div className="flex items-center gap-2 mb-3">
                    {service.icon}
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Klean Verified</span>
                  </div>

                  <h3 className="text-lg lg:text-2xl font-black text-[#1A2E56] leading-tight mb-3 uppercase">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-md lg:text-lg leading-relaxed mb-6 font-medium">
                    {service.description}
                  </p>

                  <div className="mt-auto">
                    <Link to="/booking">
                    <button className="relative overflow-hidden bg-[#1A2E56] text-white font-black px-5 py-3 sm:px-6 sm:py-3.5 cursor-pointer rounded-full text-[9px] uppercase tracking-[0.2em] group/btn transition-all duration-300 shadow-lg shadow-[#1A2E56]/20 w-full sm:w-auto text-center">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Book Now <CheckCircle size={12} />
                      </span>
                      <span className="absolute inset-0 bg-[#26C1C9] translate-y-full transition-transform duration-300 ease-out group-hover/btn:translate-y-0"></span>
                    </button>
                    </Link>
                  </div>
                  
                  {/* DASHED ACCENT - Adjusted size for responsiveness */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-dashed border-[#26C1C9]/20 rounded-br-[4rem] sm:rounded-br-[6rem] pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}