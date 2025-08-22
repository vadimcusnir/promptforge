"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 border-t border-lead-gray/30 bg-black">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gold-industrial rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                PROMPTFORGE™
              </span>
            </div>
            <p className="text-lead-gray">
              Professional AI prompt generation for modern teams.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <div className="space-y-2 text-lead-gray">
              <Link
                href="/generator"
                className="block hover:text-gold-industrial transition-colors"
              >
                Generator
              </Link>
              <Link
                href="/modules"
                className="block hover:text-gold-industrial transition-colors"
              >
                Modules
              </Link>
              <Link
                href="/dashboard"
                className="block hover:text-gold-industrial transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className="block hover:text-gold-industrial transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <div className="space-y-2 text-lead-gray">
              <Link
                href="/about"
                className="block hover:text-gold-industrial transition-colors"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block hover:text-gold-industrial transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/careers"
                className="block hover:text-gold-industrial transition-colors"
              >
                Careers
              </Link>
              <Link
                href="/contact"
                className="block hover:text-gold-industrial transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <div className="space-y-2 text-lead-gray">
              <Link
                href="/privacy"
                className="block hover:text-gold-industrial transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="block hover:text-gold-industrial transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/gdpr"
                className="block hover:text-gold-industrial transition-colors"
              >
                GDPR Compliance
              </Link>
              <Link
                href="/security"
                className="block hover:text-gold-industrial transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-lead-gray/30">
          <p className="text-lead-gray">
            © 2024 PROMPTFORGE™. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Badge className="bg-gold-industrial/20 text-gold-industrial border-gold-industrial/30">
              <Shield className="w-3 h-3 mr-1" />
              Stripe Verified
            </Badge>
            <Badge className="bg-gold-industrial/20 text-gold-industrial border-gold-industrial/30">
              <Shield className="w-3 h-3 mr-1" />
              GDPR Compliant
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}
