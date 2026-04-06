import React from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';
import FormImg from "@/assets/location-img.jpg";

const ContactForm = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* Left Card: Contact Form */}
        <div className="bg-white p-10 rounded-2xl shadow-xl shadow-slate-200 w-full lg:max-w-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-8 leading-tight">
            Send us a quick note and we will get back to you as soon as possible
          </h2>
          
          <form className="space-y-6">
            <div>
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-all"
              />
            </div>
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-all"
              />
            </div>
            <div>
              <textarea 
                placeholder="Message" 
                rows="5"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-all resize-none"
              ></textarea>
            </div>
            
            <button className="w-full bg-[#8b77eb] hover:bg-[#7a65d8] text-white font-medium py-3 rounded-lg transition-colors shadow-md">
              Contact Us
            </button>
          </form>
        </div>

        {/* Right Card: Location Info */}
        <div className="w-full lg:max-w-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Head Office</h2>
          
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 overflow-hidden">
            {/* Building Image */}
            <div className="relative h-56">
              <img 
                src={FormImg}
                alt="Head Office Building" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white h-4 rounded-t-full"></div>
            </div>
            
            <div className="p-8 pt-0 text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Lekki Phase I</h3>
              <div className="text-slate-500 text-sm leading-relaxed space-y-2">
                <p>Block A12 Plot 6, Otunba Adedoyin Ogungbe Street,</p>
                <p>Lekki Phase I, Lagos.</p>
                <p className="pt-2">Tel: +234 — 8077716364</p>
              </div>
              
              {/* Icon Group */}
              <div className="flex justify-center gap-4 mt-6">
                <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 cursor-pointer">
                  <MapPin className="text-red-500 w-6 h-6" />
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 cursor-pointer">
                  <span className="text-green-500 text-2xl font-bold">💬</span>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 cursor-pointer">
                  <Phone className="text-black w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Socials */}
      <div className="mt-16 border-t border-slate-300 pt-8 flex flex-col items-center">
        <div className="flex gap-4 mb-8">
          <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <Facebook size={18} />
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer">
            <Linkedin size={18} />
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">
            X
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;