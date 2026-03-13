import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Scale } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Rapid Analysis",
      desc: "Our AI scans transaction patterns instantly, identifying fraudulent nodes before funds disperse further.",
      icon: <Brain className="text-blue-400" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Bank-Grade Security",
      desc: "Your data is encrypted end-to-end. We operate with the same security standards as top-tier financial institutions.",
      icon: <ShieldCheck className="text-purple-400" />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      title: "Legal Integration",
      desc: "Direct automated tie-ins with law enforcement and cyber cells to expedite the filing process.",
      icon: <Scale className="text-emerald-400" />,
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
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
    <section className="py-20 px-4 md:px-10 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#E6E2DF] mb-4">Why Trust CyberGuard?</h2>
          <p className="text-slate-400 text-lg max-w-2xl">We combine empathy with state-of-the-art technology to navigate the complexities of cybercrime resolution.</p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 600, damping: 25 }
              }}
              className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-8 hover:bg-white/[0.08] transition-all backdrop-blur-sm group cursor-pointer"
            >
              <motion.div
                className={`h-12 w-12 rounded-lg ${f.bg} flex items-center justify-center border ${f.border}`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 600, damping: 25 }}
              >
                {f.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-[#E6E2DF]">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}