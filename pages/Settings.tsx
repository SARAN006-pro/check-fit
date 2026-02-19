
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { fitnessApi } from '../api/axios';
import { useNotification } from '../components/ui/NotificationEngine';
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  Bell, 
  Globe, 
  Smartphone, 
  CreditCard, 
  Trash2, 
  ChevronRight, 
  Camera, 
  LogOut, 
  CheckCircle2, 
  Lock, 
  Database,
  CloudUpload,
  Mail,
  Zap,
  Activity,
  Cpu,
  SmartphoneNfc,
  Monitor,
  Key,
  History,
  Heart,
  FileText
} from 'lucide-react';

const Settings: React.FC = () => {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'security' | 'integrations'>('account');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fitnessApi.getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fitnessApi.updateProfile(profile);
      notify({ 
        type: 'success', 
        title: 'Identity Commited', 
        message: 'iCtrl parameters have been synchronized with the core database.' 
      });
    } catch (err) {
      console.error(err);
      notify({ 
        type: 'warning', 
        title: 'Identity Sync Failed', 
        message: 'Could not establish a stable uplink for profile update.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = async (key: string) => {
    const newVal = !profile.preferences[key];
    const updatedPrefs = { ...profile.preferences, [key]: newVal };
    setProfile({ ...profile, preferences: updatedPrefs });
    try {
      await fitnessApi.updateSettings({ [key]: newVal });
      notify({ 
        type: 'impact', 
        title: 'Parameter Optimized', 
        message: `System preference ${key} has been toggled to ${newVal ? 'Active' : 'Standby'}.`,
        progress: 100
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !profile) return <div className="p-12 animate-pulse space-y-8 max-w-4xl mx-auto"><div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-[40px]" /></div>;

  return (
    <div className="p-6 pb-32 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Header title="iCtrl Node Config" subtitle="Manage your biometric identity and platform configurations." />
        <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl self-start">
          {(['account', 'billing', 'security', 'integrations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <User className="w-4 h-4 text-zinc-900 dark:text-white" />
                <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Biological Profile</h2>
              </div>
              <Card className="p-10 border-none shadow-premium bg-white dark:bg-zinc-900/60">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12 pb-12 border-b border-zinc-50 dark:border-zinc-800">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] border-8 border-zinc-50 dark:border-zinc-800 overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                      <img src="https://picsum.photos/300/300" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl shadow-xl border-4 border-white dark:border-zinc-900 hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">{profile.name}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-800">
                        {profile.tier}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Identity Label" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                  <Input label="Email Node" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                  <Button fullWidth loading={saving} type="submit" className="h-16 rounded-2xl md:col-span-full shadow-2xl shadow-zinc-900/10 uppercase tracking-widest font-black text-xs">
                    Commit Changes
                  </Button>
                </form>
              </Card>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <CreditCard className="w-4 h-4 text-zinc-900 dark:text-white" />
              <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">iCtrl Subscription</h2>
            </div>
            <Card className="p-10 border-none bg-zinc-900 text-white overflow-hidden relative shadow-3xl">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4">
                  <div className="inline-flex px-3 py-1 bg-purple-600 text-[8px] font-black uppercase tracking-widest rounded-full">Pro Performance Active</div>
                  <h3 className="text-4xl font-black tracking-tighter">iCtrl Elite Plan</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Next synchronization: June 14, 2024</p>
                </div>
                <Button className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-[24px] px-8 h-16 uppercase tracking-widest font-black text-xs">Manage Billing</Button>
              </div>
            </Card>
          </section>
        </div>
      )}

      <div className="pt-20 text-center border-t border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-8">
        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black dark:hover:bg-zinc-100 transition-all shadow-3xl shadow-zinc-400 dark:shadow-none active:scale-95 group">
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
        <p className="text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.6em]">iCTRL STABLE 4.2.2</p>
      </div>
    </div>
  );
};

export default Settings;
