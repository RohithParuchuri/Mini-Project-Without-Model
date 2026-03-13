import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Camera, Save, AlertCircle, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading, error, updateProfile, changePassword } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  // Change password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        profileImage: user.profileImage || null,
      });
      if (user.profileImage) {
        setPreviewImage(user.profileImage);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, just read as data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!formData.firstName || !formData.lastName) {
      setFormError('First name and last name are required');
      return;
    }

    try {
      setSaveLoading(true);
      await updateProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setFormError(err.message || 'Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword, passwordData.confirmPassword);
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="animate-spin w-12 h-12 border-4 border-slate-600 border-t-[#F26419] rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full text-center py-20">
        <p className="text-slate-400">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-5xl font-black text-white tracking-tight">Profile</h1>
        <p className="text-slate-400 text-lg">Manage your personal information and profile settings</p>
      </div>

      {/* Profile Card */}
      <motion.div
        className="bg-[#121212] border border-white/5 rounded-3xl p-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Error Message */}
        {formError && (
          <motion.div
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-red-400 text-sm">{formError}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {successMessage && (
          <motion.div
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-green-400 text-sm">{successMessage}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Profile Picture</h2>
            <div className="flex items-end gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#F26419]/20 to-[#F26419]/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-[#F26419]/50" />
                  )}
                </div>
              </div>
              <label className="flex-1 flex items-center justify-center px-6 py-4 border border-dashed border-white/20 rounded-xl hover:border-[#F26419]/50 transition-colors cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="text-center">
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-[#F26419] transition-colors mx-auto mb-2" />
                  <p className="text-sm text-slate-400 group-hover:text-slate-300">Click to upload image</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                </div>
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Personal Information</h2>
            
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-white">First Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-white">Last Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-900/30 border border-slate-600/30 rounded-xl pl-12 pr-4 py-3 text-slate-400 placeholder-slate-500 focus:outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-white">Bio</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-slate-500" size={18} />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500 resize-none h-32"
                  maxLength="500"
                />
                <p className="text-xs text-slate-500 mt-1">{formData.bio.length}/500 characters</p>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-bold text-white">Account Information</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500">Member Since</p>
                <p className="text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Last Login</p>
                <p className="text-slate-300">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={saveLoading}
              className="flex-1 bg-gradient-to-r from-[#F26419] to-[#F26419]/80 hover:from-[#F26419]/90 hover:to-[#F26419]/70 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#F26419]/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saveLoading ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Change Password Section */}
      <motion.div
        className="bg-[#121212] border border-white/5 rounded-3xl p-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Lock size={24} className="text-[#F26419]" />
          Change Password
        </h2>

        {passwordError && (
          <motion.div
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-red-400 text-sm">{passwordError}</p>
          </motion.div>
        )}

        {passwordSuccess && (
          <motion.div
            className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-green-400 text-sm">{passwordSuccess}</p>
          </motion.div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                placeholder="Enter current password"
                className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Enter new password"
                className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-500">Must be at least 8 characters with uppercase, lowercase, number, and special character</p>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                className="w-full bg-slate-900/60 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/30 transition-all duration-300 hover:border-slate-500"
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={passwordLoading}
            className="bg-gradient-to-r from-[#F26419] to-[#F26419]/80 hover:from-[#F26419]/90 hover:to-[#F26419]/70 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:shadow-[#F26419]/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {passwordLoading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Changing...
              </>
            ) : (
              <>
                <Lock size={18} />
                Change Password
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
