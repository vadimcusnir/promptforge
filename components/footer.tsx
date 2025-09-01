import Image from "next/image";
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10" role="contentinfo">
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="mb-3 font-semibold">Product</div>
          <ul className="space-y-2" role="list">
            <li>
              <Link href="/generator" className="text-gray-400 hover:text-white">Generator</Link>
            </li>
            <li>
              <Link href="/modules/" className="text-gray-400 hover:text-white">
                Modules
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link>
            </li>
            <li>
              <Link href="/docs/api" className="text-gray-400 hover:text-white">Docs</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold">Docs</div>
          <ul className="space-y-2" role="list">
            <li>
              <Link href="/docs/api" className="text-gray-400 hover:text-white">API Reference</Link>
            </li>
            <li>
              <Link href="/docs" className="text-gray-400 hover:text-white">Guides</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold">Company</div>
          <ul className="space-y-2" role="list">
            <li>
              <Link href="/about" className="text-gray-400 hover:text-white">About</Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold">Legal</div>
          <ul className="space-y-2" role="list">
            <li>
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/legal/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            </li>
            <li>
              <Link href="/legal/dpa" className="text-gray-400 hover:text-white">Data Processing Agreement</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/forge_v3_logo/nav_static_03_loading.webp"
            alt="PromptForge™ Logo"
            width={24}
            height={24}
            className="w-6 h-6 object-contain opacity-60"
          />
          <div className="text-xs text-white/60">
            © 2025 PROMPTFORGE™. All rights reserved. — You don't write prompts. You invoke realities.
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className="px-2.5 py-1 rounded-md border"
            style={{
              borderColor: "var(--pf-gold-500)",
              background: "rgba(199,168,105,.12)",
            }}
          >
            Stripe Verified
          </span>
          <span
            className="px-2.5 py-1 rounded-md border"
            style={{
              borderColor: "var(--pf-gold-500)",
              background: "rgba(199,168,105,.12)",
            }}
          >
            GDPR Compliant
          </span>
        </div>
      </div>
    </footer>
  );
}
