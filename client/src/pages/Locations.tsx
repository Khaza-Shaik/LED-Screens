import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Zap, ChevronRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';

const libraries: ("places" | "visualization" | "drawing" | "geometry")[] = ["places", "visualization"];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};


const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

import { FALLBACK_BILLBOARDS, DEFAULT_MAP_CENTER, type Billboard } from '../data/inventory';

const Locations = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'High Demand'>('All');
  const [selectedBillboard, setSelectedBillboard] = useState<Billboard | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(5);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const isInvalidKey = !import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY.includes('YOUR_GOOGLE_MAPS_API_KEY');

  useEffect(() => {
    fetch('/api/billboards')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        // Fallback fallback handling if returned data lacks coords
        const mappedData = data.length ? data.map((d: Billboard) => ({
            ...d,
            lat: d.lat || FALLBACK_BILLBOARDS[0].lat,
            lng: d.lng || FALLBACK_BILLBOARDS[0].lng
        })) : FALLBACK_BILLBOARDS;
        setBillboards(mappedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch billboards:", err);
        setBillboards(FALLBACK_BILLBOARDS);
        setLoading(false);
      });
  }, []);

  const filteredBillboards = billboards.filter(bb => {
    const searchLow = searchTerm.toLowerCase().trim();
    if (!searchLow) return statusFilter === 'All' || bb.status === statusFilter;
    
    const locationLow = bb.location.toLowerCase();
    
    // Smarter matching: check if full string includes search, or if search includes location (Google addresses),
    // or if a significant keyword (more than 3 chars) matches
    const searchWords = searchLow.split(/[\s,]+/);
    const matchesSearch = locationLow.includes(searchLow) || 
                         searchLow.includes(locationLow) ||
                         searchWords.some(word => word.length > 3 && locationLow.includes(word));
    
    const matchesStatus = statusFilter === 'All' || bb.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setMapCenter(newPos);
        setMapZoom(12);
        setSearchTerm(place.formatted_address || "");
      }
    }
  };

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  return (
    <div className="min-h-screen app-bg text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Indian Inventory</span></h1>
          <p className="text-zinc-400 text-lg">Browse and deploy to India's most iconic billboard hotspots instantly.</p>
        </header>

        <div className="glass p-4 rounded-2xl flex flex-wrap gap-4 mb-12 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            {isLoaded && !isInvalidKey ? (
              <Autocomplete
                onLoad={onLoadAutocomplete}
                onPlaceChanged={onPlaceChanged}
              >
                <input 
                  type="text" 
                  autoComplete="off"
                  placeholder="Search for any location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-white"
                />
              </Autocomplete>
            ) : (
              <input 
                type="text" 
                autoComplete="off"
                placeholder="Search for any location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-white"
              />
            )}
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'High Demand')}
            className="px-6 py-4 glass border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors bg-black text-white focus:outline-none focus:border-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="High Demand">High Demand</option>
          </select>
        </div>

        {/* Map Container */}
        <div className="h-[500px] rounded-[2rem] overflow-hidden relative mb-16 shadow-2xl border border-white/10 z-0 bg-[#0a0a14]">
          {isInvalidKey ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black/60 backdrop-blur-md">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-6">
                <Shield className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Google Maps API Key Required</h3>
              <p className="max-w-md text-zinc-400 mb-8">To enable interactive searching and live markers, please add your Google Maps API Key to the <code className="bg-white/5 px-2 py-1 rounded text-primary">client/.env</code> file.</p>
              <div className="flex gap-4">
                <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">Generate Key</a>
                <button onClick={() => window.location.reload()} className="px-6 py-3 glass border border-white/10 rounded-xl hover:bg-white/5 transition-colors">I've Added My Key</button>
              </div>
            </div>
          ) : isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              options={{
                styles: darkMapStyles,
                disableDefaultUI: true,
                zoomControl: true,
                mapId: "DEMO_MAP_ID", // Modern Map ID to suppress deprecation warnings
              }}
            >
              {filteredBillboards.map(bb => (
                <Marker 
                  key={bb.id} 
                  position={{ lat: bb.lat, lng: bb.lng }}
                  onClick={() => setSelectedBillboard(bb)}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/cyan-dot.png",
                  }}
                />
              ))}

              {selectedBillboard && (
                <InfoWindow
                  position={{ lat: selectedBillboard.lat, lng: selectedBillboard.lng }}
                  onCloseClick={() => setSelectedBillboard(null)}
                >
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-zinc-900 border-b pb-1 mb-2">{selectedBillboard.location}</h3>
                    <div className="space-y-1">
                      <p className="text-xs text-zinc-600 flex justify-between"><span>Price:</span> <span className="font-bold text-primary-dark">{selectedBillboard.price}</span></p>
                      <p className="text-xs text-zinc-600 flex justify-between"><span>Reach:</span> <span className="font-bold">{selectedBillboard.impressions}</span></p>
                      <p className={`text-[10px] font-bold uppercase mt-2 ${selectedBillboard.status === 'Active' ? 'text-green-600' : 'text-purple-600'}`}>{selectedBillboard.status}</p>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-zinc-500 font-medium">Initializing Google Satellite Network...</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">Live Inventory <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)] font-bold">SYNCED</span></h2>
          <span className="text-zinc-400 text-sm hidden md:inline-block">Showing {filteredBillboards.length} premium boards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-1 md:col-span-3 py-20 flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-zinc-500 font-medium tracking-wide animate-pulse">Syncing satellite up-links...</p>
             </div>
          ) : filteredBillboards.length === 0 ? (
             <div className="col-span-1 md:col-span-3 py-20 flex flex-col items-center justify-center space-y-4">
                 <p className="text-zinc-500 font-medium tracking-wide">No inventory matches your search criteria.</p>
             </div>
          ) : (
            filteredBillboards.map((bb, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                key={bb.id} 
                whileHover={{ y: -8 }} 
                className="glass-card rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500 flex flex-col"
              >
                <div className="h-64 relative overflow-hidden bg-black">
                   <img src={bb.image || "/billboard-placeholder.png"} alt={bb.location} className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 group-hover:mix-blend-normal group-hover:opacity-90 group-hover:scale-110 transition-all duration-700 ease-out" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-background/40 to-transparent" />
                   <div className="absolute top-4 right-4 z-20">
                     <div className="w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 cursor-pointer">
                        <Zap size={14} className="text-primary" />
                     </div>
                   </div>
                   <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
                      <div className="p-2 glass rounded-lg text-primary">
                        <MapPin size={16} />
                      </div>
                      <span className="text-sm font-bold tracking-wider text-white drop-shadow-md">{bb.location}</span>
                   </div>
                </div>
                <div className="p-6 relative z-10 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${bb.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(0,242,255,0.2)]'}`}>
                      {bb.status}
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Floor Price</p>
                      <span className="text-white font-bold tracking-tight text-xl">{bb.price}</span>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                  
                  <div className="flex justify-between items-center mb-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Est. Reach</span>
                        <span className="text-zinc-300 font-medium">{bb.impressions} eyes</span>
                     </div>
                  </div>
                  
                  <Link to="/launch-campaign" className="mt-auto w-full py-4 rounded-xl glass border border-white/5 font-bold text-white hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-300 group/btn block text-center">
                    <span className="flex items-center justify-center gap-2">
                      Deploy Campaign <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Locations;
