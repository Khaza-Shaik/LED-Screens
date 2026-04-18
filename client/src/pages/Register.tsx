import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-bg text-white relative flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-y-auto">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[400px] w-full relative z-10"
      >
        <div className="glass-card rounded-[2rem] p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20 mb-6 group hover:scale-110 transition-transform duration-500">
              <UserPlus className="text-secondary group-hover:animate-pulse" size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Identity</span></h1>
            <p className="text-zinc-500 font-medium">Join the next generation of DOOH advertising.</p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-white placeholder:text-zinc-600"
              />
            </div>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work Email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-white placeholder:text-zinc-600"
              />
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Password"
                minLength={6}
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-white placeholder:text-zinc-600"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-red-400" /> {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-white text-black font-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Initialize Account'}
            </button>
          </form>

          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-10 text-center">
            Member of the network?{' '}
            <Link to="/login" className="text-secondary hover:text-white transition-colors">
              Authorize Now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
