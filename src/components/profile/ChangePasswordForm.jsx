import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "@/hooks/useToast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { changePassword } from "@/api/user";

export default function ChangePasswordForm() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Mutation for changing password
  const changePwdMutation = useMutation({
    mutationFn: (data) =>
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setIsEditing(false);
      setShowPasswords({ current: false, new: false, confirm: false });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message || "Failed to change password";
      if (errorMsg.includes("current")) {
        setErrors((prev) => ({ ...prev, current: errorMsg }));
      }
      toast.error(errorMsg);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.current = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.new = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.new = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirm = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.new =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    changePwdMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setIsEditing(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const isLoading = changePwdMutation.isPending;
  const hasValues = Object.values(formData).some((val) => val.trim());

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
        <p className="text-sm text-slate-500 mt-1">
          Update your password to keep your account secure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              placeholder="Enter current password"
              className={`w-full pr-10 ${
                errors.current ? "border-red-500" : ""
              }`}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          {errors.current && (
            <p className="text-xs text-red-500 mt-1">{errors.current}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              placeholder="Enter new password"
              className={`w-full pr-10 ${errors.new ? "border-red-500" : ""}`}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Must be at least 8 characters
          </p>
          {errors.new && (
            <p className="text-xs text-red-500 mt-1">{errors.new}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              placeholder="Confirm new password"
              className={`w-full pr-10 ${
                errors.confirm ? "border-red-500" : ""
              }`}
            />
            {isEditing && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
          {errors.confirm && (
            <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!hasValues || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isLoading && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Change Password
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Change Password
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
