import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { Monitor, Wifi, Clock, Play } from 'lucide-react';

const ScreenPreview = () => {
  const { deviceId } = useParams();
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [screenInfo, setScreenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getMediaUrl = (path: string) => {
    if (!path) return '';
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const finalUrl = `${baseUrl}${cleanPath}`;
    console.log('🎬 Screen Media URL:', finalUrl);
    return finalUrl;
  };

  const fetchContent = async () => {
    try {
      const response = await API.get(`/device/${deviceId}`);
      if (response.data.current) {
        setCurrentVideo(response.data.current);
      } else {
        setCurrentVideo(null);
      }
      setScreenInfo(response.data.screen);
    } catch (err) {
      console.error('Failed to fetch screen content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    const interval = setInterval(fetchContent, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [deviceId]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black tracking-tighter text-2xl animate-pulse">BOOTING SCREEN...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <div className="flex-1 flex flex-col p-6 md:p-10 max-w-[1600px] mx-auto w-full">
        {/* Screen Header */}
        <div className="flex items-center justify-between mb-8 bg-zinc-900/50 p-6 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Monitor size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{screenInfo?.name || 'VIRTUAL SCREEN'}</h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">{screenInfo?.location || 'Vijayawada, India'}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <Wifi size={14} className="animate-pulse" /> ONLINE
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Device ID</p>
              <p className="font-mono text-sm text-zinc-300">{deviceId}</p>
            </div>
          </div>
        </div>

        {/* The "Physical" LED Screen Container */}
        <div className="relative aspect-video bg-black rounded-[40px] overflow-hidden border-[12px] border-zinc-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          {/* LED Panel Mesh Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[radial-gradient(circle,transparent_20%,#000_20%)] bg-[length:3px_3px]" />
          
          {currentVideo ? (
            <div className="absolute inset-0">
              {currentVideo.url?.match(/\.(mp4|webm|mov)$/i) ? (
                <video 
                  key={currentVideo._id}
                  src={getMediaUrl(currentVideo.url)}
                  autoPlay 
                  loop 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={getMediaUrl(currentVideo.url)} 
                  className="w-full h-full object-cover shadow-inner"
                  alt="Current Ad"
                />
              )}
              {/* Overlay info */}
              <div className="absolute bottom-10 left-10 z-20 flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-black tracking-widest uppercase text-white/90">NOW PLAYING: {currentVideo.title}</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-700">
              <Clock size={80} className="mb-4 opacity-20" />
              <p className="text-2xl font-black uppercase tracking-[0.2em] opacity-40">WAITING FOR CONTENT</p>
              <p className="text-sm font-bold text-zinc-600 mt-2">IDLE MODE ACTIVE</p>
            </div>
          )}
        </div>

        {/* Screen Controls/Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Current Playlist</h3>
            <div className="space-y-4">
              {currentVideo ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-200">{currentVideo.title}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">{currentVideo.duration}s Loop</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-600 italic">No items scheduled</p>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-900/20 to-transparent p-8 rounded-3xl border border-indigo-500/10">
             <h3 className="text-lg font-black tracking-tight mb-2">Screen Operator Note</h3>
             <p className="text-zinc-400 text-sm leading-relaxed">
               This is a high-fidelity virtual representation of the <span className="text-white font-bold">{screenInfo?.name}</span>. 
               In a production environment, this page would be displayed on the physical LED cabinet hardware. 
               Content synchronization is managed by the Jaan Entertainment Central Scheduler.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenPreview;
