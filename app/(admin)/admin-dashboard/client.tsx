"use client";

import { useEffect, useState } from "react";
import {
  Users, Building2, Server, Activity, Printer, Calendar, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, ReferenceLine
} from "recharts";

// CountUp Hook for numbers
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const easing = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      setCount(Math.floor(end * easing));

      if (progress < duration) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animateCount);
  }, [end, duration]);

  return count;
}

const COLORS = {
  indigo: "#6366F1",
  violet: "#8B5CF6",
  pink: "#EC4899",
  emerald: "#10B981",
  cyan: "#06B6D4",
  amber: "#F59E0B",
  red: "#EF4444"
};

interface DashboardProps {
  stats: {
    totalUsers: number;
    departments: number;
    activeServices: number;
    totalRequests: number;
  };
  initialLineData?: any[];
  initialPieData?: any[];
  initialBarData?: any[];
}

export default function AdminDashboardClient({ stats, initialLineData, initialPieData, initialBarData }: DashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("just now");

  // Real stats integrated into dynamic metrics
  const [metrics, setMetrics] = useState({
    activeUsers: { value: stats.totalUsers || 10, trend: +12.5, sparkline: [12, 18, 15, 22, 18, 25, 28], color: COLORS.indigo, icon: Users },
    departments: { value: stats.departments || 12, trend: +2.4, sparkline: [30, 32, 32, 33, 33, 34, 34], color: COLORS.violet, icon: Building2 },
    services: { value: stats.activeServices || 10, trend: -1.2, sparkline: [150, 148, 145, 145, 142, 142, 142], color: COLORS.pink, icon: Server },
    requests: { value: stats.totalRequests || 11, trend: +15.3, sparkline: [70, 80, 95, 85, 110, 120, 135], color: COLORS.emerald, icon: Activity }
  });

  const [timeFilter, setTimeFilter] = useState("7D");

  const [lineChartData, setLineChartData] = useState(initialLineData || []);
  const [pieData, setPieData] = useState(initialPieData || []);
  const barData = initialBarData || [];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setLastUpdate("just now");

      setLineChartData(prev => prev.map(d => ({
        ...d,
        value: d.value + Math.floor(Math.random() * 20 - 10)
      })));

      setMetrics(prev => ({
        ...prev,
        requests: {
          ...prev.requests,
          value: prev.requests.value + Math.floor(Math.random() * 5),
          sparkline: [...prev.requests.sparkline.slice(1), prev.requests.sparkline[6] + Math.floor(Math.random() * 5)]
        }
      }));

    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let minutes = 0;
    const ticker = setInterval(() => {
      minutes++;
      setLastUpdate(`${minutes} min ago`);
    }, 60000);
    return () => clearInterval(ticker);
  }, [lastUpdate]);

  if (!mounted) return <div className="min-h-screen bg-[#0F0F1A]" />;

  return (
    <div className="space-y-6 pb-20">

      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-500" />

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Overview</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.2)]">ADMIN</span>
          </div>
          <p className="text-slate-400 font-medium text-sm mt-1">
            Real-time insights across all departments and services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-[#13131F] px-3 py-1.5 rounded-lg border border-indigo-900/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Last updated: {lastUpdate}
          </div>

          <div className="flex items-center gap-2 bg-[#13131F] border border-indigo-900/30 rounded-lg px-3 py-1.5 cursor-pointer hover:border-indigo-500/50 transition-colors">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-slate-300">Mar 1 - Mar 8</span>
          </div>

          <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            <Printer className="w-4 h-4" /> Print Report
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.entries(metrics).map(([key, data], idx) => (
          <KPICard key={key} title={key.replace(/([A-Z])/g, ' $1').trim()} data={data} delay={idx * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 xl:col-span-2 group hover:border-indigo-500/60 transition-colors relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Weekly Request Trends</h3>
            <div className="flex bg-[#13131F] self-start sm:self-auto border border-indigo-900/40 rounded-lg p-1">
              {['7D', '30D', '90D', '1Y'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setTimeFilter(tab)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeFilter === tab ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#13131F', borderRadius: '12px', borderColor: '#4F46E5', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:border-indigo-500/60 transition-colors"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Requests by Dept</h3>
          </div>
          <div className="h-[320px] w-full relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-6">Total</span>
              <span className="text-3xl font-black text-white">1200</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#13131F', borderRadius: '12px', borderColor: '#312E81', color: 'white', fontWeight: 'bold' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(v) => <span className="text-slate-300 text-sm font-medium ml-1">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:border-indigo-500/60 transition-colors xl:col-span-2"
        >
          <h3 className="text-lg font-bold text-white tracking-tight mb-6">Service Response Avg Time (Hours)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={barData} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.3} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} />
                <RechartsTooltip
                  cursor={{ fill: '#1E1B4B' }}
                  contentStyle={{ backgroundColor: '#13131F', borderRadius: '12px', border: 'none', color: 'white', fontWeight: 'bold' }}
                />
                <ReferenceLine x={3.0} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'top', value: 'SLA Target (3h)', fill: '#EF4444', fontSize: 11, fontWeight: 'bold' }} />
                <Bar dataKey="time" radius={[0, 4, 4, 0]} animationDuration={1000}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={'url(#barGradient)'} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
          className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:border-indigo-500/60 transition-colors flex flex-col justify-between"
        >
          <h3 className="text-lg font-bold text-white tracking-tight mb-2">Activity Heatmap</h3>
          <p className="text-xs text-slate-500 mb-6">Request frequency over the last 90 days</p>

          <div className="flex-1 overflow-x-auto custom-scrollbar pb-2">
            <div className="min-w-[400px]">
              <div className="flex gap-1">
                {Array.from({ length: 12 }).map((_, col) => (
                  <div key={col} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, row) => {
                      const rand = Math.random();
                      const intensityClass =
                        rand > 0.8 ? 'bg-indigo-500' :
                          rand > 0.5 ? 'bg-indigo-500/60' :
                            rand > 0.2 ? 'bg-indigo-500/30' : 'bg-indigo-900/20';

                      return (
                        <div
                          key={row}
                          title={`${Math.floor(rand * 50)} requests`}
                          className={`w-3.5 h-3.5 rounded-sm ${intensityClass} cursor-pointer hover:ring-2 hover:ring-white transition-all`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-4 justify-end">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-indigo-900/20" />
                  <div className="w-3 h-3 rounded-sm bg-indigo-500/30" />
                  <div className="w-3 h-3 rounded-sm bg-indigo-500/60" />
                  <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function KPICard({ title, data, delay }: { title: string, data: any, delay: number }) {
  const currentValue = useCountUp(data.value);
  const isPositive = data.trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:-translate-y-1 hover:border-indigo-500/60 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 bg-[#13131F]"
          style={{ boxShadow: `inset 0 0 15px ${data.color}30, 0 0 10px ${data.color}40` }}
        >
          <data.icon className="w-6 h-6" style={{ color: data.color }} />
        </div>

        <div className={`flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(data.trend)}%
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
          <p className="text-3xl font-black text-white">{currentValue.toLocaleString()}</p>
        </div>

        <div className="w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
          <svg viewBox="0 0 100 30" className="w-full h-full preserve-aspect-ratio-none">
            <polyline
              fill="none"
              stroke={isPositive ? COLORS.emerald : COLORS.red}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={data.sparkline.map((val: number, i: number) => `${i * (100 / 6)},${30 - (val / Math.max(...data.sparkline) * 25)}`).join(' ')}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}