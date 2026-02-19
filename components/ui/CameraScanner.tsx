
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, RotateCcw, Zap, Sparkles, Loader2 } from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface CameraScannerProps {
  onClose: () => void;
  onCapture: (base64: string) => Promise<any>;
  title?: string;
  subtitle?: string;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onClose, onCapture, title = "Visual Protocol", subtitle = "Align target within the frame." }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    setError(null);
    stopCamera();
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          aspectRatio: { ideal: 4/3 },
          width: { ideal: 1280 }
        }
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsReady(true);
    } catch (err: any) {
      console.error("Camera access denied:", err);
      setError(err.name === 'NotAllowedError' ? "Permission denied. Please enable camera access in settings." : "Failed to initialize camera module.");
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    // Start camera when component is mounted (user initiated the modal)
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Maintain 4:3 aspect ratio
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(base64);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setResult(null);
    startCamera();
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;
    setLoading(true);
    try {
      const res = await onCapture(capturedImage);
      setResult(res.data);
    } catch (err) {
      setError("Protocol synchronization failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      {/* Header HUD */}
      <div className="p-6 flex items-center justify-between text-white safe-top relative z-10">
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
            {title}
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{subtitle}</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-[32px] mx-auto flex items-center justify-center text-red-500">
              <X className="w-10 h-10" />
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">{error}</p>
            <Button variant="secondary" onClick={startCamera}>Retry Initialization</Button>
          </div>
        ) : capturedImage ? (
          <div className="w-full h-full relative">
            <img src={capturedImage} className="w-full h-full object-cover grayscale-[0.2]" alt="Captured" />
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Analyzing Biometrics...</p>
              </div>
            )}
            {result && (
              <div className="absolute inset-x-6 bottom-32 animate-in slide-in-from-bottom-8 duration-500">
                <Card className="bg-zinc-900/90 backdrop-blur-xl border-white/10 text-white p-6 shadow-3xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1 block">AI Analysis Result</span>
                      <h3 className="text-2xl font-black tracking-tight leading-none">{result.name}</h3>
                    </div>
                    <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                      <p className="text-xs font-black text-orange-500">{result.calories} <span className="text-[8px] text-zinc-500">KCAL</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Protein</p>
                      <p className="text-xs font-black">{result.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Carbs</p>
                      <p className="text-xs font-black">{result.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Fat</p>
                      <p className="text-xs font-black">{result.fat}g</p>
                    </div>
                  </div>
                  <Button fullWidth onClick={onClose} className="mt-6 h-12 rounded-xl">Commit to Ledger</Button>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full relative bg-zinc-950">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`} 
            />
            {/* Viewfinder Overlay */}
            <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
               <div className="w-full h-full border border-white/20 relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white" />
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-10 pb-16 flex items-center justify-between safe-bottom">
        {capturedImage && !result ? (
          <>
            <button 
              onClick={handleRetake}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button 
              onClick={handleConfirm}
              disabled={loading}
              className="px-10 h-16 bg-blue-600 rounded-[28px] text-white font-black uppercase tracking-[0.3em] text-xs flex items-center gap-3 shadow-2xl shadow-blue-500/40 active:scale-95 transition-all"
            >
              <Check className="w-5 h-5" strokeWidth={3} /> Synchronize
            </button>
            <div className="w-14 h-14" /> {/* Spacer */}
          </>
        ) : !result ? (
          <>
            <button 
              onClick={switchCamera}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            
            <button 
              onClick={capturePhoto}
              className="group relative flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full border-4 border-white group-active:scale-90 transition-all" />
              <div className="absolute w-16 h-16 bg-white rounded-full scale-90 group-active:scale-100 transition-all" />
            </button>

            <button 
               onClick={onClose}
               className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </>
        ) : null}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScanner;
