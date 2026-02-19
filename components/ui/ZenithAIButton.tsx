
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Cpu } from 'lucide-react';

const ZenithAIButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ping, setPing] = useState(false);
  
  // Hide the floating button when already on the Coach page
  if (location.pathname === '/coach') return null;

  // Periodic subtle ping animation to increase engagement
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(true);
      setTimeout(() => setPing(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => navigate('/coach')}
      className="fixed bottom-[110px] right-6 md:bottom-10 md:right-10 z-50 group flex items-center flex-row-reverse gap-4 active:scale-90 transition-all duration-500 outline-none"
      aria-label="Access Zenith CTRL"
    >
      <div className="relative">
        {/* Dual Layer Animated Glow */}
        <div className={`absolute inset-0 bg-blue-500 rounded-2xl blur-xl transition-opacity duration-1000 ${ping ? 'opacity-80' : 'opacity-40 group-hover:opacity-70'}`} />
        <div className={`absolute inset-0 bg-blue-400 rounded-2xl blur-md transition-transform duration-1000 ${ping ? 'scale-125 opacity-30' : 'opacity-20 group-hover:scale-125'}`} />
        
        {/* Neural Orb Body */}
        <div className="relative w-16 h-16 bg-zinc-900 border border-white/20 rounded-[22px] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden group-hover:-rotate-12 transition-all duration-500 hover:rounded-3xl">
          <Cpu className={`w-7 h-7 text-blue-400 fill-current transition-transform duration-500 ${ping ? 'scale-110' : 'group-hover:scale-110'}`} />
          
          {/* Scanning Line Animation */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-[1.5s] ease-in-out" />
          
          {/* Subtle Inner Pulse */}
          <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
        </div>
      </div>

      {/* Persistent Hover Label - "CTRL" */}
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl opacity-0 translate-x-6 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] leading-none">Zenith</span>
            <span className="text-[12px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">CTRL</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]" />
        </div>
      </div>
    </button>
  );
};

export default ZenithAIButton;
