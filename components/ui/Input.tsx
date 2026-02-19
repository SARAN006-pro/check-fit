
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">{label}</label>}
      <input 
        className={`w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-zinc-100 ${error ? 'border-red-500 ring-red-100' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};

export default Input;
