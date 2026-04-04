import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Loader2, ShieldAlert } from "lucide-react";
import { useApp } from "@/context/AppContext";

//  Lazy load role-specific dashboards
const SuperAdminDashboard = lazy(() =>
  import("./SuperAdminDashboard").then((m) => ({ default: m.SuperAdminDashboard }))
);
const BranchManagerDashboard = lazy(() =>
  import("./BranchManagerDashboard").then((m) => ({ default: m.BranchManagerDashboard }))
);
const StaffDashboard = lazy(() =>
  import("./StaffDashboard").then((m) => ({ default: m.StaffDashboard }))
);
const CustomerDashboard = lazy(() =>
  import("./CustomerDashboard").then((m) => ({ default: m.CustomerDashboard }))
);

// Defensive Skeleton 
function DashboardSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-48 lg:w-64 bg-slate-200 rounded-lg" />
        <Skeleton className="h-4 w-72 lg:w-96 bg-slate-100 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="h-32 w-full rounded-2xl bg-white border border-slate-200 shadow-sm" 
          />
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl bg-white border border-slate-200" />
        <Skeleton className="h-[400px] rounded-2xl bg-white border border-slate-200" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const {
    user,
    isSuperAdmin,
    isManager,
    isStaff,
    isCustomer,
    branchId,
    loadingUser,
  } = useApp();

  // Handle Initial Auth Loading
  if (loadingUser) {
    return (
      <div className="p-4 md:p-8 lg:p-10 bg-slate-50/50 min-h-screen">
        <DashboardSkeleton />
      </div>
    );
  }

  // Handle Unauthorized or Missing User Data
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <div className="bg-rose-50 p-4 rounded-full mb-4">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Authentication Required</h2>
        <p className="text-slate-500 mt-2 max-w-sm">
            Your session has timed out or you are not authorized. Please sign in again.
        </p>
      </div>
    );
  }

  // logic: Check if user needs a branchId but doesn't have one yet
  const needsBranch = (isManager || isStaff) && !isSuperAdmin;
  if (needsBranch && !branchId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
        <div className="relative mb-6">
          <Loader2 className="w-14 h-14 animate-spin text-indigo-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Setting up your workspace</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
          We're fetching the latest records for your assigned branch.
        </p>
      </div>
    );
  }

  // Role resolution logic
  const renderDashboard = () => {
    if (isSuperAdmin) return <SuperAdminDashboard />;
    if (isManager)    return <BranchManagerDashboard branchId={branchId} />;
    if (isStaff)      return <StaffDashboard branchId={branchId} staffId={user?._id || user?.id} />;
    if (isCustomer)   return <CustomerDashboard customerId={user?._id || user?.id} />;
    
    return (
      <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
        <p className="text-slate-400 font-medium">No dashboard assigned to this role.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="p-4 md:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
        <Suspense fallback={<DashboardSkeleton />}>
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            {renderDashboard()}
          </div>
        </Suspense>
      </div>
    </div>
  );
}