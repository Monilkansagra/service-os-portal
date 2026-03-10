"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Bell, Shield, Mail, Lock, Key, Globe, Layout, CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [saved, setSaved] = useState(false);

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "preferences", label: "Preferences", icon: Layout },
        { id: "security", label: "Security", icon: Shield },
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-1">Account Settings</h1>
                    <p className="text-slate-400 font-medium text-sm">Manage your account preferences and security.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all active:scale-95 flex items-center gap-2 group relative overflow-hidden"
                >
                    <span className={`absolute inset-0 w-full h-full bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out`}></span>
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <SaveIcon className="w-4 h-4" />}
                    <span>{saved ? "Saved Successfully" : "Save Changes"}</span>
                </button>
            </div>

            <div className="bg-[#1A1A2E] border border-indigo-900/40 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#232338] p-6 flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar bg-[#13131F]">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all relative whitespace-nowrap group ${isActive ? "text-indigo-400" : "text-slate-500 hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSettingTabBg"
                                        className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <tab.icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)]' : 'group-hover:scale-110'}`} />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-6 pb-8 border-b border-[#232338]">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-heading font-black shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                            JS
                                        </div>
                                        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer">
                                            <span className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">Change</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">John Smith</h2>
                                        <p className="text-indigo-400 font-bold text-sm tracking-wide uppercase">System Administrator</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-20" />
                                        <input type="text" defaultValue="John Smith" placeholder=" " className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 transition-colors rounded-xl text-white outline-none font-medium" />
                                        <label className="absolute left-12 top-4 transform -translate-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-2 peer-focus:text-indigo-400 transition-all z-10 pointer-events-none">
                                            Full Name
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-20" />
                                        <input type="email" defaultValue="john.smith@adminos.com" placeholder=" " className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 transition-colors rounded-xl text-white outline-none font-medium" />
                                        <label className="absolute left-12 top-4 transform -translate-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-2 peer-focus:text-indigo-400 transition-all z-10 pointer-events-none">
                                            Email Address
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "preferences" && (
                            <motion.div
                                key="preferences"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-xl font-heading font-black text-white mb-6">Display Settings</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-[#232338] bg-[#13131F] hover:border-indigo-900/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Layout className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="font-bold text-white">Theme Mode</p>
                                                    <p className="text-sm text-slate-500">Deep Indigo Dark Mode active</p>
                                                </div>
                                            </div>
                                            <select className="px-4 py-2 bg-[#1A1A2E] border border-indigo-900/30 rounded-lg outline-none font-bold text-sm text-slate-300">
                                                <option>Dark Theme</option>
                                                <option disabled>System (Auto)</option>
                                                <option disabled>Light Theme</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-heading font-black text-white mb-6">Notifications</h3>
                                    <div className="space-y-4">
                                        {['Email Notifications', 'Push Notifications', 'Weekly Summary'].map((item, i) => (
                                            <div key={item} className="flex items-center justify-between p-4 rounded-xl border border-[#232338] bg-[#13131F] hover:border-indigo-900/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400"><Bell className="w-5 h-5" /></div>
                                                    <div>
                                                        <p className="font-bold text-white">{item}</p>
                                                        <p className="text-sm text-slate-500">Receive updates regarding activity</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked={i !== 2} />
                                                    <div className="w-11 h-6 bg-[#1A1A2E] border border-[#232338] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "security" && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                <div>
                                    <h3 className="text-xl font-heading font-black text-white mb-6">Password</h3>
                                    <div className="space-y-4 max-w-md">
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-20" />
                                            <input type="password" placeholder=" " className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 transition-colors rounded-xl text-white outline-none font-medium" />
                                            <label className="absolute left-12 top-4 transform -translate-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-2 peer-focus:text-indigo-400 transition-all z-10 pointer-events-none">
                                                Current Password
                                            </label>
                                        </div>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-20" />
                                            <input type="password" placeholder=" " className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 transition-colors rounded-xl text-white outline-none font-medium" />
                                            <label className="absolute left-12 top-4 transform -translate-y-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-2 peer-focus:text-indigo-400 transition-all z-10 pointer-events-none">
                                                New Password
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-heading font-black text-white mb-6">Active Sessions</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-[#232338] bg-[#13131F]">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Globe className="w-6 h-6" /></div>
                                                <div>
                                                    <p className="font-bold text-white">Windows 11 • Chrome</p>
                                                    <p className="text-sm text-emerald-400 flex items-center gap-1 font-bold">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Now
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md">New York, USA</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function SaveIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}
