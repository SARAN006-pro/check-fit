
import React, { useState, useEffect, useMemo } from 'react';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import FriendLeaderboard from '../components/ui/FriendLeaderboard';
// Added missing Button import
import Button from '../components/ui/Button';
import { 
  Users, 
  Shield, 
  Plus, 
  Search, 
  Hash,
  TrendingUp,
  Medal,
  Zap,
  ChevronRight
} from 'lucide-react';
import { SquadChallenge } from '../types';

const Challenges: React.FC = () => {
  const [challenge, setChallenge] = useState<SquadChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'squads'>('leaderboard');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fitnessApi.getSquadChallenge();
        setChallenge(res.data);
      } catch (err) {
        console.error("Failed to load squad challenge:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupProgress = useMemo(() => {
    if (!challenge) return 0;
    return Math.round((challenge.currentValue / challenge.targetValue) * 100);
  }, [challenge]);

  if (loading || !challenge) return <div className="p-8 h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-6 pb-40 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <Header title="Force Matrix" subtitle="Global Performance Ledger" />

      {/* Squad Achievement */}
      <section className="relative">
        <Card className="p-12 border-none bg-zinc-900 overflow-hidden relative shadow-3xl group">
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-brand-red fill-brand-red animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">Protocol Active</span>
                </div>
                <h2 className="text-4xl font-black tracking-tighter leading-none text-white uppercase italic">{challenge.name}</h2>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Termination In</p>
                 <p className="text-4xl font-black text-brand-gold italic tracking-tighter">{challenge.daysRemaining}D</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
                <span>Synchronized Progress</span>
                <span className="text-brand-green">{groupProgress}%</span>
              </div>
              <div className="h-4 w-full bg-black rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div className="h-full bg-gradient-to-r from-brand-red via-brand-orange to-brand-green shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all duration-[2s]" style={{ width: `${groupProgress}%` }} />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
        </Card>
      </section>

      {/* Tab Select */}
      <div className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-[32px] flex items-center shadow-inner max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-4 rounded-[26px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${
            activeTab === 'leaderboard' ? 'bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-2xl scale-105' : 'text-zinc-600'
          }`}
        >
          Performance
        </button>
        <button 
          onClick={() => setActiveTab('squads')}
          className={`flex-1 py-4 rounded-[26px] text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${
            activeTab === 'squads' ? 'bg-gradient-to-br from-zinc-700 to-zinc-900 text-white shadow-2xl scale-105' : 'text-zinc-600'
          }`}
        >
          Directories
        </button>
      </div>

      {activeTab === 'leaderboard' ? (
        <section className="space-y-12">
          {/* Custom Stylized Leaderboard for Gym Vibe */}
          <div className="grid grid-cols-1 gap-6">
            {challenge.members.map((member, i) => {
              const isFirst = member.rank === 1;
              const isSecond = member.rank === 2;
              const isThird = member.rank === 3;
              
              const rankColor = isFirst ? 'text-brand-gold' : isSecond ? 'text-zinc-400' : isThird ? 'text-orange-700' : 'text-zinc-700';
              const rankBg = isFirst ? 'bg-brand-gold/10' : 'bg-zinc-800/30';
              const borderCol = isFirst ? 'border-brand-gold/40' : 'border-zinc-800';

              return (
                <Card key={member.id} className={`p-8 flex items-center justify-between border-2 ${borderCol} ${rankBg} group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-rotate-1`}>
                  <div className="flex items-center gap-10 relative z-10">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center font-black text-3xl italic ${rankColor} shadow-2xl bg-black border border-white/5`}>
                      #{member.rank}
                    </div>
                    <div className="w-20 h-20 rounded-[28px] overflow-hidden border-4 border-black shadow-2xl relative">
                       <img src={member.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={member.name} />
                       {isFirst && <div className="absolute inset-0 border-4 border-brand-gold animate-pulse rounded-[28px]" />}
                    </div>
                    <div>
                      <h4 className={`text-2xl font-black tracking-tighter ${member.isCurrentUser ? 'text-brand-red' : 'text-white'} uppercase italic`}>{member.name}</h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] mt-1">Output Share: <span className="text-brand-green">{member.contributionPercent}%</span></p>
                    </div>
                  </div>
                  <div className="text-right relative z-10">
                    <p className="text-4xl font-black text-white italic tracking-tighter">{member.points.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Force Points</p>
                  </div>
                  {isFirst && <Zap className="absolute -right-10 -bottom-10 w-40 h-40 text-brand-gold/5 rotate-12 group-hover:scale-125 transition-transform duration-1000" />}
                </Card>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="py-20 text-center space-y-12">
           <div className="w-32 h-32 bg-zinc-900 rounded-[40px] flex items-center justify-center mx-auto border-4 border-zinc-800 shadow-3xl animate-float">
              <Users className="w-14 h-14 text-zinc-700" />
           </div>
           <div className="space-y-4">
              <h3 className="text-3xl font-black uppercase tracking-tighter italic">SQUAD ENCRYPTION ACTIVE</h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.6em] max-sm mx-auto leading-loose">Access to private directories requires high-level force clearance.</p>
           </div>
           <Button variant="secondary" className="px-12 rounded-full h-16">Request Permission</Button>
        </section>
      )}

      <div className="pt-24 text-center opacity-10 border-t border-zinc-900">
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[1.5em]">
          VICTORY OR DEFEAT
        </p>
      </div>
    </div>
  );
};

export default Challenges;
