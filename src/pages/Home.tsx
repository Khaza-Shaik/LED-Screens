import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Globe, Layers, Shield, TrendingUp, Zap, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { value: '2.4B+', label: 'Daily Impressions', delta: '+18%' },
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
    desc: 'Measure impressions, dwell time, and audience reach in real-time. Export reports directly to your BI tools.',
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
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

const inventoryHighlights = [
  { city: 'Vijayawada', screens: 12, impressions: '4.2M/day', status: 'live' },
  { city: 'Hyderabad', screens: 28, impressions: '11.8M/day', status: 'live' },
  { city: 'Bangalore', screens: 35, impressions: '15.6M/day', status: 'live' },
  { city: 'Chennai', screens: 19, impressions: '8.1M/day', status: 'limited' },
];

const Home = () => {
  return (
    <div className="app-bg min-h-screen">

      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 tracking-wide">India's #1 Programmatic DOOH Platform</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-5xl md:text-[72px] font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6"
            >
              Reach Billions.
              <br />
              <span className="text-indigo-600">Everywhere They Go.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-500 font-medium max-w-2xl mb-10 leading-relaxed"
            >
              Deploy, manage, and optimize digital billboard campaigns across India's premium outdoor inventory — in real-time, from a single platform.
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
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.35)] hover:shadow-[0_6px_20px_0_rgba(79,70,229,0.45)] hover:-translate-y-0.5 active:translate-y-0"
              >
                Launch a Campaign <ArrowRight size={18} />
              </Link>
              <Link
                to="/locations"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-800 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                Browse Inventory <ChevronRight size={18} className="text-slate-400" />
              </Link>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-200 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <MapPin size={18} className="text-indigo-500" />
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    city.status === 'live'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}>
                    {city.status === 'live' ? '● Live' : '◐ Limited'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{city.city}</h3>
                <p className="text-sm text-slate-500 font-medium mb-4">{city.screens} screens</p>
                <div className="divider mb-4" />
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-700">{city.impressions}</span>
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
                className="bg-white border border-slate-200 rounded-xl p-7 hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className={`w-10 h-10 ${f.bg} rounded-lg flex items-center justify-center mb-5`}>
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
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
            <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-sky-400 rounded-full blur-3xl opacity-20 pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">Ready to launch your first campaign?</h2>
              <p className="text-indigo-200 text-lg font-medium">Join 500+ brands already running on India's most advanced DOOH platform.</p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/launch-campaign"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5"
              >
                Get Started <ArrowRight size={18} />
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
