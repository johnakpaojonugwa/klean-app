import { Shield } from 'lucide-react';

export const AuthHeader = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-4">
      <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
        <Shield className="text-white" size={32} />
      </div>
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Admin <span className="text-blue-500">Portal</span>
        </h1>
        <p className="text-slate-400 font-medium mt-1">Klean Laundry Enterprise v1.</p>
      </div>
    </div>
  </div>
);