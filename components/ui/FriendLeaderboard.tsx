
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Trophy, Activity, Zap, TrendingUp, ChevronRight } from 'lucide-react';

// Cast motion components to any to bypass environment-specific typing issues
const MotionDiv = motion.div as any;
const MotionCircle = motion.circle as any;

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  weeklyProgress: number;
  stats: {
    workouts: number;
    calories: number;
    streak: number;
  };
}

const FriendLeaderboard: React.FC<{ members: LeaderboardUser[] }> = ({ members }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Find top 3 for the podium
  const topThree = [...members].sort((a, b) => a.rank - b.rank).slice(0, 3);
  
  // Reorder for visual podium layout: [Rank 2, Rank 1, Rank 3]
  const podiumOrder = [topThree[1], topThree[0], topThree[2]];

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return {
        color: 'text-yellow-500',
        ring: 'border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.4)]',
        badge: 'bg-yellow-500 text-zinc-950',
        size: 'w-32 h-32 md:w-40 md:h-40',
        z: 'z-30 scale-110',
        y: '-translate-y-6',
        glow: 'bg-yellow-500/10'
      };
      case 2: return {
        color: 'text-zinc-300',
        ring: 'border-zinc-300 shadow-[0_0_30px_rgba(212,212,216,0.2)]',
        badge: 'bg-zinc-300 text-zinc-950',
        size: 'w-24 h-24 md:w-32 md:h-32',
        z: 'z-20',
        y: 'translate-y-2',
        glow: 'bg-zinc-300/5'
      };
      case 3: return {
        color: 'text-orange-400',
        ring: 'border-orange-400 shadow-[0_0_30px_rgba(251,146,60,0.2)]',
        badge: 'bg-orange-400 text-zinc-950',
        size: 'w-24 h-24 md:w-32 md:h-32',
        z: 'z-10',
        y: 'translate-y-4',
        glow: 'bg-orange-400/5'
      };
      default: return { color: '', ring: '', badge: '', size: '', z: '', y: '', glow: '' };
    }
  };

  return (
    <div className="relative py-16 px-4 overflow-hidden bg-zinc-950 rounded-[48px] border border-white/5 shadow-2xl">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        <header className="text-center mb-16 space-y-3">
          <MotionDiv 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Squad Dominance Matrix</span>
          </MotionDiv>
          <h2 className="text-4xl font-black tracking-tighter text-white">You vs Friends</h2>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Protocol Monitoring
          </p>
        </header>

        {/* Podium Visualization */}
        <div className="flex justify-center items-end h-80 relative">
          {podiumOrder.map((user, idx) => {
            if (!user) return null;
            const style = getRankStyle(user.rank);
            const isHovered = hoveredId === user.id;

            return (
              <MotionDiv
                key={user.id}
                initial={{ opacity: 0, y: 60, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: idx * 0.15, type: 'spring', bounce: 0.4 }}
                className={`flex flex-col items-center gap-6 ${style.z} ${style.y} relative group cursor-pointer`}
                onMouseEnter={() => setHoveredId(user.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Real-time Stats Overlay on Hover */}
                <AnimatePresence>
                  {isHovered && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute -top-36 w-56 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 p-5 rounded-[28px] shadow-3xl z-50 pointer-events-none"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Protocol Metrics</span>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[8px] font-bold text-zinc-500 uppercase">Streak</p>
                            <p className="text-sm font-black text-white">{user.stats.streak}D</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-zinc-500 uppercase">Load Vol</p>
                            <p className="text-sm font-black text-white">{user.stats.workouts}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-[10px] font-black text-zinc-100">{user.stats.calories.toLocaleString()} KCAL BURNED</span>
                        </div>
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>

                {/* Avatar with Rank and Glow */}
                <div className="relative group">
                  {/* Glowing Ring Animation */}
                  <MotionDiv 
                    animate={user.rank === 1 ? { scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] } : {}}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className={`absolute -inset-3 rounded-[42px] blur-xl ${style.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} 
                  />
                  
                  {/* Outer Progress Ring */}
                  <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90 pointer-events-none">
                    <circle cx="50%" cy="50%" r="46%" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                    <MotionCircle 
                      cx="50%" cy="50%" r="46%" fill="none" 
                      stroke={user.rank === 1 ? '#EAB308' : user.rank === 2 ? '#D4D4D8' : '#FB923C'} 
                      strokeWidth="3" 
                      strokeDasharray="100 100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - user.weeklyProgress }}
                      transition={{ duration: 2.5, ease: 'easeOut', delay: 0.5 }}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* High-Fidelity Avatar Container */}
                  <div className={`relative ${style.size} rounded-[44px] md:rounded-[52px] border-[6px] ${style.ring} overflow-hidden bg-zinc-800 transition-all duration-700 group-hover:scale-105 group-hover:rotate-2`}>
                    <img src={user.avatar} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={user.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Rank Badge Indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-12 h-12 ${style.badge} rounded-full border-4 border-zinc-950 flex items-center justify-center font-black text-lg shadow-2xl z-40 transform transition-transform group-hover:scale-110`}>
                    {user.rank}
                  </div>
                </div>

                {/* Meta Labels */}
                <div className="text-center space-y-1 transform transition-all group-hover:translate-y-1">
                  <p className={`text-base font-black tracking-tighter ${user.rank === 1 ? 'text-white' : 'text-zinc-400'}`}>
                    {user.name.split(' ')[0]}
                  </p>
                  <div className="flex flex-col items-center">
                    <span className={`text-lg font-black tracking-widest leading-none ${style.color}`}>
                      {user.points.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Points</span>
                  </div>
                </div>
              </MotionDiv>
            );
          })}
        </div>

        {/* Swipe Interaction Hint */}
        <div className="mt-16 flex flex-col items-center gap-4 opacity-40">
           <div className="flex items-center gap-6">
              <div className="w-12 h-0.5 bg-zinc-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Interactive Protocol</span>
              <div className="w-12 h-0.5 bg-zinc-800" />
           </div>
           <MotionDiv 
             animate={{ x: [-10, 10, -10] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="flex items-center gap-2 text-zinc-500"
           >
             <ChevronRight className="w-4 h-4 opacity-50 rotate-180" />
             <div className="w-8 h-1.5 bg-zinc-800 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/50 w-1/2 rounded-full" />
             </div>
             <ChevronRight className="w-4 h-4 opacity-50" />
           </MotionDiv>
        </div>
      </div>
    </div>
  );
};

export default FriendLeaderboard;
