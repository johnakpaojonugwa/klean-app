"use client"

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/**
 * Modern Restyle Features:
 * - TabsList: h-11 proportional height, rounded-xl to match Input/Select.
 * - TabsTrigger: rounded-lg for the active pill, indigo-600 text.
 * - Animation: Subtle scale/transition for the active state.
 */

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-center rounded-md bg-slate-100/70 p-1 text-slate-500 backdrop-blur-sm",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full p-1 text-sm font-semibold tracking-tight transition-all duration-200",
      "ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/20",
      "disabled:pointer-events-none disabled:opacity-50",
      "text-slate-500 hover:text-slate-700 hover:bg-white/50",
      // Active State: Crisp white pill with shadow and indigo text
      "data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:scale-[1.02]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/20",
      // Optional: Add a subtle fade-in animation for content switching
      "animate-in fade-in duration-300 slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };