import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, Filter, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Billboard {
  id: string | number;
  location: string;
  status: string;
  price: string;
  impressions: string;
  image?: string;
}

const fallbackBillboards: Billboard[] = [
  { id: 1, location: "Times Square, NYC", status: "Active", price: "$5,000/hr", impressions: "1.5M", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1920&q=80" },
  { id: 2, location: "Shibuya Crossing, Tokyo", status: "Active", price: "$4,200/hr", impressions: "2.1M", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80" },
  { id: 3, location: "Piccadilly Circus, London", status: "High Demand", price: "$6,100/hr", impressions: "1.8M", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=80" },
  { id: 4, location: "Burj Khalifa Area, Dubai", status: "Active", price: "$8,000/hr", impressions: "3M", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80" },
  { id: 5, location: "Yonge-Dundas Square, Toronto", status: "Active", price: "$3,500/hr", impressions: "1.2M", image: "https://images.unsplash.com/photo-1552554523-d343f72df9ba?auto=format&fit=crop&w=1920&q=80" },
  { id: 6, location: "The Strip, Las Vegas", status: "High Demand", price: "$7,500/hr", impressions: "2.5M", image: "https://images.unsplash.com/photo-1581373449339-daebda2a58d3?auto=format&fit=crop&w=1920&q=80" }
];

const Locations = () => {
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/billboards')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        setBillboards(data.length ? data : fallbackBillboards);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch billboards:", err);
        setBillboards(fallbackBillboards);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen app-bg text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Global Inventory</span></h1>
          <p className="text-zinc-400 text-lg">Browse and deploy to the world's most iconic billboard hotspots instantly.</p>
        </header>

        <div className="glass p-4 rounded-2xl flex flex-wrap gap-4 mb-12 items-center">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by city, landmark, or region..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors text-white"
            />
          </div>
          <button className="px-6 py-4 glass border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Filter size={20} /> Filters
          </button>
        </div>

        <div className="h-[400px] glass rounded-[2rem] overflow-hidden relative mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-primary mx-auto mb-4 animate-pulse neon-text" />
              <p className="text-xl font-bold">Interactive Inventory Map Overlay</p>
              <p className="text-zinc-500">Live coordinates fetching in production</p>
            </div>
          </div>
          
          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full neon-glow" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-secondary rounded-full neon-glow hover:scale-150 transition-all cursor-pointer" />
          <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-primary rounded-full neon-glow hover:scale-150 transition-all cursor-pointer" />
          <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-accent rounded-full shadow-[0_0_20px_#ff007f] hover:scale-150 transition-all cursor-pointer" />
        </div>

        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">Live Inventory <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)] font-bold">SYNCED</span></h2>
          <span className="text-zinc-400 text-sm hidden md:inline-block">Showing {billboards.length} premium boards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-1 md:col-span-3 py-20 flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-zinc-500 font-medium tracking-wide animate-pulse">Syncing satellite up-links...</p>
             </div>
          ) : (
            billboards.map((bb, idx) => (
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
