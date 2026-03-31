import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Heart, Zap, Globe, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Footer from '../components/Footer';

const Pricing = () => {
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    // Navigate to local mock payment instead of external stripe for MVP training
    navigate(`/payment?plan=${plan}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-32 italic">
        {/* Hero Header */}
        <header className="pt-32 pb-24 px-6 bg-emerald-50 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-32 opacity-10 blur-3xl -z-10 bg-emerald-700 w-96 h-96 rounded-full" />
           <div className="max-w-7xl mx-auto text-center">
              <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm">
                 <Heart size={14}/> Impact Tiers
              </motion.div>
              <motion.h1 {...fadeInUp} transition={{ delay: 0.2 }} className="text-6xl font-bold text-emerald-950 tracking-tighter mb-6">
                 Choose Your <span className="text-gold-600">Impact</span> Power.
              </motion.h1>
              <motion.p {...fadeInUp} transition={{ delay: 0.4 }} className="text-xl text-emerald-900/60 max-w-2xl mx-auto font-medium leading-relaxed">
                 10% of every membership is instantly allocated to your chosen global project. Select a tier and join the platform for change.
              </motion.p>
           </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 -mt-16 relative z-10">
           {/* Monthly Tier */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="p-12 bg-white rounded-[3rem] border border-emerald-50 shadow-2xl shadow-emerald-900/5 group hover-lift"
           >
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-2xl font-bold text-emerald-950 mb-2">Monthly Impact</h3>
                    <p className="text-emerald-900/40 text-[10px] font-bold uppercase tracking-widest leading-none">Sustainability Plan</p>
                 </div>
                 <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-700 opacity-40 group-hover:opacity-100 transition duration-500">
                    <Zap size={24} />
                 </div>
              </div>
              <div className="flex items-baseline gap-2 mb-10">
                 <span className="text-5xl font-bold text-emerald-950">$12.99</span>
                 <span className="text-emerald-900/40 font-bold uppercase text-[10px] tracking-widest">/ Per Month</span>
              </div>
              
              <div className="space-y-6 mb-12">
                {[
                  "Direct 10% Charity Allocation",
                  "Full Entry into Monthly Draw pools",
                  "Stabilford Performance Tracking",
                  "Impact Intelligence reports",
                  "Dedicated Winner verification Audit"
                ].map((f, i) => (
                  <div key={i} className="flex gap-4 items-center">
                     <div className="w-5 h-5 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-700">
                        <Check size={14} strokeWidth={4} />
                     </div>
                     <span className="text-sm font-bold text-emerald-900/60">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe('monthly')}
                className="w-full py-6 emotion-gradient text-white rounded-3xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/20 active:scale-95 transition"
              >
                 Initialize Membership
              </button>
              <p className="text-center text-[10px] font-bold uppercase text-emerald-900/20 mt-6 tracking-widest">Cancel your impact anytime</p>
           </motion.div>

           {/* Yearly Tier */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="p-12 emotion-gradient rounded-[3rem] shadow-2xl shadow-emerald-950/30 text-white relative overflow-hidden group hover-lift border-t-[8px] border-gold-500"
           >
              <div className="absolute top-0 right-0 p-6 bg-gold-600/50 text-[10px] font-bold uppercase tracking-widest rounded-bl-3xl shadow-xl z-10">
                 Most Powerful Impact
              </div>
              <div className="flex justify-between items-start mb-10">
                 <div>
                    <h3 className="text-2xl font-bold mb-2">Yearly Legacy</h3>
                    <p className="text-emerald-100/40 text-[10px] font-bold uppercase tracking-widest leading-none">Full Platform Commitment</p>
                 </div>
                 <div className="p-4 bg-white/10 rounded-2xl text-white">
                    <Globe size={24} />
                 </div>
              </div>
              <div className="flex items-baseline gap-2 mb-10">
                 <span className="text-5xl font-bold text-white">$119.99</span>
                 <span className="text-emerald-100/40 font-bold uppercase text-[10px] tracking-widest">/ Per Year</span>
              </div>
              
              <div className="space-y-6 mb-12">
                {[
                  "Reduced 25% Annual Overhead fee",
                  "Permanent Legacy Status (Badge)",
                  "All Monthly Draw pool entries",
                  "Priority Winner Verification Audit",
                  "Advanced Score Analytic AI simulations",
                  "Direct partner event invites"
                ].map((f, i) => (
                  <div key={i} className="flex gap-4 items-center">
                     <div className="w-5 h-5 bg-white/10 rounded-md flex items-center justify-center text-gold-400">
                        <Check size={14} strokeWidth={4} />
                     </div>
                     <span className="text-sm font-bold text-emerald-100/60">{f}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe('yearly')}
                className="w-full py-6 bg-white text-emerald-950 rounded-3xl font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition impact-shadow"
              >
                 Commit To The Year
              </button>
              <p className="text-center text-[10px] font-bold uppercase text-white/20 mt-6 tracking-widest">Secures 12 months for chosen charity</p>
           </motion.div>
        </div>

        {/* Trust Banner */}
        <div className="max-w-7xl mx-auto px-6 mt-32 text-center">
           <p className="text-[10px] font-bold uppercase text-emerald-900/40 tracking-[0.4em] mb-12">System Protection</p>
           <div className="flex flex-wrap justify-center gap-16 grayscale opacity-40">
              <div className="flex items-center gap-3 font-bold text-emerald-950 uppercase tracking-tighter text-xl">
                 <ShieldCheck /> PRD COMPLIANT
              </div>
              <div className="flex items-center gap-3 font-bold text-emerald-950 uppercase tracking-tighter text-xl">
                 <ShieldCheck /> PCI SECURE
              </div>
              <div className="flex items-center gap-3 font-bold text-emerald-950 uppercase tracking-tighter text-xl">
                 <ShieldCheck /> IMPACT VERIFIED
              </div>
           </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
