"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

/**
 * Modern Separator Features:
 * - Slate-200/300 Palette: Matches the Input border colors.
 * - Gradient Softening: Optional fades for a high-end feel.
 * - Typography: Labels match the "uppercase tracking-wider" style of your Input errors.
 * - Subtle Glow: Focus-within support for interactive containers.
 */

const Separator = React.forwardRef((
  { 
    className, 
    orientation = "horizontal", 
    decorative = true, 
    variant = "solid", // "solid" | "gradient"
    label,             // Optional text in the middle
    ...props 
  },
  ref
) => {
  const isHorizontal = orientation === "horizontal";

  // Base line style matching the Input border-slate-200
  const lineBase = cn(
    "shrink-0 bg-slate-200/80 transition-colors duration-300",
    isHorizontal ? "h-[1px] w-full" : "h-full w-[1px]",
    
    // Gradient variant for a more modern, "faded" look
    variant === "gradient" && (
      isHorizontal 
        ? "bg-gradient-to-r from-transparent via-slate-200 to-transparent" 
        : "bg-gradient-to-b from-transparent via-slate-200 to-transparent"
    )
  );

  // If a label is provided, we use a flex wrapper to center text
  if (label && isHorizontal) {
    return (
      <div 
        className={cn(
          "flex w-full items-center gap-4 py-2", 
          className
        )}
      >
        <div className={cn(
          "h-[1px] flex-1 bg-slate-200/70", 
          variant === "gradient" && "bg-linear-to-r from-transparent to-slate-200"
        )} />
        
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 select-none">
          {label}
        </span>
        
        <div className={cn(
          "h-[1px] flex-1 bg-slate-200/70", 
          variant === "gradient" && "bg-linear-to-l from-transparent to-slate-200"
        )} />
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(lineBase, className)}
      {...props}
    />
  );
})

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }