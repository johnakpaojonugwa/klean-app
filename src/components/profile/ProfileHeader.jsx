import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ROLES } from "@/constants/roles";

export default function ProfileHeader({ user }) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return "bg-purple-100 text-purple-800";
      case ROLES.BRANCH_MANAGER:
        return "bg-blue-100 text-blue-800";
      case ROLES.STAFF:
        return "bg-green-100 text-green-800";
      case ROLES.CUSTOMER:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      [ROLES.SUPER_ADMIN]: "Super Admin",
      [ROLES.BRANCH_MANAGER]: "Branch Manager",
      [ROLES.STAFF]: "Staff",
      [ROLES.CUSTOMER]: "Customer",
    };
    return roleMap[role] || role;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <Avatar className="h-32 w-32 border-4 border-slate-200 shadow-lg ring-1 ring-slate-100">
          <AvatarImage src={user?.avatar} alt={user?.fullname} />
          <AvatarFallback className="bg-indigo-600 text-white font-bold text-3xl">
            {user?.fullname?.substring(0, 2).toUpperCase() || "US"}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {user?.fullname || "User"}
          </h1>

          <p className="text-slate-600 mb-4">{user?.email}</p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
            <Badge className={`${getRoleBadgeColor(user?.role)} text-sm px-3 py-1`}>
              {getRoleLabel(user?.role)}
            </Badge>

            {user?.phoneNumber && (
              <div className="text-sm">
                <span className="text-slate-500">Phone: </span>
                <span className="font-medium text-slate-700">
                  {user.phoneNumber}
                </span>
              </div>
            )}
          </div>

          {user?.branchId && (
            <p className="text-sm text-slate-500 mt-3">
              <span className="font-medium">Branch ID:</span> {user.branchId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
