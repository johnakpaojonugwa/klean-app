import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useApp } from "@/context/AppContext";
import Header from "@/components/layout/Header.jsx";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sub-components
import {
  InputField,
  PasswordStrengthIndicator,
} from "@/components/auth/InputField";
import { AuthVisuals, ForgotPasswordModal } from "@/components/auth/Layouts";

// Assets & API
import LoginGif from "@/assets/Mobilelogin.gif";
import SignupGif from "@/assets/Signup.gif";
import { loginApi, signupApi, forgotPasswordApi } from "@/api/api";

export default function AuthPage() {
  // --- States ---
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { login: contextLogin } = useApp();

  // --- Logic: Handle Remember Me on Load ---
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // --- Logic: Auth Mutation (Login/Signup) ---
  const authMutation = useMutation({
    mutationFn: async (payload) => {
      const response = isLogin
        ? await loginApi(payload)
        : await signupApi(payload);
      return response;
    },
    onSuccess: (response) => {
      if (rememberMe) localStorage.setItem("rememberedEmail", form.email);
      else localStorage.removeItem("rememberedEmail");

      const { user, accessToken, refreshToken } = response.data || {};

      if (user && accessToken) {
        // Store phone number from signup form if signing up
        if (!isLogin && form.phoneNumber) {
          sessionStorage.setItem("klean_user_phone", form.phoneNumber);
        }
        
        contextLogin(user, accessToken, refreshToken || null);

        toast.success(
          isLogin ? "Welcome back!" : "Account created successfully!",
        );
        navigate("/");
      } else {
        console.error(
          "Auth Logic Error: Data found but user/token missing",
          response,
        );
        toast.error("An error occurred during login. Please try again.");
      }
    },
    onError: (err) => {
      const backendErrors = err?.response?.data?.errors;
      const errorMsg =
        backendErrors && backendErrors.length > 0
          ? backendErrors[0]
          : err?.response?.data?.message || err?.message || "Connection failed";

      toast.error(errorMsg);
      // Safe logging — avoid reading properties from undefined
      console.error(
        "Auth Error Detail:",
        err?.response?.data ?? err?.stack ?? err,
      );
    },
  });

  // --- Logic: Forgot Password Mutation ---
  const forgotMutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast.success("Check your email for a recovery link!");
      setIsForgotModalOpen(false);
      setResetEmail("");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Reset link could not be sent",
      );
    },
  });

  const validateForm = () => {
    // If logging in, we let the backend handle credential checks
    if (isLogin) return true;

    // Signup-specific validation
    if (!form.fullname || form.fullname.trim().length < 3) {
      toast.warning("Full name must be at least 3 characters");
      return false;
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    if (!phoneRegex.test(form.phoneNumber)) {
      toast.warning("Valid phone number is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.warning("Valid email is required");
      return false;
    }

    const strongPassRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassRegex.test(form.password)) {
      toast.error(
        "Password must be at least 8 characters with uppercase, number, and symbol",
      );
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true; // CRITICAL: Must return true here!
  };

  // --- Event Handlers ---
  const handleAuth = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Normalize common fields
    const cleanEmail = form.email.toLowerCase().trim();

    if (isLogin) {
      authMutation.mutate({
        email: cleanEmail,
        password: form.password,
      });
    } else {
      // Formatting only needed for Signup
      let formattedPhone = form.phoneNumber.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+${formattedPhone}`;
      }

      authMutation.mutate({
        fullname: form.fullname.trim(),
        email: cleanEmail,
        phoneNumber: formattedPhone,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = () => {
    if (!resetEmail) return toast.warning("Please enter your email address");
    forgotMutation.mutate({ email: resetEmail });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
      <Header />

      {/* Background Mesh Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4F7DF3]/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-[#3F6AE1]/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1440px] h-screen lg:h-[85vh] bg-white/40 backdrop-blur-xl sm:rounded-[40px] overflow-hidden border sm:border-white/60 shadow-2xl">
        {/* LEFT SIDE: Visuals */}
        <AuthVisuals
          isLogin={isLogin}
          LoginGif={LoginGif}
          SignupGif={SignupGif}
        />

        {/* RIGHT SIDE: Form Container */}
        <div className="w-full lg:w-[40%] p-6 sm:p-10 lg:p-16 flex flex-col justify-center overflow-y-auto bg-white/20">
          {/* TAB TOGGLE */}
          <div className="flex bg-slate-200/50 p-1 rounded-2xl w-full max-w-[280px] mb-10 mx-auto lg:mx-0 border border-white/50">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${isLogin ? "bg-[#4F7DF3] text-white shadow-lg" : "text-[#64748B] hover:text-[#4F7DF3]"}`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${!isLogin ? "bg-[#4F7DF3] text-white shadow-lg" : "text-[#64748B] hover:text-[#4F7DF3]"}`}
            >
              SIGN UP
            </button>
          </div>

          <form
            onSubmit={handleAuth}
            className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-700 max-w-md mx-auto lg:mx-0 w-full"
          >
            {/* FULL NAME (Signup Only) */}
            {!isLogin && (
              <InputField
                label="Full Name"
                icon={<User size={18} />}
                placeholder="John Doe"
                value={form.fullname}
                onChange={(v) => setForm({ ...form, fullname: v })}
                required
              />
            )}

            {/* EMAIL */}
            <InputField
              label="Email Address"
              icon={<Mail size={18} />}
              placeholder="name@example.com"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              required
            />

            {/* PHONE NUMBER */}
            {!isLogin && (
              <InputField
                label="Phone Number"
                icon={<Phone size={18} />}
                placeholder="+234 123 456 7890"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phoneNumber: v })}
                required
              />
            )}

            {/* PASSWORD SECTION */}
            <div
              className={`grid gap-4 ${isLogin ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
            >
              <div className="space-y-1">
                <InputField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={<Lock size={18} />}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(v) => setForm({ ...form, password: v })}
                  required
                  rightElement={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#94A3B8] hover:text-[#4F7DF3]"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  }
                />
                {!isLogin && form.password && (
                  <PasswordStrengthIndicator password={form.password} />
                )}
              </div>

              {/* CONFIRM PASSWORD (Signup Only) */}
              {!isLogin && (
                <InputField
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  icon={<Lock size={18} />}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(v) => setForm({ ...form, confirmPassword: v })}
                  required
                />
              )}
            </div>

            {/* REMEMBER ME & FORGOT PASSWORD */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#4F7DF3] focus:ring-[#4F7DF3] transition-all"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-[11px] font-bold text-[#64748B] group-hover:text-[#4F7DF3] transition-colors uppercase tracking-tight">
                  Remember me
                </span>
              </label>

              {isLogin && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-bold text-[#3F6AE1] hover:text-[#4F7DF3] hover:underline uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Forgot Password?
                </Button>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={authMutation.isPending}
              className="w-full mt-6 font-black bg-[#4F7DF3] hover:bg-[#3F6AE1] text-white tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {authMutation.isPending && (
                <Loader2 className="w-5 h-5 animate-spin" />
              )}

              <span className="text-xs tracking-[0.2em]">
                {authMutation.isPending
                  ? "PROCESSING..."
                  : isLogin
                    ? "SIGN IN"
                    : "CREATE ACCOUNT"}
              </span>
              {!authMutation.isPending && <ArrowRight size={18} />}
            </Button>
          </form>
        </div>
      </div>

      {/* MODAL: Forgot Password */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        email={resetEmail}
        setEmail={setResetEmail}
        onSend={handleForgotPassword}
        loading={forgotMutation.isPending}
      />
    </div>
  );
}
