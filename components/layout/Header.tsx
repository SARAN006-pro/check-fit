
import React, { useState, useEffect } from 'react';
import { Bell, User, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fitnessApi } from '../../api/axios';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fitnessApi.getNotifications();
        const count = res.data.filter((n: any) => !n.read).length;
        setUnreadCount(count);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnread();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenfit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenfit_theme', 'light');
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white italic uppercase tracking-tighter">{title}</h1>
        {subtitle && <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95 text-zinc-500 dark:text-zinc-400"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => navigate('/notifications')}
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95 text-zinc-500 dark:text-zinc-400"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-red text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-900">
              {unreadCount}
            </span>
          )}
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden active:scale-95 transition-transform shadow-sm"
        >
          <img src="https://picsum.photos/100/100" alt="Avatar" className="w-full h-full object-cover" />
        </button>
      </div>
    </header>
  );
};

export default Header;
