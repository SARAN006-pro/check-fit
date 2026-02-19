
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';

// Cast motion.div to any to bypass environment-specific typing issues
const MotionDiv = motion.div as any;

const CoachMessage: React.FC = () => {
  return (
    <MotionDiv 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/80 border border-blue-500/10 p-6 rounded-[32px] flex gap-5 items-start relative overflow-hidden"
    >
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Neural Link Active</span>
          <Sparkles className="w-3 h-3 text-blue-400" />
        </div>
        <p className="text-sm font-medium text-zinc-200 leading-relaxed italic">
          "Your biometrics are reporting peak readiness, Alex. You're on track to your best month ever. Today's protocol is optimized for growth. Finish strong."
        </p>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] -mr-16 -mt-16" />
    </MotionDiv>
  );
};

export default CoachMessage;
