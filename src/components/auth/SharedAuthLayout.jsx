import React from 'react';

export const SharedAuthLayout = ({
  leftContent,
  rightContent,
  bgClassName = "min-h-screen bg-[#F8FAFC] selection:bg-[#4F7DF3]/20",
}) => {
  return (
    <div className={bgClassName}>
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#4F7DF3]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#3F6AE1]/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 min-h-screen flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-center">
          {/* Left Column (GIFs / Branding) */}
          <div className="hidden lg:block">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              {leftContent}
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuthFormContainer = ({ children, title, subtitle }) => {
  return (
    <div className="bg-white/70 backdrop-blur-2xl rounded-[40px] p-8 sm:p-12 shadow-[0_20px_50px_rgba(79,125,243,0.1)] border border-white">
      {title && (
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-4xl font-black text-[#0F172A] tracking-tight mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#64748B] text-base font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};