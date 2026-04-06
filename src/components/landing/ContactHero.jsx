import ContactBg from "@/assets/contact-page1.jpeg";

export default function ContactHero() {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[80vh] flex items-center pt-20 overflow-hidden bg-[#0f172a]">
      <div className="absolute inset-0 z-0">
        <img
          src={ContactBg}
          alt="Contact Background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
          decoding="async"
        />
        {/* DYNAMIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A2E56]/40 to-[#1A2E56] z-10"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* MAIN CONTENT */}
          <div className="lg:col-start-2 flex flex-col space-y-6 animate-in fade-in slide-in-from-right duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Contact <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px white" }}
              >
                us
              </span>
            </h1>

            <p className="text-slate-300 text-lg max-w-lg font-medium leading-relaxed">
                Have questions or need assistance? Our dedicated support team is here to help you with any inquiries, 
                feedback, or concerns you may have. Reach out to us through our contact form, email, or phone, 
                and we'll ensure you receive prompt and personalized assistance. Your satisfaction is our priority, 
                and we're committed to providing exceptional service every step of the way.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20"></div>
    </section>
  );
}
