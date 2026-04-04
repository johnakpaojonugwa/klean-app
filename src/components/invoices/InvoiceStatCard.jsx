import React from "react";

/**
 * @param {string} title - Card heading
 * @param {number} amount - Naira value
 * @param {number} count - Total count of items
 * @param {React.ComponentType} icon - Lucide icon component passed as a reference
 * @param {string} colorClass - Tailwind classes for icon background/text
 */
export default function InvoiceStatCard({ title, amount, count, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
      {/* Icon Wrapper */}
      <div className={`p-3 rounded-xl ${colorClass} shrink-0`}>
        {/* We render the Icon component here */}
        {Icon && <Icon size={24} />}
      </div>
      
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-bold text-slate-900 leading-none">
            ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">
            {count} items
          </span>
        </div>
      </div>
    </div>
  );
}