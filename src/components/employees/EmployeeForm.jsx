import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllBranches } from "@/api/branches";
import { User, Mail, Phone, Lock, Briefcase, Building, MapPin, Calendar, Badge, Camera, Eye, EyeOff } from "lucide-react";

const defaultFormData = (initialData) => ({
  fullname: initialData?.userId?.fullname || "",
  email: initialData?.userId?.email || "",
  phoneNumber: initialData?.userId?.phoneNumber || "",
  password: initialData?.userId?.password || "",
  designation: initialData?.designation || "",
  department: initialData?.department || "",
  branchId: initialData?.branchId || "",
  joinDate: initialData?.joinDate || "",
  employeeJobRole: initialData?.employeeJobRole || "",  status: initialData?.status || "ACTIVE",  avatar: null,
});

export default function EmployeeForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(() => defaultFormData(initialData));
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: () => getAllBranches(1, 100, true),
  });

  useEffect(() => {
    if (open) {
      setFormData(defaultFormData(initialData));
      setChangePassword(false);
      setShowPassword(false);
    }
  }, [open, initialData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8" />
            {initialData ? "Update Team Member" : "Add New Employee"}
          </DialogTitle>
          <p className="text-indigo-100 text-sm mt-2">
            {initialData 
              ? "Modify employee information and permissions" 
              : "Create a new team member account with appropriate access"}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!formData.branchId) {
              alert("Please select a branch");
              return;
            }
            onSubmit(formData);
          }}
          className="p-8 space-y-8"
        >
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, fullname: e.target.value }))
                  }
                  required
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                  required
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Join Date
                </Label>
                <Input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, joinDate: e.target.value }))
                  }
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Lock className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Account Security</h3>
            </div>

            {!initialData && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, password: e.target.value }))
                    }
                    required={!initialData}
                    className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70 pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {initialData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700">Change Password</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setChangePassword(!changePassword)}
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    {changePassword ? "Cancel" : "Change Password"}
                  </Button>
                </div>

                {changePassword && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, password: e.target.value }))
                        }
                        className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70 pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Professional Information Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Professional Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Badge className="w-4 h-4" />
                  Job Role
                </Label>
                <Input
                  value={formData.employeeJobRole}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, employeeJobRole: e.target.value.toUpperCase() }))
                  }
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="e.g., STAFF, MANAGER"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Designation
                </Label>
                <Input
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, designation: e.target.value }))
                  }
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="e.g., Senior Developer"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Department
                </Label>
                <Input
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, department: e.target.value }))
                  }
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="e.g., Engineering"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Branch *
                </Label>
                <Select
                  value={formData.branchId}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, branchId: value }))
                  }
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {(branches?.data?.branches || branches?.data || branches || [])?.map((branch) => (
                      <SelectItem key={branch._id} value={branch._id}>
                        {branch.name || branch.branchName || branch._id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Status Section (Edit Only) */}
          {initialData && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <Badge className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Account Status</h3>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Badge className="w-4 h-4" />
                  Employment Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, status: value }))
                  }
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Profile Image Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Camera className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Profile Image</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Upload Profile Picture
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    avatar: e.target.files?.[0] || null,
                  }))
                }
                className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {formData.avatar && (
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Selected: {formData.avatar.name}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-8 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 h-11 border-slate-300 text-slate-700 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {initialData ? "Updating..." : "Creating..."}
                </div>
              ) : (
                initialData ? "Update Employee" : "Create Employee"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
