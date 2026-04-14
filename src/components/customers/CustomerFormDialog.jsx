import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { User, Mail, Phone, Lock, Eye, EyeOff, Camera, MapPin } from "lucide-react";

export default function CustomerFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  isEditing,
  isPending,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

    // Phone Number validation (optional but if provided, validate)
    const phoneTrimmed = formData.phoneNumber.trim();
    if (phoneTrimmed) {
      if (!/^\+?[\d\s\-()]{7,20}$/.test(phoneTrimmed)) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      } else if ((phoneTrimmed.replace(/\D/g, '').length) < 7) {
        newErrors.phoneNumber = 'Phone number is too short';
      }
    }

    // Password validation (only for new customers)
    if (!isEditing) {
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
      console.log("Form validation failed", errors);
      return;
    }

    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8" />
            {isEditing ? "Update Customer" : "Add New Customer"}
          </DialogTitle>
          <p className="text-indigo-100 text-sm mt-2">
            {isEditing
              ? "Modify customer information and account details"
              : "Create a new customer account with their contact information"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                  id="fullname"
                  value={formData.fullname}
                  onChange={(e) =>
                    handleInputChange('fullname', e.target.value)
                  }
                  autoComplete="off"
                  className={`h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
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
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange('phoneNumber', e.target.value)
                  }
                  autoComplete="off"
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange('email', e.target.value)
                  }
                  autoComplete="off"
                  className={`h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    handleInputChange('address', e.target.value)
                  }
                  autoComplete="off"
                  className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter address"
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  autoComplete="new-password"
                  className={`h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 pr-10 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

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
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((p) => ({ ...p, avatar: e.target.files?.[0] || null }))
                }
                className="h-11 bg-slate-50 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
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
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 py-2 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEditing ? "Updating..." : "Creating..."}
                </div>
              ) : (
                isEditing ? "Update Customer" : "Create Customer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
