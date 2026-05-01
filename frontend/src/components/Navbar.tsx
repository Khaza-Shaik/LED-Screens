import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Locations', to: '/locations' },
    { label: 'Plans', to: '/pricing' },
    { label: userRole === 'admin' ? 'Live Booking' : 'My Bookings', to: '/slot-booked' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-3 border-b border-slate-100'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 group-hover:border-indigo-500 transition-all">
              <img src="/logo.jpg" alt="Jaan Logo" className="w-full h-full object-cover" />
            </div>
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-[18px] font-black tracking-tight text-white transition-colors flex items-center overflow-hidden relative">
                <span className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">JAAN</span>
                <span className="text-rose-600 font-bold ml-1 relative overflow-hidden inline-flex items-center px-1 h-full">
                  ENTERTAINMENT
                </span>
              </span>
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive(link.to)
                    ? 'text-indigo-600 bg-indigo-50'
                    : scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {userRole === 'admin' && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive('/admin') 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {!token ? (
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-bold transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-700 hover:text-slate-900'}`}
              >
                Sign in
              </Link>
            ) : null}
            <Link
              to="/launch-campaign"
              className={`px-5 py-2.5 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] ${
                scrolled ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              Book your slot
            </Link>
            {token && (
              <button
                onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all border shadow-sm ${
                  scrolled 
                    ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sign out
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 shadow-xl pt-20 pb-6 px-6">
            <nav className="flex flex-col gap-1 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    isActive(link.to) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                    isActive('/admin') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
            <div className="flex flex-col gap-3">
              {!token ? (
                <Link to="/login" className="block text-center py-3 rounded-lg border border-slate-200 text-sm font-bold text-slate-700">
                  Sign in
                </Link>
              ) : null}
              <Link to="/launch-campaign" className="block text-center py-4 rounded-xl bg-indigo-600 text-white text-sm font-black active:scale-[0.98] transition-transform shadow-lg shadow-indigo-200">
                Book your slot
              </Link>
              {token && (
                <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="block w-full text-center py-3 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 bg-white shadow-sm">
                  Sign out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
