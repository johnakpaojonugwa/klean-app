import { ExportButton } from "@/components/dashboard/ExportButton";
import { motion } from "framer-motion";
import { ROLES } from "@/constants/roles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_CONFIGS = {
  [ROLES.SUPER_ADMIN]: {
    title: "Global Overview",
    subtitle: "Monitoring performance across all laundry branches.",
    showExport: true,
    showDateRange: true,
    showBranchPicker: true,
  },
  [ROLES.BRANCH_MANAGER]: {
    title: "Branch Dashboard",
    subtitle: (data) => `Managing ${data?.branchName || "Branch"} operations.`,
    showExport: true,
    showDateRange: true,
    showBranchPicker: false,
  },
  [ROLES.STAFF]: {
    title: "My Workspace",
    subtitle: "Track your daily tasks and assigned orders.",
    showExport: false,
    showDateRange: false,
    showBranchPicker: false,
  },
  [ROLES.CUSTOMER]: {
    title: "Order History",
    subtitle: "View and track your recent laundry requests.",
    showExport: false,
    showDateRange: true,
    showBranchPicker: false,
  },
};

const DashboardHeader = ({
  userRole = ROLES.CUSTOMER, // Use centralized default
  dateRange,
  onRangeChange,
  summaryData,
  startDate,
  selectedBranch,
  onBranchChange,
  branch = [], // Array of { id, name }
}) => {
  // Config lookup using the centralized role strings
  const config = ROLE_CONFIGS[userRole] || ROLE_CONFIGS[ROLES.CUSTOMER];

  const renderedSubtitle = typeof config.subtitle === "function" 
    ? config.subtitle(summaryData?.data) 
    : config.subtitle;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {config.title}
        </h1>
        <p className="text-slate-500 text-sm">{renderedSubtitle}</p>
      </motion.div>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Render Branch Picker only for SUPER_ADMIN */}
        {config.showBranchPicker && (
          <Select value={selectedBranch} onValueChange={onBranchChange}>
            <SelectTrigger className="w-[180px] shadow-sm">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branch.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {config.showDateRange && (
          <Select value={dateRange} onValueChange={onRangeChange}>
            <SelectTrigger className="w-[140px] shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        )}

        {config.showExport && (
          <ExportButton
            dashboardData={summaryData?.data}
            dateRange={dateRange}
            startDate={startDate}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;