import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || location.pathname !== '/' ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center neon-glow">
            <Zap className="text-black fill-black" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter neon-text">HOME</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/locations" className={`${isActive('/locations') ? 'text-primary neon-text' : 'text-zinc-300'} hover:text-primary hover:neon-text transition-all`}>Locations</Link>
          <Link to="/pricing" className={`${isActive('/pricing') ? 'text-primary neon-text' : 'text-zinc-300'} hover:text-primary hover:neon-text transition-all`}>Plans</Link>
          <Link to="/analytics" className={`${isActive('/analytics') ? 'text-primary neon-text' : 'text-zinc-300'} hover:text-primary hover:neon-text transition-all`}>Analytics</Link>
          {localStorage.getItem('token') && (
            <Link to="/admin" className={`${isActive('/admin') ? 'text-primary neon-text' : 'text-zinc-300'} hover:text-primary hover:neon-text transition-all`}>Admin</Link>
          )}
          <Link to="/login" className={`${isActive('/login') ? 'text-primary neon-text' : 'text-zinc-300'} hover:text-primary hover:neon-text transition-all`}>
            {localStorage.getItem('token') ? 'Account' : 'Login'}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
