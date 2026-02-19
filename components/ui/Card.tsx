
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/50 backdrop-blur-md rounded-[32px] p-6 shadow-premium dark:shadow-2xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 active:scale-[0.98]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
