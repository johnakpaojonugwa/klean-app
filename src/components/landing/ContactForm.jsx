import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter, MessageSquare, Send, AlertCircle } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({ fullName: '', email: '', message: '' });
      setErrors({});
      
      // Show success message (you might want to add a toast notification here)
      alert('Thank you for your message! We\'ll get back to you soon.');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  return (
    <div className="bg-[#f8fafc] min-h-[80vh] py-20 px-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4F7DF3] tracking-tight mb-4 uppercase">
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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-8">
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-5 py-4 rounded-xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-[#4F7DF3]/10 outline-none transition-all placeholder:text-slate-400 ${
                    errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-transparent focus:border-[#4F7DF3]'
                  }`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.fullName}
                  </div>
                )}
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-5 py-4 rounded-xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-[#4F7DF3]/10 outline-none transition-all placeholder:text-slate-400 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-transparent focus:border-[#4F7DF3]'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">How can we help? *</label>
                <textarea 
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows="4"
                  className={`w-full px-5 py-4 rounded-xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-[#4F7DF3]/10 outline-none transition-all resize-none placeholder:text-slate-400 ${
                    errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-transparent focus:border-[#4F7DF3]'
                  }`}
                  placeholder="Tell us about your needs..."
                ></textarea>
                {errors.message && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </div>
                )}
              </div>
              
              <div className="col-span-2 pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex items-center justify-center gap-3 w-full bg-[#4F7DF3] hover:bg-[#3B63C9] disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Location & Info Panel (The "Enhanced" Card) */}
          <div className="flex-1 bg-[#1A2E56] relative text-white p-10 lg:p-16 overflow-hidden flex flex-col justify-between">
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