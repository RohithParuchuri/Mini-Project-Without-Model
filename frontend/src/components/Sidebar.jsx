import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Share2, FileLock, BarChart3, User, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * NavItem Component
 * Logic for the orange "selected" identifier using conditional classes.
 */
const NavItem = ({ to, icon: Icon, label, active }) => (
  <Link to={to}>
    <div className={cn(
      "flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all mb-2 border border-transparent",
      // ACTIVE STATE: Orange background, orange text, and a subtle border
      active 
        ? "bg-[#F26419]/10 text-[#F26419] border-[#F26419]/20 shadow-[inset_0px_0px_12px_rgba(242,100,25,0.05)]" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    )}>
      <Icon size={20} className={cn(active ? "text-[#F26419]" : "text-slate-500")} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  </Link>
);

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0d0d0d] flex flex-col p-6 h-screen sticky top-0 z-30">
      {/* Brand Identity */}
      <Link to="/" className="flex items-center gap-2 text-white mb-10 px-2 group">
        <Shield className="text-[#F26419] transition-transform group-hover:scale-110" fill="currentColor" fillOpacity={0.2} />
        <span className="font-bold text-xl tracking-tighter">CyberGuard <span className="text-[#F26419]">AI</span></span>
      </Link>
      
      <nav className="flex-1">
        {/* Appropriate Terminology for Forensic Intelligence */}
        <NavItem 
          to="/dashboard/command-center" 
          icon={LayoutDashboard} 
          label="Triage Dashboard" 
          active={pathname.includes('command-center')} 
        />
        <NavItem 
          to="/dashboard/cases" 
          icon={Share2} 
          label="Incident Directory" 
          active={pathname.includes('cases')} 
        />
        <NavItem 
          to="/dashboard/secure-vault" 
          icon={FileLock} 
          label="Evidence Vault" 
          active={pathname.includes('secure-vault')} 
        />
        <NavItem 
          to="/dashboard/ai-analysis" 
          icon={BarChart3} 
          label="Threat Intelligence" 
          active={pathname.includes('ai-analysis')} 
        />
        <NavItem 
          to="/dashboard/threat-graph" 
          icon={Globe} 
          label="Global Threat Map" 
          active={pathname.includes('threat-graph')} 
        />
      </nav>

      {/* User Session Info */}
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-3">
        <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center border border-[#F26419]/30 overflow-hidden">
          <div className="size-8 bg-slate-700 rounded-full" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Agent Sarah K.</p>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Lvl 4 Specialist</p>
        </div>
      </div>
    </aside>
  );
}