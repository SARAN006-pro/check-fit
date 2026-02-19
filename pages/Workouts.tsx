
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
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

// 1. PERFORMANCE LIBRARY
const EXERCISE_LIBRARY = [
  { id: 'ex1', name: 'Barbell Bench Press', muscle: 'Chest', difficulty: 'Expert', met: 6.0, icon: '🏋️' },
  { id: 'ex2', name: 'Incline Dumbbell Press', muscle: 'Chest', difficulty: 'Advanced', met: 5.5, icon: '💪' },
  { id: 'ex3', name: 'Pull Ups', muscle: 'Back', difficulty: 'Expert', met: 7.0, icon: '🧗' },
  { id: 'ex4', name: 'Seated Cable Row', muscle: 'Back', difficulty: 'Intermediate', met: 4.5, icon: '⛓️' },
  { id: 'ex5', name: 'Back Squat', muscle: 'Legs', difficulty: 'Expert', met: 8.5, icon: '🦵' },
  { id: 'ex6', name: 'Leg Extensions', muscle: 'Legs', difficulty: 'Beginner', met: 3.5, icon: '🦶' },
  { id: 'ex7', name: 'Military Press', muscle: 'Shoulders', difficulty: 'Expert', met: 6.5, icon: '⬆️' },
  { id: 'ex8', name: 'Deadlift', muscle: 'Back', difficulty: 'Expert', met: 9.0, icon: '💀' },
  { id: 'ex9', name: 'Bicep Curls', muscle: 'Arms', difficulty: 'Beginner', met: 3.0, icon: '💪' },
  { id: 'ex10', name: 'Tricep Pushdowns', muscle: 'Arms', difficulty: 'Beginner', met: 3.0, icon: '⬇️' },
  { id: 'ex11', name: 'Plank', muscle: 'Core', difficulty: 'Beginner', met: 4.0, icon: '🧘' },
  { id: 'ex12', name: 'Hanging Leg Raises', muscle: 'Core', difficulty: 'Advanced', met: 5.0, icon: '⚓' },
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
  
  // States: 'IDLE' | 'SELECTING' | 'ACTIVE' | 'RESTING' | 'SUMMARY'
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

  // SESSION CLOCK
  useEffect(() => {
    if (viewState === 'ACTIVE' || viewState === 'RESTING') {
      timerRef.current = window.setInterval(() => setElapsedSeconds(p => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [viewState]);

  // REST CLOCK
  useEffect(() => {
    if (viewState === 'RESTING' && restTimeLeft > 0) {
      restTimerRef.current = window.setInterval(() => setRestTimeLeft(p => p - 1), 1000);
    } else if (restTimeLeft === 0 && viewState === 'RESTING') {
      setViewState('ACTIVE');
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [viewState, restTimeLeft]);

  const totalKcal = useMemo(() => {
    let burn = (elapsedSeconds / 60) * 5; // Base burn
    activeSession.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed) {
          // Simplified metabolic calculation
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

    // Check PR
    if (field === 'completed' && value === true) {
      const set = newSession[exIdx].sets[setIdx];
      const existingPR = prs.find(p => p.exercise === newSession[exIdx].name);
      if (existingPR && set.weight > existingPR.value) {
        setSessionPRs(p => [...p, newSession[exIdx].name]);
      }
      // Auto-trigger rest
      setRestTimeLeft(restTime);
      setViewState('RESTING');
    }
  };

  const addSet = (exIdx: number) => {
    const newSession = [...activeSession];
    const lastSet = newSession[exIdx].sets[newSession[exIdx].sets.length - 1];
    newSession[exIdx].sets.push({ 
      id: Math.random().toString(), 
      weight: lastSet?.weight || 0, 
      reps: lastSet?.reps || 0, 
      completed: false 
    });
    setActiveSession(newSession);
  };

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2, '0')}`;

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
      setViewState('SUMMARY');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && viewState === 'IDLE') return <div className="h-screen bg-black flex items-center justify-center animate-pulse"><Zap className="text-brand-red w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-40 max-w-2xl mx-auto space-y-12 overflow-x-hidden relative">
      
      {/* 2. STATE: IDLE (Session Dashboard) */}
      {viewState === 'IDLE' && (
        <div className="space-y-10 animate-in fade-in duration-700">
          <Header title="Force Matrix" subtitle="Operational Readiness Hub" />
          
          <Card className="p-10 border-none bg-gradient-to-br from-brand-red/20 to-black text-white shadow-3xl relative overflow-hidden group">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Weekly Burn</p>
                <h2 className="text-7xl font-black tracking-tighter tabular-nums drop-shadow-2xl">4,280</h2>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-green" />
                  <span className="text-[11px] font-black text-brand-green uppercase">+12.4% vs Avg</span>
                </div>
              </div>
              <button 
                onClick={handleStartSession}
                className="w-24 h-24 bg-brand-red rounded-[32px] flex items-center justify-center shadow-[0_20px_50px_rgba(225,29,72,0.4)] hover:scale-105 active:scale-95 transition-all group"
              >
                <Play className="w-10 h-10 text-white fill-current group-hover:rotate-12 transition-transform" />
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

      {/* 3. STATE: SELECTING (Muscle Selection) */}
      {viewState === 'SELECTING' && (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-4">
             <button onClick={() => setViewState('IDLE')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center"><ChevronLeft /></button>
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
                  {EXERCISE_LIBRARY.filter(e => e.muscle === selectedMuscle).map(ex => (
                    <Card key={ex.id} onClick={() => addExerciseToSession(ex)} className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-brand-red group-hover:border-transparent transition-all">
                          {ex.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-black uppercase italic tracking-tight">{ex.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${ex.difficulty === 'Expert' ? 'bg-red-900/30 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                              {ex.difficulty}
                            </span>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Est. {Math.round(ex.met * 12)} kcal/set</span>
                          </div>
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

      {/* 4. STATE: ACTIVE (The Lifting Zone) */}
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
                <p className="text-xl font-black tabular-nums text-white">{formatTime(elapsedSeconds)}</p>
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
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-zinc-600 uppercase">Resistance (kg)</p>
                                <input 
                                  type="number" 
                                  value={set.weight || ''} 
                                  placeholder="00"
                                  onChange={(e) => updateSet(currentExerciseIdx, sIdx, 'weight', parseFloat(e.target.value))}
                                  className="w-full bg-transparent border-none text-2xl font-black text-white focus:outline-none placeholder:text-zinc-800"
                                />
                             </div>
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-zinc-600 uppercase">Rep Volume</p>
                                <input 
                                  type="number" 
                                  value={set.reps || ''} 
                                  placeholder="00"
                                  onChange={(e) => updateSet(currentExerciseIdx, sIdx, 'reps', parseInt(e.target.value))}
                                  className="w-full bg-transparent border-none text-2xl font-black text-white focus:outline-none placeholder:text-zinc-800"
                                />
                             </div>
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

               <Button fullWidth variant="secondary" onClick={() => addSet(currentExerciseIdx)} className="h-16 rounded-[28px] border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white mb-20">
                  <Plus className="w-5 h-5" /> APPEND SET SEQUENCE
               </Button>
            </MotionDiv>
          )}

          {/* Corrected Persistent Action Bar - Sticky to respect content column and sidebar */}
          <div className="sticky bottom-8 left-0 right-0 flex gap-4 z-40 bg-black/60 backdrop-blur-md p-2 rounded-[32px] border border-white/5 shadow-2xl mt-auto">
             <Button 
                variant="secondary" 
                onClick={() => setViewState('SELECTING')} 
                className="flex-1 h-16 rounded-[28px] bg-zinc-800 text-zinc-100 border-zinc-700 hover:bg-zinc-700 font-black"
             >
                NEW VECTOR
             </Button>
             <Button 
                onClick={finishSession} 
                className="flex-[2] h-16 rounded-[28px] bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-xl shadow-red-900/20 font-black"
             >
                TERMINATE PROTOCOL
             </Button>
          </div>
        </div>
      )}

      {/* 5. STATE: RESTING (Recovery Interface) */}
      <AnimatePresence>
        {viewState === 'RESTING' && (
          <MotionDiv 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] bg-brand-red flex flex-col items-center justify-center p-10 text-white"
          >
            <div className="absolute top-10 flex items-center gap-2">
               <Heart className="w-5 h-5 animate-heartbeat" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Recovery Phase Active</span>
            </div>

            <div className="relative w-72 h-72 flex items-center justify-center mb-12">
               <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                  <circle 
                    cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="4" 
                    strokeDasharray="301.6" strokeDashoffset={301.6 * (1 - restTimeLeft / restTime)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 linear"
                  />
               </svg>
               <h2 className="text-9xl font-black tracking-tighter tabular-nums drop-shadow-2xl">
                 {restTimeLeft}
               </h2>
            </div>

            <div className="text-center space-y-6">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase italic tracking-widest">Next Target</h3>
                  <p className="text-sm font-bold opacity-60 uppercase">{activeSession[currentExerciseIdx]?.name}</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setRestTimeLeft(0)} className="px-10 py-5 bg-white text-brand-red rounded-full font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all">
                    Skip Rest
                  </button>
                  <button onClick={() => setRestTimeLeft(p => p + 30)} className="px-10 py-5 bg-black/20 border border-white/20 text-white rounded-full font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
                    +30S
                  </button>
               </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* 6. STATE: SUMMARY (Post-Workout Analytics) */}
      {viewState === 'SUMMARY' && (
        <div className="space-y-10 animate-in fade-in duration-1000">
          <div className="text-center space-y-4">
             <div className="w-24 h-24 bg-brand-gold/10 rounded-[40px] border border-brand-gold/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(250,204,21,0.1)]">
                <Trophy className="w-12 h-12 text-brand-gold animate-bounce" />
             </div>
             <h2 className="text-5xl font-black tracking-tighter italic uppercase text-white">Execution Verified</h2>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Protocol Node 0xFF9 Logged</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <Card className="p-8 border-none bg-zinc-900 text-center space-y-2 group overflow-hidden relative">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest relative z-10">Energy Expenditure</p>
                <p className="text-5xl font-black text-brand-green tracking-tighter relative z-10 tabular-nums">{totalKcal}</p>
                <p className="text-[8px] font-bold text-brand-green relative z-10 uppercase">KCAL BURNT</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />
             </Card>
             <Card className="p-8 border-none bg-zinc-900 text-center space-y-2 group overflow-hidden relative">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest relative z-10">Tonnage Shifted</p>
                <p className="text-5xl font-black text-white tracking-tighter relative z-10 tabular-nums">{totalVolume.toLocaleString()}</p>
                <p className="text-[8px] font-bold text-zinc-500 relative z-10 uppercase">KG VOLUME</p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-3xl pointer-events-none" />
             </Card>
          </div>

          {sessionPRs.length > 0 && (
            <Card className="p-8 border-brand-gold/30 bg-brand-gold/5 flex items-center gap-6 animate-pulse">
               <Award className="w-10 h-10 text-brand-gold" />
               <div>
                  <h4 className="text-brand-gold font-black uppercase italic text-lg tracking-tight">Records Broken ({sessionPRs.length})</h4>
                  <p className="text-[10px] font-bold text-brand-gold/60 uppercase">{sessionPRs.join(', ')}</p>
               </div>
            </Card>
          )}

          <section className="space-y-6">
             <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Morphology Impact</h3>
             <Card className="p-8 border-zinc-800 bg-zinc-900/50">
                <div className="grid grid-cols-3 gap-y-10 gap-x-4">
                   {MUSCLE_GROUPS.map(muscle => {
                     const worked = activeSession.some(ex => ex.muscle === muscle);
                     return (
                       <div key={muscle} className="flex flex-col items-center gap-3">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${worked ? 'bg-brand-red border-brand-red shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-110' : 'bg-zinc-800 border-zinc-700 opacity-30'}`}>
                             <Target className={`w-6 h-6 ${worked ? 'text-white' : 'text-zinc-500'}`} />
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${worked ? 'text-white' : 'text-zinc-700'}`}>{muscle}</span>
                       </div>
                     );
                   })}
                </div>
             </Card>
          </section>

          <Button fullWidth onClick={() => navigate('/')} className="h-20 rounded-[40px] bg-zinc-100 text-zinc-950 text-base font-black uppercase tracking-[0.3em] shadow-3xl group">
             Synchronize & Return Home
             <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      )}

      <div className="pt-20 text-center opacity-10 border-t border-zinc-900">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[1em]">
          ADAPT OR EXPIRE
        </p>
      </div>
    </div>
  );
};

export default Workouts;
