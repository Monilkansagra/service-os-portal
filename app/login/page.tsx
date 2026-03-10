"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from './actions';
import { ShieldCheck, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({ email: "", password: "" });
  const [isMounted, setIsMounted] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const validateEmail = (email: string) => {
    if (!email) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid corporate email address";
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters long";
    return "";
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setValidationErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) return;

    setLoading(true);

    const result = await loginUser(formData);

    if (result.success && result.redirectTo) {
      setSuccess(true);
      setTimeout(() => {
        router.push(result.redirectTo);
      }, 1000);
    } else {
      setError(result.message || "Login failed");
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex items-center justify-center p-4 selection:bg-indigo-500/30 relative overflow-hidden bg-transparent">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-3xl animate-[pulse-glow_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-violet-500/20 rounded-full blur-3xl animate-[pulse-glow_8s_ease-in-out_infinite_reverse]" />

      {/* Absolute Header (Optional Branding) */}
      <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold tracking-tight text-lg">ServiceOS</span>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-white/40 dark:border-slate-800/40 p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 hover:-translate-y-1 hover:shadow-indigo-500/20 transition-all duration-300"
      >
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl font-black tracking-tight mb-2 font-heading bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"
          >
            Welcome back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 font-medium"
          >
            Sign in to access your dashboard
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="login-error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: [10, -10, 10, -10, 0] }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 flex items-start gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          {/* Email Field with Floating Label */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="relative group">
            <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-20 ${validationErrors.email ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'}`} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder=" "
              className={`peer w-full pl-14 pr-4 pt-6 pb-2 bg-slate-50 border-2 rounded-2xl text-slate-900 outline-none transition-all dark:bg-slate-900 dark:text-white font-medium ${validationErrors.email ? 'border-red-500/50 bg-red-50/50 dark:bg-red-900/10' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-black hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              onChange={() => setValidationErrors(prev => ({ ...prev, email: "" }))}
            />
            <label htmlFor="email" className="absolute left-14 top-4 transform -translate-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 transition-all z-10 pointer-events-none">
              Email Address
            </label>
            {validationErrors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-semibold mt-2 ml-2 flex items-center gap-1">
                {validationErrors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Password Field with Floating Label */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="relative group">
            <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors z-20 ${validationErrors.password ? 'text-red-400' : 'text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400'}`} />
            <input
              id="password"
              name="password"
              type="password"
              placeholder=" "
              className={`peer w-full pl-14 pr-4 pt-6 pb-2 bg-slate-50 border-2 rounded-2xl text-slate-900 outline-none transition-all dark:bg-slate-900 dark:text-white font-medium ${validationErrors.password ? 'border-red-500/50 bg-red-50/50 dark:bg-red-900/10' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-black hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              onChange={() => setValidationErrors(prev => ({ ...prev, password: "" }))}
            />
            <label htmlFor="password" className="absolute left-14 top-4 transform -translate-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-focus:-translate-y-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 transition-all z-10 pointer-events-none">
              Secure Password
            </label>
            {validationErrors.password && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-semibold mt-2 ml-2 flex items-center gap-1">
                {validationErrors.password}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || success}
            className={`w-full mt-8 relative overflow-hidden text-white rounded-2xl py-4 font-bold text-sm shadow-xl shadow-indigo-600/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2 group ${success ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-violet-600'}`}
          >
            <span className={`absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out`}></span>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success-content"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success! Redirecting...</span>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading-content"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </motion.div>
              ) : (
                <motion.span
                  key="idle-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Sign In
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure internal access</p>
        </motion.div>
      </motion.div>
    </div>
  );
}