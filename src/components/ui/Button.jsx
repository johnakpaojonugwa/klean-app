"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Modern Design Tokens:
 * - Subtle gradients for "Default" (Primary)
 * - Glassmorphism for "Outline"
 * - Desaturated tones for "Secondary"
 * - Refined "Mira" (Brand) variant
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl cursor-pointer text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/10 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // High-end Gradient with subtle inner border
        default:
          "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200",
        
        // Soft, desaturated danger
        destructive:
          "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/60 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
        
        // Sophisticated Glass/Border style
        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300",
        
        // Low-contrast slate
        secondary:
          "bg-slate-100/80 text-slate-900 hover:bg-slate-200/80 border border-transparent dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700",
        
        // Invisible until interaction
        ghost: 
          "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        
        // Your signature Brand variant - Soft Indigo
        mira: 
          "bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-400",
        
        link: 
          "text-indigo-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }