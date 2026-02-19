
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Cast motion.button to any to bypass environment-specific typing issues
const MotionButton = motion.button as any;

interface DailyCTAProps {
  status: 'workout' | 'meal' | 'record';
}

const DailyCTA: React.FC<DailyCTAProps> = ({ status }) => {
  const navigate = useNavigate();

  const config = {
    workout: {
      text: "Initialize Today's Protocol",
      icon: Zap,
      path: "/workouts",
      color: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
    },
    meal: {
      text: "Synchronize Nutrient Log",
      icon: Utensils,
      path: "/food",
      color: "bg-teal-600 hover:bg-teal-500 shadow-teal-500/20"
    },
    record: {
      text: "Beat Your Previous Peak",
      icon: Target,
      path: "/analytics",
      color: "bg-orange-600 hover:bg-orange-500 shadow-orange-500/20"
    }
  };

  const active = config[status];

  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(active.path)}
      className={`w-full h-18 md:h-20 ${active.color} rounded-[28px] p-1 flex items-center transition-all shadow-3xl group`}
    >
      <div className="w-16 h-full bg-white/10 rounded-[24px] flex items-center justify-center transition-transform group-hover:rotate-12">
        <active.icon className="w-7 h-7 text-white" />
      </div>
      <div className="flex-1 px-6 text-left">
        <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Recommended Sequence</p>
        <p className="text-sm md:text-base font-black text-white uppercase tracking-widest">{active.text}</p>
      </div>
      <div className="pr-6">
        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
      </div>
    </MotionButton>
  );
};

export default DailyCTA;
