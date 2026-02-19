
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fitnessApi } from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressRing from '../components/dashboard/ProgressRing';
import CoachMessage from '../components/dashboard/CoachMessage';
import { 
  Flame, 
  Utensils, 
  Scan, 
  Dumbbell, 
  ChevronRight, 
  TrendingUp,
  Activity,
  Plus,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, profileRes] = await Promise.all([
          fitnessApi.getDashboard(),
          fitnessApi.getProfile()
        ]);
        setData(dashRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calorieSummary = useMemo(() => {
    if (!data) return { eaten: 0, burned: 0, remaining: 0, goal: 2400 };
    const eaten = data.intake || 0;
    const burned = data.burned || 0;
    const goal = data.goal || 2400;
    const remaining = goal - eaten + (burned * 0.1);
    return { eaten, burned, remaining: Math.max(0, Math.round(remaining)), goal };
  }, [data]);

  const completionPercent = useMemo(() => {
    if (!calorieSummary.goal) return 0;
    return Math.min(100, Math.round((calorieSummary.eaten / calorieSummary.goal) * 100));
  }, [calorieSummary]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 space-y-12 max-w-4xl mx-auto animate-in fade-in duration-1000 pb-32">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-white leading-none">
            Welcome, <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">{profile?.name.split(' ')[0]}</span>.
          </h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em]">SYSTEM PROTOCOL: ADAPT & CONQUER</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl">
           <Zap className="w-6 h-6 text-brand-gold fill-brand-gold" />
        </div>
      </header>

      {/* Hero Zone */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <ProgressRing 
            percentage={completionPercent} 
            burned={calorieSummary.burned} 
            goal={calorieSummary.goal} 
            streak={data?.streak || 0} 
          />
        </div>
        
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-10 border-none bg-gradient-to-br from-zinc-900 to-black text-white shadow-3xl overflow-hidden relative group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Energy Surplus</p>
                   <div className="bg-brand-red/20 px-3 py-1 rounded-lg text-[8px] font-black text-brand-red uppercase tracking-widest border border-brand-red/20 animate-pulse">LOCKED & READY</div>
                </div>
                <div className="flex items-baseline gap-4">
                   <h2 className="text-8xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(225,29,72,0.2)]">{calorieSummary.remaining.toLocaleString()}</h2>
                   <span className="text-2xl font-black text-zinc-700 tracking-widest uppercase">KCAL</span>
                </div>
                <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full bg-gradient-to-r from-brand-red to-brand-orange shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all duration-1000" style={{ width: `${100 - completionPercent}%` }} />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/5 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-brand-red/10 transition-all" />
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-8 border-zinc-800/50 bg-zinc-900/30 hover:border-brand-green/30 transition-all group">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green border border-brand-green/20">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Intake</p>
               </div>
               <p className="text-4xl font-black text-white tabular-nums tracking-tighter group-hover:text-brand-green transition-colors">{calorieSummary.eaten.toLocaleString()}</p>
            </Card>
            <Card className="p-8 border-zinc-800/50 bg-zinc-900/30 hover:border-brand-red/30 transition-all group">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand-red/10 rounded-2xl flex items-center justify-center text-brand-red border border-brand-red/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Burn</p>
               </div>
               <p className="text-4xl font-black text-white tabular-nums tracking-tighter group-hover:text-brand-red transition-colors">{calorieSummary.burned.toLocaleString()}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Ignite Execution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/workouts')} 
            className="flex items-center justify-between p-8 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-[32px] shadow-2xl shadow-red-900/20 hover:-translate-y-1 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 group-hover:rotate-6 transition-transform">
                <Dumbbell className="w-7 h-7" strokeWidth={3} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-red-200 uppercase tracking-widest mb-1">Combat Ready</p>
                <p className="text-lg font-black uppercase tracking-widest leading-none">START SESSION</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-40 group-hover:translate-x-2 transition-transform" />
          </button>

          <button 
            onClick={() => navigate('/food')} 
            className="flex items-center justify-between p-8 bg-zinc-900 border border-zinc-800 text-white rounded-[32px] shadow-xl hover:border-zinc-600 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 text-zinc-400 group-hover:text-white" strokeWidth={3} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fuel Inventory</p>
                <p className="text-lg font-black uppercase tracking-widest leading-none">LOG INTAKE</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-40 group-hover:translate-x-2 transition-transform" />
          </button>

          <button 
            onClick={() => navigate('/coach')} 
            className="flex items-center justify-between p-8 bg-zinc-900 border border-zinc-800 text-white rounded-[32px] shadow-xl hover:border-brand-gold/50 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:-rotate-6 transition-transform border border-brand-gold/20">
                <Sparkles className="w-7 h-7" strokeWidth={3} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Neural Core</p>
                <p className="text-lg font-black text-white uppercase tracking-widest leading-none">AI INSIGHTS</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-40 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      <CoachMessage />

      <div className="pt-20 text-center opacity-30 border-t border-zinc-900">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.8em]">
          FORCE PROTOCOL ALPHA-01 • ADAPT OR EXPIRE
        </p>
      </div>
    </div>
  );
};

export default Intro;
