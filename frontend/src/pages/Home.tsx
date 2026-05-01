import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Globe, Layers, Shield, TrendingUp, Zap, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '2.4B+', label: 'Daily Reach', delta: '+18%' },
  { value: '340+', label: 'Premium Locations', delta: '+42' },
  { value: '98.6%', label: 'Uptime SLA', delta: 'Guaranteed' },
  { value: '₹2.1Cr', label: 'Revenue Deployed', delta: 'This Month' },
];

const features = [
  {
    icon: MapPin,
    title: 'Precision Geo-Targeting',
    desc: 'Deploy campaigns to specific zip codes, neighborhoods, or high-traffic corridors using real-time location intelligence.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: BarChart3,
    title: 'Live Attribution Analytics',
    desc: 'Measure reach, dwell time, and audience reach in real-time. Export reports directly to your BI tools.',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
  },
  {
    icon: Zap,
    title: 'Instant Campaign Activation',
    desc: 'Upload your creative and go live within minutes. Automated compliance checks ensure maximum screen uptime.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Layers,
    title: 'Multi-Screen Orchestration',
    desc: 'Schedule and synchronize campaigns across hundreds of screens simultaneously with a single dashboard.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Globe,
    title: 'Pan-India Coverage',
    desc: 'Access Tier 1 to Tier 3 city inventory with real-time availability. The largest DOOH network in India.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Enterprise-Grade Security',
    desc: 'SOC 2 compliant infrastructure. All creative assets are encrypted in transit and at rest. Role-based access control.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
];

const inventoryHighlights = [
  { city: 'Vijayawada', screens: 12, reach: '4.2M/day', status: 'live' },
  { city: 'Hyderabad', screens: 28, reach: '11.8M/day', status: 'live' },
  { city: 'Bangalore', screens: 35, reach: '15.6M/day', status: 'live' },
  { city: 'Chennai', screens: 19, reach: '8.1M/day', status: 'limited' },
];

const Home = () => {
  return (
    <div className="app-bg min-h-screen">

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-700 tracking-wide">India's #1 Entertainment Ad-Network</span>
              </motion.div>

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6"
              >
                Reach Billions.<br />
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-slate-900 relative inline-block"
                >
                  Everywhere They Go.
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-slate-500 font-medium mb-10 leading-relaxed"
              >
                Deploy, manage, and optimize digital billboard campaigns across India's premium outdoor inventory — in real-time, from the <span className="text-slate-900 font-bold">Jaan Entertainment</span> dashboard.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/launch-campaign"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-[0_4px_20px_0_rgba(225,29,72,0.35)] hover:shadow-[0_8px_30px_0_rgba(225,29,72,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  Book your slot <ArrowRight size={20} />
                </Link>
                <Link
                  to="/locations"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-800 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Browse Inventory <ChevronRight size={18} className="text-slate-400" />
                </Link>
              </motion.div>
            </div>

            {/* Hero Image Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="flex-1 relative w-full max-w-[600px]"
            >
              <div className="relative p-2 bg-white rounded-[32px] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                <motion.img 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src="/hero-showcase.png" 
                  alt="Jaan Entertainment Showcase" 
                  className="w-full h-auto rounded-[24px] object-cover"
                />
                
                {/* Decorative floating elements */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-16 -left-16 w-48 h-48 bg-rose-500/5 blur-3xl rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* ─── Stats Strip ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-8 py-7 flex flex-col">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">{s.value}</span>
                <span className="text-sm text-slate-500 font-medium mb-2">{s.label}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 self-start">{s.delta}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Live Inventory Preview ─────────────────────── */}
      <section className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-3">Live Inventory</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Premium screens, available now.</h2>
            </div>
            <Link to="/locations" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors shrink-0">
              View all inventory <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventoryHighlights.map((city, i) => (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.12)] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <MapPin size={20} className="text-indigo-600 group-hover:text-white" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border shadow-sm ${
                    city.status === 'live'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500'
                      : 'text-amber-700 bg-amber-50 border-amber-200 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500'
                  } transition-all duration-300`}>
                    {city.status === 'live' ? '● Live' : '◐ Limited'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{city.city}</h3>
                <p className="text-sm text-slate-500 font-medium mb-5">{city.screens} screens</p>
                <div className="h-px bg-slate-100 mb-5 group-hover:bg-indigo-100 transition-colors" />
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{city.reach}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Platform Features ──────────────────────────── */}
      <section className="py-24 px-6 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-4">Platform Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Built for enterprise advertisers.</h2>
            <p className="text-slate-500 text-lg font-medium">Everything your media team needs — in one unified platform. No spreadsheets. No middlemen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                whileHover={{ y: -5, backgroundColor: '#f8faff' }}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.08)] hover:border-indigo-100 transition-all group cursor-default"
              >
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-indigo-100 group-hover:shadow-lg transition-all`}
                >
                  <f.icon size={22} className={f.color} />
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-indigo-600 rounded-2xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-indigo-400 rounded-full blur-3xl opacity-20 pointer-events-none" />
 
            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">Ready to launch your first campaign?</h2>
              <p className="text-indigo-100 text-lg font-medium">Join 500+ brands already running on India's most advanced entertainment ad-network.</p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/launch-campaign"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Book your slot <ArrowRight size={20} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-indigo-500 text-white font-bold rounded-xl border border-indigo-400 hover:bg-indigo-400 transition-all"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
