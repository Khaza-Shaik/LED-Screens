import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const defaultPlans = [
  {
    name: 'Starter',
    badge: null,
    price: '₹24,999',
    duration: '/week',
    desc: 'Perfect for brand-building campaigns in a single market.',
    features: ['1 city campaign', 'Up to 5 screens', 'Basic analytics dashboard', 'Email support', '72hr campaign activation'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    badge: 'Most Popular',
    price: '₹79,999',
    duration: '/month',
    desc: 'The go-to plan for scaling brands across multiple cities.',
    features: ['10 city campaigns', 'Up to 40 screens', 'Live analytics & attribution', 'Priority support (4hr SLA)', 'Same-day activation', 'Custom branding'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    badge: null,
    price: 'Custom',
    duration: '',
    desc: 'Unlimited scale with a dedicated Jaan Entertainment media team.',
    features: ['Pan-India coverage', 'Unlimited screens', 'Advanced attribution & API', 'Dedicated account manager', 'Custom SLA', 'Quarterly business reviews'],
    cta: 'Talk to Sales',
    highlight: false,
  },
];

const Pricing = () => {
  const [plans, setPlans] = useState(defaultPlans);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/plans');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setPlans(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch plans, using defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="app-bg min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-4">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">Simple, transparent pricing.</h1>
          <p className="text-lg text-slate-500 font-medium">Start small. Scale fast. No hidden fees.</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -12 }}
                className={`relative bg-white rounded-[32px] border transition-all duration-500 ${
                  plan.highlight
                    ? 'border-indigo-500 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.2)]'
                    : 'border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]'
                }`}
              >
                {plan.badge && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10"
                  >
                    <Sparkles size={11} className="animate-pulse" /> {plan.badge}
                  </motion.div>
                )}
  
                <div className="p-10">
                  {/* Name & desc */}
                  <div className="mb-8">
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{plan.name}</h2>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{plan.desc}</p>
                  </div>
  
                  {/* Price */}
                  <div className="mb-8 pb-8 border-b border-slate-50">
                    <div className="flex items-end gap-1.5">
                      <span className="text-5xl font-black tracking-tighter text-slate-900">{plan.price}</span>
                      {plan.duration && <span className="text-slate-400 font-bold text-sm mb-1.5 uppercase tracking-wider">{plan.duration}</span>}
                    </div>
                  </div>
  
                  {/* Features */}
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f, fi) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -5 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (fi * 0.1) }}
                        key={f} 
                        className="flex items-start gap-3.5 text-sm font-semibold text-slate-600 group/item"
                      >
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors">
                          <Check size={12} className="text-emerald-600 group-hover/item:text-white transition-colors" />
                        </div>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
  
                  {/* CTA */}
                  <Link
                    to={plan.name === 'Enterprise' ? '#' : '/launch-campaign'}
                    className={`flex items-center justify-center gap-2 w-full py-4.5 rounded-2xl text-sm font-extrabold transition-all active:scale-[0.98] ${
                      plan.highlight
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200'
                        : 'bg-slate-50 text-slate-900 border border-slate-100 hover:border-slate-200 hover:bg-white'
                    }`}
                  >
                    {plan.cta} <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-slate-400 font-medium mt-12">
          All plans include GST. Prices are subject to inventory availability. <Link to="#" className="text-indigo-500 font-semibold hover:text-indigo-600">Read FAQs →</Link>
        </p>
      </div>
    </div>
  );
};

export default Pricing;
