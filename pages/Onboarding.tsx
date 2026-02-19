
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target, Activity, User, Sparkles } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Female',
    experience: 'Beginner (0-1)',
    goal: 'Muscle Gain'
  });

  const handleContinue = () => {
    localStorage.setItem('zenfit_onboarding_gender', formData.gender);
    onComplete();
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
      {/* Abstract Lavender Waves Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 dark:bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[140px] [animation-delay:2s] animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="p-10 md:p-12 border-white/40 dark:border-white/10 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex p-3 bg-purple-600/10 rounded-2xl mb-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
              Start Your <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent"><span className="lowercase font-medium italic">i</span>CTRL Journey</span>
            </h1>
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Configure Your Biometric Baseline</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User className="w-3 h-3" /> Age
                </label>
                <input
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-zinc-100/50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-zinc-900 dark:text-white font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-zinc-100/50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-zinc-900 dark:text-white font-bold appearance-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Target className="w-3 h-3" /> Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full bg-zinc-100/50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-zinc-900 dark:text-white font-bold appearance-none"
              >
                <option>Beginner (0-1 Years)</option>
                <option>Intermediate (1-3 Years)</option>
                <option>Advanced (3+ Years)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Activity className="w-3 h-3" /> Strategic Goal
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Fat Loss', 'Muscle Gain', 'Strength', 'General Fitness'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, goal: g })}
                    className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      formData.goal === g 
                        ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' 
                        : 'bg-zinc-100 dark:bg-black/20 border-zinc-200 dark:border-white/5 text-zinc-400 hover:border-purple-500/50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full mt-4 h-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-purple-500/30 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              <span className="relative z-10">Initialize iCtrl Protocol</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Card>
        <p className="mt-8 text-center text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.4em] leading-relaxed">
          iCtrl Biometrics Calibration Engine v4.2.5
        </p>
      </motion.div>
    </div>
  );
};

export default Onboarding;
