
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, Scale, Zap } from 'lucide-react';

const mockChart = [
  { val: 78.2 }, { val: 78.5 }, { val: 78.0 }, { val: 77.8 }, { val: 77.5 }, { val: 77.9 }, { val: 77.2 }
];

const WeeklyStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[32px] p-6 space-y-4 group hover:border-blue-500/20 transition-all shadow-premium dark:shadow-none">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-sm dark:shadow-none">
            <Scale className="w-5 h-5" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Weight Drift</p>
            <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">-1.2<span className="text-xs text-zinc-400 dark:text-zinc-600 ml-1">KG</span></p>
          </div>
        </div>
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChart}>
              <Area type="monotone" dataKey="val" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 rounded-[32px] p-6 space-y-4 group hover:border-orange-500/20 transition-all shadow-premium dark:shadow-none">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-orange-50 dark:bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-500 shadow-sm dark:shadow-none">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Strength %</p>
            <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">+12<span className="text-xs text-zinc-400 dark:text-zinc-600 ml-1">%</span></p>
          </div>
        </div>
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChart.map(v => ({ val: 100 - v.val }))}>
              <Area type="monotone" dataKey="val" stroke="#F97316" fill="#F97316" fillOpacity={0.1} strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeeklyStats;
