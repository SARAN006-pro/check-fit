
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Intro from './pages/Intro';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import Achievements from './pages/Achievements';
import Planner from './pages/Planner';
import Calculators from './pages/Calculators';
import Challenges from './pages/Challenges';
import Coach from './pages/Coach';
import Analytics from './pages/Analytics';
import Food from './pages/Food';
import Progress from './pages/Progress';
import Timer from './pages/Timer';
import ActivityTracking from './pages/ActivityTracking';
import Notifications from './pages/Notifications';
import WeeklyReport from './pages/WeeklyReport';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import MobileNav from './components/layout/MobileNav';
import ZenithAIButton from './components/ui/ZenithAIButton';
import CameraScanner from './components/ui/CameraScanner';
import { fitnessApi } from './api/axios';
import { Home, Dumbbell, Utensils, Users, BarChart3, Settings as SettingsIcon, Scan, Activity, FileText, Camera, Calculator, Calendar } from 'lucide-react';

const DoubleDumbbellLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="5" width="4" height="14" rx="2" fill="currentColor" />
    <rect x="1" y="7" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
    <rect x="1" y="14" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
    <rect x="17" y="5" width="4" height="14" rx="2" fill="currentColor" />
    <rect x="15" y="7" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
    <rect x="15" y="14" width="8" height="3" rx="1.5" fill="currentColor" fillOpacity="0.9" />
  </svg>
);

const AppLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickAdd = (type: string) => {
    setIsQuickAddOpen(false);
    if (type === 'Running') {
      navigate('/activity-tracking');
    } else if (type === 'Scan') {
      setIsScannerOpen(true);
    } else {
      navigate('/workouts', { state: { selectedType: type } });
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/food', label: 'Food / Intake KCAL', icon: Utensils },
    { path: '/workouts', label: 'Workout / Burn KCAL', icon: Dumbbell },
    { path: '/progress', label: 'Morphology / Progress', icon: Camera },
    { path: '/challenges', label: 'Squad Portal', icon: Users },
    { path: '/planner', label: 'Daily Protocol', icon: Calendar },
    { path: '/weekly-report', label: 'Weekly Audit', icon: FileText },
    { path: '/settings', label: 'Settings / Profile', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-zinc-950 md:flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-xl flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-14 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-11 h-11 bg-zinc-900 dark:bg-white rounded-[14px] flex items-center justify-center text-white dark:text-zinc-900 shadow-xl shadow-zinc-200 dark:shadow-none transform transition-transform hover:scale-105 active:scale-95">
            <DoubleDumbbellLogo className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter leading-none text-zinc-900 dark:text-white">ZenFit</span>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">SaaS Edition</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all group ${
                  isActive 
                    ? 'text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800 font-black text-sm' 
                    : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 font-bold text-sm'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
          
          <div className="pt-6 mt-6 border-t border-zinc-50 dark:border-zinc-800 opacity-50">
             <NavLink to="/calculators" className="flex items-center gap-3 px-5 py-3 text-zinc-400 font-bold text-sm hover:text-zinc-900">
                <Calculator className="w-4 h-4" /> Bio Terminal
             </NavLink>
             <NavLink to="/analytics" className="flex items-center gap-3 px-5 py-3 text-zinc-400 font-bold text-sm hover:text-zinc-900">
                <BarChart3 className="w-4 h-4" /> Performance
             </NavLink>
          </div>
        </nav>
        
        <div className="mt-auto pt-8 border-t border-zinc-50 dark:border-zinc-800">
          <button 
            onClick={onLogout}
            className="w-full px-5 py-3 text-zinc-400 font-bold hover:text-red-500 transition-colors text-left flex items-center gap-3 text-xs uppercase tracking-widest"
          >
            <div className="w-2 h-2 rounded-full border-2 border-current"></div>
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#F9FAFB] dark:bg-zinc-950">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/calculators" element={<Calculators />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/food" element={<Food />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/activity-tracking" element={<ActivityTracking />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/weekly-report" element={<WeeklyReport />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Navigate to="/settings" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Global AI Button */}
      <ZenithAIButton />

      <MobileNav onQuickAdd={() => setIsQuickAddOpen(true)} />

      {/* Quick Add Modal */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-8 md:pb-0 md:items-center">
          <div className="absolute inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsQuickAddOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[40px] p-10 shadow-3xl animate-[slide-up_0.4s_cubic-bezier(0.16,1,0.3,1)] border border-zinc-100 dark:border-zinc-800">
            <h2 className="text-2xl font-black tracking-tight mb-8 text-center text-zinc-900 dark:text-white">Quick Entry</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleQuickAdd('Scan')} className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group col-span-2 mb-2">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl transition-transform group-hover:scale-105">
                  <Scan className="w-8 h-8" strokeWidth={3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">AI Food Scan</span>
              </button>
              <button onClick={() => { setIsQuickAddOpen(false); navigate('/food'); }} className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all group">
                <div className="w-14 h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6">🥗</div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Add Meal</span>
              </button>
              <button onClick={() => handleQuickAdd('Strength')} className="flex flex-col items-center gap-4 p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all group">
                <div className="w-14 h-14 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:-rotate-6">🏋️</div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Workout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Scanner Modal */}
      {isScannerOpen && (
        <CameraScanner 
          title="AI Macro Analysis"
          subtitle="Scan meal to identify nutrient parameters."
          onClose={() => setIsScannerOpen(false)}
          onCapture={async (base64) => {
            const res = await fitnessApi.scanFood(base64);
            return res;
          }}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('zenfit_token'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      localStorage.setItem('zenfit_token', urlToken);
      setToken(urlToken);
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('zenfit_token', newToken);
    setToken(newToken);
    window.location.hash = '#/';
  };

  const handleLogout = () => {
    localStorage.removeItem('zenfit_token');
    setToken(null);
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppLayout onLogout={handleLogout} />
    </Router>
  );
};

export default App;
