import React from 'react';
import { motion } from 'framer-motion';
import { Search, Lock } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" }
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-10 min-h-[75vh]">
      {/* Animated Glowing Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[120px]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 flex flex-col items-center max-w-4xl text-center gap-8"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-slate-400 backdrop-blur-md"
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          Live Intelligence Grid Active
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-[#E6E2DF] text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight"
        >
          Justice, Accelerated <br />
          by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">Intelligence.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-slate-400 text-lg md:text-xl font-normal max-w-2xl leading-relaxed opacity-80"
        >
          Calm, AI-driven recovery for digital crimes. We analyze patterns to restore your peace of mind.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl mt-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 600, damping: 25 }}
        >
          <div className="group relative flex h-16 w-full items-center rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-primary/50">
            <div className="flex h-full w-12 items-center justify-center text-slate-500">
              <Search size={18} />
            </div>
            <input
              className="h-full flex-1 bg-transparent px-2 text-base text-white placeholder:text-slate-600 focus:outline-none"
              placeholder="Tell us what happened (e.g., I lost money on UPI)..."
            />
            <motion.button
              className="h-full rounded-xl bg-primary px-8 text-sm font-bold text-white transition-all hover:bg-primary-dark active:scale-95"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
            >
              Analyze Case
            </motion.button>
          </div>
          <motion.p
            className="mt-4 text-[11px] text-slate-500 flex items-center justify-center gap-2 tracking-wide uppercase font-medium opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Lock size={12} /> Encrypted & Anonymous Analysis
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}