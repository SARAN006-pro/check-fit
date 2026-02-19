
import React, { useState, useEffect, useMemo } from 'react';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNotification } from '../components/ui/NotificationEngine';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Zap, 
  Activity, 
  Clock, 
  Plus,
  ArrowUpRight,
  TrendingUp,
  Target,
  Sparkles,
  RefreshCw,
  Moon
} from 'lucide-react';
import { PlannerTask, DailyPlan } from '../types';

const Planner: React.FC = () => {
  const { notify } = useNotification();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Generate a week of dates around the current selected date
  const weekDates = useMemo(() => {
    const dates = [];
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 3);
    
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(current).toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [selectedDate]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await fitnessApi.getPlanner(selectedDate);
      setPlan(res.data);
    } catch (err) {
      console.error("Failed to load protocol plan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, [selectedDate]);

  const handleGenerateSmartPlan = async () => {
    setGenerating(true);
    try {
      const res = await fitnessApi.generateSmartPlan(selectedDate);
      setPlan(res.data);
      notify({ 
        type: 'success', 
        title: 'Protocol Generated', 
        message: 'AI logic has synthesized your daily tasks.' 
      });
    } catch (err) {
      console.error(err);
      notify({ 
        type: 'warning', 
        title: 'Neural Sync Error', 
        message: 'Smart sequence synthesis failed.' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!plan) return;
    
    const targetTask = plan.tasks.find(t => t.id === taskId);
    const updatedTasks = plan.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setPlan({ ...plan, tasks: updatedTasks });

    try {
      await fitnessApi.toggleTask(taskId);
      if (targetTask && !targetTask.completed) {
        notify({ 
          type: 'success', 
          title: 'Objective Verified', 
          message: `${targetTask.title} has been logged.` 
        });
      }
    } catch (err) {
      console.error(err);
      fetchPlan();
    }
  };

  const progress = useMemo(() => {
    if (!plan || plan.tasks.length === 0) return 0;
    const completed = plan.tasks.filter(t => t.completed).length;
    return Math.round((completed / plan.tasks.length) * 100);
  }, [plan]);

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      dayName: d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase(),
      dayNum: d.getDate()
    };
  };

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Header title="Daily Protocol" subtitle="Sequence your performance tasks and maintain habit velocity." />

      {/* Modern Calendar Navigation */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-zinc-900 dark:text-white" />
            <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Temporal Navigation</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2">
          {weekDates.map((date) => {
            const { dayName, dayNum } = formatDateLabel(date);
            const isSelected = date === selectedDate;
            const isToday = date === new Date().toISOString().split('T')[0];

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-1 py-4 px-2 rounded-[24px] flex flex-col items-center gap-2 transition-all group ${
                  isSelected 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-2xl scale-105 z-10' 
                    : 'bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-50 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
              >
                <span className={`text-[9px] font-black tracking-widest ${isSelected ? 'text-zinc-500' : 'text-zinc-300 group-hover:text-zinc-400'}`}>
                  {dayName}
                </span>
                <span className={`text-lg font-black tracking-tighter ${isSelected ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>
                  {dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Rest Day Module Override */}
      {plan?.isRestDay && (
        <Card className="p-10 border-none bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200 flex flex-col items-center text-center gap-6 animate-in zoom-in duration-500 shadow-premium">
           <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-[28px] shadow-xl flex items-center justify-center text-blue-600">
             <Moon className="w-10 h-10 fill-current" />
           </div>
           <div className="space-y-2">
             <h3 className="text-2xl font-black tracking-tight">Active Recovery Phase</h3>
             <p className="text-sm font-medium opacity-80 leading-relaxed max-w-sm">
               System intelligence suggests a rest period today based on your heart rate variability delta. Maintain light movement.
             </p>
           </div>
           <button className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-xl">Manual Override</button>
        </Card>
      )}

      {/* Smart Generator Hook */}
      {!loading && !plan?.tasks.length && !plan?.isRestDay && (
        <div className="py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-6">
           <div className="w-20 h-20 bg-zinc-900 dark:bg-white rounded-[32px] mx-auto flex items-center justify-center shadow-3xl text-white dark:text-black">
             <Sparkles className="w-10 h-10" />
           </div>
           <div className="space-y-2">
             <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">System Brain Standby</h3>
             <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Protocol needs initialization.</p>
           </div>
           <Button loading={generating} onClick={handleGenerateSmartPlan} className="h-16 px-10 rounded-[28px] shadow-xl shadow-zinc-200">
             <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} /> Initialize Smart Schedule
           </Button>
        </div>
      )}

      {/* Protocol Todo List */}
      {plan && plan.tasks.length > 0 && !plan.isRestDay && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-zinc-900 dark:text-white" />
              <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Protocol Execution</h2>
            </div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Efficiency: {progress}%</span>
          </div>

          <div className="space-y-3">
            {plan.tasks.map((task) => (
              <Card 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`p-5 flex items-center gap-5 transition-all duration-300 border-zinc-100 dark:border-zinc-800 group ${
                  task.completed ? 'bg-zinc-50 dark:bg-white/5 border-transparent opacity-60 scale-[0.98]' : 'bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className={`shrink-0 transition-all duration-500 ${task.completed ? 'text-green-500 scale-110' : 'text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white'}`}>
                  {task.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" strokeWidth={1.5} />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className={`text-sm font-black tracking-tight transition-all ${task.completed ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-white'}`}>
                      {task.title}
                    </h4>
                    {task.scheduledTime && (
                       <span className="text-[9px] font-bold text-zinc-300 dark:text-zinc-600 uppercase">{task.scheduledTime} T</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                      <Activity className="w-3 h-3" /> {task.sets} Sets • {task.reps}
                    </div>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      task.category === 'Strength' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                      task.category === 'Nutrition' ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' :
                      'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}>
                      {task.category}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Planner;
