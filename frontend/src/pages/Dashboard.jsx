import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, BarChart3, Zap, TrendingUp, Users, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StatCard = ({ icon: Icon, label, value, subtext, color, delay = 0 }) => (
  <motion.div
    className="bg-[#121212] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all hover:bg-white/[0.02] hover:shadow-lg hover:shadow-white/5 group"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: delay / 1000, ease: "easeOut" }}
    whileHover={{
      scale: 1.06,
      y: -8,
      transition: { type: "spring", stiffness: 600, damping: 25 }
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <motion.div
        className={`p-3 rounded-xl ${color} transition-all duration-300`}
        whileHover={{ scale: 1.18, rotate: 5 }}
        transition={{ type: "spring", stiffness: 600, damping: 25 }}
      >
        <Icon size={24} />
      </motion.div>
    </div>
    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
    <motion.p
      className="text-4xl font-black text-white mb-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: (delay + 100) / 1000 }}
    >
      {value}
    </motion.p>
    <p className="text-xs text-slate-500">{subtext}</p>
  </motion.div>
);

const QuickAccessCard = ({ icon: Icon, title, description, path, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: delay / 1000, ease: "easeOut" }}
    whileHover={{
      y: -12,
      scale: 1.04,
      transition: { type: "spring", stiffness: 600, damping: 25 }
    }}
  >
    <Link to={path}>
      <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 rounded-3xl p-8 hover:border-primary/40 hover:from-white/[0.08] transition-all cursor-pointer group overflow-hidden">
        <div className={`p-4 rounded-2xl ${color} mb-4 w-fit group-hover:scale-110 transition-all duration-300 relative z-10`}>
          <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-primary relative z-10">
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed relative z-10">{description}</p>
        <motion.div
          className="mt-4 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform duration-300 relative z-10"
          whileHover={{ x: 5 }}
        >
          Access Now →
        </motion.div>
      </div>
    </Link>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/cases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setCases(data.data);
      }
    } catch (err) {
      console.error('Failed to parse dashboard cases data:', err);
    } finally {
      setLoading(false);
    }
  };

  const criticalAlerts = cases.filter(c => c.priority === 'critical').length;
  const pendingReview = cases.filter(c => c.status === 'waiting-for-review' || c.status === 'pending-review').length;
  const activeCases = cases.filter(c => c.status === 'under-investigation' || c.status === 'in-progress').length;
  
  // Recent resolved cases within roughly the last 24h
  const resolvedCases = cases.filter(c => {
    if (c.status !== 'resolved') return false;
    const updatedAt = new Date(c.updatedAt);
    const now = new Date();
    const diffTime = Math.abs(now - updatedAt);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours <= 24;
  }).length;

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-400 text-lg">Welcome back to CyberGuard AI. Monitor investigations and manage evidence.</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShieldAlert}
          label="Critical Alerts"
          value={loading ? '-' : criticalAlerts}
          subtext="Require immediate attention"
          color="bg-red-500/10 text-red-500"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={loading ? '-' : pendingReview}
          subtext="Awaiting initial analysis"
          color="bg-orange-500/10 text-orange-500"
          delay={100}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Cases"
          value={loading ? '-' : activeCases}
          subtext="Currently investigating"
          color="bg-purple-500/10 text-purple-500"
          delay={200}
        />
        <StatCard
          icon={CheckCircle}
          label="Resolved (24h)"
          value={loading ? '-' : resolvedCases}
          subtext="Recently closed"
          color="bg-emerald-500/10 text-emerald-500"
          delay={300}
        />
      </div>

      {/* Quick Access Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white tracking-tight">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickAccessCard
            icon={BarChart3}
            title="AI Analysis"
            description="Access deep intelligence reports and behavioral analysis powered by CyberGuard AI."
            path="/dashboard/analysis"
            color="bg-blue-500/10 text-blue-500"
            delay={100}
          />
          <QuickAccessCard
            icon={Users}
            title="Case Management"
            description="Track and manage all active cases, assignments, and investigation progress."
            path="/dashboard/cases"
            color="bg-purple-500/10 text-purple-500"
            delay={200}
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white tracking-tight">Recent Activity</h2>
        <div className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr className="text-[11px] uppercase font-black text-slate-500 tracking-wider">
                  <th className="px-6 py-4 text-left">Case ID</th>
                  <th className="px-6 py-4 text-left">Evidence Type</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Last Updated</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading recent activity...</td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No active cases to display.</td>
                  </tr>
                ) : cases.slice(0, 5).map((item, idx) => (
                  <motion.tr
                    key={item._id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <td className="px-6 py-4 font-mono text-primary font-bold">#{item.caseId}</td>
                    <td className="px-6 py-4 text-white">
                      {item.title}
                      {item.tags && item.tags.length > 0 && <span className="ml-2 px-2 py-0.5 bg-white/5 rounded text-[9px] uppercase tracking-wider text-slate-400">{Array.isArray(item.tags) ? item.tags[0] : item.tags}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <motion.span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                          ${(item.status || 'open') === 'under-investigation' ? 'bg-orange-500/10 text-orange-500' :
                            (item.status || 'open') === 'resolved' ? 'bg-blue-500/10 text-blue-500' :
                            (item.status || 'open') === 'closed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {(item.status || 'open').replace(/-/g, ' ')}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/dashboard/cases`}
                        className="text-[10px] font-bold uppercase text-primary hover:underline hover:text-primary/80 transition-colors duration-300 inline-block group"
                      >
                        <motion.span whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                          Review →
                        </motion.span>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
