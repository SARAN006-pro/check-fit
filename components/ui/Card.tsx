
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
      className={`bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-[32px] p-6 shadow-2xl transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/60 active:scale-[0.98]' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
