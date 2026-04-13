import { MapPin, Search, Filter } from 'lucide-react';

const Locations = () => {
  return (
    <div className="min-h-screen app-bg text-zinc-900 pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black mb-4">Global Network</h1>
          <p className="text-zinc-600 text-lg">Browse and select premium billboard locations across 50+ major cities.</p>
        </header>

        <div className="glass p-4 rounded-2xl flex flex-wrap gap-4 mb-12">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Search by city, landmark, or zip code..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button className="px-6 py-4 glass border-white/10 rounded-xl flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Filter size={20} /> Filters
          </button>
        </div>

        <div className="h-[600px] glass rounded-[2rem] overflow-hidden relative mb-12">
          <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-primary mx-auto mb-4 animate-bounce" />
              <p className="text-xl font-bold">Interactive Map Simulation</p>
              <p className="text-zinc-500">In a production environment, Mapbox or Google Maps would render here.</p>
            </div>
          </div>
          
          {/* Mock Map Markers */}
          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full neon-glow" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-primary rounded-full neon-glow" />
          <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-primary rounded-full neon-glow" />
        </div>
      </div>
    </div>
  );
};

export default Locations;
