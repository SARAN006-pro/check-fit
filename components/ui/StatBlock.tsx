
import React from 'react';

interface StatBlockProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatBlock: React.FC<StatBlockProps> = ({ label, value, unit, icon, trend }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 mb-1">
        {icon && <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>}
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">{value}</span>
        {unit && <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">{unit}</span>}
      </div>
      {trend && (
        <span className={`text-[10px] font-bold mt-1 ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isUp ? '↑' : '↓'} {trend.value}%
        </span>
      )}
    </div>
  );
};

export default StatBlock;
