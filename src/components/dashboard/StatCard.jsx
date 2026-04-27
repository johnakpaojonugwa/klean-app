import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendUp, 
  className, 
  iconBg = "bg-teal-50",
  iconColor = "text-teal-600", 
  loading 
}) {
  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {/* Title skeleton */}
            <Skeleton className="h-3 w-20" />
            
            {/* Value skeleton */}
            <div className="space-y-1">
              <Skeleton className="h-8 w-40" />
              {/* Subtitle skeleton */}
              <Skeleton className="h-3 w-32" />
            </div>

            {/* Trend skeleton */}
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          {/* Icon skeleton */}
          <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">
            {title}
          </p>
          
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
            )}
          </div>

          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
              trendUp 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-rose-50 text-rose-600 border-rose-100"
            )}>
              <span>{trendUp ? "↑" : "↓"}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={cn(
            "p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-sm", 
            iconBg
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
        )}
      </div>
    </motion.div>
  );
}