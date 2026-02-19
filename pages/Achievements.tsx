
import React, { useState, useEffect } from 'react';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Target, Star, Lock, ChevronRight, Award, Zap, TrendingUp, Sparkles, Medal, Shield } from 'lucide-react';
import { Badge, AchievementStats } from '../types';

const Achievements: React.FC = () => {
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fitnessApi.getAchievements();
        setStats(res.data.stats);
        setBadges(res.data.badges);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const rarityColors = {
    common: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
    rare: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    elite: 'text-brand-orange bg-brand-orange/10 border-brand-orange/20',
    mythic: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20',
  };

  if (loading || !stats) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 animate-pulse">
        <div className="h-40 bg-zinc-900 rounded-[32px]" />
        <div className="h-64 bg-zinc-900 rounded-[32px]" />
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 max-w-3xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <Header title="Verified Merit Cabinet" subtitle="Longitudinal performance logs and badge matrix." />

      {/* 1. HERO XP & LEVEL ZONE */}
      <section className="relative">
        <Card className="p-12 border-none bg-zinc-900 text-white overflow-hidden shadow-3xl relative">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Shield className="w-5 h-5 text-brand-gold fill-brand-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">System Standing</span>
              </div>
              <div className="space-y-1">
                 <h2 className="text-2xl font-black text-zinc-400 uppercase tracking-widest leading-none">RANK:</h2>
                 <h3 className="text-7xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_30px_#facc1522] italic">{stats.rank}</h3>
              </div>
              <div className="flex items-center gap-6">
                 <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Pts</p>
                    <p className="text-2xl font-black text-white tabular-nums">{stats.totalPoints.toLocaleString()}</p>
                 </div>
                 <div className="w-px h-10 bg-zinc-800" />
                 <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Level</p>
                    <p className="text-2xl font-black text-brand-gold tabular-nums">{stats.level}</p>
                 </div>
              </div>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand-gold/5 rounded-full blur-[60px] animate-pulse" />
              <div className="w-40 h-40 rounded-[48px] bg-black border-4 border-zinc-800 shadow-3xl flex items-center justify-center relative overflow-hidden group">
                 <Medal className="w-20 h-20 text-brand-gold fill-brand-gold group-hover:scale-110 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/10 to-transparent" />
              </div>
              {/* Spinning XP indicator */}
              <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90">
                 <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                 <motion.circle 
                    cx="50%" cy="50%" r="48%" fill="none" stroke="#facc15" strokeWidth="4" 
                    strokeDasharray="100 100" strokeDashoffset={100 - stats.rankProgress}
                    strokeLinecap="round"
                    transition={{ duration: 2, delay: 0.5 }}
                 />
              </svg>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        </Card>
      </section>

      {/* 2. FORCE STREAK LEDGER */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border-none bg-zinc-900/50 flex items-center gap-6 group hover:bg-zinc-900 transition-all">
           <div className="w-16 h-16 bg-brand-red/10 rounded-[28px] border border-brand-red/20 flex items-center justify-center">
              <Flame className="w-8 h-8 text-brand-red fill-brand-red animate-pulse" />
           </div>
           <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Momentum Velocity</p>
              <h4 className="text-3xl font-black text-white italic">{stats.currentStreak} DAYS</h4>
           </div>
        </Card>
        <Card className="p-8 border-none bg-zinc-900/50 flex items-center gap-6 group hover:bg-zinc-900 transition-all">
           <div className="w-16 h-16 bg-brand-gold/10 rounded-[28px] border border-brand-gold/20 flex items-center justify-center">
              <Star className="w-8 h-8 text-brand-gold fill-brand-gold" />
           </div>
           <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Historical Peak</p>
              <h4 className="text-3xl font-black text-white italic">{stats.bestStreak} DAYS</h4>
           </div>
        </Card>
      </section>

      {/* 3. THE BADGE CABINET */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-brand-red rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Verified Merit Matrix</h3>
           </div>
           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">{badges.filter(b => b.unlocked).length} UNLOCKED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           {badges.map((badge) => {
             const isLocked = !badge.unlocked;
             const progressPercent = badge.progress && badge.target ? (badge.progress / badge.target) * 100 : 0;
             const colors = rarityColors[badge.rarity];

             return (
               <Card 
                 key={badge.id}
                 className={`p-8 border-2 transition-all duration-500 relative overflow-hidden group ${
                   isLocked ? 'bg-zinc-900/20 border-zinc-800 opacity-40 grayscale' : `bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:-translate-y-1`
                 }`}
               >
                 <div className="flex gap-6 items-start relative z-10">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6 bg-black border border-white/5`}>
                       {isLocked ? <Lock className="w-6 h-6 text-zinc-700" /> : badge.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border ${colors}`}>
                            {badge.rarity}
                          </span>
                          {!isLocked && <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{badge.dateUnlocked}</p>}
                       </div>
                       <h4 className="text-xl font-black text-white tracking-tight uppercase italic">{badge.title}</h4>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                          {badge.description}
                       </p>

                       {isLocked && badge.progress !== undefined && (
                         <div className="pt-4 space-y-2">
                            <div className="flex justify-between text-[8px] font-black uppercase text-zinc-600 tracking-widest">
                               <span>Neural Progression</span>
                               <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-1 w-full bg-black rounded-full overflow-hidden border border-white/5">
                               <div 
                                 className="h-full bg-brand-red transition-all duration-1000"
                                 style={{ width: `${progressPercent}%` }}
                               />
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
                 
                 {/* Animated BG Accent */}
                 {!isLocked && (
                   <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-red/5 rounded-full blur-2xl group-hover:bg-brand-red/10 transition-colors" />
                 )}
               </Card>
             );
           })}
        </div>
      </section>

      <div className="pt-20 text-center opacity-10 border-t border-zinc-900">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[1.5em]">
          MERIT LOGGED • ADAPT OR EXPIRE
        </p>
      </div>
    </div>
  );
};

export default Achievements;
