import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Menu, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleReportCrime = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard/secure-vault');
    } else {
      navigate('/login');
    }
  };

  const navItems = [
    { label: "Report Crime", href: "#report", isAction: true },
    { label: "Resources", href: "/resources" },
    { label: "About Us", href: "/about-us" },
    ...(!isAuthenticated ? [{ label: "Login", href: "/login" }] : [])
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#121212]/80 backdrop-blur-md px-6 py-4 md:px-10">
      <Link to="/">
        <motion.div
          className="flex items-center gap-3 text-white cursor-pointer group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="flex size-10 items-center justify-center rounded-xl bg-[#F26419]/20 text-[#F26419] group-hover:bg-[#F26419]/30 transition-all"
            whileHover={{ scale: 1.12, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
          >
            <Shield size={24} fill="currentColor" fillOpacity={0.2} />
          </motion.div>
          <motion.h2
            className="text-[#E6E2DF] text-xl font-bold tracking-tight group-hover:text-[#F26419] transition-colors"
            whileHover={{ color: "#F26419" }}
            transition={{ duration: 0.2 }}
          >
            CyberGuard
          </motion.h2>
        </motion.div>
      </Link>

      <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <div className="flex items-center gap-8 text-[#E6E2DF]/80 text-sm font-medium">
          {navItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
            >
              {item.isAction ? (
                <button
                  onClick={handleReportCrime}
                  className="relative group hover:text-[#F26419] transition-colors duration-200 cursor-pointer"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-orange-300 group-hover:w-full transition-all duration-200" />
                </button>
              ) : (
                <Link
                  to={item.href}
                  className="relative group hover:text-[#F26419] transition-colors duration-200"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-orange-300 group-hover:w-full transition-all duration-200" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Authentication Section */}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* User Profile Link */}
            <Link
              to="/dashboard/profile"
              className="text-sm text-[#E6E2DF]/80 hover:text-[#F26419] transition-colors duration-200 font-medium"
            >
              {user?.firstName ? `Hi, ${user.firstName}` : 'Dashboard'}
            </Link>

            {/* Profile Button */}
            <motion.div>
              <Link
                to="/dashboard/profile"
                className="px-4 py-2 rounded-lg bg-[#F26419]/10 border border-[#F26419]/30 hover:border-[#F26419]/60 text-[#F26419] text-sm font-bold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Profile
              </Link>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              className="h-10 rounded-full bg-red-600/80 hover:bg-red-600 px-6 text-white text-sm font-bold transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <Link
              to="/get-help"
              className="h-10 rounded-full bg-[#F26419] px-6 text-white text-sm font-bold hover:bg-[#d44f0d] transition-all shadow-lg shadow-orange-500/20 flex items-center"
            >
              <span className="relative">Get Help Now</span>
            </Link>
          </motion.div>
        )}
      </nav>

      <motion.button
        className="md:hidden text-[#E6E2DF]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu />
      </motion.button>
    </header>
  );
}
