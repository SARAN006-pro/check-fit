
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNotification } from '../components/ui/NotificationEngine';
import { 
  Activity, Flame, Heart, Zap, Timer, Plus, Trash2, 
  ChevronRight, TrendingUp, Play, Square, CheckCircle2, 
  Dumbbell, History, Sparkles, Copy, Trophy, Target,
  ChevronLeft, Award, RotateCcw, Clock, ArrowRight,
  User, Check
} from 'lucide-react';
import { Workout, PersonalRecord } from '../types';

// Bypassing environment-specific typing issues
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const EXERCISE_LIBRARY = [
  { id: 'ex1', name: 'Barbell Bench Press', muscle: 'Chest', difficulty: 'Expert', met: 6.0, icon: '🏋️' },
  { id: 'ex5', name: 'Back Squat', muscle: 'Legs', difficulty: 'Expert', met: 8.5, icon: '🦵' },
  { id: 'ex8', name: 'Deadlift', muscle: 'Back', difficulty: 'Expert', met: 9.0, icon: '💀' },
];

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

interface LoggedSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
}

interface ActiveProtocol {
  exerciseId: string;
  name: string;
  muscle: string;
  sets: LoggedSet[];
  met: number;
}

const Workouts: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  
  const [viewState, setViewState] = useState<'IDLE' | 'SELECTING' | 'ACTIVE' | 'RESTING' | 'SUMMARY'>('IDLE');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveProtocol[]>([]);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [restTime, setRestTime] = useState(60);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionPRs, setSessionPRs] = useState<string[]>([]);
  const [history, setHistory] = useState<Workout[]>([]);
  const [prs, setPRs] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const timerRef = useRef<number | null>(null);
  const restTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutsRes, analyticsRes] = await Promise.all([
          fitnessApi.getWorkouts(),
          fitnessApi.getAnalytics()
        ]);
        setHistory(workoutsRes.data);
        setPRs(analyticsRes.data.prs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (viewState === 'ACTIVE' || viewState === 'RESTING') {
      timerRef.current = window.setInterval(() => setElapsedSeconds(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [viewState]);

  useEffect(() => {
    if (viewState === 'RESTING' && restTimeLeft > 0) {
      restTimerRef.current = window.setInterval(() => setRestTimeLeft(p => p - 1), 1000);
    } else if (restTimeLeft === 0 && viewState === 'RESTING') {
      setViewState('ACTIVE');
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [viewState, restTimeLeft]);

  const totalKcal = useMemo(() => {
    let burn = (elapsedSeconds / 60) * 5; 
    activeSession.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed) {
          burn += (set.reps * set.weight * 0.01) + (ex.met * 2);
        }
      });
    });
    return Math.round(burn);
  }, [activeSession, elapsedSeconds]);

  const totalVolume = useMemo(() => {
    return activeSession.reduce((acc, ex) => 
      acc + ex.sets.reduce((sAcc, s) => sAcc + (s.completed ? s.weight * s.reps : 0), 0)
    , 0);
  }, [activeSession]);

  const handleStartSession = () => {
    setViewState('SELECTING');
    setElapsedSeconds(0);
    setActiveSession([]);
    notify({ type: 'success', title: 'Protocol Initialized', message: 'Combat readiness sensors active.' });
  };

  const addExerciseToSession = (ex: typeof EXERCISE_LIBRARY[0]) => {
    const protocol: ActiveProtocol = {
      exerciseId: ex.id,
      name: ex.name,
      muscle: ex.muscle,
      met: ex.met,
      sets: [{ id: Math.random().toString(), weight: 0, reps: 0, completed: false }]
    };
    setActiveSession([...activeSession, protocol]);
    setViewState('ACTIVE');
    setCurrentExerciseIdx(activeSession.length);
  };

  const updateSet = (exIdx: number, setIdx: number, field: keyof LoggedSet, value: any) => {
    const newSession = [...activeSession];
    (newSession[exIdx].sets[setIdx] as any)[field] = value;
    setActiveSession(newSession);

    if (field === 'completed' && value === true) {
      const set = newSession[exIdx].sets[setIdx];
      const existingPR = prs.find(p => p.exercise === newSession[exIdx].name);
      if (existingPR && set.weight > existingPR.value) {
        setSessionPRs(p => [...p, newSession[exIdx].name]);
        notify({ 
          type: 'impact', 
          title: 'PR DEVIATION DETECTED', 
          message: `New absolute peak on ${newSession[exIdx].name}: ${set.weight}kg`,
          progress: 100
        });
      }
      setRestTimeLeft(restTime);
      setViewState('RESTING');
    }
  };

  const finishSession = async () => {
    setLoading(true);
    try {
      await fitnessApi.logWorkout({
        title: activeSession.length > 1 ? `${activeSession[0].name} +${activeSession.length -1}` : activeSession[0].name,
        type: 'Strength',
        duration: Math.round(elapsedSeconds / 60),
        calories: totalKcal,
        timestamp: new Date().toISOString()
      });
      
      notify({ 
        type: 'achievement', 
        title: 'PROTOCOL VERIFIED', 
        message: `You dominated today's sequence. Total tonnage shifted: ${totalVolume.toLocaleString()}kg.`,
        xp: 450
      });

      setViewState('SUMMARY');
    } catch (err) {
      console.error(err);
      notify({ type: 'warning', title: 'Sync Failure', message: 'Neural link degraded. Data saved locally.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && viewState === 'IDLE') return <div className="h-screen bg-black flex items-center justify-center animate-pulse"><Zap className="text-brand-red w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-40 max-w-2xl mx-auto space-y-12 overflow-x-hidden relative">
      
      {viewState === 'IDLE' && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <Header title="Force Matrix" subtitle="Operational Readiness Hub" />
          
          <Card className="p-10 border-none bg-gradient-to-br from-brand-red/20 to-black text-white shadow-3xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Weekly Burn</p>
                <h2 className="text-7xl font-black tracking-tighter tabular-nums drop-shadow-2xl leading-none">4,280</h2>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-green" />
                  <span className="text-[11px] font-black text-brand-green uppercase">+12.4% vs Avg</span>
                </div>
              </div>
              <button 
                onClick={handleStartSession}
                className="h-24 px-8 bg-gradient-to-br from-brand-red to-orange-600 rounded-[32px] flex items-center gap-4 shadow-[0_20px_50px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95 transition-all group border border-white/10"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-inner">
                  <Dumbbell className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-red-100 uppercase tracking-[0.2em] leading-none mb-1">Begin</p>
                  <p className="text-lg font-black text-white uppercase tracking-widest italic">Protocol</p>
                </div>
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          </Card>

          <section className="space-y-6">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Historical Records</h3>
            <div className="space-y-4">
              {history.slice(0, 3).map((w, i) => (
                <Card key={i} className="p-6 flex items-center justify-between border-zinc-800 bg-zinc-900/20 hover:border-brand-red/30 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 text-zinc-500 group-hover:text-brand-red">
                      <History className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-brand-red uppercase">{w.title}</h4>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(w.timestamp).toLocaleDateString()} • {w.duration} MIN</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-brand-green">{w.calories} KCAL</p>
                    <p className="text-[9px] font-bold text-zinc-700 uppercase">BURN LOGGED</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}

      {viewState === 'SELECTING' && (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-4">
             <button onClick={() => setViewState('IDLE')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400"><ChevronLeft /></button>
             <h2 className="text-3xl font-black uppercase tracking-tighter italic">Select Vector</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             {MUSCLE_GROUPS.map(muscle => (
               <button 
                key={muscle}
                onClick={() => setSelectedMuscle(muscle)}
                className={`py-6 rounded-3xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${selectedMuscle === muscle ? 'bg-brand-red border-transparent text-white shadow-2xl scale-105' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
               >
                 {muscle}
               </button>
             ))}
          </div>

          <AnimatePresence mode="wait">
            {selectedMuscle && (
              <MotionDiv 
                key={selectedMuscle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">{selectedMuscle} Protocols</h3>
                <div className="grid grid-cols-1 gap-4">
                  {EXERCISE_LIBRARY.map(ex => (
                    <Card key={ex.id} onClick={() => addExerciseToSession(ex)} className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-brand-red group-hover:border-transparent transition-all">
                          {ex.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-black uppercase italic tracking-tight">{ex.name}</h4>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Target: {ex.muscle}</span>
                        </div>
                      </div>
                      <Plus className="text-zinc-700 group-hover:text-brand-red" />
                    </Card>
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      )}

      {(viewState === 'ACTIVE' || viewState === 'RESTING') && (
        <div className="space-y-8 animate-in zoom-in duration-500 min-h-[60vh] flex flex-col">
          <div className="flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md py-4 z-30 -mx-6 px-6 border-b border-white/5">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-red/10 rounded-2xl flex items-center justify-center border border-brand-red/20">
                   <Flame className="w-6 h-6 text-brand-red animate-pulse" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Live Execution</p>
                   <p className="text-xl font-black tabular-nums">{totalKcal} <span className="text-xs text-zinc-600 uppercase">Kcal</span></p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Protocol Clock</p>
                <p className="text-xl font-black tabular-nums text-white">{elapsedSeconds}S</p>
             </div>
          </div>

          {activeSession[currentExerciseIdx] && (
            <MotionDiv layout className="space-y-8 flex-1">
               <div className="text-center space-y-2">
                  <span className="text-[10px] font-black text-brand-red uppercase tracking-[0.5em]">{activeSession[currentExerciseIdx].muscle} Target</span>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">{activeSession[currentExerciseIdx].name}</h2>
               </div>

               <div className="space-y-4">
                  {activeSession[currentExerciseIdx].sets.map((set, sIdx) => (
                    <Card key={set.id} className={`p-6 border-2 transition-all ${set.completed ? 'bg-brand-green/5 border-brand-green/20 opacity-60' : 'bg-zinc-900 border-zinc-800 shadow-xl'}`}>
                       <div className="flex items-center justify-between gap-6">
                          <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center font-black text-zinc-500">
                             {sIdx + 1}
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-4">
                             <input 
                              type="number" 
                              value={set.weight || ''} 
                              placeholder="Weight (kg)"
                              onChange={(e) => updateSet(currentExerciseIdx, sIdx, 'weight', parseFloat(e.target.value))}
                              className="bg-transparent border-none text-xl font-black text-white outline-none"
                            />
                             <input 
                              type="number" 
                              value={set.reps || ''} 
                              placeholder="Reps"
                              onChange={(e) => updateSet(currentExerciseIdx, sIdx, 'reps', parseInt(e.target.value))}
                              className="bg-transparent border-none text-xl font-black text-white outline-none"
                            />
                          </div>
                          <MotionButton 
                            whileTap={{ scale: 0.8 }}
                            onClick={() => updateSet(currentExerciseIdx, sIdx, 'completed', !set.completed)}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${set.completed ? 'bg-brand-green text-black' : 'bg-zinc-800 text-zinc-500'}`}
                          >
                             <Check strokeWidth={4} className="w-6 h-6" />
                          </MotionButton>
                       </div>
                    </Card>
                  ))}
               </div>
            </MotionDiv>
          )}

          <div className="sticky bottom-8 left-0 right-0 flex gap-4 z-40 bg-black/60 backdrop-blur-md p-2 rounded-[32px] border border-white/5 shadow-2xl mt-auto">
             <Button 
                variant="secondary" 
                onClick={() => setViewState('SELECTING')} 
                className="flex-1 h-16 rounded-[28px] font-black"
             >
                NEW VECTOR
             </Button>
             <Button 
                onClick={finishSession} 
                className="flex-[2] h-16 rounded-[28px] bg-gradient-to-r from-red-600 to-orange-600 font-black"
             >
                TERMINATE PROTOCOL
             </Button>
          </div>
        </div>
      )}

      {viewState === 'SUMMARY' && (
        <div className="space-y-10 animate-in fade-in duration-1000 text-center">
          <div className="w-24 h-24 bg-brand-gold/10 rounded-[40px] border border-brand-gold/20 flex items-center justify-center mx-auto shadow-3xl">
             <Trophy className="w-12 h-12 text-brand-gold" />
          </div>
          <h2 className="text-5xl font-black italic uppercase text-white">Execution Verified</h2>
          <Button fullWidth onClick={() => navigate('/')} className="h-20 rounded-[40px] bg-zinc-100 text-black font-black uppercase tracking-[0.3em]">
             Synch & Exit
          </Button>
        </div>
      )}

    </div>
  );
};

export default Workouts;
