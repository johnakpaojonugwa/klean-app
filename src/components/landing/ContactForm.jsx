import React from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, MessageSquare, Send } from 'lucide-react';
import FormImg from "@/assets/location-img.jpg";

const ContactForm = () => {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-20 px-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Have a question or need a professional laundry service? We're here to help. 
            Drop us a message and our team will reach out shortly.
          </p>
        </div>

        {/* Main Interface Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          
          {/* Left: Contact Form Section */}
          <div className="flex-[1.2] p-8 lg:p-16">
            <div className="flex items-center gap-3 mb-8 text-[#4F7DF3]">
              <MessageSquare size={24} />
              <span className="font-bold uppercase tracking-widest text-md">Send a Message</span>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-8">
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4F7DF3] focus:ring-4 focus:ring-[#4F7DF3]/10 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4F7DF3] focus:ring-4 focus:ring-[#4F7DF3]/10 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">How can we help?</label>
                <textarea 
                  placeholder="Tell us about your needs..." 
                  rows="4"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4F7DF3] focus:ring-4 focus:ring-[#4F7DF3]/10 outline-none transition-all resize-none placeholder:text-slate-400"
                ></textarea>
              </div>
              
              <div className="col-span-2 pt-4">
                <button className="group flex items-center justify-center gap-3 w-full bg-[#4F7DF3] hover:bg-[#3B63C9] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98]">
                  <span>Send Message</span>
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>

          {/* Right: Location & Info Panel (The "Enhanced" Card) */}
          <div className="flex-1 bg-slate-900 relative text-white p-10 lg:p-16 overflow-hidden flex flex-col justify-between">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F7DF3] opacity-10 blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Head Office</h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-[#4F7DF3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Lugbe Branch</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      No 7, VON Garden City Estate,<br /> Lugbe FCT, Abuja.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="text-[#4F7DF3]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Phone Support</h4>
                    <p className="text-slate-400 text-sm">+234 810 138 9942</p>
                    <p className="text-xs text-slate-500 mt-1">Mon-Sat, 8am - 6pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Panel */}
            <div className="relative z-10 pt-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Follow Our Journey</p>
              <div className="flex gap-4">
                {[
                  { icon: <Facebook size={20}/>, link: "#" },
                  { icon: <Linkedin size={20}/>, link: "#" },
                  { icon: <Twitter size={20}/>, link: "#" }
                ].map((social, i) => (
                  <a key={i} href={social.link} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#4F7DF3] hover:border-[#4F7DF3] transition-all duration-300">
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;