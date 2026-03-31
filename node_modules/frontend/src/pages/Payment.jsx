import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import api from '../api/axios';

const Payment = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const plan = new URLSearchParams(search).get('plan') || 'monthly';
    const amount = plan === 'yearly' ? 119.99 : 12.99;
    
    const [status, setStatus] = useState('pending'); // pending, processing, success

    const handleMockPayment = async () => {
        setStatus('processing');
        try {
            // Persist Impact Commitment to Database (Requirement Sync)
            await api.put('/users/subscribe', { plan, isSubscribed: true });
            
            setTimeout(() => {
                setStatus('success');
                setTimeout(() => {
                    navigate(`/invoice?plan=${plan}&status=success`);
                }, 2000);
            }, 2000);
        } catch (err) {
            alert("Authorization Interrupted");
            setStatus('pending');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 italic">
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {status === 'pending' && (
                        <motion.div 
                          key="pending" 
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                          className="space-y-8"
                        >
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-emerald-950 tracking-tighter mb-2 italic">Impact Payment</h2>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">Secure UPI Simulation v4.0</p>
                            </div>

                            <div className="bg-emerald-950 p-8 rounded-[2rem] text-white">
                                <div className="flex justify-between items-center mb-6">
                                    <Smartphone className="text-emerald-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Payment Gateway</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Amount to Pay</p>
                                    <p className="text-4xl font-bold tracking-tighter font-mono">${amount.toFixed(2)}</p>
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">VPA: impact@gcp</div>
                                    <CheckCircle size={16} className="text-emerald-500" />
                                </div>
                            </div>

                            <button 
                                onClick={handleMockPayment}
                                className="w-full py-6 emotion-gradient text-white rounded-3xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition"
                            >
                                Authorize UPI Transaction <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {status === 'processing' && (
                        <motion.div 
                          key="processing" 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-center py-20"
                        >
                            <div className="w-24 h-24 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                            <h3 className="text-xl font-bold text-emerald-950 uppercase tracking-tighter">Cipher Verification...</h3>
                            <p className="text-[10px] font-bold text-emerald-900/40 uppercase tracking-widest mt-2">Linking Platform Intelligence</p>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div 
                          key="success" 
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-20"
                        >
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <CheckCircle size={64} strokeWidth={3} />
                            </div>
                            <h3 className="text-3xl font-bold text-emerald-950 uppercase tracking-tighter italic">Authorized!</h3>
                            <p className="text-sm font-bold text-emerald-900/60 mt-4 leading-relaxed not-italic">
                                Your impact allocation is secured.<br/>Generating verified invoice...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-10 pt-10 border-t border-gray-100 text-center">
                    <p className="text-[10px] font-bold uppercase text-emerald-900/20 tracking-[0.3em] flex items-center justify-center gap-2">
                        <ShieldCheck size={14} /> SECURED AUDIT TRACE ENABLED
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payment;
