
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fitnessApi } from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import GoalRings from '../components/dashboard/GoalRings';
import CoachMessage from '../components/dashboard/CoachMessage';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  ShieldAlert,
  ArrowUp
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

  const streakDisplay = useMemo(() => {
    if (!data) return { count: 0, status: 'stable' };
    return {
      count: data.streak,
      status: data.streakStatus as 'stable' | 'warning' | 'critical'
    };
  }, [data]);

  const calorieSummary = useMemo(() => {
    if (!data) return { eaten: 0, burned: 0, remaining: 0, goal: 2400 };
    const eaten = data.intake || 0;
    const burned = data.burned || 0;
    const goal = data.goal || 2400;
    const remaining = goal - eaten + (burned * 0.1);
    return { eaten, burned, remaining: Math.max(0, Math.round(remaining)), goal };
  }, [data]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-6 md:p-12 space-y-10 max-w-4xl mx-auto animate-in fade-in duration-1000 pb-32">
      {/* 1. FORCE HEADER & XP TRACKER */}
      <header className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-white leading-none">
              Welcome, <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{profile?.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em]">iCTRL STATUS: ACTIVE [LVL {profile?.level}]</p>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-48 space-y-1.5">
             <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                <span>Neural Progression</span>
                <span>{profile?.xp} / {profile?.xpToNextLevel}</span>
             </div>
             <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(profile?.xp / profile?.xpToNextLevel) * 100}%` }}
                   className="h-full bg-purple-600 shadow-[0_0_10px_#9333ea44]"
                />
             </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/achievements')}
          className={`relative w-20 h-20 rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden border transition-all duration-500 ${
            streakDisplay.status === 'stable' ? 'bg-zinc-900 border-zinc-800' :
            streakDisplay.status === 'warning' ? 'bg-brand-orange/10 border-brand-orange/40 animate-pulse' :
            'bg-brand-red border-brand-red shadow-[0_0_30px_#e11d48]'
          }`}
        >
          <Flame className={`w-8 h-8 mb-1 ${
            streakDisplay.status === 'critical' ? 'text-white fill-white' : 'text-purple-500 fill-purple-500'
          }`} />
          <span className="text-xl font-black tabular-nums leading-none text-white">{streakDisplay.count}</span>
        </motion.div>
      </header>

      {/* 3. BIOMETRIC RINGS ZONE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 flex justify-center">
          <GoalRings 
            kcal={{ current: data?.burned || 0, goal: data?.burnedGoal || 2400 }}
            volume={{ current: 12400, goal: 15000 }}
            mins={{ current: data?.activeMinutes || 0, goal: data?.activeMinutesGoal || 60 }}
          />
        </div>
        
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-10 border-none bg-zinc-900 text-white shadow-3xl overflow-hidden relative group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Capacity Reserve</p>
                   {streakDisplay.status !== 'stable' && (
                     <div className="bg-brand-red/20 px-3 py-1 rounded-lg text-[8px] font-black text-brand-red uppercase tracking-widest border border-brand-red/20 animate-pulse">PROTOCOL DEGRADATION</div>
                   )}
                </div>
                <div className="flex items-baseline gap-4">
                   <h2 className="text-8xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_30px_rgba(147,51,234,0.2)]">{calorieSummary.remaining.toLocaleString()}</h2>
                   <span className="text-2xl font-black text-zinc-700 tracking-widest uppercase">KCAL</span>
                </div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] italic">Maintain iCtrl sequence to preserve systemic momentum.</p>
             </div>
             <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-purple-600/10 transition-all" />
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-8 border-zinc-800/50 bg-zinc-900/30 hover:border-brand-green/30 transition-all group overflow-hidden">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green border border-brand-green/20">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Fuel</p>
               </div>
               <p className="text-4xl font-black text-white tabular-nums tracking-tighter group-hover:text-brand-green transition-colors">{calorieSummary.eaten.toLocaleString()}</p>
            </Card>
            <Card className="p-8 border-zinc-800/50 bg-zinc-900/30 hover:border-purple-500/30 transition-all group overflow-hidden">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 border border-purple-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Power Output</p>
               </div>
               <p className="text-4xl font-black text-white tabular-nums tracking-tighter group-hover:text-purple-500 transition-colors">{calorieSummary.burned.toLocaleString()}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. ACTION CTA */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Ignite Control</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/workouts')} 
            className="flex items-center justify-between p-8 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-[32px] shadow-2xl shadow-purple-900/20 hover:-translate-y-1 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 group-hover:rotate-6 transition-transform">
                <Dumbbell className="w-7 h-7" strokeWidth={3} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-purple-100 uppercase tracking-widest mb-1">Execute Protocol</p>
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
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fuel Log</p>
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
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">iCtrl Intelligence</p>
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
          iCTRL PERFORMANCE PROTOCOL • ADAPT OR EXPIRE
        </p>
      </div>
    </div>
  );
};

export default Intro;
