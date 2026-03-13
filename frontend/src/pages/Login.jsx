import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSuccessMessage('');
      await login(formData.email, formData.password);
      setSuccessMessage('Login successful! Redirecting...');

      // Redirect after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      // Error is handled by the context and displayed below
      console.error('Login error:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#E6E2DF] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Minimalist Atmospheric Aurora Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Large, slow-drifting deep orange haze */}
        <div
          className="absolute -top-[20%] -left-[15%] w-[1200px] h-[1200px] bg-[#F26419] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.008] animate-pulse"
          style={{ animationDuration: '25s' }}
        />

        {/* Subtly shifting mid-tone */}
        <div
          className="absolute top-[25%] -right-[20%] w-[900px] h-[900px] bg-orange-700 rounded-full mix-blend-screen filter blur-[180px] opacity-[0.005] animate-pulse"
          style={{ animationDuration: '30s', animationDelay: '5s' }}
        />

        {/* Soft grounding tint at the bottom */}
        <div
          className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-[#F26419] rounded-full mix-blend-screen filter blur-[220px] opacity-[0.008] animate-pulse"
          style={{ animationDuration: '35s', animationDelay: '8s' }}
        />
      </div>
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-15 mix-blend-overlay" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="flex items-center justify-center gap-2 mb-12 group">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Shield
                className="text-[#F26419] transition-transform"
                size={40}
                fill="currentColor"
                fillOpacity={0.2}
              />
            </motion.div>
            <span className="font-bold text-2xl tracking-tighter text-white">
              CyberGuard <span className="text-[#F26419]">AI</span>
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400">Sign in to access CyberGuard AI</p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success Message */}
          {successMessage && (
            <motion.div
              className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-green-400 text-sm">{successMessage}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-white uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-white uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors duration-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 bg-slate-700 border border-slate-500 rounded cursor-pointer accent-[#F26419] transition-all duration-300"
                />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#F26419] hover:text-[#F26419]/80 transition-colors duration-300">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F26419] to-[#F26419]/80 hover:from-[#F26419]/90 hover:to-[#F26419]/70 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#F26419]/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <ArrowRight size={18} />
                  </motion.span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#F26419] font-bold hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
