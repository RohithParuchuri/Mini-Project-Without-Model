import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileLock, BarChart3, Share2, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ icon: Icon, label, path, active, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ x: 6 }}
  >
    <Link to={path}>
      <motion.div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all mb-2",
          active
            ? "bg-[#F26419]/10 text-[#F26419] border border-[#F26419]/20"
            : "text-slate-400 hover:text-white hover:bg-white/5"
        )}
        whileHover={{
          backgroundColor: active ? "rgba(242, 100, 25, 0.15)" : "rgba(255, 255, 255, 0.08)",
          transition: { duration: 0.15 }
        }}
      >
        <motion.div whileHover={{ rotate: 12 }} transition={{ type: "spring", stiffness: 600, damping: 25 }}>
          <Icon size={20} />
        </motion.div>
        <span className="text-sm font-bold tracking-tight">{label}</span>
        {active && (
          <motion.span
            className="ml-auto h-1.5 w-1.5 rounded-full bg-[#F26419]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    </Link>
  </motion.div>
);

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <motion.aside
      className="w-64 border-r border-white/5 bg-[#0d0d0d] flex flex-col p-6 z-30"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Clickable Logo to return Home */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Link to="/" className="flex items-center gap-2 text-white mb-10 px-2 group">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
          >
            <Shield
              className="text-[#F26419] transition-transform"
              fill="currentColor"
              fillOpacity={0.2}
            />
          </motion.div>
          <span className="font-bold text-xl tracking-tighter">
            CyberGuard <span className="text-[#F26419]">AI</span>
          </span>
        </Link>
      </motion.div>
      
      <nav className="flex-1">
        {/* Navigation to Dashboard */}
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          path="/dashboard"
          active={location.pathname === "/dashboard"}
          index={0}
        />

        {/* Dashboard Sections */}
        <NavItem
          icon={Share2}
          label="Case Management"
          path="/dashboard/cases"
          active={location.pathname.includes("cases")}
          index={1}
        />
        <NavItem
          icon={BarChart3}
          label="AI Analysis"
          path="/dashboard/analysis"
          active={location.pathname.includes("analysis") || location.pathname.includes("ai-analysis")}
          index={3}
        />
      </nav>

      {/* User Profile */}
      <Link to="/dashboard/profile">
        <motion.div
          className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3 px-2 group cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ x: 6 }}
        >
          <motion.div
            className="size-10 rounded-full bg-gradient-to-tr from-orange-500 to-purple-600 p-[1px]"
            whileHover={{ scale: 1.12 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
          >
            <div className="size-full rounded-full bg-[#121212] flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="size-full rounded-full object-cover" />
              ) : (
                <UserCircle className="size-8 text-slate-500" />
              )}
            </div>
          </motion.div>
          <motion.div whileHover={{ color: "#F26419" }} transition={{ duration: 0.2 }}>
            <p className="text-sm font-bold text-white leading-none">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'My Profile' : 'My Profile'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase font-black mt-2 tracking-widest">
              {user?.email || 'View Profile'}
            </p>
          </motion.div>
        </motion.div>
      </Link>
    </motion.aside>
  );
}