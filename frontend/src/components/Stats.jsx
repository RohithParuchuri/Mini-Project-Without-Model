import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Gavel, Globe } from 'lucide-react';
import { GlowingEffect } from './ui/glowing-effect';
import { cn } from '@/lib/utils';

export default function Stats() {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-20">
      <ul className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <StatItem
          area="md:col-span-4"
          icon={<IndianRupee className="h-4 w-4" />}
          title="Recovered Assets"
          value="₹450 Cr"
          description="Assets tracked and secured through real-time intelligence nodes."
        />

        <StatItem
          area="md:col-span-4"
          icon={<Gavel className="h-4 w-4" />}
          title="Cases Resolved"
          value="15,000+"
          description="Successful resolutions across domestic and international sectors."
        />

        <StatItem
          area="md:col-span-4"
          icon={<Globe className="h-4 w-4" />}
          title="Global Watch"
          value="24/7 Monitoring"
          description="Active intelligence monitoring across 14 jurisdictions worldwide."
        />

      </ul>
    </div>
  );
}

const StatItem = ({ area, icon, title, value, description }) => {
  return (
    <motion.li 
      className={cn("min-h-[14rem] list-none relative group", area)}
      /* SATISFYING HOVER LOGIC:
         - y: -8 (The "Rise"): Provides a clear vertical lift.
         - scale: 1.01 (The "Zoom"): A tiny zoom that feels premium, not 'bouncy'.
      */
      whileHover={{ 
        y: -8, 
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 25 } 
      }}
    >
      {/* OUTER CONTAINER 
          - border-white/[0.03]: Matches background for the stealth look.
          - group-hover:border-white/10: Subtle light-up of the border on hover.
      */}
      <div className="relative h-full rounded-[1.5rem] border border-white/[0.03] bg-[#121212] p-[1px] transition-colors duration-500 group-hover:border-white/10 group-hover:bg-[#161616]">
        
        <GlowingEffect
          spread={60}
          blur={20}
          glow={true}
          disabled={false}
          proximity={100}
          inactiveZone={0.01}
          borderWidth={2}
          movementDuration={1.2}
        />
        
        {/* INNER CONTAINER
            - We keep the padding high (p-8) for a professional, breathable layout.
            - z-10 ensures content stays above the glow effect.
        */}
        <div className="relative z-10 flex h-full flex-col justify-between overflow-hidden rounded-[calc(1.5rem-1px)] bg-inherit p-8">
          <div className="relative flex flex-1 flex-col justify-between gap-6">
            
            {/* Minimal Icon Box */}
            <div className="w-fit rounded-lg border border-white/5 bg-white/[0.03] p-2.5 text-[#F26419] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>
            
            {/* Content Area */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 transition-colors group-hover:text-slate-400">
                {title}
              </h3>
              <p className="text-4xl font-semibold tracking-tight text-[#E6E2DF]">
                {value}
              </p>
              <p className="text-sm text-slate-500 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
};