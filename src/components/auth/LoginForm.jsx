import { useState } from 'react';
import { Users, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const LoginForm = ({ onFinish, isPending, rememberMe, setRememberMe }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFinish({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-600 font-medium">Email Address</Label>
        <div className="relative">
          <Users size={18} className="absolute left-3 top-3.5 text-slate-400" />
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@laundry.com"
            className="pl-10 h-11 rounded-md bg-slate-50 border-slate-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-600 font-medium">Password</Label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
          <Input 
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-10 h-11 rounded-md bg-slate-50 border-slate-200"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between pb-2">
        <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
          <input 
            type="checkbox"
            checked={rememberMe} 
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">Remember this session</span>
        </label>
        <button type="button" className="text-blue-600 text-sm font-semibold hover:underline">
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full font-bold"
      >
        {isPending ? 'Authenticating...' : 'Secure Sign In'}
      </Button>
    </form>
  );
};