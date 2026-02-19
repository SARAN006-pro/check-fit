
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import { fitnessApi } from '../api/axios';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Dumbbell, 
  Target, 
  ArrowUpRight, 
  ShieldCheck,
  Flame,
  Brain,
  Download,
  Filter,
  Sparkles,
  CalendarDays,
  Medal,
  Timer
} from 'lucide-react';
import { PersonalRecord } from '../types';

const MotionDiv = motion.div as any;

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLift, setSelectedLift] = useState<string>('Back Squat');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fitnessApi.getAnalytics();
        setAnalyticsData(res.data);
      } catch (err) {
        console.error("Failed to fetch performance intelligence:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const heatmapWeeks = useMemo(() => {
    if (!analyticsData?.activityHeatmap) return [];
    const data = [...analyticsData.activityHeatmap];
    const weeks: any[][] = [];
    let currentWeek: any[] = [];
    data.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === data.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeks;
  }, [analyticsData]);

  if (loading || !analyticsData) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-12 animate-pulse">
        <div className="h-12 w-64 bg-zinc-900 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-zinc-900 rounded-[32px]" />)}
        </div>
      </div>
    );
  }

  const { volumeTrend, workload, muscleDistribution, strengthCurve, prs } = analyticsData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 text-white p-4 rounded-[20px] shadow-3xl border border-white/10 space-y-1 backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex justify-between gap-10 items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">{p.name}:</span>
              <span className="text-sm font-black text-white" style={{ color: p.color }}>
                {p.value?.toLocaleString()} {p.name.includes('Intensity') ? '%' : 'kg'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getHeatmapColor = (value: number) => {
    switch (value) {
      case 0: return 'bg-zinc-900/50 hover:bg-zinc-800';
      case 1: return 'bg-blue-900/40 hover:bg-blue-800/60';
      case 2: return 'bg-blue-700/60 hover:bg-blue-600/80';
      case 3: return 'bg-blue-500 hover:bg-blue-400 shadow-[0_0_15px_#3b82f644]';
      case 4: return 'bg-brand-red hover:bg-red-400 shadow-[0_0_20px_#e11d4866]';
      default: return 'bg-zinc-900';
    }
  };

  return (
    <div className="p-6 pb-32 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* 1. TERMINAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-brand-red rounded-full animate-pulse shadow-[0_0_10px_#e11d48]" />
             <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Performance Terminal</h1>
          </div>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.4em] max-w-xl">
            Neural node 0x7F active. Advanced biomechanical analysis engine running.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/20 transition-all shadow-xl active:scale-95">
            <Filter className="w-4 h-4" /> CONFIG
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] active:scale-95">
            <Download className="w-4 h-4" /> EXPORT REPORT
          </button>
        </div>
      </div>

      {/* 2. KPI MATRIX (Visibility Overhaul) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* READINESS */}
        <Card className="p-8 border-none bg-zinc-900/40 overflow-hidden relative shadow-3xl group">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-green" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Readiness</p>
              </div>
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
            </div>
            <div>
              <h3 className="text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{workload.status}</h3>
              <p className="text-[10px] font-bold text-brand-green uppercase tracking-widest mt-2 bg-brand-green/10 inline-block px-2 py-0.5 rounded">Optimal Loading Enabled</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full blur-[80px] -mr-16 -mt-16" />
        </Card>

        {/* RECOVERY */}
        <Card className="p-8 border-none bg-zinc-900/40 shadow-3xl flex flex-col justify-between group overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Recovery Index</p>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-6xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]">{workload.recoveryScore}</h3>
              <div className="flex items-center bg-brand-green/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3 text-brand-green mr-1" />
                <span className="text-[11px] font-black text-brand-green uppercase tracking-widest">+4.2%</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-1 relative z-10">
             {Array.from({ length: 20 }).map((_, i) => (
               <div 
                 key={i} 
                 className={`h-2 flex-1 rounded-full ${i < (workload.recoveryScore / 5) ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-zinc-800'}`} 
               />
             ))}
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
        </Card>

        {/* STRENGTH */}
        <Card className="p-8 border-none bg-zinc-900/40 shadow-3xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Strength Gain</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-6xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_20px_rgba(234,88,12,0.2)]">+12%</h3>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">30D MATRIX</span>
            </div>
          </div>
          <div className="mt-8 flex gap-1.5 items-end h-8">
            {[30, 60, 45, 90, 60, 80, 75, 95, 85, 100].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-orange-600/40 to-orange-400 rounded-t-sm transition-all duration-1000" 
                style={{ height: `${h}%` }} 
              />
            ))}
          </div>
        </Card>

        {/* INTENSITY */}
        <Card className="p-8 border-none bg-zinc-900/40 shadow-3xl flex flex-col justify-between group overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-red" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total Intensity</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-6xl font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_20px_rgba(225,29,72,0.2)]">88%</h3>
              <span className="text-[10px] font-black text-brand-red animate-pulse uppercase tracking-[0.2em]">ZONE 4 ACTIVE</span>
            </div>
          </div>
          <div className="mt-8 h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 relative z-10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '88%' }}
              transition={{ duration: 2 }}
              className="h-full bg-gradient-to-r from-brand-red to-orange-500 shadow-[0_0_15px_#e11d48]" 
            />
          </div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl" />
        </Card>
      </div>

      {/* 3. PERFORMANCE CORRELATION (Visual Polish) */}
      <section className="space-y-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/5 border border-white/10 text-white rounded-[24px] flex items-center justify-center shadow-2xl backdrop-blur-md">
              <TrendingUp className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Correlation Matrix</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Volume Load [kg] vs Recovery Potential [index]</p>
            </div>
          </div>
          <div className="flex gap-8 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-4 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Volume Load</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recovery Index</span>
            </div>
          </div>
        </div>
        
        <Card className="p-10 h-[500px] border border-white/5 shadow-premium bg-zinc-900/20 overflow-hidden relative backdrop-blur-sm">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={volumeTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="period" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }} 
                dy={15}
              />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right" hide orientation="right" />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 2 }} />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="volume" 
                name="Volume Load"
                stroke="#ffffff" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#volGrad)"
                animationDuration={2500}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="recovery" 
                name="Recovery Score"
                stroke="#3b82f6" 
                strokeWidth={5} 
                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#000' }}
                animationDuration={3000}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_3px)] opacity-50" />
        </Card>
      </section>

      {/* 4. PR VAULT (Phase 3 Feature) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center border border-brand-gold/20 shadow-2xl shadow-brand-gold/5">
                <Medal className="w-6 h-6 text-brand-gold" />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">PR Vault</h2>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Verified absolute power peaks</p>
             </div>
          </div>
          <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all">Historical Progression Matrix</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prs.map((pr: any, i: number) => (
            <Card key={pr.id} className="p-8 bg-zinc-900/60 border border-white/5 hover:border-brand-gold/40 group transition-all relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all border border-white/5">
                    {pr.icon}
                  </div>
                  {pr.previousValue && (
                    <div className="flex items-center gap-1.5 bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">
                      <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
                      <span className="text-[11px] font-black text-brand-green">+{Math.round(((pr.value - pr.previousValue) / pr.previousValue) * 100)}%</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">{pr.exercise}</p>
                  <div className="flex items-baseline gap-2">
                     <h4 className="text-4xl font-black text-white tabular-nums tracking-tighter">{pr.value}</h4>
                     <span className="text-sm font-bold text-zinc-600 uppercase">{pr.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                  <CalendarDays className="w-3 h-3" /> VERIFIED: {new Date(pr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>
      </section>

      {/* 5. CONSISTENCY HEATMAP (High Polish) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white/5 border border-white/10 text-white rounded-[24px] flex items-center justify-center shadow-2xl backdrop-blur-md">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Consistency Matrix</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">90-Day operational readiness heat feed</p>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-zinc-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
             <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Intensity Gradient:</span>
             <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map(v => (
                  <div key={v} className={`w-3.5 h-3.5 rounded-sm ${getHeatmapColor(v)}`} />
                ))}
             </div>
             <span className="text-[10px] font-black text-white uppercase tracking-widest ml-2">HI-CAPACITY</span>
          </div>
        </div>

        <Card className="p-10 border border-white/5 bg-zinc-900/40 overflow-hidden shadow-3xl">
          <div className="flex gap-8">
            <div className="flex flex-col justify-between pt-10 pb-4 text-[9px] font-black text-zinc-600 uppercase leading-none tracking-widest">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <div className="flex gap-1.5 pb-2">
                {heatmapWeeks.map((week, weekIdx) => {
                  const firstDay = week[0];
                  const isNewMonth = weekIdx === 0 || (new Date(firstDay.date).getDate() <= 7);
                  return (
                    <div key={weekIdx} className="w-4 shrink-0 h-4 flex items-center">
                      {isNewMonth && (
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                          {new Date(firstDay.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1.5">
                {heatmapWeeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1.5 shrink-0">
                    {week.map((day, dayIdx) => (
                      <MotionDiv 
                        key={dayIdx} 
                        whileHover={{ scale: 1.4, zIndex: 50 }}
                        className={`w-4 h-4 rounded-[4px] transition-all cursor-crosshair group relative ${getHeatmapColor(day.value)} border border-black/20`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 hidden group-hover:block z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
                           <div className="bg-zinc-950 text-white p-3 rounded-[16px] shadow-3xl border border-white/10 text-center backdrop-blur-xl">
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{new Date(day.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                              <div className="flex items-center justify-center gap-2">
                                <Zap className="w-3 h-3 text-brand-red fill-brand-red" />
                                <p className="text-sm font-black italic">{day.kcal} KCAL BURNED</p>
                              </div>
                           </div>
                        </div>
                      </MotionDiv>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <div className="pt-24 text-center border-t border-white/5 opacity-40">
        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.8em] leading-relaxed max-w-2xl mx-auto">
          ZENFIT PERFORMANCE DATA ENCRYPTED VIA END-TO-END NEURAL TUNNELING.<br />
          NODE AUTHENTICATED • SYSTEM VERSION 4.2.0 STABLE
        </p>
      </div>
    </div>
  );
};

export default Analytics;
