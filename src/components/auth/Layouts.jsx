import { Lock, Mail, Send } from "lucide-react";
import { InputField } from "@/components/auth/InputField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

export function AuthVisuals({ isLogin, LoginGif, SignupGif }) {
  return (
    <div className="hidden lg:flex lg:w-[60%] relative bg-transparent overflow-hidden border-r border-white/20">
      <img
        key={isLogin ? "login-side" : "signup-side"}
        src={isLogin ? LoginGif : SignupGif}
        className="w-full h-full object-cover mix-blend-multiply opacity-95 animate-in fade-in slide-in-from-left-10 duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/30 pointer-events-none" />
    </div>
  );
}

export function ForgotPasswordModal({ isOpen, onClose, email, setEmail, onSend, loading }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">Recover Password</DialogTitle>
        </DialogHeader>
        <div className="p-4 text-center">
          <div className="w-16 h-16 bg-[#4F7DF3]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[#4F7DF3]" size={32} />
          </div>
          <p className="text-sm text-[#94A3B8] mb-6">Enter your email and we'll send a recovery link.</p>
          <div className="text-left mb-6">
            <InputField label="Email Address" icon={<Mail size={18} />} placeholder="name@example.com" value={email} onChange={setEmail} required />
          </div>
          <button onClick={onSend} disabled={loading} className="w-full h-11 bg-[#4F7DF3] rounded-md font-black text-white flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "SENDING..." : "SEND RESET LINK"} <Send size={18} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}