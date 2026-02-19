
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from '../api/axios';
import { AuthView } from '../types';
import { Eye, EyeOff, Facebook, Mail, Lock, User, ShieldCheck, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';

interface AuthProps {
  onLogin: (token: string) => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>(AuthView.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<string>('Female');

  useEffect(() => {
    const savedGender = localStorage.getItem('zenfit_onboarding_gender');
    if (savedGender) setGender(savedGender);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (view === AuthView.LOGIN) {
        response = await authApi.login({ email: formData.email, password: formData.password });
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        response = await authApi.signup(formData);
      }
      
      if (response.data.token) {
        localStorage.setItem('zenfit_token', response.data.token);
        onLogin(response.data.token);
      }
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const athleteImage = gender === 'Male' 
    ? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
    : "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05),transparent_70%)]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px]"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] dark:shadow-none border border-zinc-100 dark:border-white/5 flex flex-col md:flex-row overflow-hidden relative z-10"
      >
        {/* Left Side: Form */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-[9px] font-black uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-3 h-3" /> iCtrl Node Protocol
                </div>
                <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white italic">
                  {view === AuthView.LOGIN ? 'Synchronize Session' : 'Register Biometrics'}
                </h2>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  Let's start your wonderful journey with iCtrl
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                {view === AuthView.SIGNUP && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Identity Label</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-purple-500 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Marcus Aurelius"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-bold text-sm text-zinc-900 dark:text-white shadow-inner"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email Node</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-purple-500 transition-colors" />
                    <input 
                      type="email"
                      placeholder="alex@ictrl.os"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-bold text-sm text-zinc-900 dark:text-white shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Access Token</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-purple-500 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-2xl pl-12 pr-12 py-4 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-bold text-sm text-zinc-900 dark:text-white shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {view === AuthView.LOGIN && (
                    <button type="button" className="text-[10px] font-black text-purple-500 uppercase tracking-widest hover:underline mt-2 ml-1">Recover Security Key?</button>
                  )}
                </div>

                {view === AuthView.SIGNUP && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Confirm Access Token</label>
                    <input 
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all font-bold text-sm text-zinc-900 dark:text-white shadow-inner"
                    />
                    <div className="flex items-center gap-3 pt-3">
                       <input type="checkbox" className="w-4 h-4 rounded-md border-zinc-200 text-purple-600 focus:ring-purple-500" required />
                       <span className="text-[10px] font-bold text-zinc-400">By signing up, you accept the <a href="#" className="text-purple-500 underline">iCtrl Protocols</a></span>
                    </div>
                  </div>
                )}

                {error && <p className="text-[10px] font-black text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-100 dark:border-red-900/30 uppercase tracking-widest">{error}</p>}

                <Button 
                  loading={loading}
                  fullWidth 
                  className="h-16 rounded-[20px] bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-purple-500/30 active:scale-95 transition-all group"
                >
                  <span className="flex items-center gap-2">
                    {view === AuthView.LOGIN ? 'Proceed to System' : 'Initialize iCtrl Account'}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </form>

              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100 dark:border-white/5"></span></div>
                  <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400"><span className="bg-white dark:bg-zinc-900 px-4">OR CONTINUE WITH</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button className="flex items-center justify-center gap-3 h-14 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all group shadow-sm active:scale-95">
                    <GoogleIcon />
                    <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 h-14 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all group shadow-sm active:scale-95">
                    <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2]" />
                    <span className="text-[10px] font-black text-zinc-600 dark:text-zinc-300 uppercase tracking-widest">Facebook</span>
                  </button>
                </div>

                <div className="text-center pt-4">
                  <button 
                    onClick={() => setView(view === AuthView.LOGIN ? AuthView.SIGNUP : AuthView.LOGIN)}
                    className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest hover:text-purple-600 transition-colors"
                  >
                    {view === AuthView.LOGIN ? "Don't have an iCtrl ID? " : "Already have an iCtrl ID? "}
                    <span className="text-purple-600 dark:text-purple-400 font-black underline underline-offset-4">{view === AuthView.LOGIN ? 'SIGN UP' : 'LOG IN'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Visual Image */}
        <div className="hidden md:block w-[45%] relative overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={athleteImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img src={athleteImage} className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110" alt="iCtrl Pro" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-purple-600/30 to-pink-500/40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-purple-950/20" />
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="w-12 h-1 bg-white/50 rounded-full" />
              <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                {gender === 'Male' ? 'TOTAL' : 'ELITE'}<br />
                <span className="text-purple-400">CONTROL</span>
              </h3>
              <p className="text-sm font-bold text-zinc-300 uppercase tracking-[0.4em] leading-relaxed">
                Join 50,000+ athletes optimizing their human potential through the iCtrl protocol.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-center w-full pointer-events-none opacity-20">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[1em]">iCtrl Biometric OS • v4.2.5</p>
      </div>
    </div>
  );
};

export default Auth;
