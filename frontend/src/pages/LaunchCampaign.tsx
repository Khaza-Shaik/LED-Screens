import { useState, useEffect } from 'react';
import { Upload, Calendar as CalendarIcon, MapPin, CheckCircle, ArrowRight, File as FileIcon, Clock, ChevronLeft, CreditCard, Zap, X } from 'lucide-react';
import PremiumCalendar from '../components/PremiumCalendar';
import PremiumTimePicker from '../components/PremiumTimePicker';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadVideo, createSchedule, getScreens } from '../services/campaignService';

// TARGET_LOCATIONS removed to use dynamic screens from API

const formatTimeAMPM = (time: string) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
};

const steps = [
  { id: 1, label: 'Select Screens' },
  { id: 2, label: 'Creative & Schedule' },
  { id: 3, label: 'Review & Pay' },
];

const LaunchCampaign = () => {
  const [step, setStep] = useState(1);
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [screens, setScreens] = useState<any[]>([]);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const data = await getScreens();
        setScreens(data);
      } catch (err) {
        console.error('Failed to fetch screens');
      }
    };
    fetchScreens();
  }, []);

  const handleSubmit = async () => {
    if (!file || selectedLocs.length === 0) return;
    setLoading(true);
    setError('');

    try {
      // 1. Upload Video
      const video = await uploadVideo(file, file.name);

      // 2. Create Schedules for each selected location
      if (!screens || screens.length === 0) throw new Error('No screens available');

      for (const locName of selectedLocs) {
        const screen = screens.find(s => s.name === locName);
        if (screen) {
          await createSchedule({
            videoId: video._id,
            screenId: screen._id,
            date: startDate,
            startTime,
            endTime
          });
        }
      }

      setStep(1);
      alert('Campaign launched successfully!');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to launch campaign');
    } finally {
      setLoading(false);
    }
  };

  const duration = (() => {
    if (!startDate || !endDate) return 0;
    const diff = (new Date(`${endDate}T${endTime}`).getTime() - new Date(`${startDate}T${startTime}`).getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  })();

  const totalCost = selectedLocs.reduce((sum, name) => {
    const loc = screens.find(l => l.name === name);
    return sum + (loc ? (loc.price || 0) * (duration || 1) : 0);
  }, 0);

  const estImpressions = selectedLocs.reduce((sum, name) => {
    const loc = screens.find(l => l.name === name);
    return sum + (loc ? (loc.impressions || 0) * (duration || 1) : 0);
  }, 0);

  const toggleLoc = (name: string) => setSelectedLocs(p => p.includes(name) ? p.filter(l => l !== name) : [...p, name]);
  const closeAll = () => { setIsCalendarOpen(false); setIsEndCalendarOpen(false); setIsStartTimeOpen(false); setIsEndTimeOpen(false); };

  return (
    <div className="app-bg min-h-screen pt-20 pb-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* ─── Page Header ───────────────────────────── */}
        <div className="pt-8 pb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-3">Instant Booking</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Book your <span className="text-indigo-600">slot</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Secure your screen time in seconds.</p>
        </div>

        {/* ─── Stepper ───────────────────────────────── */}
        <div className="flex items-center mb-10">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s.id ? 'bg-indigo-600 text-white' :
                  step === s.id ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                  'bg-white border-2 border-slate-200 text-slate-400'
                }`}>
                  {step > s.id ? <CheckCircle size={14} /> : s.id}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === s.id ? 'text-indigo-600' : step > s.id ? 'text-slate-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 mx-3 h-px transition-colors ${step > s.id ? 'bg-indigo-500' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ─── Step 1: Select Screens ─────────────────── */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-7 py-5 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Select Screen Locations</h2>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Choose one or more billboards to include in your campaign.</p>
                </div>
                <div className="p-4 space-y-3">
                  {screens.map(loc => {
                    const active = selectedLocs.includes(loc.name);
                    return (
                      <button
                        key={loc._id}
                        onClick={() => toggleLoc(loc.name)}
                        className={`w-full text-left p-5 rounded-xl border transition-all ${
                          active
                            ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <MapPin size={14} className={active ? 'text-indigo-500' : 'text-slate-400'} />
                              <span className="text-sm font-bold text-slate-900">{loc.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                              <span>Premium Location</span>
                              <span className="text-slate-300">|</span>
                              <span>₹{loc.price || 0}/day</span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                            active ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                          }`}>
                            {active && <CheckCircle size={12} className="text-white fill-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {screens.length === 0 && <p className="text-center p-8 text-slate-400">Loading screens...</p>}
                </div>
                <div className="px-7 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <p className="text-sm text-slate-500 font-medium">
                    {selectedLocs.length} screen{selectedLocs.length !== 1 ? 's' : ''} selected
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    disabled={selectedLocs.length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 2: Creative & Schedule ───────────── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="px-7 py-5 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Upload Creative & Set Schedule</h2>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Upload your ad creative and define the campaign timeline.</p>
                </div>
                <div className="p-7 space-y-10">
                  {/* File Upload */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Ad Creative (MP4 / PNG / JPG)</label>
                    <div className="relative">
                      <input type="file" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" />
                      <div className={`flex items-center gap-5 p-6 border-2 border-dashed rounded-xl transition-all ${file ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${file ? 'bg-indigo-100' : 'bg-white border border-slate-200'}`}>
                          {file ? <FileIcon size={22} className="text-indigo-600" /> : <Upload size={22} className="text-slate-400" />}
                        </div>
                        <div>
                          {file ? (
                            <>
                              <p className="text-sm font-bold text-slate-900">{file.name}</p>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-bold text-slate-700">Drop file here or click to browse</p>
                              <p className="text-xs text-slate-400 font-medium mt-0.5">Min. 1920×1080px recommended for best quality</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div className="relative pt-2">
                    {/* Backdrop to close dropdowns when clicking outside */}
                    {(isCalendarOpen || isEndCalendarOpen || isStartTimeOpen || isEndTimeOpen) && (
                      <div className="fixed inset-0 z-[45]" onClick={closeAll} />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                      {/* Start Date */}
                      <div className="relative" style={{ zIndex: isCalendarOpen ? 50 : 10 }}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Start Date</label>
                        <button onClick={() => { closeAll(); setIsCalendarOpen(!isCalendarOpen); }} className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-indigo-400 transition-all group shadow-sm">
                          <span className={startDate ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                            {startDate ? new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pick a date'}
                          </span>
                          <CalendarIcon size={15} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </button>
                        <AnimatePresence>
                          {isCalendarOpen && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 z-[60] shadow-xl origin-top-left">
                              <PremiumCalendar onDateSelect={d => { setStartDate(d); setIsCalendarOpen(false); }} selectedDate={startDate} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* End Date */}
                      <div className="relative" style={{ zIndex: isEndCalendarOpen ? 50 : 10 }}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">End Date</label>
                        <button onClick={() => { closeAll(); setIsEndCalendarOpen(!isEndCalendarOpen); }} className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:border-indigo-400 transition-all group shadow-sm">
                          <span className={endDate ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                            {endDate ? new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pick a date'}
                          </span>
                          <CalendarIcon size={15} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </button>
                        <AnimatePresence>
                          {isEndCalendarOpen && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 z-[60] shadow-xl origin-top-left">
                              <PremiumCalendar 
                                onDateSelect={d => { 
                                  setEndDate(d); 
                                  setIsEndCalendarOpen(false); 
                                }} 
                                selectedDate={endDate} 
                                minDate={startDate} 
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Start Time */}
                      <div className="relative" style={{ zIndex: isStartTimeOpen ? 50 : 10 }}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Start Time</label>
                        <button onClick={() => { closeAll(); setIsStartTimeOpen(!isStartTimeOpen); }} className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 hover:border-indigo-400 transition-all group shadow-sm">
                          <span>{formatTimeAMPM(startTime)}</span>
                          <Clock size={15} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </button>
                        <AnimatePresence>
                          {isStartTimeOpen && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 z-[60] shadow-xl">
                              <PremiumTimePicker value={startTime} onChange={v => { setStartTime(v); setIsStartTimeOpen(false); }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* End Time */}
                      <div className="relative" style={{ zIndex: isEndTimeOpen ? 50 : 10 }}>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">End Time</label>
                        <button onClick={() => { closeAll(); setIsEndTimeOpen(!isEndTimeOpen); }} className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 hover:border-indigo-400 transition-all group shadow-sm">
                          <span>{formatTimeAMPM(endTime)}</span>
                          <Clock size={15} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </button>
                        <AnimatePresence>
                          {isEndTimeOpen && (
                            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 z-[60] shadow-xl">
                              <PremiumTimePicker value={endTime} onChange={v => { setEndTime(v); setIsEndTimeOpen(false); }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-7 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button
                    onClick={() => file && setStep(3)}
                    disabled={!file}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Review Campaign <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Step 3: Review & Pay ───────────────────── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-7 py-5 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900">Campaign Summary</h2>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Review the details before finalising payment.</p>
                </div>

                <div className="p-7 space-y-5">
                  {/* Selected screens */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Selected Screens</p>
                    <div className="space-y-2">
                      {selectedLocs.map(name => {
                        const loc = screens.find(l => l.name === name);
                        return (
                          <div key={name} className="flex items-center justify-between py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg group">
                            <div className="flex items-center gap-2.5">
                              <MapPin size={13} className="text-indigo-500 shrink-0" />
                              <span className="text-sm font-semibold text-slate-800">{name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-slate-600">₹{loc?.price || 0}/day</span>
                              <button 
                                onClick={() => {
                                  const newLocs = selectedLocs.filter(l => l !== name);
                                  setSelectedLocs(newLocs);
                                  if (newLocs.length === 0) setStep(1);
                                }}
                                className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 transition-colors"
                                title="Remove screen"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Schedule</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Start', value: startDate ? `${new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${formatTimeAMPM(startTime)}` : '—' },
                        { label: 'End', value: endDate ? `${new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${formatTimeAMPM(endTime)}` : '—' },
                        { label: 'Duration', value: duration ? `${duration.toFixed(1)} hours` : '—' },
                        { label: 'Est. Impressions', value: estImpressions ? `${(estImpressions / 1000).toFixed(0)}K+` : '—' },
                      ].map(item => (
                        <div key={item.label} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{item.label}</p>
                          <p className="text-sm font-bold text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between p-5 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Total Payable</p>
                      <p className="text-3xl font-extrabold tracking-tight text-slate-900">₹{totalCost.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-medium">Inclusive of GST</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-1">Instant activation</p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <p className="text-xs font-bold text-rose-700">{error}</p>
                    </div>
                  )}
                </div>

                <div className="px-7 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                    <ChevronLeft size={15} /> Edit
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : <><CreditCard size={15} /> Pay ₹{totalCost.toLocaleString()}</>}
                  </button>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <Zap size={12} className="text-slate-400" />
                <p className="text-xs text-slate-400 font-medium">Payments are secured by Razorpay · 256-bit SSL</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LaunchCampaign;
