
import React from 'react';
import { Home, Dumbbell, Utensils, Users, BarChart3, Plus, Settings, Camera } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface MobileNavProps {
  onQuickAdd: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onQuickAdd }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const NavItem = ({ icon: Icon, path }: any) => {
    const isActive = activePath === path;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'}`}
      >
        <Icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2} />
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass dark:bg-zinc-900/80 border-t border-zinc-100 dark:border-zinc-800 px-6 pt-4 pb-8 flex justify-between items-center z-40 md:hidden">
      <NavItem icon={Home} path="/" />
      <NavItem icon={Utensils} path="/food" />
      
      <button 
        onClick={onQuickAdd}
        className="bg-zinc-900 dark:bg-zinc-100 p-4 rounded-full text-white dark:text-zinc-900 shadow-xl active:scale-90 transition-all -mt-16 border-[6px] border-[#F9FAFB] dark:border-zinc-950 flex items-center justify-center group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
      </button>
      
      <NavItem icon={Dumbbell} path="/workouts" />
      <NavItem icon={Camera} path="/progress" />
    </nav>
  );
};

export default MobileNav;
