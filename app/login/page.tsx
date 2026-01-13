"use client";
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // એરર મેસેજ માટેની સ્ટેટ
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); 

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // --- Custom Validation ---
    let newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Corporate Email is required";
    if (!password) newErrors.password = "Security Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // --- Auth Logic ---
    if (email === 'admin@service.com' && password === 'admin123') {
      document.cookie = "user_role=ADMIN; path=/";
      router.push('/admin-dashboard');
    } else if (email === 'hod@service.com' && password === 'hod123') {
      document.cookie = "user_role=HOD; path=/";
      router.push('/hod-dashboard');
    } else if (email === 'user@service.com' && password === 'user123') {
      document.cookie = "user_role=USER; path=/";
      router.push('/portal-dashboard');
    } else {
      setErrors({ email: "Invalid credentials. Please check again." });
    }
    setLoading(false);
  };

  return (
    // ⬇️ આ લાઈનમાં 'bg-[radial-gradient]' થી ડોટ્સ પાછા આવી જશે
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[480px] space-y-10">
        
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[30px] shadow-2xl shadow-blue-200">
            <ShieldCheck className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Service<span className="text-blue-600 italic">OS</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Enterprise Security Layer</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-[45px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
          {/* Subtle Decorative Gradient inside card */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <form onSubmit={handleLogin} noValidate className="relative space-y-7">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Corporate Email</label>
              <div className="relative group">
                <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} size={20} />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  suppressHydrationWarning
                  className={`w-full pl-16 pr-6 py-5 bg-slate-50 border-2 rounded-[24px] text-sm font-bold outline-none transition-all
                    ${errors.email ? 'border-red-100 focus:border-red-400 ring-4 ring-red-500/5 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5'}`}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Password</label>
              <div className="relative group">
                <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-slate-300 group-focus-within:text-blue-500'}`} size={20} />
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  suppressHydrationWarning
                  className={`w-full pl-16 pr-16 py-5 bg-slate-50 border-2 rounded-[24px] text-sm font-bold outline-none transition-all
                    ${errors.password ? 'border-red-100 focus:border-red-400 ring-4 ring-red-500/5 bg-red-50/30' : 'border-transparent focus:bg-white focus:border-blue-500/20 focus:ring-4 ring-blue-500/5'}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold ml-2 mt-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-slate-900 text-white font-black py-6 rounded-[24px] shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? "Authenticating..." : "Access System →"}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
          <button className="hover:text-blue-600 transition-colors">Support Center</button>
        </div>
      </div>
    </div>
  );
}