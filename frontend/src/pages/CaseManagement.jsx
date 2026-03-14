import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, ChevronRight, Edit2, Trash2, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
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
    status: 'waiting-for-review',
    priority: 'medium',
    notes: '',
    tags: '',
    investigationProgress: 0
  });
  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    title: '',
    description: '',
    incidentDate: new Date().toISOString().split('T')[0],
    tags: '',
    files: []
  });
  const [expandedCase, setExpandedCase] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user]);

  // Auto-poll: re-fetch every 3s while any case has aiProcessing === true
  useEffect(() => {
    const hasProcessing = cases.some(c => c.aiProcessing);
    if (!hasProcessing) return;
    const interval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      fetch(`${API_URL}/cases`, { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => { if (data.success) setCases(data.data); })
        .catch(() => { });
    }, 3000);
    return () => clearInterval(interval);
  }, [cases]);

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
      status: caseItem.status || 'waiting-for-review',
      priority: caseItem.priority || 'medium',
      notes: caseItem.notes || '',
      tags: caseItem.tags ? caseItem.tags.join(', ') : '',
      investigationProgress: caseItem.investigationProgress || 0
    });
  };

  const handleSaveCase = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      // Build the update payload — exclude admin-only fields for regular users
      const updatePayload = {
        title: editForm.title,
        description: editForm.description,
        notes: editForm.notes,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      // Only admin can update status, priority, investigationProgress
      if (user?.isAdmin) {
        updatePayload.status = editForm.status;
        updatePayload.priority = editForm.priority;
        updatePayload.investigationProgress = editForm.investigationProgress;
      }
      const response = await fetch(`${API_URL}/cases/${editingCase}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
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

  const handleCreateCase = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      const tagsArray = newCaseForm.tags.split(',').map(t => t.trim()).filter(t => t);

      const response = await fetch(`${API_URL}/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          caseId: `C-${Math.floor(Math.random() * 100000)}`,
          title: newCaseForm.title,
          description: newCaseForm.description,
          tags: tagsArray,
          incidentDate: newCaseForm.incidentDate
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Case created successfully');
        setTimeout(() => setSuccess(''), 3000);
        setIsCreatingCase(false);
        setNewCaseForm({ title: '', description: '', incidentDate: new Date().toISOString().split('T')[0], tags: '', files: [] });
        await fetchCases();
      } else {
        setError(data.message || 'Failed to create case');
      }
    } catch (err) {
      setError('Failed to create case');
    } finally {
      setLoading(false);
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
          onClick={() => setIsCreatingCase(true)}
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
          {['All', 'waiting-for-review', 'under-investigation', 'resolved', 'closed'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab === 'All' ? 'All' : tab)}
              className={cn(
                "text-sm font-black uppercase tracking-[0.2em] transition-all relative pb-2",
                activeTab === tab || (activeTab === 'All' && tab === 'All') ? "text-[#F26419]" : "text-slate-600 hover:text-slate-400"
              )}
            >
              {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl"
          >
            <div className="size-20 bg-white/[0.03] text-slate-500 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">No Active Cases</h3>
            <p className="text-slate-400 max-w-sm mx-auto">There are currently no cases matching your filters. Click "Open New Case" to create one.</p>
          </motion.div>
        ) : (
          <>
            <div className={cn("grid px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700", user?.isAdmin ? "grid-cols-14" : "grid-cols-12")}>
              <div className="col-span-2">Case ID</div>
              {user?.isAdmin && <div className="col-span-2">User</div>}
              <div className="col-span-3">Title</div>
              <div className="col-span-3">Investigation Progress</div>
              <div className="col-span-2">Date Opened</div>
            </div>

            {filteredCases.map((c) => (
              <React.Fragment key={c._id}>
                <motion.div
                  className={cn("grid items-center px-6 py-8 hover:bg-white/[0.02] transition-all group rounded-2xl cursor-pointer", user?.isAdmin ? "grid-cols-14" : "grid-cols-12")}
                  onClick={() => setExpandedCase(expandedCase === c._id ? null : c._id)}
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
                  {user?.isAdmin && (
                    <div className="col-span-2">
                      <p className="text-white text-sm font-bold">{c.userId?.firstName} {c.userId?.lastName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{c.userId?.email}</p>
                    </div>
                  )}
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold text-lg">{c.title}</p>
                      {c.aiProcessing && (
                        <motion.div
                          className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Loader2 size={12} className="text-purple-400 animate-spin" />
                          <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">AI</span>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mt-1">{c.description?.substring(0, 30)}</p>
                  </div>

                  {/* Linear Progress Graph */}
                  <div className="col-span-3 pr-12">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className={cn(c.investigationProgress === 100 ? "text-emerald-500" : "text-slate-500")}>
                        {c.status.replace(/-/g, ' ')}
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
                      onClick={(e) => { e.stopPropagation(); handleEditClick(c); }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:text-[#F26419] hover:bg-white/5 rounded-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit2 size={14} /> EDIT
                    </motion.button>
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleDeleteCase(c._id); }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={14} /> DELETE
                    </motion.button>
                  </div>
                </motion.div>

                {/* Expanded Details View */}
                {expandedCase === c._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-6 py-6 border-b border-t border-white/5 bg-white/[0.01]"
                  >
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-3">Details</h4>
                        <p className="text-sm text-slate-300 mb-4">{c.description}</p>
                        {c.tags && c.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {c.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-3">Status</h4>
                        <div className="space-y-3">
                          <p className="text-sm text-slate-300 border border-white/5 rounded-lg p-3 bg-white/5 uppercase tracking-wider font-bold">Priority: <span className="text-white">{c.priority}</span></p>
                          <p className="text-sm text-slate-300 border border-white/5 rounded-lg p-3 bg-white/5 uppercase tracking-wider font-bold">Status: <span className="text-[#F26419]">{c.status.replace(/-/g, ' ')}</span></p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-3">Files ({c.evidenceFiles?.length || 0})</h4>
                        {c.evidenceFiles && c.evidenceFiles.length > 0 ? (
                          <div className="space-y-2">
                            {/* We will populate actual file data if it was populated in the backend, for now show length */}
                            <p className="text-sm text-slate-400">{c.evidenceFiles.length} evidence file(s) attached.</p>
                          </div>
                        ) : (
                          <div className="border border-dashed border-white/10 rounded-xl p-4 text-center">
                            <p className="text-xs text-slate-500">No files uploaded yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </div>

      {/* New Case Modal */}
      {isCreatingCase && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsCreatingCase(false)}
        >
          <motion.div
            className="bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-white">Open New Case</h2>
              <button
                onClick={() => setIsCreatingCase(false)}
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
                  value={newCaseForm.title}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
                  placeholder="E.g., Unauthorized Access Log Analysis"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] transition-colors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">ISSUE TEXT (DESCRIPTION)</label>
                <textarea
                  value={newCaseForm.description}
                  onChange={(e) => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
                  placeholder="Detail the issue..."
                  rows="4"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] transition-colors resize-none"
                  required
                />
              </div>

              {/* Date & Tags */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">INCIDENT DATE</label>
                  <input
                    type="date"
                    value={newCaseForm.incidentDate}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, incidentDate: e.target.value })}
                    className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F26419] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">METADATA / TAGS</label>
                  <input
                    type="text"
                    value={newCaseForm.tags}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, tags: e.target.value })}
                    placeholder="Comma separated (e.g., malware, high-risk)"
                    className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] transition-colors"
                  />
                </div>
              </div>

              {/* File Upload Simulator */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">MULTI-IMAGE / FILE UPLOAD</label>
                <div className="border border-dashed border-white/20 rounded-xl p-8 text-center bg-white/[0.02]">
                  <p className="text-sm text-slate-400">Click to browse or drag and drop files.</p>
                  <input type="file" multiple className="mt-4 text-xs text-slate-300" />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  onClick={handleCreateCase}
                  disabled={loading || !newCaseForm.title || !newCaseForm.description}
                  className="flex-1 px-6 py-3 bg-[#F26419] hover:bg-[#d44f0d] disabled:opacity-50 text-white font-bold rounded-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Creating...' : 'Submit Case'}
                </motion.button>
                <motion.button
                  onClick={() => setIsCreatingCase(false)}
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

              {/* Status and Priority — Admin can edit, users see read-only */}
              {user?.isAdmin ? (
                <>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-2">STATUS</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F26419] transition-colors"
                      >
                        <option value="waiting-for-review">Waiting for Review</option>
                        <option value="under-investigation">Under Investigation</option>
                        <option value="resolved">Resolved</option>
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
                  {/* Investigation Progress Slider — Admin only */}
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                      INVESTIGATION PROGRESS — <span className="text-[#F26419]">{editForm.investigationProgress}%</span>
                    </label>
                    <input
                      type="range" min="0" max="100"
                      value={editForm.investigationProgress}
                      onChange={(e) => setEditForm({ ...editForm, investigationProgress: parseInt(e.target.value) })}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#F26419]"
                      style={{ background: `linear-gradient(to right, #F26419 ${editForm.investigationProgress}%, rgba(255,255,255,0.05) ${editForm.investigationProgress}%)` }}
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">STATUS</label>
                    <p className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-400 uppercase tracking-wider text-sm">
                      {editForm.status ? editForm.status.replace(/-/g, ' ') : '—'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2">PRIORITY</label>
                    <p className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-400 uppercase tracking-wider text-sm">
                      {editForm.priority || '—'}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">TAGS</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="Comma separated tags"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] transition-colors"
                />
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