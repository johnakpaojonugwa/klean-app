import { motion } from "framer-motion";
import { Mail, Phone, Briefcase, ShieldCheck, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";

const statusColors = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-rose-100 text-rose-700",
    on_leave: "bg-amber-100 text-amber-700",
};

export default function ManagerCard({ manager, index, onEdit, onDelete }) {
    const initials = manager.fullname?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5"
        >
            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src={manager.avatar} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{manager.fullname}</h3>
                    <p className="text-muted-foreground">{manager.position}</p>
                </div>
                <Badge className={statusColors[manager.status] || "bg-slate-100 text-slate-700"}>
                    {manager.status.replace("_", " ").toUpperCase()}
                </Badge>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onEdit(manager)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(manager._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{manager.email}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>{manager.branchId?.name || "Branch 2"}</span>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap 1.5 text-xs font-medium text-slate-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Verified Manager
                    </div>
                    <span className="text-xs text-slate-400 font-bold uppercase">
                        ID: {String(manager._id || manager.id).slice(-6)}
                    </span>
                </div>
            </div>
        </motion.div>
    )
};