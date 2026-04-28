import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, CheckCircle2, Timer, AlertCircle, BarChart2, Search, Filter, X } from 'lucide-react';

import { useState, useEffect } from 'react';
import API from '../services/api';

const statusStyles = {
  playing: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  approved: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  completed: 'bg-slate-50 text-slate-600 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  rejected: 'bg-rose-50 text-rose-700 border-rose-100',
};

const MyBookings = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await API.get('/schedule');
        setSchedules(response.data);
      } catch (err) {
        console.error('Failed to fetch schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const filteredSchedules = schedules.filter(s => {
    const matchesSearch = 
      (s.screenId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.videoId?.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeSlots = schedules.filter(s => s.status === 'playing').length;
  const upcomingSlots = schedules.filter(s => s.status === 'approved').length;

  return (
    <div className="app-bg min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-2"
            >
              Account Dashboard
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black tracking-tight text-slate-900"
            >
              {localStorage.getItem('userRole') === 'admin' ? (
                <>Live <span className="text-indigo-600">Booking</span></>
              ) : (
                <>Slot <span className="text-indigo-600">Booked</span></>
              )}
            </motion.h1>
          </div>
          
          <div />
        </header>

        {/* Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Active Slots', value: activeSlots.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Upcoming', value: upcomingSlots.toString(), icon: Timer, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Total Items', value: schedules.length.toString(), icon: BarChart2, color: 'text-sky-600', bg: 'bg-sky-50' },
            { label: 'Pending Approval', value: schedules.filter(s => s.status === 'pending').length.toString(), icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Bookings Table/List */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search screen or video..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-auto">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="playing">Playing</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location & Screen</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Video</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Time</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">Loading schedules...</td>
                  </tr>
                ) : filteredSchedules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">
                      {searchTerm || statusFilter !== 'all' ? 'No matching bookings found.' : 'No schedules found.'}
                    </td>
                  </tr>
                ) : filteredSchedules.map((booking, i) => (
                  <motion.tr 
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * i }}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                          {booking._id.slice(-4).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-1">{booking.screenId?.name || 'Unknown Screen'}</p>
                          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                            <MapPin size={10} className="text-slate-400" /> {booking.screenId?.location || 'Unknown Location'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Calendar size={13} className="text-slate-400" />
                          {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 ml-5">
                          <Clock size={10} /> {booking.startTime} - {booking.endTime}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-900 mb-1 truncate max-w-[200px]">{booking.videoId?.title || 'Untitled Video'}</p>
                      <p className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
                        <BarChart2 size={10} /> {(booking.videoId?.duration || 0)}s duration
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-slate-700 mb-1">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyles[booking.status as keyof typeof statusStyles]}`}>
                        <span className={`w-1 h-1 rounded-full mr-1.5 ${booking.status === 'playing' ? 'bg-emerald-500 animate-pulse' : 'bg-current opacity-60'}`} />
                        {booking.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium italic">Showing {filteredSchedules.length} results</p>
            {(searchTerm || statusFilter !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyBookings;
