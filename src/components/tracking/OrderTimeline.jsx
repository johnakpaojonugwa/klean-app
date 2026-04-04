import { CheckCircle, AlertCircle } from "lucide-react";
import { STAGES } from "@/components/tracking/TrackingConstants";

export default function OrderTimeline({ status }) {
  const currentStageIndex = STAGES.findIndex((s) => s.key === status);

  if (status === "cancelled") {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
        <p className="font-semibold text-rose-600">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-semibold text-slate-800 mb-6">Order Progress</h3>
      <div className="space-y-0">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isLast = index === STAGES.length - 1;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted ? "bg-teal-500" : isCurrent ? "bg-teal-600 ring-4 ring-teal-100" : "bg-slate-100"
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : 
                  <Icon className={`w-5 h-5 ${isCurrent ? "text-white" : "text-slate-400"}`} />}
                </div>
                {!isLast && <div className={`w-0.5 flex-1 my-1 min-h-[24px] ${isCompleted ? "bg-teal-400" : "bg-slate-200"}`} />}
              </div>
              <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                <p className={`font-semibold text-sm ${isCompleted ? "text-teal-700" : isCurrent ? "text-slate-800" : "text-slate-400"}`}>
                  {stage.label}
                  {isCurrent && <span className="ml-2 text-xs font-medium bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Current</span>}
                </p>
                {(isCompleted || isCurrent) && <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}