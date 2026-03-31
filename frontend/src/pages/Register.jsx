import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Globe, Target, ArrowRight, ShieldCheck, Activity, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', charity: '' });
  const [charities, setCharities] = useState([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const { data } = await api.get('/charities');
        setCharities(data);
      } catch (err) { console.error(err); }
    };
    fetchCharities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      login(data.token, data); // Standardize: data is the user object plus token
      navigate('/pricing');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-bold text-emerald-950 uppercase selection:bg-emerald-100 italic">
        {/* Left: Emotion Leading Impact */}
        <div className="bg-emerald-950 p-20 text-white relative overflow-hidden hidden lg:flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }} />

          <Link to="/" className="flex items-center gap-3 relative z-10 not-italic">
            <div className="w-12 h-12 bg-white text-emerald-950 rounded-2xl flex items-center justify-center font-bold shadow-xl">G</div>
            <span className="text-2xl font-bold tracking-tighter uppercase italic">Impact <span className="text-emerald-400 font-bold">Golf</span></span>
          </Link>

          <div className="relative z-10 max-w-lg">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-6xl font-bold mb-8 leading-[1.05] tracking-tighter italic">Your Legacy <br />Starts Here.</h2>
              <p className="text-xl text-emerald-200/50 mb-12 font-medium leading-relaxed italic normal-case tracking-normal">
                Becoming an Impact Member is about more than access—it's about initiating your personal contribution loop. Choose your mission, and let your every performance fuel the progress.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Heart, t: "Minimum 10% Impact Contribution", c: "Automatic lock for your charity" },
                  { icon: ShieldCheck, t: "Verified Platform Audit Hub", c: "Secure winners verification system" },
                  { icon: Award, t: "Elite Performance Trophies", c: "High-stakes draw pools monthly" }
                ].map((f, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-emerald-900 border border-emerald-800 rounded-xl flex items-center justify-center text-emerald-400 shadow-lg">
                      <f.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-emerald-100 tracking-widest leading-none">{f.t}</p>
                      <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 opacity-60 leading-none">{f.c}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="text-emerald-100/20 text-[9px] font-bold uppercase tracking-[0.4em] relative z-10 italic">
            Impact Network • The Architecture of Hope
          </div>
        </div>

        {/* Right: The Registry Hub */}
        <div className="p-10 md:p-32 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h3 className="text-4xl font-bold text-emerald-950 mb-1 tracking-tighter italic">Initialize Identity</h3>
              <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe size={14} className="text-emerald-600" /> Secure Enrollment Portal
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/60 ml-2 block">Personal Identifier</label>
                <input
                  type="text" placeholder="Full Name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-6 bg-gray-50 border border-emerald-50 rounded-[1.5rem] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-100 not-italic"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/60 ml-2 block">Secure Gateway (Email)</label>
                <input
                  type="email" placeholder="Email Address" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-6 bg-gray-50 border border-emerald-50 rounded-[1.5rem] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-100 not-italic"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/60 ml-2 block">Cipher Key (Password)</label>
                <input
                  type="password" placeholder="Passkey" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-6 bg-gray-50 border border-emerald-50 rounded-[1.5rem] font-bold text-emerald-950 outline-none focus:ring-4 focus:ring-emerald-100 not-italic"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/60 ml-2 block">Impact Partnership</label>
                <select
                  value={formData.charity}
                  onChange={(e) => setFormData({ ...formData, charity: e.target.value })}
                  className="w-full p-6 bg-emerald-950 text-white rounded-[1.5rem] font-bold uppercase outline-none focus:ring-4 focus:ring-emerald-100 transition shadow-xl italic"
                  required
                >
                  <option value="">Select Primary Impact Source</option>
                  {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <button className="w-full py-6 emotion-gradient text-white rounded-[2rem] font-bold text-sm uppercase tracking-widest shadow-2xl shadow-emerald-900/20 active:scale-95 transition flex items-center justify-center gap-3 italic">
                Commit Registration <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold uppercase text-emerald-900/40 tracking-widest">
                Returning Impact Member? <Link to="/login" className="text-emerald-700 underline decoration-2 ml-1">Member Access</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
