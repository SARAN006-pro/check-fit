
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

// Cast motion components to any to bypass environment-specific typing issues
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
      <div className="absolute w-72 h-72 bg-brand-green/5 rounded-full blur-[100px] animate-pulse-glow" />
      
      <div className="relative w-80 h-80">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
          {/* Base Circle */}
          <circle
            cx="100" cy="100" r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
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
            className="drop-shadow-[0_0_15px_#39ff14]"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <MotionDiv 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-1"
          >
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Capacity</span>
            <div className="flex items-baseline justify-center">
              <span className="text-7xl font-black text-white tracking-tighter tabular-nums">{percentage}</span>
              <span className="text-xl font-bold text-brand-green ml-1">%</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-green/10 rounded-full border border-brand-green/20">
              <Flame className="w-3.5 h-3.5 text-brand-green fill-brand-green" />
              <span className="text-[10px] font-black text-brand-green tracking-widest">{burned.toLocaleString()} KCAL BURNED</span>
            </div>
          </MotionDiv>
        </div>
      </div>

      {/* Streak Badge - Electric Yellow */}
      <MotionDiv 
        whileHover={{ scale: 1.05 }}
        className="mt-8 flex items-center gap-4 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-[28px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-gold/5" />
        <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center border border-brand-gold/20 relative z-10">
          <Flame className="w-6 h-6 text-brand-gold fill-brand-gold animate-pulse" />
        </div>
        <div className="relative z-10">
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Momentum Protocol</p>
          <p className="text-xl font-black text-white leading-tight">{streak} DAY STREAK 🔥</p>
        </div>
      </MotionDiv>
    </div>
  );
};

export default ProgressRing;
