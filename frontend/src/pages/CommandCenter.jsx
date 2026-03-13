import React from 'react';
import { ShieldAlert, Clock, CheckCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, color }) => (
  <div className="bg-glass border border-glass-border p-6 rounded-cyber backdrop-blur-md">
    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

export default function CommandCenter() {
  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Authority Triage</h1>
          <p className="text-slate-400">Live priority queue for digital crime resolution.</p>
        </div>
        <div className="bg-glass border border-glass-border rounded-xl px-4 py-2 text-primary text-xs font-bold animate-pulse">
          ● LIVE INTELLIGENCE ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Critical Alerts" value="12" color="text-red-500" />
        <StatCard label="Pending Triage" value="48" color="text-primary" />
        <StatCard label="Active Investigations" value="156" color="text-blue-400" />
        <StatCard label="Resolved (24h)" value="31" color="text-emerald-500" />
      </div>

      <div className="bg-glass border border-glass-border rounded-cyber overflow-hidden">
        <div className="p-6 border-b border-glass-border flex justify-between items-center bg-white/[0.01]">
          <h2 className="font-bold uppercase tracking-widest text-sm text-slate-400">High-Priority Incident Queue</h2>
          <Search size={18} className="text-slate-600" />
        </div>
        <table className="w-full text-left">
          <thead className="text-[10px] uppercase font-black text-slate-500 bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4">Case ID</th>
              <th className="px-6 py-4">Victim Entity</th>
              <th className="px-6 py-4">Threat Level</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm border-t border-glass-border">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-glass-border hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4 font-mono text-primary">#CAS-882{i}-X</td>
                <td className="px-6 py-4 text-white font-bold">Standard Chartered Bank</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded">HIGH RISK</span></td>
                <td className="px-6 py-4 text-slate-400">Processing Logs...</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/dashboard/analysis/CAS-882${i}-X`} className="text-[10px] font-black uppercase text-primary hover:underline">Launch Analysis →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}