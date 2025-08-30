'use client';

import Link from "next/link";
import { ChevronRight, Scale, Shield, FileText, BookOpen, Mail } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gold-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Legal</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Scale className="w-16 h-16 text-gold-400 " />
              <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-xl " />
            </div>
          </div>
          <h1 className="text-5xl font-bold font-montserrat text-white mb-4">Legal Center</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transparency, compliance, and your rights in the PromptForge ecosystem
          </p>
        </div>

        {/* Legal Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Privacy Policy */}
          <Link href="/legal/privacy" className="group">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-gold-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  Privacy Policy
                </h2>
              </div>
              <p className="text-gray-300 mb-4">
                How we collect, use, and protect your data. Your privacy is our priority.
              </p>
              <div className="flex items-center text-gold-400 group-hover:text-gold-300 transition-colors">
                <span className="text-sm">Read Policy</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Terms of Use */}
          <Link href="/legal/terms" className="group">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-gold-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  Terms of Use
                </h2>
              </div>
              <p className="text-gray-300 mb-4">
                Your rights, responsibilities, and the rules governing PromptForge usage.
              </p>
              <div className="flex items-center text-gold-400 group-hover:text-gold-300 transition-colors">
                <span className="text-sm">Read Terms</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* License Information */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center mb-4">
              <BookOpen className="w-8 h-8 text-gold-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">License Information</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Understanding your export rights and license notices based on your plan.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                <span>Free/Trial: Limited exports with watermarks</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                <span>Pro: Full exports with standard licensing</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                <span>Enterprise: Commercial use with white-label options</span>
              </div>
            </div>
          </div>

          {/* Security Policy */}
          <Link href="/legal/security" className="group">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-gold-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  Security Policy
                </h2>
              </div>
              <p className="text-gray-300 mb-4">
                Our security measures, infrastructure protection, and compliance certifications.
              </p>
              <div className="flex items-center text-gold-400 group-hover:text-gold-300 transition-colors">
                <span className="text-sm">View Security</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* GDPR Compliance */}
          <Link href="/legal/gdpr" className="group">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-gold-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  GDPR Compliance
                </h2>
              </div>
              <p className="text-gray-300 mb-4">
                Your data protection rights under the General Data Protection Regulation.
              </p>
              <div className="flex items-center text-gold-400 group-hover:text-gold-300 transition-colors">
                <span className="text-sm">View GDPR</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Data Processing Agreement */}
          <Link href="/legal/dpa" className="group">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 hover:border-gold-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-gold-400 mr-3" />
                <h2 className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">
                  Data Processing Agreement
                </h2>
              </div>
              <p className="text-gray-300 mb-4">
                Enterprise GDPR compliance and data processing safeguards for your organization.
              </p>
              <div className="flex items-center text-gold-400 group-hover:text-gold-300 transition-colors">
                <span className="text-sm">View DPA</span>
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Contact Legal */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="flex items-center mb-4">
              <Mail className="w-8 h-8 text-gold-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Legal Contact</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Questions about our legal documents or need clarification?
            </p>
            <a
              href="mailto:legal@[EXAMPLE_DOMAIN_yourdomain.com]"
              className="inline-flex items-center text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              legal@[EXAMPLE_DOMAIN_yourdomain.com]
            </a>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-gold-400 mb-4">Export & Licensing</h3>
            <p className="text-gray-300 mb-4">
              All exports include appropriate license notices and watermarks based on your subscription plan. 
              Trial users will see "TRIAL — Not for Redistribution" watermarks on PDF exports.
            </p>
            <div className="text-sm text-gray-400">
              <p>Last updated: January 2025</p>
              <p>Compliant with GDPR, CCPA, and international data protection regulations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
