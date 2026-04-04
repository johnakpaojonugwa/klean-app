"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

/**
 * Styling Strategy:
 * - Rounded-xl for a modern container look.
 * - Indigo-600 accents for active/focus states.
 * - White/95 background with backdrop-blur for glassmorphism.
 * - Tight, bold uppercase labels for a SaaS feel.
 */

const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all",
      "focus:bg-indigo-50 focus:text-indigo-600 data-[state=open]:bg-indigo-50 data-[state=open]:text-indigo-600",
      "group [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-slate-400 group-focus:text-indigo-500",
      inset && "pl-10",
      className
    )}
    {...props}>
    {children}
    <ChevronRight className="ml-auto opacity-50" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[12rem] overflow-hidden rounded-xl border border-slate-200/60 bg-white/95 backdrop-blur-md p-1.5 text-slate-950 shadow-xl animate-in fade-in zoom-in-95",
      "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
      className
    )}
    {...props} />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 8, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[14rem] overflow-hidden rounded-xl border border-slate-200/60 bg-white/95 backdrop-blur-md p-1.5 text-slate-950 shadow-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
        "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        className
      )}
      {...props} />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all outline-none cursor-pointer",
      "focus:bg-indigo-50 focus:text-indigo-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-slate-400 transition-colors focus:[&>svg]:text-indigo-500",
      inset && "pl-10",
      className
    )}
    {...props} />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2.5 pl-10 pr-3 text-sm font-medium transition-colors outline-none focus:bg-indigo-50 focus:text-indigo-600",
      className
    )}
    checked={checked}
    {...props}>
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4 stroke-[3px] text-indigo-600" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-lg py-2.5 pl-10 pr-3 text-sm font-medium transition-colors outline-none focus:bg-indigo-50 focus:text-indigo-600",
      className
    )}
    {...props}>
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500/80",
      inset && "pl-10",
      className
    )}
    {...props} />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1.5 my-1.5 h-px bg-slate-100 dark:bg-slate-800", className)}
    {...props} />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }) => {
  return (
    <span
      className={cn("ml-auto text-[10px] font-bold tracking-widest text-slate-400", className)}
      {...props} />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}