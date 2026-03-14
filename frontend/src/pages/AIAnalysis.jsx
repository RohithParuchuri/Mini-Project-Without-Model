import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles } from 'lucide-react';

export default function AIAnalysis() {
  return (
    <motion.div
      className="w-full max-w-none flex items-center justify-center min-h-[60vh]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center space-y-8">
        <motion.div
          className="relative inline-block"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#F26419]/20 to-purple-500/20 border border-white/10 flex items-center justify-center mx-auto">
            <BrainCircuit size={48} className="text-[#F26419]" />
          </div>
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={20} className="text-purple-400" />
          </motion.div>
        </motion.div>

        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">AI Analysis</h1>
          <motion.p
            className="text-lg font-bold text-[#F26419] uppercase tracking-[0.3em]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Coming Soon
          </motion.p>
        </div>

        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          Advanced AI-powered crime pattern analysis, predictive threat modeling, and intelligent case
          correlation are currently under development.
        </p>

        <div className="flex items-center justify-center gap-8 pt-4">
          {['Pattern Detection', 'Threat Modeling', 'Auto-Classification'].map((feature, i) => (
            <motion.div
              key={feature}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#F26419]/50" />
              {feature}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}