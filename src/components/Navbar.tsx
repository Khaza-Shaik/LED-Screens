import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Locations', to: '/locations' },
  { label: 'Plans', to: '/pricing' },
  { label: 'Analytics', to: '/analytics' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors shadow-sm">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              DOOH<span className="text-indigo-600">Platform</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {localStorage.getItem('token') && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              {localStorage.getItem('token') ? 'Dashboard' : 'Sign in'}
            </Link>
            <Link
              to="/launch-campaign"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              Launch Campaign
            </Link>
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
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    isActive(link.to) ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="block text-center py-3 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700">
                Sign in
              </Link>
              <Link to="/launch-campaign" className="block text-center py-3 rounded-lg bg-indigo-600 text-white text-sm font-semibold">
                Launch Campaign
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
