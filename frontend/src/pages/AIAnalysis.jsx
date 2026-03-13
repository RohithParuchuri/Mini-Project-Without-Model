import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Fingerprint, ShieldAlert, Cpu, Scale, BookOpen, AlertCircle, Edit2, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AIAnalysis() {
  const { id } = useParams();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    notes: '',
    investigationProgress: 0
  });

  useEffect(() => {
    if (id) {
      fetchCase();
    }
  }, [id]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/cases/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setCaseData(data.data);
        setEditForm({
          title: data.data.title,
          description: data.data.description || '',
          notes: data.data.notes || '',
          investigationProgress: data.data.investigationProgress || 0
        });
      } else {
        setError('Case not found');
      }
    } catch (err) {
      setError('Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/cases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (data.success) {
        setCaseData(data.data);
        setIsEditing(false);
        setSuccess('Case updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update case');
      }
    } catch (err) {
      setError('Failed to update case');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><p className="text-slate-400">Loading case...</p></div>;
  }

  if (error && !caseData) {
    return <div className="text-center py-12"><p className="text-red-400">{error}</p></div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="w-full max-w-none space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Messages */}
      {error && (
        <motion.div
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
          <p className="text-green-400">{success}</p>
        </motion.div>
      )}

      {/* Header with Back Navigation */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/dashboard/cases" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-4 group">
              <motion.span whileHover={{ x: -4 }}>
                <ArrowLeft size={14} />
              </motion.span>
              Back to Case Directory
            </Link>
          </motion.div>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-white tracking-tight">{caseData?.title || 'Intelligence Report'}</h1>
            <motion.span
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-mono font-bold text-[#F26419]"
              whileHover={{ scale: 1.05, borderColor: "rgba(242, 100, 25, 0.5)" }}
            >
              #{caseData?.caseId}
            </motion.span>
          </div>
        </div>
        <motion.button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F26419]/10 hover:bg-[#F26419]/20 text-[#F26419] rounded-xl text-xs font-bold uppercase transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit2 size={16} /> {isEditing ? 'CANCEL' : 'EDIT'}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Case Details & Analysis */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Description & Details Section */}
          {!isEditing ? (
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Case Description</h2>
                <p className="text-slate-300 leading-relaxed">{caseData?.description || 'No description provided'}</p>
              </div>

              {caseData?.notes && (
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Investigation Notes</h2>
                  <p className="text-slate-300 leading-relaxed">{caseData.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 bg-slate-900/20 border border-white/5 rounded-2xl p-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">CASE TITLE</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">DESCRIPTION</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="4"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">INVESTIGATION PROGRESS (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editForm.investigationProgress}
                    onChange={(e) => setEditForm({ ...editForm, investigationProgress: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-2xl font-bold text-[#F26419] w-16 text-right">{editForm.investigationProgress}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">NOTES</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows="3"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  onClick={handleSaveChanges}
                  className="flex-1 px-6 py-3 bg-[#F26419] hover:bg-[#d44f0d] text-white font-bold rounded-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 bg-slate-600/30 hover:bg-slate-600/50 text-white font-bold rounded-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          )}
          
          {/* BNS Analysis Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-4" variants={itemVariants}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <BrainCircuit size={14} className="text-emerald-500" /> Status
              </h3>
              <p className="text-lg text-white font-bold">
                {caseData?.status?.charAt(0).toUpperCase() + caseData?.status?.slice(1) || 'Open'}
              </p>
            </motion.div>

            <motion.div className="space-y-4" variants={itemVariants}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <Fingerprint size={14} className="text-[#F26419]" /> Investigation Progress
              </h3>
              <div className="flex items-end gap-3">
                <motion.div
                  className="text-6xl font-black text-[#F26419] tracking-tighter"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  {caseData?.investigationProgress || 0}<span className="text-3xl">%</span>
                </motion.div>
              </div>
              <motion.div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                <motion.div
                  className="h-full bg-[#F26419]"
                  initial={{ width: 0 }}
                  animate={{ width: `${caseData?.investigationProgress || 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.7 }}
                />
              </motion.div>
              <p className="text-[10px] text-[#F26419] font-bold uppercase tracking-widest">Case Progress</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Execution Panel */}
        <motion.div
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div className="bg-[#121212] p-8 rounded-3xl h-full flex flex-col border border-white/5">

            <motion.h2
              className="font-black uppercase tracking-[0.2em] text-xs text-[#F26419] mb-8 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Cpu size={16} /> Case Summary
            </motion.h2>

            <div className="flex-1 space-y-8">
              <motion.div
                className="relative pl-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#F26419]"
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                />
                <p className="text-sm font-bold text-white uppercase tracking-wider">Case ID</p>
                <p className="text-lg text-[#F26419] font-mono mt-1">
                  {caseData?.caseId}
                </p>
              </motion.div>

              <motion.div
                className="relative pl-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-emerald-500"
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
                <p className="text-sm font-bold text-white uppercase tracking-wider">Priority</p>
                <p className="text-sm text-slate-300 mt-1 capitalize">
                  {caseData?.priority || 'Medium'}
                </p>
              </motion.div>

              <motion.div
                className="relative pl-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500"
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                />
                <p className="text-sm font-bold text-white uppercase tracking-wider">Created</p>
                <p className="text-sm text-slate-300 mt-1">
                  {new Date(caseData?.createdAt).toLocaleDateString()}
                </p>
              </motion.div>

              <motion.div
                className="space-y-4 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-600 tracking-widest">
                  <span>Evidence Files</span>
                  <span className="text-white">{caseData?.evidenceFiles?.length || 0}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-600 tracking-widest">
                  <span>Status</span>
                  <span className={caseData?.status === 'closed' ? 'text-red-500' : 'text-emerald-500'}>
                    {caseData?.status?.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="mt-12 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Link
                to={`/dashboard/cases`}
                className="block w-full py-4 bg-[#F26419] text-white font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-[#d44f0d] transition-all shadow-xl text-center"
              >
                Back to Cases
              </Link>
            </motion.div>

          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}