import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Mail, Phone, Briefcase, ShieldCheck, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const statusColors = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-rose-100 text-rose-700",
  on_leave: "bg-amber-100 text-amber-700",
  terminated: "bg-slate-100 text-slate-700",
};

const designationColors = {
  manager: "bg-purple-100 text-purple-700",
  supervisor: "bg-blue-100 text-blue-700",
  washer: "bg-orange-100 text-orange-700",
  ironer: "bg-amber-100 text-amber-700",
  driver: "bg-sky-100 text-sky-700",
  receptionist: "bg-pink-100 text-pink-700",
  cleaner: "bg-purple-100 text-purple-700"
};

export default function EmployeeCard({ employee, index, onEdit, onDelete }) {
  const initials = employee.fullname?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
            {employee.avatar && (
              <AvatarImage 
                src={employee.avatar} 
                alt={employee.fullname}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 leading-tight truncate">
              {employee.fullname}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={`${designationColors[employee.designation?.toLowerCase()] || "bg-slate-100"} border-0 text-[10px] font-bold uppercase`}>
                {employee.designation || "Staff"}
              </Badge>
              <Badge className={`${statusColors[employee.status] || statusColors.active} border-0 text-[10px] font-bold uppercase`}>
                {employee.status}
              </Badge>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 cursor-pointer hover:text-slate-600">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(employee)}>
              <Edit className="w-4 h-4 mr-2" /> Edit Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(employee._id || employee.id)} className="text-rose-600">
              <Trash2 className="w-4 h-4 mr-2" /> Terminate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="truncate">{employee.email}</span>
        </div>
        {employee.phone && (
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{employee.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-slate-600">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span>{employee.branchId?.slice(-8) || "Main Branch"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Verified Member
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase">
          ID: {String(employee._id || employee.id).slice(-6)}
        </span>
      </div>
    </motion.div>
  );
}