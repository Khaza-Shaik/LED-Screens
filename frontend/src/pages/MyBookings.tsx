import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronRight, CheckCircle2, Timer, AlertCircle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              My <span className="text-indigo-600">Bookings</span>
            </motion.h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              to="/launch-campaign" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5 active:scale-95"
            >
              Book new slot <ChevronRight size={18} />
            </Link>
          </motion.div>
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
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location & Screen</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Video</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">Loading schedules...</td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold">No schedules found.</td>
                  </tr>
                ) : schedules.map((booking, i) => (
                  <motion.tr 
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
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
                      <p className="text-sm font-bold text-slate-900 mb-1">{booking.videoId?.title || 'Untitled Video'}</p>
                      <p className="text-[11px] text-indigo-600 font-bold flex items-center gap-1">
                        <BarChart2 size={10} /> {(booking.videoId?.duration || 0)}s duration
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
            <p className="text-xs text-slate-500 font-medium italic">Showing last 3 months of campaign history</p>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View Full Archive →</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyBookings;
