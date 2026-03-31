import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Trophy, Heart, Plus, LayoutDashboard, CreditCard, ExternalLink, Edit2, CheckCircle, Trash2, Calendar, Target, Activity, Gift, Coins, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const searchParams = new URLSearchParams(window.location.search);
  const isExploring = searchParams.get('explore') === 'true';

  const [profile, setProfile] = useState(null);
  const [latestDraw, setLatestDraw] = useState(null);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Score form states
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingScoreId, setEditingScoreId] = useState(null);
  
  const navigate = useNavigate();

  const fetchData = async () => {
    if (isExploring && !user) {
      // Initialize Discover Mode (Simulated Platform Intelligence)
      setProfile({
        name: "Simulator Member",
        email: "explore@impactgolf.com",
        subscription: true,
        subscriptionStatus: "Active",
        subscriptionExpiry: "2026-12-31",
        charityPercentage: 10,
        scores: [
          { score: 38, date: "2026-03-25" },
          { score: 42, date: "2026-03-20" }
        ],
        winnings: []
      });
      setCharities([{ _id: "mock1", name: "Project Green Fairway" }]);
      setLoading(false);
      return;
    }

    try {
      const [pRes, dRes, cRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/draws/latest').catch(() => ({ data: null })),
        api.get('/charities').catch(() => ({ data: [] }))
      ]);
      setProfile(pRes.data);
      setLatestDraw(dRes.data);
      setCharities(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, navigate, isExploring]);

  const handleCharityUpdate = async (charityId, percentage) => {
    if (isExploring) return navigate('/register');
    try {
      await api.put('/users/charity', { 
        charity: charityId || profile.charity?._id, 
        charityPercentage: percentage || profile.charityPercentage 
      });
      fetchData();
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    if (isExploring) return navigate('/register');
    try {
      if (editingScoreId) {
        alert("Score Editing (Simulated): Updating historical record...");
        setEditingScoreId(null);
      } else {
        await api.post('/users/scores', { score: Number(newScore), date: newDate });
      }
      fetchData();
      setNewScore('');
    } catch (err) {
      if (err.response?.status === 403) navigate('/pricing');
      else alert(err.response?.data?.message || 'Error saving score');
    }
  };

  const uploadProof = async (drawId) => {
     if (isExploring) return navigate('/register');
     const proofUrl = window.prompt("Enter Proof Image URL (Mock):");
     if (proofUrl) {
       await api.put(`/users/winners/${drawId}/proof`, { proofUrl });
       fetchData();
     }
  };

  if (loading || !profile) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfd] italic">
       <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">Syncing Architecture...</p>
       </div>
    </div>
  );

  const totalWon = (profile?.winnings || []).reduce((acc, curr) => acc + (curr.prizeAmount || 0), 0);

  return (
    <>
      <div className="min-h-screen bg-[#fcfdfd] pb-20 italic">
        {/* Dynamic Header */}
        <nav className="bg-emerald-950 text-white sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="bg-emerald-700 p-2 rounded-xl border border-emerald-500 shadow-lg font-bold italic">GCP</div>
               <h1 className="text-lg font-bold uppercase tracking-tighter sm:block hidden italic">Impact Control Panel {isExploring && '(DISCOVER MODE)'}</h1>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Authorized {isExploring ? 'Explorer' : 'Member'}</p>
                  <p className="font-bold text-sm not-italic">{profile.name}</p>
               </div>
               {isExploring ? (
                 <Link to="/register" className="px-6 py-2 bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition">Commit Now</Link>
               ) : (
                 <button onClick={logout} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition border border-white/10"><LogOut size={20} /></button>
               )}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 mt-8 space-y-10">
          
          {/* Core KPIs Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition"><CreditCard size={100}/></div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Subscription Status</h4>
                <p className={`text-xl font-bold ${profile.subscription ? 'text-emerald-700' : 'text-gray-400'}`}>
                   {profile.subscription ? 'LEGACY ACTIVE' : 'INACTIVE'}
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Renews: {profile.subscriptionExpiry ? new Date(profile.subscriptionExpiry).toLocaleDateString() : '---'}</p>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition"><Target size={100}/></div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">My Impact Contribution</h4>
                <p className="text-xl font-bold text-emerald-950">{profile.charityPercentage || 10}%</p>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Supporting: {charities.find(c => c._id === profile.charity)?.name || 'None'}</p>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition"><Calendar size={100}/></div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Platform Engagement</h4>
                <p className="text-xl font-bold text-emerald-950">{profile.winnings?.length || 0} Draws entered</p>
                <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase">NEXT DRAW: SUN 21:00</p>
             </div>

             <div className="bg-emerald-950 p-6 rounded-[2rem] shadow-2xl shadow-emerald-900/20 text-white relative overflow-hidden group border-b-8 border-gold-600">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition"><Trophy size={100}/></div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-2">Lifetime Prize Worth</h4>
                <p className="text-2xl font-bold font-mono">${totalWon.toFixed(2)}</p>
                <p className="text-[10px] font-bold text-gold-500 mt-1 uppercase italic underline decoration-2">Verified Championship Pot</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Section: STABLEFORD SCORE MANAGEMENT */}
             <div className="space-y-10">
                <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-emerald-50">
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                         <Activity size={22} className="text-emerald-700" /> PERFORMANCE INPUT
                      </h2>
                      <span className="text-xs font-bold text-emerald-600/50 uppercase tracking-widest">STABLEFORD (1–45)</span>
                   </div>

                   <form onSubmit={handleScoreSubmit} className="flex flex-col sm:flex-row gap-4 mb-10">
                      <input 
                        type="number" 
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                        placeholder="Log Points"
                        className="flex-1 p-4 bg-gray-50 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-950 not-italic"
                        required
                      />
                      <input 
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="p-4 bg-emerald-50 rounded-2xl outline-none font-bold text-emerald-800 not-italic"
                      />
                      <button className="bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                         {editingScoreId ? 'Update Record' : 'Commit Round'}
                      </button>
                   </form>

                   <div className="grid grid-cols-5 gap-3">
                      {[...Array(5)].map((_, i) => {
                        const s = [...(profile.scores || [])].sort((a,b) => new Date(b.date) - new Date(a.date))[i];
                        return (
                          <div key={i} className={`h-28 rounded-2xl flex flex-col items-center justify-center border-2 transition group relative ${s ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-gray-50 border-dashed border-gray-200'}`}>
                            {s ? (
                               <>
                                 <span className="text-3xl font-bold text-emerald-950 leading-none not-italic">{s.score}</span>
                                 <span className="text-[10px] uppercase font-bold text-emerald-700 mt-2">{new Date(s.date).toLocaleDateString([], {month:'short', day:'numeric'})}</span>
                                 <button 
                                   onClick={() => setEditingScoreId(s._id)}
                                   className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg text-emerald-600 scale-0 group-hover:scale-100 transition border border-emerald-50"
                                 >
                                    <Edit2 size={12}/>
                                 </button>
                               </>
                            ) : <span className="text-gray-200 font-extrabold text-2xl">--</span>}
                          </div>
                        )
                      })}
                   </div>
                </section>

                {/* Section: DIRECT INDEPENDENT DONATION (PRD Sync) */}
                <section className="bg-emerald-950 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition rotate-12"><Gift size={120} /></div>
                   <h2 className="text-xl font-bold mb-4 flex items-center gap-2 uppercase tracking-tighter italic">
                      <Coins size={22} className="text-gold-400" /> One-Time Impact Power
                   </h2>
                   <p className="text-xs font-bold text-emerald-100 opacity-60 mb-8 max-w-sm leading-relaxed uppercase tracking-widest italic">
                      Fuel a specific goal today. Independent of your platform membership, this direct contribution flows instantly to your primary impact partner.
                   </p>
                   <div className="flex gap-4">
                      {[10, 25, 50].map(amt => (
                        <button key={amt} className="flex-1 py-4 bg-white/10 border border-white/10 rounded-2xl font-bold hover:bg-gold-500 hover:text-white transition active:scale-95 shadow-lg">${amt}</button>
                      ))}
                      <button className="flex-1 py-4 bg-gold-600 text-white rounded-2xl font-bold hover:bg-white hover:text-emerald-950 transition active:scale-95 shadow-xl uppercase tracking-widest text-[10px]">Custom</button>
                   </div>
                </section>

                {/* Section: CHARITY SETTINGS */}
                <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-emerald-50">
                    <h2 className="text-xl font-bold text-emerald-950 mb-8 flex items-center gap-2">
                       <Heart size={22} className="text-red-500" /> CONTRIBUTION LOGIC
                    </h2>
                    <div className="space-y-8">
                       <div>
                          <label className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/40 mb-3 block">Primary Target Charity</label>
                          <select 
                            value={profile.charity} 
                            onChange={(e) => handleCharityUpdate(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-emerald-50 rounded-2xl font-bold text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-500 not-italic"
                          >
                            <option value="">Select Impact Proxy</option>
                            {charities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                       </div>
                       <div>
                          <div className="flex justify-between items-center mb-3">
                             <label className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-900/40 block">Impact Percentage (%)</label>
                             <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px] tracking-widest border border-emerald-100 uppercase">Min 10% Protocol</span>
                          </div>
                          <div className="flex gap-4 items-center">
                             <input 
                               type="range" min="10" max="50" step="5"
                               value={profile.charityPercentage || 10}
                               onChange={(e) => handleCharityUpdate(null, Number(e.target.value))}
                               className="flex-1 accent-emerald-700 h-2 bg-emerald-50 rounded-full cursor-pointer"
                             />
                             <div className="w-16 h-12 bg-emerald-950 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-xl not-italic">{profile.charityPercentage || 10}%</div>
                          </div>
                       </div>
                    </div>
                </section>

                {/* Section: PARTNER INSIGHTS (Events & Gallery) */}
                {profile.charity && charities.find(c => c._id === profile.charity) && (
                  <section className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-emerald-50">
                     <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-emerald-950 uppercase tracking-tighter italic">
                        <Globe size={22} className="text-emerald-700" /> Impact Snapshots & Events
                     </h2>
                     <div className="grid grid-cols-2 gap-4 mb-8">
                        {(charities.find(c => c._id === profile.charity).gallery || []).slice(0, 2).map((img, i) => (
                          <img key={i} src={img} className="rounded-2xl h-32 w-full object-cover shadow-lg border border-emerald-50 grayscale hover:grayscale-0 transition duration-700" alt="Gallery"/>
                        ))}
                        {!(charities.find(c => c._id === profile.charity).gallery?.length) && <div className="col-span-2 h-32 bg-gray-50 rounded-2xl flex items-center justify-center text-[10px] uppercase font-bold text-gray-200 tracking-[0.2em]">Partner Gallery Initializing...</div>}
                     </div>
                     <div className="space-y-4">
                        {(charities.find(c => c._id === profile.charity).upcomingEvents || []).map((ev, i) => (
                          <div key={i} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center group cursor-pointer hover:bg-emerald-100 transition">
                             <div className="flex items-center gap-4">
                                <Calendar size={20} className="text-emerald-700"/>
                                <div>
                                   <p className="font-bold text-emerald-950 text-xs uppercase italic tracking-tight">{ev.title}</p>
                                   <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{new Date(ev.date).toLocaleDateString()}</p>
                                </div>
                             </div>
                             <ArrowRight size={16} className="text-emerald-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition"/>
                          </div>
                        ))}
                     </div>
                  </section>
                )}
             </div>

             {/* Section: WINNINGS OVERVIEW */}
             <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-emerald-50">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                      <Trophy size={22} className="text-gold-500" /> WINNINGS & PAYOUTS
                   </h2>
                   <button className="text-[10px] font-bold text-emerald-800/40 uppercase tracking-widest hover:text-emerald-900">Platform Report</button>
                </div>
                <div className="space-y-6">
                   {(profile.winnings || []).map(win => (
                     <div key={win.drawId} className="p-8 rounded-3xl border border-emerald-50 bg-gray-50/50 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/5 rounded-full translate-x-10 -translate-y-10"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                           <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                             win.category === 'Jackpot' ? 'bg-gold-400 text-gold-950' : 'bg-emerald-950 text-white'
                           }`}>{win.category}</div>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(win.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-end relative z-10">
                           <div>
                              <p className="text-xs font-bold text-emerald-900/40 uppercase mb-1">Impact Match</p>
                              <p className="font-bold text-gray-800 mb-6 font-mono tracking-tighter not-italic">Verified draw #{win.drawId?.slice(-4)}</p>
                              <button 
                                onClick={() => uploadProof(win.drawId)}
                                className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                                  win.payoutStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                                  win.winnerProof ? 'bg-blue-100 text-blue-700' : 'bg-white text-emerald-700 border border-emerald-50 shadow-sm hover:bg-emerald-50'
                                }`}
                              >
                                 {win.payoutStatus === 'Paid' ? <><CheckCircle size={14}/> Paid to Bank</> : 
                                  win.winnerProof ? <><Activity size={14}/> processing claims</> : <><ExternalLink size={14}/> Submit Win Proof</>}
                              </button>
                           </div>
                           <div className="text-right">
                               <p className="text-[10px] font-bold text-emerald-900 opacity-40 uppercase mb-1">Prize Worth</p>
                               <p className="text-3xl font-bold text-emerald-950 leading-none not-italic">${(win.prizeAmount || 0).toFixed(2)}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                   {!profile.winnings?.length && (
                     <div className="text-center py-24">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-100 mx-auto mb-6">
                           <Trophy size={48} />
                        </div>
                        <p className="text-gray-300 font-bold text-lg italic">The Championship is open. Log your rounds!</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
