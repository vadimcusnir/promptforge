"use client";

import { motion } from "framer-motion";

export function RitualHero() {
  return (
    <div className="text-center relative">
      {/* Dimensional Gate Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-96 h-96 border-2 border-[var(--pf-gold-500)]/30 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-64 h-64 border border-[var(--pf-gold-500)]/20 rounded-full"
          animate={{
            scale: [1.1, 0.9, 1.1],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute w-32 h-32 border border-[var(--pf-gold-500)]/10 rounded-full"
          animate={{
            scale: [0.9, 1.1, 0.9],
            rotate: [180, 0, 180],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.h1
          className="text-5xl md:text-7xl font-bold font-mono text-[var(--pf-gold-600)] mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Trimite Intenția Ta Semantică
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          Acest formular nu e un simplu contact. E un semnal.
        </motion.p>
      </div>
    </div>
  );
}
