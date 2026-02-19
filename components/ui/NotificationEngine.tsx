
import React, { useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, ShieldAlert, CheckCircle2, Star, ArrowUp, X, Sparkles } from 'lucide-react';

type NotifyType = 'success' | 'warning' | 'achievement' | 'impact';

interface Notification {
  id: string;
  type: NotifyType;
  title: string;
  message: string;
  subtext?: string;
  progress?: number;
  xp?: number;
}

interface NotificationContextType {
  notify: (n: Omit<Notification, 'id'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Notification[]>([]);

  const notify = useCallback((n: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setItems((prev) => [...prev, { ...n, id }]);
    
    if (n.type !== 'achievement') {
      setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, 5000);
    }
  }, []);

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      <div className="fixed inset-0 pointer-events-none z-[100]">
        
        <AnimatePresence>
          {items.filter(i => i.type === 'achievement').map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50, filter: 'blur(20px)' }}
                animate={{ scale: 1, y: 0, filter: 'blur(0px)' }}
                className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-brand-gold/30 rounded-[48px] p-10 text-center relative overflow-hidden shadow-2xl dark:shadow-[0_0_100px_rgba(250,204,21,0.15)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.05),transparent_70%)]" />
                
                <div className="relative z-10 space-y-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-brand-gold/10 rounded-[32px] border border-brand-gold/20 flex items-center justify-center mx-auto shadow-2xl">
                      <Trophy className="w-12 h-12 text-brand-gold animate-bounce" />
                    </div>
                    {item.xp && (
                      <motion.div 
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: -60, opacity: 1 }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-brand-gold font-black text-xl italic whitespace-nowrap"
                      >
                        +{item.xp} XP
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">{item.title}</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{item.message}</p>
                  </div>

                  <button 
                    onClick={() => remove(item.id)}
                    className="w-full h-16 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-[24px] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all active:scale-95 shadow-xl"
                  >
                    CONTINUE PROTOCOL
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="absolute bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 flex flex-col gap-4 w-full max-w-[360px] px-6">
          <AnimatePresence>
            {items.filter(i => i.type !== 'achievement').map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                className="pointer-events-auto"
              >
                <div className={`relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 p-5 rounded-3xl shadow-2xl flex items-start gap-4 ${
                  item.type === 'warning' ? 'border-l-4 border-l-brand-orange' : 
                  item.type === 'impact' ? 'border-l-4 border-l-blue-500' : 
                  'border-l-4 border-l-brand-green'
                }`}>
                  
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.type === 'warning' ? 'bg-brand-orange/10 text-brand-orange' : 
                    item.type === 'impact' ? 'bg-blue-500/10 text-blue-400' : 
                    'bg-brand-green/10 text-brand-green'
                  }`}>
                    {item.type === 'warning' ? <ShieldAlert className="w-5 h-5" /> : 
                     item.type === 'impact' ? <ArrowUp className="w-5 h-5" /> : 
                     <CheckCircle2 className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{item.title}</p>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white leading-snug">{item.message}</p>
                    
                    {item.progress !== undefined && (
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400">
                          <span>Sync Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-100 dark:bg-black/50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            className={`h-full ${item.type === 'impact' ? 'bg-blue-500' : 'bg-brand-green'}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => remove(item.id)}
                    className="shrink-0 p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </NotificationContext.Provider>
  );
};
