import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function PageHeader({ title, subtitle, actionLabel, onAction, icon: Icon }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {actionLabel && (
        <Button onClick={onAction} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 text-white">
          {Icon ? <Icon className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}