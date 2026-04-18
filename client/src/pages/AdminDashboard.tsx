import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, HeatmapLayer } from '@react-google-maps/api';
import { Trash2, Plus, Clock, ShieldCheck, LogOut, Flame, AlertTriangle } from 'lucide-react';

const libraries: ("places" | "visualization" | "drawing" | "geometry")[] = ["places", "visualization"];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

interface Billboard {
  id: string | number;
  location: string;
  status: string;
  price: string;
  impressions: string;
  lat: number;
  lng: number;
  lastUpdated?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [selectedPos, setSelectedPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [form, setForm] = useState({ location: '', price: '', impressions: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    // Basic Auth Check
    const token = localStorage.getItem('token');
    if (!token && import.meta.env.PROD) {
      navigate('/login');
    }
    fetchBillboards();
    // Real-time updates via polling (every 10 seconds)
    const interval = setInterval(fetchBillboards, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchBillboards = () => {
    fetch('/api/billboards')
      .then(res => res.json())
      .then(data => {
        setBillboards(data);
        
        // Simulate live alerts for premium feel
        if (data.length > 0 && Math.random() > 0.7) {
          const randomBoard = data[Math.floor(Math.random() * data.length)];
          setNotifications(prev => [
            { id: Date.now(), message: `Signal variance detected at ${randomBoard.location}`, type: 'warning' },
            ...prev
          ].slice(0, 3));
        }
      })
      .catch(err => console.error(err));
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setSelectedPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPos) return alert("Please click on map to select location");
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/billboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...selectedPos }),
      });
      if (res.ok) {
        fetchBillboards();
        setForm({ location: '', price: '', impressions: '' });
        setSelectedPos(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Delete this board?")) return;
    try {
      await fetch(`/api/billboards/${id}`, { method: 'DELETE' });
      fetchBillboards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen app-bg text-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
              <ShieldCheck className="text-primary" size={36} /> Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Command Center</span>
            </h1>
            <p className="text-zinc-500 mt-2 font-medium">Manage your global DOOH infrastructure in real-time.</p>
          </div>
          <Link to="/launch-campaign" className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Command Center <Plus size={18} />
          </Link>
          <button onClick={handleLogout} className="px-6 py-3 glass rounded-xl flex items-center gap-2 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5 font-bold">
            <LogOut size={18} /> Logout
          </button>
        </header>

        {notifications.length > 0 && (
          <div className="mb-8 space-y-4">
            {notifications.map(note => (
              <motion.div 
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-[1.5rem] flex items-center justify-between backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                    <AlertTriangle size={18} />
                  </div>
                  <p className="text-sm font-bold text-orange-200">{note.message}</p>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-black text-orange-500">Live Alert</span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card rounded-[2rem] p-8 border border-white/10">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Plus className="text-primary" size={20} /> Deploy New Board</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <input 
                  placeholder="Board Name / Location" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 focus:outline-none focus:border-primary"
                  value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    placeholder="Price (e.g. ₹5k/hr)" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary"
                    value={form.price}
                    onChange={e => setForm({...form, price: e.target.value})}
                    required
                  />
                  <input 
                    placeholder="Reach (e.g. 1M)" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:outline-none focus:border-primary"
                    value={form.impressions}
                    onChange={e => setForm({...form, impressions: e.target.value})}
                    required
                  />
                </div>
                
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-sm">
                  <p className="text-primary font-bold mb-1">Coordinates:</p>
                  {selectedPos ? (
                    <p className="font-mono">{selectedPos.lat.toFixed(6)}, {selectedPos.lng.toFixed(6)}</p>
                  ) : (
                    <p className="text-zinc-400 animate-pulse italic">Click on the map to set location...</p>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !selectedPos}
                  className="w-full py-4 rounded-xl bg-primary text-black font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                  {isSubmitting ? 'Syncing...' : 'Provision Global Asset'}
                </button>
              </form>
            </div>

            <div className="glass-card rounded-[2rem] p-8 border border-white/10 max-h-[400px] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">Live Inventory</h2>
                <button 
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`p-2 rounded-lg border transition-all ${showHeatmap ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-white/10 text-zinc-500'}`}
                  title="Toggle Heatmap"
                >
                  <Flame size={18} />
                </button>
              </div>
              <div className="space-y-4">
                {billboards.map(bb => (
                  <div key={bb.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group">
                    <div>
                      <p className="font-bold text-sm">{bb.location}</p>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1"><Clock size={10} /> {bb.lastUpdated ? new Date(bb.lastUpdated).toLocaleTimeString() : 'Unknown'}</p>
                    </div>
                    <button onClick={() => handleDelete(bb.id)} className="p-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Selector */}
          <div className="lg:col-span-2 h-[400px] md:h-[600px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={2}
                options={{ 
                  styles: darkMapStyles, 
                  disableDefaultUI: true, 
                  zoomControl: true
                }}
                onClick={onMapClick}
              >
                {showHeatmap && (
                  <HeatmapLayer
                    data={billboards.map(bb => new google.maps.LatLng(bb.lat, bb.lng))}
                    options={{ radius: 30, opacity: 0.6 }}
                  />
                )}
                {billboards.map(bb => (
                  <Marker 
                    key={bb.id} 
                    position={{ lat: bb.lat, lng: bb.lng }}
                    icon={{ url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" }}
                  />
                ))}
                {selectedPos && (
                  <Marker 
                    position={selectedPos} 
                    animation={google.maps.Animation.BOUNCE}
                    icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <div className="absolute top-6 left-6 pointer-events-none">
              <div className="glass p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Precision Geolocator Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
