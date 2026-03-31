import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Loader2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('processing');
  const { user, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan');

    if (sessionId && user) {
      const syncDB = async () => {
        try {
          await api.post('/payments/webhook', {
            sessionId,
            userId: user._id,
            plan
          });
          await refreshUser();
          setStatus('success');
        } catch (err) {
          setStatus('error');
        }
      };
      
      syncDB();
    }
  }, [location, user, refreshUser]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50 italic">
        <div className="text-center">
          <Loader2 className="animate-spin mb-6 mx-auto text-emerald-700" size={60} />
          <h1 className="text-3xl font-bold text-emerald-950 mb-2 italic">Verifying Impact Protocol...</h1>
          <p className="text-emerald-700/60 font-bold">Synchronizing your championship status.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20 italic">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center border-t-8 border-gold-600"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-gold-700 mx-auto mb-8 shadow-inner">
             <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-bold text-emerald-950 mb-4 tracking-tight italic">Access Granted.</h1>
          <p className="text-emerald-800/60 font-bold mb-10 text-lg leading-relaxed not-italic">
             Your subscription is now active. You have full access to high-stakes draws and premium charity rewards.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-10 not-italic">
             <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <span className="block text-xs uppercase font-bold tracking-widest text-emerald-950">STATUS</span>
                <span className="text-lg font-bold text-emerald-700">ACTIVE PRO</span>
             </div>
             <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <span className="block text-xs uppercase font-bold tracking-widest text-emerald-950">EXPIRY</span>
                <span className="text-lg font-bold text-emerald-700 text-ellipsis overflow-hidden">30 DAYS+</span>
             </div>
          </div>
          <Link 
            to="/dashboard" 
            className="w-full py-5 bg-emerald-700 text-white rounded-2xl font-bold text-xl hover:bg-emerald-800 block shadow-xl shadow-emerald-200 italic"
          >
             Head to Impact Panel
          </Link>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
