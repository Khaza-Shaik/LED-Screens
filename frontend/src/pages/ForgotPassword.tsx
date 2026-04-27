import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Simulate API call to reset password
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="flex items-center justify-center mb-8">
          <span className="font-black text-slate-900 text-2xl tracking-tighter">JAAN ENTERTAINMENT</span>
        </div>

        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 rounded-[24px] sm:px-10 border border-slate-100">
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset password</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="space-y-6" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {loading ? 'Sending link...' : <>Send reset link <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Check your email</h2>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                We've sent password reset instructions to <br/>
                <span className="font-bold text-slate-900">{email}</span>
              </p>
              <Link
                to="/login"
                className="w-full flex items-center justify-center py-4 bg-slate-50 text-slate-900 text-sm font-black rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
              >
                Back to sign in
              </Link>
            </div>
          )}

          {!submitted && (
            <div className="mt-8 text-center">
              <Link to="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                &larr; Back to sign in
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
