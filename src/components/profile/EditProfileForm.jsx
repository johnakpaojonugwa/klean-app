import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { updateUserProfile, uploadAvatar } from "@/api/user";

export default function EditProfileForm({ user, onSuccess }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    avatar: user?.avatar || "",
  });
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);

  // Mutation for updating profile
  const updateMutation = useMutation({
    mutationFn: (data) => updateUserProfile(data),
    onSuccess: (response) => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setIsEditing(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  // Mutation for uploading avatar
  const uploadMutation = useMutation({
    mutationFn: (file) => uploadAvatar(file),
    onSuccess: (response) => {
      const imageUrl = response?.data?.user?.avatar || response?.data?.avatar;
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      setPreviewAvatar(imageUrl);
      toast.success("Avatar uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => {
      console.error("Avatar upload error:", error);
      console.error("Error response:", error?.response);
      console.error("Error data:", error?.response?.data);
      const errorMessage = error?.response?.data?.message ||
                          error?.response?.data?.error ||
                          error?.message ||
                          "Failed to upload avatar";
      toast.error(errorMessage);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = () => {
    if (avatarFile) {
      uploadMutation.mutate(avatarFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullname.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    }

    const updateData = {
      fullname: formData.fullname,
      phoneNumber: formData.phoneNumber,
    };

    updateMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setFormData({
      fullname: user?.fullname || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      avatar: user?.avatar || "",
    });
    setPreviewAvatar(user?.avatar || "");
    setAvatarFile(null);
    setIsEditing(false);
  };

  const isLoading =
    updateMutation.isPending || uploadMutation.isPending;
  const hasChanges =
    formData.fullname !== user?.fullname ||
    formData.phoneNumber !== user?.phoneNumber ||
    avatarFile !== null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
        <p className="text-sm text-slate-500 mt-1">
          Update your personal information and profile picture
        </p>
      </div>

      {/* Avatar Section */}
      <div className="mb-8 pb-8 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Profile Picture
        </h3>
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-slate-200 shadow-sm ring-1 ring-slate-100">
            <AvatarImage src={previewAvatar} alt={user?.fullname} />
            <AvatarFallback className="bg-indigo-500 text-white font-bold text-xl">
              {user?.fullname?.substring(0, 2).toUpperCase() || "US"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="avatar-input" className="cursor-pointer">
                <Input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("avatar-input").click()}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </label>
            </div>

            {avatarFile && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUploadAvatar}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {uploadMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Upload Avatar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAvatarFile(null);
                    setPreviewAvatar(user?.avatar || "");
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}

            <p className="text-xs text-slate-500">
              JPG, PNG or GIF (Max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name
            </label>
            <Input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              placeholder="Enter full name"
              className="w-full"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-slate-50 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Phone Number */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              placeholder="Enter phone number"
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
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
                disabled={!hasChanges || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {updateMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
