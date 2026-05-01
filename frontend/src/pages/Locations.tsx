import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

import { DEFAULT_MAP_CENTER, type Billboard } from '../data/inventory';
import API from '../services/api';

function MapViewHandler({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => { 
    if (center && typeof center.lat === 'number' && typeof center.lng === 'number' && !isNaN(center.lat) && !isNaN(center.lng)) {
      map.setView([center.lat, center.lng], zoom); 
    }
  }, [center, zoom, map]);
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
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

  const fetchBillboards = async () => {
    try {
      console.log('📡 Fetching screens...');
      const response = await API.get('/screens');
      // Normalize _id to id if needed and format data for the map
      const normalized = response.data.map((bb: any) => ({
        ...bb,
        id: bb.id || bb._id,
        price: `₹${bb.price || 0}`,
        status: 'Active' // We can default to Active or use bb.status if mapped
      }));
      setBillboards(normalized);
      console.log('✅ Billboards loaded:', normalized.length);
    } catch (err) {
      console.error('❌ Failed to fetch billboards:', err);
      setBillboards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillboards();
  }, []);

  const filtered = useMemo(() => billboards.filter(bb => {
    const q = searchTerm.toLowerCase().trim();
    return (!q || (bb.location && bb.location.toLowerCase().includes(q)) || (bb.name && bb.name.toLowerCase().includes(q))) &&
      (statusFilter === 'All' || bb.status === statusFilter);
  }), [billboards, searchTerm, statusFilter]);

  const focusBillboard = (bb: Billboard) => {
    const lat = typeof bb.lat === 'number' && !isNaN(bb.lat) ? bb.lat : DEFAULT_MAP_CENTER.lat;
    const lng = typeof bb.lng === 'number' && !isNaN(bb.lng) ? bb.lng : DEFAULT_MAP_CENTER.lng;
    setMapCenter({ lat, lng });
    setMapZoom(15);
    setSelectedId(bb.id);
  };

  return (
    <div className="app-bg min-h-screen pt-20">
      {/* ─── Page Header ───────────────────────────── */}
      <div className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-1">Live Inventory</p>
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
            <AnimatePresence mode="popLayout">
              {filtered.map((bb, i) => (
                <motion.div
                  key={bb.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03, duration: 0.4, ease: "easeOut" }}
                  onClick={() => focusBillboard(bb)}
                  className={`px-6 py-5 border-b border-slate-50 cursor-pointer transition-all duration-300 group relative ${
                    selectedId === bb.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  {selectedId === bb.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"
                    />
                  )}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MapPin size={14} className={selectedId === bb.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'} />
                        <span className={`text-sm font-bold truncate tracking-tight transition-colors ${selectedId === bb.id ? 'text-indigo-700' : 'text-slate-900'}`}>{bb.name ? `${bb.name}, ${bb.location.split(',')[0]}` : bb.location}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest transition-all ${
                          bb.status === 'Active'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500'
                            : 'text-amber-700 bg-amber-50 border-amber-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
                        }`}>
                          {bb.status}
                        </span>
                        <span className="text-xs text-slate-500 font-bold bg-slate-100/50 px-2 py-0.5 rounded-md group-hover:bg-white transition-colors">{bb.price}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className={`mt-4 flex items-center gap-2 transition-all duration-300 ${selectedId === bb.id ? 'opacity-100' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                    <Link
                      to="/launch-campaign"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Deploy campaign <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Right: Map */}
        <div className="flex-1 relative bg-slate-100 h-[60%] lg:h-full order-1 lg:order-2 z-0">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapViewHandler center={mapCenter} zoom={mapZoom} />

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
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{bb.name ? `${bb.name}, ${bb.location.split(',')[0]}` : bb.location}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0 ${
                          bb.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>{bb.status}</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Rate:</span>
                          <span className="font-bold text-slate-900">{bb.price}/hr</span>
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
    </div>
  );
};

export default Locations;
