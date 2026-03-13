import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, BarChart3, Zap, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';

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
          value="12"
          subtext="Require immediate attention"
          color="bg-red-500/10 text-red-500"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value="48"
          subtext="Awaiting analysis"
          color="bg-orange-500/10 text-orange-500"
          delay={100}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Cases"
          value="156"
          subtext="In investigation"
          color="bg-blue-500/10 text-blue-500"
          delay={200}
        />
        <StatCard
          icon={AlertCircle}
          label="Resolved (24h)"
          value="31"
          subtext="Successfully closed"
          color="bg-emerald-500/10 text-emerald-500"
          delay={300}
        />
      </div>

      {/* Quick Access Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-white tracking-tight">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickAccessCard
            icon={Lock}
            title="Secure Vault"
            description="Manage and analyze evidence files securely. Upload, process, and store digital evidence."
            path="/dashboard/secure-vault"
            color="bg-orange-500/10 text-orange-500"
            delay={0}
          />
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
                {[
                  { id: '#8829-X', type: 'Audio Evidence', status: 'Processing', time: '2 mins ago' },
                  { id: '#8721-A', type: 'Video Screenshot', status: 'Analyzed', time: '45 mins ago' },
                  { id: '#8614-B', type: 'Chat Logs', status: 'Completed', time: '2 hours ago' },
                ].map((item, idx) => (
                  <motion.tr
                    key={idx}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-all duration-300 group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                    whileHover={{
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      transition: { duration: 0.2 }
                    }}
                  >
                    <td className="px-6 py-4 font-mono text-primary font-bold">{item.id}</td>
                    <td className="px-6 py-4 text-white">{item.type}</td>
                    <td className="px-6 py-4">
                      <motion.span
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                          ${item.status === 'Processing' ? 'bg-orange-500/10 text-orange-500' :
                            item.status === 'Analyzed' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-emerald-500/10 text-emerald-500'}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.status}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{item.time}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/dashboard/analysis/${item.id}`}
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
