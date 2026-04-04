import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <Button onClick={onAction} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" /> {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}