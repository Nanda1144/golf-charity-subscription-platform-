import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 pt-32 pb-16 text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-12 lg:gap-8 mb-24 border-b border-white/10 pb-24">
          {/* Column 1: Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white text-emerald-950 rounded-xl flex items-center justify-center font-bold">G&C</div>
              <span className="text-xl font-bold tracking-tighter uppercase italic">GOLF <span className="text-gold-400">Charity Rewards</span> platform </span>
            </div>
            <p className="text-emerald-100/40 text-sm leading-relaxed mb-8 italic">
              Bridging the gap between athletic excellence and global humanitarian aid. 
            </p>
            <div className="flex gap-4">
               <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors"><Twitter size={18} /></a>
               <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors"><Linkedin size={18} /></a>
               <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 transition-colors"><Github size={18} /></a>
            </div>
          </div>

          {/* Column 2: Menu */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400 mb-8 italic">Navigation</h5>
            <div className="footer-link-group">
              <Link to="/" className="text-emerald-100/60 hover:text-white transition text-sm font-medium">Home Portal</Link>
              <Link to="/pricing" className="text-emerald-100/60 hover:text-white transition text-sm font-medium">Membership</Link>
              <Link to="/login" className="text-emerald-100/60 hover:text-white transition text-sm font-medium">Player Access</Link>
              <Link to="/register" className="text-emerald-100/60 hover:text-white transition text-sm font-medium">Guest Demo</Link>
            </div>
          </div>

          {/* Column 3: Features */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400 mb-8 italic">Features</h5>
            <div className="footer-link-group">
              <span className="text-emerald-100/60 text-sm font-medium">Charity Draw</span>
              <span className="text-emerald-100/60 text-sm font-medium">Score Tracking</span>
              <span className="text-emerald-100/60 text-sm font-medium">Mega Jackpots</span>
              <span className="text-emerald-100/60 text-sm font-medium">Impact Reports</span>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-1">
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400 mb-8 italic">Contact Details</h5>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-emerald-100/60">
                 <Mail size={18} className="text-gold-500 shrink-0" />
                 <span className="text-sm font-medium">contact@golfcharityrewards.com</span>
              </div>
              <div className="flex items-start gap-3 text-emerald-100/60">
                 <Phone size={18} className="text-gold-500 shrink-0" />
                 <span className="text-sm font-medium">+91 9123456789</span>
              </div>
              <div className="flex items-start gap-3 text-emerald-100/60">
                 <MapPin size={18} className="text-gold-500 shrink-0" />
                 <span className="text-sm font-medium italic">St. Andrews, Scotland • Impact Hub</span>
              </div>
            </div>
          </div>

          {/* Column 5: Founder Details */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400 mb-8 italic">The Visionary</h5>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500">
                <img src="" alt="Founder" />
              </div>
              <div>
                 <p className="text-sm font-bold">Name </p>
                 <p className="text-[10px] uppercase text-gold-400 font-bold">Founder / CEO</p>
              </div>
            </div>
            <p className="text-xs text-emerald-100/40 italic leading-relaxed">
              "We believe every swing can rewrite a story."
            </p>
          </div>

          {/* Column 6: Top Charities */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400 mb-8 italic">Core Charities</h5>
            <div className="footer-link-group">
              <span className="text-emerald-100/60 text-sm font-medium italic">Ocean Clean-Up</span>
              <span className="text-emerald-100/60 text-sm font-medium italic">Save The Children</span>
              <span className="text-emerald-100/60 text-sm font-medium italic">Action Against Hunger</span>
              <span className="text-emerald-100/60 text-sm font-medium italic">The Water Project</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-emerald-100/20 text-xs font-bold uppercase tracking-[0.5em] bold">
            © 2026 Impact Golf Network • The Architecture Of Hope
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-emerald-100/40">
            <a href="#" className="hover:text-gold-400 transition">Privacy Cipher</a>
            <a href="#" className="hover:text-gold-400 transition">Terms of Engagement</a>
            <a href="#" className="hover:text-gold-400 transition">Impact Audit</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
