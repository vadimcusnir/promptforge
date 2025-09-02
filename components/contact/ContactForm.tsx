"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// 7D Domains from the project specifications
const SEVEN_D_DOMAINS = [
  "saas",
  "fintech", 
  "ecommerce",
  "consulting",
  "education",
  "healthcare",
  "legal",
  "marketing",
  "media",
  "real_estate",
  "hr",
  "ngo",
  "government",
  "web3",
  "aiml",
  "cybersecurity",
  "manufacturing",
  "logistics",
  "travel",
  "gaming",
  "fashion",
  "beauty",
  "spiritual",
  "architecture",
  "agriculture"
] as const;

const INTENTIONS = [
  "Cerere colaborare",
  "Întrebare sistem", 
  "Ritual de inițiere",
  "Altceva"
] as const;

interface FormData {
  name: string;
  email: string;
  domain: string;
  intention: string;
  message: string;
  acceptTerms: boolean;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    domain: "",
    intention: "",
    message: "",
    acceptTerms: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      if (typeof window !== "undefined" && window.alert) {
        window.alert("Trebuie să accepți termenii pentru a continua.");
      }
      return;
    }

    if (formData.message.length < 150) {
      if (typeof window !== "undefined" && window.alert) {
        window.alert("Mesajul trebuie să aibă cel puțin 150 de caractere.");
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          domain: "",
          intention: "",
          message: "",
          acceptTerms: false,
        });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl mb-6">✨</div>
        <h2 className="text-3xl font-bold text-[var(--pf-gold-600)] mb-4 font-mono">
          Semnalul a fost primit
        </h2>
        <p className="text-xl text-gray-300">
          Așteaptă sincronizarea.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-black/50 backdrop-blur-sm border border-[var(--pf-gold-500)]/30 rounded-lg p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-mono text-[var(--pf-gold-500)] mb-2">
            Cine scrie acest gând?
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full bg-black/50 border border-[var(--pf-gold-500)]/50 rounded px-4 py-3 text-white font-mono focus:border-[var(--pf-gold-500)] focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-mono text-[var(--pf-gold-500)] mb-2">
            Unde trimitem răspunsul ritualic?
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full bg-black/50 border border-[var(--pf-gold-500)]/50 rounded px-4 py-3 text-white font-mono focus:border-[var(--pf-gold-500)] focus:outline-none transition-colors"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Domain Field */}
        <div>
          <label className="block text-sm font-mono text-[var(--pf-gold-500)] mb-2">
            Domeniu
          </label>
          <select
            value={formData.domain}
            onChange={(e) => handleInputChange("domain", e.target.value)}
            className="w-full bg-black/50 border border-[var(--pf-gold-500)]/50 rounded px-4 py-3 text-white font-mono focus:border-[var(--pf-gold-500)] focus:outline-none transition-colors"
            required
          >
            <option value="">Selectează domeniul</option>
            {SEVEN_D_DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Intention Field */}
        <div>
          <label className="block text-sm font-mono text-[var(--pf-gold-500)] mb-2">
            Intenția
          </label>
          <select
            value={formData.intention}
            onChange={(e) => handleInputChange("intention", e.target.value)}
            className="w-full bg-black/50 border border-[var(--pf-gold-500)]/50 rounded px-4 py-3 text-white font-mono focus:border-[var(--pf-gold-500)] focus:outline-none transition-colors"
            required
          >
            <option value="">Selectează intenția</option>
            {INTENTIONS.map((intention) => (
              <option key={intention} value={intention}>
                {intention}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Field */}
      <div className="mb-6">
                  <label className="block text-sm font-mono text-[var(--pf-gold-500)] mb-2">
            Mesajul (min. 150 caractere)
          </label>
                  <textarea
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            rows={6}
            className="w-full bg-black/50 border border-[var(--pf-gold-500)]/50 rounded px-4 py-3 text-white font-mono focus:border-[var(--pf-gold-500)] focus:outline-none transition-colors resize-none"
            placeholder="Descrie intenția ta semantică..."
            required
          />
        <div className="text-right text-sm text-gray-400 mt-2">
          {formData.message.length}/150
        </div>
      </div>

      {/* Checkbox */}
      <div className="mb-8">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
            className="w-5 h-5 border border-[var(--pf-gold-500)]/50 bg-black/50 text-[var(--pf-gold-500)] focus:ring-[var(--pf-gold-500)] focus:ring-2 rounded"
          />
          <span className="text-sm text-gray-300">
            Accept să primesc un răspuns care poate declanșa transformare semantică.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-[var(--pf-gold-500)] text-white font-bold font-mono py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? (
          "Se trimite..."
        ) : (
          <>
            <span className="relative z-10">Trimite către Forjă</span>
            {/* Glitch Effect */}
            <div className="absolute inset-0 bg-[var(--pf-gold-500)] opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </>
        )}
      </motion.button>

      {submitStatus === "error" && (
        <motion.p
          className="text-red-400 text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Eroare la trimiterea semnalului. Încearcă din nou.
        </motion.p>
      )}
    </motion.form>
  );
}
