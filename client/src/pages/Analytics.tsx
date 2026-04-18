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

          <div className="h-80 rounded-2xl bg-black/40 border border-white/5 p-8 flex items-end gap-3 relative overflow-hidden group">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
            
            {/* Mock Chart Bars */}
            {[40, 70, 45, 90, 65, 85, 55, 75, 50, 95, 60, 80].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                <div 
                  className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-lg transition-all duration-700 ease-out group-hover/bar:brightness-125"
                  style={{ height: `${height}%`, boxShadow: `0 0 20px rgba(0, 242, 255, ${height/200})` }}
                />
                <span className="text-[10px] text-zinc-600 font-bold">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
