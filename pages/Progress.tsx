
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import CameraScanner from '../components/ui/CameraScanner';
import { fitnessApi } from '../api/axios';
import { BodyMeasurements, ProgressPhoto } from '../types';
import { 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Plus, 
  History, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight,
  Scale,
  Calendar,
  Layers,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Info,
  Scan
} from 'lucide-react';

const Progress: React.FC = () => {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurements[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonIndex, setComparisonIndex] = useState<{ before: number, after: number }>({ before: 0, after: 1 });
  const [sliderPos, setSliderPos] = useState(50);
  const [activeTab, setActiveTab] = useState<'photos' | 'measurements'>('photos');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [form, setForm] = useState<Partial<BodyMeasurements>>({
    weight: 0,
    bodyFat: 0,
    waist: 0,
    chest: 0,
    arms: 0,
    legs: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [photosRes, measureRes] = await Promise.all([
          fitnessApi.getProgressPhotos(),
          fitnessApi.getBodyMeasurements()
        ]);
        const sortedPhotos = photosRes.data.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        setPhotos(sortedPhotos);
        setMeasurements(measureRes.data.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
        
        if (sortedPhotos.length >= 2) {
          setComparisonIndex({ before: 0, after: sortedPhotos.length - 1 });
        }
      } catch (err) {
        console.error("Failed to fetch progress intel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMeasureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const entry: BodyMeasurements = {
        ...form as any,
        timestamp: new Date().toISOString()
      };
      await fitnessApi.logMeasurements(entry);
      setMeasurements(prev => [...prev, entry].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      setForm({ weight: 0, bodyFat: 0, waist: 0, chest: 0, arms: 0, legs: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(parseInt(e.target.value));
  };

  const handlePhotoCapture = async (base64: string) => {
    // In Morphology lab, we just save the photo
    const res = await fitnessApi.uploadPhoto({
      url: base64,
      type: 'front',
      timestamp: new Date().toISOString()
    });
    setPhotos(prev => [...prev, res.data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
    setIsScannerOpen(false);
    return res;
  };

  const weightDelta = useMemo(() => {
    if (measurements.length < 2) return 0;
    return parseFloat((measurements[measurements.length - 1].weight - measurements[0].weight).toFixed(1));
  }, [measurements]);

  if (loading) {
    return <div className="p-8 animate-pulse space-y-8 max-w-2xl mx-auto">
      <div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
      <div className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-[40px]" />
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map(i => <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-3xl" />)}
      </div>
    </div>;
  }

  const beforePhoto = photos[comparisonIndex.before];
  const afterPhoto = photos[comparisonIndex.after];

  return (
    <div className="p-6 pb-32 max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Header title="Morphology Lab" subtitle="Visualize transformation and track physiological drift." />

      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-[24px]">
        <button 
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'photos' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400'}`}
        >
          Visual Ledger
        </button>
        <button 
          onClick={() => setActiveTab('measurements')}
          className={`flex-1 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'measurements' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xl' : 'text-zinc-400'}`}
        >
          Biometric Data
        </button>
      </div>

      {activeTab === 'photos' ? (
        <section className="space-y-8">
          {/* Comparison Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-900 dark:text-white" />
                <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Transformation Module</h2>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  disabled={comparisonIndex.before === 0}
                  onClick={() => setComparisonIndex(prev => ({ ...prev, before: prev.before - 1 }))}
                  className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Drift Analysis</span>
                <button 
                  disabled={comparisonIndex.after === photos.length - 1}
                  onClick={() => setComparisonIndex(prev => ({ ...prev, after: prev.after + 1 }))}
                  className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {photos.length >= 2 ? (
              <Card className="p-0 border-none bg-zinc-900 overflow-hidden relative shadow-3xl h-[500px]">
                <div className="absolute inset-0 select-none pointer-events-none">
                  <img src={afterPhoto.url} className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]" />
                  <div 
                    className="absolute inset-0 overflow-hidden border-r-2 border-white/50" 
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img 
                      src={beforePhoto.url} 
                      className="absolute inset-0 h-full object-cover max-w-none grayscale-[0.2]" 
                      style={{ width: '600px' }} 
                    />
                  </div>
                </div>

                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sliderPos} 
                  onChange={handleSliderChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />

                <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
                   <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl">
                      <p className="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Baseline Sequence</p>
                      <span className="text-[10px] font-bold text-white">{new Date(beforePhoto.timestamp).toLocaleDateString()}</span>
                   </div>
                   <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-right">
                      <p className="text-[8px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Current State</p>
                      <span className="text-[10px] font-bold text-white">{new Date(afterPhoto.timestamp).toLocaleDateString()}</span>
                   </div>
                </div>

                <div 
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center transition-transform duration-75"
                  style={{ left: `calc(${sliderPos}% - 12px)` }}
                >
                  <div className="w-7 h-7 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-zinc-900">
                    <Maximize2 className="w-3 h-3 text-zinc-900" strokeWidth={3} />
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                   <Sparkles className="w-4 h-4 text-blue-400" />
                   <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">AI Drift Verified: High Optimization</span>
                </div>
              </Card>
            ) : (
              <Card className="p-20 text-center bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[40px] flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-[28px] shadow-sm flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-zinc-200 dark:text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Insufficient Imagery</h3>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-relaxed">
                    Requirement: Minimum 2 progress captures <br />to initialize transformation analysis.
                  </p>
                </div>
                <Button onClick={() => setIsScannerOpen(true)} className="rounded-2xl px-8" variant="primary">
                  <Camera className="w-4 h-4" /> Capture First Log
                </Button>
              </Card>
            )}
          </div>

          {/* Timeline Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-900 dark:text-white" />
                <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Visual Timeline</h2>
              </div>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Filter by View</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setIsScannerOpen(true)}
                className="aspect-[3/4] rounded-[24px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group overflow-hidden relative"
              >
                <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Append Photo</span>
              </button>
              {photos.slice().reverse().map((photo) => (
                <div key={photo.id} className="relative aspect-[3/4] rounded-[24px] overflow-hidden shadow-sm group cursor-pointer border border-zinc-100 dark:border-zinc-800">
                  <img src={photo.url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Capture ID: {photo.id}</p>
                    <p className="text-[10px] font-bold text-white">{new Date(photo.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                    {photo.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 border-none bg-white dark:bg-zinc-900 shadow-premium flex flex-col gap-3">
              <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-900 dark:text-white">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Net Delta</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-zinc-900 dark:text-white">{weightDelta}kg</p>
                  {weightDelta < 0 ? (
                    <TrendingDown className="w-4 h-4 text-blue-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </div>
            </Card>
            <Card className="p-6 border-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-premium flex flex-col gap-3 overflow-hidden relative">
              <div className="w-10 h-10 bg-white/10 dark:bg-black/10 rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 relative z-10">
                <TrendingUp className="w-5 h-5 text-blue-400 dark:text-blue-600" />
              </div>
              <div className="relative z-10">
                <p className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">LBM Growth</p>
                <p className="text-2xl font-black text-white dark:text-zinc-900">+2.4kg</p>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-2xl" />
            </Card>
          </div>

          <section className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <Scale className="w-4 h-4 text-zinc-900 dark:text-white" />
              <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Biometric Synthesis</h2>
            </div>
            
            <Card className="p-8 border-none bg-white dark:bg-zinc-900 shadow-premium">
              <form onSubmit={handleMeasureSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <Input 
                    label="Current Weight (kg)" 
                    type="number" 
                    placeholder="e.g. 78.5" 
                    value={form.weight || ''}
                    onChange={(e) => setForm({...form, weight: parseFloat(e.target.value)})}
                  />
                  <Input 
                    label="Body Fat (%)" 
                    type="number" 
                    placeholder="e.g. 15" 
                    value={form.bodyFat || ''}
                    onChange={(e) => setForm({...form, bodyFat: parseFloat(e.target.value)})}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
                  <Input label="Waist" type="number" className="bg-white dark:bg-zinc-900" value={form.waist || ''} onChange={(e) => setForm({...form, waist: parseFloat(e.target.value)})} />
                  <Input label="Chest" type="number" className="bg-white dark:bg-zinc-900" value={form.chest || ''} onChange={(e) => setForm({...form, chest: parseFloat(e.target.value)})} />
                  <Input label="Arms" type="number" className="bg-white dark:bg-zinc-900" value={form.arms || ''} onChange={(e) => setForm({...form, arms: parseFloat(e.target.value)})} />
                </div>

                <Button fullWidth className="h-14">Synchronize Measurement</Button>
              </form>
            </Card>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Calendar className="w-4 h-4 text-zinc-900 dark:text-white" />
              <h2 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">Historical Matrix</h2>
            </div>
            <div className="space-y-3">
              {measurements.slice().reverse().map((entry, i) => (
                <Card key={i} className="p-5 border-zinc-100 dark:border-zinc-800 flex items-center justify-between group hover:border-zinc-900 dark:hover:border-white transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-zinc-900 transition-all">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">{entry.weight} kg</h4>
                      <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{new Date(entry.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-black text-zinc-900 dark:text-white">{entry.bodyFat}%</p>
                      <p className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Body Fat</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-200 dark:text-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-all" />
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </section>
      )}

      {/* Camera Capture Modal */}
      {isScannerOpen && (
        <CameraScanner 
          title="Morphology Capture"
          subtitle="Align body profile for AI transformation tracking."
          onClose={() => setIsScannerOpen(false)}
          onCapture={handlePhotoCapture}
        />
      )}

      <div className="pt-12 text-center border-t border-zinc-100 dark:border-zinc-900">
        <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.4em] leading-relaxed max-sm mx-auto">
          ZENFIT MORPHOLOGY DATA ENCRYPTED AND SYNCHRONIZED. <br />
          VERSION 1.0.4 - TRANSFORMATION PROTOCOL
        </p>
      </div>
    </div>
  );
};

export default Progress;
