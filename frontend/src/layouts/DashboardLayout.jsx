import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-[#E6E2DF] selection:bg-primary/30">
      <Sidebar />
      <main className="flex-1 flex flex-col relative">
        {/* Fixed Background Texture */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-noise opacity-[0.03] mix-blend-overlay" />

        <header className="h-16 border-b border-white/5 bg-[#0d0d0d] flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-6 text-sm font-bold tracking-tight">
            <Link to="/" className="text-slate-500 hover:text-white transition-colors">Home</Link>
            <span className="text-white border-l border-white/10 pl-6">
              {user ? `Welcome, ${user.firstName || 'Agent'}` : 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search evidence ID..."
                className="bg-white/[0.03] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm w-72 focus:outline-none focus:border-primary/40 focus:bg-white/[0.05]"
              />
            </div>
            <div className="flex items-center gap-3 ml-2">
              <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-[#0d0d0d]" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400">
                <Settings size={20} />
              </button>
              <div className="w-px h-6 bg-white/10" />
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* This is the only scrolling container now */}
        <div className="flex-1 overflow-y-auto p-10 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
