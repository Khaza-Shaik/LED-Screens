import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$299',
    duration: '/week',
    features: ['1 city campaign', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Growth',
    price: '$999',
    duration: '/month',
    features: ['10 city campaigns', 'Live analytics dashboard', 'Priority support'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    duration: '',
    features: ['Global campaigns', 'Advanced attribution', 'Dedicated account manager'],
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen app-bg text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black mb-4">Pricing</h1>
          <p className="text-zinc-400 text-lg">Flexible plans for campaigns of any size.</p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className="glass-card rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                {plan.name === 'Growth' && <Sparkles className="text-primary neon-text" size={18} />}
              </div>

              <p className="text-4xl font-black mb-8">
                {plan.price}
                <span className="text-lg font-medium text-zinc-400">{plan.duration}</span>
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-300">
                    <Check size={16} className="text-primary neon-text" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 rounded-2xl border border-primary/50 text-white font-bold hover:bg-primary/20 hover:neon-glow transition-all">
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
