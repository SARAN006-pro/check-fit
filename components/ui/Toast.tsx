
import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Zap } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-full max-w-[340px] px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`relative overflow-hidden bg-zinc-900/90 backdrop-blur-xl border-l-4 p-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
                toast.type === 'success' ? 'border-brand-green' :
                toast.type === 'error' ? 'border-brand-red' :
                toast.type === 'info' ? 'border-blue-500' :
                'border-brand-gold'
              }`}>
                {/* Background Glow */}
                <div className={`absolute inset-0 opacity-5 ${
                  toast.type === 'success' ? 'bg-brand-green' :
                  toast.type === 'error' ? 'bg-brand-red' :
                  toast.type === 'info' ? 'bg-blue-500' :
                  'bg-brand-gold'
                }`} />

                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  toast.type === 'success' ? 'bg-brand-green/10 text-brand-green' :
                  toast.type === 'error' ? 'bg-brand-red/10 text-brand-red' :
                  toast.type === 'info' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-brand-gold/10 text-brand-gold'
                }`}>
                  {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                  {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                  {toast.type === 'info' && <Info className="w-5 h-5" />}
                  {toast.type === 'warning' && <Zap className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">System Feedback</p>
                  <p className="text-xs font-bold text-white tracking-tight leading-snug">{toast.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 hover:bg-white/5 rounded-md transition-colors text-zinc-600 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
