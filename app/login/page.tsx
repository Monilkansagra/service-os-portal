"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // --- STATIC AUTH DATA ---
    setTimeout(() => {
      let role = "";
      if (email === "admin@service.com" && password === "admin123") role = "ADMIN";
      else if (email === "hod@service.com" && password === "hod123") role = "HOD";
      else if (email === "user@service.com" && password === "user123") role = "PORTAL";

      if (role) {
        // કૂકી સેટ કરો (૧ દિવસ માટે)
        document.cookie = `user_role=${role}; path=/; max-age=86400`;
        
        // રોલ મુજબ રીડાયરેક્ટ
        const path = role === 'ADMIN' ? '/admin-dashboard' : role === 'HOD' ? '/hod-dashboard' : '/portal-dashboard';
        router.push(path);
      } else {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]">
      <div className="w-full max-w-[460px] space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-blue-600 rounded-[28px] text-white shadow-2xl shadow-blue-200">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Service<span className="text-blue-600 italic">OS</span></h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Enterprise Security Layer</p>
        </div>

        <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/60 p-10 md:p-14 border border-white relative overflow-hidden">
          <form onSubmit={handleLogin} className="space-y-7 relative z-10">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-wider border border-red-100 text-center animate-bounce">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Corporate Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input required name="email" type="email" placeholder="name@company.com" className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input required name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-16 pr-16 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white font-black py-6 rounded-[24px] shadow-xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-70 text-lg group">
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Access System <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>
        </div>

        <div className="flex justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <button className="hover:text-blue-600">Privacy Policy</button>
           <button className="hover:text-blue-600">Support Center</button>
        </div>
      </div>
    </div>
  );
}