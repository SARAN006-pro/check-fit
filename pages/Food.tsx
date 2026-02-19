
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { fitnessApi } from '../api/axios';
import { LoggedFood, FoodItem } from '../types';
import { useNotification } from '../components/ui/NotificationEngine';
import { 
  Utensils, Plus, Trash2, Search, Flame, PieChart, ChevronRight, TrendingUp, Beef, Wheat, Droplet, Scan, Zap
} from 'lucide-react';

const Food: React.FC = () => {
  const { notify } = useNotification();
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [availableFoods, setAvailableFoods] = useState<FoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(true);
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
        console.error(err);
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
      
      const newTotal = totals.calories + (selectedFood.calories * (parseFloat(amount)/100));
      const progress = Math.min(100, Math.round((newTotal / macroGoals.calories) * 100));
      
      notify({ 
        type: 'impact', 
        title: 'FUEL SYNCHRONIZED', 
        message: `${selectedFood.name} added. Capacity reached ${progress}%.`,
        progress: progress
      });
    } catch (err) {
      notify({ type: 'warning', title: 'System Error', message: 'Fuel synthesis failed.' });
    }
  };

  if (loading) return <div className="p-8 bg-black h-screen animate-pulse" />;

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-40 max-w-2xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <Header title="Fuel Logistics" subtitle="Biochemical Input Monitoring" />

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
             <div className="bg-black/40 rounded-[32px] p-4 border border-zinc-800 max-h-64 overflow-y-auto no-scrollbar">
                {availableFoods.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(food => (
                  <button 
                    key={food.id}
                    onClick={() => { setSelectedFood(food); setSearchQuery(food.name); }}
                    className="w-full text-left px-6 py-4 rounded-2xl hover:bg-brand-red hover:text-white transition-all text-[11px] font-black uppercase text-zinc-500 mb-2"
                  >
                    {food.name}
                  </button>
                ))}
             </div>
           )}

           {selectedFood && (
             <div className="space-y-8 animate-in zoom-in duration-500">
                <input 
                  type="number" value={amount} onChange={(e) => setAmount(e.target.value)} 
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-2xl font-black text-white outline-none"
                  placeholder="Load Mass (g)"
                />
                <Button fullWidth onClick={handleAddFood}>SYNCHRONIZE FUEL</Button>
             </div>
           )}
        </Card>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black uppercase text-zinc-500 px-2 tracking-[0.3em]">Operational Ledger</h3>
        {loggedFoods.map((f) => (
          <Card key={f.logId} className="p-6 flex justify-between border-zinc-800">
            <div>
              <p className="font-black text-white uppercase">{f.name}</p>
              <p className="text-[10px] text-zinc-600 font-bold uppercase">{f.amount}G</p>
            </div>
            <p className="text-brand-green font-black">{Math.round(f.calories * (f.amount/100))} KCAL</p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Food;
