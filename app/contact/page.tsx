"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/ContactForm";
import { RitualHero } from "@/components/contact/RitualHero";
import { DigitalRune } from "@/components/contact/DigitalRune";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[var(--pf-gold-500)]/20 rotate-45 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-[var(--pf-gold-500)]/30 -rotate-12 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-[var(--pf-gold-500)]/40 rotate-90 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 border border-[var(--pf-gold-500)]/25 -rotate-45 animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <RitualHero />
        
        <div className="mt-16 max-w-4xl mx-auto">
          <ContactForm />
        </div>

        <div className="mt-20 text-center">
          <DigitalRune />
        </div>
      </div>
    </div>
  );
}
