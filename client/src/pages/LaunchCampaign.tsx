import { useState } from 'react';
import { Upload, DollarSign, Calendar as CalendarIcon, MapPin, CheckCircle, Zap, File as FileIcon, X } from 'lucide-react';
import PremiumCalendar from '../components/PremiumCalendar';
import { motion, AnimatePresence } from 'framer-motion';

import { TARGET_LOCATIONS } from '../data/inventory';

const LaunchCampaign = () => {
  const [step, setStep] = useState(1);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration] = useState<number | string>(2);
  const [file, setFile] = useState<File | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen app-bg text-white pt-24 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Deploy New <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Campaign</span></h1>
          <p className="text-zinc-400">Launch your brand globally in seconds with our programmatic DOOH network.</p>
        </header>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-10 rounded-full overflow-hidden">
             <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </div>
          
          {[1, 2, 3].map((num) => (
            <div key={num} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 ${step >= num ? 'bg-[#0a0a14] border-primary text-primary shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'bg-[#0a0a14] border-white/20 text-zinc-500'}`}>
              {step > num ? <CheckCircle size={24} /> : num}
            </div>
          ))}
        </div>

        {/* Step 1: Select Locations */}
        {step === 1 && (
          <div className="glass p-8 rounded-[2rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-primary" /> Target Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {TARGET_LOCATIONS.map((loc, i) => {
                const isSelected = selectedLocs.includes(loc.name);
                return (
                <div 
                  key={i} 
                  onClick={() => setSelectedLocs(prev => isSelected ? prev.filter(l => l !== loc.name) : [...prev, loc.name])}
                  className={`p-4 border rounded-xl cursor-pointer transition-all group ${isSelected ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,242,255,0.2)]' : 'border-white/10 hover:border-primary/50 hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">{loc.name}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary' : 'border-white/30 group-hover:border-primary'}`}>
                       <div className={`w-3 h-3 rounded-full bg-primary transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Reach: {loc.reach}</span>
                    <span className="text-primary font-bold">₹{loc.price.toLocaleString()}/hr</span>
                  </div>
                </div>
              )})}
            </div>
            <button 
              onClick={() => selectedLocs.length > 0 && setStep(2)} 
              className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${selectedLocs.length > 0 ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}
            >
              Continue to Schedule <CalendarIcon size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Upload & Schedule */}
        {step === 2 && (
          <div className="glass p-8 rounded-[2rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Upload className="text-secondary" /> Upload Creative & Schedule</h2>
            
            {!file ? (
              <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-12 text-center mb-8 hover:border-secondary/50 transition-colors bg-black/20 group">
                 <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*,video/*" />
                 <Upload size={48} className="mx-auto mb-4 text-zinc-500 group-hover:text-secondary group-hover:scale-110 transition-all duration-300 pointer-events-none" />
                 <p className="font-bold text-lg mb-2 group-hover:text-white transition-colors pointer-events-none">Select or drag and drop your media</p>
                 <p className="text-sm text-zinc-400 pointer-events-none">Supports MP4, MOV, JPEG, PNG (Max 500MB)</p>
              </div>
            ) : (
              <div className="glass border border-secondary/50 rounded-2xl p-6 mb-8 flex justify-between items-center shadow-[0_0_15px_rgba(112,0,255,0.2)] animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <FileIcon size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg max-w-[250px] truncate">{file.name}</p>
                    <p className="text-sm text-zinc-400">Ready to deploy</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <div className="relative">
                 <label className="block text-sm text-zinc-400 mb-2 font-bold tracking-wider">Start Date</label>
                 <button 
                   onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                   className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 flex items-center justify-between hover:border-primary transition-all group z-10"
                 >
                   <span className={startDate ? "text-white font-bold" : "text-zinc-500"}>
                     {startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Pick a date"}
                   </span>
                   <CalendarIcon className="text-zinc-500 group-hover:text-primary transition-colors" size={20} />
                 </button>

                 <AnimatePresence>
                   {isCalendarOpen && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95, y: -10 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95, y: -10 }}
                       className="absolute top-full left-0 mt-2 z-50 shadow-2xl origin-top-left"
                     >
                       <PremiumCalendar 
                         onDateSelect={(date) => {
                           setStartDate(date);
                           setIsCalendarOpen(false);
                         }}
                         selectedDate={startDate}
                       />
                     </motion.div>
                   )}
                 </AnimatePresence>
                 {isCalendarOpen && <div className="fixed inset-0 z-40" onClick={() => setIsCalendarOpen(false)} />}
               </div>
               
               <div className="relative z-20">
                 <label className="block text-sm text-zinc-400 mb-2 font-bold tracking-wider">Start Time</label>
                 <input 
                   type="time" 
                   value={startTime} 
                   onChange={(e) => setStartTime(e.target.value)} 
                   className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-primary text-white relative z-10 [color-scheme:dark]" 
                 />
               </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="w-1/3 py-4 glass text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                Back
              </button>
              <button 
                 onClick={() => file && setStep(3)} 
                 className={`w-2/3 py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${file ? 'bg-secondary text-white hover:bg-secondary/80 shadow-[0_0_20px_rgba(112,0,255,0.4)]' : 'bg-white/10 text-zinc-500 cursor-not-allowed'}`}
              >
                Review & Payout <DollarSign size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Pay */}
        {step === 3 && (
          <div className="glass p-8 rounded-[2rem] border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><DollarSign className="text-green-500" /> Review & Deploy</h2>
            
            <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-white/5">
               <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">Campaign Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-zinc-400">Total Locations</span><span className="font-bold">{selectedLocs.length} Units</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Start Date</span><span className="font-bold">{startDate || 'Not selected'}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Start Time</span><span className="font-bold">{startTime}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Duration</span><span className="font-bold">{duration} Hour{(Number(duration) || 1) > 1 ? 's' : ''}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Est. Impressions</span><span className="font-bold text-primary">{(TARGET_LOCATIONS.filter(l => selectedLocs.includes(l.name)).reduce((sum, l) => sum + l.impressions, 0) * (Number(duration) || 1)).toLocaleString()}+</span></div>
                </div>
               
               <div className="mt-6 pt-6 border-t border-white/10">
                 <div className="flex justify-between items-end">
                    <span className="text-zinc-400">Total Price</span>
                    <span className="text-4xl font-black text-green-400">₹{(TARGET_LOCATIONS.filter(l => selectedLocs.includes(l.name)).reduce((sum, l) => sum + l.price, 0) * (Number(duration) || 1)).toLocaleString()}</span>
                 </div>
               </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="w-1/3 py-4 glass text-white rounded-xl font-bold hover:bg-white/10 transition-colors">
                Back
              </button>
              <button className="w-2/3 py-4 bg-primary text-black rounded-xl font-black flex justify-center items-center gap-2 hover:bg-primary/80 transition-colors shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                Deploy Campaign <Zap className="fill-black" size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LaunchCampaign;
