import { Eye, EyeOff } from "lucide-react";

export function InputField({ label, icon, type = "text", placeholder, value, onChange, rightElement, required }) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.2em] ml-1 transition-colors group-focus-within:text-[#4F7DF3]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#4F7DF3] transition-colors">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full h-11 bg-white/60 border border-slate-200 pl-11 pr-12 py-2 rounded-md text-sm outline-none transition-all focus:border-[#4F7DF3] focus:ring-4 focus:ring-[#4F7DF3]/5 shadow-sm placeholder:text-[#CBD5E1]"
        />
        {rightElement && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
    </div>
  );
}

export function PasswordStrengthIndicator({ password = "" }) {
  const getStrength = () => {
    const pass = password || ""; 
    let strength = 0;
    
    if (pass.length >= 6) strength++;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    
    return strength; 
  };

  const strength = getStrength();
  
  const strengthLabels = ["Too Short", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500"];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
              i <= strength ? colors[strength] : "bg-gray-200"
            }`} 
          />
        ))}
      </div>
      <p className="text-[10px] font-semibold text-[#94A3B8]">
        Strength: <span className={strength <= 2 ? "text-red-500" : strength <= 3 ? "text-yellow-500" : "text-green-500"}>
          {strengthLabels[strength]}
        </span>
      </p>
    </div>
  );
}