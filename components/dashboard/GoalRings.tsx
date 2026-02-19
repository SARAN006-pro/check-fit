
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Timer } from 'lucide-react';

interface GoalRingsProps {
  kcal: { current: number; goal: number };
  volume: { current: number; goal: number };
  mins: { current: number; goal: number };
}

const GoalRings: React.FC<GoalRingsProps> = ({ kcal, volume, mins }) => {
  const rings = [
    { label: 'Energy', current: kcal.current, goal: kcal.goal, color: '#e11d48', icon: Flame, size: 240, stroke: 16 },
    { label: 'Volume', current: volume.current, goal: volume.goal, color: '#ea580c', icon: Zap, size: 190, stroke: 16 },
    { label: 'Active', current: mins.current, goal: mins.goal, color: '#39ff14', icon: Timer, size: 140, stroke: 16 },
  ];

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[320px] mx-auto">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-brand-red/5 rounded-full blur-[80px] animate-pulse-glow" />
      
      <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
        {rings.map((ring, i) => {
          const radius = (ring.size / 2) - (ring.stroke / 2);
          const circumference = 2 * Math.PI * radius;
          const progress = Math.min(1, ring.current / ring.goal);
          const offset = circumference - progress * circumference;

          return (
            <g key={i}>
              {/* Base Ring */}
              <circle
                cx="140" cy="140" r={radius}
                fill="transparent"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={ring.stroke}
              />
              {/* Progress Ring */}
              <motion.circle
                cx="140" cy="140" r={radius}
                fill="transparent"
                stroke={ring.color}
                strokeWidth={ring.stroke}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 2, ease: "circOut", delay: i * 0.2 }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                style={{ filter: `drop-shadow(0 0 8px ${ring.color}44)` }}
              />
            </g>
          );
        })}
      </svg>

      {/* Center Display */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-0"
        >
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-1">Daily Load</p>
          <div className="flex items-baseline justify-center">
            <span className="text-6xl font-black text-white tracking-tighter tabular-nums">
              {Math.round((kcal.current / kcal.goal) * 100)}
            </span>
            <span className="text-xl font-bold text-brand-red ml-1">%</span>
          </div>
          <div className="flex gap-4 mt-4">
             {rings.map((ring, i) => (
               <div key={i} className="flex flex-col items-center gap-1">
                 <ring.icon className="w-3.5 h-3.5" style={{ color: ring.color }} />
                 <div className="w-1 h-1 rounded-full" style={{ backgroundColor: ring.color }} />
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Extreme Completion Celebration */}
      {kcal.current >= kcal.goal && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 border-8 border-brand-red rounded-full"
        />
      )}
    </div>
  );
};

export default GoalRings;
