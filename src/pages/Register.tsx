import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Play, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Bypassing the backend as requested
      localStorage.setItem('token', 'mock-token-12345');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-25" />

        <div className="relative z-10 flex items-center">
          <span className="text-white font-black text-xl tracking-tighter">JAAN ENTERTAINMENT</span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Launch your first campaign in under 5 minutes.
            </h2>
            <ul className="space-y-3 mt-6">
              {['340+ premium screen locations', 'Real-time impressions tracking', 'Instant campaign activation', 'No setup fees'].map(item => (
                <li key={item} className="flex items-center gap-3 text-indigo-100 text-sm font-medium">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full mx-auto"
        >
          <div className="flex items-center mb-8 lg:hidden justify-center text-center">
            <span className="font-black text-slate-900 text-xl tracking-tighter">JAAN ENTERTAINMENT</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500 font-medium text-sm">Free to start. No credit card required.</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ravi Kumar"
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Work email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  minLength={6}
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <p className="text-xs font-semibold text-rose-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : <>Create account <ArrowRight size={15} /></>}
            </button>

            <p className="text-center text-xs text-slate-400 font-medium">
              By creating an account, you agree to our{' '}
              <Link to="#" className="text-indigo-600 font-semibold">Terms</Link> and{' '}
              <Link to="#" className="text-indigo-600 font-semibold">Privacy Policy</Link>.
            </p>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign in <ArrowRight size={13} className="inline" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
