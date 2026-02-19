
import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import StatBlock from '../components/ui/StatBlock';
import { fitnessApi } from '../api/axios';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Award, 
  Flame, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Trophy,
  Activity,
  ArrowUpRight,
  Target,
  Brain
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from 'recharts';

const WeeklyReport: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fitnessApi.getWeeklyReport();
        setData(res.data);
      } catch (err) {
        console.error("Failed to load weekly report intel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-zinc-100 rounded-xl" />
        <div className="h-64 bg-zinc-100 rounded-[40px]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-100 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Header title="Performance Audit" subtitle={`Assessment Period: ${data.period}`} />
        <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl active:scale-95 self-start md:self-auto">
          <Download className="w-4 h-4" /> Export Protocol PDF
        </button>
      </div>

      {/* Hero Consistency Score */}
      <section className="relative">
        <Card className="p-10 border-none bg-zinc-900 text-white overflow-hidden shadow-3xl group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="p-2 bg-blue-600/20 rounded-xl">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Adherence Score</span>
              </div>
              <div className="flex items-baseline justify-center md:justify-start gap-3">
                <h2 className="text-8xl font-black tracking-tighter tabular-nums">{data.consistencyScore}%</h2>
                <span className="text-xl font-bold text-zinc-600 uppercase tracking-widest">Optimized</span>
              </div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                Your biological output and protocol compliance reached elite levels this period.
              </p>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="44" fill="none" stroke="#3B82F6" strokeWidth="8" 
                  strokeDasharray="276.5" 
                  strokeDashoffset={276.5 * (1 - data.consistencyScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-2000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        </Card>
      </section>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {data.summaryMetrics.map((metric: any, i: number) => (
          <Card key={i} className="p-6 border-zinc-100 bg-white hover:border-zinc-300 transition-all group">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">{metric.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-zinc-900 tracking-tight">{metric.value}</span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase">{metric.unit}</span>
            </div>
            <div className={`mt-3 inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
              metric.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {metric.delta} vs Last Week
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Caloric Flux Chart */}
        <Card className="lg:col-span-2 p-8 border-none shadow-premium bg-white space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 tracking-tight">Caloric Equilibrium</h3>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Intake Efficiency vs Target Burn</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Intake</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Burned</span>
              </div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.caloricFlux} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', backgroundColor: '#18181b', color: '#fff' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                />
                <Bar dataKey="intake" fill="#18181b" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="burned" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Achievement Mini-Feed */}
        <Card className="p-8 border-none bg-zinc-50 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-zinc-900" />
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">Merit Gains</h3>
            </div>
            <div className="space-y-4">
              {data.achievements.map((ach: any) => (
                <div key={ach.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100 group hover:border-zinc-900 transition-all">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    {ach.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-zinc-900">{ach.title}</h4>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{ach.date}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-6 py-4 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
            View Trophy Room
          </button>
        </Card>
      </section>

      {/* Performance Highlights */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Zap className="w-5 h-5 text-zinc-900" />
          <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Protocol Highlights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.highlights.map((h: any) => (
            <Card key={h.id} className="p-8 border-none bg-white shadow-premium flex flex-col gap-6 group hover:-translate-y-1 transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                h.type === 'strength' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' :
                h.type === 'recovery' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' :
                'bg-zinc-900 text-white'
              }`}>
                {h.type === 'strength' ? <TrendingUp className="w-7 h-7" /> : 
                 h.type === 'recovery' ? <Brain className="w-7 h-7" /> : 
                 <Target className="w-7 h-7" />}
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-lg text-zinc-900 tracking-tight">{h.title}</h4>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">{h.description}</p>
              </div>
              <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                Protocol Verified <ArrowUpRight className="w-3 h-3" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="pt-12 text-center border-t border-zinc-100">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-md mx-auto">
          ZENFIT WEEKLY AUDIT COMPLETE. PROTOCOL INTEGRITY: SECURED. <br />
          NODE AUTH: 0x921A-PROTO-WEEKLY
        </p>
      </div>
    </div>
  );
};

export default WeeklyReport;
