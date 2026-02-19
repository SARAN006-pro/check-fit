
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">{label}</label>}
      <input 
        className={`w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-brand-red/10 focus:border-brand-red transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 dark:text-zinc-100 font-bold text-sm ${error ? 'border-red-500 ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
