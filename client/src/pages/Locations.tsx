import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ChevronRight, TrendingUp, Filter, SlidersHorizontal } from 'lucide-react';
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

import { FALLBACK_BILLBOARDS, DEFAULT_MAP_CENTER, type Billboard } from '../data/inventory';

function MapViewHandler({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView([center.lat, center.lng], zoom); }, [center, zoom, map]);
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

  useEffect(() => {
    fetch('/api/billboards')
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setBillboards(data.length ? data : FALLBACK_BILLBOARDS); setLoading(false); })
      .catch(() => { setBillboards(FALLBACK_BILLBOARDS); setLoading(false); });
  }, []);

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
          </div>
        </div>
      </div>

      {/* ─── Split-Screen Layout ────────────────────── */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0" style={{ minHeight: 'calc(100vh - 140px)' }}>

        {/* Left: Scrollable directory */}
        <div className="w-full lg:w-[400px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 140px)' }}>
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
        <div className="flex-1 relative bg-slate-100" style={{ minHeight: '500px' }}>
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', minHeight: '500px' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapViewHandler center={mapCenter} zoom={mapZoom} />
            {filtered.map(bb => (
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
            ))}
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
