
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Star } from 'lucide-react';

// Cast motion.div to any to bypass environment-specific typing issues
const MotionDiv = motion.div as any;

const badges = [
  { id: 1, icon: '🔥', label: '7 Day Streak', unlocked: true },
  { id: 2, icon: '🏋️', label: 'Titan Loader', unlocked: true },
  { id: 3, icon: '🏃', label: 'Velocity Master', unlocked: false },
  { id: 4, icon: '🥗', label: 'Macro Genius', unlocked: false },
];

const Achievements: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-2">
        <Star className="w-4 h-4 text-yellow-500 fill-current" />
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Mastery Vault</h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {badges.map((badge) => (
          <MotionDiv
            key={badge.id}
            whileHover={{ y: -4 }}
            className={`shrink-0 w-32 h-32 rounded-[32px] border flex flex-col items-center justify-center gap-2 relative group overflow-hidden ${
              badge.unlocked 
                ? 'bg-zinc-900 border-white/10 shadow-xl' 
                : 'bg-white/5 border-white/5 grayscale opacity-40'
            }`}
          >
            {badge.unlocked && (
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent" />
            )}
            <div className={`text-3xl ${!badge.unlocked ? 'blur-sm' : ''}`}>{badge.icon}</div>
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center px-4 leading-tight">
              {badge.unlocked ? badge.label : 'Locked Node'}
            </p>
            {!badge.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                <Lock className="w-4 h-4 text-white/40" />
              </div>
            )}
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
