import { useApp } from "@/context/AppContext";
import { Loader2 } from "lucide-react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default function ProfilePage() {
  const { user, loadingUser } = useApp();

  if (loadingUser || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage your account settings and personal information
        </p>
      </div>

      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Edit Profile Form */}
      <EditProfileForm user={user} onSuccess={() => {}} />

      {/* Change Password Form */}
      <ChangePasswordForm user={user} />
    </div>
  );
}
