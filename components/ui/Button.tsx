
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  loading = false,
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.95] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-3 overflow-hidden relative text-xs";
  
  const variants = {
    primary: "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-[0_10px_20px_-10px_rgba(225,29,72,0.5)] hover:shadow-[0_15px_25px_-5px_rgba(225,29,72,0.6)] hover:-translate-y-0.5",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 shadow-lg",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/50",
    danger: "bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-900/40",
    success: "bg-brand-green/20 text-brand-green border border-brand-green/30 hover:bg-brand-green/40 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${width} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
