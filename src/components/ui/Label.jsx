"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

/**
 * Modern Restyle Features:
 * - font-semibold: Increased weight for better readability against white backgrounds.
 * - tracking-tight: For a more professional, "compact" look.
 * - peer-focus logic: The label subtly shifts color when the input is focused.
 */

const labelVariants = cva(
  "text-sm font-semibold leading-none tracking-tight text-slate-700 transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70 peer-focus:text-indigo-600"
)

const Label = React.forwardRef(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-1 text-rose-500 font-bold" aria-hidden="true">
        *
      </span>
    )}
  </LabelPrimitive.Root>
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }