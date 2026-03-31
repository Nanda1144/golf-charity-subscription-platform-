import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  Heart,
  Home,
  LogOut,
  Settings,
  Sparkles,
  Target,
  Trophy,
  User,
  Wallet,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { id: 'back', label: 'Back', icon: ArrowLeft },
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'charity', label: 'Charity', icon: Heart },
  { id: 'winning', label: 'Draw Winning', icon: Trophy },
  { id: 'scores', label: 'Match Scores', icon: Target },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'plans', label: 'Plans Details', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const sectionCard = 'rounded-[2rem] border border-emerald-100 bg-white/90 shadow-[0_20px_60px_rgba(5,46,22,0.08)]';

const UserDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [charities, setCharities] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newScore, setNewScore] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      const [profileRes, charitiesRes, latestDrawRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/charities').catch(() => ({ data: [] })),
        api.get('/draws/latest').catch(() => ({ data: null })),
      ]);

      setProfile(profileRes.data);
      setCharities(charitiesRes.data);
      setLatestDraw(latestDrawRes.data);
    } catch (error) {
      console.error(error);
      logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedCharity = useMemo(
    () => charities.find((charity) => charity._id === profile?.charity),
    [charities, profile]
  );

  const totalWon = useMemo(
    () => (profile?.winnings || []).reduce((sum, winner) => sum + (winner.prizeAmount || 0), 0),
    [profile]
  );

  const handleScoreSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/users/scores', { score: Number(newScore), date: newDate });
      setNewScore('');
      await fetchData();
      setActiveSection('scores');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to save score');
    }
  };

  const handleCharityUpdate = async (payload) => {
    try {
      await api.put('/users/charity', payload);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to update charity settings');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await api.put('/payments/cancel');
      await fetchData();
      setActiveSection('settings');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to cancel subscription');
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#f4fbf7] text-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Loading dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.16),_transparent_34%),linear-gradient(180deg,_#f6fcf8_0%,_#ecf7f0_100%)] text-emerald-950">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 lg:px-6">
        <motion.aside
          initial={{ x: -90, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="sticky top-6 hidden h-[calc(100vh-3rem)] w-80 overflow-hidden rounded-[2rem] bg-emerald-950 text-white shadow-[0_35px_80px_rgba(5,46,22,0.35)] lg:flex lg:flex-col"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,185,129,0.2),transparent_45%)]" />
          <div className="relative z-10 flex h-full flex-col p-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-white text-emerald-950 shadow-lg">G</div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Member Area</p>
                <h1 className="text-2xl font-black tracking-tight">Golf Charity Club</h1>
              </div>
            </div>

            <div className="mb-8 rounded-[1.8rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Welcome back</p>
              <p className="mt-2 text-xl font-bold">{profile.name}</p>
              <p className="mt-1 text-sm text-emerald-100/70">{profile.email}</p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: index * 0.06 }}
                    onClick={() => {
                      if (item.id === 'back') {
                        navigate(-1);
                        return;
                      }
                      setActiveSection(item.id);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-4 text-left transition ${
                      isActive ? 'bg-white text-emerald-950 shadow-lg' : 'text-emerald-100/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4">
              <Link
                to="/pricing"
                className="flex items-center justify-between rounded-[1.5rem] bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-lg"
              >
                Upgrade Plan
                <Sparkles size={18} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-[1.3rem] border border-white/10 bg-white/10 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/15"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </motion.aside>

        <main className="min-w-0 flex-1 space-y-6">
          <div className="flex items-center justify-between rounded-[1.5rem] border border-emerald-100 bg-white/80 px-5 py-4 shadow-[0_12px_40px_rgba(5,46,22,0.06)]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-800"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-600">Member navigation</p>
          </div>

          <section className="overflow-hidden rounded-[2.3rem] bg-emerald-950 px-6 py-8 text-white shadow-[0_35px_80px_rgba(5,46,22,0.22)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">User dashboard</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight">Track your golf, giving, and draw results in one place.</h2>
                <p className="mt-3 max-w-2xl text-sm text-emerald-100/75">
                  Your dashboard now has a separate member experience with quick access to charity support, winnings, scores, profile, plan details, and settings.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Subscription', value: profile.subscriptionStatus || 'None' },
                  { label: 'Charity Share', value: `${profile.charityPercentage || 10}%` },
                  { label: 'Rounds', value: `${profile.scores?.length || 0}` },
                  { label: 'Won', value: `$${totalWon.toFixed(2)}` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-200">{item.label}</p>
                    <p className="mt-2 text-lg font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <section className={`${sectionCard} p-6`}>
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Overview</p>
                  <h3 className="mt-2 text-2xl font-bold">Dashboard</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      label: 'Plan Details',
                      value: profile.plan || 'None',
                      note: profile.subscription ? 'Subscription active' : 'Subscription inactive',
                      icon: CreditCard,
                    },
                    {
                      label: 'Primary Charity',
                      value: selectedCharity?.name || 'Not selected',
                      note: `${profile.charityPercentage || 10}% contribution`,
                      icon: Heart,
                    },
                    {
                      label: 'Latest Draw',
                      value: latestDraw?.status || 'No draw yet',
                      note: latestDraw?.createdAt ? new Date(latestDraw.createdAt).toLocaleDateString() : 'Waiting for publish',
                      icon: Trophy,
                    },
                    {
                      label: 'Profile',
                      value: profile.name,
                      note: profile.email,
                      icon: User,
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            item.label === 'Primary Charity'
                              ? 'charity'
                              : item.label === 'Latest Draw'
                                ? 'winning'
                                : item.label === 'Plan Details'
                                  ? 'plans'
                                  : 'profile'
                          )
                        }
                        className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5 text-left transition hover:-translate-y-1 hover:bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">{item.label}</p>
                          <Icon size={18} className="text-emerald-700" />
                        </div>
                        <p className="mt-4 text-xl font-bold text-emerald-950">{item.value}</p>
                        <p className="mt-2 text-sm text-emerald-800/70">{item.note}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className={`${sectionCard} p-6`}>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Scores</p>
                    <h3 className="mt-2 text-2xl font-bold">Match Scores</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('scores')}
                    className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700"
                  >
                    Open section
                  </button>
                </div>
                <form onSubmit={handleScoreSubmit} className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={newScore}
                    onChange={(event) => setNewScore(event.target.value)}
                    placeholder="Enter Stableford score"
                    className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-4 text-base font-semibold outline-none focus:border-emerald-400"
                    required
                  />
                  <input
                    type="date"
                    value={newDate}
                    onChange={(event) => setNewDate(event.target.value)}
                    className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-4 text-base font-semibold outline-none focus:border-emerald-400"
                  />
                  <button type="submit" className="rounded-[1.2rem] bg-emerald-700 px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg hover:bg-emerald-800">
                    Save score
                  </button>
                </form>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                  {(profile.scores || [])
                    .slice()
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((score, index) => (
                      <div key={`${score.date}-${index}`} className="rounded-[1.4rem] border border-emerald-100 bg-white p-4 text-center">
                        <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">Round {index + 1}</p>
                        <p className="mt-3 text-3xl font-black text-emerald-950">{score.score}</p>
                        <p className="mt-2 text-sm text-emerald-800/70">{new Date(score.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  {!profile.scores?.length && (
                    <div className="sm:col-span-2 xl:col-span-5 rounded-[1.5rem] border border-dashed border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                      No scores yet. Add your first match score here.
                    </div>
                  )}
                </div>
              </section>

              <section className={`${sectionCard} p-6`}>
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Focused Section</p>
                  <h3 className="mt-2 text-2xl font-bold">{navItems.find((item) => item.id === activeSection)?.label || 'Dashboard'}</h3>
                </div>

                {activeSection === 'plans' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.4rem] bg-emerald-50 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">Current plan</p>
                      <p className="mt-3 text-2xl font-bold text-emerald-950">{profile.plan || 'None'}</p>
                      <p className="mt-2 text-sm text-emerald-800/70">Status: {profile.subscriptionStatus || 'None'}</p>
                    </div>
                    <div className="rounded-[1.4rem] bg-emerald-950 p-5 text-white">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Membership actions</p>
                      <div className="mt-4 space-y-3">
                        <Link to="/pricing" className="block rounded-[1rem] bg-white px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.18em] text-emerald-950">
                          Change Plan
                        </Link>
                        <Link to={`/invoice?plan=${(profile.plan || 'monthly').toLowerCase()}`} className="block rounded-[1rem] border border-white/15 px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.18em] text-white">
                          View Invoice
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'settings' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.4rem] bg-emerald-50 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">Subscription controls</p>
                      <p className="mt-3 text-base font-semibold text-emerald-950">
                        Current subscription status: {profile.subscriptionStatus || 'None'}
                      </p>
                      <button
                        type="button"
                        onClick={handleCancelSubscription}
                        className="mt-4 rounded-[1rem] border border-rose-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-rose-600"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                    <div className="rounded-[1.4rem] bg-emerald-50 p-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">Account actions</p>
                      <div className="mt-4 space-y-3">
                        <Link to="/pricing" className="block rounded-[1rem] bg-emerald-700 px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.18em] text-white">
                          Upgrade Membership
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            navigate('/login');
                          }}
                          className="w-full rounded-[1rem] border border-emerald-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700"
                        >
                          Logout Securely
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection !== 'plans' && activeSection !== 'settings' && (
                  <div className="rounded-[1.4rem] bg-emerald-50 p-5 text-sm text-emerald-800/75">
                    Use the left navigation to move between dashboard, charity, draw winning, match scores, profile, plan details, and settings. The data shown across the page is live from your account.
                  </div>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <section className={`${sectionCard} p-6`}>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">User Profile</p>
                <h3 className="mt-2 text-2xl font-bold">Profile</h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.4rem] bg-emerald-950 px-5 py-5 text-white">
                    <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Profile overview</p>
                    <p className="mt-3 text-2xl font-bold">{profile.name}</p>
                    <p className="mt-1 text-sm text-emerald-100/75">{profile.email}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                        {profile.accountType || 'Individual'}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white">
                        {profile.subscriptionStatus || 'None'}
                      </span>
                    </div>
                  </div>
                  {[
                    ['Name', profile.name],
                    ['Email', profile.email],
                    ['Account Type', profile.accountType || 'Individual'],
                    ['Subscription', profile.subscriptionStatus || 'None'],
                    ['Plan', profile.plan || 'None'],
                    ['Charity Share', `${profile.charityPercentage || 10}%`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.2rem] bg-emerald-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">{label}</p>
                      <p className="mt-2 text-base font-semibold text-emerald-950">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`${sectionCard} p-6`}>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Charity</p>
                <h3 className="mt-2 text-2xl font-bold">Charity</h3>
                <div className="mt-5 space-y-4">
                  <select
                    value={profile.charity || ''}
                    onChange={(event) => handleCharityUpdate({ charity: event.target.value })}
                    className="w-full rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-4 text-base font-semibold outline-none focus:border-emerald-400"
                  >
                    <option value="">Select a charity</option>
                    {charities.map((charity) => (
                      <option key={charity._id} value={charity._id}>
                        {charity.name}
                      </option>
                    ))}
                  </select>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">Charity contribution</p>
                      <span className="text-sm font-bold text-emerald-700">{profile.charityPercentage || 10}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      step="5"
                      value={profile.charityPercentage || 10}
                      onChange={(event) => handleCharityUpdate({ charityPercentage: Number(event.target.value) })}
                      className="w-full accent-emerald-700"
                    />
                  </div>
                  {selectedCharity && (
                    <div className="rounded-[1.3rem] bg-emerald-950 px-4 py-5 text-white">
                      <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">Current charity</p>
                      <p className="mt-2 text-lg font-bold">{selectedCharity.name}</p>
                      <p className="mt-2 text-sm text-emerald-100/75">{selectedCharity.description || 'This charity supports your contribution plan.'}</p>
                    </div>
                  )}
                </div>
              </section>

              <section className={`${sectionCard} p-6`}>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Draw Winning</p>
                <h3 className="mt-2 text-2xl font-bold">Draw Winning</h3>
                <div className="mt-5 space-y-4">
                  {(profile.winnings || []).map((winner, index) => (
                    <div key={`${winner.drawId}-${index}`} className="rounded-[1.3rem] border border-emerald-100 bg-emerald-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">{winner.category}</p>
                          <p className="mt-2 text-lg font-bold text-emerald-950">${(winner.prizeAmount || 0).toFixed(2)}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                          {winner.payoutStatus || 'Pending'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-emerald-800/70">
                        Draw date: {winner.createdAt ? new Date(winner.createdAt).toLocaleDateString() : 'Pending'}
                      </p>
                    </div>
                  ))}
                  {!profile.winnings?.length && (
                    <div className="rounded-[1.3rem] border border-dashed border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                      No winning records yet. Your future draw wins will appear here.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          <section className={`${sectionCard} p-6`}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <button type="button" onClick={() => setActiveSection('dashboard')} className={`rounded-[1.4rem] p-5 text-left transition ${activeSection === 'dashboard' ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-950'}`}>
                <Home size={20} />
                <p className="mt-4 text-lg font-bold">Dashboard</p>
                <p className="mt-2 text-sm opacity-80">Quick summary of plan, charity, profile, and latest draw.</p>
              </button>
              <button type="button" onClick={() => setActiveSection('plans')} className={`rounded-[1.4rem] p-5 text-left transition ${activeSection === 'plans' ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-950'}`}>
                <Wallet size={20} />
                <p className="mt-4 text-lg font-bold">Plans Details</p>
                <p className="mt-2 text-sm opacity-80">Current plan: {profile.plan || 'None'} with status {profile.subscriptionStatus || 'None'}.</p>
              </button>
              <button type="button" onClick={() => setActiveSection('profile')} className={`rounded-[1.4rem] p-5 text-left transition ${activeSection === 'profile' ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-950'}`}>
                <User size={20} />
                <p className="mt-4 text-lg font-bold">Profile</p>
                <p className="mt-2 text-sm opacity-80">Personal details and membership information.</p>
              </button>
              <button type="button" onClick={() => setActiveSection('settings')} className={`rounded-[1.4rem] p-5 text-left transition ${activeSection === 'settings' ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-950'}`}>
                <Settings size={20} />
                <p className="mt-4 text-lg font-bold">Settings</p>
                <p className="mt-2 text-sm opacity-80">Use logout or plan upgrade actions from the sidebar.</p>
              </button>
            </div>
          </section>

          <section className={`${sectionCard} p-5 lg:hidden`}>
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Mobile Menu</p>
              <h3 className="mt-2 text-xl font-bold">Navigation</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'back') {
                        navigate(-1);
                        return;
                      }
                      setActiveSection(item.id);
                    }}
                    className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-4 text-left ${activeSection === item.id ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-950'}`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold uppercase tracking-[0.18em]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
