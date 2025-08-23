import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="mb-3 font-semibold">Product</div>
          <ul className="space-y-2">
            <li>
              <Link href="/generator">Generator</Link>
            </li>
            <li>
              <Link href="/modules">Modules</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
            <li>
              <Link href="/docs/api">Docs</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold">Docs</div>
          <ul className="space-y-2">
            <li>
              <Link href="/docs/api">API Reference</Link>
            </li>
            <li>
              <Link href="/docs">Guides</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold">Company</div>
          <ul className="space-y-2">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-semibold">Legal</div>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 pb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/forge_v3_logo/nav_static_03_loading.webp"
            alt="PROMPTFORGE™ Logo"
            width={24}
            height={24}
            className="w-6 h-6 object-contain opacity-60"
          />
          <div className="text-xs text-white/60">
            © 2025 PROMPTFORGE™. All rights reserved. — You dondon'tapos;t write prompts. You
            invoke realities.
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className="px-2.5 py-1 rounded-md border"
            style={{
              borderColor: 'var(--pf-gold-500)',
              background: 'rgba(199,168,105,.12)',
            }}
          >
            Stripe Verified
          </span>
          <span
            className="px-2.5 py-1 rounded-md border"
            style={{
              borderColor: 'var(--pf-gold-500)',
              background: 'rgba(199,168,105,.12)',
            }}
          >
            GDPR Compliant
          </span>
        </div>
      </div>
    </footer>
  );
}
