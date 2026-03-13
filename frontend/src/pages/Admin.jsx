import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LogOut, Users, FolderOpen, Edit2, Trash2, AlertCircle, CheckCircle,
  ChevronLeft, Search, Eye, X, Save, BarChart3, Clock, User, Mail, Calendar
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ADMIN = {
  accent: '#7C3AED',
  accentLight: '#8B5CF6',
  accentDark: '#6D28D9',
  bg: '#0B0D1A',
  card: '#111427',
  border: 'rgba(124,58,237,0.15)',
  glow: 'rgba(124,58,237,0.25)',
};

const statusColors = {
  'open': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  'in-progress': { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  'pending-review': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  'closed': { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
};

const priorityColors = {
  'low': { bg: 'bg-green-500/10', text: 'text-green-400' },
  'medium': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'high': { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'critical': { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function Admin() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userCases, setUserCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCase, setEditingCase] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', description: '', status: '', priority: '', investigationProgress: 0
  });
  const [adminCreds, setAdminCreds] = useState({ email: 'admin@admin.com', password: 'admin@123' });
  const [stats, setStats] = useState({ totalUsers: 0, totalCases: 0, openCases: 0, closedCases: 0 });

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminCreds.email, password: adminCreds.password })
      });
      const data = await response.json();
      if (!response.ok || !data.data?.user?.isAdmin) throw new Error('Invalid admin credentials');
      setAdminToken(data.data.accessToken);
      setIsLoggedIn(true);
      fetchUsers(data.data.accessToken);
      fetchAllCasesForStats(data.data.accessToken);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (data.success) setUsers(data.data);
    } catch (err) { console.error('Error fetching users:', err); }
  };

  const fetchAllCasesForStats = async (token) => {
    try {
      const response = await fetch(`${API_URL}/admin/cases`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (data.success) {
        const cases = data.data;
        setStats({
          totalUsers: users.length,
          totalCases: cases.length,
          openCases: cases.filter(c => c.status === 'open' || c.status === 'in-progress').length,
          closedCases: cases.filter(c => c.status === 'closed').length,
        });
      }
    } catch (err) { console.error('Error fetching stats:', err); }
  };

  const fetchUserCases = async (userId, token) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/cases`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await response.json();
      if (data.success) setUserCases(data.data);
    } catch (err) { console.error('Error fetching user cases:', err); }
  };

  const handleUpdateCase = async () => {
    if (!editingCase) return;
    setError('');
    try {
      const response = await fetch(`${API_URL}/admin/cases/${editingCase._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({
          title: editForm.title, description: editForm.description,
          status: editForm.status, priority: editForm.priority,
          investigationProgress: parseInt(editForm.investigationProgress),
        })
      });
      const data = await response.json();
      if (data.success) {
        showSuccess('Case updated successfully');
        setEditingCase(null);
        if (selectedUser) fetchUserCases(selectedUser._id, adminToken);
      } else { setError(data.message || 'Failed to update case'); }
    } catch (err) { setError('Failed to update case'); }
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm('Are you sure you want to permanently delete this case?')) return;
    try {
      const response = await fetch(`${API_URL}/admin/cases/${caseId}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        showSuccess('Case deleted successfully');
        if (selectedUser) fetchUserCases(selectedUser._id, adminToken);
      }
    } catch (err) { setError('Failed to delete case'); }
  };

  const showSuccess = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(''), 3000); };
  const handleLogout = () => { setIsLoggedIn(false); setAdminToken(null); setSelectedUser(null); navigate('/'); };
  const openEditModal = (c) => {
    setEditingCase(c);
    setEditForm({ title: c.title, description: c.description || '', status: c.status, priority: c.priority || 'medium', investigationProgress: c.investigationProgress || 0 });
  };

  useEffect(() => {
    if (adminToken && users.length) setStats(prev => ({ ...prev, totalUsers: users.filter(u => !u.isAdmin).length }));
  }, [users, adminToken]);

  const filteredUsers = users.filter(u =>
    !u.isAdmin && (`${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: ADMIN.bg }}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-violet-600 rounded-full mix-blend-screen filter blur-[200px] opacity-[0.03]" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[180px] opacity-[0.02]" />
        </div>
        <motion.div className="w-full max-w-md relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="border rounded-3xl p-8 backdrop-blur-xl" style={{ background: ADMIN.card, borderColor: ADMIN.border }}>
            <Link to="/" className="flex items-center justify-center gap-2 mb-8">
              <Shield className="text-violet-500" size={40} fill="currentColor" fillOpacity={0.2} />
              <span className="font-bold text-2xl tracking-tighter text-white">CyberGuard <span className="text-violet-500">Admin</span></span>
            </Link>
            <h1 className="text-3xl font-black text-white text-center mb-1">Admin Portal</h1>
            <p className="text-slate-400 text-center mb-8 text-sm">Restricted access — authorized personnel only</p>
            {error && (
              <motion.div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle className="text-red-500 mt-0.5" size={18} /><p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Email</label>
                <input type="email" value={adminCreds.email} onChange={(e) => setAdminCreds({...adminCreds, email: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all"
                  style={{ background: 'rgba(15,17,35,0.8)', borderColor: 'rgba(124,58,237,0.2)' }} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">Password</label>
                <input type="password" value={adminCreds.password} onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})}
                  className="w-full border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all"
                  style={{ background: 'rgba(15,17,35,0.8)', borderColor: 'rgba(124,58,237,0.2)' }} />
              </div>
              <motion.button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all mt-4"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200" style={{ background: ADMIN.bg }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[15%] -right-[10%] w-[600px] h-[600px] bg-violet-600 rounded-full mix-blend-screen filter blur-[180px] opacity-[0.025]" />
        <div className="absolute bottom-[5%] -left-[5%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[160px] opacity-[0.02]" />
      </div>

      <header className="sticky top-0 z-40 border-b backdrop-blur-xl" style={{ background: `${ADMIN.bg}ee`, borderColor: ADMIN.border }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="text-violet-500" size={28} fill="currentColor" fillOpacity={0.2} />
            <span className="font-bold text-lg tracking-tighter text-white">CyberGuard <span className="text-violet-500">Admin</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-lg border border-violet-500/20">ADMIN MODE</span>
            <motion.button onClick={handleLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/20 text-red-400 font-bold rounded-xl flex items-center gap-2 transition-all text-sm"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <LogOut size={16} /> Logout
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <AnimatePresence>
          {successMessage && (
            <motion.div className="fixed top-20 right-6 z-50 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 shadow-2xl"
              initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              <CheckCircle className="text-emerald-500" size={20} /><p className="text-emerald-400 font-medium">{successMessage}</p>
            </motion.div>
          )}
          {error && (
            <motion.div className="fixed top-20 right-6 z-50 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 shadow-2xl"
              initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}>
              <AlertCircle className="text-red-500" size={20} /><p className="text-red-400 font-medium">{error}</p>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-300 ml-2"><X size={16} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-violet-400' },
              { label: 'Total Cases', value: stats.totalCases, icon: FolderOpen, color: 'text-indigo-400' },
              { label: 'Active Cases', value: stats.openCases, icon: BarChart3, color: 'text-amber-400' },
              { label: 'Closed Cases', value: stats.closedCases, icon: CheckCircle, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <motion.div key={stat.label} className="border rounded-2xl p-5" style={{ background: ADMIN.card, borderColor: ADMIN.border }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!selectedUser ? (
            <motion.div key="users-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight">All Users</h1>
                  <p className="text-slate-500 text-sm mt-1">Click on a user to view and manage their cases</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search users..."
                    className="border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white w-72 focus:outline-none focus:ring-2 transition-all placeholder-slate-500"
                    style={{ background: ADMIN.card, borderColor: ADMIN.border }} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u, idx) => (
                  <motion.div key={u._id} className="border rounded-2xl p-5 cursor-pointer group hover:shadow-xl transition-all duration-300"
                    style={{ background: ADMIN.card, borderColor: ADMIN.border }}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                    whileHover={{ scale: 1.02, borderColor: ADMIN.accent }}
                    onClick={() => { setSelectedUser(u); fetchUserCases(u._id, adminToken); }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                        <User size={24} className="text-violet-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base truncate group-hover:text-violet-300 transition-colors">{u.firstName} {u.lastName}</h3>
                        <p className="text-slate-500 text-sm truncate flex items-center gap-1.5 mt-0.5"><Mail size={12} /> {u.email}</p>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mt-3">
                          <Calendar size={10} /> Joined {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Eye size={18} className="text-slate-600 group-hover:text-violet-400 transition-colors mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
              {filteredUsers.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <Users size={48} className="mx-auto mb-4 opacity-30" /><p className="font-bold">No users found</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="user-cases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <motion.button onClick={() => { setSelectedUser(null); setUserCases([]); }}
                  className="p-2.5 border border-violet-500/20 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-xl transition-all"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <ChevronLeft size={20} />
                </motion.button>
                <div className="flex-1">
                  <h1 className="text-2xl font-black text-white tracking-tight">{selectedUser.firstName} {selectedUser.lastName}</h1>
                  <p className="text-slate-500 text-sm">{selectedUser.email} — {userCases.length} case{userCases.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              {userCases.length === 0 ? (
                <div className="text-center py-16 border rounded-2xl" style={{ background: ADMIN.card, borderColor: ADMIN.border }}>
                  <FolderOpen size={48} className="mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-400 font-bold">No cases found for this user</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userCases.map((c, idx) => {
                    const sColor = statusColors[c.status] || statusColors['open'];
                    const pColor = priorityColors[c.priority] || priorityColors['medium'];
                    return (
                      <motion.div key={c._id} className="border rounded-2xl p-6" style={{ background: ADMIN.card, borderColor: ADMIN.border }}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <span className="font-mono text-sm text-violet-400 font-bold">{c.caseId}</span>
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${sColor.bg} ${sColor.text}`}>{c.status}</span>
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${pColor.bg} ${pColor.text}`}>{c.priority || 'medium'}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">{c.title}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2 mb-3">{c.description}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 max-w-xs h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                                  initial={{ width: 0 }} animate={{ width: `${c.investigationProgress}%` }} transition={{ duration: 0.8 }} />
                              </div>
                              <span className="text-xs font-bold text-slate-400">{c.investigationProgress}%</span>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Clock size={12} /> Created {new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <motion.button onClick={() => openEditModal(c)}
                              className="p-2.5 border border-violet-500/20 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 rounded-xl transition-all"
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Edit case">
                              <Edit2 size={16} />
                            </motion.button>
                            <motion.button onClick={() => handleDeleteCase(c._id)}
                              className="p-2.5 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Delete case">
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {editingCase && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingCase(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="relative w-full max-w-lg border rounded-3xl p-8 z-10 max-h-[90vh] overflow-y-auto"
              style={{ background: ADMIN.card, borderColor: ADMIN.border }}
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white">Edit Case</h2>
                <button onClick={() => setEditingCase(null)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Case ID</label>
                  <p className="font-mono text-violet-400 font-bold">{editingCase.caseId}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Title</label>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all"
                    style={{ background: 'rgba(15,17,35,0.8)', borderColor: 'rgba(124,58,237,0.2)' }} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Description</label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows={3}
                    className="w-full border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all resize-none"
                    style={{ background: 'rgba(15,17,35,0.8)', borderColor: 'rgba(124,58,237,0.2)' }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Status</label>
                    <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ background: 'rgba(15,17,35,0.8)', borderColor: 'rgba(124,58,237,0.2)' }}>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="pending-review">Pending Review</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Priority</label>
                    <select value={editForm.priority} onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                      className="w-full border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 transition-all"
                      style={{ background: 'rgba(15,17,35,0.8)', borderColor: 'rgba(124,58,237,0.2)' }}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                    Investigation Progress — <span className="text-violet-400">{editForm.investigationProgress}%</span>
                  </label>
                  <input type="range" min="0" max="100" value={editForm.investigationProgress}
                    onChange={(e) => setEditForm({...editForm, investigationProgress: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-violet-500"
                    style={{ background: `linear-gradient(to right, #7C3AED ${editForm.investigationProgress}%, rgba(255,255,255,0.05) ${editForm.investigationProgress}%)` }} />
                </div>
                <div className="flex gap-3 pt-4">
                  <motion.button onClick={handleUpdateCase}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Save size={18} /> Save Changes
                  </motion.button>
                  <motion.button onClick={() => setEditingCase(null)}
                    className="px-6 py-3 border border-white/10 hover:bg-white/5 text-slate-400 font-bold rounded-xl transition-all"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
