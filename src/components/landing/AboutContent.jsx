import CEO from "@/assets/ceo-pics.png";

export default function AboutContent() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* TEXT CONTENT */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl lg:text-5xl font-black text-[#1A2E56] leading-tight mb-8 uppercase tracking-tighter">
              Clean clothes <br /> 
              <span className="text-[#1A2E56]">are just a tap away.</span>
            </h2>

            <p className="text-slate-500 leading-relaxed mb-6 md:mb-8 text-[15px]">
              Klean Dry-Cleaning and Laundry Services Ltd has its corporate head office at No 7, VON Garden City Estate, Opp Trademore Estate, Lugbe, and 9 other locations in Abuja.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed mb-6 md:mb-8 text-[15px]">
                Our sole aim is to provide highly professional and excellent laundry and dry cleaning services to our clientele both individual and corporate bodies at affordable prices. We specialize in industrial and household laundry and dry-cleaning business. 
            </p>
            <p className="text-slate-500 leading-relaxed mb-6 md:mb-8 text-[15px]">
                The company in its effort to render first class services put in place standard machines and seasoned personnel who are well informed and experienced in Laundry and Dry-cleaning business. Over the years, we have strived to improve our services to continue satisfying our numerous customers.
            </p>
            <p className="text-slate-500 leading-relaxed mb-6 md:mb-8 text-[15px]">
                We have a standard which no other dry cleaning company can beat. No wonder Klean Dry cleaner's is a house hold name in Nigeria.
            </p>
          </div>

          {/* IMAGE SIDE */}
          <div className="lg:col-span-5 relative">
             <div className="relative z-10 rounded-full overflow-hidden border-[15px] border-white shadow-2xl">
                <img 
                    src={CEO} 
                    alt="CEO" 
                    className="w-full h-auto" 
                    loading="lazy"
                    decoding="async"
                />
             </div>
             {/* THE TEAL BUBBLE BACKGROUND */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#26C1C9]/5 rounded-full -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}