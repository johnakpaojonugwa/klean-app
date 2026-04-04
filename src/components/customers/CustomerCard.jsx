import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Mail, Phone, MapPin, Trash2, Edit, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

export default function CustomerCard({ customer, index, onEdit, onDelete }) {
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
            {customer.avatar && (
              <AvatarImage 
                src={customer.avatar} 
                alt={customer.fullname}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">
              {customer.fullname?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 leading-tight truncate">
              {customer.fullname}
            </h3>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-0 text-[10px] font-bold uppercase tracking-wider mt-1">
              Customer
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 cursor-pointer hover:text-slate-600">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(customer)}>
              <Edit className="w-4 h-4 mr-2" /> Edit Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(customer._id || customer.id)} className="text-rose-600">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2.5 text-sm">
        {customer.email && (
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        {customer.phoneNumber && (
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{customer.phoneNumber}</span>
          </div>
        )}
        {customer.address && (
          <div className="flex items-start gap-3 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="break-words line-clamp-2">{customer.address}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
        <div className="text-xs font-medium uppercase bg-emerald-50 text-emerald-500 px-2 py-1">{customer.status || "ACTIVE" }</div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
          ID: {String(customer._id || customer.id).slice(-6)}
        </span>
      </div>
    </motion.div>
  );
}