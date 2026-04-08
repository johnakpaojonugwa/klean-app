import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, X, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { updateUserProfile } from "@/api/user";

export default function EditProfileForm({ user, onSuccess }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    email: "", // Read-only
  });
  
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  // Sync state with user data when prop changes or editing starts
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
      });
      setPreviewAvatar(user.avatar || "");
    }
  }, [user, isEditing]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateUserProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setIsEditing(false);
      setAvatarFile(null);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
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
      
      setAvatarFile(file);
      // Generate temporary local preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewAvatar(objectUrl);
      
      // Cleanup memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.phoneNumber.trim()) return toast.error("Phone number is required");

    const hasAvatar = avatarFile !== null;
    const payload = hasAvatar
      ? new FormData()
      : {
          fullname: formData.fullname.trim(),
          phoneNumber: formData.phoneNumber.trim(),
        };

    if (hasAvatar) {
      payload.append("fullname", formData.fullname.trim());
      payload.append("phoneNumber", formData.phoneNumber.trim());
      payload.append("avatar", avatarFile);
    }

    updateMutation.mutate(payload);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setPreviewAvatar(user?.avatar || "");
  };

  const isLoading = updateMutation.isPending;
  const hasChanges = 
    formData.fullname !== user?.fullname || 
    formData.phoneNumber !== user?.phoneNumber || 
    avatarFile !== null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Profile Settings</h2>
          <p className="text-sm text-slate-500">Manage your public profile and account details</p>
        </div>
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md ring-1 ring-slate-200">
              <AvatarImage src={previewAvatar} className="object-cover" />
              <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                <User size={32} />
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Upload className="text-white h-6 w-6" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-slate-800">Profile Photo</h3>
            <p className="text-xs text-slate-500 mt-1">Accepts PNG, JPG or GIF. Max 5MB.</p>
            {avatarFile && isEditing && (
              <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                New image selected
              </span>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <Input
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              className="focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <Input
              value={formData.email}
              disabled
              className="bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Phone Number</label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing || isLoading}
              className="focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleCancel}
              disabled={isLoading}
              className="text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!hasChanges || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}