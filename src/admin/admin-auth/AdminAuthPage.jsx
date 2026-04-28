import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { showSuccess, showError } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { loginApi } from "@/api/api";
import { ADMIN_ROLES } from "@/constants/roles";

import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";
import { RoleAccessList } from "@/components/auth/RoleAccessList";
import { AuthFeatures } from "@/components/auth/AuthFeatures";
import { AuthStats } from "@/components/auth/AuthStats";
import { SharedAuthLayout, AuthFormContainer } from "@/components/auth/SharedAuthLayout";

export default function AdminAuthPage() {
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState(null);
  
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useApp();

  useEffect(() => {
    if (isAuthenticated && user && ADMIN_ROLES.includes(user.role)) {
      console.debug('[AdminAuthPage] redirecting to /dashboard', { isAuthenticated, userRole: user.role });
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // LOGIN MUTATION
  const loginMutation = useMutation({
    mutationFn: (credentials) => loginApi(credentials),
    onSuccess: (response) => {
      // `loginApi` returns the backend `data` object (already unwrapped)
      const userData = response?.user || response?.data?.user;
      const token = response?.accessToken || response?.data?.accessToken;
      const refresh = response?.refreshToken || response?.data?.refreshToken || null;

      if (!userData || !token) {
        setServerError("Invalid server response. Please try again.");
        return;
      }

      // Check if the user has the right to be in the Admin Portal
      if (!ADMIN_ROLES.includes(userData.role)) {
        setServerError(`Access Denied: ${userData.role} is not authorized for Admin access.`);
        return;
      }

      // Context login (handles localStorage & state)
      login(userData, token, refresh);
      showSuccess(`Welcome, ${userData.fullname || 'Admin'}`);
      
    },
    onError: (error) => {
      const errorMsg = error?.response?.data?.message || "Authentication failed. Check your connection.";
      setServerError(errorMsg);
      showError(errorMsg);
    },
  });

  const handleLogin = (values) => {
    setServerError(null);
    loginMutation.mutate({
      email: values.email,
      password: values.password,
      rememberMe
    });
  };

  // Content for the branding side (Left)
  const leftContent = (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-700">
      <AuthHeader />
      <RoleAccessList />
      <AuthFeatures />
    </div>
  );

  // Content for the form side (Right)
  const rightContent = (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <AuthFormContainer 
        title="Admin Access" 
        subtitle="Sign in to manage your laundry ecosystem"
      >
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-medium animate-shake text-center">
            {serverError}
          </div>
        )}
        
        <LoginForm
          onFinish={handleLogin}
          isPending={loginMutation.isPending}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
        />
        
        <AuthStats />
      </AuthFormContainer>
      
      <p className="mt-8 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} Klean Laundry Systems. All rights reserved. 
        <br />
        Unauthorized access is strictly monitored.
      </p>
    </div>
  );

  return (
    <SharedAuthLayout
      leftContent={leftContent}
      rightContent={rightContent}
      bgClassName="min-h-screen bg-[#0f172a] selection:bg-blue-500/30"
    />
  );
}