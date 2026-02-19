
import React, { useState, useEffect } from 'react';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { 
  Target, 
  Scale, 
  Dumbbell, 
  Zap, 
  Plus, 
  ChevronRight, 
  Trophy, 
  TrendingUp,
  Clock,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Goal } from '../types';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const res = await fitnessApi.getGoals();
        setGoals(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  if (loading) return <div className="p-8 animate-pulse max-w-2xl mx-auto space-y-6"><div className="h-64 bg-zinc-100 rounded-[32px]" /></div>;

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Header title="Goal Intelligence" subtitle="Configure performance baselines and synchronize growth targets." />

      {/* Goal Summary Hero */}
      <Card className="p-10 border-none bg-zinc-900 text-white overflow-hidden relative shadow-3xl">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Active Prototypes</span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter leading-none">{goals.length}</h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Synchronized across all nodes</p>
          </div>
          <button 
            onClick={() => setShowAdd(true)}
            className="w-20 h-20 bg-blue-600 rounded-[28px] shadow-2xl shadow-blue-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-8 h-8 text-white" strokeWidth={3} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
      </Card>

      {/* Goals Feed */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
           <Shield className="w-4 h-4 text-zinc-900" />
           <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Protocol Ledger</h2>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round(((goal.currentValue - goal.startValue) / (goal.targetValue - goal.startValue)) * 100));
            return (
              <Card key={goal.id} className="p-8 border-zinc-100 group hover:border-zinc-900 transition-all shadow-premium overflow-hidden relative">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Module: {goal.type}</p>
                      <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{goal.title}</h3>
                    </div>
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      {goal.type === 'weight' ? <Scale className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black tabular-nums">{goal.currentValue}</span>
                       <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{goal.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                       <span className="text-[10px] font-black uppercase">Goal</span>
                       <ArrowRight className="w-3 h-3" />
                       <span className="text-sm font-black text-zinc-900">{goal.targetValue}</span>
                    </div>
                  </div>

                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-zinc-900 transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{progress}% Processed</span>
                    <span className="text-[9px] font-black text-zinc-300 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Target: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {/* Visual Accent */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-zinc-50 rounded-full -mr-12 -mb-12 group-hover:bg-zinc-100 transition-all" />
              </Card>
            );
          })}
        </div>
      </section>

      <div className="pt-10 text-center">
         <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] hover:text-zinc-900 transition-colors">
           Archive Completed Sequences
         </button>
      </div>
    </div>
  );
};

export default Goals;
