import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ChevronRight, TrendingUp, Filter, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

import { FALLBACK_BILLBOARDS, DEFAULT_MAP_CENTER, type Billboard } from '../data/inventory';
import API from '../services/api';
import { Plus, X } from 'lucide-react';

function MapViewHandler({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView([center.lat, center.lng], zoom); }, [center, zoom, map]);
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useEffect(() => {
    console.log('🗺️ Map Click Listener: Active');
    return () => console.log('🗺️ Map Click Listener: Inactive');
  }, []);

  useMapEvents({
    click(e) {
      console.log('📍 Map Click Detected:', e.latlng);
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const statusOptions = ['All', 'Active', 'High Demand'] as const;
type StatusFilter = typeof statusOptions[number];

const Locations = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  const [newLocation, setNewLocation] = useState({
    location: '',
    price: '',
    impressions: '',
    status: 'Active',
    lat: 16.5062,
    lng: 80.6480
  });

  const fetchBillboards = async () => {
    try {
      console.log('📡 Fetching billboards...');
      const response = await API.get('/billboards');
      // Normalize _id to id if needed
      const normalized = response.data.map((bb: any) => ({
        ...bb,
        id: bb.id || bb._id
      }));
      setBillboards(normalized.length ? normalized : FALLBACK_BILLBOARDS);
      console.log('✅ Billboards loaded:', normalized.length || FALLBACK_BILLBOARDS.length);
    } catch (err) {
      console.error('❌ Failed to fetch billboards:', err);
      setBillboards(FALLBACK_BILLBOARDS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillboards();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(newLocation.lat) || isNaN(newLocation.lng)) {
      alert('Invalid coordinates selected');
      return;
    }
    try {
      console.log('🚀 Adding location:', newLocation);
      const res = await API.post('/billboards', newLocation);
      console.log('✅ Location added:', res.data);
      setShowAddForm(false);
      fetchBillboards();
      // ... reset state ...
      setNewLocation({
        location: '',
        price: '',
        impressions: '',
        status: 'Active',
        lat: 16.5062,
        lng: 80.6480
      });
    } catch (err) {
      alert('Failed to add location');
    }
  };

  const filtered = useMemo(() => billboards.filter(bb => {
    const q = searchTerm.toLowerCase().trim();
    return (!q || bb.location.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || bb.status === statusFilter);
  }), [billboards, searchTerm, statusFilter]);

  const focusBillboard = (bb: Billboard) => {
    setMapCenter({ lat: bb.lat, lng: bb.lng });
    setMapZoom(15);
    setSelectedId(bb.id);
  };

  return (
    <div className="app-bg min-h-screen pt-20">
      {/* ─── Page Header ───────────────────────────── */}
      <div className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-1">Live Inventory</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Premium Indian Screens</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search city or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 w-64 transition-all"
              />
            </div>
            {/* Status filter pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {statusOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    statusFilter === s
                      ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg">
              <SlidersHorizontal size={13} />
              {filtered.length} assets
            </div>
            {isAdmin && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Plus size={14} /> Add Location
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Split-Screen Layout ────────────────────── */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>

        {/* Left: Scrollable directory */}
        <div className="w-full lg:w-[400px] h-[40%] lg:h-full shrink-0 border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar order-2 lg:order-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Syncing inventory...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 px-6 text-center">
              <Search size={32} className="text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No results for "{searchTerm}"</p>
              <button onClick={() => { setSearchTerm(''); setStatusFilter('All'); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                Clear filters
              </button>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((bb, i) => (
                <motion.div
                  key={bb.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => focusBillboard(bb)}
                  className={`px-5 py-4 border-b border-slate-100 cursor-pointer transition-all group ${
                    selectedId === bb.id ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={13} className={selectedId === bb.id ? 'text-indigo-500' : 'text-slate-400'} />
                        <span className="text-sm font-bold text-slate-900 truncate">{bb.location}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                          bb.status === 'Active'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}>
                          {bb.status}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">{bb.price}/hr</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end text-xs font-semibold text-slate-700">
                        <TrendingUp size={11} className="text-indigo-400" />
                        {bb.impressions}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">est. reach</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to="/launch-campaign"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Deploy campaign <ChevronRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Right: Map */}
        <div className="flex-1 relative bg-slate-100 h-[60%] lg:h-full order-1 lg:order-2">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            {isAdmin && showAddForm && (
              <MapEvents onMapClick={(lat, lng) => {
                if (isNaN(lat) || isNaN(lng)) return;
                console.log('📍 State Update: Setting Lat/Lng', lat, lng);
                setNewLocation(prev => ({ ...prev, lat, lng }));
                setMapCenter({ lat, lng });
              }} />
            )}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapViewHandler center={mapCenter} zoom={mapZoom} />

            {/* Preview Marker for New Location */}
            {isAdmin && showAddForm && (
              <Marker position={[newLocation.lat, newLocation.lng]} icon={customIcon}>
                <Popup>
                  <div className="text-xs font-bold p-1">New Location Target</div>
                </Popup>
              </Marker>
            )}

            {filtered.map(bb => {
              if (isNaN(bb.lat) || isNaN(bb.lng)) return null;
              return (
                <Marker
                  key={bb.id}
                  position={[bb.lat, bb.lng]}
                  icon={customIcon}
                  eventHandlers={{ click: () => focusBillboard(bb) }}
                >
                  <Popup>
                    <div className="min-w-[200px] p-1">
                      <div className="flex items-start justify-between mb-2 pb-2 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{bb.location}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0 ${
                          bb.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{bb.status}</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Rate:</span>
                          <span className="font-bold text-slate-900">{bb.price}/hr</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Est. Reach:</span>
                          <span className="font-bold text-indigo-600">{bb.impressions}</span>
                        </div>
                      </div>
                      <Link
                        to="/launch-campaign"
                        className="mt-3 block w-full py-2 bg-indigo-600 text-white text-xs font-bold text-center rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Book This Screen
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map badge */}
          <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <Filter size={13} className="text-indigo-500" />
            <span className="text-xs font-bold text-slate-700">{filtered.length} locations shown</span>
          </div>
        </div>
      </div>
      {/* ─── Add Location Form Modal ───────────────── */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Add New Location</h2>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Click on map to pick coordinates</p>
                </div>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddLocation} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location Name</label>
                  <input 
                    type="text" 
                    required
                    value={newLocation.location}
                    onChange={e => setNewLocation({...newLocation, location: e.target.value})}
                    placeholder="e.g. Times Square, NY"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price (e.g. ₹5,000/hr)</label>
                    <input 
                      type="text" 
                      required
                      value={newLocation.price}
                      onChange={e => setNewLocation({...newLocation, price: e.target.value})}
                      placeholder="₹5,000/hr"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Impressions (e.g. 1.5M)</label>
                    <input 
                      type="text" 
                      required
                      value={newLocation.impressions}
                      onChange={e => setNewLocation({...newLocation, impressions: e.target.value})}
                      placeholder="1.5M"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Latitude</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      required
                      value={newLocation.lat}
                      onChange={e => setNewLocation({...newLocation, lat: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Longitude</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      required
                      value={newLocation.lng}
                      onChange={e => setNewLocation({...newLocation, lng: parseFloat(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all mt-4"
                >
                  Create Location Asset
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Locations;
