
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CameraScanner from '../components/ui/CameraScanner';
import { fitnessApi } from '../api/axios';
import { LoggedFood, FoodItem } from '../types';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  Search, 
  Flame, 
  PieChart, 
  ChevronRight, 
  TrendingUp, 
  Beef, 
  Wheat, 
  Droplet,
  Scan,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Cell 
} from 'recharts';

const Food: React.FC = () => {
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [availableFoods, setAvailableFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [macroGoals] = useState({ calories: 2400, protein: 180, carbs: 250, fat: 70 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [foodsRes, logRes] = await Promise.all([
          fitnessApi.getFoods(),
          fitnessApi.getNutritionLog()
        ]);
        setAvailableFoods(foodsRes.data);
        setLoggedFoods(logRes.data);
      } catch (err) {
        console.error("Failed to sync nutritional protocol:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totals = useMemo(() => {
    return loggedFoods.reduce((acc, food) => {
      const multiplier = food.amount / 100;
      return {
        calories: acc.calories + (food.calories * multiplier),
        protein: acc.protein + (food.protein * multiplier),
        carbs: acc.carbs + (food.carbs * multiplier),
        fat: acc.fat + (food.fat * multiplier),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [loggedFoods]);

  const remaining = useMemo(() => {
    return Math.max(0, macroGoals.calories - totals.calories);
  }, [totals, macroGoals]);

  const handleAddFood = async () => {
    if (!selectedFood) return;
    try {
      const res = await fitnessApi.logFood({
        ...selectedFood,
        amount: parseFloat(amount)
      });
      setLoggedFoods(prev => [res.data, ...prev]);
      setSelectedFood(null);
      setSearchQuery('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (logId: string) => {
    try {
      await fitnessApi.deleteFoodLog(logId);
      setLoggedFoods(prev => prev.filter(f => f.logId !== logId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 bg-black h-screen animate-pulse" />;

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-40 max-w-2xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <Header title="Fuel Logistics" subtitle="Biochemical Input Monitoring" />

      {/* Burn Status Card */}
      <section className="relative">
        <Card className="p-12 border-none bg-zinc-900 overflow-hidden relative shadow-3xl group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Flame className="w-5 h-5 text-brand-green fill-brand-green" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Caloric Inventory</span>
              </div>
              <div className="flex items-baseline justify-center md:justify-start gap-4">
                <h2 className={`text-7xl font-black tracking-tighter tabular-nums ${remaining > 0 ? 'text-brand-green' : 'text-brand-red'} drop-shadow-[0_0_25px_rgba(57,255,20,0.2)]`}>
                  {Math.round(totals.calories)}
                </h2>
                <span className="text-2xl font-black text-zinc-700 uppercase tracking-widest">/ {macroGoals.calories} KCAL</span>
              </div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] italic">Available Balance: {Math.round(remaining)} KCAL</p>
            </div>

            <div className="w-24 h-24 relative flex items-center justify-center">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke={remaining > 0 ? "#39ff14" : "#e11d48"} 
                    strokeWidth="10" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 * (1 - Math.min(1, totals.calories / macroGoals.calories))}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
               </svg>
               <Zap className="absolute w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />
        </Card>
      </section>

      {/* Macro Grid */}
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: 'PRO', val: totals.protein, target: macroGoals.protein, color: 'text-brand-green', bg: 'bg-brand-green/10' },
          { label: 'CHO', val: totals.carbs, target: macroGoals.carbs, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
          { label: 'FAT', val: totals.fat, target: macroGoals.fat, color: 'text-brand-red', bg: 'bg-brand-red/10' }
        ].map((m, i) => (
          <Card key={i} className="p-6 border-zinc-800 bg-zinc-900/30 text-center space-y-3">
             <div className={`w-10 h-10 rounded-2xl mx-auto flex items-center justify-center ${m.bg} ${m.color} border border-current/20`}>
                <p className="text-[10px] font-black">{m.label}</p>
             </div>
             <div>
                <p className="text-2xl font-black text-white leading-none">{Math.round(m.val)}<span className="text-[10px] text-zinc-700 ml-0.5">G</span></p>
                <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                   <div className={`h-full ${m.color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${Math.min(100, (m.val / m.target) * 100)}%` }} />
                </div>
             </div>
          </Card>
        ))}
      </div>

      {/* Ledger */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
             <div className="w-1 h-8 bg-brand-green rounded-full" />
             <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Consumption Matrix</h3>
          </div>
          <button className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] hover:text-white transition-colors">Clear Protocol</button>
        </div>

        <div className="space-y-4">
          {loggedFoods.map((food) => (
            <Card key={food.logId} className="p-6 flex items-center justify-between group border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:bg-brand-red group-hover:text-white transition-all border border-zinc-700 group-hover:border-transparent">
                  <Beef className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white group-hover:text-brand-red transition-colors uppercase tracking-tight">{food.name}</h4>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mt-1">{food.amount}G • <span className="text-brand-green">{Math.round(food.calories * (food.amount/100))} KCAL</span></p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(food.logId)}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-zinc-600 hover:text-white hover:bg-brand-red transition-all opacity-0 group-hover:opacity-100 border border-zinc-800 hover:border-transparent"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Card>
          ))}
        </div>
      </section>

      {/* Manual Input Trigger */}
      <section className="space-y-8">
        <div className="flex items-center gap-3 px-2">
           <Plus className="w-5 h-5 text-brand-red" strokeWidth={3} />
           <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Manual Synthesis</h3>
        </div>
        <Card className="p-10 border-zinc-800 bg-zinc-900/40 space-y-8">
           <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-brand-red transition-colors" />
              <input 
                type="text" 
                placeholder="Query Nutrient Database..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-3xl pl-14 pr-6 py-5 text-sm font-black outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red/40 transition-all text-white placeholder:text-zinc-700"
              />
           </div>
           
           {searchQuery && !selectedFood && (
             <div className="bg-black/40 rounded-[32px] p-4 border border-zinc-800 max-h-64 overflow-y-auto no-scrollbar animate-in slide-in-from-top-4">
                {availableFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(food => (
                  <button 
                    key={food.id}
                    onClick={() => { setSelectedFood(food); setSearchQuery(food.name); }}
                    className="w-full text-left px-6 py-4 rounded-2xl hover:bg-brand-red hover:text-white transition-all text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-2 flex justify-between items-center"
                  >
                    {food.name}
                    <Plus className="w-4 h-4" />
                  </button>
                ))}
             </div>
           )}

           {selectedFood && (
             <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">LOAD MASS (G)</label>
                      <input 
                        type="number" value={amount} onChange={(e) => setAmount(e.target.value)} 
                        className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-2xl font-black text-white focus:outline-none focus:border-brand-red"
                      />
                   </div>
                   <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-6 flex flex-col justify-center border border-white/5">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Impact</p>
                      <p className="text-3xl font-black text-brand-green italic">+{Math.round(selectedFood.calories * (parseFloat(amount)/100))} KCAL</p>
                   </div>
                </div>
                <Button fullWidth onClick={handleAddFood}>SYNCHRONIZE FUEL</Button>
             </div>
           )}
        </Card>
      </section>

      {/* FLOATING ACTION: SCAN - High Energy Red */}
      <button 
        onClick={() => setIsScannerOpen(true)}
        className="fixed bottom-28 right-8 z-50 w-20 h-20 bg-brand-red text-white rounded-[32px] shadow-[0_25px_50px_-12px_rgba(225,29,72,0.8)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all group overflow-hidden"
      >
        <Scan className="w-8 h-8 group-hover:scale-125 transition-transform" strokeWidth={3} />
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {isScannerOpen && (
        <CameraScanner 
          title="Optic Analysis Protocol"
          subtitle="Point at fuel unit for AI identification."
          onClose={() => setIsScannerOpen(false)}
          onCapture={async (base64) => fitnessApi.scanFood(base64)}
        />
      )}

      <div className="pt-20 text-center opacity-10 border-t border-zinc-900">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[1em]">
          ADAPT OR EXPIRE
        </p>
      </div>
    </div>
  );
};

export default Food;
