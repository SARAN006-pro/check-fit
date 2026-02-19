
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings2, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Flame, 
  Timer as TimerIcon, 
  Zap, 
  History,
  SkipForward,
  Trophy,
  Dumbbell
} from 'lucide-react';

const Timer: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'HIIT' | 'REST'>('HIIT');
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40); // Initial work time
  const [currentRound, setCurrentRound] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings
  const [workTime, setWorkTime] = useState(40);
  const [restTime, setRestTime] = useState(20);
  const [totalRounds, setTotalRounds] = useState(8);

  const timerRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Audio Logic
  const playBeep = useCallback((freq: number, duration: number) => {
    if (isMuted) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + duration);
  }, [isMuted]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (timeLeft <= 4 && timeLeft > 1) {
          playBeep(440, 0.1);
        } else if (timeLeft === 1) {
          playBeep(880, 0.3);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'HIIT') {
        if (!isResting) {
          setIsResting(true);
          setTimeLeft(restTime);
        } else {
          if (currentRound < totalRounds) {
            setIsResting(false);
            setCurrentRound(prev => prev + 1);
            setTimeLeft(workTime);
          } else {
            setIsActive(false);
            playBeep(1200, 0.5);
          }
        }
      } else {
        setIsActive(false);
        playBeep(1200, 0.5);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, isResting, mode, workTime, restTime, currentRound, totalRounds, playBeep]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsResting(false);
    setCurrentRound(1);
    setTimeLeft(mode === 'HIIT' ? workTime : restTime);
  };

  const progress = timeLeft / (isResting ? restTime : workTime);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col ${
      isActive 
        ? isResting ? 'bg-amber-500' : 'bg-blue-600' 
        : 'bg-[#F9FAFB]'
    }`}>
      <div className={`p-6 ${isActive ? 'text-white' : 'text-zinc-900'}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-white/10' : 'bg-white border border-zinc-100 shadow-sm'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-sm font-black uppercase tracking-[0.3em]">
              {mode === 'HIIT' ? 'Interval Protocol' : 'Rest Module'}
            </h1>
            {mode === 'HIIT' && (
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isActive ? 'text-white/60' : 'text-zinc-400'}`}>
                Round {currentRound} of {totalRounds}
              </p>
            )}
          </div>

          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-white/10' : 'bg-white border border-zinc-100 shadow-sm'}`}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full">
        {/* Main Countdown Display */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center mb-12">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke={isActive ? 'rgba(255,255,255,0.1)' : '#F1F5F9'} 
              strokeWidth="4" 
            />
            <circle 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke={isActive ? '#FFFFFF' : mode === 'HIIT' ? '#3B82F6' : '#F59E0B'} 
              strokeWidth="4" 
              strokeDasharray="289" 
              strokeDashoffset={289 * progress}
              strokeLinecap="round"
              className="transition-all duration-1000 linear"
            />
          </svg>
          
          <div className="z-10 animate-in zoom-in duration-500">
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 ${isActive ? 'text-white/60' : 'text-zinc-400'}`}>
              {isResting ? 'Recovery' : isActive ? 'Execute' : 'Ready'}
            </p>
            <h2 className={`text-8xl md:text-9xl font-black tracking-tighter tabular-nums leading-none ${isActive ? 'text-white' : 'text-zinc-900'}`}>
              {formatTime(timeLeft)}
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-md items-center">
          <button 
            onClick={resetTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all ${
              isActive ? 'bg-white/10 text-white' : 'bg-white text-zinc-400 shadow-xl border border-zinc-100'
            }`}
          >
            <RotateCcw className="w-6 h-6" />
          </button>

          <button 
            onClick={toggleTimer}
            className={`w-24 h-24 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl transition-all scale-110 active:scale-95 ${
              isActive 
                ? 'bg-white text-zinc-900' 
                : mode === 'HIIT' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-2" />}
          </button>

          <button 
            onClick={() => setShowSettings(true)}
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all ${
              isActive ? 'bg-white/10 text-white' : 'bg-white text-zinc-400 shadow-xl border border-zinc-100'
            }`}
          >
            <Settings2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      {!isActive && (
        <div className="p-10 animate-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-md mx-auto flex p-1.5 bg-zinc-100 rounded-[32px] shadow-inner">
            <button 
              onClick={() => { setMode('HIIT'); setTimeLeft(workTime); }}
              className={`flex-1 py-4 rounded-[26px] flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                mode === 'HIIT' ? 'bg-white text-blue-600 shadow-xl' : 'text-zinc-400'
              }`}
            >
              <Zap className="w-4 h-4" /> HIIT
            </button>
            <button 
              onClick={() => { setMode('REST'); setTimeLeft(restTime); }}
              className={`flex-1 py-4 rounded-[26px] flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${
                mode === 'REST' ? 'bg-white text-amber-600 shadow-xl' : 'text-zinc-400'
              }`}
            >
              <TimerIcon className="w-4 h-4" /> Rest
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <Card className="relative w-full max-w-sm bg-white p-8 rounded-[40px] shadow-3xl animate-in zoom-in duration-300">
            <h2 className="text-2xl font-black tracking-tight mb-8">Protocol Config</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span>Work Duration</span>
                  <span>{workTime}s</span>
                </div>
                <input 
                  type="range" min="5" max="300" step="5" value={workTime}
                  onChange={(e) => setWorkTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-100 rounded-full appearance-none accent-zinc-900"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span>Recovery Interval</span>
                  <span>{restTime}s</span>
                </div>
                <input 
                  type="range" min="5" max="300" step="5" value={restTime}
                  onChange={(e) => setRestTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-100 rounded-full appearance-none accent-zinc-900"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span>Total Cycles</span>
                  <span>{totalRounds} Rounds</span>
                </div>
                <input 
                  type="range" min="1" max="30" value={totalRounds}
                  onChange={(e) => setTotalRounds(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-100 rounded-full appearance-none accent-zinc-900"
                />
              </div>
            </div>

            <Button fullWidth onClick={() => { setShowSettings(false); resetTimer(); }} className="mt-10 h-14 uppercase tracking-widest font-black text-xs">
              Apply Protocol
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Timer;
