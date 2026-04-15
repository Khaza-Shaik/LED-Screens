import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a14] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center neon-glow">
                <Zap className="text-black fill-black" size={16} />
              </div>
              <span className="text-lg font-bold tracking-tighter neon-text">ANTIGRAVITY</span>
            </Link>
            <p className="text-zinc-400 text-sm mb-6">
              The premier platform for programmatic digital out-of-home advertising. Reach billions.
            </p>
            <div className="flex items-center gap-4 text-zinc-400">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider text-sm">PLATFORM</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link to="/locations" className="hover:text-primary transition-colors">Locations</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/analytics" className="hover:text-primary transition-colors">Analytics</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider text-sm">RESOURCES</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 tracking-wider text-sm">COMPANY</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Antigravity DOOH. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
