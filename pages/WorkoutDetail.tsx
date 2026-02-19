
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import StatBlock from '../components/ui/StatBlock';
import { 
  ChevronLeft, 
  Clock, 
  Flame, 
  Dumbbell, 
  Activity, 
  History, 
  TrendingUp,
  Target,
  Zap,
  Calendar,
  Share2,
  Leaf,
  Timer,
  ArrowUpRight,
  Scale,
  Trash2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Workout } from '../types';

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<any>(null);
  const [history, setHistory] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const workoutsRes = await fitnessApi.getWorkouts();
        const found = workoutsRes.data.find((w: Workout) => w.id === id);
        
        if (found) {
          setWorkout(found);
          // Find all workouts with the same title for historical comparison
          const sameType = workoutsRes.data.filter((w: Workout) => 
            w.title.toLowerCase() === found.title.toLowerCase()
          );
          setHistory(sameType.sort((a: Workout, b: Workout) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          ));
        }
      } catch (err) {
        console.error("Failed to fetch session detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!workout || !confirm('Are you sure you want to delete this workout log?')) return;
    try {
      await fitnessApi.deleteWorkout(workout.id);
      navigate('/workouts');
    } catch (err) {
      console.error("Failed to delete workout:", err);
    }
  };

  const chartData = useMemo(() => {
    return history.map(w => ({
      date: new Date(w.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      val: w.type === 'Strength' ? parseFloat(w.metadata?.weight || '0') : w.calories,
      raw: w
    }));
  }, [history]);

  const renderWorkoutIcon = (type: string, className: string) => {
    switch (type) {
      case 'Strength': return <Dumbbell className={className} />;
      case 'Cardio': return <Activity className={className} />;
      case 'Yoga': return <Leaf className={className} />;
      case 'HIIT': return <Zap className={className} />;
      default: return <Timer className={className} />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-32 bg-zinc-100 rounded-xl" />
        <div className="h-64 bg-zinc-100 rounded-[32px]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-zinc-100 rounded-[24px]" />
          <div className="h-32 bg-zinc-100 rounded-[24px]" />
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-zinc-400 font-bold uppercase tracking-widest">Protocol Entry Missing</p>
        <button onClick={() => navigate(-1)} className="text-zinc-900 font-black text-xs uppercase tracking-widest underline">Return to safety</button>
      </div>
    );
  }

  const isStrength = workout.type === 'Strength';

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Detail Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:-translate-x-1 transition-transform bg-white shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Protocol Ledger</span>
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete}
            className="w-10 h-10 rounded-full border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors bg-white shadow-sm"
            title="Delete Protocol"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors bg-white shadow-sm">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-zinc-900 text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-zinc-200 ring-4 ring-white">
            {renderWorkoutIcon(workout.type, "w-10 h-10")}
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-none">{workout.title}</h1>
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(workout.timestamp).toLocaleDateString(undefined, { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Progress Chart Module */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-zinc-900" />
            <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Performance Analysis</h2>
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {isStrength ? 'Load (kg)' : 'Energy (kcal)'} vs Time
          </span>
        </div>
        <Card className="h-64 p-6 border-zinc-100 bg-white overflow-hidden shadow-premium">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-zinc-900 text-white p-3 rounded-2xl shadow-2xl border border-white/10">
                        <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">{payload[0].payload.date}</p>
                        <p className="text-xs font-black">{payload[0].value} {isStrength ? 'KG' : 'KCAL'}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke="#18181b" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorVal)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-5">
        <Card className="p-8 border-none shadow-premium bg-white flex flex-col items-center text-center gap-5 hover:scale-[1.02] transition-transform group">
          <div className="p-4 bg-zinc-50 text-zinc-900 rounded-3xl group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
            <Clock className="w-6 h-6" />
          </div>
          <StatBlock label="Protocol Duration" value={workout.duration} unit="MIN" />
        </Card>
        <Card className="p-8 border-none shadow-premium bg-white flex flex-col items-center text-center gap-5 hover:scale-[1.02] transition-transform group">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-3xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
            <Flame className="w-6 h-6" />
          </div>
          <StatBlock label="Energy Expenditure" value={workout.calories} unit="KCAL" />
        </Card>
      </div>

      {/* Strength Index Detail (Calculated Scores) */}
      {isStrength && (
        <Card className="p-10 border-none shadow-premium bg-zinc-900 text-white overflow-hidden relative group">
          <div className="relative z-10 space-y-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Biomechanical Analysis</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black tracking-tight">Strength Index</h3>
                  <Zap className="w-5 h-5 text-blue-400 fill-current" />
                </div>
              </div>
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
                <Scale className="w-7 h-7 text-blue-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 items-end">
              <div className="space-y-1">
                <span className="text-4xl font-black text-white leading-none">{workout.metadata?.strengthScore || '0.00'}</span>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Force-to-Weight<br />Coefficient</p>
              </div>
              <div className="space-y-1">
                <span className="text-6xl font-black text-orange-500 leading-none tracking-tighter tabular-nums">{workout.metadata?.weight || '—'} <span className="text-lg">KG</span></span>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">Total Resistance<br />Applied</p>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Improvement Delta</p>
                  <p className="text-xs font-bold text-white">+3.2% vs Previous Baseline</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-700" />
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-600/15 transition-all duration-700" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-600/5 rounded-full blur-[80px] pointer-events-none" />
        </Card>
      )}

      {/* Historical Performance Timeline */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-900" />
            <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Protocol Ledger Timeline</h2>
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            {history.length} Previous Iterations
          </span>
        </div>

        {history.length > 1 ? (
          <div className="space-y-4">
            {history.slice().reverse().map((prev, idx) => (
              <Card 
                key={prev.id} 
                className={`p-6 transition-all flex items-center justify-between cursor-pointer border-zinc-100 group ${
                  prev.id === id ? 'bg-zinc-50 border-zinc-900/10' : 'bg-white hover:border-zinc-300'
                }`}
                onClick={() => prev.id !== id && navigate(`/workouts/${prev.id}`)}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    prev.id === id ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white'
                  }`}>
                    {prev.id === id ? <Target className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-zinc-900">
                        {prev.id === id ? 'Current Session' : `Iterative Protocol ${history.length - idx - 1}`}
                      </p>
                      {prev.id === id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                      {new Date(prev.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-zinc-900">
                    {isStrength ? `${prev.metadata?.weight || 0} KG` : `${prev.calories} KCAL`}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{prev.duration} MIN</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100 mb-6">
              <History className="w-8 h-8 text-zinc-200" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Baseline Protocol Established</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-2 leading-relaxed">
              Insufficient historical data points for<br />longitudinal comparison analysis.
            </p>
          </div>
        )}
      </section>

      <button 
        onClick={() => navigate('/workouts')}
        className="w-full py-6 rounded-[32px] border border-zinc-100 text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all shadow-sm active:scale-95"
      >
        Dismiss Analysis Module
      </button>
    </div>
  );
};

export default WorkoutDetail;
