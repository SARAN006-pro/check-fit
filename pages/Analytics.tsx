
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import { fitnessApi } from '../api/axios';
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
  Cell,
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
  Moon,
  Heart,
  Brain,
  Download,
  Filter,
  Info,
  Sparkles,
  CalendarDays,
  ChevronRight,
  Medal,
  History,
  Timer
} from 'lucide-react';
import { PersonalRecord, VolumeData, WorkloadMetrics } from '../types';

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
        <div className="h-12 w-64 bg-zinc-100 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-100 rounded-3xl" />)}
        </div>
        <div className="h-96 bg-zinc-100 rounded-[40px]" />
      </div>
    );
  }

  const { volumeTrend, workload, muscleDistribution, strengthCurve, prs } = analyticsData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 text-white p-4 rounded-[20px] shadow-2xl border border-white/10 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex justify-between gap-10 items-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">{p.name}:</span>
              <span className="text-sm font-black text-white">
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
      case 0: return 'bg-zinc-100 hover:bg-zinc-200';
      case 1: return 'bg-blue-100 hover:bg-blue-200';
      case 2: return 'bg-blue-300 hover:bg-blue-400';
      case 3: return 'bg-blue-500 hover:bg-blue-600';
      case 4: return 'bg-zinc-900 hover:bg-black shadow-[0_0_10px_rgba(0,0,0,0.1)]';
      default: return 'bg-zinc-100';
    }
  };

  const getMonthLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('default', { month: 'short' });
  };

  return (
    <div className="p-6 pb-32 max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Header 
          title="Performance Terminal" 
          subtitle="Advanced biomechanical analysis and longitudinal output mapping." 
        />
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all shadow-sm">
            <Filter className="w-4 h-4" /> Config
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-8 border-none bg-zinc-900 text-white overflow-hidden relative shadow-premium group">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Readiness</p>
              </div>
              <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-4xl font-black tracking-tighter">{workload.status}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Ready for Optimal Loading</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[80px] -mr-16 -mt-16" />
        </Card>

        <Card className="p-8 border-none bg-white shadow-premium flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-900" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Recovery Index</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black tracking-tight text-zinc-900">{workload.recoveryScore}</h3>
              <span className="text-[11px] font-black text-green-500 uppercase tracking-widest">+4.2%</span>
            </div>
          </div>
          <div className="mt-6 h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${workload.recoveryScore}%` }} />
          </div>
        </Card>

        <Card className="p-8 border-none bg-white shadow-premium flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-zinc-900" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Strength Gain</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black tracking-tight text-zinc-900">+12%</h3>
              <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest">30D Matrix</span>
            </div>
          </div>
          <div className="mt-6 flex gap-1 items-end h-6">
            {[30, 50, 45, 90, 60, 80, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-zinc-100 rounded-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </Card>

        <Card className="p-8 border-none bg-white shadow-premium flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Intensity</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black tracking-tight text-zinc-900">88%</h3>
              <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">Target Met</span>
            </div>
          </div>
          <div className="mt-6 h-1 w-full bg-zinc-50 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: '88%' }} />
          </div>
        </Card>
      </div>

      {/* PR Vault Section (Phase 3 Feature) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
             <Medal className="w-6 h-6 text-yellow-500" />
             <h2 className="text-xl font-black text-zinc-900 tracking-tight">PR Vault</h2>
          </div>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">View Historical Progression</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {prs.map((pr: PersonalRecord) => (
            <Card key={pr.id} className="p-6 border-zinc-100 hover:border-zinc-900 group transition-all relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {pr.icon}
                  </div>
                  {pr.previousValue && (
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
                      <span className="text-[10px] font-black">+{Math.round(((pr.value - pr.previousValue) / pr.previousValue) * 100)}%</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{pr.exercise}</p>
                  <h4 className="text-2xl font-black text-zinc-900 tracking-tight">{pr.value} <span className="text-xs text-zinc-400">{pr.unit}</span></h4>
                </div>
                <div className="pt-2 flex items-center gap-2 text-[9px] font-bold text-zinc-300 uppercase">
                  <CalendarDays className="w-3 h-3" /> {new Date(pr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-zinc-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>
      </section>

      {/* Longitudinal Performance Chart */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Performance Correlation</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Load Stress vs Biological Recovery</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-900" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Volume Load</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Recovery Index</span>
            </div>
          </div>
        </div>
        
        <Card className="p-10 h-[450px] border-none shadow-premium bg-white overflow-hidden relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={volumeTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="period" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 800 }} 
                dy={15}
              />
              <YAxis yAxisId="left" hide />
              <YAxis yAxisId="right" hide orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="volume" 
                name="Volume Load"
                stroke="#18181b" 
                strokeWidth={5} 
                fillOpacity={0.05} 
                fill="#18181b"
                animationDuration={2500}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="recovery" 
                name="Recovery Score"
                stroke="#3b82f6" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                animationDuration={3000}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Strength Growth & Fatigue Distribution (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-10 border-none shadow-premium bg-white overflow-hidden flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Iterative Strength Curve</p>
              <h3 className="text-2xl font-black tracking-tight">{selectedLift} Logic</h3>
            </div>
            <div className="flex bg-zinc-50 p-1.5 rounded-2xl gap-1">
              {Object.keys(strengthCurve).map(lift => (
                <button
                  key={lift}
                  onClick={() => setSelectedLift(lift)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedLift === lift ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {lift.split(' ')[1] || lift}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={strengthCurve[selectedLift]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }} 
                />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: 'none', color: '#fff' }}
                   itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Verified Load"
                  stroke="#18181b" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#18181b', strokeWidth: 3, stroke: '#fff' }}
                  animationDuration={2000}
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  name="AI Projected 1RM"
                  stroke="#3b82f6" 
                  strokeDasharray="5 5" 
                  strokeWidth={2} 
                  dot={false}
                  animationDuration={3000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 pt-8 border-t border-zinc-50 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Delta</p>
                <p className="text-sm font-black text-zinc-900">+12.5 kg Verified Increase</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">AI Projection</p>
                <p className="text-sm font-black text-zinc-900">Optimal Load: {strengthCurve[selectedLift].slice(-1)[0].projected}kg</p>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">Fatigue Biometrics</h2>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Volume distribution per vector</p>
            </div>
          </div>
          <Card className="p-10 border-none shadow-premium bg-white h-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={muscleDistribution}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} hide />
                <Radar
                  name="Verified Load"
                  dataKey="A"
                  stroke="#18181b"
                  fill="#18181b"
                  fillOpacity={0.6}
                  animationDuration={1500}
                />
                <Radar
                  name="Protocol Target"
                  dataKey="B"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  animationDuration={2000}
                />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </section>
      </div>

      {/* Consistency Matrix Heatmap */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-zinc-900" />
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">Consistency Matrix</h2>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Low</span>
             <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(v => (
                  <div key={v} className={`w-3 h-3 rounded-sm ${getHeatmapColor(v)}`} />
                ))}
             </div>
             <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">High</span>
          </div>
        </div>

        <Card className="p-8 border-none shadow-premium bg-white overflow-hidden">
          <div className="flex gap-4">
            <div className="flex flex-col justify-between pt-6 pb-2 pr-2 text-[8px] font-black text-zinc-300 uppercase leading-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <div className="flex mb-3 h-3 relative">
                {heatmapWeeks.map((week, weekIdx) => {
                  const firstDay = week[0];
                  const isNewMonth = weekIdx === 0 || (new Date(firstDay.date).getDate() <= 7);
                  if (!isNewMonth) return <div key={weekIdx} className="w-3.5 shrink-0" />;
                  return (
                    <div key={weekIdx} className="w-3.5 shrink-0">
                      <span className="absolute text-[9px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                        {getMonthLabel(firstDay.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1">
                {heatmapWeeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1 shrink-0">
                    {week.map((day, dayIdx) => (
                      <div 
                        key={dayIdx} 
                        className={`w-3.5 h-3.5 rounded-[3px] transition-all cursor-crosshair group relative ${getHeatmapColor(day.value)}`}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-50 animate-in fade-in zoom-in duration-200 pointer-events-none">
                           <div className="bg-zinc-900 text-white p-2 rounded-xl shadow-2xl border border-white/10 text-center">
                              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                              <p className="text-[10px] font-bold mt-0.5">{day.kcal} kcal Protocol</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <div className="pt-12 text-center border-t border-zinc-100">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-lg mx-auto">
          PERFORMANCE DATA AGGREGATED VIA ZENFIT NEURAL ARCHITECTURE VERSION 4.2. <br />
          ALL ANALYTICS ARE SUBJECT TO PROTOCOL INTEGRITY CHECKS.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
