import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Invalid email or password');

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-6 lg:p-12 overflow-hidden">
      <div className="w-full max-w-7xl h-full max-h-[850px] flex gap-[30px] transition-all duration-500">
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[30px] flex-col p-12 relative overflow-hidden shadow-2xl shadow-indigo-200/50">
        {/* Decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-md">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">DOOHPlatform</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="relative z-10">
            <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              India's Most Advanced<br />DOOH Platform
            </h2>
            <p className="text-indigo-100 text-xl font-medium leading-relaxed mb-10 max-w-md">
              Deploy campaigns to 340+ premium screens. Real-time analytics. Instant go-live.
            </p>
            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {['bg-sky-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'].map((c, i) => (
                  <div key={i} className={`w-10 h-10 ${c} rounded-full border-2 border-indigo-600 shadow-lg`} />
                ))}
              </div>
              <p className="text-indigo-100 text-sm font-bold tracking-wide">Trusted by 500+ brands across India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 bg-white rounded-[30px] flex flex-col justify-center p-[40px] shadow-sm border border-slate-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-xl">DOOHPlatform</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-3">Welcome back</h1>
            <p className="text-slate-500 font-semibold text-base">Sign in to your account to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                <Link to="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 tracking-wide">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <p className="text-xs font-bold text-rose-700">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4.5 mt-4 bg-indigo-600 text-white text-base font-black rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50 hover:shadow-indigo-300/60 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {loading ? 'Signing in...' : <><Shield size={18} /> Sign in to dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> </>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-bold">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 font-black hover:text-indigo-700 underline underline-offset-4 decoration-2">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Login;
