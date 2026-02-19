
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import ProgressRing from '../components/dashboard/ProgressRing';
import DailyCTA from '../components/dashboard/DailyCTA';
import MiniLeaderboard from '../components/dashboard/MiniLeaderboard';
import WeeklyStats from '../components/dashboard/WeeklyStats';
import Achievements from '../components/dashboard/Achievements';
import CoachMessage from '../components/dashboard/CoachMessage';
import { Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const mockFriends = [
    { name: 'Sarah Chen', avatar: 'https://picsum.photos/100/100?sig=1', points: 12450, rank: 1, shift: 'steady' },
    { name: 'Alex Johnson', avatar: 'https://picsum.photos/100/100?sig=2', points: 11200, rank: 2, shift: 'up' },
    { name: 'Marcus Aurelius', avatar: 'https://picsum.photos/100/100?sig=3', points: 8400, rank: 3, shift: 'down' },
  ] as const;

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [dashRes] = await Promise.all([
          fitnessApi.getDashboard()
        ]);
        setData(dashRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center h-screen animate-pulse">
        <div className="w-64 h-64 border-[16px] border-zinc-100 dark:border-zinc-900 rounded-full mb-12" />
        <div className="w-full h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] mb-6" />
        <div className="grid grid-cols-2 gap-4 w-full">
           <div className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-[32px]" />
           <div className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6 pb-32 max-w-2xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <Header title="iCtrl Performance Core" subtitle="Live Biometric Feed" />

      <section className="relative">
        <ProgressRing 
          percentage={88} 
          burned={data?.burned || 1842} 
          goal={data?.goal || 2400} 
          streak={data?.streak || 14} 
        />
      </section>

      <CoachMessage />

      <section className="sticky top-4 z-30 shadow-2xl">
        <DailyCTA status="workout" />
      </section>

      <MiniLeaderboard friends={[...mockFriends]} />

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">Operational Drift</h3>
        </div>
        <WeeklyStats />
      </section>

      <Achievements />

      <div className="pt-12 text-center border-t border-zinc-200 dark:border-white/5 opacity-30">
        <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.6em]">
          iCTRL BIOMETRIC OS • v4.2.0 STABLE
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
