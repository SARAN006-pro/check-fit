
import React, { useState, useMemo } from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { 
  Calculator, 
  Activity, 
  Zap, 
  Dumbbell, 
  ChevronRight, 
  Info, 
  User, 
  Scale, 
  Ruler, 
  Clock,
  PieChart,
  CheckCircle2
} from 'lucide-react';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete';

const Calculators: React.FC = () => {
  const [age, setAge] = useState<string>('28');
  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState<string>('75');
  const [height, setHeight] = useState<string>('180');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  // BMI Calculation: weight (kg) / [height (m)]^2
  const bmi = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return 0;
    return parseFloat((w / (h * h)).toFixed(1));
  }, [weight, height]);

  const bmiStatus = useMemo(() => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { label: 'Optimal', color: 'text-green-500' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-500' };
    return { label: 'Obese', color: 'text-red-500' };
  }, [bmi]);

  // BMR Calculation (Mifflin-St Jeor Equation)
  const bmr = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (!w || !h || !a) return 0;

    if (gender === 'male') {
      return Math.round(10 * w + 6.25 * h - 5 * a + 5);
    } else {
      return Math.round(10 * w + 6.25 * h - 5 * a - 161);
    }
  }, [weight, height, age, gender]);

  // TDEE Calculation
  const tdee = useMemo(() => {
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      athlete: 1.9
    };
    return Math.round(bmr * multipliers[activity]);
  }, [bmr, activity]);

  // Protein Calculation (1.6g to 2.2g per kg)
  const protein = useMemo(() => {
    const w = parseFloat(weight);
    if (!w) return { min: 0, max: 0 };
    return {
      min: Math.round(w * 1.6),
      max: Math.round(w * 2.2)
    };
  }, [weight]);

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Header title="Biometric Terminal" subtitle="Compute physiological baselines to optimize nutritional protocols." />

      {/* Input Module */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <User className="w-4 h-4 text-zinc-900" />
          <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Physiology Inputs</h2>
        </div>
        <Card className="p-8 border-none shadow-premium bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 flex p-1 bg-zinc-100 rounded-2xl">
              <button 
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'male' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400'}`}
              >
                Male Protocol
              </button>
              <button 
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === 'female' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400'}`}
              >
                Female Protocol
              </button>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Age
              </label>
              <input 
                type="number" 
                value={age} 
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-4 text-sm font-black focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Scale className="w-3 h-3" /> Weight (kg)
              </label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-4 text-sm font-black focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Ruler className="w-3 h-3" /> Height (cm)
              </label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-4 text-sm font-black focus:ring-2 focus:ring-zinc-900 outline-none transition-all"
              />
            </div>

            <div className="col-span-2 space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Activity Multiplier
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(['sedentary', 'light', 'moderate', 'heavy', 'athlete'] as ActivityLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setActivity(level)}
                    className={`flex items-center justify-between px-5 py-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      activity === level 
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl' 
                        : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'
                    }`}
                  >
                    {level}
                    {activity === level && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Results Dashboard */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Zap className="w-4 h-4 text-zinc-900" />
          <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Calculated Output</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BMI Card */}
          <Card className="p-8 border-none bg-zinc-900 text-white overflow-hidden relative group">
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Body Mass Index</p>
                <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                  <Calculator className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black tracking-tighter tabular-nums">{bmi}</h3>
                <span className={`text-[10px] font-black uppercase ${bmiStatus.color}`}>{bmiStatus.label}</span>
              </div>
              <div className="relative h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    bmi < 18.5 ? 'bg-blue-500' : bmi < 25 ? 'bg-green-500' : bmi < 30 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, (bmi / 40) * 100)}%` }}
                />
              </div>
            </div>
          </Card>

          {/* BMR Card */}
          <Card className="p-8 border-none bg-white shadow-premium">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Basal Metabolic Rate</p>
                <div className="p-2 bg-zinc-50 rounded-lg">
                  <Zap className="w-4 h-4 text-zinc-900" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black tracking-tighter text-zinc-900 tabular-nums">{bmr.toLocaleString()}</h3>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Kcal/Day</span>
              </div>
              <p className="text-[9px] font-bold text-zinc-400 leading-tight">Minimum energy expenditure at rest.</p>
            </div>
          </Card>

          {/* TDEE Hero Card */}
          <Card className="col-span-1 md:col-span-2 p-10 border-none bg-zinc-900 text-white shadow-3xl overflow-hidden relative group">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className="p-2 bg-blue-500/20 rounded-xl">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Total Daily Energy Expenditure</span>
                </div>
                <div className="flex items-baseline justify-center md:justify-start gap-3">
                  <h3 className="text-7xl font-black tracking-tighter tabular-nums">{tdee.toLocaleString()}</h3>
                  <span className="text-2xl font-bold text-zinc-600">KCAL</span>
                </div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs">Maintenance calories adjusted for protocol intensity.</p>
              </div>

              <div className="w-full md:w-auto p-6 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <PieChart className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Targeting: Maintenance</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-10">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Deficit (-500)</span>
                    <span className="text-sm font-black">{(tdee - 500).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center gap-10">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Surplus (+300)</span>
                    <span className="text-sm font-black">{(tdee + 300).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          </Card>

          {/* Protein Intake Card */}
          <Card className="p-8 border-none bg-white shadow-premium group">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-zinc-900" />
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Daily Protein Protocol</p>
                </div>
                <div className="p-1.5 bg-zinc-50 rounded-lg group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <h3 className="text-5xl font-black tracking-tighter text-zinc-900 tabular-nums">{protein.min}-{protein.max}</h3>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Grams</span>
              </div>
              <div className="pt-4 border-t border-zinc-50">
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                  Based on 1.6g - 2.2g per kg bodyweight target for muscle synthesis.
                </p>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-8 border-none bg-blue-50 text-blue-900">
            <div className="flex gap-4">
              <Info className="w-5 h-5 shrink-0 mt-1" />
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest">Protocol Insight</h4>
                <p className="text-[10px] font-medium leading-relaxed opacity-80 uppercase tracking-tight">
                  Calculations use the Mifflin-St Jeor formula, widely recognized as the metabolic industry standard for precision caloric baseline estimation.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="text-center">
        <button className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] hover:text-zinc-900 transition-colors">
          Synchronize with Daily Planner <ChevronRight className="w-3 h-3 inline-block" />
        </button>
      </div>
    </div>
  );
};

export default Calculators;

// Helper component for the share icon
const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M7 17L17 7M17 7H7M17 7V17" />
  </svg>
);
