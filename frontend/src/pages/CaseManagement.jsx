import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronRight, Edit2, Trash2, X, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CaseManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCase, setEditingCase] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/cases`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setCases(data.data);
      }
    } catch (err) {
      setError('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (caseItem) => {
    setEditingCase(caseItem._id);
    setEditForm({
      title: caseItem.title,
      description: caseItem.description || '',
      status: caseItem.status,
      priority: caseItem.priority || 'medium',
      notes: caseItem.notes || ''
    });
  };

  const handleSaveCase = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/cases/${editingCase}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Case updated successfully');
        setTimeout(() => setSuccess(''), 3000);
        setEditingCase(null);
        await fetchCases();
      } else {
        setError(data.message || 'Failed to update case');
      }
    } catch (err) {
      setError('Failed to update case');
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/cases/${caseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Case deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        await fetchCases();
      }
    } catch (err) {
      setError('Failed to delete case');
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesTab = activeTab === 'All' || c.status === activeTab.toLowerCase();
    const matchesSearch = c.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full space-y-12 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white tracking-tight">Case Management</h1>
          <p className="text-slate-500 text-lg font-medium">Global registry of active digital investigations. Create, edit, and track your investigation cases.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard/cases'}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#F26419] text-white text-sm font-black uppercase tracking-widest hover:bg-[#d44f0d] transition-all"
        >
          <Plus size={20} /> Open New Case
        </button>
      </div>

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

      {/* Filter Bar - Borderless Style */}
      <div className="flex justify-between items-center py-4">
        <div className="flex gap-8">
          {['All', 'open', 'in-progress', 'pending-review', 'closed'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab === 'All' ? 'All' : tab)}
              className={cn(
                "text-sm font-black uppercase tracking-[0.2em] transition-all relative pb-2",
                activeTab === tab || (activeTab === 'All' && tab === 'All') ? "text-[#F26419]" : "text-slate-600 hover:text-slate-400"
              )}
            >
              {tab === 'in-progress' ? 'In Progress' : tab === 'pending-review' ? 'Pending Review' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {(activeTab === tab || (activeTab === 'All' && tab === 'All')) && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F26419]" />}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <Search className="absolute left-0 text-slate-700" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH ID OR TITLE..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none py-2 pl-8 text-xs font-black tracking-widest focus:outline-none text-white w-64 placeholder:text-slate-800" 
            />
          </div>
          <Filter className="text-slate-700 cursor-pointer hover:text-[#F26419] transition-colors" size={20} />
        </div>
      </div>

      {/* Case List - Removed Table Borders */}
      <div className="space-y-1">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No cases found. Create a new case to get started.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
              <div className="col-span-2">Case ID</div>
              <div className="col-span-3">Title</div>
              <div className="col-span-3">Investigation Progress</div>
              <div className="col-span-2">Date Opened</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredCases.map((c) => (
              <motion.div
                key={c._id}
                className="grid grid-cols-12 items-center px-6 py-8 hover:bg-white/[0.02] transition-all group rounded-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  x: 4,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="col-span-2 font-mono font-bold text-[#F26419] text-lg">#{c.caseId}</div>
                <div className="col-span-3">
                  <p className="text-white font-bold text-lg">{c.title}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">{c.description?.substring(0, 30)}</p>
                </div>

                {/* Linear Progress Graph */}
                <div className="col-span-3 pr-12">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                    <span className={cn(c.investigationProgress === 100 ? "text-emerald-500" : "text-slate-500")}>
                      {c.status}
                    </span>
                    <span className="text-white">{c.investigationProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        "h-full",
                        c.investigationProgress === 100 ? "bg-emerald-500" : "bg-[#F26419]"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.investigationProgress}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                </div>

                <div className="col-span-2 text-slate-500 font-mono text-sm">{new Date(c.createdAt).toLocaleDateString()}</div>

                <div className="col-span-2 text-right flex items-center gap-2 justify-end">
                  <motion.button
                    onClick={() => handleEditClick(c)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:text-[#F26419] hover:bg-white/5 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit2 size={14} /> EDIT
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteCase(c._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={14} /> DELETE
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Edit Case Modal */}
      {editingCase && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setEditingCase(null)}
        >
          <motion.div
            className="bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-white">Edit Case</h2>
              <button
                onClick={() => setEditingCase(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">CASE TITLE</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">DESCRIPTION</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows="4"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] transition-colors resize-none"
                />
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">STATUS</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F26419] transition-colors"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending-review">Pending Review</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">PRIORITY</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F26419] transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">NOTES</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows="3"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] transition-colors resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  onClick={handleSaveCase}
                  className="flex-1 px-6 py-3 bg-[#F26419] hover:bg-[#d44f0d] text-white font-bold rounded-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
                <motion.button
                  onClick={() => setEditingCase(null)}
                  className="flex-1 px-6 py-3 bg-slate-600/30 hover:bg-slate-600/50 text-white font-bold rounded-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}