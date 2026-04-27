import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Clock, ShieldCheck, Monitor, Play, CheckCircle, LayoutGrid, ListFilter } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'screens'>('approvals');
  const [screens, setScreens] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', location: '', deviceId: '' });

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
      await API.post('/screens', form);
      setForm({ name: '', location: '', deviceId: '' });
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

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12">
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
                          <div className="flex items-center gap-5">
                            <div className="w-20 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                               {s.videoId?.url && (
                                 s.videoId.url.match(/\.(mp4|webm)$/) ? 
                                 <video src={`http://localhost:5000${s.videoId.url}`} className="w-full h-full object-cover" /> :
                                 <img src={`http://localhost:5000${s.videoId.url}`} className="w-full h-full object-cover" alt="preview" />
                               )}
                            </div>
                            <div>
                              <h3 className="font-black text-slate-900 leading-tight mb-1">{s.videoId?.title}</h3>
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
          ) : (
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
                          <button onClick={() => handleDeleteScreen(screen._id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                             <Trash2 size={18} />
                          </button>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{screen.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">{screen.location}</p>
                        
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
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
