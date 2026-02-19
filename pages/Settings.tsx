
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { fitnessApi } from '../api/axios';
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
  // Initialize navigate function using hook from react-router-dom
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
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
      setSuccessMsg("Profile identity synchronized successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !profile) return <div className="p-12 animate-pulse space-y-8 max-w-4xl mx-auto"><div className="h-64 bg-zinc-100 rounded-[40px]" /></div>;

  return (
    <div className="p-6 pb-32 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Header title="Control Center" subtitle="Manage your biometric identity and platform configurations." />
        <div className="flex gap-2 p-1.5 bg-zinc-100 rounded-2xl self-start">
          {(['account', 'billing', 'security', 'integrations'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-100 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-green-800 uppercase tracking-[0.2em]">{successMsg}</p>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <User className="w-4 h-4 text-zinc-900" />
                <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Biological Profile</h2>
              </div>
              <Card className="p-10 border-none shadow-premium bg-white">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12 pb-12 border-b border-zinc-50">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-[40px] border-8 border-zinc-50 overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                      <img src="https://picsum.photos/300/300" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-3 bg-zinc-900 text-white rounded-2xl shadow-xl border-4 border-white hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="text-3xl font-black tracking-tighter text-zinc-900">{profile.name}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-blue-100">
                        {profile.tier}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                  <Input label="Email Node" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                  <Button fullWidth loading={saving} type="submit" className="h-16 rounded-2xl md:col-span-full shadow-2xl shadow-zinc-900/10 uppercase tracking-widest font-black text-xs">
                    Commit Changes
                  </Button>
                </form>
              </Card>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Bell className="w-4 h-4 text-zinc-900" />
                <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Notification Matrix</h2>
              </div>
              <Card className="p-0 border-none shadow-premium bg-white overflow-hidden divide-y divide-zinc-50">
                {[
                  { id: 'workoutReminders', icon: Activity, title: 'Training Reminders', desc: 'Protocol push alerts 15m before scheduled activity.' },
                  { id: 'achievementAlerts', icon: Zap, title: 'Merit Gains', desc: 'Notify on rank evolution and badge unlocks.' },
                  { id: 'marketingEmails', icon: Mail, title: 'System Updates', desc: 'Bi-weekly newsletters and performance insights.' }
                ].map((pref) => (
                  <div key={pref.id} className="p-6 flex items-center justify-between group hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                        <pref.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-zinc-900">{pref.title}</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{pref.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => togglePreference(pref.id)}
                      className={`w-14 h-7 rounded-full transition-all relative ${profile.preferences[pref.id] ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                    >
                      <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all ${profile.preferences[pref.id] ? 'left-8' : 'left-1.5'}`} />
                    </button>
                  </div>
                ))}
              </Card>
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Globe className="w-4 h-4 text-zinc-900" />
                <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Regional Config</h2>
              </div>
              <Card className="p-8 border-none bg-white shadow-premium space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Unit Measurement</label>
                  <div className="flex bg-zinc-100 p-1 rounded-2xl">
                    <button onClick={() => setProfile({...profile, preferences: {...profile.preferences, units: 'metric'}})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${profile.preferences.units === 'metric' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}>Metric</button>
                    <button onClick={() => setProfile({...profile, preferences: {...profile.preferences, units: 'imperial'}})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${profile.preferences.units === 'imperial' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}>Imperial</button>
                  </div>
                </div>
              </Card>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Database className="w-4 h-4 text-zinc-900" />
                <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Data Management</h2>
              </div>
              <Card className="p-8 border-none bg-zinc-900 text-white shadow-premium space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <CloudUpload className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Backup Sync</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white" />
                </button>
                <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-all group">
                  <div className="flex items-center gap-4">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Purge Data</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-800" />
                </button>
              </Card>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <CreditCard className="w-4 h-4 text-zinc-900" />
              <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Protocol Subscription</h2>
            </div>
            <Card className="p-10 border-none bg-zinc-900 text-white overflow-hidden relative shadow-3xl">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-4">
                  <div className="inline-flex px-3 py-1 bg-blue-600 text-[8px] font-black uppercase tracking-widest rounded-full">Pro Performance Active</div>
                  <h3 className="text-4xl font-black tracking-tighter">ZenFit Elite Plan</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Next synchronization: June 14, 2024</p>
                </div>
                <Button className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-[24px] px-8 h-16 uppercase tracking-widest font-black text-xs">Manage Billing</Button>
              </div>
            </Card>
          </section>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <Shield className="w-4 h-4 text-zinc-900" />
              <h2 className="text-xs font-black text-zinc-900 uppercase tracking-widest">Access & Encryption</h2>
            </div>
            <Card className="p-8 border-none bg-white shadow-premium space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-zinc-900 tracking-tight">Security Credentials</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rotate access keys.</p>
                  </div>
                </div>
                <Button variant="secondary" className="rounded-2xl px-6 font-black text-[10px] uppercase">Update</Button>
              </div>
            </Card>
          </section>
        </div>
      )}

      <div className="pt-20 text-center border-t border-zinc-100 flex flex-col items-center gap-8">
        <button onClick={() => navigate('/login')} className="flex items-center gap-3 px-10 py-5 bg-zinc-900 text-white rounded-[28px] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-3xl shadow-zinc-400 active:scale-95 group">
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
        </button>
        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.6em]">ZENFIT STABLE 4.2.2</p>
      </div>
    </div>
  );
};

export default Settings;
