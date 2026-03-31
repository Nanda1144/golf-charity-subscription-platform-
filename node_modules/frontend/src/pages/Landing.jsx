import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Trophy, Heart, Target, ChevronRight, Activity, Award,
  ArrowLeft, ArrowRight, ShieldCheck, Zap, Globe, Users, HelpCircle,
  Mail, Phone, MapPin, Linkedin, Twitter, Github,
  Monitor, Gift, Handshake, BarChart3, Coins, UserCircle,
  Hash, DollarSign, Calendar, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Footer from '../components/Footer';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-emerald-50 py-6 faq-accordion-item">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left group"
      >
        <span className="text-xl font-bold text-emerald-950 group-hover:text-gold-600 transition-colors">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-gold-500 text-white rotate-180' : 'bg-emerald-50 text-emerald-600'}`}>
          <ChevronRight size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-emerald-900/70 leading-relaxed font-medium text-lg">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Landing = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/charities/featured');
        setFeatured(data);
      } catch (err) { }
    };
    fetchFeatured();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const charities = [
    { name: "Clean Water Initiative", logo: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=100&h=100&fit=crop", desc: "Providing sustainable water systems to remote villages." },
    { name: "Education For All", logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop", desc: "Building schools and providing resources in underprivileged areas." },
    { name: "Green Earth Trust", logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop", desc: "Global reforestation projects and wildlife conservation." }
  ];

  const faqData = [
    { question: "How does the charity draw work?", answer: "Each month, members are automatically entered into the draw. Winners are selected randomly using a blockchain-verified engine to ensure total fairness. A portion of each subscription fee goes directly into the prize pool and charity fund." },
    { question: "How is my funding distributed to charities?", answer: "10% of every subscription is immediately allocated to our partner charities. We provide transparent monthly reports showing exactly where your contributions have gone and the impact they've made." },
    { question: "Can I choose which charity to support?", answer: "Yes! In your member dashboard, you can select your preferred charity from our list of vetted partners, and your contribution will be directed towards their specific projects." },
    { question: "How are golf scores recorded and used?", answer: "Members can log their golf scores after every round. These scores contribute to your global ranking and increase your chance of winning weekly mini-jackpots based on performance and participation." }
  ];

  const heroImages = [
    '/images/golf_main.jpg',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531206715517-5ca5c7da5ffb?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-375597ea3010?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&auto=format&fit=crop'
  ];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fffdfa] overflow-hidden selection:bg-gold-100 selection:text-gold-900">
      {/* Dynamic Navbar */}
      <nav className="fixed w-full z-50 glass-effect border-b border-gold-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <button
                type="button"
                onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/')}
                className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-950/10 bg-white text-emerald-900 shadow-sm"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-12 h-12 emotion-gradient rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-900/20 group-hover:rotate-6 transition-transform">G&C</div>
              <span className="text-2xl font-bold tracking-tighter text-emerald-950 uppercase italic">Golf  <span className="text-gold-600">Charity Rewards</span> platform </span>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/pricing" className="text-emerald-950 font-bold text-xs uppercase tracking-widest hover:text-gold-600 transition">Membership</Link>
              <a href="#how-it-works" className="text-emerald-950 font-bold text-xs uppercase tracking-widest hover:text-gold-600 transition">How It Works</a>
              <a href="#charities" className="text-emerald-950 font-bold text-xs uppercase tracking-widest hover:text-gold-600 transition">Charities</a>
              <a href="#faq" className="text-emerald-950 font-bold text-xs uppercase tracking-widest hover:text-gold-600 transition">FAQ</a>
              {user ? (
                <Link to={user.isAdmin ? "/admin" : "/dashboard"} className="px-8 py-3 emotion-gradient text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-105 transition active:scale-95">My Portal</Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="px-6 py-3 border border-emerald-950/20 text-emerald-950 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition">Login</Link>
                  <Link to="/register" className="px-6 py-3 border border-gold-300 text-gold-700 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gold-50 transition">Sign Up</Link>
                  <Link to="/dashboard?explore=true" className="px-8 py-3 emotion-gradient text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-105 transition active:scale-95 btn-impact">Guest Demo</Link>
                </div>
              )}
              
            </div>
          </div>
          
        </div>
        
      </nav>

      {/* Hero Section - Emotional & Dynamic */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Slideshow (50-60% opacity with crossfade) */}
        
        <div className="absolute inset-0 -z-10 bg-black">
           <AnimatePresence mode="wait">
             <motion.div 
               key={currentHero}
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.55 }} // Precision 55% as per request range
               exit={{ opacity: 0 }}
               transition={{ duration: 1 }}
               className="absolute inset-0"
               style={{ 
                 backgroundImage: `url('${heroImages[currentHero]}')`, 
                 backgroundSize: 'cover', 
                 backgroundPosition: 'center'
               }}
             />
           </AnimatePresence>
        </div>

        {/* glass-effect class removed for raw visual clarity */}
        <div className="max-w-7xl mx-auto text-center relative z-10 p-10 md:p-20 transition-all">
         
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gold-50 text-gold-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-gold-100 shadow-sm"
          >
            <Zap size={16} className="animate-pulse" /> Play For A Greener Future
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-7xl md:text-8xl font-bold text-emerald-950 leading-[0.95] tracking-tight mb-8 italic"
          >
            Swing To <span className="text-gold-600 block sm:inline">Change</span> Lives.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-emerald-900/70 max-w-2xl mx-auto mb-12 font-medium leading-relaxed italic"
          >
            Impact Golf is where competitive spirit meets humanitarian heart. Every stroke you record, every membership tier you choose, fuels global impact projects that matter.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link to="/register" className="px-12 py-6 emotion-gradient text-white rounded-[2rem] font-bold text-xl shadow-2xl shadow-emerald-950/30 hover:-translate-y-2 transition active:scale-95 flex items-center justify-center gap-3 group">
              Sign Up Now <ArrowRight size={24} className="group-hover:translate-x-2 transition" />
            </Link>
            <Link to="/login" className="px-12 py-6 bg-white border-2 border-emerald-950/10 text-emerald-950 rounded-[2rem] font-bold text-xl hover:bg-emerald-50 hover:border-emerald-200 transition active:scale-95 shadow-sm">
              Login
            </Link>
            <Link to="/pricing" className="px-12 py-6 bg-white border-2 border-emerald-950/10 text-emerald-950 rounded-[2rem] font-bold text-xl hover:bg-gold-50 hover:border-gold-200 transition active:scale-95 shadow-sm">
              View Impact Tiers
            </Link>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[10%] top-[40%] hidden xl:block opacity-20"
        >
          <Trophy size={160} className="text-gold-600" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[50%] hidden xl:block opacity-20"
        >
          <Heart size={140} className="text-emerald-700" />
        </motion.div>
      </section>

      {/* How It Works - Draw & Logic */}
      <section id="how-it-works" className="py-32 bg-white relative px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-gold-600 font-bold text-sm uppercase tracking-[0.4em]">The Engine of Impact</span>
            <h2 className="text-5xl font-bold text-emerald-950 mt-4 leading-tight italic">How the Draw Works</h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: UserCircle, title: "1. Join Network", desc: "Subscribe to a tier that fits your commitment level." },
              { icon: Calendar, title: "2. Automatic Entry", desc: "Your membership secures your spot in all monthly draws." },
              { icon: Hash, title: "3. Smart Selection", desc: "Our algorithm ensures fair distribution based on tiers." },
              { icon: Award, title: "4. Claim Victory", desc: "Winners get jackpots while charities get the lion's share." }
            ].map((step, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-[#fffdfa] border border-gold-100 rounded-[2.5rem] hover-lift text-center shadow-xl shadow-gold-900/5"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto mb-6 shadow-inner">
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-emerald-950 mb-3">{step.title}</h3>
                <p className="text-emerald-900/60 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Funding & Charity Impact */}
      <section className="py-32 bg-emerald-950 text-white relative px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp}>
              <h4 className="text-gold-400 font-bold text-sm uppercase tracking-[0.3em] mb-4">Financial Ethics</h4>
              <h2 className="text-5xl font-bold mb-8 leading-tight italic">Funding to Charity</h2>
              <p className="text-xl text-emerald-100/70 mb-12 leading-relaxed italic">
                Transparency is our core currency. We don't just donate; we invest in measurable outcomes. 10% of every dollar stays locked for charity funding, guaranteed.
              </p>

              <div className="space-y-6">
                {[
                  { label: "Partner Funding", val: "65%", color: "bg-gold-500" },
                  { label: "Community Jackpot", val: "25%", color: "bg-emerald-500" },
                  { label: "Network Operations", val: "10%", color: "bg-emerald-300" }
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest mb-2">
                      <span>{bar.label}</span>
                      <span>{bar.val}</span>
                    </div>
                    <div className="h-2 w-full bg-emerald-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: bar.val }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={`h-full ${bar.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...fadeInUp}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-950/50"
            >
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=800&fit=crop"
                alt="Impact"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-emerald-900/40 mix-blend-multiply"></div>
              <div className="absolute bottom-10 left-10 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-4xl font-bold text-white mb-2">$12.5M+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Total Funds Disbursed</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Charities List */}
      <section id="charities" className="py-32 bg-[#fffdfa] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-gold-600 font-bold text-sm uppercase tracking-[0.4em]">Global Partners</span>
            <h2 className="text-5xl font-bold text-emerald-950 mt-4 italic">Our Vetted Charities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(featured.length > 0 ? featured : charities).map((c, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                whileHover={{ y: -20 }}
                className="group p-10 bg-white rounded-[3rem] shadow-2xl shadow-gold-900/5 border border-gold-50 hover:border-gold-200 transition-all"
              >
                <div className="w-20 h-20 rounded-3xl bg-gold-50 mb-8 flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                  <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-950 mb-4">{c.name}</h3>
                <p className="text-emerald-900/60 font-medium mb-8 leading-relaxed italic">"{c.description || c.desc}"</p>
                <div className="flex items-center gap-2 text-gold-600 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all cursor-pointer">
                  Learn More <ArrowRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Golf Gaming & Jackpots */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-gold-600 font-bold text-sm uppercase tracking-[0.4em]">Interactive Excellence</span>
            <h2 className="text-5xl font-bold text-emerald-950 mt-4 leading-tight italic">Golf Gaming & Jackpots</h2>
          </div>

          <div className="space-y-24">
            <motion.div {...fadeInUp} className="flex flex-col md:flex-row gap-16 items-center">
              <div className="flex-1">
                <div className="w-14 h-14 emotion-gradient rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Activity size={28} />
                </div>
                <h3 className="text-3xl font-bold text-emerald-950 mb-6 italic">Precision Scoring Engine</h3>
                <p className="text-lg text-emerald-900/70 font-medium leading-relaxed mb-8 italic">
                  Log your scores after every game. Our advanced handicap engine tracks your progress and automatically qualifies you for skill-based awards.
                </p>
                <ul className="space-y-4 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                  <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-gold-500" /> Real-time leaderboard</li>
                  <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-gold-500" /> Global ranking system</li>
                </ul>
              </div>
              <div className="flex-1 w-full aspect-video bg-emerald-50 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <BarChart3 size={120} className="text-emerald-300" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-effect rounded-2xl border border-white/50">
                  <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest mb-1">Weekly Top Player</p>
                  <p className="text-xl font-bold text-emerald-950 italic">J. Alexander • -4 Under Par</p>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} className="flex flex-col md:flex-row-reverse gap-16 items-center">
              <div className="flex-1">
                <div className="w-14 h-14 gold-gradient rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                  <Coins size={28} />
                </div>
                <h3 className="text-3xl font-bold text-emerald-950 mb-6 italic">The Mega Jackpot</h3>
                <p className="text-lg text-emerald-900/70 font-medium leading-relaxed mb-8 italic">
                  Every subscription contributes to the Mega Jackpot. Drawn monthly, this life-changing pool is split between a winning member and their chosen charity.
                </p>
                <button className="px-8 py-4 bg-emerald-950 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gold-600 transition shadow-lg">
                  See Current Jackpot
                </button>
              </div>
              <div className="flex-1 w-full aspect-video bg-gold-50 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <Gift size={120} className="text-gold-300" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-effect rounded-2xl border border-white/50">
                  <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest mb-1">Active Pool</p>
                  <p className="text-4xl font-bold text-gold-700">$250,000</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 bg-[#fafafa] px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <HelpCircle size={48} className="mx-auto text-gold-500 mb-6" />
            <h2 className="text-5xl font-bold text-emerald-950 mb-4 italic">Common Queries</h2>
            <p className="text-emerald-900/60 font-bold uppercase tracking-widest text-xs">Everything you need to know about Impact Golf</p>
          </div>

          <div className="space-y-2">
            {faqData.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
