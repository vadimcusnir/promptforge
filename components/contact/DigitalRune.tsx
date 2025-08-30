"use client";

import { motion } from "framer-motion";

export function DigitalRune() {
  return (
    <div className="text-center">
      {/* 8-Pointed Star */}
      <motion.div
        className="relative w-32 h-32 mx-auto mb-8"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Star points */}
        <div className="absolute inset-0">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 w-1 h-full bg-[var(--pf-gold-500)] transform -translate-x-1/2" />
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--pf-gold-500)] transform -translate-y-1/2" />
          {/* Diagonal lines */}
          <div className="absolute inset-0 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full border-l border-t border-[var(--pf-gold-500)] transform rotate-45 origin-center" />
            <div className="absolute top-0 right-0 w-full h-full border-r border-t border-[var(--pf-gold-500)] transform -rotate-45 origin-center" />
          </div>
        </div>
        
        {/* Center circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-[var(--pf-gold-500)] rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Text */}
      <motion.p
        className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        PromptForge™ operează în afara convențiilor. Răspunsul tău va veni în formă semantică.
      </motion.p>

      {/* Additional decorative elements */}
      <div className="mt-8 flex justify-center space-x-4">
        <motion.div
          className="w-2 h-2 bg-[var(--pf-gold-500)]/50 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-[var(--pf-gold-500)]/50 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-[var(--pf-gold-500)]/50 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>
    </div>
  );
}
