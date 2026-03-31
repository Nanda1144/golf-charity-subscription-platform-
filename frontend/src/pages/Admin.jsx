import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  HeartHandshake,
  LogOut,
  ShieldCheck,
  Target,
  Trophy,
  Users,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { id: 'logout', label: 'Admin Logout', icon: LogOut },
  { id: 'overview', label: 'Overview', icon: ShieldCheck },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'draws', label: 'Draw Management', icon: Target },
  { id: 'charities', label: 'Charity Management', icon: HeartHandshake },
  { id: 'winners', label: 'Winners Management', icon: Trophy },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
];

const cardClass = 'rounded-[2rem] border border-emerald-100 bg-white/95 shadow-[0_20px_60px_rgba(5,46,22,0.08)]';

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [charities, setCharities] = useState([]);
  const [stats, setStats] = useState(null);
  const [drawResult, setDrawResult] = useState(null);
  const [drawMethod, setDrawMethod] = useState('Random');
  const [isSimulate, setIsSimulate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCharity, setNewCharity] = useState({ name: '', description: '', logo: '', category: 'Health' });

  const fetchData = async () => {
    try {
      const [usersRes, winnersRes, charitiesRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/winners'),
        api.get('/charities'),
        api.get('/admin/reports').catch(() => ({ data: null })),
      ]);

      setUsers(usersRes.data);
      setWinners(winnersRes.data);
      setCharities(charitiesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchData();
    }
  }, [user]);

  const totalPrizePool = useMemo(
    () => winners.reduce((sum, winner) => sum + (winner.prizeAmount || 0), 0),
    [winners]
  );

  const charityContributionTotal = useMemo(
    () => users.reduce((sum, member) => sum + (member.charityPercentage || 0), 0),
    [users]
  );

  const handleRunDraw = async () => {
    try {
      const { data } = await api.post('/admin/draw', { type: drawMethod, simulate: isSimulate });
      setDrawResult(data);
      await fetchData();
      setActiveSection('draws');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to run draw');
    }
  };

  const handlePublish = async (drawId) => {
    try {
      await api.put(`/admin/draw/${drawId}/publish`);
      await fetchData();
      alert('Draw published successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to publish draw');
    }
  };

  const handleCreateCharity = async (event) => {
    event.preventDefault();
    try {
      await api.post('/admin/charities', newCharity);
      setNewCharity({ name: '', description: '', logo: '', category: 'Health' });
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to create charity');
    }
  };

  const handleDeleteCharity = async (id) => {
    try {
      await api.delete(`/admin/charities/${id}`);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to delete charity');
    }
  };

  const handlePayout = async (drawId, userId, payoutStatus) => {
    try {
      await api.put(`/admin/winners/${drawId}/${userId}/verify`, { payoutStatus });
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to update payout');
    }
  };

  const handleUserUpdate = async (id, patch) => {
    try {
      await api.put(`/admin/users/${id}`, patch);
      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to update user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4fbf7] text-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Loading admin dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(21,128,61,0.15),_transparent_35%),linear-gradient(180deg,_#f6fcf8_0%,_#e9f5ed_100%)] text-emerald-950">
      <div className="mx-auto flex max-w-[1680px] gap-6 px-4 py-6 lg:px-6">
        <motion.aside
          initial={{ x: -90, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="sticky top-6 hidden h-[calc(100vh-3rem)] w-80 overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-[0_35px_80px_rgba(15,23,42,0.35)] lg:flex lg:flex-col"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,185,129,0.18),transparent_42%)]" />
          <div className="relative z-10 flex h-full flex-col p-6">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-emerald-400 text-slate-950 shadow-lg">A</div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Admin Console</p>
                <h1 className="text-2xl font-black tracking-tight">Control Center</h1>
              </div>
            </div>

            <div className="mb-8 rounded-[1.8rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">Administrative dashboard</p>
              <p className="mt-2 text-xl font-bold">Platform operations</p>
              <p className="mt-1 text-sm text-emerald-100/70">User profiles, charity details, draws, winners, and reports are managed here.</p>
            </div>

            <nav className="space-y-2">
              {adminNav.map((item, index) => {
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
                      if (item.id === 'logout') {
                        logout();
                        navigate('/login');
                        return;
                      }
                      setActiveSection(item.id);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-4 text-left transition ${
                      isActive ? 'bg-white text-slate-950 shadow-lg' : 'text-emerald-100/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold uppercase tracking-[0.16em]">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="mt-auto flex items-center justify-center gap-2 rounded-[1.3rem] border border-white/10 bg-white/10 px-4 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/15"
            >
              <LogOut size={18} />
              Logout
            </button>
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
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-emerald-600">Admin navigation</p>
          </div>

          <section className="overflow-hidden rounded-[2.3rem] bg-slate-950 px-6 py-8 text-white shadow-[0_35px_80px_rgba(15,23,42,0.22)]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Admin dashboard</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight">Run the platform from a dedicated operations console.</h2>
                <p className="mt-3 max-w-3xl text-sm text-emerald-100/75">
                  This admin view is now separate from the user dashboard and includes user management, draw management, charity management, winners management, and reports.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Total Users', value: `${stats?.totalUsers || users.length}` },
                  { label: 'Prize Pool', value: `$${totalPrizePool.toFixed(2)}` },
                  { label: 'Charity Total', value: `${charityContributionTotal}%` },
                  { label: 'Draw Stats', value: `${winners.length} winners` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-200">{item.label}</p>
                    <p className="mt-2 text-lg font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {[
              { icon: Users, label: 'Total Users', value: stats?.totalUsers || users.length },
              { icon: Trophy, label: 'Total Prize Pool', value: `$${totalPrizePool.toFixed(2)}` },
              { icon: HeartHandshake, label: 'Charity Contribution Totals', value: `${charityContributionTotal}%` },
              { icon: Target, label: 'Draw Statistics', value: drawResult?.winners?.length || winners.length },
              { icon: CheckCircle2, label: 'Completed Payouts', value: winners.filter((winner) => winner.payoutStatus === 'Paid').length },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`${cardClass} p-5`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">{item.label}</p>
                    <Icon size={18} className="text-emerald-700" />
                  </div>
                  <p className="mt-4 text-3xl font-black text-emerald-950">{item.value}</p>
                </div>
              );
            })}
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            {(activeSection === 'overview' || activeSection === 'users') && (
            <section className={`${cardClass} p-6`}>
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">User Management</p>
                <h3 className="mt-2 text-2xl font-bold">View and edit user profiles, golf scores, and subscriptions</h3>
              </div>
              <div className="space-y-4">
                {users.map((member) => (
                  <div key={member._id} className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-lg font-bold text-emerald-950">{member.name}</p>
                        <p className="mt-1 text-sm text-emerald-800/75">{member.email}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{member.isAdmin ? 'Admin' : 'User'}</span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{member.subscriptionStatus || 'None'}</span>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{member.plan || 'None'}</span>
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        <button type="button" onClick={() => handleUserUpdate(member._id, { isAdmin: !member.isAdmin })} className="rounded-[1rem] bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
                          {member.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <button type="button" onClick={() => handleUserUpdate(member._id, { subscription: !member.subscription, subscriptionStatus: member.subscription ? 'None' : 'Active' })} className="rounded-[1rem] bg-emerald-700 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
                          {member.subscription ? 'Stop Subscription' : 'Activate Subscription'}
                        </button>
                        <button type="button" onClick={() => handleUserUpdate(member._id, { scores: [] })} className="rounded-[1rem] border border-emerald-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                          Clear Scores
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-[1.2rem] bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">User profile info</p>
                        <p className="mt-2 text-sm text-emerald-900">Created: {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}</p>
                        <p className="mt-1 text-sm text-emerald-900">Scores stored: {member.scores?.length || 0}</p>
                      </div>
                      <div className="rounded-[1.2rem] bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Charity details</p>
                        <p className="mt-2 text-sm text-emerald-900">Charity share: {member.charityPercentage || 10}%</p>
                        <p className="mt-1 text-sm text-emerald-900">Subscription expiry: {member.subscriptionExpiry ? new Date(member.subscriptionExpiry).toLocaleDateString() : 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}

            <section className="space-y-6">
              {(activeSection === 'overview' || activeSection === 'draws') && (
              <div className={`${cardClass} p-6`}>
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Draw Management</p>
                  <h3 className="mt-2 text-2xl font-bold">Configure draw logic, run simulations, and publish results</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {['Random', 'Weighted'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setDrawMethod(method)}
                        className={`rounded-[1.2rem] px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] ${drawMethod === method ? 'bg-slate-950 text-white' : 'bg-emerald-50 text-emerald-800'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <label className="flex items-center justify-between rounded-[1.2rem] bg-emerald-50 px-4 py-4">
                    <span className="text-sm font-semibold text-emerald-900">Simulation mode</span>
                    <input type="checkbox" checked={isSimulate} onChange={() => setIsSimulate((value) => !value)} className="h-5 w-5 accent-emerald-700" />
                  </label>
                  <button type="button" onClick={handleRunDraw} className="w-full rounded-[1.2rem] bg-emerald-700 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white">
                    {isSimulate ? 'Run Simulation' : 'Run Official Draw'}
                  </button>
                  {drawResult && (
                    <div className="rounded-[1.3rem] border border-emerald-100 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Latest draw result</p>
                      <p className="mt-2 text-lg font-bold text-emerald-950">{drawResult.status}</p>
                      <p className="mt-2 text-sm text-emerald-900">Numbers: {(drawResult.numbers || []).join(', ')}</p>
                      <p className="mt-1 text-sm text-emerald-900">Winners: {drawResult.winners?.length || 0}</p>
                      {drawResult._id && drawResult.status === 'Draft' && (
                        <button type="button" onClick={() => handlePublish(drawResult._id)} className="mt-4 rounded-[1rem] bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
                          Publish Results
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              )}

              {(activeSection === 'overview' || activeSection === 'reports') && (
              <div className={`${cardClass} p-6`}>
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Reports & Analytics</p>
                  <h3 className="mt-2 text-2xl font-bold">Total users, prize pool, charity contribution totals, and draw statistics</h3>
                </div>
                <div className="space-y-3">
                  {[
                    ['Total users', stats?.totalUsers || users.length],
                    ['Total prize pool', `$${totalPrizePool.toFixed(2)}`],
                    ['Charity contribution totals', `${charityContributionTotal}%`],
                    ['Draw statistics', `${winners.length} winners recorded`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.2rem] bg-emerald-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">{label}</p>
                      <p className="mt-2 text-lg font-bold text-emerald-950">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {(activeSection === 'overview' || activeSection === 'charities') && (
            <section className={`${cardClass} p-6`}>
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Charity Management</p>
                <h3 className="mt-2 text-2xl font-bold">Add, edit, delete charities and manage content/media</h3>
              </div>
              <form onSubmit={handleCreateCharity} className="grid gap-3">
                <input
                  type="text"
                  value={newCharity.name}
                  onChange={(event) => setNewCharity((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Charity name"
                  className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                  required
                />
                <textarea
                  value={newCharity.description}
                  onChange={(event) => setNewCharity((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Charity description"
                  className="min-h-28 rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                  required
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    value={newCharity.logo}
                    onChange={(event) => setNewCharity((current) => ({ ...current, logo: event.target.value }))}
                    placeholder="Logo URL"
                    className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                    required
                  />
                  <select
                    value={newCharity.category}
                    onChange={(event) => setNewCharity((current) => ({ ...current, category: event.target.value }))}
                    className="rounded-[1.2rem] border border-emerald-100 bg-emerald-50 px-4 py-4 font-semibold outline-none focus:border-emerald-400"
                  >
                    {['Health', 'Education', 'Environment', 'Animal Welfare', 'Social Justice'].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="rounded-[1.2rem] bg-emerald-700 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white">
                  Add Charity
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {charities.map((charity) => (
                  <div key={charity._id} className="rounded-[1.3rem] border border-emerald-100 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-emerald-950">{charity.name}</p>
                        <p className="mt-1 text-sm text-emerald-800/75">{charity.category}</p>
                        <p className="mt-2 text-sm text-emerald-900">{charity.description}</p>
                      </div>
                      <button type="button" onClick={() => handleDeleteCharity(charity._id)} className="rounded-[1rem] bg-rose-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-rose-600">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}

            {(activeSection === 'overview' || activeSection === 'winners') && (
            <section className={`${cardClass} p-6`}>
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Winners Management</p>
                <h3 className="mt-2 text-2xl font-bold">View full winners list, verify submissions, and mark payouts completed</h3>
              </div>
              <div className="space-y-3">
                {winners.map((winner, index) => (
                  <div key={`${winner.drawId}-${winner.user}-${index}`} className="rounded-[1.3rem] border border-emerald-100 bg-emerald-50/70 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-lg font-bold text-emerald-950">{winner.username || 'User'}</p>
                        <p className="mt-1 text-sm text-emerald-800/75">{winner.category} prize</p>
                        <p className="mt-2 text-sm text-emerald-900">Prize: ${(winner.prizeAmount || 0).toFixed(2)}</p>
                        <p className="mt-1 text-sm text-emerald-900">Status: {winner.payoutStatus || 'Pending'}</p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button type="button" onClick={() => handlePayout(winner.drawId, winner.user, 'Paid')} className="rounded-[1rem] bg-emerald-700 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">
                          Mark Paid
                        </button>
                        <button type="button" onClick={() => handlePayout(winner.drawId, winner.user, 'Rejected')} className="rounded-[1rem] border border-rose-200 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-rose-600">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {!winners.length && (
                  <div className="rounded-[1.3rem] border border-dashed border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                    No winners have been published yet.
                  </div>
                )}
              </div>
            </section>
            )}
          </div>

          <section className={`${cardClass} p-5 lg:hidden`}>
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">Mobile Menu</p>
              <h3 className="mt-2 text-xl font-bold">Admin navigation</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-4 text-left ${activeSection === item.id ? 'bg-slate-950 text-white' : 'bg-emerald-50 text-emerald-950'}`}
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

export default Admin;
