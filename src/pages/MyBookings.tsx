import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, ChevronRight, CheckCircle2, Timer, AlertCircle, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockBookings = [
  {
    id: 'BK-8821',
    location: 'Benz Circle, Vijayawada',
    status: 'Live',
    startDate: '2026-05-01',
    endDate: '2026-05-07',
    cost: '₹18,480',
    impressions: '350K+',
    type: 'Digital Billboard'
  },
  {
    id: 'BK-7742',
    location: 'MG Road, Vijayawada',
    status: 'Scheduled',
    startDate: '2026-05-15',
    endDate: '2026-05-20',
    cost: '₹12,600',
    impressions: '210K+',
    type: 'LED Screen'
  },
  {
    id: 'BK-6619',
    location: 'Gachibowli Flyover, Hyderabad',
    status: 'Completed',
    startDate: '2026-04-10',
    endDate: '2026-04-12',
    cost: '₹24,000',
    impressions: '520K+',
    type: 'Unipole Digital'
  }
];

const statusStyles = {
  Live: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Scheduled: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Completed: 'bg-slate-50 text-slate-600 border-slate-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-100',
};

const MyBookings = () => {
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
            { label: 'Active Slots', value: '1', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Upcoming', value: '1', icon: Timer, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Total Spend', value: '₹55,080', icon: BarChart2, color: 'text-sky-600', bg: 'bg-sky-50' },
            { label: 'Pending Docs', value: '0', icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
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
            <div className="flex gap-2">
              {['All', 'Live', 'Scheduled'].map(f => (
                <button key={f} className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${f === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location & Screen</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Investment</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockBookings.map((booking, i) => (
                  <motion.tr 
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">
                          {booking.id.split('-')[1]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-1">{booking.location}</p>
                          <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                            <MapPin size={10} className="text-slate-400" /> {booking.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Calendar size={13} className="text-slate-400" />
                          {new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} 
                          <span className="text-slate-300 mx-1">→</span>
                          {new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 ml-5">
                          <Clock size={10} /> 9:00 AM - 10:00 PM
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 mb-1">{booking.cost}</p>
                      <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                        <BarChart2 size={10} /> {booking.impressions} Est. Reach
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyles[booking.status as keyof typeof statusStyles]}`}>
                        <span className={`w-1 h-1 rounded-full mr-1.5 ${booking.status === 'Live' ? 'bg-emerald-500 animate-pulse' : 'bg-current opacity-60'}`} />
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={18} />
                      </button>
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
