import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Filter, Plus, FolderSync, ShieldAlert, Database, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EvidenceCard from '../components/dashboard/EvidenceCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SecureVault() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Fetch user files on mount
  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/files`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (fileList) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      
      for (let file of fileList) {
        // For now, we'll just store file metadata
        // In a real app, you'd upload the file to a storage service
        const response = await fetch(`${API_URL}/files/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            description: '',
            tags: []
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Upload failed');
        }
      }

      setSuccess(`Successfully uploaded ${fileList.length} file(s)`);
      setTimeout(() => setSuccess(''), 3000);
      await fetchFiles();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('File deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        await fetchFiles();
      }
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Secure Vault</h1>
          <p className="text-slate-300 max-w-2xl text-lg leading-relaxed font-medium">
            Securely upload and manage evidence files. Your files are encrypted and stored securely.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all text-slate-300">
            <Filter size={20} /> Filter View
          </button>
        </div>
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

      {/* Drag & Drop Upload Area */}
      <motion.div
        className={`border-2 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center group cursor-pointer transition-all ${
          dragActive
            ? 'border-[#F26419] bg-[#F26419]/[0.02]'
            : 'border-white/10 bg-white/[0.01] hover:border-[#F26419]/40 hover:bg-[#F26419]/[0.01]'
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.02 }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <motion.div
          className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F26419] mb-6 group-hover:scale-110 transition-transform"
          whileHover={{ scale: 1.25, rotate: 5 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Upload size={28} />
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop or Click to Upload</h3>
        <p className="text-slate-400 text-lg">Support for images, videos, documents, and logs</p>
        
        <label className="mt-6">
          <input
            type="file"
            multiple
            onChange={handleChange}
            disabled={loading}
            className="hidden"
            accept="*/*"
          />
          <span className="px-8 py-3 bg-[#F26419] hover:bg-[#d44f0d] disabled:opacity-50 text-white font-bold rounded-xl cursor-pointer inline-flex items-center gap-2 transition-all">
            <Plus size={20} />
            {loading ? 'Uploading...' : 'Select Files'}
          </span>
        </label>

        <p className="text-[#F26419]/70 font-bold text-sm uppercase mt-4 tracking-widest">Files are encrypted and secure</p>
      </motion.div>

      {/* Process Queue & Recent Uploads */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className={`size-2.5 rounded-full ${files.length > 0 ? 'bg-[#F26419]' : 'bg-slate-600'} animate-pulse`} />
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Processing Queue & Recent Uploads</h2>
            <span className="text-sm font-bold text-slate-400">({files.length} files)</span>
          </div>
        </div>

        {files.length === 0 ? (
          <motion.div
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Database size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No files uploaded yet. Start by uploading evidence files above.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {files.map((file, idx) => (
              <motion.div
                key={file._id}
                className="bg-[#121212] border border-white/5 rounded-2xl p-6 group hover:border-white/10 hover:bg-white/[0.02] transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="space-y-4">
                  {/* File Icon & Name */}
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-lg bg-[#F26419]/10 text-[#F26419] flex items-center justify-center">
                      <Upload size={24} />
                    </div>
                    <h3 className="font-bold text-white truncate" title={file.fileName}>
                      {file.fileName}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      file.status === 'pending' ? 'bg-orange-500/10 text-orange-400' :
                      file.status === 'processing' ? 'bg-blue-500/10 text-blue-400' :
                      file.status === 'analyzed' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {file.status}
                    </span>
                  </div>

                  {/* File Info */}
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>Size: {(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</p>
                  </div>

                  {/* Delete Button */}
                  <motion.button
                    onClick={() => handleDeleteFile(file._id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
        <SummaryCard 
          icon={FolderSync} 
          label="Total Files" 
          value={files.length.toString()} 
          sub={`${files.filter(f => f.status === 'pending').length} pending`}
          color="text-orange-500" 
        />
        <SummaryCard 
          icon={ShieldAlert} 
          label="Processed Files" 
          value={files.filter(f => f.status !== 'pending').length.toString()} 
          sub="Ready for analysis"
          color="text-green-500" 
        />
        <SummaryCard 
          icon={Database} 
          label="Storage Used" 
          value={((files.reduce((sum, f) => sum + f.fileSize, 0) / 1024 / 1024 / 1024).toFixed(2)).toString()} 
          sub="GB total"
          color="text-blue-500" 
        />
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, sub, color, progress }) {
  return (
    <motion.div
      className="bg-[#121212] border border-white/5 p-8 rounded-3xl relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{
        scale: 1.06,
        y: -8,
        transition: { type: "spring", stiffness: 600, damping: 25 }
      }}
    >
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm uppercase font-bold text-slate-500 tracking-widest mb-2">{label}</p>
          <h4 className="text-4xl font-black text-white">{value}</h4>
          <p className="text-xs text-slate-500 mt-2">{sub}</p>
        </div>
        <div className={`p-4 rounded-xl bg-white/[0.03] border border-white/10 ${color} group-hover:scale-110 transition-transform`}>
          <Icon size={28} />
        </div>
      </div>
      {progress && (
        <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F26419] to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}