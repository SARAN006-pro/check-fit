
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const MotionDiv = motion.div as any;
const MotionCircle = motion.circle as any;

interface ProgressRingProps {
  percentage: number;
  burned: number;
  goal: number;
  streak: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ percentage, burned, goal, streak }) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Intense Background Glow */}
      <div className="absolute w-72 h-72 bg-brand-green/5 rounded-full blur-[100px] animate-pulse-glow opacity-30 dark:opacity-100" />
      
      <div className="relative w-80 h-80">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
          {/* Base Circle */}
          <circle
            cx="100" cy="100" r={radius}
            fill="transparent"
            stroke="rgba(0,0,0,0.03)"
            className="dark:stroke-white/5"
            strokeWidth="14"
          />
          {/* Progress Circle - Neon Green */}
          <MotionCircle
            cx="100" cy="100" r={radius}
            fill="transparent"
            stroke="#39ff14"
            strokeWidth="14"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2.5, ease: "circOut" }}
            strokeLinecap="round"
            className="drop-shadow-[0_0_15px_rgba(57,255,20,0.4)]"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-1"
          >
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.5em]">Capacity</span>
            <div className="flex items-baseline justify-center">
              <span className="text-7xl font-black text-zinc-900 dark:text-white tracking-tighter tabular-nums">{percentage}</span>
              <span className="text-xl font-bold text-green-600 dark:text-brand-green ml-1">%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-green/10 rounded-full border border-brand-green/20 shadow-sm dark:shadow-none">
              <Flame className="w-3.5 h-3.5 text-green-600 dark:text-brand-green fill-current" />
              <span className="text-[10px] font-black text-green-600 dark:text-brand-green tracking-widest">{burned.toLocaleString()} KCAL BURNED</span>
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* Streak Badge */}
      <MotionDiv 
        whileHover={{ scale: 1.05 }}
        className="mt-8 flex items-center gap-4 px-8 py-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[28px] shadow-premium dark:shadow-3xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-gold/5" />
        <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center border border-brand-gold/20 relative z-10">
          <Flame className="w-6 h-6 text-brand-gold fill-brand-gold animate-pulse" />
        </div>
        <div className="relative z-10">
          <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">Momentum Protocol</p>
          <p className="text-xl font-black text-zinc-900 dark:text-white leading-tight">{streak} DAY STREAK 🔥</p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default ProgressRing;
