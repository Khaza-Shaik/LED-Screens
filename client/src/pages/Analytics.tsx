import { BarChart3, Eye, MousePointerClick, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Impressions', value: '24.6M', icon: Eye },
  { label: 'Engagement', value: '7.3%', icon: MousePointerClick },
  { label: 'Conversions', value: '14.2K', icon: TrendingUp },
];

const Analytics = () => {
  return (
    <div className="min-h-screen app-bg text-zinc-900 pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black mb-4">Analytics</h1>
          <p className="text-zinc-600 text-lg">Track campaign performance in real time across every billboard.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-card rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-zinc-600">{label}</p>
                <Icon size={20} className="text-primary" />
              </div>
              <p className="text-4xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-primary" size={20} />
            <h2 className="text-2xl font-bold">Campaign Trend</h2>
          </div>

          <div className="h-72 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10 flex items-center justify-center">
            <p className="text-zinc-500">Analytics chart placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
