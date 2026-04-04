import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { RBAC_INFO } from '@/constants/roles';

export const RoleAccessList = () => {
  const [activeRole, setActiveRole] = useState('SUPER_ADMIN');

  return (
    <div className="space-y-4">
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">Authorized Access Levels</h3>
      <div className="space-y-3">
        {RBAC_INFO.map((role) => (
          <div
            key={role.role}
            onClick={() => setActiveRole(role.role)}
            className={cn(
              "p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
              activeRole === role.role 
                ? "bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]" 
                : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{role.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-white text-base">{role.label}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {role.permissions.map((p) => (
                    <Badge key={p} variant="secondary" className="bg-slate-700/50 text-slate-300 text-[10px] uppercase font-bold">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};