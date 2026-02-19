
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fitnessApi } from '../api/axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import { 
  Play, 
  Pause, 
  Square, 
  Navigation, 
  Activity, 
  Clock, 
  MapPin, 
  TrendingUp, 
  ChevronLeft,
  Share2,
  Mountain,
  Heart,
  Zap,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { ActivityData } from '../types';

const ActivityTracking: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distance, setDistance] = useState(0);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fitnessApi.getActivity();
        setActivity(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        setDistance(prev => prev + 0.002); // Mock distance accumulation
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    setIsActive(false);
    setIsFinished(true);
  };

  if (loading) return <div className="p-12 animate-pulse bg-zinc-50 h-screen" />;

  // SUMMARY VIEW
  if (isFinished && activity) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] p-6 pb-32 animate-in fade-in duration-700">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-black uppercase tracking-[0.3em]">Session Recapitulation</h1>
            <button className="w-10 h-10 rounded-full bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 w-2 h-2 rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Cardio Protocol Completed</p>
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">Afternoon River Velocity</h2>
            <p className="text-zinc-500 font-medium">May 12, 2024 • Brooklyn, NY</p>
          </div>

          {/* GPS Route Map Simulation */}
          <Card className="p-0 h-64 border-none bg-zinc-900 overflow-hidden relative shadow-3xl group">
             {/* Styled SVG Map Placeholder */}
             <svg className="w-full h-full opacity-40" viewBox="0 0 400 200">
                <path d="M50 150 Q 100 80, 150 120 T 250 100 T 350 140" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" className="animate-[draw_2s_ease-out_forwards]" />
                <circle cx="50" cy="150" r="5" fill="#3B82F6" />
                <circle cx="350" cy="140" r="8" fill="#F97316" className="animate-pulse" />
             </svg>
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
             <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg backdrop-blur-md flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest">Trace Verified</span>
             </div>
             <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-full backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
             </button>
          </Card>

          {/* Primary Distance Stats */}
          <div className="grid grid-cols-3 gap-4">
             <Card className="p-6 border-none bg-white shadow-premium text-center space-y-2">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Distance</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black tracking-tight">{activity.distance}</span>
                  <span className="text-[10px] font-bold text-zinc-400">KM</span>
                </div>
             </Card>
             <Card className="p-6 border-none bg-white shadow-premium text-center space-y-2">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Avg Pace</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black tracking-tight">{activity.pace}</span>
                  <span className="text-[10px] font-bold text-zinc-400">/KM</span>
                </div>
             </Card>
             <Card className="p-6 border-none bg-white shadow-premium text-center space-y-2">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Elev Gain</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black tracking-tight">{activity.elevation}</span>
                  <span className="text-[10px] font-bold text-zinc-400">M</span>
                </div>
             </Card>
          </div>

          {/* Pace Graph */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 px-1">
                <TrendingUp className="w-4 h-4 text-zinc-900" />
                <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Velocity Gradient</h2>
             </div>
             <Card className="h-64 p-6 border-none bg-white shadow-premium">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activity.paceHistory}>
                    <defs>
                      <linearGradient id="paceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pace" 
                      stroke="#3B82F6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#paceGrad)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </Card>
          </section>

          {/* Secondary Health Data */}
          <div className="grid grid-cols-2 gap-4">
             <Card className="p-6 border-none bg-zinc-900 text-white flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Avg Heart Rate</p>
                  <p className="text-xl font-black">162 <span className="text-[10px] text-zinc-600">BPM</span></p>
                </div>
             </Card>
             <Card className="p-6 border-none bg-white shadow-premium flex items-center gap-4 group">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Intensity Index</p>
                  <p className="text-xl font-black">8.4 <span className="text-[10px] text-zinc-400">RPE</span></p>
                </div>
             </Card>
          </div>

          <Button fullWidth onClick={() => navigate('/')} className="h-16 rounded-[24px] uppercase tracking-[0.2em] font-black text-sm shadow-xl shadow-zinc-200">
            Commit to Protocol History
          </Button>
        </div>
      </div>
    );
  }

  // LIVE VIEW
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6 flex flex-col items-center justify-between">
      <div className="w-full max-w-2xl flex items-center justify-between">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Live Pulse Tracking</span>
          <div className="flex items-center gap-1.5 mt-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">GPS Signal High</span>
          </div>
        </div>
        <div className="w-10 h-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 py-12">
        <div className="space-y-4">
           <p className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-600">Accumulated Distance</p>
           <h2 className="text-9xl font-black tracking-tighter leading-none tabular-nums italic">
             {distance.toFixed(2)}
           </h2>
           <p className="text-2xl font-bold text-blue-500 uppercase tracking-[0.2em]">KILOMETERS</p>
        </div>

        <div className="grid grid-cols-2 gap-16 w-full max-w-sm">
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Temporal State</p>
              <p className="text-5xl font-black tabular-nums">{formatTime(elapsedSeconds)}</p>
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Current Velocity</p>
              <p className="text-5xl font-black tabular-nums">5:12</p>
           </div>
        </div>
      </div>

      {/* Control Module */}
      <div className="w-full max-w-md pb-12">
        <div className="flex items-center justify-between gap-6">
           <button 
             onClick={() => setIsActive(!isActive)}
             className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-zinc-800 text-white border border-white/10' : 'bg-blue-600 text-white shadow-[0_0_40px_rgba(59,130,246,0.4)] animate-bounce'}`}
           >
             {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
           </button>

           <div className="flex-1 bg-white/5 backdrop-blur-md rounded-[40px] h-20 border border-white/5 p-2 flex items-center gap-2">
              <div className="w-16 h-full bg-white/5 rounded-[32px] flex items-center justify-center">
                 <Navigation className="w-5 h-5 text-blue-400" />
              </div>
              <p className="flex-1 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">Slide to end protocol</p>
              <button 
                onClick={handleFinish}
                className="w-16 h-full bg-white text-zinc-900 rounded-[32px] flex items-center justify-center shadow-xl active:scale-95 transition-all"
              >
                <Square className="w-6 h-6 fill-current" />
              </button>
           </div>
        </div>
      </div>

      {/* Mini Activity Map HUD */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 space-y-4">
         <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-md">
            <MapPin className="w-5 h-5 text-zinc-400" />
         </div>
         <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center backdrop-blur-md">
            <Mountain className="w-5 h-5 text-zinc-400" />
         </div>
      </div>
    </div>
  );
};

export default ActivityTracking;
