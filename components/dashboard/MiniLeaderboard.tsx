
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Friend {
  name: string;
  avatar: string;
  points: number;
  rank: number;
  shift: 'up' | 'down' | 'steady';
}

const MiniLeaderboard: React.FC<{ friends: Friend[] }> = ({ friends }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Social Matrix</h3>
        </div>
        <button 
          onClick={() => navigate('/challenges')}
          className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline"
        >
          View Full Ledger
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-6 space-y-5 shadow-inner">
        {friends.slice(0, 3).map((friend, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                  <img src={friend.avatar} className="w-full h-full object-cover" alt={friend.name} />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[8px] font-black text-zinc-950 ${i === 0 ? 'bg-yellow-500' : 'bg-zinc-600'}`}>
                  {friend.rank}
                </div>
              </div>
              <div>
                <p className="text-xs font-black text-white">{friend.name}</p>
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{friend.points.toLocaleString()} PTS</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 ${friend.shift === 'up' ? 'text-green-500' : friend.shift === 'down' ? 'text-red-500' : 'text-zinc-600'}`}>
              <TrendingUp className={`w-3 h-3 ${friend.shift === 'down' ? 'rotate-180' : ''} ${friend.shift === 'steady' ? 'hidden' : ''}`} />
              <span className="text-[10px] font-black">{friend.shift.toUpperCase()}</span>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
             You are ahead of <span className="font-black underline">2 friends</span> today
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniLeaderboard;
