import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trash2, Plus, Clock, ShieldCheck, LogOut, Flame, AlertTriangle, BarChart3, Globe, Activity } from 'lucide-react';

// Leaflet marker fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

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
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [form, setForm] = useState({ location: '', price: '', impressions: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Map Click Handler for Leaflet
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setSelectedPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return selectedPos ? <Marker position={[selectedPos.lat, selectedPos.lng]} icon={redIcon} /> : null;
  }

  useEffect(() => {
    if (!localStorage.getItem('token') && import.meta.env.PROD) navigate('/login');
    fetchBillboards();
    const interval = setInterval(fetchBillboards, 15000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchBillboards = () => {
    fetch('/api/billboards')
      .then(r => r.json())
      .then(data => {
        setBillboards(data);
        if (data.length > 0 && Math.random() > 0.75) {
          const rb = data[Math.floor(Math.random() * data.length)];
          setNotifications(prev => [
            { id: Date.now(), message: `Signal variance at ${rb.location}` },
            ...prev,
          ].slice(0, 3));
        }
      })
      .catch(console.error);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPos) return alert('Click the map to set a location');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/billboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...selectedPos }),
      });
      if (res.ok) { fetchBillboards(); setForm({ location: '', price: '', impressions: '' }); setSelectedPos(null); }
    } catch (e) { console.error(e); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Remove this billboard?')) return;
    await fetch(`/api/billboards/${id}`, { method: 'DELETE' }).catch(console.error);
    fetchBillboards();
  };

  return (
    <div className="app-bg min-h-screen pt-20">
      {/* ─── Top Bar ──────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Admin Console</h1>
              <p className="text-xs text-slate-500 font-medium">DOOH Infrastructure Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/launch-campaign"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Plus size={15} /> New Campaign
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ─── Live Alerts ──────────────────────────── */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                  <p className="text-sm font-semibold text-amber-800">{note.message}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                  Live
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── KPI Strip ────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Screens', value: billboards.length, icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Active Campaigns', value: '—', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Avg Uptime', value: '98.4%', icon: BarChart3, color: 'text-sky-600', bg: 'bg-sky-50' },
            { label: 'Alerts Today', value: notifications.length, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                <div className={`w-7 h-7 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon size={14} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ─── Main Grid ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — Add Form */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <Plus size={15} className="text-indigo-500" />
                <h2 className="text-sm font-bold text-slate-900">Provision New Screen</h2>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Board Name / Location</label>
                  <input
                    placeholder="e.g. Jubilee Hills, Hyderabad"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Rate/hr</label>
                    <input
                      placeholder="₹5,000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Reach</label>
                    <input
                      placeholder="e.g. 1.2M"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                      value={form.impressions}
                      onChange={e => setForm({ ...form, impressions: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className={`p-3.5 rounded-lg border text-sm ${selectedPos ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Map Coordinates</p>
                  {selectedPos ? (
                    <p className="font-mono text-xs text-slate-700">{selectedPos.lat.toFixed(6)}, {selectedPos.lng.toFixed(6)}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic animate-pulse">Click map to pin location…</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPos}
                  className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Provisioning…' : 'Add Screen Asset'}
                </button>
              </form>
            </div>

            {/* Inventory List */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Screen Inventory</h2>
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${showHeatmap ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  <Flame size={13} /> Heatmap
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                {billboards.length === 0 ? (
                  <p className="text-sm text-slate-400 font-medium p-6 text-center">No screens provisioned yet.</p>
                ) : (
                  billboards.map(bb => (
                    <div key={bb.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors group">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{bb.location}</p>
                        <p className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-0.5">
                          <Clock size={10} />
                          {bb.lastUpdated ? new Date(bb.lastUpdated).toLocaleTimeString() : 'Unknown'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(bb.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right — Map */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm" style={{ minHeight: '600px' }}>
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Global Screen Network</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                Live Geo Feed
              </div>
            </div>
            <div style={{ height: 'calc(100% - 57px)', minHeight: '540px' }} className="isolate">
              <MapContainer
                center={[defaultCenter.lat, defaultCenter.lng]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <LocationMarker />
                {billboards.map(bb => (
                  <Marker 
                    key={bb.id} 
                    position={[bb.lat, bb.lng]} 
                    icon={customIcon}
                  />
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
