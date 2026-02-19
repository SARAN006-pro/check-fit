
import React, { useState } from 'react';
import { authApi } from '../api/axios';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AuthView } from '../types';

interface AuthProps {
  onLogin: (token: string) => void;
}

const DoubleDumbbellLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Left Dumbbell */}
    <rect x="3" y="5" width="4" height="14" rx="2" fill="currentColor" />
    <rect x="1" y="7" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
    <rect x="1" y="14" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
    
    {/* Right Dumbbell - Offset for a modern, asymmetrical look */}
    <rect x="17" y="5" width="4" height="14" rx="2" fill="currentColor" />
    <rect x="15" y="7" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
    <rect x="15" y="14" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
  </svg>
);

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
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (view === AuthView.LOGIN) {
        response = await authApi.login({ email: formData.email, password: formData.password });
      } else {
        response = await authApi.signup(formData);
      }
      
      if (response.data.token) {
        localStorage.setItem('zenfit_token', response.data.token);
        onLogin(response.data.token);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authApi.googleLogin();
  };

  const handleDemoLogin = () => {
    const demoToken = 'demo_mode_active_' + Date.now();
    localStorage.setItem('zenfit_token', demoToken);
    onLogin(demoToken);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-700">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900 rounded-[28px] shadow-2xl shadow-zinc-400/30 transform transition-all duration-500 hover:scale-105 hover:-rotate-3 group">
            <DoubleDumbbellLogo className="w-11 h-11 text-white" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-zinc-900 mt-6">
            ZenFit
          </h2>
          <p className="text-zinc-400 text-sm font-semibold tracking-wide uppercase">
            Designed for Performance
          </p>
        </div>

        <Card className="p-1 pb-8 overflow-hidden border-zinc-200/50 shadow-2xl shadow-zinc-200/50">
          {/* Tab Switcher */}
          <div className="p-1 mb-6">
            <div className="relative flex bg-zinc-100 rounded-[20px] p-1">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[16px] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  view === AuthView.SIGNUP ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
              />
              <button
                type="button"
                onClick={() => setView(AuthView.LOGIN)}
                className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                  view === AuthView.LOGIN ? 'text-zinc-900' : 'text-zinc-400'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setView(AuthView.SIGNUP)}
                className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                  view === AuthView.SIGNUP ? 'text-zinc-900' : 'text-zinc-400'
                }`}
              >
                Join Now
              </button>
            </div>
          </div>

          <div className="px-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`overflow-hidden transition-all duration-500 ${view === AuthView.SIGNUP ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                <Input 
                  label="Full Name" 
                  placeholder="e.g. Marcus Aurelius"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={view === AuthView.SIGNUP}
                />
              </div>
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="marcus@zenfit.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input 
                label="Security Key" 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              
              {error && <p className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest bg-red-50 py-2.5 rounded-xl border border-red-100">{error}</p>}

              <Button fullWidth loading={loading} className="mt-4 h-14 text-sm uppercase tracking-[0.2em] font-black shadow-xl shadow-zinc-900/10 active:scale-95 transition-transform">
                {loading ? 'Processing...' : (view === AuthView.LOGIN ? 'Proceed' : 'Create Access')}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                <span className="bg-white px-3 text-zinc-400 font-bold">Secure Connect</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={handleGoogleLogin}
                className="border-zinc-200 h-14 group hover:border-zinc-400 transition-colors"
              >
                <GoogleIcon />
                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-zinc-900">Sign in with Google</span>
              </Button>

              <Button 
                variant="ghost" 
                fullWidth 
                onClick={handleDemoLogin}
                className="h-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900"
              >
                Try Demo Access
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
          Proprietary Performance Monitoring System<br />
          <a href="#" className="text-zinc-900 hover:underline">Terms</a>
          <span className="mx-2 text-zinc-200">•</span>
          <a href="#" className="text-zinc-900 hover:underline">Privacy</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
