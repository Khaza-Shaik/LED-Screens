import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Clock, ShieldCheck, Monitor, Play, CheckCircle, LayoutGrid, ListFilter, IndianRupee, Edit2, BarChart3, Eye, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'screens' | 'analytics'>('approvals');
  const [screens, setScreens] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', location: '', deviceId: '', price: '', impressions: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [screensRes, schedulesRes] = await Promise.all([
        API.get('/screens'),
        API.get('/schedule')
      ]);
      setScreens(screensRes.data);
      setSchedules(schedulesRes.data);
    } catch (err) {
      console.error('Fetch failed');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await API.put(`/schedule/${id}`, { status: 'approved' });
      fetchData();
    } catch (err) { alert('Approval failed'); }
  };

  const handleReject = async (id: string) => {
    try {
      await API.put(`/schedule/${id}`, { status: 'rejected' });
      fetchData();
    } catch (err) { alert('Rejection failed'); }
  };

  const handleCreateScreen = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/screens', { 
        ...form, 
        price: Number(form.price), 
        impressions: Number(form.impressions) 
      });
      setForm({ name: '', location: '', deviceId: '', price: '', impressions: '' });
      fetchData();
    } catch (err) { alert('Failed to create screen'); }
  };

  const handleDeleteScreen = async (id: string) => {
    if (!confirm('Remove this screen?')) return;
    try {
      await API.delete(`/screens/${id}`);
      fetchData();
    } catch (err) { alert('Delete failed'); }
  };

  const handleUpdatePrice = async (id: string, currentPrice: number) => {
    const newPrice = prompt('Enter new price per day (₹):', (currentPrice || 0).toString());
    if (newPrice === null || isNaN(Number(newPrice))) return;
    
    try {
      await API.put(`/screens/${id}`, { price: Number(newPrice) });
      fetchData();
    } catch (err) { alert('Failed to update price'); }
  };

  const pendingCount = schedules.filter(s => s.status === 'pending').length;

  const getMediaUrl = (path: string) => {

    const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace('/api', '');
    return `${baseUrl}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
      {/* Notification Banner */}
      <AnimatePresence>
        {pendingCount > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-indigo-600 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center animate-pulse">
                  <Clock size={16} />
                </div>
                <p className="text-sm font-bold tracking-tight">
                  Action Required: You have {pendingCount} new slot booking{pendingCount !== 1 ? 's' : ''} awaiting review.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('approvals')}
                className="px-4 py-1.5 bg-white text-indigo-600 text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-50 transition-all shadow-sm"
              >
                Review Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 px-6 py-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Admin Console</h1>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Control Center · Jaan Entertainment</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('approvals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'approvals' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Clock size={16} /> Pending ({schedules.filter(s => s.status === 'pending').length})
            </button>
            <button 
              onClick={() => setActiveTab('screens')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'screens' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid size={16} /> LED Inventory ({screens.length})
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <BarChart3 size={16} /> Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'approvals' ? (
            <motion.div key="approvals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                      <ListFilter size={20} className="text-indigo-500" /> Pending Approvals
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {schedules.filter(s => s.status === 'pending').length === 0 ? (
                      <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                           <CheckCircle size={32} />
                        </div>
                        <p className="text-slate-400 font-bold tracking-tight">Everything is clear!</p>
                      </div>
                    ) : (
                      schedules.filter(s => s.status === 'pending').map(s => (
                        <div key={s._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-5 flex-1">
                             <a 
                               href={s.videoId?.url ? getMediaUrl(s.videoId.url) : '#'} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="w-32 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm hover:ring-2 hover:ring-indigo-500 transition-all cursor-zoom-in group relative"
                             >
                                {s.videoId?.url && (
                                  s.videoId.url.match(/\.(mp4|webm|mov)$/) ? 
                                  <video src={getMediaUrl(s.videoId.url)} className="w-full h-full object-cover" /> :
                                  <img src={getMediaUrl(s.videoId.url)} className="w-full h-full object-cover" alt="preview" />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                   <Play size={20} className="text-white" fill="white" />
                                </div>
                             </a>
                            <div>
                              <h3 className="font-black text-slate-900 leading-tight mb-1 line-clamp-1">{s.videoId?.title}</h3>
                              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Screen: {s.screenId?.name || 'Unknown'}</p>
                              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>📅 {s.date}</span>
                                <span>⏰ {s.startTime} - {s.endTime}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleReject(s._id)}
                              className="px-6 py-3 border border-slate-200 text-rose-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-all"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleApprove(s._id)}
                              className="px-6 py-3 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'screens' ? (
            <motion.div key="screens" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Screen Form */}
                <div className="lg:col-span-1">
                   <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                      <h2 className="text-lg font-black tracking-tight mb-6 flex items-center gap-2">
                        <Plus size={20} className="text-indigo-500" /> New Screen Asset
                      </h2>
                      <form onSubmit={handleCreateScreen} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Screen Name</label>
                          <input 
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="e.g. MG Road LED"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                          <input 
                            value={form.location}
                            onChange={e => setForm({...form, location: e.target.value})}
                            placeholder="e.g. Vijayawada, AP"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Device ID</label>
                          <input 
                            value={form.deviceId}
                            onChange={e => setForm({...form, deviceId: e.target.value})}
                            placeholder="e.g. screen_001"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price per Day (₹)</label>
                          <input 
                            type="number"
                            value={form.price}
                            onChange={e => setForm({...form, price: e.target.value})}
                            placeholder="e.g. 500"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Impressions / Day</label>
                          <input 
                            type="number"
                            value={form.impressions}
                            onChange={e => setForm({...form, impressions: e.target.value})}
                            placeholder="e.g. 50000"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:outline-none focus:border-indigo-500"
                            required
                          />
                        </div>
                        <button className="w-full py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all">
                          Provision Screen
                        </button>
                      </form>
                   </div>
                </div>

                {/* Screen Grid */}
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {screens.map(screen => (
                      <div key={screen._id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full translate-x-1/2 -translate-y-1/2 -z-10" />
                        <div className="flex items-start justify-between mb-6">
                          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Monitor size={24} />
                          </div>
                          <div className="flex items-center gap-2">
                             <button onClick={() => handleUpdatePrice(screen._id, screen.price)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                <Edit2 size={18} />
                             </button>
                             <button onClick={() => handleDeleteScreen(screen._id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 size={18} />
                             </button>
                          </div>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{screen.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{screen.location}</p>
                        
                        <div className="flex items-center gap-2 mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                           <IndianRupee size={12} className="text-indigo-600" />
                           <span className="text-sm font-black text-slate-700">{screen.price || 0}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">/ Day</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                          </div>
                          <Link 
                            to={`/screen/${screen.deviceId}`}
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-indigo-600 transition-all"
                          >
                             <Play size={10} fill="currentColor" /> Live Preview
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 gap-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Impressions', value: '24.6M', change: '+18.4%', up: true, icon: Eye },
                    { label: 'Active Campaigns', value: schedules.filter(s => s.status === 'playing').length.toString(), change: '+2.1%', up: true, icon: Monitor },
                    { label: 'Pending Reviews', value: pendingCount.toString(), change: '-3.2%', up: false, icon: Clock },
                    { label: 'Estimated Revenue', value: '₹42.8L', change: '+24.6%', up: true, icon: IndianRupee },
                  ].map(({ label, value, change, up, icon: Icon }, i) => (
                    <div key={label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                          <Icon size={16} />
                        </div>
                      </div>
                      <p className="text-2xl font-black text-slate-900 mb-2">{value}</p>
                      <div className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {change}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Performance Chart */}
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-lg font-black tracking-tight text-slate-900">Network Performance</h2>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1">Impressions Over Time</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3 h-64">
                    {[40, 70, 45, 90, 65, 85, 55, 75, 50, 95, 60, 80].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                        <div
                          className="w-full bg-slate-50 rounded-t-xl transition-all duration-500 group-hover:bg-indigo-500 relative overflow-hidden"
                          style={{ height: `${val}%` }}
                        >
                           <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-transparent" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
