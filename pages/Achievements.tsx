
import React, { useState, useEffect } from 'react';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import { Trophy, Flame, Target, Star, Lock, ChevronRight, Award, Zap, TrendingUp, Sparkles } from 'lucide-react';
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

  if (loading || !stats) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 animate-pulse">
        <div className="h-40 bg-zinc-100 rounded-[32px]" />
        <div className="h-64 bg-zinc-100 rounded-[32px]" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-100 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Header title="Mastery Vault" subtitle="Analyze your iterative performance and rank progression." />

      {/* Hero Streak Card with Flame Animation */}
      <section className="relative">
        <Card className="p-10 border-none bg-zinc-900 text-white overflow-hidden shadow-3xl shadow-zinc-200">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Current Performance Streak</span>
              </div>
              <div className="flex items-baseline justify-center md:justify-start gap-3">
                <h2 className="text-8xl font-black tracking-tighter tabular-nums">{stats.currentStreak}</h2>
                <span className="text-2xl font-bold text-zinc-600">DAYS</span>
              </div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Personal Record: {stats.bestStreak} Days</p>
            </div>

            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Complex CSS Flame Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-orange-600 rounded-full blur-[40px] opacity-30 animate-pulse" />
                <div className="w-16 h-24 bg-gradient-to-t from-orange-600 via-orange-400 to-transparent rounded-full animate-[bounce_2s_infinite] opacity-80" />
                <div className="w-10 h-16 bg-gradient-to-t from-yellow-400 to-transparent rounded-full animate-[bounce_1.5s_infinite] delay-150 absolute bottom-4" />
              </div>
              <Flame className="w-16 h-16 text-white relative z-10 drop-shadow-[0_0_20px_rgba(234,88,12,0.8)]" />
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        </Card>
      </section>

      {/* Rank Progression Module */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-900" />
            <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Rank Progression</h2>
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stats.totalPoints} Power Points</span>
        </div>
        
        <Card className="p-8 border-zinc-100 shadow-premium group">
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Rank</p>
              <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{stats.rank}</h3>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Next Evolution</p>
              <h3 className="text-xl font-black text-blue-600 tracking-tight">{stats.nextRank}</h3>
            </div>
          </div>

          <div className="relative h-4 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
            <div 
              className="h-full bg-gradient-to-r from-zinc-900 to-blue-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              style={{ width: `${stats.rankProgress}%` }}
            />
            {/* Milestone markers */}
            {[25, 50, 75].map(m => (
              <div key={m} className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${m}%` }} />
            ))}
          </div>
          
          <div className="mt-4 flex justify-between items-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            <span>Progress: {stats.rankProgress}%</span>
            <span className="flex items-center gap-1 group-hover:text-zinc-900 transition-colors">
              Continue protocol to evolve <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </Card>
      </section>

      {/* Achievement Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Award className="w-5 h-5 text-zinc-900" />
          <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Achievement Ledger</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => {
            const isLocked = !badge.unlocked;
            const progressPercent = badge.progress && badge.target 
              ? Math.min(100, (badge.progress / badge.target) * 100) 
              : 0;

            return (
              <Card 
                key={badge.id} 
                className={`p-6 border-zinc-100 relative group overflow-hidden transition-all duration-500 ${
                  isLocked ? 'bg-zinc-50/50 grayscale' : 'hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-1'
                }`}
              >
                <div className="relative z-10 space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:rotate-12 ${
                    isLocked ? 'bg-zinc-200' : 'bg-white border border-zinc-100 shadow-xl'
                  }`}>
                    {isLocked ? <Lock className="w-6 h-6 text-zinc-400" /> : badge.icon}
                  </div>
                  
                  <div>
                    <h4 className={`text-sm font-black tracking-tight ${isLocked ? 'text-zinc-400' : 'text-zinc-900'}`}>
                      {badge.title}
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight mt-1 leading-tight">
                      {badge.description}
                    </p>
                  </div>

                  {isLocked && badge.progress !== undefined && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400">
                        <span>Progress</span>
                        <span>{badge.progress}/{badge.target}</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-700"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {!isLocked && (
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-zinc-900 opacity-[0.03] rotate-12 group-hover:rotate-45 transition-transform" />
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <div className="pt-4 text-center">
        <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] hover:text-zinc-900 transition-colors">
          Download Merit Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default Achievements;
