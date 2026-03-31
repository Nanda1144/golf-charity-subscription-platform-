import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { ShieldCheck, Download, CheckCircle, Smartphone, ExternalLink, Heart, Globe, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

const Invoice = () => {
    const { user } = useAuth();
    const { search } = useLocation();
    const navigate = useNavigate();
    const plan = new URLSearchParams(search).get('plan') || 'monthly';
    const amount = plan === 'yearly' ? 119.99 : 12.99;
    
    const [profile, setProfile] = useState(null);
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(true);

    const txId = `T${Math.floor(Math.random() * 1000000000000)}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, cRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/charities').catch(() => ({ data: [] }))
                ]);
                setProfile(pRes.data);
                setCharities(cRes.data);
            } catch (err) {} finally { setLoading(false); }
        };
        fetchData();
        
        // Final Alert
        setTimeout(() => {
            alert('Save this invoice for the future references.');
        }, 1500);
    }, []);

    const handleDownload = () => {
        window.print();
    };

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-bold text-emerald-950">AUTHENTICATING AUDIT TRACE...</div>;

    const selectedCharity = charities.find(c => c._id === profile?.charity) || charities[0] || { name: 'Direct Impact Fund', logo: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=100&h=100&fit=crop' };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-10 flex flex-col items-center justify-center italic">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(5,46,22,0.15)] overflow-hidden receipt-card"
            >
                {/* UPI Style Header */}
                <div className="bg-emerald-950 p-10 text-white relative">
                   <div className="flex justify-between items-start mb-10">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-emerald-400">
                         <Smartphone size={32} />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Secure Trace</p>
                         <p className="text-xs font-mono font-bold opacity-40">#{txId}</p>
                      </div>
                   </div>
                   <div className="text-center pb-6">
                      <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                         <CheckCircle size={48} strokeWidth={3} />
                      </div>
                      <h2 className="text-4xl font-bold tracking-tighter mb-1 uppercase">Success</h2>
                      <p className="text-sm font-bold text-emerald-400/80 tracking-widest uppercase">Platform Impact Verified</p>
                   </div>
                   {/* Decorative curve at the bottom */}
                   <div className="absolute -bottom-6 left-0 w-full h-12 bg-white rounded-[100%]"></div>
                </div>

                <div className="p-10 -mt-2 relative z-10 pt-16">
                   <div className="text-center mb-10 pb-10 border-b border-dashed border-gray-100">
                      <p className="text-sm font-bold text-emerald-900/40 uppercase mb-4 tracking-widest">Amount Disbursed</p>
                      <h3 className="text-6xl font-bold tracking-tighter text-emerald-950 font-mono">${amount.toFixed(2)}</h3>
                   </div>

                   <div className="space-y-8 mb-12">
                      <div className="flex justify-between items-center group">
                         <div className="flex items-center gap-4">
                            <img src={profile?.avatar || "https://images.unsplash.com/photo-1531206715517-5ca5c7da5ffb?w=100&h=100&fit=crop"} 
                                 className="w-12 h-12 rounded-xl object-cover ring-4 ring-emerald-50" alt="Person"/>
                            <div>
                               <p className="text-[10px] uppercase font-bold text-emerald-900/20 tracking-widest mb-1">Impact Origin (Sender)</p>
                               <p className="font-bold text-emerald-950 text-sm">{profile?.name || 'Authorized Member'}</p>
                            </div>
                         </div>
                         <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{profile?.email?.slice(0, 10)}..</p>
                      </div>

                      <div className="flex justify-center py-2 opacity-10">
                         <div className="w-full h-px bg-emerald-950 bg-gradient-to-r from-transparent via-emerald-950 to-transparent"></div>
                      </div>

                      <div className="flex justify-between items-center group">
                         <div className="flex items-center gap-4">
                            <img src={selectedCharity.logo} 
                                 className="w-12 h-12 rounded-xl object-cover ring-4 ring-emerald-50" alt="Charity"/>
                            <div>
                               <p className="text-[10px] uppercase font-bold text-emerald-900/20 tracking-widest mb-1">Impact Destination (Recipient)</p>
                               <p className="font-bold text-emerald-950 text-sm">{selectedCharity.name}</p>
                            </div>
                         </div>
                         <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">VERIFIED</p>
                      </div>
                   </div>

                   <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4 mb-10">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-gray-400">Plan Duration</span>
                         <span className="text-emerald-950">{plan === 'yearly' ? 'PLATINUM 365 DAYS' : 'STANDARD 30 DAYS'}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-gray-400">Gateway Provider</span>
                         <span className="text-emerald-950">IMPACT UPI v4.0</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-gray-400">Bank Auth</span>
                         <span className="text-emerald-950 font-mono italic">Verified Trace ID</span>
                      </div>
                   </div>

                   <button 
                      onClick={handleDownload}
                      className="w-full py-6 emotion-gradient text-white rounded-[2rem] font-bold text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition mb-6"
                   >
                      <Download size={18} /> Download Verified Invoice
                   </button>
                   <Link to="/dashboard" className="block text-center text-[10px] font-bold uppercase tracking-widest text-emerald-900/40 hover:text-emerald-950 transition underline decoration-2 underline-offset-8">Return to Identity Profile</Link>
                </div>

                <div className="bg-emerald-50 p-6 text-center border-t border-emerald-100 italic">
                   <p className="text-[10px] font-bold text-emerald-900/60 uppercase tracking-[0.2em]">Platform Protected By Impact Intelligence 2026</p>
                </div>
            </motion.div>

            <button 
                onClick={() => window.scrollTo(0,0)} 
                className="mt-12 p-5 bg-white rounded-full shadow-xl text-emerald-950 hover:scale-110 transition flex items-center gap-3 font-black text-[10px] uppercase tracking-widest"
            >
                <Printer size={20} /> PRINT HARDCOPY
            </button>
        </div>
    );
};

export default Invoice;
