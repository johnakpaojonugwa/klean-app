import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { updateUserProfile } from "@/api/user"; // Ensure this accepts FormData

export default function EditProfileForm({ user, onSuccess }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);

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

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return toast.error("Max size 5MB");
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for multipart/form-data upload
    const data = new FormData();
    data.append("fullname", formData.fullname.trim());
    data.append("phoneNumber", formData.phoneNumber.trim());
    
    // Only append avatar if a new file was actually picked
    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    updateMutation.mutate(data);
  };

  const isLoading = updateMutation.isPending;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-indigo-100">
              <AvatarImage src={previewAvatar} />
              <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50">
                <Upload className="h-4 w-4 text-slate-600" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <div>
             <h3 className="font-medium text-slate-900">{formData.fullname || "User"}</h3>
             <p className="text-sm text-slate-500">{user?.role}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={(e) => setFormData({...formData, fullname: e.target.value})}
            disabled={!isEditing || isLoading}
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            disabled={!isEditing || isLoading}
          />
        </div>

        <div className="flex justify-end gap-3">
          {isEditing ? (
            <>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" disabled={isLoading} className="bg-indigo-600">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </form>
    </div>
  );
}