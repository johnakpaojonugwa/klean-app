import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Building,
  Mail,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export const BranchCard = ({ branch, staffCount, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden group"
  >
    <div className="p-5 pb-0 flex justify-between items-start">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            {branch.branchCode || "LOC-100"}
          </span>
          <Badge
            className={
              branch.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50"
                : "bg-slate-50 text-slate-600 border-slate-100"
            }
            variant="outline"
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${branch.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
            />
            {branch.isActive ? "Online" : "Closed"}
          </Badge>
        </div>
        <h3 className="font-bold text-slate-900 text-xl tracking-tight leading-none pt-1">
          {branch.name}
        </h3>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-indigo-600"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onEdit(branch)}>
            <Edit className="w-4 h-4 mr-2 text-slate-400" /> Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(branch._id)}
            className="text-rose-600 focus:text-rose-600 focus:bg-rose-50"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Branch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div className="p-5 space-y-4">
      <div className="space-y-2.5 text-sm text-slate-600">
        <div className="flex gap-3 items-start group/info">
          <div className="p-2 rounded-lg bg-slate-50 text-indigo-600 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-colors">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="leading-snug pt-0.5">
            {typeof branch.address === "object"
              ? `${branch.address.street}, ${branch.address.city}`
              : branch.address}
          </span>
        </div>
        <div className="flex gap-3 items-center group/info">
          <div className="p-2 rounded-lg bg-slate-50 text-indigo-600 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-colors">
            <Phone className="w-4 h-4" />
          </div>
          <span className="font-medium">{branch.contactNumber}</span>
        </div>
        <div className="flex gap-3 items-center group/info">
          <div className="p-2 rounded-lg bg-slate-50 text-indigo-600 group-hover/info:bg-indigo-600 group-hover/info:text-white transition-colors">
            <Clock className="w-4 h-4" />
          </div>
          <span>{branch.operatingHours}</span>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            Manager
          </span>
          <span className="text-sm font-semibold text-indigo-950">
            {branch.manager?.fullname || "Unassigned"}
          </span>
        </div>
        <div className="flex items-center bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
          <Users className="w-3.5 h-3.5 text-indigo-600 mr-2" />
          <span className="text-xs font-bold text-indigo-700">
            {staffCount || 0} Staff
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export const BranchFormDialog = ({
  showForm,
  setShowForm,
  editBranches,
  formData,
  errors,
  handleInputChange,
  handleSave,
  isEmployeesPending,
  employees,
  isSubmitting,
}) => (
  <Dialog open={showForm} onOpenChange={setShowForm}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
          <Building className="w-8 h-8" />
          {editBranches ? "Update Branch" : "Add New Branch"}
        </DialogTitle>
        <p className="text-indigo-100 text-sm mt-2">
          {editBranches
            ? "Modify branch details and configuration"
            : "Create a new branch location and assign manager"}
        </p>
      </div>
      <form onSubmit={handleSave} className="p-8 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Building className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Basic Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Building className="w-4 h-4" /> Branch Name *
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`h-11 bg-slate-50 ${errors.name ? "border-red-500" : ""}`}
                placeholder="Enter branch name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address *
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`h-11 bg-slate-50 ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Address Details
            </h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                Street Address *
              </Label>
              <Input
                value={formData.address.street}
                onChange={(e) =>
                  handleInputChange("address.street", e.target.value)
                }
                className={`h-11 bg-slate-50 ${errors.address ? "border-red-500" : ""}`}
              />
              {errors.address && (
                <p className="text-red-600 text-sm">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>City *</Label>
                <Input
                  value={formData.address.city}
                  onChange={(e) =>
                    handleInputChange("address.city", e.target.value)
                  }
                  className={errors.city ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label>State *</Label>
                <Input
                  value={formData.address.state}
                  onChange={(e) =>
                    handleInputChange("address.state", e.target.value)
                  }
                  className={errors.state ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label>Zip Code</Label>
                <Input
                  value={formData.address.zip}
                  onChange={(e) =>
                    handleInputChange("address.zip", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Phone className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Contact & Operations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={formData.contactNumber}
                onChange={(e) =>
                  handleInputChange("contactNumber", e.target.value)
                }
                className={errors.contactNumber ? "border-red-500" : ""}
              />
              {errors.contactNumber && (
                <p className="text-red-600 text-sm">{errors.contactNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Operating Hours</Label>
              <Input
                value={formData.operatingHours}
                onChange={(e) =>
                  handleInputChange("operatingHours", e.target.value)
                }
                placeholder="e.g. 9AM - 6PM"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              <Briefcase className="w-4 h-4 inline mr-2" /> Services Offered
            </Label>
            <Input
              value={formData.servicesOffered}
              onChange={(e) =>
                handleInputChange("servicesOffered", e.target.value)
              }
              placeholder="e.g. Wash & Fold, Dry Cleaning"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Manager Assignment
            </h3>
          </div>
          <Select
            value={formData.manager}
            onValueChange={(value) => handleInputChange("manager", value)}
          >
            <SelectTrigger className="h-11 bg-slate-50">
              <SelectValue
                placeholder={
                  isEmployeesPending
                    ? "Loading staff..."
                    : "Select Manager (Optional)"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp._id} value={emp._id}>
                  {emp.fullname || emp.employeeJobRole}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4 justify-end pt-8 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowForm(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
              className="px-6 py-2 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting
              ? "Saving..."
              : editBranches
                ? "Update Branch"
                : "Create Branch"}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);
