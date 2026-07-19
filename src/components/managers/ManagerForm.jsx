import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useQuery } from "@tanstack/react-query";
import { branchesApi } from "@/api/branches";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  Building,
  MapPin,
  Camera,
  Calendar,
  Badge,
  Eye,
  EyeOff,
} from "lucide-react";

const defaultFormData = (initialData) => ({
  fullname: initialData?.userId?.fullname || "",
  email: initialData?.userId?.email || "",
  phoneNumber: initialData?.userId?.phoneNumber || "",
  password: initialData?.userId?.password || "",
  designation: initialData?.userId?.designation || "",
  department: initialData?.userId?.department || "",
  status: initialData?.status?.toUpperCase() || "ACTIVE",
  branchId: initialData?.branchId?._id || "",
  avatar: null,
});

export default function ManagerForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(() => defaultFormData(initialData));
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: branchesResponse, isPending: isBranchesPending } = useQuery({
    queryKey: branchesApi.list.queryKey(1, 100, true),
    queryFn: () => branchesApi.list(1, 100, true),
  });

  const branches = useMemo(
    () => branchesResponse?.data?.branches || [],
    [branchesResponse],
  );

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Number validation
    const phoneTrimmed = formData.phoneNumber.trim();

    if (!phoneTrimmed) {
      newErrors.phoneNumber = 'Phone number is required';
    } 
    else if (!/^\+?[\d\s\-()]{7,20}$/.test(phoneTrimmed)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    else if ((phoneTrimmed.replace(/\D/g, '').length) < 7) {
      newErrors.phoneNumber = 'Phone number is too short';
    }

    // Branch validation
    if (!formData.branchId) {
      newErrors.branchId = 'Please select a branch';
    }

    // Password validation (only for new managers)
    if (!initialData) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-[#4F7DF3] p-8 text-white">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8" />
            {initialData ? "Update Manager" : "Add New Manager"}
          </DialogTitle>
          <p className="text-slate-100 text-sm mt-2">
            {initialData
              ? "Modify manager details and assigned branch"
              : "Create a new manager profile and assign their branch"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Branch Assignment</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Assigned Branch *
              </Label>
              <Select
                value={formData.branchId}
                onValueChange={(value) =>
                  handleInputChange('branchId', value)
                }
              >
                <SelectTrigger className={`h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70 ${
                  errors.branchId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}>
                  <SelectValue placeholder={isBranchesPending ? "Loading branches..." : "Select Branch"} />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branchId && (
                <p className="text-red-600 text-sm mt-1">{errors.branchId}</p>
              )}
            </div>
          </div>

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
                    handleInputChange('fullname', e.target.value)
                  }
                  className={`h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70 ${
                    errors.fullname ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullname && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullname}</p>
                )}
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
                    handleInputChange('email', e.target.value)
                  }
                  className={`h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange('phoneNumber', e.target.value)
                  }
                  className={`h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70 ${
                    errors.phoneNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Join Date
                </Label>
                <Input
                  type="date"
                  value={formData.joinDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, joinDate: e.target.value }))
                  }
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                />
              </div>
            </div>
          </div>

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
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
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
                          setFormData((prev) => ({ ...prev, password: e.target.value }))
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

          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800">Professional Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Designation
                </Label>
                <Input
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, designation: e.target.value }))
                  }
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="Enter role"
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
                    setFormData((prev) => ({ ...prev, department: e.target.value }))
                  }
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70"
                  placeholder="Enter department"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Badge className="w-4 h-4" />
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                  className="h-11"
                >
                  <SelectTrigger className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-70">
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
          </div>

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
                  setFormData((prev) => ({
                    ...prev,
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
              className="px-6 py-2 h-11 bg-[#4F7DF3] hover:bg-[#3F6AE1] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : initialData ? "Update Manager" : "Create Manager"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
