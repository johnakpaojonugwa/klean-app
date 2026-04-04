import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

/**
 * @param {string} title - The label of the metric
 * @param {string|number} value - The main display value
 * @param {LucideIcon} icon - The Lucide icon component
 * @param {number} trend - Percentage change (positive or negative)
 * @param {string} colorClass - Tailwind classes for the icon container (e.g., "bg-blue-500 text-white")
 * @param {boolean} loading - Loading state to show Skeleton
 */
export const ReportKpiCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  colorClass = "bg-primary/10 text-primary", 
  loading 
}) => {
  if (loading) {
    return <Skeleton className="h-32 w-full rounded-xl shadow-sm" />;
  }

  // Determine trend color and symbol
  const isPositive = trend >= 0;
  const trendColor = isPositive ? "text-emerald-600" : "text-rose-600";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-none shadow-md bg-white hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                {value}
              </h3>
              
              {/* Trend Indicator */}
              {trend !== undefined && (
                <div className={`flex items-center text-xs font-bold ${trendColor}`}>
                  <span className="mr-1">
                    {isPositive ? "↑" : "↓"} {Math.abs(trend)}%
                  </span>
                  <span className="text-muted-foreground font-normal">
                    vs last period
                  </span>
                </div>
              )}
            </div>

            {/* Icon Container */}
            <div className={`p-3 rounded-2xl ${colorClass.split(' ')[0]} bg-opacity-10`}>
              <Icon 
                className={`h-6 w-6 ${colorClass.split(' ').find(c => c.startsWith('text-')) || 'text-primary'}`} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportKpiCard;