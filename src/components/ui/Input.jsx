"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Modern Restyle Features:
 * - Rounded-xl: Consistent with Dialog and Dropdown.
 * - H-11: Proportional height for a better touch/click target.
 * - Transition: Smooth background and border-color shifts.
 * - Icon Logic: Dynamic color change based on focus-within.
 * - Focus State: Indigo-600 border with a soft 20% opacity ring.
 */

const Input = React.forwardRef(({ className, type, icon: Icon, error, ...props }, ref) => {
  return (
    <div className="relative w-full group">
      {/* Icon Support */}
      {Icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200">
          <Icon size={18} strokeWidth={2.5} />
        </div>
      )}

      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-11 w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200",
          "placeholder:text-slate-400/70 font-medium text-slate-900",
          
          // Hover state
          "hover:border-slate-300 hover:bg-slate-50/30",
          
          // Focus state (Indigo Theme)
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400",
          
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200",
          
          // Error state (Rose Theme)
          error && [
            "border-rose-400 text-rose-900",
            "focus-visible:ring-rose-500/10 focus-visible:border-rose-500",
            "hover:border-rose-500"
          ],
          
          // Padding adjustment for icons
          Icon && "pl-11",
          
          className
        )}
        ref={ref}
        {...props}
      />

      {/* Modern Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 ml-1">
          <div className="h-1 w-1 rounded-full bg-rose-500" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };