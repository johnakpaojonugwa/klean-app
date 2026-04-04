import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const FEATURES = [
  { title: "Real-time Analytics", desc: "Monitor branch performance as it happens.", color: "text-emerald-500" },
  { title: "Inventory Control", desc: "Automated low-stock alerts and tracking.", color: "text-blue-500" },
  { title: "Staff Management", desc: "Coordinate schedules and task assignments.", color: "text-purple-500" },
  { title: "Financial Reporting", desc: "Generate instant PDF/CSV revenue audits.", color: "text-amber-500" },
];

export const AuthFeatures = () => (
  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
    <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      System Features
    </h3>
    <ul className="space-y-4">
      {FEATURES.map((feature, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <CheckCircle2 className={`${feature.color} mt-1 flex-shrink-0`} size={18} />
          <div>
            <div className="text-slate-200 font-semibold text-sm leading-none">
              {feature.title}
            </div>
            <div className="text-slate-400 text-xs mt-1">
              {feature.desc}
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default AuthFeatures;