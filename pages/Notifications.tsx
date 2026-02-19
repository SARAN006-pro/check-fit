
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fitnessApi } from '../api/axios';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  Bell, 
  CheckCheck, 
  TrendingUp, 
  Users, 
  Award, 
  Zap, 
  Trash2, 
  ChevronRight, 
  Clock,
  Settings,
  Filter,
  ShieldCheck,
  MoreHorizontal
} from 'lucide-react';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system' | 'social'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fitnessApi.getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fitnessApi.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // 1. Mark as read
    if (!notification.read) {
      await markRead(notification.id);
    }
    // 2. Redirect to the exact path specified by the notification
    if (notification.path) {
      navigate(notification.path);
    }
  };

  const markAllRead = async () => {
    try {
      await fitnessApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (activeTab === 'unread') return !n.read;
      if (activeTab === 'system') return n.type === 'system';
      if (activeTab === 'social') return n.type === 'social';
      return true;
    });
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-zinc-100 rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-zinc-100 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return <Award className="w-5 h-5 text-yellow-500" />;
      case 'social': return <Users className="w-5 h-5 text-blue-500" />;
      case 'workout': return <Zap className="w-5 h-5 text-orange-500" />;
      case 'system': return <ShieldCheck className="w-5 h-5 text-zinc-900" />;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <Header title="Alert Center" subtitle={`Monitoring ${notifications.length} performance events.`} />
        <button className="w-10 h-10 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 shadow-sm">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Category Tabs */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-[20px] overflow-x-auto no-scrollbar">
          {(['all', 'unread', 'system', 'social'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400'
              }`}
            >
              {tab === 'unread' ? `Unread (${unreadCount})` : tab}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-700 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Activity Feed */}
      <section className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => (
            <Card 
              key={n.id} 
              onClick={() => handleNotificationClick(n)}
              className={`p-5 flex items-start gap-5 border-zinc-100 dark:border-zinc-800 transition-all group cursor-pointer ${
                !n.read ? 'bg-white dark:bg-zinc-900 border-l-4 border-l-blue-600 shadow-premium' : 'bg-zinc-50/50 dark:bg-zinc-900/40 opacity-70'
              } hover:border-zinc-300 dark:hover:border-zinc-600`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                !n.read ? 'bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}>
                {getIcon(n.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-black tracking-tight ${!n.read ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {getTimeAgo(n.timestamp)}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${!n.read ? 'text-zinc-600 dark:text-zinc-400 font-medium' : 'text-zinc-400'}`}>
                  {n.message}
                </p>
                
                <div className="pt-2 flex items-center gap-3">
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    Interact <ChevronRight className="w-3 h-3" />
                  </button>
                  {!n.read && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <button onClick={(e) => { e.stopPropagation(); markRead(n.id); }} className="text-[9px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-100">Dismiss</button>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {n.priority === 'high' && !n.read && (
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
                <button className="p-2 text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-900 rounded-[28px] border-2 border-dashed border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
              <Bell className="w-8 h-8 text-zinc-200 dark:text-zinc-700" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">System Silence</h3>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">No performance alerts in this buffer.</p>
            </div>
          </div>
        )}
      </section>

      <div className="pt-8 text-center border-t border-zinc-100 dark:border-zinc-800">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
          ZENFIT ALERT PROTOCOL SYNCHRONIZED. <br />
          NODE ID: 0xFF2A-4B2
        </p>
      </div>
    </div>
  );
};

export default Notifications;
