import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const plans = [
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
    desc: 'Unlimited scale with a dedicated DOOH media team.',
    features: ['Pan-India coverage', 'Unlimited screens', 'Advanced attribution & API', 'Dedicated account manager', 'Custom SLA', 'Quarterly business reviews'],
    cta: 'Talk to Sales',
    highlight: false,
  },
];

const Pricing = () => {
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-2xl border transition-all ${
                plan.highlight
                  ? 'border-indigo-500 shadow-[0_0_0_1px_rgba(79,70,229,0.3),0_20px_40px_-8px_rgba(79,70,229,0.2)]'
                  : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-sm">
                  <Sparkles size={11} /> {plan.badge}
                </div>
              )}

              <div className="p-7">
                {/* Name & desc */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h2>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{plan.desc}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">{plan.price}</span>
                    {plan.duration && <span className="text-slate-400 font-medium mb-1">{plan.duration}</span>}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                      <Check size={15} className="text-indigo-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={plan.name === 'Enterprise' ? '#' : '/launch-campaign'}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                    plan.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {plan.cta} <ArrowRight size={15} />
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
